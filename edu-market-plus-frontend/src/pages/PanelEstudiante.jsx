import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

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

    obtenerMisCursos(usuario.id);
  }, []);

  // ==========================================================
  // OBTENER LOS CURSOS DESDE LA TABLA DE COMPRAS (MONGO)
  // ==========================================================
  const obtenerMisCursos = async (usuarioId) => {
    try {
      // 1. OBTENER COMPRAS DEL USUARIO
      const compras = await axios.get(
        `http://localhost:4100/api/compras/mis-cursos`,
        { withCredentials: true }
      );

      const listaIds = compras.data.cursosIds; // array de ObjectId

      if (listaIds.length === 0) {
        setMisCursos([]);
        return;
      }

      // 2. Obtener TODOS los cursos
      const respuestaCursos = await axios.get("http://localhost:4100/api/courses");
      const todos = respuestaCursos.data.cursos;

      // 3. Filtrar los cursos que coinciden con las compras
      const filtrados = todos.filter((curso) =>
        listaIds.includes(curso._id)
      );

      setMisCursos(filtrados);

    } catch (error) {
      console.log(error);
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
        <Navbar />

      {/* HEADER */}
      <header className="dash-header">
        <br />
        <br /><br />
        <h1>Panel del Estudiante</h1>

        <div className="dash-actions">
          <button className="dash-btn" onClick={() => window.location.href = "/cursos"}>
            Ver Catálogo
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

              <img src={curso.imagen} alt={curso.titulo} className="curso-img" />

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
