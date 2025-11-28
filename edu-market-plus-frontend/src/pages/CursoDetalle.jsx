import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true;

function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [usuario, setUsuario] = useState(null);

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

    // Próximamente... lógica real del carrito
    window.location.href = `/carrito?curso=${id}`;
  };

  const manejarEstudio = () => {
    window.location.href = `/curso/${id}/contenido`; // luego lo creamos
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

        {/* Video */}
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
    </div>
  );
}

export default CursoDetalle;
