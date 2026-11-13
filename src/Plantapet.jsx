import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import AssistenteIA from "./AssistenteIA";
import MapaPlantas from "./MapaPlantas";

import "./App.css";



const tiposDePlantas = {

  Samambaia: {

    imagem: "🌿",

    umidade: "50% - 70%",

    rega: "Frequente",

    descricao: "Gosta de ambientes úmidos e precisa de rega frequente.",

  },

  Flor: {

    imagem: "🌸",

    umidade: "40% - 60%",

    rega: "Moderada",

    descricao: "Precisa de uma rega equilibrada para manter o solo saudável.",

  },

  Árvore: {

    imagem: "🌳",

    umidade: "40% - 60%",

    rega: "Moderada",

    descricao: "Árvores precisam de espaço e umidade controlada no solo.",

  },

  Suculenta: {

    imagem: "🪴",

    umidade: "20% - 40%",

    rega: "Pouca",

    descricao: "Armazena água nas folhas e não deve permanecer com o solo encharcado.",

  },

  Folhagem: {

    imagem: "🍃",

    umidade: "40% - 60%",

    rega: "Moderada",

    descricao: "Gosta de umidade equilibrada e de regas moderadas.",

  },

  Cacto: {

    imagem: "🌵",

    umidade: "15% - 30%",

    rega: "Pouca",

    descricao: "Armazena água e precisa de pouca rega para se manter saudável.",

  },

};



