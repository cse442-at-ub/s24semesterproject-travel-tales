import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Avatar from 'react-avatar-edit';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";



const getCurrentUserInfo = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getCurrentUser.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',

        });

        if (!response.ok) {
            throw new Error('Failed to fetch user information');
        }

        const userData = await response.json();

        // Assuming userData is an object with keys: first_name, last_name, email, and username
        return userData;
    } catch (error) {
        console.error('Error fetching current user information:', error.message);
        throw error;
    }
};

const SettingsDialog = () => {
    const email = localStorage.getItem('email');
    const [color, setColor] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const handleAlignment = (event, newColor) => {
        setColor(newColor);
    };

    const [src, setsrc] = useState(null);
    const [preview, setPreview] = useState('');
    const [buttonText, setButtonText] = useState("Confirm");
    const [infoButton, setInfoButton] = useState("Confirm")
    const [passButton, setPassButton] = useState("Confirm")
    const [emailButton, setEmailButton] = useState("Confirm")
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [message, setmessage] = useState('');
    const [message2, setmessage2] = useState('');
    const [message3, setmessage3] = useState('');
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        pass: '',
        confirmPass: '',
    });

    

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await getCurrentUserInfo();
                setCurrentUser(userData)
                //console.log(userData)

            } catch (error) {
                console.log(error)
            }
        };
        fetchCurrentUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleClick = () => {
        if (color === null) {
            setButtonText("Please a select profile picture")
        }
        else {
            setButtonText("Profile Set!");
            handleUpdateProfile()
            setColor(null)
        }
    };

    const onClose = () => {
        setPreview(null);
        setButtonText("Confirm")
        
    }

    const onCrop = view => {
        setPreview(view);
    }

    const handleinfo = async (e) => {
        setError('');
        e.preventDefault();
        if (infoButton === "Confirm" || infoButton === "Changes have been made") {
            setInfoButton("Are You Sure?")
        }
        else {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ChangeInfo.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName}),
                });

                if (response.ok) {
                    const data = await response.json();
                    setmessage(data.message);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                    setInfoButton('Confirm')
                    return;
                }
            } catch (error) {
                console.log(error)
                setError('An error occurred. Please try again later.');
                setInfoButton('Confirm')
                return;
            }
            setInfoButton("Changes have been made")
        }
    }

    const handlepass = async (e) => {
        e.preventDefault();
        setError2('');
        
        if (passButton === "Confirm" || passButton === "Changes have been made") {
            if (formData.pass !== formData.confirmPass) {
                setError2('Passwords do not match.');
                setFormData.pass = '';
                setFormData.confirmPass = '';
                return;
            }
            setPassButton("Are You Sure?")
        }
        else {
            if (formData.pass !== formData.confirmPass) {
                setError2('Passwords do not match.');
                setFormData.pass = '';
                setFormData.confirmPass = '';
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ChangePass.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({pass: formData.pass, confirmPass: formData.confirmPass}),
                });

                if (response.ok) {
                    const data = await response.json();
                    setmessage2(data.message);
                } else {
                    const errorData = await response.json();
                    setError2(errorData.message);
                    setPassButton('Confirm')
                    return;
                }
            } catch (error) {
                console.log(error)
                setError2('An error occurred. Please try again later.');
                setPassButton('Confirm')
                return;
            }
            handleLogout()
            setEmailButton("Changes have been made")
            formData.Email = '';
            formData.confirmEmail = ''
        }
    }

    const handleemail = async (e) => {
        e.preventDefault();
        setError3('');
        
        // Validate if emails match
        if (formData.email !== formData.confirmEmail) {
            setError3('Emails do not match.');
            setFormData(prevState => ({ ...prevState, email: '', confirmEmail: '' }));
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ChangeEmail.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email: formData.email, confirmEmail: formData.confirmEmail }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setmessage3(data.message);
                if (emailButton === "Confirm") {
                    setEmailButton("Changes have been made");
                }
            } else {
                const errorData = await response.json();
                setError3(errorData.message);
                setEmailButton('Confirm');
            }
        } catch (error) {
            console.log(error);
            setError3('An error occurred. Please try again later.');
            setEmailButton('Confirm');
        }
    };

    const handleLogout = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout.php`, {
          method: 'POST', // Or 'GET', depending on your backend setup
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          navigate('/login');
        }
      } catch (error) {
      }
    };

    // Delete account functionality
    const [errorMessage, setErrorMessage] = useState('');
    const handleDeleteAccount = () => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/deleteAccount.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setErrorMessage('');
          navigate('/login');
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        setErrorMessage('An error occurred while trying to delete the account.')
      });
    }

    // Function to handle updating profile data
    const handleUpdateProfile = async () => {
        console.log("sent color", color)
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/Profile.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, profile: color }),
                credentials: 'include',
            });
            // Optionally, you can fetch the updated profile data here again
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        < >
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    
                >
                    <Typography>General</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        //p: 5,
                    }}>
                    
                        <Accordion sx={{
                            width: '100%', maxWidth: 400, margin: 0
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Change Profile Icon</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    border: 0
                                }}>
                                    <ToggleButtonGroup

                                        value={color}
                                        exclusive
                                        onChange={handleAlignment}
                                        aria-label="text alignment"
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            border: 0

                                        }}
                                    >
                                       
                                        <ToggleButton value="Black">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Black' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Red" >
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Red' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Blue">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Blue' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Green">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Green' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Orange">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Orange' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Purple">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Purple' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Teal">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Teal' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Pink">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Pink' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Cyan">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Cyan' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Yellow">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Yellow' }} />
                                        </ToggleButton>
                                        <ToggleButton value="Indigo">
                                            <AccountCircleIcon style={{ fontSize: 70, color: 'Indigo' }} />
                                        </ToggleButton>

                                        <ToggleButton value={preview} sx={{ width: 92, height: 92 }} >
                                            < img src={preview} />
                                        </ToggleButton>

                                    </ToggleButtonGroup>

                                    <Box 
                                        sx={{
                                            width: '100%', maxWidth: 300, maxHeight: 400, margin: 0, objectfit: 'contain', overflow: 'hidden'
                                        }}
                                    >
                                        <Avatar
                                            width= '200'
                                            height= '200'
                                            onCrop={onCrop}
                                            onClose={onClose}
                                            src={src}
                                        />
                                    </Box>

                                    <Button variant="contained" color="primary" onClick={() => {
                                        handleClick()
                                    }} sx={{ mt: 2 }}>
                                        {buttonText}
                                    </Button>
                                </Box>



                            </AccordionDetails>
                        </Accordion>

                        <Accordion sx={{
                            width: '100%', maxWidth: 400, margin: 0
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Account Information</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <Typography variant="body1" sx={{ fontSize: '1.25rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                        First Name: {currentUser.first_name }
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.25rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                        Last Name: {currentUser.last_name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.25rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                        Username: {currentUser.username}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.25rem', marginBottom: '2.5px', textAlign: 'center' }}>
                                        Email: {currentUser.email}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>


                    </Box>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Advanced</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header" >
                            <Typography>Change Info</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleinfo}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <label htmlFor="name"></label>
                                    <TextField onChange={handleChange}  name="firstName" required type="name" id="namechange1" label="First Name" variant="outlined"
                                        sx={{
                                            width: '100%', maxWidth: 300, margin: 0
                                        }}
                                    />

                                    <TextField onChange={handleChange} required type="name" name="lastName" id="namechange2" label="Last Name" variant="outlined"
                                        sx={{ width: '100%', maxWidth: 300, margin: 2 }} />
                                    {message && <p style={{ color: 'green' }}>{message}</p>}
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <Button variant="contained" color="primary" type="submit"  sx={{ mt: 2, margin: 1 }}>
                                        {infoButton}
                                    </Button>
                                </Box>
                            </form>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header" >
                            <Typography>Change Email</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleemail}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }}>
                                    <label htmlFor="email"></label>
                                    <TextField onChange={handleChange} required type="email" name="email" id="emailchange1" label="New Email" variant="outlined"
                                        sx={{ width: '100%', maxWidth: 300, margin: 0 }}
                                    />

                                    <TextField onChange={handleChange} required type="email" name="confirmEmail" id="emailchange2" label="Confirm New Email" variant="outlined"
                                        sx={{ width: '100%', maxWidth: 300, margin: 2 }} />    
                                    {message3 && <p style={{ color: 'green' }}>{message3}</p>}
                                    {error3 && <p style={{ color: 'red' }}>{error3}</p>}
                                    <Button variant="contained" color="primary" type="submit" sx={{ mt: 2, margin: 1 }}>
                                        {emailButton}
                                    </Button>
                                </Box>
                            </form>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header" >
                            <Typography>Change Password</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handlepass}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }}>

                                    <label htmlFor="password"></label>
                                    <TextField onChange={handleChange} required type="password" name="pass" id="passchange1" label="New Password" variant="outlined"
                                        sx={{ width: '100%', maxWidth: 300, margin: 0 }}
                                    />

                                    <TextField onChange={handleChange} required type="password" id="passchange2" name="confirmPass" label="Confirm New Password" variant="outlined"
                                        sx={{ width: '100%', maxWidth: 300, margin: 2 }} />
                                    {message2 && <p style={{ color: 'green' }}>{message2}</p>}
                                    {error2 && <p style={{ color: 'red' }}>{error2}</p>}
                                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, margin: 1 }}>
                                        {passButton}
                                    </Button>
                                </Box>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                    }}>
                        <Typography>
                            No longer interested in Travel Tales?
                        </Typography>
                        <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mt: 2 }}>
                            Delete Account
                        </Button>
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
            }}>
                <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
                    Logout
                </Button>
            </Box>
        </>
    );
};

export default SettingsDialog;
