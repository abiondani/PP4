// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./paginas/Main.js";
import FormularioTurno from "./paginas/FormularioTurnos.js";
import ListarTurnos from "./paginas/ListarTurnos";
import ModificarTurno from "./paginas/ModificarTurno";
import EliminarTurno from "./paginas/EliminarTurno";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/crear" element={<FormularioTurno />} />
        <Route path="/listar" element={<ListarTurnos />} />
        <Route path="/modificar" element={<ModificarTurno />} />
        <Route path="/eliminar" element={<EliminarTurno />} />
      </Routes>
    </Router>
  );
}

export default App;
