<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$matchedData = array();

$sql = "SELECT sp1.pin_id, sp2.email, sp2.lat, sp2.lng, sp2.date
        FROM SharedPins sp1
        JOIN PinsInfo sp2 ON sp1.pin_id = sp2.pin_id";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $matchedData[] = array(
            "email" => $row["email"],
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