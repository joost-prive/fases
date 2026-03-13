export const DUTCH_MONTHS = {
  'Januari': 0, 'Februari': 1, 'Maart': 2, 'April': 3,
  'Mei': 4, 'Juni': 5, 'Juli': 6, 'Augustus': 7,
  'September': 8, 'Oktober': 9, 'November': 10, 'December': 11,
}

export function getSeasonFromMonth(monthIndex) {
  if (monthIndex >= 2 && monthIndex <= 4) return 'spring'
  if (monthIndex >= 5 && monthIndex <= 7) return 'summer'
  if (monthIndex >= 8 && monthIndex <= 10) return 'autumn'
  return 'winter'
}

export function getSeasonFromDutchMonth(name) {
  const idx = DUTCH_MONTHS[name]
  return idx !== undefined ? getSeasonFromMonth(idx) : getCurrentSeason()
}

export function getCurrentSeason() {
  return getSeasonFromMonth(new Date().getMonth())
}
