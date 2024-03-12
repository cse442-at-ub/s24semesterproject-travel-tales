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

$matchedData = array();

$sql = "SELECT sp1.pin_id, sp1.shared_with, sp2.lat, sp2.lng, sp2.date, sp3.first_name, sp3.last_name
        FROM SharedPins sp1
        JOIN PinsInfo sp2 ON sp1.pin_id = sp2.pin_id
        JOIN users sp3 ON sp2.email = sp3.email";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $matchedData[] = array(
            "first_name" => $row["first_name"],
            "last_name" => $row["last_name"],
            "email" => $row["shared_with"],
            "lat" => $row["lat"],
            "lng" => $row["lng"],
            "date" => $row["date"]
        );
    }
} else {
    // No matches, set a message or specific value
    $matchedData = array("message" => "No matching records found");
}

// Close the database connection

// Return matched data as JSON
echo json_encode($matchedData);

$conn->close();
?>