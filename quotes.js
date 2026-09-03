const QuoteInput =
    document.getElementById("QuoteInput");

const QuoteAuthor =
    document.getElementById("QuoteAuthor");

const AddQuoteButton =
    document.getElementById("AddQuoteButton");

const QuotesList =
    document.getElementById("QuotesList");

const BackToAlbum =
    document.getElementById("BackToAlbum");


// =========================================
// ZITATE LADEN
// =========================================

let quotes = JSON.parse(
    localStorage.getItem("quotes")
) || [];


// =========================================
// ZITATE SPEICHERN
// =========================================

function saveQuotes() {

    localStorage.setItem(
        "quotes",
        JSON.stringify(quotes)
    );

}


// =========================================
// ZITATE ANZEIGEN
// =========================================

function showQuotes() {

    QuotesList.innerHTML = "";


    if (quotes.length === 0) {

        const empty = document.createElement("p");

        empty.className = "no-quotes";

        empty.textContent =
            "Hier gibt es noch keine Insider... ♡";

        QuotesList.appendChild(empty);

        return;
    }


    quotes.forEach(function(quote, index) {

        const card =
            document.createElement("div");

        card.className = "quote-card";


        const icon =
            document.createElement("span");

        icon.className = "quote-icon";

        icon.textContent = "“";


        const text =
            document.createElement("p");

        text.textContent =
            quote.text;


        const author =
            document.createElement("small");

        if (quote.author) {

            author.textContent =
                "— " + quote.author;

        } else {

            author.textContent =
                "♡";

        }


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-quote";

        deleteButton.textContent =
            "×";


        deleteButton.addEventListener(
            "click",
            function() {

                quotes.splice(index, 1);

                saveQuotes();

                showQuotes();

            }
        );


        card.appendChild(icon);

        card.appendChild(text);

        card.appendChild(author);

        card.appendChild(deleteButton);

        QuotesList.appendChild(card);

    });

}


// =========================================
// ZITAT HINZUFÜGEN
// =========================================

AddQuoteButton.addEventListener(
    "click",
    function() {

        const text =
            QuoteInput.value.trim();

        const author =
            QuoteAuthor.value.trim();


        if (!text) {

            QuoteInput.focus();

            return;
        }


        quotes.push({

            text: text,

            author: author

        });


        saveQuotes();

        showQuotes();


        QuoteInput.value = "";

        QuoteAuthor.value = "";

        QuoteInput.focus();

    }
);


// =========================================
// ZURÜCK ZUM ALBUM
// =========================================

BackToAlbum.addEventListener(
    "click",
    function() {

        window.location.href =
            "album.html";

    }
);


// =========================================
// START
// =========================================

showQuotes();