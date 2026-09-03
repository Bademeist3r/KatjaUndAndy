if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

const noButton = document.getElementById("NoButton");

function moveNoButton() {

    const maxX = window.innerWidth - noButton.offsetWidth;
    const maxY = window.innerHeight - noButton.offsetHeight;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noButton.style.position = "fixed";
    noButton.style.left = newX + "px";
    noButton.style.top = newY + "px";
}

noButton.addEventListener("mouseover", function() {
    moveNoButton();
});

noButton.addEventListener("click", function() {
    moveNoButton();
});


// =========================
// JA BUTTON
// =========================

const yesButton = document.getElementById("YesButton");

yesButton.addEventListener("click", function() {

    // =====================================
    // STARTZEIT SPEICHERN
    // =====================================

    localStorage.setItem(
        "startTime",
        new Date().toISOString()
    );


    // =====================================
    // HERZEN / KONFETTI
    // =====================================

    const symbols = [
        "♡",
        "♥",
        "♡",
        "✦",
        "♥",
        "♡"
    ];

    const colors = [
        "#9bbb83",
        "#e39a78",
        "#f5d6b3",
        "#fff3d6",
        "#d8bfa8",
        "#f4b6a6",
        "#b8c9a8"
    ];

    for (let i = 0; i < 80; i++) {

        const particle = document.createElement("div");

        const angle = Math.random() * 2 * Math.PI;
        const distance = 250 + Math.random() * 650;

        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        const size = 12 + Math.random() * 18;

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.position = "fixed";

        particle.style.left =
            (window.innerWidth / 2) + "px";

        particle.style.top =
            (window.innerHeight / 2) + "px";

        particle.style.fontSize =
            size + "px";

        particle.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        particle.style.pointerEvents = "none";

        particle.style.zIndex = "1000";

        particle.style.transition =
            "all 1.5s cubic-bezier(0.2, 0.8, 0.3, 1)";

        particle.style.opacity = "1";

        document.body.appendChild(particle);


        setTimeout(function() {

            particle.style.left =
                (window.innerWidth / 2 + targetX) + "px";

            particle.style.top =
                (window.innerHeight / 2 + targetY) + "px";

            particle.style.transform =
                "rotate(" + (Math.random() * 720 - 360) + "deg) scale(0.5)";

            particle.style.opacity = "0";

        }, 10);


        setTimeout(function() {
            particle.remove();
        }, 1500);
    }


    // =====================================
    // KLEINE NACHRICHT
    // =====================================

    const message = document.createElement("div");

    message.className = "yes-message";
    message.textContent = "Ich wusste es. ♡";

    document.body.appendChild(message);


    // =====================================
    // WEITER
    // =====================================

    setTimeout(function() {
        window.location.href = "pleasure.html";
    }, 1800);

});