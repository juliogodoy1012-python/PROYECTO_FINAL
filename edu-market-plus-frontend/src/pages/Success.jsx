import React, { useEffect } from "react";

function Success() {

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length > 0) {
      fetch("http://localhost:4100/api/pago/registrar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursos: carrito })
      });

      localStorage.removeItem("carrito");
    }

  }, []);

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f4f8f9",
      margin: 0,
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
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

        <div style={{ fontSize: "60px", color: "#28a745" }}>✔️</div>

        <h1 style={{ color: "#333", marginTop: "10px" }}>
          ¡Pago exitoso!
        </h1>

        <p style={{ color: "#666", margin: "20px 0" }}>
          Gracias por tu compra. Hemos recibido tu pago correctamente.
        </p>

        <a href="/" style={{
          display: "inline-block",
          padding: "12px 25px",
          backgroundColor: "#050f07",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          transition: "background 0.3s"
        }}>
          Volver al inicio
        </a>

      </div>

    </div>
  );
}

export default Success;
