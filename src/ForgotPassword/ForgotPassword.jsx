import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../assets/Login/Background.png"
import { Modal, Button, Box } from '@mui/material';

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');





    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const onButtonClick = () => {
        setEmailError('')

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
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
                    <h2 id="modal-modal-title">Password Reset Request Sent!</h2>
                    <p id="modal-modal-description">
                        A password reset message was sent to your email address.
                        Please click the link in that message to reset your password.
                    </p>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>




        <div className="Forgot-Password">
            
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className ="text">Enter the email associated with your account and we will send you a code to reset your password</h1>
                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                <label className="errorLabel">{emailError}</label>
                <button className="confirm" onClick={onButtonClick}>Continue</button>

                <Link className="link" to="/login" >Go Back?</Link>
            </form>
      

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
       </div>
    )

}