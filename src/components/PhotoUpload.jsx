import { useRef, useState } from 'react'
import { Camera, X, Loader2, ImagePlus } from 'lucide-react'

/**
 * Herbruikbaar foto-upload component.
 *
 * Props:
 *   url        — huidige foto-URL (null = geen foto)
 *   onUpload   — async fn(file: File) → void, aangeroepen na selectie
 *   onDelete   — async fn() → void, aangeroepen bij verwijderen
 *   aspectRatio — Tailwind aspect-ratio class (default: 'aspect-[4/3]')
 *   emptyLabel  — tekst in lege staat (default: 'Foto toevoegen')
 *   className   — extra klassen op de wrapper
 */
export default function PhotoUpload({
  url,
  onUpload,
  onDelete,
  aspectRatio = 'aspect-[4/3]',
  emptyLabel = 'Foto toevoegen',
  className = '',
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const triggerPicker = () => {
    setError('')
    inputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Maximaal 15 MB
    if (file.size > 15 * 1024 * 1024) {
      setError('Foto is te groot (max 15 MB)')
      return
    }

    setUploading(true)
    setError('')
    try {
      await onUpload(file)
    } catch (err) {
      setError('Upload mislukt. Probeer opnieuw.')
      console.error(err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      await onDelete()
    } catch (err) {
      setError('Verwijderen mislukt.')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const busy = uploading || deleting

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {url ? (
        /* ─── Foto aanwezig ─── */
        <div className={`relative w-full rounded-2xl overflow-hidden bg-black/5 ${aspectRatio}`}>
          <img
            src={url}
            alt="Foto"
            className="w-full h-full object-cover"
          />
          {busy && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={28} className="text-white animate-spin" />
            </div>
          )}
          {!busy && (
            <>
              {/* Vervangen */}
              <button
                onClick={triggerPicker}
                className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm"
                title="Foto vervangen"
              >
                <Camera size={15} />
              </button>
              {/* Verwijderen */}
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm"
                title="Foto verwijderen"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      ) : (
        /* ─── Geen foto: upload-knop ─── */
        <button
          onClick={triggerPicker}
          disabled={busy}
          className={`w-full rounded-2xl border-2 border-dashed border-border-light bg-white flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50 ${aspectRatio}`}
        >
          {busy
            ? <Loader2 size={26} className="animate-spin" />
            : <>
                <ImagePlus size={26} />
                <span className="text-sm font-medium">{emptyLabel}</span>
              </>
          }
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose">{error}</p>
      )}
    </div>
  )
}
