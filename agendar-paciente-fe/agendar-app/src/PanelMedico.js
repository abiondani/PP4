import React, { useEffect, useState } from "react";
import "./css/PanelMedico.css";

const PanelMedico = ({ id_externo }) => {
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resUsuario = await fetch(
          `http://localhost:3000/api/medicos/externo/${id_externo}`
        );
        if (!resUsuario.ok) throw new Error("Error al obtener usuario");
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        const resTurnos = await fetch(
          `http://localhost:3000/api/turnos/hoy/${usuarioData.medico_id}`
        );
        if (!resTurnos.ok) throw new Error("Error al obtener turnos");
        const turnosData = await resTurnos.json();
        setTurnos(turnosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  const cambiarEstado = async (turnoId, nuevoEstadoId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/turnos/${turnoId}/estado`,
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

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }
  return (
    <div className="pantalla">
      <h2>Turnos del Día</h2>
      <ul className="lista-turnos">
        {turnos.length === 0 ? (
          <p>No hay turnos para hoy.</p>
        ) : (
          turnos.map((turno) => {
            const ahora = new Date();
            const inicio = new Date(turno.fecha);
            const fin = new Date(inicio.getTime() + turno.duracion * 60000);
            const enCurso = ahora >= inicio && ahora <= fin;

            return (
              <li
                key={turno.turno_id}
                className={`turno-item ${enCurso ? "turno-actual" : ""}`}
              >
                <div>
                  <strong>{turno.paciente_nombre}</strong> — {turno.hora} —
                  Estado:{" "}
                  <span className={`estado ${turno.estado.toLowerCase()}`}>
                    {turno.estado}
                  </span>
                </div>
                <div className="botones-turno">
                  <button
                    onClick={() => cambiarEstado(turno.turno_id, "A")}
                    disabled={turno.estado_id !== "R"}
                  >
                    Atendido
                  </button>
                  <button
                    onClick={() => cambiarEstado(turno.turno_id, "U")}
                    disabled={turno.estado_id !== "R"}
                  >
                    Ausente
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default PanelMedico;
