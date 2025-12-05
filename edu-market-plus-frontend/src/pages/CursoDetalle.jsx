import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

axios.defaults.withCredentials = true;

function CursoDetalle() {
  const { id } = useParams();

  const [curso, setCurso] = useState(null);
  const [usuario, setUsuario] = useState(null);
const [comprado, setComprado] = useState(false);

  // Rating
  const [reviews, setReviews] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [ratingSeleccionado, setRatingSeleccionado] = useState(0);
  const [comentario, setComentario] = useState("");
  const [miRating, setMiRating] = useState(0);

  // ============================
  // Obtener Curso
  // ============================
  const obtenerCurso = useCallback(async () => {
    try {
      const r = await axios.get(`http://localhost:4100/api/courses/${id}`);
      setCurso(r.data.curso);
    } catch (e) {
      alert("No se pudo cargar el curso.");
    }
  }, [id]);

  // ============================
  // Obtener Reviews
  // ============================
  const obtenerReviews = useCallback(async () => {
    try {
      const r = await axios.get(`http://localhost:4100/api/reviews/${id}`);
      setReviews(r.data.reviews);
    } catch (e) {
      console.log("Error reviews:", e);
    }
  }, [id]);

  // ============================
  // Obtener Promedio
  // ============================
  const obtenerPromedio = useCallback(async () => {
    try {
      const r = await axios.get(`http://localhost:4100/api/reviews/promedio/${id}`);
      setPromedio(r.data.promedio || 0);
    } catch (e) {
      console.log("Error promedio:", e);
    }
  }, [id]);

  // ============================
  // Validar compra
  // ============================
 const validarCompra = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    const resp = await axios.get(
      `http://localhost:4100/api/compras/validar/${id}/${usuario.id}`,
      { withCredentials: true }
    );

    setComprado(resp.data.comprado);
  } catch (error) {
    console.error("Error validando compra:", error);
  }
};


  // ============================
  // Obtener mi rating
  // ============================
  const obtenerMiRating = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/rating/mio/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMiRating(data.rating);
    } catch (e) {
      console.log("Error mi rating:", e);
    }
  };

  // ============================
  // UseEffect Inicial
  // ============================
 useEffect(() => {
  const u = JSON.parse(localStorage.getItem("usuario"));
  setUsuario(u);

  obtenerCurso();
  obtenerReviews();
  obtenerPromedio();

  if (u) {
    validarCompra();     
    obtenerMiRating();
  }
}, [
  id,
  obtenerCurso,
  obtenerReviews,
  obtenerPromedio,
]);



  // ============================
  // Agregar al carrito
  // ============================
  const handleAddToCart = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!carrito.includes(id)) carrito.push(id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("carritoActualizado"));
    alert("Curso agregado al carrito");
  };

  // ============================
  // Ir al curso / Comprar
  // ============================
  const manejarCompra = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para comprar cursos.");
      window.location.href = "/login";
      return;
    }
    window.location.href = `/carrito?curso=${id}`;
  };

  const manejarEstudio = () => {
    window.location.href = `/curso/${id}/contenido`;
  };

  // ============================
  // Enviar Review
  // ============================
  const enviarReview = async () => {
    if (!ratingSeleccionado)
      return alert("Debes seleccionar una calificación.");

    try {
      await axios.post(
        "http://localhost:4100/api/reviews/crear",
        {
          cursoId: id,
          rating: ratingSeleccionado,
          comentario,
        },
        { withCredentials: true }
      );

      alert("Review enviado correctamente");

      setComentario("");
      setRatingSeleccionado(0);

      obtenerReviews();
      obtenerPromedio();
    } catch (error) {
      alert("No se pudo guardar el review");
      console.log(error);
    }
  };

  // ============================
  // Render
  // ============================
  if (!curso) return <p>Cargando...</p>;

  return (
    <div className="dash-container">
      <header className="dash-header">
        <h1>{curso.titulo}</h1>

        <div className="dash-actions">
          <button className="dash-btn" onClick={() => (window.location.href = "/cursos")}>
            Volver al Catálogo
          </button>
        </div>
      </header>

      <div className="dash-card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {curso.imagen && (
          <img
            src={curso.imagen}
            alt={curso.titulo}
            className="curso-img"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

        {curso.video && (
          <iframe
            className="curso-video"
            src={curso.video.replace("watch?v=", "embed/")}
            allowFullScreen
            title="Video del curso"
          ></iframe>
        )}

        <h2>Descripción</h2>
        <p>{curso.descripcion}</p>
        <p><strong>Categoría:</strong> {curso.categoria}</p>
        <p><strong>Precio:</strong> Q{curso.precio}</p>

        {/* BOTONES SEGÚN ESTADO */}
{/* NO LOGUEADO */}
{!usuario && (
  <button className="dash-btn full" onClick={manejarCompra}>
    Iniciar sesión para comprar
  </button>
)}

{comprado ? (
  <button
    className="dash-btn full"
    onClick={() => window.location.href = `/curso/${id}/contenido`}
  >
    ✔ Ya comprado — Ir al curso
  </button>
) : (
  <button
    className="dash-btn full"
    onClick={manejarCompra}
  >
    Comprar Curso
  </button>
)}



      </div>

      {/* PROMEDIO */}
      <div className="dash-card" style={{ marginTop: "20px" }}>
        <h2>Calificación promedio: {promedio.toFixed(1)} / 5</h2>
      </div>

      {/* DEJAR REVIEW */}
      {usuario && comprado && (
        <div className="dash-card" style={{ marginTop: "20px" }}>
          <h2>Deja tu calificación</h2>

          <div>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={{
                  fontSize: "25px",
                  cursor: "pointer",
                  color: ratingSeleccionado >= num ? "gold" : "gray",
                }}
                onClick={() => setRatingSeleccionado(num)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Escribe un comentario opcional"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            style={{ width: "100%", height: "80px", marginTop: "10px", padding: "10px" }}
          ></textarea>

          <button className="dash-btn full" onClick={enviarReview}>
            Enviar Calificación
          </button>
        </div>
      )}

      {/* LISTA REVIEWS */}
      <div className="dash-card" style={{ marginTop: "20px" }}>
        <h2>Opiniones de estudiantes</h2>

        {reviews.length === 0 ? (
          <p>No hay reviews aún</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>
              {r.comentario && <p>{r.comentario}</p>}
              <small>{new Date(r.fecha).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================
// ESTILOS
// ============================
const styles = {
  btnComprar: {
    width: "100%",
    padding: "15px",
    background: "#ff7f00",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default CursoDetalle;
