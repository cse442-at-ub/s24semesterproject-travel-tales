import React, { useState } from 'react';
import {Button, Box} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const SettingsDialog = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    //fetch logout.php
  }
  
  // Delete account functionality
  const [errorMessage, setErrorMessage] = useState('');
  const deleteAccount = () => {
    //fetch deleteAccount.php
    fetch(`${process.env.REACT_APP_API_BASE_URL}/deleteAccount.php`, {
      method: 'POST',
      credentials: 'include', // Needed to include session cookie
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setErrorMessage('');
        navigate('/login');
      } else {
        setErrorMessage(data.message);
      }
    })
    .catch((error) => {
      setErrorMessage('An error occurred while trying to delete the account.')
    });
  }


  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>General</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}>
            <Typography>
              General Settings will go here.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Advanced</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}>
            <Typography>
              No longer interested in Travel Tales?
            </Typography>
            <Button variant="contained" color="error" onClick={deleteAccount} sx={{ mt: 2 }}>
              Delete Account
            </Button>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
      }}>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Box>
    </>
  );
};

export default SettingsDialog;
