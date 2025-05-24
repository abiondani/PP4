const { verificarCredenciales } = require("../modelos/loginModelo.js");

async function loginUsuario(req, res) {
    try {
        const { usuario, contrasena } = req.body;
        console.log("Datos recibidos en login:", { usuario, contrasena });

        if (!usuario || !contrasena) {
            return res.status(400).json({ mensaje: "Faltan credenciales" });
        }

        const datosUsuario = await verificarCredenciales(usuario, contrasena);
        console.log("Resultado verificarCredenciales:", datosUsuario);

        if (!datosUsuario) {
            return res
                .status(401)
                .json({ mensaje: "Credenciales incorrectas" });
        }

        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: datosUsuario,
        });
    } catch (error) {
        console.error("Error en loginUsuario:", error);
        res.status(500).json({
            error: "Error en el servidor al verificar credenciales",
            detalles: error.message,
        });
    }
}

module.exports = {
    loginUsuario,
};
