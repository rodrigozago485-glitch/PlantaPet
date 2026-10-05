import { useState } from "react";
import Login from "./Login";
import Cadastro from "./Cadastro";
import Plantapet from "./Plantapet";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [tela, setTela] = useState("login");

  function entrarNoSistema(usuarioLogado) {
    setUsuario(usuarioLogado);
  }

  function sairDoSistema() {
    setUsuario(null);
    setTela("login");
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