import http from "http";
import { Server } from "socket.io";
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/db_mongo.js";
import ratingRoutes from "./routes/rating.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});


await connectMongo();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Rutas API (después de sesión)
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import courseRoutes from "./routes/course.routes.js";
import pagoRoutes from "./routes/pago.routes.js";
import compraRoutes from "./routes/compra.routes.js";
import reviewRoutes from "./routes/review.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", usuarioRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ratings", ratingRoutes);

// SOCKET.IO
io.on("connection", async (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("unirseSala", async ({ usuario, sala }) => {
    socket.join(sala);
    socket.username = usuario;
    socket.room = sala;

    const mensajes = await global.db
      .collection("mensajes")
      .find({ sala })
      .sort({ fecha: 1 })
      .toArray();

    socket.emit("historial", mensajes);
  });

  socket.on("mensaje", async (texto) => {
    if (!socket.username || !socket.room) return;

    const nuevoMsg = {
      usuario: socket.username,
      sala: socket.room,
      mensaje: texto,
      fecha: new Date(),
    };

    await global.db.collection("mensajes").insertOne(nuevoMsg);
    io.to(socket.room).emit("nuevoMensaje", nuevoMsg);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
});
