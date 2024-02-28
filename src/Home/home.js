import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import { Modal, Button, Box } from '@mui/material';
import plusButtonImage from '../assets/plus-button.png';
import "./home.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import axios from 'axios';

const libraries = ['places'];
const mapContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 43.0018,
  lng: -78.7895,
};

const mapOptions = {
  disableDefaultUI: true,
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 10, 
  bgcolor: 'rgba(255, 255, 255, 1.0)', 
  border: '2px solid #000',
  boxShadow: 24,
  p: 10,
  transition: 'bgcolor 0.3s ease',
};


const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isToggled, setToggled] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.post(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCdI5i2yARvUIe3f75YqtWpYJRe7GFbLuI`
        );

        const { location } = response.data;
        setCurrentLocation({ lat: location.lat, lng: location.lng });
      } catch (error) {
        setError('Error fetching location');
        console.error('Error fetching location:', error.message);
      }
    };

    // Call the fetchLocation function when the component mounts
    fetchLocation();
  }, []); // Empty dependency array means this effect runs once on mount
  

  // THIS IS GOING TO THROW AN ERROR AND THAT IS EXPECTED SINCE BACKEND ENDPOINT HASN'T BEEN SETUP
  useEffect(() => {
    const fetchMarkersFromBackend = async () => {
      try {
        // Replace YOUR_BACKEND_ENDPOINT with the actual endpoint for fetching markers
        const response = await axios.get('YOUR_BACKEND_ENDPOINT');
        setMarkers(response.data);
      } catch (error) {
        setError('Error fetching markers from backend');
        console.error('Error fetching markers from backend:', error.message);
      }
    };

    fetchMarkersFromBackend();
  }, []);

  const placeNewMarker = () => {
    if (currentLocation) {
      const newMarker = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        id: markers.length + 1,
        draggable: true,
      };
  
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    
      sendCoordinatesToBackend(newMarker.lat, newMarker.lng);
    }
  };

  const sendCoordinatesToBackend = async (coordinates) => {
    try {
      const response = await fetch('your-backend-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
        body: JSON.stringify({ coordinates }),
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setToggled(false); // Reset the state of the switch
  };  
  const handleMapClick = (event) => {}; // does nothing

  const handleMarkerDrag = (markerId, newPosition) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
      )
    );
  };

  const handleMarkerClick = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
  };

  const handleSubmit = (event) => {
    handleClose()
    // Handle form submission logic here
  };

  const handleToggleClick = () => {
    setToggled(!isToggled);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div style={mapContainerStyle}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentLocation || center}
        zoom={currentLocation ? 15 : 10}
        onClick={handleMapClick} // this does nothing 
        options={mapOptions}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker.id)}
            //draggable={marker.draggable}
            //onDragEnd={(e) => handleMarkerDrag(marker.id, e.latLng.toJSON())}
          />
        ))}
        <header className="plus-icon">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            <img src={plusButtonImage} alt="Plus Button" />
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
          >
            <Box className="modal" sx={modalStyle}>
              <div className="description"></div>
              <div className="title"></div>
              <div className="make-public"></div>
              <form>
                <textarea 
                  className="title-box" 
                  name="title"
                  rows="4" 
                  cols="50">
                </textarea>
                <textarea 
                  className="description-box" 
                  name="description"
                  rows="4" 
                  cols="50">
                </textarea>
              </form>
              <button className="leave-arrow" onClick={handleClose}>
                <ArrowBackIosNewIcon/>
              </button>
              <button className="switch" onClick={handleToggleClick}>
                {isToggled ? <ToggleOnIcon fontSize='large' /> : <ToggleOffIcon fontSize='large' color='disabled'/>}
              </button>
              <Button sx={{ 
                bgcolor: "#354545", 
                color: "#FFFFFF", 
                fontSize: "large" 
                }} 
                className="add-pin-box" 
                variant="contained" 
                onClick={() => {
                  handleSubmit();
                  placeNewMarker();
                }}                
                style={{ borderRadius: 10 }}>Add Pin</Button>           
            </Box>
          </Modal>
        </header>  
      </GoogleMap>  
      {error && <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'red', bgcolor: 'white' }}>{error}</div>}
    </div>
  );
};

export default App;