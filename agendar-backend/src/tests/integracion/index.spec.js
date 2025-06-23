const request = require("supertest");
const app = require("../../index.js");
const { crearBaseDeDatosSiNoExiste, getPool } = require("../../db");

beforeAll(async () => {
    await crearBaseDeDatosSiNoExiste();
    pool = getPool();

    // Insertar datos necesarios para claves foráneas
    await pool.query(`INSERT IGNORE INTO estados (estado_id, descripcion) VALUES
      ('L', 'Libre'),
      ('B', 'Bloqueado'),
      ('R', 'Reservado'),
      ('A', 'Atendido'),
      ('U', 'Ausente')`);

    await pool.query(
        `INSERT IGNORE INTO consultorios (descripcion) VALUES ('Consultorio 101')`
    );

    await pool.query(
        `INSERT IGNORE INTO especialidades (descripcion) VALUES ('Cardiología')`
    );
});

afterAll(async () => {
    const pool = getPool();
    await pool.end();
});

// --------------------------------------------------------------------
// PACIENTES
// --------------------------------------------------------------------
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

    it("Debe devolver 404 si el paciente no existe [GET /api/pacientes/:id]", async () => {
        const res = await request(app).get("/api/pacientes/999999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Paciente no encontrado");
    });

    it("Debe obtener un paciente por Id Externo [GET /api/pacientes/externo/:id]", async () => {
        const res = await request(app).get(
            `/api/pacientes/externo/${pacienteDePrueba.id_externo}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("nombre", pacienteDePrueba.nombre);
    });

    it("Debe devolver 404 si el paciente no existe por id externo [GET /api/pacientes/externo/:id]", async () => {
        const res = await request(app).get(`/api/pacientes/externo/999999`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
            "mensaje",
            "Paciente no encontrado por id externo"
        );
    });

    it("Debe devolver la lista de los correos [GET /api/pacientes", async () => {
        const res = await request(app).get("/api/pacientes");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("correo");
    });

    it("Debe actualizar un paciente existente [PUT /api/pacientes/:id_externo]", async () => {
        const cambios = { ...pacienteDePrueba, apellido: "Topo II" };

        const res = await request(app)
            .put(`/api/pacientes/${pacienteDePrueba.id_externo}`)
            .send(cambios);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje", "Paciente actualizado");
    });

    it("Debe devolver 404 si el paciente no existe [PUT /api/pacientes/:id_externo]", async () => {
        const cambios = { ...pacienteDePrueba, apellido: "Topo II" };

        const res = await request(app)
            .put(`/api/pacientes/999999`)
            .send(cambios);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Paciente no encontrado");
    });

    it("Debe eliminar un paciente existente [DELETE /api/pacientes/:id_externo]", async () => {
        const res = await request(app).delete(
            `/api/pacientes/${pacienteDePrueba.id_externo}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje", "Paciente eliminado");
    });

    it("Debe devolver 404 al intentar eliminar paciente inexistente [DELETE /api/pacientes/:id_externo]", async () => {
        const res = await request(app).delete("/api/pacientes/id-falso");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Paciente no encontrado");
    });
});

// --------------------------------------------------------------------
// MEDICOS
// --------------------------------------------------------------------
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

    it("Debe devolver 404 si el médico no existe [GET /api/medicos/:id]", async () => {
        const res = await request(app).get("/api/medicos/999999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Médico no encontrado");
    });

    it("Debe obtener un médico por Id Externo [GET /api/medicos/externo/:id]", async () => {
        const res = await request(app)
            .get(`/api/medicos/externo/${medicoDePrueba.idExterno}`)
            .expect(200);

        expect(res.body).toMatchObject({
            nombre: medicoDePrueba.nombre,
        });
    });

    it("Debe devolver 404 si el médico no existe por Id Externo [GET /api/medicos/externo/:id]", async () => {
        const res = await request(app).get("/api/medicos/externo/999999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Médico no encontrado");
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

    it("Debe devolver 404 si el médico no existe [PUT /api/medicos/:id]", async () => {
        const datosActualizados = {
            nombre: "Ana María",
            apellido: "Gómez",
            matricula: "43210",
        };

        const res = await request(app)
            .put("/api/medicos/999999")
            .send(datosActualizados);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("mensaje", "Médico no encontrado");
    });

    it("Debe eliminar el médico [DELETE /api/medicos/:id]", async () => {
        await request(app)
            .delete(`/api/medicos/${medicoDePrueba.idExterno}`)
            .expect(200);

        await request(app).get(`/api/medicos/${medicoDePrueba.id}`).expect(404);
    });
});

// --------------------------------------------------------------------
// ESPECIALIDADES
// --------------------------------------------------------------------
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

// --------------------------------------------------------------------
// METRICAS
// --------------------------------------------------------------------
describe("Test de Integración: Ruta /api/metricas", () => {
    it("Debe obtener métricas por mes [GET /api/metricas/mes/:mes]", async () => {
        const res = await request(app).get("/api/metricas/mes/6");
        expect([200]).toContain(res.statusCode);
    });

    it("Debe obtener métricas por año [GET /api/metricas/anio/:anio]", async () => {
        const res = await request(app).get("/api/metricas/anio/2025");
        expect([200]).toContain(res.statusCode);
    });
});

