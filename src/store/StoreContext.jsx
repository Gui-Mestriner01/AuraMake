import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SEED_PRODUCTS } from '../data/products'
import { AVALIACOES } from '../data/avaliacoes'
import { STORE } from '../config'

// v3: descarta sacolas e dados de teste guardados pelas versões anteriores
const KEY = 'aura:loja:v3'
const Ctx = createContext(null)

/** Produtos salvos em versões antigas tinham `image` (uma foto só): converte para `imagens[]`. */
const normalizar = (p) => {
  const { image, ...resto } = p
  const imagens = Array.isArray(p.imagens) ? p.imagens.filter(Boolean) : image ? [image] : []
  const semente = SEED_PRODUCTS.find((s) => s.id === p.id)
  return { tomNome: semente?.tomNome ?? '', ...resto, imagens }
}

function carregar() {
  try {
    const bruto = localStorage.getItem(KEY)
    if (!bruto) return null
    const dados = JSON.parse(bruto)
    if (!Array.isArray(dados.produtos)) return null
    return { ...dados, produtos: dados.produtos.map(normalizar) }
  } catch {
    return null
  }
}

const uid = (p) => p + Math.random().toString(36).slice(2, 9)

export function StoreProvider({ children }) {
  const inicial = useMemo(carregar, [])
  const [produtos, setProdutos] = useState(inicial?.produtos ?? SEED_PRODUCTS)
  const [vendas, setVendas] = useState(inicial?.vendas ?? [])
  const [carrinho, setCarrinho] = useState(inicial?.carrinho ?? [])
  const [favoritos, setFavoritos] = useState(inicial?.favoritos ?? [])
  const [logado, setLogado] = useState(() => sessionStorage.getItem('aura:admin') === '1')

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ produtos, vendas, carrinho, favoritos }))
    } catch {
      /* quota cheia — segue sem persistir */
    }
  }, [produtos, vendas, carrinho, favoritos])

  /* ---------- interface: sacola e avisos (toast) ---------- */
  const [sacolaAberta, setSacolaAberta] = useState(false)
  const abrirSacola = useCallback(() => setSacolaAberta(true), [])
  const fecharSacola = useCallback(() => setSacolaAberta(false), [])

  // produto aberto no pop-up (cartão centralizado)
  const [produtoAbertoId, setProdutoAbertoId] = useState(null)
  const abrirProduto = useCallback((id) => setProdutoAbertoId(id), [])
  const fecharProduto = useCallback(() => setProdutoAbertoId(null), [])

  const [toast, setToast] = useState(null)
  const relogio = useRef(null)
  const fecharToast = useCallback(() => {
    clearTimeout(relogio.current)
    setToast(null)
  }, [])
  /** avisar('Texto') ou avisar('Texto', { sacola: true }) para mostrar o atalho "Ver sacola". */
  const avisar = useCallback((texto, opcoes = {}) => {
    clearTimeout(relogio.current)
    setToast({ id: Date.now(), texto, ...opcoes })
    relogio.current = setTimeout(() => setToast(null), 3600)
  }, [])

  /* ---------- produtos ---------- */
  const criarProduto = (dados) =>
    setProdutos((lista) => [
      {
        id: uid('p'),
        nome: '',
        marca: 'Aura',
        categoria: 'pele',
        tipo: 'base',
        tom: '#C2847A',
        tomNome: '',
        preco: 0,
        desconto: 0,
        estoque: 0,
        selo: '',
        imagens: [],
        descricao: '',
        ...dados
      },
      ...lista
    ])

  const atualizarProduto = (id, dados) =>
    setProdutos((lista) => lista.map((p) => (p.id === id ? { ...p, ...dados } : p)))

  const removerProduto = (id) => {
    setProdutos((lista) => lista.filter((p) => p.id !== id))
    setCarrinho((c) => c.filter((i) => i.id !== id))
    setFavoritos((f) => f.filter((x) => x !== id))
  }

  const aplicarDesconto = (ids, porcentagem) =>
    setProdutos((lista) =>
      lista.map((p) => (ids.includes(p.id) ? { ...p, desconto: Number(porcentagem) || 0 } : p))
    )

  /* ---------- carrinho ---------- */
  /** Adiciona à sacola respeitando o estoque. Devolve quantas unidades entraram de fato. */
  const addCarrinho = (id, qtd = 1) => {
    const prod = produtos.find((p) => p.id === id)
    if (!prod || prod.estoque <= 0) return 0
    const atual = carrinho.find((i) => i.id === id)?.qtd ?? 0
    const nova = Math.min(atual + qtd, prod.estoque)
    if (nova <= atual) return 0
    setCarrinho((c) =>
      c.some((i) => i.id === id) ? c.map((i) => (i.id === id ? { ...i, qtd: nova } : i)) : [...c, { id, qtd: nova }]
    )
    return nova - atual
  }

  const mudarQtd = (id, qtd) =>
    setCarrinho((c) =>
      qtd <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qtd } : i))
    )

  const limparCarrinho = () => setCarrinho([])

  /* ---------- favoritos ---------- */
  const alternarFavorito = (id) =>
    setFavoritos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  const ehFavorito = (id) => favoritos.includes(id)

  /* ---------- vendas ---------- */
  const registrarVenda = (venda) => {
    const nova = { id: uid('v'), data: new Date().toISOString(), ...venda }
    setVendas((v) => [nova, ...v])
    // baixa no estoque
    setProdutos((lista) =>
      lista.map((p) => {
        const item = nova.itens.find((i) => i.id === p.id)
        return item ? { ...p, estoque: Math.max(0, p.estoque - item.qtd) } : p
      })
    )
    return nova
  }

  const mudarStatusVenda = (id, status) =>
    setVendas((v) => v.map((x) => (x.id === id ? { ...x, status } : x)))

  const removerVenda = (id) => setVendas((v) => v.filter((x) => x.id !== id))

  /* ---------- auth simples do painel ---------- */
  const entrar = () => {
    sessionStorage.setItem('aura:admin', '1')
    setLogado(true)
  }
  const sair = () => {
    sessionStorage.removeItem('aura:admin')
    setLogado(false)
  }

  const resetarDemo = () => {
    setProdutos(SEED_PRODUCTS)
    setVendas([])
    setCarrinho([])
    setFavoritos([])
  }

  const itensCarrinho = useMemo(
    () =>
      carrinho
        .map((i) => {
          const p = produtos.find((x) => x.id === i.id)
          return p ? { ...p, qtd: i.qtd, precoFinal: precoFinal(p) } : null
        })
        .filter(Boolean),
    [carrinho, produtos]
  )

  const totalCarrinho = itensCarrinho.reduce((s, i) => s + i.precoFinal * i.qtd, 0)
  const qtdCarrinho = itensCarrinho.reduce((s, i) => s + i.qtd, 0)

  const valor = {
    produtos,
    vendas,
    carrinho,
    itensCarrinho,
    totalCarrinho,
    qtdCarrinho,
    criarProduto,
    atualizarProduto,
    removerProduto,
    aplicarDesconto,
    addCarrinho,
    mudarQtd,
    limparCarrinho,
    favoritos,
    alternarFavorito,
    ehFavorito,
    registrarVenda,
    mudarStatusVenda,
    removerVenda,
    logado,
    entrar,
    sair,
    resetarDemo,
    sacolaAberta,
    abrirSacola,
    fecharSacola,
    produtoAbertoId,
    abrirProduto,
    fecharProduto,
    toast,
    avisar,
    fecharToast
  }

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export const useLoja = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLoja precisa estar dentro de <StoreProvider>')
  return ctx
}

