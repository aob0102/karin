// ============================================================
// Karin – Mode für Kinder | script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Mobile Navigation ----------
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });
    // Menü schließen, wenn ein Link geklickt wird
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Schatten unter der Navbar beim Scrollen
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ---------- 2. Scroll-Reveal-Animationen ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---------- 3. Live-Status: Geöffnet / Geschlossen ----------
  // Öffnungszeiten: [ [startMin, endMin], ... ] pro Wochentag (0 = Sonntag)
  const HOURS = {
    0: [],                                          // Sonntag
    1: [[540, 720], [870, 1080]],                   // Montag 9–12, 14:30–18
    2: [[540, 720], [870, 1080]],                   // Dienstag
    3: [[540, 720], [870, 1080]],                   // Mittwoch
    4: [[540, 720]],                                // Donnerstag 9–12
    5: [[540, 720], [870, 1080]],                   // Freitag
    6: [[540, 720]]                                 // Samstag 9–12
  };

  // Sommeröffnungszeiten: Mo & Di nur vormittags (13.07.–13.09.2026)
  const SUMMER = { start: '2026-07-13', end: '2026-09-13' };
  const SUMMER_HOURS = { 1: [[540, 720]], 2: [[540, 720]] };

  // Betriebsurlaub (jeweils inkl. Start- und Endtag)
  const VACATIONS = [
    { start: '2026-07-20', end: '2026-07-26', label: 'bis 26. Juli' },
    { start: '2026-08-19', end: '2026-08-29', label: 'bis 29. August' }
  ];

  // Einzelne zusätzliche Schließtage
  const CLOSED_DATES = ['2026-08-01'];

  function ymd(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function updateOpenStatus() {
    const now = new Date();
    const today = ymd(now);
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();

    const isSummer = today >= SUMMER.start && today <= SUMMER.end;
    const vacation = VACATIONS.find(v => today >= v.start && today <= v.end);
    const isClosedDate = CLOSED_DATES.includes(today);

    let todayHours = (isSummer && SUMMER_HOURS[day]) ? SUMMER_HOURS[day] : (HOURS[day] || []);
    if (vacation || isClosedDate) todayHours = [];

    const isOpen = todayHours.some(([start, end]) => mins >= start && mins < end);

    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    const pill = document.getElementById('status-pill');

    let statusText, pillText, pillClass;
    if (vacation) {
      statusText = 'Betriebsurlaub ' + vacation.label;
      pillText = '● Betriebsurlaub ' + vacation.label;
      pillClass = 'vacation';
    } else if (isOpen) {
      statusText = 'Jetzt geöffnet';
      pillText = '● Jetzt geöffnet';
      pillClass = 'open';
    } else {
      statusText = 'Derzeit geschlossen';
      pillText = '● Geschlossen';
      pillClass = 'closed';
    }

    if (dot && text) {
      dot.className = 'dot ' + (isOpen ? 'open' : 'closed');
      text.textContent = statusText;
    }
    if (pill) {
      pill.className = 'status-pill ' + pillClass;
      pill.textContent = pillText;
    }

    // Heutigen Tag in der Tabelle hervorheben
    document.querySelectorAll('#hours-table tr').forEach(tr => {
      tr.classList.toggle('today', Number(tr.dataset.day) === day);
    });

    // Während der Sommerzeit: Mo & Di in der Tabelle anpassen
    if (isSummer) {
      document.querySelectorAll('#hours-table tr').forEach(tr => {
        const d = Number(tr.dataset.day);
        if (SUMMER_HOURS[d]) tr.cells[1].innerHTML = '09:00–12:00 <span title="Sommeröffnungszeiten">☀️</span>';
      });
    }

    // Sommer-Banner nur anzeigen, solange die Infos aktuell sind
    const banner = document.getElementById('info-banner');
    if (banner) banner.hidden = today > SUMMER.end;
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  // ---------- 4. Größenberater ----------
  // EU-Konfektionsgrößen (entsprechen der Körpergröße in cm)
  const SIZES = [50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152];

  // Alters-Stufen (Index passend zum Slider 0–17)
  const AGE_STEPS = [
    { label: 'Neugeboren', height: 50 },
    { label: '1–2 Monate', height: 56 },
    { label: '3–4 Monate', height: 62 },
    { label: '5–6 Monate', height: 68 },
    { label: '7–9 Monate', height: 74 },
    { label: '10–12 Monate', height: 80 },
    { label: '18 Monate', height: 86 },
    { label: '2 Jahre', height: 92 },
    { label: '3 Jahre', height: 98 },
    { label: '4 Jahre', height: 104 },
    { label: '5 Jahre', height: 110 },
    { label: '6 Jahre', height: 116 },
    { label: '7 Jahre', height: 122 },
    { label: '8 Jahre', height: 128 },
    { label: '9 Jahre', height: 134 },
    { label: '10 Jahre', height: 140 },
    { label: '11 Jahre', height: 146 },
    { label: '12 Jahre', height: 152 }
  ];

  const tabAge = document.getElementById('tab-age');
  const tabHeight = document.getElementById('tab-height');
  const panelAge = document.getElementById('panel-age');
  const panelHeight = document.getElementById('panel-height');
  const ageSlider = document.getElementById('age-slider');
  const heightSlider = document.getElementById('height-slider');
  const ageLabel = document.getElementById('age-label');
  const heightLabel = document.getElementById('height-label');
  const sizeResult = document.getElementById('size-result');
  const sizeHintText = document.getElementById('size-hint-text');

  function sizeForHeight(cm) {
    return SIZES.find(s => cm <= s) || SIZES[SIZES.length - 1];
  }

  function ageLabelForSize(size) {
    const step = AGE_STEPS.find(a => a.height === size);
    return step ? step.label : '';
  }

  function showResult(size) {
    if (!sizeResult) return;
    sizeResult.textContent = size;
    const age = ageLabelForSize(size);
    sizeHintText.textContent = 'Gr. ' + size + (age ? ' – passt meist mit ca. ' + age.toLowerCase() + '.' : '.');
  }

  function updateFromAge() {
    const step = AGE_STEPS[Number(ageSlider.value)];
    ageLabel.textContent = step.label;
    showResult(step.height);
  }

  function updateFromHeight() {
    const cm = Number(heightSlider.value);
    heightLabel.textContent = cm + ' cm';
    showResult(sizeForHeight(cm));
  }

  if (tabAge && tabHeight && ageSlider && heightSlider) {
    tabAge.addEventListener('click', () => {
      tabAge.classList.add('active');
      tabHeight.classList.remove('active');
      panelAge.hidden = false;
      panelHeight.hidden = true;
      updateFromAge();
    });
    tabHeight.addEventListener('click', () => {
      tabHeight.classList.add('active');
      tabAge.classList.remove('active');
      panelHeight.hidden = false;
      panelAge.hidden = true;
      updateFromHeight();
    });
    ageSlider.addEventListener('input', updateFromAge);
    heightSlider.addEventListener('input', updateFromHeight);
    updateFromAge();
  }

  // ---------- 5. Karte (klick-zu-laden, DSGVO-freundlich) ----------
  const mapLoadBtn = document.getElementById('map-load-btn');
  const mapShell = document.getElementById('map-shell');

  if (mapLoadBtn && mapShell) {
    mapLoadBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      // OpenStreetMap-Einbettung – kein API-Key nötig
      iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=9.6385%2C47.2675%2C9.6545%2C47.2760&layer=mapnik&marker=47.27167%2C9.64649';
      iframe.title = 'Karte: Karin – Mode für Kinder, Ringstraße 44, Rankweil';
      iframe.loading = 'lazy';
      mapShell.innerHTML = '';
      mapShell.appendChild(iframe);
    });
  }

  // ---------- 6. Anfrage-Formular (mailto, ohne Server) ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const contact = document.getElementById('f-contact').value.trim();
      const topic = document.getElementById('f-topic').value;
      const message = document.getElementById('f-message').value.trim();

      const subject = 'Anfrage über die Website: ' + topic;
      const body =
        'Name: ' + name + '\n' +
        'Kontakt: ' + contact + '\n' +
        'Thema: ' + topic + '\n\n' +
        message;

      window.location.href = 'mailto:info@karin-kindermode.at' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }
});
