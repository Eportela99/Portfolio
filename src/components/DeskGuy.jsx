import './DeskGuy.css'

export default function DeskGuy() {
  return (
    <div className="dg-wrap">
      <svg className="dg-svg" viewBox="0 0 300 215" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dgScreenGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="#0d2540" />
            <stop offset="100%" stopColor="#060a12" />
          </radialGradient>
          <radialGradient id="dgDeskGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(79,195,247,0.18)" />
            <stop offset="100%" stopColor="rgba(79,195,247,0)" />
          </radialGradient>
        </defs>

        {/* Monitor ambient glow on desk surface */}
        <ellipse cx="218" cy="157" rx="68" ry="9" fill="url(#dgDeskGlow)" className="dg-ambient" />

        {/* ── Desk ── */}
        <rect x="8"   y="153" width="284" height="12" rx="3" fill="#141828" />
        <rect x="8"   y="153" width="284" height="3"  rx="3" fill="#1c2440" />
        <rect x="18"  y="165" width="7"   height="28" rx="2" fill="#0f1320" />
        <rect x="275" y="165" width="7"   height="28" rx="2" fill="#0f1320" />

        {/* ── Monitor ── */}
        <rect x="202" y="153" width="44" height="7"  rx="3" fill="#0c0f1a" />
        <rect x="218" y="122" width="10" height="34" rx="3" fill="#0c0f1a" />
        <rect x="170" y="46"  width="98" height="80" rx="7" fill="#0c0f1a" stroke="#1a2035" strokeWidth="1" />
        <rect x="178" y="54"  width="82" height="66" rx="4" fill="url(#dgScreenGrad)" className="dg-screen" />
        <rect x="178" y="54"  width="82" height="66" rx="4" fill="none"
              stroke="rgba(79,195,247,0.18)" strokeWidth="1" />

        {/* Code lines */}
        <g className="dg-code">
          <rect x="183" y="62"  width="30" height="2.5" rx="1" fill="#4fc3f7" opacity="0.85" />
          <rect x="186" y="69"  width="22" height="2.5" rx="1" fill="#69f0ae" opacity="0.75" />
          <rect x="186" y="76"  width="38" height="2.5" rx="1" fill="#fff59d" opacity="0.65" />
          <rect x="186" y="83"  width="16" height="2.5" rx="1" fill="#ce93d8" opacity="0.75" />
          <rect x="183" y="90"  width="28" height="2.5" rx="1" fill="#4fc3f7" opacity="0.55" />
          <rect x="186" y="97"  width="34" height="2.5" rx="1" fill="#69f0ae" opacity="0.65" />
          <rect x="186" y="104" width="20" height="2.5" rx="1" fill="#fff59d" opacity="0.55" />
          <rect x="206" y="104" width="3.5" height="2.5" rx="0.5" fill="#4fc3f7" className="dg-cursor" />
        </g>

        {/* ── Keyboard ── */}
        <rect x="116" y="148" width="80" height="12" rx="3" fill="#0c0f1a" />
        <rect x="118" y="150" width="76" height="8"  rx="2" fill="#111525" />
        <rect x="120" y="151" width="72" height="2"  rx="1" fill="#1a2035" opacity="0.9" />
        <rect x="120" y="155" width="72" height="2"  rx="1" fill="#1a2035" opacity="0.6" />

        {/* ── Coffee mug ── */}
        <rect x="76" y="140" width="16" height="16" rx="3" fill="#1e2640" stroke="#2a3558" strokeWidth="1" />
        <path d="M 92 144 Q 98 148 92 152" stroke="#2a3558" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="78" y="140" width="12" height="4" rx="1.5" fill="#4fc3f7" opacity="0.15" />

        {/* ── Chair ── */}
        <rect x="33" y="148" width="74" height="12" rx="4" fill="#0f1220" />
        <rect x="34" y="88"  width="13" height="66" rx="4" fill="#0f1220" />
        <rect x="34" y="135" width="30" height="7"  rx="3" fill="#0b0e18" />

        {/* ── Body (hoodie) ── */}
        <rect x="48" y="138" width="75" height="18" rx="5" fill="#1b3560" />
        <rect x="51" y="88"  width="68" height="55" rx="5" fill="#1b3560" />
        <rect x="45" y="87"  width="80" height="20" rx="6" fill="#1e3d6e" />
        <rect x="73" y="108" width="22" height="30" rx="4" fill="#173059" />

        {/* Left arm */}
        <path d="M 54 104 C 48 130 80 148 126 153"
              stroke="#1b3560" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M 54 104 C 48 130 80 148 126 153"
              stroke="#173059" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Right arm */}
        <path d="M 118 104 C 130 130 152 148 173 152"
              stroke="#1b3560" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M 118 104 C 130 130 152 148 173 152"
              stroke="#173059" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <ellipse cx="126" cy="153" rx="10" ry="5.5" fill="#f0a880" className="dg-hand-l" />
        <ellipse cx="173" cy="153" rx="9"  ry="5"   fill="#f0a880" className="dg-hand-r" />

        {/* Neck */}
        <rect x="83" y="70" width="16" height="22" rx="5" fill="#f0a880" />

        {/* ── Head group (animated) ── */}
        <g className="dg-head-container">

          {/* Side profile — left side visible, facing right toward monitor */}
          <g className="dg-head-side">
            <ellipse cx="97" cy="61" rx="23" ry="22" fill="#f0a880" />
            {/* Hair */}
            <ellipse cx="95" cy="41" rx="21" ry="12" fill="#2a1508" />
            <rect x="73" y="39" width="19" height="30" rx="5" fill="#2a1508" />
            <ellipse cx="112" cy="47" rx="7" ry="9" fill="#2a1508" />
            {/* Left ear (near side) */}
            <ellipse cx="75" cy="63" rx="5"   ry="6.5" fill="#e8956d" />
            <ellipse cx="75" cy="63" rx="2.5" ry="4"   fill="#f0a880" />
            {/* Side eye (profile, right side of face facing away) */}
            <ellipse cx="108" cy="59" rx="5" ry="4" fill="#1a1008" />
            <circle  cx="109" cy="58" r="1.2" fill="rgba(255,255,255,0.5)" />
            {/* Nose profile bump */}
            <ellipse cx="119" cy="67" rx="3.5" ry="2.5" fill="#e8956d" />
            {/* Chin */}
            <ellipse cx="116" cy="77" rx="5" ry="3" fill="#e8956d" />
          </g>

          {/* Front face — shown during look-back */}
          <g className="dg-head-front">
            <ellipse cx="97" cy="61" rx="23" ry="22" fill="#f0a880" />
            {/* Hair */}
            <ellipse cx="97" cy="40" rx="22" ry="13" fill="#2a1508" />
            <rect x="74" y="38" width="46" height="17" rx="7" fill="#2a1508" />
            {/* Both ears */}
            <ellipse cx="74"  cy="63" rx="5" ry="6.5" fill="#e8956d" />
            <ellipse cx="120" cy="63" rx="5" ry="6.5" fill="#e8956d" />
            {/* Eyes */}
            <ellipse cx="86"  cy="60" rx="6.5" ry="5.5" fill="#fff" />
            <ellipse cx="108" cy="60" rx="6.5" ry="5.5" fill="#fff" />
            <circle  cx="87"  cy="61" r="3.2" fill="#2a1508" />
            <circle  cx="109" cy="61" r="3.2" fill="#2a1508" />
            <circle  cx="88.5" cy="59.5" r="1.3" fill="#fff" />
            <circle  cx="110.5" cy="59.5" r="1.3" fill="#fff" />
            {/* Eyebrows (slightly raised — amused/surprised) */}
            <path d="M 80 51 Q 86 49 92 51"  stroke="#2a1508" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 102 51 Q 108 49 114 51" stroke="#2a1508" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Nose */}
            <ellipse cx="97" cy="69" rx="3.5" ry="2.5" fill="#e8956d" />
            {/* Slight smile */}
            <path d="M 89 76 Q 97 82 105 76" stroke="#c4724a" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

        </g>

      </svg>

      {/* Screen outer ambient glow overlay */}
      <div className="dg-screen-glow" />
    </div>
  )
}
