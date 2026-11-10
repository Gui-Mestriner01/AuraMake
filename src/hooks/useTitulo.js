import { useEffect } from 'react'
import { STORE } from '../config'

/** Título da aba por página: "Batom Matte Veludo — Aura Beauty & Care". */
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — ${STORE.nome}` : `${STORE.nome} — maquiagem e skincare`
  }, [titulo])
}
