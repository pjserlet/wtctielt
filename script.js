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

    var routeGroup = function (heading, items, target, emptyText) {
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
        empty.textContent = emptyText || 'Nog geen route voor deze groep.';
        wrap.appendChild(empty);
      }
      target.appendChild(wrap);
    };

    var renderGroups = function (items, target, emptyText) {
      routeGroups.forEach(function (g) {
        routeGroup('Groep ' + g, items.filter(function (r) { return r.groep === g; }), target, emptyText);
      });
      var others = items.filter(function (r) { return routeGroups.indexOf(r.groep) === -1; });
      if (others.length) routeGroup('Andere routes', others, target);
    };

    // Ritdagen (routes/routes.js: WTC_RITDAGEN): per zondag de routes van elke groep
    var dagen = (window.WTC_RITDAGEN || []).slice().sort();
    if (dagen.length) {
      var maanden = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
      var dagNamen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
      var parse = function (iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
      var vandaag = new Date(); vandaag.setHours(0, 0, 0, 0);
      var start = dagen.filter(function (d) { return parse(d) >= vandaag; })[0] || dagen[dagen.length - 1];

      var heading = document.getElementById('routes-heading');
      var eerste = parse(dagen[0]), laatste = parse(dagen[dagen.length - 1]);
      if (heading && eerste.getMonth() === laatste.getMonth() && eerste.getFullYear() === laatste.getFullYear()) {
        heading.textContent = 'Routes ' + maanden[eerste.getMonth()] + ' ' + eerste.getFullYear();
      }

      var tabs = document.createElement('div');
      tabs.className = 'ride-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Kies een ritdag');
      routesList.parentNode.insertBefore(tabs, routesList);

      var dateTitle = document.createElement('p');
      dateTitle.className = 'ride-date-title';
      routesList.parentNode.insertBefore(dateTitle, routesList);

      var toon = function (iso) {
        var d = parse(iso);
        dateTitle.textContent = dagNamen[d.getDay()].charAt(0).toUpperCase() + dagNamen[d.getDay()].slice(1) + ' ' + d.getDate() + ' ' + maanden[d.getMonth()] + ' ' + d.getFullYear();
        tabs.querySelectorAll('button').forEach(function (b) {
          var actief = b.getAttribute('data-dag') === iso;
          b.classList.toggle('is-active', actief);
          b.setAttribute('aria-selected', actief ? 'true' : 'false');
        });
        routesList.innerHTML = '';
        renderGroups(routes.filter(function (r) { return r.datum === iso; }), routesList, 'Route volgt nog.');
      };

      dagen.forEach(function (iso) {
        var d = parse(iso);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ride-tab';
        b.setAttribute('role', 'tab');
        b.setAttribute('data-dag', iso);
        b.innerHTML = '<span class="ride-tab-day">' + dagNamen[d.getDay()].slice(0, 2) + '</span>' +
          '<span class="ride-tab-date">' + d.getDate() + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '</span>';
        b.addEventListener('click', function () { toon(iso); });
        tabs.appendChild(b);
      });
      toon(start);

      // Routes zonder datum blijven zichtbaar onder de ritdagen
      var los = routes.filter(function (r) { return !r.datum || dagen.indexOf(r.datum) === -1; });
      if (los.length) {
        var losTitle = document.createElement('h3');
        losTitle.className = 'ride-extra-title';
        losTitle.textContent = 'Andere routes';
        var losGrid = document.createElement('div');
        losGrid.className = 'grid grid-3';
        routesList.parentNode.appendChild(losTitle);
        routesList.parentNode.appendChild(losGrid);
        renderGroups(los, losGrid);
      }
    } else {
      renderGroups(routes, routesList);
    }
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

  // Nieuwsbrief: berichten + archief
  var newsList = document.getElementById('news-list');
  var newsArchive = document.getElementById('news-archive');
  var newsLatest = document.getElementById('news-latest');
  if (newsList || newsArchive || newsLatest) {
    var nl = window.WTC_NEWSLETTER || {};
    var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    // Tekst van een bericht: lege regel = nieuwe alinea, regels met "- " = opsomming
    // (inspringen met twee spaties = subpunt), een regel vlak boven een opsomming = tussentitel.
    // Mailadressen worden aanklikbaar.
    var inlineText = function (node, text) {
      text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/).forEach(function (part, i) {
        if (i % 2) {
          var a = el('a', '', part);
          a.href = 'mailto:' + part;
          node.appendChild(a);
        } else if (part) {
          node.appendChild(document.createTextNode(part));
        }
      });
      return node;
    };
    var renderBlock = function (block, target) {
      var lines = block.split('\n').filter(function (l) { return l.trim(); });
      var isItem = function (l) { return /^\s*[-*]\s+/.test(l); };
      var i = 0;
      while (i < lines.length) {
        if (!isItem(lines[i])) {
          var plain = [];
          while (i < lines.length && !isItem(lines[i])) plain.push(lines[i++].trim());
          var tag = i < lines.length && plain.length === 1 ? 'h4' : 'p';
          target.appendChild(inlineText(el(tag, tag === 'h4' ? 'news-subtitle' : ''), plain.join(' ')));
          continue;
        }
        var root = el('ul', 'news-bullets');
        var stack = [{ ul: root, indent: lines[i].match(/^\s*/)[0].length, last: null }];
        while (i < lines.length && isItem(lines[i])) {
          var m = lines[i].match(/^(\s*)[-*]\s+(.*)$/), indent = m[1].length;
          var top = stack[stack.length - 1];
          if (indent > top.indent && top.last) {
            var sub = el('ul', 'news-bullets');
            top.last.appendChild(sub);
            top = { ul: sub, indent: indent, last: null };
            stack.push(top);
          } else {
            while (stack.length > 1 && indent < stack[stack.length - 1].indent) stack.pop();
            top = stack[stack.length - 1];
          }
          top.last = inlineText(el('li'), m[2].trim());
          top.ul.appendChild(top.last);
          i++;
        }
        target.appendChild(root);
      }
    };
    var renderText = function (text, target, firstOnly) {
      var blocks = String(text || '').split(/\n\s*\n/).filter(function (b) { return b.trim(); });
      (firstOnly ? blocks.slice(0, 1) : blocks).forEach(function (b) { renderBlock(b, target); });
    };

    // Bijlagen bij een bericht: knoppen naar bestanden in de map nieuwsbrief/
    var attachments = function (p, target, cls) {
      (p.bijlagen || []).filter(function (b) { return b && b.bestand; }).forEach(function (b) {
        var a = el('a', cls || 'btn btn-outline btn-sm', b.titel || b.bestand);
        a.href = 'nieuwsbrief/' + encodeURIComponent(b.bestand);
        a.setAttribute('download', b.bestand);
        target.appendChild(a);
      });
    };

    var newsDate = function (iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
      return m ? parseInt(m[3], 10) + ' ' + months[parseInt(m[2], 10) - 1] + ' ' + m[1] : '';
    };
    var byDateDesc = function (a, b) { return String(b.datum).localeCompare(String(a.datum)); };
    if (newsLatest) {
      var latest = (nl.berichten || []).filter(function (p) { return p && p.titel; }).sort(byDateDesc)[0];
      var latestPdf = (nl.archief || []).filter(function (a) { return a && a.titel && a.bestand; }).sort(byDateDesc)[0];
      if (!latest && !latestPdf) {
        newsLatest.appendChild(el('p', 'muted', 'Nog geen nieuws. Kom snel terug!'));
      }
      if (latest) {
        var lc = el('article', 'news-post news-latest');
        if (latest.datum) lc.appendChild(el('p', 'news-date', newsDate(latest.datum)));
        lc.appendChild(el('h3', '', latest.titel));
        renderText(latest.tekst, lc, true);
        var actions = el('div', 'news-actions');
        var more = el('a', 'btn btn-primary btn-sm', 'Lees meer');
        more.href = 'newsletter.html';
        actions.appendChild(more);
        attachments(latest, actions);
        if (latestPdf) {
          var pdf = el('a', 'btn btn-outline btn-sm', 'Download nieuwsbrief (pdf)');
          pdf.href = 'nieuwsbrief/' + encodeURIComponent(latestPdf.bestand);
          pdf.setAttribute('download', latestPdf.bestand);
          actions.appendChild(pdf);
        }
        lc.appendChild(actions);
        newsLatest.appendChild(lc);
      } else if (latestPdf) {
        var pc = el('article', 'news-post news-latest');
        pc.appendChild(el('h3', '', latestPdf.titel));
        var pa = el('a', 'btn btn-primary btn-sm', 'Download nieuwsbrief (pdf)');
        pa.href = 'nieuwsbrief/' + encodeURIComponent(latestPdf.bestand);
        pa.setAttribute('download', latestPdf.bestand);
        pc.appendChild(pa);
        newsLatest.appendChild(pc);
      }
    }
    if (newsList) {
      var posts = (nl.berichten || []).filter(function (p) { return p && p.titel; }).sort(byDateDesc);
      if (!posts.length) newsList.appendChild(el('p', 'muted', 'Nog geen berichten.'));
      posts.forEach(function (p) {
        var art = el('article', 'news-post');
        if (p.datum) art.appendChild(el('p', 'news-date', newsDate(p.datum)));
        art.appendChild(el('h3', '', p.titel));
        renderText(p.tekst, art);
        if ((p.bijlagen || []).length) {
          var att = el('div', 'news-actions');
          attachments(p, att, 'btn btn-primary btn-sm');
          art.appendChild(att);
        }
        newsList.appendChild(art);
      });
    }
    if (newsArchive) {
      var files = (nl.archief || []).filter(function (a) { return a && a.titel && a.bestand; }).sort(byDateDesc);
      if (!files.length) newsArchive.appendChild(el('li', 'muted', 'Er staan nog geen nieuwsbrieven in het archief.'));
      files.forEach(function (a) {
        var li = document.createElement('li');
        var link = el('a', '', a.titel);
        link.href = 'nieuwsbrief/' + encodeURIComponent(a.bestand);
        link.setAttribute('download', a.bestand);
        li.appendChild(link);
        if (a.datum) li.appendChild(el('span', 'muted', newsDate(a.datum) + ' · pdf'));
        newsArchive.appendChild(li);
      });
    }
  }

  // Weerbericht voor de eerstvolgende zondag (Open-Meteo, geen sleutel nodig)
  var weatherEl = document.getElementById('weather');
  if (weatherEl && window.fetch) {
    var nextSunday = function () {
      var d = new Date();
      d.setDate(d.getDate() + ((7 - d.getDay()) % 7)); // vandaag als het zondag is
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    };
    var wmo = function (c) {
      if (c === 0) return ['☀️', 'Zonnig'];
      if (c === 1) return ['🌤️', 'Overwegend zonnig'];
      if (c === 2) return ['⛅', 'Half bewolkt'];
      if (c === 3) return ['☁️', 'Bewolkt'];
      if (c === 45 || c === 48) return ['🌫️', 'Mistig'];
      if (c >= 51 && c <= 57) return ['🌦️', 'Motregen'];
      if (c >= 61 && c <= 67) return ['🌧️', 'Regen'];
      if (c >= 71 && c <= 77) return ['🌨️', 'Sneeuw'];
      if (c >= 80 && c <= 82) return ['🌦️', 'Buien'];
      if (c === 85 || c === 86) return ['🌨️', 'Sneeuwbuien'];
      if (c >= 95) return ['⛈️', 'Onweer'];
      return ['🌡️', 'Wisselvallig'];
    };
    var compass = ['noorden', 'noordoosten', 'oosten', 'zuidoosten', 'zuiden', 'zuidwesten', 'westen', 'noordwesten'];
    var target = nextSunday();
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=51.0&longitude=3.33' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant' +
      '&wind_speed_unit=kmh&timezone=Europe%2FBrussels&forecast_days=10';
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var dly = data && data.daily;
      var i = dly ? dly.time.indexOf(target) : -1;
      if (i < 0) return;
      var w = wmo(dly.weather_code[i]);
      var deg = dly.wind_direction_10m_dominant[i];
      var from = compass[Math.round(deg / 45) % 8];
      var speed = Math.round(dly.wind_speed_10m_max[i]);
      var gust = Math.round(dly.wind_gusts_10m_max[i]);
      var rain = dly.precipitation_probability_max[i];
      var mm = dly.precipitation_sum[i];
      var tmax = Math.round(dly.temperature_2m_max[i]);
      var tmin = Math.round(dly.temperature_2m_min[i]);
      var parts = target.split('-');
      var dateLabel = parseInt(parts[2], 10) + ' ' + ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'][parseInt(parts[1], 10) - 1];

      var tekst = w[1] + ', ' + tmin + '–' + tmax + ' °C. ';
      tekst += (mm < 0.5 && rain < 30) ? 'Droog om te fietsen. ' : 'Kans op regen: ' + rain + '%' + (mm >= 0.5 ? ' (' + (Math.round(mm * 10) / 10) + ' mm)' : '') + '. ';
      tekst += speed >= 30 ? 'Stevige wind, hou er rekening mee.' : (speed >= 20 ? 'Matige wind.' : 'Weinig wind.');

      weatherEl.appendChild(el('p', 'weather-title', 'Weer op zondag ' + dateLabel));
      var main = el('div', 'weather-main');
      main.appendChild(el('span', 'weather-icon', w[0]));
      var temp = el('div', 'weather-temp', tmax + '°');
      temp.appendChild(el('small', '', 'min ' + tmin + '°'));
      main.appendChild(temp);
      var wind = el('div', 'weather-wind');
      var arrow = el('span', 'wind-arrow', '↓');
      arrow.style.transform = 'rotate(' + Math.round(deg) + 'deg)'; // pijl wijst waarheen de wind waait
      arrow.setAttribute('aria-hidden', 'true');
      wind.appendChild(arrow);
      var wt = el('div', 'wind-text');
      wt.appendChild(el('strong', '', speed + ' km/u'));
      wt.appendChild(el('span', '', 'uit het ' + from));
      wind.appendChild(wt);
      main.appendChild(wind);
      weatherEl.appendChild(main);
      weatherEl.appendChild(el('p', 'weather-text', tekst + ' (Windstoten tot ' + gust + ' km/u.)'));
      weatherEl.hidden = false;
    }).catch(function () { /* geen weer: blok blijft verborgen */ });
  }

  // Sponsors (pagina Sponsors + homepage)
  ['sponsors-list', 'sponsors-preview'].forEach(function (id) {
    var box = document.getElementById(id);
    if (!box) return;
    (window.WTC_SPONSORS || []).filter(function (s) { return s && s.naam && s.logo; }).forEach(function (s) {
      var item = s.link ? el('a', 'sponsor') : el('div', 'sponsor');
      if (s.link) { item.href = s.link; item.target = '_blank'; item.rel = 'noopener'; }
      var img = document.createElement('img');
      img.src = 'sponsors/' + encodeURIComponent(s.logo);
      img.alt = s.naam;
      img.loading = 'lazy';
      item.appendChild(img);
      box.appendChild(item);
    });
  });

  // Footer year
  // Aanmeldformulier via Formspree (zonder pagina te verlaten)
  var joinForm = document.getElementById('join-form');
  if (joinForm && window.fetch) {
    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = joinForm.querySelector('button[type="submit"]');
      var status = joinForm.querySelector('.form-status');
      var show = function (msg, ok) {
        status.textContent = msg;
        status.className = 'form-status ' + (ok ? 'is-ok' : 'is-error');
        status.hidden = false;
      };
      btn.disabled = true;
      btn.textContent = 'Bezig met versturen...';
      fetch(joinForm.action, {
        method: 'POST',
        body: new FormData(joinForm),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        joinForm.reset();
        show('Bedankt! We hebben je aanvraag goed ontvangen en nemen snel contact met je op.', true);
      }).catch(function () {
        show('Er ging iets mis bij het versturen. Probeer het later opnieuw of mail ons op arnechevrolet@hotmail.com.', false);
      }).then(function () {
        btn.disabled = false;
        btn.textContent = 'Verstuur aanvraag';
      });
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
