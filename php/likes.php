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


// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Decode the JSON data received from the frontend
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if 'pin_id', 'value', and 'email' are set in the received data
    if (isset($data['pin_id']) && isset($data['value']) && isset($_SESSION['user_id'])) {
        $pinId = $data['pin_id'];
        $value = $data['value'];
        $user_id = $_SESSION['user_id'];

        if ($value == -1) {
            // Delete user from the likes database
            $deleteLikeQuery = $conn->prepare("DELETE FROM likes WHERE pin_id = ? AND user_id = ?");
            $deleteLikeQuery->bind_param("is", $pinId, $user_id);
            $deleteLikeQuery->execute();
            $deleteLikeQuery->close();
        } else {
            // Insert or update the like in the Likes table
            $insertLikeQuery = $conn->prepare("REPLACE INTO likes (pin_id, user_id) VALUES (?, ?)");
            $insertLikeQuery->bind_param("is", $pinId, $user_id);
            $insertLikeQuery->execute();
            $insertLikeQuery->close();
        }

        // Update the number of likes in the PinsInfo table
        $updateLikesQuery = $conn->prepare("UPDATE PinsInfo SET likes = likes + ? WHERE pin_id = ?");
        $updateLikesQuery->bind_param("ii", $value, $pinId);
        $updateLikesQuery->execute();

        if ($updateLikesQuery->affected_rows > 0) {
            // Likes updated successfully, send success response
            echo json_encode(['success' => true, 'message' => 'Likes updated successfully']);
        } else {
            // No rows affected, pin_id not found or value not changed, send error response
            echo json_encode(['success' => false, 'error' => 'Failed to update likes']);
        }

        // Close prepared statement and database connection
        $updateLikesQuery->close();
        $conn->close();
    } else {
        // Required parameters missing, send error response
        echo json_encode(['success' => false, 'error' => 'Pin ID or value is missing']);
    }
} else {
    // Invalid request method, send error response
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?>
