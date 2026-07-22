import { memo } from 'react';

export interface ArtworkProps {
  palette: [string, string, string];
  motif: string;
  seed?: string;
  className?: string;
  rounded?: boolean;
}

// Deterministic pseudo-random from a string seed
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function ArtworkBase({ palette, motif, seed = 's', className = '', rounded = true }: ArtworkProps) {
  const [c1, c2, c3] = palette;
  const r = rng(seed + motif);
  const id = seed.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'art';

  return (
    <svg
      viewBox="0 0 400 500"
      className={`${className} ${rounded ? 'rounded-sm' : ''}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor={c3} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c3} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${id}`}><feGaussianBlur stdDeviation="14" /></filter>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${id})`} />
      <rect width="400" height="500" fill={`url(#glow-${id})`} />

      {motif === 'burst' && <Burst r={r} c={c3} id={id} />}
      {motif === 'film' && <Film r={r} c={c3} id={id} />}
      {motif === 'chevron' && <Chevron r={r} c={c3} id={id} />}
      {motif === 'leaf' && <Leaf r={r} c={c3} id={id} />}
      {motif === 'shield' && <Shield r={r} c={c3} id={id} />}
      {motif === 'spark' && <Spark r={r} c={c3} id={id} />}

      {/* subtle grain */}
      <rect width="400" height="500" fill="black" opacity="0.04" />
    </svg>
  );
}

function Burst({ r, c, id }: { r: () => number; c: string; id: string }) {
  const rays = 18;
  const cx = 200, cy = 220;
  return (
    <g opacity="0.9">
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const len = 120 + r() * 180;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * len}
            y2={cy + Math.sin(a) * len}
            stroke={c}
            strokeWidth={2 + r() * 4}
            opacity={0.5 + r() * 0.5}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={30 + r() * 40} fill={c} opacity="0.9" />
      <circle cx={cx} cy={cy} r={60 + r() * 80} fill={c} opacity="0.2" filter={`url(#blur-${id})`} />
    </g>
  );
}

function Film({ r, c, id }: { r: () => number; c: string; id: string }) {
  return (
    <g opacity="0.85">
      <rect x="0" y="60" width="400" height="380" fill="black" opacity="0.3" />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 38} y="70" width="14" height="8" fill={c} opacity="0.6" />
          <rect x={20 + i * 38} y="422" width="14" height="8" fill={c} opacity="0.6" />
        </g>
      ))}
      <circle cx={200} cy={250} r={70 + r() * 50} fill={c} opacity="0.35" filter={`url(#blur-${id})`} />
      <circle cx={200} cy={250} r={40} fill="none" stroke={c} strokeWidth="3" opacity="0.8" />
    </g>
  );
}

function Chevron({ r, c }: { r: () => number; c: string; id: string }) {
  return (
    <g opacity="0.9">
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M${50 + i * 42},400 L${200},${100 + i * 38} L${350 - i * 42},400 Z`}
          fill="none"
          stroke={c}
          strokeWidth={3 + r() * 3}
          opacity={0.3 + (i / 7) * 0.7}
        />
      ))}
    </g>
  );
}

function Leaf({ r, c, id }: { r: () => number; c: string; id: string }) {
  return (
    <g opacity="0.85">
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 60 + r() * 280;
        const y = 80 + r() * 340;
        const rot = r() * 360;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
            <ellipse cx="0" cy="0" rx="18" ry="55" fill={c} opacity={0.4 + r() * 0.5} />
            <line x1="0" y1="-55" x2="0" y2="55" stroke="white" strokeWidth="1" opacity="0.3" />
          </g>
        );
      })}
      <circle cx={200} cy={250} r={90} fill={c} opacity="0.2" filter={`url(#blur-${id})`} />
    </g>
  );
}

function Shield({ r, c }: { r: () => number; c: string; id: string }) {
  return (
    <g opacity="0.9">
      <path
        d="M200,80 L330,140 L330,300 Q330,380 200,430 Q70,380 70,300 L70,140 Z"
        fill="none"
        stroke={c}
        strokeWidth="6"
      />
      <path
        d="M200,130 L285,170 L285,295 Q285,350 200,390 Q115,350 115,295 L115,170 Z"
        fill={c}
        opacity="0.25"
      />
      <circle cx={200} cy={250} r={30 + r() * 20} fill={c} opacity="0.8" />
    </g>
  );
}

function Spark({ r, c, id }: { r: () => number; c: string; id: string }) {
  return (
    <g opacity="0.9">
      {Array.from({ length: 14 }).map((_, i) => {
        const x = r() * 400;
        const y = r() * 500;
        const s = 4 + r() * 12;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <path d={`M0,${-s} L${s * 0.3},${-s * 0.3} L${s},0 L${s * 0.3},${s * 0.3} L0,${s} L${-s * 0.3},${s * 0.3} L${-s},0 L${-s * 0.3},${-s * 0.3} Z`} fill={c} opacity={0.5 + r() * 0.5} />
          </g>
        );
      })}
      <circle cx={200} cy={250} r={80} fill={c} opacity="0.25" filter={`url(#blur-${id})`} />
    </g>
  );
}

export const Artwork = memo(ArtworkBase);
export default Artwork;
