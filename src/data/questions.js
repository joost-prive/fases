// All questions organized by month
// ageMin/ageMax in years (inclusive)
// null means no age restriction

export const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April',
  'Mei', 'Juni', 'Juli', 'Augustus',
  'September', 'Oktober', 'November', 'December'
]

export const MONTH_NUMBERS = {
  'Januari': 0, 'Februari': 1, 'Maart': 2, 'April': 3,
  'Mei': 4, 'Juni': 5, 'Juli': 6, 'Augustus': 7,
  'September': 8, 'Oktober': 9, 'November': 10, 'December': 11
}

export const MONTHLY_QUESTIONS = {
  Januari: [
    { id: 1, question: 'Wat vindt papa of mama het mooiste aan mij?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Wat vind ik leuk om met mama te doen?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Hoe kun je mij aan het lachen maken?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Hoe ben ik met andere kinderen?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Hoe slaap ik?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Welke knuffels heb ik?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Hoe ben ik bij opa en oma?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Hou ik van sneeuw?', ageMin: 0, ageMax: 10 },
    { id: 9, question: 'Wat vind ik leuk op TV?', ageMin: 2, ageMax: 10 },
    { id: 10, question: 'Met welke klusjes help ik?', ageMin: 4, ageMax: 10 },
  ],
  Februari: [
    { id: 1, question: 'Waar speel ik binnen het meeste mee?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Wat vind ik leuk om met papa te doen?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Waar ben ik bang voor?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Welke winterkleding draag ik vaak?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Hoe zorg ik dat ik aandacht krijg?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Waar moest papa of mama echt om lachen bij me?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Waarmee kan ik voor de gek worden gehouden?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Hou ik van feestjes?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wie smeert mijn boterhammen?', ageMin: 2, ageMax: 10 },
    { id: 10, question: 'Wat voor wintersport doe ik?', ageMin: 4, ageMax: 10 },
  ],
  Maart: [
    { id: 1, question: "Hoe ben ik als ik 's ochtends wakker word?", ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Wat is mijn fijnste plek in huis?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Waar wordt mijn mama helemaal gek van?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Hoe ben ik als ik (even) alleen moet zijn?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Waar kan ik niet zonder?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Welke woordjes zeg ik al?', ageMin: 0, ageMax: 6 },
    { id: 7, question: 'Hoe laat ga ik naar bed?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Welke sport vind ik leuk?', ageMin: 4, ageMax: 10 },
    { id: 9, question: 'Hoe ga ik naar school?', ageMin: 5, ageMax: 10 },
    { id: 10, question: 'Naast wie zit ik in de klas?', ageMin: 5, ageMax: 10 },
  ],
  April: [
    { id: 1, question: 'Hoe ben ik met poepen en plassen?', ageMin: 0, ageMax: 6 },
    { id: 2, question: 'Waarom kan ik heel erg boos worden?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat lust ik absoluut niet?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Waar wordt mijn papa helemaal gek van?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Wat voor rituelen hebben we?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Met welke kinderen speel ik het meeste?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Wat hebben we met Pasen gedaan?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Hebben we eieren gezocht?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wat hebben we met Koningsdag gedaan?', ageMin: 0, ageMax: 10 },
    { id: 10, question: 'Hoeveel zakgeld krijg ik?', ageMin: 6, ageMax: 10 },
  ],
  Mei: [
    { id: 1, question: 'Kan ik al rollen, kruipen of lopen?', ageMin: 0, ageMax: 6 },
    { id: 2, question: 'Wat heb ik voor moederdag gemaakt?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat hebben we gedaan in de meivakantie?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Waar moet mama vaak bij helpen?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Welke boekjes vind ik leuk om te lezen?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Wat hebben we in het Hemelvaartsweekend gedaan?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Ga ik wel eens logeren?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Welk pretpark vind ik leuk?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wat eet ik het liefst op mijn boterham?', ageMin: 3, ageMax: 10 },
    { id: 10, question: 'Hoe ben ik met opruimen?', ageMin: 4, ageMax: 10 },
  ],
  Juni: [
    { id: 1, question: 'Kan ik al driewieler, steppen, fietsen of rollerskaten?', ageMin: 0, ageMax: 6 },
    { id: 2, question: 'Wat hebben we gedaan in de meivakantie?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Waar moet papa vaak bij helpen?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Wanneer ben ik voor het laatst ziek geweest?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Wat heb ik voor vaderdag gemaakt?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Waar kan ik verdrietig om zijn?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Waar ben ik heel trots op?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Welk woordje zeg ik heel vaak?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wat is mijn lievelingsdier?', ageMin: 2, ageMax: 10 },
    { id: 10, question: 'Van wie ben ik fan?', ageMin: 4, ageMax: 10 },
  ],
  Juli: [
    { id: 1, question: 'Hoe vind ik het om buiten te zijn?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Waar speel ik buiten het meeste mee?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat vind ik leuk om te doen op vakantie?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Waar word ik rustig van?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Wat vind ik het allerlekkerste eten?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Wat vind ik van zwemmen?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Waarin ben ik anders dan andere kinderen?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Hoe vind ik het in de auto?', ageMin: 0, ageMax: 10 },
    { id: 9, question: 'Welke kleren heb ik graag aan?', ageMin: 3, ageMax: 10 },
    { id: 10, question: 'Wat wil ik later worden?', ageMin: 5, ageMax: 10 },
  ],
  Augustus: [
    { id: 1, question: 'Hoe vind ik het in de kinderwagen?', ageMin: 0, ageMax: 3 },
    { id: 2, question: 'Hoe zijn we op vakantie gegaan? (auto, huisje, vliegtuig)', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat hebben we veel gedaan op vakantie?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Wat voor stoute dingen doe ik wel eens?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Wat vind ik spannend?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Wanneer heb ik een keer veel pijn gehad?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Waar kan ik me om verwonderen?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Wie waren mijn vriendjes op vakantie?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Hoeveel zit ik op een telefoon of tablet?', ageMin: 2, ageMax: 10 },
    { id: 10, question: 'Welk land vind ik het leukste?', ageMin: 5, ageMax: 10 },
  ],
  September: [
    { id: 1, question: 'Wat kan ik al helemaal zelf?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Waar kan ik niet goed tegen?', ageMin: 0, ageMax: 10 },
    { id: 3, question: "Hoe sta ik vaak op foto's?", ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Welk fruit vind ik lekker?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Naar wie kijk ik op?', ageMin: 2, ageMax: 10 },
    { id: 6, question: 'Welke spelletjes vind ik leuk?', ageMin: 2, ageMax: 10 },
    { id: 7, question: 'Hoe of bij wie zit ik het liefste op de bank?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Wat vind ik de leukste film?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wie is mijn juffrouw of meester?', ageMin: 5, ageMax: 10 },
    { id: 10, question: 'Wat is mijn lievelingsvak op school?', ageMin: 5, ageMax: 10 },
  ],
  Oktober: [
    { id: 1, question: 'Wat is mijn grootste talent?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Wat is mijn lievelingskleur?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat heb ik voor het laatste geknutseld?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Wat hebben we gedaan in de herfstvakantie?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Welke groente vind ik lekker?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Hoe laat ga ik naar bed?', ageMin: 2, ageMax: 10 },
    { id: 7, question: 'Wat vind ik leuk om op TV te kijken?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Op wie ben ik verliefd?', ageMin: 5, ageMax: 10 },
    { id: 9, question: 'Hoe ga ik naar school?', ageMin: 5, ageMax: 10 },
    { id: 10, question: 'Naast wie zit ik in de klas?', ageMin: 5, ageMax: 10 },
  ],
  November: [
    { id: 1, question: "Hoe laat word ik 's ochtends wakker?", ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Naar welke familie ga ik heel graag toe?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Wat is een traditie bij ons?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Hoe gaat het met mijn tandjes?', ageMin: 0, ageMax: 6 },
    { id: 5, question: 'Hoe ben ik bij de tandarts of dokter?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Wat staat er op mijn verlanglijstje?', ageMin: 2, ageMax: 8 },
    { id: 7, question: 'Wat voor grappigs heb ik wel eens gezegd?', ageMin: 2, ageMax: 10 },
    { id: 8, question: 'Welke muziek vind ik leuk?', ageMin: 2, ageMax: 10 },
    { id: 9, question: 'Wat vind ik de leukste dag van de week en waarom?', ageMin: 4, ageMax: 10 },
    { id: 10, question: 'Wat vind ik het minst leuk aan school?', ageMin: 5, ageMax: 10 },
  ],
  December: [
    { id: 1, question: 'Hoe ben ik aan de eettafel?', ageMin: 0, ageMax: 10 },
    { id: 2, question: 'Wat vond ik van Sinterklaas?', ageMin: 0, ageMax: 10 },
    { id: 3, question: 'Welke cadeautjes heb ik gekregen?', ageMin: 0, ageMax: 10 },
    { id: 4, question: 'Wanneer ben ik op mijn schattigst?', ageMin: 0, ageMax: 10 },
    { id: 5, question: 'Wat hebben we gedaan in de kerstvakantie?', ageMin: 0, ageMax: 10 },
    { id: 6, question: 'Hoe hebben we het huis versierd met Kerst?', ageMin: 0, ageMax: 10 },
    { id: 7, question: 'Waar kan ik van genieten met Kerst?', ageMin: 0, ageMax: 10 },
    { id: 8, question: 'Hoe hebben we nieuwjaar gevierd?', ageMin: 0, ageMax: 10 },
    { id: 9, question: 'Wat is het liefste dat ik tegen papa of mama gezegd heb?', ageMin: 3, ageMax: 10 },
    { id: 10, question: 'Wat ga ik komend jaar beter doen?', ageMin: 4, ageMax: 10 },
  ],
}

export const BIRTHDAY_QUESTIONS = [
  { id: 1, question: 'Hoe hebben we mijn verjaardag gevierd?', ageMin: 0, ageMax: 10 },
  { id: 2, question: 'Wie kwamen er op mijn verjaardag?', ageMin: 0, ageMax: 10 },
  { id: 3, question: 'Wat voor taart hadden we?', ageMin: 0, ageMax: 10 },
  { id: 4, question: 'Wat wilde ik heel graag voor mijn verjaardag?', ageMin: 0, ageMax: 10 },
  { id: 5, question: 'Wat heb ik voor cadeaus gekregen?', ageMin: 0, ageMax: 10 },
  { id: 6, question: 'Wat was het leukste van mijn verjaardag?', ageMin: 0, ageMax: 10 },
  { id: 7, question: 'Welke kinderen waren er op mijn kinderfeestje?', ageMin: 4, ageMax: 10 },
  { id: 8, question: 'Wat hebben we met mijn kinderfeestje gedaan?', ageMin: 4, ageMax: 10 },
  { id: 9, question: 'Wat heb ik getrakteerd op school?', ageMin: 5, ageMax: 10 },
  { id: 10, question: 'Wat heb ik beloofd om beter te doen nu ik een jaar ouder ben?', ageMin: 5, ageMax: 10 },
]

export const MILESTONES = [
  { id: 1, question: 'Wanneer lachte ik voor het eerst?' },
  { id: 2, question: 'Wanneer sliep ik voor het eerst door?' },
  { id: 3, question: 'Wanneer kon ik kruipen?' },
  { id: 4, question: 'Wanneer kon ik lopen?' },
  { id: 5, question: 'Wanneer ging ik voor het eerst op het potje?' },
  { id: 6, question: 'Wanneer kon ik fietsen zonder zijwieltjes?' },
  { id: 7, question: 'Wanneer ging mijn eerste tand eruit?' },
  { id: 8, question: 'Wanneer kreeg ik mijn eerste medaille?' },
  { id: 9, question: 'Wanneer haalde ik mijn zwemdiploma?' },
  { id: 10, question: 'Wanneer had ik voor het eerst verkering?' },
]

export const CHILD_COLORS = [
  '#E07845', // warm orange
  '#5A9EA0', // teal
  '#9B7EC8', // purple
  '#6EA86A', // green
  '#E07080', // rose
  '#F2C44E', // yellow
  '#E0A845', // amber
  '#5A7EA0', // blue
]
