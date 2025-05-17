import { obtenerEspecialidades } from "../modelos/especialidadModelo.js";

export async function getEspecialidad(req, res) {
    try {
        const especialidades = await obtenerEspecialidades();
        if (!especialidades) {
            return res
                .status(404)
                .json({ mensaje: "Especialidades no encontradas" });
        }
        console.log("controlador:" + especialidades);
        res.json(especialidades);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener especialidades" });
    }
}
