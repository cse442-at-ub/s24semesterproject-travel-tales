<?php
include_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image']) && isset($_POST['image_id'])) {
    $image = $_FILES['image'];
    $imageTempName = $image['tmp_name'];
    $imageName = $image['name'];
    $imageSize = $image['size'];
    $imageError = $image['error'];
    $imageType = $image['type'];
    $imageId = intval($_POST['image_id']); // Retrieve and convert image_id from POST data

    if ($imageError !== UPLOAD_ERR_OK) {
        echo json_encode(['message' => 'Error uploading file.']);
        exit;
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['message' => 'Invalid file type.']);
        exit;
    }

    $imageData = file_get_contents($imageTempName);
    // Update the prepared statement to include image_id
    $stmt = $conn->prepare("INSERT INTO pin_images (image_name, image_type, image_data, image_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $imageName, $imageType, $imageData, $imageId);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Image saved successfully.', 'image_id' => $imageId]);
    } else {
        echo json_encode(['message' => 'Failed to save image.', 'error' => $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['message' => 'No image uploaded or wrong HTTP method used.']);
}
?>
