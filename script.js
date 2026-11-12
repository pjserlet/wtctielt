// WTC Tielt — minimal interactivity
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Sluit menu' : 'Open menu');
    });

    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Routes (pagina Ritten): per groep uit routes/routes.js, met GPX-download
  var routesList = document.getElementById('routes-list');
  if (routesList) {
    var routeGroups = ['A & B', 'B1', 'C'];
    var routes = (window.WTC_ROUTES || []).filter(function (r) { return r && r.naam && r.bestand; });

    // Kleine kaart van het GPX-bestand (Leaflet + OpenStreetMap)
    var routeMap = function (mapEl, url) {
      if (!window.L || !window.fetch || !window.DOMParser) return;
      fetch(url)
        .then(function (res) { if (!res.ok) throw new Error(res.status); return res.text(); })
        .then(function (text) {
          var xml = new DOMParser().parseFromString(text, 'application/xml');
          var nodes = xml.getElementsByTagName('trkpt');
          if (!nodes.length) nodes = xml.getElementsByTagName('rtept');
          var points = [];
          for (var i = 0; i < nodes.length; i++) {
            var lat = parseFloat(nodes[i].getAttribute('lat'));
            var lon = parseFloat(nodes[i].getAttribute('lon'));
            if (!isNaN(lat) && !isNaN(lon)) points.push([lat, lon]);
          }
          if (points.length < 2) return;

          mapEl.hidden = false;
          var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false, zoomSnap: 0.25 });
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          var line = L.polyline(points, { color: '#0057ff', weight: 3 }).addTo(map);
          L.circleMarker(points[0], { radius: 5, color: '#fff', weight: 2, fillColor: '#0057ff', fillOpacity: 1 }).addTo(map);
          map.fitBounds(line.getBounds(), { paddingTopLeft: [12, 12], paddingBottomRight: [12, 26] });
        })
        .catch(function () { mapEl.hidden = true; });
    };

    var routeCard = function (r) {
      var card = document.createElement('article');
      card.className = 'card route-card';

      var mapEl = document.createElement('div');
      mapEl.className = 'route-map';
      mapEl.hidden = true;
      card.appendChild(mapEl);
      routeMap(mapEl, 'routes/' + encodeURIComponent(r.bestand));

      var title = document.createElement('h3');
      title.textContent = r.naam;
      card.appendChild(title);

      var meta = [r.afstand, r.hoogtemeters].filter(Boolean).join(' · ');
      if (meta) {
        var metaEl = document.createElement('p');
        metaEl.className = 'muted';
        metaEl.textContent = meta;
        card.appendChild(metaEl);
      }

      if (r.omschrijving) {
        var desc = document.createElement('p');
        desc.textContent = r.omschrijving;
        card.appendChild(desc);
      }

      var link = document.createElement('a');
      link.className = 'btn btn-primary btn-sm';
      link.href = 'routes/' + encodeURIComponent(r.bestand);
      link.setAttribute('download', r.bestand);
      link.textContent = 'Download GPX';
      card.appendChild(link);
      return card;
    };

    var routeGroup = function (heading, items) {
      var wrap = document.createElement('div');
      wrap.className = 'route-group';
      var h = document.createElement('h3');
      h.className = 'route-group-title';
      h.textContent = heading;
      wrap.appendChild(h);
      if (items.length) {
        var grid = document.createElement('div');
        grid.className = 'route-group-list';
        items.forEach(function (r) { grid.appendChild(routeCard(r)); });
        wrap.appendChild(grid);
      } else {
        var empty = document.createElement('p');
        empty.className = 'muted';
        empty.textContent = 'Nog geen route voor deze groep.';
        wrap.appendChild(empty);
      }
      routesList.appendChild(wrap);
    };

    routeGroups.forEach(function (g) {
      routeGroup('Groep ' + g, routes.filter(function (r) { return r.groep === g; }));
    });
    var others = routes.filter(function (r) { return routeGroups.indexOf(r.groep) === -1; });
    if (others.length) routeGroup('Andere routes', others);
  }

  // Evenementen uit events.js: volledige lijst op Kalender, eerste drie op Home
  var events = (window.WTC_EVENTS || []).filter(function (e) { return e && e.titel; });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function eventDate(e, big) {
    var date = el('div', big ? 'event-date big' : 'event-date');
    date.appendChild(el('span', '', e.dag || '?'));
    date.appendChild(document.createTextNode(e.maand || ''));
    return date;
  }

  // Agendabestand (.ics) voor een evenement met een volledige datum.
  // Tijden zijn Belgische tijd en worden naar UTC omgezet, los van de
  // tijdzone van de bezoeker.
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function lastSundayUtc(year, month) {            // month: 0-11, om 01:00 UTC
    var d = new Date(Date.UTC(year, month + 1, 0, 1));
    d.setUTCDate(d.getUTCDate() - d.getUTCDay());
    return d.getTime();
  }

  function belgianToUtc(y, m, d, hh, mm) {
    var wall = Date.UTC(y, m - 1, d, hh, mm);
    var winter = wall - 3600000;                   // als UTC+1
    var summer = winter >= lastSundayUtc(y, 2) && winter < lastSundayUtc(y, 9);
    return new Date(wall - (summer ? 2 : 1) * 3600000);
  }

  function icsStamp(date) {
    return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + 'T' +
      pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + 'Z';
  }

  function icsText(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }

  function icsFold(line) {
    var out = [];
    while (line.length > 70) { out.push(line.slice(0, 70)); line = ' ' + line.slice(70); }
    out.push(line);
    return out.join('\r\n');
  }

  function eventIcs(e) {
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.datum || '');
    if (!dm) return null;
    var y = +dm[1], m = +dm[2], d = +dm[3];
    var tm = /^(\d{1,2}):(\d{2})$/.exec(e.uur || '');
    var slug = e.titel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WTC Tielt Sportief//Kalender//NL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + e.datum + '-' + slug + '@wtctielt',
      'DTSTAMP:' + icsStamp(new Date())
    ];
    if (tm) {
      var start = belgianToUtc(y, m, d, +tm[1], +tm[2]);
      var hours = Number(e.duur) > 0 ? Number(e.duur) : 3;
      lines.push('DTSTART:' + icsStamp(start));
      lines.push('DTEND:' + icsStamp(new Date(start.getTime() + hours * 3600000)));
    } else {
      var next = new Date(Date.UTC(y, m - 1, d + 1));
      lines.push('DTSTART;VALUE=DATE:' + dm[1] + dm[2] + dm[3]);
      lines.push('DTEND;VALUE=DATE:' + next.getUTCFullYear() + pad(next.getUTCMonth() + 1) + pad(next.getUTCDate()));
    }
    lines.push('SUMMARY:' + icsText('WTC Tielt: ' + e.titel));
    if (e.plaats) lines.push('LOCATION:' + icsText(e.plaats));
    if (e.omschrijving) lines.push('DESCRIPTION:' + icsText(e.omschrijving));
    lines.push('END:VEVENT', 'END:VCALENDAR');
    return { name: 'wtc-tielt-' + slug + '.ics', text: lines.map(icsFold).join('\r\n') + '\r\n' };
  }

  var eventsList = document.getElementById('events-list');
  if (eventsList) {
    events.forEach(function (e) {
      var row = el('article', 'event-row');
      row.appendChild(eventDate(e, true));
      var body = el('div', 'event-body');
      body.appendChild(el('h3', '', e.titel));
      if (e.info) body.appendChild(el('p', 'muted', e.info));
      if (e.omschrijving) body.appendChild(el('p', '', e.omschrijving));
      var ics = eventIcs(e);
      if (ics) {
        var add = el('a', 'btn btn-outline btn-sm event-ics', 'Zet in agenda');
        add.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics.text);
        add.setAttribute('download', ics.name);
        body.appendChild(add);
      }
      row.appendChild(body);
      if (e.tag) {
        var kleur = ['blue', 'yellow', 'green'].indexOf(e.kleur) > -1 ? e.kleur : 'blue';
        row.appendChild(el('span', 'badge badge-' + kleur, e.tag));
      }
      eventsList.appendChild(row);
    });
  }

  var eventsPreview = document.getElementById('events-preview');
  if (eventsPreview) {
    events.slice(0, 3).forEach(function (e) {
      var card = el('article', 'event-card');
      card.appendChild(eventDate(e, false));
      card.appendChild(el('h3', '', e.titel));
      if (e.info) card.appendChild(el('p', 'muted', e.info));
      if (e.omschrijving) card.appendChild(el('p', '', e.omschrijving));
      var cardIcs = eventIcs(e);
      if (cardIcs) {
        var cardAdd = el('a', 'btn btn-outline btn-sm event-ics', 'Zet in agenda');
        cardAdd.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(cardIcs.text);
        cardAdd.setAttribute('download', cardIcs.name);
        card.appendChild(cardAdd);
      }
      eventsPreview.appendChild(card);
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
