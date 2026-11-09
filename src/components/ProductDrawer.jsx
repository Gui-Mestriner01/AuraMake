import { useEffect, useState } from 'react'
import { STORE, CATEGORIAS } from '../config'
import { brl, esgotado, precoFinal, useLoja } from '../store/StoreContext'
import Drawer from './Drawer'
import ProductArt from './ProductArt'
import { Caminhao, Mais, Menos, Sacola, Selo, Whats } from './Icons'

export default function ProductDrawer({ produto, aoFechar, aoAdicionar }) {
  const { addCarrinho } = useLoja()
  const [qtd, setQtd] = useState(1)

  useEffect(() => setQtd(1), [produto?.id])

  if (!produto) return <Drawer aberto={false} aoFechar={aoFechar} titulo="" />

  const fora = esgotado(produto)
  const fim = precoFinal(produto)
  const off = (produto.desconto || 0) > 0
  const categoria = CATEGORIAS.find((c) => c.slug === produto.categoria)?.nome ?? produto.categoria

  const adicionar = () => {
    addCarrinho(produto.id, qtd)
    aoFechar()
    aoAdicionar?.()
  }

  const avisar = () => {
    const texto = `Oi! Quero ser avisada quando o ${produto.nome} voltar ao estoque.`
    window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <Drawer
      aberto={!!produto}
      aoFechar={aoFechar}
      titulo={categoria}
      rodape={
        fora ? (
          <button onClick={avisar} className="btn-ghost w-full">
            <Whats size={18} /> Avise-me quando chegar
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-clay bg-white">
              <button onClick={() => setQtd((q) => Math.max(1, q - 1))} className="p-2.5 text-mute hover:text-ink" aria-label="Diminuir">
                <Menos size={14} />
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{qtd}</span>
              <button
                onClick={() => setQtd((q) => Math.min(produto.estoque, q + 1))}
                className="p-2.5 text-mute hover:text-ink disabled:opacity-30"
                disabled={qtd >= produto.estoque}
                aria-label="Aumentar"
              >
                <Mais size={14} />
              </button>
            </div>
            <button onClick={adicionar} className="btn-dark flex-1">
              <Sacola size={18} /> Adicionar · {brl(fim * qtd)}
            </button>
          </div>
        )
      }
    >
      <div className="overflow-hidden rounded-xl2 border border-clay/60 bg-sand">
        <div className="aspect-[5/5]">
          <ProductArt produto={produto} className={fora ? 'opacity-50 saturate-50' : ''} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-widest text-mute">{produto.marca}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight">{produto.nome}</h3>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-xl">{brl(fim)}</span>
          {off && (
            <>
              <span className="text-sm text-mute line-through">{brl(produto.preco)}</span>
              <span className="chip bg-rose text-white">{produto.desconto}% OFF</span>
            </>
          )}
        </div>

        <p className="mt-1 text-xs text-mute">
          ou 3x de {brl(fim / 3)} sem juros no cartão
        </p>

        <p className="mt-5 text-sm leading-relaxed text-ink/80">{produto.descricao}</p>

        <div className="mt-6 space-y-3 rounded-xl2 bg-sand/70 p-4 text-sm">
          <p className="flex items-start gap-3">
            <Caminhao size={18} className="mt-0.5 shrink-0 text-rosedeep" />
            <span className="text-ink/80">
              Entrega em mãos em {STORE.regiao} e envio para todo o Brasil.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <Selo size={18} className="mt-0.5 shrink-0 text-rosedeep" />
            <span className="text-ink/80">Produto 100% original, com nota fiscal.</span>
          </p>
        </div>

        <p className="mt-4 text-xs text-mute">
          {fora ? 'Sem estoque no momento.' : `${produto.estoque} unidade(s) disponível(is).`}
        </p>
      </div>
    </Drawer>
  )
}
