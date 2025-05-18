// src/Main.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestión de Turnos</h1>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button onClick={() => navigate("/listar")}>Listar Turnos</button>
        <button onClick={() => navigate("/crear")}>Crear Turno</button>
        <button onClick={() => navigate("/modificar")}>Modificar Turno</button>
        <button onClick={() => navigate("/eliminar")}>Eliminar Turno</button>
      </nav>
    </div>
  );
}

export default Main;
