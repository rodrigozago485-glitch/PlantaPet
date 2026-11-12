
import { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
import "./AssistenteIA.css";

function AssistenteIA({ planta, umidade, aoFechar }) {
  const [mensagens, setMensagens] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou a PlantaPet AI, sua assistente inteligente de jardinagem! 🌱\n\nPosso ajudar com rega, iluminação, adubação, doenças e muito mais.\n\nO que você gostaria de saber hoje?",
    },
  ]);

  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const finalMensagensRef = useRef(null);

  useEffect(() => {
    finalMensagensRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens, carregando]);

  async function enviarMensagem(texto = pergunta) {
    const textoLimpo = texto.trim();

    if (!textoLimpo || carregando) return;

    const novasMensagens = [
      ...mensagens,
      {
        role: "user",
        content: textoLimpo,
      },
    ];

    setMensagens(novasMensagens);
    setPergunta("");
    setErro("");
    setCarregando(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "assistente-ia",
        {
          body: {
            mensagens: novasMensagens
              .filter((mensagem) => mensagem.role !== "system")
              .map(({ role, content }) => ({ role, content })),

            planta: planta
              ? {
                  nome: planta.nome,
                  tipo: planta.tipo,
                  umidade:
                    Number.isFinite(Number(umidade))
                      ? Number(umidade)
                      : null,
                  umidadeIdeal:
                    planta.tipo === "Samambaia"
                      ? "50% - 70%"
                      : planta.tipo === "Suculenta"
                        ? "20% - 40%"
                        : planta.tipo === "Cacto"
                          ? "15% - 30%"
                          : "40% - 60%",
                }
              : null,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.resposta) {
        throw new Error("A assistente não retornou uma resposta.");
      }

      setMensagens((atuais) => [
        ...atuais,
        {
          role: "assistant",
          content: data.resposta,
        },
      ]);
    } catch (erro) {
      console.error("Erro na PlantaPet AI:", erro);

      setErro(
        erro.message ||
          "Não foi possível conversar com a assistente. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  function lidarComTecla(evento) {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      enviarMensagem();
    }
  }

  function limparConversa() {
    if (carregando) return;

    setMensagens([
      {
        role: "assistant",
        content:
          "Conversa reiniciada! 🌱 Como posso ajudar você e suas plantas?",
      },
    ]);

    setErro("");
  }

  return (
    <section className="assistente-container">
      <div className="assistente-cabecalho">
        <div className="assistente-identidade">
          <div className="assistente-avatar">🌱</div>

          <div>
            <h2>PlantaPet AI</h2>
            <span>
              <span className="assistente-indicador"></span>
              Assistente inteligente
            </span>
          </div>
        </div>

        <div className="assistente-acoes">
          <button
            type="button"
            className="assistente-botao-limpar"
            onClick={limparConversa}
            disabled={carregando}
            title="Nova conversa"
          >
            Nova conversa
          </button>

          {aoFechar && (
            <button
              type="button"
              className="assistente-botao-fechar"
              onClick={aoFechar}
              aria-label="Fechar assistente"
              title="Fechar"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {planta && (
        <div className="assistente-contexto">
          <span>🌿</span>

          <div>
            <strong>Planta selecionada: {planta.nome}</strong>
            <small>
              {planta.tipo} · Umidade atual: {umidade}%
            </small>
          </div>
        </div>
      )}

      {!planta && (
        <div className="assistente-contexto">
          <span>💡</span>
          <div>
            <strong>Assistente de jardinagem</strong>
            <small>
              Selecione uma planta para receber orientações personalizadas.
            </small>
          </div>
        </div>
      )}

      <div className="assistente-mensagens" aria-live="polite">
        {mensagens.map((mensagem, indice) => (
          <div
            key={indice}
            className={`assistente-mensagem ${
              mensagem.role === "user"
                ? "mensagem-usuario"
                : "mensagem-ia"
            }`}
          >
            {mensagem.role === "assistant" && (
              <div className="mensagem-avatar">🌱</div>
            )}

            <div className="mensagem-conteudo">
              {mensagem.content}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="assistente-mensagem mensagem-ia">
            <div className="mensagem-avatar">🌱</div>

            <div className="mensagem-conteudo mensagem-digitando">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={finalMensagensRef} />
      </div>

      {mensagens.length === 1 && (
        <div className="assistente-sugestoes">
          <span>Experimente perguntar:</span>

          <button
            type="button"
            onClick={() =>
              enviarMensagem("Como saber se minha planta precisa de água?")
            }
          >
            Quando devo regar?
          </button>

          <button
            type="button"
            onClick={() =>
              enviarMensagem("Quais são os sinais de excesso de água?")
            }
          >
            Excesso de água
          </button>

          <button
            type="button"
            onClick={() =>
              enviarMensagem("Como identificar doenças nas folhas?")
            }
          >
            Doenças nas folhas
          </button>
        </div>
      )}

      {erro && (
        <div className="assistente-erro" role="alert">
          {erro}
        </div>
      )}

      <form
        className="assistente-formulario"
        onSubmit={(evento) => {
          evento.preventDefault();
          enviarMensagem();
        }}
      >
        <textarea
          value={pergunta}
          onChange={(evento) => setPergunta(evento.target.value)}
          onKeyDown={lidarComTecla}
          placeholder="Digite sua dúvida sobre plantas..."
          rows={2}
          disabled={carregando}
          maxLength={4000}
        />

        <button
          type="submit"
          disabled={!pergunta.trim() || carregando}
          aria-label="Enviar mensagem"
        >
          {carregando ? "..." : "➤"}
        </button>
      </form>

      <p className="assistente-aviso">
        As orientações da IA são informativas e não substituem a avaliação
        de um profissional especializado.
      </p>
    </section>
  );
}

export default AssistenteIA;
