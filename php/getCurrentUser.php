<?php
include_once('db.php');

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
header('Access-Control-Allow-Origin: http://localhost:3000');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Assuming you are passing email as a GET parameter
$email = $_GET['email']; // Make sure to sanitize input to prevent SQL injection

// Query to fetch user information based on email
$sql = "SELECT id, first_name, last_name, email, username FROM users WHERE email = '$email'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Fetch user data
    $row = $result->fetch_assoc();
    $userData = array(
        "id" => $row["id"],
        "first_name" => $row["first_name"],
        "last_name" => $row["last_name"],
        "email" => $row["email"],
        "username" => $row["username"]
    );

    // Return user data as JSON response
    echo json_encode($userData);
} else {
    // If user with the provided email is not found, return an empty response or an error message
    echo json_encode(array("error" => "User not found"));
}

// Close the connection
$conn->close();
?>
