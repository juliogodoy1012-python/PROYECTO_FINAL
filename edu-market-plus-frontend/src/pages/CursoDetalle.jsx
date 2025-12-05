import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true;

function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // estado para rating/comentarios
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviandoRating, setEnviandoRating] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(userData);

    obtenerCurso();
  }, []);

  const obtenerCurso = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:4100/api/courses/${id}`);
      setCurso(respuesta.data.curso);
    } catch (error) {
      alert("No se pudo cargar el curso.");
    }
  };

  const manejarCompra = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para comprar cursos.");
      window.location.href = "/login";
      return;
    }

    window.location.href = `/carrito?curso=${id}`;
  };

  const manejarEstudio = () => {
    window.location.href = `/curso/${id}/contenido`; // luego lo creamos
  };

  const usuarioPuedeCalificar = () => {
    if (!usuario || !curso) return false;
    if (!usuario.roles.includes("estudiante")) return false;
    if (!curso.estudiantes_ids) return false;
    return curso.estudiantes_ids.includes(usuario.id);
  };

  const enviarRating = async (e) => {
    e.preventDefault();
    if (!usuarioPuedeCalificar()) {
      alert("Solo los estudiantes que compraron el curso pueden calificar.");
      return;
    }

    try {
      setEnviandoRating(true);
      const resp = await axios.post(
        `http://localhost:4100/api/courses/${id}/rating`,
        { estrellas, comentario },
        { withCredentials: true }
      );

      alert(resp.data.mensaje);

      // refrescar datos del curso para ver nuevo promedio y comentario
      setComentario("");
      setEstrellas(5);
      await obtenerCurso();
    } catch (error) {
      alert(
        error.response?.data?.mensaje ||
        "Hubo un error al enviar tu calificación."
      );
    } finally {
      setEnviandoRating(false);
    }
  };

  if (!curso) return <p>Cargando...</p>;

  return (
    <div className="dash-container">

      <header className="dash-header">
        <h1>{curso.titulo}</h1>

        <div className="dash-actions">
          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/cursos")}
          >
            Volver al Catálogo
          </button>
        </div>
      </header>

      <div className="dash-card" style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Imagen */}
        {curso.imagen && (
          <img
            src={curso.imagen}
            alt={curso.titulo}
            className="curso-img"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

        {/* Video (solo a modo demo, luego podemos bloquear si no lo compró) */}
        {curso.video && (
          <iframe
            className="curso-video"
            src={curso.video.replace("watch?v=", "embed/")}
            allowFullScreen
            title="Introducción del curso"
          ></iframe>
        )}

        <h2 style={{ marginTop: "20px" }}>Descripción</h2>
        <p>{curso.descripcion}</p>

        <p><strong>Categoría:</strong> {curso.categoria}</p>
        <p><strong>Precio:</strong> Q{curso.precio}</p>

        {/* Promedio de rating */}
        {typeof curso.rating_promedio === "number" && curso.ratings && curso.ratings.length > 0 && (
          <p>
            <strong>Rating promedio:</strong>{" "}
            {curso.rating_promedio.toFixed(1)} / 5 ({curso.ratings.length} reseñas)
          </p>
        )}

        {/* BOTONES DEPENDIENDO DEL USUARIO */}
        {!usuario ? (
          <button className="dash-btn full" onClick={manejarCompra}>
            Iniciar Sesión para Comprar
          </button>
        ) : usuario.roles.includes("estudiante") ? (
          <button className="dash-btn full" onClick={manejarCompra}>
            Comprar Curso
          </button>
        ) : usuario.roles.includes("instructor") ? (
          <p style={{ marginTop: "20px" }}>
            (Eres instructor. No puedes comprar cursos.)
          </p>
        ) : usuario.roles.includes("administrador") ? (
          <p style={{ marginTop: "20px" }}>
            (Eres administrador. Este curso es solo para estudiantes.)
          </p>
        ) : null}

      </div>

      {/* Sección de comentarios y rating */}
      <div className="dash-card" style={{ maxWidth: "900px", margin: "30px auto" }}>
        <h2>Opiniones de estudiantes</h2>

        {/* Formulario para calificar si tiene permiso */}
        {usuarioPuedeCalificar() ? (
          <form onSubmit={enviarRating} className="dash-form">
            <label>
              Estrellas:
              <select
                value={estrellas}
                onChange={(e) => setEstrellas(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </label>

            <textarea
              placeholder="Escribe tu opinión sobre el curso"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              required
            />

            <button
              className="dash-btn full"
              type="submit"
              disabled={enviandoRating}
            >
              {enviandoRating ? "Enviando..." : "Enviar opinión"}
            </button>
          </form>
        ) : (
          <p>
            Solo los estudiantes que han comprado este curso pueden dejar una calificación.
          </p>
        )}

        {/* Lista de comentarios existentes */}
        {curso.ratings && curso.ratings.length > 0 ? (
          <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
            {curso.ratings.map((r, idx) => (
              <li
                key={idx}
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                <p><strong>{r.estrellas} / 5</strong></p>
                <p>{r.comentario}</p>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  Estudiante ID: {r.estudiante_id}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay opiniones todavía.</p>
        )}
      </div>

    </div>
  );
}

export default CursoDetalle;
