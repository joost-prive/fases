import { Page, View, Text, Svg, Path, Circle, Rect } from '@react-pdf/renderer'
import { COLORS, SEASON_THEMES } from '../pdfTheme'

const DUTCH_MONTH_IDX = {
  'Januari': 0, 'Februari': 1, 'Maart': 2, 'April': 3,
  'Mei': 4, 'Juni': 5, 'Juli': 6, 'Augustus': 7,
  'September': 8, 'Oktober': 9, 'November': 10, 'December': 11,
}

function getSeason(month) {
  const idx = DUTCH_MONTH_IDX[month] ?? new Date().getMonth()
  if (idx >= 2 && idx <= 4) return 'spring'
  if (idx >= 5 && idx <= 7) return 'summer'
  if (idx >= 8 && idx <= 10) return 'autumn'
  return 'winter'
}

function SeasonIcon({ season }) {
  if (season === 'winter') return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Circle cx="30" cy="30" r="3" fill="white" />
      <Path d="M30 10 L30 50 M10 30 L50 30 M17 17 L43 43 M43 17 L17 43" stroke="white" strokeWidth="2.5" />
      <Circle cx="30" cy="10" r="3" fill="white" />
      <Circle cx="30" cy="50" r="3" fill="white" />
      <Circle cx="10" cy="30" r="3" fill="white" />
      <Circle cx="50" cy="30" r="3" fill="white" />
    </Svg>
  )
  if (season === 'spring') return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Circle cx="30" cy="30" r="10" fill="#FCE4EC" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = angle * Math.PI / 180
        const x = 30 + Math.cos(rad) * 16
        const y = 30 + Math.sin(rad) * 16
        return <Circle key={i} cx={x} cy={y} r="8" fill="#F48FB1" />
      })}
      <Circle cx="30" cy="30" r="7" fill="#FFD54F" />
    </Svg>
  )
  if (season === 'summer') return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Circle cx="30" cy="30" r="14" fill="#FFD600" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = angle * Math.PI / 180
        return (
          <Path
            key={i}
            d={`M ${30 + Math.cos(rad) * 16} ${30 + Math.sin(rad) * 16} L ${30 + Math.cos(rad) * 26} ${30 + Math.sin(rad) * 26}`}
            stroke="#FFD600"
            strokeWidth="3"
          />
        )
      })}
    </Svg>
  )
  // autumn
  return (
    <Svg width="60" height="60" viewBox="0 0 60 60">
      <Path d="M30 50 Q18 38 20 25 Q22 15 30 12 Q38 15 40 25 Q42 38 30 50Z" fill="#FF7043" />
      <Path d="M30 50 Q32 35 42 28" stroke="#E64A19" strokeWidth="1.5" />
      <Path d="M30 40 Q28 30 20 24" stroke="#E64A19" strokeWidth="1" />
    </Svg>
  )
}

export default function MonthChapterPage({ month, questionCount, t }) {
  const season = getSeason(month)
  const theme = SEASON_THEMES[season]

  return (
    <Page size="A4" style={{
      fontFamily: 'Helvetica',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Sky gradient — stacked rectangles (react-pdf has no true gradient) */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect width="596" height="148" fill={theme.skyTop} style={{ display: 'flex' }} />
        {[theme.skyTop, theme.skyMid, theme.skyBottom, theme.hill1].map((color, i) => (
          <View key={i} style={{ height: 148, backgroundColor: color }} />
        ))}
        <View style={{ flex: 1, backgroundColor: theme.hill2 }} />
        <View style={{ height: 80, backgroundColor: theme.hill3 }} />
      </View>

      {/* Content */}
      <View style={{ paddingHorizontal: 52, paddingTop: 80, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={{
            fontSize: 64,
            fontFamily: 'Helvetica-Bold',
            color: theme.text,
            opacity: 0.2,
            lineHeight: 1,
            marginBottom: -8,
          }}>
            {t(`months.${month}`)}
          </Text>
          <Text style={{
            fontSize: 42,
            fontFamily: 'Helvetica-Bold',
            color: theme.text,
            lineHeight: 1.1,
          }}>
            {t(`months.${month}`)}
          </Text>
          <Text style={{
            fontSize: 14,
            color: theme.text,
            opacity: 0.85,
            marginTop: 12,
          }}>
            {t('book.chapter_questions', { count: questionCount })}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 52 }}>
          <SeasonIcon season={season} />
          <View style={{
            backgroundColor: theme.text,
            opacity: 0.3,
            height: 4,
            flex: 1,
            marginLeft: 20,
            borderRadius: 2,
          }} />
        </View>
      </View>
    </Page>
  )
}
