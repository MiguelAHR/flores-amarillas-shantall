import { useEffect, useRef, useState } from 'react'

type Props = {
  nombre: string
  onAbrir: () => void
}

/**
 * ETAPA 0 · El sobre.
 * Primer gesto del usuario: sirve también para desbloquear el audio.
 */
export default function Envelope({ nombre, onAbrir }: Props) {
  const [abierto, setAbierto] = useState(false)
  const id = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (id.current !== null) window.clearTimeout(id.current)
    }
  }, [])

  const abrir = () => {
    if (abierto) return
    setAbierto(true)
    id.current = window.setTimeout(onAbrir, 1150)
  }

  return (
    <div className="etapa">
      <div className="sobre-escena">
        <div
          className={`sobre ${abierto ? 'abierto' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Abrir el sobre para ${nombre}`}
          onClick={abrir}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              abrir()
            }
          }}
        >
          <div className="sobre__cuerpo" />
          <div className="sobre__solapa" />
          <div className="sobre__nombre">{nombre}</div>
          <div className="sobre__sello">{nombre.charAt(0)}</div>
          <div className="sobre__destello" />
        </div>

        <p className="sobre__instruccion">
          {abierto ? 'Abriendo…' : 'Toca el sobre'}
        </p>
      </div>
    </div>
  )
}
