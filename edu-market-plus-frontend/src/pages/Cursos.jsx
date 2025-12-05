import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true; 
// Configuro axios para que siempre envíe cookies (sirve cuando el usuario ya está logueado)

function Cursos() {
  const [cursos, setCursos] = useState([]);
  // Aquí guardo la lista completa de cursos que vienen del backend

  // Cuando el componente carga, ejecuto la función obtenerCursos
  useEffect(() => {
    obtenerCursos();
  }, []);

  // Función que llama al backend y obtiene todos los cursos disponibles
  const obtenerCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");
      setCursos(respuesta.data.cursos); // Guardo los cursos en el estado
    } catch (error) {
      alert("No se pudieron cargar los cursos.");
    }
  };

  return (
    <div className="dash-container">

      {/* Encabezado del catálogo */}
      <header className="dash-header">
        <h1>Catálogo de Cursos</h1>

        <div className="dash-actions">
          {/* Botón para ir al login */}
          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Iniciar Sesión
          </button>

          {/* Botón para ir al registro */}
          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/registro")}
          >
            Registrarse
          </button>
        </div>
      </header>

      <h2 className="dash-subtitle">Explora nuestros cursos</h2>

      {/* Contenedor de tarjetas de cursos */}
      <div className="dash-grid">
        {cursos.length === 0 ? (
          // Si no hay cursos, muestro mensaje
          <p>No hay cursos disponibles por ahora.</p>
        ) : (
          // Si hay cursos, los recorro y muestro cada uno
          cursos.map((curso) => (
            <div className="dash-card curso-card" key={curso._id}>
              
              {/* Imagen del curso si existe */}
              {curso.imagen && (
                <img
                  src={curso.imagen}
                  alt={curso.titulo}
                  className="curso-img"
                />
              )}

              {/* Información del curso */}
              <h3>{curso.titulo}</h3>

              {/* Muestro solo una parte de la descripción para que no quede demasiado largo */}
              <p>{curso.descripcion.substring(0, 120)}...</p>

              <p><strong>Precio:</strong> Q{curso.precio}</p>
              <p><strong>Categoría:</strong> {curso.categoria}</p>

              {/* Botón para ver el detalle del curso */}
              <button
                className="dash-btn full"
                onClick={() => (window.location.href = `/curso/${curso._id}`)}
              >
                Ver Curso
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sección informativa al final del catálogo */}
      <div className="dash-card" style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>¿Quieres acceder a los cursos completos?</h2>
        <p>Regístrate para comprar cursos y acceder a todo el contenido.</p>

        <button
          className="dash-btn"
          onClick={() => (window.location.href = "/registro")}
          style={{ marginTop: "10px" }}
        >
          Crear Cuenta Gratis
        </button>
      </div>

    </div>
  );
}

export default Cursos;
