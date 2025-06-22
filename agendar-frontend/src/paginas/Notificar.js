import React, { useState } from "react";
import "../css/Notificar.css";

const Notificar = () => {
  const [asuntoMensaje, setAsuntoMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");

  const handleEnviar = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_API_NOTIFICACIONES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asuntoMensaje,
          contenidoMensaje,
        }),
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente.");
        setAsuntoMensaje("");
        setContenidoMensaje("");
      } else {
        alert("Error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="contenedor-turnos">
      <h2>Notificaciones y avisos</h2>
      <form onSubmit={handleEnviar} className="formulario-notificacion">
        <div className="form-group">
          <label htmlFor="asuntoMensaje">Asunto</label>
          <input
            type="text"
            id="asuntoMensaje"
            value={asuntoMensaje}
            onChange={(e) => setAsuntoMensaje(e.target.value)}
            placeholder="Ingrese el asunto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contenidoMensaje">Mensaje</label>
          <textarea
            id="contenidoMensaje"
            value={contenidoMensaje}
            onChange={(e) => setContenidoMensaje(e.target.value)}
            placeholder="Escriba el mensaje"
          ></textarea>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Notificar;
