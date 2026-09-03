const API_BASE_URL = "http://127.0.0.1:8000";

const PreviousButton = document.getElementById("PreviousButton");
const NextButton = document.getElementById("NextButton");
const AddButton = document.getElementById("AddButton");
const BackButton = document.getElementById("BackButton");
const FlipHint = document.getElementById("FlipHint");
const FileInput = document.getElementById("FileInput");
const AlbumImage = document.getElementById("AlbumImage");
const polaroidInner = document.querySelector(".polaroid-inner");
const polaroidBack = document.querySelector(".polaroid-back");
const Note = document.getElementById("Note");
const QuotesButton = document.getElementById("QuotesButton");
const ClickHint = document.getElementById("ClickHint");

let flipHintShown = false;
let currentPicture = 0;
let touchStartX = 0;
let touchEndX = 0;
let album = [];
let noteSaveTimeout = null;

// --- Hängt den Supabase-Token an jeden Request ---
async function fetchWithAuth(url, options = {}) {
    const { data } = await supabaseClient.auth.getSession();
    const token = data.session?.access_token;

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}

// --- Album aus der Datenbank laden ---
async function loadAlbum() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/album`);

        if (!response.ok) {
            console.error("Album konnte nicht geladen werden:", response.status);
            return;
        }

        album = await response.json();

        if (currentPicture >= album.length) {
            currentPicture = Math.max(album.length - 1, 0);
        }

        showPicture();
    } catch (error) {
        console.error("Fehler beim Laden des Albums:", error);
    }
}

function showPicture() {
    if (album.length === 0) {
        AlbumImage.src = "";
        Note.value = "";
        return;
    }

    AlbumImage.src = album[currentPicture].image;
    Note.value = album[currentPicture].note || "";

    polaroidInner.classList.remove("flipped");
    FlipHint.classList.add("hidden");
}

// --- Bild hochladen + Eintrag speichern ---
async function uploadAndSaveEntry(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabaseClient
        .storage
        .from("album-images")
        .upload(fileName, file);

    if (uploadError) {
        console.error("Upload fehlgeschlagen:", uploadError.message);
        alert("Bild konnte nicht hochgeladen werden. ♡");
        return;
    }

    const { data: urlData } = supabaseClient
        .storage
        .from("album-images")
        .getPublicUrl(fileName);

    const response = await fetchWithAuth(`${API_BASE_URL}/api/album`, {
        method: "POST",
        body: JSON.stringify({
            image: urlData.publicUrl,
            note: "",
        }),
    });

    if (!response.ok) {
        alert("Eintrag konnte nicht gespeichert werden. ♡");
        return;
    }

    await loadAlbum();
    currentPicture = album.length - 1;
    showPicture();

    AlbumImage.style.transform = "scale(1.03)";
    setTimeout(function () {
        AlbumImage.style.transform = "scale(1)";
    }, 300);
}

// --- Notiz speichern (mit kurzer Verzögerung, damit nicht bei jedem Tastendruck gesendet wird) ---
async function saveNote(entryId, noteText) {
    try {
        await fetchWithAuth(`${API_BASE_URL}/api/album/${entryId}`, {
            method: "PATCH",
            body: JSON.stringify({ note: noteText }),
        });
    } catch (error) {
        console.error("Notiz konnte nicht gespeichert werden:", error);
    }
}

// --- Events ---

AlbumImage.addEventListener("click", function () {
    polaroidInner.classList.add("flipped");
    ClickHint.classList.add("hidden");

    if (!flipHintShown) {
        FlipHint.textContent = "↑ Zum Umdrehen hier klicken ♡";
        FlipHint.classList.remove("hidden");
        flipHintShown = true;
    }
});

polaroidBack.addEventListener("click", function (event) {
    if (event.target !== Note) {
        polaroidInner.classList.remove("flipped");
        FlipHint.classList.add("hidden");
    }
});

Note.addEventListener("click", function (event) {
    event.stopPropagation();
});

Note.addEventListener("input", function () {
    if (album.length === 0) return;

    album[currentPicture].note = Note.value;
    const entryId = album[currentPicture].id;

    clearTimeout(noteSaveTimeout);
    noteSaveTimeout = setTimeout(function () {
        saveNote(entryId, Note.value);
    }, 600);
});

PreviousButton.addEventListener("click", function () {
    if (album.length === 0) return;

    currentPicture--;
    if (currentPicture < 0) {
        currentPicture = album.length - 1;
    }

    showPicture();
});

NextButton.addEventListener("click", function () {
    if (album.length === 0) return;

    currentPicture++;
    if (currentPicture >= album.length) {
        currentPicture = 0;
    }

    showPicture();
});

AddButton.addEventListener("click", function () {
    FileInput.click();
});

FileInput.addEventListener("change", async function (event) {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
        FileInput.value = "";
        return;
    }

    await uploadAndSaveEntry(file);
    FileInput.value = "";
});

QuotesButton.addEventListener("click", function () {
    window.location.href = "quotes.html";
});

BackButton.addEventListener("click", function () {
    window.location.href = "pleasure.html";
});

AlbumImage.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].screenX;
});

AlbumImage.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 50 || album.length === 0) {
        return;
    }

    if (swipeDistance < 0) {
        currentPicture++;
        if (currentPicture >= album.length) {
            currentPicture = 0;
        }
    } else {
        currentPicture--;
        if (currentPicture < 0) {
            currentPicture = album.length - 1;
        }
    }

    showPicture();
});

// --- Start: erst wenn Session bestätigt ist, Album laden ---
sessionPromise.then(function (session) {
    if (session) {
        loadAlbum();
    }
});