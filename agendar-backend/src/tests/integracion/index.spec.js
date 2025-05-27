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

describe("Test de Integración: Ruta /api/pacientes", () => {
    const pacienteDePrueba = {
        id_externo: "ext123456",
        nombre: "Juan",
        apellido: "Topo",
        nro_obra_social: "OSDE",
        correo: "juan.topo@gmail.com",
    };

    let nuevoId;

    it("Debe crear un paciente [POST /api/pacientes]", async () => {
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

describe("Test de Integración: Ruta /api/medicos", () => {
    const medicoDePrueba = {
        idExterno: "extMed333334",
        nombre: "Ana",
        apellido: "Garcia",
        matricula: "98765",
    };

    it("Debe crear un médico [POST /api/medicos]", async () => {
        const res = await request(app)
            .post("/api/medicos")
            .send(medicoDePrueba)
            .expect(201);

        expect(res.body).toHaveProperty("id");
        medicoDePrueba.id = res.body.id;
    });

    it("Debe obtener un médico por Id [GET /api/medicos/:id]", async () => {
        const res = await request(app)
            .get(`/api/medicos/${medicoDePrueba.id}`)
            .expect(200);

        expect(res.body).toMatchObject({
            nombre: medicoDePrueba.nombre,
            apellido: medicoDePrueba.apellido,
            matricula: medicoDePrueba.matricula,
        });
    });

    it("Debe actualizar un médico existente [PUT /api/medicos/:id]", async () => {
        const datosActualizados = {
            nombre: "Ana María",
            apellido: "Gómez",
            matricula: "43210",
        };

        await request(app)
            .put(`/api/medicos/${medicoDePrueba.idExterno}`)
            .send(datosActualizados)
            .expect(200);

        const res = await request(app)
            .get(`/api/medicos/${medicoDePrueba.id}`)
            .expect(200);

        expect(res.body.nombre).toBe("Ana María");
        expect(res.body.matricula).toBe("43210");
    });

    it("Debe eliminar el médico [DELETE /api/medicos/:id]", async () => {
        await request(app)
            .delete(`/api/medicos/${medicoDePrueba.idExterno}`)
            .expect(200);

        await request(app).get(`/api/medicos/${medicoDePrueba.id}`).expect(404);
    });
});

describe("Test de Integración: Ruta /api/especialidades", () => {
    beforeAll(async () => {
        const pool = getPool();
        await pool.query(
            `INSERT IGNORE INTO especialidades (especialidad_id, descripcion) 
            VALUES (9990, 'Clinica Medica'), (9991, 'Traumatologia'), (9992, 'Odontologia')`
        );
    });

    afterAll(async () => {
        const pool = getPool();
        await pool.query(
            `DELETE FROM especialidades WHERE especialidad_id in (9990, 9991, 9992)`
        );
    });

    it("Debe devolver la lista de especialidades [GET /especialidades]", async () => {
        const respuesta = await request(app).get("/api/especialidades");
        expect(respuesta.status).toBe(200);
        expect(Array.isArray(respuesta.body)).toBe(true);

        const nombresEspecialidades = respuesta.body.map((e) => e.descripcion);
        expect(nombresEspecialidades).toEqual(
            expect.arrayContaining([
                "Clinica Medica",
                "Traumatologia",
                "Odontologia",
            ])
        );
    });
});

describe("Test de Integración: Ruta /api/administradores", () => {
    let turnoIdCreado;

    beforeAll(async () => {
        const pool = getPool();
        await pool.query(`
            INSERT IGNORE INTO medicos (medico_id, id_externo, nombre, apellido, matricula)
            VALUES (91000, 'ext001', 'Juan', 'Topo', 'xyz123')
        `);

        await pool.query(`
            INSERT IGNORE INTO especialidades (especialidad_id, descripcion)
            VALUES (98000, 'Nutricionista')
        `);

        await pool.query(`
            INSERT IGNORE INTO medicos_especialidades (medico_id, especialidad_id)
            VALUES (91000, 98000)
        `);

        await pool.query(`
            INSERT IGNORE INTO consultorios (consultorio_id, descripcion)
            VALUES (10000, 'Consultorio 101')
        `);

        await pool.query(`
            INSERT IGNORE INTO estados (estado_id, descripcion)
            VALUES ('L', 'Libre'), ('R', 'Reservado')
        `);
    });

    it("Debe crear turnos [POST /api/administradores]", async () => {
        const turnoData = {
            anio: 2025,
            mes: 6,
            idMedico: 91000,
            dias: "Lunes,Miércoles",
            hora_inicio: "09:00:00",
            hora_fin: "12:00:00",
            duracion: 30,
            idConsultorio: 10000,
        };

        const respuesta = await request(app)
            .post("/api/administradores/")
            .send(turnoData);

        expect(respuesta.status).toBe(200);
        expect(Array.isArray(respuesta.body)).toBe(true);
    });

    it("Debe listar turnos [GET /api/administradores/turnos]", async () => {
        const respuesta = await request(app).get("/api/administradores/turnos");
        expect(respuesta.status).toBe(200);
        expect(Array.isArray(respuesta.body)).toBe(true);

        if (respuesta.body.length > 0) {
            turnoIdCreado = respuesta.body[0].turno_id;
        }
    });

    it("Debe modificar un turno [PUT /api/administradores/turnos/:id]", async () => {
        if (!turnoIdCreado) return;

        const nuevaData = {
            fecha: "2025-06-15",
            duracion: 45,
            estado_id: "R",
        };

        const respuesta = await request(app)
            .put(`/api/administradores/turnos/${turnoIdCreado}`)
            .send(nuevaData);

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual(
            expect.objectContaining({
                mensaje: "Turno modificado correctamente",
            })
        );
    });

    it("Debe eliminar un turno [DELETE /api/administradores/turnos/:id]", async () => {
        if (!turnoIdCreado) return;

        const respuesta = await request(app).delete(
            `/api/administradores/turnos/${turnoIdCreado}`
        );
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual(
            expect.objectContaining({
                mensaje: "Turno eliminado correctamente",
            })
        );
    });
});