// --------------------------------------------------------------------
// ENCUESTAS
// --------------------------------------------------------------------
describe("Test de Integración: Ruta /api/encuestas", () => {
    it("Debe devolver 400 si la encuesta no existe [GET /api/encuestas/validar/:token]", async () => {
        const res = await request(app).get(
            "/api/encuestas/validar/token-ficticio"
        );
        expect([400]).toContain(res.statusCode);
    });

    it("Debe devolver las preguntas [GET /api/encuestas/preguntas]", async () => {
        const res = await request(app).get("/api/encuestas/preguntas");
        expect([200]).toContain(res.statusCode);
    });
});

// --------------------------------------------------------------------
// ADMINISTRADORES
// --------------------------------------------------------------------
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

// --------------------------------------------------------------------
// TURNOS
// --------------------------------------------------------------------
describe("Test de Integración: Ruta /api/turnos", () => {
    let pacienteId, medicoId, especialidadId, consultorioId, turnoId;

    beforeAll(async () => {
        const [espRows] = await pool.query(
            `SELECT especialidad_id FROM especialidades WHERE descripcion = 'Cardiología'`
        );
        especialidadId = espRows[0].especialidad_id;

        const [consRows] = await pool.query(
            `SELECT consultorio_id FROM consultorios LIMIT 1`
        );
        consultorioId = consRows[0].consultorio_id;

        const [paciente] = await pool.query(
            `INSERT INTO pacientes (id_externo, nombre, apellido, nro_obra_social, correo)
             VALUES ('ext-test', 'Test', 'Paciente', '1234', 'test@paciente.com')`
        );
        pacienteId = paciente.insertId;

        const [medico] = await pool.query(
            `INSERT INTO medicos (id_externo, nombre, apellido, matricula)
             VALUES ('medico-test', 'Medico', 'Test', 'ABC123')`
        );
        medicoId = medico.insertId;

        await pool.query(
            `INSERT INTO medicos_especialidades (medico_id, especialidad_id)
             VALUES (?, ?)`,
            [medicoId, especialidadId]
        );

        const [turno] = await pool.query(
            `INSERT INTO turnos (fecha, duracion, estado_id, medico_id, especialidad_id, consultorio_id, fecha_estado)
             VALUES (NOW() + INTERVAL 1 DAY, 30, 'L', ?, ?, ?, NOW())`,
            [medicoId, especialidadId, consultorioId]
        );
        turnoId = turno.insertId;
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM turnos WHERE turno_id = ?`, [turnoId]);
        await pool.query(
            `DELETE FROM medicos_especialidades WHERE medico_id = ? AND especialidad_id = ?`,
            [medicoId, especialidadId]
        );
        await pool.query(`DELETE FROM pacientes WHERE paciente_id = ?`, [
            pacienteId,
        ]);
        await pool.query(`DELETE FROM medicos WHERE medico_id = ?`, [medicoId]);
    });

    it("Debe devolver turnos del médico [GET /api/turnos/disponibles/:medico_id]", async () => {
        const res = await request(app).get(
            `/api/turnos/disponibles/${medicoId}`
        );
        expect([200]).toContain(res.statusCode);
    });

    it("Debe devolver turnos por especialidad [GET /api/turnos/disponiblesPorEspecialidad/:especialidad_id]", async () => {
        const res = await request(app).get(
            `/api/turnos/disponiblesPorEspecialidad/${especialidadId}`
        );
        expect([200]).toContain(res.statusCode);
    });

    it("Debe devolver turnos por especialidad y fecha [POST /api/turnos/disponiblesPorEspecialidadYFecha]", async () => {
        const fecha = new Date().toISOString().split("T")[0];
        const res = await request(app)
            .post(`/api/turnos/disponiblesPorEspecialidadYFecha`)
            .send({ especialidad_id: especialidadId, fecha });
        expect([200]).toContain(res.statusCode);
    });

    it("Debe bloquear el turno [PUT /api/turnos/bloquear]", async () => {
        const res = await request(app)
            .put("/api/turnos/bloquear")
            .send({ turno_id: turnoId });
        expect([200, 400]).toContain(res.statusCode);
    });

    it("Debe reservar turno bloqueado [PUT /api/turnos/reservar]", async () => {
        await pool.query(
            `UPDATE turnos SET estado_id = 'B' WHERE turno_id = ?`,
            [turnoId]
        );

        const res = await request(app)
            .put("/api/turnos/reservar")
            .send({ turno_id: turnoId, paciente_id: pacienteId });
        expect([200]).toContain(res.statusCode);
    });

    it("Debe cancelar turno reservado [PUT /api/turnos/cancelar]", async () => {
        const res = await request(app)
            .put("/api/turnos/cancelar")
            .send({ turno_id: turnoId, paciente_id: pacienteId });
        expect([200]).toContain(res.statusCode);
    });

    it("Debe liberar turno bloqueado [PUT /api/turnos/liberar]", async () => {
        await pool.query(
            `UPDATE turnos SET estado_id = 'B' WHERE turno_id = ?`,
            [turnoId]
        );

        const res = await request(app)
            .put("/api/turnos/liberar")
            .send({ turno_id: turnoId });
        expect([200]).toContain(res.statusCode);
    });

    it("Debe obtener turnos del día [GET /api/turnos/hoy/:medico_id]", async () => {
        const res = await request(app).get(`/api/turnos/hoy/${medicoId}`);
        expect([200]).toContain(res.statusCode);
    });
});
