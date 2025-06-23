const transporter = require("../config/mailConfig");
const {
  obtenerTodosLosPacientes,
  obtenerPacientePorId,
} = require("../modelos/pacienteModelo");
const { obtenerTurnoPorID } = require("../modelos/turnoModelo");
const { obtenerMedicoPorId } = require("../modelos/medicoModelo");

const enviarNotificacionMasiva = async (req, res) => {
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

const enviarEncuesta = async (turno_id, token) => {
  const turno = await obtenerTurnoPorID(turno_id);
  const paciente = await obtenerPacientePorId(turno.paciente_id);
  const link = `${process.env.API_ENCUESTA}/${token}`;
  const mensaje = `<h2>Hola ${paciente.nombre}!</h2>
                  <p>Esperamos que te encuentres bien.</p>
                  <p>En ${process.env.CLINICA_NOMBRE} valoramos mucho tu opinion. Queremos asegurarnos que tu experiencia con nosotros sea siempre la mejor posible. Por eso te invitamos a participar en una breve encuesta de satisfaccion sobre tu reciente visita.<p>
                  <p>Agredecemos de antemano tu tiempo y colaboración. Tu opinión es muy importante para nosotros.</p>
                  <p>Atentamente, <br>El equipo de ${process.env.CLINICA_NOMBRE}</p>
                  <p><a href="${link}">Hacé clic aquí para responder la encuesta</a></p>`;
  await transporter.sendMail({
    from: `"Servicio automatico de encuestas" <${process.env.EMAIL_USER}>`,
    to: paciente.correo,
    subject: "Encuesta de satisfacción",
    html: mensaje,
  });
};

const enviarConfirmacion = async (turno_id, paciente_id) => {
  const mensaje = `
    <h2>Hola [PACIENTE]!</h2>
    <p>Este es un correo automático de la clínica [CLINICA]</p>
    <p style="color:blue;">Usted reservó un turno para el dia [DIA] a las [HORA] con el doctor [DOCTOR].</p>
  `;
  const asunto = "Confirmación de turno";
  await enviarCorreo(turno_id, paciente_id, mensaje, asunto);
};

const enviarCancelacion = async (turno_id, paciente_id) => {
  const mensaje = `
    <h2>Hola [PACIENTE]!</h2>
    <p>Este es un correo automático de la clínica [CLINICA]</p>
    <p style="color:blue;">Usted <strong>canceló</strong> su turno para el dia [DIA] a las [HORA] con el doctor [DOCTOR].</p>
  `;
  const asunto = "Cancelación de turno";
  await enviarCorreo(turno_id, paciente_id, mensaje, asunto);
};

const enviarRecordatorio = async (turno_id, paciente_id) => {
  const mensaje = `
    <h2>Hola [PACIENTE]!</h2>
    <p>Este es un recordatorio automático de la clínica [CLINICA]</p>
    <p style="color:blue;">Usted tiene un turno reservado para mañana, [DIA] a las [HORA] con el doctor [DOCTOR].</p>
  `;
  const asunto = "Confirmación de turno";
  await enviarCorreo(turno_id, paciente_id, mensaje, asunto);
};

const enviarCorreo = async (turno_id, paciente_id, mensaje, asunto) => {
  const turno = await obtenerTurnoPorID(turno_id);
  const paciente = await obtenerPacientePorId(paciente_id);
  const medico = await obtenerMedicoPorId(turno.medico_id);
  const dia = new Date(turno.fecha).toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hora = new Date(turno.fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mensajeFinal = mensaje
    .replace("[DIA]", dia)
    .replace("[HORA]", hora)
    .replace("[DOCTOR]", medico.apellido + ", " + medico.nombre)
    .replace("[CLINICA]", process.env.CLINICA_NOMBRE)
    .replace("[PACIENTE]", paciente.nombre);

  await transporter.sendMail({
    from: `"Notificación turno" <${process.env.EMAIL_USER}>`,
    to: paciente.correo,
    subject: asunto,
    html: mensajeFinal,
  });
};

module.exports = {
  enviarNotificacionMasiva,
  enviarConfirmacion,
  enviarCancelacion,
  enviarRecordatorio,
  enviarEncuesta,
};
