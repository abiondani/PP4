import React, { useState } from "react";
import ListarTurnos from "../paginas/ListarTurnos";
import FormularioTurno from "../paginas/FormularioTurnos";
import ModificarTurno from "../paginas/ModificarTurno";
import EliminarTurno from "../paginas/EliminarTurno";
import "../css/PaginaPrincipal.css";

function PaginaPrincipal() {
  const [componenteActivo, setComponenteActivo] = useState("listar");

  const renderContenido = () => {
    switch (componenteActivo) {
      case "listar":
        return <ListarTurnos />;
      case "crear":
        return <FormularioTurno />;
      case "modificar":
        return <ModificarTurno />;
      case "eliminar":
        return <EliminarTurno />;
      default:
        return <ListarTurnos />;
    }
  };

  return (
    <div className="layout-container">
      <header className="navbar">
        <h2 className="logo">Gestión de Turnos</h2>
      </header>
      <div className="main-body">
        <aside className="menu-lateral">
          <button
            className="menu-boton"
            onClick={() => setComponenteActivo("listar")}
          >
            Listar Turnos
          </button>
          <button
            className="menu-boton"
            onClick={() => setComponenteActivo("crear")}
          >
            Crear Turno
          </button>
          <button
            className="menu-boton"
            onClick={() => setComponenteActivo("modificar")}
          >
            Modificar Turno
          </button>
          <button
            className="menu-boton"
            onClick={() => setComponenteActivo("eliminar")}
          >
            Eliminar Turno
          </button>
        </aside>
        <main className="content">{renderContenido()}</main>
      </div>
    </div>
  );
}

export default PaginaPrincipal;
