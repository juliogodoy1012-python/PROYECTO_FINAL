import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importo las páginas
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import PanelAdmin from "./pages/PanelAdmin.jsx";
import PanelInstructor from "./pages/PanelInstructor.jsx";
import PanelEstudiante from "./pages/PanelEstudiante.jsx";
import Cursos from "./pages/Cursos.jsx";  
import Visitor from "./pages/Visitor.jsx";
import CursoDetalle from "./pages/CursoDetalle.jsx";
import Carrito from "./pages/Carrito.jsx";
import Success from "./pages/Success.jsx";
import ChatSoporte from "./pages/ChatSoporte.jsx";


function App() {
  return (

    <BrowserRouter>

      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Visitor />} />
        <Route path="/chat" element={<ChatSoporte />} />

        


        {/* Rutas para cada tipo de usuario */}
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/instructor" element={<PanelInstructor />} />
        <Route path="/estudiante" element={<PanelEstudiante />} />
        <Route path="/panel-estudiante" element={<PanelEstudiante />} />


        {/* Cursos visibles */}
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/curso/:id" element={<CursoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/success" element={<Success />} />



      </Routes>
    </BrowserRouter>

  );
}

export default App;
