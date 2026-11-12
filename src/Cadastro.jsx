import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./Cadastro.css";

function Cadastro({ aoVoltarLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  async function criarConta(event) {
    event.preventDefault();

    setMensagem("");
    setErro(false);

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro(true);
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro(true);
      setMensagem("As senhas não são iguais.");
      return;
    }

    if (senha.length < 6) {
      setErro(true);
      setMensagem("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome },
        },
      });

      if (error) {
        throw error;
      }

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      if (!data.session) {
        setErro(false);
        setMensagem("Conta criada. Confirme seu e-mail antes de entrar.");
        return;
      }

      aoVoltarLogin();

    } catch (erro) {
      console.error(erro);

      setErro(true);
      setMensagem("Não foi possível criar a conta. Confira os dados e tente novamente.");

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">

      <div className="cadastro-container">

        <div className="cadastro-logo">
          🌱
        </div>

        <h1>Plantapet</h1>

        <p className="cadastro-subtitulo">
          Crie sua conta para cuidar das suas plantas
        </p>

        <form onSubmit={criarConta}>

          <div className="campo">
            <label>Nome</label>

            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
            />
          </div>

          <div className="campo">
            <label>E-mail</label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="campo">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
            />
          </div>

          <div className="campo">
            <label>Confirmar senha</label>

            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
            />
          </div>

          {mensagem && (
            <div
              className={erro ? "mensagem-erro" : "mensagem-sucesso"}
              role={erro ? "alert" : "status"}
              style={erro ? undefined : {
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#e8f5e9",
                border: "1px solid #a5d6a7",
                color: "#2e7d32",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            className="botao-cadastro"
            disabled={carregando}
          >
            {carregando
              ? "Criando conta..."
              : "Criar conta"}
          </button>

        </form>

        <div className="login-link">
  <span>Já possui uma conta?</span>

  <button
    type="button"
    onClick={aoVoltarLogin}
  >
    Entrar
  </button>
</div>

      </div>

    </div>
  );
}

export default Cadastro;
