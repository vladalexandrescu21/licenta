import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
export const Register = () => {
  const navigate = useNavigate();
  const [id_angajat_sef, setId_angajat_sef] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  async function registerBtn() {
    let item = { email, password, rol, id_angajat_sef };
    console.log(item);
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
      }
    }
  }
  return (
    <div className="cover">
      <h1>CREARE CONT</h1>
      <form>
        <label htmlFor="id_angajat">ID Angajat/Sef departament</label>
        <input
          type="text"
          placeholder="id"
          id="id_angajat"
          name="id_angajat"
          onChange={(e) => {
            setId_angajat_sef(e.target.value);
          }}
        />
        <label htmlFor="email">email</label>
        <input
          type="email"
          placeholder="email"
          id="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <p>Selectati rolul dumneavoastra: </p>
        <input
          type="radio"
          id="angajat"
          name="angajat/sef"
          value="angajat"
          checked={rol === "angajat"}
          onChange={(e) => {
            setRol("angajat");
          }}
        />
        <label htmlFor="angajat">Angajat</label>
        <br />
        <input
          type="radio"
          id="sef"
          name="angajat/sef"
          value="sef"
          checked={rol === "sef"}
          onChange={(e) => {
            setRol("sef");
          }}
        />
        <label htmlFor="sef">Sef departament</label>
        <br />
        <label htmlFor="password">password</label>
        <input
          type="password"
          placeholder="password"
          id="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="registerBtn" onClick={registerBtn}>
          Inregistrare
        </div>
        <div className="registerBtn" onClick={() => {
          navigate(-1)
        }}>
          Inapoi
        </div>
      </form>
    </div>
  );
};
