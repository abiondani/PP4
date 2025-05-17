import React from "react";
import { useNavigate } from "react-router-dom";

function Main({ onLogout }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pantalla Principal</h1>
      <nav>
        <button onClick={() => navigate("/turnos")}>
          Ir a Formulario de Turnos
        </button>
        <button onClick={cerrarSesion} style={{ marginLeft: 10 }}>
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}

export default Main;
