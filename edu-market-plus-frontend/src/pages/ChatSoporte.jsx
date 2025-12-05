import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";

const socket = io("http://localhost:4100", { withCredentials: true });

function ChatSoporte() {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user) {
      alert("Debes iniciar sesión");
      window.location.href = "/login";
      return;
    }

    setUsuario(user.nombre);

    socket.emit("unirseSala", {
      usuario: user.nombre,
      sala: "soporte-general",
    });

    socket.on("historial", (msgs) => setMensajes(msgs));
    socket.on("nuevoMensaje", (msg) => {
      setMensajes((prev) => [...prev, msg]);
    });

    return () => socket.off();
  }, []);

  const enviar = () => {
    if (mensaje.trim() === "") return;

    socket.emit("mensaje", mensaje);
    setMensaje("");
  };

  return (
    <div style={styles.page}>
        <Navbar />
      <h2 style={styles.titulo}>Chat de Soporte</h2>

      <div style={styles.chatContainer}>
        <div style={styles.listaMensajes}>
          {mensajes.map((msg, index) => (
            <div key={index} style={styles.mensajeItem}>
              <strong style={{ color: "#ffa94d" }}>{msg.usuario}: </strong>
              <span>{msg.mensaje}</span>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={enviar} style={styles.btnEnviar}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    paddingTop: "40px",
    background: "linear-gradient(135deg, #090909 0%, #150404 40%, #2b0b0b 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titulo: {
    color: "#ffa94d",
    fontSize: "32px",
    marginBottom: "20px",
  },
  chatContainer: {
    width: "900px",
    maxWidth: "95%",
    background: "rgba(0,0,0,0.55)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 0 25px rgba(255,140,0,0.15)",
    backdropFilter: "blur(8px)",
  },
  listaMensajes: {
    height: "450px",
    overflowY: "auto",
    background: "rgba(255,255,255,0.04)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  mensajeItem: {
    padding: "8px 10px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    marginBottom: "10px",
    color: "white",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "rgba(0,0,0,0.6)",
    color: "white",
  },
  btnEnviar: {
    padding: "12px 25px",
    background: "#ff8c32",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ChatSoporte;
