import Curso from "../models/curso.model.js";

// =============================================
//  crear curso(solo instructor)
// =============================================
export const crearCurso = async (req, res) => {
    try {
        const { titulo, descripcion, categoria, precio, imagen, video } = req.body;

        if (!titulo || !descripcion || !categoria || !precio) {
            return res.status(400).json({
                mensaje: "Los campos título, descripción, categoría y precio son obligatorios."
            });
        }


        const nuevoCurso = await Curso.create({
            titulo,
            descripcion,
            categoria,
            precio,
            imagen: imagen || null,
            video: video || null,
            instructor_id: req.session.usuario.id
        });

        return res.status(201).json({
            mensaje: "Curso creado correctamente.",
            curso: nuevoCurso
        });

    } catch (error) {
        console.error("Error en crearCurso:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al crear el curso."
        });
    }
};

// =============================================
// listar los cursos todos
// =============================================
export const listarCursos = async (req, res) => {
    try {
        const cursos = await Curso.find({});

        return res.status(200).json({
            mensaje: "Lista de cursos obtenida correctamente.",
            cursos
        });

    } catch (error) {
        console.error("Error en listarCursos:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al obtener los cursos."
        });
    }
};


export const obtenerCurso = async (req, res) => {
    try {
        const id = req.params.id;
        const curso = await Curso.findById(id);

        if (!curso) {
            return res.status(404).json({
                mensaje: "El curso no existe."
            });
        }

        return res.status(200).json({
            mensaje: "Curso encontrado.",
            curso
        });

    } catch (error) {
        console.error("Error en obtenerCurso:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al obtener el curso."
        });
    }
};


// =============================================
//  Registrar compra de cursos (después de Stripe)
// =============================================
export const registrarCompraCursos = async (req, res) => {
  try {
    // Usuario logueado desde la sesión (MySQL)
    const usuarioSesion = req.session.usuario;

    if (!usuarioSesion) {
      return res.status(401).json({
        mensaje: "Debes iniciar sesión para registrar la compra.",
      });
    }

    const { cursos } = req.body; // arreglo de IDs de cursos de Mongo

    if (!Array.isArray(cursos) || cursos.length === 0) {
      return res.status(400).json({
        mensaje: "No se recibieron cursos para registrar.",
      });
    }

    // Para cada curso, agrego el id del estudiante al arreglo estudiantes_ids
    for (const cursoId of cursos) {
      await Curso.findByIdAndUpdate(
        cursoId,
        {
          $addToSet: { estudiantes_ids: usuarioSesion.id }, // evita duplicados
        },
        { new: true }
      );
    }

    return res.status(200).json({
      mensaje: "Compra registrada correctamente. Cursos asignados al estudiante.",
    });
  } catch (error) {
    console.error("Error en registrarCompraCursos:", error);
    return res.status(500).json({
      mensaje: "Hubo un error al registrar la compra.",
    });
  }
};

// =============================================
//  Agregar rating / comentario a un curso
// =============================================
export const agregarRatingCurso = async (req, res) => {
  try {
    const usuarioSesion = req.session.usuario;
    const { id } = req.params; // id del curso (Mongo)
    const { estrellas, comentario } = req.body;

    if (!usuarioSesion) {
      return res.status(401).json({
        mensaje: "Debes iniciar sesión para calificar.",
      });
    }

    if (!estrellas || estrellas < 1 || estrellas > 5) {
      return res.status(400).json({
        mensaje: "Las estrellas deben estar entre 1 y 5.",
      });
    }

    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        mensaje: "El comentario es obligatorio.",
      });
    }

    const curso = await Curso.findById(id);

    if (!curso) {
      return res.status(404).json({
        mensaje: "Curso no encontrado.",
      });
    }

    // Verificar que el estudiante haya comprado el curso
    if (!curso.estudiantes_ids.includes(usuarioSesion.id)) {
      return res.status(403).json({
        mensaje: "Solo los estudiantes que compraron este curso pueden calificarlo.",
      });
    }

    // Agregar rating
    curso.ratings.push({
      estudiante_id: usuarioSesion.id,
      estrellas,
      comentario,
    });

    // Recalcular promedio
    const totalEstrellas = curso.ratings.reduce(
      (acc, r) => acc + r.estrellas,
      0
    );
    curso.rating_promedio = totalEstrellas / curso.ratings.length;

    await curso.save();

    return res.status(200).json({
      mensaje: "Calificación registrada correctamente.",
      rating_promedio: curso.rating_promedio,
      ratings: curso.ratings,
    });
  } catch (error) {
    console.error("Error en agregarRatingCurso:", error);
    return res.status(500).json({
      mensaje: "Hubo un error al registrar la calificación.",
    });
  }
};
