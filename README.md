# Aura Beauty & Care

Site de loja de maquiagem e beleza: vitrine pública + painel administrativo da proprietária.
Feito em React + Vite + Tailwind, pensado primeiro para o celular.

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
  config.js                 ← dados da loja (WhatsApp, frete, região, senha do painel)
  data/products.js          ← catálogo inicial
  store/StoreContext.jsx    ← estado global + persistência em localStorage
  components/
    Layout.jsx              ← cabeçalho, menu mobile, busca, rodapé
    ProductArt.jsx          ← ilustração SVG de cada tipo de produto
    ProductCard.jsx         ← card da vitrine
    ProductDrawer.jsx       ← detalhe do produto
    CartDrawer.jsx          ← sacola + opções de entrega + checkout no WhatsApp
    Drawer.jsx / Icons.jsx
  pages/
    Home.jsx                ← hero, atalhos, destaques, sale, diferenciais
    Catalog.jsx             ← listagem com filtro, busca e ordenação
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
região de entrega, valor do frete grátis, cupom e senha do painel.

**Fotos reais dos produtos:** cada produto tem o campo `image`. Enquanto estiver vazio, o site
desenha a ilustração do tipo (`batom`, `paleta`, `base`, `mascara`, `blush`, `po`, `pincel`,
`gloss`, `delineador`, `serum`, `creme`). Basta colar a URL da foto — ou colocar o arquivo em
`public/fotos/` e usar `/fotos/nome.jpg` — que a foto substitui o desenho em todos os lugares.

**Cores da marca:** `tailwind.config.js`, na chave `colors`.

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
