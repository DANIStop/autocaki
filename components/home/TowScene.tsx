// Linijska ilustracija u stilu loga: SUV (silueta tipa X5) vuče autoprikolicu s limuzinom.
// Sve animacije su CSS (globals.css, .tow-*) i gase se uz prefers-reduced-motion.

function Wheel({ cx, cy, r, delay }: { cx: number; cy: number; r: number; delay: number }) {
  const spokes = [0, 60, 120];
  return (
    <g className="tow-draw" style={{ animationDelay: `${delay}s` }}>
      <circle cx={cx} cy={cy} r={r} pathLength={1} className="tow-stroke" />
      <circle cx={cx} cy={cy} r={r * 0.55} pathLength={1} className="tow-stroke tow-thin" />
      <g className="tow-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {spokes.map((a) => (
          <line
            key={a}
            x1={cx}
            y1={cy - r * 0.5}
            x2={cx}
            y2={cy + r * 0.5}
            transform={`rotate(${a} ${cx} ${cy})`}
            className="tow-stroke tow-thin"
          />
        ))}
      </g>
    </g>
  );
}

export default function TowScene() {
  return (
    <svg
      viewBox="120 40 1090 250"
      className="tow-scene w-full h-auto overflow-visible"
      role="img"
      aria-label="Ilustracija: SUV vuče autoprikolicu s automobilom"
    >
      <defs>
        <linearGradient id="beam" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fade" x1="0" x2="1">
          <stop offset="0" stopColor="#0b0b0c" stopOpacity="1" />
          <stop offset="0.12" stopColor="#0b0b0c" stopOpacity="0" />
          <stop offset="0.88" stopColor="#0b0b0c" stopOpacity="0" />
          <stop offset="1" stopColor="#0b0b0c" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Linije brzine u pozadini */}
      <g className="tow-speed" opacity="0.18">
        {[70, 110, 150].map((y, i) => (
          <line key={y} x1={-200 + i * 260} y1={y} x2={60 + i * 260} y2={y} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {[90, 130].map((y, i) => (
          <line key={y} x1={700 + i * 200} y1={y} x2={860 + i * 200} y2={y} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </g>

      {/* Cesta */}
      <line x1="0" y1="252" x2="1400" y2="252" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      <g className="tow-road">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={i * 120} y1="276" x2={i * 120 + 56} y2="276" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>

      {/* Cijela kompozicija se lagano ljulja */}
      <g className="tow-bob">
        {/* Svjetlo farova */}
        <path d="M1184 168 L1330 142 L1330 207 Z" fill="url(#beam)" className="tow-beam" />

        {/* ---------- Prikolica ---------- */}
        <g className="tow-trailer">
          <path d="M150 196 H700 V206 H150 Z" pathLength={1} className="tow-stroke tow-draw" style={{ animationDelay: "0.5s" }} />
          <path d="M700 201 L768 214" pathLength={1} className="tow-stroke tow-draw" style={{ animationDelay: "0.6s" }} />
          {/* Blatobrani */}
          <path d="M366 206 A34 34 0 0 1 434 206 M436 206 A34 34 0 0 1 504 206" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.7s" }} />
          <Wheel cx={400} cy={226} r={24} delay={0.8} />
          <Wheel cx={470} cy={226} r={24} delay={0.85} />

          {/* Limuzina na prikolici */}
          <g>
            <path
              d="M178 190 L174 152 Q176 136 206 130 L262 124 Q284 96 318 88 Q378 76 440 84 Q478 92 520 122 L612 132 Q644 138 650 156 L652 176 Q650 190 640 190 L602 190 A38 38 0 0 0 526 190 L285 190 A38 38 0 0 0 209 190 Z"
              pathLength={1}
              className="tow-stroke tow-draw"
              style={{ animationDelay: "0.9s" }}
            />
            <path d="M298 124 L322 100 Q380 90 436 94 L494 124 Z" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "1.1s" }} />
            <path d="M402 92 L398 124" className="tow-stroke tow-thin tow-draw" pathLength={1} style={{ animationDelay: "1.2s" }} />
            <path d="M222 150 L632 146" pathLength={1} className="tow-red tow-draw" style={{ animationDelay: "1.3s" }} />
            <path d="M318 89 Q378 77 440 85" pathLength={1} className="tow-red tow-draw" style={{ animationDelay: "1.35s" }} />
            <Wheel cx={247} cy={168} r={27} delay={1.0} />
            <Wheel cx={564} cy={168} r={27} delay={1.05} />
          </g>
        </g>

        {/* ---------- SUV ---------- */}
        <g className="tow-suv">
          {/* Karoserija: kratki stražnji prepust, nagnuto stražnje staklo, krov koji pada prema natrag, duga hauba */}
          <path
            d="M782 226 L773 212 L771 172 Q772 150 784 134 L828 98 Q842 90 862 89 L978 88 Q996 89 1010 96 L1066 138 Q1124 144 1162 154 Q1184 160 1187 184 L1188 206 Q1187 226 1172 228 L1142 228 A47 47 0 0 0 1048 228 L897 228 A47 47 0 0 0 803 228 Z"
            pathLength={1}
            className="tow-stroke tow-draw"
            style={{ animationDelay: "0s" }}
          />
          {/* Staklene površine s „Hofmeister“ pregibom na C-stupu */}
          <path d="M800 140 L836 104 Q846 98 862 98 L980 98 Q994 99 1004 105 L1050 140 Z" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.25s" }} />
          <path d="M868 99 L874 128 L884 140 M930 98 L928 140" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.35s" }} />
          {/* Vrata i donja obloga */}
          <path d="M928 142 L924 214 M1048 142 Q1052 176 1046 198" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.45s" }} />
          <path d="M904 210 L1040 208" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.5s" }} />
          {/* Crvena linija + krovni nosači */}
          <path d="M786 168 L1174 162" pathLength={1} className="tow-red tow-draw" style={{ animationDelay: "0.55s" }} />
          <path d="M850 86 L984 85" pathLength={1} className="tow-red tow-draw" style={{ animationDelay: "0.6s" }} />
          {/* Far, maska i stop svjetlo */}
          <path d="M1148 160 Q1170 162 1182 172 L1154 172 Z" className="tow-light" />
          <path d="M1176 180 L1186 180 M1176 188 L1186 188" className="tow-stroke tow-thin" />
          <path d="M772 146 L792 142 L790 164 L771 166 Z" className="tow-tail" />
          {/* Retrovizor */}
          <path d="M1046 132 L1060 126 L1066 136" pathLength={1} className="tow-stroke tow-thin tow-draw" style={{ animationDelay: "0.5s" }} />
          {/* Kuka */}
          <path d="M766 214 L776 214" className="tow-stroke" />
          <Wheel cx={850} cy={218} r={33} delay={0.2} />
          <Wheel cx={1095} cy={218} r={33} delay={0.25} />
        </g>
      </g>

      {/* Mekani rub lijevo/desno */}
      <rect x="120" y="40" width="1090" height="250" fill="url(#fade)" pointerEvents="none" />
    </svg>
  );
}
