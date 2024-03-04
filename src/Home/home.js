import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import { Modal, Button, Box } from '@mui/material';
import plusButtonImage from '../assets/AddPinModal/plus-button.png';
import sharedPin from '../assets/shared-pin.png';
import "./home.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfile from '../UserProfile/UserProfile'
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/Drawer';

const email = "TestUser@buffalo.edu";

const libraries = ['places'];
const mapContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100vh',
};

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]
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
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setToggled(false); // Reset the state of the switch
  };  
  const handleMapClick = (event) => {
  };


  const handleLanguageButtonClick= () =>{

  };

  const handleAccountCircleButtonClick= () =>{
    setUserProfileOpen((prevUserProfileOpen) => !prevUserProfileOpen);
    

  };
  const [isPublic, setToggled] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
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

    fetchLocation();
  }, []); 

  useEffect(() => {
    const fetchInfoFromBackend = async () => {
      try {
        const response = await fetch('http://localhost/api/addpin.php?email=TestUser@buffalo.edu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rawData = await response.text();
        console.log('Raw Data:', rawData);

        const data = JSON.parse(rawData);
        console.log('Parsed Data:', data);

        if (data.success) {
          data.data.forEach(coordinate => {
            updateMarker(coordinate)
          });
        } else {
          console.error('Error:', data.error);
        }

      } catch (error) {
        setError('Error fetching coordinates from backend');
        console.error('Error fetching coordinates from backend:', error.message);
      }
    };

    fetchInfoFromBackend();
  }, []);


  const updateMarker = (coordinates) => {
    const newMarker = {
      lat: coordinates.lat,
      lng: coordinates.lng,
      id: markers.length + 1,
      draggable: true,
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const placeNewMarker = () => {
    if (currentLocation) {
      const newMarker = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        id: markers.length + 1,
        draggable: true,
      };

      var title = document.querySelector('.title-box').value;
      var description = document.querySelector('.description-box').value;

      var currentDate = new Date();
      var offset = currentDate.getTimezoneOffset();
      currentDate.setMinutes(currentDate.getMinutes() - offset);
      
      var date = currentDate.toISOString().split('T')[0];       

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      sendCoordinatesToBackend({email, lat: newMarker.lat, lng: newMarker.lng, title, description, date, isPublic});
    }
  };

  const sendCoordinatesToBackend = async (info) => {
    try {
      const response = await fetch('http://localhost/api/addpin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
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
    setToggled(false);
    };  
  const handleMapClick = (event) => {}; 

    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);


  // right now this just deletes the marker which is temp feature. At some point this will pull up the pin details page
  const handleMarkerClick = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
  };

  const handleSubmit = (event) => {
    handleClose()
  };

  const handleToggleClick = () => {
    setToggled(!isPublic);
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
        center={currentLocation}
        zoom={currentLocation ? 12 : 12}
        onClick={handleMapClick} // this does nothing 
        options={mapOptions}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker.id)}
          />
        ))}
        <div className="another-icon">
          <button className="white-button" onClick={() => handleLanguageButtonClick()}>
            <LanguageIcon className="language-icon" />
          </button>
        </div>

        <div className="account-icon">
          <button className="white-button" onClick={()=>handleAccountCircleButtonClick()}>
            <AccountCircleIcon className="accountcircle-icon" />
          </button>
          {userProfileOpen && (
            <UserProfile onClose={() => setUserProfileOpen(true)} />
          )}
        </div>
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
              <div className="title-words"></div>
              <div className="make-public"></div>
              <html lang="en">
              <head>
                <meta charset="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>Your Page Title</title>
              </head>
              <body>
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
              </body>
              </html>
              <button className="leave-arrow" onClick={handleClose}>
                <ArrowBackIosNewIcon/>
              </button>
              <button className="switch" onClick={handleToggleClick}>
                {isPublic? <ToggleOnIcon fontSize='large' /> : <ToggleOffIcon fontSize='large' color='disabled'/>}
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

              <div>
                  <button className='shared-pins-icon' variant="contained" color="primary" onClick={handleOpen2}>
                      <img src={sharedPin} alt="Shared Pins" />
                  </button>
                  <SwipeableDrawer
                        className= 'SharedPinsContainer'
                      open={open2}
                      onClose={handleClose2}>

                      <Box className='SharedPins' >
                          <button className="leave-arrow" onClick={handleClose2}>
                              <ArrowBackIosNewIcon />
                          </button>
                          <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>

                              <ListItem alignItems="center">
                                  <h2 >
                                      Shared Pins </h2>

                              </ListItem>
                              <Divider />
                              <ListItem alignItems="flex-start">
                                  <ListItemText
                                      primary="City/State"
                                      secondary={
                                          <React.Fragment>
                                              <Typography
                                                  sx={{ display: 'inline' }}
                                                  component="span"
                                                  variant="body2"
                                                  color="text.primary"
                                              >
                                                  Date: 3/1/23
                                              </Typography>
                                              <Typography>
                                                  {" Created by: User"}
                                              </Typography>
                                          </React.Fragment>

                                      }
                                  />
                              </ListItem>
                              <Divider />
                              <ListItem alignItems="flex-start">
                                  <ListItemText
                                      primary="City/State"
                                      secondary={
                                          <React.Fragment>
                                              <Typography
                                                  sx={{ display: 'inline' }}
                                                  component="span"
                                                  variant="body2"
                                                  color="text.primary"
                                              >
                                                  Date: 3/1/23
                                              </Typography>
                                              <Typography>
                                                  {" Created by: User"}
                                              </Typography>
                                          </React.Fragment>
                                      }
                                  />
                              </ListItem>
                              <Divider />
                          </List>                         
                      </Box>
                  </SwipeableDrawer>
              </div>


      </GoogleMap>  
      {error && <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'red', bgcolor: 'white' }}>{error}</div>}
    </div>
  );
};

export default App;