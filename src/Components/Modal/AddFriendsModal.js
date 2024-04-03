import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemButton, Divider, TextField, CircularProgress } from '@mui/material';

const AddFriendModal = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addFriend.php`, {
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
        <Button onClick={onClose} variant="contained" color="primary" sx={{ position: 'absolute', top: 12, left: 12 }}>
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

        {loading && <CircularProgress />} {/* Show loading indicator while fetching data */}
        
        {error && <Typography variant="body1" color="error">{error}</Typography>} {/* Show error message if there's an error */}

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
