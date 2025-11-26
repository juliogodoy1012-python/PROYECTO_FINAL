import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

axios.defaults.withCredentials = true;

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState({});

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.roles.includes("administrador")) {
      alert("Debes iniciar sesión como Administrador.");
      window.location.href = "/login";
      return;
    }
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4100/api/users/lista");
      setUsuarios(respuesta.data.usuarios);
    } catch (error) {
      alert("No tienes permisos o la sesión expiró.");
      window.location.href = "/login";
    }
  };

const cerrarSesion = async () => {
  try {
    await axios.post(
      "http://localhost:4100/api/auth/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("usuario");
    alert("Sesión cerrada exitosamente!!!");
    window.location.href = "/login";
  } catch (error) {
    alert("Error al cerrar sesión.");
    console.log(error);
  }
};


  const asignarRol = async (usuario_id) => {
    const rolSeleccionado = rolesSeleccionados[usuario_id];

    if (!rolSeleccionado) {
      alert("Selecciona un rol antes de asignarlo.");
      return;
    }

    try {
      const respuesta = await axios.post(
        "http://localhost:4100/api/users/asignar-rol",
        { usuario_id, rol_id: rolSeleccionado }
      );

      alert(respuesta.data.mensaje);
      obtenerUsuarios();

    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al asignar el rol.");
    }
  };

  return (
    <div className="dashboard-container">

      {/* │─── BOTÓN DE CERRAR SESIÓN ───│ */}
      <div className="logout-container">
        <button className="btn-logout" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      <h1 className="dashboard-title">Panel del Administrador</h1>

      <div className="dashboard-card">
        <h2 className="section-title">Lista de Usuarios</h2>

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
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>

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
