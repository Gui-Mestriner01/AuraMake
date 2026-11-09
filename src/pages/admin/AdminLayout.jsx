import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { STORE } from '../../config'
import { useLoja } from '../../store/StoreContext'
import { Caixa, Etiqueta, Grafico, Nota, Sair } from '../../components/Icons'

const ABAS = [
  { to: '/admin', fim: true, label: 'Visão geral', Icone: Grafico },
  { to: '/admin/produtos', label: 'Produtos', Icone: Caixa },
  { to: '/admin/promocoes', label: 'Promoções', Icone: Etiqueta },
  { to: '/admin/vendas', label: 'Vendas', Icone: Nota }
]

function Login() {
  const { entrar } = useLoja()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (senha === STORE.senhaAdmin) entrar()
    else setErro('Senha incorreta.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/60 px-5">
      <form onSubmit={enviar} className="card w-full max-w-sm p-7">
        <p className="font-display text-2xl">Área da proprietária</p>
        <p className="mt-1.5 text-sm text-mute">Entre para gerenciar produtos, estoque e vendas.</p>

        <div className="mt-6">
          <label className="label" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro('')
            }}
            className="field"
            placeholder="••••••••"
            autoFocus
          />
          {erro && <p className="mt-2 text-xs text-rosedeep">{erro}</p>}
        </div>

        <button type="submit" className="btn-dark mt-5 w-full">
          Entrar
        </button>
        <Link to="/" className="mt-4 block text-center text-xs text-mute hover:text-ink">
          Voltar para a loja
        </Link>
      </form>
    </div>
  )
}

export default function AdminLayout() {
  const { logado, sair } = useLoja()
  if (!logado) return <Login />

  return (
    <div className="min-h-screen bg-sand/40">
      <header className="sticky top-0 z-30 border-b border-clay/70 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg">Aura</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-mute">Painel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden text-xs text-mute hover:text-ink sm:block">
              Ver a loja
            </Link>
            <button onClick={sair} className="btn-ghost px-3 py-2 text-xs" title="Sair">
              <Sair size={16} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        <nav className="thin-scroll mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {ABAS.map(({ to, fim, label, Icone }) => (
            <NavLink
              key={to}
              to={to}
              end={fim}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-sand'
                }`
              }
            >
              <Icone size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
