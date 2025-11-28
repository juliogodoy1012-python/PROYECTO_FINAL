import { Router } from "express";
import { crearCheckout, registrarCompra } from "../controllers/pago.controller.js";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkout", requiereAutenticacion, crearCheckout);

router.post("/registrar", requiereAutenticacion, registrarCompra);

export default router;
