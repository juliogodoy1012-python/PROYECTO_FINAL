import { Router } from "express";
import mongoose from "mongoose";
import Review from "../models/review.model.js";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. OBTENER REVIEWS DE UN CURSO
router.get("/:cursoId", async (req, res) => {
  try {
    const { cursoId } = req.params;

    const reviews = await Review.find({ cursoId });

    res.json({ reviews });

  } catch (error) {
    console.error("Error listando reviews:", error);
    res.status(500).json({ mensaje: "Error obteniendo reviews" });
  }
});


// 2. CREAR REVIEW (solo usuarios autenticados)
router.post("/crear", requiereAutenticacion, async (req, res) => {
  try {
    const { cursoId, rating, comentario } = req.body;

    if (!rating) {
      return res.status(400).json({ mensaje: "El rating es obligatorio" });
    }

    const nuevo = await Review.create({
      cursoId: new mongoose.Types.ObjectId(cursoId),
      usuarioId: new mongoose.Types.ObjectId(req.usuario.id),
      rating,
      comentario
    });

    res.json({
      ok: true,
      mensaje: "Review registrado con éxito",
      review: nuevo
    });

  } catch (error) {
    console.error("Error creando review:", error);
    res.status(500).json({ mensaje: "Error guardando review" });
  }
});


// 3. OBTENER PROMEDIO DE ESTRELLAS
router.get("/promedio/:cursoId", async (req, res) => {
  try {
    const { cursoId } = req.params;

    const reviews = await Review.find({ cursoId });

    if (reviews.length === 0) {
      return res.json({ promedio: 0 });
    }

    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const promedio = total / reviews.length;

    res.json({ promedio });

  } catch (error) {
    console.error("Error en promedio:", error);
    res.status(500).json({ mensaje: "Error calculando promedio" });
  }
});

export default router;
