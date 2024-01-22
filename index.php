<?php

//Database initialiseren

require "REQUIRES/config.php";

// Checken welke post er word gedaan

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Controleer of de 'action' variabele bestaat en gelijk is aan 'create'
    if (isset($_POST['action']) && $_POST['action'] == 'create') {
        // Lobby Creatie
        $lobbycode = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);
        $sql = "INSERT INTO lobby (randomid) VALUES ('$lobbycode')";
        $result = mysqli_query($con, $sql);
        if ($result) {
            // Lobby Creatie gelukt
            $_SESSION['lobbycode'] = $lobbycode;
            header("Location: PHP/lobby.php");
        } else {
            echo "<script>Swal.fire({icon: 'error',title: 'Oops...',text: 'Er is iets misgegaan!'});</script>";
        }


    }
}

?>


<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="CSS/style.css">
    <link rel="shortcut icon" href="MEDIA/FAVICONS/favicon.png" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="MEDIA/FAVICONS/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="MEDIA/FAVICONS/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="MEDIA/FAVICONS/favicon-16x16.png">
    <link rel="manifest" href="MEDIA/FAVICONS/site.webmanifest">
    <link rel="mask-icon" href="MEDIA/FAVICONS/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#603cba">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

    <title>Home - MuziekQuiz</title>
</head>

<body>
    <div class="container">
        <div class="background"></div>
        <div class="header">
            <img class="logo animate__animated animate__heartBeat" src="MEDIA/HOME/LOGO.png" alt="logo">
        </div>
        <div class="lp">
            <img class="lpplaat" src="MEDIA/HOME/LP.png" alt="lp">
        </div>
        <img class="arrow animate__animated" src="MEDIA/HOME/arrow.png" alt="arrow">
        <div class="lobbyselector hide">
            <span class="close-button">&times;</span>
            <form method="POST">
                <input type="hidden" name="action" value="create">
                <button class="button-39" role="button">Maak een Lobby</button>
            </form>
            <h1 class="lobbytitle">Kies of maak een lobby</h1>
        </div>
        <div class="bottom-links">
            <a href="./HTML/about.html">Informatie</a>
            <span>&centerdot;</span>
            <a href="./HTML/credits.html">Credits</a>
            <span>&centerdot;</span>
            <a href="./HTML/copyright.html">&#169; Copyright MuziekQuiz</a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="JS/script.js"></script>

</body>

</html>