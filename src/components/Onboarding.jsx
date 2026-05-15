import { useState, useEffect, useRef } from 'react'
import {
  X, Gamepad2, Music, Shirt, Plane, Laptop, Dumbbell,
  Target, Rocket, CheckCircle2, XCircle, Globe,
} from 'lucide-react'
import { getPersonalizedQuiz } from '../services/aiService'

const INTERESTS = [
  { id: 'gaming',  label: 'Gaming',      Icon: Gamepad2 },
  { id: 'music',   label: 'Música',      Icon: Music },
  { id: 'fashion', label: 'Moda',        Icon: Shirt },
  { id: 'travel',  label: 'Viajes',      Icon: Plane },
  { id: 'tech',    label: 'Tecnología',  Icon: Laptop },
  { id: 'sports',  label: 'Deportes',    Icon: Dumbbell },
]

function formatMoneyInput(v) {
  const d = v.replace(/\D/g, '')
  return d ? Number(d).toLocaleString('es-CO') : ''
}

function parseMoneyInput(v) {
  return parseInt(v.replace(/\D/g, ''), 10) || 0
}

function formatCOP(n) {
  return n ? '$' + Math.round(n).toLocaleString('es-CO') : '$0'
}

// Steps: 0=name · 1=age · 2=interests · 3=goal · 4=loading · 5=mcQuiz · 6=pathQuiz · 7=summary
export default function Onboarding({ onClose }) {
  const [step, setStep]         = useState(0)
  const [profile, setProfile]   = useState({ name: '', age: '', interests: [], goalName: '', goalAmount: '' })
  const [quiz, setQuiz]         = useState(null)
  const [mcSelected, setMcSel]  = useState(null)
  const [pathSelected, setPath] = useState(null)
  const [error, setError]       = useState('')

  const nameRef = useRef(null)
  const ageRef  = useRef(null)
  const goalRef = useRef(null)

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // auto-focus
  useEffect(() => {
    if (step === 0) setTimeout(() => nameRef.current?.focus(), 120)
    if (step === 1) setTimeout(() => ageRef.current?.focus(), 120)
    if (step === 3) setTimeout(() => goalRef.current?.focus(), 120)
  }, [step])

  /* ---- Validation ---- */
  const canAdvance = () => {
    if (step === 0) return profile.name.trim().length >= 2
    if (step === 1) { const a = parseInt(profile.age); return !isNaN(a) && a >= 13 && a <= 100 }
    if (step === 2) return profile.interests.length >= 1
    if (step === 3) return profile.goalName.trim().length >= 2 && parseMoneyInput(profile.goalAmount) >= 1000
    return false
  }

  const errorFor = () => {
    if (step === 0) return 'Escribe al menos 2 caracteres'
    if (step === 1) return 'Ingresa una edad entre 13 y 100'
    if (step === 2) return 'Selecciona al menos un gusto'
    if (step === 3) return !profile.goalName.trim() ? 'Escribe el nombre de tu meta' : 'Ingresa un monto mayor a $1.000'
    return ''
  }

  /* ---- Navigation ---- */
  const next = () => { setError(''); setStep(s => s + 1) }

  const handleContinue = () => {
    if (!canAdvance()) { setError(errorFor()); return }
    if (step === 3) startMission()
    else next()
  }

  const startMission = async () => {
    next() // → step 4 loading
    const result = await getPersonalizedQuiz({
      name:        profile.name,
      age:         profile.age,
      interests:   profile.interests,
      goalName:    profile.goalName,
      goalAmount:  formatCOP(parseMoneyInput(profile.goalAmount)),
    })
    setQuiz(result)
    setStep(5)
  }

  const toggleInterest = (id) => {
    setError('')
    setProfile(p => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter(i => i !== id)
        : [...p.interests, id],
    }))
  }

  const handleMCSelect = (idx) => { if (mcSelected === null) setMcSel(idx) }
  const handlePathSelect = (idx) => { if (pathSelected === null) setPath(idx) }

  const mc   = quiz?.multipleChoice
  const path = quiz?.choosePath

  /* ---- Render ---- */
  return (
    <div className="ob-overlay" role="dialog" aria-modal="true" aria-label="Onboarding Cetti">

      {/* Close */}
      <button className="ob-close" onClick={onClose} aria-label="Cerrar">
        <X size={16} strokeWidth={2.5} />
      </button>

      {/* Progress dots — visible only on steps 0-3 */}
      {step < 4 && (
        <div className="ob-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemax={4}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`ob-dot${i <= step ? ' ob-dot--active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Scrollable content */}
      <div className="ob-scroll">
        <div className="ob-content">

          {/* ── Step 0: Name ── */}
          {step === 0 && (
            <div className="ob-step">
              <div className="ob-step-header">
                <span className="ob-overline">Empecemos</span>
                <h2 className="ob-title">¿Cómo te llamas?</h2>
                <p className="ob-subtitle">Escribe tu nombre para personalizar tu misión espacial</p>
              </div>
              <input
                ref={nameRef}
                className="demo-input ob-centered-input"
                placeholder="Tu nombre..."
                value={profile.name}
                onChange={e => { setProfile(p => ({ ...p, name: e.target.value })); setError('') }}
                maxLength={30}
                onKeyDown={e => e.key === 'Enter' && handleContinue()}
              />
              {error && <p className="ob-error">{error}</p>}
            </div>
          )}

          {/* ── Step 1: Age ── */}
          {step === 1 && (
            <div className="ob-step">
              <div className="ob-step-header">
                <span className="ob-overline">Datos</span>
                <h2 className="ob-title">¿Cuántos años tienes?</h2>
                <p className="ob-subtitle">Debes tener al menos 13 años para usar Cetti</p>
              </div>
              <input
                ref={ageRef}
                className="demo-input ob-centered-input"
                placeholder="Ej. 22"
                value={profile.age}
                onChange={e => { setProfile(p => ({ ...p, age: e.target.value.replace(/\D/g, '') })); setError('') }}
                inputMode="numeric"
                maxLength={3}
                onKeyDown={e => e.key === 'Enter' && handleContinue()}
              />
              {error && <p className="ob-error">{error}</p>}
            </div>
          )}

          {/* ── Step 2: Interests ── */}
          {step === 2 && (
            <div className="ob-step">
              <div className="ob-step-header">
                <span className="ob-overline">Tu perfil</span>
                <h2 className="ob-title">¿Qué te apasiona?</h2>
                <p className="ob-subtitle">Selecciona uno o más. Tu quiz se basará en tus gustos</p>
              </div>
              <div className="ob-interests-grid">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    className={`ob-interest-card${profile.interests.includes(interest.id) ? ' ob-interest-card--active' : ''}`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    <span className="ob-interest-icon">
                      <interest.Icon size={32} strokeWidth={1.5} />
                    </span>
                    <span className="ob-interest-label">{interest.label}</span>
                  </button>
                ))}
              </div>
              {error && <p className="ob-error">{error}</p>}
            </div>
          )}

          {/* ── Step 3: Goal ── */}
          {step === 3 && (
            <div className="ob-step">
              <div className="ob-step-header">
                <span className="ob-overline">Tu misión</span>
                <h2 className="ob-title">¿Para qué quieres ahorrar?</h2>
                <p className="ob-subtitle">Tu quiz se personalizará en base a esta meta</p>
              </div>
              <div className="ob-goal-inputs">
                <input
                  ref={goalRef}
                  className="demo-input"
                  placeholder="¿Qué quieres lograr? (ej: Viaje a Europa)"
                  value={profile.goalName}
                  onChange={e => { setProfile(p => ({ ...p, goalName: e.target.value })); setError('') }}
                  maxLength={50}
                />
                <input
                  className="demo-input"
                  placeholder="¿Cuánto necesitas? (ej: 3.000.000)"
                  value={profile.goalAmount}
                  onChange={e => { setProfile(p => ({ ...p, goalAmount: formatMoneyInput(e.target.value) })); setError('') }}
                  inputMode="numeric"
                />
              </div>
              {error && <p className="ob-error">{error}</p>}
            </div>
          )}

          {/* ── Step 4: Loading ── */}
          {step === 4 && (
            <div className="ob-loading">
              <div className="ob-spinner-wrap">
                <div className="ob-spinner" />
                <span className="ob-spinner-icon">
                  <Globe size={28} strokeWidth={1.5} />
                </span>
              </div>
              <p className="ob-loading-title">Personalizando tu misión...</p>
              <p className="ob-loading-sub">
                La IA está adaptando tu quiz basándose en tu perfil y tu meta de ahorro
              </p>
            </div>
          )}

          {/* ── Step 5: MC Quiz ── */}
          {step === 5 && mc && (
            <div className="ob-quiz-section">
              {quiz?.greeting && (
                <div className="ob-greeting">
                  <p>{quiz.greeting}</p>
                </div>
              )}

              <span className="ob-quiz-badge">
                <Target size={13} strokeWidth={2.5} />
                Selección múltiple
              </span>
              <p className="ob-quiz-question">{mc.question}</p>

              <div className="demo-mc-options">
                {mc.options.map((opt, idx) => {
                  const isSel = mcSelected === idx
                  const isCorrect = idx === mc.correct
                  let variant = 'default'
                  if (mcSelected !== null) {
                    if (isSel && isCorrect)  variant = 'correct'
                    else if (isSel)          variant = 'wrong'
                    else if (isCorrect)      variant = 'reveal'
                  }
                  return (
                    <button
                      key={idx}
                      className={`demo-mc-option demo-mc-option--${variant}`}
                      onClick={() => handleMCSelect(idx)}
                      disabled={mcSelected !== null}
                    >
                      <span className="demo-mc-option__letter">{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {mcSelected !== null && (
                <>
                  <div className={`demo-explanation demo-explanation--${mcSelected === mc.correct ? 'correct' : 'wrong'}`}>
                    <span className="demo-explanation__icon">
                      {mcSelected === mc.correct
                        ? <CheckCircle2 size={18} strokeWidth={2} />
                        : <XCircle size={18} strokeWidth={2} />}
                    </span>
                    <p>{mc.explanation}</p>
                  </div>
                  <button
                    className="ceti-btn ceti-btn--primary ceti-btn--large ob-continue-btn"
                    onClick={() => { setPath(null); setStep(6) }}
                  >
                    Siguiente →
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Step 6: Path Quiz ── */}
          {step === 6 && path && (
            <div className="ob-quiz-section">
              <span className="ob-quiz-badge">
                <Rocket size={13} strokeWidth={2.5} />
                Elige un camino
              </span>

              <div className="demo-situation">
                <p>{path.situation}</p>
              </div>

              <p className="demo-paths__label" style={{ marginTop: '20px' }}>Elige tu camino</p>

              <div className="demo-paths">
                {path.paths.map((p, idx) => {
                  const isSel = pathSelected === idx
                  let variant = 'default'
                  if (isSel) variant = p.positive ? 'positive' : 'negative'
                  return (
                    <div key={idx} className="demo-path-item">
                      <button
                        className={`demo-path-btn demo-path-btn--${variant}`}
                        onClick={() => handlePathSelect(idx)}
                        disabled={pathSelected !== null}
                      >
                        {p.label}
                      </button>
                      {isSel && (
                        <div className={`demo-consequence demo-consequence--${p.positive ? 'positive' : 'negative'}`}>
                          <p>{p.consequence}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {pathSelected !== null && (
                <button
                  className="ceti-btn ceti-btn--primary ceti-btn--large ob-continue-btn"
                  onClick={() => setStep(7)}
                >
                  Ver mi resumen →
                </button>
              )}
            </div>
          )}

          {/* ── Step 7: Summary ── */}
          {step === 7 && (
            <div className="ob-summary">
              <span className="ob-summary__rocket">
                <Rocket size={80} strokeWidth={1.25} />
              </span>
              <h2 className="ob-summary__title">¡Misión completada!</h2>
              <p className="ob-summary__desc">
                Ya tienes las bases para empezar tu viaje financiero, {profile.name}.
              </p>

              <div className="ob-summary__card">
                <div className="ob-summary__row">
                  <span className="ob-summary__label">Astronauta</span>
                  <span className="ob-summary__value">{profile.name}, {profile.age} años</span>
                </div>
                <div className="ob-summary__divider" />
                <div className="ob-summary__row">
                  <span className="ob-summary__label">Misión</span>
                  <span className="ob-summary__value">{profile.goalName}</span>
                </div>
                <div className="ob-summary__row">
                  <span className="ob-summary__label">Objetivo</span>
                  <span className="ob-summary__value ob-summary__value--gold">
                    ${profile.goalAmount || '0'}
                  </span>
                </div>
                {profile.interests.length > 0 && (
                  <>
                    <div className="ob-summary__divider" />
                    <div className="ob-summary__row ob-summary__row--wrap">
                      <span className="ob-summary__label">Perfil</span>
                      <span className="ob-summary__value">{profile.interests.join(', ')}</span>
                    </div>
                  </>
                )}
              </div>

              <p className="ob-summary__cta">
                Descarga Cetti para continuar tu misión, acceder a todas las lecciones
                y alcanzar tu meta de <strong>{profile.goalName}</strong>.
              </p>

              <button
                className="ceti-btn ceti-btn--primary ceti-btn--large"
                style={{ width: '100%' }}
                onClick={onClose}
              >
                Volver al inicio
              </button>
              <button
                className="ceti-btn ceti-btn--ghost ceti-btn--medium"
                style={{ width: '100%' }}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer button — only steps 0-3 */}
      {step < 4 && (
        <div className="ob-footer">
          <button
            className="ceti-btn ceti-btn--primary ceti-btn--large"
            style={{ width: '100%', opacity: canAdvance() ? 1 : 0.45 }}
            onClick={handleContinue}
          >
            {step === 3 ? 'Comenzar mi misión' : 'Continuar'}
          </button>
        </div>
      )}
    </div>
  )
}
