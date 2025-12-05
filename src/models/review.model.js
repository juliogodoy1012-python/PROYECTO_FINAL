import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    default: ""
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
