import { useEffect, useState } from "react";

function Carrito() {
  const [cursos, setCursos] = useState([]);         
  // cursos almacena únicamente los IDs guardados en el carrito

  const [cursoData, setCursoData] = useState([]);   
  // cursoData almacena la información completa de cada curso (titulo, precio, etc.)

  // Verificar sesión al entrar al carrito
  // Esto evita que un usuario no autenticado pueda pagar
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

  // Cargar carrito desde localStorage e insertar curso si viene desde la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("curso");  // Obtengo el curso enviado desde el botón comprar

    let carritoPrevio = JSON.parse(localStorage.getItem("carrito")) || [];

    // Si el curso viene en la URL y no está en el carrito, lo agrego
    if (cursoId && !carritoPrevio.includes(cursoId)) {
      carritoPrevio.push(cursoId);
      localStorage.setItem("carrito", JSON.stringify(carritoPrevio));
      window.dispatchEvent(new Event("carritoActualizado"));
    }

    setCursos(carritoPrevio);
  }, []);

  // Obtener la información completa de cada curso almacenado en el carrito
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

    // Solo cargar los cursos cuando existan IDs
    if (cursos.length > 0) fetchCursos();
  }, [cursos]);

  // Eliminar un curso del carrito
  const eliminarCurso = (id) => {
    const nuevoCarrito = cursos.filter(cid => cid !== id);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCursos(nuevoCarrito);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // Vaciar completamente el carrito
  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCursos([]);
    setCursoData([]);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // Calcular el total sumando los precios de todos los cursos cargados
  const total = cursoData.reduce((acc, curso) => acc + curso.precio, 0);

  // Enviar los datos del carrito al backend para crear la sesión de Stripe
  const pagar = async () => {
    // Creo un arreglo con el formato que Stripe necesita
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

    // Si el backend responde 401, significa que el usuario no está logueado
    if (resp.status === 401) {
      alert("Debes iniciar sesión antes de pagar.");
      window.location.href = "/login";
      return;
    }

    // Si todo sale bien, recibo el sessionId para redirigir al checkout de Stripe
    const json = await resp.json();
    const stripe = window.Stripe("pk_test_51SGAlFJmPTANdcpkZWGTuEIBDOzhm3ZFjaWA7ctinhhI7wU8jgY8kdn87E4fj9ee5kzJA4ZOxS7hih1f6DepnmCX00jLUGRtUh");

    stripe.redirectToCheckout({ sessionId: json.id });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Carrito de Compra</h1>

      {cursoData.length === 0 ? (
        <p>Tu carrito está vacío</p>
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
            Proceder a Pago
          </button>
        </>
      )}
    </div>
  );
}

export default Carrito;
