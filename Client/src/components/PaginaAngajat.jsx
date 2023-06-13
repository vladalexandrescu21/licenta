import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "../css/paginaAngajat.module.css";
export const PaginaAngajat = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
  function creareCerere() {
    navigate("/creareCerere", { replace: true });
  }
  function vizualizareIstoricCereri() {
    navigate("/istoricCereri", { replace: true });
  }
  return (
    <div
      className={`${styles["form-container"]} ${styles["font-link"]} text-center`}
    >
      <h1>Pagina Angajat</h1>
      <Button onClick={creareCerere} className="m-1 mt-5" variant="success">
        Creare cerere
      </Button>
      <Button className="m-1 mt-5" onClick={vizualizareIstoricCereri}>
        Vizualizare istoric cereri
      </Button>
      <Button onClick={logout} className="m-1 mt-5" variant="danger">
        Logout
      </Button>
    </div>
  );
};