/* ---------- helpers ---------- */
export const precoFinal = (p) => Number((p.preco * (1 - (p.desconto || 0) / 100)).toFixed(2))
export const esgotado = (p) => (p.estoque ?? 0) <= 0
export const brl = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const dataCurta = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
export const mesmoDia = (iso, ref = new Date()) => {
  const d = new Date(iso)
  return (
    d.getDate() === ref.getDate() &&
    d.getMonth() === ref.getMonth() &&
    d.getFullYear() === ref.getFullYear()
  )
}

/** 'fotos/batom.webp' → '/fotos/batom.webp' (URLs completas passam direto). */
export const urlImagem = (src) => (!src || /^(https?:|data:|blob:|\/)/.test(src) ? src : `/${src}`)

/** Texto sem acento e em minúsculas, para a busca achar "labios" em "Lábios". */
export const semAcento = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** { vezes, valor } quando o preço dá direito a parcelar; senão null. */
export const parcelamento = (preco) =>
  STORE.parcelas > 1 && preco >= STORE.parcelaAPartirDe
    ? { vezes: STORE.parcelas, valor: Number((preco / STORE.parcelas).toFixed(2)) }
    : null

/** Só maquiagem de cor mostra a bolinha de tom (pincel e skincare não têm "tom"). */
export const temTom = (p) => !!p.tom && ['pele', 'olhos', 'labios'].includes(p.categoria)

/** Avaliações de um produto e a média delas. */
export const avaliacoesDe = (id) => AVALIACOES.filter((a) => a.produto === id)
export const mediaDe = (id) => {
  const lista = avaliacoesDe(id)
  if (!lista.length) return null
  return { nota: lista.reduce((s, a) => s + a.nota, 0) / lista.length, total: lista.length }
}
