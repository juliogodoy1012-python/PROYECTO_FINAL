import { useEffect } from "react";

function Success() {
  useEffect(() => {
    const registrarCompra = async () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        return;
      }

      try {
        const resp = await fetch("http://localhost:4100/api/courses/registrar-compra", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursos: carrito }),
        });

        if (!resp.ok) {
          console.error("Error al registrar compra");
        }
      } catch (e) {
        console.error("Error en registrarCompra:", e);
      } finally {
        // Limpio carrito local
        localStorage.removeItem("carrito");
      }
    };

    registrarCompra();
  }, []);

  const irAMisCursos = () => {
    window.location.href = "/panel-estudiante";
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f4f8f9"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%"
      }}>
        <div style={{ fontSize: "60px", color: "#28a745" }}>✔</div>
        <h1>Pago exitoso</h1>
        <p>Tu compra se ha procesado correctamente y los cursos han sido asignados a tu cuenta.</p>
        <button
          onClick={irAMisCursos}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#050f07",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Ir a Mis Cursos
        </button>
      </div>
    </div>
  );
}

export default Success;
