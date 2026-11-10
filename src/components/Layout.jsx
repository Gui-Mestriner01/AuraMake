import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIAS, PAGAMENTOS, STORE } from '../config'
import { brl, precoFinal, semAcento, useLoja } from '../store/StoreContext'
import { Asterisco, Coracao, Instagram, Lupa, Menu, Sacola, Whats, X } from './Icons'
import CartDrawer from './CartDrawer'
import ProductArt from './ProductArt'
import Toast from './Toast'
import { linkWhats, telefoneFormatado } from '../whatsapp'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Início' },
  { to: '/loja?grupo=maquiagem', label: 'Maquiagem' },
  { to: '/loja?cat=skincare', label: 'Skincare' },
  { to: '/loja?novidades=1', label: 'Lançamentos' },
  { to: '/loja?sale=1', label: 'Sale', destaque: true }
]

const nomeCategoria = (p) => CATEGORIAS.find((c) => c.slug === p.categoria)?.nome ?? ''

/** Busca do cabeçalho: mostra os produtos enquanto a pessoa digita. */
function Busca({ aberta, fechar }) {
  const { produtos } = useLoja()
  const [termo, setTermo] = useState('')
  const nav = useNavigate()

  const q = semAcento(termo.trim())
  const achados = useMemo(
    () =>
      q.length < 2
        ? []
        : produtos.filter((p) =>
            semAcento([p.nome, p.marca, p.tomNome, nomeCategoria(p), p.descricao].join(' ')).includes(q)
          ),
    [q, produtos]
  )

  useEffect(() => {
    if (!aberta) return
    const esc = (e) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberta, fechar])

  if (!aberta) return null

  const sair = () => {
    setTermo('')
    fechar()
  }

  const enviar = (e) => {
    e.preventDefault()
    if (!termo.trim()) return
    nav(`/loja?q=${encodeURIComponent(termo.trim())}`)
    sair()
  }

  return (
    <div className="border-t border-clay/70 bg-white">
      <form onSubmit={enviar} className="wrap flex items-center gap-3 py-3.5" role="search">
        <Lupa className="shrink-0 text-pink" />
        <input
          autoFocus
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Batom, sérum, pincel…"
          aria-label="Buscar produtos"
          className="w-full bg-transparent py-1 text-base outline-none placeholder:text-mute/60"
        />
        <button type="button" onClick={sair} className="p-1 text-mute hover:text-ink" aria-label="Fechar busca">
          <X />
        </button>
      </form>

      {q.length >= 2 && (
        <div className="wrap max-h-[60dvh] overflow-y-auto border-t border-clay/50 pb-3">
          {achados.length === 0 ? (
            <p className="py-5 text-sm text-mute">
              Nada encontrado para “{termo.trim()}”. Tente outro nome ou{' '}
              <a
                href={linkWhats(`Olá! Procurei por "${termo.trim()}" no site da *${STORE.nome}* e não encontrei. Vocês têm? 😊`)}
                target="_blank"
                rel="noreferrer"
                className="text-pink underline-offset-2 hover:underline"
              >
                pergunte no WhatsApp
              </a>
              .
            </p>
          ) : (
            <>
              <ul className="divide-y divide-clay/50">
                {achados.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link to={`/produto/${p.id}`} onClick={sair} className="flex items-center gap-3 py-2.5 transition hover:text-pink">
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded bg-blush">
                        <ProductArt produto={p} prioridade />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm">{p.nome}</span>
                      <span className="shrink-0 text-sm text-mute">
                        {p.estoque > 0 ? brl(precoFinal(p)) : 'Esgotado'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {achados.length > 6 && (
                <button onClick={enviar} className="mt-2 text-[13px] font-medium text-pink hover:underline">
                  Ver os {achados.length} resultados
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

const Contador = ({ n }) =>
  n > 0 ? (
    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[9px] font-semibold text-white">
      {n}
    </span>
  ) : null

function Marquee() {
  const frases = ['Beleza é ser você', 'Make your own glow']
  const faixa = [...frases, ...frases, ...frases]
  return (
    <div className="overflow-hidden bg-pink py-3.5 text-white" aria-hidden>
      <div className="flex w-max animate-marquee items-center [animation-duration:60s]">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {faixa.map((f, i) => (
              <span key={i} className="flex items-center">
                <span className="whitespace-nowrap px-7 font-display text-lg italic">{f}</span>
                <Asterisco size={16} strokeWidth={1.3} className="text-white/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Layout() {
  const { qtdCarrinho, favoritos, sacolaAberta, abrirSacola, fecharSacola } = useLoja()
  const [menu, setMenu] = useState(false)
  const [busca, setBusca] = useState(false)
  const { pathname, search, hash } = useLocation()

  // volta ao topo ao trocar de página ou de filtro (links com #seção rolam até ela)
  useEffect(() => {
    setMenu(false)
    setBusca(false)
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, search, hash])

  const ativo = (to) => (to === '/' ? pathname === '/' && !search : pathname + search === to)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-ink px-4 py-2 text-center text-[11px] text-cream sm:text-xs">
        Frete grátis acima de R$ {STORE.freteGratisAcima}
        <span className="mx-2 text-cream/40">|</span>
        {STORE.cupomDesconto}% na primeira compra com o cupom{' '}
        <strong className="font-semibold text-pessego">{STORE.cupomBoasVindas}</strong>
      </div>

      <header className="sticky top-0 z-40 border-b border-clay/60 bg-white/95 backdrop-blur">
        <div className="wrap grid grid-cols-[1fr_auto_1fr] items-center py-3 sm:py-4">
          <button
            onClick={() => setMenu(true)}
            className="-ml-2 justify-self-start p-2 text-ink lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu />
          </button>

          <Link to="/" className="group justify-self-center lg:justify-self-start" aria-label={STORE.nome}>
            <Logo compacto />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`text-[13px] transition hover:text-pink ${
                  l.destaque || ativo(l.to) ? 'text-pink' : 'text-ink/75'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-self-end">
            <button onClick={() => setBusca((v) => !v)} className="p-2.5 text-ink transition hover:text-pink" aria-label="Buscar">
              <Lupa size={21} />
            </button>
            <Link
              to="/loja?fav=1"
              className="relative hidden p-2.5 text-ink transition hover:text-pink sm:block"
              aria-label="Favoritos"
            >
              <Coracao size={21} />
              <Contador n={favoritos.length} />
            </Link>
            <button
              onClick={abrirSacola}
              className="relative -mr-2 p-2.5 text-ink transition hover:text-pink"
              aria-label="Abrir sacola"
            >
              <Sacola size={21} />
              <Contador n={qtdCarrinho} />
            </button>
          </div>
        </div>

        <Busca aberta={busca} fechar={() => setBusca(false)} />
      </header>

      {/* menu do celular */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${menu ? 'opacity-100' : 'opacity-0'}`}
        />
        <nav
          className={`absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-cream transition-[transform,box-shadow] duration-300 ${
            menu ? 'translate-x-0 shadow-lift' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Logo compacto />
            <button onClick={() => setMenu(false)} className="-mr-2 p-2 text-mute" aria-label="Fechar menu">
              <X />
            </button>
          </div>

          <div className="flex flex-col px-3">
            {links.concat({ to: '/loja?fav=1', label: 'Favoritos' }, { to: '/ajuda', label: 'Entrega e trocas' }).map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMenu(false)}
                className={`rounded-md px-3 py-3 text-lg ${l.destaque || ativo(l.to) ? 'text-pink' : 'text-ink'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-6">
            <a href={linkWhats()} target="_blank" rel="noreferrer" className="btn-rose w-full">
              <Whats size={17} /> Falar no WhatsApp
            </a>
          </div>
        </nav>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Marquee />

      <footer className="bg-cream">
        <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="group inline-block" aria-label={STORE.nome}>
              <Logo compacto />
            </Link>
            <p className="mt-4 max-w-[26ch] text-[13px] leading-relaxed text-mute">{STORE.slogan}</p>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-medium">Loja</p>
            <ul className="space-y-3 text-[13px] text-mute">
              <li><Link to="/loja?grupo=maquiagem" className="hover:text-pink">Maquiagem</Link></li>
              <li><Link to="/loja?cat=skincare" className="hover:text-pink">Skincare</Link></li>
              <li><Link to="/loja?novidades=1" className="hover:text-pink">Lançamentos</Link></li>
              <li><Link to="/loja?sale=1" className="hover:text-pink">Sale</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-medium">Ajuda</p>
            <ul className="space-y-3 text-[13px] text-mute">
              <li><Link to="/ajuda#entrega" className="hover:text-pink">Entrega e prazos</Link></li>
              <li><Link to="/ajuda#trocas" className="hover:text-pink">Trocas e devoluções</Link></li>
              <li><Link to="/ajuda#pagamento" className="hover:text-pink">Formas de pagamento</Link></li>
              <li><Link to="/ajuda#sobre" className="hover:text-pink">Sobre a Aura</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-medium">Atendimento</p>
            <ul className="space-y-3 text-[13px] text-mute">
              <li>
                <a href={linkWhats()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pink">
                  <Whats size={15} /> {telefoneFormatado}
                </a>
              </li>
              {STORE.instagram && (
                <li>
                  <a href={`https://instagram.com/${STORE.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pink">
                    <Instagram size={15} /> @{STORE.instagram}
                  </a>
                </li>
              )}
              <li>Entrega em {STORE.regiao} e envio para todo o Brasil</li>
            </ul>
          </div>
        </div>

        <div className="wrap">
          <div className="flex flex-col gap-4 border-t border-clay py-6 text-[11px] text-mute sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap items-center gap-1.5" aria-label="Formas de pagamento aceitas">
              {PAGAMENTOS.map((p) => (
                <li key={p} className="rounded border border-clay bg-white px-2 py-1 text-[10px] text-ink/70">
                  {p}
                </li>
              ))}
            </ul>
            <span>
              © {new Date().getFullYear()} {STORE.nome}
              {STORE.cnpj && <> · CNPJ {STORE.cnpj}</>}
            </span>
            <Link to="/admin" className="hover:text-pink">
              Área da proprietária
            </Link>
          </div>
        </div>
      </footer>

      {/* botão flutuante: dúvida antes da compra */}
      <a
        href={linkWhats()}
        target="_blank"
        rel="noreferrer"
        aria-label="Tirar dúvida pelo WhatsApp"
        className={`group fixed bottom-4 right-4 z-30 flex h-14 items-center rounded-full bg-[#1FAF54] pl-[15px] pr-[15px] text-white shadow-lift transition-all duration-300 hover:bg-[#178F44] sm:bottom-6 sm:right-6 ${
          sacolaAberta || menu ? 'pointer-events-none translate-y-4 opacity-0' : ''
        } ${pathname.startsWith('/produto/') ? 'max-sm:hidden' : ''}`}
      >
        <Whats size={26} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:ml-2 group-hover:max-w-[9rem]">
          Tirar uma dúvida
        </span>
      </a>

      <Toast />
      <CartDrawer aberto={sacolaAberta} aoFechar={fecharSacola} />
    </div>
  )
}
