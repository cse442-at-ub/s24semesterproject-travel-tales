import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function AddImageButton({ onFileSelect }) {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file); // Passing the file up to the parent component
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
            />
            <label htmlFor="fileInput">
                <Button 
                  component="span"
                  variant="contained"
                  color="primary"
                >
                    Upload Image
                </Button>
            </label>
            {fileName && <Typography>{fileName}</Typography>}
        </div>
    );
}

export default AddImageButton;
