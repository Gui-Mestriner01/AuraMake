import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORIAS, STORE } from '../config'
import {
  avaliacoesDe,
  brl,
  esgotado,
  mediaDe,
  parcelamento,
  precoFinal,
  temTom,
  useLoja
} from '../store/StoreContext'
import useTitulo from '../hooks/useTitulo'
import { abrirWhats, linkWhats } from '../whatsapp'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import Estrelas from '../components/Estrelas'
import Tom from '../components/Tom'
import {
  Caminhao,
  Check,
  Compartilhar,
  Coracao,
  CoracaoCheio,
  Escudo,
  Mais,
  Menos,
  Relogio,
  Sacola,
  Whats
} from '../components/Icons'
import NotFound from './NotFound'

/* ------------------------------------------------------------------ */
/* "Avise-me quando chegar" — o contato vai para o Netlify Forms       */
/* ------------------------------------------------------------------ */

function AviseMe({ produto }) {
  const [nome, setNome] = useState('')
  const [fone, setFone] = useState('')
  const [estado, setEstado] = useState('') // '' | 'enviando' | 'ok'
  const [erro, setErro] = useState('')

  const pedirPeloWhats = () =>
    abrirWhats(
      `Olá! 😊 Vi no site da *${STORE.nome}* que o *${produto.nome}* está esgotado.\n\n` +
        'Pode me avisar quando ele voltar? Fico no aguardo! 💕'
    )

  const enviar = async (e) => {
    e.preventDefault()
    if (fone.replace(/\D/g, '').length < 10) {
      setErro('Digite o WhatsApp com DDD, por exemplo (18) 99999-0000.')
      return
    }
    setEstado('enviando')
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'avise-me',
          produto: `${produto.nome} (${produto.id})`,
          nome,
          whatsapp: fone
        }).toString()
      })
      if (!r.ok) throw new Error(String(r.status))
      setEstado('ok')
    } catch {
      // sem formulário disponível (ex.: rodando local): cai para a mensagem no WhatsApp
      setEstado('')
      pedirPeloWhats()
    }
  }

  if (estado === 'ok') {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-pink/30 bg-white px-4 py-4 text-sm">
        <Check size={18} className="mt-0.5 shrink-0 text-pink" />
        <p>
          Anotado! Avisamos no seu WhatsApp assim que o <strong className="font-medium">{produto.nome}</strong> chegar.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="mt-6 rounded-xl border border-clay bg-white p-4">
      <p className="text-sm font-medium">Avise-me quando chegar</p>
      <p className="mt-1 text-[13px] text-mute">Deixe seu WhatsApp e mandamos uma mensagem quando voltar ao estoque.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          autoComplete="given-name"
          aria-label="Seu nome"
          className="field text-base sm:text-sm"
        />
        <input
          value={fone}
          onChange={(e) => {
            setFone(e.target.value)
            setErro('')
          }}
          type="tel"
          inputMode="tel"
          placeholder="WhatsApp com DDD"
          autoComplete="tel"
          required
          aria-label="Seu WhatsApp com DDD"
          aria-invalid={!!erro}
          className={`field text-base sm:text-sm ${erro ? 'border-pinkdeep' : ''}`}
        />
      </div>
      {erro && <p className="mt-1.5 text-xs text-pinkdeep">{erro}</p>}
      <button type="submit" disabled={estado === 'enviando'} className="btn-rose mt-3 w-full disabled:opacity-60">
        {estado === 'enviando' ? 'Enviando…' : 'Avisar quando chegar'}
      </button>
      <button type="button" onClick={pedirPeloWhats} className="mt-2.5 w-full text-center text-xs text-mute hover:text-pink">
        Prefiro pedir direto pelo WhatsApp
      </button>
    </form>
  )
}

/* ------------------------------------------------------------------ */

