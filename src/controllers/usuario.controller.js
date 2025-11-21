import {
    obtenerUsuarioPorId,
    obtenerRolesDeUsuario,
    asignarRolAUsuario
} from "../models/usuario.model.js";

import pool from "../config/db_mysql.js";

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


export const asignarRol = async (req, res) => {
    try {
        const { usuario_id, rol_id } = req.body;

        if (!usuario_id || !rol_id) {
            return res.status(400).json({
                mensaje: "usuario_id y rol_id son obligatorios."
            });
        }

        await asignarRolAUsuario(usuario_id, rol_id);

        return res.status(200).json({
            mensaje: "Rol asignado correctamente."
        });

    } catch (error) {
        console.error("Error en asignarRol:", error);
        return res.status(500).json({
            mensaje: "Hubo un error al asignar el rol."
        });
    }
};

export const listarRoles = async (req, res) => {
  try {
    const [roles] = await mysql.query("SELECT * FROM roles");
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener roles" });
  }
};
