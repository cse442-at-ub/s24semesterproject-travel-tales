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

function sendErrorResponse($code, $message) {
    http_response_code($code);
    echo json_encode(['message' => $message]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$confirmEmail = $data['confirmEmail'];
$user_id = $data['user_id'];

if ($email !== $confirmEmail) {
    http_response_code(400);
    die(json_encode(['message' => 'Emails do not match.']));
}

if(isset($user_id) && isset($email)) {
    if($user_id != "" and $email != ""){
        // Check if user_id exists in the database
        $stmt_check = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt_check->bind_param("s", $user_id);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();

        if($result_check->num_rows > 0) {
            // Update the password for the user with the given user_id
            $stmt_update = $conn->prepare("UPDATE users SET email = ? WHERE id = ?");
            $stmt_update->bind_param("si", $email, $user_id);
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