import { Link } from 'react-router-dom'
import useTitulo from '../hooks/useTitulo'
import { Asterisco, Whats } from '../components/Icons'
import { linkWhats } from '../whatsapp'

/** Tela para endereço que não existe (ou produto que saiu do catálogo). */
export default function NotFound({ produto = false }) {
  useTitulo(produto ? 'Produto não encontrado' : 'Página não encontrada')
  return (
    <section className="wrap flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="flex items-start font-display text-[5.5rem] font-light leading-none text-pink sm:text-[7.5rem]">
        404
        <Asterisco size={30} strokeWidth={1.3} className="-ml-1 mt-2 text-laranja" />
      </p>
      <h1 className="mt-4 font-display text-3xl font-light sm:text-4xl">
        {produto ? 'Esse produto saiu do catálogo' : 'Essa página não existe'}
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
        {produto
          ? 'O link pode estar antigo. Veja o que temos agora ou pergunte pra gente se ele volta.'
          : 'O endereço pode ter sido digitado errado ou o link está antigo. A loja continua aqui.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link to="/loja" className="btn-rose px-6">
          Ver todos os produtos
        </Link>
        <a href={linkWhats()} target="_blank" rel="noreferrer" className="btn-ghost px-6">
          <Whats size={17} /> Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
