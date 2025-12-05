import Stripe from "stripe";
import Compra from "../models/compra.model.js";
import Curso from "../models/curso.model.js";
import mongoose from "mongoose";

const stripe = new Stripe("sk_test_51SGAlFJmPTANdcpkcQobPdrEPIhVW65AIulUuXoLdCf6Wir87UbQNJg4UVH32CxDCcPFaWxF9HZeDoxCASZ3RvFS00Q99oauN7");

// CREA LA SESIÓN DE CHECKOUT
export const crearCheckout = async (req, res) => {
  try {
    const { cursos } = req.body;

    const line_items = cursos.map(curso => ({
      price_data: {
        currency: "usd",
        product_data: { name: curso.titulo },
        unit_amount: Math.round(curso.precio * 100),
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/carrito",
    });

    res.json({ id: session.id });

  } catch (error) {
    console.log("Error Stripe:", error);
    res.status(500).json({ mensaje: "Error creando checkout" });
  }
};


// REGISTRAR COMPRA EN MONGO
export const registrarCompra = async (req, res) => {
  try {
    const user_id = req.usuario.id; // viene de la sesión
    const { cursos } = req.body;    // array de IDs (string)

    if (!cursos || cursos.length === 0) {
      return res.status(400).json({ mensaje: "No hay cursos para registrar" });
    }

    // Registrar cada curso comprado
    for (let cursoId of cursos) {
      await Compra.create({
        user_id: user_id,
        curso_id: new mongoose.Types.ObjectId(cursoId),

      });
    }

    res.json({
      ok: true,
      mensaje: "Compra registrada correctamente."
    });

  } catch (error) {
    console.error("Error registrando compra:", error);
    res.status(500).json({ mensaje: "Error registrando compra" });
  }
};

