import React, { useEffect, useState } from "react";
import "./css/PanelMedico.css";

const PanelMedico = ({ user, onLogout }) => {
  const [turnos, setTurnos] = useState([]);
  const [historiasClinicas, setHistoriasClinicas] = useState({});
  const MEDICO_ID = user.id;
  const MEDICO_NOMBRE = user.nombre;
  const headerIconUrl = process.env.REACT_APP_ICONO_URL || "";
  const headerTitle = process.env.REACT_APP_TITULO || "Turnos Médicos";

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resTurnos = await fetch(
          `${process.env.REACT_APP_API_TURNOS_OCUPADOS_HOY}/${MEDICO_ID}`
        );
        if (!resTurnos.ok) throw new Error("Error al obtener turnos");
        const turnosData = await resTurnos.json();
        setTurnos(turnosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    obtenerDatos();
  }, [MEDICO_ID]);

  const cambiarEstado = async (turnoId, nuevoEstadoId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_MODIFICAR_ESTADO_TURNO}/${turnoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado_id: nuevoEstadoId }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      setTurnos((prev) =>
        prev.map((t) =>
          t.turno_id === turnoId
            ? {
                ...t,
                estado_id: nuevoEstadoId,
                estado: nuevoEstadoId === "A" ? "Atendido" : "Ausente",
              }
            : t
        )
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err.message);
    }
  };
  const verHistoriaClinica = async (id_externo_paciente, turnoId) => {
    if (historiasClinicas.hasOwnProperty(turnoId)) {
      setHistoriasClinicas((prev) => {
        const nuevo = { ...prev };
        delete nuevo[turnoId];
        return nuevo;
      });
      return;
    }
    try {
      const res = await fetch(process.env.REACT_APP_API_HISTORIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_externo: id_externo_paciente }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHistoriasClinicas((prev) => ({
        ...prev,
        [turnoId]: data.historia,
      }));
    } catch (error) {
      setHistoriasClinicas((prev) => ({
        ...prev,
        [turnoId]: null,
      }));
      console.error("Error al obtener historia clínica:", error.message);
    }
  };

  if (!turnos) {
    return <div>Cargando turnos...</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* ----------------------------------------- Header --------------------------------------------*/}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          gap: "10px",
        }}
      >
        {headerIconUrl && (
          <img
            src={headerIconUrl}
            alt="Icono"
            style={{ height: 40, width: 110, objectFit: "contain" }}
          />
        )}
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{headerTitle}</h1>
      </header>

      {/* -------------------------------------------------------------- Body ------------------------------------------------------ */}
      <div style={{ display: "flex", flexGrow: 1 }}>
        {/* ---------------------------------------- Menú lateral --------------------------------------------------------- */}
        <nav
          style={{
            width: 200,
            borderRight: "1px solid #ddd",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={onLogout}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "black",
              border: "none",
              borderRadius: 4,
              textAlign: "left",
              marginTop: "auto",
            }}
          >
            Salir
          </button>
        </nav>

        {/* -------------------------------------- Contenido principal ----------------------------------------- */}
        <main style={{ flexGrow: 1, padding: 20 }}>
          <div>
            <h2>Bienvenido, {MEDICO_NOMBRE}!</h2>
          </div>
          <div className="pantalla">
            <h2>Turnos del Día</h2>

            <ul className="lista-turnos">
              {turnos.length === 0 ? (
                <p>No hay turnos para hoy.</p>
              ) : (
                turnos.map((turno) => {
                  const ahora = new Date();
                  const inicio = new Date(turno.fecha);
                  const fin = new Date(
                    inicio.getTime() + turno.duracion * 60000
                  );
                  const enCurso = ahora >= inicio && ahora <= fin;

                  return (
                    <li
                      key={turno.turno_id}
                      className={`turno-item ${enCurso ? "turno-actual" : ""}`}
                    >
                      <div>
                        <strong>{turno.paciente_nombre}</strong> — {turno.hora}{" "}
                        — Estado:{" "}
                        <span
                          className={`estado ${turno.estado.toLowerCase()}`}
                        >
                          {turno.estado}
                        </span>
                      </div>

                      <div className="botones-turno">
                        <button
                          className="boton-atendido"
                          onClick={() => cambiarEstado(turno.turno_id, "A")}
                          disabled={turno.estado_id !== "R"}
                        >
                          Atendido
                        </button>
                        <button
                          className="boton-ausente"
                          onClick={() => cambiarEstado(turno.turno_id, "U")}
                          disabled={turno.estado_id !== "R"}
                        >
                          Ausente
                        </button>
                        <button
                          className="boton-historia"
                          onClick={() =>
                            verHistoriaClinica(
                              turno.id_externo_paciente,
                              turno.turno_id
                            )
                          }
                        >
                          Historia Clínica
                        </button>
                      </div>

                      {/* Mostrar historia clínica si ya fue consultada */}
                      {historiasClinicas.hasOwnProperty(turno.turno_id) && (
                        <div className="historia-clinica">
                          {historiasClinicas[turno.turno_id] ? (
                            <>
                              <strong>Historia Clínica:</strong>
                              <p>{historiasClinicas[turno.turno_id]}</p>
                            </>
                          ) : (
                            <p>El paciente no posee historia clínica.</p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PanelMedico;
