<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if 'lat' and 'lng' keys exist in the received data
    if (isset($data['lat']) && isset($data['lng'])) {
        // Access latitude and longitude
        $latitude = $data['lat'];
        $longitude = $data['lng'];

        // Send a success response
        echo json_encode(['message' => 'Coordinates received successfully']);
    } else {
        // Send an error response for missing or incorrect data
        echo json_encode(['error' => 'Invalid or missing coordinates']);
    }
} else {
    // Handle other HTTP methods if needed
    echo json_encode(['error' => 'Invalid request method']);
}
?>
