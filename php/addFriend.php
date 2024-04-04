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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($postData['from']) && isset($postData['to'])) {
        $fromEmail = $postData['from'];
        $toEmail = $postData['to'];

        // Query to get user IDs based on emails
        $fromQuery = "SELECT id FROM users WHERE email = '$fromEmail'";
        $toQuery = "SELECT id FROM users WHERE email = '$toEmail'";

        $fromResult = $conn->query($fromQuery);
        $toResult = $conn->query($toQuery);

        if ($fromResult->num_rows > 0 && $toResult->num_rows > 0) {
            $fromRow = $fromResult->fetch_assoc();
            $toRow = $toResult->fetch_assoc();
            $fromID = $fromRow['id'];
            $toID = $toRow['id'];

            // Check if they are already friends
            $friendshipQuery = "SELECT * FROM friends_list WHERE (user_id1 = '$fromID' AND user_id2 = '$toID') OR (user_id1 = '$toID' AND user_id2 = '$fromID')";
            $friendshipResult = $conn->query($friendshipQuery);

            if ($friendshipResult->num_rows > 0) {
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
            $response = array("success" => false, "message" => "One or both emails not found in users database");
            echo json_encode($response);
        }
    } else {
        $response = array("success" => false, "message" => "From email or to email not provided");
        echo json_encode($response);
    }
}

$conn->close();
?>
