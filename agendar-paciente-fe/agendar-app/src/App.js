import React, { useState } from "react";

const API_ESPECIALIDADES = "http://localhost:3000/api/especialidades";
const API_DISPONIBLES =
    "http://localhost:3000/api/turnos/disponiblesPorEspecialidad";

function App() {
    const [especialidades, setEspecialidades] = useState([]);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] =
        useState("");
    const [disponibles, setDisponibles] = useState([]);
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
    const [loadingDisponibles, setLoadingDisponibles] = useState(false);

    const obtenerEspecialidades = () => {
        setLoadingEspecialidades(true);
        fetch(API_ESPECIALIDADES)
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

    const handleChangeEspecialidad = (e) => {
        const id = e.target.value;
        setEspecialidadSeleccionada(id);
        if (id) {
            setLoadingDisponibles(true);
            fetch(`${API_DISPONIBLES}/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setDisponibles(data);
                    setLoadingDisponibles(false);
                })
                .catch((err) => {
                    console.error("Error al obtener disponibles:", err);
                    setLoadingDisponibles(false);
                });
        } else {
            setDisponibles([]);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Especialidades médicas</h1>

            <button onClick={obtenerEspecialidades}>
                Cargar especialidades
            </button>

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
                            <option
                                key={esp.especialidad_id}
                                value={esp.especialidad_id}
                            >
                                {esp.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loadingDisponibles && <p>Cargando turnos disponibles...</p>}

            {disponibles.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Turnos disponibles</h2>
                    <table border="1" cellPadding="8" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Médico ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disponibles.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fecha}</td>
                                    <td>{item.medico_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
