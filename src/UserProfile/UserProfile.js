import React, { useState, useEffect } from 'react';
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

// const SwipeableTemporaryDrawer = ({ open, onClose, userData }) => {
//   const [drawerAnchor, setDrawerAnchor] = useState('right');
//   const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);

//   const toggleDrawer = (isopen) => () => {
//     onClose(isopen);
//   };

//   const handlePinsButtonClick = () => {
//     setMyPinsModalOpen(true);
//   };

//   const list = () => (
//     <div
//       style={{
//         width: '40vw',
//         padding: '12px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         height: '80%',
//         background: 'white',
//       }}
//       role="presentation"
//       onClick={toggleDrawer(false)}
//       onKeyDown={toggleDrawer(false)}
//     >
//       <Typography variant="h5" gutterBottom>
//         PROFILE
//       </Typography>
//       <Button
//         onClick={onClose}
//         variant="contained"
//         color="primary"
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           margin: '10px',
//           padding: '8px',
//           transition: 'background-color 0.3s',
//           '&:hover': {
//             backgroundColor: '#2196F3',
//           },
//         }}
//       >
//         Log Out
//       </Button>

//       <Button sx={{position: 'absolute',
//           top: 0,
//           right: 0,
//           margin: '10px',
//           padding: '8px',
//         }}
//           style={{ backgroundColor: 'white', color: 'black' }}>
//           <SettingsIcon/>
//       </Button>

//       <AccountCircleIcon style={{ fontSize: 150, color: 'black', margin: '2px 0' }} />

//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           gap: '0',
//           margin: '0px 0',
//         }}
//       >
//         <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
//           {userData.user_pins} PINS | 
//         </Typography>

//         <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
//           {userData.user_likes} LIKES |
//         </Typography>

//         <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
//           {userData.user_friends} FRIENDS
//         </Typography>
//       </div>

//       <ListItem disablePadding>
//         <ButtonGroup style={{ width: '100%', justifyContent: 'center' }}>
//           <Button
//             style={{
//               background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
//               borderRadius: 3,
//               fontSize: '1rem',
//               border: 3,
//               color: 'white',
//               height: 40,
//               marginTop: 10,
//               padding: '0 20px',
//               boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
//             }}
//           >
//             HISTORY
//           </Button>
//           <Button
//             onClick={handlePinsButtonClick}
//             style={{
//               background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
//               borderRadius: 3,
//               fontSize: '1rem',
//               border: 3,
//               color: 'white',
//               marginTop: 10,
//               height: 40,
//               padding: '0 20px',
//               boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
//             }}
//           >
//             PINS
//           </Button>
//         </ButtonGroup>
//       </ListItem>
//       <Divider style={{ width: '100%', margin: '20px 0' }} />
//       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
//       {/* Place your picture components here */}
//       <img src={Photo1} alt="Post 1" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo2} alt="Post 2" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo3} alt="Post 3" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo4} alt="Post 4" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo5} alt="Post 5" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo6} alt="Post 6" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo7} alt="Post 7" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo8} alt="Post 8" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       <img src={Photo9} alt="Post 9" style={{ width: '150px', height: '150px', borderRadius: '0px' }} />
//       {/* Add more pictures as needed */}
//     </div>
//     </div>
//   );

//   return (
//     <div>
//       <React.Fragment>
//         <SwipeableDrawer
//           anchor={drawerAnchor}
//           open={open}
//           onClose={toggleDrawer(false)}
//           onOpen={toggleDrawer(true)}
//         >
//           {list()}
//         </SwipeableDrawer>
//         <MyPinsModal open={myPinsModalOpen} onClose={() => setMyPinsModalOpen(false)} />
//       </React.Fragment>
//     </div>
//   );
// };

// const UserProfile = ({ onClose }) => {
//   const [drawerOpen, setDrawerOpen] = useState(true);
//   const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);
//   const [userData, setUserData] = useState({ user_likes: 0, user_pins: 0, user_friends: 0 });

//   useEffect(() => {
//     fetch('http://localhost/api/UserProfileinfo.php')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => setUserData(data.data))
//     .catch(error => console.error('Error fetching user data:', error));
//   }, []); // Empty dependency array ensures the effect runs once on component mount

//   const handlePinsButtonClick = () => {
//     // Close the drawer and trigger the callback to open the MyPins modal
//     setDrawerOpen(true);
//     setMyPinsModalOpen(false);
//     onClose();
//   };

//   return (
//     <div>
//       <SwipeableTemporaryDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false); onClose(); }} userData={userData} />
//     </div>
//   );
// };

// export default UserProfile;

const UserProfile = ({ onClose }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [myPinsModalOpen, setMyPinsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    user_likes: 0,
    user_pins: 0,
    user_friends: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost/api/UserProfileinfo.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({ user_likes: 0, user_pins: 0, user_friends: 0 }); // Set default values on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty 

  
  const toggleDrawer = (isopen) => () => {
    setDrawerOpen(isopen);
  };

  const handlePinsButtonClick = () => {
    setMyPinsModalOpen(true);
    onClose();
  };

  const { user_pins = 0, user_likes = 0, user_friends = 0 } = userData;

  const list = () => {
    if (!userData) {
      // If user_pins is not available, return null or a loading indicator
      return <p>Loading user data...</p>;
    }
    return (
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
    
          <Button sx={{position: 'absolute',
              top: 0,
              right: 0,
              margin: '10px',
              padding: '8px',
            }}
              style={{ backgroundColor: 'white', color: 'black' }}>
              <SettingsIcon/>
          </Button>
    
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
              {user_pins} PINS | 
            </Typography>
    
            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
              {user_likes} LIKES |
            </Typography>
    
            <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
              {user_friends} FRIENDS
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
      };
      return (
        <div>
          <React.Fragment>
            <SwipeableDrawer
              anchor="right"
              open={drawerOpen}
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
export default UserProfile;