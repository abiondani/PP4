import React from "react";
import "../css/FormularioTurno.css";

function FormularioTurno() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      anio: e.target.anio.value,
      mes: e.target.mes.value,
      idMedico: e.target.medico_id.value,
      dias: e.target.dias.value,
      hora_inicio: e.target.hora_inicio.value,
      hora_fin: e.target.hora_fin.value,
      duracion: e.target.duracion_minutos.value,
      idConsultorio: e.target.consultorio_id.value,
    };

    try {
      const res = await fetch("http://localhost:3000/administradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error en la petición");
      const json = await res.json();
      alert(json.mensaje || "Turnos generados");
    } catch (error) {
      console.error(error);
      alert("Error al generar turnos");
    }
  };

  return (
    <div className="formulario-wrapper">
      <h2 className="titulo">Generar Turnos</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label>Año:</label>
          <input type="number" name="anio" required />
        </div>

        <div className="form-grupo">
          <label>Mes:</label>
          <input type="number" name="mes" required />
        </div>

        <div className="form-grupo">
          <label>Médico ID:</label>
          <input type="number" name="medico_id" required />
        </div>

        <div className="form-grupo">
          <label>Días:</label>
          <input
            type="text"
            name="dias"
            placeholder="Lunes,Martes..."
            required
          />
        </div>

        <div className="form-grupo">
          <label>Hora inicio:</label>
          <input type="time" name="hora_inicio" required />
        </div>

        <div className="form-grupo">
          <label>Hora fin:</label>
          <input type="time" name="hora_fin" required />
        </div>

        <div className="form-grupo">
          <label>Duración (minutos):</label>
          <input type="number" name="duracion_minutos" required />
        </div>

        <div className="form-grupo">
          <label>Consultorio ID:</label>
          <input type="number" name="consultorio_id" required />
        </div>

        <button type="submit">Generar</button>
      </form>
    </div>
  );
}

export default FormularioTurno;
