import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  estudiante_id: {
    type: Number, // ID del usuario en MySQL
    required: true,
  },
  estrellas: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comentario: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const cursoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
  },
  video: {
    type: String,
  },
  instructor_id: {
    type: Number, // ID del instructor en MySQL
    required: true,
  },
  estudiantes_ids: {
    type: [Number], // IDs de estudiantes (MySQL) que han comprado este curso
    default: [],
  },
  ratings: {
    type: [ratingSchema], // lista de calificaciones y comentarios
    default: [],
  },
  rating_promedio: {
    type: Number,
    default: 0,
  },
  estado: {
    type: Boolean,
    default: true, // true = activo, false = deshabilitado
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Curso", cursoSchema);
