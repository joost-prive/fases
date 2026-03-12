// SVG-poppetje dat automatisch meegroeit met de leeftijd van het kind
// Fases: baby (0-1) → peuter (1-3) → kleuter (3-6) → schoolkind (6-12) → tiener (12+)

const SKIN = '#FDDBB4'
const HAIR = '#8B5E3C'
const EYE  = '#3D2B1F'
const BLUSH = '#F4ABBE'

function getAgeYears(birthdate) {
  if (!birthdate) return 5
  const birth = new Date(birthdate)
  const now = new Date()
  return (now - birth) / (1000 * 60 * 60 * 24 * 365.25)
}

export function getPhase(ageYears) {
  if (ageYears < 1)  return 'baby'
  if (ageYears < 3)  return 'peuter'
  if (ageYears < 6)  return 'kleuter'
  if (ageYears < 12) return 'schoolkind'
  return 'tiener'
}

// ─── Baby (0-1 jaar) ──────────────────────────────────────────────────────────
function Baby({ color }) {
  return (
    <>
      {/* Armpjes achter romper */}
      <ellipse cx="12" cy="57" rx="8" ry="5" fill={color} transform="rotate(-30 12 57)" />
      <ellipse cx="48" cy="57" rx="8" ry="5" fill={color} transform="rotate(30 48 57)" />
      {/* Romper */}
      <ellipse cx="30" cy="62" rx="15" ry="12" fill={color} />
      {/* Handjes */}
      <circle cx="5"  cy="53" r="4.5" fill={SKIN} />
      <circle cx="55" cy="53" r="4.5" fill={SKIN} />
      {/* Voetjes */}
      <ellipse cx="22" cy="74" rx="7" ry="5" fill={SKIN} />
      <ellipse cx="38" cy="74" rx="7" ry="5" fill={SKIN} />
      {/* Haarpluisje */}
      <path d="M26 4 C28 0 32 0 34 4" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Hoofd - groot voor baby */}
      <circle cx="30" cy="24" r="21" fill={SKIN} />
      {/* Ogen */}
      <circle cx="23" cy="22" r="3"   fill={EYE} />
      <circle cx="37" cy="22" r="3"   fill={EYE} />
      <circle cx="24"  cy="21" r="1.2" fill="white" />
      <circle cx="38"  cy="21" r="1.2" fill="white" />
      {/* Blossies */}
      <circle cx="15" cy="28" r="5" fill={BLUSH} opacity="0.5" />
      <circle cx="45" cy="28" r="5" fill={BLUSH} opacity="0.5" />
      {/* Lachje */}
      <path d="M23 32 Q30 39 37 32" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ─── Peuter (1-3 jaar) ────────────────────────────────────────────────────────
function Peuter({ color }) {
  return (
    <>
      {/* Armen */}
      <rect x="7"  y="40" width="10" height="17" rx="5" fill={color} transform="rotate(-12 12 40)" />
      <rect x="43" y="40" width="10" height="17" rx="5" fill={color} transform="rotate(12 48 40)" />
      {/* Shirt */}
      <rect x="17" y="38" width="26" height="17" rx="6" fill={color} />
      {/* Broek */}
      <rect x="18" y="53" width="24" height="14" rx="5" fill={color} />
      {/* Handjes */}
      <circle cx="8"  cy="57" r="4" fill={SKIN} />
      <circle cx="52" cy="57" r="4" fill={SKIN} />
      {/* Beentjes */}
      <rect x="18" y="65" width="10" height="12" rx="5" fill={SKIN} />
      <rect x="32" y="65" width="10" height="12" rx="5" fill={SKIN} />
      {/* Haar */}
      <path d="M12 22 C12 2 48 2 48 22" fill={HAIR} />
      {/* Hoofd */}
      <circle cx="30" cy="21" r="18" fill={SKIN} />
      {/* Ogen */}
      <circle cx="24" cy="19" r="2.5" fill={EYE} />
      <circle cx="36" cy="19" r="2.5" fill={EYE} />
      <circle cx="24.8" cy="18.2" r="1" fill="white" />
      <circle cx="36.8" cy="18.2" r="1" fill="white" />
      {/* Blossies */}
      <circle cx="17" cy="25" r="4" fill={BLUSH} opacity="0.5" />
      <circle cx="43" cy="25" r="4" fill={BLUSH} opacity="0.5" />
      {/* Lachje */}
      <path d="M24 28 Q30 35 36 28" stroke={EYE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  )
}

// ─── Kleuter (3-6 jaar) ───────────────────────────────────────────────────────
function Kleuter({ color }) {
  return (
    <>
      {/* Armen */}
      <rect x="6"  y="35" width="10" height="19" rx="5" fill={color} transform="rotate(-8 11 35)" />
      <rect x="44" y="35" width="10" height="19" rx="5" fill={color} transform="rotate(8 49 35)" />
      {/* Shirt */}
      <rect x="17" y="34" width="26" height="17" rx="6" fill={color} />
      {/* Broek */}
      <rect x="17" y="49" width="26" height="18" rx="5" fill={color} />
      {/* Handjes */}
      <circle cx="7"  cy="54" r="4" fill={SKIN} />
      <circle cx="53" cy="54" r="4" fill={SKIN} />
      {/* Beentjes */}
      <rect x="17" y="65" width="10" height="14" rx="5" fill={SKIN} />
      <rect x="33" y="65" width="10" height="14" rx="5" fill={SKIN} />
      {/* Haar met zijkanten */}
      <path d="M15 19 C15 2 45 2 45 19" fill={HAIR} />
      <path d="M15 19 C12 13 12 25 15 30" fill={HAIR} />
      <path d="M45 19 C48 13 48 25 45 30" fill={HAIR} />
      {/* Hoofd */}
      <circle cx="30" cy="18" r="15" fill={SKIN} />
      {/* Ogen */}
      <circle cx="25" cy="16" r="2.2" fill={EYE} />
      <circle cx="35" cy="16" r="2.2" fill={EYE} />
      <circle cx="25.7" cy="15.3" r="0.9" fill="white" />
      <circle cx="35.7" cy="15.3" r="0.9" fill="white" />
      {/* Blossies */}
      <circle cx="19" cy="21" r="3.5" fill={BLUSH} opacity="0.5" />
      <circle cx="41" cy="21" r="3.5" fill={BLUSH} opacity="0.5" />
      {/* Lachje */}
      <path d="M25 24 Q30 30 35 24" stroke={EYE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  )
}

// ─── Schoolkind (6-12 jaar) ───────────────────────────────────────────────────
function Schoolkind({ color }) {
  return (
    <>
      {/* Rugzak (achter lichaam) */}
      <rect x="38" y="30" width="10" height="16" rx="4" fill={color} opacity="0.8" />
      <rect x="40" y="34" width="6"  height="8"  rx="2" fill="white" opacity="0.25" />
      {/* Armen */}
      <rect x="7"  y="32" width="10" height="20" rx="5" fill={color} transform="rotate(-5 12 32)" />
      <rect x="43" y="32" width="10" height="20" rx="5" fill={color} transform="rotate(5 48 32)" />
      {/* Shirt */}
      <rect x="17" y="30" width="26" height="18" rx="6" fill={color} />
      {/* Broek */}
      <rect x="17" y="46" width="26" height="22" rx="5" fill={color} />
      {/* Handjes */}
      <circle cx="7"  cy="52" r="3.8" fill={SKIN} />
      <circle cx="53" cy="52" r="3.8" fill={SKIN} />
      {/* Beentjes */}
      <rect x="17" y="66" width="10" height="9" rx="4" fill={SKIN} />
      <rect x="33" y="66" width="10" height="9" rx="4" fill={SKIN} />
      {/* Schoentjes */}
      <ellipse cx="22" cy="77" rx="7" ry="4" fill="#5C3B2E" />
      <ellipse cx="38" cy="77" rx="7" ry="4" fill="#5C3B2E" />
      {/* Haar */}
      <path d="M17 17 C17 3 43 3 43 17" fill={HAIR} />
      <path d="M17 17 C14 11 14 22 17 27" fill={HAIR} />
      {/* Hoofd */}
      <circle cx="30" cy="16" r="13" fill={SKIN} />
      {/* Ogen */}
      <circle cx="25.5" cy="14.5" r="1.9" fill={EYE} />
      <circle cx="34.5" cy="14.5" r="1.9" fill={EYE} />
      <circle cx="26.2" cy="13.8" r="0.75" fill="white" />
      <circle cx="35.2" cy="13.8" r="0.75" fill="white" />
      {/* Blossies */}
      <circle cx="20" cy="19" r="3" fill={BLUSH} opacity="0.5" />
      <circle cx="40" cy="19" r="3" fill={BLUSH} opacity="0.5" />
      {/* Lachje */}
      <path d="M25 23 Q30 28 35 23" stroke={EYE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  )
}

// ─── Tiener (12+ jaar) ────────────────────────────────────────────────────────
function Tiener({ color }) {
  return (
    <>
      {/* Armen */}
      <rect x="7"  y="28" width="10" height="22" rx="5" fill={color} transform="rotate(-3 12 28)" />
      <rect x="43" y="28" width="10" height="22" rx="5" fill={color} transform="rotate(3 48 28)" />
      {/* Shirt */}
      <rect x="17" y="27" width="26" height="17" rx="6" fill={color} />
      {/* Lange broek */}
      <rect x="17" y="42" width="26" height="26" rx="5" fill={color} />
      {/* Handjes */}
      <circle cx="7"  cy="50" r="3.5" fill={SKIN} />
      <circle cx="53" cy="50" r="3.5" fill={SKIN} />
      {/* Beentjes */}
      <rect x="17" y="66" width="10" height="8" rx="4" fill={SKIN} />
      <rect x="33" y="66" width="10" height="8" rx="4" fill={SKIN} />
      {/* Schoentjes - slanker */}
      <ellipse cx="22" cy="76" rx="8" ry="4" fill="#3D2B1F" />
      <ellipse cx="38" cy="76" rx="8" ry="4" fill="#3D2B1F" />
      {/* Haar - gestyled */}
      <path d="M18 15 C18 3 42 3 42 15" fill={HAIR} />
      <path d="M18 15 C15 9 15 20 18 24" fill={HAIR} />
      <path d="M42 15 C45 9 45 20 42 24" fill={HAIR} />
      {/* Hoofd */}
      <circle cx="30" cy="14" r="12" fill={SKIN} />
      {/* Ogen */}
      <circle cx="26" cy="12.5" r="1.7" fill={EYE} />
      <circle cx="34" cy="12.5" r="1.7" fill={EYE} />
      <circle cx="26.6" cy="11.9" r="0.7" fill="white" />
      <circle cx="34.6" cy="11.9" r="0.7" fill="white" />
      {/* Blossies */}
      <circle cx="21" cy="17" r="2.5" fill={BLUSH} opacity="0.45" />
      <circle cx="39" cy="17" r="2.5" fill={BLUSH} opacity="0.45" />
      {/* Lachje */}
      <path d="M25 21 Q30 26 35 21" stroke={EYE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  )
}

// ─── Hoofd-export ─────────────────────────────────────────────────────────────
const PHASE_COMPONENTS = {
  baby: Baby,
  peuter: Peuter,
  kleuter: Kleuter,
  schoolkind: Schoolkind,
  tiener: Tiener,
}

export default function KidCharacter({ birthdate, color = '#E07845', width = 48, phase: phaseProp }) {
  const ageYears = birthdate ? getAgeYears(birthdate) : null
  const phase = phaseProp || (ageYears !== null ? getPhase(ageYears) : 'kleuter')
  const CharComponent = PHASE_COMPONENTS[phase] || Kleuter

  return (
    <svg
      width={width}
      height={Math.round(width * 80 / 60)}
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <CharComponent color={color} />
    </svg>
  )
}
