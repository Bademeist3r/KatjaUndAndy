const BackButton = document.getElementById("BackButton");
const ImgButton = document.getElementById("ImgButton");
const timerElement = document.getElementById("timer");
const togetherElement = document.getElementById("together");

BackButton.addEventListener("click", function() {
    window.location.href = "question.html";
});

ImgButton.addEventListener("click", function() {
    window.location.href = "album.html";
});

const startTime = new Date(2026, 4, 29, 11, 50, 0);

let dots = 0;

function updateTimer() {
    const now = new Date();

    let years = now.getFullYear() - startTime.getFullYear();
    let months = now.getMonth() - startTime.getMonth();
    let days = now.getDate() - startTime.getDate();
    let hours = now.getHours() - startTime.getHours();
    let minutes = now.getMinutes() - startTime.getMinutes();
    let seconds = now.getSeconds() - startTime.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }

    if (minutes < 0) {
        minutes += 60;
        hours--;
    }

    if (hours < 0) {
        hours += 24;
        days--;
    }

    if (days < 0) {
        months--;

        const previousMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        );

        days += previousMonth.getDate();
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    const parts = [];

    if (years > 0) {
        parts.push(
            years + (years === 1 ? " Jahr" : " Jahre")
        );
    }

    if (months > 0) {
        parts.push(
            months + (months === 1 ? " Monat" : " Monate")
        );
    }

    if (days > 0) {
        parts.push(
            days + (days === 1 ? " Tag" : " Tage")
        );
    }

    parts.push(
        hours + (hours === 1 ? " Stunde" : " Stunden")
    );

    parts.push(
        minutes + (minutes === 1 ? " Minute" : " Minuten")
    );

    parts.push(
        seconds + (seconds === 1 ? " Sekunde" : " Sekunden")
    );

    let text = "Wir sind seit ";

    if (parts.length === 1) {
        text += parts[0];
    } else if (parts.length === 2) {
        text += parts[0] + " und " + parts[1];
    } else {
        text += parts.slice(0, -1).join(", ");
        text += " und " + parts[parts.length - 1];
    }

    dots++;

    if (dots > 3) {
        dots = 1;
    }

    let loadingDots = "";

    for (let i = 0; i < dots; i++) {
        loadingDots += ".";
    }

    timerElement.textContent = text + " verheiratet";

    togetherElement.textContent =
        "Seit dem " +
        startTime.toLocaleDateString("de-DE") +
        " um 11:50 Uhr\n" +
        "Loading" +
        loadingDots;
}

updateTimer();
setInterval(updateTimer, 1000);