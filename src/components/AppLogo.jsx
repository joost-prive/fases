// Logo van Fases: drie bollen die groeien op een lijn — de drie levensfases
// Gebruik: <AppLogo size={32} /> of <AppLogo size={48} withText />

export default function AppLogo({ size = 32, withText = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Het logo-icoon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Achtergrond: warm oranje, afgerond */}
        <rect width="40" height="40" rx="10" fill="#E07845" />
        {/* Verbindingslijn */}
        <line x1="8" y1="22" x2="32" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        {/* Bol 1 — klein (baby) */}
        <circle cx="8"  cy="22" r="3.5" fill="white" />
        {/* Bol 2 — middel (kind) */}
        <circle cx="20" cy="22" r="5"   fill="white" />
        {/* Bol 3 — groot (tiener) */}
        <circle cx="32" cy="22" r="7"   fill="white" />
        {/* Klein sparkle-sterretje linksboven */}
        <path d="M9 10 L10 7 L11 10 L14 11 L11 12 L10 15 L9 12 L6 11 Z" fill="white" opacity="0.7" />
      </svg>

      {/* Optioneel: tekst ernaast */}
      {withText && (
        <span
          className="font-bold text-text-dark"
          style={{ fontSize: size * 0.65, lineHeight: 1 }}
        >
          Fases
        </span>
      )}
    </div>
  )
}
