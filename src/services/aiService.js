import { multipleChoiceQuestions, choosePathQuestions } from '../data/questionBank'

const SYSTEM_PROMPT = `Eres el motor de personalización de Cetti, una app de educación financiera con temática espacial.
Recibirás el perfil de un usuario y el banco de preguntas disponibles. Tu tarea es seleccionar y adaptar UNA pregunta de selección múltiple y UNA de elige un camino.
REGLAS ESTRICTAS:
- NO inventes preguntas nuevas
- SOLO adapta el contexto superficial (nombres, ejemplos, referencias) al perfil del usuario
- Los números, conceptos y respuestas correctas NO cambian
- La adaptación debe sentirse natural, no forzada
- Si el usuario es gamer, usa referencias de juegos
- Si le gusta la moda, usa referencias de ropa y tendencias
- Si le gustan los viajes, usa contexto de destinos y gastos
- Si le gusta la música, usa contexto de conciertos, equipos, artistas
- Si le gusta la tecnología, usa contexto de gadgets, apps, suscripciones
- Si le gustan los deportes, usa contexto de equipamiento, membresías, torneos
Responde ÚNICAMENTE en formato JSON válido, sin texto extra, sin bloques de código markdown`

function buildFallback(name, goalName, goalAmount) {
  const mc =
    multipleChoiceQuestions[Math.floor(Math.random() * multipleChoiceQuestions.length)]
  const path =
    choosePathQuestions[Math.floor(Math.random() * choosePathQuestions.length)]
  return {
    greeting: `¡Bienvenido/a a Cetti, ${name}! Tu misión hacia "${goalName}" comienza ahora. Veamos cuánto sabes de finanzas.`,
    multipleChoice: {
      id: mc.id,
      question: mc.question,
      options: mc.options,
      correct: mc.correct,
      explanation: mc.explanation,
    },
    choosePath: {
      id: path.id,
      situation: path.situation,
      paths: path.paths,
    },
  }
}

function validateResponse(data, name, goalName, goalAmount) {
  if (!data || typeof data !== 'object') return buildFallback(name, goalName, goalAmount)

  const mc = data.multipleChoice
  const path = data.choosePath

  const mcOk =
    mc &&
    typeof mc.question === 'string' &&
    Array.isArray(mc.options) &&
    mc.options.length === 4 &&
    typeof mc.correct === 'number' &&
    mc.correct >= 0 &&
    mc.correct < mc.options.length

  const pathOk =
    path &&
    typeof path.situation === 'string' &&
    Array.isArray(path.paths) &&
    path.paths.length >= 2 &&
    path.paths.every(
      (p) => typeof p.label === 'string' && typeof p.consequence === 'string'
    )

  if (!mcOk || !pathOk) return buildFallback(name, goalName, goalAmount)

  return {
    greeting: typeof data.greeting === 'string' ? data.greeting : '',
    multipleChoice: mc,
    choosePath: path,
  }
}

export async function getPersonalizedQuiz({ name, age, interests, goalName, goalAmount }) {
  const userMessage = `Perfil del usuario:
Nombre: ${name}
Edad: ${age}
Gustos: ${interests.join(', ')}
Meta de ahorro: ${goalName} por valor de ${goalAmount}

Banco de preguntas disponible:
${JSON.stringify(
  { multipleChoice: multipleChoiceQuestions, choosePath: choosePathQuestions },
  null,
  2
)}
Selecciona y adapta una pregunta de cada tipo.`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const raw = json.choices?.[0]?.message?.content ?? ''
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return validateResponse(parsed, name, goalName, goalAmount)
  } catch (err) {
    console.warn('[Cetti AI] Using fallback:', err.message)
    return buildFallback(name, goalName, goalAmount)
  }
}
