import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../Assets/Login/Background.png"

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');



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
    }




    return (
        <div className="Forgot-Password">
            
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className ="text">Enter the email associated with your account and we will send you a code to reset your password</h1>
                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                <label className="errorLabel">{emailError}</label>
                <button className="confirm" onClick={onButtonClick}>Continue</button>

                <Link className="link" to="/Login" >Go Back?</Link>
            </form>
      

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>

    )

}