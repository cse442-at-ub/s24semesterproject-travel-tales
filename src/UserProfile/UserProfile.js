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
import pin_1 from '../assets/Profile/1_pin.png'
import pin_5 from '../assets/Profile/5_pin.png'
import pin_10 from '../assets/Profile/10_pin.png'
import pin_25 from '../assets/Profile/25_pin.png'
import pin_50 from '../assets/Profile/50_pin.png'
import pin_100 from '../assets/Profile/100_pin.png'
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogContent, DialogTitle, CircularProgress } from '@mui/material/';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingsDialog from '../Settings/SettingsDialog';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Tooltip from '@mui/material/Tooltip';

const SwipeableTemporaryDrawer = ({ open, onClose }) => {
const [drawerAnchor, setDrawerAnchor] = useState('right');
const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);
const [FriendsModalOpen, setFriendsModalOpen] = useState(false);
const [profileData, setProfileData] = useState('black')
const [pinCount, setPinCount] = useState('0')
const [loading, setLoading] = useState(false);


useEffect(() => {
    const handleFetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Profile.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setProfileData(data.profile)

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };
    handleFetchProfile();

}, []);

useEffect(() => {
    setLoading(true);
    const handleAchievements = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getAchievements.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                const pinCount = data[0].count; 
                setPinCount(pinCount);
                setLoading(false);
            } else {
                setLoading(false);
                console.error('Empty or invalid data received.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching pin count:', error);
        }
    };
    handleAchievements();
}, []);


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
            width: '100%', 
            maxWidth: 400,
            minWidth: 350,
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
        <ArrowBackIosNewIcon 
            className="leave-arrow" 
            onClick={onClose} 
            style={{ position: 'absolute', left: '5%', marginTop: '2%'}}
        ></ArrowBackIosNewIcon>
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
                {pinCount} PINS |
            </Typography>

            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
                200 LIKES |
            </Typography>

            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
                2000 FOLLOWERS
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
                    FOLLOWERS
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
                        padding: '0 40px',
                        boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                    }}
                >
                    PINS
                </Button>
            </ButtonGroup>
        </ListItem>
        <Divider style={{ width: '110%', margin: '20px' }} />
        <Typography variant="h5" style={{ marginBottom: '10px' }}>
            Tale Achievements
        </Typography>        {loading && <CircularProgress />}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            <Tooltip title="Create your first pin">
                {pinCount >= 1 && <img src={pin_1} alt="Post 1" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
            <Tooltip title="Create 5 pins">
                {pinCount >= 5 && <img src={pin_5} alt="Post 5" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
            <Tooltip title="Create 10 pins">
                {pinCount >= 10 && <img src={pin_10} alt="Post 10" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
            <Tooltip title="Create 25 pins">
                {pinCount >= 25 && <img src={pin_25} alt="Post 25" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
            <Tooltip title="Create 50 pins">
                {pinCount >= 50 && <img src={pin_50} alt="Post 50" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
            <Tooltip title="Create 100 pins">
                {pinCount >= 100 && <img src={pin_100} alt="Post 100" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />}
            </Tooltip>
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