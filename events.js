// WTC Tielt — evenementen voor de pagina Kalender én de homepage.
//
// De pagina Kalender toont alle evenementen in deze volgorde.
// De homepage ("Binnenkort") toont automatisch de eerste drie.
//
// Een evenement toevoegen: kopieer een blok en pas het aan.
//   dag / maand   wat in het blauwe datumvakje staat, bv. "01" en "APR"
//   titel         naam van het evenement (verplicht)
//   info          grijze regel: datum, uur, plaats
//   omschrijving  extra zin (mag weggelaten worden)
//   tag           label rechts, bv. "Clubrit" of "Feest"
//   kleur         kleur van het label: "blue", "yellow" of "green"
//
// Voor de knop "Zet in agenda" (agendabestand .ics) op de pagina Kalender:
//   datum         volledige datum als "jjjj-mm-dd", bv. "2027-04-01".
//                 Zonder datum komt er geen knop.
//   uur           vertrekuur als "uu:mm", bv. "19:00".
//                 Zonder uur wordt het een evenement van een hele dag.
//   duur          duur in uren (mag weggelaten worden; standaard 3)
//   plaats        plaats in de agenda, bv. "Clublokaal, Tielt"
//
window.WTC_EVENTS = [
  {
    dag: "17",
    maand: "JAN",
    datum: "2027-01-17",
    plaats: "Clublokaal, Tielt",
    titel: "Nieuwjaarsreceptie 2027",
    info: "Datum en uur nog te bepalen · Clublokaal",
    tag: "Feest",
    kleur: "blue"
  },
  {
    dag: "07",
    maand: "MAA",
    datum: "2027-03-07",
    uur: "09:00",
    plaats: "Clublokaal, Tielt",
    titel: "Openingsrit seizoen 2027",
    info: "Zondag 7 maart · Vertrek 9u00 · Clublokaal",
    omschrijving: "De klassieke openingsrit van 50 km.",
    tag: "Clubrit",
    kleur: "blue"
  },
  {
    dag: "01",
    maand: "APR",
    datum: "2027-04-01",
    uur: "19:00",
    plaats: "Clublokaal, Tielt",
    titel: "Eerste donderdagrit",
    info: "Donderdag 1 april · Vertrek 19u00 · Clublokaal",
    tag: "Clubrit",
    kleur: "blue"
  },
];
