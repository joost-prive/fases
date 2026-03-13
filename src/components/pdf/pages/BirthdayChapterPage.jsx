import { Page, View, Text } from '@react-pdf/renderer'
import { COLORS, styles } from '../pdfTheme'

/**
 * Renders the birthday section for all years × all children.
 * Props:
 *   birthday: [{ year, questions: [{ id, questionText, childAnswers: [{ child, answer, ageLabel }] }] }]
 *   t: i18next translate function
 */
export default function BirthdayChapterPage({ birthday, t }) {
  return (
    <>
      {/* Hoofdstuk-pagina */}
      <Page size="A4" style={{
        backgroundColor: COLORS.yellow,
        fontFamily: 'Helvetica',
        paddingHorizontal: 52,
        paddingTop: 80,
        paddingBottom: 52,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{
            fontSize: 64,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.white,
            opacity: 0.3,
            lineHeight: 1,
            marginBottom: -8,
          }}>
            🎂
          </Text>
          <Text style={{
            fontSize: 42,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.textDark,
            lineHeight: 1.1,
          }}>
            {t('book.birthday_chapter')}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textMuted,
            marginTop: 12,
          }}>
            {t('book.birthday_chapter_desc', { count: birthday.length })}
          </Text>
        </View>
        <View style={{ backgroundColor: COLORS.primary, height: 6, borderRadius: 3 }} />
      </Page>

      {/* Per jaar: vragen + antwoorden */}
      {birthday.map(({ year, questions }) => (
        <Page key={year} size="A4" style={styles.page}>
          {/* Header */}
          <View style={{
            marginHorizontal: -44,
            marginTop: -44,
            paddingHorizontal: 44,
            paddingTop: 20,
            paddingBottom: 16,
            backgroundColor: COLORS.yellow,
            marginBottom: 20,
          }}>
            <Text style={[styles.h3, { color: COLORS.textDark }]}>
              {t('book.birthday_chapter')} · {year}
            </Text>
          </View>

          {questions.map(({ id, questionText, childAnswers }) => (
            <View key={id} style={{ marginBottom: 14 }} wrap={false}>
              <Text style={styles.label}>{questionText}</Text>
              {childAnswers.map(({ child, answer, ageLabel }) => (
                <View key={child.id} style={{ marginBottom: 6 }}>
                  <View style={styles.childBadge}>
                    <View style={[styles.childDot, { backgroundColor: child.color || COLORS.primary }]} />
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childAge}> · {ageLabel}</Text>
                  </View>
                  <View style={styles.answerBlock}>
                    <Text style={styles.body}>{answer}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Fases · {t('book.birthday_chapter')} {year}</Text>
          </View>
        </Page>
      ))}
    </>
  )
}
