#!/usr/bin/env node
// Maakt de agendabestanden in agenda/ aan op basis van events.js.
// Draai dit na elke wijziging in events.js:   node tools/build-agenda.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const ICS = require(path.join(root, 'ics.js'));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'events.js'), 'utf8'), sandbox);
const events = (sandbox.window.WTC_EVENTS || []).filter(e => e && e.titel);
const dir = path.join(root, 'agenda');
fs.mkdirSync(dir, { recursive: true });
for (const f of fs.readdirSync(dir)) if (f.endsWith('.ics')) fs.unlinkSync(path.join(dir, f));
const stamp = new Date();
let n = 0;
for (const e of events) {
  const ics = ICS.eventIcs(e, stamp);
  if (!ics) continue;
  fs.writeFileSync(path.join(dir, ics.name), ics.text);
  n++;
}
fs.writeFileSync(path.join(dir, 'wtc-tielt.ics'), ICS.calendarIcs(events, stamp));
console.log(n + ' agendabestanden + wtc-tielt.ics aangemaakt in agenda/');
