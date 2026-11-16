// WTC Tielt — agendabestanden (.ics) voor evenementen uit events.js.
// Gedeeld door de site (script.js) en door tools/build-agenda.js, dat de
// bestanden in de map agenda/ aanmaakt. iPhones openen alleen echte .ics-
// bestanden op de site, geen bestanden die de pagina zelf aanmaakt.
(function (root) {
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

  function eventIcs(e, stamp) {
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
      'DTSTAMP:' + icsStamp(stamp || new Date())
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


  function eventSlug(e) {
    return e.titel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Eén kalender met alle evenementen (om op te abonneren)
  function calendarIcs(events, stamp) {
    var body = [];
    events.forEach(function (e) {
      var one = eventIcs(e, stamp);
      if (!one) return;
      var t = one.text.split('\r\n');
      var a = t.indexOf('BEGIN:VEVENT'), b = t.indexOf('END:VEVENT');
      body = body.concat(t.slice(a, b + 1));
    });
    var head = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WTC Tielt Sportief//Kalender//NL',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:WTC Tielt Sportief',
      'X-WR-TIMEZONE:Europe/Brussels', 'REFRESH-INTERVAL;VALUE=DURATION:PT12H', 'X-PUBLISHED-TTL:PT12H'];
    return head.concat(body, ['END:VCALENDAR']).join('\r\n') + '\r\n';
  }

  var api = { eventIcs: eventIcs, eventSlug: eventSlug, calendarIcs: calendarIcs };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WTC_ICS = api;
})(this);
