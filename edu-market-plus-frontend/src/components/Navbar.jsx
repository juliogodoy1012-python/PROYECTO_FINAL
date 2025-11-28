import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

function Navbar() {
  const [carritoCount, setCarritoCount] = useState(0);

  // Actualizar contador cuando se modifica el carrito
  useEffect(() => {
    const actualizarContador = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarritoCount(carrito.length);
    };

    actualizarContador();

    window.addEventListener("carritoActualizado", actualizarContador);
    return () => window.removeEventListener("carritoActualizado", actualizarContador);
  }, []);

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logo}>
        EduMarketPlus
      </Link>

      {/* MENÚ DERECHO */}
      <div style={styles.menuDerecha}>
        <Link to="/cursos" style={styles.link}>
          Cursos
        </Link>

        {/* ÍCONO DEL CARRITO */}
        <Link to="/carrito" style={styles.carrito}>
          <FaShoppingCart size={22} />
          {carritoCount > 0 && (
            <span style={styles.badge}>{carritoCount}</span>
          )}
        </Link>

        {/* BOTONES */}
        <Link to="/login" style={styles.btnLogin}>
          Login
        </Link>

        <Link to="/registro" style={styles.btnRegistro}>
          Registrarse
        </Link>
      </div>
    </nav>
  );
}

// 🎨 ESTILOS
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
};

export default Navbar;
