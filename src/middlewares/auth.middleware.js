
export const requiereAutenticacion = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a esta ruta."
        });
    }

    next();
};
