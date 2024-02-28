import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../assets/Login/Background.png"

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost/api/resetPassword.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setMessage(data.message);
    };


    return (
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
                <p>{message}</p>
            </form>

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>

    )

}