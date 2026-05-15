import { Rocket, GraduationCap, PiggyBank } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon: Rocket,
    title: 'Crea tu perfil',
    description:
      'Cuéntanos tu nombre, edad y metas en segundos. Tu misión interestelar se personaliza para ti desde el primer momento.',
  },
  {
    number: '02',
    Icon: GraduationCap,
    title: 'Aprende con retos',
    description:
      'Completa lecciones interactivas, responde preguntas de finanzas y toma decisiones reales que tienen consecuencias.',
  },
  {
    number: '03',
    Icon: PiggyBank,
    title: 'Ahorra y crece',
    description:
      'Crea metas de ahorro, registra tus abonos y gana Cetis — la moneda de tu viaje hacia la libertad financiera.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section how-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-overline">Cómo funciona</span>
          <h2 className="section-title">Tu misión en 3 pasos</h2>
          <p className="section-subtitle">
            Cetti convierte el aprendizaje financiero en una aventura espacial.
            Sin aburrimiento. Sin teoría infinita.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div key={i} className="step-card">
              <span className="step-card__number">{step.number}</span>
              <span className="step-card__icon">
                <step.Icon size={36} strokeWidth={1.5} />
              </span>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
