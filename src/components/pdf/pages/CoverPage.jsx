import { Page, View, Text, Image, Svg, Rect, Circle, Line, Path } from '@react-pdf/renderer'
import { COLORS, SEASON_THEMES } from '../pdfTheme'
import { getCurrentSeason } from '../../../utils/seasonUtils'

export default function CoverPage({ children, yearRange, t, season }) {
  const activeSeason = season || getCurrentSeason()
  const theme = SEASON_THEMES[activeSeason]

  return (
    <Page size="A4" style={{
      paddingHorizontal: 52,
      paddingTop: 64,
      paddingBottom: 52,
      fontFamily: 'Helvetica',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Seasonal sky gradient background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {[theme.skyTop, theme.skyMid, theme.skyBottom, theme.hill1, theme.hill2, theme.hill3].map((color, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </View>

      {/* Decorative season icon top-right */}
      <View style={{ position: 'absolute', top: 40, right: 44, opacity: 0.25 }}>
        <CoverSeasonDecoration season={activeSeason} />
      </View>

      {/* Top: Logo + title */}
      <View>
        <Svg width={52} height={52} viewBox="0 0 40 40">
          <Rect width="40" height="40" rx="10" fill={COLORS.white} opacity="0.9" />
          <Line x1="8" y1="22" x2="32" y2="22" stroke={theme.skyTop} strokeWidth="1.5" opacity="0.4" />
          <Circle cx="8" cy="22" r="3.5" fill={theme.skyTop} />
          <Circle cx="20" cy="22" r="5" fill={theme.skyTop} />
          <Circle cx="32" cy="22" r="7" fill={theme.skyTop} />
        </Svg>
        <Text style={{
          fontSize: 48,
          fontFamily: 'Helvetica-Bold',
          color: COLORS.white,
          marginTop: 20,
          lineHeight: 1,
        }}>
          Fases
        </Text>
        <Text style={{
          fontSize: 16,
          color: COLORS.white,
          opacity: 0.9,
          marginTop: 8,
          fontFamily: 'Helvetica',
        }}>
          {t('book.cover_subtitle')}
        </Text>
      </View>

      {/* Middle: Kinderen */}
      <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
        {children.map(child => (
          <View key={child.id} style={{ alignItems: 'center', gap: 6 }}>
            {child.photo ? (
              <Image
                src={child.photo}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  objectFit: 'cover',
                  border: `3pt solid ${COLORS.white}`,
                }}
              />
            ) : (
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: child.color || COLORS.teal,
                alignItems: 'center',
                justifyContent: 'center',
                border: `3pt solid ${COLORS.white}`,
              }}>
                <Text style={{
                  color: COLORS.white,
                  fontSize: 28,
                  fontFamily: 'Helvetica-Bold',
                }}>
                  {child.name.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={{ color: COLORS.white, fontSize: 13, fontFamily: 'Helvetica-Bold' }}>
              {child.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom: jaarrange + decoratie */}
      <View>
        <Text style={{
          fontSize: 24,
          color: COLORS.white,
          fontFamily: 'Helvetica-Bold',
          opacity: 0.9,
          marginBottom: 16,
        }}>
          {yearRange.first} – {yearRange.last}
        </Text>
        <View style={{
          backgroundColor: COLORS.white,
          opacity: 0.4,
          height: 4,
          borderRadius: 2,
        }} />
      </View>
    </Page>
  )
}

function CoverSeasonDecoration({ season }) {
  if (season === 'winter') return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Path d="M60 10 L60 110 M10 60 L110 60 M27 27 L93 93 M93 27 L27 93" stroke="white" strokeWidth="6" />
      <Circle cx="60" cy="10" r="7" fill="white" />
      <Circle cx="60" cy="110" r="7" fill="white" />
      <Circle cx="10" cy="60" r="7" fill="white" />
      <Circle cx="110" cy="60" r="7" fill="white" />
    </Svg>
  )
  if (season === 'spring') return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = angle * Math.PI / 180
        const x = 60 + Math.cos(rad) * 32
        const y = 60 + Math.sin(rad) * 32
        return <Circle key={i} cx={x} cy={y} r="16" fill="white" />
      })}
      <Circle cx="60" cy="60" r="14" fill="white" />
    </Svg>
  )
  if (season === 'summer') return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="28" fill="white" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = angle * Math.PI / 180
        const x1 = 60 + Math.cos(rad) * 34
        const y1 = 60 + Math.sin(rad) * 34
        const x2 = 60 + Math.cos(rad) * 50
        const y2 = 60 + Math.sin(rad) * 50
        return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="white" strokeWidth="6" />
      })}
    </Svg>
  )
  return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Path d="M60 100 Q36 76 40 50 Q44 30 60 24 Q76 30 80 50 Q84 76 60 100Z" fill="white" />
      <Path d="M60 100 Q64 70 84 56" stroke="#E0E0E0" strokeWidth="3" />
      <Path d="M60 80 Q56 60 40 48" stroke="#E0E0E0" strokeWidth="2" />
    </Svg>
  )
}
