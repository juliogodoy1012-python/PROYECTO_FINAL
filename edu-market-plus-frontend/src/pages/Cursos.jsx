import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../components/Navbar";


axios.defaults.withCredentials = true;

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [promedios, setPromedios] = useState({});  //  NUEVO

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");
      const lista = respuesta.data.cursos;
      setCursos(lista);

      //  Obtener rating de cada curso
      lista.forEach((curso) => obtenerPromedioCurso(curso._id));

    } catch (error) {
      alert("No se pudieron cargar los cursos.");
    }
  };

  //  NUEVO — obtiene el promedio por curso
  const obtenerPromedioCurso = async (cursoId) => {
    try {
      const res = await fetch(`http://localhost:4100/api/rating/promedio/${cursoId}`);
      const data = await res.json();

      setPromedios((prev) => ({
        ...prev,
        [cursoId]: data.promedio || 0,
      }));

    } catch (error) {
      console.error("Error obteniendo promedio:", error);
    }
  };

  //  NUEVO — función para pintar estrellas
  const renderEstrellas = (valor) => {
    const rating = Math.round(valor);

    return (
      <span style={{ color: "#f5b301", fontSize: "18px" }}>
        {"★".repeat(rating)}
        <span style={{ color: "#ccc" }}>
          {"★".repeat(5 - rating)}
        </span>
      </span>
    );
  };

  return ( 
    
    <div className="dash-container">
<Navbar />

      <header className="dash-header">
        <br />
        <br /><br />
        <h1>Catálogo de Cursos</h1>

        <div className="dash-actions">
          
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

              {/* ⭐ NUEVO — estrellas de calificación */}
              <div style={{ margin: "5px 0" }}>
                {renderEstrellas(promedios[curso._id] || 0)}
                <small style={{ marginLeft: "5px", color: "#666" }}>
                  ({(promedios[curso._id] || 0).toFixed(1)})
                </small>
              </div>

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
        <h3>¿Eres instructor?</h3>
        <p>Accede a tu panel para crear y gestionar tus cursos.</p>
        <button
          className="dash-btn full"
          onClick={() => (window.location.href = "/instructor")}
        >
          Ir al Panel de Instructor
        </button>
      </div>

    </div>
  );
}

export default Cursos;
