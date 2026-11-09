import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { STORE, CATEGORIAS } from '../config'
import { useLoja } from '../store/StoreContext'
import { Coracao, Lupa, Menu, Sacola, X, Whats } from './Icons'
import CartDrawer from './CartDrawer'

const links = [
  { to: '/', label: 'Início', fim: true },
  { to: '/loja?cat=olhos', label: 'Maquiagem' },
  { to: '/loja?cat=skincare', label: 'Skincare' },
  { to: '/loja?novidades=1', label: 'Lançamentos' },
  { to: '/loja?sale=1', label: 'Sale' }
]

function AnnouncementBar() {
  return (
    <div className="bg-ink text-cream">
      <div className="wrap flex items-center justify-center gap-2 py-2 text-center text-[11px] tracking-wide sm:text-xs">
        <span>Frete grátis acima de R$ {STORE.freteGratisAcima}</span>
        <span className="text-cream/40">|</span>
        <span>
          Cupom <strong className="font-semibold">{STORE.cupomBoasVindas}</strong>
        </span>
      </div>
    </div>
  )
}

function Busca({ aberta, fechar }) {
  const [termo, setTermo] = useState('')
  const nav = useNavigate()
  if (!aberta) return null

  const enviar = (e) => {
    e.preventDefault()
    nav(`/loja?q=${encodeURIComponent(termo.trim())}`)
    setTermo('')
    fechar()
  }

  return (
    <div className="border-b border-clay/70 bg-white">
      <form onSubmit={enviar} className="wrap flex items-center gap-3 py-3">
        <Lupa className="shrink-0 text-mute" />
        <input
          autoFocus
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar batom, base, sérum..."
          className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-mute/70"
        />
        <button type="button" onClick={fechar} className="text-mute hover:text-ink" aria-label="Fechar busca">
          <X />
        </button>
      </form>
    </div>
  )
}

export default function Layout() {
  const { qtdCarrinho } = useLoja()
  const [menu, setMenu] = useState(false)
  const [busca, setBusca] = useState(false)
  const [carrinho, setCarrinho] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />

      <header className="sticky top-0 z-40 border-b border-clay/70 bg-cream/90 backdrop-blur">
        <div className="wrap flex items-center justify-between gap-4 py-3.5">
          <button
            onClick={() => setMenu(true)}
            className="-ml-2 rounded-full p-2 text-ink md:hidden"
            aria-label="Abrir menu"
          >
            <Menu />
          </button>

          <Link to="/" className="flex items-baseline gap-1.5 md:order-none">
            <span className="font-display text-xl tracking-tight sm:text-2xl">Aura</span>
            <span className="hidden text-[10px] uppercase tracking-[0.3em] text-mute sm:inline">
              Beauty &amp; Care
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.fim}
                className={({ isActive }) =>
                  `text-sm transition hover:text-rosedeep ${isActive ? 'text-rosedeep' : 'text-ink/80'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setBusca((v) => !v)} className="rounded-full p-2 text-ink hover:bg-sand" aria-label="Buscar">
              <Lupa />
            </button>
            <button className="hidden rounded-full p-2 text-ink hover:bg-sand sm:block" aria-label="Favoritos">
              <Coracao />
            </button>
            <button
              onClick={() => setCarrinho(true)}
              className="relative rounded-full p-2 text-ink hover:bg-sand"
              aria-label="Abrir sacola"
            >
              <Sacola />
              {qtdCarrinho > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-white">
                  {qtdCarrinho}
                </span>
              )}
            </button>
          </div>
        </div>

        <Busca aberta={busca} fechar={() => setBusca(false)} />
      </header>

      {/* menu mobile */}
      <div className={`fixed inset-0 z-50 md:hidden ${menu ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-ink/35 transition-opacity ${menu ? 'opacity-100' : 'opacity-0'}`}
        />
        <nav
          className={`absolute left-0 top-0 h-full w-[78%] max-w-xs bg-cream p-6 shadow-lift transition-transform duration-300 ${
            menu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-xl">Aura</span>
            <button onClick={() => setMenu(false)} className="p-2 text-mute" aria-label="Fechar menu">
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMenu(false)}
                className="rounded-xl px-3 py-3 text-base hover:bg-sand"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="mt-8 mb-3 text-[11px] uppercase tracking-widest text-mute">Categorias</p>
          <div className="flex flex-col gap-1">
            {CATEGORIAS.map((c) => (
              <Link
                key={c.slug}
                to={`/loja?cat=${c.slug}`}
                onClick={() => setMenu(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-ink/80 hover:bg-sand"
              >
                {c.nome}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <main className="flex-1">
        <Outlet context={{ abrirCarrinho: () => setCarrinho(true) }} />
      </main>

      <footer className="mt-20 border-t border-clay/70 bg-sand/60">
        <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl">{STORE.nome}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">{STORE.slogan}</p>
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-5 text-xs"
            >
              <Whats size={16} /> Falar no WhatsApp
            </a>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-widest text-mute">Comprar</p>
            <ul className="space-y-2 text-sm text-ink/80">
              {CATEGORIAS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/loja?cat=${c.slug}`} className="hover:text-rosedeep">
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-widest text-mute">Entrega</p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink/80">
              <li>Entrega em mãos em {STORE.regiao}</li>
              <li>Envio para todo o Brasil</li>
              <li>Frete grátis acima de R$ {STORE.freteGratisAcima}</li>
              <li>Postagem em até 1 dia útil</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-widest text-mute">Contato</p>
            <ul className="space-y-2 text-sm text-ink/80">
              <li>
                <a href={`https://instagram.com/${STORE.instagram}`} target="_blank" rel="noreferrer" className="hover:text-rosedeep">
                  @{STORE.instagram}
                </a>
              </li>
              <li>{STORE.email}</li>
              <li>
                <Link to="/admin" className="text-mute hover:text-rosedeep">
                  Área da proprietária
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-clay/70">
          <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-[11px] text-mute sm:flex-row">
            <span>
              © {new Date().getFullYear()} {STORE.nome}. Todos os direitos reservados.
            </span>
            <span>Pix · Cartão · Dinheiro</span>
          </div>
        </div>
      </footer>

      <CartDrawer aberto={carrinho} aoFechar={() => setCarrinho(false)} />
    </div>
  )
}
