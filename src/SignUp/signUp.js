import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <button type="submit">Submit</button>
        </form>
    </Container>
  );
}

export default SignUp;
