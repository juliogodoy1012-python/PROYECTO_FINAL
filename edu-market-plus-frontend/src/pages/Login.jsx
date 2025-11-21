import React, { useState } from "react";
import axios from "axios";
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
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));
      const roles = respuesta.data.usuario.roles;

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
    <div className="contenedor-formulario">
      <h2>Iniciar Sesión</h2>

      <form onSubmit={enviarFormulario}>
        <input 
          type="email" 
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input 
          type="password" 
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
