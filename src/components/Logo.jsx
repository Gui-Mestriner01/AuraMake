import { Asterisco } from './Icons'

/** Logotipo: "aura" em serifa rosa + asterisco laranja + assinatura. */
export default function Logo({ compacto = false, claro = false, className = '' }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="relative inline-flex items-start">
        <span
          className={`font-display font-semibold italic tracking-[-0.04em] ${claro ? 'text-white' : 'text-pink'} transition-[font-size] duration-300 ${
            compacto ? 'text-[2.1rem]' : 'text-[2.3rem] sm:text-[2.8rem]'
          }`}
        >
          aura
        </span>
        <Asterisco
          size={compacto ? 18 : 22}
          strokeWidth={1.3}
          className="ml-0.5 -mt-0.5 text-laranja transition-transform duration-700 group-hover:rotate-90"
        />
      </span>
      <span className={`mt-0.5 pl-0.5 text-[8px] font-medium uppercase tracking-[0.34em] sm:text-[9px] ${claro ? 'text-pessego' : 'text-ink/70'}`}>
        Beauty &amp; Care
      </span>
    </span>
  )
}
