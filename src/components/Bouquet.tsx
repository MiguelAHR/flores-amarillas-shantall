import { useEffect, useRef, useState } from 'react'
import { crearFlor, dibujarFlor } from '../engine/flower'
import type { Paleta } from '../config'

type Props = {
  nombre: string
  paleta: Paleta
  total: number
  onLeerCarta: () => void
  onVolver: () => void
}

const W = 1000
const H = 1250
const TAU = Math.PI * 2

/** Escribe un texto centrado, encogiendo la letra si no entra. */
function textoAjustado(
  ctx: CanvasRenderingContext2D,
  texto: string,
  fuente: string,
  tamano: number,
  maxAncho: number,
) {
  let t = tamano
  ctx.font = fuente.replace('__PX__', String(t))
  while (ctx.measureText(texto).width > maxAncho && t > 12) {
    t -= 4
    ctx.font = fuente.replace('__PX__', String(t))
  }
}

/** Dibuja el ramo completo: las flores, el papel y el lazo. */
function dibujarRamo(
  ctx: CanvasRenderingContext2D,
  paleta: Paleta,
  total: number,
  nombre: string,
) {
  /* fondo */
  const fondo = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, H * 0.9)
  fondo.addColorStop(0, '#1B1409')
  fondo.addColorStop(0.55, '#100C07')
  fondo.addColorStop(1, '#070605')
  ctx.fillStyle = fondo
  ctx.fillRect(0, 0, W, H)

  /* halo cálido detrás */
  const halo = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.62)
  halo.addColorStop(0, 'rgba(255,196,46,0.22)')
  halo.addColorStop(0.5, 'rgba(255,196,46,0.06)')
  halo.addColorStop(1, 'rgba(255,196,46,0)')
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, W, H)

  /* puntitos dorados de fondo */
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * W
    const y = Math.random() * H
    ctx.fillStyle = `rgba(255,224,140,${0.05 + Math.random() * 0.3})`
    ctx.beginPath()
    ctx.arc(x, y, 0.6 + Math.random() * 1.9, 0, TAU)
    ctx.fill()
  }

  /* pétalos sueltos cayendo */
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * W
    const y = Math.random() * H * 0.95
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.random() * TAU)
    ctx.globalAlpha = 0.25 + Math.random() * 0.5
    ctx.fillStyle = Math.random() > 0.5 ? paleta.oro : paleta.ambar
    ctx.beginPath()
    ctx.ellipse(0, 0, 5 + Math.random() * 8, 3 + Math.random() * 5, 0, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  /* nombre arriba */
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = paleta.oroClaro
  ctx.shadowColor = 'rgba(255,196,46,0.65)'
  ctx.shadowBlur = 45
  textoAjustado(ctx, `Para ${nombre}`, "__PX__px 'Great Vibes', cursive", 140, W * 0.84)
  ctx.fillText(`Para ${nombre}`, W * 0.5, H * 0.145)
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,246,220,0.55)'
  ctx.font = "500 26px 'Inter', sans-serif"
  ctx.fillText(`${total} FLORES AMARILLAS · 21 DE SEPTIEMBRE`, W * 0.5, H * 0.195)
  ctx.restore()

  /* ── flores en abanico ── */
  const base = { x: W * 0.5, y: H * 0.8 }
  type Plan = { ang: number; largo: number; dist: number; i: number }
  const plan: Plan[] = []

  for (let i = 0; i < total; i++) {
    const u = total === 1 ? 0.5 : i / (total - 1)
    const ang = (-1 + 2 * u) * (Math.PI * 0.345)
    const dist = 1 - Math.abs(u - 0.5) * 1.18
    plan.push({ ang, largo: H * (0.29 + 0.21 * dist), dist, i })
  }

  // las de afuera primero (quedan detrás)
  plan.sort((a, b) => Math.abs(b.ang) - Math.abs(a.ang))

  plan.forEach((p) => {
    const flor = crearFlor(0, 0, {
      altura: p.largo,
      crecimiento: 1,
      floracion: 1,
      fase: (p.i / total) * TAU,
      balanceo: 0,
      petalos: 11 + (p.i % 4),
      tamano: 26 + p.dist * 12,
      giro: p.ang,
      escala: 0.9 + p.dist * 0.3,
    })

    ctx.save()
    ctx.translate(base.x, base.y)
    ctx.rotate(p.ang)
    dibujarFlor(ctx, flor, 0, paleta, { glow: 0.6 })
    ctx.restore()
  })

  /* ── papel que envuelve los tallos ── */
  const boca = W * 0.31
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(base.x - boca, H * 0.695)
  ctx.quadraticCurveTo(base.x - boca * 1.3, H * 0.87, base.x - W * 0.125, H * 0.985)
  ctx.lineTo(base.x + W * 0.125, H * 0.985)
  ctx.quadraticCurveTo(base.x + boca * 1.3, H * 0.87, base.x + boca, H * 0.695)
  ctx.closePath()

  const papel = ctx.createLinearGradient(base.x - boca, H * 0.7, base.x + boca, H)
  papel.addColorStop(0, '#E8DCC0')
  papel.addColorStop(0.35, '#F6EFDC')
  papel.addColorStop(0.62, '#D9C9A4')
  papel.addColorStop(1, '#BFAE86')
  ctx.fillStyle = papel
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 14
  ctx.fill()
  ctx.restore()

  /* pliegues */
  ctx.save()
  ctx.strokeStyle = 'rgba(140,120,80,0.4)'
  ctx.lineWidth = 2
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath()
    ctx.moveTo(base.x + k * W * 0.075, H * 0.72)
    ctx.quadraticCurveTo(
      base.x + k * W * 0.12,
      H * 0.86,
      base.x + k * W * 0.085,
      H * 0.975,
    )
    ctx.stroke()
  }
  ctx.restore()

  /* ── lazo ── */
  const ly = H * 0.9
  ctx.save()
  const cinta = ctx.createLinearGradient(0, ly - 26, 0, ly + 26)
  cinta.addColorStop(0, '#FFE79B')
  cinta.addColorStop(0.5, '#E8A100')
  cinta.addColorStop(1, '#B87B00')
  ctx.fillStyle = cinta
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 18
  ctx.fillRect(base.x - W * 0.16, ly - 20, W * 0.32, 40)
  ctx.restore()

  /* moño */
  ctx.save()
  ctx.translate(base.x, ly)
  ctx.fillStyle = '#FFC42E'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 16
  for (const lado of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(lado * 46, 0, 48, 30, lado * 0.4, 0, TAU)
    ctx.fill()
  }
  ctx.fillStyle = '#E8A100'
  ctx.beginPath()
  ctx.arc(0, 0, 20, 0, TAU)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,246,220,0.4)'
  ctx.font = "400 20px 'Inter', sans-serif"
  ctx.fillText('21 · 09', W * 0.5, H * 0.975)
  ctx.restore()
}

