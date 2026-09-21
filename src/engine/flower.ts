/**
 * Motor de dibujo de una flor (tallo, hojas y corola) en Canvas 2D.
 * Se usa igual en el jardín interactivo y en el ramo final.
 */

import type { Paleta } from '../config'

const TAU = Math.PI * 2

export type Flor = {
  id: number
  /** base del tallo */
  x: number
  y: number
  /** alto final del tallo en px */
  altura: number
  /** 0 → 1 cuánto ha crecido el tallo */
  crecimiento: number
  /** 0 → 1 cuánto se ha abierto la corola */
  floracion: number
  /** desfase para que ninguna se mueva igual */
  fase: number
  /** amplitud del vaivén */
  balanceo: number
  /** cantidad de pétalos */
  petalos: number
  /** radio de la corola */
  tamano: number
  /** rotación inicial de la corola */
  giro: number
  /** lado de la primera hoja (1 o -1) */
  hojaLado: number
  /** true cuando ya se contó como flor terminada */
  contada: boolean
  /** escala global (el ramo usa < 1) */
  escala: number
}

let contador = 0

export function crearFlor(x: number, y: number, semilla?: Partial<Flor>): Flor {
  contador += 1
  return {
    id: contador,
    x,
    y,
    altura: 90 + Math.random() * 70,
    crecimiento: 0,
    floracion: 0,
    fase: Math.random() * TAU,
    balanceo: 5 + Math.random() * 9,
    petalos: 9 + Math.floor(Math.random() * 4), // 9..12
    tamano: 12 + Math.random() * 7,
    giro: Math.random() * TAU,
    hojaLado: Math.random() > 0.5 ? 1 : -1,
    contada: false,
    escala: 1,
    ...semilla,
  }
}

/** Avanza la animación de crecimiento. Devuelve true cuando terminó de florecer. */
export function actualizarFlor(f: Flor, dt: number, instantaneo = false): boolean {
  if (instantaneo) {
    f.crecimiento = 1
    f.floracion = 1
    return true
  }

  // el tallo primero, la corola después
  const velCrecimiento = 0.85
  const velFloracion = 1.5
  let termino = false

  f.crecimiento = Math.min(1, f.crecimiento + dt * velCrecimiento)
  if (f.crecimiento >= 1) {
    const antes = f.floracion
    f.floracion = Math.min(1, f.floracion + dt * velFloracion)
    if (antes < 1 && f.floracion >= 1) termino = true
  }
  return termino
}

/** Curva de suavizado para que el crecimiento no sea lineal. */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export type Punto = { x: number; y: number }

/** Punto sobre la curva del tallo, u = 0 (base) … 1 (ápice). */
export function puntoTallo(f: Flor, t: number, u: number, esc = 1): Punto {
  const e = easeOut(f.crecimiento)
  const alto = f.altura * e * esc
  const viento = Math.sin(t * 1.15 + f.fase) * f.balanceo * f.crecimiento * esc
  const x0 = f.x
  const y0 = f.y
  const x3 = f.x + viento
  const y3 = f.y - alto
  const x1 = f.x + viento * 0.15
  const y1 = f.y - alto * 0.35
  const x2 = f.x + viento * 0.62
  const y2 = f.y - alto * 0.72
  const v = 1 - u
  const a = v * v * v
  const b = 3 * v * v * u
  const c = 3 * v * u * u
  const d = u * u * u
  return {
    x: a * x0 + b * x1 + c * x2 + d * x3,
    y: a * y0 + b * y1 + c * y2 + d * y3,
  }
}

function dibujarHoja(
  ctx: CanvasRenderingContext2D,
  p: Punto,
  angulo: number,
  largo: number,
  paleta: Paleta,
  alfa: number,
) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(angulo)
  ctx.globalAlpha = alfa

  const grad = ctx.createLinearGradient(0, 0, largo, 0)
  grad.addColorStop(0, paleta.verdeOscuro)
  grad.addColorStop(0.55, paleta.verde)
  grad.addColorStop(1, '#8FAE55')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(largo * 0.45, -largo * 0.42, largo, 0)
  ctx.quadraticCurveTo(largo * 0.45, largo * 0.42, 0, 0)
  ctx.closePath()
  ctx.fill()

  // nervadura
  ctx.strokeStyle = 'rgba(255,246,220,0.20)'
  ctx.lineWidth = Math.max(0.6, largo * 0.03)
  ctx.beginPath()
  ctx.moveTo(largo * 0.08, 0)
  ctx.lineTo(largo * 0.9, 0)
  ctx.stroke()

  ctx.restore()
}

export type OpcionesDibujo = {
  /** multiplica el tamaño de todo */
  escala?: number
  /** brillo extra para el ramo */
  glow?: number
  /** alpha global */
  alfa?: number
}

