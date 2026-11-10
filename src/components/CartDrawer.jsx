import { useEffect, useState } from 'react'
import { PAGAMENTOS, STORE } from '../config'
import { brl, useLoja } from '../store/StoreContext'
import { abrirWhats } from '../whatsapp'
import Drawer from './Drawer'
import ProductArt from './ProductArt'
import { Check, Lixo, Mais, Menos, Sacola, Whats, X } from './Icons'

const ENTREGAS = [
  { id: 'regiao', titulo: `Entrega em ${STORE.regiao}`, nota: 'Combinamos o horário pelo WhatsApp', preco: 10 },
  { id: 'brasil', titulo: 'Envio para todo o Brasil', nota: 'Correios ou transportadora', preco: 24.9 },
  { id: 'retirada', titulo: 'Retirar com a vendedora', nota: 'Sem custo', preco: 0 }
]

// dados do cliente ficam guardados no aparelho para a próxima compra
const CHAVE_CLIENTE = 'aura:cliente'
const lerCliente = () => {
  try {
    return { nome: '', endereco: '', pagamento: 'Pix', ...JSON.parse(localStorage.getItem(CHAVE_CLIENTE) || '{}') }
  } catch {
    return { nome: '', endereco: '', pagamento: 'Pix' }
  }
}

const codigoPedido = () => Math.random().toString(36).slice(2, 6).toUpperCase()

