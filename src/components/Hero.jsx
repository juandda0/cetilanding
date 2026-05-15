import { Rocket, Target, Wallet, Bot } from 'lucide-react'

function seededRandom(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  x: seededRandom(i * 3.14159).toFixed(3),
  y: seededRandom(i * 2.71828).toFixed(3),
  size: (seededRandom(i * 1.41421) * 1.8 + 0.4).toFixed(2),
  opDim: (seededRandom(i * 1.73205) * 0.15 + 0.04).toFixed(3),
  opBright: (seededRandom(i * 2.23606) * 0.6 + 0.35).toFixed(3),
  delay: (seededRandom(i * 2.64575) * 7).toFixed(2),
  duration: (seededRandom(i * 3.31662) * 4 + 2).toFixed(2),
}));

export default function Hero({ onStart }) {
  return (
    <section className="hero">
      {/* Nebula glows */}
      <div className="hero-nebula" aria-hidden="true">
        <div className="hero-nebula__orange" />
        <div className="hero-nebula__purple" />
        <div className="hero-nebula__teal" />
      </div>

      {/* Star field */}
      <div className="hero-stars" aria-hidden="true">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="hero-star"
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--op-dim': s.opDim,
              '--op-bright': s.opBright,
              '--tw-del': `${s.delay}s`,
              '--tw-dur': `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Planet + orbital system */}
      <div className="hero-planet" aria-hidden="true">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="planetGrad" cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#252535" />
              <stop offset="45%" stopColor="#181826" />
              <stop offset="100%" stopColor="#08080F" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8A1F" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#FF8A1F" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FF8A1F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="goldGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F7C95F" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F7C95F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="smallMoonGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#A884FF" />
              <stop offset="100%" stopColor="#6040B8" />
            </radialGradient>
            <clipPath id="planetClip">
              <circle cx="250" cy="250" r="90" />
            </clipPath>
          </defs>

          {/* Outer orbital path */}
          <ellipse
            cx="250" cy="250" rx="224" ry="86"
            stroke="#32323C" strokeWidth="1"
            strokeDasharray="5 7" opacity="0.35"
          />

          {/* Inner orbital path */}
          <ellipse
            cx="250" cy="250" rx="154" ry="59"
            stroke="#383842" strokeWidth="1"
            strokeDasharray="3 6" opacity="0.25"
          />

          {/* Saturn ring — back half (behind planet) */}
          <path
            d="M 118,250 A 132,38 0 0,1 382,250"
            stroke="#FF8A1F" strokeWidth="3" fill="none" opacity="0.28"
          />
          <path
            d="M 118,250 A 132,38 0 0,1 382,250"
            stroke="#FFAE66" strokeWidth="1" fill="none" opacity="0.15"
          />

          {/* Planet glow */}
          <circle cx="250" cy="250" r="130" fill="url(#glowGrad)" />

          {/* Planet body */}
          <circle cx="250" cy="250" r="90" fill="url(#planetGrad)" />

          {/* Planet surface bands */}
          <path
            d="M 162,228 Q 210,222 250,224 Q 290,226 338,228"
            stroke="#2A2A3C" strokeWidth="9" fill="none"
            strokeLinecap="round" opacity="0.7"
          />
          <path
            d="M 168,260 Q 215,268 250,266 Q 285,264 332,260"
            stroke="#1E1E2E" strokeWidth="7" fill="none"
            strokeLinecap="round" opacity="0.55"
          />
          <path
            d="M 174,244 Q 220,240 250,242 Q 280,244 326,244"
            stroke="#222230" strokeWidth="4" fill="none"
            strokeLinecap="round" opacity="0.4"
          />

          {/* Planet shimmer */}
          <circle
            cx="212" cy="218" r="18"
            fill="white" opacity="0.025"
          />

          {/* Saturn ring — front half (in front of planet) */}
          <path
            d="M 382,250 A 132,38 0 0,1 118,250"
            stroke="#FF8A1F" strokeWidth="3.5" fill="none" opacity="0.62"
          />
          <path
            d="M 382,250 A 132,38 0 0,1 118,250"
            stroke="#FFAE66" strokeWidth="1.5" fill="none" opacity="0.3"
          />

          {/* Orbiting moon on outer orbit — CSS animated */}
          <g
            style={{
              transformOrigin: '250px 250px',
              animation: 'moonOrbit 20s linear infinite',
            }}
          >
            {/* Moon glow */}
            <circle cx="474" cy="250" r="18" fill="url(#goldGlowGrad)" opacity="0.4" />
            {/* Moon body */}
            <circle cx="474" cy="250" r="9" fill="#F7C95F" opacity="0.95" />
            <circle cx="471" cy="247" r="3" fill="#E5A438" opacity="0.4" />
          </g>

          {/* Small purple moon on inner orbit */}
          <g
            style={{
              transformOrigin: '250px 250px',
              animation: 'moonOrbitReverse 13s linear infinite',
            }}
          >
            <circle cx="250" cy="191" r="6" fill="url(#smallMoonGrad)" opacity="0.8" />
          </g>

          {/* Floating sparkle dots */}
          <circle cx="92" cy="142" r="3" fill="#F7C95F" opacity="0.65" />
          <circle cx="415" cy="108" r="2.5" fill="#5B9EF5" opacity="0.8" />
          <circle cx="448" cy="372" r="2" fill="#A884FF" opacity="0.6" />
          <circle cx="74" cy="338" r="2.5" fill="#58C88C" opacity="0.5" />
          <circle cx="152" cy="415" r="1.5" fill="#F7C95F" opacity="0.45" />
          <circle cx="362" cy="428" r="2" fill="#FF8A1F" opacity="0.5" />
          <circle cx="58" cy="195" r="1.5" fill="#5FCFC8" opacity="0.55" />
          <circle cx="438" cy="175" r="1.5" fill="#F3A73C" opacity="0.4" />
        </svg>
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-badge">
          <Rocket size={14} />
          <span>App de educación financiera</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title__main">Cetti</span>
          <span className="hero-title__dot">.</span>
        </h1>

        <p className="hero-tagline">
          Aprende finanzas.<br />
          Viaja al futuro.
        </p>

        <p className="hero-subtitle">
          Convierte tu educación financiera en una misión interestelar.
          Aprende a ahorrar, presupuestar y crecer con retos interactivos
          y un quiz personalizado con inteligencia artificial.
        </p>

        <div className="hero-actions">
          <button
            className="ceti-btn ceti-btn--primary ceti-btn--large"
            onClick={onStart}
          >
            Probar Cetti
          </button>
          <a href="#como-funciona" className="ceti-btn ceti-btn--ghost ceti-btn--medium">
            Ver cómo funciona
          </a>
        </div>

        <div className="hero-features">
          <span className="hero-feature-pill"><Target size={13} /> Lecciones interactivas</span>
          <span className="hero-feature-pill"><Wallet size={13} /> Metas de ahorro</span>
          <span className="hero-feature-pill"><Bot size={13} /> Quiz con IA</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <rect x="1" y="1" width="14" height="18" rx="7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <circle cx="8" cy="7" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </section>
  );
}
