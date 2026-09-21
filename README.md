# 🌻 21 Flores Amarillas · para Shantall

Experiencia web interactiva de una sola página, con estética de *video edit*:
sobre que se abre, mensaje que se escribe solo, planos de texto con transiciones,
un jardín donde **ella planta 21 flores** y cada una le dice algo, un ramo
descargable y una carta final.

**Todo se personaliza desde un solo archivo: `src/config.ts`.**

---

## 1 · Probar en tu computadora

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador. Ábrelo también en el celular
(misma red wifi) usando la dirección "Network" que imprime la consola, porque
**el 90% de la gente lo va a ver desde el teléfono**.

Para ver la versión final compilada:

```bash
npm run build     # genera la carpeta dist/
npm run preview   # la sirve en http://localhost:4173
```

### Atajos para revisar (solo para ti, no los ve ella)

| URL | Qué hace |
|---|---|
| `?etapa=sobre` | Empieza en una etapa concreta: `sobre`, `intro`, `reel`, `jardin`, `ramo`, `carta` |
| `?flores=21` | Entra al jardín con las flores ya plantadas |

Se pueden combinar: `http://localhost:5173/?etapa=jardin&flores=21`

---

## 2 · Personalizar (lo único que tienes que tocar)

Abre `src/config.ts` y cambia:

| Campo | Qué es |
|---|---|
| `nombre` | El nombre de ella. Aparece en el sobre, el jardín y el ramo. |
| `tuNombre` | Tu nombre, para la firma de la carta. |
| `fechaInicio` | `'2026-02-25'` → alimenta el contador de días juntos. |
| `etiquetaDias` | El texto que acompaña al contador, al final de la carta. |
| `totalFlores` | Cuántas flores hay que plantar (por defecto **21**). |
| `mensajeInicial` | Las frases de la intro, que se escriben letra por letra. |
| `escenas` | Los planos del "edit" (2 líneas por plano). |
| `mensajes` | **Los 21 mensajes, uno por flor.** |
| `carta` | La carta final. Separa párrafos con una línea en blanco. |
| `musica` / `volumen` | Ruta y volumen de la canción. |
| `paleta` | Los colores, si quieres cambiar el dorado o el fondo. |

### La música

1. Copia tu canción a `public/music/cancion.mp3`
2. Si le pones otro nombre, cámbialo en `config.musica`.

La música **arranca con el primer toque** (los navegadores no permiten que suene
sola). Si el archivo no existe, el botón se desactiva solo y no se rompe nada.

### La portada del link (opcional pero recomendado)

Cuando le mandes el link por WhatsApp, se ve una tarjeta con el título.
Si quieres que tenga imagen, guarda una como `public/og-cover.jpg`
(1200 × 630 px). Si no la pones, solo se ve el texto.

---

## 3 · Subirlo a GitHub

Desde esta carpeta:

```bash
git init
git add .
git commit -m "21 flores amarillas para Shantall"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/flores-amarillas-shantall.git
git push -u origin main
```

> Crea antes el repositorio vacío en GitHub (puede ser **privado**).
> Cambia `TU-USUARIO` por tu usuario.

---

## 4 · Publicarlo en Render

### Opción A — con el `render.yaml` (automático)

1. Entra a [render.com](https://render.com) y crea una cuenta con GitHub.
2. **New +** → **Blueprint**.
3. Elige el repositorio. Render lee `render.yaml` y configura todo solo.
4. **Apply**. Espera 1–2 minutos.

### Opción B — a mano

1. **New +** → **Static Site** → conecta el repositorio.
2. Configura:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. **Create Static Site**.

Listo: te queda una URL tipo
`https://flores-amarillas-shantall.onrender.com`

Cada vez que hagas `git push`, Render vuelve a publicar solo.

---

## 5 · Cómo se usa (lo que va a vivir ella)

| Etapa | Qué pasa |
|---|---|
| **Sobre** | Toca el sobre y se abre con un destello dorado. |
| **Mensaje** | El texto se escribe solo. Un toque lo acelera. |
| **Edit** | Planos de texto con transiciones (light leak, glitch, whip). Avanza solo, o ella toca / usa las flechas. |
| **Jardín** | Toca la tierra: crece una flor y le sale un mensaje. 21 en total. |
| **Ramo** | Las 21 flores juntas con su nombre. Se puede descargar como PNG. |
| **Carta** | La carta, el contador de días y un botón "Te amo" que suelta pétalos. |

La barra de abajo es el índice: puede volver a cualquier etapa ya visitada.

---

## 6 · Estructura

```
src/
├─ config.ts              ⭐ todo lo personalizable
├─ App.tsx                máquina de etapas + transiciones
├─ styles/global.css      estética de cine (grano, viñeta, letterbox)
├─ engine/
│  ├─ flower.ts           dibujo de las flores (tallo, hojas, corola)
│  └─ particles.ts        pétalos, polen y ondas
└─ components/
   ├─ Envelope.tsx        el sobre
   ├─ Typewriter.tsx      el mensaje letra por letra
   ├─ MemoryReel.tsx      el edit
   ├─ GardenCanvas.tsx    el jardín interactivo
   ├─ Bouquet.tsx         el ramo descargable
   ├─ FinalLetter.tsx     la carta final
   ├─ StageNav.tsx        la barra de etapas
   └─ AudioToggle.tsx     la música
```

Sin backend, sin base de datos, sin claves de API: es un sitio estático.

---

Hecho con cariño. Que le guste. 💛
