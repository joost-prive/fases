import { Page, View, Text } from '@react-pdf/renderer'
import { COLORS, styles } from '../pdfTheme'

export default function MonthChapterPage({ month, questionCount, t }) {
  return (
    <Page size="A4" style={{
      backgroundColor: COLORS.teal,
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
          opacity: 0.2,
          lineHeight: 1,
          marginBottom: -8,
        }}>
          {t(`months.${month}`)}
        </Text>
        <Text style={{
          fontSize: 42,
          fontFamily: 'Helvetica-Bold',
          color: COLORS.white,
          lineHeight: 1.1,
        }}>
          {t(`months.${month}`)}
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.white,
          opacity: 0.8,
          marginTop: 12,
          fontFamily: 'Helvetica',
        }}>
          {t('book.chapter_questions', { count: questionCount })}
        </Text>
      </View>

      <View style={{
        backgroundColor: COLORS.primary,
        height: 6,
        borderRadius: 3,
      }} />
    </Page>
  )
}
