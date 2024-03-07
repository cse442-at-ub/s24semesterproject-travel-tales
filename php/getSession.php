<?php
//forces HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}
header('Access-Control-Allow-Credentials: true'); 
header('Content-Type: application/json');

session_set_cookie_params([
    'samesite' => 'None',
    'secure' => true, // Requires HTTPS
]);

session_start();
header('Content-Type: application/json');
if (isset($_SESSION['user_id'])) {
    // User is logged in
    echo json_encode(['isLoggedIn' => true]);
} else {
    // User is not logged in
    echo json_encode(['isLoggedIn' => false]);
}
