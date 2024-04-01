import React, { useState } from 'react';
import {Button, Box} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { red } from '@mui/material/colors';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const SettingsDialog = () => {
    const email = localStorage.getItem('email');
    const [color, setColor] = useState('black');

    const handleAlignment = (event, newColor) => {
        setColor(newColor);
        console.log(color)
    };

  const handleLogout = () => {
    //fetch logout.php
  }
  
  const handleDeleteAccount = () => {
    //fetch deleteAccount.php
    }

    // Function to handle updating profile data
    const handleUpdateProfile = async () => {
        console.log('color send', color)
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/Profile.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, profile: color }),
            });
            // Optionally, you can fetch the updated profile data here again
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

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
            p: 5,
          }}>
                      <Accordion>
                          <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                          >
                              <Typography>Change Profile Icon</Typography>
                          </AccordionSummary>
                          <AccordionDetails >
                              <Box sx={{
                                  width: '100%',
                                  
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-around',
                                  flexWrap: 'wrap',
                                  
                              }}>
                                  <ToggleButtonGroup
                                      
                                      value={color}
                                      exclusive
                                      onChange={handleAlignment}
                                      aria-label="text alignment"
                                      sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-around',
                                          flexWrap: 'wrap',
                                          border: 0

                                      }}
                                  >

                                      <ToggleButton value="Black">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Black'}} />
                                  </ToggleButton>
                                      <ToggleButton value="Red" >
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Red' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Blue">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Blue' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Green">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Green'}} />
                                  </ToggleButton>
                                      <ToggleButton value="Orange">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Orange' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Purple">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Purple' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Teal">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Teal' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Pink">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Pink' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Cyan">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Cyan' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Yellow">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Yellow' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Indigo">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Indigo' }} />
                                  </ToggleButton>
                                      <ToggleButton value="Lime">
                                          <AccountCircleIcon style={{ fontSize: 70, color: 'Lime' }} />
                                  </ToggleButton>
                                  </ToggleButtonGroup>

                                  <Button variant="contained" color="primary" onClick={handleUpdateProfile} sx={{ mt: 2 }}>
                                      Confirm
                                  </Button>


                                  </Box>
                          </AccordionDetails>
                      </Accordion>




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
