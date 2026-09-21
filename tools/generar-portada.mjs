/**
 * Genera la portada que se ve cuando compartes el link (og:image).
 *   node tools/generar-portada.mjs
 * Salida: public/og-cover.png  (1200 × 630)
 *
 * Es opcional: si prefieres una foto tuya, reemplaza ese archivo.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const W = 1200
const H = 630
const px = Buffer.alloc(W * H * 4)

/* PRNG determinista para que la portada salga siempre igual */
let semilla = 20250921
const rnd = () => {
  semilla = (semilla * 1664525 + 1013904223) % 4294967296
  return semilla / 4294967296
}

function pintar(x, y, r, g, b, a = 1) {
  // ¡Importante! El Buffer solo acepta índices enteros.
  x = Math.round(x)
  y = Math.round(y)
  if (x < 0 || y < 0 || x >= W || y >= H) return
  const i = (y * W + x) * 4
  px[i] = Math.round(px[i] * (1 - a) + r * a)
  px[i + 1] = Math.round(px[i + 1] * (1 - a) + g * a)
  px[i + 2] = Math.round(px[i + 2] * (1 - a) + b * a)
  px[i + 3] = 255
}

function elipse(cx, cy, rx, ry, rot, r, g, b, a = 1) {
  const cos = Math.cos(-rot)
  const sin = Math.sin(-rot)
  const alcance = Math.ceil(Math.max(rx, ry)) + 2
  for (let y = cy - alcance; y <= cy + alcance; y++) {
    for (let x = cx - alcance; x <= cx + alcance; x++) {
      const dx = x - cx
      const dy = y - cy
      const lx = dx * cos - dy * sin
      const ly = dx * sin + dy * cos
      const d = (lx / rx) ** 2 + (ly / ry) ** 2
      if (d <= 1) {
        // borde suave
        const a2 = d > 0.82 ? a * (1 - (d - 0.82) / 0.18) : a
        pintar(x, y, r, g, b, a2)
      }
    }
  }
}

/* ── fondo: noche cálida ── */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - W / 2) / (W / 2)
    const dy = (y - H * 0.55) / (H / 2)
    const d = Math.min(1, Math.sqrt(dx * dx + dy * dy))
    const k = 1 - d
    pintar(
      x,
      y,
      10 + 26 * k * k,
      9 + 19 * k * k,
      8 + 8 * k * k,
      1,
    )
  }
}

/* ── halo dorado central ── */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - W / 2) / (W * 0.42)
    const dy = (y - H * 0.52) / (H * 0.62)
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 1) {
      const a = (1 - d) ** 2.4 * 0.5
      pintar(x, y, 255, 196, 46, a)
    }
  }
}

/* ── estrellas / polen ── */
for (let i = 0; i < 260; i++) {
  const x = Math.floor(rnd() * W)
  const y = Math.floor(rnd() * H)
  elipse(x, y, 0.6 + rnd() * 1.6, 0.6 + rnd() * 1.6, 0, 255, 240, 200, 0.08 + rnd() * 0.4)
}

/* ── tres flores amarillas ── */
function flor(cx, cy, radio, giro, petalos) {
  for (let i = 0; i < petalos; i++) {
    const ang = giro + (i / petalos) * Math.PI * 2
    const px2 = cx + Math.cos(ang) * radio * 0.62
    const py2 = cy + Math.sin(ang) * radio * 0.62
    elipse(px2, py2, radio * 0.34, radio * 0.62, ang, 255, 196, 46, 0.95)
    elipse(px2, py2, radio * 0.24, radio * 0.46, ang, 255, 231, 155, 0.9)
  }
  elipse(cx, cy, radio * 0.42, radio * 0.42, 0, 255, 214, 110, 1)
  elipse(cx, cy, radio * 0.3, radio * 0.3, 0, 120, 82, 18, 1)
  for (let i = 0; i < 10; i++) {
    const a = rnd() * Math.PI * 2
    const rr = rnd() * radio * 0.24
    elipse(
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      radio * 0.05,
      radio * 0.05,
      0,
      255,
      246,
      220,
      0.75,
    )
  }
}

function tallo(x0, y0, x1, y1, ancho) {
  const pasos = Math.ceil(Math.hypot(x1 - x0, y1 - y0))
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos
    const x = x0 + (x1 - x0) * t + Math.sin(t * 2.2) * 16
    const y = y0 + (y1 - y0) * t
    elipse(x, y, ancho, ancho, 0, 70 + 30 * t, 106 + 30 * t, 44 + 16 * t, 0.95)
  }
}

const flores = [
  { x: 380, y: 300, r: 92, g: 0.2, p: 12 },
  { x: 600, y: 222, r: 118, g: 0.6, p: 13 },
  { x: 820, y: 300, r: 92, g: 1.0, p: 12 },
]

tallo(380, 300, 330, 640, 6)
tallo(600, 222, 600, 640, 7)
tallo(820, 300, 870, 640, 6)

elipse(316, 470, 62, 24, -0.5, 92, 122, 52, 0.9)
elipse(884, 490, 58, 22, 0.5, 92, 122, 52, 0.9)
elipse(560, 520, 54, 20, 0.35, 84, 112, 48, 0.85)

for (const f of flores) flor(f.x, f.y, f.r, f.g, f.p)

/* ── pétalos sueltos ── */
for (let i = 0; i < 34; i++) {
  const x = rnd() * W
  const y = 380 + rnd() * 250
  elipse(x, y, 6 + rnd() * 7, 3 + rnd() * 4, rnd() * Math.PI, 255, 196, 46, 0.35 + rnd() * 0.4)
}

/* ── viñeta ── */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - W / 2) / (W / 2)
    const dy = (y - H / 2) / (H / 2)
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d > 0.75) pintar(x, y, 0, 0, 0, Math.min(0.75, (d - 0.75) * 1.6))
  }
}

/* ── escribir PNG ── */
const tabla = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = tabla[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(tipo, datos) {
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length, 0)
  const t = Buffer.from(tipo, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, datos])), 0)
  return Buffer.concat([largo, t, datos, crc])
}

const crudo = Buffer.alloc((W * 4 + 1) * H)
for (let y = 0; y < H; y++) {
  crudo[y * (W * 4 + 1)] = 0
  px.copy(crudo, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4)
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8
ihdr[9] = 6
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(crudo, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

const aqui = dirname(fileURLToPath(import.meta.url))
const salida = resolve(aqui, '..', 'public', 'og-cover.png')
mkdirSync(dirname(salida), { recursive: true })
writeFileSync(salida, png)
console.log(`Portada generada: ${salida} (${(png.length / 1024).toFixed(0)} kB)`)
