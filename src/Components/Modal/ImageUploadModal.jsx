//`${process.env.REACT_APP_API_BASE_URL}/AddPinImage.php`
import React, { useState, useRef } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function ImageUploadModal() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveImage = async () => {
    if (!selectedFile) {
      alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/AddPinImage.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
      handleClose(); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  return (
    <div>
      <Button 
        onClick={handleOpen}
        variant="contained"
        color="primary"
      >
        Dummy Add Pin
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <Button onClick={handleUploadClick} sx={{ mt: 2 }}>
            Upload Image
          </Button>
          {fileName && (
            <Typography sx={{ mt: 2 }}>Selected file: {fileName}</Typography>
          )}
          <br></br>
          <Button onClick={handleSaveImage} variant="contained" sx={{ mt: 2 }}>
            Add Pin
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ImageUploadModal;