import { useEffect, useState } from 'react'

/**
 * Respeta la configuración "Reducir movimiento" del teléfono/sistema.
 * Si está activa, las animaciones fuertes se acortan o se desactivan.
 */
export function useReducedMotion(): boolean {
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)

    const onChange = (e: MediaQueryListEvent) => setReducido(e.matches)

    if (mq.addEventListener) {
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    // Safari viejo
    mq.addListener(onChange)
    return () => mq.removeListener(onChange)
  }, [])

  return reducido
}
