import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { arquivoTemCabecalhoPdf, extrairTextoDaPagina } from './services/pdf'

const TAMANHO_MAXIMO_MB = 50
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024

function App() {
  const [nomeDoArquivo, setNomeDoArquivo] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [textoDaPagina, setTextoDaPagina] = useState('')

  async function aoEscolherArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]

    if (!arquivo) {
      return
    }

    setNomeDoArquivo('')
    setTextoDaPagina('')
    setMensagemDeErro('')

    if (arquivo.type !== 'application/pdf') {
      setMensagemDeErro(
        'O arquivo escolhido não é um PDF. Escolha um arquivo com extensão .pdf.',
      )
      return
    }

    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      setMensagemDeErro(
        `O arquivo é grande demais. O tamanho máximo é ${TAMANHO_MAXIMO_MB} MB.`,
      )
      return
    }

    setCarregando(true)

    try {
      if (!(await arquivoTemCabecalhoPdf(arquivo))) {
        setMensagemDeErro('O conteúdo deste arquivo não parece ser um PDF válido.')
        return
      }

      const texto = await extrairTextoDaPagina(arquivo, 1)
      setNomeDoArquivo(arquivo.name)

      if (texto === '') {
        setMensagemDeErro(
          'Não encontrei texto na primeira página. O PDF pode ser uma imagem escaneada, o que ainda não é suportado.',
        )
        return
      }

      setTextoDaPagina(texto)
    } catch (erro) {
      console.error('Erro ao ler o PDF:', erro)
      setMensagemDeErro(
        'Não foi possível ler este PDF. Ele pode estar corrompido ou protegido por senha.',
      )
    } finally {
      setCarregando(false)
    }
  }

  let mensagemDeStatus = ''
  if (carregando) {
    mensagemDeStatus = 'Lendo o documento...'
  } else if (nomeDoArquivo) {
    mensagemDeStatus = `Arquivo escolhido: ${nomeDoArquivo}`
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header>
        <h1>Leitor de PDF</h1>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <h2>Escolha um documento</h2>

        <label htmlFor="campo-pdf">Arquivo PDF</label>
        <input
          id="campo-pdf"
          type="file"
          accept="application/pdf,.pdf"
          onChange={aoEscolherArquivo}
        />

        <p role="status">{mensagemDeStatus}</p>

        {mensagemDeErro && <p role="alert">{mensagemDeErro}</p>}

        {textoDaPagina && (
          <section aria-labelledby="titulo-texto">
            <h2 id="titulo-texto">Texto da página 1</h2>
            <p>{textoDaPagina}</p>
          </section>
        )}
      </main>
    </>
  )
}

export default App
