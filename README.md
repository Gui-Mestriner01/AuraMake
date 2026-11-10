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
src/
  config.js                 ← dados da loja (WhatsApp, Instagram, frete, cupom, região, senha)
  whatsapp.js               ← links e mensagens prontas para o WhatsApp
  hooks/useReveal.js        ← animação de "revelar ao rolar" das seções
  data/products.js          ← catálogo inicial
  store/StoreContext.jsx    ← estado global + persistência em localStorage
  components/
    Layout.jsx              ← aviso de frete, cabeçalho, menu mobile, busca, faixa rolante, rodapé
    Logo.jsx                ← logotipo "aura✳" 
    ProductArt.jsx          ← ilustração SVG de cada tipo de produto
    ProductCard.jsx         ← card da vitrine
    ProductModal.jsx        ← detalhe do produto (cartão centralizado)
    CartDrawer.jsx          ← sacola: entrega, dados do cliente, pagamento, cupom e pedido no WhatsApp
    Drawer.jsx / Icons.jsx
  pages/
    Home.jsx                ← hero, benefícios, categorias, queridinhos, banner skincare,
                              galeria "Inspire-se"
    Catalog.jsx             ← listagem com filtro por categoria, busca, favoritos e ordenação
    admin/
      AdminLayout.jsx       ← login e navegação do painel
      Dashboard.jsx         ← vendas do dia, pendentes, estoque baixo
      AdminProducts.jsx     ← CRUD + edição rápida em gaveta lateral
      AdminPromotions.jsx   ← seleção em massa e % de desconto
      AdminSales.jsx        ← lançamento de vendas manuais
```

## O que já está funcionando

**Vitrine**
- Barra de avisos, menu responsivo, busca e sacola com contador.
- Hero, atalhos circulares por categoria, grade de destaques e bloco de promoções.
- Card com selo "Novo"/"% OFF", aviso de últimas unidades e estado **Esgotado** com película opaca.
- Detalhe do produto em gaveta, com parcelamento, info de entrega e botão "avise-me" quando esgotado.
- Sacola com escolha de entrega (região, Brasil, retirada), frete grátis automático acima do valor
  definido e fechamento do pedido pelo WhatsApp com a lista montada.

**Painel (`/#/admin`)**
- Três cartões: vendas do dia, pedidos pendentes e produtos com estoque baixo.
- Produtos: tabela, busca, cadastro e edição rápida em gaveta lateral. Estoque `0` vira
  "Esgotado" na vitrine sozinho.
- Promoções: marca vários produtos, digita a porcentagem e aplica — o preço antigo aparece
  riscado na vitrine.
- Vendas manuais: cliente, canal, forma de pagamento, status Pago/Pendente e baixa automática
  no estoque.

## Personalizando para a cliente

Quase tudo que muda por loja está em `src/config.js`: nome, slogan, WhatsApp, Instagram, e-mail,
região de entrega, valor do frete grátis, cupom (código e % de desconto) e senha do painel.

**Mensagem do pedido:** montada em `CartDrawer.jsx` (função `finalizar`). Sai com número do pedido,
itens, subtotal, cupom, frete, total, tipo de entrega, endereço, forma de pagamento e nome.

**Prévia ao compartilhar o link:** `public/og-image.jpg` + tags `og:` no `index.html`. Se o site
mudar de endereço, troque a URL nas tags `og:url` e `og:image`.

**Fotos dos produtos:** cada produto tem o campo `image`. Pode ser uma URL completa ou um arquivo
dentro de `public/fotos/`, escrito sem a barra inicial (`fotos/nome.webp`), para funcionar em
qualquer hospedagem. Se o campo ficar vazio, o site desenha a ilustração do tipo (`batom`,
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

O projeto usa `HashRouter` e caminhos relativos, então o conteúdo de `dist/` funciona em
qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, hospedagem compartilhada) sem
precisar configurar redirects.

Publicado no Netlify em https://aura-beauty-care.netlify.app (configuração em `netlify.toml`).
Para publicar uma nova versão pela linha de comando:

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```
