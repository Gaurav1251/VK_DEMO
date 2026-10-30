import { useId } from 'react';

export const DRAWING_STYLES = [
  { id: 'neutral-link', label: 'Neutral link' },
  { id: 'terminal-block', label: 'Terminal block' },
  { id: 'pin', label: 'Socket pin' },
  { id: 'gland', label: 'Cable gland' },
  { id: 'fitting', label: 'Tee fitting' },
  { id: 'nozzle', label: 'Nozzle' },
  { id: 'flange', label: 'Flange' },
  { id: 'union', label: 'Union' },
  { id: 'insert', label: 'Insert' },
  { id: 'shaft', label: 'Spool shaft' },
  { id: 'valve', label: 'Valve body' },
  { id: 'nut', label: 'Hex nut' },
  { id: 'screw', label: 'Screw' },
  { id: 'turned', label: 'Turned part' },
  { id: 'clamp', label: 'Clamp' },
  { id: 'plate', label: 'Pressed part' },
];

/** Dimension line with arrowheads and a centred label. */
function Dim({ x1, y1, x2, y2, label, arrow, color, side = -1 }) {
  const vertical = x1 === x2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" markerStart={`url(#${arrow})`} markerEnd={`url(#${arrow})`} />
      {vertical ? (
        <text x={x1 + (side < 0 ? -5 : 5)} y={my} fill={color} stroke="none" fontSize="8" fontWeight="700" textAnchor={side < 0 ? 'end' : 'start'} dominantBaseline="middle">
          {label}
        </text>
      ) : (
        <text x={mx} y={y1 + (side < 0 ? -5 : 11)} fill={color} stroke="none" fontSize="8" fontWeight="700" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

const thread = (x, y, w, h, step = 5) =>
  Array.from({ length: Math.floor(w / step) }, (_, i) => (
    <line key={i} x1={x + 3 + i * step} y1={y} x2={x + 1 + i * step} y2={y + h} strokeWidth="0.8" />
  ));

const vThread = (x, y, w, h, step = 5) =>
  Array.from({ length: Math.floor(h / step) }, (_, i) => (
    <line key={i} x1={x} y1={y + 3 + i * step} x2={x + w} y2={y + 1 + i * step} strokeWidth="0.8" />
  ));

function Knurl({ x, y, w, h, clip }) {
  const lines = [];
  for (let i = -h; i < w; i += 7) {
    lines.push(<line key={`a${i}`} x1={x + i} y1={y + h} x2={x + i + h} y2={y} strokeWidth="0.6" />);
    lines.push(<line key={`b${i}`} x1={x + i} y1={y} x2={x + i + h} y2={y + h} strokeWidth="0.6" />);
  }
  return (
    <g clipPath={`url(#${clip})`} opacity="0.7">
      {lines}
    </g>
  );
}

function Centre({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.7" strokeDasharray="10 3 2 3" opacity="0.6" />;
}

function shapes(style, d, ids) {
  const D = (props) => <Dim arrow={ids.arrow} color={d} {...props} />;
  switch (style) {
    case 'neutral-link':
      return (
        <>
          <rect x="40" y="70" width="160" height="28" rx="3" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <circle cx={62 + i * 23} cy="84" r="6.5" />
              <path d={`M${58 + i * 23} 84h8M${62 + i * 23} 80v8`} strokeWidth="0.9" />
            </g>
          ))}
          {[58, 182].map((x) => (
            <g key={x}>
              <rect x={x - 6} y="46" width="12" height="16" />
              {vThread(x - 6, 46, 12, 16, 4)}
              <rect x={x - 10} y="62" width="20" height="8" rx="1" />
            </g>
          ))}
          <Centre x1="32" y1="84" x2="208" y2="84" />
          <D x1={40} y1={118} x2={200} y2={118} label="L = 126" side={1} />
          <D x1={214} y1={70} x2={214} y2={98} label="10" side={1} />
        </>
      );
    case 'terminal-block':
      return (
        <>
          <rect x="50" y="48" width="140" height="62" rx="4" />
          <line x1="50" y1="80" x2="190" y2="80" strokeWidth="0.8" />
          {[86, 154].map((x) => (
            <g key={x}>
              <circle cx={x} cy="64" r="8" />
              <path d={`M${x - 5} 64h10M${x} 59v10`} strokeWidth="0.9" />
              <rect x={x - 16} y="88" width="32" height="14" rx="2" />
            </g>
          ))}
          <D x1={50} y1={128} x2={190} y2={128} label="38.0" side={1} />
          <D x1={34} y1={48} x2={34} y2={110} label="16" />
        </>
      );
    case 'pin':
      return (
        <>
          <path d="M48 72h100v16H48a8 8 0 0 1 0-16z" />
          <line x1="44" y1="80" x2="96" y2="80" strokeWidth="0.9" />
          <rect x="148" y="62" width="14" height="36" rx="1.5" />
          <rect x="162" y="73" width="40" height="14" />
          {thread(162, 73, 40, 14, 4)}
          <Centre x1="30" y1="80" x2="212" y2="80" />
          <D x1={40} y1={118} x2={202} y2={118} label="32.5" side={1} />
          <D x1={155} y1={40} x2={155} y2={62} label="Ø6" side={1} />
        </>
      );
    case 'gland':
      return (
        <>
          <path d="M92 50c4-22 52-22 56 0" />
          <rect x="84" y="50" width="72" height="22" rx="2" />
          <path d="M108 50v22M132 50v22" strokeWidth="0.8" />
          <rect x="94" y="72" width="52" height="12" />
          {thread(94, 72, 52, 12, 5)}
          <rect x="84" y="84" width="72" height="20" rx="2" />
          <path d="M108 84v20M132 84v20" strokeWidth="0.8" />
          <rect x="96" y="104" width="48" height="22" />
          {thread(96, 104, 48, 22, 5)}
          <Centre x1="120" y1="22" x2="120" y2="136" />
          <D x1={84} y1={146} x2={156} y2={146} label="M20" side={1} />
          <D x1={176} y1={28} x2={176} y2={126} label="42" side={1} />
        </>
      );
    case 'fitting':
      return (
        <>
          <rect x="58" y="70" width="124" height="28" />
          <rect x="106" y="40" width="28" height="30" />
          <rect x="40" y="64" width="18" height="40" rx="1.5" />
          <rect x="182" y="64" width="18" height="40" rx="1.5" />
          <rect x="100" y="28" width="40" height="12" rx="1.5" />
          {vThread(40, 64, 18, 40, 5)}
          {vThread(182, 64, 18, 40, 5)}
          <Centre x1="30" y1="84" x2="210" y2="84" />
          <Centre x1="120" y1="18" x2="120" y2="110" />
          <D x1={40} y1={124} x2={200} y2={124} label={'½" BSP · 64'} side={1} />
        </>
      );
    case 'nozzle':
      return (
        <>
          <rect x="40" y="68" width="34" height="24" />
          {thread(40, 68, 34, 24, 5)}
          <rect x="74" y="58" width="30" height="44" rx="1.5" />
          <path d="M84 58v44M94 58v44" strokeWidth="0.8" />
          <path d="M104 64h30l52 10v12l-52 10h-30z" />
          <line x1="104" y1="80" x2="200" y2="80" strokeWidth="0.7" strokeDasharray="4 3" />
          <D x1={40} y1={124} x2={186} y2={124} label="48.0" side={1} />
          <D x1={200} y1={74} x2={200} y2={86} label="Ø1.2" side={1} />
        </>
      );
    case 'flange':
      return (
        <>
          <circle cx="110" cy="80" r="44" />
          <circle cx="110" cy="80" r="17" />
          <circle cx="110" cy="80" r="21" strokeWidth="0.7" strokeDasharray="3 2" />
          {[0, 90, 180, 270].map((a) => {
            const r = (a * Math.PI) / 180;
            return <circle key={a} cx={110 + 32 * Math.cos(r + Math.PI / 4)} cy={80 + 32 * Math.sin(r + Math.PI / 4)} r="5" />;
          })}
          <circle cx="110" cy="80" r="32" strokeWidth="0.6" strokeDasharray="10 3 2 3" opacity="0.6" />
          <Centre x1="56" y1="80" x2="164" y2="80" />
          <Centre x1="110" y1="26" x2="110" y2="134" />
          <D x1={66} y1={146} x2={154} y2={146} label="Ø88" side={1} />
          <text x="170" y="48" fontSize="8" fontWeight="700" stroke="none" fill={d}>PCD 64</text>
          <text x="170" y="60" fontSize="8" fontWeight="700" stroke="none" fill={d}>4 × Ø10</text>
        </>
      );
    case 'union':
      return (
        <>
          <rect x="40" y="68" width="50" height="24" />
          {thread(40, 68, 30, 24, 5)}
          <rect x="90" y="54" width="60" height="52" rx="2" />
          <path d="M90 67h60M90 93h60" strokeWidth="0.8" />
          <rect x="150" y="68" width="50" height="24" />
          {thread(170, 68, 30, 24, 5)}
          <Centre x1="30" y1="80" x2="210" y2="80" />
          <D x1={40} y1={124} x2={200} y2={124} label="72.0" side={1} />
          <D x1={90} y1={40} x2={150} y2={40} label="HEX 36" />
        </>
      );
    case 'insert':
      return (
        <>
          <rect x="82" y="40" width="76" height="80" rx="4" />
          <Knurl x={82} y={40} w={76} h={80} clip={ids.clip} />
          <rect x="78" y="74" width="84" height="10" fill="#fff" />
          <line x1="106" y1="36" x2="106" y2="124" strokeWidth="0.8" strokeDasharray="4 3" />
          <line x1="134" y1="36" x2="134" y2="124" strokeWidth="0.8" strokeDasharray="4 3" />
          <Centre x1="120" y1="28" x2="120" y2="132" />
          <D x1={82} y1={142} x2={158} y2={142} label="Ø12.5" side={1} />
          <D x1={178} y1={40} x2={178} y2={120} label="16" side={1} />
          <text x="40" y="36" fontSize="8" fontWeight="700" stroke="none" fill={d}>M8 × 1.25</text>
        </>
      );
    case 'shaft':
      return (
        <>
          <path d="M30 72h30v-8h30v8h30v-8h30v8h30v-6h30v28h-30v-6h-30v8h-30v-8h-30v8H60v-8H30z" />
          <path d="M60 64v32M90 64v32M120 64v32M150 64v32M180 66v28" strokeWidth="0.7" />
          <Centre x1="20" y1="80" x2="220" y2="80" />
          <D x1={30} y1={120} x2={210} y2={120} label="96.00 ±0.01" side={1} />
          <D x1={75} y1={40} x2={75} y2={64} label="Ø12 h6" side={1} />
        </>
      );
    case 'valve':
      return (
        <>
          <rect x="80" y="62" width="80" height="48" rx="8" />
          <rect x="40" y="74" width="40" height="24" />
          {thread(40, 74, 40, 24, 5)}
          <rect x="160" y="74" width="40" height="24" />
          {thread(160, 74, 40, 24, 5)}
          <rect x="102" y="40" width="36" height="22" rx="2" />
          <rect x="114" y="20" width="12" height="20" />
          <circle cx="120" cy="86" r="10" strokeWidth="0.8" strokeDasharray="3 2" />
          <Centre x1="30" y1="86" x2="210" y2="86" />
          <D x1={40} y1={134} x2={200} y2={134} label="88.0" side={1} />
        </>
      );
    case 'nut':
      return (
        <>
          <path d="M90 38l36.4 21v42L90 122l-36.4-21V59z" />
          <circle cx="90" cy="80" r="17" />
          <circle cx="90" cy="80" r="20.5" strokeWidth="0.7" strokeDasharray="3 2" />
          <circle cx="90" cy="80" r="36.4" strokeWidth="0.6" opacity="0.5" />
          <Centre x1="44" y1="80" x2="136" y2="80" />
          <Centre x1="90" y1="30" x2="90" y2="130" />
          <rect x="160" y="38" width="34" height="84" rx="1.5" />
          <path d="M160 59h34M160 101h34" strokeWidth="0.8" />
          <D x1={53.6} y1={146} x2={126.4} y2={146} label="AF 17" side={1} />
          <D x1={160} y1={28} x2={194} y2={28} label="8" />
        </>
      );
    case 'screw':
      return (
        <>
          <path d="M40 66a6 6 0 0 1 6-6h18v40H46a6 6 0 0 1-6-6z" />
          <line x1="44" y1="80" x2="60" y2="80" strokeWidth="2" />
          <path d="M64 72h124l8 8-8 8H64z" />
          {thread(84, 72, 104, 16, 5)}
          <Centre x1="30" y1="80" x2="210" y2="80" />
          <D x1={64} y1={118} x2={196} y2={118} label="L = 40" side={1} />
          <D x1={40} y1={44} x2={64} y2={44} label="K 4" />
        </>
      );
    case 'turned':
      return (
        <>
          <rect x="34" y="68" width="34" height="24" />
          {thread(34, 68, 34, 24, 5)}
          <rect x="68" y="56" width="32" height="48" rx="1.5" />
          <path d="M68 68h32M68 92h32" strokeWidth="0.8" />
          <rect x="100" y="70" width="44" height="20" />
          <rect x="144" y="60" width="54" height="40" rx="3" />
          <Knurl x={144} y={60} w={54} h={40} clip={ids.clip} />
          <line x1="30" y1="80" x2="206" y2="80" strokeWidth="0.7" strokeDasharray="4 3" opacity="0.8" />
          <D x1={34} y1={124} x2={198} y2={124} label="56.0" side={1} />
          <D x1={210} y1={60} x2={210} y2={100} label="Ø20" side={1} />
        </>
      );
    case 'clamp':
      return (
        <>
          <path d="M70 58v40a12 12 0 0 0 12 12h76a12 12 0 0 0 12-12V58" />
          <path d="M80 58v38a6 6 0 0 0 6 6h68a6 6 0 0 0 6-6V58" />
          <rect x="40" y="52" width="40" height="8" rx="2" />
          <rect x="160" y="52" width="40" height="8" rx="2" />
          <circle cx="56" cy="56" r="2.5" />
          <circle cx="184" cy="56" r="2.5" />
          <D x1={40} y1={34} x2={200} y2={34} label="48.0" />
          <D x1={214} y1={58} x2={214} y2={110} label="14" side={1} />
        </>
      );
    case 'plate':
    default:
      return (
        <>
          <rect x="40" y="52" width="160" height="56" rx="10" />
          <circle cx="66" cy="80" r="9" />
          <circle cx="174" cy="80" r="9" />
          <rect x="100" y="72" width="40" height="16" rx="8" />
          <line x1="120" y1="46" x2="120" y2="114" strokeWidth="0.7" strokeDasharray="6 3" />
          <D x1={40} y1={130} x2={200} y2={130} label="64.0" side={1} />
          <D x1={66} y1={36} x2={174} y2={36} label="44.0" />
        </>
      );
  }
}

/**
 * Line drawing of a brass part, like an engineering drawing.
 * Place it on a `.drawing-bg` container.
 */
export default function PartDrawing({ style = 'turned', className = '', stroke = '#0B3D91', dim = '#F97316', title }) {
  const uid = useId().replace(/:/g, '');
  const ids = { arrow: `ar-${uid}`, clip: `cl-${uid}` };
  const clipRect = style === 'insert' ? { x: 82, y: 40, w: 76, h: 80 } : { x: 144, y: 60, w: 54, h: 40 };
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label={title || 'Technical line drawing'} fontFamily="'Plus Jakarta Sans', sans-serif">
      <defs>
        <marker id={ids.arrow} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 1.5L9 5L0 8.5z" fill={dim} />
        </marker>
        <clipPath id={ids.clip}>
          <rect x={clipRect.x} y={clipRect.y} width={clipRect.w} height={clipRect.h} rx="3" />
        </clipPath>
      </defs>
      <g fill="rgba(255,255,255,0.75)" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {shapes(style, dim, ids)}
      </g>
    </svg>
  );
}
