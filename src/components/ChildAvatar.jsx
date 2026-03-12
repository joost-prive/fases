import KidCharacter from './KidCharacter'

export default function ChildAvatar({ child, size = 'md', showName = false, className = '' }) {
  const initial = child.name?.charAt(0).toUpperCase() || '?'

  // sm / md: gekleurde cirkel met initiaal (te klein voor illustratie)
  if (size === 'sm' || size === 'md') {
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0`}
          style={{ backgroundColor: child.color || '#E07845' }}
        >
          {initial}
        </div>
        {showName && (
          <span className="text-xs font-medium text-text-dark truncate max-w-[60px] text-center">
            {child.name}
          </span>
        )}
      </div>
    )
  }

  // lg / xl: KidCharacter illustratie in gekleurde afgeronde container
  const charWidth  = size === 'xl' ? 56 : 42
  const contW = size === 'xl' ? 80 : 60
  const contH = size === 'xl' ? 96 : 72
  const bgColor = (child.color || '#E07845') + '22' // ~13% opacity

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="rounded-2xl flex items-end justify-center overflow-hidden flex-shrink-0"
        style={{ width: contW, height: contH, backgroundColor: bgColor }}
      >
        <KidCharacter
          birthdate={child.birthdate}
          color={child.color || '#E07845'}
          width={charWidth}
        />
      </div>
      {showName && (
        <span className="text-xs font-medium text-text-dark truncate max-w-[80px] text-center">
          {child.name}
        </span>
      )}
    </div>
  )
}
