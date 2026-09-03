const API_BASE_URL = "http://127.0.0.1:8000";

const QuoteInput = document.getElementById("QuoteInput");
const QuoteAuthor = document.getElementById("QuoteAuthor");
const AddQuoteButton = document.getElementById("AddQuoteButton");
const QuotesList = document.getElementById("QuotesList");
const BackToAlbum = document.getElementById("BackToAlbum");
const VisibilityLabel = document.getElementById("VisibilityLabel");
const ParentOnlyCheckbox = document.getElementById("ParentOnlyCheckbox");

let currentRole = null;

// --- Token an jeden Request hängen ---
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

// --- Eigene Rolle laden, um Checkbox ggf. anzuzeigen ---
async function loadOwnRole() {
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user?.id;

    const { data: profile, error } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (!error && profile) {
        currentRole = profile.role;

        if (currentRole === "parent") {
            VisibilityLabel.classList.remove("hidden");
        }
    }
}

// --- Zitate von der API laden ---
async function loadQuotes() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/quotes`);

        if (!response.ok) {
            console.error("Zitate konnten nicht geladen werden:", response.status);
            return;
        }

        const quotes = await response.json();
        showQuotes(quotes);
    } catch (error) {
        console.error("Fehler beim Laden der Zitate:", error);
    }
}

function showQuotes(quotes) {
    QuotesList.innerHTML = "";

    if (quotes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "no-quotes";
        empty.textContent = "Hier gibt es noch keine Insider... ♡";
        QuotesList.appendChild(empty);
        return;
    }

    quotes.forEach(function (quote) {
        const card = document.createElement("div");
        card.className = "quote-card";

        const icon = document.createElement("span");
        icon.className = "quote-icon";
        icon.textContent = "“";

        const text = document.createElement("p");
        text.textContent = quote.text;

        const author = document.createElement("small");
        author.textContent = quote.author ? "— " + quote.author : "♡";

        // kleines Schloss-Symbol bei "nur Eltern"-Zitaten
        if (quote.visibility === "parent") {
            const lock = document.createElement("span");
            lock.textContent = " 🔒";
            author.appendChild(lock);
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-quote";
        deleteButton.textContent = "×";

        deleteButton.addEventListener("click", async function () {
            try {
                await fetchWithAuth(`${API_BASE_URL}/api/quotes/${quote.id}`, {
                    method: "DELETE",
                });
                loadQuotes();
            } catch (error) {
                console.error("Löschen fehlgeschlagen:", error);
            }
        });

        card.appendChild(icon);
        card.appendChild(text);
        card.appendChild(author);
        card.appendChild(deleteButton);
        QuotesList.appendChild(card);
    });
}

// --- Zitat hinzufügen ---
AddQuoteButton.addEventListener("click", async function () {
    const text = QuoteInput.value.trim();
    const author = QuoteAuthor.value.trim();

    if (!text) {
        QuoteInput.focus();
        return;
    }

    const visibility = ParentOnlyCheckbox.checked ? "parent" : "all";

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/quotes`, {
            method: "POST",
            body: JSON.stringify({ text, author, visibility }),
        });

        if (!response.ok) {
            alert("Zitat konnte nicht gespeichert werden. ♡");
            return;
        }

        QuoteInput.value = "";
        QuoteAuthor.value = "";
        ParentOnlyCheckbox.checked = false;
        QuoteInput.focus();

        loadQuotes();
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
    }
});

BackToAlbum.addEventListener("click", function () {
    window.location.href = "album.html";
});

// --- Start: erst wenn Session bestätigt ist ---
sessionPromise.then(function (session) {
    if (session) {
        loadOwnRole().then(loadQuotes);
    }
});