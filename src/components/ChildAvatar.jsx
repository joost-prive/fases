export default function ChildAvatar({ child, size = 'md', showName = false, className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  }

  const initial = child.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0`}
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
