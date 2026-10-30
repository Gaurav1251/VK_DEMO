const HOLES = Array.from({ length: 8 }, (_, i) => 128 + i * 44);
const ORANGE = '#FB923C';

function Arrowed({ x1, y1, x2, y2, className = '' }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ORANGE} strokeWidth="1.3" markerStart="url(#hero-ar)" markerEnd="url(#hero-ar)" className={className} />;
}

/** Animated white line drawing of an 8-way brass neutral link, used in the hero. */
export default function HeroDrawing() {
  return (
    <svg viewBox="0 0 600 440" className="h-auto w-full" role="img" aria-label="Technical drawing of an 8-way brass neutral link with dimensions" fontFamily="'Plus Jakarta Sans', sans-serif">
      <defs>
        <marker id="hero-ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 1.5L9 5L0 8.5z" fill={ORANGE} />
        </marker>
        <linearGradient id="hero-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Drawing frame */}
      <rect x="10" y="10" width="580" height="420" rx="14" fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 6" />

      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body: front elevation */}
        <rect x="70" y="190" width="460" height="84" rx="6" fill="url(#hero-body)" className="draw" />
        {/* Hidden bore for cable entry */}
        <path d="M70 212h460M70 252h460" strokeWidth="1" strokeDasharray="8 6" opacity="0.45" className="draw draw-d1" />
        {/* Centre line */}
        <path d="M50 232h500" strokeWidth="0.9" strokeDasharray="18 5 3 5" opacity="0.5" className="draw draw-d1" />

        {/* 8 binding screws */}
        {HOLES.map((x, i) => (
          <g key={x} className="draw draw-d1" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
            <circle cx={x} cy="232" r="15" />
            <circle cx={x} cy="232" r="9" strokeWidth="1.3" />
            <path d={`M${x - 5} 232h10M${x} 227v10`} strokeWidth="1.6" />
          </g>
        ))}

        {/* Mounting studs with hex nuts */}
        {[96, 504].map((x) => (
          <g key={x} className="draw draw-d1">
            <rect x={x - 11} y="118" width="22" height="50" />
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={x - 11} y1={124 + i * 5} x2={x + 11} y2={121 + i * 5} strokeWidth="0.9" />
            ))}
            <rect x={x - 20} y="168" width="40" height="22" rx="2" />
            <path d={`M${x - 7} 168v22M${x + 7} 168v22`} strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* Dimensions */}
      <g className="draw draw-d2">
        <path d="M70 280v58M530 280v58" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Arrowed x1={70} y1={326} x2={530} y2={326} />
        <path d="M216 186v-44M260 186v-44" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Arrowed x1={216} y1={152} x2={260} y2={152} />
        <path d="M536 190h34M536 274h34" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <Arrowed x1={558} y1={190} x2={558} y2={274} />
      </g>
      <g fill={ORANGE} fontSize="13" fontWeight="700" className="fade-up" style={{ animationDelay: '1.6s' }}>
        <text x="300" y="318" textAnchor="middle">126.00 mm</text>
        <text x="238" y="143" textAnchor="middle">15.0</text>
        <text x="566" y="236" textAnchor="middle" transform="rotate(-90 566 236)" dy="-4">20.0</text>
      </g>

      {/* Callouts */}
      <g className="fade-up" style={{ animationDelay: '2s' }}>
        <path d="M392 217L430 96h26" fill="none" stroke={ORANGE} strokeWidth="1.3" />
        <circle cx="392" cy="217" r="3" fill={ORANGE} />
        <rect x="456" y="80" width="118" height="32" rx="8" fill="rgba(5,31,77,0.75)" stroke="rgba(251,146,60,0.65)" />
        <text x="515" y="101" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">M5 binding screw</text>
      </g>
      <g className="fade-up" style={{ animationDelay: '2.3s' }}>
        <path d="M150 274L176 372h18" fill="none" stroke={ORANGE} strokeWidth="1.3" />
        <circle cx="150" cy="274" r="3" fill={ORANGE} />
        <rect x="194" y="356" width="164" height="32" rx="8" fill="rgba(5,31,77,0.75)" stroke="rgba(251,146,60,0.65)" />
        <text x="276" y="377" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Tolerance ±0.007 mm</text>
      </g>

      {/* Title block */}
      <g className="fade-up" style={{ animationDelay: '2.6s' }} fontSize="10" fontWeight="600">
        <rect x="388" y="356" width="186" height="56" rx="6" fill="none" stroke="rgba(255,255,255,0.3)" />
        <line x1="388" y1="384" x2="574" y2="384" stroke="rgba(255,255,255,0.3)" />
        <text x="400" y="374" fill="#fff" letterSpacing="1">8-WAY NEUTRAL LINK</text>
        <text x="400" y="402" fill="rgba(255,255,255,0.65)">VK-NL-08 · CW614N · 2:1</text>
      </g>
      <text x="30" y="40" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="600" letterSpacing="1.5" className="fade-up" style={{ animationDelay: '0.2s' }}>
        FRONT ELEVATION
      </text>
    </svg>
  );
}