export default function CartDrawer({ aberto, aoFechar }) {
  const { itensCarrinho, totalCarrinho, mudarQtd, limparCarrinho } = useLoja()
  const [entrega, setEntrega] = useState('regiao')
  const [cliente, setCliente] = useState(lerCliente)
  const [cupomTexto, setCupomTexto] = useState('')
  const [cupom, setCupom] = useState(null) // código aplicado
  const [erroCupom, setErroCupom] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_CLIENTE, JSON.stringify(cliente))
    } catch {
      /* sem armazenamento — segue normalmente */
    }
  }, [cliente])

  // se a sacola mudar depois de abrir o WhatsApp, o pedido precisa ser enviado de novo
  useEffect(() => setEnviado(false), [totalCarrinho])

  const opcao = ENTREGAS.find((e) => e.id === entrega)
  const pagamentos = entrega === 'brasil' ? PAGAMENTOS.filter((p) => p !== 'Dinheiro') : PAGAMENTOS
  const pagamento = pagamentos.includes(cliente.pagamento) ? cliente.pagamento : 'Pix'
  const precisaEndereco = entrega !== 'retirada'

  const gratis = totalCarrinho >= STORE.freteGratisAcima && entrega !== 'retirada'
  const frete = gratis ? 0 : opcao.preco
  const desconto = cupom ? Number(((totalCarrinho * STORE.cupomDesconto) / 100).toFixed(2)) : 0
  const total = totalCarrinho - desconto + frete
  const faltaPraFrete = Math.max(0, STORE.freteGratisAcima - totalCarrinho)

  const set = (campo) => (e) => setCliente((c) => ({ ...c, [campo]: e.target.value }))

  const aplicarCupom = (e) => {
    e.preventDefault()
    if (cupomTexto.trim().toUpperCase() === STORE.cupomBoasVindas.toUpperCase()) {
      setCupom(STORE.cupomBoasVindas)
      setErroCupom('')
    } else {
      setErroCupom('Cupom não encontrado.')
    }
  }

  const finalizar = () => {
    const itens = itensCarrinho
      .map((i) =>
        i.qtd > 1
          ? `• ${i.qtd}x ${i.nome} (${brl(i.precoFinal)} cada) — ${brl(i.precoFinal * i.qtd)}`
          : `• 1x ${i.nome} — ${brl(i.precoFinal)}`
      )
      .join('\n')

    const valores = [
      `Subtotal: ${brl(totalCarrinho)}`,
      cupom && `Cupom ${cupom} (${STORE.cupomDesconto}% off): − ${brl(desconto)}`,
      `Frete: ${frete === 0 ? 'Grátis' : brl(frete)}`,
      `*Total: ${brl(total)}*`
    ]

    const dados = [
      `🚚 *Entrega:* ${opcao.titulo}`,
      precisaEndereco && cliente.endereco.trim() && `📍 *Endereço:* ${cliente.endereco.trim()}`,
      `💳 *Pagamento:* ${pagamento}`,
      cliente.nome.trim() && `🙋 *Nome:* ${cliente.nome.trim()}`
    ]

    const texto = [
      `Olá! 😊 Quero fazer um pedido pelo site da *${STORE.nome}*.`,
      '',
      `🛍️ *Pedido #${codigoPedido()}*`,
      itens,
      '',
      ...valores.filter(Boolean),
      '',
      ...dados.filter(Boolean),
      '',
      'Pode confirmar a disponibilidade e o prazo? Fico no aguardo! 💕'
    ].join('\n')

    abrirWhats(texto)
    setEnviado(true)
  }

  const esvaziar = () => {
    limparCarrinho()
    setCupom(null)
    setCupomTexto('')
    setEnviado(false)
  }

  const vazio = itensCarrinho.length === 0

  return (
    <Drawer
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Sua sacola"
      rodape={
        !vazio && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm text-mute">
              <span>Subtotal</span>
              <span>{brl(totalCarrinho)}</span>
            </div>
            {cupom && (
              <div className="flex items-center justify-between text-sm text-pink">
                <span>Cupom {cupom}</span>
                <span>− {brl(desconto)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-mute">
              <span>Frete</span>
              <span className={gratis ? 'text-pink' : ''}>{frete === 0 ? 'Grátis' : brl(frete)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-clay/70 pt-3 text-base">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl">{brl(total)}</span>
            </div>

            {enviado ? (
              <div className="rounded-md bg-blush px-4 py-3 text-center text-xs leading-relaxed text-ink/80">
                Pedido aberto no WhatsApp. É só <strong>enviar a mensagem</strong> por lá ♡
                <div className="mt-2.5 flex justify-center gap-4">
                  <button onClick={finalizar} className="font-medium text-pink hover:underline">
                    Abrir de novo
                  </button>
                  <button onClick={esvaziar} className="text-mute hover:text-ink">
                    Já enviei, esvaziar sacola
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={finalizar} className="btn-rose w-full">
                  <Whats size={18} /> Enviar pedido pelo WhatsApp
                </button>
                <p className="text-center text-[11px] text-mute">
                  O pagamento é combinado na conversa, depois da confirmação.
                </p>
              </>
            )}
          </div>
        )
      }
    >
      {vazio ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="rounded-full bg-blush p-5 text-pink">
            <Sacola size={28} />
          </div>
          <p className="text-sm text-mute">Sua sacola ainda está vazia.</p>
          <button onClick={aoFechar} className="btn-ghost text-xs">
            Continuar comprando
          </button>
        </div>
      ) : (
        <div className="space-y-7">
          <div className="rounded-md bg-blush px-4 py-3.5 text-xs text-ink/80">
            {faltaPraFrete > 0 ? (
              <>
                Faltam <strong className="text-pink">{brl(faltaPraFrete)}</strong> para você ganhar frete grátis ♡
              </>
            ) : (
              <>
                Oba! Você ganhou <strong className="text-pink">frete grátis</strong> ♡
              </>
            )}
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-laranja to-pink transition-[width] duration-700"
                style={{ width: `${Math.min(100, (totalCarrinho / STORE.freteGratisAcima) * 100)}%` }}
              />
            </div>
          </div>

          <ul className="space-y-4">
            {itensCarrinho.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[4px] bg-blush">
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
                      <button onClick={() => mudarQtd(item.id, 0)} className="text-mute hover:text-pink" aria-label="Remover">
                        <Lixo size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* entrega */}
          <div>
            <p className="label">Como você quer receber</p>
            <div className="space-y-2">
              {ENTREGAS.map((e) => (
                <label
                  key={e.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                    entrega === e.id ? 'border-pink bg-white' : 'border-clay bg-white/50 hover:bg-white'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="entrega"
                      checked={entrega === e.id}
                      onChange={() => setEntrega(e.id)}
                      className="mt-1 accent-pink"
                    />
                    <span>
                      <span className="block text-sm">{e.titulo}</span>
                      <span className="block text-xs text-mute">{e.nota}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-mute">
                    {e.preco === 0 || (gratis && e.id !== 'retirada') ? 'Grátis' : brl(e.preco)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* dados do cliente */}
          <div className="space-y-3">
            <p className="label">Seus dados</p>
            <input
              value={cliente.nome}
              onChange={set('nome')}
              placeholder="Seu nome"
              autoComplete="name"
              className="field text-base sm:text-sm"
            />
            {precisaEndereco && (
              <input
                value={cliente.endereco}
                onChange={set('endereco')}
                placeholder={entrega === 'brasil' ? 'Endereço completo com CEP' : 'Rua, número e bairro'}
                autoComplete="street-address"
                className="field text-base sm:text-sm"
              />
            )}
            <p className="text-[11px] text-mute">Opcional — se preferir, você combina tudo na conversa.</p>
          </div>

          {/* pagamento */}
          <div>
            <p className="label">Forma de pagamento</p>
            <div className="flex flex-wrap gap-2">
              {pagamentos.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCliente((c) => ({ ...c, pagamento: p }))}
                  className={`rounded-full border px-4 py-2 text-[13px] transition ${
                    pagamento === p ? 'border-pink bg-pink text-white' : 'border-clay bg-white text-ink/75 hover:border-pink/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* cupom */}
          <div>
            <p className="label">Cupom de desconto</p>
            {cupom ? (
              <div className="flex items-center justify-between rounded-xl border border-pink/40 bg-white px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-pink">
                  <Check size={16} /> {cupom} — {STORE.cupomDesconto}% off nos produtos
                </span>
                <button onClick={() => setCupom(null)} className="text-mute hover:text-ink" aria-label="Remover cupom">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={aplicarCupom} className="flex gap-2">
                <input
                  value={cupomTexto}
                  onChange={(e) => {
                    setCupomTexto(e.target.value)
                    setErroCupom('')
                  }}
                  placeholder={`Ex.: ${STORE.cupomBoasVindas}`}
                  className="field flex-1 text-base uppercase placeholder:normal-case sm:text-sm"
                />
                <button type="submit" className="btn-ghost shrink-0 px-5 text-xs" disabled={!cupomTexto.trim()}>
                  Aplicar
                </button>
              </form>
            )}
            {erroCupom && <p className="mt-1.5 text-xs text-pinkdeep">{erroCupom}</p>}
          </div>

          <button onClick={esvaziar} className="w-full pb-2 text-xs text-mute hover:text-ink">
            Esvaziar sacola
          </button>
        </div>
      )}
    </Drawer>
  )
}
