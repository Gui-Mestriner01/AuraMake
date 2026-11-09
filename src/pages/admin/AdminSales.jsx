import { useState } from 'react'
import { PAGAMENTOS } from '../../config'
import { brl, dataCurta, esgotado, precoFinal, useLoja } from '../../store/StoreContext'
import Drawer from '../../components/Drawer'
import { Lixo, Mais, Menos } from '../../components/Icons'

const CANAIS = ['WhatsApp', 'Instagram', 'Presencial', 'Indicação']

export default function AdminSales() {
  const { produtos, vendas, registrarVenda, mudarStatusVenda, removerVenda } = useLoja()
  const [aberto, setAberto] = useState(false)
  const [cliente, setCliente] = useState('')
  const [canal, setCanal] = useState('WhatsApp')
  const [pagamento, setPagamento] = useState('Pix')
  const [status, setStatus] = useState('Pago')
  const [itens, setItens] = useState([])
  const [busca, setBusca] = useState('')

  const disponiveis = produtos.filter(
    (p) => !esgotado(p) && p.nome.toLowerCase().includes(busca.toLowerCase().trim())
  )

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0)

  const addItem = (p) => {
    setItens((lista) => {
      const existe = lista.find((i) => i.id === p.id)
      if (existe)
        return lista.map((i) =>
          i.id === p.id ? { ...i, qtd: Math.min(i.qtd + 1, p.estoque) } : i
        )
      return [...lista, { id: p.id, nome: p.nome, preco: precoFinal(p), qtd: 1, max: p.estoque }]
    })
    setBusca('')
  }

  const mudarQtd = (id, delta) =>
    setItens((lista) =>
      lista
        .map((i) => (i.id === id ? { ...i, qtd: Math.min(Math.max(1, i.qtd + delta), i.max) } : i))
        .filter((i) => i.qtd > 0)
    )

  const limpar = () => {
    setCliente('')
    setItens([])
    setCanal('WhatsApp')
    setPagamento('Pix')
    setStatus('Pago')
    setBusca('')
  }

  const salvar = () => {
    if (!itens.length) return
    registrarVenda({ cliente: cliente.trim(), canal, pagamento, status, itens, total })
    limpar()
    setAberto(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Vendas manuais</h1>
          <p className="mt-1 text-sm text-mute">
            Para pedidos que chegam pelo WhatsApp, Instagram ou presencialmente. A baixa no estoque é
            automática.
          </p>
        </div>
        <button onClick={() => setAberto(true)} className="btn-dark">
          <Mais size={16} /> Lançar venda
        </button>
      </div>

      <div className="card overflow-hidden">
        {vendas.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-mute">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <ul className="divide-y divide-clay/60">
            {vendas.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{v.cliente || 'Cliente não identificado'}</p>
                  <p className="mt-0.5 text-xs text-mute">
                    {dataCurta(v.data)} · {v.canal} · {v.pagamento} ·{' '}
                    {v.itens.reduce((s, i) => s + i.qtd, 0)} item(ns)
                  </p>
                  <p className="mt-1 truncate text-xs text-mute">
                    {v.itens.map((i) => `${i.qtd}x ${i.nome}`).join(', ')}
                  </p>
                </div>

                <span className="text-sm tabular-nums">{brl(v.total)}</span>

                <button
                  onClick={() => mudarStatusVenda(v.id, v.status === 'Pago' ? 'Pendente' : 'Pago')}
                  className={`chip transition ${
                    v.status === 'Pago'
                      ? 'bg-sand text-ink hover:bg-clay'
                      : 'bg-rose/15 text-rosedeep hover:bg-rose/25'
                  }`}
                  title="Clique para alternar"
                >
                  {v.status}
                </button>

                <button
                  onClick={() => confirm('Excluir esta venda?') && removerVenda(v.id)}
                  className="rounded-full p-2 text-mute hover:text-rosedeep"
                  aria-label="Excluir venda"
                >
                  <Lixo size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Drawer
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        titulo="Lançar venda"
        rodape={
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mute">Total</span>
              <span className="font-display text-xl">{brl(total)}</span>
            </div>
            <button onClick={salvar} className="btn-dark w-full" disabled={!itens.length}>
              Registrar venda
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label">Cliente</label>
            <input
              className="field"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome da cliente"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Canal</label>
              <select className="field" value={canal} onChange={(e) => setCanal(e.target.value)}>
                {CANAIS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Pagamento</label>
              <select className="field" value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
                {PAGAMENTOS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <div className="flex gap-2">
              {['Pago', 'Pendente'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm transition ${
                    status === s ? 'border-ink bg-ink text-cream' : 'border-clay bg-white text-ink/70'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Produtos vendidos</label>
            <input
              className="field"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite para buscar e clique para adicionar"
            />

            {busca && (
              <ul className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-clay bg-white">
                {disponiveis.slice(0, 8).map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => addItem(p)}
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm hover:bg-sand/60"
                    >
                      <span className="truncate">{p.nome}</span>
                      <span className="shrink-0 text-xs text-mute">
                        {brl(precoFinal(p))} · {p.estoque} un.
                      </span>
                    </button>
                  </li>
                ))}
                {disponiveis.length === 0 && (
                  <li className="px-3.5 py-3 text-sm text-mute">Nada encontrado com estoque.</li>
                )}
              </ul>
            )}
          </div>

          {itens.length > 0 && (
            <ul className="space-y-2">
              {itens.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 rounded-xl border border-clay bg-white px-3.5 py-2.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{i.nome}</span>
                    <span className="block text-xs text-mute">{brl(i.preco)} cada</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button onClick={() => mudarQtd(i.id, -1)} className="p-1.5 text-mute hover:text-ink">
                      <Menos size={14} />
                    </button>
                    <span className="w-5 text-center text-xs tabular-nums">{i.qtd}</span>
                    <button
                      onClick={() => mudarQtd(i.id, 1)}
                      className="p-1.5 text-mute hover:text-ink disabled:opacity-30"
                      disabled={i.qtd >= i.max}
                    >
                      <Mais size={14} />
                    </button>
                  </span>
                  <span className="w-20 shrink-0 text-right text-sm tabular-nums">
                    {brl(i.preco * i.qtd)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Drawer>
    </div>
  )
}
