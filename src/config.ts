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

  /** Su nombre (aparece en el sobre, en el ramo y en la carta) */
  nombre: 'Shantall',

  /** Tu nombre, para la firma de la carta */
  tuNombre: 'Tu nombre',

  /** El día en que empezaron, formato AAAA-MM-DD. Sirve para el contador de días. */
  fechaInicio: '2024-01-01',

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
     4. LOS 21 MENSAJES · uno por flor
     Reemplaza estos ejemplos por los tuyos (uno por línea).
     Si pones menos de 21, se repiten en bucle.
     ──────────────────────────────────────────────────────────── */

  mensajes: [
    'Eres lo primero que pienso cuando algo me sale bien.',
    'Contigo hasta el silencio se siente cómodo.',
    'Tienes una risa que me arregla el día entero.',
    'Me gusta cómo cuentas las cosas que te emocionan.',
    'Si pudiera elegir un lugar seguro, elegiría tu lado.',
    'Te miro y se me olvida de qué estaba hablando.',
    'Gracias por quedarte los días en que no soy fácil.',
    'Eres mi plan favorito para cualquier día libre.',
    'Me enseñas cosas sin darte cuenta.',
    'Tu nombre me suena a casa.',
    'Cada 21 me acuerdo de que te elegí a ti.',
    'Me haces querer ser mejor, sin pedírmelo.',
    'Los días contigo no alcanzan nunca.',
    'Eres la parte buena de todas mis historias.',
    'Me gusta que seas tú la última persona con la que hablo.',
    'Tengo mil razones y todas empiezan contigo.',
    'No sé cómo lo haces, pero siempre vuelvo a ti.',
    'Contigo aprendí que el amor también es tranquilo.',
    'Ojalá la vida me dé muchos 21 de septiembre contigo.',
    'Te amo en los días bonitos y en los otros también.',
    'Y esta última flor es la más sincera: quédate conmigo.',
  ],

  /* ────────────────────────────────────────────────────────────
     5. ETAPA 5 · LA CARTA FINAL
     Separa los párrafos con una línea en blanco.
     ──────────────────────────────────────────────────────────── */

  carta: `Shantall:

No sabía muy bien cómo decirte todo esto, así que te hice un jardín.

Cada flor de ahí la plantaste tú, y cada una tiene algo que llevo tiempo queriendo decirte. Léelas despacio, porque ninguna es un relleno.

Me gusta la vida contigo. Me gustan los días comunes, los planes que salen mal, las conversaciones a las 3 de la mañana y la forma en que te ríes cuando algo te da mucha gracia.

Hoy es 21 de septiembre y la tradición dice flores amarillas. Yo te doy 21, una por cada cosa que no me alcanza el tiempo para explicarte.

Gracias por estar. Gracias por quedarte.`,

  /* ────────────────────────────────────────────────────────────
     6. MÚSICA
     Deja tu canción en  public/music/cancion.mp3
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
