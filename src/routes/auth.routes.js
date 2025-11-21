import { Router } from "express";
import {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
} from "../controllers/auth.controller.js";
import { validarRegistro } from "../middlewares/validaciones.middleware.js";

const router = Router();


// val antes de registrar
router.post("/registro", validarRegistro, registrarUsuario);
router.post("/login", iniciarSesion);

router.get("/logout", cerrarSesion);

export default router;
