//`${process.env.REACT_APP_API_BASE_URL}/AddPinImage.php`
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import { Button, Modal, Box, Typography, TextField, Switch } from '@mui/material';
import axios from 'axios';

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

  //new useStates
  const [isPublic, setIsPublic] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleIsPublic = () => setOpen(!isPublic);

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

  const fetchCityState = async (lat, lng, location) => {
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY}`;

        try {
            const response = await fetch(geocodingUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const cityComponent = data.results[0].address_components.find(component => component.types.includes('locality'));
                const stateComponent = data.results[0].address_components.find(component => component.types.includes('administrative_area_level_1'));

                const city = cityComponent?.long_name || '';
                const state = stateComponent?.long_name || '';


                location(prevData => {
                    return prevData.map(item => {
                        
                        if (item.lat === lat && item.lng === lng) {
                            return {
                                ...item,
                                city: city,
                                state: state

                            };

                        }
                        return item;

                    });
                });
            } else {
                console.error('No results or unexpected response:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

  const fetchLocation = async () => {
      try {
          const response = await axios.post(
              `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.REACT_APP_API_KEY}`
          );

          const { location } = response.data;
          setCurrentLocation({ lat: location.lat, lng: location.lng });
      } catch (error) {
          setError('Error fetching location');
          console.error('Error fetching location:', error.message);
      }
  };

  const sendCoordinatesToBackend = async (info) => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addpin.php`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(info),
              credentials: 'include',
          });

          if (!response.ok) {
              throw new Error('Failed to send coordinates to the backend');
          }

          const data = await response.json();
          console.log('Coordinates sent successfully:', data);
      } catch (error) {
          console.error('Error sending coordinates to the backend:', error.message);
      }
  };

  const getCurrentUserInfo = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getCurrentUser.php`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              throw new Error('Failed to fetch user information');
          }

          const userData = await response.json();

          return userData;
      } catch (error) {
          console.error('Error fetching current user information:', error.message);
          throw error;
      }
  };

  useEffect(() => {
      fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
      try {
          const userData = await getCurrentUserInfo();
          setCurrentUser(userData);
      } catch (error) {
          console.log(error)
      }
  };

  const placeNewMarker = () => {
        // var title = document.querySelector('.title-box').value;
        // var description = document.querySelector('.description-box').value;
        fetchLocation();
        console.log(currentLocation);
        var currentDate = new Date();
        var offset = currentDate.getTimezoneOffset();
        currentDate.setMinutes(currentDate.getMinutes() - offset);

        var date = currentDate.toISOString().split('T')[0];

        if (currentLocation) {
            const newMarker = {
                username: currentUser.username,
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                id: markers.length + 1,
                draggable: true,
                title: title,
                description: description,
                date: date, 
                like: false,
                comment: [],
                profile: currentUser.profile
                
            };
            fetchCityState(newMarker.lat, newMarker.lng, setMarkers);
            setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
            sendCoordinatesToBackend({ username: currentUser.username, lat: newMarker.lat, lng: newMarker.lng, title, description, date, isPublic, profile: currentUser.profile});
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
          {/* <Button onClick={handleSaveImage} variant="contained" sx={{ mt: 2 }}>
            Add Pin
          </Button> */}
          <Switch onClick={handleIsPublic} />
          <Button onClick={() => {
              // handleSubmit();
              placeNewMarker();
            }}
          >
            Add Pin
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ImageUploadModal;