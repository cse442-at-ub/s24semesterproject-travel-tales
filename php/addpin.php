<?php
include_once('db.php');

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
    header('Access-Control-Allow-Credentials: true');
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

// Database Connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Content-Type Header
header("Content-Type: application/json");

// Handling POST Requests
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Inserting Pin Information
    if (
        isset($data['email']) && isset($data['lat']) && isset($data['lng']) && 
        isset($data['title']) && isset($data['description']) && isset($data['date']) && 
        isset($data['isPublic'])
    ) {
        $email = $data['email'];
        $latitude = $data['lat'];
        $longitude = $data['lng'];
        $title = $data['title'];
        $description = $data['description'];
        $date = $data['date'];
        $isPublic = $data['isPublic'];

        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt ->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $user_id = $row['id'];

        $stmt = $conn->prepare("INSERT INTO PinsInfo (user_id, lat, lng, title, description, date, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssi", $user_id, $latitude, $longitude, $title, $description, $date, $isPublic);

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
    $comments[$pinId][] = array(
        "comment" => $comment,
        "user_id" => $user
    );

}
$commentsQuery->close();

// Fetching user's email from the frontend
$requestEmail = $_GET['email'] ?? null;

        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt ->bind_param("s", $requestEmail);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $requestId = $row['id'];


// Check if the email is provided
if ($requestEmail) {
    // Fetch the user's pins
    $userPinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, pin_id FROM PinsInfo WHERE user_id = ?");
    $userPinsQuery->bind_param("s", $requestId);
    $userPinsQuery->execute();
    $userPinsResult = $userPinsQuery->get_result();

    $userQuery = $conn->prepare("SELECT first_name, last_name, profile, username FROM users WHERE id = ?");
    $userQuery->bind_param("s", $requestId);
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
                if ($likeRow['user_id'] == $requestId) {
                    $isLiked = true; // Set to true if user liked the pin
                    break;
                }
            }

            $userPinsWithComments[] = array(
                "first_name" => $userRow['first_name'],
                "last_name" => $userRow['last_name'],
                "username" => $userRow['username'],
                "email" => $requestEmail,
                "lat" => $userPinRow['lat'],
                "lng" => $userPinRow['lng'],
                "date" => $userPinRow['date'],
                "title" => $userPinRow['title'],
                "description" => $userPinRow['description'],
                "pin_id" => $userPinRow['pin_id'],
                "comments" => $commentsForPin,
                "isLiked" => $isLiked, // Adding isLiked flag
                "profile" => $userRow['profile']
            );

            $likeQuery->close();
        }
    }
    $userPinsQuery->close();
    $userQuery->close();


    $friendsQuery = $conn->prepare("SELECT user_id2 FROM friends_list WHERE user_id1 = ?");
    $friendsQuery->bind_param("s", $requestId);
    $friendsQuery->execute();
    $friendsResult = $friendsQuery->get_result();

    // Array to store friends' pins
    $friendsPins = array();

// Check if there are any friends
if ($friendsResult->num_rows > 0) {
    while ($friendRow = $friendsResult->fetch_assoc()) {
        $friendId = $friendRow['user_id2'];

        // Fetch the friend's pins
        $pinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, isPublic, pin_id FROM PinsInfo WHERE user_id = ?");
        $pinsQuery->bind_param("s", $friendId);
        $pinsQuery->execute();
        $pinsResult = $pinsQuery->get_result();

        // Check if there are any pins
        if ($pinsResult->num_rows > 0) {
            while ($pinRow = $pinsResult->fetch_assoc()) {
                $pinId = $pinRow['pin_id'];
                $commentsForPin = isset($comments[$pinId]) ? $comments[$pinId] : array();

                // Check if the pin is liked by the user
                $likeQuery = $conn->prepare("SELECT * FROM likes WHERE pin_id = ? AND user_id = ?");
                $likeQuery->bind_param("is", $pinId, $requestId);
                $likeQuery->execute();
                $likeResult = $likeQuery->get_result();

                $isLiked = false; // Initially set to false
                while ($likeRow = $likeResult->fetch_assoc()) {
                    if ($likeRow['user_id'] == $requestId) {
                        $isLiked = true; // Set to true if user liked the pin
                        break; // No need to continue checking once found
                    }
                }

                // Fetch friend's first and last name
                $friendUserQuery = $conn->prepare("SELECT first_name, last_name, profile, email, username FROM users WHERE id = ?");
                $friendUserQuery->bind_param("s", $friendId);
                $friendUserQuery->execute();
                $friendUserResult = $friendUserQuery->get_result();
                $friendUserRow = $friendUserResult->fetch_assoc();

                // Check if the pin is public and add to the list if it is
                if ($pinRow['isPublic'] == 1) {
                    $friendsPins[] = array(
                        "first_name" => $friendUserRow['first_name'],
                        "last_name" => $friendUserRow['last_name'],
                        "username" => $friendUserRow['username'],
                        "email" => $friendUserRow['email'],
                        "lat" => $pinRow['lat'],
                        "lng" => $pinRow['lng'],
                        "date" => $pinRow['date'],
                        "title" => $pinRow['title'],
                        "description" => $pinRow['description'],
                        "pin_id" => $pinRow['pin_id'],
                        "comments" => $commentsForPin,
                        "isLiked" => $isLiked, // Adding isLiked flag
                        "profile" => $friendUserRow['profile']
                    );
                }
            }
            $likeQuery->close(); // Close likeQuery after the loop
        }
        $pinsQuery->close(); // Close pinsQuery after the loop
        $friendUserQuery->close(); // Close friendUserQuery after the loop
    }
}

    $combinedPins = array_merge($userPinsWithComments, $friendsPins);
        // Return matched data as JSON
    echo json_encode(['success' => true, 'data' => $combinedPins]);

} else {
    echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
}

// Close the database connection
$conn->close();
?>
