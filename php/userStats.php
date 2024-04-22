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

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

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

if (isset($_SESSION['user_id'])) {
    $userID = $_SESSION['user_id'];

    // Query to fetch pins for the given user_id
    $sql_pins = "SELECT * FROM PinsInfo WHERE user_id = '$userID'";
    $result_pins = $conn->query($sql_pins);

    // Initialize total likes count
    $totalLikes = 0;

    if ($result_pins->num_rows >= 0) {
        // Loop through each pin for the user
        while ($row = $result_pins->fetch_assoc()) {
            // Add likes count of each pin to totalLikes
            $totalLikes += $row['likes'];
        }
    }

    // Query to count rows in Friends table where user_id1 matches the given user_id
    $sql_friends = "SELECT COUNT(*) AS friend_count FROM friends_list WHERE user_id1 = $userID";
    $result_friends = $conn->query($sql_friends);

    if ($result_friends->num_rows > 0) {
        // Fetch the result
        $row = $result_friends->fetch_assoc();
        $friend_count = $row['friend_count'];
    } else {
        $friend_count = 0;
    }

    // Prepare response
    $response = array(
        'likes_count' => $totalLikes,
        'friend_count' => $friend_count
    );

    echo json_encode([$response]);
}
$conn->close();
?>