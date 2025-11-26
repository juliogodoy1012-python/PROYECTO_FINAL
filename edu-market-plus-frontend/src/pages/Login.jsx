import React, { useState } from "react";
import axios from "axios";
import "./Login.css";  //diseño css
axios.defaults.withCredentials = true;

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post("http://localhost:4100/api/auth/login", {
        correo,
        password,
      });

      alert(respuesta.data.mensaje);

      // Guardar sesión
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));
      const roles = respuesta.data.usuario.roles;

      // Redirecciones según Rol
      if (roles.includes("administrador")) {
        window.location.href = "/admin";
      } else if (roles.includes("instructor")) {
        window.location.href = "/instructor";
      } else if (roles.includes("estudiante")) {
        window.location.href = "/estudiante";
      } else {
        window.location.href = "/cursos";
      }

    } catch (error) {
      alert("Error al iniciar sesión. Verifica tus datos.");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        {/* IZQUIERDA */}
        <div className="login-left">
          <h2>Login</h2>

          <form onSubmit={enviarFormulario}>
            <label>Correo electrónico</label>
            <input 
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />

            <label>Contraseña</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />

            <button type="submit" className="btn-login">Ingresar</button>
          </form>

          <p className="signup-text">
            ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          </p>
        </div>

        {/* DERECHA */}
        <div className="login-right">
          <h1>- &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; ¡Bienvenido!<br/></h1>
          <p>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;¡Nos alegra tenerte de vuelta​! 😍
             <br/>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ingresa para despegar tu exito! 
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀🚀🚀 🧑‍🎓👩‍🎓🦾🧠🧑‍🏫</p>
        </div>

      </div>

    </div>
  );
}

export default Login;
