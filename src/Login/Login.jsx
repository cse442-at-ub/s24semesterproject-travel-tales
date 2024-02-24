import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import BannerImage from "../Assets/Login/Background.png"
import Travel_Tales from "../Assets/Login/Title Section.png"


export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
    const onButtonClick = () => {
        setEmailError('')
        setPasswordError('')

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            
        }

        if ('' === pass) {
            setPasswordError('Please enter a password')
            
        }
        return
    }


    return (
       
        <div className='Login'>
            <div>
                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="Travel_Tales">
                        <img src={Travel_Tales} alt="Travel_Tales" />
                    </div>

                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                    <label className="errorLabel">{emailError}</label>
                <label htmlFor="password"></label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                    <label className="errorLabel">{passwordError}</label>
                    <button className="login-button" onClick={onButtonClick}>Log In</button>
                <Link className="link" to="/ForgotPassword" >Forgot Password?</Link>
                <Link className="link" to="/Register" >Create an account</Link>

                </form>
            </div>
            <div className="bannerimage">
                <img src={ BannerImage } alt = "banner" />
            </div>


        </div>
    )

}