import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupStyle, showPopup] = useState("hide");

  async function login(){
    let item = {email, password}
    let result = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(item)
    });
    if(result.status === 201){
      alert("Login successful");
  }
  else{
      showPopup("show");
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(3000);
      showPopup("hide");
  }
}

  async function register() {
    navigate("/register", { replace: true });
  }
  return (
    <div className="cover">
      <h1>AUTENTIFICARE</h1>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="parola"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="loginBtn" onClick={login}>
        Login
      </div>
      <div className="registerBtn" onClick={register}>
        Inregistrare
      </div>

      <div className={popupStyle}>
        <h3>Login failed</h3>
        <p>Username or password incorrect</p>
      </div>
    </div>
  );
};