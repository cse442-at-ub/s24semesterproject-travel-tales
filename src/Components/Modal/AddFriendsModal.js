import React, {useState} from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AddFriendModal = ({ open, onClose }) => {
  const suggestedFriends = [
    { name: 'user@gmail.com', mutualFriends: 10 },
    { name: 'demo@email.com', mutualFriends: 15 },
    { name: 'tester@gmail.com', mutualFriends: 8 },
    // Add more suggested friends as needed
  ];

  const [errorMessage, setErrorMessage] = useState('');    
  const [buttonStates, setButtonStates] = useState({});



  const handleAddFriend = async (fromEmail, toEmail) => {
    try {
        // Data to send to the server
        const data = {
            from: fromEmail,
            to: toEmail
        };

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addFriend.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        // Handle successful response from the server
        console.log('Friend added successfully:', responseData);

        // Update button state for the specific friend
        setButtonStates(prevState => ({
            ...prevState,
            [toEmail]: 'Added!'
        }));
    } catch (error) {
        // Handle errors
        console.error('There was a problem adding the friend:', error.message);

        // Update error message state
        if (error.message.includes('already friends')) {
            setErrorMessage('These users are already friends.');
        } else {
            setErrorMessage('There was a problem adding the friend. Please try again later.');
        }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 10,
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
            color: 'black', // Change the friend name color
          },
          '& button': {
            position: 'absolute',
            top: 0,
            left: 0,
            margin: '15px', // Adjust the margin as needed
            padding: '8px', // Adjust the padding as needed
            transition: 'background-color 0.3s', // Adjust the margin as needed
            '&:hover': {
              backgroundColor: '#2196F3', // Change the background color on hover
            },
          },
        }}
      >
        <ArrowBackIosNewIcon 
            className="leave-arrow" 
            onClick={onClose} 
            style={{ position: 'absolute', left: '5%', marginTop: '5%'}}
        ></ArrowBackIosNewIcon>
        <Typography variant="h3" gutterBottom>
          Add Friends
        </Typography>

        <List>
          {suggestedFriends.map((friend, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton>
                  {errorMessage && <p>{errorMessage}</p>}
                  <Button 
                    onClick={() => handleAddFriend(localStorage.getItem('email'), friend.name)}
                    disabled={buttonStates[friend.name] === 'Added'}
                    style={{ position: 'absolute', left: '75%', width: '20%', color: 'white', backgroundColor: buttonStates[friend.name] ? 'orange' : 'green' }}
                    >
                      {buttonStates[friend.name] || 'Add Friend'}
                    </Button>
                    <Typography variant="h6" padding={1}>{friend.name}</Typography>
                  <Typography sx={{ fontFamily: '"Segoe UI"', fontSize: '0.8em', mt: 1 }}>
                    {friend.mutualFriends} mutual friends
                  </Typography>
                </ListItemButton>
              </ListItem>
              {index < suggestedFriends.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Modal>
  );
};
export default AddFriendModal;