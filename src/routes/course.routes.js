import { Router } from "express";
import {
    crearCurso,
    listarCursos,
    obtenerCurso
} from "../controllers/curso.controller.js";

import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { requiereRol } from "../middlewares/rol.middleware.js";
import { validarCurso } from "../middlewares/validaciones.middleware.js";

const router = Router();
router.post(
    "/crear",
    requiereAutenticacion,
    requiereRol(["instructor"]),
    validarCurso,
    crearCurso
);

router.get("/", listarCursos);
router.get("/:id", obtenerCurso);

export default router;
