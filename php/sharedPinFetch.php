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

// Current user ID
$user_id1 = $_GET['user_id1']; // Assuming you're passing this as a GET parameter

$friendsQuery = $conn->prepare("SELECT user_id2 FROM friends_list WHERE user_id1 = ?");
$friendsQuery->bind_param("s", $user_id1);
$friendsQuery->execute();
$friendsResult = $friendsQuery->get_result();

// Array to store friends' pins
$friendsPins = array();

// Check if there are any friends
if ($friendsResult->num_rows > 0) {
    while ($friendRow = $friendsResult->fetch_assoc()) {
        $friendId = $friendRow['user_id2'];

        // Fetch the friend's pins
        $pinsQuery = $conn->prepare("SELECT p.lat, p.lng, p.date, p.title, p.description, p.isPublic, p.pin_id, u.first_name, u.last_name, u.username FROM PinsInfo p INNER JOIN users u ON p.user_id = u.id WHERE p.user_id = ? AND p.isPublic = 1");
        $pinsQuery->bind_param("s", $friendId);
        $pinsQuery->execute();
        $pinsResult = $pinsQuery->get_result();

        // Check if there are any pins
        if ($pinsResult->num_rows > 0) {
            while ($pinRow = $pinsResult->fetch_assoc()) {
                $friendsPins[] = array(
                    "first_name" => $pinRow['first_name'],
                    "last_name" => $pinRow['last_name'],
                    "username" => $pinRow['username'],
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

// Return matched data as JSON
echo json_encode(['success' => true, 'data' => $friendsPins]);

// Close prepared statements
$friendsQuery->close();
$pinsQuery->close();
$conn->close();
?>
