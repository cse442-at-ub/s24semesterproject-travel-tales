import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [backendMessage, setBackendMessage] = useState('');
  useEffect(() => {
    // Fetch data from your PHP backend
    fetch('index.php')
      .then(response => response.text())
      .then(data => {
        setBackendMessage(data); // Set the response data to state
      })
      .catch(error => console.error('There was an error!', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      <p>Message from backend: {backendMessage}</p>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}



export default App;
