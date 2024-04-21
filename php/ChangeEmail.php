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

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

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

if(isset($data['confirmEmail']) && isset($data['email']) && isset($_SESSION['user_id'])) {
    $email = $data['email'];
    $confirmEmail = $data['confirmEmail'];

    if ($email !== $confirmEmail) {
        http_response_code(400);
        die(json_encode(['message' => 'Emails do not match.']));
    }
    $user_id = $_SESSION['user_id'];
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
                echo json_encode(['message' => 'Email updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to update Email']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Please provide email']);
}

$conn->close();