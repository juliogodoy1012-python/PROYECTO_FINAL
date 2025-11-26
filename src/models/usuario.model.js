import pool from "../config/db_mysql.js";

// ==========================================
//  CREAR UN NUEVO USUARIO
// ==========================================
export const crearUsuario = async (nombre, correo, passwordHash) => {
    const sql = `
        INSERT INTO users (nombre, correo, password)
        VALUES (?, ?, ?)
    `;
    const [resultado] = await pool.query(sql, [nombre, correo, passwordHash]);
    return resultado.insertId; 
};

// ==========================================
//  BUSCAR USUARIO POR CORREO
// ==========================================
export const obtenerUsuarioPorCorreo = async (correo) => {
    const sql = `SELECT * FROM users WHERE correo = ?`;
    const [filas] = await pool.query(sql, [correo]);
    return filas[0]; 
};

// ==========================================
//  BUSCAR USUARIO POR ID
// ==========================================
export const obtenerUsuarioPorId = async (id) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [filas] = await pool.query(sql, [id]);
    return filas[0];
};

// ==========================================
//  ASIGNAR UN ROL A UN USUARIO
// ==========================================
export const asignarRolAUsuario = async (usuario_id, rol_id) => {
    const sql = `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, ?)
    `;
    const [resultado] = await pool.query(sql, [usuario_id, rol_id]);
    return resultado.insertId;
};

// ==========================================
//  OBTENER LOS ROLES DE UN USUARIO
// ==========================================
export const obtenerRolesDeUsuario = async (usuario_id) => {
    const sql = `
        SELECT r.role_name
        FROM user_roles ur
        INNER JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ?
    `;
    const [filas] = await pool.query(sql, [usuario_id]);
    return filas;
};

// ==========================================
//  VERIFICAR SI UN USUARIO YA TIENE UN ROL
// ==========================================
export const usuarioYaTieneRol = async (usuario_id, rol_id) => {
    const sql = `
        SELECT id FROM user_roles 
        WHERE user_id = ? AND role_id = ?
    `;
    const [rows] = await pool.query(sql, [usuario_id, rol_id]);
    return rows.length > 0; // true si ya lo tiene
};
