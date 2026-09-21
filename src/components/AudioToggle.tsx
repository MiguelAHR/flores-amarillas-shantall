import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  volumen: number
}

/**
 * Botón de música. Arranca sola con el primer toque en la página
 * (los navegadores no permiten autoplay sin interacción) y si el
 * archivo no existe, se desactiva sola sin romper nada.
 */
export default function AudioToggle({ src, volumen }: Props) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [disponible, setDisponible] = useState(true)
  const [suena, setSuena] = useState(false)

  useEffect(() => {
    const a = audio.current
    if (!a) return
    a.volume = volumen

    const arrancar = () => {
      const el = audio.current
      if (!el || !disponible) return
      el.play()
        .then(() => setSuena(true))
        .catch(() => {
          /* el navegador lo bloqueó: se queda en pausa, sin drama */
        })
    }

    document.addEventListener('pointerdown', arrancar, { once: true })
    document.addEventListener('keydown', arrancar, { once: true })

    return () => {
      document.removeEventListener('pointerdown', arrancar)
      document.removeEventListener('keydown', arrancar)
    }
  }, [disponible, volumen])

  const alternar = () => {
    const a = audio.current
    if (!a || !disponible) return
    if (a.paused) {
      a.play()
        .then(() => setSuena(true))
        .catch(() => setDisponible(false))
    } else {
      a.pause()
      setSuena(false)
    }
  }

  return (
    <>
      <audio
        ref={audio}
        src={src}
        loop
        preload="auto"
        onError={() => setDisponible(false)}
        onPlay={() => setSuena(true)}
        onPause={() => setSuena(false)}
      />
      <button
        className={`musica ${suena ? 'musica--on' : ''}`}
        onClick={alternar}
        disabled={!disponible}
        aria-label={suena ? 'Pausar la música' : 'Reproducir la música'}
        title={
          disponible
            ? suena
              ? 'Pausar música'
              : 'Reproducir música'
            : 'No se encontró el archivo de música (public/music/)'
        }
      >
        <span className="musica__onda" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
    </>
  )
}
