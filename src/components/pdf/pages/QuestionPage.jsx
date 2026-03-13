import { Page, View, Text, Image } from '@react-pdf/renderer'
import { COLORS, styles } from '../pdfTheme'

/**
 * Renders one question with all answers (all years × all children).
 * Props:
 *   question: { id, questionText, entries: [{ year, childAnswers: [{ child, answer, photo, ageLabel }] }] }
 *   month: "Januari" etc.
 *   t: i18next translate function
 *   pageNumber: number
 */
export default function QuestionPage({ question, month, t, pageNumber }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{
        marginHorizontal: -44,
        marginTop: -44,
        paddingHorizontal: 44,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: COLORS.lightBg,
        borderBottom: `1pt solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <Text style={styles.muted}>{t(`months.${month}`)}</Text>
        <Text style={[styles.h3, { marginTop: 3 }]}>{question.questionText}</Text>
      </View>

      {/* Per year × children */}
      {question.entries.map(({ year, childAnswers }) => (
        <View key={year} style={{ marginBottom: 16 }} wrap={false}>
          {/* Jaar label */}
          <View style={{
            backgroundColor: COLORS.border,
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 3,
            alignSelf: 'flex-start',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.textMuted }}>
              {year}
            </Text>
          </View>

          {/* Antwoorden per kind */}
          {childAnswers.map(({ child, answer, photo, ageLabel }) => (
            <View key={child.id} style={{ marginBottom: 8 }}>
              {/* Kind badge */}
              <View style={styles.childBadge}>
                <View style={[styles.childDot, { backgroundColor: child.color || COLORS.primary }]} />
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}> · {ageLabel}</Text>
              </View>

              {/* Antwoord + eventuele foto */}
              <View style={{ flexDirection: photo ? 'row' : 'column', gap: 8 }}>
                <View style={[styles.answerBlock, { flex: 1 }]}>
                  <Text style={styles.body}>{answer}</Text>
                </View>
                {photo && (
                  <Image
                    src={photo}
                    style={{
                      width: 100,
                      height: 80,
                      borderRadius: 6,
                      objectFit: 'cover',
                    }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Fases · {t(`months.${month}`)}</Text>
        <Text style={styles.footerText}>{pageNumber}</Text>
      </View>
    </Page>
  )
}
