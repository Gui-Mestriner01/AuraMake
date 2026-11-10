import { Asterisco } from './Icons'

/** Logotipo: "aura" em serifa rosa + asterisco laranja + assinatura. */
export default function Logo({ compacto = false, className = '' }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="relative inline-flex items-start">
        <span
          className={`font-display font-normal tracking-[-0.04em] text-pink transition-[font-size] duration-300 ${
            compacto ? 'text-[1.9rem]' : 'text-[2.1rem] sm:text-[2.6rem]'
          }`}
        >
          aura
        </span>
        <Asterisco
          size={compacto ? 18 : 22}
          strokeWidth={1.3}
          className="-ml-0.5 -mt-1.5 text-laranja transition-transform duration-700 group-hover:rotate-90"
        />
      </span>
      <span className="mt-1 pl-0.5 text-[8px] font-medium uppercase tracking-[0.34em] text-ink/70 sm:text-[9px]">
        Beauty &amp; Care
      </span>
    </span>
  )
}
