import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "../src/paginas/PaginaPrincipal.js";

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
