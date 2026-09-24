const INK = "#221f1c";
const WOOD = "#5a3d24";
const HEAD = "#f5f5f1";

function Headstock() {
  return (
    <>
      <rect x="94" y="34" width="12" height="116" fill={WOOD} />
      <rect x="89" y="10" width="22" height="30" rx="4" fill={INK} />
      <circle cx="85" cy="17" r="3.5" fill={INK} />
      <circle cx="85" cy="27" r="3.5" fill={INK} />
      <circle cx="115" cy="17" r="3.5" fill={INK} />
      <circle cx="115" cy="27" r="3.5" fill={INK} />
    </>
  );
}

function Electric({ color }) {
  return (
    <g transform="rotate(28 100 120)">
      <Headstock />
      <path
        d="M70 128 C55 128 50 148 58 163 C48 178 55 214 85 214 L115 214 C145 214 152 178 142 163 C150 148 145 128 130 128 C122 128 118 136 100 136 C82 136 78 128 70 128Z"
        fill={color}
      />
      <rect x="84" y="154" width="32" height="8" rx="2" fill={INK} />
      <rect x="84" y="172" width="32" height="8" rx="2" fill={INK} />
      <rect x="88" y="190" width="24" height="6" rx="2" fill={INK} />
      <circle cx="128" cy="192" r="5" fill={INK} />
      <circle cx="132" cy="178" r="5" fill={INK} />
    </g>
  );
}

function Acoustic({ color }) {
  return (
    <g transform="rotate(28 100 120)">
      <Headstock />
      <path
        d="M100 116 C78 116 70 130 74 144 C77 154 70 158 64 170 C54 192 70 220 100 220 C130 220 146 192 136 170 C130 158 123 154 126 144 C130 130 122 116 100 116Z"
        fill={color}
      />
      <circle cx="100" cy="158" r="14" fill={INK} />
      <circle cx="100" cy="158" r="18" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="84" y="190" width="32" height="7" rx="3" fill={INK} />
    </g>
  );
}

