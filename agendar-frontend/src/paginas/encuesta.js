import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Encuesta.css";

const Encuesta = () => {
  const { token } = useParams();
  const [valido, setValido] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const validacionRes = await fetch(
          `http://localhost:3000/api/encuestas/validar/${token}`
        );
        if (!validacionRes.ok) throw new Error("Token inválido o ya usado");

        setValido(true);

        const preguntasRes = await fetch(
          "http://localhost:3000/api/encuestas/preguntas"
        );
        if (!preguntasRes.ok)
          throw new Error("No se pudieron obtener las preguntas");

        const data = await preguntasRes.json();

        setPreguntas(data);

        const respuestasIniciales = {};
        data.forEach((_, i) => {
          respuestasIniciales[`respuesta${i + 1}`] = 0;
        });

        setRespuestas(respuestasIniciales);
      } catch (error) {
        console.error("Error cargando encuesta:", error.message);
        setValido(false);
      }
    };

    cargarDatos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/encuestas/responder/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(respuestas),
        }
      );
      if (!res.ok) throw new Error("Error al enviar");
      setEnviado(true);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const renderEstrellas = (clave) => (
    <div className="estrellas-container">
      <div className="estrellas-linea">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => setRespuestas({ ...respuestas, [clave]: num })}
            className={
              respuestas[clave] >= num ? "estrella activa" : "estrella"
            }
            role="button"
          >
            ★
          </span>
        ))}
      </div>
      <div className="leyendas">
        <span>Poco satisfecho</span>
        <span>Muy satisfecho</span>
      </div>
    </div>
  );

  if (valido === false)
    return (
      <div className="pantalla">
        <div className="formulario-wrapper">
          <p>Este link ya fue usado o es inválido.</p>
        </div>
      </div>
    );

  if (enviado)
    return (
      <div className="pantalla">
        <div className="formulario-wrapper">
          <p>¡Gracias por completar la encuesta!</p>
        </div>
      </div>
    );

  return (
    <div className="pantalla">
      <div className="formulario-wrapper">
        <h2 className="titulo">Encuesta de Satisfacción</h2>
        <form className="formulario" onSubmit={handleSubmit}>
          {preguntas.map((pregunta, index) => {
            const clave = `respuesta${index + 1}`;
            return (
              <div className="form-grupo" key={pregunta.pregunta_id}>
                <label>{pregunta.pregunta}</label>
                {renderEstrellas(clave)}
              </div>
            );
          })}

          <div className="botones">
            <button
              type="submit"
              disabled={Object.values(respuestas).some((v) => v === 0)}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Encuesta;
