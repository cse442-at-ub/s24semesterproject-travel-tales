import React, { useState } from 'react';

import RequireAuth from './Auth/RequireAuth.jsx';
import { Login } from "./Login/Login.jsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword.jsx";
import {Register} from "./Register/Register.jsx";
import Home from './Home/home.js';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/" element={
            <RequireAuth>
              <Home/>
          //  </RequireAuth>
          } />
        </Routes>         
      </Router>
  );
}

export default App;
