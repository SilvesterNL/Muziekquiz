<?php

require "../REQUIRES/config.php";

$lobbycode = $_GET['lobbycode'];

if ($lobbycode == null) {
    header("Location: ../index");
} else {
    echo '<script>document.addEventListener("DOMContentLoaded", function () { openusernamesel(); });</script>';
}
    
if (isset($_POST['action']) && $_POST['action'] == 'usernamecreate') {
    $updateSql = "INSERT INTO users (username, lobbycode) VALUES (?, ?)";
    $stmt = mysqli_prepare($con, $updateSql);
    mysqli_stmt_bind_param($stmt, "ss", $_POST['username'], $lobbycode);
    mysqli_stmt_execute($stmt);
    $_SESSION["userid"] = mysqli_insert_id($con);
    $_SESSION['joinedlobby'] = true;
    header("Location: lobby?lobbycode=$lobbycode");
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
    <title>Muziekquiz</title>
</head>
<body>
    <div class="container">
        <div class="background"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../JS/script.js"></script>
    <script src="../JS/joinlobby.js"></script>
</body>
</html>