const PasswordInput =
    document.getElementById("PasswordInput");

const LoginButton =
    document.getElementById("LoginButton");

const LoginError =
    document.getElementById("LoginError");

const PASSWORD = "123";

function login() {

    if (PasswordInput.value === PASSWORD) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href = "question.html";

    } else {

        LoginError.textContent =
            "Hmm... das war wohl nicht unser Geheimnis. ♡";

        PasswordInput.value = "";
        PasswordInput.focus();
    }
}

LoginButton.addEventListener(
    "click",
    login
);

PasswordInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            login();
        }

    }
);