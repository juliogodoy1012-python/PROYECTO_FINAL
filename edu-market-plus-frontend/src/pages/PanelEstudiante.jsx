import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

axios.defaults.withCredentials = true;
// Le indico a axios que siempre incluya cookies en todas las peticiones

function PanelEstudiante() {

  const [misCursos, setMisCursos] = useState([]);
  // Aquí guardo los cursos que realmente pertenecen al estudiante logueado

  useEffect(() => {
    // Verifico que exista un usuario en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no está logueado o no tiene rol de estudiante, lo saco
    if (!usuario || !usuario.roles.includes("estudiante")) {
      alert("Debes iniciar sesión como Estudiante.");
      window.location.href = "/login";
      return;
    }

    // Si cumple, cargo sus cursos
    obtenerMisCursos();
  }, []);

  // Obtener cursos del estudiante desde el backend
  const obtenerMisCursos = async () => {
    try {
      // De momento traigo todos los cursos (ya que Mongo en este diseño guarda los IDs de estudiantes dentro del curso)
      const respuesta = await axios.get("http://localhost:4100/api/courses");

      // Obtengo el usuario logueado
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      // Filtro solo los cursos donde el usuario esté inscrito
      // Cuando exista la tabla de compras real, cambiaré este filtro
      const cursosFiltrados = respuesta.data.cursos.filter(
        (curso) => curso.estudiantes_ids?.includes(usuario.id)
      );

      setMisCursos(cursosFiltrados);

    } catch (error) {
      alert("No se pudieron cargar tus cursos.");
    }
  };

  // Cerrar sesión del estudiante
  const cerrarSesion = async () => {
    try {
      await axios.post("http://localhost:4100/api/auth/logout");

      // Limpio el usuario guardado en el navegador
      localStorage.removeItem("usuario");

      alert("Sesión cerrada exitosamente!!!");

      // Lo mando a la pantalla inicial
      window.location.href = "/";
    } catch (e) {
      alert("Error al cerrar sesión.");
    }
  };

  return (
    <div className="dash-container">

      {/* Encabezado del panel del estudiante */}
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

      {/* Sección de cursos del estudiante */}
      <h2 className="dash-subtitle">Mis Cursos</h2>

      <div className="dash-grid">
        {misCursos.length === 0 ? (
          // Si no tiene cursos, lo notifico
          <p>No has comprado cursos todavía.</p>
        ) : (
          // Recorro cada curso perteneciente al estudiante
          misCursos.map((curso) => (
            <div className="dash-card curso-card" key={curso._id}>

              {/* Imagen del curso */}
              <img
                src={curso.imagen}
                alt={curso.titulo}
                className="curso-img"
              />

              {/* Información del curso */}
              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>

              <p><strong>Categoría:</strong> {curso.categoria}</p>

              {/* Botón para ir a estudiar el curso */}
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
