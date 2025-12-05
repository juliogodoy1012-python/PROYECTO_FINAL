import mongoose from "mongoose";

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado satisfactoriamente");

    global.db = mongoose.connection.db; // para el chat con socket.io

  } catch (err) {
    console.error(" Error conectando a MongoDB:", err);
    process.exit(1);
  }
}
