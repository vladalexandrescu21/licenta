import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { ReactCalendar } from "./ReactCalendar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import styles from "../css/formularCerere.module.css";

export const FormularCerere = () => {
  const [dateFormular, setDateFormular] = useState({
    subsemnatul: "",
    institutia: "",
    functia: "",
    departament: "",
    nrZile: "",
    anul: "",
    data_initiala: "",
    data_finala: "",
  });
  const navigate = useNavigate();
  const componentRef = useRef();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDateFormular({ ...dateFormular, [name]: value });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  }
  );
  const navigateToDragAndDrop = () => {
    navigate("/dropZone", { replace: true });
  }
  function printDropZone(){
    if(showValidationErrors() === false){
    handlePrint();
    navigateToDragAndDrop();
    }
  }
  
  function showValidationErrors(){
    const subsemnatul = document.getElementById("subsemnatul");
    const institutia = document.getElementById("institutia");
    const functia = document.getElementById("functia");
    const departament = document.getElementById("departament");
    const nrZile = document.getElementById("nrZile");
    const anul = document.getElementById("anul");
    const data_initiala = document.getElementById("data_initiala");
    const data_finala = document.getElementById("data_finala");
    let errorMessage = "";
    if(!subsemnatul.value){
      errorMessage += "Subsemnatul nu a fost completat.\n";
    }
    if(!institutia.value){
      errorMessage += "Institutia nu a fost completata.\n";
    }
    if(!functia.value){
      errorMessage += "Functia nu a fost completata.\n";
    }
    if(!departament.value){
      errorMessage += "Departamentul nu a fost completat.\n";
    }
    if(!nrZile.value){
      errorMessage += "Numarul de zile nu a fost completat.\n";
    }
    if(!anul.value){
      errorMessage += "Anul nu a fost completat.\n";
    }
    if(!data_initiala.value){
      errorMessage += "Data initiala nu a fost completata.\n";
    }
    if(!data_finala.value){
      errorMessage += "Data finala nu a fost completata.\n";
    }
    if(errorMessage){
      const alertMessage = document.createElement("div");
      alertMessage.classList.add("alert", "alert-danger");
      alertMessage.innerHTML = errorMessage;
      const formContainer = document.querySelector("#form-id");
      formContainer.insertBefore(alertMessage, formContainer.firstChild);
      setTimeout(() => {
        alertMessage.remove();
      }
      , 5000);
      return true;
  }
  else return false;
  }
  return (
    <div>
      <Form id="form-id" className={`${styles["form-container"]} ${styles["font-link"]} text-center`}>
        <h1>Formular cerere</h1>
        <FloatingLabel label='Subsemnatul' className="my-2">
          <Form.Control type="text" placeholder="Subsemnatul" id="subsemnatul" name="subsemnatul" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Institutia' className="my-2">
          <Form.Control type="text" placeholder="Institutia" id="institutia" name="institutia" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Functia' className="my-2"> 
          <Form.Control type="text" placeholder="Functia" id="functia" name="functia" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Departament' className="my-2">
          <Form.Control type="text" placeholder="Departament" id="departament" name="departament" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Numar zile' className="my-2">
          <Form.Control type="text" placeholder="Numar zile" id="nrZile" name="nrZile" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Anul' className="my-2">
          <Form.Control type="text" placeholder="Anul" id="anul" name="anul" onChange={handleInputChange} />
        </FloatingLabel>
        <FloatingLabel label='Data initiala' className="my-2">
        <Form.Control type="date" placeholder="Data initiala" id="data_initiala" name="data_initiala" onChange={handleInputChange} className="my-2" />
        </FloatingLabel>
        <FloatingLabel label='Data finala' className="my-2">
        <Form.Control type="date" placeholder="Data finala" id="data_finala" name="data_finala" onChange={handleInputChange} className="my-2" />
        </FloatingLabel>
        <Button className="m-4" onClick={printDropZone}>Genereaza cererea</Button>
        </Form>
      <div className={`${styles["preview-shadow"]}`}>
      <div className="preview">
        <p className="text-center mb-5">Preview cerere</p>
        <div ref={componentRef} id={styles["cerere"]}>
          <h1>CERERE CONCEDIU DE ODIHNĂ</h1>
          <p id={styles["subsemnat"]}>
            Subsemnatul/a, {dateFormular.subsemnatul}, angajat/ă al/a{" "}
            {dateFormular.institutia} în funcția de {dateFormular.functia} din
            departamentul {dateFormular.departament},
          </p>
          <p id={styles["zile"]}>
            vă rog să-mi aprobați efectuarea unui număr de {dateFormular.nrZile}{" "}
            zile de concediu de odihnă aferent anului {dateFormular.anul} în
            perioada {dateFormular.data_initiala} - {dateFormular.data_finala}.
          </p>
          <p id={styles["date"]}> Data</p> <p id={styles["angajat"]}>Angajat,</p>
          <p id={styles["puncte1"]}> ......................................</p>
          <p id={styles["sef"]}> Șef direct,</p>
          <p id={styles["puncte2"]}> ......................................</p>
        </div>
      </div>
      </div>
    </div>
  );
};
