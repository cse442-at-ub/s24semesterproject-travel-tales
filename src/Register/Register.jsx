import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import BannerImage from "../assets/Signup/Background.png"
import Compass from "../assets/Signup/Vector.png"
import Signup from "../assets/Signup/Sign_Up.png"

export const Register = (props) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
        confirmPass: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

        const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.pass !== formData.confirmPass) {
            setError('Passwords do not match.');
            formData.pass = '';
            formData.confirmPass = '';
            return;
        }
        setMessage('');
        try {
            const response = await fetch('https://localhost/api/addNewUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                // Redirect to login page
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    }

    // const onButtonClick = () => {
    //     setEmailError('')
    //     setPasswordError('')
    //     setFirstNameError('')
    //     setLastNameError('')

    //     if ('' === firstName && setFirstNameError !== '' ) {
    //         setFirstNameError('Please enter your first name')
       
    //     }
        
    //     if ('' === lastName) {
    //         setLastNameError('Please enter your last name')
            
    //     }

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
        <div className="Register">

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="Compass">
                    <img src={Compass} alt="compass" />
                </div>
                <div className="Signup">
                    <img src={Signup} alt="Signup" />
                </div>
                <label htmlFor="firstName"></label>
                <input
                    onChange={handleChange}
                    id="firstName"
                    type="firstName"
                    name="firstName"
                    placeholder="First Name"
                    required
                />
                {/* <label className="errorLabel">{firstNameError}</label> */}

                <label htmlFor="lastName"></label>
                <input
                    onChange={handleChange}
                    id="lastName"
                    type="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    required
                />
                {/* <label className="errorLabel">{lastNameError}</label> */}

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

                <label htmlFor="password"></label>
                <input
                    onChange={handleChange}
                    id="password"
                    type="password"
                    name="pass"
                    placeholder="Password"
                    required
                />
                {/* <label className="errorLabel">{passwordError}</label> */}

                <label htmlFor="confirmPassword"></label>
                <input
                    onChange={handleChange}
                    id="confirmPass"
                    type="password"
                    name="confirmPass"
                    placeholder="Confirm Password"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <button type="submit" className="create-new-acc">Create New Account</button>
                <Link className="link" to="/login" >Alread have an Account?</Link>
            </form>
            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
        
    );

}
