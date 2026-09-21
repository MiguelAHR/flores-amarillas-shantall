import { useEffect, useMemo, useState, type CSSProperties } from 'react'

/* ───────────── Capas que dan el look de "video edit" ───────────── */

export function Grano() {
  return <div className="grano" aria-hidden="true" />
}

export function Vineta() {
  return <div className="vineta" aria-hidden="true" />
}

export function Barras({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <>
      <div className="barra barra--top" aria-hidden="true" />
      <div className="barra barra--bottom" aria-hidden="true" />
    </>
  )
}

/** Timecode + REC, arriba a la izquierda. */
export function HudCine({ visible, etiqueta = '21 · 09' }: { visible: boolean; etiqueta?: string }) {
  const [seg, setSeg] = useState(0)

  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => setSeg((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [visible])

  if (!visible) return null

  const mm = String(Math.floor(seg / 60)).padStart(2, '0')
  const ss = String(seg % 60).padStart(2, '0')

  return (
    <div className="hud-cine" aria-hidden="true">
      <span className="hud-cine__rec" />
      <span>REC</span>
      <span>00:{mm}:{ss}</span>
      <span>·</span>
      <span>{etiqueta}</span>
    </div>
  )
}

/** Pétalos flotando de fondo (CSS puro, muy liviano). */
export function PetalosCss({ cantidad = 14 }: { cantidad?: number }) {
  const petalos = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        left: `${(i * 97) % 100}%`,
        dur: `${9 + ((i * 13) % 11)}s`,
        delay: `${-((i * 7) % 14)}s`,
        dx: `${(((i * 31) % 20) - 10).toFixed(1)}vw`,
        escala: 0.6 + ((i * 17) % 9) / 10,
        giro: `${(i * 53) % 360}deg`,
      })),
    [cantidad],
  )

  return (
    <div className="petalos-css" aria-hidden="true">
      {petalos.map((p) => (
        <i
          key={p.id}
          style={
            {
              left: p.left,
              animationDuration: p.dur,
              animationDelay: p.delay,
              transform: `rotate(${p.giro}) scale(${p.escala})`,
              '--dx': p.dx,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
