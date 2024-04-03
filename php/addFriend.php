<?php
session_start();
include_once('db.php');

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}
header('Access-Control-Allow-Origin: http://localhost:3000');
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

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

// Fetch the logged-in user's username from the database
$user_id = $_SESSION['user_id'];
$loggedInUserQuery = "SELECT username FROM users WHERE id = $user_id";
$loggedInUserResult = $conn->query($loggedInUserQuery);

if ($loggedInUserResult->num_rows == 1) {
    $loggedInUser = $loggedInUserResult->fetch_assoc()['username'];

    // Fetch usernames from the database excluding the username of the logged-in user
    $usersQuery = "SELECT username FROM users WHERE username != '$loggedInUser'";
    $result = $conn->query($usersQuery);

    if ($result->num_rows > 0) {
        $usernames = [];
        while ($row = $result->fetch_assoc()) {
            $usernames[] = $row['username'];
        }
        echo json_encode(["success" => true, "usernames" => $usernames]);
    } else {
        echo json_encode(["success" => false, "message" => "No users found in the database"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Failed to fetch logged-in user's username"]);
}

$conn->close();

