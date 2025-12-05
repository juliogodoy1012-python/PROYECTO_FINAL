import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

axios.defaults.withCredentials = true;
// Configuro axios para que siempre envíe cookies en cada petición

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  // Aquí guardo la lista de usuarios obtenida desde el backend

  const [rolesSeleccionados, setRolesSeleccionados] = useState({});
  // Aquí guardo, para cada usuario, el rol que seleccione en el dropdown

  // Al cargar el panel, verifico si el usuario tiene rol de administrador
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no hay usuario logueado o no es admin, lo saco
    if (!usuario || !usuario.roles.includes("administrador")) {
      alert("Debes iniciar sesión como Administrador.");
      window.location.href = "/login";
      return;
    }

    // Si es admin, cargo los usuarios del sistema
    obtenerUsuarios();
  }, []);

  // Traigo todos los usuarios desde el backend (solo admins pueden hacerlo)
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/users/lista");
      setUsuarios(respuesta.data.usuarios);
    } catch (error) {
      alert("No tienes permisos o la sesión expiró.");
      window.location.href = "/login";
    }
  };

  // Cerrar sesión del administrador
  const cerrarSesion = async () => {
    try {
      await axios.post(
        "http://localhost:4100/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Limpio el usuario guardado en el navegador
      localStorage.removeItem("usuario");

      alert("Sesión cerrada exitosamente!!!");
      window.location.href = "/login";

    } catch (error) {
      alert("Error al cerrar sesión.");
      console.log(error);
    }
  };

  // Asignar un rol seleccionado a un usuario
  const asignarRol = async (usuario_id) => {
    const rolSeleccionado = rolesSeleccionados[usuario_id];

    // Si no eligieron un rol, no dejo continuar
    if (!rolSeleccionado) {
      alert("Selecciona un rol antes de asignarlo.");
      return;
    }

    try {
      // Envío la petición al backend para asignar el nuevo rol
      const respuesta = await axios.post(
        "http://localhost:4100/api/users/asignar-rol",
        { usuario_id, rol_id: rolSeleccionado }
      );

      alert(respuesta.data.mensaje);

      // Vuelvo a cargar la tabla con los roles actualizados
      obtenerUsuarios();

    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al asignar el rol.");
    }
  };

  return (
    <div className="dashboard-container">

      {/* Botón de cerrar sesión del administrador */}
      <div className="logout-container">
        <button className="btn-logout" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      <h1 className="dashboard-title">Panel del Administrador</h1>

      <div className="dashboard-card">
        <h2 className="section-title">Lista de Usuarios</h2>

        {/* Tabla que muestra todos los usuarios del sistema */}
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Asignar Rol</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                {/* Datos del usuario */}
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>

                {/* Dropdown para seleccionar rol */}
                <td>
                  <select
                    className="dashboard-select"
                    value={rolesSeleccionados[usuario.id] || ""}
                    onChange={(e) =>
                      setRolesSeleccionados({
                        ...rolesSeleccionados,
                        [usuario.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione rol</option>
                    <option value="2">Estudiante</option>
                    <option value="3">Instructor</option>
                    <option value="4">Soporte</option>
                    <option value="5">Administrador</option>
                  </select>
                </td>

                {/* Botón para asignar el rol al usuario seleccionado */}
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => asignarRol(usuario.id)}
                  >
                    Asignar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default PanelAdmin;
