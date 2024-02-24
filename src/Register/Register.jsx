import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import BannerImage from "../Assets/Signup/Background.png"
import Compass from "../Assets/Signup/Vector.png"
import Signup from "../Assets/Signup/Sign_Up.png"

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const onButtonClick = () => {
        setEmailError('')
        setPasswordError('')
        setFirstNameError('')
        setLastNameError('')

        if ('' === firstName && setFirstNameError !== '' ) {
            setFirstNameError('Please enter your first name')
       
        }
        
        if ('' === lastName) {
            setLastNameError('Please enter your last name')
            
        }

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
        <div className="Register">

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="Compass">
                    <img src={Compass} alt="compass" />
                </div>
                <div className="Signup">
                    <img src={Signup} alt="Signup" />
                </div>
                <label htmlFor="firstName"></label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" placeholder="First name" id="firstName" name="firstName" />
                <label className="errorLabel">{firstNameError}</label>

                <label htmlFor="lastName"></label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" placeholder="Last Name" id="lastName" name="lastName" />
                <label className="errorLabel">{lastNameError}</label>

                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                <label className="errorLabel">{emailError}</label>

                <label htmlFor="password"></label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                <label className="errorLabel">{passwordError}</label>

                <button className="create-new-acc" onClick={onButtonClick}>Create New Account</button>
                <Link className="link" to="/Login" >Alread have an Account?</Link>
            </form>
            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
        
    )

}