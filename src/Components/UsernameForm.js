import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

function UsernameForm() {
  const [username, setUsername] = useState('YourUsername');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  // Updated to handleKeyDown to reflect the use of onKeyDown event
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      event.preventDefault(); // Prevents form submission and other unwanted behaviors
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      // Optionally reset the username or handle escape specifically
      event.preventDefault(); // Optional based on your use case
    }
  };

  return (
    <div>
      {isEditing ? (
        <TextField
          value={username}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div>
          {username}
          <IconButton onClick={handleEdit}>
            <Edit />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default UsernameForm;