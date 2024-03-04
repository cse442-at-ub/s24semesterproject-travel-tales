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

$data = json_decode(file_get_contents("php://input"), true);
//$email = $data['email'];
$reset_code = intval($data['reset_code']);
$pass = $data['pass'];

// Secure the user input
//$userEmail = $conn->real_escape_string($email);
$resetCode = $conn->real_escape_string($reset_code);
$newPassword = $conn->real_escape_string($pass);

// Hash the new password
$newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

// SQL to validate the reset code
$sql = "SELECT email FROM password_resets WHERE reset_code = '$reset_code' AND expires_at > NOW()";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $email = $row["email"];
    // Reset code is valid, update the user's password
    $updateSql = "UPDATE users SET pass = '$newPasswordHash' WHERE email = '$email'";
    // $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    // $stmt->bind_param("ss", $hashedPassword, $email);

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