import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pass: '',
    confirmPass: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pass !== formData.confirmPass) {
      setError('Passwords do not match.');
      formData.pass = '';
      formData.confirmPass = '';
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost/api/addNewUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} component="main" maxWidth="xs">
        <Box sx={{ alignSelf: 'flex-start' }}>
          <IconButton component={RouterLink} to="/" aria-label="Return Home">
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="pass"
                value={formData.pass}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmPass"
                value={formData.confirmPass}
                placeholder="Confirm Password"
                onChange={handleChange}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">CREATE NEW ACCOUNT</button>
        </form>
    </Container>
  );
}

export default SignUp;
