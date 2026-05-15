import { useState, useEffect, useRef } from 'react'
import { Wallet, Sparkles, Flag, Trophy, Star, CheckCircle2 } from 'lucide-react'

const GOALS_KEY = 'cetti_demo_goals'
const DEPOSITS_KEY = 'cetti_demo_deposits'

function formatCOP(amount) {
  if (!amount && amount !== 0) return '$0'
  return '$' + Math.round(amount).toLocaleString('es-CO')
}

function formatMoneyInput(value) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('es-CO')
}

function parseMoneyInput(value) {
  return parseInt(value.replace(/\D/g, ''), 10) || 0
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveState(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

/* ---- Goal card — exact mirror of VisualGoalCard from app ---- */
function GoalCard({ goal, onDeposit }) {
  const progress =
    goal.targetAmount > 0
      ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
      : 0
  const isComplete = progress >= 100

  return (
    <div className="goal-card">
      <div className="goal-card__header">
        <div className="goal-card__info">
          <p className="goal-card__name">{goal.title}</p>
          <span className="goal-card__status">
            {isComplete ? '¡Meta alcanzada!' : 'Tu meta'}
          </span>
        </div>
        {isComplete ? (
          <span className="goal-card__trophy">
            <Trophy size={22} strokeWidth={1.5} />
          </span>
        ) : (
          <button className="goal-card__save-btn" onClick={() => onDeposit(goal)}>
            <span>+</span> Ahorrar
          </button>
        )}
      </div>

      <div className="goal-card__progress-area">
        <div className="goal-progress-bar">
          <div
            className="goal-progress-fill"
            style={{ width: `${progress}%` }}
          />
          {progress > 0 && progress < 100 && (
            <div
              className="goal-progress-dot"
              style={{ left: `${progress}%` }}
            />
          )}
        </div>
        <div className="goal-card__amounts">
          <span className="goal-card__current">{formatCOP(goal.currentAmount)}</span>
          <span className="goal-card__target">de {formatCOP(goal.targetAmount)}</span>
        </div>
      </div>
    </div>
  )
}

/* ---- Modal base — mirror of CetiBottomSheet ---- */
function Modal({ visible, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---- Nueva meta modal ---- */
function NewGoalModal({ visible, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [error, setError] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setTitle('')
      setTarget('')
      setError('')
      setTimeout(() => titleRef.current?.focus(), 120)
    }
  }, [visible])

  const handleCreate = () => {
    const amount = parseMoneyInput(target)
    if (!title.trim()) {
      setError('Escribe el nombre de tu meta')
      return
    }
    if (!amount || amount < 1000) {
      setError('Ingresa un monto mayor a $1.000')
      return
    }
    onCreate({ title: title.trim(), targetAmount: amount })
    onClose()
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Nueva meta"
      subtitle="¿Qué quieres conseguir?"
    >
      <div className="modal-body">
        {error && <p className="modal-error">{error}</p>}
        <input
          ref={titleRef}
          className="demo-input"
          placeholder="¿Qué quieres comprar o hacer?"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          maxLength={50}
        />
        <input
          className="demo-input"
          placeholder="¿Cuánto cuesta? (ej: 120.000)"
          value={target}
          onChange={(e) => { setTarget(formatMoneyInput(e.target.value)); setError('') }}
          inputMode="numeric"
        />
        <div className="modal-actions">
          <button
            className="ceti-btn ceti-btn--glass ceti-btn--medium"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="ceti-btn ceti-btn--primary ceti-btn--medium"
            style={{ flex: 1 }}
            onClick={handleCreate}
          >
            Crear meta
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ---- Depósito modal ---- */
function DepositModal({ visible, onClose, goals, preSelected, onDeposit }) {
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [error, setError] = useState('')
  const amountRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setAmount('')
      setDesc('')
      setSelectedGoalId(preSelected?.id ?? goals[0]?.id ?? '')
      setError('')
      setTimeout(() => amountRef.current?.focus(), 120)
    }
  }, [visible, preSelected, goals])

  const handleSave = () => {
    const num = parseMoneyInput(amount)
    if (!goals.length) {
      setError('Primero crea una meta')
      return
    }
    if (!num || num < 100) {
      setError('Ingresa un monto mayor a $100')
      return
    }
    if (!desc.trim()) {
      setError('Describe de dónde salió el ahorro')
      return
    }
    onDeposit({
      goalId: selectedGoalId || goals[0]?.id,
      amount: num,
      description: desc.trim(),
    })
    onClose()
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Registrar ahorro"
      subtitle="Se aplica directamente a tu meta"
    >
      <div className="modal-body">
        {error && <p className="modal-error">{error}</p>}
        <input
          ref={amountRef}
          className="demo-input"
          placeholder="¿Cuánto? (ej: 50.000)"
          value={amount}
          onChange={(e) => { setAmount(formatMoneyInput(e.target.value)); setError('') }}
          inputMode="numeric"
        />
        <input
          className="demo-input"
          placeholder="¿De dónde salió? (ej: Trabajo)"
          value={desc}
          onChange={(e) => { setDesc(e.target.value); setError('') }}
          maxLength={60}
        />
        {goals.length > 1 && (
          <div className="modal-goal-selector">
            <p className="modal-chips-label">¿Para qué meta es?</p>
            <div className="modal-chips-row">
              {goals.map((g) => (
                <button
                  key={g.id}
                  className={`goal-chip${selectedGoalId === g.id ? ' goal-chip--active' : ''}`}
                  onClick={() => setSelectedGoalId(g.id)}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="modal-actions">
          <button
            className="ceti-btn ceti-btn--glass ceti-btn--medium"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="ceti-btn ceti-btn--primary ceti-btn--medium"
            style={{ flex: 1 }}
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ---- Main SavingsDemo section ---- */
export default function SavingsDemo() {
  const [goals, setGoals] = useState(() => loadState(GOALS_KEY, []))
  const [deposits, setDeposits] = useState(() => loadState(DEPOSITS_KEY, []))
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [preSelected, setPreSelected] = useState(null)

  useEffect(() => { saveState(GOALS_KEY, goals) }, [goals])
  useEffect(() => { saveState(DEPOSITS_KEY, deposits) }, [deposits])

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)

  const handleCreateGoal = ({ title, targetAmount }) => {
    setGoals((prev) => [
      ...prev,
      { id: Date.now().toString(), title, targetAmount, currentAmount: 0 },
    ])
  }

  const handleDeposit = ({ goalId, amount, description }) => {
    const id = Date.now().toString()
    setDeposits((prev) => [
      { id, goalId, amount, description, date: new Date().toISOString() },
      ...prev,
    ])
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    )
  }

  const openDeposit = (goal = null) => {
    setPreSelected(goal)
    setShowDeposit(true)
  }

  return (
    <section id="metas" className="section savings-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-overline">Metas de ahorro</span>
          <h2 className="section-title">Ahorra con propósito</h2>
          <p className="section-subtitle">
            Crea tus metas, registra cada abono y visualiza tu progreso en tiempo real.
            Los datos se guardan en tu navegador.
          </p>
        </div>

        {/* App mock */}
        <div className="savings-mock">
          {/* Top bar */}
          <div className="savings-topbar">
            <div>
              <h3 className="savings-page-title">Mis metas</h3>
              <p className="savings-page-subtitle">
                {goals.length > 0
                  ? `¡Hola! Ahorra para lo que sueñas.`
                  : '¿Cuál será tu primera misión?'}
              </p>
            </div>
          </div>

          {/* Economy cards */}
          <div className="savings-economy-row">
            <div className="economy-card">
              <div className="economy-icon-wrap economy-icon-wrap--gold">
                <Wallet size={22} strokeWidth={1.5} />
              </div>
              <div className="economy-texts">
                <span className="economy-label">Ahorros</span>
                <span className="economy-value">{formatCOP(totalSaved)}</span>
              </div>
            </div>
            <div className="economy-card">
              <div className="economy-icon-wrap economy-icon-wrap--brand">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <div className="economy-texts">
                <span className="economy-label">Cetis</span>
                <span className="economy-value economy-value--primary">
                  {deposits.length * 10}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="savings-actions">
            <button
              className="savings-action-btn savings-action-btn--primary"
              onClick={() => openDeposit()}
              disabled={goals.length === 0}
            >
              <span>+</span> Ahorrar
            </button>
            <button
              className="savings-action-btn savings-action-btn--ghost"
              onClick={() => setShowNewGoal(true)}
            >
              <Flag size={15} strokeWidth={2} /> Nueva meta
            </button>
          </div>

          {/* Goals */}
          <div className="savings-goals-section">
            <h4 className="savings-section-label">Tus metas</h4>
            {goals.length > 0 ? (
              <div className="goals-list">
                {goals.map((g) => (
                  <GoalCard key={g.id} goal={g} onDeposit={openDeposit} />
                ))}
              </div>
            ) : (
              <div className="goals-empty">
                <span className="goals-empty__star">
                  <Star size={36} strokeWidth={1.5} />
                </span>
                <p className="goals-empty__text">¿Cuál será tu primera meta?</p>
                <button
                  className="ceti-btn ceti-btn--glass ceti-btn--small"
                  onClick={() => setShowNewGoal(true)}
                >
                  Crear mi meta
                </button>
              </div>
            )}
          </div>

          {/* History */}
          {deposits.length > 0 && (
            <div className="savings-history-section">
              <h4 className="savings-section-label">Historial</h4>
              <div className="history-box">
                {deposits.slice(0, 5).map((d, i, arr) => {
                  const goal = goals.find((g) => g.id === d.goalId)
                  return (
                    <div
                      key={d.id}
                      className={`history-item${i < arr.length - 1 ? ' history-item--sep' : ''}`}
                    >
                      <span className="history-item__icon">
                        <CheckCircle2 size={18} strokeWidth={2} />
                      </span>
                      <span className="history-item__desc">
                        {d.description}
                        {goal && (
                          <span className="history-item__goal"> · {goal.title}</span>
                        )}
                      </span>
                      <span className="history-item__amount">{formatCOP(d.amount)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <NewGoalModal
        visible={showNewGoal}
        onClose={() => setShowNewGoal(false)}
        onCreate={handleCreateGoal}
      />
      <DepositModal
        visible={showDeposit}
        onClose={() => setShowDeposit(false)}
        goals={goals}
        preSelected={preSelected}
        onDeposit={handleDeposit}
      />
    </section>
  )
}
