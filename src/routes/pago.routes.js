import { Router } from "express";
import { requiereAutenticacion } from "../middlewares/auth.middleware.js";
import { crearCheckout, registrarCompra } from "../controllers/pago.controller.js";

const router = Router();

router.post("/checkout", requiereAutenticacion, crearCheckout);

// ESTA ES LA RUTA QUE FALTABA
router.post("/registrar-compra", requiereAutenticacion, registrarCompra);


export default router;
