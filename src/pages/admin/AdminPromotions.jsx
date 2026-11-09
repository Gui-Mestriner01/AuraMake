import { useState } from 'react'
import { brl, precoFinal, useLoja } from '../../store/StoreContext'
import ProductArt from '../../components/ProductArt'
import { Check } from '../../components/Icons'

export default function AdminPromotions() {
  const { produtos, aplicarDesconto } = useLoja()
  const [selecionados, setSelecionados] = useState([])
  const [porcentagem, setPorcentagem] = useState(10)
  const [aviso, setAviso] = useState('')

  const emPromocao = produtos.filter((p) => (p.desconto || 0) > 0)

  const alternar = (id) =>
    setSelecionados((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const todos = () =>
    setSelecionados((s) => (s.length === produtos.length ? [] : produtos.map((p) => p.id)))

  const aplicar = () => {
    if (!selecionados.length) return
    aplicarDesconto(selecionados, porcentagem)
    setAviso(`Desconto de ${porcentagem}% aplicado em ${selecionados.length} produto(s).`)
    setSelecionados([])
    setTimeout(() => setAviso(''), 3500)
  }

  const remover = () => {
    if (!selecionados.length) return
    aplicarDesconto(selecionados, 0)
    setAviso(`Desconto removido de ${selecionados.length} produto(s).`)
    setSelecionados([])
    setTimeout(() => setAviso(''), 3500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Promoções</h1>
        <p className="mt-1 text-sm text-mute">
          Marque os produtos, escolha a porcentagem e aplique. O preço antigo aparece riscado na
          vitrine.
        </p>
      </div>

      {emPromocao.length > 0 && (
        <div className="card flex flex-wrap items-center gap-2 p-4">
          <span className="text-xs uppercase tracking-wider text-mute">Em promoção agora:</span>
          {emPromocao.map((p) => (
            <span key={p.id} className="chip bg-rose/15 text-rosedeep">
              {p.nome} · {p.desconto}%
            </span>
          ))}
        </div>
      )}

      <div className="card sticky top-32 z-20 flex flex-wrap items-center gap-3 p-4">
        <button onClick={todos} className="btn-ghost px-4 py-2 text-xs">
          {selecionados.length === produtos.length ? 'Limpar seleção' : 'Selecionar todos'}
        </button>
        <span className="text-sm text-mute">{selecionados.length} selecionado(s)</span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-clay bg-white px-3 py-2">
            <input
              type="number"
              min="0"
              max="90"
              value={porcentagem}
              onChange={(e) => setPorcentagem(Number(e.target.value))}
              className="w-14 bg-transparent text-sm outline-none"
            />
            <span className="text-sm text-mute">%</span>
          </div>
          <button onClick={remover} className="btn-ghost text-xs" disabled={!selecionados.length}>
            Remover
          </button>
          <button onClick={aplicar} className="btn-rose text-xs" disabled={!selecionados.length}>
            Aplicar desconto
          </button>
        </div>
      </div>

      {aviso && (
        <p className="flex items-center gap-2 rounded-xl bg-sand px-4 py-3 text-sm text-ink">
          <Check size={16} className="text-rosedeep" /> {aviso}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {produtos.map((p) => {
          const ativo = selecionados.includes(p.id)
          const previa = Number((p.preco * (1 - porcentagem / 100)).toFixed(2))
          return (
            <li key={p.id}>
              <button
                onClick={() => alternar(p.id)}
                className={`flex w-full items-center gap-4 rounded-xl2 border p-3 text-left transition ${
                  ativo ? 'border-rose bg-white shadow-soft' : 'border-clay/70 bg-white/60 hover:bg-white'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    ativo ? 'border-rose bg-rose text-white' : 'border-clay bg-white'
                  }`}
                >
                  {ativo && <Check size={13} />}
                </span>

                <span className="h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-clay/60 bg-sand">
                  <ProductArt produto={p} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{p.nome}</span>
                  <span className="mt-0.5 block text-xs text-mute">
                    {p.desconto > 0 ? `Hoje: ${p.desconto}% OFF · ` : ''}
                    {brl(precoFinal(p))}
                  </span>
                </span>

                {ativo && (
                  <span className="shrink-0 text-right">
                    <span className="block text-[10px] uppercase tracking-wider text-mute">Ficará</span>
                    <span className="block text-sm text-rosedeep">{brl(previa)}</span>
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
