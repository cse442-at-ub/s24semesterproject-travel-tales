<?php
include_once('db.php');

// Redirect to HTTPS if not already using it
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

header('Access-Control-Allow-Origin: http://localhost:3000');
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

function sendErrorResponse($code, $message) {
    http_response_code($code);
    echo json_encode(['message' => $message]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate inputs
if (!isset($data['firstName'], $data['lastName'], $data['user_id'])) {
    sendErrorResponse(400, 'Missing required fields');
}

$firstName = $data['firstName'];
$lastName = $data['lastName'];
$user_id = $data['user_id'];

// Sanitize inputs (you may need to use a more robust sanitization method)
$firstName = htmlspecialchars($firstName);
$lastName = htmlspecialchars($lastName);
$user_id = intval($user_id);

// Check if both first name and last name are provided
if ($firstName != "" && $lastName != "") {
    // Check if user_id exists in the database
    $stmt_check = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $stmt_check->bind_param("i", $user_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // Update the first name and last name for the user with the given user_id
        $stmt_update = $conn->prepare("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?");
        $stmt_update->bind_param("ssi", $firstName, $lastName, $user_id);
        if ($stmt_update->execute()) {
            http_response_code(200);
            echo json_encode(['message' => 'Name updated successfully']);
        } else {
            sendErrorResponse(500, 'Failed to update name');
        }
    } else {
        sendErrorResponse(404, 'User not found');
    }
}

// Close the database connection
$conn->close();
?>
