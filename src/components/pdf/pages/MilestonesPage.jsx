import { Page, View, Text, Svg, Polyline, Circle as SvgCircle } from '@react-pdf/renderer'
import { COLORS, styles } from '../pdfTheme'

function GrowthSparkline({ measurements, color }) {
  const valid = measurements.filter(m => parseFloat(m.height) > 0)
  if (valid.length < 2) return null

  const heights = valid.map(m => parseFloat(m.height))
  const minH = Math.min(...heights)
  const maxH = Math.max(...heights)
  const range = maxH - minH || 1
  const W = 320
  const H = 50
  const PAD = 8

  const pts = heights.map((h, i) => ({
    x: PAD + (i / (heights.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - (h - minH) / range) * (H - PAD * 2),
  }))
  const pointsStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Polyline
        points={pointsStr}
        stroke={color || COLORS.teal}
        strokeWidth="2"
        fill="none"
      />
      {pts.map((p, i) => (
        <SvgCircle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={color || COLORS.teal}
        />
      ))}
    </Svg>
  )
}

/**
 * Renders milestones + growth data for all children.
 * Props:
 *   milestones: [{ child, entries: [{ id, questionText, answer }] }]
 *   measurements: [{ child, data: [{ date, height, weight }] }]
 *   t: i18next translate function
 */
export default function MilestonesPage({ milestones, measurements, t }) {
  return (
    <>
      {/* Hoofdstuk-pagina */}
      <Page size="A4" style={{
        backgroundColor: COLORS.green,
        fontFamily: 'Helvetica',
        paddingHorizontal: 52,
        paddingTop: 80,
        paddingBottom: 52,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{
            fontSize: 42,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.white,
            lineHeight: 1.1,
          }}>
            {t('book.milestones_chapter')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.white,
            opacity: 0.85,
            marginTop: 12,
          }}>
            {t('book.milestones_chapter_desc')}
          </Text>
        </View>
        <View style={{ backgroundColor: COLORS.yellow, height: 6, borderRadius: 3 }} />
      </Page>

      {/* Mijlpalen per kind */}
      {milestones.map(({ child, entries }) => (
        <Page key={child.id} size="A4" style={styles.page}>
          {/* Header */}
          <View style={{
            marginHorizontal: -44,
            marginTop: -44,
            paddingHorizontal: 44,
            paddingTop: 20,
            paddingBottom: 16,
            backgroundColor: child.color || COLORS.green,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: child.color || COLORS.green }}>
                {child.name.charAt(0)}
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>
              {child.name} · {t('book.milestones_chapter')}
            </Text>
          </View>

          {/* Mijlpalen lijst */}
          {entries.map(({ id, questionText, answer }) => (
            <View key={id} style={{ marginBottom: 10 }} wrap={false}>
              <Text style={styles.label}>{questionText}</Text>
              <View style={styles.answerBlock}>
                <Text style={styles.body}>{answer}</Text>
              </View>
            </View>
          ))}

          {/* Groeimeting tabel + sparkline */}
          {(() => {
            const m = measurements.find(m => m.child.id === child.id)
            if (!m || m.data.length === 0) return null
            return (
              <View style={{ marginTop: 16 }} wrap={false}>
                <Text style={[styles.h3, { marginBottom: 10 }]}>{t('book.growth_title')}</Text>

                {/* Sparkline */}
                <GrowthSparkline measurements={m.data} color={child.color} />

                {/* Tabel header */}
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: child.color || COLORS.teal,
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  marginTop: 8,
                }}>
                  <Text style={{ flex: 2, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>
                    {t('book.growth_date')}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white, textAlign: 'right' }}>
                    {t('book.growth_height')}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white, textAlign: 'right' }}>
                    {t('book.growth_weight')}
                  </Text>
                </View>

                {/* Tabel rijen */}
                {m.data.map((row, i) => (
                  <View key={row.id} style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.lightBg,
                  }}>
                    <Text style={[styles.body, { flex: 2 }]}>
                      {new Date(row.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                    <Text style={[styles.body, { flex: 1, textAlign: 'right' }]}>
                      {row.height ? `${row.height} cm` : '-'}
                    </Text>
                    <Text style={[styles.body, { flex: 1, textAlign: 'right' }]}>
                      {row.weight ? `${row.weight} kg` : '-'}
                    </Text>
                  </View>
                ))}
              </View>
            )
          })()}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Fases · {child.name} · {t('book.milestones_chapter')}</Text>
          </View>
        </Page>
      ))}
    </>
  )
}
