import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Heart, BookOpen, Clock } from 'lucide-react'
import { addChild, completeOnboarding } from '../utils/storage'
import { CHILD_COLORS } from '../data/questions'
import KidCharacter from '../components/KidCharacter'

function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-10 page-enter">
      {/* Drie groeipoppetjes als header */}
      <div className="flex items-end justify-center gap-4 mb-6">
        <KidCharacter phase="baby"    color="#E07845" width={48} />
        <KidCharacter phase="kleuter" color="#5A9EA0" width={64} />
        <KidCharacter phase="tiener"  color="#9B7EC8" width={48} />
      </div>

      <h1 className="text-3xl font-bold text-text-dark mb-3 leading-tight">
        Welkom bij<br />
        <span className="text-primary">Fases</span>
      </h1>

      <p className="text-text-muted text-base leading-relaxed mb-8 max-w-xs">
        Geen dagboek, maar een <strong className="text-text-dark">maandboek</strong>.
        Minimale inspanning, maximaal resultaat.
      </p>

      <div className="w-full max-w-xs space-y-3 mb-10">
        {[
          { icon: BookOpen, text: '10 vragen per maand, wanneer het jou uitkomt', color: 'text-primary' },
          { icon: Heart,    text: 'Voor al je kinderen tegelijk',                  color: 'text-rose' },
          { icon: Clock,    text: 'Zie hoe je kinderen groeien — jaar na jaar',    color: 'text-teal' },
        ].map(({ icon: Icon, text, color }, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-border-light">
            <div className={`${color} mt-0.5 flex-shrink-0`}>
              <Icon size={20} />
            </div>
            <p className="text-sm text-text-dark text-left leading-snug">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
      >
        Beginnen <ChevronRight size={20} />
      </button>
    </div>
  )
}

function AddChildStep({ onFinish }) {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [selectedColor, setSelectedColor] = useState(CHILD_COLORS[0])
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return setError('Vul een naam in')
    if (!birthdate) return setError('Vul een geboortedatum in')
    setError('')
    addChild({ name: name.trim(), birthdate, color: selectedColor })
    onFinish()
  }

  return (
    <div className="flex flex-col px-6 py-8 page-enter">
      <div className="mb-6">
        {/* Poppetje dat meegroeit met de ingevoerde geboortedatum */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="rounded-2xl flex items-end justify-center overflow-hidden flex-shrink-0"
            style={{ width: 60, height: 72, backgroundColor: selectedColor + '22' }}
          >
            <KidCharacter birthdate={birthdate || undefined} color={selectedColor} width={42} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-1">Voeg je eerste kind toe</h2>
            <p className="text-text-muted text-sm">Je kunt later meer kinderen toevoegen.</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Naam</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Bijv. Emma of Liam"
            className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark placeholder-text-muted focus:outline-none focus:border-primary bg-white text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Geboortedatum</label>
          <input
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark focus:outline-none focus:border-primary bg-white text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-3">Kleur</label>
          <div className="flex gap-3 flex-wrap">
            {CHILD_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="w-10 h-10 rounded-full transition-all duration-150 flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <div className="w-3 h-3 bg-white rounded-full shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview kaart */}
        {name && (
          <div className="bg-white rounded-2xl p-4 border border-border-light flex items-center gap-4">
            <div
              className="rounded-2xl flex items-end justify-center overflow-hidden flex-shrink-0"
              style={{ width: 56, height: 68, backgroundColor: selectedColor + '22' }}
            >
              <KidCharacter birthdate={birthdate || undefined} color={selectedColor} width={40} />
            </div>
            <div>
              <p className="font-semibold text-text-dark">{name}</p>
              {birthdate && (
                <p className="text-sm text-text-muted">
                  Geboren op {new Date(birthdate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-rose text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mt-4"
        >
          Klaar! Start de app <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const handleFinish = () => {
    completeOnboarding()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Voortgangsbollen */}
      <div className="flex justify-center gap-2 pt-6">
        {[0, 1].map(i => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-primary' : 'w-2 bg-border-light'
            }`}
          />
        ))}
      </div>

      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && <AddChildStep onFinish={handleFinish} />}
    </div>
  )
}
