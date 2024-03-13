<?php

// Start the session
session_start();

// Include the database connection
require_once 'db.php';

// Check if the user is logged in
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

    // Prepare statement
    $stmt = $conn->prepare($sql);

    // Bind parameters
    $stmt->bind_param("iii", $currentUserId, $currentUserId, $currentUserId);

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    $friends = [];
    while ($row = $result->fetch_assoc()) {
        $friends[] = $row['friend_id'];
    }

    // Close the statement
    $stmt->close();

    // Return the list of friends
    echo json_encode($friends);
} else {
    // User is not logged in
    echo "Please log in to view friends.";
}