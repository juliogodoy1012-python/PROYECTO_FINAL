import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Visitor.css";
import Navbar from "../components/Navbar.jsx";  

function Visitor() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");
      setCursos(respuesta.data.cursos);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  const irALogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="visitor-container">

      <Navbar />

      {/* TITULO */}
      <h2 className="visitor-title">Catálogo de Cursos</h2>

      {/* GRID DE CURSOS */}
      <div className="courses-grid">
        {cursos.length === 0 ? (
          <p className="no-courses">No hay cursos disponibles todavía...</p>
        ) : (
          cursos.map((curso) => (
            <div key={curso._id} className="course-card">
              <img
                src={curso.imagen}
                alt={curso.titulo}
                className="course-img"
              />

              <div className="course-info">
                <h3>{curso.titulo}</h3>
                <p className="category">{curso.categoria}</p>
                <p className="price">${curso.precio}</p>

                <button
                  className="btn-detail"
                  onClick={() => irALogin()}
                >
                  Ver Detalle
                </button>

                <button
                  className="btn-buy"
                  onClick={() => irALogin()}
                >
                  Comprar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Visitor;
