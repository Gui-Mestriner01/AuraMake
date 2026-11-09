import { brl, esgotado, precoFinal } from '../store/StoreContext'
import ProductArt from './ProductArt'

export default function ProductCard({ produto, onAbrir }) {
  const fim = precoFinal(produto)
  const off = (produto.desconto || 0) > 0
  const fora = esgotado(produto)

  return (
    <button
      type="button"
      onClick={() => onAbrir(produto)}
      className="group flex w-full flex-col text-left"
    >
      <div className="relative overflow-hidden rounded-xl2 border border-clay/60 bg-sand">
        <div className="aspect-[5/6]">
          <ProductArt
            produto={produto}
            className={`transition duration-500 group-hover:scale-[1.04] ${fora ? 'opacity-45 saturate-50' : ''}`}
          />
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off && !fora && (
            <span className="chip bg-rose text-white">{produto.desconto}% OFF</span>
          )}
          {produto.selo && !fora && (
            <span className="chip bg-white/90 text-ink">{produto.selo}</span>
          )}
        </div>

        {fora && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-1.5 text-xs font-medium tracking-widest text-mute">
            ESGOTADO
          </span>
        )}

        {!fora && produto.estoque <= 3 && (
          <span className="absolute bottom-3 left-3 chip bg-white/90 text-rosedeep">
            Últimas {produto.estoque} un.
          </span>
        )}
      </div>

      <div className="px-0.5 pt-3">
        <p className="text-[11px] uppercase tracking-widest text-mute">{produto.marca}</p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug text-ink">{produto.nome}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`text-sm font-medium ${fora ? 'text-mute' : 'text-ink'}`}>
            {brl(fim)}
          </span>
          {off && <span className="text-xs text-mute line-through">{brl(produto.preco)}</span>}
        </div>
      </div>
    </button>
  )
}
