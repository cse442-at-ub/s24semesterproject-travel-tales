import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider, TextField, CircularProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const AddFriendModal = ({ open, onClose, handleUserStats, fetchFriends,updateButtonState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');    
  const [buttonStates, setButtonStates] = useState({});

  const handleClose = () => {
    onClose(false); // Pass false to indicate that the modal should be closed and the follower count should be updated
};

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addFriend_Search.php`, {
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
        setUsernames(data.usernames || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleAddFriend = async (user) => {
    try {
        const data = {
            to: user
        };

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addFriend.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Friend added successfully:', responseData);
        setButtonStates(prevState => ({
            ...prevState,
            [user]: 'Followed!'
        }));
        
        handleUserStats();
        fetchFriends()
    } catch (error) {
        console.error('There was a problem adding the friend:', error.message);
    }
  };



  const filteredUsernames = usernames.filter(username =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          textAlign: 'center',
        }}
      >
        <ArrowBackIosNewIcon 
            className="leave-arrow" 
            onClick={handleClose} 
            style={{ position: 'absolute', left: '5%', marginTop: '5%'}}
        ></ArrowBackIosNewIcon>
        <Typography variant="h3" gutterBottom>
          ADD PEOPLE
        </Typography>
        
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        {loading && <CircularProgress />}
        
        {error && <Typography variant="body1" color="error">{error}</Typography>}

        <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {filteredUsernames.map((username, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton>
                  {errorMessage && <p>{errorMessage}</p>}
                  <Button 
                    onClick={() => handleAddFriend(username)}
                    disabled={buttonStates[username] === 'Followed'}
                    style={{ position: 'absolute', left: '75%', width: '20%', color: 'white', backgroundColor: buttonStates[username] ? 'orange' : 'green' }}
                    >
                      {buttonStates[username] || 'Follow'}
                    </Button>
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
