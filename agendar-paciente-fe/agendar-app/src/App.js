import React, { useState, useEffect } from "react";

function App() {
  const apiEspecialidades = process.env.REACT_APP_API_ESPECIALIDADES;
  const apiDisponibles = process.env.REACT_APP_API_DISPONIBLES_ESPECIALIDAD;
  const apiBloqueadoTurno = process.env.REACT_APP_API_BLOQUEARTURNO;
  const apiLiberarTurno = process.env.REACT_APP_API_LIBERARTURNO;
  const apiReservarTurno = process.env.REACT_APP_API_RESERVAR_TURNO;
  const apiOcupadosPaciente = process.env.REACT_APP_API_OCUPADOS_PACIENTE;
  const apiDisponiblesPorFecha =
    process.env.REACT_APP_API_DISPONIBLES_POR_FECHA;

  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [disponibles, setDisponibles] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [loadingTurnosOcupados, setLoadingTurnosOcupados] = useState(false);
  const [ocupados, setOcupados] = useState([]);

  const [turnoAConfirmar, setTurnoAConfirmar] = useState(null);
  const [mostrandoModal, setMostrandoModal] = useState(false);

  const [turnoAEliminar, setTurnoAEliminar] = useState(null);
  const [mostrandoModalCancelar, setMostrandoModalCancelar] = useState(false);

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    cargarTurnosOcupados();
  }, []);

  const obtenerEspecialidades = () => {
    setLoadingEspecialidades(true);
    fetch(apiEspecialidades)
      .then((res) => res.json())
      .then((data) => {
        setEspecialidades(data);
        setLoadingEspecialidades(false);
      })
      .catch((err) => {
        console.error("Error al obtener especialidades:", err);
        setLoadingEspecialidades(false);
      });
  };

  const cargarDisponibles = (id) => {
    setLoadingDisponibles(true);
    fetch(`${apiDisponibles}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDisponibles(data);
        setLoadingDisponibles(false);
      })
      .catch((err) => {
        console.error("Error al obtener disponibles:", err);
        setLoadingDisponibles(false);
      });
  };

  const handleChangeEspecialidad = (e) => {
    const id = e.target.value;
    setEspecialidadSeleccionada(id);
    if (id) {
      cargarDisponibles(id);
    } else {
      setDisponibles([]);
    }
  };

  const abrirModalConfirmacion = (turno) => {
    const datos = { turno_id: turno.turno_id };
    fetch(apiBloqueadoTurno, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).catch((err) => {
      console.error("Error al lockear el turno: ", err);
    });
    setTurnoAConfirmar(turno);
    setMostrandoModal(true);
  };

  const cerrarModal = () => {
    setTurnoAConfirmar(null);
    setMostrandoModal(false);
  };

  const liberarTurno = () => {
    const datos = { turno_id: turnoAConfirmar.turno_id };
    fetch(apiLiberarTurno, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).catch((err) => {
      console.error("Error al liberar el turno: ", err);
    });
  };

  const confirmarReserva = () => {
    const datos = {
      turno_id: turnoAConfirmar.turno_id,
      paciente_id: 1,
    };
    fetch(apiReservarTurno, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then(() => {
        if (especialidadSeleccionada) {
          cargarDisponibles(especialidadSeleccionada);
        }
        cerrarModal();
        cargarTurnosOcupados();
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
        cerrarModal();
      });
  };

  const formatearFechaLocal = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const cargarTurnosOcupados = () => {
    setLoadingTurnosOcupados(true);
    fetch(`${apiOcupadosPaciente}/1`)
      .then((res) => res.json())
      .then((data) => {
        setOcupados(data);
        setLoadingTurnosOcupados(false);
      })
      .catch((err) => {
        console.error("Error al obtener turnos ocupados:", err);
        setLoadingTurnosOcupados(false);
      });
  };

  const abrirModalCancelacion = (turno) => {
    setTurnoAEliminar(turno);
    setMostrandoModalCancelar(true);
  };

  const confirmarCancelacion = () => {
    fetch(apiLiberarTurno, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ turno_id: turnoAEliminar.turno_id }),
    })
      .then((res) => res.json())
      .then(() => {
        if (especialidadSeleccionada && fechaSeleccionada) {
          buscarTurnosPorFecha();
        }
        cargarTurnosOcupados();
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setMostrandoModalCancelar(false);
        setTurnoAEliminar(null);
      });
  };

  const buscarTurnosPorFecha = () => {
    if (!fechaSeleccionada || !especialidadSeleccionada) return;

    setLoadingDisponibles(true);

    fetch(
      `${apiDisponiblesPorFecha}/${especialidadSeleccionada}?fecha=${fechaSeleccionada}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDisponibles(data);
        setLoadingDisponibles(false);
      })
      .catch((err) => {
        console.error("Error al obtener turnos por fecha:", err);
        setLoadingDisponibles(false);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Especialidades médicas</h1>
      <button onClick={obtenerEspecialidades}>Cargar especialidades</button>
      {loadingEspecialidades && <p>Cargando especialidades...</p>}
      {especialidades.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <label>Seleccionar especialidad:</label>
          <select
            value={especialidadSeleccionada}
            onChange={handleChangeEspecialidad}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="">Seleccione una</option>
            {especialidades.map((esp) => (
              <option key={esp.especialidad_id} value={esp.especialidad_id}>
                {esp.descripcion}
              </option>
            ))}
          </select>
        </div>
      )}

      {especialidadSeleccionada && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setMostrarCalendario(!mostrarCalendario)}>
            {mostrarCalendario ? "Ocultar calendario" : "Elegir otra fecha"}
          </button>

          {mostrarCalendario && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
              />
              <button
                onClick={buscarTurnosPorFecha}
                style={{ marginLeft: "10px" }}
              >
                Buscar turnos en esta fecha
              </button>
            </div>
          )}
        </div>
      )}

      {loadingDisponibles && <p>Cargando turnos disponibles...</p>}

      {especialidadSeleccionada &&
        fechaSeleccionada &&
        !loadingDisponibles &&
        disponibles.length === 0 && (
          <p>No hay turnos disponibles para esta fecha.</p>
        )}

      {especialidadSeleccionada && disponibles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Turnos disponibles</h2>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Médico ID</th>
                <th>Especialidad ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {disponibles.map((item, index) => (
                <tr key={index}>
                  <td>{formatearFechaLocal(item.fecha)}</td>
                  <td>{item.medico_id}</td>
                  <td>{item.especialidad_id}</td>
                  <td>
                    <button
                      onClick={() =>
                        abrirModalConfirmacion({
                          turno_id: item.turno_id,
                          fecha: item.fecha,
                          medico_id: item.medico_id,
                        })
                      }
                    >
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loadingTurnosOcupados && <p>Cargando turnos ocupados...</p>}

      {ocupados.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Turnos ocupados</h2>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Médico ID</th>
                <th>Especialidad ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ocupados.map((item, index) => (
                <tr key={index}>
                  <td>{formatearFechaLocal(item.fecha)}</td>
                  <td>{item.medico_id}</td>
                  <td>{item.especialidad_id}</td>
                  <td>
                    <button onClick={() => abrirModalCancelacion(item)}>
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrandoModal && turnoAConfirmar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p>
              ¿Confirmás reservar el turno para el{" "}
              {formatearFechaLocal(turnoAConfirmar.fecha)}?
            </p>
            <button onClick={confirmarReserva} style={{ marginRight: "10px" }}>
              Confirmar
            </button>
            <button
              onClick={() => {
                liberarTurno();
                cerrarModal();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrandoModalCancelar && turnoAEliminar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p>
              ¿Confirmás cancelar el turno para el{" "}
              {formatearFechaLocal(turnoAEliminar.fecha)}?
            </p>
            <button
              onClick={confirmarCancelacion}
              style={{ marginRight: "10px" }}
            >
              Sí, cancelar
            </button>
            <button onClick={() => setMostrandoModalCancelar(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
