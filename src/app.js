import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/db_mongo.js"; 
connectMongo();  
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import courseRoutes from "./routes/course.routes.js";

dotenv.config();

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Sesiones con cookies
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

// Archivos estáticos 
app.use(express.static("src/public"));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/users", usuarioRoutes);
app.use("/api/courses", courseRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`)
);
