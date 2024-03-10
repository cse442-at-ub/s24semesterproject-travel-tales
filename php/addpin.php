<?php
include_once('db.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Force HTTPS
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
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header('Content-Type: application/json');

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

        $coordinates = []; 

        while ($row = $result->fetch_assoc()) {
            $coordinates[] = $row;
        }

        if (!empty($coordinates)) {
            echo json_encode(['success' => true, 'data' => $coordinates]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Email not found']);
        }

        $stmt->close();
    }
}

$conn->close();
?>
