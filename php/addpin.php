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

    if (isset($data['email']) && isset($data['lat']) && isset($data['lng']) && isset($data['title']) && isset($data['description']) && isset($data['date']) && isset($data['isPublic'])) {
        $email = $data['email'];
        $latitude = $data['lat'];
        $longitude = $data['lng'];
        $title = $data['title'];
        $description = $data['description'];
        $date = $data['date'];
        $isPublic = $data['isPublic'];

        $stmt = $conn->prepare("INSERT INTO PinsInfo (email, lat, lng, title, description, date, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssi", $email, $latitude, $longitude, $title, $description, $date, $isPublic);

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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $requestedEmail = $_GET['email'] ?? null;

    if ($requestedEmail) {
        $stmt = $conn->prepare("SELECT lat, lng FROM PinsInfo WHERE email = ?");
        $stmt->bind_param("s", $requestedEmail);
        $stmt->execute();
        $result = $stmt->get_result();

        $coordinates = [];  // Initialize an array to hold coordinates

        while ($row = $result->fetch_assoc()) {
            // Fetch all rows into the $coordinates array
            $coordinates[] = $row;
        }

        if (!empty($coordinates)) {
            // If there are coordinates, return them as JSON
            echo json_encode(['success' => true, 'data' => $coordinates]);
        } else {
            // If no coordinates are found, return an error
            echo json_encode(['success' => false, 'error' => 'Email not found']);
        }

        $stmt->close();
    } //else {
        //echo json_encode(['success' => false, 'error' => 'Missing email parameter']);
    //}
}



$conn->close();
?>
