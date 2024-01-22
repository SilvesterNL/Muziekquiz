<?php

// database connectie

require "../REQUIRES/config.php";

// checken of de sessie bestaat en of de lobby net is gemaakt. Zodat gebruiker gebruikers naam moet kiezen voor eigenaarschap

$lobbycode = $_SESSION['lobbycode'];

$sql = "SELECT * FROM lobby WHERE randomid = '$lobbycode'";
$result = mysqli_query($con, $sql);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    if ($row['first'] == 1) {
       
    } else {
        
    }
} else {
    header("Location: ../index.php");
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
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../JS/script.js"></script>
</body>
</html>