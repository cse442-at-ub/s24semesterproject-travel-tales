import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemButton, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import "./MyPinsModal.css";



const MyPinsModal = ({ open, onClose, username }) => {
  const [pinsData, setPinsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetchMyPins.php?email=${localStorage.getItem('email')}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pins data');
        }
        const pins = await response.json();
        console.log(pins)
        setPinsData(pins);
      } catch (error) {
        console.error('Error fetching pins data:', error);
        setError(error.message || 'Failed to fetch pins data');
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, username]);

  const handleAccordionClick =  (index) => {
  }

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 5,
          bgcolor: 'rgba(255, 255, 255, 1.0)',
          border: '2px solid #000',
          boxShadow: 24,
          p: 3,
          width: '80vw',
          maxWidth: '600px', // Adjust the maximum width as needed
          maxHeight: '80vh', // Set a maximum height for scrollability
          overflowY: 'auto', // Enable vertical scrolling if content overflows
          textAlign: 'center', // Center align the content
          '& h4': {
            color: 'black', // Change the title color
            marginBottom: 2, // Add some space below the title
          },
          '& h5': {
            color: 'black', // Change the pin label color
          },
          '& button': {
            position: 'absolute',
            top: 0,
            left: 0,
            margin: '10px', // Adjust the margin as needed
            padding: '8px', // Adjust the padding as needed
            transition: 'background-color 0.3s', // Adjust the margin as needed
            '&:hover': {
              backgroundColor: '#2196F3', // Change the background color on hover
            },
          },
        }}
      >
        <Button 
        onClick={onClose} variant="contained" color="primary">
          Back
        </Button>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          MY PINS
        </Typography>
        <List>
          {pinsData.map((pin, index) => (
            <Accordion key={index}>
              <AccordionSummary
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <Typography variant="h6">
                  {pin.title}
                  <span style={{ marginLeft: '30px', fontSize: '0.8em' }}>{pin.date}</span>
                </Typography>   
              </AccordionSummary>
              <AccordionDetails sx={{ textAlign: 'left', position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Likes:</Typography>
                    <Typography>{pin.likes}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Public:</Typography>
                    <Typography>{pin.isPublic == 1 ? 'Yes' : 'No'}</Typography>
                  </div>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default MyPinsModal;