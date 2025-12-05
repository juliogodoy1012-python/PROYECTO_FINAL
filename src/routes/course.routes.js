import { Router } from "express";
import {
  crearCurso,
  listarCursos,
  obtenerCurso,
  registrarCompraCursos,
  agregarRatingCurso,
} from "../controllers/curso.controller.js";

import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { requiereRol } from "../middlewares/rol.middleware.js";
import { validarCurso } from "../middlewares/validaciones.middleware.js";

const router = Router();

// Crear curso (solo instructor)
router.post(
  "/crear",
  requiereAutenticacion,
  requiereRol(["instructor"]),
  validarCurso,
  crearCurso
);

// Listar todos los cursos
router.get("/", listarCursos);

// Obtener un curso por id de Mongo
router.get("/:id", obtenerCurso);

// Registrar compra de cursos (después de Stripe)
// Body: { cursos: [idCurso1, idCurso2, ...] }
router.post(
  "/registrar-compra",
  requiereAutenticacion,
  registrarCompraCursos
);

// Agregar rating y comentario a un curso
// POST /api/courses/:id/rating
router.post(
  "/:id/rating",
  requiereAutenticacion,
  requiereRol(["estudiante"]),
  agregarRatingCurso
);

export default router;
