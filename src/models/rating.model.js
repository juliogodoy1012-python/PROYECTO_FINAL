import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  cursoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  fecha: { type: Date, default: Date.now }
});

// Evitar duplicado de rating por usuario y curso
ratingSchema.index({ cursoId: 1, usuarioId: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
