import React, { useState, useEffect } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

function UsernameForm() {
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getUsername.php`, {
          credentials: 'include',
          method: 'GET',
        });
        const data = await response.json();

        if (data.code === 200 && data.username) {
          setUsername(data.username);
        } else {
          console.error('Error fetching username:', data.error);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      updateUsername(username).then(() => setIsEditing(false));
      event.preventDefault();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      event.preventDefault();
    }
  };

  const updateUsername = async (newUsername) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/updateUsername.php`, {
        method: 'POST',
        credentials: 'include', // For session-based authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await response.json();

      if (data.code === 200) {
        setError(''); // Clear any existing error
      } else {
        // Handle known error types based on code
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update username due to a network error');
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {/* TextField and Edit Icon */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isEditing ? (
          <TextField
            value={username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {username}
            <IconButton onClick={handleEdit}>
              <Edit />
            </IconButton>
          </div>
        )}
      </div>

      {/* Error Message Container */}
      {error && (
        <div style={{ color: 'red', marginTop: '10px', textAlign: 'center', width: '100%' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default UsernameForm;