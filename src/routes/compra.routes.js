import { Router } from "express";
import mongoose from "mongoose";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { misCursos } from "../controllers/compra.controller.js";
import Compra from "../models/compra.model.js";

const router = Router();

// LISTA DE CURSOS COMPRADOS POR EL USUARIO
router.get("/mis-cursos", requiereAutenticacion, misCursos);

router.get("/validar/:cursoId/:usuarioId", async (req, res) => {
  try {
    const { cursoId, usuarioId } = req.params;

    const comprasCollection = mongoose.connection.collection("compras");

    let cursoObjectId = new mongoose.Types.ObjectId(cursoId);


    const compra = await Compra.findOne({
  curso_id: cursoObjectId,
  user_id: Number(usuarioId)
});

    return res.json({ comprado: !!compra });

  } catch (error) {
    console.error("Error validando compra:", error);
    return res.status(500).json({ mensaje: "Error verificando compra" });
  }
});

export default router;