import { Rocket } from 'lucide-react'

export default function CTAFinal({ onStart }) {
  return (
    <section className="cta-section">
      <div className="section-inner">
        <div className="cta-content">
          <span className="cta-rocket">
            <Rocket size={72} strokeWidth={1.5} />
          </span>
          <h2 className="cta-title">¿Listo para despegar?</h2>
          <p className="cta-subtitle">
            Únete a la misión. Aprende finanzas de una manera que nunca olvidarás.
            Sin aburrimiento. Sin teoría. Solo decisiones reales.
          </p>
          <button
            className="ceti-btn ceti-btn--primary ceti-btn--large"
            onClick={onStart}
          >
            Probar Cetti gratis
          </button>
          <p className="cta-note">Sin registro obligatorio · Sin tarjeta · 100% gratis</p>

          <div className="cta-stats">
            <div className="cta-stat">
              <span className="cta-stat__value">7+</span>
              <span className="cta-stat__label">Lecciones financieras</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat__value">3</span>
              <span className="cta-stat__label">Mundos de aprendizaje</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat__value">IA</span>
              <span className="cta-stat__label">Quiz personalizado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-footer">
        <p className="cta-footer-text">
          Cetti — Aprende finanzas. Viaja al futuro. · 2025
        </p>
      </div>
    </section>
  )
}
