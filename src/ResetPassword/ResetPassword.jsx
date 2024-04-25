import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import BannerImage from "../assets/Login/Background.png"
import { useNavigate } from 'react-router-dom';

export const ResetPassword = (props) => {
    const navigate = useNavigate();
    // const [email, setEmail] = useState('');    
    // const [resetCode, setResetCode] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        reset_code: '',
        pass: '',
    });

    const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value});
//   }

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
                setError(result.error || 'Password reset successfully!');
            } else {
                setError(result.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setError('Failed to connect to the server. Please try again later.');
        }
    };


    return (
        <div className="Forgot-Password">
            

            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className="text">Reset Password</h1>
                <div>
                    <label>Reset Code:</label>
                    <input
                        type="text"
                        name="reset_code"
                        value={formData.reset_code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="confirm" type="submit">Reset Password</button>
                {error && <p className="errorLabel">{error}</p>}
                <Link className="link" to="/login" >Go Back?</Link>
            </form>
            
            {/* <form className="email-form" onSubmit={handleSubmit}>
                <h1 className ="text">Reset Password</h1>
                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                <label className="errorLabel">{emailError}</label>
                <button className="confirm" onClick={onButtonClick}>Continue</button>

                <Link className="link" to="/login" >Go Back?</Link>
            </form> */}
      

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>

    );

}