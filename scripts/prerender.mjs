// Roda depois do `vite build`. Para cada produto do catálogo inicial, gera
// dist/produto/<id>/index.html com título, descrição e og:image próprios — é isso que faz
// o link do produto mostrar a foto e o nome certos no WhatsApp/Instagram e deixa o Google
// enxergar uma página por produto. Também gera o sitemap.xml.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { STORE } from '../src/config.js'
import { SEED_PRODUCTS } from '../src/data/products.js'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(raiz, 'dist')
const modelo = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const preco = (p) => Number((p.preco * (1 - (p.desconto || 0) / 100)).toFixed(2))
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const absoluta = (src) => (/^https?:/.test(src) ? src : `${STORE.url}/${src.replace(/^\//, '')}`)

/** Prévia do WhatsApp funciona melhor com JPG: usa public/og/<nome>.jpg quando existir. */
function imagemOg(p) {
  const foto = p.imagens?.[0]
  if (!foto) return { url: `${STORE.url}/og-image.jpg`, w: 1200, h: 630 }
  const jpg = `og/${basename(foto).replace(/\.\w+$/, '.jpg')}`
  return existsSync(join(dist, jpg)) ? { url: `${STORE.url}/${jpg}`, w: 800, h: 800 } : { url: absoluta(foto), w: 0, h: 0 }
}

const meta = (html, seletor, valor) => html.replace(new RegExp(`(<meta ${seletor} content=")[^"]*`), `$1${esc(valor)}`)

for (const p of SEED_PRODUCTS) {
  const url = `${STORE.url}/produto/${p.id}`
  const titulo = `${p.nome} — ${STORE.nome}`
  const valor = preco(p)
  const descricao = `${brl(valor)}. ${p.descricao}`
  const og = imagemOg(p)

  const dados = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nome,
    description: p.descricao,
    image: (p.imagens || []).map(absoluta),
    brand: { '@type': 'Brand', name: p.marca },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: valor.toFixed(2),
      availability: `https://schema.org/${p.estoque > 0 ? 'InStock' : 'OutOfStock'}`
    }
  }

  let html = modelo.replace(/<title>[^<]*<\/title>/, `<title>${esc(titulo)}</title>`)
  html = meta(html, 'name="description"', descricao)
  html = meta(html, 'property="og:type"', 'product')
  html = meta(html, 'property="og:title"', titulo)
  html = meta(html, 'property="og:description"', descricao)
  html = meta(html, 'property="og:url"', url)
  html = meta(html, 'property="og:image"', og.url)
  html = og.w
    ? meta(meta(html, 'property="og:image:width"', og.w), 'property="og:image:height"', og.h)
    : html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '')
  html = html.replace(
    '</head>',
    `  <link rel="canonical" href="${url}" />\n    <script type="application/ld+json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>\n  </head>`
  )

  const pasta = join(dist, 'produto', p.id)
  mkdirSync(pasta, { recursive: true })
  writeFileSync(join(pasta, 'index.html'), html)
}

const paginas = ['/', '/loja', '/ajuda', ...SEED_PRODUCTS.map((p) => `/produto/${p.id}`)]
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paginas.map((c) => `  <url><loc>${STORE.url}${c}</loc></url>`).join('\n') +
    '\n</urlset>\n'
)

console.log(`✓ ${SEED_PRODUCTS.length} páginas de produto e sitemap.xml gerados`)
