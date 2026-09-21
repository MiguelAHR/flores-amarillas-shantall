import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { config } from './config'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Barras, Grano, HudCine, PetalosCss, Vineta } from './components/Cinematic'
import Envelope from './components/Envelope'
import Typewriter from './components/Typewriter'
import MemoryReel from './components/MemoryReel'
import GardenCanvas from './components/GardenCanvas'
import Bouquet from './components/Bouquet'
import FinalLetter from './components/FinalLetter'
import StageNav from './components/StageNav'
import AudioToggle from './components/AudioToggle'
import { ORDEN, type Etapa, type Fx } from './components/etapas'

/** Atajo de desarrollo: abrir la página con ?etapa=jardin salta directo ahí. */
function etapaInicial(): Etapa {
  if (typeof window === 'undefined') return 'sobre'
  const pedida = new URLSearchParams(window.location.search).get('etapa')
  return pedida && (ORDEN as string[]).includes(pedida) ? (pedida as Etapa) : 'sobre'
}

/** Atajo de desarrollo: ?flores=21 entra al jardín ya plantado. */
function floresIniciales(): number {
  if (typeof window === 'undefined') return 0
  const n = Number(new URLSearchParams(window.location.search).get('flores'))
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), config.totalFlores) : 0
}

export default function App() {
  const reducido = useReducedMotion()
  const inicio = useMemo(etapaInicial, [])
  const precargar = useMemo(floresIniciales, [])

  const [etapa, setEtapa] = useState<Etapa>(inicio)
  const etapaRef = useRef<Etapa>(inicio)
  const [desbloqueadas, setDesbloqueadas] = useState<Etapa[]>(() =>
    ORDEN.slice(0, ORDEN.indexOf(inicio) + 1),
  )
  const [fx, setFx] = useState<{ tipo: Fx; k: number } | null>(null)
  const [visitoJardin, setVisitoJardin] = useState(
    () => ORDEN.indexOf(inicio) >= ORDEN.indexOf('jardin'),
  )
  const timers = useRef<number[]>([])

  /* limpieza de temporizadores */
  useEffect(() => {
    const lista = timers.current
    return () => lista.forEach((id) => window.clearTimeout(id))
  }, [])

  /* paleta de config.ts → variables CSS */
  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--fondo', config.paleta.fondo)
    r.setProperty('--fondo2', config.paleta.fondo2)
    r.setProperty('--oro', config.paleta.oro)
    r.setProperty('--oro-claro', config.paleta.oroClaro)
    r.setProperty('--ambar', config.paleta.ambar)
    r.setProperty('--crema', config.paleta.crema)
    r.setProperty('--verde', config.paleta.verde)
    r.setProperty('--verde-osc', config.paleta.verdeOscuro)
  }, [])

  /** Lanza un efecto de transición a pantalla completa. */
  const chispa = useCallback((tipo: Fx, duracion = 1200) => {
    const k = Date.now() + Math.random()
    setFx({ tipo, k })
    const id = window.setTimeout(() => {
      setFx((f) => (f && f.k === k ? null : f))
    }, duracion)
    timers.current.push(id)
  }, [])

  /** Cambia de etapa con transición. */
  const ir = useCallback(
    (destino: Etapa, tipo: Fx = 'leak') => {
      if (etapaRef.current === destino) return
      etapaRef.current = destino
      setEtapa(destino)
      setDesbloqueadas((prev) => (prev.includes(destino) ? prev : [...prev, destino]))
      if (destino === 'jardin') setVisitoJardin(true)
      chispa(tipo)
    },
    [chispa],
  )

  const mostrarNav = etapa !== 'sobre' && etapa !== 'carta'
  const mostrarHud = etapa !== 'sobre'
  const mostrarBarras = etapa === 'sobre' || etapa === 'reel'

  return (
    <div className="app">
      <h1 className="solo-lectores">
        {config.totalFlores} flores amarillas para {config.nombre}
      </h1>

      <Grano />
      <Vineta />
      <HudCine visible={mostrarHud} />
      <Barras visible={mostrarBarras} />
      {(etapa === 'sobre' || etapa === 'intro') && <PetalosCss />}

      <div className="escenario">
        {etapa === 'sobre' && (
          <Envelope nombre={config.nombre} onAbrir={() => ir('intro', 'flash')} />
        )}

        {etapa === 'intro' && (
          <Typewriter lineas={config.mensajeInicial} onContinuar={() => ir('reel', 'leak')} />
        )}

        {etapa === 'reel' && (
          <MemoryReel
            escenas={config.escenas}
            onContinuar={() => ir('jardin', 'bloom')}
            onCambioPlano={() => chispa('glitch', 520)}
          />
        )}

        {/* el jardín se conserva: si vuelve, sus flores siguen ahí */}
        {visitoJardin && (
          <div className={`capa ${etapa === 'jardin' ? '' : 'capa--guardada'}`}>
            <GardenCanvas
              nombre={config.nombre}
              paleta={config.paleta}
              total={config.totalFlores}
              mensajes={config.mensajes}
              activo={etapa === 'jardin'}
              reducido={reducido}
              onIrAlRamo={() => ir('ramo', 'bloom')}
              precargar={precargar}
            />
          </div>
        )}

        {etapa === 'ramo' && (
          <Bouquet
            nombre={config.nombre}
            paleta={config.paleta}
            total={config.totalFlores}
            onLeerCarta={() => ir('carta', 'dissolve')}
            onVolver={() => ir('jardin', 'bloom')}
          />
        )}

        {etapa === 'carta' && (
          <FinalLetter
            nombre={config.nombre}
            carta={config.carta}
            tuNombre={config.tuNombre}
            fechaInicio={config.fechaInicio}
            paleta={config.paleta}
            onVolver={() => ir('jardin', 'bloom')}
          />
        )}
      </div>

      {mostrarNav && (
        <StageNav
          actual={etapa}
          desbloqueadas={desbloqueadas}
          onIr={(e) => ir(e, 'glitch')}
        />
      )}

      <AudioToggle src={config.musica} volumen={config.volumen} />

      {fx && <div className={`fx fx--${fx.tipo}`} key={fx.k} aria-hidden="true" />}
    </div>
  )
}
