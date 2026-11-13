// WTC Tielt — nieuwsbrief: berichten en archief voor de pagina Nieuwsbrief.
//
// BERICHTEN staan op de pagina zelf; het nieuwste staat bovenaan
// (de volgorde wordt bepaald door de datum, niet door de volgorde hieronder).
//   datum   "jjjj-mm-dd", bv. "2026-11-15" (verplicht)
//   titel   titel van het bericht (verplicht)
//   tekst   de tekst. Een lege regel (\n\n) start een nieuwe alinea.
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
