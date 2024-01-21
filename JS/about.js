document.getElementById('backButton').addEventListener('click', function() {
    let audio = new Audio('../MEDIA/SOUNDS/onclick.wav');
    audio.play();

    setTimeout(function() {
        window.location.href = '../index.php';
    }, 150);
});
