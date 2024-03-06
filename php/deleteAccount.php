<?php

session_start();

require 'db.php';

// Check if the request is POST for security
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user ID from the session or request (adjust as necessary)
    // This is a placeholder - implement your authentication mechanism
    $userId = $_SESSION['user_id'] ?? null;

    if ($userId != null) {
        // Prepare the SQL statement to avoid SQL injection
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);

        if ($stmt->execute()) {
            // Successfully deleted the user
            echo json_encode(["success" => true, "message" => "Account deleted successfully."]);
        } else {
            // Handle error, e.g., user not found or DB error
            echo json_encode(["success" => false, "message" => "Account deletion failed."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Authentication required."]);
    }
} else {
    // Invalid request method
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
}
