import React, { useState } from "react";
import styles from "../css/login.module.css";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  async function login() {
    let item = { email, password };
    let result = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });
    if (result.status === 201) {
      const data = await result.json();
      localStorage.setItem("user", JSON.stringify(data));
      if (data.rol === "angajat") {
        navigate("/paginaAngajat", { replace: true });
      }
      if (data.rol === "sef") {
        navigate("/paginaSef", { replace: true });
      }
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }

  async function register() {
    navigate("/register", { replace: true });
  }
  return (
    <Form className={`${styles["form-container"]} ${styles["font-link"]}`}>
      <Form.Group className="mb-3">
        <h1 className="text-center">AUTENTIFICARE</h1>
        <FloatingLabel className="mb-3" label="Email">
          <Form.Control
            className="mb-3"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel className="mb-3" label="Parola">
          <Form.Control
            type="password"
            placeholder="parola"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3 d-flex justify-content-center align-items-center">
        <Button onClick={login} className="me-2">
          Login
        </Button>
        <br />
        <Button onClick={register} variant="success" className="me-2">
          Inregistrare
        </Button>
      </Form.Group>
      <Alert show={showAlert} variant="danger">
        Email sau parola incorecta!
      </Alert>
    </Form>
  );
};
