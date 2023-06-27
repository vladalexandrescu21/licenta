import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { PaginaAngajat } from "./components/PaginaAngajat";
import { FormularCerere } from "./components/FormularCerere";
import { IstoricCereriAngajat } from "./components/IstoricCereriAngajat";
import { PaginaSef } from "./components/PaginaSef";
import { CereriDepartament } from "./components/CereriDepartament";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DropZone from "./components/Dropzone";
import DropzoneAprobare from "./components/DropzoneAprobare";
import DropzoneRespingere from "./components/DropzoneRespingere";
import { ChartsConcedii } from "./components/ChartsConcedii";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/paginaAngajat" element={<PaginaAngajat />} />
      <Route path="/creareCerere" element={<FormularCerere />} />
      <Route path="/dropZone" element={<DropZone />} />
      <Route path="/istoricCereri" element={<IstoricCereriAngajat />} />
      <Route path="/paginaSef" element={<PaginaSef />} />
      <Route path="/cereriDepartament" element={<CereriDepartament />} />
      <Route path="/dropZoneAprobare" element={<DropzoneAprobare />} />
      <Route path="/dropZoneRespingere" element={<DropzoneRespingere />} />
      <Route path="/chartsConcedii" element={<ChartsConcedii />} />
    </Routes>
  </Router>
);
