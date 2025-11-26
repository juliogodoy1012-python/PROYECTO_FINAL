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



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Visitor />} />

        {/* Rutas para cada tipo de usuario */}
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/instructor" element={<PanelInstructor />} />
        <Route path="/estudiante" element={<PanelEstudiante />} />

        {/* Cursos visibles */}
        <Route path="/cursos" element={<Cursos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
