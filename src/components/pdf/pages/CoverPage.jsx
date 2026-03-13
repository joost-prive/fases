import { Page, View, Text, Image, Svg, Rect, Circle, Line } from '@react-pdf/renderer'
import { COLORS } from '../pdfTheme'

export default function CoverPage({ children, yearRange, t }) {
  return (
    <Page size="A4" style={{
      backgroundColor: COLORS.primary,
      paddingHorizontal: 52,
      paddingTop: 64,
      paddingBottom: 52,
      fontFamily: 'Helvetica',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top: Logo + title */}
      <View>
        {/* Fases logo als SVG */}
        <Svg width={52} height={52} viewBox="0 0 40 40">
          <Rect width="40" height="40" rx="10" fill={COLORS.white} />
          <Line x1="8" y1="22" x2="32" y2="22" stroke={COLORS.primary} strokeWidth="1.5" opacity="0.4" />
          <Circle cx="8" cy="22" r="3.5" fill={COLORS.primary} />
          <Circle cx="20" cy="22" r="5" fill={COLORS.primary} />
          <Circle cx="32" cy="22" r="7" fill={COLORS.primary} />
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
          opacity: 0.85,
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
        {/* Teal decoratieve band */}
        <View style={{
          backgroundColor: COLORS.teal,
          height: 6,
          borderRadius: 3,
        }} />
      </View>
    </Page>
  )
}
