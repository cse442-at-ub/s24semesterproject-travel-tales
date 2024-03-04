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

// Removes password reset requests if they are over 24 hours old
// $remove_old_requests = "DELETE FROM reset_requests WHERE requested_on < NOW() - INTERVAL 1 DAY";
// $conn->query($remove_old_requests);

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

if($result->num_rows == 0) {
    // Email not found
    echo json_encode(['message' => 'Email not found']);
} else {
    // Email found, see how many times they have made a reset request in the last 24 hours
    $number_of_requests = "SELECT COUNT(*) AS request_count FROM reset_requests WHERE email = ? AND requested_on > NOW() - INTERVAL 1 DAY";
    $stmt = $conn->prepare($number_of_requests);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $reset_request_record = $result->fetch_assoc();
    $user_req_count = $reset_request_record['request_count'];

    if($user_req_count < 5) {
        // enter the request into the reset_requests table
        $query = "INSERT INTO reset_requests (email, requested_on) VALUES (?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        //TODO: need to add error handling to this
        $stmt->execute();

        // Generate and send reset code
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
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->bind_param("sss", $email, $reset_code, $expires_at);
            $insertStmt->execute();
        }
        // Send the email
        $to = $email;
        $subject = 'Your Password Reset Code';
        $message = 'Your password reset code is: ' . $reset_code;
        $headers = 'From: noreply@traveltales.com' . "\r\n" .
                'Reply-To: noreply@traveltales.com' . "\r\n" .
                'X-Mailer: PHP/' . phpversion();

        mail($to, $subject, $message, $headers);

        echo json_encode(['message' => 'Reset code sent successfully. Please check your email.']);

    } else {
        echo json_encode(["message" => "You've reached the limit for password reset requests for today. Please try again later."]);
    }

}

$conn->close();