import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENTREGAS, PAGAMENTOS, STORE } from '../config'
import { brl, useLoja } from '../store/StoreContext'
import { abrirWhats } from '../whatsapp'
import Drawer from './Drawer'
import ProductArt from './ProductArt'
import { Check, Lixo, Mais, Menos, Sacola, Whats, X } from './Icons'

// dados do cliente ficam guardados no aparelho para a próxima compra
const CHAVE_CLIENTE = 'aura:cliente'
// o cupom de boas-vindas vale uma vez por aparelho
const CHAVE_CUPOM = 'aura:cupom-usado'
// último pedido enviado (lido pela tela de confirmação)
export const CHAVE_PEDIDO = 'aura:ultimo-pedido'

const ler = (chave, padrao) => {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao
  } catch {
    return padrao
  }
}
const gravar = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* sem armazenamento — segue normalmente */
  }
}

const codigoPedido = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '7')

export default function CartDrawer({ aberto, aoFechar }) {
  const { itensCarrinho, totalCarrinho, mudarQtd, limparCarrinho } = useLoja()
  const nav = useNavigate()
  const [entrega, setEntrega] = useState('regiao')
  const [cliente, setCliente] = useState(() => ({ nome: '', endereco: '', pagamento: 'Pix', ...ler(CHAVE_CLIENTE, {}) }))
  const [cupomTexto, setCupomTexto] = useState('')
  const [cupom, setCupom] = useState(null) // código aplicado
  const [erroCupom, setErroCupom] = useState('')
  const [erros, setErros] = useState({})
  const nomeRef = useRef(null)
  const enderecoRef = useRef(null)

  useEffect(() => gravar(CHAVE_CLIENTE, cliente), [cliente])

  const opcao = ENTREGAS.find((e) => e.id === entrega)
  const pagamentos = entrega === 'brasil' ? PAGAMENTOS.filter((p) => p !== 'Dinheiro') : PAGAMENTOS
  const pagamento = pagamentos.includes(cliente.pagamento) ? cliente.pagamento : 'Pix'
  // em entrega ou envio, nome e endereço são obrigatórios; na retirada, opcionais
  const obrigatorio = entrega !== 'retirada'

  const gratis = totalCarrinho >= STORE.freteGratisAcima && entrega !== 'retirada'
  const frete = gratis ? 0 : opcao.preco
  // o cupom só incide sobre itens que não estão em Sale
  const baseCupom = itensCarrinho.filter((i) => !(i.desconto > 0)).reduce((s, i) => s + i.precoFinal * i.qtd, 0)
  const temItemEmSale = itensCarrinho.some((i) => i.desconto > 0)
  const desconto = cupom ? Number(((baseCupom * STORE.cupomDesconto) / 100).toFixed(2)) : 0
  const total = totalCarrinho - desconto + frete
  const faltaPraFrete = Math.max(0, STORE.freteGratisAcima - totalCarrinho)

  // se a sacola ficar só com itens em Sale, o cupom deixa de valer
  useEffect(() => {
    if (cupom && baseCupom === 0) setCupom(null)
  }, [cupom, baseCupom])

  const set = (campo) => (e) => {
    setCliente((c) => ({ ...c, [campo]: e.target.value }))
    setErros((er) => ({ ...er, [campo]: '' }))
  }

  const aplicarCupom = (e) => {
    e.preventDefault()
    if (cupomTexto.trim().toUpperCase() !== STORE.cupomBoasVindas.toUpperCase()) {
      setErroCupom('Cupom não encontrado. Confira se digitou certo.')
    } else if (ler(CHAVE_CUPOM, false)) {
      setErroCupom('Esse cupom vale só na primeira compra e já foi usado neste aparelho.')
    } else if (baseCupom === 0) {
      setErroCupom('O cupom não acumula com itens em Sale. Adicione um item sem desconto para usar.')
    } else {
      setCupom(STORE.cupomBoasVindas)
      setErroCupom('')
    }
  }

  const finalizar = () => {
    if (obrigatorio) {
      const faltando = {
        nome: cliente.nome.trim().length < 2 ? 'Informe seu nome para a entrega.' : '',
        endereco:
          cliente.endereco.trim().length < 8
            ? entrega === 'brasil'
              ? 'Informe o endereço completo com CEP.'
              : 'Informe rua, número e bairro.'
            : ''
      }
      if (faltando.nome || faltando.endereco) {
        setErros(faltando)
        const alvo = faltando.nome ? nomeRef.current : enderecoRef.current
        alvo?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        alvo?.focus({ preventScroll: true })
        return
      }
    }

    const codigo = codigoPedido()
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
      obrigatorio && `📍 *Endereço:* ${cliente.endereco.trim()}`,
      `💳 *Pagamento:* ${pagamento}`,
      cliente.nome.trim() && `🙋 *Nome:* ${cliente.nome.trim()}`
    ]

    const texto = [
      `Olá! 😊 Quero fazer um pedido pelo site da *${STORE.nome}*.`,
      '',
      `🛍️ *Pedido #${codigo}*`,
      itens,
      '',
      ...valores.filter(Boolean),
      '',
      ...dados.filter(Boolean),
      '',
      'Pode confirmar a disponibilidade e o prazo? Fico no aguardo! 💕'
    ].join('\n')

    gravar(CHAVE_PEDIDO, {
      codigo,
      texto,
      total,
      entrega: opcao.titulo,
      pagamento,
      itens: itensCarrinho.map((i) => ({ id: i.id, nome: i.nome, qtd: i.qtd, valor: i.precoFinal * i.qtd })),
      data: new Date().toISOString()
    })
    if (cupom) gravar(CHAVE_CUPOM, true)

    abrirWhats(texto)
    limparCarrinho()
    setCupom(null)
    setCupomTexto('')
    aoFechar()
    nav(`/pedido/${codigo}`)
  }

  const esvaziar = () => {
    limparCarrinho()
    setCupom(null)
    setCupomTexto('')
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

            <button onClick={finalizar} className="btn-rose w-full">
              <Whats size={18} /> Enviar pedido pelo WhatsApp
            </button>
            {(erros.nome || erros.endereco) && (
              <p className="text-center text-xs text-pinkdeep" role="alert">
                Falta preencher {erros.nome && erros.endereco ? 'nome e endereço' : erros.nome ? 'seu nome' : 'o endereço'} para a entrega.
              </p>
            )}
            <p className="text-center text-[11px] text-mute">
              O pagamento é combinado na conversa, depois da confirmação.
            </p>
          </div>
        )
      }
    >
      {vazio ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="rounded-full bg-blush p-5 text-pink">
            <Sacola size={28} />
          </div>
          <p className="text-sm text-mute">Sua sacola está vazia.</p>
          <button onClick={aoFechar} className="btn-ghost text-xs">
            Continuar comprando
          </button>
        </div>
      ) : (
        <div className="space-y-7">
          <div className="rounded-md bg-blush px-4 py-3.5 text-xs text-ink/80">
            {faltaPraFrete > 0 ? (
              <>
                Faltam <strong className="text-pink">{brl(faltaPraFrete)}</strong> para você ganhar frete grátis
              </>
            ) : (
              <>
                Você ganhou <strong className="text-pink">frete grátis</strong>
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
                  <ProductArt produto={item} prioridade />
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
                      onChange={() => {
                        setEntrega(e.id)
                        setErros({})
                      }}
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
            <p className="label">
              Seus dados{' '}
              <span className="normal-case tracking-normal text-mute/80">
                {obrigatorio ? '(obrigatórios para a entrega)' : '(opcionais na retirada)'}
              </span>
            </p>
            <div>
              <input
                ref={nomeRef}
                value={cliente.nome}
                onChange={set('nome')}
                placeholder={obrigatorio ? 'Seu nome' : 'Seu nome (opcional)'}
                autoComplete="name"
                required={obrigatorio}
                aria-invalid={!!erros.nome}
                className={`field text-base sm:text-sm ${erros.nome ? 'border-pinkdeep' : ''}`}
              />
              {erros.nome && <p className="mt-1.5 text-xs text-pinkdeep">{erros.nome}</p>}
            </div>
            {obrigatorio && (
              <div>
                <input
                  ref={enderecoRef}
                  value={cliente.endereco}
                  onChange={set('endereco')}
                  placeholder={entrega === 'brasil' ? 'Endereço completo com CEP' : 'Rua, número e bairro'}
                  autoComplete="street-address"
                  required
                  aria-invalid={!!erros.endereco}
                  className={`field text-base sm:text-sm ${erros.endereco ? 'border-pinkdeep' : ''}`}
                />
                {erros.endereco && <p className="mt-1.5 text-xs text-pinkdeep">{erros.endereco}</p>}
              </div>
            )}
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
              <>
                <div className="flex items-center justify-between rounded-xl border border-pink/40 bg-white px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-pink">
                    <Check size={16} /> {cupom}: {STORE.cupomDesconto}% off
                  </span>
                  <button onClick={() => setCupom(null)} className="text-mute hover:text-ink" aria-label="Remover cupom">
                    <X size={16} />
                  </button>
                </div>
                {temItemEmSale && (
                  <p className="mt-1.5 text-[11px] text-mute">O desconto do cupom não se aplica aos itens que já estão em Sale.</p>
                )}
              </>
            ) : (
              <form onSubmit={aplicarCupom} className="flex gap-2">
                <input
                  value={cupomTexto}
                  onChange={(e) => {
                    setCupomTexto(e.target.value)
                    setErroCupom('')
                  }}
                  placeholder={`Ex.: ${STORE.cupomBoasVindas}`}
                  aria-label="Código do cupom"
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
