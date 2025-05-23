import React, { useEffect, useState } from "react";
import "../css/EliminarTurno.css";
import { useNavigate } from "react-router-dom";

const EliminarTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeToast, setMensajeToast] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const navigate = useNavigate();

  const cargarTurnos = () => {
    fetch("http://localhost:3000/administradores/turnos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los turnos");
        }
        return response.json();
      })
      .then((data) => {
        setTurnos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los turnos.");
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const mostrarToast = (mensaje, tipo = "exito") => {
    setMensajeToast({ texto: mensaje, tipo });
    setTimeout(() => {
      setMensajeToast("");
    }, 3000);
  };

  const confirmarEliminacion = (turno) => {
    setTurnoSeleccionado(turno);
  };

  const cancelarEliminacion = () => {
    setTurnoSeleccionado(null);
  };

  const eliminarTurnoConfirmado = () => {
    if (!turnoSeleccionado) return;

    fetch(
      `http://localhost:3000/administradores/turnos/${turnoSeleccionado.turno_id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar el turno");
        }
        mostrarToast("Turno eliminado correctamente.", "exito");
        cargarTurnos();
      })
      .catch((err) => {
        console.error(err);
        mostrarToast(
          "Ocurrió un error al intentar eliminar el turno.",
          "error"
        );
      })
      .finally(() => {
        setTurnoSeleccionado(null);
      });
  };

  if (cargando) return <p>Cargando turnos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="contenedor-turnos">
      <h2>Eliminar Turno</h2>

      {mensajeToast && mensajeToast.texto && (
        <div className={`eliminar-turnos-toast ${mensajeToast.tipo}`}>
          {mensajeToast.texto}
        </div>
      )}

      {turnoSeleccionado && (
        <div className="eliminar-turnos-modal-overlay">
          <div className="eliminar-turnos-modal">
            <p>¿Desea eliminar el turno seleccionado?</p>
            <div className="modal-botones">
              <button
                className="eliminar-turnos-btn-confirmar"
                onClick={eliminarTurnoConfirmado}
              >
                Sí, eliminar
              </button>
              <button
                className="eliminar-turnos-btn-cancelar"
                onClick={cancelarEliminacion}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="tabla-turnos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Médico</th>
            <th>Especialidad</th>
            <th>Fecha</th>
            <th>Duración</th>
            <th>Consultorio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.turno_id}>
              <td>{turno.turno_id}</td>
              <td>{turno.medico}</td>
              <td>{turno.especialidad}</td>
              <td>{formatearFecha(turno.fecha)}</td>
              <td>{turno.duracion} min</td>
              <td>{turno.consultorio}</td>
              <td>{turno.estado}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => confirmarEliminacion(turno)}
                >
                  Eliminar Turno
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-volver" onClick={() => navigate("/")}>
        Volver a la Página Principal
      </button>
    </div>
  );
};

export default EliminarTurnos;
