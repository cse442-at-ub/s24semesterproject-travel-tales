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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isset($data['lat']) && isset($data['username']) && isset($data['lng']) && 
        isset($data['title']) && isset($data['description']) && isset($data['date']) && 
        isset($data['isPublic']) && isset($_SESSION['user_id'])
    ) {
        $latitude = $data['lat'];
        $longitude = $data['lng'];
        $title = $data['title'];
        $description = $data['description'];
        $date = $data['date'];
        $isPublic = $data['isPublic'];
        $username = $data['username'];
        $user_id = $_SESSION['user_id'];
        


        $stmt = $conn->prepare("INSERT INTO PinsInfo (username, lat, lng, title, description, date, isPublic, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssiis", $username, $latitude, $longitude, $title, $description, $date, $isPublic, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Pin Info successfully added to the database']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error inserting coordinates: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
    }
}

// Fetching comments from the comments database
$commentsQuery = $conn->prepare("SELECT pin_id, comment, user_id FROM comments");

$commentsQuery->execute();
$commentsResult = $commentsQuery->get_result();

// Store comments in an associative array with pin_id as key
$comments = array();
while ($commentRow = $commentsResult->fetch_assoc()) {
    $pinId = $commentRow['pin_id'];
    $comment = $commentRow['comment'];
    $user = $commentRow['user_id'];
    $sql = "SELECT username FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt ->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $username = $row['username'];
    $comments[$pinId][] = array(
        "comment" => $comment,
        "user_id" => $user,
        "username" => $username
    );

}
$commentsQuery->close();

// Fetching user's email from the session
$requestUserId = $_SESSION['user_id'] ?? null;

// Check if the user_id is provided in the session
if ($requestUserId) {
    // Fetch the user's pins
    $userPinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, pin_id FROM PinsInfo WHERE user_id = ?");
    $userPinsQuery->bind_param("s", $requestUserId);
    $userPinsQuery->execute();
    $userPinsResult = $userPinsQuery->get_result();

    // Fetch user's first and last name
    $userQuery = $conn->prepare("SELECT first_name, last_name, username, profile FROM users WHERE id = ?");
    $userQuery->bind_param("s", $requestUserId);
    $userQuery->execute();
    $userResult = $userQuery->get_result();
    $userRow = $userResult->fetch_assoc();

    // Array to store user's pins with comments
    $userPinsWithComments = array();

    // Check if there are any user's pins
    if ($userPinsResult->num_rows > 0) {
        while ($userPinRow = $userPinsResult->fetch_assoc()) {
            $pinId = $userPinRow['pin_id'];
            $commentsForPin = isset($comments[$pinId]) ? $comments[$pinId] : array();

            // Check if the pin is liked by the user
            $likeQuery = $conn->prepare("SELECT * FROM likes WHERE pin_id = ?");
            $likeQuery->bind_param("i", $pinId);
            $likeQuery->execute();
            $likeResult = $likeQuery->get_result();
            $isLiked = false;

            // Initially set to false
            while ($likeRow = $likeResult->fetch_assoc()) {
                if ($likeRow['user_id'] == $requestUserId) {
                    $isLiked = true; // Set to true if user liked the pin
                    break;
                }
            }

            $userPinsWithComments[] = array(
                "first_name" => $userRow['first_name'],
                "last_name" => $userRow['last_name'],
                "username" => $userRow['username'],
                "user_id" => $requestUserId,
                "lat" => $userPinRow['lat'],
                "lng" => $userPinRow['lng'],
                "date" => $userPinRow['date'],
                "title" => $userPinRow['title'],
                "description" => $userPinRow['description'],
                "pin_id" => $userPinRow['pin_id'],
                "profile" => $userRow['profile'],
                "comments" => $commentsForPin,
                "isLiked" => $isLiked // Adding isLiked flag
            );

            $likeQuery->close();
        }
    }
    $userPinsQuery->close();
    $userQuery->close();

    // Return matched data as JSON
    echo json_encode(['success' => true, 'data' => $userPinsWithComments]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
}

// Close the database connection
$conn->close();

