import { useState } from 'react'
import type { ChangeEvent } from 'react'

const TAMANHO_MAXIMO_MB = 50
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024

function App() {
  const [nomeDoArquivo, setNomeDoArquivo] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')

  function aoEscolherArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]

    if (!arquivo) {
      return
    }

    if (arquivo.type !== 'application/pdf') {
      setNomeDoArquivo('')
      setMensagemDeErro(
        'O arquivo escolhido não é um PDF. Escolha um arquivo com extensão .pdf.',
      )
      return
    }

    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      setNomeDoArquivo('')
      setMensagemDeErro(
        `O arquivo é grande demais. O tamanho máximo é ${TAMANHO_MAXIMO_MB} MB.`,
      )
      return
    }

    setMensagemDeErro('')
    setNomeDoArquivo(arquivo.name)
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

        <p aria-live="polite">
          {nomeDoArquivo ? `Arquivo escolhido: ${nomeDoArquivo}` : ''}
        </p>

        {mensagemDeErro && <p role="alert">{mensagemDeErro}</p>}
      </main>
    </>
  )
}

export default App
