import bcrypt from "bcrypt";
import {
    crearUsuario,
    obtenerUsuarioPorCorreo,
    asignarRolAUsuario,
    obtenerRolesDeUsuario
} from "../models/usuario.model.js";

// ===========================================
//  REGISTRAR UN NUEVO USUARIO
// ===========================================
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        // Verificar que el correo no exista
        const usuarioExistente = await obtenerUsuarioPorCorreo(correo);
        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado."
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuarioId = await crearUsuario(nombre, correo, passwordHash);


        await asignarRolAUsuario(nuevoUsuarioId, 1);

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: {
                id: nuevoUsuarioId,
                nombre,
                correo,
                rol: "visitante"
            }
        });

    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al registrar el usuario."
        });
    }
};

// ===========================================
//  INICIAR SESIÓN
// ===========================================
export const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        const usuario = await obtenerUsuarioPorCorreo(correo);
        if (!usuario) {
            return res.status(400).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        // Comparar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

    
        const roles = await obtenerRolesDeUsuario(usuario.id);

        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            roles: roles.map(r => r.role_name)
        };

        return res.status(200).json({
            mensaje: "Sesión iniciada correctamente.",
            usuario: req.session.usuario
        });

    } catch (error) {
        console.error("Error en iniciarSesion:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al iniciar sesión."
        });
    }
};

// ===========================================
//  CERRAR SESIÓN
// ===========================================
export const cerrarSesion = (req, res) => {
    try {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            return res.status(200).json({
                mensaje: "Sesión cerrada correctamente."
            });
        });
    } catch (error) {
        console.error("Error en cerrarSesion:", error);
        return res.status(500).json({
            mensaje: "No se pudo cerrar la sesión."
        });
    }
};
