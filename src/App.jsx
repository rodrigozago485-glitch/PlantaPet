import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Login from "./Login";
import Cadastro from "./Cadastro";
import Plantapet from "./Plantapet";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [tela, setTela] = useState("login");
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  useEffect(() => {
    let ativo = true;
    let eventoDeAuthRecebido = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, sessao) => {
        eventoDeAuthRecebido = true;

        if (ativo) {
          setUsuario(sessao?.user ?? null);
          setVerificandoSessao(false);
        }
      }
    );

    async function restaurarSessao() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (ativo && !eventoDeAuthRecebido) {
          setUsuario(data.session?.user ?? null);
          setVerificandoSessao(false);
        }
      } catch (erro) {
        console.error("Não foi possível recuperar a sessão:", erro);

        if (ativo && !eventoDeAuthRecebido) {
          setUsuario(null);
          setVerificandoSessao(false);
        }
      }
    }

    restaurarSessao();

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  function entrarNoSistema(usuarioLogado) {
    setUsuario(usuarioLogado);
  }

  async function sairDoSistema() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Não foi possível encerrar a sessão:", error);
      return;
    }

    setUsuario(null);
    setTela("login");
  }

  if (verificandoSessao) {
    return (
      <div
        role="status"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#2e7d32",
          fontWeight: "bold",
        }}
      >
        Verificando sessão...
      </div>
    );
  }

  if (usuario) {
    return (
      <Plantapet
        usuario={usuario}
        aoSair={sairDoSistema}
      />
    );
  }

  if (tela === "cadastro") {
    return (
      <Cadastro
        aoVoltarLogin={() => setTela("login")}
      />
    );
  }

  return (
    <Login
      aoEntrar={entrarNoSistema}
      aoCriarConta={() => setTela("cadastro")}
    />
  );
}

export default App;
