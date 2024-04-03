import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

function UsernameForm() {
  const [username, setUsername] = useState('Username Here'); // TODO: Update this to show real username from BE
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      event.preventDefault();
    }
  };

  return (
    <div>
      {isEditing ? (
        <TextField
          value={username}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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