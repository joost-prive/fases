import { lazy, Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buildBookData } from '../utils/bookData'
import { getChildren } from '../utils/storage'

// Lazy-load de zware PDF bundle (~280KB) — alleen bij /boek
const PDFDownloadLink = lazy(() =>
  import('@react-pdf/renderer').then(m => ({ default: m.PDFDownloadLink }))
)
const BookDocument = lazy(() => import('../components/pdf/BookDocument'))

function StatCard({ label, value, color }) {
  return (
    <div className="bg-background rounded-xl p-3 text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </div>
  )
}

function estimatePageCount(bookData) {
  let count = 1 // cover
  bookData.months.forEach(({ questions }) => {
    count += 1 // maand-chapter
    count += questions.length // per vraag een pagina
  })
  if (bookData.birthday.length > 0) {
    count += 1 + bookData.birthday.length // chapter + per jaar
  }
  if (bookData.milestones.length > 0 || bookData.measurements.length > 0) {
    count += 1 + bookData.milestones.length // chapter + per kind
  }
  return count
}

export default function Book() {
  const { t } = useTranslation()
  const children = getChildren()
  const bookData = buildBookData()
  const hasData = !!bookData

  const filename = bookData
    ? `Fases_Gezinsboek_${bookData.yearRange.first}_${bookData.yearRange.last}.pdf`
    : 'Fases_Gezinsboek.pdf'

  return (
    <div className="min-h-screen pb-24 page-enter">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">{t('book.subtitle')}</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          {t('book.title')}
          <BookOpen size={20} className="text-primary" />
        </h1>
      </div>

      <div className="px-5 py-6 space-y-5">

        {!hasData ? (
          /* Lege staat */
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📖</p>
            <p className="font-semibold text-text-dark">{t('book.empty_title')}</p>
            <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">{t('book.empty_desc')}</p>
          </div>
        ) : (
          <>
            {/* Boek preview */}
            <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
              <h2 className="font-bold text-text-dark mb-1">{t('book.preview_title')}</h2>
              <p className="text-sm text-text-muted mb-4">
                {t('book.preview_desc', {
                  children: children.map(c => c.name).join(', '),
                  yearFrom: bookData.yearRange.first,
                  yearTo: bookData.yearRange.last,
                })}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <StatCard
                  label={t('book.stat_children')}
                  value={children.length}
                  color="#E07845"
                />
                <StatCard
                  label={t('book.stat_months')}
                  value={bookData.months.length}
                  color="#5A9EA0"
                />
                <StatCard
                  label={t('book.stat_pages')}
                  value={`~${estimatePageCount(bookData)}`}
                  color="#9B7EC8"
                />
              </div>

              {/* Download knop — lazy loaded */}
              <Suspense fallback={
                <button className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl opacity-60 cursor-wait">
                  {t('book.preparing')}
                </button>
              }>
                <PDFDownloadLink
                  document={<BookDocument bookData={bookData} t={t} />}
                  fileName={filename}
                >
                  {({ loading }) => (
                    <button
                      className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl transition-opacity active:opacity-80"
                      style={{ opacity: loading ? 0.6 : 1 }}
                    >
                      {loading ? t('book.generating') : t('book.download_btn')}
                    </button>
                  )}
                </PDFDownloadLink>
              </Suspense>
            </div>

            {/* Print-on-demand teaser */}
            <div className="bg-white rounded-2xl border border-teal/30 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🖨️</span>
                <h3 className="font-semibold text-text-dark">{t('book.print_title')}</h3>
                <span className="text-xs bg-yellow-100 text-text-muted px-2 py-0.5 rounded-full font-medium ml-auto">
                  {t('book.coming_soon')}
                </span>
              </div>
              <p className="text-sm text-text-muted">{t('book.print_desc')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
