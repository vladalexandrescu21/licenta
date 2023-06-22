import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../css/cereriDepartament.module.css";
import { PDFDocument, decodeFromBase64 } from "pdf-lib";
import { saveAs } from "file-saver";
export const CereriDepartament = () => {
  const navigate = useNavigate();
  const [cereri, setCereri] = useState([]);
  function inapoi() {
    navigate("/paginaSef", { replace: true });
  }
  function extractBase64FromDataUrl(dataUrl) {
    const base64Prefix = "data:application/pdf;base64,";
    if (dataUrl.startsWith(base64Prefix)) {
      return dataUrl.slice(base64Prefix.length);
    }
    return dataUrl;
  }

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
                  onClick={async () => {
                    if (cerere.pdf) {
                      const response = await fetch(cerere.pdf, {
                        mode: "cors",
                      });
                      const pdfDataUrl = await response.text();
                      const base64Data = extractBase64FromDataUrl(pdfDataUrl);
                      const uint8Array = new Uint8Array(
                        [...atob(base64Data)].map((char) => char.charCodeAt(0))
                      );
                      const pdfDoc = await PDFDocument.load(uint8Array);
                      const pdfBytes = await pdfDoc.save();
                      const blob = new Blob([pdfBytes], {
                        type: "application/pdf",
                      });
                      saveAs(blob, `${cerere.pdfName}`);
                    }
                  }}
                  disabled={cerere.status !== "in asteptare"}
                >
                  Descarca PDF
                </Button>
              </td>
              <td>
                <Button
                  variant="success"
                  onClick={async () => {
                    localStorage.setItem(
                      "cerereAprobare",
                      JSON.stringify(cerere)
                    );
                    navigate("/dropZoneAprobare", { replace: true });
                  }}
                  disabled={cerere.status !== "in asteptare"}
                >
                  Aprobare
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={async () => {
                    localStorage.setItem(
                      "cerereRespingere",
                      JSON.stringify(cerere)
                    );
                    navigate("/dropZoneRespingere", { replace: true });
                  }}
                  disabled={cerere.status !== "in asteptare"}
                >
                  Respingere
                </Button>
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
