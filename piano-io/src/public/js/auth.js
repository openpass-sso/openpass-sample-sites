window.addEventListener("load", function() {
    const signoutButton = document.getElementById("openpass-signout");

    if (tp.pianoId.isUserValid()) {
        signoutButton.style.display = "block";
    }

    signoutButton.addEventListener("click", () => {
        tp.pianoId.logout(function () {
            if (location.pathname == "/") {
                location.reload();
            } else {
                document.location.href = "/";
            }
        });
    });
});
