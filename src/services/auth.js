// Servicio de sesión del Portal de Usuario — simulado, sin backend.
//
// Es el único lugar que conoce el almacenamiento (localStorage `expojuy2026.portal`).
// La interfaz está pensada para reemplazarse por la API real (Spring Boot) sin tocar
// la UI: cada operación devuelve una Promise (o el valor persistido, en `cargar`) y
// la UI solo trabaja con el objeto {@link Sesion}.

/** @typedef {{ nombre: string, email: string }} Usuario */
/** @typedef {{ tier: number, nro: string }} Ticket  tier = índice en TIPOS_ENTRADA */
/**
 * @typedef {Object} Sesion
 * @property {Usuario} user
 * @property {Ticket|null} ticket
 * @property {Record<string, boolean>} saved      Actividades agendadas, clave `claveActividad`.
 * @property {Record<string, boolean>} intereses  Ejes de interés (misma fuente que el recomendador).
 */

const STORE = 'expojuy2026.portal';
/** Latencia simulada para que la UI muestre estados de carga como con una API real. */
const LATENCIA_MS = 700;
/** Cualquier email `demo@…` ingresa sin registro previo (revisión rápida del portal). */
const USUARIO_DEMO = 'demo';

export class AuthError extends Error {
  /** @param {'not-found'|'password'|'storage'} code */
  constructor(code, message) { super(message); this.name = 'AuthError'; this.code = code; }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizar = (email) => String(email || '').trim().toLowerCase();

/** SHA-256 hex; nunca se guarda la contraseña en claro. Devuelve null si WebCrypto no está disponible (http sin localhost). */
async function hash(text) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return null; }
}

function leer() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || 'null');
    return s && typeof s === 'object' && s.user && s.user.email ? s : null;
  } catch { return null; }
}

function escribir(data) {
  try { localStorage.setItem(STORE, JSON.stringify(data)); }
  catch { throw new AuthError('storage', 'No pudimos guardar la sesión en este dispositivo (¿navegación privada?).'); }
}

/** @returns {Sesion} */
const publica = (s) => ({ user: { nombre: s.user.nombre, email: s.user.email }, ticket: s.ticket || null, saved: s.saved || {}, intereses: s.intereses || {} });

export const authService = {
  /** Sesión persistida en este dispositivo, o null. Síncrona para hidratar el primer render sin parpadeo. */
  cargar() {
    const s = leer();
    return s ? publica(s) : null;
  },

  /**
   * Crea la cuenta local. Este dispositivo guarda una sola cuenta: registrar otra la reemplaza.
   * @param {{ nombre: string, email: string, password: string, intereses?: Record<string, boolean> }} datos
   * @returns {Promise<Sesion>}
   */
  async registrar({ nombre, email, password, intereses }) {
    await delay(LATENCIA_MS);
    /** @type {Sesion} */
    const sesion = { user: { nombre: String(nombre).trim(), email: normalizar(email) }, ticket: null, saved: {}, intereses: { ...(intereses || {}) } };
    escribir({ ...sesion, passHash: await hash(password) });
    return sesion;
  },

  /**
   * Valida contra la cuenta guardada en este dispositivo (email + contraseña) o acepta `demo@…`.
   * @param {{ email: string, password: string }} datos
   * @returns {Promise<Sesion>}
   */
  async ingresar({ email, password }) {
    await delay(LATENCIA_MS);
    const e = normalizar(email);
    const prev = leer();
    if (prev && normalizar(prev.user.email) === e) {
      if (prev.passHash && (await hash(password)) !== prev.passHash) throw new AuthError('password', 'La contraseña no coincide con la que registraste en este dispositivo.');
      return publica(prev);
    }
    if (e.split('@')[0] === USUARIO_DEMO) {
      /** @type {Sesion} */
      const sesion = { user: { nombre: 'Visitante Demo', email: e }, ticket: null, saved: {}, intereses: {} };
      escribir(sesion);
      return sesion;
    }
    throw new AuthError('not-found', 'No encontramos una cuenta con ese email en este dispositivo. Probá con “Registrarme”.');
  },

  /** Persiste los cambios de la sesión activa (agenda, entrada, perfil, intereses). @param {Sesion} sesion */
  guardar(sesion) {
    const prev = leer();
    escribir({ ...(prev || {}), ...sesion });
  },

  /** Cierra la sesión y borra los datos locales. */
  cerrar() {
    try { localStorage.removeItem(STORE); } catch { /* sin storage no hay nada que borrar */ }
  }
};
