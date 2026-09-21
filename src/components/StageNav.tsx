import { NOMBRES, ORDEN, type Etapa } from './etapas'

type Props = {
  actual: Etapa
  desbloqueadas: Etapa[]
  onIr: (etapa: Etapa) => void
}

/**
 * Barra inferior de capítulos: sirve de "timeline" y permite
 * volver a cualquier etapa ya vivida.
 */
export default function StageNav({ actual, desbloqueadas, onIr }: Props) {
  return (
    <nav className="nav" aria-label="Etapas de la experiencia">
      {ORDEN.map((e) => {
        const activa = e === actual
        const abierta = desbloqueadas.includes(e)
        return (
          <button
            key={e}
            className={`nav__item ${activa ? 'nav__item--activo' : ''}`}
            onClick={() => onIr(e)}
            disabled={!abierta || activa}
            aria-current={activa ? 'step' : undefined}
            title={abierta ? NOMBRES[e] : 'Todavía no está disponible'}
          >
            <span className="nav__punto" />
            <span className="nav__texto">{NOMBRES[e]}</span>
          </button>
        )
      })}
    </nav>
  )
}
