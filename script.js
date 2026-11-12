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
          var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false });
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

  var eventsList = document.getElementById('events-list');
  if (eventsList) {
    events.forEach(function (e) {
      var row = el('article', 'event-row');
      row.appendChild(eventDate(e, true));
      var body = el('div', 'event-body');
      body.appendChild(el('h3', '', e.titel));
      if (e.info) body.appendChild(el('p', 'muted', e.info));
      if (e.omschrijving) body.appendChild(el('p', '', e.omschrijving));
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
      eventsPreview.appendChild(card);
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
