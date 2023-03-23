import React, { useState, useRef } from "react";
import "../css/login.css";
import "../css/cerere.css";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { ReactCalendar } from "./ReactCalendar";

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
  });
  const navigateToDragAndDrop = () => {
    navigate("/dropZone", { replace: true });
  }
  function printDropZone(){
    handlePrint();
    navigateToDragAndDrop();
  }

  return (
    <div id="bigDiv">
      <div className="cover">
        <h1>Formular cerere</h1>
        <input
          type="text"
          placeholder="Subsemnatul"
          name="subsemnatul"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Institutia"
          name="institutia"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Functia"
          name="functia"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Departament"
          name="departament"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Nr. zile"
          name="nrZile"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Anul"
          name="anul"
          onChange={handleInputChange}
        />
        <input
          type="date"
          placeholder="Data initiala"
          name="Data_initiala"
          onChange={handleInputChange}
        />
        <input
          type="date"
          placeholder="Data finala"
          name="Data_finala"
          onChange={handleInputChange}
        />
        <div className="registerBtn" onClick={printDropZone}>
          Print!
        </div>
      </div>
      <div className="cover2">
        <p>Preview cerere</p>
        <div ref={componentRef} id="cerere">
          <h1>CERERE CONCEDIU DE ODIHNĂ</h1>
          <p id="subsemnat">
            Subsemnatul/a, {dateFormular.subsemnatul}, angajat/ă al/a{" "}
            {dateFormular.institutia} în funcția de {dateFormular.functia} din
            departamentul {dateFormular.departament},
          </p>
          <p id="zile">
            vă rog să-mi aprobați efectuarea unui număr de {dateFormular.nrZile}{" "}
            zile de concediu de odihnă aferent anului {dateFormular.anul} în
            perioada {dateFormular.data_initiala} - {dateFormular.data_finala}.
          </p>
          <p id="date"> Data</p> <p id="angajat">Angajat,</p>
          <p id="puncte1"> ......................................</p>
          <p id="sef"> Șef direct,</p>
          <p id="puncte2"> ......................................</p>
        </div>
      </div>
    </div>
  );
};
