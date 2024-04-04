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

// Prepare and execute SQL statement to select friend emails
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

// Array to store friend emails
$friend_emails = array();

// Fetch friend emails
while ($row_friends = $result_friends->fetch_assoc()) {
    $friend_id = $row_friends['friend_id'];
    
    // Query the users table to get email of the friend
    $sql_email = "SELECT email FROM users WHERE id = ?";
    $stmt_email = $conn->prepare($sql_email);
    $stmt_email->bind_param("i", $friend_id);
    $stmt_email->execute();
    $result_email = $stmt_email->get_result();
    
    // Fetch email
    if ($row_email = $result_email->fetch_assoc()) {
        $friend_emails[] = $row_email['email'];
    }

    // Close email statement
    $stmt_email->close();
}

// Close friends statement
$stmt_friends->close();

// Array to store matched data
$matchedData = array();

// Fetch pins for friend emails
foreach ($friend_emails as $email) {
    // Query the PinsInfo table to get pins of the friend using their email
    $sql_pins = "SELECT email, lat, lng, title, description, date, isPublic, pin_id FROM PinsInfo WHERE email = ? AND isPublic = 1";
    $stmt_pins = $conn->prepare($sql_pins);
    $stmt_pins->bind_param("s", $email);
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
