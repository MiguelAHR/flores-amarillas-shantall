import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { actualizarFlor, crearFlor, dibujarFlor, type Flor } from '../engine/flower'
import { Particulas } from '../engine/particles'
import type { Paleta } from '../config'

type Props = {
  nombre: string
  paleta: Paleta
  total: number
  mensajes: string[]
  activo: boolean
  reducido: boolean
  onIrAlRamo: () => void
  /** solo para previsualizar: planta N flores ya crecidas al entrar */
  precargar?: number
}

type Brizna = { x: number; y: number; h: number; fase: number; lado: number; tono: number }
type Astro = { x: number; y: number; r: number; fase: number }

const TAU = Math.PI * 2

/**
 * ETAPA 3 · El jardín.
 * Ella toca la tierra y va plantando las 21 flores. Cada una
 * suelta un mensaje. Al completar las 21 se desbloquea el ramo.
 */
export default function GardenCanvas({
  nombre,
  paleta,
  total,
  mensajes,
  activo,
  reducido,
  onIrAlRamo,
  precargar = 0,
}: Props) {
  const refLienzo = useRef<HTMLCanvasElement | null>(null)
  const flores = useRef<Flor[]>([])
  const partes = useRef<Particulas | null>(null)
  const escena = useRef<{
    ancho: number
    alto: number
    briznas: Brizna[]
    astros: Astro[]
  }>({ ancho: 0, alto: 0, briznas: [], astros: [] })

  const terminadoRef = useRef(false)
  const [cantidad, setCantidad] = useState(0)
  const [mensaje, setMensaje] = useState<{ num: number; texto: string } | null>(null)
  const [ultimaLista, setUltimaLista] = useState(false)
  const [tocada, setTocada] = useState(false)

  if (!partes.current) partes.current = new Particulas(paleta)

  /* ── tamaño del lienzo + escenario de fondo ───────────────── */
  useEffect(() => {
    const cv = refLienzo.current
    if (!cv) return
    const cont = cv.parentElement ?? cv

    const generar = (w: number, h: number) => {
      const sueloEn = (x: number) =>
        h * 0.8 + Math.sin(x * 0.0055) * 22 + Math.sin(x * 0.019 + 1.3) * 9

      const briznas: Brizna[] = []
      const paso = 8
      for (let x = -10; x < w + 10; x += paso) {
        briznas.push({
          x: x + (Math.random() - 0.5) * 6,
          y: sueloEn(x),
          h: 9 + Math.random() * 22,
          fase: Math.random() * TAU,
          lado: Math.random() > 0.5 ? 1 : -1,
          tono: Math.random(),
        })
      }

      const astros: Astro[] = Array.from({ length: Math.round((w * h) / 16000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        r: 0.4 + Math.random() * 1.1,
        fase: Math.random() * TAU,
      }))

      escena.current.briznas = briznas
      escena.current.astros = astros
    }

    const ajustar = () => {
      const r = cont.getBoundingClientRect()
      const w = Math.max(1, Math.round(r.width))
      const h = Math.max(1, Math.round(r.height))
      const dpr = Math.min(2, window.devicePixelRatio || 1)

      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`

      const ctx = cv.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cambio = escena.current.ancho !== w || escena.current.alto !== h
      escena.current.ancho = w
      escena.current.alto = h
      if (cambio || escena.current.briznas.length === 0) generar(w, h)
    }

    ajustar()
    const ro = new ResizeObserver(ajustar)
    ro.observe(cont)
    window.addEventListener('orientationchange', ajustar)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', ajustar)
    }
  }, [])

  /* ── previsualización: ?flores=21 planta el jardín entero ─── */
  useEffect(() => {
    if (!precargar || flores.current.length > 0) return
    const { ancho, alto } = escena.current
    if (ancho < 10 || alto < 10) return

    const cuantas = Math.min(precargar, total)
    for (let i = 0; i < cuantas; i++) {
      const x = 30 + ((i + 0.5) / cuantas) * Math.max(1, ancho - 60)
      const y = alto * 0.76 + (i % 3) * (alto * 0.035)
      const f = crearFlor(x, y)
      f.altura = Math.max(70, Math.min(f.altura, y - 60))
      f.crecimiento = 1
      f.floracion = 1
      f.contada = true
      flores.current.push(f)
    }
    setCantidad(cuantas)
    setTocada(true)
  }, [precargar, total])

  /* ── bucle de animación ───────────────────────────────────── */
  useEffect(() => {
    const cv = refLienzo.current
    if (!cv || !activo) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const P = partes.current!
    let raf = 0
    let ultimo = performance.now()
    let polen = 0

    const sueloEn = (x: number, h: number) =>
      h * 0.8 + Math.sin(x * 0.0055) * 22 + Math.sin(x * 0.019 + 1.3) * 9

    const pintar = (t: number) => {
      const { ancho: w, alto: h, briznas, astros } = escena.current

      /* cielo */
      const cielo = ctx.createLinearGradient(0, 0, 0, h)
      cielo.addColorStop(0, '#07070C')
      cielo.addColorStop(0.45, paleta.fondo)
      cielo.addColorStop(1, '#120D07')
      ctx.fillStyle = cielo
      ctx.fillRect(0, 0, w, h)

      /* estrellas */
      for (const a of astros) {
        const alfa = 0.18 + Math.abs(Math.sin(t * 0.8 + a.fase)) * 0.5
        ctx.fillStyle = `rgba(255,246,220,${alfa})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, TAU)
        ctx.fill()
      }

      /* luna cálida */
      const mx = w * 0.79
      const my = h * 0.16
      const mr = Math.min(w, h) * 0.052
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 7)
      halo.addColorStop(0, 'rgba(255,233,155,0.34)')
      halo.addColorStop(0.35, 'rgba(255,196,46,0.10)')
      halo.addColorStop(1, 'rgba(255,196,46,0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(mx, my, mr * 7, 0, TAU)
      ctx.fill()

      const disco = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, 0, mx, my, mr)
      disco.addColorStop(0, 'rgba(255,250,225,0.95)')
      disco.addColorStop(1, 'rgba(255,214,120,0.75)')
      ctx.fillStyle = disco
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, TAU)
      ctx.fill()

      /* suelo */
      ctx.beginPath()
      ctx.moveTo(0, sueloEn(0, h))
      for (let x = 0; x <= w; x += 12) ctx.lineTo(x, sueloEn(x, h))
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()

      const tierra = ctx.createLinearGradient(0, h * 0.62, 0, h)
      tierra.addColorStop(0, 'rgba(46,64,28,0)')
      tierra.addColorStop(0.35, 'rgba(44,58,26,0.55)')
      tierra.addColorStop(1, 'rgba(16,22,9,0.98)')
      ctx.fillStyle = tierra
      ctx.fill()

      /* hierba */
      ctx.lineWidth = 1.2
      ctx.lineCap = 'round'
      for (const b of briznas) {
        const viento = Math.sin(t * 1.25 + b.fase) * 3.4
        const alfa = 0.22 + b.tono * 0.35
        ctx.strokeStyle = `rgba(112,146,64,${alfa})`
        ctx.beginPath()
        ctx.moveTo(b.x, b.y)
        ctx.quadraticCurveTo(
          b.x + b.lado * 4,
          b.y - b.h * 0.55,
          b.x + b.lado * 7 + viento,
          b.y - b.h,
        )
        ctx.stroke()
      }

      /* flores: las de más abajo se dibujan al final (quedan delante) */
      const ordenadas = [...flores.current].sort((a, b) => a.y - b.y)
      for (const f of ordenadas) dibujarFlor(ctx, f, t, paleta)

      /* partículas */
      P.draw(ctx)
    }

    const paso = (ahora: number) => {
      const dt = Math.min(0.05, Math.max(0, (ahora - ultimo) / 1000))
      ultimo = ahora
      const t = ahora / 1000
      const { ancho, alto } = escena.current

      /* crecimiento */
      for (const f of flores.current) {
        const termino = actualizarFlor(f, dt, reducido)
        if (termino && !f.contada) {
          f.contada = true
          const num = flores.current.indexOf(f) + 1
          setMensaje({
            num,
            texto: mensajes[(num - 1) % Math.max(1, mensajes.length)] ?? '',
          })
          setCantidad(num)
          P.brillar(f.x, f.y - f.altura, 18)
          P.soltarPetalos(f.x, f.y - f.altura * (0.6 + Math.random() * 0.3), 5, 1)

          if (num >= total && !terminadoRef.current) {
            terminadoRef.current = true
            P.lluvia(ancho, 46)
            // Ojo: el aviso de "jardín completo" NO sale aquí.
            // Sale cuando ella cierre este último mensaje, para que le dé
            // tiempo a leerlo con calma.
            setUltimaLista(true)
          }
        }
      }

      /* polen ambiental */
      polen += dt
      if (polen > 0.5 && alto > 0) {
        polen = 0
        P.brillar(Math.random() * ancho, alto * 0.5 + Math.random() * alto * 0.42, 1)
      }

      P.update(dt, t, ancho, alto)
      pintar(t)
      raf = requestAnimationFrame(paso)
    }

    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [activo, reducido, total, mensajes, paleta])

  /* ── plantar ──────────────────────────────────────────────── */
  const plantar = (cx: number, cy: number) => {
    if (terminadoRef.current) return
    const { ancho, alto } = escena.current
    if (flores.current.length >= total) return

    const x = Math.max(22, Math.min(ancho - 22, cx))
    const y = Math.max(80, Math.min(alto - 12, cy))

    const f = crearFlor(x, y)
    f.altura = Math.max(58, Math.min(f.altura, y - 50))
    flores.current.push(f)

    const P = partes.current!
    P.onda(x, y)
    P.brillar(x, y, 12)
    P.soltarPetalos(x, y - 10, 3, 0.9)

    setMensaje(null)
    setTocada(true)
  }

  const alTocar = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    plantar(e.clientX - r.left, e.clientY - r.top)
  }

  const pct = Math.min(100, (cantidad / Math.max(1, total)) * 100)

  return (
    <div className="jardin">
      <canvas
        ref={refLienzo}
        className="jardin__lienzo"
        onPointerDown={alTocar}
        aria-label="Jardín interactivo: toca para plantar una flor"
      />

      <div className="jardin__hud">
        <span className="jardin__titulo">Jardín de {nombre}</span>
        <div className="jardin__contador">
          <b>{cantidad}</b>
          <small>/ {total} flores</small>
        </div>
        <div className="jardin__progreso">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      {!tocada && !ultimaLista && (
        <p className="jardin__pista">Toca la tierra para plantar</p>
      )}

      {mensaje && (
        <div className="tarjeta" key={mensaje.num} role="status">
          <div className="tarjeta__num">
            Flor {mensaje.num} de {total}
          </div>
          <p className="tarjeta__texto">{mensaje.texto}</p>
          {mensaje.num === total && (
            <p className="tarjeta__nota">Cierra este mensaje para ver tu ramo</p>
          )}
          <button
            className="tarjeta__cerrar"
            onClick={() => setMensaje(null)}
            aria-label="Cerrar el mensaje"
          >
            ✕
          </button>
        </div>
      )}

      {ultimaLista && !mensaje && (
        <div className="completo">
          <div className="completo__titulo">
            {total}/{total}
          </div>
          <p className="completo__sub">Las plantaste todas</p>
          <button className="boton boton--oro" onClick={onIrAlRamo}>
            Ver mi ramo
          </button>
        </div>
      )}
    </div>
  )
}
