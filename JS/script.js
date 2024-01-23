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
  // Onclick geluid voor Plaat
  let lpImage = document.querySelector(".lpplaat");
  if (lpImage) {
    lpImage.addEventListener("click", function (event) {
      event.stopPropagation();
      let clickSound = new Audio("MEDIA/SOUNDS/onclick.wav");
      clickSound.volume = 0.5;
      clickSound.play();
      openlobbyselector();
    });
  }
});

// Muziek afspelen
function playmusic() {
  let audio = new Audio("MEDIA/HOME/homescreen.mp3");
  audio.loop = true;
  audio.volume = 0.02;
  audio.play();
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
});

//  Voor lobby selector
function openlobbyselector() {
  let selector = document.querySelector(".lobbyselector");
  selector.classList.remove("hide");
  selector.style.animation = "zoominup 0.5s forwards";
  document.querySelector('.close-button').addEventListener('click', closeLobbySelector);
  window.addEventListener('click', outsideClickListener);
}

function outsideClickListener(event) {
  let selector = document.querySelector(".lobbyselector");
  if (!selector.contains(event.target)) {
    closeLobbySelector();
    window.removeEventListener('click', outsideClickListener); 
  }
}

function closeLobbySelector() {
  let selector = document.querySelector(".lobbyselector");
  selector.style.animation = 'zoomoutdown 0.5s forwards';

  let closeSound = new Audio("MEDIA/SOUNDS/onclose.wav");
  closeSound.volume = 1;
  closeSound.play();
  
  setTimeout(() => {
    selector.classList.add("hide");
  }, 500); 
}

// Voor footer - sounds
document.querySelectorAll('.bottom-links a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    let audio = new Audio("MEDIA/SOUNDS/footerButtons.wav");
    audio.play();

    setTimeout(() => {
      window.location.href = this.getAttribute('href');
    }, 200);
  });
})
