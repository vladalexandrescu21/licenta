import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "../css/paginaSef.module.css";
export const PaginaSef = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
  function cereriDepartament() {
    navigate("/cereriDepartament", { replace: true });
  }
  return (
    <div
      className={`${styles["form-container"]} ${styles["font-link"]} text-center`}
    >
      <h1>Pagina Sef</h1>
      <Button
        className="m-1 mt-5"
        onClick={cereriDepartament}
        variant="success"
      >
        Vizualizare cereri in asteptare
      </Button>
      <Button className="m-1 mt-5" onClick={logout} variant="danger">
        Logout
      </Button>
    </div>
  );
};
