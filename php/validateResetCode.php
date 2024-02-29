<?php

include_once('db.php');

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

// Assume these come from user input (e.g., form submission)
$userEmail = $_POST['email']; // User's email address
$resetCode = $_POST['reset_code']; // User-provided reset code
$newPassword = $_POST['password']; // User's new password

// Secure the user input
$userEmail = $conn->real_escape_string($userEmail);
$resetCode = $conn->real_escape_string($resetCode);
$newPassword = $conn->real_escape_string($newPassword);

// Hash the new password
$newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

// SQL to validate the reset code
$sql = "SELECT * FROM password_resets WHERE email = '$userEmail' AND reset_code = '$resetCode' AND reset_code_expires_at > NOW()";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Reset code is valid, update the user's password
    $updateSql = "UPDATE users SET password = '$newPasswordHash'";

    $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    // should check if record is successfully deleted

    if ($conn->query($updateSql) === TRUE) {
        echo "Password updated successfully.";
    } else {
        echo "Error updating password: " . $conn->error;
    }
} else {
    // Reset code is invalid or expired
    echo "Invalid or expired reset code.";
}

$conn->close();