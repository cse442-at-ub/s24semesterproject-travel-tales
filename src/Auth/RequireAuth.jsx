import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getSession.php`, {
                credentials: 'include', // To send the cookie
            });
            const data = await response.json();
            setIsLoggedIn(data.isLoggedIn);
            setIsLoading(false);

            if (!data.isLoggedIn) {
                navigate('/login');
            }
        };

        checkLoginStatus();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    return isLoggedIn ? children : null; // Render children if logged in
};

export default RequireAuth;