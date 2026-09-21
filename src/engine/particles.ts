/**
 * Sistema de partículas: pétalos al viento, polen brillante y ondas de agua.
 * Todo dibujado a mano en Canvas 2D (sin librerías).
 */

import type { Paleta } from '../config'

const TAU = Math.PI * 2

type Petalo = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  tam: number
  alfa: number
  /** valor de alfa ya calculado (se desvanece al caer, si toca) */
  alfaActual: number
  fase: number
  tono: number
  /** true en la lluvia del final: se vuelven transparentes al bajar */
  desvanecer: boolean
}

type Chispa = {
  x: number
  y: number
  vx: number
  vy: number
  vida: number
  vidaMax: number
  tam: number
}

type Onda = {
  x: number
  y: number
  r: number
  rMax: number
  alfa: number
}

export class Particulas {
  petalos: Petalo[] = []
  chispas: Chispa[] = []
  ondas: Onda[] = []
  private paleta: Paleta

  constructor(paleta: Paleta) {
    this.paleta = paleta
  }

  /** Suelta n pétalos desde un punto. */
  soltarPetalos(x: number, y: number, n = 1, fuerza = 1) {
    for (let i = 0; i < n; i++) {
      this.petalos.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 34 * fuerza,
        vy: -14 - Math.random() * 26 * fuerza,
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * 2.4,
        tam: 3 + Math.random() * 4,
        alfa: 0.55 + Math.random() * 0.45,
        alfaActual: 0.8,
        fase: Math.random() * TAU,
        tono: Math.random(),
        desvanecer: false,
      })
    }
  }

  /** Lluvia de pétalos desde arriba (para el final). */
  lluvia(ancho: number, n = 40) {
    for (let i = 0; i < n; i++) {
      this.petalos.push({
        x: Math.random() * ancho,
        y: -20 - Math.random() * 160,
        vx: (Math.random() - 0.5) * 26,
        vy: 22 + Math.random() * 34,
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * 2.2,
        tam: 3 + Math.random() * 5,
        alfa: 0.5 + Math.random() * 0.5,
        alfaActual: 0.8,
        fase: Math.random() * TAU,
        tono: Math.random(),
        desvanecer: true,
      })
    }
  }

  /** Chispas doradas (al florecer, al abrir el sobre…). */
  brillar(x: number, y: number, n = 12) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU
      const v = 20 + Math.random() * 70
      this.chispas.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 18,
        vida: 0,
        vidaMax: 0.7 + Math.random() * 0.9,
        tam: 1 + Math.random() * 2.4,
      })
    }
  }

  /** Onda expansiva en el suelo al tocar. */
  onda(x: number, y: number) {
    this.ondas.push({ x, y, r: 4, rMax: 70 + Math.random() * 30, alfa: 0.5 })
  }

  update(dt: number, t: number, ancho: number, alto: number) {
    /* pétalos */
    for (let i = this.petalos.length - 1; i >= 0; i--) {
      const p = this.petalos[i]
      p.vy += 26 * dt // gravedad suave
      p.vx += Math.sin(t * 1.4 + p.fase) * 22 * dt // viento
      p.vx *= 0.995
      p.vy *= 0.995
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt

      /* Los pétalos de la lluvia final se van apagando a medida que bajan:
         a partir de la mitad de la pantalla pierden opacidad poco a poco
         y se desvanecen del todo antes de tocar el borde. */
      if (p.desvanecer) {
        const inicio = alto * 0.5
        const fin = alto * 0.97
        const k = p.y <= inicio ? 1 : Math.max(0, 1 - (p.y - inicio) / (fin - inicio))
        p.alfaActual = p.alfa * k
      } else {
        p.alfaActual = p.alfa
      }

      if (p.y > alto + 40 || p.x < -60 || p.x > ancho + 60 || p.alfaActual < 0.02) {
        this.petalos.splice(i, 1)
      }
    }

    /* chispas */
    for (let i = this.chispas.length - 1; i >= 0; i--) {
      const c = this.chispas[i]
      c.vida += dt
      c.vy += 18 * dt
      c.vx *= 0.97
      c.vy *= 0.97
      c.x += c.vx * dt
      c.y += c.vy * dt
      if (c.vida >= c.vidaMax) this.chispas.splice(i, 1)
    }

    /* ondas */
    for (let i = this.ondas.length - 1; i >= 0; i--) {
      const o = this.ondas[i]
      o.r += (o.rMax - o.r) * Math.min(1, dt * 6)
      o.alfa *= 0.94
      if (o.alfa < 0.01) this.ondas.splice(i, 1)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { oro, oroClaro, ambar } = this.paleta

    /* ondas */
    for (const o of this.ondas) {
      ctx.save()
      ctx.strokeStyle = `rgba(255,196,46,${o.alfa})`
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.ellipse(o.x, o.y, o.r, o.r * 0.28, 0, 0, TAU)
      ctx.stroke()
      ctx.restore()
    }

    /* pétalos */
    for (const p of this.petalos) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.alfaActual
      const color = p.tono > 0.66 ? oroClaro : p.tono > 0.33 ? oro : ambar
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(0, 0, p.tam, p.tam * 0.55, 0, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = 'rgba(120,80,10,0.25)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()
    }

    /* chispas */
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (const c of this.chispas) {
      const k = 1 - c.vida / c.vidaMax
      ctx.globalAlpha = Math.max(0, k)
      ctx.fillStyle = oroClaro
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.tam * k, 0, TAU)
      ctx.fill()
    }
    ctx.restore()
  }

  get vacio() {
    return this.petalos.length === 0 && this.chispas.length === 0 && this.ondas.length === 0
  }
}