function DrumKit({ color }) {
  return (
    <g>
      <line x1="40" y1="70" x2="40" y2="210" stroke={INK} strokeWidth="3" />
      <line x1="160" y1="60" x2="160" y2="210" stroke={INK} strokeWidth="3" />
      <ellipse cx="40" cy="70" rx="30" ry="6" fill="#c9a24a" />
      <ellipse cx="160" cy="60" rx="32" ry="6" fill="#c9a24a" />
      <rect x="58" y="92" width="36" height="28" fill={color} />
      <ellipse cx="76" cy="92" rx="18" ry="6" fill={HEAD} stroke={INK} strokeWidth="2" />
      <rect x="106" y="92" width="36" height="28" fill={color} />
      <ellipse cx="124" cy="92" rx="18" ry="6" fill={HEAD} stroke={INK} strokeWidth="2" />
      <circle cx="100" cy="166" r="46" fill={color} />
      <circle cx="100" cy="166" r="38" fill={HEAD} stroke={INK} strokeWidth="2" />
      <circle cx="100" cy="166" r="12" fill={color} opacity="0.35" />
      <rect x="24" y="150" width="34" height="20" fill={color} />
      <ellipse cx="41" cy="150" rx="17" ry="5" fill={HEAD} stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Snare({ color }) {
  const lugs = [52, 76, 100, 124, 148];
  return (
    <g>
      <line x1="60" y1="40" x2="130" y2="100" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
      <line x1="140" y1="40" x2="70" y2="100" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
      <rect x="36" y="112" width="128" height="62" fill={color} />
      <ellipse cx="100" cy="174" rx="64" ry="14" fill={color} />
      {lugs.map((x) => (
        <rect key={x} x={x - 3} y="122" width="6" height="42" rx="2" fill={INK} />
      ))}
      <ellipse cx="100" cy="112" rx="64" ry="14" fill={HEAD} stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Pad({ color }) {
  return (
    <g>
      <line x1="100" y1="150" x2="100" y2="210" stroke={INK} strokeWidth="4" />
      <line x1="100" y1="210" x2="70" y2="222" stroke={INK} strokeWidth="4" />
      <line x1="100" y1="210" x2="130" y2="222" stroke={INK} strokeWidth="4" />
      <ellipse cx="100" cy="130" rx="62" ry="26" fill="#3a3633" />
      <ellipse cx="100" cy="124" rx="52" ry="20" fill={color} />
      <line x1="50" y1="60" x2="112" y2="118" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="60" x2="92" y2="118" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Keys({ x, y, width, height, count }) {
  const keyW = width / count;
  const blackPattern = [1, 1, 0, 1, 1, 1, 0];
  const whites = [];
  const blacks = [];
  for (let i = 0; i < count; i++) {
    whites.push(
      <rect key={`w${i}`} x={x + i * keyW} y={y} width={keyW} height={height} fill={HEAD} stroke={INK} strokeWidth="1" />
    );
    if (i < count - 1 && blackPattern[i % 7]) {
      blacks.push(
        <rect key={`b${i}`} x={x + (i + 1) * keyW - keyW * 0.3} y={y} width={keyW * 0.6} height={height * 0.6} fill={INK} />
      );
    }
  }
  return (
    <>
      {whites}
      {blacks}
    </>
  );
}

function Piano({ color }) {
  return (
    <g>
      <rect x="14" y="86" width="172" height="70" rx="6" fill={color} />
      <circle cx="30" cy="99" r="4" fill={INK} />
      <circle cx="44" cy="99" r="4" fill={INK} />
      <rect x="140" y="95" width="34" height="8" rx="2" fill={INK} />
      <Keys x={22} y={110} width={156} height={38} count={14} />
      <line x1="44" y1="156" x2="36" y2="206" stroke={INK} strokeWidth="4" />
      <line x1="156" y1="156" x2="164" y2="206" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Synth({ color }) {
  const knobs = [42, 60, 78, 96];
  return (
    <g>
      <rect x="30" y="80" width="140" height="84" rx="6" fill={color} />
      {knobs.map((x) => (
        <circle key={x} cx={x} cy="98" r="6" fill={INK} />
      ))}
      <rect x="116" y="90" width="44" height="16" rx="2" fill="#15130f" />
      <rect x="120" y="94" width="20" height="8" fill="#7fd1a0" opacity="0.8" />
      <Keys x={38} y={116} width={124} height={40} count={10} />
    </g>
  );
}

function Amp({ color }) {
  const grille = [];
  for (let i = 0; i < 9; i++) {
    grille.push(<line key={`v${i}`} x1={54 + i * 11.5} y1="96" x2={54 + i * 11.5} y2="186" stroke="#2c2722" strokeWidth="1" />);
    grille.push(<line key={`h${i}`} x1="50" y1={100 + i * 10} x2="150" y2={100 + i * 10} stroke="#2c2722" strokeWidth="1" />);
  }
  return (
    <g>
      <rect x="78" y="34" width="44" height="14" rx="6" fill="none" stroke={INK} strokeWidth="5" />
      <rect x="36" y="46" width="128" height="154" rx="8" fill={INK} />
      <rect x="44" y="54" width="112" height="28" rx="3" fill={color} />
      {[60, 78, 96, 114, 132].map((x) => (
        <circle key={x} cx={x} cy="68" r="5" fill={INK} />
      ))}
      <rect x="48" y="92" width="104" height="98" rx="3" fill="#6b5f4f" />
      {grille}
      <rect x="84" y="170" width="32" height="8" rx="2" fill={HEAD} />
    </g>
  );
}

function Pedal({ color }) {
  return (
    <g>
      <rect x="40" y="96" width="14" height="10" fill="#9a9a9a" />
      <rect x="146" y="96" width="14" height="10" fill="#9a9a9a" />
      <rect x="54" y="44" width="92" height="150" rx="12" fill={color} />
      <circle cx="76" cy="72" r="11" fill={INK} />
      <circle cx="124" cy="72" r="11" fill={INK} />
      <circle cx="100" cy="98" r="9" fill={INK} />
      <circle cx="100" cy="124" r="4" fill="#ff3b30" />
      <rect x="70" y="138" width="60" height="4" rx="2" fill={INK} opacity="0.25" />
      <circle cx="100" cy="168" r="14" fill="#b5b5b5" stroke="#6c6c6c" strokeWidth="3" />
    </g>
  );
}

const ART = {
  electric: Electric,
  acoustic: Acoustic,
  drumkit: DrumKit,
  snare: Snare,
  pad: Pad,
  piano: Piano,
  synth: Synth,
  amp: Amp,
  pedal: Pedal,
};

const categoryColor = {
  Guitars: "#e0701e",
  Drums: "#2f5fb8",
  Keyboards: "#2e7a53",
  "Pedals & Amps": "#e5b52a",
};

export default function ProductArt({ product }) {
  if (product.photo) {
    return <img className="product-photo" src={product.photo} alt={product.name} />;
  }
  const Drawing = ART[product.type] || Pedal;
  return (
    <svg className="product-svg" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
      <Drawing color={categoryColor[product.category]} />
    </svg>
  );
}
