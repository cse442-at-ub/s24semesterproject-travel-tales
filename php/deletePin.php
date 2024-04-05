<?php
include_once('db.php');

// Redirect to HTTPS if not already using it
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

header('Access-Control-Allow-Origin: http://localhost:3000');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Retrieve pin_id from the request body
$data = json_decode(file_get_contents("php://input"));

if(isset($data->pin_id)) {
  $pin_id = $data->pin_id;

  // Prepare a DELETE statement
  $sql = "DELETE FROM PinsInfo WHERE pin_id = ?";

  // Bind parameters and execute the statement
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $pin_id);

  if ($stmt->execute()) {
    echo "Pin deleted successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // Close statement
  $stmt->close();
} else {
  echo "Error: Pin_id not provided";
}

// Close connection
$conn->close();
?>
