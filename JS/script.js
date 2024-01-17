document.addEventListener('DOMContentLoaded', function() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('musiclobby='))) {
        if (document.cookie.split(';').some((item) => item.trim().startsWith('musiclobby=true'))) {
            playmusic();
        } else {
            
        }
    } else {
        setTimeout(function() {
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
                    `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    playmusic();
                    document.cookie = "musiclobby=true"; 
                } else {
                    document.cookie = "musiclobby=false";
                }
            });
        }, 1000); 
    }});
    

function playmusic() {
    let audio = new Audio('MEDIA/HOME/homescreen.mp3');
    audio.loop = true;
    audio.volume = 0.02;
    audio.play();
}


