<?php
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

$data = json_decode(file_get_contents("php://input"), true);
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['email'];
$username = $data['username'];
$pass = $data['pass'];
$confirmPass = $data['confirmPass'];

// Check if a email already exists
$check_if_exists = "SELECT email FROM users WHERE email = ?";
$stmt = $conn->prepare($check_if_exists);

$stmt->bind_param("s", $email);
$stmt->execute();

$user_exists = $stmt->get_result();
if ($user_exists->num_rows > 0) { // Email is already in the DB
    http_response_code(400);
    die(json_encode(['message' => 'An account with this email already exists.']));
}

// Check if a username already exists
$check_username = "SELECT username FROM users WHERE username = ?";
$stmt = $conn->prepare($check_username);

$stmt->bind_param("s", $username);
$stmt->execute();

$user_exists = $stmt->get_result();
if ($user_exists->num_rows > 0) { // Username is already in the DB
    http_response_code(400);
    die(json_encode(['message' => 'An account with this username already exists.']));
} 

// check if passwords match
if ($pass !== $confirmPass) {
    http_response_code(400);
    die(json_encode(['message' => 'Passwords do not match.']));
}

// check if password is at least 8 characters
if (strlen($pass) < 8) {
    http_response_code(400);
    die(json_encode(['message' => 'Password must be at least 8 characters long.']));
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

// hash and salt password
$pass = password_hash($pass, PASSWORD_DEFAULT);

if(isset($email) && isset($pass)) {
    if($email != "" and $pass != ""){
        $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, username, pass) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $username, $pass);
        
        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['message' => 'Record inserted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to insert record']);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Please provide username and email']);
}

$conn->close();