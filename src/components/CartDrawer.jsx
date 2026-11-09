import { useState } from 'react'
import { STORE } from '../config'
import { brl, useLoja } from '../store/StoreContext'
import Drawer from './Drawer'
import ProductArt from './ProductArt'
import { Lixo, Mais, Menos, Sacola, Whats } from './Icons'

const ENTREGAS = [
  { id: 'regiao', titulo: `Entrega em ${STORE.regiao}`, nota: 'Combinamos o horário no WhatsApp', preco: 10 },
  { id: 'brasil', titulo: 'Envio para todo o Brasil', nota: 'Correios ou transportadora', preco: 24.9 },
  { id: 'retirada', titulo: 'Retirar com a vendedora', nota: 'Sem custo', preco: 0 }
]

export default function CartDrawer({ aberto, aoFechar }) {
  const { itensCarrinho, totalCarrinho, mudarQtd, limparCarrinho } = useLoja()
  const [entrega, setEntrega] = useState('regiao')

  const opcao = ENTREGAS.find((e) => e.id === entrega)
  const gratis = totalCarrinho >= STORE.freteGratisAcima && entrega !== 'retirada'
  const frete = gratis ? 0 : opcao.preco
  const total = totalCarrinho + frete
  const faltaPraFrete = Math.max(0, STORE.freteGratisAcima - totalCarrinho)

  const finalizar = () => {
    const linhas = itensCarrinho
      .map((i) => `• ${i.qtd}x ${i.nome} — ${brl(i.precoFinal * i.qtd)}`)
      .join('\n')
    const texto =
      `Olá! Quero finalizar meu pedido na ${STORE.nome}:\n\n${linhas}\n\n` +
      `Entrega: ${opcao.titulo}\n` +
      `Frete: ${frete === 0 ? 'Grátis' : brl(frete)}\n` +
      `Total: ${brl(total)}`
    window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  const vazio = itensCarrinho.length === 0

  return (
    <Drawer
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Sua sacola"
      rodape={
        !vazio && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-mute">
              <span>Subtotal</span>
              <span>{brl(totalCarrinho)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-mute">
              <span>Frete</span>
              <span className={gratis ? 'text-rosedeep' : ''}>{frete === 0 ? 'Grátis' : brl(frete)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-clay/70 pt-3 text-base">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl">{brl(total)}</span>
            </div>
            <button onClick={finalizar} className="btn-rose w-full">
              <Whats size={18} /> Finalizar no WhatsApp
            </button>
            <button onClick={limparCarrinho} className="w-full text-xs text-mute hover:text-ink">
              Esvaziar sacola
            </button>
          </div>
        )
      }
    >
      {vazio ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="rounded-full bg-sand p-5 text-mute">
            <Sacola size={28} />
          </div>
          <p className="text-sm text-mute">Sua sacola ainda está vazia.</p>
          <button onClick={aoFechar} className="btn-ghost text-xs">
            Continuar comprando
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {faltaPraFrete > 0 && (
            <div className="rounded-xl bg-sand px-4 py-3 text-xs text-ink/80">
              Faltam <strong>{brl(faltaPraFrete)}</strong> para você ganhar frete grátis.
            </div>
          )}

          <ul className="space-y-4">
            {itensCarrinho.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-clay/60 bg-sand">
                  <ProductArt produto={item} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <p className="line-clamp-2 text-sm leading-snug">{item.nome}</p>
                    <p className="mt-0.5 text-xs text-mute">{brl(item.precoFinal)} cada</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full border border-clay bg-white">
                      <button
                        onClick={() => mudarQtd(item.id, item.qtd - 1)}
                        className="p-1.5 text-mute hover:text-ink"
                        aria-label="Diminuir"
                      >
                        <Menos size={14} />
                      </button>
                      <span className="w-5 text-center text-xs tabular-nums">{item.qtd}</span>
                      <button
                        onClick={() => mudarQtd(item.id, Math.min(item.qtd + 1, item.estoque))}
                        className="p-1.5 text-mute hover:text-ink disabled:opacity-30"
                        disabled={item.qtd >= item.estoque}
                        aria-label="Aumentar"
                      >
                        <Mais size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{brl(item.precoFinal * item.qtd)}</span>
                      <button
                        onClick={() => mudarQtd(item.id, 0)}
                        className="text-mute hover:text-rosedeep"
                        aria-label="Remover"
                      >
                        <Lixo size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <p className="label">Como você quer receber</p>
            <div className="space-y-2">
              {ENTREGAS.map((e) => (
                <label
                  key={e.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                    entrega === e.id ? 'border-rose bg-white' : 'border-clay bg-white/50 hover:bg-white'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="entrega"
                      checked={entrega === e.id}
                      onChange={() => setEntrega(e.id)}
                      className="mt-1 accent-rose"
                    />
                    <span>
                      <span className="block text-sm">{e.titulo}</span>
                      <span className="block text-xs text-mute">{e.nota}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-mute">
                    {e.preco === 0 ? 'Grátis' : brl(e.preco)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