/**
 * ETAPA 4 · El ramo con las 21 flores, descargable como imagen.
 */
export default function Bouquet({ nombre, paleta, total, onLeerCarta, onVolver }: Props) {
  const refLienzo = useRef<HTMLCanvasElement | null>(null)
  const refMarco = useRef<HTMLDivElement | null>(null)
  const [listo, setListo] = useState(false)

  /* Encaje del lienzo: calculamos el tamaño a mano para que nunca se salga
     de la pantalla, sin depender de reglas CSS de proporción. */
  useEffect(() => {
    const marco = refMarco.current
    const cv = refLienzo.current
    if (!marco || !cv) return

    const ajustar = () => {
      const caja = marco.getBoundingClientRect()
      if (caja.width < 4 || caja.height < 4) return
      const escala = Math.min(caja.width / W, caja.height / H)
      cv.style.width = `${Math.floor(W * escala)}px`
      cv.style.height = `${Math.floor(H * escala)}px`
    }

    ajustar()
    const ro = new ResizeObserver(ajustar)
    ro.observe(marco)
    window.addEventListener('orientationchange', ajustar)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', ajustar)
    }
  }, [])

  useEffect(() => {
    const cv = refLienzo.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const pintar = () => {
      dibujarRamo(ctx, paleta, total, nombre)
      setListo(true)
    }

    // esperamos a que carguen las tipografías para que el texto salga bien
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(pintar).catch(pintar)
    } else {
      pintar()
    }
  }, [paleta, total, nombre])

  const descargar = () => {
    const cv = refLienzo.current
    if (!cv) return
    const enlace = document.createElement('a')
    enlace.download = `flores-amarillas-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`
    enlace.href = cv.toDataURL('image/png')
    document.body.appendChild(enlace)
    enlace.click()
    document.body.removeChild(enlace)
  }

  return (
    <div className="etapa ramo">
      <div className="ramo__marco" ref={refMarco}>
        <canvas
          ref={refLienzo}
          width={W}
          height={H}
          className="ramo__lienzo"
          aria-label={`Ramo de ${total} flores amarillas para ${nombre}`}
        />
      </div>

      <div className="ramo__acciones">
        <button className="boton boton--oro" onClick={descargar} disabled={!listo}>
          Descargar mi ramo
        </button>
        <button className="boton boton--fantasma" onClick={onLeerCarta}>
          Leer la carta
        </button>
        <button className="boton boton--texto" onClick={onVolver}>
          Volver al jardín
        </button>
        <p className="ramo__nota">Se guarda como imagen PNG en tu teléfono</p>
      </div>
    </div>
  )
}
