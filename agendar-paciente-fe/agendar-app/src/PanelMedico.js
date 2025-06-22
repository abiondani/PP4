import React, { useEffect, useState } from "react";
import "./css/PanelMedico.css";

const PanelMedico = ({ id_externo }) => {
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [historiasClinicas, setHistoriasClinicas] = useState({});

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
  }, [id_externo]);

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
      const res = await fetch("http://localhost:4000/historia", {
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
  );
};

export default PanelMedico;
