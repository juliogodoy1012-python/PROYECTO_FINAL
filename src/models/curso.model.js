import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,  // URL de imagen
        required: false
    },
    video: {
        type: String, // URL de YouTube
        required: false
    },
    instructor_id: {
        type: Number, // ID del instructor en MySQL
        required: true
    },
    estado: {
        type: Boolean,
        default: true // true = activo, false = deshabilitado
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Curso", cursoSchema);
