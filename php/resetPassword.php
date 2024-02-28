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

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];

// check if valid email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['message' => 'Invalid email format']);
    exit;
}

// check if email exists in the database
$query = "SELECT email FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    // Email not found
    echo json_encode(['message' => 'Email not found']);
} else {
    // Email found, generate and send reset code
    $reset_code = rand(100000, 999999); // Example code generation, consider more secure methods
    $expires_at = (new DateTime('+1 hour'))->format('Y-m-d H:i:s');
    $get_user_query = "SELECT * FROM password_resets WHERE email = ?";
    $stmt = $conn->prepare($get_user_query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $get_user_result = $stmt->get_result();

    if ($get_user_result->num_rows > 0) {
        // user exists, update the reset_code and expires_at
        $updateQuery = "UPDATE password_resets SET reset_code = ?, expires_at = ? WHERE email = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("sss", $reset_code, $expires_at, $email);
        
        if ($updateStmt->execute()) {
            echo "Reset code updated successfully.";
        } else {
            echo "Error updating reset code: " . $conn->error;
        }
    } else { // user does not exist in db - create new record
        // Store the code and its expiration in the database
        $insertQuery = "INSERT INTO password_resets (email, reset_code, expires_at) VALUES (?, ?, ?)";
        //TODO: check if user already exists in the DB, update the reset_code and expires_at if so
        //"UPDATE users SET reset_code = ?, expires_at = ? WHERE email = ?";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("sss", $email, $reset_code, $expires_at);
        $insertStmt->execute();

        // Send the email
        $to = $email;
        $subject = 'Your Password Reset Code';
        $message = 'Your password reset code is: ' . $code;
        $headers = 'From: noreply@traveltales.com' . "\r\n" .
                'Reply-To: noreply@traveltales.com' . "\r\n" .
                'X-Mailer: PHP/' . phpversion();

        mail($to, $subject, $message, $headers);

        echo json_encode(['message' => 'Reset code sent successfully. Please check your email.']);
    }
}

$conn->close();