import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import BannerImage from "../assets/Login/Background.png"
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const ResetPassword = (props) => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [formData, setFormData] = useState({
        reset_code: '',
        pass: '',
    });

    const [error, setError] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make the POST request to your backend endpoint
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/validateResetCode.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Display a message based on the response from the backend
            if (response.ok) {
                navigate('/login');
            } else {
                setError(result.error || 'An error occurred. Please try again.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError('Failed to connect to the server. Please try again later.');
            setOpenSnackbar(true);
        }
    };


    return (
        <div className="Forgot-Password">
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className="text">Reset Password</h1>
                <p style={{fontSize: '14px', paddingBottom: '6px'}} className="text">Check your email for your reset code</p>
                <div>
                    <input
                        type="text"
                        name="reset_code"
                        value={formData.reset_code}
                        onChange={handleChange}
                        required
                        placeholder="Enter your Reset Code"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={handleChange}
                        required
                        placeholder="Enter your new Password"
                    />
                </div>
                <button className="confirm" type="submit">Reset Password</button>
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

    );

}