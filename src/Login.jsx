import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./Login.css";

function Login({ aoEntrar, aoCriarConta }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar(event) {
    event.preventDefault();

    setErro("");

    if (!email || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErro(
          error.code === "email_not_confirmed"
            ? "Confirme seu e-mail antes de entrar."
            : "E-mail ou senha incorretos. Confira seus dados e tente novamente."
        );
        return;
      }

      if (!data.session || !data.user) {
        setErro("Não foi possível conectar ao serviço de login. Tente novamente.");
        return;
      }

      aoEntrar(data.user);

    } catch (erro) {
      console.error(erro);

      setErro("Não foi possível conectar ao serviço de login. Tente novamente.");

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-logo">
          🌱
        </div>

        <h1>Plantapet</h1>

        <p className="login-subtitulo">
          Entre na sua conta para cuidar das suas plantas
        </p>

        <form onSubmit={entrar}>

          <div className="login-campo">
            <label>E-mail</label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErro("");
              }}
            />
          </div>

          <div className="login-campo">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => {
                setSenha(event.target.value);
                setErro("");
              }}
            />
          </div>

          {erro && (
            <div className="mensagem-erro">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="botao-login"
            disabled={carregando}
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}
          </button>

        </form>

        <div className="cadastro-link">

          <span>
            Ainda não possui uma conta?
          </span>

         <button
  type="button"
  onClick={aoCriarConta}
>
  Criar conta
</button>

        </div>

      </div>

    </div>
  );
}

export default Login;
