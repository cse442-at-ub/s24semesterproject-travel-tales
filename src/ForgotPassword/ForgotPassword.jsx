import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../assets/Login/Background.png"
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/resetPassword.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if(response.ok) {
            navigate('/resetPassword');
        } else {
            setError(data.message);
            setOpenSnackbar(true);
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    return (
        <div className="Forgot-Password">
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className="text">Need a reset code?</h1>
                <p style={{fontSize: '14px'}} className="text">Enter your email and we will send you one!</p>
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
                <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </form>

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
    )

}