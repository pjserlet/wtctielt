// WTC Tielt — lijst van routes op de pagina Ritten.
//
// De routes staan per groep: "A & B", "B1" of "C".
//
// Een route toevoegen:
//   1. Zet het GPX-bestand in deze map (routes/), bv. routes/mandelroute.gpx
//   2. Voeg hieronder een blok toe. "groep", "naam" en "bestand" zijn verplicht.
//
//   {
//     groep: "B1",
//     naam: "Mandelroute",
//     bestand: "mandelroute.gpx",
//     afstand: "75 km",
//     hoogtemeters: "400 hm",
//     omschrijving: "Rustige lus langs de Mandel."
//   },
//
window.WTC_ROUTES = [
  {
    groep: "A & B",
    naam: "Tielt – Moerkerke",
    bestand: "WTC Tielt - Moerkerke.gpx",
    afstand: "88 km",
    hoogtemeters: "250 hm"
  },
];
