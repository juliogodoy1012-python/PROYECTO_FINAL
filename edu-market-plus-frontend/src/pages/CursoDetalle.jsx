import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true;

function CursoDetalle() {
  const { id } = useParams(); 
  // Obtengo el ID del curso desde la URL /curso/:id

  const [curso, setCurso] = useState(null);
  // Aquí guardo toda la información del curso cargado desde el backend

  const [usuario, setUsuario] = useState(null);
  // Aquí guardo la información del usuario logueado, si existe

  useEffect(() => {
    // Obtengo el usuario guardado en localStorage para saber si está logueado
    const userData = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(userData);

    // Cargo la información del curso desde MongoDB
    obtenerCurso();
  }, []);

  // Petición al backend para obtener la información del curso por ID
  const obtenerCurso = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:4100/api/courses/${id}`);
      setCurso(respuesta.data.curso);
    } catch (error) {
      alert("No se pudo cargar el curso.");
    }
  };

  // Acción al presionar comprar
  const manejarCompra = () => {
    // Si no hay usuario, lo mando a iniciar sesión
    if (!usuario) {
      alert("Debes iniciar sesión para comprar cursos.");
      window.location.href = "/login";
      return;
    }

    // Si está logueado, lo mando al carrito mandando el ID del curso
    // (el carrito lo leerá y lo agregará automáticamente)
    window.location.href = `/carrito?curso=${id}`;
  };

  // Acción al presionar estudiar (esto lo implemento cuando tengamos contenido del curso)
  const manejarEstudio = () => {
    window.location.href = `/curso/${id}/contenido`;
  };

  // Mientras no cargue el curso muestra un mensaje temporal
  if (!curso) return <p>Cargando...</p>;

  return (
    <div className="dash-container">

      {/* Encabezado del detalle del curso */}
      <header className="dash-header">
        <h1>{curso.titulo}</h1>

        <div className="dash-actions">
          {/* Botón para regresar al catálogo */}
          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/cursos")}
          >
            Volver al Catálogo
          </button>
        </div>
      </header>

      {/* Tarjeta principal del curso */}
      <div className="dash-card" style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Imagen del curso si existe */}
        {curso.imagen && (
          <img
            src={curso.imagen}
            alt={curso.titulo}
            className="curso-img"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

        {/* Video del curso si existe, convierto watch?v= en embed/ */}
        {curso.video && (
          <iframe
            className="curso-video"
            src={curso.video.replace("watch?v=", "embed/")}
            allowFullScreen
            title="Introducción del curso"
          ></iframe>
        )}

        {/* Sección de información */}
        <h2 style={{ marginTop: "20px" }}>Descripción</h2>
        <p>{curso.descripcion}</p>

        <p><strong>Categoría:</strong> {curso.categoria}</p>
        <p><strong>Precio:</strong> Q{curso.precio}</p>

        {/* Sección de botones dependiendo del tipo de usuario */}
        {!usuario ? (
          // Si no está logueado, solo permito iniciar sesión
          <button className="dash-btn full" onClick={manejarCompra}>
            Iniciar Sesión para Comprar
          </button>

        ) : usuario.roles.includes("estudiante") ? (
          // Si es estudiante, permito comprar
          <button className="dash-btn full" onClick={manejarCompra}>
            Comprar Curso
          </button>

        ) : usuario.roles.includes("instructor") ? (
          // Los instructores no pueden comprar cursos
          <p style={{ marginTop: "20px" }}>
            (Eres instructor. No puedes comprar cursos.)
          </p>

        ) : usuario.roles.includes("administrador") ? (
          // Los administradores tampoco deben comprar cursos
          <p style={{ marginTop: "20px" }}>
            (Eres administrador. Este curso es solo para estudiantes.)
          </p>

        ) : null}

      </div>
    </div>
  );
}

export default CursoDetalle;
