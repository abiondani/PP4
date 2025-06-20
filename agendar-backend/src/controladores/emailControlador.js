const transporter = require("../config/mailConfig");
const { obtenerTodosLosPacientes } = require("../modelos/pacienteModelo");

const enviarMensaje = async (req, res) => {
  const { asuntoMensaje, contenidoMensaje } = req.body;

  try {
    const pacientes = await obtenerTodosLosPacientes();

    const destinatarios = pacientes
      .map((p) => p.correo)
      .filter((correo) => correo && correo.includes("@"));

    if (destinatarios.length === 0) {
      return res
        .status(400)
        .json({ error: "No se encontraron correos válidos de pacientes." });
    }

    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      bcc: destinatarios,
      subject: asuntoMensaje,
      text: contenidoMensaje,
    });

    res
      .status(200)
      .json({ mensaje: "Correo enviado a todos los pacientes exitosamente." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
};

module.exports = {
  enviarMensaje,
};