/** Dibuja una flor completa. */
export function dibujarFlor(
  ctx: CanvasRenderingContext2D,
  f: Flor,
  t: number,
  paleta: Paleta,
  opciones: OpcionesDibujo = {},
) {
  const esc = (f.escala ?? 1) * (opciones.escala ?? 1)
  const alfa = opciones.alfa ?? 1
  if (f.crecimiento <= 0.001 || alfa <= 0) return

  ctx.save()
  ctx.globalAlpha = alfa

  const e = easeOut(f.crecimiento)
  const alto = f.altura * e * esc
  const viento = Math.sin(t * 1.15 + f.fase) * f.balanceo * f.crecimiento * esc
  const apex: Punto = { x: f.x + viento, y: f.y - alto }

  /* ── tallo ── */
  const gradTallo = ctx.createLinearGradient(f.x, f.y, apex.x, apex.y)
  gradTallo.addColorStop(0, paleta.verdeOscuro)
  gradTallo.addColorStop(1, paleta.verde)

  ctx.strokeStyle = gradTallo
  ctx.lineCap = 'round'
  ctx.lineWidth = Math.max(1.2, 2.6 * esc * (0.5 + f.crecimiento * 0.5))
  ctx.beginPath()
  ctx.moveTo(f.x, f.y)
  ctx.bezierCurveTo(
    f.x + viento * 0.15,
    f.y - alto * 0.35,
    f.x + viento * 0.62,
    f.y - alto * 0.72,
    apex.x,
    apex.y,
  )
  ctx.stroke()

  /* ── hojas ── */
  if (f.crecimiento > 0.3) {
    const alfaHoja = Math.min(1, (f.crecimiento - 0.3) / 0.5)
    const u1 = 0.42
    const u2 = 0.68
    const largoHoja = f.altura * 0.22 * esc * f.crecimiento
    const p1 = puntoTallo(f, t, u1, esc)
    const p2 = puntoTallo(f, t, u2, esc)
    const grados = 22 + Math.sin(t * 1.6 + f.fase) * 6
    dibujarHoja(ctx, p1, (f.hojaLado * grados * Math.PI) / 180 - 0.35, largoHoja, paleta, alfaHoja)
    dibujarHoja(
      ctx,
      p2,
      (-f.hojaLado * (grados - 4) * Math.PI) / 180 + Math.PI + 0.35,
      largoHoja * 0.82,
      paleta,
      alfaHoja,
    )
  }

  /* ── corola ── */
  const bloom = easeOut(f.floracion)
  if (bloom > 0.02) {
    const r = f.tamano * esc * bloom

    // halo cálido detrás de la flor
    const halo = ctx.createRadialGradient(apex.x, apex.y, 0, apex.x, apex.y, r * 4.2)
    halo.addColorStop(0, `rgba(255,196,46,${0.30 * bloom + (opciones.glow ?? 0) * 0.25})`)
    halo.addColorStop(0.45, `rgba(255,196,46,${0.10 * bloom})`)
    halo.addColorStop(1, 'rgba(255,196,46,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(apex.x, apex.y, r * 4.2, 0, TAU)
    ctx.fill()

    ctx.save()
    ctx.translate(apex.x, apex.y)
    ctx.rotate(f.giro * 0.15)

    const n = f.petalos
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU
      const pulso = 1 + Math.sin(t * 2 + i * 1.7 + f.fase) * 0.035
      const largo = r * 1.05 * pulso
      const ancho = r * 0.34

      ctx.save()
      ctx.rotate(ang)

      const grad = ctx.createLinearGradient(0, 0, 0, -largo)
      grad.addColorStop(0, paleta.ambar)
      grad.addColorStop(0.45, paleta.oro)
      grad.addColorStop(1, paleta.oroClaro)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(0, -largo * 0.62, ancho, largo * 0.62, 0, 0, TAU)
      ctx.fill()

      // brillo del borde
      ctx.strokeStyle = 'rgba(255,255,235,0.35)'
      ctx.lineWidth = Math.max(0.5, esc * 0.8)
      ctx.stroke()

      ctx.restore()
    }

    // centro
    const centro = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.55)
    centro.addColorStop(0, '#6B4A12')
    centro.addColorStop(0.6, '#8C6416')
    centro.addColorStop(1, paleta.ambar)
    ctx.fillStyle = centro
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.5, 0, TAU)
    ctx.fill()

    // puntitos de polen
    ctx.fillStyle = 'rgba(255,246,220,0.55)'
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + f.fase
      ctx.beginPath()
      ctx.arc(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22, Math.max(0.6, r * 0.06), 0, TAU)
      ctx.fill()
    }

    ctx.restore()
  }

  ctx.restore()
}
