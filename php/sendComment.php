<?php
include_once('db.php');

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
header('Access-Control-Allow-Origin: http://localhost:3000');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com;");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
if (isset($_SERVER['HTTPS_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTPS_ORIGIN']}");

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['email']) && isset($data['comment']) && isset($data['pin_id'])) {
        $pin_id = $data['pin_id'];
        $comment = $data['comment'];
        $email =$data['email'];

        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt ->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $user_id = $row['id'];

        $stmt = $conn->prepare("INSERT INTO comments (pin_id, comment, user_id) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $pin_id, $comment, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Pin Info successfully added to the database']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error inserting coordinates: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
    }
}
