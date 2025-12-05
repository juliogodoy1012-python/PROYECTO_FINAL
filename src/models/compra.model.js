import mongoose from "mongoose";

const CompraSchema = new mongoose.Schema({
  user_id: {
    type: Number, 
    required: true
  },
  curso_id: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: "Curso"
},
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Compra", CompraSchema);
