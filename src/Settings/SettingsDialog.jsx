import React from 'react';
import {Button, Box} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const SettingsDialog = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout.php`, {
          method: 'POST', // Or 'GET', depending on your backend setup
          credentials: 'include', // To include cookies in the request for session management
        });
        const data = await response.json(); // Parse JSON response
        if (data.success) {
          // Redirect to the login page after successful logout
          navigate('/login');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  
  const handleDeleteAccount = () => {
    //fetch deleteAccount.php
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
            <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mt: 2 }}>
              Delete Account
            </Button>
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
