
export const requiereRol = (rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.session.usuario) {
            return res.status(401).json({
                mensaje: "Debes iniciar sesión para acceder a esta ruta."
            });
        }

        const rolesUsuario = req.session.usuario.roles; 

        const tienePermiso = rolesUsuario.some(rol =>
            rolesPermitidos.includes(rol)
        );

        if (!tienePermiso) {
            return res.status(403).json({
                mensaje: "No tienes permisos para acceder a esta ruta."
            });
        }

        next(); 
    };
};
