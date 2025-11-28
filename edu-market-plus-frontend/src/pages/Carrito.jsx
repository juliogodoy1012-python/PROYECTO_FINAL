import { useEffect, useState } from "react";

function Carrito() {
  const [cursos, setCursos] = useState([]);
  const [cursoData, setCursoData] = useState([]);

  // Verificar Sesión al entrar al carrito
  useEffect(() => {
    const verificarSesion = async () => {
      const respuesta = await fetch("http://localhost:4100/api/auth/perfil", {
        method: "GET",
        credentials: "include"
      });

      if (respuesta.status === 401) {
        alert("Debes iniciar sesión para acceder al carrito.");
        window.location.href = "/login";
      }
    };

    verificarSesion();
  }, []);

  // 🛒 Cargar carrito e insertar curso por URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("curso");

    let carritoPrevio = JSON.parse(localStorage.getItem("carrito")) || [];

    if (cursoId && !carritoPrevio.includes(cursoId)) {
      carritoPrevio.push(cursoId);
      localStorage.setItem("carrito", JSON.stringify(carritoPrevio));
      window.dispatchEvent(new Event("carritoActualizado"));
    }

    setCursos(carritoPrevio);
  }, []);

  //  Cargar información de cursos
  useEffect(() => {
    async function fetchCursos() {
      const data = await Promise.all(
        cursos.map(async (id) => {
          const res = await fetch(`http://localhost:4100/api/courses/${id}`);
          const json = await res.json();
          return json.curso;
        })
      );
      setCursoData(data);
    }

    if (cursos.length > 0) fetchCursos();
  }, [cursos]);

  // ❌ Eliminar curso
  const eliminarCurso = (id) => {
    const nuevoCarrito = cursos.filter(cid => cid !== id);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCursos(nuevoCarrito);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // 🧹 Vaciar carrito
  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCursos([]);
    setCursoData([]);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  //Total
  const total = cursoData.reduce((acc, curso) => acc + curso.precio, 0);

  // 💳 Procesar Pago - con login obligatorio
  const pagar = async () => {
    const cursosParaStripe = cursoData.map(curso => ({
      titulo: curso.titulo,
      precio: curso.precio
    }));

    const resp = await fetch("http://localhost:4100/api/pago/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cursos: cursosParaStripe })
    });

    if (resp.status === 401) {
      alert("Debes iniciar sesión antes de pagar.");
      window.location.href = "/login";
      return;
    }

    const json = await resp.json();
    const stripe = window.Stripe("pk_test_51SGAlFJmPTANdcpkZWGTuEIBDOzhm3ZFjaWA7ctinhhI7wU8jgY8kdn87E4fj9ee5kzJA4ZOxS7hih1f6DepnmCX00jLUGRtUh");

    stripe.redirectToCheckout({ sessionId: json.id });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Carrito de Compra</h1>

      {cursoData.length === 0 ? (
        <p>Tu carrito está vacío 🛒</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cursoData.map((curso) => (
              <li key={curso._id} style={{ marginBottom: "10px" }}>
                <strong>{curso.titulo}</strong> — ${curso.precio}
                <button
                  onClick={() => eliminarCurso(curso._id)}
                  style={{
                    marginLeft: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h2>Total: ${total}</h2>

          <button
            onClick={vaciarCarrito}
            style={{
              marginRight: "15px",
              padding: "10px 20px",
              background: "#444",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Vaciar carrito
          </button>

          <button
            onClick={pagar}
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Proceder a Pago 💳
          </button>
        </>
      )}
    </div>
  );
}

export default Carrito;
