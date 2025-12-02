import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
// Configuro axios para que incluya cookies en todas las peticiones

function PanelInstructor() {

  // Estados para crear un curso nuevo
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [video, setVideo] = useState("");

  // Aquí guardo los cursos creados por el instructor actual
  const [misCursos, setMisCursos] = useState([]);

  // Verifico si el usuario tiene rol de instructor cuando entra a esta página
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no existe o no es instructor, lo saco
    if (!usuario || !usuario.roles.includes("instructor")) {
      alert("Debes iniciar sesión como Instructor.");
      window.location.href = "/login";
      return;
    }

    // Si tiene permiso, cargo sus cursos
    obtenerMisCursos();
  }, []);

  // Obtener cursos creados por el instructor
  const obtenerMisCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");

      // Cursos almacenados en MongoDB
      const cursos = respuesta.data.cursos;
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      // Filtro los cursos cuyo instructor_id coincide con el usuario logueado
      const filtrado = cursos.filter(curso => curso.instructor_id === usuario.id);

      setMisCursos(filtrado);

    } catch (error) {
      alert("Error cargando cursos.");
    }
  };

  // Enviar formulario para crear un curso nuevo
  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post(
        "http://localhost:4100/api/courses/crear",
        {
          titulo,
          descripcion,
          categoria,
          precio,
          imagen,
          video,
        }
      );

      alert(respuesta.data.mensaje);

      // Limpio los inputs del formulario
      setTitulo("");
      setDescripcion("");
      setCategoria("");
      setPrecio("");
      setImagen("");
      setVideo("");

      // Recargo los cursos después de crear uno nuevo
      obtenerMisCursos();

    } catch (error) {
      alert("No se pudo crear el curso. Revisa los datos.");
    }
  };

  return (
    <div className="dash-container">

      {/* Encabezado superior del panel */}
      <header className="dash-header">
        <h1>Panel del Instructor</h1>

        <div className="dash-actions">
          {/* Botón para hacer scroll hacia el formulario */}
          <button className="dash-btn" onClick={() => window.scrollTo(0, 0)}>
            Crear Curso
          </button>

          {/* Botón para ver cursos creados */}
          <button className="dash-btn" onClick={() => window.scrollTo(0, 500)}>
            Mis Cursos
          </button>

          {/* Cerrar sesión */}
          <button
            className="dash-btn danger"
            onClick={() => {
              localStorage.removeItem("usuario");
              alert("Sesión cerrada exitosamente!!!");
              window.location.href = "/";
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Formulario para crear curso */}
      <div className="dash-card">
        <h2>Crear Curso</h2>

        <form className="dash-form" onSubmit={enviarFormulario}>

          <input
            type="text"
            placeholder="Título del curso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción del curso"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Seleccione categoría</option>
            <option value="Programación">Programación</option>
            <option value="Reposteria">Reposteria</option>
            <option value="Marketing">Marketing</option>
            <option value="Negocios">Negocios</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="URL de la imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL del video de YouTube"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />

          <button className="dash-btn full" type="submit">
            Crear Curso
          </button>
        </form>
      </div>

      {/* Listado de cursos creados por el instructor */}
      <h2 className="dash-subtitle">Mis Cursos</h2>

      <div className="dash-grid">
        {misCursos.length === 0 ? (
          <p>No has creado cursos todavía.</p>
        ) : (
          misCursos.map((curso) => (
            <div className="dash-card curso-card" key={curso._id}>

              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>

              <p><strong>Categoría:</strong> {curso.categoria}</p>
              <p><strong>Precio:</strong> Q{curso.precio}</p>

              {/* Imagen si existe */}
              {curso.imagen && (
                <img
                  src={curso.imagen}
                  alt={curso.titulo}
                  className="curso-img"
                />
              )}

              {/* Video si existe */}
              {curso.video && (
                <iframe
                  className="curso-video"
                  src={curso.video.replace("watch?v=", "embed/")}
                  title="Video del curso"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default PanelInstructor;
