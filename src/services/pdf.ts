import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export async function arquivoTemCabecalhoPdf(arquivo: File): Promise<boolean> {
  const inicio = await arquivo.slice(0, 1024).text()
  return inicio.includes('%PDF-')
}

export async function extrairTextoDaPagina(
  arquivo: File,
  numeroDaPagina: number,
): Promise<string> {
  const dados = await arquivo.arrayBuffer()
  const tarefa = getDocument({ data: dados, isEvalSupported: false })

  try {
    const pdf = await tarefa.promise

    if (numeroDaPagina < 1 || numeroDaPagina > pdf.numPages) {
      throw new Error('Número de página inválido.')
    }

    const pagina = await pdf.getPage(numeroDaPagina)
    const conteudo = await pagina.getTextContent()

    const texto = conteudo.items
      .map((item) => {
        if (!('str' in item)) {
          return ''
        }
        return item.str + (item.hasEOL ? '\n' : ' ')
      })
      .join('')

    return texto
      .replace(/[ \t]+/g, ' ')
      .replace(/ ?\n ?/g, '\n')
      .trim()
  } finally {
    await tarefa.destroy()
  }
}
