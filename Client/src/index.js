import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Login} from './components/Login';
import {Register} from './components/Register';
import {   BrowserRouter as Router,
  Routes, Route, Outlet, NavLink } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);
