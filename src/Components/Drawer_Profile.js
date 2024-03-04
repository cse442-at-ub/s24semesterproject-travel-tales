// import React, { useState } from 'react';
// import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import MyPinsModal from './Modal/MyPinsModal';

// const SwipeableTemporaryDrawer = ({ open, onClose }) => {
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
//       onClick={onClose} variant="contained" color="primary" 
//       sx={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         margin: '10px', // Adjust the margin as needed
//         padding: '8px', // Adjust the padding as needed
//         transition: 'background-color 0.3s', // Adjust the margin as needed
//         '&:hover': {
//           backgroundColor: '#2196F3',
//         },
//       }}>Log Out</Button>

//       <Divider style={{ width: '100%', margin: '8px 0' }} />
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
//           200 PINS |
//         </Typography>

//         <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
//           200 LIKES |
//         </Typography>

//         <Typography variant="subtitle1" style={{ fontSize: '1rem', margin: '2px' }}>
//           2000 FRIENDS
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
//               height: 40,
//               padding: '0 20px',
//               boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
//             }}
//           >
//             PINS
//           </Button>
//         </ButtonGroup>
//       </ListItem>
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

// export default SwipeableTemporaryDrawer;
