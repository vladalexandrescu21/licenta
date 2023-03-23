import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { PaginaAngajat } from "./components/PaginaAngajat";
import { FormularCerere } from "./components/FormularCerere";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DropZone from "./components/Dropzone";
import {ReactCalendar} from "./components/ReactCalendar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/paginaAngajat" element={<PaginaAngajat />} />
      <Route path="/creareCerere" element={<FormularCerere />} />
      <Route path="/dropZone" element={<DropZone/>}/>
      <Route path="/calendar" element={<ReactCalendar/>}/>
    </Routes>
  </Router>
);
