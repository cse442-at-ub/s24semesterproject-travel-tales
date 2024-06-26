import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import BannerImage from "../assets/Signup/Background.png"
import Compass from "../assets/Signup/Vector.png"
import Signup from "../assets/Signup/Sign_Up.png"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const Register = (props) => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        pass: '',
        confirmPass: '',
    });

    const [error, setError] = useState('');

        const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.pass !== formData.confirmPass) {
            setError('Passwords do not match.');
            setOpenSnackbar(true);
            formData.pass = '';
            formData.confirmPass = '';
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addNewUser.php`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                // Redirect to login page
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            setOpenSnackbar(true);
        }
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

                <label htmlFor="username"></label>
                <input
                    onChange={handleChange}
                    id="username"
                    type="username"
                    name="username"
                    placeholder="Username"
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
                <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>

                <button type="submit" className="create-new-acc">Create New Account</button>
                <Link className="link" to="/login" >Already have an Account?</Link>
            </form>
            <div className="bannerimage">
                <img src={BannerImage} alt="banner" />
            </div>
        </div>
        
    );

}
