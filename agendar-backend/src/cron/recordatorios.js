const cron = require("node-cron");
const { obtenerTurnosPorFecha } = require("../modelos/turnoModelo");
const { enviarRecordatorio } = require("../controladores/emailControlador");

cron.schedule("0 0 * * *", async () => {
  const turnos = await obtenerTurnosPorFecha();

  for (const turno of turnos) {
    enviarRecordatorio(turno.turno_id, turno.paciente_id);
  }
});
