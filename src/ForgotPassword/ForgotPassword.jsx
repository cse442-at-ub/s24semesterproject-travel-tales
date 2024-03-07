import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../assets/Login/Background.png"
import { Modal, Button, Box } from '@mui/material';

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        const response = await fetch('https://localhost/api/resetPassword.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if(response.ok) {
            setMessage(data.message);
        } else {
            setError(data.message);
        }
        handleOpen()
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 10,
    };




    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className= 'confirm-box' sx={modalStyle}>
                    {/* <h2 id="modal-modal-title">Password Reset Request Sent!</h2> */}
                    <p id="modal-modal-description">
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </p>
                    <br />
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>




        <div className="Forgot-Password">
            
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className ="text">Enter the email associated with your account and we will send you a code to reset your password</h1>
                <label htmlFor="email"></label>
                <input
                    type="email"
                    value={email}
                    name="email"
                    onChange={handleChange} // Use handleChange to update state
                    placeholder="Enter your email"
                    required
                />
                <button type="submit" className="confirm">Continue</button>
                <Link className="link" to="/login" >Go Back?</Link>
                {/* <label className="errorLabel">{message}</label> */}
            </form>

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
       </div>
    )

}