import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "../src/paginas/PaginaPrincipal.js";
import Encuesta from "../src/paginas/encuesta.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/encuesta/:token" element={<Encuesta />} />
      </Routes>
    </Router>
  );
}

export default App;
