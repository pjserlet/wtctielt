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

  // Routes (pagina Ritten): lijst uit routes/routes.js met GPX-download
  var routesList = document.getElementById('routes-list');
  var routes = window.WTC_ROUTES || [];
  if (routesList && routes.length) {
    routes.forEach(function (r) {
      if (!r || !r.naam || !r.bestand) return;
      var card = document.createElement('article');
      card.className = 'card route-card';

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

      routesList.appendChild(card);
    });
    var routesEmpty = document.getElementById('routes-empty');
    if (routesEmpty && routesList.children.length) routesEmpty.hidden = true;
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
