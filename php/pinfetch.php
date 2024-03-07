<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT email, lat, lng, title, description, date, isPublic, pin_id FROM PinsInfo";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "email: " . $row["email"]. " | latitude: " . $row["lat"]. " | longitude: " . $row["lng"]. " | title: " . $row["title"]. " | description: " . $row["description"]. " | date: " . $row["date"]. " | isPublic: " . $row["isPublic"]. " | pin_id: " . $row["pin_id"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();