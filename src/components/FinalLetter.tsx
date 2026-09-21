import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Particulas } from '../engine/particles'
import type { Paleta } from '../config'

type Props = {
  nombre: string
  carta: string
  tuNombre: string
  fechaInicio: string
  paleta: Paleta
  onVolver: () => void
}

/** Lluvia de pétalos temporal (al tocar "Te amo"). */
function Lluvia({ paleta, onFin }: { paleta: Paleta; onFin: () => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = window.innerWidth
    const h = window.innerHeight
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const P = new Particulas(paleta)
    P.lluvia(w, 90)

    let raf = 0
    const inicio = performance.now()
    let ultimo = inicio

    const paso = (ahora: number) => {
      const dt = Math.min(0.05, Math.max(0, (ahora - ultimo) / 1000))
      ultimo = ahora
      P.update(dt, ahora / 1000, w, h)
      P.lluvia(w, 2)
      ctx.clearRect(0, 0, w, h)
      P.draw(ctx)

      if (ahora - inicio < 6500) {
        raf = requestAnimationFrame(paso)
      } else {
        onFin()
      }
    }

    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [paleta, onFin])

  return <canvas ref={ref} className="lluvia" aria-hidden="true" />
}

/**
 * ETAPA 5 · La carta final + contador de días.
 */
export default function FinalLetter({
  nombre,
  carta,
  tuNombre,
  fechaInicio,
  paleta,
  onVolver,
}: Props) {
  const [llueve, setLlueve] = useState(false)
  const [amor, setAmor] = useState(false)

  const parrafos = useMemo(
    () =>
      carta
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [carta],
  )

  const dias = useMemo(() => {
    const inicio = new Date(`${fechaInicio}T00:00:00`)
    if (Number.isNaN(inicio.getTime())) return null
    const dif = Math.floor((Date.now() - inicio.getTime()) / 86400000)
    return dif >= 0 ? dif : null
  }, [fechaInicio])

  const teAmo = () => {
    setLlueve(true)
    setAmor(true)
    window.setTimeout(() => setAmor(false), 2600)
  }

  const finLluvia = useCallback(() => setLlueve(false), [])

  return (
    <div className="carta">
      <div className="carta__hoja">
        {parrafos.map((p, i) => (
          <p
            className="carta__para"
            key={i}
            style={{ animationDelay: `${0.12 + i * 0.22}s` }}
          >
            {p}
          </p>
        ))}

        <p className="carta__firma" style={{ animationDelay: `${0.4 + parrafos.length * 0.22}s` }}>
          Con todo mi amor,
          <br />
          {tuNombre}
        </p>

        {dias !== null && (
          <div className="carta__dias">
            <b>{dias.toLocaleString('es')}</b>
            <span>días junto a {nombre}</span>
          </div>
        )}
      </div>

      <div className="carta__acciones">
        <button className="boton boton--oro" onClick={teAmo}>
          Te amo
        </button>
        <button className="boton boton--fantasma" onClick={onVolver}>
          Volver al jardín
        </button>
      </div>

      {llueve && <Lluvia paleta={paleta} onFin={finLluvia} />}

      {amor && (
        <div
          className="completo"
          style={{ background: 'none', pointerEvents: 'none', zIndex: 46 }}
          aria-hidden="true"
        >
          <div className="completo__titulo">Yo más</div>
        </div>
      )}
    </div>
  )
}
