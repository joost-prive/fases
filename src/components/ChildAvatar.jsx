import KidCharacter from './KidCharacter'

export default function ChildAvatar({ child, size = 'md', showName = false, className = '' }) {
  const initial = child.name?.charAt(0).toUpperCase() || '?'
  const hasPhoto = !!child.photo

  // sm / md: gekleurde cirkel met initiaal, of ronde profielfoto
  if (size === 'sm' || size === 'md') {
    const dim = size === 'sm' ? 32 : 40
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {hasPhoto ? (
          <img
            src={child.photo}
            alt={child.name}
            className="rounded-full object-cover flex-shrink-0 shadow-sm"
            style={{ width: dim, height: dim }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
            style={{ width: dim, height: dim, backgroundColor: child.color || '#E07845', fontSize: dim * 0.45 }}
          >
            {initial}
          </div>
        )}
        {showName && (
          <span className="text-xs font-medium text-text-dark truncate max-w-[60px] text-center">
            {child.name}
          </span>
        )}
      </div>
    )
  }

  // lg / xl: profielfoto (als aanwezig) of KidCharacter illustratie
  const charWidth = size === 'xl' ? 56 : 42
  const contW    = size === 'xl' ? 80 : 60
  const contH    = size === 'xl' ? 96 : 72
  const bgColor  = (child.color || '#E07845') + '22'

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="rounded-2xl overflow-hidden flex-shrink-0"
        style={{ width: contW, height: contH, backgroundColor: bgColor }}
      >
        {hasPhoto ? (
          <img
            src={child.photo}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-end justify-center">
            <KidCharacter
              birthdate={child.birthdate}
              color={child.color || '#E07845'}
              width={charWidth}
            />
          </div>
        )}
      </div>
      {showName && (
        <span className="text-xs font-medium text-text-dark truncate max-w-[80px] text-center">
          {child.name}
        </span>
      )}
    </div>
  )
}
