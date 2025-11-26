import {
    obtenerUsuarioPorId,
    obtenerRolesDeUsuario,
    asignarRolAUsuario,
    usuarioYaTieneRol
} from "../models/usuario.model.js";

import pool from "../config/db_mysql.js";

// ==========================================
// LISTAR USUARIOS
// ==========================================
export const listarUsuarios = async (req, res) => {
    try {
        const sql = `
            SELECT id, nombre, correo, created_at
            FROM users
        `;
        const [usuarios] = await pool.query(sql);

        return res.status(200).json({
            mensaje: "Lista de usuarios obtenida correctamente.",
            usuarios
        });

    } catch (error) {
        console.error("Error en listarUsuarios:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al obtener los usuarios."
        });
    }
};

export const obtenerUnUsuario = async (req, res) => {
    try {
        const id = req.params.id;

        const usuario = await obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({
                mensaje: "El usuario no existe."
            });
        }

        const roles = await obtenerRolesDeUsuario(id);

        return res.status(200).json({
            mensaje: "Usuario encontrado.",
            usuario,
            roles
        });

    } catch (error) {
        console.error("Error en obtenerUnUsuario:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al buscar el usuario."
        });
    }
};

// ==========================================
// ASIGNAR ROL — VERSIÓN CORRECTA
// ==============
export const asignarRol = async (req, res) => {
    try {
        const { usuario_id, rol_id } = req.body;

        if (!usuario_id || !rol_id) {
            return res.status(400).json({
                mensaje: "Debes seleccionar un rol antes de asignar."
            });
        }

        // Verificar si ya existe el rol
        const existe = await usuarioYaTieneRol(usuario_id, rol_id);
        if (existe) {
            return res.status(400).json({
                mensaje: "Este usuario ya tiene asignado ese rol."
            });
        }

        // Asigna rol
        await asignarRolAUsuario(usuario_id, rol_id);

        return res.status(201).json({
            mensaje: "Rol asignado correctamente."
        });

    } catch (error) {
        console.error("Error en asignarRol:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al asignar el rol."
        });
    }
};

// ==========================================
// LISTAR ROLES
// ==========================================
export const listarRoles = async (req, res) => {
    try {
        const [roles] = await pool.query("SELECT * FROM roles");
        res.json(roles);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener roles" });
    }
};
