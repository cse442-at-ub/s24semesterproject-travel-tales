import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MyPinsModal from '../Components/Modal/MyPinsModal'
import Photo1 from '../assets/photo1.png'
import Photo2 from '../assets/photo2.jpeg'
import Photo3 from '../assets/photo3.jpeg'
import Photo4 from '../assets/photo4.jpeg'
import Photo5 from '../assets/photo5.jpeg'
import Photo6 from '../assets/photo6.jpeg'
import Photo7 from '../assets/photo7.jpeg'
import Photo8 from '../assets/photo8.jpeg'
import Photo9 from '../assets/photo9.jpeg'
import SettingsIcon from '@mui/icons-material/Settings';
import {Dialog, DialogContent, DialogTitle} from '@mui/material/';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingsDialog from '../Settings/SettingsDialog';
// import { useNavigate } from 'react-router-dom';

const SwipeableTemporaryDrawer = ({ open, onClose }) => {
  const [drawerAnchor, setDrawerAnchor] = useState('right');
  const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);

  const toggleDrawer = (isopen) => () => {
    onClose(isopen);
  };

  const handlePinsButtonClick = () => {
    setMyPinsModalOpen(true);
  };

  // Start: Settings dialog handlers
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };
  // End: Settings dialog handlers

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
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h5" gutterBottom>
        PROFILE
      </Typography>
      <Button
        onClick={onClose}
        variant="contained"
        color="primary"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: '10px',
          padding: '8px',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: '#2196F3',
          },
        }}
      >
        Log Out
      </Button>
      

      {/* Start: Settings Dialog */}
      <Button onClick={handleOpenSettings} sx={{position: 'absolute',
          top: 0,
          right: 0,
          margin: '10px',
          padding: '8px',
        }}
          style={{ backgroundColor: 'white', color: 'black' }}>
          <SettingsIcon/>
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
      {/* End: Settings Dialog */}


      <AccountCircleIcon style={{ fontSize: 150, color: 'black', margin: '2px 0' }} />

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
            HISTORY
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
      <Divider style={{ width: '100%', margin: '20px 0' }} />
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
      </React.Fragment>
    </div>
  );
};

const UserProfile = ({ onClose }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);

  const handlePinsButtonClick = () => {
    // Close the drawer and trigger the callback to open the MyPins modal
    setDrawerOpen(true);
    setMyPinsModalOpen(false);
    onClose();
  };

  return (
    <div>
      <SwipeableTemporaryDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false); onClose(); }} />
    </div>
  );
};

export default UserProfile;
