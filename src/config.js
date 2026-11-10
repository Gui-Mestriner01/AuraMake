// Configuração da loja — tudo que a proprietária costuma querer mudar fica aqui.
export const STORE = {
  nome: 'Aura Beauty & Care',
  slogan: 'Beleza original, do jeito que combina com você.',
  // Endereço público do site (usado nos links de produto, sitemap e prévia do WhatsApp)
  url: 'https://aura-beauty-care.netlify.app',
  // Número no formato internacional, só dígitos (55 + DDD + número)
  whatsapp: '5511972276750',
  // @ do Instagram DA MARCA (sem o @). Enquanto estiver vazio, o site não mostra o Instagram.
  instagram: '',
  email: 'contato@aurabeauty.com.br',
  // CNPJ ou CPF de quem vende. Enquanto estiver vazio, não aparece no rodapé.
  cnpj: '',
  // Região onde a entrega é feita em mãos / motoboy
  regiao: 'Araçatuba e região',
  freteGratisAcima: 150,
  // Cupom anunciado no topo do site e aceito na sacola (% de desconto).
  // Regra: vale uma vez por aparelho (primeira compra) e não acumula com itens em Sale.
  cupomBoasVindas: 'BEMVINDA',
  cupomDesconto: 10,
  // Parcelamento mostrado ao lado do preço: até `parcelas` vezes sem juros
  // em produtos a partir de `parcelaAPartirDe` reais. Coloque parcelas: 1 para desligar.
  parcelas: 3,
  parcelaAPartirDe: 90,
  // Senha do painel administrativo (demo — ver nota no README)
  senhaAdmin: 'aura2026'
}

export const CATEGORIAS = [
  { slug: 'pele', nome: 'Pele' },
  { slug: 'olhos', nome: 'Olhos' },
  { slug: 'labios', nome: 'Lábios' },
  { slug: 'pinceis', nome: 'Pincéis' },
  { slug: 'skincare', nome: 'Skincare' }
]

export const PAGAMENTOS = ['Pix', 'Crédito', 'Débito', 'Dinheiro']

// Formas de entrega: aparecem na sacola e na página "Entrega, trocas e pagamento".
export const ENTREGAS = [
  {
    id: 'regiao',
    titulo: `Entrega em ${STORE.regiao}`,
    nota: 'Combinamos o horário pelo WhatsApp',
    prazo: 'Em até 1 dia útil depois da confirmação do pedido',
    preco: 10
  },
  {
    id: 'brasil',
    titulo: 'Envio para todo o Brasil',
    nota: 'Correios ou transportadora',
    prazo: 'De 3 a 10 dias úteis depois da postagem, conforme o CEP',
    preco: 24.9
  },
  {
    id: 'retirada',
    titulo: 'Retirar com a vendedora',
    nota: 'Sem custo',
    prazo: 'No mesmo dia, com horário combinado',
    preco: 0
  }
]

// Textos da página de confiança (/ajuda). REVISE antes de divulgar: é a política da SUA loja.
export const POLITICAS = {
  sobre: [
    'A Aura é uma loja de maquiagem e skincare de Araçatuba. Cada produto do site é escolhido e conferido por nós antes de ir para a sua casa.',
    'O atendimento é direto pelo WhatsApp, com gente de verdade do outro lado: você pode tirar dúvida de tom, de textura e de modo de usar antes de comprar.'
  ],
  trocas: [
    'Você tem 7 dias corridos, contados do recebimento, para desistir da compra e receber o valor de volta. O produto precisa estar lacrado e sem uso.',
    'Chegou com defeito ou diferente do pedido? Avise em até 30 dias pelo WhatsApp, com uma foto, e nós trocamos ou devolvemos o valor, sem custo de frete para você.',
    'Por higiene, produtos abertos ou usados só são trocados em caso de defeito.'
  ],
  pagamento: [
    'Pix, cartão de crédito, cartão de débito e dinheiro (dinheiro só na entrega em mãos ou na retirada).',
    `No crédito, parcelamos em até ${STORE.parcelas}x sem juros em produtos a partir de R$ ${STORE.parcelaAPartirDe}.`,
    'O pagamento é combinado na conversa do WhatsApp, depois que confirmamos a disponibilidade do seu pedido.'
  ]
}
