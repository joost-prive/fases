export default function SeasonalBackground({ season }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        {season === 'winter' && <WinterScene />}
        {season === 'spring' && <SpringScene />}
        {season === 'summer' && <SummerScene />}
        {season === 'autumn' && <AutumnScene />}
      </svg>
    </div>
  )
}

function WinterScene() {
  return (
    <>
      <defs>
        <linearGradient id="winterSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D47A1" />
          <stop offset="40%" stopColor="#1976D2" />
          <stop offset="75%" stopColor="#5C85C5" />
          <stop offset="100%" stopColor="#BBDEFB" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="390" height="844" fill="url(#winterSky)" />
      {/* Stars */}
      {[[30,60],[80,30],[150,45],[220,20],[290,55],[340,35],[370,80],[55,100],[180,90],[310,75]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.8" />
      ))}
      {/* Moon */}
      <circle cx="320" cy="80" r="28" fill="#E3F2FD" opacity="0.9" />
      <circle cx="332" cy="72" r="22" fill="#1976D2" opacity="0.9" />
      {/* Far snowy hills */}
      <path d="M0,560 C60,490 130,520 200,500 C270,480 330,510 390,490 L390,844 L0,844 Z" fill="#CBD5D5" />
      {/* Mid snow */}
      <path d="M0,640 C80,590 160,620 250,600 C320,585 360,610 390,600 L390,844 L0,844 Z" fill="#D9E8EE" />
      {/* Near ground */}
      <path d="M0,720 C100,690 200,710 280,700 C340,694 370,706 390,700 L390,844 L0,844 Z" fill="#EEF7FB" />
      {/* Bare tree left */}
      <BareTree x={55} y={650} scale={1} />
      {/* Bare tree right */}
      <BareTree x={310} y={640} scale={0.85} />
      {/* Snow on far hill peaks */}
      <ellipse cx="200" cy="498" rx="40" ry="10" fill="white" opacity="0.5" />
      <ellipse cx="390" cy="488" rx="30" ry="8" fill="white" opacity="0.4" />
      {/* Snowflakes */}
      {[[60,200],[130,280],[200,150],[270,230],[330,190],[90,350],[350,310],[170,400],[290,380]].map(([x,y],i) => (
        <Snowflake key={i} cx={x} cy={y} r={3 + (i % 3)} />
      ))}
    </>
  )
}

function BareTree({ x, y, scale = 1 }) {
  const s = scale
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Trunk */}
      <rect x="-4" y="-80" width="8" height="80" rx="3" fill="#3E2723" />
      {/* Main branches */}
      <line x1="0" y1="-60" x2="-35" y2="-100" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="-60" x2="32" y2="-98" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="-40" x2="-22" y2="-70" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="-40" x2="25" y2="-75" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
      {/* Sub branches */}
      <line x1="-35" y1="-100" x2="-50" y2="-128" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
      <line x1="-35" y1="-100" x2="-18" y2="-122" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="-98" x2="46" y2="-126" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="-98" x2="16" y2="-120" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
      {/* Snow on branches */}
      <ellipse cx="-43" cy="-129" rx="10" ry="4" fill="white" opacity="0.85" />
      <ellipse cx="46" cy="-127" rx="9" ry="4" fill="white" opacity="0.85" />
      <ellipse cx="-17" cy="-121" rx="7" ry="3" fill="white" opacity="0.75" />
    </g>
  )
}

function Snowflake({ cx, cy, r }) {
  return (
    <g>
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="white" strokeWidth="1.2" opacity="0.7" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="white" strokeWidth="1.2" opacity="0.7" />
      <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1={cx + r * 0.7} y1={cy - r * 0.7} x2={cx - r * 0.7} y2={cy + r * 0.7} stroke="white" strokeWidth="1" opacity="0.6" />
    </g>
  )
}

