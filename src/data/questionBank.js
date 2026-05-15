export const multipleChoiceQuestions = [
  {
    id: 'mc_001',
    world: 1,
    concept: 'ingresos vs gastos',
    question: '¿Qué es un ingreso?',
    options: [
      'Dinero que gastas en el mes',
      'Dinero que recibes por tu trabajo o actividad',
      'Dinero que le debes a alguien',
      'Dinero guardado en el banco',
    ],
    correct: 1,
    explanation:
      'Un ingreso es todo el dinero que entra a tu bolsillo, ya sea por trabajo, negocio u otra fuente.',
  },
  {
    id: 'mc_002',
    world: 1,
    concept: 'necesidades vs deseos',
    question: '¿Cuál de estos es una necesidad básica?',
    options: ['Suscripción a streaming', 'Ropa de marca', 'Alimentación', 'Videojuegos'],
    correct: 2,
    explanation:
      'Las necesidades son indispensables para vivir. La alimentación es una necesidad básica.',
  },
  {
    id: 'mc_003',
    world: 2,
    concept: 'presupuesto',
    question: 'Si ganas $1.000.000 al mes y gastas $800.000, ¿cuánto puedes ahorrar?',
    options: ['$100.000', '$300.000', '$200.000', '$500.000'],
    correct: 2,
    explanation:
      'La diferencia entre ingresos y gastos es lo que puedes destinar al ahorro: $1.000.000 - $800.000 = $200.000.',
  },
  {
    id: 'mc_004',
    world: 2,
    concept: 'regla 50/30/20',
    question:
      'Según la regla 50/30/20, ¿qué porcentaje de tus ingresos deberías ahorrar?',
    options: ['50%', '30%', '10%', '20%'],
    correct: 3,
    explanation:
      'La regla 50/30/20 sugiere destinar 50% a necesidades, 30% a deseos y 20% al ahorro.',
  },
  {
    id: 'mc_005',
    world: 3,
    concept: 'fondo de emergencia',
    question: '¿Para qué sirve un fondo de emergencia?',
    options: [
      'Para gastar en vacaciones',
      'Para cubrir gastos inesperados sin endeudarse',
      'Para invertir en acciones',
      'Para pagar deudas del mes',
    ],
    correct: 1,
    explanation:
      'El fondo de emergencia es un colchón financiero para imprevistos como enfermedad, desempleo o reparaciones urgentes.',
  },
  {
    id: 'mc_006',
    world: 4,
    concept: 'tarjeta de crédito',
    question: '¿Qué pasa si pagas solo el mínimo de tu tarjeta de crédito cada mes?',
    options: [
      'Tu deuda desaparece en poco tiempo',
      'No pasa nada, es lo recomendado',
      'La deuda crece por los intereses acumulados',
      'Tu historial crediticio mejora automáticamente',
    ],
    correct: 2,
    explanation:
      'Pagar solo el mínimo hace que los intereses se acumulen y termines pagando mucho más de lo que gastaste.',
  },
  {
    id: 'mc_007',
    world: 5,
    concept: 'interés compuesto',
    question: '¿Qué es el interés compuesto?',
    options: [
      'Un interés que solo se aplica una vez',
      'Un interés que se calcula sobre el capital más los intereses acumulados',
      'Un tipo de impuesto bancario',
      'El interés que cobran las tiendas por cuotas',
    ],
    correct: 1,
    explanation:
      'El interés compuesto se calcula sobre el capital inicial más los intereses ya generados. Con el tiempo, hace crecer el dinero exponencialmente.',
  },
];

export const choosePathQuestions = [
  {
    id: 'path_001',
    world: 1,
    concept: 'decisión de gasto',
    situation:
      'Te acaba de llegar tu primer sueldo del mes: $1.200.000. Tienes pendiente pagar el arriendo, pero también hay unas zapatillas que quieres hace meses. ¿Qué haces?',
    paths: [
      {
        label: 'Pago el arriendo primero',
        consequence:
          'Decisión inteligente. Cubrir tus necesidades básicas primero te da estabilidad. Si sobra, entonces puedes evaluar el deseo.',
        positive: true,
      },
      {
        label: 'Compro las zapatillas, el arriendo puede esperar',
        consequence:
          'Riesgo alto. Posponer necesidades básicas por deseos puede generar deudas y estrés financiero. Los deseos deben esperar.',
        positive: false,
      },
      {
        label: 'Divido el dinero entre ambos',
        consequence:
          'Depende. Si no alcanza para cubrir el arriendo completo, estás generando una deuda. Prioriza siempre las necesidades.',
        positive: false,
      },
    ],
  },
  {
    id: 'path_002',
    world: 2,
    concept: 'presupuesto inesperado',
    situation:
      'Un familiar te regala $500.000 inesperadamente. No tienes deudas urgentes. ¿Qué decides hacer?',
    paths: [
      {
        label: 'Lo gasto en algo que quería hace tiempo',
        consequence:
          'No es un error, pero es una oportunidad perdida. El dinero inesperado es ideal para fortalecer tu fondo de emergencia o metas de ahorro.',
        positive: false,
      },
      {
        label: 'Lo agrego a mi fondo de emergencia',
        consequence:
          'Excelente decisión. Reforzar tu colchón financiero te protege ante imprevistos futuros sin necesidad de endeudarte.',
        positive: true,
      },
      {
        label: 'Lo invierto en algo',
        consequence:
          'Buena mentalidad. Antes de invertir asegúrate de tener un fondo de emergencia sólido, pero pensar en inversión desde joven es clave.',
        positive: true,
      },
    ],
  },
  {
    id: 'path_003',
    world: 3,
    concept: 'ahorro vs deuda',
    situation:
      'Tienes $300.000 ahorrados y te surge una deuda de $300.000 con intereses del 3% mensual. ¿Qué haces?',
    paths: [
      {
        label: 'Uso mis ahorros para pagar la deuda',
        consequence:
          'Correcto. Una deuda al 3% mensual crece rápido. Usar el ahorro para eliminarla te ahorra mucho dinero en intereses.',
        positive: true,
      },
      {
        label: 'Guardo mis ahorros y pago la deuda en cuotas',
        consequence:
          'Costoso. Si tus ahorros generan menos del 3% mensual, estás perdiendo dinero. La deuda crece más rápido de lo que ahorras.',
        positive: false,
      },
      {
        label: 'Ignoro la deuda por ahora',
        consequence:
          'Peligroso. Ignorar una deuda con intereses hace que crezca exponencialmente y afecte tu historial crediticio.',
        positive: false,
      },
    ],
  },
];
