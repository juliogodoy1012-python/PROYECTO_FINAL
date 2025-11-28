import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true;

function Cursos() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");
      setCursos(respuesta.data.cursos);
    } catch (error) {
      alert("No se pudieron cargar los cursos.");
    }
  };

  return (
    <div className="dash-container">

      <header className="dash-header">
        <h1>Catálogo de Cursos</h1>

        <div className="dash-actions">
          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Iniciar Sesión
          </button>

          <button
            className="dash-btn"
            onClick={() => (window.location.href = "/registro")}
          >
            Registrarse
          </button>
        </div>
      </header>

      <h2 className="dash-subtitle">Explora nuestros cursos</h2>

      <div className="dash-grid">
        {cursos.length === 0 ? (
          <p>No hay cursos disponibles por ahora.</p>
        ) : (
          cursos.map((curso) => (
            <div className="dash-card curso-card" key={curso._id}>
              {curso.imagen && (
                <img
                  src={curso.imagen}
                  alt={curso.titulo}
                  className="curso-img"
                />
              )}

              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion.substring(0, 120)}...</p>

              <p><strong>Precio:</strong> Q{curso.precio}</p>
              <p><strong>Categoría:</strong> {curso.categoria}</p>

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
