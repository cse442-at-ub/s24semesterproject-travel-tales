import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">

        <h1>Enter the email associated with your account and we will send you a code to reset your password</h1>

            <form className="register-form" onSubmit={handleSubmit}>
               
                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />

                <button className="create-new-acc">Continue</button>

            </form>
            <Link className="link" to="/Login" >Go Back?</Link>
        </div>

    )

}