import React, { useEffect, useState } from "react";
import "../css/ListarTurnos.css";

const ListarTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (cargando) return <p>Cargando turnos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="contenedor-turnos">
      <h2>Listado de Turnos</h2>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTurnos;
