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
                // Submit the form
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
