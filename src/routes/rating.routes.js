import { Router } from "express";
import Rating from "../models/rating.model.js";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";

const router = Router();

// ⭐ Registrar o actualizar rating
router.post("/calificar", requiereAutenticacion, async (req, res) => {
  try {
    const usuarioId = new mongoose.Types.ObjectId(req.usuario.id);
    const { cursoId, rating } = req.body;

    if (!cursoId || !rating) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    await Rating.findOneAndUpdate(
      { cursoId, usuarioId },
      { rating },
      { upsert: true }
    );

    res.json({ ok: true, mensaje: "Rating registrado correctamente" });

  } catch (error) {
    console.error("Error registrando rating:", error);
    res.status(500).json({ mensaje: "Error registrando rating" });
  }
});

// ⭐ Obtener promedio del curso
router.get("/promedio/:cursoId", async (req, res) => {
  try {
    const { cursoId } = req.params;

    const resultado = await Rating.aggregate([
      { $match: { cursoId: new mongoose.Types.ObjectId(cursoId) } },
      { $group: { _id: null, promedio: { $avg: "$rating" } } }
    ]);

    const promedio = resultado.length > 0 ? resultado[0].promedio : 0;

    res.json({ promedio });

  } catch (error) {
    console.error("Error obteniendo promedio:", error);
    res.status(500).json({ mensaje: "Error obteniendo promedio" });
  }
});

// ⭐ Obtener rating del usuario (para marcar estrellas)
router.get("/mio/:cursoId", requiereAutenticacion, async (req, res) => {
  try {
    const usuarioId = new mongoose.Types.ObjectId(req.usuario.id);
    const { cursoId } = req.params;

    const rating = await Rating.findOne({
      cursoId,
      usuarioId
    });

    res.json({ rating: rating?.rating || 0 });

  } catch (error) {
    console.error("Error obteniendo rating del usuario:", error);
    res.status(500).json({ mensaje: "Error obteniendo rating usuario" });
  }
});

export default router;