function Plantapet({ usuario, aoSair }) {

  const [umidade, setUmidade] = useState(0);

  const [irrigando, setIrrigando] = useState(false);



  const [plantas, setPlantas] = useState([]);

  const [carregandoPlantas, setCarregandoPlantas] = useState(true);

  const [mensagemPlantas, setMensagemPlantas] = useState("");

  const [tipoMensagemPlantas, setTipoMensagemPlantas] = useState("erro");



  const [plantaSelecionada, setPlantaSelecionada] = useState(null);

  const [mostrarCadastro, setMostrarCadastro] = useState(false);



  const [nomeNovaPlanta, setNomeNovaPlanta] = useState("");
  const [tipoNovaPlanta, setTipoNovaPlanta] = useState("Samambaia");
  const [cepNovo, setCepNovo] = useState("");
  const [enderecoNovo, setEnderecoNovo] = useState("");
  const [numeroNovo, setNumeroNovo] = useState("");
  const [complementoNovo, setComplementoNovo] = useState("");
  const [bairroNovo, setBairroNovo] = useState("");
  const [cidadeNova, setCidadeNova] = useState("");
  const [estadoNovo, setEstadoNovo] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvandoPlanta, setSalvandoPlanta] = useState(false);



  const [editandoPlanta, setEditandoPlanta] = useState(false);

  const [nomeEditado, setNomeEditado] = useState("");
  const [tipoEditado, setTipoEditado] = useState("Samambaia");
  const [cepEditado, setCepEditado] = useState("");
  const [enderecoEditado, setEnderecoEditado] = useState("");
  const [numeroEditado, setNumeroEditado] = useState("");
  const [complementoEditado, setComplementoEditado] = useState("");
  const [bairroEditado, setBairroEditado] = useState("");
  const [cidadeEditada, setCidadeEditada] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("");



  // =========================

  // SENSOR ESP32

  // =========================



  useEffect(() => {

    async function buscarUmidadeESP32() {

      try {

        const resposta = await fetch("http://172.24.3.237/umidade");



        if (!resposta.ok) {

          throw new Error("Erro ao buscar umidade do ESP32");

        }



        const dados = await resposta.json();

        const leitura = Number(dados.umidade);



        if (Number.isFinite(leitura) && leitura >= 0 && leitura <= 100) {

          setUmidade(leitura);

        }

      } catch (erro) {

        console.error("Erro ao conectar com o ESP32:", erro);

      }

    }



    buscarUmidadeESP32();



    const intervalo = setInterval(buscarUmidadeESP32, 3000);



    return () => clearInterval(intervalo);

  }, []);



  // =========================

  // BUSCAR PLANTAS

  // =========================



  useEffect(() => {

    let ativo = true;



    async function buscarPlantas() {

      setCarregandoPlantas(true);



      try {

        const { data, error } = await supabase

          .from("plantas")

          .select("*")

          .eq("usuario_id", usuario.id);



        if (error) throw error;

        if (!ativo) return;



        setPlantas(data ?? []);

        setMensagemPlantas("");

      } catch (erro) {

        console.error("Erro ao buscar plantas:", erro);



        if (ativo) {

          setMensagemPlantas(

            "Não foi possível carregar suas plantas. Tente novamente."

          );

          setTipoMensagemPlantas("erro");

        }

      } finally {

        if (ativo) setCarregandoPlantas(false);

      }

    }



    buscarPlantas();



    return () => {

      ativo = false;

    };

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

    setIrrigando((estadoAtual) => !estadoAtual);

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



  const statusUmidade = obterStatusUmidade();



  function obterCorUmidade() {

    if (umidade < 30) return "#e53935";

    if (umidade < 70) return "#fbc02d";

    return "#2e7d32";

  }



  const corUmidade = obterCorUmidade();



  // =========================
  // LOCALIZAÇÃO E CEP
  // =========================

  async function preencherEnderecoPorCep(cep, modo = "novo") {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!resposta.ok) throw new Error("Não foi possível consultar o CEP.");
      const dados = await resposta.json();
      if (dados.erro) throw new Error("CEP não encontrado. Confira os números.");

      const setters = modo === "edicao"
        ? [setEnderecoEditado, setBairroEditado, setCidadeEditada, setEstadoEditado]
        : [setEnderecoNovo, setBairroNovo, setCidadeNova, setEstadoNovo];
      setters[0](dados.logradouro || "");
      setters[1](dados.bairro || "");
      setters[2](dados.localidade || "");
      setters[3](dados.uf || "");
      setMensagemPlantas("Endereço preenchido pelo CEP. Informe o número para localizar a planta com mais precisão.");
      setTipoMensagemPlantas("sucesso");
    } catch (erro) {
      setMensagemPlantas(erro.message || "Não foi possível consultar o CEP.");
      setTipoMensagemPlantas("erro");
    } finally {
      setBuscandoCep(false);
    }
  }

  async function localizarEndereco(dados) {
    const partes = [dados.endereco, dados.numero, dados.complemento, dados.bairro, dados.cidade, dados.estado, "Brasil"]
      .filter((parte) => parte && String(parte).trim());
    const consulta = partes.join(", ");
    if (!dados.endereco || !dados.cidade || !dados.estado) {
      throw new Error("Preencha o endereço, a cidade e o estado para localizar a planta.");
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(consulta)}`;
    const resposta = await fetch(url, { headers: { Accept: "application/json" } });
    if (!resposta.ok) throw new Error("O serviço de mapas não respondeu. Tente novamente.");
    const resultados = await resposta.json();
    if (!resultados.length) {
      throw new Error("Não encontramos esse endereço no mapa. Confira o endereço, número, cidade e estado.");
    }
    return {
      latitude: Number(resultados[0].lat),
      longitude: Number(resultados[0].lon),
    };
  }

  function limparFormularioNovaPlanta() {
    setNomeNovaPlanta("");
    setTipoNovaPlanta("Samambaia");
    setCepNovo("");
    setEnderecoNovo("");
    setNumeroNovo("");
    setComplementoNovo("");
    setBairroNovo("");
    setCidadeNova("");
    setEstadoNovo("");
  }

  // =========================

  // EDITAR PLANTA

  // =========================



  function iniciarEdicao() {

    if (!plantaSelecionada) return;



    setNomeEditado(plantaSelecionada.nome);
    setTipoEditado(plantaSelecionada.tipo);
    setCepEditado(plantaSelecionada.cep || "");
    setEnderecoEditado(plantaSelecionada.endereco || "");
    setNumeroEditado(plantaSelecionada.numero || "");
    setComplementoEditado(plantaSelecionada.complemento || "");
    setBairroEditado(plantaSelecionada.bairro || "");
    setCidadeEditada(plantaSelecionada.cidade || "");
    setEstadoEditado(plantaSelecionada.estado || "");

    setEditandoPlanta(true);

  }



  function cancelarEdicao() {

    setEditandoPlanta(false);

  }



  async function salvarEdicao() {

    if (!plantaSelecionada) return;



    if (!nomeEditado.trim()) {

      setTipoMensagemPlantas("erro");

      setMensagemPlantas("Digite o nome da planta.");

      return;

    }



    try {

      const { data: plantaSalva, error } = await supabase

        .from("plantas")

        .update({
          nome: nomeEditado.trim(),
          tipo: tipoEditado,
          cep: cepEditado.replace(/\D/g, ""),
          endereco: enderecoEditado.trim(),
          numero: numeroEditado.trim(),
          complemento: complementoEditado.trim(),
          bairro: bairroEditado.trim(),
          cidade: cidadeEditada.trim(),
          estado: estadoEditado.trim().toUpperCase(),
          ...(await localizarEndereco({
            endereco: enderecoEditado.trim(),
            numero: numeroEditado.trim(),
            complemento: complementoEditado.trim(),
            bairro: bairroEditado.trim(),
            cidade: cidadeEditada.trim(),
            estado: estadoEditado.trim(),
          })),
        })

        .eq("id", plantaSelecionada.id)

        .eq("usuario_id", usuario.id)

        .select()

        .single();



      if (error) throw error;



      setPlantas((atuais) =>

        atuais.map((planta) =>

          planta.id === plantaSalva.id ? plantaSalva : planta

        )

      );



      setPlantaSelecionada(plantaSalva);

      setEditandoPlanta(false);

      setTipoMensagemPlantas("sucesso");

      setMensagemPlantas("Planta atualizada com sucesso.");

    } catch (erro) {

      console.error(erro);

      setTipoMensagemPlantas("erro");

      setMensagemPlantas(

        "Não foi possível atualizar a planta. Tente novamente."

      );

    }

  }



  // =========================

  // CADASTRAR PLANTA

  // =========================



  async function cadastrarPlanta() {
    if (!nomeNovaPlanta.trim()) {
      setTipoMensagemPlantas("erro");
      setMensagemPlantas("Digite o nome da planta.");
      return;
    }

    setSalvandoPlanta(true);
    try {
      const coordenadas = await localizarEndereco({
        endereco: enderecoNovo.trim(),
        numero: numeroNovo.trim(),
        complemento: complementoNovo.trim(),
        bairro: bairroNovo.trim(),
        cidade: cidadeNova.trim(),
        estado: estadoNovo.trim(),
      });

      const novaPlanta = {
        nome: nomeNovaPlanta.trim(),
        tipo: tipoNovaPlanta,
        usuario_id: usuario.id,
        cep: cepNovo.replace(/\D/g, ""),
        endereco: enderecoNovo.trim(),
        numero: numeroNovo.trim(),
        complemento: complementoNovo.trim(),
        bairro: bairroNovo.trim(),
        cidade: cidadeNova.trim(),
        estado: estadoNovo.trim().toUpperCase(),
        ...coordenadas,
      };

      const { data: plantaSalva, error } = await supabase
        .from("plantas")
        .insert(novaPlanta)
        .select()
        .single();

      if (error) throw error;

      setPlantas((atuais) => [...atuais, plantaSalva]);
      limparFormularioNovaPlanta();
      setMostrarCadastro(false);
      setTipoMensagemPlantas("sucesso");
      setMensagemPlantas("Planta cadastrada e posicionada no mapa com sucesso.");
    } catch (erro) {
      console.error(erro);
      setTipoMensagemPlantas("erro");
      setMensagemPlantas(erro.message || "Não foi possível cadastrar a planta. Tente novamente.");
    } finally {
      setSalvandoPlanta(false);
    }
  }


  // =========================

  // EXCLUIR PLANTA

  // =========================



  async function excluirPlanta() {

    if (!plantaSelecionada) return;



    const confirmar = window.confirm(

      `Tem certeza que deseja excluir a planta "${plantaSelecionada.nome}"?`

    );



    if (!confirmar) return;



    try {

      const { data: plantaExcluida, error } = await supabase

        .from("plantas")

        .delete()

        .eq("id", plantaSelecionada.id)

        .eq("usuario_id", usuario.id)

        .select("id")

        .maybeSingle();



      if (error) throw error;



      if (!plantaExcluida) {

        throw new Error(

          "Planta não encontrada ou sem permissão para excluí-la."

        );

      }



      setPlantas((atuais) =>

        atuais.filter((planta) => planta.id !== plantaSelecionada.id)

      );



      setPlantaSelecionada(null);

      setIrrigando(false);

      setEditandoPlanta(false);



      setTipoMensagemPlantas("sucesso");

      setMensagemPlantas("Planta excluída com sucesso.");

    } catch (erro) {

      console.error(erro);

      setTipoMensagemPlantas("erro");

      setMensagemPlantas(

        erro.message || "Não foi possível excluir a planta. Tente novamente."

      );

    }

  }



  const dadosPlantaSelecionada = plantaSelecionada

    ? tiposDePlantas[plantaSelecionada.tipo]

    : null;



  // =========================

  // TELA

  // =========================



  return (

    <div className="app">

      <header className="header">

        <h1>Plantapet</h1>



        <p>Olá, {usuario.nome}! Cuide das suas plantas.</p>



        <button className="botao-sair" onClick={aoSair}>

          Sair

        </button>

      </header>



      <main className="dashboard">

        <div className="dashboard-layout">



          {/* ÁREA PRINCIPAL */}



          <section className="card plantas-card">

            <div className="titulo-plantas">

              <div>

                <h2>Minhas plantas</h2>

                <p>

                  Clique em uma planta para acompanhar os cuidados.

                </p>

              </div>



              <button

                className="botao-adicionar-planta"

                onClick={() => setMostrarCadastro(!mostrarCadastro)}

              >

                {mostrarCadastro ? "Cancelar cadastro" : "+ Adicionar planta"}

              </button>

            </div>



            {mensagemPlantas && (

              <p

                role={tipoMensagemPlantas === "erro" ? "alert" : "status"}

                style={{

                  margin: "12px 0",

                  color:

                    tipoMensagemPlantas === "erro" ? "#c62828" : "#2e7d32",

                  fontWeight: "bold",

                }}

              >

                {mensagemPlantas}

              </p>

            )}



            {/* CADASTRO */}



            {mostrarCadastro && (

              <div className="formulario-planta">

                <h3>Nova planta</h3>

                <label>Nome da planta</label>
                <input
                  type="text"
                  placeholder="Ex.: Minha samambaia"
                  value={nomeNovaPlanta}
                  onChange={(e) => setNomeNovaPlanta(e.target.value)}
                />

                <label>Tipo da planta</label>
                <select value={tipoNovaPlanta} onChange={(e) => setTipoNovaPlanta(e.target.value)}>
                  <option value="Samambaia">Samambaia</option>
                  <option value="Flor">Flor</option>
                  <option value="Árvore">Árvore</option>
                  <option value="Suculenta">Suculenta</option>
                  <option value="Folhagem">Folhagem</option>
                  <option value="Cacto">Cacto</option>
                </select>

                <h4 className="titulo-localizacao-form">Localização da planta</h4>
                <label>CEP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="00000-000"
                  value={cepNovo}
                  onChange={(e) => setCepNovo(e.target.value)}
                  onBlur={() => preencherEnderecoPorCep(cepNovo, "novo")}
                />
                {buscandoCep && <small className="ajuda-localizacao">Consultando CEP...</small>}

                <label>Rua / Avenida</label>
                <input type="text" placeholder="Nome da rua" value={enderecoNovo} onChange={(e) => setEnderecoNovo(e.target.value)} />

                <div className="campos-localizacao-linha">
                  <div>
                    <label>Número</label>
                    <input type="text" placeholder="Número" value={numeroNovo} onChange={(e) => setNumeroNovo(e.target.value)} />
                  </div>
                  <div>
                    <label>Complemento</label>
                    <input type="text" placeholder="Casa, apartamento..." value={complementoNovo} onChange={(e) => setComplementoNovo(e.target.value)} />
                  </div>
                </div>

                <label>Bairro</label>
                <input type="text" placeholder="Bairro" value={bairroNovo} onChange={(e) => setBairroNovo(e.target.value)} />

                <div className="campos-localizacao-linha">
                  <div>
                    <label>Cidade</label>
                    <input type="text" placeholder="Cidade" value={cidadeNova} onChange={(e) => setCidadeNova(e.target.value)} />
                  </div>
                  <div>
                    <label>Estado (UF)</label>
                    <input type="text" maxLength={2} placeholder="SP" value={estadoNovo} onChange={(e) => setEstadoNovo(e.target.value.toUpperCase())} />
                  </div>
                </div>
                <p className="ajuda-localizacao">O endereço será usado para encontrar a posição exata aproximada da planta no mapa.</p>

                <div className="botoes-formulario">

                  <button

                    className="botao-salvar-planta"

                    onClick={cadastrarPlanta}
                    disabled={salvandoPlanta || buscandoCep}
                  >
                    {salvandoPlanta ? "Localizando e salvando..." : "Salvar planta"}

                  </button>



                  <button

                    className="botao-cancelar-planta"

                    onClick={() => setMostrarCadastro(false)}

                  >

                    Cancelar

                  </button>

                </div>

              </div>

            )}



            {/* PAINEL DA PLANTA */}



            {plantaSelecionada && dadosPlantaSelecionada && (

              <div className="painel-planta">

                <div className="painel-imagem">

                  {dadosPlantaSelecionada.imagem}

                </div>



                <div className="painel-conteudo">

                  {editandoPlanta ? (

                    <div className="formulario-edicao">

                      <h3>Editar planta</h3>



                      <label>Nome da planta</label>

                      <input

                        type="text"

                        value={nomeEditado}

                        onChange={(e) => setNomeEditado(e.target.value)}

                      />



                      <label>Tipo da planta</label>

                      <select

                        value={tipoEditado}

                        onChange={(e) => setTipoEditado(e.target.value)}

                      >

                        <option value="Samambaia">Samambaia</option>

                        <option value="Flor">Flor</option>

                        <option value="Árvore">Árvore</option>

                        <option value="Suculenta">Suculenta</option>

                        <option value="Folhagem">Folhagem</option>

                        <option value="Cacto">Cacto</option>

                      </select>



                      <h4 className="titulo-localizacao-form">Localização da planta</h4>
                      <label>CEP</label>
                      <input type="text" inputMode="numeric" maxLength={9} value={cepEditado} onChange={(e) => setCepEditado(e.target.value)} onBlur={() => preencherEnderecoPorCep(cepEditado, "edicao")} placeholder="00000-000" />
                      <label>Rua / Avenida</label>
                      <input type="text" value={enderecoEditado} onChange={(e) => setEnderecoEditado(e.target.value)} />
                      <div className="campos-localizacao-linha">
                        <div><label>Número</label><input type="text" value={numeroEditado} onChange={(e) => setNumeroEditado(e.target.value)} /></div>
                        <div><label>Complemento</label><input type="text" value={complementoEditado} onChange={(e) => setComplementoEditado(e.target.value)} /></div>
                      </div>
                      <label>Bairro</label>
                      <input type="text" value={bairroEditado} onChange={(e) => setBairroEditado(e.target.value)} />
                      <div className="campos-localizacao-linha">
                        <div><label>Cidade</label><input type="text" value={cidadeEditada} onChange={(e) => setCidadeEditada(e.target.value)} /></div>
                        <div><label>Estado (UF)</label><input type="text" maxLength={2} value={estadoEditado} onChange={(e) => setEstadoEditado(e.target.value.toUpperCase())} /></div>
                      </div>

                      <div className="botoes-edicao">

                        <button
                          className="botao-salvar-edicao"
                          onClick={salvarEdicao}
                          disabled={buscandoCep}
                        >

                          Salvar alterações

                        </button>



                        <button

                          className="botao-cancelar-edicao"

                          onClick={cancelarEdicao}

                        >

                          Cancelar

                        </button>

                      </div>

                    </div>

                  ) : (

                    <div className="painel-titulo">

                      <h2>{plantaSelecionada.nome}</h2>

                      <p>{dadosPlantaSelecionada.descricao}</p>

                    </div>

                  )}



                  {/* UMIDADE */}



                  <div className="painel-umidade">

                    <div className="umidade-topo">

                      <span>Umidade do solo</span>



                      <strong

                        className="porcentagem-umidade"

                        style={{ color: corUmidade }}

                      >

                        {umidade}%

                      </strong>

                    </div>



                    <div className="barra-planta">

                      <div

                        className="barra-planta-progresso"

                        style={{

                          width: `${umidade}%`,

                          background: corUmidade,

                        }}

                      ></div>

                    </div>



                    <div className={`status-umidade ${statusUmidade.classe}`}>

                      {statusUmidade.texto}

                    </div>



                    <small>Leitura recebida do ESP32</small>

                  </div>



                  {/* IRRIGAÇÃO */}



                  <div

                    className={`controle-irrigacao ${

                      irrigando ? "controle-ligado" : "controle-desligado"

                    }`}

                  >

                    <div className="controle-info">

                      <div className="controle-titulo">Irrigação</div>

                      <strong>{irrigando ? "Ligada" : "Desligada"}</strong>

                    </div>



                    <button

                      className="botao-controle"

                      onClick={alternarIrrigacao}

                    >

                      {irrigando ? "Desligar" : "Ligar irrigação"}

                    </button>

                  </div>



                  {/* STATUS */}



                  <div className="status-planta status-planta-ok">

                    <span>●</span>

                    Sistema funcionando normalmente

                  </div>



                  {/* INFORMAÇÕES */}



                  <div className="informacoes-planta-selecionada">

                    <div className="info-item">

                      <span>Umidade ideal</span>

                      <strong>{dadosPlantaSelecionada.umidade}</strong>

                      <small>Faixa recomendada</small>

                    </div>



                    <div className="info-item">

                      <span>Necessidade de rega</span>

                      <strong>{dadosPlantaSelecionada.rega}</strong>

                      <small>Frequência recomendada</small>

                    </div>



                    <div className="info-item">

                      <span>Tipo</span>

                      <strong>{plantaSelecionada.tipo}</strong>

                      <small>Espécie cadastrada</small>

                    </div>

                  </div>



                  {/* AÇÕES */}



                  <div className="area-acoes-planta">

                    <button

                      className="botao-editar-planta"

                      onClick={iniciarEdicao}

                    >

                      Editar planta

                    </button>



                    <button

                      className="botao-excluir-planta"

                      onClick={excluirPlanta}

                    >

                      Excluir planta

                    </button>

                  </div>

                </div>

              </div>

            )}



            {/* LISTA DE PLANTAS */}



            <div className="lista-plantas">

              {carregandoPlantas ? (

                <p role="status">Carregando plantas...</p>

              ) : plantas.length === 0 ? (

                <div className="sem-plantas">

                  <h3>Nenhuma planta cadastrada</h3>

                  <p>

                    Clique em "+ Adicionar planta" para começar.

                  </p>

                </div>

              ) : (

                plantas.map((planta) => {

                  const dados = tiposDePlantas[planta.tipo];



                  const selecionada =

                    plantaSelecionada?.id === planta.id;



                  return (

                    <div

                      key={planta.id}

                      className={`planta-card ${

                        selecionada ? "planta-card-selecionada" : ""

                      }`}

                      onClick={() => selecionarPlanta(planta)}

                    >

                      <div className="imagem-planta">

                        {dados ? dados.imagem : "🌱"}

                      </div>



                      <div className="informacoes-planta">

                        <h3>{planta.nome}</h3>



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

          <MapaPlantas plantas={plantas} />

          {/* ASSISTENTE FIXO NA LATERAL */}



          <aside className="dashboard-assistente">

            <AssistenteIA

              planta={plantaSelecionada}

              umidade={umidade}

            />

          </aside>



        </div>

      </main>

    </div>

  );

}



export default Plantapet;
