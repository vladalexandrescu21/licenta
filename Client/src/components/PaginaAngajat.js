import React from 'react';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
export const PaginaAngajat = () => {
    const navigate = useNavigate();
    function logout() {
        navigate("/", { replace: true });
    }
    function creareCerere() {
        navigate("/creareCerere", { replace: true });
    }
    return (
        <div className="cover">
        <h1>Pagina Angajat</h1>
        <div className="loginBtn" onClick={creareCerere}>Creare cerere noua</div>
        <div className="loginBtn">Vizualizare istoric cereri</div>
        <div className="loginBtn" onClick={logout}>Log out</div>
        </div>
    );
}