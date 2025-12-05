import mongoose from "mongoose";

export const misCursos = async (req, res) => {
  try {
    const userId = req.session.usuario.id; // ID del usuario autenticado

    const comprasCollection = mongoose.connection.collection("compras");

    // Buscar todas las compras del usuario
    const compras = await comprasCollection.find({ user_id: userId }).toArray();

    const cursosIds = compras.map(c => c.curso_id.toString());

    return res.json({
      ok: true,
      cursosIds
    });

  } catch (error) {
    console.error("Error listando compras:", error);
    res.status(500).json({ mensaje: "Error obteniendo cursos" });
  }
};
