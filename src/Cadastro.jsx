import { useState } from "react";
import "./Cadastro.css";

function Cadastro({ aoVoltarLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criarConta(event) {
    event.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais.");
      return;
    }

    if (senha.length < 6) {
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(
        "http://localhost:3001/usuarios",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome,
            email,
            senha,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao criar conta.");
      }

     alert("Conta criada com sucesso!");

setNome("");
setEmail("");
setSenha("");
setConfirmarSenha("");

aoVoltarLogin();

    } catch (erro) {
      console.error(erro);

      alert(
        "Não foi possível criar a conta. Verifique se o servidor está funcionando."
      );

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