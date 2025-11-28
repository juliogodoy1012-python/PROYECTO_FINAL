import { Router } from "express";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { misCursos } from "../controllers/compra.controller.js";

const router = Router();

router.get("/mis-cursos", requiereAutenticacion, misCursos);

export default router;
