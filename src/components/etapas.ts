export type Etapa = 'sobre' | 'intro' | 'reel' | 'jardin' | 'ramo' | 'carta'
export type Fx = 'leak' | 'glitch' | 'whip' | 'flash' | 'dissolve' | 'bloom'

export const ORDEN: Etapa[] = ['sobre', 'intro', 'reel', 'jardin', 'ramo', 'carta']

export const NOMBRES: Record<Etapa, string> = {
  sobre: 'Sobre',
  intro: 'Mensaje',
  reel: 'Edit',
  jardin: 'Jardín',
  ramo: 'Ramo',
  carta: 'Carta',
}
