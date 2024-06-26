<?php
session_start();
include_once('db.php');

// CORS Headers
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");


header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isset($data['lat']) && isset($data['username']) && isset($data['lng']) && 
        isset($data['title']) && isset($data['description']) && isset($data['date']) && 
        isset($data['isPublic']) && isset($_SESSION['user_id']) && isset($data['profile']) && 
        isset($data['city']) && isset($data['state'])
    ) {
        $latitude = $data['lat'];
        $longitude = $data['lng'];
        $title = $data['title'];
        $description = $data['description'];
        $date = $data['date'];
        $isPublic = $data['isPublic'];
        $username = $data['username'];
        $user_id = $_SESSION['user_id'];
        $profile = $data['profile'];
        $city = $data['city'];
        $state = $data['state'];
        $image_id = $data['image_id'];

        $stmt = $conn->prepare("INSERT INTO PinsInfo (username, lat, lng, title, description, date, isPublic, user_id, profile, city, state, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssiisssi", $username, $latitude, $longitude, $title, $description, $date, $isPublic, $user_id, $profile, $city, $state, $image_id);

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

$commentsQuery = $conn->prepare("SELECT c.pin_id, c.comment, c.user_id, u.username
                                  FROM comments c
                                  INNER JOIN users u ON c.user_id = u.id");
$commentsQuery->execute();
$commentsResult = $commentsQuery->get_result();

$comments = array();
while ($commentRow = $commentsResult->fetch_assoc()) {
    $pinId = $commentRow['pin_id'];
    $comment = $commentRow['comment'];
    $userId = $commentRow['user_id'];
    $username = $commentRow['username'];

    $comments[$pinId][] = array(
        "comment" => $comment,
        "user_id" => $userId,
        "username" => $username
    );
}
$commentsQuery->close();

$requestUserId = $_SESSION['user_id'] ?? null;

if ($requestUserId !== null) { 
    $userPinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, pin_id, city, state, image_id FROM PinsInfo WHERE user_id = ?");
    $userPinsQuery->bind_param("s", $requestUserId);
    $userPinsQuery->execute();
    $userPinsResult = $userPinsQuery->get_result();

    $userQuery = $conn->prepare("SELECT u.first_name, u.last_name, u.username, u.profile
                                 FROM users u
                                 WHERE u.id = ?");
    $userQuery->bind_param("s", $requestUserId);
    $userQuery->execute();
    $userResult = $userQuery->get_result();
    $userRow = $userResult->fetch_assoc();

    $userPinsWithComments = array();

    if ($userPinsResult->num_rows > 0) {
        while ($userPinRow = $userPinsResult->fetch_assoc()) {
            $pinId = $userPinRow['pin_id'];
            $commentsForPin = isset($comments[$pinId]) ? $comments[$pinId] : array();

            $likeQuery = $conn->prepare("SELECT * FROM likes WHERE pin_id = ?");
            $likeQuery->bind_param("i", $pinId);
            $likeQuery->execute();
            $likeResult = $likeQuery->get_result();
            $isLiked = false;

            while ($likeRow = $likeResult->fetch_assoc()) {
                if ($likeRow['user_id'] == $requestUserId) {
                    $isLiked = true; 
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
                "city" => $userPinRow['city'],
                "state" => $userPinRow['state'],
                "date" => $userPinRow['date'],
                "title" => $userPinRow['title'],
                "description" => $userPinRow['description'],
                "pin_id" => $userPinRow['pin_id'],
                "profile" => $userRow['profile'],
                "comments" => $commentsForPin,
                "isLiked" => $isLiked,
                "image_id" => $userPinRow['image_id']
            );

            $likeQuery->close();
        }
    }
    $userPinsQuery->close();
    $userQuery->close();

    echo json_encode(['success' => true, 'data' => $userPinsWithComments]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
}

$conn->close();
?>