import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function AddImageButton() {
  // Create a ref for the hidden file input element
  const fileInputRef = useRef(null);

  // Function to simulate a click on the file input when the button is clicked
  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the selected file
      // For example, you can upload it or read it here
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleAddImageClick}
      >
        Add Image
      </Button>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*" // Accept only image files
      />
    </div>
  );
}

export default AddImageButton;