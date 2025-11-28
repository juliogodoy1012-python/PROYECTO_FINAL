import Stripe from "stripe";
import Compra from "../models/compra.model.js";
import Curso from "../models/curso.model.js";

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
    const { cursos } = req.body;

    // usuario autenticado viene desde req.session.usuario
    const user_id = req.session.usuario.id;

    for (let cursoId of cursos) {
      await Compra.create({
        user_id: user_id,
        curso_id: cursoId
      });
    }

    return res.json({
      ok: true,
      mensaje: "Compra registrada correctamente."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error registrando compra" });
  }
};
