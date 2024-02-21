import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Login/Login.jsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword";
import { Register } from "./Register/Register";
import './App.css';


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path='/Login' element={<Login />} />
                    <Route exact path='/Register' element={<Register />} />
                    <Route exact path='/ForgotPassword' element={<ForgotPassword />} />
                </Routes>
            </Router>
        </div>
    )
}




export default App;
