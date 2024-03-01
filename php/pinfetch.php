<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT username, lat, lng FROM PinsInfo";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "username: " . $row["username"]. " - latitude: " . $row["lat"]. " - longitude: " . $row["lng"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();