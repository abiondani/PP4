import express from "express";
import {
    getMedico,
    postMedico,
    deleteMedico,
    putMedico,
} from "../controladores/medicoControlador.js";

const medicosRouter = express.Router();

medicosRouter.get("/:id", getMedico);
medicosRouter.post("/", postMedico);
medicosRouter.delete("/:id", deleteMedico);
medicosRouter.put("/:id", putMedico);

export default medicosRouter;
