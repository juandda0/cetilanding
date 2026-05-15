import { useState } from 'react'
import { Target, Rocket, CheckCircle2, XCircle } from 'lucide-react'
import { multipleChoiceQuestions, choosePathQuestions } from '../data/questionBank'

function getRandomItem(arr, excludeId = null) {
  const pool = excludeId ? arr.filter((q) => q.id !== excludeId) : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

function MultipleChoiceCard() {
  const [question, setQuestion] = useState(() => getRandomItem(multipleChoiceQuestions))
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
  }

  const handleNew = () => {
    setQuestion((q) => getRandomItem(multipleChoiceQuestions, q.id))
    setSelected(null)
  }

  const isAnswered = selected !== null

  return (
    <div className="demo-card">
      <div className="demo-card__header">
        <span className="demo-card__badge">
          <Target size={13} strokeWidth={2.5} />
          Selección múltiple
        </span>
        <button className="ceti-btn ceti-btn--ghost ceti-btn--small" onClick={handleNew}>
          Otra pregunta
        </button>
      </div>

      <p className="demo-card__question">{question.question}</p>

      <div className="demo-mc-options">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === question.correct

          let variant = 'default'
          if (isAnswered) {
            if (isSelected && isCorrect) variant = 'correct'
            else if (isSelected && !isCorrect) variant = 'wrong'
            else if (!isSelected && isCorrect) variant = 'reveal'
          }

          return (
            <button
              key={idx}
              className={`demo-mc-option demo-mc-option--${variant}`}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
            >
              <span className="demo-mc-option__letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div
          className={`demo-explanation demo-explanation--${
            selected === question.correct ? 'correct' : 'wrong'
          }`}
        >
          <span className="demo-explanation__icon">
            {selected === question.correct
              ? <CheckCircle2 size={18} strokeWidth={2} />
              : <XCircle size={18} strokeWidth={2} />}
          </span>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

function ChoosePathCard() {
  const [question, setQuestion] = useState(() => getRandomItem(choosePathQuestions))
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
  }

  const handleNew = () => {
    setQuestion((q) => getRandomItem(choosePathQuestions, q.id))
    setSelected(null)
  }

  const isAnswered = selected !== null

  return (
    <div className="demo-card">
      <div className="demo-card__header">
        <span className="demo-card__badge">
          <Rocket size={13} strokeWidth={2.5} />
          Elige un camino
        </span>
        <button className="ceti-btn ceti-btn--ghost ceti-btn--small" onClick={handleNew}>
          Otra situación
        </button>
      </div>

      <div className="demo-situation">
        <p>{question.situation}</p>
      </div>

      <p className="demo-paths__label">Elige tu camino</p>

      <div className="demo-paths">
        {question.paths.map((path, idx) => {
          const isSelected = selected === idx
          let variant = 'default'
          if (isSelected) variant = path.positive ? 'positive' : 'negative'

          return (
            <div key={idx} className="demo-path-item">
              <button
                className={`demo-path-btn demo-path-btn--${variant}`}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
              >
                {path.label}
              </button>

              {isSelected && (
                <div
                  className={`demo-consequence demo-consequence--${
                    path.positive ? 'positive' : 'negative'
                  }`}
                >
                  <p>{path.consequence}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InteractiveDemo() {
  return (
    <section id="demo" className="section demo-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-overline">Demo interactiva</span>
          <h2 className="section-title">Aprende tomando decisiones reales</h2>
          <p className="section-subtitle">
            Estas son preguntas reales de Cetti. Selecciona y descubre cuánto sabes
            sobre finanzas personales.
          </p>
        </div>

        <div className="demo-grid">
          <MultipleChoiceCard />
          <ChoosePathCard />
        </div>
      </div>
    </section>
  )
}
