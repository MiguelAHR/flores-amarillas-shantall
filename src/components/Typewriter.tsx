import { useEffect, useState } from 'react'

type Props = {
  lineas: string[]
  onContinuar: () => void
}

/** Velocidad de escritura en ms por letra. */
const VELOCIDAD = 44

/**
 * ETAPA 1 · El primer mensaje, escrito letra por letra.
 * Un toque acelera; al terminar aparece el botón para continuar.
 */
export default function Typewriter({ lineas, onContinuar }: Props) {
  const [indice, setIndice] = useState(0)
  const [largo, setLargo] = useState(0)
  const [listo, setListo] = useState(false)

  const total = lineas.length
  const linea = lineas[indice] ?? ''

  useEffect(() => {
    if (listo || total === 0) return

    if (largo < linea.length) {
      const id = window.setTimeout(() => setLargo((l) => l + 1), VELOCIDAD)
      return () => window.clearTimeout(id)
    }

    // línea completa → pequeña pausa antes de la siguiente
    const id = window.setTimeout(
      () => {
        if (indice < total - 1) {
          setIndice((i) => i + 1)
          setLargo(0)
        } else {
          setListo(true)
        }
      },
      indice === total - 1 ? 420 : 620,
    )
    return () => window.clearTimeout(id)
  }, [largo, indice, linea, listo, total])

  /** Un toque en cualquier lado: completa la línea o todo el texto. */
  const acelerar = () => {
    if (listo) return
    if (largo < linea.length) {
      setLargo(linea.length)
      return
    }
    // saltar al final
    const ultimo = total - 1
    setIndice(ultimo)
    setLargo((lineas[ultimo] ?? '').length)
  }

  return (
    <div className="etapa" onClick={acelerar}>
      <div className="intro">
        <div className="intro__texto" aria-live="polite">
          {lineas.slice(0, indice).map((l, i) => (
            <span className="intro__linea intro__linea--hecha" key={i}>
              {l}
            </span>
          ))}
          <span className="intro__linea intro__linea--activa">
            {linea.slice(0, largo)}
            {!listo && <span className="cursor" />}
          </span>
        </div>

        {listo ? (
          <button
            className="boton boton--oro"
            onClick={(e) => {
              e.stopPropagation()
              onContinuar()
            }}
          >
            Continuar
          </button>
        ) : (
          <p className="sobre__instruccion">Toca para acelerar</p>
        )}
      </div>
    </div>
  )
}
