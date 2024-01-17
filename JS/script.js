document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        Swal.fire({
            title: "Wil je muziek horen in de lobby?",
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
            }
        });
    }, 1000); 
});


function playmusic() {
    let audio = new Audio('MEDIA/HOME/homescreen.mp3');
    audio.loop = true;
    audio.volume = 0.02;
    audio.play();

}
