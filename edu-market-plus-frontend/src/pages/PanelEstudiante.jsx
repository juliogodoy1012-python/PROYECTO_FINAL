import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
axios.defaults.withCredentials = true;

function PanelEstudiante() {
  
  const [misCursos, setMisCursos] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.roles.includes("estudiante")) {
      alert("Debes iniciar sesión como Estudiante.");
      window.location.href = "/login";
      return;
    }

    obtenerMisCursos();
  }, []);

  // OBTENER LOS CURSOS DEL ESTUDIANTE
  const obtenerMisCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");

      const usuario = JSON.parse(localStorage.getItem("usuario"));

      // Cuando implemente compra real usaremos: comprar_cursos table
      const cursosFiltrados = respuesta.data.cursos.filter(
        (curso) => curso.estudiantes_ids?.includes(usuario.id)
      );

      setMisCursos(cursosFiltrados);

    } catch (error) {
      alert("No se pudieron cargar tus cursos.");
    }
  };

  const cerrarSesion = async () => {
    try {
      await axios.post("http://localhost:4100/api/auth/logout");
      localStorage.removeItem("usuario");
      alert("Sesión cerrada exitosamente!!!");
      window.location.href = "/";
    } catch (e) {
      alert("Error al cerrar sesión.");
    }
  };

  return (
    <div className="dash-container">

      {/* HEADER */}
      <header className="dash-header">
        <h1>Panel del Estudiante</h1>

        <div className="dash-actions">
          <button className="dash-btn" onClick={() => window.location.href = "/cursos"}>
            Ver Catálogo
          </button>

          <button className="dash-btn danger" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* MIS CURSOS */}
      <h2 className="dash-subtitle">Mis Cursos</h2>

      <div className="dash-grid">
        {misCursos.length === 0 ? (
          <p>No has comprado cursos todavía.</p>
        ) : (
          misCursos.map((curso) => (
            <div className="dash-card curso-card" key={curso._id}>

              <img
                src={curso.imagen}
                alt={curso.titulo}
                className="curso-img"
              />

              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>

              <p><strong>Categoría:</strong> {curso.categoria}</p>

              <button
                className="dash-btn full"
                onClick={() => window.location.href = `/curso/${curso._id}`}
              >
                Estudiar Curso
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default PanelEstudiante;
