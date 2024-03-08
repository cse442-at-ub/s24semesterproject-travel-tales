<?php
session_start();
include_once('db.php');

header('Content-Type: application/json');

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

// Check if the user is logged in
if(isset($_SESSION['user_id'])) {
    echo $_SESSION['user_id'];
    $user_id = $_SESSION['user_id'];

    // Fetch the id from the 'users' database
    $stmt_user = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $stmt_user->bind_param("i", $user_id);
    $stmt_user->execute();
    $result_user = $stmt_user->get_result();

    if ($result_user->num_rows == 1) {
        $user_data = $result_user->fetch_assoc();
        $user_db_id = $user_data['id'];

        // Match the 'id' in 'UserProfileinfo' database
        $stmt_profile = $conn->prepare("SELECT user_likes, user_pins, user_friends FROM UserProfileinfo WHERE id = ?");
        $stmt_profile->bind_param("i", $user_db_id);
        $stmt_profile->execute();
        $result_profile = $stmt_profile->get_result();

        if ($result_profile->num_rows == 1) {
            $profile_data = $result_profile->fetch_assoc();

            echo json_encode([
                "code" => 200,
                "data" => [
                    "user_likes" => $profile_data['user_likes'],
                    "user_pins" => $profile_data['user_pins'],
                    "user_friends" => $profile_data['user_friends']
                ]
            ]);
        } else {
            echo json_encode(["code" => 404, "error" => "UserProfileinfo not found for the user"]);
        }
    } else {
        echo json_encode(["code" => 404, "error" => "User not found"]);
    }
} else {
    echo json_encode(["code" => 401, "error" => "User not logged in"]);
}

$conn->close();
