// Lobby muziek en onclick plaat geluidje
document.addEventListener("DOMContentLoaded", function () {
  if (
    document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("musiclobby="))
  ) {
    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("musiclobby=true"))
    ) {
      playmusic();
    } else {
    }
  } else {
    // Sweet alert voor muziek in lobby
    setTimeout(function () {
      Swal.fire({
        title: "Wil je muziek horen in de lobby?",
        text: "Deze keuze word onthouden. Rechts boven kan je dit aanpassen.",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Ja",
        denyButtonText: `Nee`,
        showClass: {
          popup: `
                        animate__animated
                        animate__tada
                        `,
        },
        hideClass: {
          popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                        `,
        },
      }).then((result) => {
        if (result.isConfirmed) {
          playmusic();
          document.cookie = "musiclobby=true";
        } else {
          document.cookie = "musiclobby=false";
        }
      });
    }, 1000);
  }
  let isSelectorClosed = true;
  // Onclick geluid voor Plaat
  let lpImage = document.querySelector(".lpplaat");
  if (lpImage) {
    lpImage.addEventListener("click", function (event) {
      event.stopPropagation();
      if (isSelectorClosed) {
        let clickSound = new Audio("MEDIA/SOUNDS/onclick.wav");
        clickSound.volume = 0.8;
        clickSound.play();
        openLobbySelector();
      }
    });
  }
});


// Muziek afspelen
let audio = new Audio("MEDIA/HOME/homescreen.mp3");

function playmusic() {
  audio.loop = true;
  audio.volume = 0.02;
  audio.play();
}

function toggleMusic() {
  if (audio.paused) {
    audio.play();
    document.getElementById('musicToggle').textContent = 'Pauzeer Muziek';
  } else {
    audio.pause();
    document.getElementById('musicToggle').textContent = 'Speel Muziek';
  }
}

// Animatie voor 'Arrow'
document.addEventListener("DOMContentLoaded", function () {
  setInterval(function () {
    let arrow = document.querySelector(".arrow");
    if (arrow) {
      arrow.classList.remove("custom-heartbeat");
      void arrow.offsetWidth;
      arrow.classList.add("custom-heartbeat");
    }
  }, 2350);
  document.getElementById('musicToggle').addEventListener('click', toggleMusic);
  const musicButton = document.getElementById('musicToggle');
  setInterval(() => {
    musicButton.classList.add('animate__animated', 'animate__pulse');
    musicButton.addEventListener('animationend', () => {
      musicButton.classList.remove('animate__animated', 'animate__pulse');
    }, { once: true }); 
  }, 2325);
});

//  Voor lobby selector
function openLobbySelector() {
  let selector = document.querySelector(".lobbyselector");
  selector.classList.remove("hide");
  selector.style.animation = "zoominup 0.5s forwards";
  isSelectorClosed = false;
  document.querySelector('.close-button').addEventListener('click', function () {
    closeLobbySelector();
  });
  window.addEventListener('click', outsideClickListener);
}

// functie voor sluiten menu door buiten de div te klikken
function outsideClickListener(event) {
  let selector = document.querySelector(".lobbyselector");
  let lobbyMessages = document.getElementById("lobbyMessages");
  let swalPopup = document.querySelector(".swal2-popup");

  // Controleer of de klik buiten de selector, niet binnen de lobbyMessages en niet binnen een SweetAlert popup plaatsvond
  if (!selector.contains(event.target) && !lobbyMessages.contains(event.target) && !(swalPopup && swalPopup.contains(event.target)) && !isSelectorClosed) {
    closeLobbySelector();
  }
}



// funcite voor sluiten menu
function closeLobbySelector() {
  if (!isSelectorClosed) { // Controleer de vlag voordat je sluit
    let selector = document.querySelector(".lobbyselector");
    selector.style.animation = 'zoomoutdown 0.5s forwards';

    let closeSound = new Audio("MEDIA/SOUNDS/onclose.wav");
    closeSound.play();

    setTimeout(() => {
      selector.classList.add("hide");
      isSelectorClosed = true;
      window.removeEventListener('click', outsideClickListener);
    }, 150);
  }
}

// Voor footer - sounds
document.querySelectorAll('.bottom-links a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    let audio = new Audio("MEDIA/SOUNDS/footerButtons.wav");
    audio.play();

    setTimeout(() => {
      window.location.href = this.getAttribute('href');
    }, 150);
  });
})



document.addEventListener('click', function (event) {
  if (event.target.matches('.close-button')) {
    closeLobbySelector();
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('lobbyfull')) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "De lobby zit vol",
      text: "Probeer het later opnieuw of maak zelf een lobby!",
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      urlParams.delete('lobbyfull');
      window.history.replaceState(null, null, "?" + urlParams.toString());
    });
  }
});

function updateLobbyUsers(users) {
    // Update elke speler div met de gebruikersgegevens of met standaardwaarden
    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById(`player${i}`);
        const img = playerDiv.querySelector('img');
        const p = playerDiv.querySelector('.player-name');

        if (users[i - 1]) {
            img.src = './MEDIA/AVATARS/avatar1.png'; // Zet dit naar de daadwerkelijke avatar van de gebruiker
            p.textContent = users[i - 1];
        } else {
            img.src = './MEDIA/AVATARS/default.png'; // Terug naar de standaard avatar als er geen gebruiker is
            p.textContent = '?';
        }
    }
    
}

// Control the volume of the music
document.getElementById('volumeControl').addEventListener('input', function() {
    audio.volume = this.value;
});


document.addEventListener("DOMContentLoaded", function () {
  // Geluid toevoegen aan de 'Nieuwe Lobby' knop
  const newLobbyButton = document.getElementById('newLobbyButton'); // Veronderstelt dat je knop een id heeft van 'newLobbyButton'
  if (newLobbyButton) {
      newLobbyButton.addEventListener('click', function() {
          const clickSound = new Audio("MEDIA/SOUNDS/onclick.wav");
          clickSound.play();
      });
  }

  // Geluid toevoegen aan de 'Join Lobby' knop
  const joinLobbyButton = document.getElementById('joinLobbyButton'); // Je hebt al een element met dit ID
  if (joinLobbyButton) {
      joinLobbyButton.addEventListener('click', function() {
          const clickSound = new Audio("MEDIA/SOUNDS/onclick.wav");
          clickSound.play();
      });
  }
});
