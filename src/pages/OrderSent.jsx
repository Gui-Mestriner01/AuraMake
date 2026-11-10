import { Link, useParams } from 'react-router-dom'
import { STORE } from '../config'
import { brl } from '../store/StoreContext'
import useTitulo from '../hooks/useTitulo'
import { CHAVE_PEDIDO } from '../components/CartDrawer'
import { Check, Whats } from '../components/Icons'
import { linkWhats } from '../whatsapp'

const lerPedido = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PEDIDO))
  } catch {
    return null
  }
}

/** Confirmação depois de mandar o pedido para o WhatsApp. */
export default function OrderSent() {
  const { codigo } = useParams()
  const pedido = lerPedido()
  const achou = pedido?.codigo === codigo
  useTitulo(`Pedido #${codigo}`)

  return (
    <section className="wrap flex min-h-[62vh] flex-col items-center py-14 text-center sm:py-20">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pink text-white shadow-pink">
        <Check size={30} strokeWidth={2} />
      </span>
      <h1 className="mt-6 font-display text-[2.8rem] font-medium leading-none tracking-[-0.03em] sm:text-7xl">Pedido enviado!</h1>
      <p className="mt-3 text-sm text-mute">
        Pedido <strong className="font-semibold text-ink">#{codigo}</strong>
      </p>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
        Vamos te responder em instantes pelo WhatsApp para confirmar a disponibilidade, o prazo e o pagamento.
      </p>

      {achou && (
        <div className="mt-8 w-full max-w-md rounded-xl border border-clay/70 bg-white p-5 text-left">
          <ul className="space-y-2 text-sm">
            {pedido.itens.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span className="min-w-0 truncate">
                  {i.qtd}x {i.nome}
                </span>
                <span className="shrink-0 text-mute">{brl(i.valor)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-clay/70 pt-3">
            <span className="text-sm text-mute">
              {pedido.entrega} · {pedido.pagamento}
            </span>
            <span className="font-display text-xl">{brl(pedido.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 max-w-md rounded-md bg-blush px-4 py-3 text-xs leading-relaxed text-ink/80">
        O pedido só chega até nós quando você <strong>envia a mensagem</strong> na conversa que abriu. Se o
        WhatsApp não abriu, toque no botão abaixo.
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <a
          href={linkWhats(achou ? pedido.texto : `Olá! Fiz o pedido #${codigo} pelo site da *${STORE.nome}* 😊`)}
          target="_blank"
          rel="noreferrer"
          className="btn-rose px-6"
        >
          <Whats size={18} /> Abrir o WhatsApp de novo
        </a>
        <Link to="/loja" className="btn-ghost px-6">
          Continuar comprando
        </Link>
      </div>
    </section>
  )
}
