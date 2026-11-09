import { Link } from 'react-router-dom'
import { brl, dataCurta, esgotado, mesmoDia, useLoja } from '../../store/StoreContext'
import { Caixa, Grafico, Nota, Seta } from '../../components/Icons'

function Cartao({ titulo, valor, nota, Icone, destaque }) {
  return (
    <div className="card flex flex-col gap-2 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-mute">{titulo}</span>
        <Icone size={18} className="text-rosedeep" />
      </div>
      <p className={`font-display text-3xl ${destaque ? 'text-rosedeep' : ''}`}>{valor}</p>
      <p className="text-xs text-mute">{nota}</p>
    </div>
  )
}

export default function Dashboard() {
  const { produtos, vendas } = useLoja()

  const doDia = vendas.filter((v) => mesmoDia(v.data))
  const totalDia = doDia.reduce((s, v) => s + v.total, 0)
  const pendentes = vendas.filter((v) => v.status === 'Pendente')
  const baixoEstoque = produtos.filter((p) => p.estoque > 0 && p.estoque <= 5)
  const semEstoque = produtos.filter(esgotado)
  const ultimas = vendas.slice(0, 6)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Visão geral</h1>
        <p className="mt-1 text-sm text-mute">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Cartao
          titulo="Vendas do dia"
          valor={brl(totalDia)}
          nota={`${doDia.length} pedido(s) registrado(s) hoje`}
          Icone={Grafico}
        />
        <Cartao
          titulo="Pedidos pendentes"
          valor={pendentes.length}
          nota={`${brl(pendentes.reduce((s, v) => s + v.total, 0))} a receber`}
          Icone={Nota}
          destaque={pendentes.length > 0}
        />
        <Cartao
          titulo="Estoque baixo"
          valor={baixoEstoque.length + semEstoque.length}
          nota={`${semEstoque.length} esgotado(s), ${baixoEstoque.length} acabando`}
          Icone={Caixa}
          destaque={semEstoque.length > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-clay/70 px-5 py-4">
            <h2 className="text-sm font-medium">Últimas vendas</h2>
            <Link to="/admin/vendas" className="flex items-center gap-1 text-xs text-rosedeep hover:underline">
              Ver todas <Seta size={14} />
            </Link>
          </div>
          {ultimas.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-mute">
              Nenhuma venda registrada ainda. Lance a primeira em Vendas.
            </p>
          ) : (
            <ul className="divide-y divide-clay/60">
              {ultimas.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{v.cliente || 'Cliente não identificado'}</p>
                    <p className="text-xs text-mute">
                      {dataCurta(v.data)} · {v.canal} · {v.pagamento}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm">{brl(v.total)}</p>
                    <span
                      className={`chip ${
                        v.status === 'Pago' ? 'bg-sand text-ink' : 'bg-rose/15 text-rosedeep'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-clay/70 px-5 py-4">
            <h2 className="text-sm font-medium">Repor estoque</h2>
            <Link to="/admin/produtos" className="flex items-center gap-1 text-xs text-rosedeep hover:underline">
              Gerenciar <Seta size={14} />
            </Link>
          </div>
          {semEstoque.length + baixoEstoque.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-mute">Estoque saudável. 🎉</p>
          ) : (
            <ul className="divide-y divide-clay/60">
              {[...semEstoque, ...baixoEstoque].map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <p className="truncate text-sm">{p.nome}</p>
                  <span
                    className={`chip shrink-0 ${
                      p.estoque === 0 ? 'bg-rose/15 text-rosedeep' : 'bg-sand text-mute'
                    }`}
                  >
                    {p.estoque === 0 ? 'Esgotado' : `${p.estoque} un.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