function SpringScene() {
  return (
    <>
      <defs>
        <linearGradient id="springSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="30%" stopColor="#FFCDD2" />
          <stop offset="65%" stopColor="#B3E5FC" />
          <stop offset="100%" stopColor="#E1F5FE" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="390" height="844" fill="url(#springSky)" />
      {/* Sun */}
      <circle cx="60" cy="90" r="38" fill="#FFE082" opacity="0.92" />
      <circle cx="60" cy="90" r="30" fill="#FFD54F" />
      {/* Soft clouds */}
      <SpringCloud cx={230} cy={110} />
      <SpringCloud cx={330} cy={70} />
      {/* Far hills */}
      <path d="M0,570 C70,510 140,540 210,520 C280,500 340,530 390,510 L390,844 L0,844 Z" fill="#8BC34A" />
      {/* Mid hills */}
      <path d="M0,650 C90,610 170,635 255,618 C330,604 365,625 390,618 L390,844 L0,844 Z" fill="#7CB342" />
      {/* Near ground */}
      <path d="M0,730 C110,700 210,720 295,710 C350,704 375,716 390,712 L390,844 L0,844 Z" fill="#9CCC65" />
      {/* Blooming trees */}
      <BlossomTree x={70} y={648} />
      <BlossomTree x={290} y={638} scale={0.9} pinkShade="#F48FB1" />
      <BlossomTree x={170} y={680} scale={0.75} pinkShade="#FCE4EC" />
      {/* Floating petals */}
      {[[100,300],[170,250],[240,320],[310,270],[50,380],[350,350],[130,430],[280,420]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx={4} ry={2.5} fill="#F48FB1" opacity={0.55 + (i % 4) * 0.1} transform={`rotate(${i*25},${x},${y})`} />
      ))}
      {/* Tiny flowers in ground */}
      {[[80,745],[155,738],[230,742],[310,736],[370,740]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#FFEB3B" />
          <circle cx={x} cy={y} r="2.5" fill="#FF9800" />
        </g>
      ))}
    </>
  )
}

function SpringCloud({ cx, cy }) {
  return (
    <g opacity="0.82">
      <ellipse cx={cx} cy={cy} rx="38" ry="18" fill="white" />
      <ellipse cx={cx - 22} cy={cy + 4} rx="22" ry="15" fill="white" />
      <ellipse cx={cx + 22} cy={cy + 4} rx="25" ry="14" fill="white" />
    </g>
  )
}

function BlossomTree({ x, y, scale = 1, pinkShade = '#F06292' }) {
  const s = scale
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-5" y="-75" width="10" height="75" rx="4" fill="#5D4037" />
      <ellipse cx="0" cy="-95" rx="32" ry="30" fill={pinkShade} opacity="0.88" />
      <ellipse cx="-18" cy="-82" rx="22" ry="20" fill="#F48FB1" opacity="0.8" />
      <ellipse cx="20" cy="-85" rx="24" ry="22" fill="#FCE4EC" opacity="0.82" />
      <ellipse cx="5" cy="-115" rx="18" ry="16" fill={pinkShade} opacity="0.75" />
    </g>
  )
}

function SummerScene() {
  return (
    <>
      <defs>
        <linearGradient id="summerSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="35%" stopColor="#1E88E5" />
          <stop offset="70%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#90CAF9" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="390" height="844" fill="url(#summerSky)" />
      {/* Sun */}
      <circle cx="320" cy="75" r="50" fill="#FFD600" opacity="0.3" />
      <circle cx="320" cy="75" r="38" fill="#FFD600" opacity="0.5" />
      <circle cx="320" cy="75" r="28" fill="#FFD600" opacity="0.95" />
      {/* Sun rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        return (
          <line
            key={i}
            x1={320 + Math.cos(angle) * 35}
            y1={75 + Math.sin(angle) * 35}
            x2={320 + Math.cos(angle) * 52}
            y2={75 + Math.sin(angle) * 52}
            stroke="#FFD600"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        )
      })}
      {/* Clouds */}
      <SummerCloud cx={80} cy={120} />
      <SummerCloud cx={210} cy={80} scale={0.8} />
      {/* Far forest hills */}
      <path d="M0,555 C65,490 140,525 220,505 C300,485 350,515 390,500 L390,844 L0,844 Z" fill="#2E7D32" />
      {/* Mid hills */}
      <path d="M0,645 C90,605 175,628 260,612 C335,600 368,620 390,614 L390,844 L0,844 Z" fill="#388E3C" />
      {/* Near ground */}
      <path d="M0,728 C115,698 215,716 300,706 C355,700 378,712 390,708 L390,844 L0,844 Z" fill="#43A047" />
      {/* Lush round trees */}
      <SummerTree x={65} y={648} />
      <SummerTree x={305} y={638} scale={1.1} shade="#1B5E20" />
      <SummerTree x={175} y={672} scale={0.85} />
    </>
  )
}

