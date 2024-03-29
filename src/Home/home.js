import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import '../App.css';
import { Modal, Button, Box } from '@mui/material';
import plusButtonImage from '../assets/AddPinModal/plus-button.png';
import sharedPin from '../assets/shared-pin.png';
import "./home.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfile from '../UserProfile/UserProfile'
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import MapIcon from '@mui/icons-material/Map';

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

const pinModalStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f5f5f5',
    border: '2px solid #000',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
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
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [open, setOpen] = useState(false);
    const [userProfileOpen, setUserProfileOpen] = useState(false);
    const [isPublic, setToggled] = useState(false);
    const [error, setError] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const email = localStorage.getItem('email');
    const [matchedData, setMatchedData] = useState([]);
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false); 

    const [open3, setOpen3] = useState(false);//Comment box
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);

    const [heart, setheart] = useState(false);
    const like = () => setheart(true);
    const unlike = () => setheart(false);


    const [openModal, setOpenPinModal] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setToggled(false);
    };
    const handleMapClick = (event) => {
    };
    const handleAccountCircleButtonClick = () => {
        setUserProfileOpen((prevUserProfileOpen) => !prevUserProfileOpen);
    };

    const handleSubmit = (event) => {
        handleClose()
    };

    const handleToggleClick = () => {
        setToggled(!isPublic);
    };

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        setOpenPinModal(true);
    };
    const handleClosePinModal = () => {
        setSelectedMarker(null);
        setOpenPinModal(false);
    };

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
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addpin.php?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTPSS error! Status: ${response.status}`);
                }
                const rawData = await response.text();
                console.log('Raw Data:', rawData);

                const data = JSON.parse(rawData);
                console.log('Parsed Data:', data);

                if (data.success) {
                    data.data.forEach(coordinate => {
                        if (coordinate.email === email) {
                            coordinate.first_name = "You"
                            coordinate.last_name = ""
                        }
                        updateMarker(coordinate);
                        fetchCityState(coordinate.lat, coordinate.lng, setMarkers);
                        console.log(coordinate.comments , coordinate.pin_id)
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

    useEffect(() => {
        const getSharedPins = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sharedPinFetch.php`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (result.message) {
                    setError(result.message);
                } else {
                    const filteredResult = result.filter(item => item.email === email);

                    if (filteredResult.length > 0) {
                        await setMatchedData(filteredResult);

                        for (let i = 0; i < filteredResult.length; i++) {
                            const item = filteredResult[i];
                            await fetchCityState(item.lat, item.lng, setMatchedData);
                        }
                    } else {

                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        getSharedPins();
    }, []);

 
    useEffect(() => {
        if (!markers.find(marker => marker.id === selectedMarker?.id)) {
            setSelectedMarker(null);
        }
    }, [markers, selectedMarker]);

    const renderMarkers = () => {
        return markers.map((marker) => (
            <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => handleMarkerClick(marker)}
            />
        ));
    };

    const updateMarker = (coordinates) => {
        const newMarker = {
            lat: coordinates.lat,
            lng: coordinates.lng,
            id: coordinates.pin_id,
            draggable: true,
            title: coordinates.title,
            description: coordinates.description,
            date: coordinates.date,
            first_name: coordinates.first_name,
            last_name: coordinates.last_name,
            email: coordinates.email,
            comment: coordinates.comments,
            like: coordinates.isLiked
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    const sendcomment = () => { 
        var comment = document.querySelector('.comment-box').value;
        var pin_id = selectedMarker.id
        console.log(comment, pin_id)
        sendCommentToBackend({ pin_id, comment });

    }




    const placeNewMarker = () => {
        var title = document.querySelector('.title-box').value;
        var description = document.querySelector('.description-box').value;

        var currentDate = new Date();
        var offset = currentDate.getTimezoneOffset();
        currentDate.setMinutes(currentDate.getMinutes() - offset);

        var date = currentDate.toISOString().split('T')[0];

        if (currentLocation) {
            const newMarker = {
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                id: markers.length + 1,
                draggable: true,
                title: title,
                description: description,
                date: date,
                email: email,
                first_name: "You"
            };
            fetchCityState(newMarker.lat, newMarker.lng, setMarkers)
            setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
            sendCoordinatesToBackend({ email, lat: newMarker.lat, lng: newMarker.lng, title, description, date, isPublic });
        }
    };
    const sendCommentToBackend = async (info) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sendComment.php`, {
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

    const sendCoordinatesToBackend = async (info) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addpin.php`, {
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

    const likecheck = () => {
        let valueToSend;
        if (selectedMarker.like) {
            valueToSend = -1; // Send -1 if checkbox is checked
            unlike()
            selectedMarker.like = false
        } else {
            valueToSend = 1; // Send 1 if checkbox is not checked
            like()
            selectedMarker.like = true
        }

            fetch(`${process.env.REACT_APP_API_BASE_URL}/likes.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: valueToSend, pin_id : selectedMarker.id, email: email})
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                // Handle response from the server if needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors if any
            });
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
                {renderMarkers()}
                {selectedMarker && (
                    <Modal open={openModal} onClose={handleClosePinModal}>
                        <Box className="PinInfo" sx={pinModalStyle}>
                            <AccountCircleIcon style={{ fontSize: 150, color: 'black', margin: '2px 0' }} />
                            <Typography variant="h5" component="div" sx={{ fontSize: '2rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                {selectedMarker.first_name} {selectedMarker.last_name}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.5rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                {selectedMarker.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '1.5rem', marginBottom: '0px', textAlign: 'center' }}>
                                {selectedMarker.city || selectedMarker.state} , {selectedMarker.state}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '.8rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                {selectedMarker.lat}, {selectedMarker.lng}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', textAlign: 'center' }}>
                                on {selectedMarker.date}
                            </Typography>
                            <div style={{ display: 'flex' }}>
                                <IconButton onClick={() => {
                                    likecheck()
                                }}>
                                    <FavoriteBorderIcon fontSize='large' style={{ color: selectedMarker.like === true ? "#F00" : "#000" }} />

                                </IconButton>

                                <IconButton onClick={handleOpen3}>
                                    <ChatIcon fontSize='large'  />
                                </IconButton>
                                <Modal
                                    open={open3}
                                    onClose={handleClose3}
                                >
                                    <Box className="commentmodal" sx={modalStyle}>
                                        <div className="comment"></div>
                         
                                        <html lang="en">
                                            <head>
                                                <meta charset="UTF-8"></meta>
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                                                <title>Your Page Title</title>
                                            </head>
                                            <body>
                                                <form>
                                                    <textarea
                                                        className="comment-box"
                                                        name="comment"
                                                        rows="4"
                                                        cols="50">
                                                    </textarea>
                                                </form>

                                            </body>
                                        </html>
                                        <button className="leave-arrow" onClick={handleClose3}>
                                            <ArrowBackIosNewIcon />
                                        </button>
                                      
                                        <Button sx={{
                                            bgcolor: "#354545",
                                            color: "#FFFFFF",
                                            fontSize: "large"
                                        }}
                                            className="comment-box"
                                            variant="contained"
                                            onClick={() => {
                                              sendcomment()
                                              handleClose3()
                                            }}
                                            style={{ borderRadius: 10 }}>Add Comment</Button>
                                            
                                    </Box>
                 
                                </Modal>

                                <IconButton>
                                    <MapIcon fontSize='large' />
                                </IconButton>
                            </div>
                            <Box
                                sx={{
                                    border: '1px solid #000',
                                    borderRadius: '10px',
                                    padding: '5px',
                                    marginTop: '10px',
                                    textAlign: 'center',
                                    height: '25%',
                                    width: '90%',
                                }}
                            >
                                <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                                    {selectedMarker.description}
                                </Typography>
                            </Box>
                            <button className="leave-arrow" onClick={handleClosePinModal}>
                                <ArrowBackIosNewIcon />
                            </button>
                        </Box>
                    </Modal>
                )}
                <div className="account-icon">
                    <button className="white-button" onClick={() => handleAccountCircleButtonClick()}>
                        <AccountCircleIcon className="accountcircle-icon" />
                    </button>
                    {userProfileOpen && (
                        <UserProfile onClose={() => setUserProfileOpen(false)} />
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
                        <Box className="modalAddPin" sx={modalStyle}>
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
                                <ArrowBackIosNewIcon />
                            </button>
                            <button className="switch" onClick={handleToggleClick}>
                                {isPublic ? <ToggleOnIcon fontSize='large' /> : <ToggleOffIcon fontSize='large' color='disabled' />}
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
                        className='SharedPinsContainer'
                        open={open2}
                        onClose={handleClose2}
                    >
                        <Box className='SharedPins'>
                            <button className="leave-arrow" onClick={handleClose2}>
                                <ArrowBackIosNewIcon />
                            </button>
                            <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>

                                <ListItem alignItems="center">
                                    <h2>Shared Pins</h2>
                                </ListItem>
                                <Divider />

                                {matchedData.length > 0 ? (
                                    matchedData.map((item) => (
                                        <React.Fragment key={item.lat}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemText
                                                    primary={`City/State: ${item.city || item.state || "NA"}, ${item.state || "NA"}`}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                Date: {item.date}
                                                            </Typography>
                                                            <Typography>
                                                                {" Created by: " + item.first_name + " " + item.last_name}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary="No Shared Pins"
                                        />
                                    </ListItem>
                                )}

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