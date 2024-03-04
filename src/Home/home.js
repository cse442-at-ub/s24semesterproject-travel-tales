import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import { Modal, Button, Box } from '@mui/material';
import plusButtonImage from '../assets/plus-button.png';
import "./home.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfile from '../UserProfile/UserProfile'


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

  
  const handleMarkerClick = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
  };

  const placeNewMarker = () => {
    const newMarker = {
      lat: center.lat,
      lng: center.lng,
      id: markers.length + 1,
      draggable: true, // Make the marker draggable
    };
    

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };
  

  const handleMarkerDrag = (markerId, newPosition) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
      )
    );
  };

  const handleSubmit = (event) => {
    handleClose()
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
        center={center}
        zoom={10}
        onClick={handleMapClick} // this does nothing 
        options={mapOptions}
        //onDblClick={placeNewMarker}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker.id)}
            draggable={marker.draggable}
            onDragEnd={(e) => handleMarkerDrag(marker.id, e.latLng.toJSON())}
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
    </div>
  );
};

export default App;