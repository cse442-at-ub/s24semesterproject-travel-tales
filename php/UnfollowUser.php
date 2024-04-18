<?php
session_start();
require_once 'db.php';

// Default response headers
if($allowCORS) {
    header('Content-Type: application/json');
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
} else {
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
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Authentication required."]);
        exit();
    }

    // Get the friend's username from the request body
    $data = json_decode(file_get_contents("php://input"), true);
    $friendUsername = $data['friend_username'] ?? null;

    // Check if friend's username is provided
    if ($friendUsername === null) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Friend's username is missing."]);
        exit();
    }

    // Get the user ID of the logged-in user
    $userId = $_SESSION['user_id'];

    // Get the friend's user ID from the users table
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $friendUsername);
    $stmt->execute();
    $result = $stmt->get_result();
    $friend = $result->fetch_assoc();
    $stmt->close();

    // Check if the friend exists
    if (!$friend) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "Friend not found."]);
        exit();
    }

    $friendId = $friend['id'];

    // Delete the friendship entry from the friends_list table
    $stmt = $conn->prepare("DELETE FROM friends_list WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)");
    $stmt->bind_param("iiii", $userId, $friendId, $friendId, $userId);
    $stmt->execute();

    // Check if the friendship entry was deleted successfully
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Unfollowed friend successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to unfollow friend."]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
}
?>
