import React, { useEffect, useState } from "react";
import "../css/ModificarTurnos.css";
import { useNavigate } from "react-router-dom";

const ModificarTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/administradores/turnos")
      .then((response) => response.json())
      .then((data) => {
        setTurnos(data);
      });
  }, []);

  const handleChange = (index, campo, valor) => {
    const nuevosTurnos = [...turnos];
    nuevosTurnos[index][campo] = valor;
    setTurnos(nuevosTurnos);
  };

  const handleModificar = (turno) => {
    setToast({
      turno,
      mensaje: "¿Desea modificar el turno solicitado?",
    });
  };

  // Función para formatear fecha ISO local para input datetime-local
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  // Función para formatear fecha para MySQL (YYYY-MM-DD HH:mm:ss)
  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const confirmarModificar = (confirmado) => {
    if (!confirmado) {
      setToast(null);
      return;
    }

    const { turno_id, fecha, duracion, estado_id } = toast.turno;

    fetch(`http://localhost:3000/administradores/turnos/${turno_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: formatDateForMySQL(fecha), // Fecha en formato MySQL
        duracion: Number(duracion), // Duración como número
        estado_id: estado_id || "L", // Valor por defecto "L"
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al modificar turno");
        return res.json();
      })
      .then(() => {
        alert("Turno modificado correctamente");
        setToast(null);
      })
      .catch((error) => {
        alert("Error: " + error.message);
        setToast(null);
      });
  };

  return (
    <div className="contenedor-modificar">
      <h2>Modificar Turnos</h2>
      <table className="tabla-modificar">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno, index) => (
            <tr key={turno.turno_id}>
              <td>{turno.turno_id}</td>
              <td>
                <input
                  type="datetime-local"
                  value={formatDateForInput(turno.fecha)}
                  onChange={(e) => handleChange(index, "fecha", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={turno.duracion}
                  onChange={(e) =>
                    handleChange(index, "duracion", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={turno.estado_id || "L"}
                  onChange={(e) =>
                    handleChange(index, "estado_id", e.target.value)
                  }
                >
                  <option value="L">Libre</option>
                  <option value="R">Reservado</option>
                  <option value="A">Atendido</option>
                  <option value="B">Bloqueado</option>
                </select>
              </td>
              <td>
                <button
                  className="btn-modificar"
                  onClick={() => handleModificar(turno)}
                >
                  Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {toast && (
        <div className="toast-modificar">
          <p>{toast.mensaje}</p>
          <button onClick={() => confirmarModificar(true)}>Sí</button>
          <button onClick={() => confirmarModificar(false)}>No</button>
        </div>
      )}

      <button className="btn-volver" onClick={() => navigate("/")}>
        Volver
      </button>
    </div>
  );
};

export default ModificarTurnos;
