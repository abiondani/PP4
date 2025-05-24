const {
    obtenerPacientePorId,
    crearPaciente,
    eliminarPacientePorIdExterno,
    actualizarPacientePorIdExterno,
} = require("../modelos/pacienteModelo");

async function getPaciente(req, res) {
    try {
        const paciente = await obtenerPacientePorId(req.params.id);
        if (!paciente) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }
        res.json(paciente);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener paciente" });
    }
}

async function postPaciente(req, res) {
    try {
        console.log(req.body);
        const nuevoId = await crearPaciente(req.body);
        res.status(201).json({ mensaje: "Paciente creado", id: nuevoId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear paciente" });
    }
}

async function deletePaciente(req, res) {
    try {
        const filasAfectadas = await eliminarPacientePorIdExterno(
            req.params.id_externo
        );
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }
        res.json({ mensaje: "Paciente eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar paciente" });
    }
}

async function putPaciente(req, res) {
    try {
        const filasAfectadas = await actualizarPacientePorIdExterno(
            req.params.id_externo,
            req.body
        );
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }
        res.json({ mensaje: "Paciente actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar paciente" });
    }
}

module.exports = {
    getPaciente,
    postPaciente,
    deletePaciente,
    putPaciente,
};
