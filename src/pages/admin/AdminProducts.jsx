import { useState } from 'react'
import { CATEGORIAS } from '../../config'
import { brl, precoFinal, useLoja } from '../../store/StoreContext'
import Drawer from '../../components/Drawer'
import ProductArt from '../../components/ProductArt'
import { Lixo, Mais } from '../../components/Icons'

const TIPOS = [
  'batom',
  'gloss',
  'paleta',
  'base',
  'mascara',
  'blush',
  'po',
  'pincel',
  'delineador',
  'serum',
  'creme'
]

const VAZIO = {
  nome: '',
  marca: 'Aura',
  categoria: 'pele',
  tipo: 'base',
  tom: '#C2847A',
  preco: 0,
  desconto: 0,
  estoque: 0,
  selo: '',
  image: '',
  descricao: ''
}

function Formulario({ dados, setDados }) {
  const set = (campo) => (e) => {
    const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setDados((d) => ({ ...d, [campo]: v }))
  }

  return (
    <div className="space-y-4">
      <div className="mx-auto h-44 w-36 overflow-hidden rounded-xl2 border border-clay/60 bg-sand">
        <ProductArt produto={dados} />
      </div>

      <div>
        <label className="label">Nome do produto</label>
        <input className="field" value={dados.nome} onChange={set('nome')} placeholder="Batom Matte Veludo" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Marca</label>
          <input className="field" value={dados.marca} onChange={set('marca')} />
        </div>
        <div>
          <label className="label">Selo</label>
          <select className="field" value={dados.selo} onChange={set('selo')}>
            <option value="">Nenhum</option>
            <option value="Novo">Novo</option>
            <option value="Mais vendido">Mais vendido</option>
            <option value="Últimas unidades">Últimas unidades</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Categoria</label>
          <select className="field" value={dados.categoria} onChange={set('categoria')}>
            {CATEGORIAS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tipo (ilustração)</label>
          <select className="field" value={dados.tipo} onChange={set('tipo')}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Preço</label>
          <input type="number" step="0.01" min="0" className="field" value={dados.preco} onChange={set('preco')} />
        </div>
        <div>
          <label className="label">Desc. %</label>
          <input type="number" min="0" max="90" className="field" value={dados.desconto} onChange={set('desconto')} />
        </div>
        <div>
          <label className="label">Estoque</label>
          <input type="number" min="0" className="field" value={dados.estoque} onChange={set('estoque')} />
        </div>
      </div>

      <div>
        <label className="label">Cor do produto</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={dados.tom}
            onChange={set('tom')}
            className="h-11 w-16 cursor-pointer rounded-xl border border-clay bg-white p-1"
          />
          <input className="field" value={dados.tom} onChange={set('tom')} />
        </div>
      </div>

      <div>
        <label className="label">Foto real (opcional)</label>
        <input
          className="field"
          value={dados.image}
          onChange={set('image')}
          placeholder="https://... ou fotos/batom.webp"
        />
        <p className="mt-1.5 text-[11px] text-mute">
          Com a foto preenchida, ela substitui a ilustração na vitrine.
        </p>
      </div>

      <div>
        <label className="label">Descrição</label>
        <textarea rows="4" className="field resize-none" value={dados.descricao} onChange={set('descricao')} />
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { produtos, criarProduto, atualizarProduto, removerProduto } = useLoja()
  const [editando, setEditando] = useState(null)
  const [novo, setNovo] = useState(false)
  const [rascunho, setRascunho] = useState(VAZIO)
  const [busca, setBusca] = useState('')

  const lista = produtos.filter((p) =>
    `${p.nome} ${p.marca}`.toLowerCase().includes(busca.toLowerCase().trim())
  )

  const abrirNovo = () => {
    setRascunho(VAZIO)
    setNovo(true)
  }

  const salvarNovo = () => {
    if (!rascunho.nome.trim()) return
    criarProduto(rascunho)
    setNovo(false)
  }

  const abrirEdicao = (p) => {
    setRascunho(p)
    setEditando(p.id)
  }

  const salvarEdicao = () => {
    atualizarProduto(editando, rascunho)
    setEditando(null)
  }

  const excluir = () => {
    if (confirm('Excluir este produto definitivamente?')) {
      removerProduto(editando)
      setEditando(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Produtos &amp; estoque</h1>
          <p className="mt-1 text-sm text-mute">
            {produtos.length} itens cadastrados. Estoque zero vira “Esgotado” na vitrine
            automaticamente.
          </p>
        </div>
        <button onClick={abrirNovo} className="btn-dark">
          <Mais size={16} /> Adicionar produto
        </button>
      </div>

      <input
        className="field max-w-sm"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou marca..."
      />

      <div className="card overflow-hidden">
        {/* cabeçalho só em telas grandes */}
        <div className="hidden grid-cols-[48px_1fr_120px_110px_90px_110px] gap-4 border-b border-clay/70 px-5 py-3 text-[11px] uppercase tracking-wider text-mute lg:grid">
          <span />
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span>Estoque</span>
          <span>Status</span>
        </div>

        <ul className="divide-y divide-clay/60">
          {lista.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => abrirEdicao(p)}
                className="grid w-full grid-cols-[48px_1fr_auto] items-center gap-4 px-5 py-3.5 text-left transition hover:bg-sand/50 lg:grid-cols-[48px_1fr_120px_110px_90px_110px]"
              >
                <div className="h-12 w-12 overflow-hidden rounded-lg border border-clay/60 bg-sand">
                  <ProductArt produto={p} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm">{p.nome}</p>
                  <p className="text-xs text-mute lg:hidden">
                    {brl(precoFinal(p))} · {p.estoque} un.
                  </p>
                  <p className="hidden text-xs text-mute lg:block">{p.marca}</p>
                </div>

                <span className="hidden text-sm capitalize text-mute lg:block">{p.categoria}</span>

                <span className="hidden text-sm lg:block">
                  {brl(precoFinal(p))}
                  {p.desconto > 0 && (
                    <span className="ml-1 text-xs text-mute line-through">{brl(p.preco)}</span>
                  )}
                </span>

                <span className="hidden text-sm tabular-nums lg:block">{p.estoque}</span>

                <span
                  className={`chip justify-self-end lg:justify-self-start ${
                    p.estoque === 0
                      ? 'bg-rose/15 text-rosedeep'
                      : p.estoque <= 5
                        ? 'bg-gold/20 text-ink'
                        : 'bg-sand text-mute'
                  }`}
                >
                  {p.estoque === 0 ? 'Esgotado' : p.estoque <= 5 ? 'Acabando' : 'Ativo'}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {lista.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-mute">Nenhum produto encontrado.</p>
        )}
      </div>

      {/* gaveta: novo */}
      <Drawer
        aberto={novo}
        aoFechar={() => setNovo(false)}
        titulo="Novo produto"
        rodape={
          <button onClick={salvarNovo} className="btn-dark w-full" disabled={!rascunho.nome.trim()}>
            Cadastrar produto
          </button>
        }
      >
        <Formulario dados={rascunho} setDados={setRascunho} />
      </Drawer>

      {/* gaveta: edição rápida */}
      <Drawer
        aberto={!!editando}
        aoFechar={() => setEditando(null)}
        titulo="Editar produto"
        rodape={
          <div className="flex gap-3">
            <button onClick={excluir} className="btn-ghost px-4 text-rosedeep" title="Excluir">
              <Lixo size={16} />
            </button>
            <button onClick={salvarEdicao} className="btn-dark flex-1">
              Salvar alterações
            </button>
          </div>
        }
      >
        <Formulario dados={rascunho} setDados={setRascunho} />
      </Drawer>
    </div>
  )
}
