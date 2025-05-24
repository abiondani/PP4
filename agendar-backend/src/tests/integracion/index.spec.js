const request = require("supertest");
const app = require("../../index.js");
const { crearBaseDeDatosSiNoExiste, getPool } = require("../../db");

beforeAll(async () => {
    await crearBaseDeDatosSiNoExiste();
});

afterAll(async () => {
    const pool = getPool();
    await pool.end();
});

const pacienteDePrueba = {
    id_externo: "ext123456",
    nombre: "Juan",
    apellido: "Topo",
    nro_obra_social: "OSDE",
    correo: "juan.topo@gmail.com",
};

describe("Rutas /api/pacientes", () => {
    let nuevoId;

    it("Debe crear un nuevo paciente [POST /api/pacientes]", async () => {
        const res = await request(app)
            .post("/api/pacientes")
            .send(pacienteDePrueba);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("mensaje", "Paciente creado");
        expect(res.body).toHaveProperty("id");
        nuevoId = res.body.id;
    });

    it("Debe obtener un paciente por Id [GET /api/pacientes/:id]", async () => {
        const res = await request(app).get(`/api/pacientes/${nuevoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("nombre", pacienteDePrueba.nombre);
    });

    it("Debe actualizar un paciente existente [PUT /api/pacientes/:id_externo]", async () => {
        const cambios = { ...pacienteDePrueba, apellido: "Topo II" };

        const res = await request(app)
            .put(`/api/pacientes/${pacienteDePrueba.id_externo}`)
            .send(cambios);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje", "Paciente actualizado");
    });

    it("Debe eliminar un paciente existente [DELETE /api/pacientes/:id_externo]", async () => {
        const res = await request(app).delete(
            `/api/pacientes/${pacienteDePrueba.id_externo}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje", "Paciente eliminado");
    });

    it("Debe devolver 404 si el paciente no existe [GET /api/pacientes/:id]", async () => {
        const res = await request(app).get("/api/pacientes/999999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Paciente no encontrado");
    });

    it("Debe devolver 404 al intentar eliminar paciente inexistente [DELETE /api/pacientes/:id_externo]", async () => {
        const res = await request(app).delete("/api/pacientes/id-falso");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Paciente no encontrado");
    });
});
