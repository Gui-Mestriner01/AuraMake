// Configuração da loja — tudo que a proprietária costuma querer mudar fica aqui.
export const STORE = {
  nome: 'Aura Beauty & Care',
  slogan: 'Beleza original, do jeito que combina com você.',
  // Número no formato internacional, só dígitos (55 + DDD + número)
  whatsapp: '5511972276750',
  instagram: 'mestrinergui',
  email: 'contato@aurabeauty.com.br',
  // Região onde a entrega é feita em mãos / motoboy
  regiao: 'Araçatuba e região',
  freteGratisAcima: 150,
  // Cupom anunciado no topo do site e aceito na sacola (% de desconto nos produtos)
  cupomBoasVindas: 'BEMVINDA',
  cupomDesconto: 10,
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
