import { useEffect, useState } from "react";
import "./App.css";

const tiposDePlantas = {
  Samambaia: {
    imagem: "🌿",
    umidade: "50% - 70%",
    rega: "Frequente",
    descricao:
      "Gosta de ambientes úmidos e precisa de rega frequente.",
  },

  Flor: {
    imagem: "🌸",
    umidade: "40% - 60%",
    rega: "Moderada",
    descricao:
      "Precisa de uma rega equilibrada para manter o solo saudável.",
  },

  "Árvore": {
    imagem: "🌳",
    umidade: "40% - 60%",
    rega: "Moderada",
    descricao:
      "Árvores precisam de espaço e umidade controlada no solo.",
  },

  Suculenta: {
    imagem: "🪴",
    umidade: "20% - 40%",
    rega: "Pouca",
    descricao:
      "Armazena água nas folhas e não deve permanecer com o solo encharcado.",
  },

  Folhagem: {
    imagem: "🍃",
    umidade: "40% - 60%",
    rega: "Moderada",
    descricao:
      "Gosta de umidade equilibrada e de regas moderadas.",
  },

  Cacto: {
    imagem: "🌵",
    umidade: "15% - 30%",
    rega: "Pouca",
    descricao:
      "Armazena água e precisa de pouca rega para se manter saudável.",
  },
};

