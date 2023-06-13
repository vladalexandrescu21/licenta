import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../css/istoricCereriAngajat.module.css";

export const IstoricCereriAngajat = () => {
  const navigate = useNavigate();
  const [istoricCereri, setIstoricCereri] = useState([]);
  async function getIstoricCereri() {
    let userInfo = JSON.parse(localStorage.getItem("user"));
    let result = await fetch("http://localhost:8080/api/istoricCereri/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userId: userInfo.id,
      }),
    });
    if (result.status === 201) {
      result.json().then((data) => setIstoricCereri(data));
    }
  }
  useEffect(() => {
    getIstoricCereri();
  }, []);
  function inapoi() {
    navigate("/paginaAngajat", { replace: true });
  }
  return (
    <div
      className={`${styles["form-container"]} ${styles["font-link"]} text-center`}
    >
      <h1>Istoric cereri</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID cerere</th>
            <th scope="col">Status</th>
            <th scope="col">Observatii</th>
            <th scope="col">Data initiala</th>
            <th scope="col">Data finala</th>
          </tr>
        </thead>
        <tbody>
          {istoricCereri.map((cerere) => (
            <tr key={cerere.id}>
              <td>{cerere.id}</td>
              <td>{cerere.status}</td>
              <td>{cerere.observatii}</td>
              <td>{cerere.data_initiala}</td>
              <td>{cerere.data_finala}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`${styles["buttons-div"]}`}>
        <Button onClick={inapoi} variant="primary">
          Inapoi
        </Button>
      </div>
    </div>
  );
};
