const PasswordInput = document.getElementById("PasswordInput");
const EmailInput = document.getElementById("EmailInput");
const LoginButton = document.getElementById("LoginButton");
const LoginError = document.getElementById("LoginError");

const OpenRegisterModal = document.getElementById("OpenRegisterModal");
const CloseRegisterModal = document.getElementById("CloseRegisterModal");
const RegisterModal = document.getElementById("RegisterModal");

const RegisterName = document.getElementById("RegisterName");
const RegisterEmail = document.getElementById("RegisterEmail");
const RegisterPassword = document.getElementById("RegisterPassword");
const RegisterButton = document.getElementById("RegisterButton");
const RegisterError = document.getElementById("RegisterError");
const RegisterSuccess = document.getElementById("RegisterSuccess");

// --- Login ---

async function login() {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: EmailInput.value,
        password: PasswordInput.value,
    });

    if (error) {
        if (error.message.includes("Email not confirmed")) {
            LoginError.textContent = "Bitte bestätige zuerst deine E-Mail. ♡";
        } else {
            LoginError.textContent = "Hmm... das war wohl nicht unser Geheimnis. ♡";
        }
        PasswordInput.value = "";
        PasswordInput.focus();
        return;
    }

    window.location.href = "question.html";
}

LoginButton.addEventListener("click", login);

PasswordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        login();
    }
});

// --- Modal öffnen/schließen ---

OpenRegisterModal.addEventListener("click", function (event) {
    event.preventDefault();
    RegisterModal.classList.remove("hidden");
});

CloseRegisterModal.addEventListener("click", function () {
    RegisterModal.classList.add("hidden");
});

// --- Registrierung ---

async function register() {
    RegisterError.textContent = "";
    RegisterSuccess.textContent = "";

    if (!RegisterName.value || !RegisterEmail.value || !RegisterPassword.value) {
        RegisterError.textContent = "Bitte alle Felder ausfüllen.";
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: RegisterEmail.value,
        password: RegisterPassword.value,
        options: {
            data: { display_name: RegisterName.value }
        }
    });

    if (error) {
        RegisterError.textContent = error.message;
        return;
    }

    RegisterSuccess.textContent = "Fertig! Bitte E-Mail bestätigen und dann einloggen. ♡";
    RegisterName.value = "";
    RegisterEmail.value = "";
    RegisterPassword.value = "";
}

RegisterButton.addEventListener("click", register);