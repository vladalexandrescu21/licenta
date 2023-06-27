import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../css/register.module.css";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
export const Register = () => {
  const navigate = useNavigate();
  const [id_angajat_sef, setId_angajat_sef] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  function showValidationErrors() {
    const idAngajatInput = document.getElementById("id_angajat");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const idAngajatValue = idAngajatInput.value.trim();
    let errorMessage = "";
    // Verificăm dacă idAngajatValue conține doar cifre
    const idAngajatRegex = /^\d+$/;
    if (!idAngajatRegex.test(idAngajatValue)) {
      errorMessage += "ID Angajat/Sef trebuie să conțină doar cifre.\n";
    }

    if (!idAngajatInput.value) {
      errorMessage += "ID Angajat/Sef nu a fost completat.\n";
    }

    if (!emailInput.value) {
      errorMessage += "Email-ul nu a fost completat.\n";
    }
    if (!emailInput.value.includes("@")) {
      errorMessage += "Email-ul nu este valid.\n";
    }

    if (rol !== "angajat" && rol !== "sef") {
      errorMessage += "Rolul nu a fost selectat.\n";
    }

    if (!passwordInput.value) {
      errorMessage += "Parola nu a fost completata.\n";
    } else {
      //const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/; //permite si caractere speciale
      if (!passwordRegex.test(passwordInput.value)) {
        errorMessage +=
          "Parola trebuie sa aiba minim 8 caractere, minim o cifra si minim o litera mare.\n";
      }
    }

    if (errorMessage) {
      const alertMessage = document.createElement("div");
      alertMessage.classList.add("alert", "alert-danger");
      alertMessage.innerHTML = errorMessage;
      const formContainer = document.querySelector("#form-container");
      formContainer.insertBefore(alertMessage, formContainer.firstChild);
      setTimeout(() => {
        alertMessage.remove();
      }, 5000);
      return false;
    } else {
      return true;
    }
  }

  function inapoi() {
    navigate("/", { replace: true });
  }

  async function registerBtn() {
    let item = { email, password, rol, id_angajat_sef };
    console.log(item);
    if (showValidationErrors() === true) {
      if (item.rol === "angajat") {
        let result = await fetch("http://localhost:8080/api/registerAngajat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        });
        if (result.status === 201) {
          navigate("/", { replace: true });
        } else if (result.status === 409) {
          const alertMessage = document.createElement("div");
          alertMessage.classList.add("alert", "alert-danger");
          alertMessage.innerHTML = "Contul exista deja!";
          const formContainer = document.querySelector("#form-container");
          formContainer.insertBefore(alertMessage, formContainer.firstChild);
          setTimeout(() => {
            alertMessage.remove();
          }, 5000);
        }
      }
      if (rol === "sef") {
        let result = await fetch("http://localhost:8080/api/registerSef", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        });
        if (result.status === 201) {
          navigate("/", { replace: true });
        } else if (result.status === 409) {
          const alertMessage = document.createElement("div");
          alertMessage.classList.add("alert", "alert-danger");
          alertMessage.innerHTML = "Contul exista deja!";
          const formContainer = document.querySelector("#form-container");
          formContainer.insertBefore(alertMessage, formContainer.firstChild);
          setTimeout(() => {
            alertMessage.remove();
          }, 5000);
        }
      }
    }
  }
  const onRadioChange = (e) => {
    setRol(e);
  };
  return (
    <div className="mb-3 d-flex justify-content-center align-items-center">
      <Form
        id="form-container"
        className={`${styles["form-container"]} ${styles["font-link"]}`}
      >
        <Form.Group className="mb-3">
          <h1 className="text-center">CREARE CONT</h1>
          <FloatingLabel className="mb-3" label="ID Angajat/Sef">
            <Form.Control
              type="text"
              placeholder="id_angajat"
              id="id_angajat"
              name="id_angajat"
              onChange={(e) => {
                setId_angajat_sef(e.target.value);
              }}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Email">
            <Form.Control
              type="email"
              placeholder="email"
              id="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group>
          <Form.Label>Selectati rolul dumneavoastra:</Form.Label>
          <Form.Check
            type="radio"
            label="Angajat"
            name="radioRol"
            onChange={(e) => {
              onRadioChange("angajat");
            }}
          />
          <Form.Check
            type="radio"
            label="Sef departament"
            name="radioRol"
            onChange={(e) => {
              onRadioChange("sef");
            }}
          />
        </Form.Group>
        <Form.Group>
          <FloatingLabel className="mb-3" label="Parola">
            <Form.Control
              type="password"
              placeholder="parola"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group
          className={`${styles["buttons-div"]} d-flex justify-content-center`}
        >
          <Button onClick={registerBtn} variant="success">
            Inregistrare
          </Button>
          <Button onClick={inapoi} className="mt-3" variant="primary">
            Inapoi
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};
