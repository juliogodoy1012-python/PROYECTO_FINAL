import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

function Navbar() {
  const [carritoCount, setCarritoCount] = useState(0);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const roles = usuario?.roles || [];

  const esAdmin = roles.includes("administrador");

  useEffect(() => {
    const actualizarCarrito = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarritoCount(carrito.length);
    };

    actualizarCarrito();
    window.addEventListener("carritoActualizado", actualizarCarrito);
    return () =>
      window.removeEventListener("carritoActualizado", actualizarCarrito);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO / INICIO */}
      <Link to="/" style={styles.logo}>
        EduMarketPlus
      </Link>

      {/* MENÚ DERECHO */}
      <div style={styles.menuDerecha}>
        {/* Inicio siempre va en el logo */}

        {/* VER CURSOS (todos) */}
        <Link to="/cursos" style={styles.link}>
          Cursos
        </Link>

        {/* MIS CURSOS: solo logueados que NO sean admin */}
        {usuario && !esAdmin && (
          <Link to="/panel-estudiante" style={styles.link}>
            Mis Cursos
          </Link>
        )}

        {/* CARRITO:
            - Oculto si NO está logueado
            - Oculto para admin
        */}
        {usuario && !esAdmin && (
          <Link to="/carrito" style={styles.carrito}>
            <FaShoppingCart size={22} />
            {carritoCount > 0 && (
              <span style={styles.badge}>{carritoCount}</span>
            )}
          </Link>
        )}

        {/* SOPORTE (todos lo ven) */}
        <Link to="/chat" style={styles.link}>
          Soporte
        </Link>

        {/* PANEL ADMIN: solo admin */}
        {usuario && esAdmin && (
          <Link to="/admin" style={styles.link}>
            Panel Admin
          </Link>
        )}

        {/* NO LOGUEADO: Login + Registro, SIN carrito */}
        {!usuario && (
          <>
            <Link to="/login" style={styles.btnLogin}>
              Login
            </Link>
            <Link to="/registro" style={styles.btnRegistro}>
              Registrarse
            </Link>
          </>
        )}

        {/* LOGUEADO: botón Cerrar sesión */}
        {usuario && (
          <button onClick={handleLogout} style={styles.btnLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}

// ESTILOS (diseño inicial)
const styles = {
  nav: {
    width: "100%",
    padding: "15px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "0 0 20px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#ffa94d",
    textDecoration: "none",
  },
  menuDerecha: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    fontSize: "16px",
    color: "white",
    textDecoration: "none",
  },
  carrito: {
    position: "relative",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "orange",
    color: "white",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  btnLogin: {
    padding: "8px 16px",
    background: "#ff8c32",
    color: "white",
    borderRadius: "20px",
    textDecoration: "none",
  },
  btnRegistro: {
    padding: "8px 16px",
    background: "#7f00ff",
    color: "white",
    borderRadius: "20px",
    textDecoration: "none",
  },
  btnLogout: {
    padding: "8px 16px",
    background: "red",
    color: "white",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
  },
};

export default Navbar;
