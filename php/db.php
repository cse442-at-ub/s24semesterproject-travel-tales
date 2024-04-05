<?php
// Establishes connection to DB

// select the environment - 'prod' for production, 'dev' for local development
// $environment = 'dev';

// Set to false for prod / true for local development
$allowCORS = true;
// Config - needs to be udpated for prod
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}