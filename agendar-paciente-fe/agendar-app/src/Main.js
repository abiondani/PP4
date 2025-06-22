import React, { useState } from "react";

function Main({ user, onLogout }) {
  const apiEspecialidades = process.env.REACT_APP_API_ESPECIALIDADES;
  const apiDisponibles = process.env.REACT_APP_API_DISPONIBLES_ESPECIALIDAD;
  const apiBloqueadoTurno = process.env.REACT_APP_API_BLOQUEARTURNO;
  const apiLiberarTurno = process.env.REACT_APP_API_LIBERARTURNO;
  const apiReservarTurno = process.env.REACT_APP_API_RESERVAR_TURNO;
  const apiOcupadosPaciente = process.env.REACT_APP_API_OCUPADOS_PACIENTE;
  const apiCancelarTurno = process.env.REACT_APP_API_CANCELAR_TURNO;

  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [disponibles, setDisponibles] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [loadingTurnosOcupados, setLoadingTurnosOcupados] = useState(false);
  const [ocupados, setOcupados] = useState([]);

  const [turnoAConfirmar, setTurnoAConfirmar] = useState(null);
  const [mostrandoModal, setMostrandoModal] = useState(false);

  const [turnoACancelar, setTurnoACancelar] = useState(null);
  const [mostrandoModalCancelacion, setMostrandoModalCancelacion] =
    useState(false);

  const [modificandoTurno, setModificandoTurno] = useState(false);
  const [turnosAModificar, setTurnoAModificar] = useState(null);
  const [turnosNuevosParaModificacion, setTurnosNuevosParaModificacion] =
    useState([]);
  const [turnoNuevoAReservar, setTurnoNuevoAReservar] = useState([]);
  const [
    mostrandoModalConfirmarModificacion,
    setmostrandoModalConfirmarModificacion,
  ] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [
    fechaSeleccionadaParaModificacion,
    setFechaSeleccionadaParaModificacion,
  ] = useState(new Date().toISOString().split("T")[0]);

  const [vista, setVista] = useState(null); // null = bienvenida, "reserva" o "ocupados"

  console.log("Usuario: " + user.id + " " + user.nombre);
  const PACIENTE_ID = user.id;
  const PACIENTE_NOMBRE = user.nombre;

  const headerIconUrl = process.env.REACT_APP_ICONO_URL || "";
  const headerTitle = process.env.REACT_APP_TITULO || "Turnos Médicos";

  /* ------------------------- Funciones para manejar el menú ---------------------------------------- */

  const mostrarReserva = () => setVista("reserva");
  const mostrarOcupados = () => setVista("ocupados");

  /* ------------------------------------------------- Funciones ABM ----------------------------------------- */

  const recuperarTurnos = async (especialidad_id, fecha) => {
    const datos = { especialidad_id: especialidad_id, fecha: fecha };

    return await fetch(apiDisponibles, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((res) => {
        if (res.status === 404) {
          return [];
        }

        return res.json();
      })
      .catch((err) => {
        console.error("Error al obtener disponibles:", err);
        return [];
      });
  };

  const bloquearTurno = (id) => {
    const datos = { turno_id: id };
    fetch(apiBloqueadoTurno, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error al blockear el turno: ", err);
      });
  };

  const liberarTurno = (id) => {
    const datos = {
      turno_id: id,
    };
    fetch(apiLiberarTurno, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error al liberar el turno: ", err);
      });
  };

  const reservarTurno = async (turno) => {
    await fetch(apiReservarTurno, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turno),
    })
      .then((res) => res.json())
      .then((respuesta) => {
        console.log("Respuesta del backend:", respuesta);
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
      });
  };

  const cancelarTurno = async (id) => {
    const datos = {
      turno_id: id,
      paciente_id: PACIENTE_ID,
    };
    await fetch(apiCancelarTurno, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((respuesta) => {
        console.log("Respuesta del backend:", respuesta);
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
      });
  };

  const formatearFechaLocal = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  /*-------------------------------------------Carga de turnos para reserva--------------------------------------------------------------*/

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

  const cargarDisponibles = async (id, fecha = fechaSeleccionada) => {
    setLoadingDisponibles(true);
    const turnos = await recuperarTurnos(id, fecha);
    setDisponibles(turnos);
    setLoadingDisponibles(false);
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

  const handleChangeFecha = async (e) => {
    const fecha = e.target.value;
    setFechaSeleccionada(fecha);
    if (fecha && especialidadSeleccionada) {
      await cargarDisponibles(especialidadSeleccionada, fecha);
    } else {
      setDisponibles([]);
    }
  };

  /*----------------------------------------------Reserva de turno-----------------------------------------------------------*/

  const abrirModalConfirmacion = (turno) => {
    bloquearTurno(turno.turno_id);
    setTurnoAConfirmar(turno);
    setMostrandoModal(true);
  };

  const cargarTurnosParaModificacion = async (id, fecha) => {
    setModificandoTurno(true);
    const turnos = await recuperarTurnos(id, fecha);
    setTurnosNuevosParaModificacion(turnos);
  };

  const cerrarModal = () => {
    setTurnoAConfirmar(null);
    setMostrandoModal(false);
  };

  const confirmarReserva = async () => {
    const datos = {
      turno_id: turnoAConfirmar.turno_id,
      paciente_id: PACIENTE_ID,
    };
    await reservarTurno(datos);

    if (especialidadSeleccionada) {
      cargarDisponibles(especialidadSeleccionada);
    }
    cerrarModal();
    cargarTurnosOcupados();
  };

  /*------------------------------------------------Cancelacion de turno----------------------------------------------*/

  const cancelarReserva = async () => {
    await cancelarTurno(turnoACancelar.turno_id);
    if (especialidadSeleccionada) {
      cargarDisponibles(especialidadSeleccionada);
    }
    cerrarModalCancelacion();
    cargarTurnosOcupados();
  };

  const abrirModalConfirmarCancelacion = (turno) => {
    setTurnoACancelar(turno);
    setMostrandoModalCancelacion(true);
  };

  const cerrarModalCancelacion = () => {
    setTurnoACancelar(null);
    setMostrandoModalCancelacion(false);
  };

  /*-------------------------------------------------Modificacion de turno----------------------------------------*/

  const abrirModalConfirmarModificacion = (turno) => {
    bloquearTurno(turno.turno_id);
    setmostrandoModalConfirmarModificacion(true);
    setTurnoNuevoAReservar(turno);
  };

  const cerrarModalModificacion = () => {
    setTurnoNuevoAReservar(null);
    setmostrandoModalConfirmarModificacion(false);
  };

  const confirmarModificacion = async () => {
    await cancelarTurno(turnosAModificar.turno_id);

    const datos = {
      turno_id: turnoNuevoAReservar.turno_id,
      paciente_id: PACIENTE_ID,
    };
    await reservarTurno(datos);

    if (especialidadSeleccionada) {
      cargarDisponibles(especialidadSeleccionada);
    }
    setModificandoTurno(false);
    cerrarModalModificacion();
    cargarTurnosOcupados();
    setTurnoAModificar(null);
    setTurnosNuevosParaModificacion([]);
    setTurnoNuevoAReservar(null);
  };

  const handleChangeFechaModificacion = async (e) => {
    const fecha = e.target.value;
    setFechaSeleccionadaParaModificacion(fecha);
    if (fecha && turnosAModificar.especialidad_id) {
      await cargarTurnosParaModificacion(
        turnosAModificar.especialidad_id,
        fecha
      );
    } else {
      setTurnosNuevosParaModificacion([]);
    }
  };

  /*-------------------------------------------Carga de turnos ocupados--------------------------------------------------------------*/

  const cargarTurnosOcupados = () => {
    fetch(`${apiOcupadosPaciente}/${PACIENTE_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setOcupados(data);
        setLoadingTurnosOcupados(false);
      })
      .catch((err) => {
        console.error("Error al obtener disponibles:", err);
        setLoadingTurnosOcupados(false);
      });
  };

  /* --------------------------------------------------Visual----------------------------------------------------------- */
  if (!PACIENTE_ID) {
    return <div>Cargando usuario...</div>;
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
            onClick={() => {
              mostrarReserva();
              obtenerEspecialidades();
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: vista === "reserva" ? "#007bff" : "transparent",
              color: vista === "reserva" ? "white" : "black",
              border: "none",
              borderRadius: 4,
              textAlign: "left",
            }}
          >
            Reservar nuevo turno
          </button>
          <button
            onClick={() => {
              cargarTurnosOcupados();
              mostrarOcupados();
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: vista === "ocupados" ? "#007bff" : "transparent",
              color: vista === "ocupados" ? "white" : "black",
              border: "none",
              borderRadius: 4,
              textAlign: "left",
            }}
          >
            Ver turnos ocupados
          </button>
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
          {vista === null && (
            <div>
              <h2>Bienvenido, {PACIENTE_NOMBRE}!</h2>
              <p>Seleccione una opción del menú para comenzar.</p>
            </div>
          )}

          {vista === "reserva" && (
            <div>
              <h1>Especialidades médicas</h1>

              {loadingEspecialidades && <p>Cargando especialidades...</p>}

              {especialidades.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <label>Seleccionar especialidad:</label>
                  <select
                    value={especialidadSeleccionada}
                    onChange={handleChangeEspecialidad}
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                    }}
                  >
                    <option value="">Seleccione una</option>
                    {especialidades.map((esp) => (
                      <option
                        key={esp.especialidad_id}
                        value={esp.especialidad_id}
                      >
                        {esp.descripcion}
                      </option>
                    ))}
                  </select>
                  <div style={{ marginTop: "10px" }}>
                    <label>Fecha:</label>
                    <input
                      type="date"
                      value={fechaSeleccionada}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={handleChangeFecha}
                      style={{
                        marginLeft: "10px",
                        padding: "5px",
                      }}
                    />
                  </div>
                </div>
              )}

              {loadingDisponibles && <p>Cargando turnos disponibles...</p>}
              {especialidadSeleccionada &&
                !loadingDisponibles &&
                disponibles.length === 0 && (
                  <p>No hay turnos disponibles en esa fecha</p>
                )}
              {disponibles.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h2>Turnos disponibles</h2>
                  <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Médico ID</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {disponibles.map((item, index) => (
                        <tr key={index}>
                          <td>{formatearFechaLocal(item.fecha)}</td>
                          <td>{item.medico_id}</td>
                          <td>
                            <button
                              onClick={() =>
                                abrirModalConfirmacion({
                                  turno_id: item.turno_id,
                                  fecha: formatearFechaLocal(item.fecha),
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
            </div>
          )}

          {vista === "ocupados" && (
            <div>
              {loadingTurnosOcupados && <p>Cargando turnos ocupados...</p>}

              {ocupados.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h2>Turnos ocupados</h2>
                  <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Médico ID</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ocupados.map((item, index) => (
                        <tr key={index}>
                          <td>{formatearFechaLocal(item.fecha)}</td>
                          <td>{item.medico_id}</td>
                          <td>
                            <button
                              onClick={() => {
                                setTurnoAModificar(item);
                                const fecha = new Date(item.fecha)
                                  .toISOString()
                                  .split("T")[0];
                                setFechaSeleccionadaParaModificacion(fecha);
                                cargarTurnosParaModificacion(
                                  item.especialidad_id,
                                  fecha
                                );
                              }}
                            >
                              Modificar
                            </button>
                            <button
                              onClick={() =>
                                abrirModalConfirmarCancelacion({
                                  turno_id: item.turno_id,
                                  fecha: formatearFechaLocal(item.fecha),
                                  medico_id: item.medico_id,
                                })
                              }
                            >
                              Cancelar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {modificandoTurno && turnosNuevosParaModificacion.length >= 0 && (
                <div style={{ marginTop: "10px" }}>
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={fechaSeleccionadaParaModificacion}
                    onChange={handleChangeFechaModificacion}
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                    }}
                  />
                </div>
              )}
              {modificandoTurno &&
                turnosNuevosParaModificacion.length === 0 && (
                  <p>No hay turnos disponibles en esa fecha</p>
                )}
              {modificandoTurno && turnosNuevosParaModificacion.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h2>Turnos disponibles</h2>
                  <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Médico ID</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnosNuevosParaModificacion.map((item, index) => (
                        <tr key={index}>
                          <td>{formatearFechaLocal(item.fecha)}</td>
                          <td>{item.medico_id}</td>
                          <td>
                            <button
                              onClick={() =>
                                abrirModalConfirmarModificacion({
                                  turno_id: item.turno_id,
                                  fecha: formatearFechaLocal(item.fecha),
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
            </div>
          )}
        </main>
      </div>
      {/* -------------------------------------------- Modales ------------------------------------------------ */}
      <div style={{ padding: "20px" }}>
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
                textAlign: "center",
                minWidth: "300px",
              }}
            >
              <h3>¿Confirmar reserva?</h3>
              <p>
                <strong>Fecha:</strong> {turnoAConfirmar.fecha}
                <br />
                <strong>Médico ID:</strong> {turnoAConfirmar.medico_id}
              </p>
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={confirmarReserva}
                  style={{ marginRight: "10px" }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    liberarTurno(turnoAConfirmar.turno_id);
                    cerrarModal();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrandoModalCancelacion && turnoACancelar && (
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
                textAlign: "center",
                minWidth: "300px",
              }}
            >
              <h3>¿Cancelar reserva?</h3>
              <p>
                <strong>Fecha:</strong> {turnoACancelar.fecha}
                <br />
                <strong>Médico ID:</strong> {turnoACancelar.medico_id}
              </p>
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={cancelarReserva}
                  style={{ marginRight: "10px" }}
                >
                  Sí
                </button>
                <button onClick={cerrarModalCancelacion}>No</button>
              </div>
            </div>
          </div>
        )}

        {mostrandoModalConfirmarModificacion &&
          turnosAModificar &&
          turnoNuevoAReservar && (
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
                  textAlign: "center",
                  minWidth: "300px",
                }}
              >
                <h3>¿Confirmar modificacion?</h3>
                <p>
                  <strong>Fecha vieja:</strong>{" "}
                  {formatearFechaLocal(turnosAModificar.fecha)}
                  <br />
                  <strong>Médico ID:</strong> {turnosAModificar.medico_id}
                  <br />
                  <strong>Fecha nueva:</strong> {turnoNuevoAReservar.fecha}
                </p>
                <div style={{ marginTop: "20px" }}>
                  <button onClick={confirmarModificacion}>Aceptar</button>
                  <button
                    onClick={() => {
                      liberarTurno(turnoNuevoAReservar.turno_id);
                      cerrarModalModificacion();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default Main;
