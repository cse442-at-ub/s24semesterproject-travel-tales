import React, { useState, useEffect } from 'react';
import UsernameForm from '../Components/UsernameForm';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MyPinsModal from '../Components/Modal/MyPinsModal';
import FriendsPin from '../Components/Modal/FriendsModal';
import Photo1 from '../assets/photo1.png';
import Photo2 from '../assets/photo2.jpeg';
import Photo3 from '../assets/photo3.jpeg';
import Photo4 from '../assets/photo4.jpeg';
import Photo5 from '../assets/photo5.jpeg';
import Photo6 from '../assets/photo6.jpeg';
import Photo7 from '../assets/photo7.jpeg';
import Photo8 from '../assets/photo8.jpeg';
import Photo9 from '../assets/photo9.jpeg';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogContent, DialogTitle } from '@mui/material/';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingsDialog from '../Settings/SettingsDialog';


const SwipeableTemporaryDrawer = ({ open, onClose }) => {
const [drawerAnchor, setDrawerAnchor] = useState('right');
const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);
const [FriendsModalOpen, setFriendsModalOpen] = useState(false);
const [profileData, setProfileData] = useState('black')
const email = localStorage.getItem('email');


useEffect(() => {
    const handleFetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Profile.php?email=${email}`);
            const data = await response.json();
            setProfileData(data.profile)

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };
    handleFetchProfile();

}, [email]);


const renderContent = () => {
    if (/^data:image\/[a-z]+;base64,/.test(profileData)) {

        return (<img style={{ width:"100%", maxWidth: '150px', maxHeight:'150px', margin: '2px 0'  }}  width="50px" height="50px" src={profileData} alt="Base64" />);

    } else {
        return(<AccountCircleIcon style={{ fontSize: 150, color: profileData, margin: '2px 0' }} />);
    }
};


const toggleDrawer = (isopen) => () => {
    onClose(isopen);
};

const handlePinsButtonClick = () => {
    setMyPinsModalOpen(true);
};

const handleFriendsButtonClick = () => {
    setFriendsModalOpen(true);
};

const [openSettings, setOpenSettings] = useState(false);

const handleOpenSettings = () => {
    setOpenSettings(true);
};

const handleCloseSettings = () => {
    setOpenSettings(false);
};

const list = () => (
    <div
        style={{
            width: '40vw',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80%',
            background: 'white',
        }}
        role="presentation"
        onClick={(e) => {
            e.stopPropagation();
        }}
    >
        <Typography variant="h5" gutterBottom>
            PROFILE
        </Typography>
        <Button onClick={handleOpenSettings} sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            margin: '10px',
            padding: '8px',
        }}
            style={{ backgroundColor: 'white', color: 'black' }}>
            <SettingsIcon />
        </Button>
        <Dialog open={openSettings} onClose={handleCloseSettings} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                User Settings
                <IconButton
                    aria-label="close"
                    onClick={handleCloseSettings}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <SettingsDialog />
            </DialogContent>
        </Dialog>

        {renderContent()}
        <UsernameForm />
        
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0',
                margin: '0px 0',
            }}
        >
            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
                200 PINS |
            </Typography>

            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
                200 LIKES |
            </Typography>

            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
                2000 FRIENDS
            </Typography>
        </div>

        <ListItem disablePadding>
            <ButtonGroup style={{ width: '100%', justifyContent: 'center' }}>
                <Button
                    onClick={handleFriendsButtonClick}
                    style={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
                        borderRadius: 3,
                        fontSize: '1rem',
                        border: 3,
                        color: 'white',
                        height: 40,
                        marginTop: 10,
                        padding: '0 20px',
                        boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                    }}
                >
                    FRIENDS
                </Button>
                <Button
                    onClick={handlePinsButtonClick}
                    style={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
                        borderRadius: 3,
                        fontSize: '1rem',
                        border: 3,
                        color: 'white',
                        marginTop: 10,
                        height: 40,
                        padding: '0 20px',
                        boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                    }}
                >
                    PINS
                </Button>
            </ButtonGroup>
        </ListItem>
        <Divider style={{ width: '100%', margin: '20px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {/* Place your picture components here */}
            <img src={Photo1} alt="Post 1" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo2} alt="Post 2" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo3} alt="Post 3" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo4} alt="Post 4" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo5} alt="Post 5" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo6} alt="Post 6" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo7} alt="Post 7" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo8} alt="Post 8" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            <img src={Photo9} alt="Post 9" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
            {/* Add more pictures as needed */}
        </div>
    </div>
);

return (
    <div>
        <React.Fragment>
            <SwipeableDrawer
                anchor={drawerAnchor}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                {list()}
            </SwipeableDrawer>
            <MyPinsModal open={myPinsModalOpen} onClose={() => setMyPinsModalOpen(false)} />
            <FriendsPin open={FriendsModalOpen} onClose={() => setFriendsModalOpen(false)} />
        </React.Fragment>
    </div>
);
};

const UserProfile = ({ onClose }) => {
const [drawerOpen, setDrawerOpen] = useState(true);
const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);

const handlePinsButtonClick = () => {
    setDrawerOpen(true);
    setMyPinsModalOpen(false);
    onClose();
};

return (
    <div>
        <SwipeableTemporaryDrawer open={drawerOpen} onClose={() => { setDrawerOpen(true); onClose(); }} />
    </div>
);
};

export default UserProfile;