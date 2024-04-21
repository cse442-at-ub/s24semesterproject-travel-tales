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
header('Access-Control-Allow-Origin: http://localhost:3000');
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($_SESSION['user_id']) && isset($postData['to'])) {
        $toUser = $postData['to'];

        // Query to get user IDs based on usernames
        $toQuery = "SELECT id FROM users WHERE username = '$toUser'";

        $toResult = $conn->query($toQuery);

        // Check if the "to" user exists
        if ($toResult && $toResult->num_rows > 0) {
            $toRow = $toResult->fetch_assoc();
            $toID = $toRow['id'];
            $fromID = $_SESSION['user_id'];

            // Check if they are already friends
            $friendshipQuery = "SELECT * FROM friends_list WHERE (user_id1 = '$fromID' AND user_id2 = '$toID') OR (user_id1 = '$toID' AND user_id2 = '$fromID')";
            $friendshipResult = $conn->query($friendshipQuery);

            if ($friendshipResult && $friendshipResult->num_rows > 0) {
                $response = array("success" => false, "message" => "You are already Friends!");
                echo json_encode($response);
            } else {
                // Insert IDs into friends_list table
                $sql = "INSERT INTO friends_list (user_id1, user_id2) VALUES ('$fromID', '$toID')";

                if ($conn->query($sql) === TRUE) {
                    $response = array("success" => true, "message" => "Friend added successfully");
                    echo json_encode($response);
                } else {
                    $response = array("success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error);
                    echo json_encode($response);
                }
            }
        } else {
            $response = array("success" => false, "message" => "To user not found in users database");
            echo json_encode($response);
        }
    } else {
        $response = array("success" => false, "message" => "User session ID or to username not provided");
        echo json_encode($response);
    }
}

$conn->close();

