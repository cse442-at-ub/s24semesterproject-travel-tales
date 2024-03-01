<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true'); 

session_start();

header('Content-Type: application/json');
if (isset($_SESSION['user_id'])) {
    // User is logged in
    echo json_encode(['isLoggedIn' => true]);
} else {
    // User is not logged in
    echo json_encode(['isLoggedIn' => false]);
}
