<?php

include_once('db.php');

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
    // Specify the path to your data file
$dataFilePath = 'path/to/your/data/file.txt';

// Open the file for reading
$file = fopen($dataFilePath, 'r');

// Check if the file is successfully opened
if ($file) {
    // Loop through each line in the file until the end of the file is reached
    while (($line = fgets($file)) !== false) {
        // Split the line into an array using a delimiter (e.g., comma)
        $data = explode(',', $line);

        // Extract the values for latitude, longitude, date, and user
        $latitude = $data[0];
        $longitude = $data[1];
        $date = $data[2];
        $user = $data[3];

        // Process the extracted values as needed (you can perform operations or store them in an array, database, etc.)
        echo "Latitude: $latitude, Longitude: $longitude, Date: $date, User: $user<br>";
    }

    // Close the file
    fclose($file);
} else {
    // Handle the case where the file cannot be opened
    echo "Error opening the file.";
}