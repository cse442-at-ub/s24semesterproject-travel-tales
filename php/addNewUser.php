// insertData.php
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
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['email'];
$pass = $data['pass'];
$confirmPass = $data['confirmPass'];

if ($pass !== $confirmPass) { // check if passwords match
    die(json_encode(['error' => 'Passwords do not match.']));
}

if (strlen($pass) < 8) { // check if password is at least 8 characters
    die(json_encode(['error'=> 'Password must be at least 8 characters long.']));
}
// hash and salt password
$pass = password_hash($pass, PASSWORD_DEFAULT);

if(isset($email) && isset($pass)) {
    if($email != "" and $pass != ""){
        $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, pass) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $email, $pass);
        
        if($stmt->execute()) {
            echo json_encode(["message" => "Record inserted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to insert record"]);
        }
    }
} else {
    echo json_encode(["message" => "Please provide username and email"]);
}

$conn->close();
?>
