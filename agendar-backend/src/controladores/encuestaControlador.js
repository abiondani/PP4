const { v4: uuidv4 } = require("uuid");
const {
    generarTokenEncuesta,
    obtenerTokenEncuesta,
    guardarRespuestaEncuesta,
    obtenerPreguntasEncuesta,
} = require("../modelos/encuestaModelo");

async function crearTokenEncuesta() {
    const token = uuidv4();
    await generarTokenEncuesta(token);
    return token;
}

async function validarTokenEncuesta(req, res) {
    const token = await obtenerTokenEncuesta(req.params.token);
    if (!token || token.usado) {
        return res.status(400).json({ error: "Link inválido o ya usado" });
    }
    res.json({ valido: true });
}

async function enviarRespuestaEncuesta(req, res) {
    const token = req.params.token;
    const respuestas = req.body;
    const tokenGuardado = await obtenerTokenEncuesta(token);
    if (!tokenGuardado || tokenGuardado.usado) {
        return res.status(400).json({ error: "Link inválido o ya usado" });
    }

    await guardarRespuestaEncuesta(token, respuestas);
    res.json({ mensaje: "Respuestas guardadas correctamente" });
}

async function obtenerPreguntas(req, res) {
    try {
        const preguntas = await obtenerPreguntasEncuesta();
        if (preguntas.length === 0) {
            return res
                .status(404)
                .json({ error: "No hay preguntas disponibles" });
        }
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({
            error:
                "Error al obtener preguntas de la encuesta: " + error.message,
        });
    }
}

module.exports = {
    crearTokenEncuesta,
    validarTokenEncuesta,
    enviarRespuestaEncuesta,
    obtenerPreguntas,
};
