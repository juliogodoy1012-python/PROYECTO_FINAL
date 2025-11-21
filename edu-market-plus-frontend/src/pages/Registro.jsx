import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;


function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      
      const respuesta = await axios.post("http://localhost:4100/api/auth/registro", {
        nombre,
        correo,
        password,
      });

      alert(respuesta.data.mensaje);

    
      if (respuesta.status === 201) {
        window.location.href = "/login";
      }

    } catch (error) {
      alert("Ocurrió un error al registrarte. Intenta nuevamente.");
    }
  };

  return (
    <div className="contenedor-formulario">

      <h2>Crear Cuenta</h2>

      {/* Formulario controlado por React */}
      <form onSubmit={enviarFormulario}>
        
        <input 
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input 
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input 
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarme</button>
      </form>

      <p>
        ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
      </p>

    </div>
  );
}

export default Registro;
