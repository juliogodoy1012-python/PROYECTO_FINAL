import { Router } from "express";
import {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
} from "../controllers/auth.controller.js";

const router = Router();


router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);

router.get("/logout", cerrarSesion);

export default router;
