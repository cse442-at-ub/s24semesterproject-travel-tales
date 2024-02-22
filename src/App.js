import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './App.css';
import plusButtonImage from './assets/plus-button.png';
import modalImage from './assets/modal-background.png';
import arrow from './assets/leave-arrow.png';

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
  const [showModal, setShowModal] = useState(false);

  const handleMapClick = (event) => {
    // Add your logic for handling map clicks
  };

  const handleMarkerClick = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
  };

  const handleRemoveAllMarkers = () => {
    // Add a new marker at the center of the screen
    const newMarker = {
      lat: center.lat,
      lng: center.lng,
      id: markers.length + 1,
      draggable: true, // Make the marker draggable
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleMarkerDrag = (markerId, newPosition) => {
    // Update the position of the dragged marker
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
      )
    );
  };

  const handlePlusButtonClick = () => {
    // Open the modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setShowModal(false);
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
        onClick={handleMapClick}
        options={mapOptions}
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
      </GoogleMap>
      <div className="plus-icon">
        <button onClick={handlePlusButtonClick}>
          <img src={plusButtonImage} alt="Plus Button" />
        </button>
      </div>
      <div className="plus-icon">
        <button onClick={handlePlusButtonClick}>
          <img src={plusButtonImage} alt="Plus Button" />
        </button>
      </div>
      {showModal && (
        <div className="modal-background">
          <img src={modalImage} alt="Modal" />
        </div>
      )}
    </div>
  );
};

export default App;
