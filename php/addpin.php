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

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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

    // Array to store user's pins
    $userPins = array();

    // Check if there are any user's pins
    if ($userPinsResult->num_rows > 0) {
        while ($userPinRow = $userPinsResult->fetch_assoc()) {
            // Check if the pin is public
           
                $userPins[] = array(
                    "first_name" => $userRow['first_name'],
                    "last_name" => $userRow['last_name'],
                    "email" => $requestEmail,
                    "lat" => $userPinRow['lat'],
                    "lng" => $userPinRow['lng'],
                    "date" => $userPinRow['date'],
                    "title" => $userPinRow['title'],
                    "description" => $userPinRow['description'],
                    "pin_id" => $userPinRow['pin_id']
                );
            
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
            if ($pinsResult->num_rows > 0) {
                while ($pinRow = $pinsResult->fetch_assoc()) {
                    // Check if the pin is public
                    if ($pinRow['isPublic'] == 1) {
                        // Fetch friend's first and last name
                        $friendUserQuery = $conn->prepare("SELECT first_name, last_name FROM users WHERE email = ?");
                        $friendUserQuery->bind_param("s", $friendEmail);
                        $friendUserQuery->execute();
                        $friendUserResult = $friendUserQuery->get_result();
                        $friendUserRow = $friendUserResult->fetch_assoc();

                        $friendsPins[] = array(
                            "first_name" => $friendUserRow['first_name'],
                            "last_name" => $friendUserRow['last_name'],
                            "email" => $friendEmail,
                            "lat" => $pinRow['lat'],
                            "lng" => $pinRow['lng'],
                            "date" => $pinRow['date'],
                            "title" => $pinRow['title'],
                            "description" => $pinRow['description'],
                            "pin_id" => $pinRow['pin_id']
                        );
                    }
                }
            }
        }

        $friendsQuery->close();
        $pinsQuery->close();
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