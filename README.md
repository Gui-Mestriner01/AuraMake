# Aura Beauty & Care

Site de loja de maquiagem e beleza: vitrine pública + painel administrativo da proprietária.
Feito em React + Vite + Tailwind, pensado primeiro para o celular.

Visual: rosa pink (`#E8106E`) + laranja (`#F26A21`) sobre fundos creme e pêssego, títulos em
Fraunces (com itálico) e textos em DM Sans, asterisco laranja como assinatura da marca.

## Rodando o projeto

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build     # saída na pasta dist/
npm run preview   # testa o build localmente
```

## Como abrir no VSCode

1. Extraia a pasta `aura-beauty` onde preferir.
2. No VSCode: **Arquivo → Abrir Pasta…** e selecione `aura-beauty`.
3. Terminal integrado (`Ctrl + '`) e rode `npm install` e depois `npm run dev`.

Extensões que ajudam: *ES7+ React snippets*, *Tailwind CSS IntelliSense*, *Prettier*.

## Estrutura

```
scripts/prerender.mjs       ← roda no build: gera uma página HTML por produto (título, descrição
                              e og:image próprios) e o sitemap.xml
public/
  fotos/                    ← fotos dos produtos e da vitrine
  og/                       ← versão JPG da foto de cada produto, usada na prévia do WhatsApp
src/
  config.js                 ← dados da loja: WhatsApp, Instagram, CNPJ, frete, cupom, parcelamento,
                              formas de entrega e textos de troca/pagamento
  whatsapp.js               ← links e mensagens prontas para o WhatsApp
  data/products.js          ← catálogo inicial
  data/avaliacoes.js        ← avaliações de clientes (começa vazio)
  store/StoreContext.jsx    ← estado global + persistência em localStorage + avisos (toast)
  components/
    Layout.jsx              ← aviso de frete, cabeçalho, busca ao digitar, rodapé, botão do WhatsApp
    ProductCard.jsx         ← card da vitrine (tom, estrelas, parcelamento, adicionar com aviso)
    CartDrawer.jsx          ← sacola: entrega, dados do cliente, pagamento, cupom e pedido no WhatsApp
    Toast.jsx / Tom.jsx / Estrelas.jsx / ProductArt.jsx / Drawer.jsx / Icons.jsx / Logo.jsx
  pages/
    Home.jsx                ← hero, categorias, queridinhos, "escolha pelo tom", como funciona
    Catalog.jsx             ← listagem com filtro, busca, favoritos e ordenação
    Product.jsx             ← página do produto (/produto/p01): galeria, quantidade, avise-me,
                              avaliações e relacionados
    Info.jsx                ← /ajuda: sobre, entrega e prazos, trocas, pagamento
    OrderSent.jsx           ← /pedido/XXXX: confirmação depois de enviar o pedido
    NotFound.jsx            ← tela 404
    admin/                  ← painel da proprietária
```

## Regras que valem a pena conhecer

- **Endereço obrigatório:** em "Entrega" e "Envio", nome e endereço são obrigatórios; em
  "Retirar com a vendedora" são opcionais.
- **Cupom de boas-vindas:** vale uma vez por aparelho (primeira compra) e não incide sobre itens
  que já estão em Sale. A trava é feita no navegador, então confira na conversa do WhatsApp.
- **Parcelamento:** `parcelas` e `parcelaAPartirDe` em `config.js`.
- **Avaliações:** edite `src/data/avaliacoes.js`. Só publique depoimentos de clientes reais e com
  autorização. Enquanto a lista estiver vazia, o site mostra um convite para avaliar.
- **Fotos:** cada produto tem `imagens: []` (o ideal são 3: embalagem, textura e aplicado). Para a
  prévia do WhatsApp, salve também um JPG quadrado em `public/og/` com o mesmo nome da 1ª foto.
- **Avise-me quando chegar:** o contato vai para o Netlify Forms (formulário `avise-me`). No painel
  do Netlify, ative em *Forms → Enable form detection* e publique de novo; os contatos aparecem em
  *Forms*. Se o formulário não estiver disponível, o site cai para a mensagem no WhatsApp.
- **Páginas de produto:** o build gera `dist/produto/<id>/index.html` para os produtos de
  `products.js`. Produtos criados só pelo painel funcionam no site, mas não ganham prévia própria.

## Personalizando para a cliente

Quase tudo que muda por loja está em `src/config.js`: nome, slogan, WhatsApp, Instagram, e-mail,
região de entrega, valor do frete grátis, cupom (código e % de desconto) e senha do painel.

**Mensagem do pedido:** montada em `CartDrawer.jsx` (função `finalizar`). Sai com número do pedido,
itens, subtotal, cupom, frete, total, tipo de entrega, endereço, forma de pagamento e nome.

**Prévia ao compartilhar o link:** `public/og-image.jpg` + tags `og:` no `index.html`. Se o site
mudar de endereço, troque a URL nas tags `og:url` e `og:image`.

**Fotos dos produtos:** cada produto tem a lista `imagens`. Cada item pode ser uma URL completa ou um arquivo
dentro de `public/fotos/`, escrito sem a barra inicial (`fotos/nome.webp`), para funcionar em
qualquer hospedagem. Se a lista ficar vazia, o site desenha a ilustração do tipo (`batom`,
`paleta`, `base`, `mascara`, `blush`, `po`, `pincel`, `gloss`, `delineador`, `serum`, `creme`).

As fotos que vêm no projeto (produtos, hero, banners e galeria) são de demonstração, do
[Unsplash](https://unsplash.com) — licença gratuita, inclusive para uso comercial, sem exigir
crédito. Para a loja real, o ideal é trocar pelas fotos dos produtos que ela vende de fato: basta
substituir os arquivos em `public/fotos/` mantendo os nomes, ou editar o campo no painel.

As fotos fixas da vitrine (hero, categorias, banner, galeria) estão referenciadas em
`src/pages/Home.jsx`.

**Cores da marca:** `tailwind.config.js`, na chave `colors` (`pink`, `laranja`, `pessego`…).

> Os dados ficam no navegador com a chave `aura:loja:v2`. Ao mudar o catálogo inicial em
> `products.js`, troque o número da versão em `StoreContext.jsx` para que visitantes antigos
> recebam o catálogo novo.

## Pontos de atenção antes de vender

- Os dados ficam no `localStorage` do navegador — ótimo para demonstrar e para uma loja pequena
  de uma pessoa só, mas não sincroniza entre dispositivos. Para isso o caminho natural é plugar
  um Supabase ou Firebase trocando só o `StoreContext.jsx`.
- A senha do painel está no `config.js`, ou seja, visível no código do site. Serve como trava
  simples contra curiosos, não como segurança real. Se for virar multiusuário, autenticação de
  verdade entra junto com o banco.
- O checkout é via WhatsApp, sem gateway de pagamento.

## Deploy

O site usa endereços de verdade (`/loja`, `/produto/p01`), então a hospedagem precisa devolver o
`index.html` para caminhos que não são arquivo. No Netlify isso já está no `netlify.toml`
(`[[redirects]]`). Links antigos com `#` (`/#/loja`) continuam funcionando.

Publicado no Netlify em https://aura-beauty-care.netlify.app. Se o endereço mudar, troque `url` em
`src/config.js`, as tags `og:` do `index.html` e o `public/robots.txt`.

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```
