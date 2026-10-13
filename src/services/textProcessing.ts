const ABREVIACOES = [
  'sr.',
  'sra.',
  'dr.',
  'dra.',
  'prof.',
  'profa.',
  'av.',
  'ltda.',
  'pág.',
  'cap.',
  'art.',
]

export function limparTexto(texto: string): string {
  return texto
    .replace(/(\p{L})-\n(\p{Ll})/gu, '$1$2')
    .replace(/\s+/g, ' ')
    .trim()
}

function terminaComAbreviacao(trecho: string): boolean {
  const ultimaPalavra = trecho.trim().split(' ').pop()?.toLowerCase() ?? ''
  return ABREVIACOES.includes(ultimaPalavra)
}

export function dividirEmFrases(texto: string): string[] {
  const limpo = limparTexto(texto)

  if (limpo === '') {
    return []
  }

  const segmentador = new Intl.Segmenter('pt-BR', { granularity: 'sentence' })
  const frases: string[] = []

  for (const { segment } of segmentador.segment(limpo)) {
    const trecho = segment.trim()

    if (trecho === '') {
      continue
    }

    const anterior = frases[frases.length - 1]

    if (anterior !== undefined && terminaComAbreviacao(anterior)) {
      frases[frases.length - 1] = `${anterior} ${trecho}`
    } else {
      frases.push(trecho)
    }
  }

  return frases
}
