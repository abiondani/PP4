import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "../src/paginas/PaginaPrincipal.js";
import Encuesta from "../src/paginas/encuesta.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;
