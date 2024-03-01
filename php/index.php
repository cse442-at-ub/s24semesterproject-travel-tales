<?php
session_start();

if (isset($_SESSION['user_id'])) {
    echo "Welcome, " . $_SESSION['username'];
    // Show content for logged-in users
} else {
    // Redirect to the login page
    header("Location: login.php");
    exit;
}
// header('Access-Control-Allow-Origin: http://localhost:3000');
// header('Access-Control-Allow-Methods: GET');
// header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
echo "Hello from PHP!";
