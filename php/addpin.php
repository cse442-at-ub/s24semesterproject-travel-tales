<?php
include_once('db.php');

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
header('Access-Control-Allow-Origin: http://localhost:3000');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

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

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['email']) && isset($data['lat']) && isset($data['lng']) && isset($data['title']) && isset($data['description']) && isset($data['date']) && isset($data['isPublic'])) {
        $email = $data['email'];
        $latitude = $data['lat'];
        $longitude = $data['lng'];
        $title = $data['title'];
        $description = $data['description'];
        $date = $data['date'];
        $isPublic = $data['isPublic'];

        $stmt = $conn->prepare("INSERT INTO PinsInfo (email, lat, lng, title, description, date, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssi", $email, $latitude, $longitude, $title, $description, $date, $isPublic);

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

// Fetch comments from the comments database
$commentsQuery = $conn->prepare("SELECT pin_id, comment FROM Comments");
$commentsQuery->execute();
$commentsResult = $commentsQuery->get_result();

// Store comments in an associative array with pin_id as key
$comments = array();
while ($commentRow = $commentsResult->fetch_assoc()) {
    $pinId = $commentRow['pin_id'];
    $comment = $commentRow['comment'];
    $comments[$pinId][] = $comment;
}

$commentsQuery->close();

// Assuming you receive the email from the frontend
$requestEmail = $_GET['email'] ?? null;

// Check if the email is provided
if ($requestEmail) {
    // Fetch the user's pins
    $userPinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, pin_id FROM PinsInfo WHERE email = ?");
    $userPinsQuery->bind_param("s", $requestEmail);
    $userPinsQuery->execute();
    $userPinsResult = $userPinsQuery->get_result();

    // Fetch user's first and last name
    $userQuery = $conn->prepare("SELECT first_name, last_name FROM users WHERE email = ?");
    $userQuery->bind_param("s", $requestEmail);
    $userQuery->execute();
    $userResult = $userQuery->get_result();
    $userRow = $userResult->fetch_assoc();

}
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
                 
                if ($likeRow['user'] == $requestEmail) {
                    $isLiked = true; // Set to true if user liked the pin
                    break;
                }
            }

            $userPins[] = array(
                "first_name" => $userRow['first_name'],
                "last_name" => $userRow['last_name'],
                "email" => $requestEmail,
                "lat" => $userPinRow['lat'],
                "lng" => $userPinRow['lng'],
                "date" => $userPinRow['date'],
                "title" => $userPinRow['title'],
                "description" => $userPinRow['description'],
                "pin_id" => $userPinRow['pin_id'],
                "comments" => $commentsForPin,
                "isLiked" => $isLiked // Adding isLiked flag
            );

            $likeQuery->close();
        }
    }

    // Fetch the user's friends from the friends_list table
    $friendsQuery = $conn->prepare("SELECT friends_with FROM friends_list WHERE user = ?");
    $friendsQuery->bind_param("s", $requestEmail);
    $friendsQuery->execute();
    $friendsResult = $friendsQuery->get_result();

    // Array to store friends' pins
    $friendsPins = array();

    // Check if there are any friends
    if ($friendsResult->num_rows > 0) {
        while ($friendRow = $friendsResult->fetch_assoc()) {
            $friendEmail = $friendRow['friends_with'];

            // Fetch the friend's pins
            $pinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, isPublic, pin_id FROM PinsInfo WHERE email = ?");
            $pinsQuery->bind_param("s", $friendEmail);
            $pinsQuery->execute();
            $pinsResult = $pinsQuery->get_result();

            // Check if there are any pins
            if ($friendsResult->num_rows > 0) {
    while ($friendRow = $friendsResult->fetch_assoc()) {
        $friendEmail = $friendRow['friends_with'];

        // Fetch the friend's pins
        $pinsQuery = $conn->prepare("SELECT lat, lng, date, title, description, isPublic, pin_id FROM PinsInfo WHERE email = ?");
        $pinsQuery->bind_param("s", $friendEmail);
        $pinsQuery->execute();
        $pinsResult = $pinsQuery->get_result();

        // Check if there are any pins
        if ($pinsResult->num_rows > 0) {
            while ($pinRow = $pinsResult->fetch_assoc()) {
                $pinId = $pinRow['pin_id'];
                $commentsForPin = isset($comments[$pinId]) ? $comments[$pinId] : array();

                // Check if the pin is liked by the user
                $likeQuery = $conn->prepare("SELECT * FROM likes WHERE pin_id = ? AND user = ?");
                $likeQuery->bind_param("is", $pinId, $requestEmail);
                $likeQuery->execute();
                $likeResult = $likeQuery->get_result();

               $isLiked = false; // Initially set to false
        while ($likeRow = $likeResult->fetch_assoc()) {
            if ($likeRow['user'] == $requestEmail) {
                $isLiked = true; // Set to true if user liked the pin
                break; // No need to continue checking once found
            }
        }

                // Fetch friend's first and last name
                $friendUserQuery = $conn->prepare("SELECT first_name, last_name FROM users WHERE email = ?");
                $friendUserQuery->bind_param("s", $friendEmail);
                $friendUserQuery->execute();
                $friendUserResult = $friendUserQuery->get_result();
                $friendUserRow = $friendUserResult->fetch_assoc();

                // Check if the pin is public and add to the list if it is
                if ($pinRow['isPublic'] == 1) {
                    $friendsPins[] = array(
                        "first_name" => $friendUserRow['first_name'],
                        "last_name" => $friendUserRow['last_name'],
                        "email" => $friendEmail,
                        "lat" => $pinRow['lat'],
                        "lng" => $pinRow['lng'],
                        "date" => $pinRow['date'],
                        "title" => $pinRow['title'],
                        "description" => $pinRow['description'],
                        "pin_id" => $pinRow['pin_id'],
                        "comments" => $commentsForPin,
                        "isLiked" => $isLiked // Adding isLiked flag
                    );
                }

                $likeQuery->close();
            }
        }

        $pinsQuery->close();
    }
}
        $friendUserQuery->close();
    }

    // Combine user and friends' pins
    $combinedPins = array_merge($userPins, $friendsPins);

    // Return matched data as JSON
    echo json_encode(['success' => true, 'data' => $combinedPins]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
}

$userPinsQuery->close();
$userQuery->close();
$conn->close();
?>