export default function Product() {
  const { id } = useParams()
  const { produtos, carrinho, addCarrinho, alternarFavorito, ehFavorito, abrirSacola, avisar } = useLoja()
  const p = produtos.find((x) => x.id === id)
  const [foto, setFoto] = useState(0)
  const [qtd, setQtd] = useState(1)

  useEffect(() => {
    setFoto(0)
    setQtd(1)
  }, [id])

  useTitulo(p?.nome ?? 'Produto não encontrado')

  if (!p) return <NotFound produto />

  const fora = esgotado(p)
  const fim = precoFinal(p)
  const off = (p.desconto || 0) > 0
  const fav = ehFavorito(p.id)
  const parcela = parcelamento(fim)
  const categoria = CATEGORIAS.find((c) => c.slug === p.categoria)
  const media = mediaDe(p.id)
  const avaliacoes = avaliacoesDe(p.id)
  const naSacola = carrinho.find((i) => i.id === p.id)?.qtd ?? 0
  const maximo = Math.max(0, p.estoque - naSacola)
  const fotos = p.imagens?.length ? p.imagens : [null]

  const relacionados = produtos
    .filter((x) => x.id !== p.id && x.categoria === p.categoria)
    .concat(produtos.filter((x) => x.id !== p.id && x.categoria !== p.categoria && (x.desconto > 0 || x.selo)))
    .filter((x) => !esgotado(x))
    .slice(0, 4)

  const adicionar = () => {
    if (addCarrinho(p.id, qtd) > 0) {
      setQtd(1)
      abrirSacola()
    } else {
      avisar('Você já tem na sacola todas as unidades disponíveis', { sacola: true })
    }
  }

  const compartilhar = async () => {
    const url = `${window.location.origin}/produto/${p.id}`
    try {
      if (navigator.share) await navigator.share({ title: p.nome, text: `${p.nome} na ${STORE.nome}`, url })
      else {
        await navigator.clipboard.writeText(url)
        avisar('Link do produto copiado')
      }
    } catch {
      /* a pessoa fechou o compartilhamento */
    }
  }

  const duvida = linkWhats(
    `Olá! Estou vendo o *${p.nome}* no site da *${STORE.nome}* e queria tirar uma dúvida 😊\n${window.location.origin}/produto/${p.id}`
  )

  return (
    <>
      <div className="wrap pb-16 pt-5 sm:pt-8">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-x-2 text-xs text-mute">
          <Link to="/loja" className="hover:text-pink">
            Loja
          </Link>
          <span aria-hidden>/</span>
          {categoria && (
            <>
              <Link to={`/loja?cat=${categoria.slug}`} className="hover:text-pink">
                {categoria.nome}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="truncate text-ink/70">{p.nome}</span>
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* fotos */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-blush">
              <ProductArt
                key={foto}
                produto={p}
                indice={foto}
                prioridade
                className={`animate-fade-in ${fora ? 'opacity-60 grayscale-[.4]' : ''}`}
              />
              {(fora || off) && (
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium ${
                    fora ? 'bg-white/90 text-mute' : 'bg-laranja text-white'
                  }`}
                >
                  {fora ? 'Esgotado' : `-${p.desconto}%`}
                </span>
              )}
            </div>
            {fotos.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFoto(i)}
                    aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                    aria-pressed={foto === i}
                    className={`h-16 w-16 overflow-hidden rounded-md bg-blush ring-offset-2 ring-offset-cream transition sm:h-20 sm:w-20 ${
                      foto === i ? 'ring-2 ring-pink' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductArt produto={p} indice={i} prioridade />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* informações */}
          <div className="md:py-2">
            <p className="text-[13px] text-mute">{p.marca}</p>
            <h1 className="mt-1.5 font-display text-[2rem] font-light leading-[1.1] tracking-[-0.015em] sm:text-[2.6rem]">
              {p.nome}
            </h1>

            {media && (
              <a href="#avaliacoes" className="mt-3 inline-flex items-center gap-2 text-[13px] text-mute hover:text-pink">
                <Estrelas nota={media.nota} size={14} />
                {media.nota.toFixed(1).replace('.', ',')} ({media.total} {media.total === 1 ? 'avaliação' : 'avaliações'})
              </a>
            )}

            {temTom(p) && (
              <p className="mt-5 inline-flex items-center gap-3 rounded-full border border-clay bg-white py-1.5 pl-1.5 pr-4 text-sm">
                <Tom cor={p.tom} size={30} />
                <span>
                  <span className="text-mute">Tom:</span> {p.tomNome || p.tom.toUpperCase()}
                </span>
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className={`text-[1.9rem] font-semibold leading-none ${fora ? 'text-mute' : 'text-ink'}`}>{brl(fim)}</span>
              {off && !fora && <span className="text-base text-mute line-through">{brl(p.preco)}</span>}
            </div>
            {!fora && (
              <p className="mt-2 text-sm text-ink/70">
                {parcela ? (
                  <>
                    ou <strong className="font-medium text-ink">{parcela.vezes}x de {brl(parcela.valor)}</strong> sem juros no cartão
                  </>
                ) : (
                  'No Pix, cartão ou dinheiro'
                )}
              </p>
            )}

            {p.descricao && <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink/70">{p.descricao}</p>}

            {fora ? (
              <AviseMe produto={p} />
            ) : (
              <>
                <div className="mt-7 flex items-stretch gap-3">
                  <div className="flex items-center rounded-full border border-clay bg-white" role="group" aria-label="Quantidade">
                    <button
                      onClick={() => setQtd((q) => Math.max(1, q - 1))}
                      disabled={qtd <= 1}
                      className="flex h-12 w-11 items-center justify-center text-ink/70 hover:text-ink disabled:opacity-30"
                      aria-label="Diminuir quantidade"
                    >
                      <Menos size={16} />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                      {qtd}
                    </span>
                    <button
                      onClick={() => setQtd((q) => Math.min(maximo, q + 1))}
                      disabled={qtd >= maximo}
                      className="flex h-12 w-11 items-center justify-center text-ink/70 hover:text-ink disabled:opacity-30"
                      aria-label="Aumentar quantidade"
                    >
                      <Mais size={16} />
                    </button>
                  </div>
                  <button
                    onClick={adicionar}
                    disabled={maximo === 0}
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-pink px-6 text-[15px] font-medium text-white transition hover:bg-pinkdeep active:scale-[.99] disabled:bg-clay disabled:text-mute"
                  >
                    <Sacola size={19} />
                    {maximo === 0 ? 'Tudo na sua sacola' : 'Adicionar à sacola'}
                  </button>
                </div>
                <p className={`mt-2.5 text-[13px] ${p.estoque <= 5 ? 'text-laranja' : 'text-mute'}`}>
                  {p.estoque <= 5
                    ? p.estoque === 1
                      ? 'Última unidade'
                      : `Últimas ${p.estoque} unidades`
                    : 'Em estoque, pronta entrega'}
                  {naSacola > 0 && <span className="text-mute"> ({naSacola} na sua sacola)</span>}
                </p>
              </>
            )}

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <button
                onClick={() => alternarFavorito(p.id)}
                aria-pressed={fav}
                className={`flex items-center gap-2 py-2 transition ${fav ? 'text-pink' : 'text-ink/75 hover:text-pink'}`}
              >
                {fav ? <CoracaoCheio size={18} /> : <Coracao size={18} />}
                {fav ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
              </button>
              <button onClick={compartilhar} className="flex items-center gap-2 py-2 text-ink/75 transition hover:text-pink">
                <Compartilhar size={18} /> Compartilhar
              </button>
              <a href={duvida} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 text-ink/75 transition hover:text-pink">
                <Whats size={18} /> Tirar dúvida
              </a>
            </div>

            <ul className="mt-6 space-y-3.5 border-t border-clay/70 pt-6 text-[13.5px] text-ink/75">
              <li className="flex gap-3">
                <Caminhao size={19} className="mt-px shrink-0 text-pink" />
                <span>
                  Entrega em {STORE.regiao} ou envio para todo o Brasil. Frete grátis acima de {brl(STORE.freteGratisAcima)}.{' '}
                  <Link to="/ajuda#entrega" className="text-pink underline-offset-2 hover:underline">
                    Ver prazos
                  </Link>
                </span>
              </li>
              <li className="flex gap-3">
                <Relogio size={19} className="mt-px shrink-0 text-pink" />
                <span>
                  7 dias para desistir da compra.{' '}
                  <Link to="/ajuda#trocas" className="text-pink underline-offset-2 hover:underline">
                    Como trocar
                  </Link>
                </span>
              </li>
              <li className="flex gap-3">
                <Escudo size={19} className="mt-px shrink-0 text-pink" />
                <span>Produto original e lacrado.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* avaliações */}
        <section id="avaliacoes" className="mt-16 scroll-mt-28 border-t border-clay/70 pt-12">
          <h2 className="font-display text-[1.7rem] font-light sm:text-[2rem]">O que as clientes dizem</h2>
          {avaliacoes.length === 0 ? (
            <div className="mt-5 flex flex-col items-start gap-4 rounded-xl bg-blush px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[48ch] text-sm leading-relaxed text-ink/75">
                Este produto ainda não tem avaliações. Já usou? Conte como foi: seu depoimento ajuda quem está
                escolhendo.
              </p>
              <a
                href={linkWhats(`Olá! Quero deixar minha avaliação do *${p.nome}* 💕`)}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost shrink-0 text-xs"
              >
                <Whats size={16} /> Enviar avaliação
              </a>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {avaliacoes.map((a, i) => (
                <li key={i} className="rounded-xl border border-clay/70 bg-white p-5">
                  <Estrelas nota={a.nota} size={14} />
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">“{a.texto}”</p>
                  <p className="mt-4 text-[13px] text-mute">
                    <span className="font-medium text-ink">{a.nome}</span>
                    {a.cidade && `, ${a.cidade}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-16 border-t border-clay/70 pt-12">
            <h2 className="font-display text-[1.7rem] font-light sm:text-[2rem]">Combina com este</h2>
            <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {relacionados.map((r) => (
                <ProductCard key={r.id} produto={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
