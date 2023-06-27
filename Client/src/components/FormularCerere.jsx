import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../css/formularCerere.module.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Alert from "react-bootstrap/Alert";

export const FormularCerere = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [nrZileConcediuRamase, setNrZileConcediuRamase] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [concediiDepartament, setConcediiDepartament] = useState([]);
  const [minEndDate, setMinEndDate] = useState(date);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [dateFormular, setDateFormular] = useState({
    subsemnatul: "",
    departament: "",
    nrZile: "",
    anul: "",
    data_initiala: "",
    data_finala: "",
    departamenteId: "",
    zile_concediu_disponibile: nrZileConcediuRamase,
  });
  const navigate = useNavigate();
  const componentRef = useRef();
  const isDateAvailable = (date) => {
    const currentDate = new Date(); // Get the current date
    if (date < currentDate) {
      return false;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const overlappingConcedii = concediiDepartament.filter((concediu) => {
      const start = new Date(concediu.data_initiala);
      start.setHours(start.getHours() - 3); // Scade 3 ore din ora de start
      const end = new Date(concediu.data_finala);
      return date >= start && date <= end && concediu.userId === user.id;
    });

    const hasLeaveOnDate = overlappingConcedii.length > 0;
    return overlappingConcedii.length < 2 && !hasLeaveOnDate;
  };

  async function getAngajatInfo() {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const result = await fetch("http://localhost:8080/api/getAngajatInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        angajatId: userInfo.angajatiId,
      }),
    });
    if (result.status === 201) {
      await result.json().then((data) => {
        setNrZileConcediuRamase(data.angajat.zile_concediu_disponibile);
        const nume = data.angajat.nume;
        const prenume = data.angajat.prenume;
        const numeDepartament = data.departament.numeDepartament;
        setDateFormular({
          ...dateFormular,
          subsemnatul: `${nume} ${prenume}`,
          departament: numeDepartament,
          departamenteId: data.departament.id,
        });
      });
    }
  }

  useEffect(() => {
    getAngajatInfo();
  }, []);

  useEffect(() => {
    async function fetchConcediiDepartament() {
      if (nrZileConcediuRamase !== 0) {
        const result = await fetch(
          "http://localhost:8080/api/getConcediiDepartament",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(dateFormular),
          }
        );
        if (result.status === 201) {
          const data = await result.json();
          setConcediiDepartament(data);
        }
      }
    }

    fetchConcediiDepartament();
  }, [nrZileConcediuRamase, dateFormular]);

  const generatePDFName = () => {
    const nume_prenume = dateFormular.subsemnatul.split(" ");
    const formattedDate = new Date().toLocaleDateString().split("/").join("-");
    return `${nume_prenume}_${formattedDate}.pdf`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generatePDFName(),
  });
  const navigateToDragAndDrop = () => {
    navigate("/dropZone", { replace: true });
  };
  function printDropZone() {
    if (showValidationErrors() === false) {
      const updatedDateFormular = {
        ...dateFormular,
        data_initiala: startDate,
        data_finala: endDate,
      };
      if (updatedDateFormular.nrZile <= nrZileConcediuRamase) {
        localStorage.setItem("cerereInfo", JSON.stringify(updatedDateFormular));
        handlePrint();
        navigateToDragAndDrop();
      } else {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    }
  }
  function getBusinessDaysCount(startDate, endDate) {
    const start = new Date(startDate.getTime());
    const end = new Date(endDate.getTime());
    let count = 0;

    while (start <= end) {
      const day = start.getDay();
      if (day !== 0 && day !== 6 && isDateAvailable(start)) {
        count++;
      }
      start.setDate(start.getDate() + 1);
    }

    return count;
  }

  function handleStartDateChange(date) {
    if (isDateAvailable(date)) {
      setStartDate(date);
      setIsStartDateSelected(true);
      const businessDaysCount = getBusinessDaysCount(date, endDate);
      setDateFormular({
        ...dateFormular,
        nrZile: businessDaysCount.toString(),
        anul: date.getFullYear().toString(),
      });
      const minEndDate = new Date(date.getTime());
      minEndDate.setDate(minEndDate.getDate() + 1);
      setMinEndDate(minEndDate);
      setEndDate(minEndDate);
    } else {
      setStartDate(null);
      setEndDate(null); // Resetăm și data finală dacă data inițială nu este disponibilă
      setMinEndDate(null);
    }
    setIsFormValid(false);
  }

  function handleEndDateChange(date) {
    if (isDateAvailable(date)) {
      setEndDate(date);
      const businessDaysCount = getBusinessDaysCount(startDate, date);
      setDateFormular({
        ...dateFormular,
        nrZile: businessDaysCount.toString(),
      });
    } else {
      setEndDate(null);
    }
    setIsFormValid(!!startDate && !!date);
  }

  function formatDate(date) {
    if (date) {
      return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      );
    } else {
      return "";
    }
  }

  function showValidationErrors() {
    const data_initiala = document.getElementById("data_initiala");
    const data_finala = document.getElementById("data_finala");
    let errorMessage = "";
    if (!data_initiala.value) {
      errorMessage += "Data initiala nu a fost completata.\n";
    }
    if (!data_finala.value) {
      errorMessage += "Data finala nu a fost completata.\n";
    }
    if (errorMessage) {
      const alertMessage = document.createElement("div");
      alertMessage.classList.add("alert", "alert-danger");
      alertMessage.innerHTML = errorMessage;
      const formContainer = document.querySelector("#form-id");
      formContainer.insertBefore(alertMessage, formContainer.firstChild);
      setTimeout(() => {
        alertMessage.remove();
      }, 5000);
      setIsFormValid(false);
      return true;
    } else {
      setIsFormValid(true);
      return false;
    }
  }
  return (
    <div>
      <Form
        id="form-id"
        className={`${styles["form-container"]} ${styles["font-link"]} text-center`}
      >
        <h1>Alegeti perioada concediului</h1>
        <DatePicker
          id="data_initiala"
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            handleStartDateChange(date);
          }}
          filterDate={isDateAvailable}
        />
        <DatePicker
          id="data_finala"
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            handleEndDateChange(date);
          }}
          filterDate={isDateAvailable}
          minDate={minEndDate}
          disabled={!isStartDateSelected}
        />
        <div className={`${styles["buttons-div"]}`}>
          <Button
            className="m-4"
            onClick={printDropZone}
            disabled={!isFormValid}
          >
            Genereaza cererea
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/paginaAngajat", { replace: true })}
          >
            Inapoi
          </Button>
          <Alert className="mt-2" show={showAlert} variant="danger">
            Nu aveti suficiente zile de concediu ramase!
          </Alert>
        </div>
      </Form>
      <div className={`${styles["preview-shadow"]}`}>
        <div className="preview">
          <p className="text-center mb-5">Preview cerere</p>
          <div ref={componentRef} id={styles["cerere"]}>
            <h1>CERERE CONCEDIU DE ODIHNĂ</h1>
            <p id={styles["subsemnat"]}>
              Subsemnatul/a, {dateFormular.subsemnatul}, din departamentul{" "}
              {dateFormular.departament},
            </p>
            <p id={styles["zile"]}>
              vă rog să-mi aprobați efectuarea unui număr de{" "}
              {dateFormular.nrZile} zile de concediu de odihnă aferent anului{" "}
              {dateFormular.anul} în perioada {formatDate(startDate)} -{" "}
              {formatDate(endDate)}.
            </p>
            <p id={styles["date"]}> Data</p>{" "}
            <p id={styles["date"]} className="mt-0">
              {" "}
              {formatDate(new Date())}
            </p>
            <p id={styles["angajat"]}>Angajat,</p>
            <p id={styles["puncte1"]}>
              {" "}
              ......................................
            </p>
            <p id={styles["sef"]}> Șef direct,</p>
            <p id={styles["puncte2"]}>
              {" "}
              ......................................
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
