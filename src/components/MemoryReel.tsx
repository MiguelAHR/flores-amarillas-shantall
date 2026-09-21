import { useCallback, useEffect, useRef, useState } from 'react'

type Escena = { linea1: string; linea2: string }

type Props = {
  escenas: Escena[]
  onContinuar: () => void
  onCambioPlano: () => void
}

/** Las 4 transiciones que se van alternando entre planos. */
const VARIANTES = ['', 'escena--zoom', 'escena--desliz', 'escena--glitch'] as const

const DURACION_PLANO = 4400
const DURACION_SALIDA = 420

/**
 * ETAPA 2 · El "edit": planos de texto con transiciones tipo video.
 * Avanza solo, pero ella puede tocar para adelantar o usar las flechas.
 */
export default function MemoryReel({ escenas, onContinuar, onCambioPlano }: Props) {
  const [indice, setIndice] = useState(0)
  const [saliendo, setSaliendo] = useState(false)
  const [auto, setAuto] = useState(true)

  const bloqueado = useRef(false)
  const temporizador = useRef<number | null>(null)

  const ultimo = escenas.length - 1
  const esUltimo = indice >= ultimo

  const ir = useCallback(
    (destino: number) => {
      if (bloqueado.current) return
      const d = Math.max(0, Math.min(ultimo, destino))
      if (d === indice) return

      bloqueado.current = true
      setSaliendo(true)

      temporizador.current = window.setTimeout(() => {
        setIndice(d)
        setSaliendo(false)
        bloqueado.current = false
        onCambioPlano()
      }, DURACION_SALIDA)
    },
    [indice, ultimo, onCambioPlano],
  )

  /* avance automático */
  useEffect(() => {
    if (!auto || esUltimo || saliendo) return
    const id = window.setTimeout(() => ir(indice + 1), DURACION_PLANO)
    return () => window.clearTimeout(id)
  }, [auto, esUltimo, saliendo, indice, ir])

  useEffect(() => {
    return () => {
      if (temporizador.current !== null) window.clearTimeout(temporizador.current)
    }
  }, [])

  /* teclado */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') ir(indice + 1)
      if (e.key === 'ArrowLeft') ir(indice - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [indice, ir])

  if (escenas.length === 0) return null

  const escena = escenas[Math.min(indice, ultimo)]
  const variante = VARIANTES[indice % VARIANTES.length]
  const progreso = ((indice + 1) / escenas.length) * 100

  return (
    <div className="etapa reel">
      <div className="reel__lienzo" onClick={() => ir(indice + 1)}>
        <div
          key={indice}
          className={`escena ${variante} ${saliendo ? 'escena--saliendo' : ''}`}
        >
          <span className="escena__l1">{escena.linea1}</span>
          <span className="escena__l2">{escena.linea2}</span>
        </div>
      </div>

      {esUltimo && (
        <div className="reel__pie">
          <button className="boton boton--oro" onClick={onContinuar}>
            Ir al jardín
          </button>
        </div>
      )}

      <div className="reel__barra" aria-hidden="true">
        <i style={{ width: `${progreso}%` }} />
      </div>

      <div className="reel__controles">
        <button
          className="reel__flecha"
          onClick={() => ir(indice - 1)}
          disabled={indice === 0}
          aria-label="Plano anterior"
        >
          ◀
        </button>

        <div className="reel__puntos">
          {escenas.map((_, i) => (
            <button
              key={i}
              className={`reel__punto ${
                i === indice ? 'reel__punto--activo' : i < indice ? 'reel__punto--visto' : ''
              }`}
              onClick={() => ir(i)}
              aria-label={`Ir al plano ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="reel__flecha"
          onClick={() => ir(indice + 1)}
          disabled={esUltimo}
          aria-label="Plano siguiente"
        >
          ▶
        </button>

        <button
          className="boton boton--texto"
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? 'Pausar el avance automático' : 'Reanudar el avance automático'}
        >
          {auto ? '⏸ Pausa' : '▶ Auto'}
        </button>
      </div>
    </div>
  )
}
