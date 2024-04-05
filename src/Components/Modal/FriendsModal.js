import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider } from '@mui/material';
import AddFriendModal from './AddFriendsModal';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';




const FriendsPin = ({ open, onClose }) => {
const [friends, setFriends] = useState([]);
const [AddFriendModalOpen, setAddFriendModalOpen] = useState(false);

const handleAddFriendButtonClick = () => {
    setAddFriendModalOpen(true);
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addFriend_Search.php`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    if (open) {
      fetchFriends();
    }
  }, [open]);

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
            color: 'black', // Change the pin label color
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
        <AddFriendModal open={AddFriendModalOpen} onClose={() => setAddFriendModalOpen(false)} />

        <Button
            onClick={handleAddFriendButtonClick}
            variant="contained"
            color="primary"
            style={{ position: 'absolute', top: '5%', left: '73%', width: '20%', backgroundColor: 'green'}}
            >
            Add Friends
        </Button>
        <ArrowBackIosNewIcon 
            className="leave-arrow" 
            onClick={onClose} 
            style={{ position: 'absolute', left: '5%', marginTop: '5%'}}
        ></ArrowBackIosNewIcon>

        <Typography variant="h3" gutterBottom>
          FRIENDS
        </Typography>

        <List>
          {friends.map((friend, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton>
                  <Typography variant="h6" padding={1}>{friend.first_name} {friend.last_name}</Typography>
                  </ListItemButton>
              </ListItem>
              {index < friends.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default FriendsPin;