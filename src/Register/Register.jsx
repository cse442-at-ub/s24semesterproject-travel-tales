import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstName"></label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" placeholder="First name" id="firstName" name="firstName" />

                <label htmlFor="lastName"></label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" placeholder="Last Name" id="lastName" name="lastName" />

                <label htmlFor="email"></label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />

                <label htmlFor="password"></label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />

                <button className="create-new-acc">Create New Account</button>

            </form>
            <Link className="link" to="/Login" >Alread have an Account?</Link>
        </div>
    
    )

}