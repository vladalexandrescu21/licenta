import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import styles from "../css/dropZoneAprobare.module.css";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import emailjs from "emailjs-com";

function DropzoneAprobare(props) {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [base64Pdf, setBase64Pdf] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const cerereAprobare = JSON.parse(localStorage.getItem("cerereAprobare"));
  const userInfo = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    emailjs.init("0kznXKPvVPwliqdXK");
  }, []);
  const handleChange = (e) => {
    const file = e.target.files[0];

    // Check if the selected file is a PDF
    if (file.type === "application/pdf") {
      setShowAlert(false); // Hide the alert if previously shown
      setPdfName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const contents = e.target?.result;
        setBase64Pdf(contents?.toString() || "");
      };

      reader.readAsDataURL(file);
    } else {
      setShowAlert(true); // Show the alert for invalid file type
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!base64Pdf) {
        alert("Vă rugăm să selectați un fișier PDF.");
      } else if (showAlert) {
        alert(
          "Fișierul nu este de tip PDF! Vă rugăm să selectați un fișier PDF."
        );
      } else {
        const item = {
          status: "aprobata",
          observatii: "-",
          pdfName: pdfName,
          base64Pdf: base64Pdf,
          data_initiala: cerereAprobare.data_initiala,
          data_finala: cerereAprobare.data_finala,
          departamenteId: cerereAprobare.departamenteId,
          nrZile: cerereAprobare.nrZile,
          userId: cerereAprobare.userId,
          id_cerere: cerereAprobare.id,
          sefiId: userInfo.sefiId,
        };
        console.log("item", item);
        const response = await fetch("http://localhost:8080/api/aprobaCerere", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
        const data = await response.json();
        const responseBody = data;
        if (response.status === 201) {
          var templateParams = {
            id_cerere: item.id_cerere,
            nume_angajat: responseBody.nume_angajat,
            prenume_angajat: responseBody.prenume_angajat,
            nume_sef: responseBody.nume_sef,
            prenume_sef: responseBody.prenume_sef,
            data_initiala: item.data_initiala,
            data_finala: item.data_finala,
            status_update: "aprobata",
            observatii: "-",
            email: responseBody.email_angajat,
          };

          emailjs
            .send("service_qnrn4pk", "template_hd3irev", templateParams)
            .then(
              function (response) {
                console.log("SUCCESS!", response.status, response.text);
              },
              function (error) {
                console.log("FAILED...", error);
              }
            );
          alert("Cererea a fost aprobata cu succes!");
          navigate("/cereriDepartament", { replace: true });
        } else {
          alert("Cererea nu a fost aprobata!");
        }
      }
    } catch (error) {
      console.log("Eroare la aprobarea cererii:", error);
      alert("A apărut o eroare la aprobarea cererii!");
    }
  };

  return (
    <Container
      id="container"
      className={`${styles["font-link"]} font-link text-center mt-5 w-60 h-100`}
    >
      <form onSubmit={handleSubmit}>
        <div className={`${styles["dropzone"]}`}>
          <input
            type="file"
            name="file"
            accept=".pdf"
            className={`${styles["input"]}`}
            onChange={handleChange}
          />
          <div className={`${styles["instructions"]}`}>
            <p>
              Trageți fișierul în chenarul din stânga sau dați click pentru a
              selecta un fișier (se acceptă doar fișiere PDF).
            </p>
          </div>
        </div>
        <Button type="submit" className={styles.button}>
          Trimite PDF
        </Button>
      </form>

      <Alert className="mt-2" show={showAlert} variant="danger">
        Fișierul nu este de tip PDF!
      </Alert>
    </Container>
  );
}

export default DropzoneAprobare;
