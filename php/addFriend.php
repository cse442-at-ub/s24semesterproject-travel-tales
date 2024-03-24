<?php
include_once('db.php');
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}
header('Access-Control-Allow-Origin: http://localhost:3000');
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
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($postData['from']) && isset($postData['to'])) {
        $from = $postData['from'];
        $to = $postData['to'];

        $sql = "INSERT INTO friends_list (user, friends_with) VALUES ('$from', '$to')";

        if ($conn->query($sql) === TRUE) {
            $response = array("success" => true, "message" => "Friend added successfully");
            echo json_encode($response);
        } else {
            $response = array("success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error);
            echo json_encode($response);
        }
    } else {
        $response = array("success" => false, "message" => "From name or to name not provided");
        echo json_encode($response);
    }
}

$conn->close();
?>
