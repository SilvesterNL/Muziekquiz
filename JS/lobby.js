function openusernamesel() {
    Swal.fire({
        title: 'Kies een naam',
        html: `
            <form id="usernameselect" method="POST">
                <input type="hidden" name="action" value="usernamecreate">
                <input name="username" required id="swal-input1" class="swal2-input">
            </form>`,
        focusConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        preConfirm: () => {
            const inputElement = document.getElementById('swal-input1');
            if (inputElement.value === '') {
                Swal.showValidationMessage(`Naam mag niet leeg zijn`);
            } else {
                document.getElementById('usernameselect').submit();
                return inputElement.value;
            }
        }
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Je naam is gekozen!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

setInterval(() => {
    fetch('../PHP/heartbeatcheck.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}, 10000);

function updatePlayerSlot(slotId, playerName) {
  const slot = document.getElementById(slotId);
  slot.classList.add('filled');
  slot.querySelector('span').textContent = playerName;
  slot.querySelector('span').style.display = 'block';
}

function updateLobby() {
    $.ajax({
        url: '../PHP/get_lobby_info.php', // Zorg ervoor dat dit pad correct is
        type: 'GET',
        dataType: 'json', // Verwacht een JSON-respons
        success: function(players) {
            // Maak de bestaande lobby-inhoud leeg
            $('.lobby-container').empty();

            // Ga door elke speler en voeg deze toe aan de lobby-container
            players.forEach(function(player, index) {
                $('.lobby-container').append(
                    $('<div>').addClass('player-slot' + (player ? ' filled' : '')).append(
                        $('<span>').text(player ? player : 'Wachten op speler...')
                    )
                );
            });
        }
    });
}

// Voer updateLobby eenmaal uit bij het laden van de pagina en daarna elke 2.5 seconden
$(document).ready(function() {
    updateLobby();
    setInterval(updateLobby, 2500);
});


