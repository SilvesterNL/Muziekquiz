<?php
$formSubmitted = false;
$submissionType = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $submissionType = $_POST['feedback_type'] === 'Feedback' ? 'Feedback' : 'Bug';

    $conn = new mysqli("localhost", "root", "", "muziekquiz");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO feedback_bug (name, email, feedback_type, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $_POST['name'], $_POST['email'], $_POST['feedback_type'], $_POST['message']);

    $stmt->execute();
    $stmt->close();
    $conn->close();

    $formSubmitted = true;
}
?>

<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback & Bugs - MuziekQuiz</title>
    <link rel="stylesheet" href="../CSS/feedbackRequest.css">
    <link rel="shortcut icon" href="../MEDIA/FAVICONS/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <meta name="msapplication-TileColor" content="#603cba">
    <meta name="theme-color" content="#ffffff">
</head>

<body>
    <button id="backButton"><i class="fas fa-arrow-left"></i> Home</button>
    <?php if ($formSubmitted): ?>
        <div id="submissionMessage" class="submission-message">
            <?php echo $submissionType; ?> verstuurd!
        </div>
    <?php endif; ?>
    <div class="form-container animate__animated animate__fadeIn animate__slow">
        <h1>Feedback & Bugs</h1>
        <p>Deel hier jouw feedback of meld een bug die je bent tegengekomen.</p>
        <form action="feedbackBug.php" method="post" class="feedback-form">
            <div class="row">
                <input type="text" name="name" placeholder="Naam" required>
                <input type="email" name="email" placeholder="E-mail" required>
            </div>
            <textarea name="message" placeholder="Jouw feedback of bug" required></textarea>
            <div class="container">
                <div class="tabs">
                    <input type="radio" id="radio-1" name="feedback_type" value="Feedback" checked="">
                    <label class="tab" for="radio-1">Feedback</label>
                    <input type="radio" id="radio-2" name="feedback_type" value="Bug">
                    <label class="tab" for="radio-2">Bug</label>
                    <span class="glider"></span>
                </div>
            </div>
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