import Compra from "../models/compra.model.js";
import Curso from "../models/curso.model.js";

export const misCursos = async (req, res) => {
  const user_id = req.session.usuario.id;

  const compras = await Compra.find({ user_id }).populate("curso_id");

  return res.json({
    ok: true,
    cursos: compras.map(c => c.curso_id)
  });
};
