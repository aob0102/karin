document.getElementById('map-button').addEventListener('click', function() {
  const mapDiv = document.getElementById('map');
  
  // Schaltet die CSS-Klasse 'versteckt' um, um die Karte sichtbar zu machen oder zu verbergen.
  mapDiv.classList.toggle('versteckt');
  
  // Initialisiert die Google Map nur, wenn sie noch nicht geladen wurde.
  if (!mapDiv.dataset.initialized) {
      
      // Definieren des Standorts: Ringstraße 44, 6830 Rankweil
      const location = { lat: 47.27167, lng: 9.64649 };
      
      // Konfiguration der Karte (Zentrum und Zoom-Level)
      const mapOptions = { 
          center: location, 
          zoom: 15 
      };

      // Erstellen der Google Map Instanz im "map" div
      const map = new google.maps.Map(mapDiv, mapOptions);

      // Hinzufügen eines Markers am genauen Standort
      new google.maps.Marker({
          position: location,
          map: map,
          title: 'Karin – Mode für Kinder'
      });

      // Kennzeichnet die Karte als initialisiert, um ein erneutes Laden zu verhindern
      mapDiv.dataset.initialized = true;
  }
});