<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Connect to the database
    $conn = new mysqli("localhost", "root", "", "muziekquiz");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO music_requests (youtube_link, artist_name, song_title) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $_POST['youtube_link'], $_POST['artist_name'], $_POST['song_title']);

    // Execute the statement and close connections
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo "<script>alert('Aanvraag succesvol ingediend! Als deze word goedgekeurd komt deze direct in de game!');</script>";
}
?>

<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aanvraag - MuziekQuiz</title>
    <link rel="stylesheet" href="../CSS/request.css">
    <link rel="shortcut icon" href="../MEDIA/FAVICONS/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <meta name="msapplication-TileColor" content="#603cba">
    <meta name="theme-color" content="#ffffff">
</head>

<body>
    <button id="backButton"><i class="fas fa-arrow-left"></i> Home</button>
    <div class="form-container animate__animated animate__fadeIn animate__slow">
        <h1>Muziek aanvragen</h1>
        <p>Geef hier <strong>correct</strong> een YouTube (audio) link aan die jij graag in de game zou willen zien!</p>
        <form action="request.php" method="post">
            <input type="text" name="youtube_link" placeholder="YouTube link" required>
            <input type="text" name="artist_name" placeholder="Artiestennaam" required>
            <input type="text" name="song_title" placeholder="Titel van het nummer" required>
            <button type="submit">Verzenden</button>
        </form>
    </div>

    <div class="bottom-links">
        <a href="../HTML/about.html">Informatie</a>
        <span>&centerdot;</span>
        <a href="../HTML/credits.html">Credits</a>
        <span>&centerdot;</span>
        <a href="../HTML/copyright.html">&#169; Copyright MuziekQuiz</a>
    </div>

    <script src="../JS/request.js"></script>
</body>

</html>