import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import Modal from '../Components/Modal/AddPinModal'
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


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

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);

  const handleMapClick = (event) => {
  };

  const handleLanguageButtonClick= () =>{

  };

  const handleAccountCircleButtonClick= () =>{

  };

  /*
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
  */

  const handleMarkerDrag = (markerId, newPosition) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
      )
    );
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
        <>
          <Modal/>
          <div className="another-icon">
          <button className="white-button" onClick={() => handleLanguageButtonClick()}>
            <LanguageIcon className="language-icon" />
          </button>
        </div>

        <div className="account-icon">
          <button className="white-button" onClick={() => handleAccountCircleButtonClick()}>
            <AccountCircleIcon className="accountcircle-icon" />
          </button>
        </div>
      </>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            //onClick={() => handleMarkerClick(marker.id)}
            draggable={marker.draggable}
            onDragEnd={(e) => handleMarkerDrag(marker.id, e.latLng.toJSON())}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default App;
