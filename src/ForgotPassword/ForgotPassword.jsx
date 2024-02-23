import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import BannerImage from "../Assets/Login/Background.png"

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="Forgot-Password">
            
            <form className="email-form" onSubmit={handleSubmit}>
                <h1 className ="text">Enter the email associated with your account and we will send you a code to reset your password</h1>
                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />

                <button className="confirm">Continue</button>
                <Link className="link" to="/Login" >Go Back?</Link>
            </form>
      

            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>

    )

}