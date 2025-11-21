import { Router } from "express";
import {
    listarUsuarios,
    obtenerUnUsuario,
    asignarRol
} from "../controllers/usuario.controller.js";

import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { requiereRol } from "../middlewares/rol.middleware.js";

const router = Router();

// SOLO ADMINISTRADOR PUEDE USAR ESTAS RUTAS
router.get("/lista", requiereAutenticacion, requiereRol(["administrador"]), listarUsuarios);

router.get("/:id", requiereAutenticacion, requiereRol(["administrador"]), obtenerUnUsuario);

router.post("/asignar-rol", requiereAutenticacion, requiereRol(["administrador"]), asignarRol);

export default router;
