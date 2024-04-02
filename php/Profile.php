<?php
include_once('db.php');

// Check for HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");

if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Set allowed request methods and headers
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If it's a GET request, fetch data based on email

    // Assuming you've sanitized the email input from frontend
    $email = $_GET['email'];

    // Query to fetch data based on email
    $sql = "SELECT profile FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        // If a row is found with the given email, fetch the profile data
        $row = mysqli_fetch_assoc($result);
        $profile_data = $row['profile'];

        // Send the profile data to the frontend in JSON format
        echo json_encode(array("profile" => $profile_data));
    } else {
        // If no matching email found, return an error message or handle it accordingly
        echo json_encode(array("error" => "No profile found for the given email"));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if all required fields are present
    if (isset($data['email']) && isset($data['profile'])) {
        // Sanitize input data
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $profile = filter_var($data['profile'], FILTER_SANITIZE_STRING);
        
        // Update user profile
        $sql = "UPDATE users SET profile = '$profile' WHERE email = '$email'";
        if (mysqli_query($conn, $sql)) {
            // If profile update is successful, send success response
            echo json_encode(array("success" => true));
        } else {
            // If profile update fails, send error response
            echo json_encode(array("success" => false, "message" => "Failed to update profile."));
        }
    } else {
        // Send error response if required fields are missing
        echo json_encode(array("success" => false, "message" => "Missing email or profile data."));
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method Not Allowed"));
}
?>
