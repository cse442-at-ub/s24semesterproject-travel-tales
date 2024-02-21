import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";



export const Login = (props) => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name);
    }

    return (
        <div className="auth-form-container">
            <form className="login-form" onSubmit={handleSubmit}>

            <label htmlFor="name"></label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Username" id="name" name="name" />

            <label htmlFor="password"></label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />

            <button className="login-button">Log In</button>

            </form>
            <Link className="link" to="/ForgotPassword" >Forgot Password?</Link>
            <Link className="link" to="/Register" >Create an account</Link>
        </div>


    )

}