<?php
// Disable PHP errors
error_reporting(0);
ini_set('display_errors', 0);
// database connectie
require "../REQUIRES/config.php";
// ...



// database connectie
require "../REQUIRES/config.php";
// checken of de sessie bestaat en of de lobby net is gemaakt. Zodat gebruiker gebruikers naam moet kiezen voor eigenaarschap
$lobbycode = $_SESSION['lobbycode'];
$userid = $_SESSION['userid'];

if (!isset($_SESSION['lobbycode'])) {
    header("Location: ../index?novalidcode1");
}

if ($_SESSION['creatinglobby'] == false || $_SESSION['joinedlobby'] == false) {
    $joinlobbycode = $_GET['lobbycode'];
}



if ($_SESSION['creatinglobby'] == true) {
    $sql = "SELECT * FROM lobby WHERE randomid = '$lobbycode'";
    $result = mysqli_query($con, $sql);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        if ($row['first'] == 1) { 
            echo '<script>document.addEventListener("DOMContentLoaded", function () { openusernamesel(); });</script>';
        } else {
            
        }
    } else {
        header("Location: ../index");
    }
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST['action']) && $_POST['action'] == 'usernamecreate') {
            $updateSql = "UPDATE lobby SET first = 0, active = 1, eigenaar = '{$_POST['username']}' WHERE randomid = '$lobbycode'";
            mysqli_query($con, $updateSql);
            $insertSql = "INSERT INTO users (username, lobbycode) VALUES (?, ?)";
            $stmt = mysqli_prepare($con, $insertSql);
            mysqli_stmt_bind_param($stmt, "ss", $_POST['username'], $lobbycode);
            mysqli_stmt_execute($stmt);
            $_SESSION["userid"] = mysqli_insert_id($con);
            $_SESSION['creatinglobby'] = false;
            $_SESSION['eigenaar'] = true;
            header("Location: lobby?lobbycode=$lobbycode");
            $joinlobbycode = $_GET['lobbycode'];
            
        }
    };
} else if (!isset($joinlobbycode)) {
    $removeuser = "DELETE FROM users WHERE id = '$userid'";
    mysqli_query($con, $removeuser);
    header("Location: ../index?novalidcode2");    
} else if ($_SESSION['joinedlobby'] == true) {
    $sql = "SELECT antusr FROM lobby WHERE randomid = '$joinlobbycode'";
    $result = mysqli_query($con, $sql);
    $row = mysqli_fetch_assoc($result);
    $antusr = $row['antusr'];
    $sql = "UPDATE lobby SET antusr = $antusr + 1 WHERE randomid = '$joinlobbycode'";
    mysqli_query($con, $sql);
    $_SESSION['joinedlobby'] = false;
    $_SESSION['joinedlobbycode'] = $joinlobbycode;
    header ("Location: lobby?lobbycode=$joinlobbycode");

}




?>


<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="shortcut icon" href="../MEDIA/FAVICONS/favicon.png" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="../MEDIA/FAVICONS/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../MEDIA/FAVICONS/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../MEDIA/FAVICONS/favicon-16x16.png">
    <link rel="manifest" href="../MEDIA/FAVICONS/site.webmanifest">
    <link rel="mask-icon" href="../MEDIA/FAVICONS/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#603cba">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <title>Lobby - MuziekQuiz</title>
</head>
<body>
    <div class="container">
        <div class="background"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../JS/script.js"></script>
    <script src="../JS/lobby.js"></script>
</body>
</html>