function Plantapet({ usuario, aoSair }) {
  const [umidade, setUmidade] = useState(0);

  const [irrigando, setIrrigando] = useState(false);

  const [plantas, setPlantas] = useState([]);

  const [plantaSelecionada, setPlantaSelecionada] =
    useState(null);

  const [mostrarCadastro, setMostrarCadastro] =
    useState(false);

  const [nomeNovaPlanta, setNomeNovaPlanta] =
    useState("");

  const [tipoNovaPlanta, setTipoNovaPlanta] =
    useState("Samambaia");

  const [editandoPlanta, setEditandoPlanta] =
    useState(false);

  const [nomeEditado, setNomeEditado] =
    useState("");

  const [tipoEditado, setTipoEditado] =
    useState("Samambaia");



 useEffect(() => {
  async function buscarUmidadeESP32() {
    try {
      const resposta = await fetch(
        "http://172.24.3.237/umidade"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar umidade do ESP32");
      }

      const dados = await resposta.json();

      setUmidade(dados.umidade);

      console.log(
        "Umidade recebida do ESP32:",
        dados.umidade
      );
    } catch (erro) {
      console.error(
        "Erro ao conectar com o ESP32:",
        erro
      );
    }
  }

  buscarUmidadeESP32();

  const intervalo = setInterval(
    buscarUmidadeESP32,
    3000
  );

  return () => clearInterval(intervalo);
}, []);
   
  // =========================
  // BUSCAR PLANTAS
  // =========================

  useEffect(() => {
    async function buscarPlantas() {
      try {
        const resposta = await fetch(
          "http://localhost:3001/plantas"
        );

        if (!resposta.ok) {
          throw new Error(
            "Erro ao buscar plantas"
          );
        }

        const todasAsPlantas =
          await resposta.json();

        const plantasDoUsuario =
          todasAsPlantas.filter(
            (planta) =>
              planta.usuarioId === usuario.id
          );

        setPlantas(plantasDoUsuario);
      } catch (erro) {
        console.error(
          "Erro ao buscar plantas:",
          erro
        );
      }
    }

    buscarPlantas();
  }, [usuario.id]);

  // =========================
  // SELECIONAR PLANTA
  // =========================

  function selecionarPlanta(planta) {
    setPlantaSelecionada(planta);
    setIrrigando(false);
    setEditandoPlanta(false);
  }

  // =========================
  // IRRIGAÇÃO
  // =========================

  function alternarIrrigacao() {
    setIrrigando(
      (estadoAtual) => !estadoAtual
    );
  }

  // =========================
  // STATUS DA UMIDADE
  // =========================

  function obterStatusUmidade() {
    if (umidade < 30) {
      return {
        texto: "Umidade baixa",
        classe: "umidade-baixa",
      };
    }

    if (umidade < 70) {
      return {
        texto: "Umidade média",
        classe: "umidade-media",
      };
    }

    return {
      texto: "Umidade boa",
      classe: "umidade-boa",
    };
  }

  const statusUmidade =
    obterStatusUmidade();

  // =========================
  // COR DA UMIDADE
  // =========================

  function obterCorUmidade() {
    if (umidade < 30) {
      return "#e53935";
    }

    if (umidade < 70) {
      return "#fbc02d";
    }

    return "#2e7d32";
  }

  const corUmidade =
    obterCorUmidade();

  // =========================
  // EDITAR PLANTA
  // =========================

  function iniciarEdicao() {
    if (!plantaSelecionada) {
      return;
    }

    setNomeEditado(
      plantaSelecionada.nome
    );

    setTipoEditado(
      plantaSelecionada.tipo
    );

    setEditandoPlanta(true);
  }

  function cancelarEdicao() {
    setEditandoPlanta(false);
  }

  async function salvarEdicao() {
    if (!plantaSelecionada) {
      return;
    }

    if (!nomeEditado.trim()) {
      alert(
        "Digite o nome da planta."
      );

      return;
    }

    const plantaAtualizada = {
      ...plantaSelecionada,
      nome: nomeEditado,
      tipo: tipoEditado,
    };

    try {
      const resposta = await fetch(
        `http://localhost:3001/plantas/${plantaSelecionada.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            plantaAtualizada
          ),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao editar planta"
        );
      }

      const plantaSalva =
        await resposta.json();

      setPlantas(
        (plantasAtuais) =>
          plantasAtuais.map(
            (planta) =>
              planta.id ===
              plantaSalva.id
                ? plantaSalva
                : planta
          )
      );

      setPlantaSelecionada(
        plantaSalva
      );

      setEditandoPlanta(false);

      alert(
        "Planta atualizada com sucesso!"
      );
    } catch (erro) {
      console.error(erro);

      alert(
        "Não foi possível atualizar a planta."
      );
    }
  }

  // =========================
  // CADASTRAR PLANTA
  // =========================

  async function cadastrarPlanta() {
    if (!nomeNovaPlanta.trim()) {
      alert(
        "Digite o nome da planta."
      );

      return;
    }

    const novaPlanta = {
      nome: nomeNovaPlanta,
      tipo: tipoNovaPlanta,
      usuarioId: usuario.id,
    };

    try {
      const resposta = await fetch(
        "http://localhost:3001/plantas",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            novaPlanta
          ),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao cadastrar planta"
        );
      }

      const plantaSalva =
        await resposta.json();

      setPlantas(
        (plantasAtuais) => [
          ...plantasAtuais,
          plantaSalva,
        ]
      );

      setNomeNovaPlanta("");

      setTipoNovaPlanta(
        "Samambaia"
      );

      setMostrarCadastro(false);

      alert(
        "Planta cadastrada com sucesso!"
      );
    } catch (erro) {
      console.error(erro);

      alert(
        "Não foi possível cadastrar a planta."
      );
    }
  }

  // =========================
  // EXCLUIR PLANTA
  // =========================

  async function excluirPlanta() {
    if (!plantaSelecionada) {
      return;
    }

    const confirmar =
      window.confirm(
        `Tem certeza que deseja excluir a planta "${plantaSelecionada.nome}"?`
      );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3001/plantas/${plantaSelecionada.id}`,
        {
          method: "DELETE",
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao excluir planta"
        );
      }

      setPlantas(
        (plantasAtuais) =>
          plantasAtuais.filter(
            (planta) =>
              planta.id !==
              plantaSelecionada.id
          )
      );

      setPlantaSelecionada(null);

      setIrrigando(false);

      setEditandoPlanta(false);

      alert(
        "Planta excluída com sucesso!"
      );
    } catch (erro) {
      console.error(erro);

      alert(
        "Não foi possível excluir a planta."
      );
    }
  }

  const dadosPlantaSelecionada =
    plantaSelecionada
      ? tiposDePlantas[
          plantaSelecionada.tipo
        ]
      : null;

  // =========================
  // TELA
  // =========================

  return (
    <div className="app">

      {/* CABEÇALHO */}

      <header className="header">

        <h1>
          Plantapet
        </h1>

        <p>
          Olá, {usuario.nome}! Cuide das
          suas plantas.
        </p>

        <button
          className="botao-sair"
          onClick={aoSair}
        >
          Sair
        </button>

      </header>

      <main className="dashboard">

        <section className="card plantas-card">

          {/* TÍTULO */}

          <div className="titulo-plantas">

            <div>

              <h2>
                Minhas plantas
              </h2>

              <p>
                Clique em uma planta para
                acompanhar os cuidados.
              </p>

            </div>

            <button
              className="botao-adicionar-planta"
              onClick={() =>
                setMostrarCadastro(true)
              }
            >
              + Adicionar planta
            </button>

          </div>

          {/* FORMULÁRIO DE CADASTRO */}

          {mostrarCadastro && (
            <div className="formulario-planta">

              <h3>
                Adicionar nova planta
              </h3>

              <input
                type="text"
                placeholder="Nome da planta"
                value={nomeNovaPlanta}
                onChange={(e) =>
                  setNomeNovaPlanta(
                    e.target.value
                  )
                }
              />

              <select
                value={tipoNovaPlanta}
                onChange={(e) =>
                  setTipoNovaPlanta(
                    e.target.value
                  )
                }
              >

                <option value="Samambaia">
                  Samambaia
                </option>

                <option value="Flor">
                  Flor
                </option>

                <option value="Árvore">
                  Árvore
                </option>

                <option value="Suculenta">
                  Suculenta
                </option>

                <option value="Folhagem">
                  Folhagem
                </option>

                <option value="Cacto">
                  Cacto
                </option>

              </select>

              <div className="botoes-formulario">

                <button
                  className="botao-salvar-planta"
                  onClick={
                    cadastrarPlanta
                  }
                >
                  Salvar planta
                </button>

                <button
                  className="botao-cancelar-planta"
                  onClick={() =>
                    setMostrarCadastro(
                      false
                    )
                  }
                >
                  Cancelar
                </button>

              </div>

            </div>
          )}

          {/* PAINEL DA PLANTA */}

          {plantaSelecionada &&
            dadosPlantaSelecionada && (

              <div className="painel-planta">

                <div className="painel-imagem">

                  {
                    dadosPlantaSelecionada.imagem
                  }

                </div>

                <div className="painel-conteudo">

                  {/* EDIÇÃO */}

                  {editandoPlanta ? (

                    <div className="formulario-edicao">

                      <h3>
                        Editar planta
                      </h3>

                      <label>
                        Nome da planta
                      </label>

                      <input
                        type="text"
                        value={nomeEditado}
                        onChange={(e) =>
                          setNomeEditado(
                            e.target.value
                          )
                        }
                      />

                      <label>
                        Tipo da planta
                      </label>

                      <select
                        value={tipoEditado}
                        onChange={(e) =>
                          setTipoEditado(
                            e.target.value
                          )
                        }
                      >

                        <option value="Samambaia">
                          Samambaia
                        </option>

                        <option value="Flor">
                          Flor
                        </option>

                        <option value="Árvore">
                          Árvore
                        </option>

                        <option value="Suculenta">
                          Suculenta
                        </option>

                        <option value="Folhagem">
                          Folhagem
                        </option>

                        <option value="Cacto">
                          Cacto
                        </option>

                      </select>

                      <div className="botoes-edicao">

                        <button
                          className="botao-salvar-edicao"
                          onClick={
                            salvarEdicao
                          }
                        >
                          Salvar alterações
                        </button>

                        <button
                          className="botao-cancelar-edicao"
                          onClick={
                            cancelarEdicao
                          }
                        >
                          Cancelar
                        </button>

                      </div>

                    </div>

                  ) : (

                    <div className="painel-titulo">

                      <h2>
                        {
                          plantaSelecionada.nome
                        }
                      </h2>

                      <p>
                        {
                          dadosPlantaSelecionada.descricao
                        }
                      </p>

                    </div>

                  )}

                  {/* UMIDADE */}

                  <div className="painel-umidade">

                    <div className="umidade-topo">

                      <span>
                        Umidade do solo
                      </span>

                      <strong
                        className="porcentagem-umidade"
                        style={{
                          color:
                            corUmidade,
                        }}
                      >
                        {umidade}%
                      </strong>

                    </div>

                    <div className="barra-planta">

                      <div
                        className="barra-planta-progresso"
                        style={{
                          width:
                            `${umidade}%`,

                          background:
                            corUmidade,
                        }}
                      ></div>

                    </div>

                    <div
                      className={`status-umidade ${statusUmidade.classe}`}
                    >
                      {
                        statusUmidade.texto
                      }
                    </div>

                    <small>Leitura recebida do ESP32</small>

                  </div>

                  {/* IRRIGAÇÃO */}

                  <div
                    className={`controle-irrigacao ${
                      irrigando
                        ? "controle-ligado"
                        : "controle-desligado"
                    }`}
                  >

                    <div className="controle-info">

                      <div className="controle-titulo">
                        Irrigação
                      </div>

                      <strong>
                        {irrigando
                          ? "Ligada"
                          : "Desligada"}
                      </strong>

                    </div>

                    <button
                      className="botao-controle"
                      onClick={
                        alternarIrrigacao
                      }
                    >
                      {irrigando
                        ? "Desligar"
                        : "Ligar irrigação"}
                    </button>

                  </div>

                  {/* STATUS DO SISTEMA */}

                  <div className="status-planta status-planta-ok">

                    <span>
                      ●
                    </span>

                    Sistema funcionando
                    normalmente

                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="informacoes-planta-selecionada">

                    <div className="info-item">

                      <span>
                        Umidade ideal
                      </span>

                      <strong>
                        {
                          dadosPlantaSelecionada.umidade
                        }
                      </strong>

                      <small>
                        Faixa recomendada
                      </small>

                    </div>

                    <div className="info-item">

                      <span>
                        Necessidade de rega
                      </span>

                      <strong>
                        {
                          dadosPlantaSelecionada.rega
                        }
                      </strong>

                      <small>
                        Frequência recomendada
                      </small>

                    </div>

                    <div className="info-item">

                      <span>
                        Tipo
                      </span>

                      <strong>
                        {
                          plantaSelecionada.tipo
                        }
                      </strong>

                      <small>
                        Espécie cadastrada
                      </small>

                    </div>

                  </div>

                  {/* AÇÕES */}

                  <div className="area-acoes-planta">

                    <button
                      className="botao-editar-planta"
                      onClick={
                        iniciarEdicao
                      }
                    >
                      Editar planta
                    </button>

                    <button
                      className="botao-excluir-planta"
                      onClick={
                        excluirPlanta
                      }
                    >
                      Excluir planta
                    </button>

                  </div>

                </div>

              </div>

            )}

          {/* LISTA DE PLANTAS */}

          <div className="lista-plantas">

            {plantas.length === 0 ? (

              <div className="sem-plantas">

                <h3>
                  Nenhuma planta cadastrada
                </h3>

                <p>
                  Clique em "+ Adicionar
                  planta" para começar.
                </p>

              </div>

            ) : (

              plantas.map((planta) => {

                const dados =
                  tiposDePlantas[
                    planta.tipo
                  ];

                const selecionada =
                  plantaSelecionada?.id ===
                  planta.id;

                return (

                  <div
                    key={planta.id}
                    className={`planta-card ${
                      selecionada
                        ? "planta-card-selecionada"
                        : ""
                    }`}
                    onClick={() =>
                      selecionarPlanta(
                        planta
                      )
                    }
                  >

                    <div className="imagem-planta">

                      {dados
                        ? dados.imagem
                        : "🌱"}

                    </div>

                    <div className="informacoes-planta">

                      <h3>
                        {planta.nome}
                      </h3>

                      <p className="descricao">

                        {dados
                          ? dados.descricao
                          : "Planta cadastrada no sistema."}

                      </p>

                    </div>

                  </div>

                );
              })

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Plantapet;