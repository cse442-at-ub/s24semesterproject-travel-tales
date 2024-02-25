import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import BannerImage from "../assets/Signup/Background.png"
import Compass from "../assets/Signup/Vector.png"
import Signup from "../assets/Signup/Sign_Up.png"

export const Register = (props) => {
    // const [email, setEmail] = useState('');
    // const [pass, setPass] = useState('');
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');

    // const [emailError, setEmailError] = useState('');
    // const [passwordError, setPasswordError] = useState('');
    // const [firstNameError, setFirstNameError] = useState('');
    // const [lastNameError, setLastNameError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
        confirmPass: '',
    });

    const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value});
//   }

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
    setError('');
    try {
        const response = await fetch('http://localhost/api/addNewUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
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
                    value={formData.firstName}
                    onChange={handleChange}
                    type="firstName"
                    placeholder="First name"
                    id="firstName"
                    name="firstName"
                    required
                />
                {/* <label className="errorLabel">{firstNameError}</label> */}

                <label htmlFor="lastName"></label>
                <input
                    value={formData.lastName}
                    onChange={handleChange}
                    type="lastName"
                    placeholder="Last Name"
                    id="lastName"
                    name="lastName"
                    required
                />
                {/* <label className="errorLabel">{lastNameError}</label> */}

                <label htmlFor="email"></label>
                <input
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    id="email"
                    name="email"
                    required
                />
                {/* <label className="errorLabel">{emailError}</label> */}

                <label htmlFor="password"></label>
                <input
                    value={formData.pass}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="password"
                    required
                />
                {/* <label className="errorLabel">{passwordError}</label> */}

                <label htmlFor="confirmPassword"></label>
                <input
                    value={formData.confirmPass}
                    type="password"
                    name="confirmPass"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" className="create-new-acc">Create New Account</button>
                <Link className="link" to="/login" >Alread have an Account?</Link>
            </form>
            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
        
    );

}