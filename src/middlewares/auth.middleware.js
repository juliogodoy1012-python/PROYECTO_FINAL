export const requiereAutenticacion = (req, res, next) => {
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: "Debes iniciar sesión." });
  }

  // pasar el usuario a la request
  req.usuario = req.session.usuario;

  next();
};
