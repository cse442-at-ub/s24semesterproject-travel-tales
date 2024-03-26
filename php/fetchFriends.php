<?php

session_start();
require_once 'db.php';

$friendsList = [];
// Allow from any origin
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

if (isset($_SESSION['user_id'])) {
    $currentUserId = (int)$_SESSION['user_id'];

    // This SQL statement checks both user_id1 and user_id2 for the current user's ID,
    // and returns the friend's ID from the opposite column
    $sql = "SELECT 
                CASE 
                    WHEN user_id1 = ? THEN user_id2 
                    ELSE user_id1 
                END AS friend_id
            FROM friends_list 
            WHERE user_id1 = ? OR user_id2 = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("iii", $currentUserId, $currentUserId, $currentUserId);

    $stmt->execute();

    $result = $stmt->get_result();

    $friends = [];
    while ($row = $result->fetch_assoc()) {
        $friends[] = $row['friend_id'];
    }
    
    $stmt->close();

    // Now, get user info for each friend ID
    foreach ($friends as $friendId) {
        $sql = "SELECT first_name, last_name, email FROM users WHERE id = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("i", $friendId);
            $stmt->execute();
            $userResult = $stmt->get_result();
            if ($userInfo = $userResult->fetch_assoc()) {
                $friendsList[] = $userInfo;
            }
            $stmt->close();
        }
    }

    echo json_encode($friendsList);
} else {
    echo "Please log in to view friends.";
}