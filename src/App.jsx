import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth.jsx';
import { Link } from 'react-router-dom';
import { Login } from "./Login/Login.jsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword.jsx";
import {Register} from "./Register/Register.jsx";
import Home from './Home/home.js';
import './App.css';
import { Modal, Button, Box } from '@mui/material';
import { AddCircleRounded } from '@mui/icons-material';



// temporary styles - this will need to be moved
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 10,
};

function App() {
  // const [backendMessage, setBackendMessage] = useState('');
  // useEffect(() => {
  //   //fetch('index.php')
  //   //console.log(process.env.REACT_APP_API_BASE_URL);
  //   fetch(`${process.env.REACT_APP_API_BASE_URL}`)
  //     .then(response => response.text())
  //     .then(data => {
  //       setBackendMessage(data);
  //     })
  //     .catch(error => console.error('There was an error!', error));
  // }, []);

  // For Modal example
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/" element={
            <RequireAuth>
              <Home/>
            </RequireAuth>
          } />
        </Routes>         
      </Router>
  );
  
}

export default App;