function SummerCloud({ cx, cy, scale = 1 }) {
  const s = scale
  return (
    <g opacity="0.88" transform={`translate(${cx},${cy}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="40" ry="20" fill="white" />
      <ellipse cx="-25" cy="5" rx="25" ry="16" fill="white" />
      <ellipse cx="28" cy="4" rx="28" ry="17" fill="white" />
      <ellipse cx="5" cy="-14" rx="22" ry="18" fill="white" />
    </g>
  )
}

function SummerTree({ x, y, scale = 1, shade = '#2E7D32' }) {
  const s = scale
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-6" y="-80" width="12" height="80" rx="5" fill="#4E342E" />
      <ellipse cx="0" cy="-100" rx="38" ry="36" fill={shade} opacity="0.9" />
      <ellipse cx="-20" cy="-88" rx="26" ry="24" fill="#388E3C" opacity="0.85" />
      <ellipse cx="22" cy="-92" rx="28" ry="26" fill="#43A047" opacity="0.85" />
      <ellipse cx="4" cy="-122" rx="22" ry="20" fill={shade} opacity="0.8" />
    </g>
  )
}

function AutumnScene() {
  const leafColors = ['#FF5722', '#FF7043', '#FF9800', '#FFA726', '#FFCA28', '#E53935', '#D84315']
  return (
    <>
      <defs>
        <linearGradient id="autumnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B71C1C" />
          <stop offset="30%" stopColor="#D32F2F" />
          <stop offset="60%" stopColor="#FF7043" />
          <stop offset="85%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="390" height="844" fill="url(#autumnSky)" />
      {/* Atmospheric haze at horizon */}
      <rect x="0" y="450" width="390" height="80" fill="#FFD54F" opacity="0.18" />
      {/* Far hills */}
      <path d="M0,555 C70,495 145,528 220,508 C300,488 348,518 390,502 L390,844 L0,844 Z" fill="#5D4037" />
      {/* Mid hills */}
      <path d="M0,645 C85,604 168,628 255,612 C332,600 368,620 390,614 L390,844 L0,844 Z" fill="#6D4C41" />
      {/* Near ground */}
      <path d="M0,725 C112,695 212,715 298,705 C352,699 377,711 390,707 L390,844 L0,844 Z" fill="#795548" />
      {/* Autumn trees */}
      <AutumnTree x={62} y={648} />
      <AutumnTree x={298} y={638} shade1="#FF5722" shade2="#FFA726" scale={0.9} />
      <AutumnTree x={168} y={675} shade1="#FFCA28" shade2="#FF9800" scale={0.8} />
      {/* Falling leaves */}
      {[
        [45,180,0],[120,220,25],[195,160,-15],[265,240,35],[330,185,-20],
        [75,310,10],[155,360,-30],[240,300,20],[315,340,-10],[380,270,30],
        [30,420,15],[100,470,-25],[200,440,5],[290,480,-15],[360,410,25],
      ].map(([x,y,rot],i) => (
        <ellipse
          key={i}
          cx={x} cy={y}
          rx={6} ry={4}
          fill={leafColors[i % leafColors.length]}
          opacity={0.7 + (i % 3) * 0.1}
          transform={`rotate(${rot},${x},${y})`}
        />
      ))}
    </>
  )
}

function AutumnTree({ x, y, scale = 1, shade1 = '#E53935', shade2 = '#FF7043' }) {
  const s = scale
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-5" y="-78" width="10" height="78" rx="4" fill="#3E2723" />
      <ellipse cx="0" cy="-98" rx="36" ry="34" fill={shade1} opacity="0.88" />
      <ellipse cx="-19" cy="-86" rx="24" ry="22" fill={shade2} opacity="0.82" />
      <ellipse cx="21" cy="-90" rx="26" ry="24" fill="#FFCA28" opacity="0.8" />
      <ellipse cx="4" cy="-120" rx="20" ry="18" fill={shade1} opacity="0.78" />
    </g>
  )
}
