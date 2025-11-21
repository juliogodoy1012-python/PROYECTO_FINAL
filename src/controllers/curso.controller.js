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
