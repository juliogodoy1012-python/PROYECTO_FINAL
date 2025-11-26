import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState({}); // 👈 objeto

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

  const asignarRol = async (usuario_id) => {
    const rolSeleccionado = rolesSeleccionados[usuario_id];

    if (!rolSeleccionado) {
      alert("Selecciona un rol antes de asignarlo.");
      return;
    }

    try {
      const respuesta = await axios.post("http://localhost:4100/api/users/asignar-rol", {
        usuario_id,
        rol_id: rolSeleccionado,
      });

      alert(respuesta.data.mensaje);
      obtenerUsuarios();
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al asignar el rol.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel del Administrador</h1>
      <p>Aquí puedes administrar usuarios y asignar roles.</p>

      <h2>Lista de Usuarios</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
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
                  value={rolesSeleccionados[usuario.id] || ""}
                  onChange={(e) =>
                    setRolesSeleccionados({
                      ...rolesSeleccionados,
                      [usuario.id]: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione rol</option>
                  <option value="1">Visitante</option>
                  <option value="2">Estudiante</option>
                  <option value="3">Instructor</option>
                  <option value="4">Soporte</option>
                  <option value="5">Administrador</option>
                </select>
              </td>

              <td>
                <button onClick={() => asignarRol(usuario.id)}>
                  Asignar Rol
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PanelAdmin;
