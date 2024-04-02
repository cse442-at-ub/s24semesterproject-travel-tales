import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider, TextField } from '@mui/material';

const AddFriendModal = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetchUsers.php`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const filteredUsernames = usernames.filter(username =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Modal open={open} >
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
            margin: '10px', // Adjust the margin as needed
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
        <Typography variant="h5" gutterBottom fontWeight="bold">
          ADD FRIEND
        </Typography>
        
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        <List>
            {filteredUsernames.map((username, index) => (
        <React.Fragment key={index}>
          <ListItem disablePadding>
            <ListItemButton>
              <Typography variant="h6" padding={1}>{username}</Typography>
            </ListItemButton>
          </ListItem>
          {index < filteredUsernames.length - 1 && <Divider />}
        </React.Fragment>
      ))}
        </List>
      </Box>
    </Modal>
  );
};

export default AddFriendModal;
