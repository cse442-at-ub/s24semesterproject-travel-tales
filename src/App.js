import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginPage from "./Login/Login.jsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword";
import SignUp from "./Register/Register";
import Home from './Home/home';
import logo from './logo.svg';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUp/>} />
          <Route path="/home" element={<Home/>} />
          {/* <Route path="/" element={<HomePage />} /> */}
        </Routes>
      
        <div className="App">
          <header className="App-header">
            {/* <p>Message from backend: {backendMessage}</p> */}
            <img src={logo} className="App-logo" alt="logo" />
            <Button variant="contained" color="primary">
              <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            </Button>
            <br/>
            <Button variant="contained" color="primary">
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
            </Button>
            <br/>
            <Button variant="contained" color="primary">
              <Link to="/signUp" style={{ textDecoration: 'none', color: 'inherit' }}>Create an Account</Link>
            </Button>
            <br/>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Modal Example
              <AddCircleRounded />
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <h2 id="modal-modal-title">Welcome to Travel Tales!</h2>
                <p id="modal-modal-description">
                  This is an example of a MUI Modal
                </p>
                <Button onClick={handleClose}>Close</Button>
              </Box>
            </Modal>
          </header>
        </div>
      </Router>
  );
  
}

export default App;
