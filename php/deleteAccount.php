<?php

session_start();

require 'db.php';

// Default response headers
header('Content-Type: application/json');

if ($allowCORS) {
    // Respond to preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        }
        header('Access-Control-Allow-Credentials: true');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header('Access-Control-Max-Age: 86400'); // cache for 1 day
        exit(0);
    } else if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
    }
} else {
    if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
        header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'] ?? null;

    if ($userId != null) {
        $stmtPins = $conn->prepare("DELETE FROM PinsInfo WHERE user_id = ?");
        $stmtPins->bind_param("i", $userId);
        $stmtPinsExecuted = $stmtPins->execute();

        $stmtUser = $conn->prepare("DELETE FROM users WHERE id = ?"); // delete users pins
        $stmtUser->bind_param("i", $userId);
        $stmtUserExecuted = $stmtUser->execute();

        if ($stmtPinsExecuted && $stmtUserExecuted) {
            // Successfully deleted the user and their pins
            session_unset();
            session_destroy();
            echo json_encode(["success" => true, "message" => "Account and related data deleted successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Deletion failed."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Authentication required."]);
    }
} else {
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
}