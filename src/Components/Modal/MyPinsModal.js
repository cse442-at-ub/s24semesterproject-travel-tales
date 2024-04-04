import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails, List } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';


const MyPinsModal = ({ open, onClose, username }) => {
  const [pinsData, setPinsData] = useState([]);
  const [error, setError] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deletedPinIndex, setDeletedPinIndex] = useState(null);

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

  const handleDeletePin = async (pin) => {
    setDeletedPinIndex(pin);
    console.log(pin.pin_id); // Access pin_id directly
    setDeleteConfirmationOpen(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/deletePin.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pin_id: pin.pin_id, // Access pin_id directly
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete pin');
      }
  
      console.log('Pin deleted successfully');
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };
  

  const handleCloseDeleteConfirmation = () => {
    setDeletedPinIndex(null);
    setDeleteConfirmationOpen(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { onClose(); handleCloseDeleteConfirmation(); }}>
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
          maxWidth: '450px', 
          maxHeight: '80vh', 
          overflowY: 'auto', 
          textAlign: 'center', 
        }}
      >
        <ArrowBackIosNewIcon 
            className="leave-arrow" 
            onClick={onClose} 
            style={{ position: 'absolute', left: '5%', marginTop: '5%'}}
        ></ArrowBackIosNewIcon>
        <Typography variant="h3" gutterBottom>
          MY PINS
        </Typography>
        <List>
        {Array.isArray(pinsData) && pinsData.map((pin, index) => (
            <Accordion key={index}>
              <AccordionSummary
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
                style={{ position: 'relative' }}
              >
                <Typography variant="h6">
                  {pin.title}
                  <span style={{ marginLeft: '30px', fontSize: '0.8em' }}>{pin.date}</span>
                </Typography>   
              </AccordionSummary>
              <AccordionDetails sx={{ textAlign: 'left', position: 'relative' }}>
                <Box sx={{ border: '1px solid black', display: 'flex', flexDirection: 'column', gap: '5px', p: 2 }}>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Likes:</Typography>
                    <Typography>{pin.likes}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Public:</Typography>
                    <Typography>{pin.isPublic == 1 ? 'Yes' : 'No'}</Typography>
                  </div>
                  <Button onClick={() => handleDeletePin(pin)} style={{ backgroundColor: 'red', color: 'white', position: 'absolute', right: '25px', top: '20%', transform: 'translateY(-50%)' }} >Delete</Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
        {deleteConfirmationOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 1.0)',
              border: '2px solid #000',
              boxShadow: 20,
              p: 1,
              width: '40vw',
              maxWidth: '300px', 
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pin has been deleted
            </Typography>
            <Button onClick={() => {
              handleCloseDeleteConfirmation();     
            }}>OK</Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default MyPinsModal;
