import React from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider } from '@mui/material';

const AddFriendModal = ({ open, onClose }) => {
  const suggestedFriends = [
    { name: 'John Doe', mutualFriends: 10 },
    { name: 'Jane Smith', mutualFriends: 15 },
    { name: 'Alice Johnson', mutualFriends: 8 },
    // Add more suggested friends as needed
  ];

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
        <Button onClick={onClose} variant="contained" color="primary">
          Back
        </Button>
        <Typography variant="h3" gutterBottom>
          Add Friends
        </Typography>
        
        <List>
          {suggestedFriends.map((friend, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton>
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
