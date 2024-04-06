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

// Current user ID
$user_id1 = $_SESSION['user_id']; // Assuming you're passing this as a GET parameter

// Prepare and execute SQL statement to select friend IDs
$sql_friends = "SELECT 
                    CASE 
                        WHEN user_id1 = ? THEN user_id2 
                        ELSE user_id1 
                    END AS friend_id
                FROM friends_list 
                WHERE user_id1 = ? OR user_id2 = ?";
$stmt_friends = $conn->prepare($sql_friends);
$stmt_friends->bind_param("iii", $user_id1, $user_id1, $user_id1);
$stmt_friends->execute();
$result_friends = $stmt_friends->get_result();

// Array to store friend IDs
$friend_ids = array();

// Fetch friend IDs
while ($row_friends = $result_friends->fetch_assoc()) {
    $friend_ids[] = $row_friends['friend_id'];
}

// Close friends statement
$stmt_friends->close();

// Array to store matched data
$matchedData = array();

// Fetch pins for friend IDs
foreach ($friend_ids as $friend_id) {
    // Query the PinsInfo table to get pins of the friend using their ID
    $sql_pins = "SELECT lat, lng, title, description, date, isPublic, pin_id, username, profile FROM PinsInfo WHERE user_id = ?";
    $stmt_pins = $conn->prepare($sql_pins);
    $stmt_pins->bind_param("i", $friend_id);
    $stmt_pins->execute();
    $result_pins = $stmt_pins->get_result();

    // Fetch pins data
    while ($row_pins = $result_pins->fetch_assoc()) {
        $matchedData[] = $row_pins;
    }

    // Close pins statement
    $stmt_pins->close();
}

// Return matched data as JSON
echo json_encode($matchedData);

// Close the connection
$conn->close();
?>