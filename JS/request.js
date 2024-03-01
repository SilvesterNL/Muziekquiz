function playSoundAndNavigate(url) {
  let sound = new Audio("../MEDIA/SOUNDS/footerButtons.wav");
  sound.play();
  setTimeout(function() {
      window.location.href = url;
  }, 200);
}

document.getElementById('backButton').addEventListener('click', function(event) {
  event.preventDefault();
  playSoundAndNavigate('../index.html');
});

document.querySelectorAll('.bottom-links a').forEach(function(link) {
  link.addEventListener('click', function(event) {
      event.preventDefault();
      playSoundAndNavigate(this.getAttribute('href'));
  });
});
