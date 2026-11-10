import { STORE } from './config'

/** Link do WhatsApp da loja, já com uma mensagem pronta. */
export const linkWhats = (texto = `Olá! Vim pelo site da *${STORE.nome}* e queria tirar uma dúvida 😊`) =>
  `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(texto)}`

export const abrirWhats = (texto) => window.open(linkWhats(texto), '_blank', 'noopener')

/** '5511972276750' → '(11) 97227-6750' */
export const telefoneFormatado = (() => {
  const n = STORE.whatsapp.replace(/^55/, '')
  const ddd = n.slice(0, 2)
  const resto = n.slice(2)
  return `(${ddd}) ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`
})()
