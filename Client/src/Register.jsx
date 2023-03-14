import React, {useState} from "react";
export const Register =()=>{
return(
    <div>
        <h1>CREARE CONT</h1>
    <form>
    <label for='id_angajat'>id angajat</label>
        <input type="text" placeholder="id" id="id_angajat" name="id_angajat" />
        <label for='email'>email</label>
        <input type="email" placeholder="email" id="email" name="email" />
        <label for='password'>password</label>
        <input type="password" placeholder="password" id="password" name="password" />
        <button>Login</button>
    </form>
    </div>
)
};