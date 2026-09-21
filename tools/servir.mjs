/**
 * Servidor estático mínimo para ver la carpeta dist/ sin dependencias.
 *   node tools/servir.mjs [puerto]
 *
 * Equivale a `npm run preview`, pero sin arrancar esbuild.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(aqui, '..', 'dist')
const puerto = Number(process.argv[2] ?? 4173)

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

const servir = async (res, ruta) => {
  try {
    const datos = await readFile(ruta)
    res.writeHead(200, {
      'Content-Type': tipos[extname(ruta).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    res.end(datos)
    return true
  } catch {
    return false
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0])
  const rel = normalize(url).replace(/^(\.\.[/\\])+/, '')
  const candidato = join(raiz, rel)

  if (!candidato.startsWith(raiz)) {
    res.writeHead(403).end('Prohibido')
    return
  }

  try {
    const info = await stat(candidato)
    if (info.isDirectory()) {
      if (await servir(res, join(candidato, 'index.html'))) return
    } else if (await servir(res, candidato)) {
      return
    }
  } catch {
    /* no existe: cae al index (es una sola página) */
  }

  if (!(await servir(res, join(raiz, 'index.html')))) {
    res.writeHead(404).end('No encontrado. ¿Ejecutaste `npm run build`?')
  }
}).listen(puerto, '127.0.0.1', () => {
  console.log(`Sirviendo ${raiz} en http://127.0.0.1:${puerto}`)
})
