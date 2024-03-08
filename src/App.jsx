import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth.jsx';
import { Login } from "./Login/Login.jsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword.jsx";
import {Register} from "./Register/Register.jsx";
import Home from './Home/home.js';
import './App.css';


function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/" element={
           
              <Home/>
            
          } />
        </Routes>         
      </Router>
  );
  
}

export default App;
