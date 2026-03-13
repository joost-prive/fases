import { Document } from '@react-pdf/renderer'
import CoverPage from './pages/CoverPage'
import MonthChapterPage from './pages/MonthChapterPage'
import QuestionPage from './pages/QuestionPage'
import BirthdayChapterPage from './pages/BirthdayChapterPage'
import MilestonesPage from './pages/MilestonesPage'

/**
 * Root PDF document. Receives the assembled bookData + i18next t function.
 * Structure: Cover → Maanden → Verjaardagen → Mijlpalen
 */
export default function BookDocument({ bookData, t }) {
  const { children, yearRange, months, birthday, milestones, measurements } = bookData

  let pageNumber = 1

  return (
    <Document
      title="Fases — Gezinsboek"
      author="Fases"
      creator="Fases App"
      producer="@react-pdf/renderer"
    >
      {/* Cover */}
      <CoverPage children={children} yearRange={yearRange} t={t} />

      {/* Per maand: hoofdstuk + per vraag een pagina */}
      {months.map(({ month, questions }) => {
        const pages = []

        pages.push(
          <MonthChapterPage
            key={`chapter-${month}`}
            month={month}
            questionCount={questions.length}
            t={t}
          />
        )

        questions.forEach(question => {
          pageNumber++
          pages.push(
            <QuestionPage
              key={`q-${month}-${question.id}`}
              question={question}
              month={month}
              t={t}
              pageNumber={pageNumber}
            />
          )
        })

        return pages
      })}

      {/* Verjaardagen */}
      {birthday.length > 0 && (
        <BirthdayChapterPage birthday={birthday} t={t} />
      )}

      {/* Mijlpalen + groeicurve */}
      {(milestones.length > 0 || measurements.length > 0) && (
        <MilestonesPage milestones={milestones} measurements={measurements} t={t} />
      )}
    </Document>
  )
}
