// WTC Tielt — nieuwsbrief: berichten en archief voor de pagina Nieuwsbrief.
//
// BERICHTEN staan op de pagina zelf; het nieuwste staat bovenaan
// (de volgorde wordt bepaald door de datum, niet door de volgorde hieronder).
//   datum   "jjjj-mm-dd", bv. "2026-11-15" (verplicht)
//   titel   titel van het bericht (verplicht)
//   tekst   de tekst. Een lege regel (\n\n) start een nieuwe alinea.
//           Regels die beginnen met "- " worden een opsomming; twee spaties
//           ervoor maakt er een subpunt van. Een losse regel vlak boven een
//           opsomming wordt een tussentitel. Mailadressen worden klikbaar.
//   bijlagen (optioneel) lijst van bestanden om te downloaden, in de map
//           nieuwsbrief/, bv. [{ titel: "Download de bestelbon", bestand: "bestelbon.xlsx" }]
//
// ARCHIEF is een lijst van pdf's om te downloaden.
//   Zet de pdf in de map "nieuwsbrief/" en vul de bestandsnaam in.
//   datum   "jjjj-mm-dd" (verplicht)
//   titel   bv. "Nieuwsbrief november 2026" (verplicht)
//   bestand bestandsnaam in de map nieuwsbrief/, bv. "2026-11.pdf" (verplicht)
//
window.WTC_NEWSLETTER = {
  berichten: [
    {
      datum: "2026-11-16",
      titel: "Nieuwsbrief november 2026",
      tekst: "Vernieuwen lidgeld\n- Lidgeld 2027: 70 euro\n- Storten op het clubrekeningnummer BE54 9735 1392 2097\n- Graag vóór 15 december 2026, dan ben je verzekerd vanaf 1 januari 2027\n\nKledij\n- Wie wenst, kan extra kledij bestellen via arnechevrolet@hotmail.com\n  - gebruik de bestelbon\n  - of geef de items door via mail\n- Deadline: 19 december 2026\n  - betalen via de clubrekening BE54 9735 1392 2097\n  - enkel de betaalde kledij wordt besteld",
      bijlagen: [
        { titel: "Download de bestelbon (Excel)", bestand: "Bestelbon kledij WTC Tielt Sportief 2027.xlsx" }
      ]
    },
    {
      datum: "2026-11-13",
      titel: "Onze nieuwe website is online",
      tekst: "Welkom op de vernieuwde website van WTC Tielt Sportief. Je vindt hier de ritten met GPX-bestanden, de kalender en vanaf nu ook het nieuws van de club.\n\nHeb je een tip of een foto voor de nieuwsbrief? Laat het ons weten via mail of op zondagochtend in het clublokaal."
    }
  ],
  archief: [
    // {
    //   datum: "2026-11-01",
    //   titel: "Nieuwsbrief november 2026",
    //   bestand: "2026-11.pdf"
    // }
  ]
};
