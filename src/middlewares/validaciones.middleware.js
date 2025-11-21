//  validacion de cmpoas de registro
// =========================================
export const validarRegistro = (req, res, next) => {
    const { nombre, correo, password } = req.body;

    // Val campos vacíos
    if (!nombre || !correo || !password) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios."
        });
    }

    // val correo 
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(correo)) {
        return res.status(400).json({
            mensaje: "El correo no tiene un formato válido."
        });
    }

    // Validar contraseña segura:
    // mínimo 8 caracteres
    //una mayúscula
    // una minúscula
    // un número
    //  un símbolo
    const passwordFuerte =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordFuerte.test(password)) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        });
    }

    next();
};


export const validarCurso = (req, res, next) => {
    const { titulo, descripcion, categoria, precio } = req.body;

    if (!titulo || !descripcion || !categoria || !precio) {
        return res.status(400).json({
            mensaje: "Debe ingresar título, descripción, categoría y precio."
        });
    }

    // Valida precio como número
    if (isNaN(precio) || Number(precio) <= 0) {
        return res.status(400).json({
            mensaje: "El precio debe ser un número mayor a 0."
        });
    }

    // Valida tamaño del título
    if (titulo.length < 4 || titulo.length > 100) {
        return res.status(400).json({
            mensaje: "El título debe tener entre 4 y 100 caracteres."
        });
    }

    // Valida categoría
    const categoriasValidas = ["Programación", "Reposteria", "Marketing", "Negocios", "Otro"];

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({
            mensaje: "La categoría no es válida."
        });
    }

    next();
};

export const validarAsignacionRol = (req, res, next) => {
    const { usuario_id, rol_id } = req.body;

    if (!usuario_id || !rol_id) {
        return res.status(400).json({
            mensaje: "Debe enviar usuario_id y rol_id."
        });
    }

    if (isNaN(usuario_id) || isNaN(rol_id)) {
        return res.status(400).json({
            mensaje: "usuario_id y rol_id deben ser números."
        });
    }

    next();
};
