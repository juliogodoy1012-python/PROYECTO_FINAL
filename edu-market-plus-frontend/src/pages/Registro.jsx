import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

axios.defaults.withCredentials = true;

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post(
        "http://localhost:4100/api/auth/registro",
        { nombre, correo, password }
      );

      alert(respuesta.data.mensaje);
      window.location.href = "/login";

    } catch (error) {
      alert("Error al registrarte. Verifica los datos.");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        {/* IZQUIERDA — MENSAJE */}
        <div className="registro-left">
          <h1>Edu-Market-Plus</h1>
          <p>
            Estas por iniciar el camino hacia un nuevo aprendizaje. 😎🧠
            <br/>
            <br />
            Únete a nuestra comunidad y comienza a explorar una variedad de cursos diseñados para ti.
          </p>
        </div>

        {/* DERECHA — FORMULARIO */}
        <div className="registro-right">
          <h2>Registro</h2>

          <form onSubmit={enviarFormulario}>

            <label>Usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea tu contraseña"
              required
            />

            <button type="submit" className="btn-login">
              Registrarme
            </button>
          </form>

          <p className="signup-text">
            Ya tienes cuenta creada? <a href="/login">Iniciar sesión</a>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Registro;
