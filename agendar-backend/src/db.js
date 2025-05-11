import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool;

async function crearBaseDeDatosSiNoExiste() {
    try {
        // Conexión sin base de datos para crearla si no existe
        const conexionTemporal = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || "",
        });

        await conexionTemporal.query(
            `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
        );
        console.log(
            `Base de datos '${process.env.DB_NAME}' verificada/creada.`
        );
        await conexionTemporal.end();

        // Ahora sí creamos el pool con la base de datos ya garantizada
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    } catch (error) {
        console.error(
            "Error al crear/verificar la base de datos:",
            error.message
        );
        process.exit(1);
    }
}

export { crearBaseDeDatosSiNoExiste, pool };
