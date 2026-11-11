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
window.WTC_EVENTS = [
  {
    dag: "?",
    maand: "2027",
    titel: "Nieuwjaarsreceptie 2027",
    info: "Datum en uur nog te bepalen · Clublokaal",
    tag: "Feest",
    kleur: "blue"
  },
  {
    dag: "?",
    maand: "2027",
    titel: "Openingsrit seizoen 2027",
    info: "Datum nog te bepalen · Vertrek 9u00 · Clublokaal",
    omschrijving: "De klassieke openingsrit van 50 km.",
    tag: "Clubrit",
    kleur: "blue"
  },
  {
    dag: "01",
    maand: "APR",
    titel: "Eerste donderdagrit",
    info: "Donderdag 1 april · Vertrek 19u00 · Clublokaal",
    tag: "Clubrit",
    kleur: "blue"
  },
];
