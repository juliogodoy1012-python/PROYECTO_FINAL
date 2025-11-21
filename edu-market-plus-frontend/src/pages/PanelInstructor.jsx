import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

function PanelInstructor() {

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [video, setVideo] = useState("");
  const [misCursos, setMisCursos] = useState([]);

  // VALIDAR ROL AL ENTRAR

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.roles.includes("instructor")) {
      alert("Debes iniciar sesión como Instructor.");
      window.location.href = "/login";
      return;
    }

    obtenerMisCursos();
  }, []);

  // OBTENER CURSOS DEL INSTRUCTOR
  const obtenerMisCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/courses");

      // cursos de MongoDB
      const cursos = respuesta.data.cursos;
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      const filtrado = cursos.filter(curso => curso.instructor_id === usuario.id);

      setMisCursos(filtrado);

    } catch (error) {
      alert("Error cargando cursos.");
    }
  };

  // CREAR CURSO NUEVO

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

      // limpiar campos
      setTitulo("");
      setDescripcion("");
      setCategoria("");
      setPrecio("");
      setImagen("");
      setVideo("");

      // refrescar listado
      obtenerMisCursos();

    } catch (error) {
      alert("No se pudo crear el curso. Revisa los datos.");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel del Instructor</h1>
      <p>Aquí puedes crear nuevos cursos y ver los cursos que has creado.</p>

      {/* FORMULARIO */}
      <h2>Crear Curso</h2>

      <form onSubmit={enviarFormulario} style={{ maxWidth: "400px" }}>
        
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción del curso"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>

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

        <button type="submit">Crear Curso</button>
      </form>

      <hr />

      {/* LISTADO DE CURSOS */}
      <h2>Mis Cursos</h2>

      {misCursos.length === 0 ? (
        <p>No has creado cursos todavía.</p>
      ) : (
        <ul>
          {misCursos.map((curso) => (
            <li key={curso._id}>
              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>
              <p><strong>Categoría:</strong> {curso.categoria}</p>
              <p><strong>Precio:</strong> Q{curso.precio}</p>
              
            {/* reproduccion de video y foto de referencia*/}
              {curso.video && (
                <div>
                  <h4>Video de Presentación:</h4>
                  <iframe
                    width="560"
                    height="315"
                    src={curso.video.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>  
                </div>
              )}

              {curso.imagen && (  
                <div>
                  <h4>Imagen del Curso:</h4>
                  <img src={curso.imagen} alt={curso.titulo} style={{ maxWidth: "200px" }} />
                </div>
              )}
            
              <hr />
          

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PanelInstructor;
