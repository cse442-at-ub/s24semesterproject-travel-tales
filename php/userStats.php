<?php
session_start();
include_once('db.php');

header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
} 

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}
    
$currentUserId = $_SESSION['user_id'];

// Prepare SQL query to fetch user statistics
$stmt = $conn->prepare("
    SELECT 
        (SELECT COUNT(*) FROM PinsInfo WHERE user_id = ?) AS num_entries,
        (SELECT SUM(likes) FROM PinsInfo WHERE user_id = ?) AS num_likes,
        (SELECT COUNT(*) FROM friends_list WHERE user_id1 = ? OR user_id2 = ?) AS num_friends
");

// Bind parameters and execute the query
$stmt->bind_param("iiii", $currentUserId, $currentUserId, $currentUserId, $currentUserId);
$stmt->execute();
$result = $stmt->get_result();

// Fetch user statistics
$userData = $result->fetch_assoc();

// Encode user statistics as JSON and return
echo json_encode([
    "num_likes" => $userData['num_likes'],      // Total likes from PinsInfo table for the user
    "num_entries" => $userData['num_entries'],  // Total entries (pins) from PinsInfo table for the user
    "num_friends" => $userData['num_friends']   // Total friends from friends_list table for the user
]);

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
