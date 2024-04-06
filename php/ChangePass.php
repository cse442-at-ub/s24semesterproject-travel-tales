<?php
session_start();
include_once('db.php');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Redirect to HTTPS if not already
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// CORS Headers
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// CORS Preflight Handling
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$pass = $data['pass'];
$confirmPass = $data['confirmPass'];
$user_id = $_SESSION['user_id'];

if ($pass !== $confirmPass) {
    http_response_code(400);
    die(json_encode(['message' => 'Passwords do not match.']));
}

// check if password is at least 8 characters
if (strlen($pass) < 8) {
    http_response_code(400);
    die(json_encode(['message' => 'Password must be at least 8 characters long']));
}

// check if password contains at least one uppercase letter
$noUppercase = !preg_match('/[A-Z]/', $pass);
if ($noUppercase) {
    http_response_code(400);
    die(json_encode(['message' => 'Password requires at least 1 uppercase letter.']));
}

// check if password contains at least one lowercase letter
$noLowercase = !preg_match('/[a-z]/', $pass);
if ($noLowercase) {
    http_response_code(400);
    die(json_encode(['message' => 'Password requires at least 1 lowercase character.']));
}

// check to make sure there is at least one special character
$pattern = '/[^a-zA-Z0-9]/';
if (!preg_match($pattern, $pass)) {
    http_response_code(400);
    die(json_encode(['message' => 'Password requires at least 1 special character.']));
}

// check if the password contains a number
$pattern = '/\d/';
if (!preg_match($pattern, $pass)) {
    http_response_code(400);
    die(json_encode(['message' => 'Password requires at least one number.']));
}

$pass = password_hash($pass, PASSWORD_DEFAULT);

if(isset($user_id) && isset($pass)) {
    if($user_id != "" and $pass != "") { // <-- Remove the extra 's' here
        // Check if user_id exists in the database
        $stmt_check = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt_check->bind_param("s", $user_id);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();

        if($result_check->num_rows > 0) {
            // Update the password for the user with the given user_id
            $stmt_update = $conn->prepare("UPDATE users SET pass = ? WHERE id = ?");
            $stmt_update->bind_param("si", $pass, $user_id);
            if($stmt_update->execute()) {
                http_response_code(200);
                echo json_encode(['message' => 'Password updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to update password']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Please provide user_id and password']);
}


$conn->close();