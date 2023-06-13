import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../css/cereriDepartament.module.css";
import FileSaver from "file-saver";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
export const CereriDepartament = () => {
  const navigate = useNavigate();
  const [cereri, setCereri] = useState([]);
  function inapoi() {
    navigate("/paginaSef", { replace: true });
  }

  async function aprobaCerere(pdfBlob) {}
  // async function respingeCerere(id) {
  //   const response = await fetch("http://localhost:8080/api/respingeCerere", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       id_cerere: id,
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }

  async function getCereri() {
    let userInfo = JSON.parse(localStorage.getItem("user"));
    console.log(userInfo.sefiId);
    const response = await fetch(
      "http://localhost:8080/api/getCereriDepartament",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userInfo.sefiId,
        }),
      }
    );
    const data = await response.json();
    setCereri(data);
  }
  useEffect(() => {
    getCereri();
  }, []);

  return (
    <div
      className={`${styles["form-container"]} ${styles["font-link"]} text-center`}
    >
      <h1>Cereri Departament</h1>
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
          {cereri.map((cerere) => (
            <tr key={cerere.id}>
              <td>{cerere.id}</td>
              <td>{cerere.status}</td>
              <td>{cerere.observatii}</td>
              <td>{cerere.data_initiala}</td>
              <td>{cerere.data_finala}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => {
                    console.log(cerere.pdf.data);
                    const uint8Array = new Uint8Array(cerere.pdf.data);
                    const blob = new Blob([uint8Array], {
                      type: "application/pdf",
                    });
                    const fileURL = URL.createObjectURL(blob);
                    const element = document.createElement("a");
                    element.href = fileURL;
                    element.download = `file.pdf`;
                    element.click();
                    URL.revokeObjectURL(fileURL);
                  }}
                >
                  Descarca PDF
                </Button>
              </td>
              <td>
                <Button variant="success">Aprobare</Button>
              </td>
              <td>
                <Button variant="danger">Respingere</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="m-1 mt-5" onClick={inapoi} variant="primary">
        Inapoi
      </Button>
    </div>
  );
};
