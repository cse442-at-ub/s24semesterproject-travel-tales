<?php
include_once 'db.php'; // This file should contain your database connection settings

header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['image_id'])) {
    $imageId = intval($_GET['image_id']);

    $stmt = $conn->prepare("SELECT image_type, image_data FROM pin_images WHERE image_id = ?");
    $stmt->bind_param("i", $imageId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($imageType, $imageData);
        $stmt->fetch();

        // Set the header to the correct MIME type so the browser knows how to display the image
        header("Content-Type: " . $imageType);
        echo $imageData; // Output the image data directly
    } else {
        header("HTTP/1.0 404 Not Found");
        echo "Image not found.";
    }

    $stmt->close();
} else {
    header("HTTP/1.0 400 Bad Request");
    echo "Image ID not specified.";
}

$conn->close();
?>
