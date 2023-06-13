import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import styles from "../css/dropZone.module.css";
import Alert from "react-bootstrap/Alert";

function Dropzone(props) {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [base64PDF, setBase64PDF] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const pdf = acceptedFiles[0];

    const formData = new FormData();
    // formData.append("pdf", pdf);
    if (pdf.type !== "application/pdf") {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setBase64PDF(base64Data);
    };
    reader.onerror = (error) => {
      console.error("Eroare la citirea fișierului:", error);
      alert("A apărut o eroare la citirea fișierului!");
    };
    reader.readAsDataURL(pdf);

    const user = JSON.parse(localStorage.getItem("user"));
    const cerereInfo = JSON.parse(localStorage.getItem("cerereInfo"));

    const item = {
      status: "in asteptare",
      observatii: "-",
      userId: user.id,
      pdf: pdf.name,
      data_initiala: cerereInfo.data_initiala,
      data_finala: cerereInfo.data_finala,
      departamenteId: cerereInfo.departamenteId,
      nrZile: cerereInfo.nrZile,
      angajatiId: user.angajatiId,
    };

    formData.append("status", "in asteptare");
    formData.append("pdf", pdf);
    try {
      console.log("item", JSON.stringify(item));
      const response = await fetch("http://localhost:8080/api/dropZone", {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        alert("Cererea a fost trimisă cu succes!");
        navigate("/paginaAngajat", { replace: true });
      } else {
        alert("Cererea nu a putut fi trimisă!");
      }
    } catch (error) {
      console.log("Eroare la trimiterea cererii:", error);
      alert("A apărut o eroare la trimiterea cererii!");
    }
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: ".pdf",
  // });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
    accept: ".pdf",
  });

  return (
    <Container
      id="container"
      className={`${styles["font-link"]} font-link text-center mt-5 w-60 h-100`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Alert variant="warning" className="w-100 h-100 p-5">
          <p>Eliberați click-ul pentru a încărca fișierul.</p>
        </Alert>
      ) : (
        <Alert variant="success" className="w-100 h-100 p-5">
          <p>
            Trageți fișierul aici sau dați click pentru a selecta un fișier (se
            acceptă doar fișiere PDF).
          </p>
        </Alert>
      )}
      <Alert className="mt-2" show={showAlert} variant="danger">
        Fișierul nu este de tip PDF!
      </Alert>
    </Container>
  );
}

export default Dropzone;
