<?php
session_start();
include_once('db.php');

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$currentUserId = $_SESSION['user_id'];

// Prepare SQL query to fetch total likes for the user
$stmt = $conn->prepare("
    SELECT SUM(likes) AS total_likes
    FROM PinsInfo
    WHERE user_id = ?
");

// Bind parameter and execute the query
$stmt->bind_param("i", $currentUserId);
$stmt->execute();
$result = $stmt->get_result();

// Fetch total likes for the user
$userLikes = $result->fetch_assoc();

// Encode total likes as JSON and return
echo json_encode([
    "total_likes" => $userLikes['total_likes']
]);

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
