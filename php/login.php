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
$email = $data['email'];
$pass = $data['pass'];

if (isset($email) && isset($pass)) {
    if ($email != "" && $pass != "") {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            // User found, verify password
            $user = $result->fetch_assoc();
            if (password_verify($pass, $user['pass'])) {
                echo json_encode(["code" => 200, "message" => "Login successful"]);
            } else {
                echo json_encode(["code" => 401, "error" => "Invalid email or password"]);
            }
        } else {
            echo json_encode(["code" => 401, "error" => "Invalid email or password"]);
        }
    }
} else {
    echo json_encode(["code" => 401, "error" => "Please provide email and password"]);
}

$conn->close();