import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import BannerImage from "../assets/Login/Background.png"
import Travel_Tales from "../assets/Login/Title Section.png"


export const Login = (props) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        pass: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.code === 200) {
                // Redirect user to homepage
                navigate('/'); // Redirect to homepage route
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.'); 
        }
    };

    // const [email, setEmail] = useState('');
    // const [pass, setPass] = useState('');
    // const [emailError, setEmailError] = useState('')
    // const [passwordError, setPasswordError] = useState('')

    // old submit handler
    // const onButtonClick = () => {
    //     setEmailError('')
    //     setPasswordError('')

    //     // Check if the user has entered both fields correctly
    //     if ('' === email) {
    //         setEmailError('Please enter your email')
            
    //     }

    //     if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //         setEmailError('Please enter a valid email')
            
    //     }

    //     if ('' === pass) {
    //         setPasswordError('Please enter a password')
            
    //     }
    //     return
    // }

    return (
        <div className='Login'>
            <div>
                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="Travel_Tales">
                        <img src={Travel_Tales} alt="Travel_Tales" />
                    </div>

                    <label htmlFor="email"></label>
                    <input
                        onChange={handleChange}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                    {/* <label className="errorLabel">{emailError}</label> */}
                    <label htmlFor="pass"></label>
                    <input 
                        onChange={handleChange}
                        id="password"
                        type="password"
                        name="pass"
                        placeholder="Password"
                        required
                    />
                    {/* <label className="errorLabel">{passwordError}</label> */}
                    <button type="submit" className="login-button">Log In</button>
                    <Link className="link" to="/Forgotpassword" >Forgot Password?</Link>
                    <Link className="link" to="/signUp" >Create an account</Link>

                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div className="bannerimage">
                <img src={ BannerImage } alt = "banner" />
            </div>
        </div>
    );
}