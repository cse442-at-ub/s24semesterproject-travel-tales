<?php

session_start();

require_once 'db.php';

if (isset($_SESSION['user_id'])) {
    $currentUserId = (int)$_SESSION['user_id'];

    // Prepare SQL to fetch friends
    // This SQL statement checks both user_id1 and user_id2 for the current user's ID,
    // and returns the friend's ID from the opposite column
    $sql = "SELECT 
                CASE 
                    WHEN user_id1 = ? THEN user_id2 
                    ELSE user_id1 
                END AS friend_id
            FROM friends 
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

    echo json_encode($friends);
} else {
    echo "Please log in to view friends.";
}