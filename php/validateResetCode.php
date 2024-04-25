<?php

include_once('db.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
//$email = $data['email'];
$reset_code = intval($data['reset_code']);
$pass = $data['pass'];

// Secure the user input
//$userEmail = $conn->real_escape_string($email);
$resetCode = $conn->real_escape_string($reset_code);
$newPassword = $conn->real_escape_string($pass);

// check if password is at least 8 characters
if (strlen($pass) < 8) {
    http_response_code(400);
    die(json_encode(['error' => 'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character.']));
}

// check if password contains at least one uppercase letter
$noUppercase = !preg_match('/[A-Z]/', $pass);
if ($noUppercase) {
    http_response_code(400);
    die(json_encode(['error' => 'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character.']));
}

// check if password contains at least one lowercase letter
$noLowercase = !preg_match('/[a-z]/', $pass);
if ($noLowercase) {
    http_response_code(400);
    die(json_encode(['error' => 'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character.']));
}

// check to make sure there is at least one special character
$pattern = '/[^a-zA-Z0-9]/';
if (!preg_match($pattern, $pass)) {
    http_response_code(400);
    die(json_encode(['error' => 'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character.']));
}

// check if the password contains a number
$pattern = '/\d/';
if (!preg_match($pattern, $pass)) {
    http_response_code(400);
    die(json_encode(['error' => 'Password requires at least one number.']));
}

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
        // http_response_code(200);
        echo json_encode(["message" => "Password updated successfully."]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Error updating password." . $conn->error]);
    }
} else {
    // Reset code is invalid or expired
    http_response_code(400);
    echo json_encode(["error" => "Invalid or expired reset code." . $conn->error]);

}

$conn->close();