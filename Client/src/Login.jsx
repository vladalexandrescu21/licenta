import React, {useState} from "react";
export const Login =()=>{
return(
    <div>
        <h1>AUTENTIFICARE</h1>
    <form>
        <label for='email'>email</label>
        <input type="email" placeholder="email" id="email" name="email" />
        <label for='password'>password</label>
        <input type="password" placeholder="password" id="password" name="password" />
        <button>Login</button>
    </form>
    </div>
)
};