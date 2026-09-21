/**
 * ⭐⭐⭐  ARCHIVO DE PERSONALIZACIÓN  ⭐⭐⭐
 *
 * Todo lo que quieras cambiar está AQUÍ. No hace falta tocar ningún otro archivo.
 * Guarda, recarga la página, y listo.
 */

export const config = {
  /* ────────────────────────────────────────────────────────────
     1. DATOS BÁSICOS
     ──────────────────────────────────────────────────────────── */

  /** Su nombre (aparece en el sobre, en el jardín, en el ramo y en la carta) */
  nombre: 'Shantall',

  /** Tu nombre, para la firma de la carta */
  tuNombre: 'Miguel Angel',

  /** El día en que empezaron (25/02/2026). Alimenta el contador de días. */
  fechaInicio: '2026-02-25',

  /** El texto que acompaña al contador de días, al final de la carta */
  etiquetaDias: 'días juntos, mi princesa',

  /** Cuántas flores hay que plantar para desbloquear el ramo */
  totalFlores: 21,

  /* ────────────────────────────────────────────────────────────
     2. ETAPA 1 · EL PRIMER MENSAJE (se escribe letra por letra)
     ──────────────────────────────────────────────────────────── */

  mensajeInicial: [
    'Shantall...',
    'Hay 21 flores amarillas esperándote.',
    'Pero no puedo entregártelas yo.',
    'Tienes que plantarlas tú.',
    'Toca la tierra y mira lo que pasa.',
  ],

  /* ────────────────────────────────────────────────────────────
     3. ETAPA 2 · EL "EDIT" (planos de texto con transiciones)
     Cada escena es un plano. Cambia libremente las líneas.
     ──────────────────────────────────────────────────────────── */

  escenas: [
    { linea1: 'Hay días', linea2: 'que son amarillos' },
    { linea1: 'Y hay personas', linea2: 'que son la primavera entera' },
    { linea1: 'Contigo', linea2: 'hasta el 21 de septiembre' },
    { linea1: 'se queda', linea2: 'corto' },
    { linea1: 'Así que hoy', linea2: 'te traigo un jardín' },
    { linea1: 'Shantall', linea2: 'esto es para ti' },
  ],

  /* ────────────────────────────────────────────────────────────
     4. LOS 21 MENSAJES · uno por flor (los tuyos, Miguel Angel)
     ──────────────────────────────────────────────────────────── */

  mensajes: [
    'Te amo con todo mi cucharón',
    'Me encantan tus ojitos precisos',
    'No dejo de pensar en ti, mi princesa',
    'Eres la mejor, te adoro demasiado',
    'Juntos podremos lograr todas nuestras metas',
    'Eres hermosisisisisisima, nunca lo dudes',
    'Contigo hice cosas que antes no me habría creído capaz',
    'Amo tus gestos, risa, sonrisa, voz, mirada, cabello, cariños, afectos, todo',
    'Eres mi compañera de juegos y de la vida',
    'La vida tiene mucho más color cuando estoy junto a ti, preciosa',
    'Contigo sí me animo a formar una familia',
    'Contigo deseo todo y todo lo tendremos',
    'Hacer planes a futuro y escucharte tan entusiasmada me hace muy feliz',
    'Adoro cada momento que vivimos juntos',
    'He mejorado como persona gracias a ti, mi amor',
    'Eres mi niña, fue tu primer apodo y nunca dejarás de serlo',
    'Amo que nos acompañemos así no tengamos que decir nada',
    'Amo que los silencios no sean incómodos para nosotros',
    'Cada que pienso en ti se me dibuja una sonrisa y me siento feliz',
    'Adoro lo nuestro y que se vaya construyendo más y más',
    'Eres mi felicidad, mi corazón, mi mundo entero, vida mía',
  ],

  /* ────────────────────────────────────────────────────────────
     5. ETAPA 5 · LA CARTA FINAL
     Separa los párrafos con una línea en blanco.
     La firma y el contador de días se añaden solos al final.
     ──────────────────────────────────────────────────────────── */

  carta: `Mi amada Shantall

No sabía muy bien cómo hacer especial este día, así que te hice un jardín.

Cada flor de ahí la plantaste tú, y cada una tiene algo que llevo siempre en mis pensamientos. Ninguna es un relleno, hasta me faltaron flores.

Me gusta la vida contigo. Me gustan los días comunes, los planes que hacemos, así salgan mal en alguna cosita, las conversaciones de madrugada y la forma en que te ríes cuando digo algo, hacemos algo o alguna cosa que te da mucha gracia, me encanta.

Hoy es 21 de septiembre y la tradición dice flores amarillas. Yo te doy 21, una por cada cosa que siempre está en mi pensamiento.

Gracias por estar conmigo. Gracias por quedarte. Te amo con todo mi corazón.`,

  /* ────────────────────────────────────────────────────────────
     6. MÚSICA
     La canción va en  public/music/cancion.mp3
     Si no hay archivo, el botón de música se desactiva solo.
     ──────────────────────────────────────────────────────────── */

  musica: '/music/cancion.mp3',
  volumen: 0.55,

  /* ────────────────────────────────────────────────────────────
     7. COLORES (por si quieres cambiar la paleta)
     ──────────────────────────────────────────────────────────── */

  paleta: {
    fondo: '#0A0908',
    fondo2: '#171009',
    oro: '#FFC42E',
    oroClaro: '#FFE79B',
    ambar: '#E8A100',
    crema: '#FFF6DC',
    verde: '#5C7A34',
    verdeOscuro: '#2E401C',
  },
}

export type Config = typeof config
export type Paleta = Config['paleta']
