// script.js

// 1. Definiere initMap() GLOBAL!
// Diese Funktion wird von der Google Maps API aufgerufen, sobald sie geladen ist.
// Sie muss im globalen Geltungsbereich sein, damit der `callback=initMap`-Parameter funktioniert.
function initMap() {
    // Setze ein globales Flag, dass die API geladen ist.
    // Die eigentliche Karteninitialisierung erfolgt weiterhin beim Klick auf den Button.
    window.googleMapsApiLoaded = true; // Verwende window. für globale Zugänglichkeit
    console.log("Google Maps API loaded successfully by initMap callback.");
}

// 2. Deine anderen globalen Variablen
let mapInstance = null;

// 3. Der Rest deines Codes, der DOM-Elemente manipuliert,
// kommt in den DOMContentLoaded-Listener oder wird nach dem Body geladen.
// Da dein script-Tag jetzt am Ende des Bodys ist, ist DOMContentLoaded nicht zwingend,
// aber es ist eine gute Praxis für Robustheit.
document.addEventListener('DOMContentLoaded', function() {
    const mapButton = document.getElementById('map-button');
    const mapDiv = document.getElementById('map');

    if (mapButton && mapDiv) { // Zusätzliche Prüfung auf Existenz der Elemente
        mapButton.addEventListener('click', function() {
            // Schaltet die CSS-Klasse 'versteckt' um, um die Karte sichtbar zu machen oder zu verbergen.
            mapDiv.classList.toggle('versteckt');

            // Initialisiert die Google Map nur, wenn sie noch nicht geladen wurde UND die API bereit ist.
            // window.googleMapsApiLoaded stellt sicher, dass initMap bereits aufgerufen wurde.
            if (!mapDiv.dataset.initialized && window.googleMapsApiLoaded) {
                const location = { lat: 47.27167, lng: 9.64649 };
                const mapOptions = {
                    center: location,
                    zoom: 15
                };

                mapInstance = new google.maps.Map(mapDiv, mapOptions);

                new google.maps.Marker({
                    position: location,
                    map: mapInstance,
                    title: 'Karin – Mode für Kinder'
                });

                mapDiv.dataset.initialized = 'true';
                console.log("Map initialized after button click.");

                setTimeout(() => {
                    google.maps.event.trigger(mapInstance, 'resize');
                    mapInstance.setCenter(location);
                }, 300);
                
            } else if (mapDiv.dataset.initialized === 'true' && mapInstance) {
                // Wenn die Karte bereits initialisiert war und nur versteckt/angezeigt wurde
                if (!mapDiv.classList.contains('versteckt')) { // Nur resizen, wenn sie sichtbar wird
                    google.maps.event.trigger(mapInstance, 'resize');
                    mapInstance.setCenter(mapInstance.getCenter());
                    console.log("Map resized and re-centered.");
                }
            }
        });
    } else {
        console.error("Fehler: 'map-button' oder 'map' Element nicht gefunden.");
    }
});