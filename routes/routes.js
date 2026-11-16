// WTC Tielt — lijst van routes op de pagina Ritten.
//
// De routes staan per groep: "A & B", "B1" of "C".
// Met "datum" (jjjj-mm-dd) hoort een route bij een ritdag hieronder.
// Een ritdag zonder route toont "Route volgt nog."
//
// Een route toevoegen:
//   1. Zet het GPX-bestand in deze map (routes/), bv. routes/mandelroute.gpx
//   2. Voeg hieronder een blok toe. "groep", "naam" en "bestand" zijn verplicht.
//
//   {
//     datum: "2027-03-14",
//     groep: "B1",
//     naam: "Mandelroute",
//     bestand: "mandelroute.gpx",
//     afstand: "75 km",
//     hoogtemeters: "400 hm",
//     ritverantwoordelijke: "Voornaam Naam",
//     omschrijving: "Rustige lus langs de Mandel."
//   },
//
// Ritdagen die op de pagina als keuzeknoppen verschijnen
window.WTC_RITDAGEN = [
  "2027-03-07",
  "2027-03-14",
  "2027-03-21",
  "2027-03-28"
];

window.WTC_ROUTES = [
  {
    datum: "2027-03-07",
    groep: "A & B",
    naam: "Tielt – Moerkerke",
    bestand: "WTC Tielt - Moerkerke.gpx",
    afstand: "88 km",
    hoogtemeters: "250 hm",
    ritverantwoordelijke: "Jacob Verkest"
  },
  {
    datum: "2027-03-07",
    groep: "B1",
    naam: "Tielt – Bellem",
    bestand: "WTC Tielt - Bellem.gpx",
    afstand: "77 km",
    hoogtemeters: "244 hm",
    ritverantwoordelijke: "Frederik Heinderson"
  },
  {
    datum: "2027-03-07",
    groep: "C",
    naam: "Tielt – Landegem",
    bestand: "WTC Tielt - Landegem.gpx",
    afstand: "60 km",
    hoogtemeters: "180 hm",
    ritverantwoordelijke: "Nog te bepalen"
  }
];
