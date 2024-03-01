<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username']) && isset($data['lat']) && isset($data['lng'])) {
        $username = $data['username'];
        $latitude = $data['lat'];
        $longitude = $data['lng'];

        $stmt = $conn->prepare("INSERT INTO PinsInfo (username, lat, lng) VALUES (?, ?, ?)");
        $stmt->bind_param("sdd", $username, $latitude, $longitude);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Coordinates successfully added to the database']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error inserting coordinates: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid or missing data']);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $requestedUsername = $_GET['username'] ?? null;

    if ($requestedUsername) {
        $stmt = $conn->prepare("SELECT lat, lng FROM PinsInfo WHERE username = ?");
        $stmt->bind_param("s", $requestedUsername);
        $stmt->execute();
        $result = $stmt->get_result();

        $coordinates = []; 

        while ($row = $result->fetch_assoc()) {
            $coordinates[] = $row;
        }

        if (!empty($coordinates)) {
            echo json_encode(['success' => true, 'data' => $coordinates]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Username not found']);
        }

        $stmt->close();
    }
}


$conn->close();
?>
