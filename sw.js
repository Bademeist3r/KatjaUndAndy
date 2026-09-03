const CACHE_NAME = "unsere-erinnerungen-v1";

const FILES = [
    "question.html",
    "pleasure.html",
    "album.html",
    "quotes.html",
    "style.css",
    "question.js",
    "pleasure.js",
    "album.js",
    "quotes.js",
    "pics/20260803_20.12.png",
    "pics/20260803_19.53_Eis.png",
    "pics/20260726_16.39_Lago_Maggiore.png",
    "pics/20260730_19.58_Savona.png",
    "pics/20260801_17.32Lago_di_Como.png",
    "pics/20260802_12.51_Villa_del_Balbianello.png",
    "pics/20260802_14.18.png",
    "pics/20260802_18.50.png"
]


self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME).then(function(cache) {

            return cache.addAll(FILES);

        })

    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request).then(function(response) {

            return response ||
                fetch(event.request);

        })

    );

});