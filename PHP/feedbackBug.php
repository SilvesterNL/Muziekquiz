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
        <div id="submissionMessage" class="submission-message">Feedback verstuurd!</div>
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
            <div class="radio-form">
                <input checked="" value="Feedback" name="feedback_type" type="radio" id="a">
                <label for="a"><span></span>Feedback</label>
                <input value="Bug" name="feedback_type" type="radio" id="b">
                <label for="b"><span></span>Bug</label>
                <div class="worm">
                    <div class="worm__segment"></div>
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