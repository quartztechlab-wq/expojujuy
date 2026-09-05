// Contenido del bloque "Lo que se viene" del Inicio (handoff v9, INICIO-V9.md).
// La grilla es asimétrica: el primer ítem es la tarjeta hero (con foto de fondo) y
// los dos siguientes son las tarjetas laterales con cifra e ícono.

/**
 * @typedef {Object} Destacado
 * @property {string} t      Título de la tarjeta.
 * @property {string} d      Bajada.
 * @property {string} color  Color de acento (token CSS).
 * @property {string} cta    Texto del llamado a la acción (la flecha la pone el markup).
 * @property {'agenda'|'chat'} accion  Qué hace el CTA; index.html la traduce a un handler.
 * @property {string} tag    Pill superior ("Vuelve", "Nuevo 2026").
 * @property {string} n      Cifra grande.
 * @property {string} nl     Unidad de la cifra.
 * @property {string} icon   `clip-path` del glifo de la tarjeta lateral.
 */

/** Las cifras "12" y "+30" son demostrativas: a confirmar con la organización. */
export const DESTACADOS = [
  {
    t: 'Rondas de negocios internacionales',
    d: 'Delegaciones de 12 países y agenda de reuniones 1:1 para conectar la producción jujeña con el mundo.',
    color: 'var(--vi)', cta: 'Ver agenda', accion: 'agenda',
    tag: 'Vuelve', n: '12', nl: 'países',
    // Estrella de 5 puntas.
    icon: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
  },
  {
    t: 'Zona Startups y Hackathon',
    d: 'El talento joven del NOA: Demo Day, mentorías y un hackathon universitario con premiación en el auditorio.',
    color: 'var(--ma)', cta: 'Conocer más', accion: 'agenda',
    tag: 'Nuevo 2026', n: '+30', nl: 'startups',
    // Hexágono.
    icon: 'polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%)'
  },
  {
    t: 'Experiencia con IA',
    d: 'Cardón, el asistente virtual, te ayuda a armar tu recorrido, encontrar stands y no perderte nada del evento.',
    color: 'var(--ve)', cta: 'Probar a Cardón', accion: 'chat',
    tag: 'Nuevo 2026', n: '24/7', nl: 'asistencia',
    // Burbuja de chat.
    icon: 'polygon(20% 10%, 80% 10%, 80% 60%, 55% 60%, 40% 78%, 40% 60%, 20% 60%)'
  }
];
