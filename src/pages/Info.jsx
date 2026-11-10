import { ENTREGAS, PAGAMENTOS, POLITICAS, STORE } from '../config'
import { brl } from '../store/StoreContext'
import useTitulo from '../hooks/useTitulo'
import { Whats } from '../components/Icons'
import { linkWhats, telefoneFormatado } from '../whatsapp'

const Bloco = ({ id, titulo, children }) => (
  <section id={id} className="scroll-mt-28 border-t border-clay/70 py-10 sm:grid sm:grid-cols-[14rem_1fr] sm:gap-10 sm:py-12">
    <h2 className="font-display text-[1.7rem] font-medium sm:text-[2rem]">{titulo}</h2>
    <div className="mt-4 max-w-[62ch] space-y-3.5 text-[15px] leading-relaxed text-ink/75 sm:mt-1">{children}</div>
  </section>
)

/** Página de confiança: quem somos, entrega, trocas e pagamento. Textos em config.js. */
export default function Info() {
  useTitulo('Entrega, trocas e pagamento')
  return (
    <div className="wrap pb-16 pt-10 sm:pt-14">
      <h1 className="font-display text-[2.8rem] font-medium leading-none tracking-[-0.03em] sm:text-7xl">
        Antes de comprar<span className="text-pink">.</span>
      </h1>
      <p className="mb-10 mt-3 max-w-[52ch] text-[15px] leading-relaxed text-mute">
        Como a gente entrega, o que fazer se precisar trocar e como funciona o pagamento.
      </p>

      <Bloco id="sobre" titulo="Sobre a Aura">
        {POLITICAS.sobre.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </Bloco>

      <Bloco id="entrega" titulo="Entrega e prazos">
        <ul className="divide-y divide-clay/60 overflow-hidden rounded-xl border border-clay/70 bg-white">
          {ENTREGAS.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-4 px-4 py-3.5">
              <span>
                <span className="block text-sm font-medium text-ink">{e.titulo}</span>
                <span className="block text-[13px] text-mute">{e.prazo}</span>
              </span>
              <span className="shrink-0 text-sm text-ink">{e.preco === 0 ? 'Grátis' : brl(e.preco)}</span>
            </li>
          ))}
        </ul>
        <p>
          Em compras acima de <strong className="font-medium text-ink">{brl(STORE.freteGratisAcima)}</strong> a
          entrega e o envio saem grátis. O prazo começa a contar depois que confirmamos o pedido com você no
          WhatsApp.
        </p>
      </Bloco>

      <Bloco id="trocas" titulo="Trocas e devoluções">
        {POLITICAS.trocas.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </Bloco>

      <Bloco id="pagamento" titulo="Formas de pagamento">
        <ul className="flex flex-wrap gap-2">
          {PAGAMENTOS.map((p) => (
            <li key={p} className="rounded-full border border-clay bg-white px-4 py-1.5 text-[13px] text-ink">
              {p}
            </li>
          ))}
        </ul>
        {POLITICAS.pagamento.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </Bloco>

      <Bloco id="contato" titulo="Fale com a gente">
        <p>
          WhatsApp {telefoneFormatado}
          {STORE.email && <> ou {STORE.email}</>}.
          {STORE.cnpj && <> CNPJ {STORE.cnpj}.</>}
        </p>
        <a href={linkWhats()} target="_blank" rel="noreferrer" className="btn-rose">
          <Whats size={17} /> Chamar no WhatsApp
        </a>
      </Bloco>
    </div>
  )
}
