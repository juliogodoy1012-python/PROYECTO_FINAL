import mongoose from "mongoose";

const compraSchema = new mongoose.Schema({
  user_id: {
    type: Number,  // ID del usuario desde MySQL
    required: true
  },
  curso_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Curso",
    required: true
  },
  fecha_compra: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Compra", compraSchema);
