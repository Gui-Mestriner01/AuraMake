import { useLoja } from '../store/StoreContext'

/**
 * Link para um produto que, num toque/clique normal, abre o pop-up do produto em vez de
 * trocar de página. Continua sendo um link de verdade (/produto/<id>): abrir em nova aba,
 * copiar o endereço e o Google funcionam normalmente.
 */
export default function LinkProduto({ id, onClick, children, ...rest }) {
  const { abrirProduto } = useLoja()

  const abrir = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onClick?.(e)
    abrirProduto(id)
  }

  return (
    <a href={`/produto/${id}`} onClick={abrir} {...rest}>
      {children}
    </a>
  )
}
