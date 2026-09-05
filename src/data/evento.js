// Logos de sponsors: importados para que Vite los copie a dist/ con hash (el src se resuelve en runtime).
import logoExar from '../../assets/sponsors/exar.png';
import logoSeguros from '../../assets/sponsors/seguros-jujuy.png';
import logoCannava from '../../assets/sponsors/cannava.png';
import logoKelimpio from '../../assets/sponsors/kelimpio.png';
import logoSecTurismo from '../../assets/sponsors/secretaria-turismo.png';
import logoCac from '../../assets/sponsors/cac.png';
import logoCfi from '../../assets/sponsors/cfi.png';
import logoMuniSsj from '../../assets/sponsors/municipalidad-ssj.png';
import logoCamcomext from '../../assets/logo-camcomext.png';

// Plano del predio: sectores, stands y coordenadas del SVG (ver src/data/predio.js).
import { PLANO, SECTORES, SECTOR_POR_LETRA, COLOR_STAND, STANDS, STANDS_GASTRO, METRICAS_PREDIO, LEYENDA } from './predio.js';

// Mock data centralizada de ExpoJuy 2026.
// Única fuente de verdad para buscador, mapa, agenda, recomendador, entradas y portal.
// Cuando exista la API (Spring Boot) estas constantes se reemplazan por fetchs que
// devuelvan las mismas formas documentadas en los typedefs de abajo.

/** @typedef {'Minería'|'Energía'|'Tecnología'|'Agroindustria'|'Turismo'|'Comercio Exterior'|'Economía del Conocimiento'|'Manufactura'} Rubro */
/** @typedef {'Innovación'|'Producción'|'Vinculación'|'Economía del Conocimiento'} Eje */

/**
 * @typedef {Object} Expositor
 * @property {string} nombre
 * @property {Rubro} rubro
 * @property {string} stand   Código de stand: letra de sector + número ("B-02" cubierto, "D-29" descubierto).
 */

/**
 * @typedef {Object} Actividad
 * @property {0|1|2|3} dia     Índice del día dentro de {@link DIAS}.
 * @property {string} hora     Hora de inicio "HH:MM".
 * @property {string} titulo
 * @property {string} lugar    Sala o escenario (coincide con nombres de {@link SECTORES}).
 * @property {Eje} eje
 * @property {string} disertante
 */

/**
 * @typedef {Object} Dia
 * @property {string} corto    Etiqueta de tab ("JUE 24").
 * @property {string} largo    Nombre completo para documentos ("Jueves 24 de septiembre").
 * @property {string} tema     Subtítulo del día.
 */

/**
 * @typedef {Object} Noticia
 * @property {string} tag
 * @property {string} date
 * @property {string} title
 * @property {string} [exc]
 * @property {string} color    Token CSS del color de la etiqueta.
 */

/** El plano del predio (sectores, stands y coordenadas) vive en `src/data/predio.js`. */

/**
 * @typedef {Object} TipoEntrada
 * @property {string} name
 * @property {string} price
 * @property {string} desc
 */

/** @typedef {[pregunta: string, respuesta: string]} Faq */

/** Fecha y hora de apertura (configurable también desde la prop `fechaObjetivo`). */
export const FECHA_APERTURA = '2026-09-24T09:00:00-03:00';

/** Predio del evento (dato demostrativo, a confirmar por la organización). */
export const PREDIO = { nombre: 'Predio ferial Ciudad Cultural', ciudad: 'San Salvador de Jujuy (a confirmar)', horario: 'Abre 9 h · cierra 21 h' };

/** Fechas del evento en formato corto para tickets e itinerario. */
export const FECHAS_TEXTO = '24 al 27 SEP 2026';

/** @type {Dia[]} */
export const DIAS = [
  { corto: 'JUE 24', largo: 'Jueves 24 de septiembre', tema: 'Apertura' },
  { corto: 'VIE 25', largo: 'Viernes 25 de septiembre', tema: 'Negocios' },
  { corto: 'SÁB 26', largo: 'Sábado 26 de septiembre', tema: 'Conocimiento' },
  { corto: 'DOM 27', largo: 'Domingo 27 de septiembre', tema: 'Cierre' }
];

/** Color (token CSS) por rubro de expositor. @type {Record<Rubro, string>} */
export const RUBROS = {
  'Minería': 'var(--oc)', 'Energía': 'var(--en)', 'Tecnología': 'var(--tq)', 'Agroindustria': 'var(--ve)',
  'Turismo': 'var(--ma)', 'Comercio Exterior': 'var(--vi)', 'Economía del Conocimiento': 'var(--li)', 'Manufactura': 'var(--te)'
};

/** Color (token CSS) por eje de agenda. @type {Record<Eje, string>} */
export const EJES = { 'Innovación': 'var(--tq)', 'Producción': 'var(--oc)', 'Vinculación': 'var(--ma)', 'Economía del Conocimiento': 'var(--li)' };

/**
 * Color hexadecimal por eje para documentos sobre fondo blanco (PDF del itinerario).
 * Economía del Conocimiento usa violeta porque el lila no contrasta sobre papel.
 * @type {Record<Eje, string>}
 */
export const EJES_IMPRESION = { 'Innovación': '#2BC4D6', 'Producción': '#E09A45', 'Vinculación': '#D4548F', 'Economía del Conocimiento': '#7857F5' };

/** Descripción genérica por rubro para la ficha de expositor. @type {Record<Rubro, string>} */
export const DESCRIPCIONES_RUBRO = {
  'Minería': 'Empresa del ecosistema minero-litio del NOA. Presenta sus procesos de producción sustentable y oportunidades de proveeduría local.',
  'Energía': 'Desarrolla proyectos de energía renovable en la Puna jujeña. Trae a la expo su portfolio de parques solares y soluciones para industria.',
  'Tecnología': 'Compañía de base tecnológica jujeña. Exhibe productos de software, servicios cloud y casos de transformación digital para pymes.',
  'Agroindustria': 'Productor agroindustrial regional con proyección exportadora. Presenta su línea de productos y busca compradores internacionales.',
  'Turismo': 'Operador de experiencias turísticas en la Quebrada y la Puna. Muestra su propuesta de turismo receptivo y corporativo.',
  'Comercio Exterior': 'Especialistas en logística y comercio internacional. Asesoran a empresas del NOA para llegar a nuevos mercados.',
  'Economía del Conocimiento': 'Parte del polo de economía del conocimiento de Jujuy. Talento digital, IA y servicios basados en conocimiento para exportar.',
  'Manufactura': 'Manufactura regional con identidad jujeña. Diseño, producción local y nuevas capacidades industriales.'
};

/** @type {Expositor[]} */
export const EXPOSITORES = [
  { nombre: 'Litio Andino SA', rubro: 'Minería', stand: 'D-29' },
  { nombre: 'SolNorte Energía', rubro: 'Energía', stand: 'D-28' },
  { nombre: 'Quantum Software Jujuy', rubro: 'Tecnología', stand: 'B-02' },
  { nombre: 'Tabacal Agroindustria', rubro: 'Agroindustria', stand: 'D-02' },
  { nombre: 'Altos Andes Turismo', rubro: 'Turismo', stand: 'D-14' },
  { nombre: 'NOA Export Group', rubro: 'Comercio Exterior', stand: 'D-20' },
  { nombre: 'Data Puna', rubro: 'Economía del Conocimiento', stand: 'B-05' },
  { nombre: 'Cerámica Humahuaca', rubro: 'Manufactura', stand: 'D-26' },
  { nombre: 'Verde Litio Tech', rubro: 'Minería', stand: 'A-06' },
  { nombre: 'Andes Cloud', rubro: 'Tecnología', stand: 'B-08' },
  { nombre: 'Quinua del Sol', rubro: 'Agroindustria', stand: 'D-08' },
  { nombre: 'Jujuy Fintech Hub', rubro: 'Economía del Conocimiento', stand: 'B-11' }
];

/** Duración estimada de cada actividad, en minutos (no hay hora de fin en la agenda oficial). */
export const DURACION_ACTIVIDAD_MIN = 90;

/**
 * Agenda demostrativa. Incluye actividades en paralelo (11:30, 12:30, 16:00 y 15:00) para que el
 * recomendador y la detección de superposiciones de Mi Agenda sean verificables con datos locales.
 * @type {Actividad[]}
 */
export const AGENDA = [
  { dia: 0, hora: '09:30', titulo: 'Acto de apertura oficial', lugar: 'Auditorio Principal', eje: 'Vinculación', disertante: 'Autoridades de la CCEJ y gobierno provincial' },
  { dia: 0, hora: '11:00', titulo: 'Litio y después: la nueva matriz productiva del NOA', lugar: 'Auditorio Principal', eje: 'Producción', disertante: 'Panel minero-energético' },
  { dia: 0, hora: '11:30', titulo: 'Proveedores locales para la minería: cómo calificar', lugar: 'Pabellón A', eje: 'Producción', disertante: 'Litio Andino SA + NOA Export Group' },
  { dia: 0, hora: '15:00', titulo: 'IA aplicada a la agroindustria', lugar: 'Sala de Conferencias', eje: 'Innovación', disertante: 'Data Puna + INTA' },
  { dia: 0, hora: '18:00', titulo: 'Ronda de negocios internacional (día 1)', lugar: 'Pabellón B', eje: 'Vinculación', disertante: 'Delegaciones de 12 países' },
  { dia: 1, hora: '10:00', titulo: 'Exportar desde Jujuy: guía práctica', lugar: 'Sala de Conferencias', eje: 'Vinculación', disertante: 'Cámara de Comercio Exterior de Jujuy' },
  { dia: 1, hora: '12:00', titulo: 'Demo Day de la Zona Startups', lugar: 'Zona Startups', eje: 'Economía del Conocimiento', disertante: '10 startups del NOA' },
  { dia: 1, hora: '12:30', titulo: 'Taller: cómo armar tu pitch para inversores', lugar: 'Sala de Conferencias', eje: 'Economía del Conocimiento', disertante: 'Impulsa Fintech' },
  { dia: 1, hora: '16:00', titulo: 'Energías renovables: el caso Cauchari', lugar: 'Auditorio Principal', eje: 'Producción', disertante: 'Cauchari Solar' },
  { dia: 1, hora: '19:00', titulo: 'After Expo: networking y música en vivo', lugar: 'Plaza Gastronómica', eje: 'Vinculación', disertante: 'Abierto a acreditados' },
  { dia: 2, hora: '10:30', titulo: 'Economía del conocimiento: el empleo del futuro', lugar: 'Auditorio Principal', eje: 'Economía del Conocimiento', disertante: 'Jujuy Fintech Hub + universidades' },
  { dia: 2, hora: '12:30', titulo: 'Taller: marca personal para emprendedores', lugar: 'Sala de Conferencias', eje: 'Innovación', disertante: 'Mentores Zona Startups' },
  { dia: 2, hora: '15:30', titulo: 'Turismo + tecnología: experiencias inmersivas en la Quebrada', lugar: 'Sala de Conferencias', eje: 'Innovación', disertante: 'Altos Andes Turismo' },
  { dia: 2, hora: '16:00', titulo: 'Ronda de negocios internacional (día 3)', lugar: 'Pabellón B', eje: 'Vinculación', disertante: 'Delegaciones de 12 países' },
  { dia: 2, hora: '17:30', titulo: 'Hackathon ExpoJuy: presentación de equipos', lugar: 'Zona Startups', eje: 'Economía del Conocimiento', disertante: 'Equipos universitarios' },
  { dia: 3, hora: '11:00', titulo: 'Feria de productores y economía regional', lugar: 'Pabellón C', eje: 'Producción', disertante: 'Productores de toda la provincia' },
  { dia: 3, hora: '14:00', titulo: 'Final del Hackathon y premiación', lugar: 'Auditorio Principal', eje: 'Economía del Conocimiento', disertante: 'Jurado + sponsors' },
  { dia: 3, hora: '15:00', titulo: 'Cocina en vivo: sabores de la Quebrada', lugar: 'Plaza Gastronómica', eje: 'Producción', disertante: 'Cocineros de la Quebrada y la Puna' },
  { dia: 3, hora: '16:30', titulo: 'Jujuy 2030: visión de desarrollo', lugar: 'Auditorio Principal', eje: 'Vinculación', disertante: 'Panel institucional de cierre' },
  { dia: 3, hora: '19:00', titulo: 'Cierre + show de drones sobre el predio', lugar: 'Predio central', eje: 'Innovación', disertante: 'Abierto al público' }
];

/**
 * Clave estable de una actividad dentro de la agenda personal (`saved`).
 * Es la misma clave que usaba la sección Agenda antes del portal: `${dia}${hora}`.
 * @param {Pick<Actividad, 'dia'|'hora'>} a
 */
export const claveActividad = (a) => a.dia + a.hora;

/** @type {Noticia[]} */
export const NOTICIAS = [
  { tag: 'Convocatoria', date: '28 AGO 2026', title: 'ExpoJuy 2026 abre la convocatoria a expositores de todo el país', exc: 'Empresas de minería, energía, agroindustria, turismo y tecnología ya pueden reservar su stand para la edición más grande de la historia de la expo.', color: 'var(--tq)' },
  { tag: 'Tecnología', date: '21 AGO 2026', title: 'Cardón, el asistente con IA, debuta en la edición 2026', color: 'var(--ve)' },
  { tag: 'Internacional', date: '14 AGO 2026', title: 'Rondas de negocios: 12 países confirmaron delegaciones', color: 'var(--vi)' },
  { tag: 'Innovación', date: '07 AGO 2026', title: 'La Zona Startups duplica su superficie', color: 'var(--ma)' },
  { tag: 'Entradas', date: '01 AGO 2026', title: 'La inscripción general será gratuita con registro previo', color: 'var(--oc)' }
];

/** @type {Faq[]} */
export const FAQS = [
  ['¿Cuánto cuesta la entrada?', 'La entrada general es gratuita con registro previo online. Los pases Full y Empresarial (rondas de negocios) tienen costo y cupo limitado. Todas las acreditaciones se gestionan con QR desde este sitio.'],
  ['¿Cuáles son los días y horarios?', 'Del jueves 24 al domingo 27 de septiembre de 2026, de 9 a 21 h. La plaza gastronómica extiende su horario los días de eventos nocturnos.'],
  ['¿Dónde se realiza y cómo llego?', 'En el predio ferial de Ciudad Cultural, San Salvador de Jujuy. Habrá estacionamiento gratuito, bicicletero y refuerzo de líneas de transporte urbano durante los cuatro días.'],
  ['¿Cómo hago para exponer?', 'Completá el formulario de contacto eligiendo el motivo “Quiero exponer”. El equipo comercial te responde dentro de las 48 horas hábiles con el manual del expositor, planos y tarifas.'],
  ['¿El predio es accesible?', 'Sí: rampas y circulaciones accesibles, sanitarios adaptados, espacios de descanso e intérprete de Lengua de Señas Argentina en las actividades del Auditorio Principal. Este sitio sigue los lineamientos WCAG 2.1 AA.'],
  ['¿Pueden ingresar menores?', 'Sí, los menores de 12 años ingresan gratis acompañados por un adulto. Hay espacios familiares y actividades pensadas para escuelas técnicas el jueves y viernes.']
];

/** @type {TipoEntrada[]} */
/**
 * Tiers de entrada (handoff v4). `base` es el precio por persona en ARS (0 = gratis); el precio
 * grupal (5+) se calcula en el componente con −20 %. `accent` es un token CSS del tema, nunca un hex
 * literal (en tema claro los acentos cambian para mantener contraste). En producción llega de `/tiers`.
 */
export const TIPOS_ENTRADA = [
  {
    name: 'Entrada General', short: 'General', base: 0, nivel: 'Nivel 1', tag: 'Acceso general', accent: 'var(--tq)', accent2: 'var(--ve)',
    ideal: 'Ideal para visitantes, familias y estudiantes que quieren recorrer la expo.',
    desc: 'Acceso a pabellones, plaza gastronómica y actividades abiertas durante los 4 días. Requiere registro previo online.',
    perks: ['Acceso a los 6 pabellones y al patio de food trucks', 'Charlas y demostraciones abiertas de los 4 días', 'Mapa interactivo y agenda personal en el portal', 'QR digital para ingresar sin filas'],
    nota: 'Cupos limitados por día. Con el registro previo te aseguramos el ingreso.'
  },
  {
    name: 'Pase Full', short: 'Full', base: 15000, nivel: 'Nivel 2', tag: 'Acceso prioritario', accent: 'var(--vi)', accent2: 'var(--tq)',
    ideal: 'Ideal para profesionales, emprendedores y curiosos que no se quieren perder nada.',
    desc: 'Todo lo de General + acceso prioritario al Auditorio, talleres con reserva y descuentos en la plaza gastronómica.',
    perks: ['Todo lo de la Entrada General', 'Acceso prioritario al Auditorio Principal', 'Talleres y workshops con reserva de lugar', '15 % de descuento en la plaza gastronómica', 'Kit de bienvenida ExpoJuy 2026'],
    nota: 'Válido los 4 días. Los talleres se reservan desde tu portal.'
  },
  {
    name: 'Pase Empresarial', short: 'Empresarial', base: 60000, nivel: 'Nivel 3', tag: 'Acreditación business', accent: 'var(--en)', accent2: 'var(--oc)',
    ideal: 'Ideal para empresas, delegaciones y cámaras que vienen a hacer negocios.',
    desc: 'Acreditación business: rondas de negocios internacionales, sala VIP, agenda de reuniones 1:1 y networking con delegaciones.',
    perks: ['Todo lo del Pase Full', 'Rondas de negocios internacionales con matchmaking', 'Sala VIP con catering y espacios de reunión', 'Agenda de reuniones 1:1 con expositores', 'Networking con delegaciones y cámaras invitadas', 'Acceso a la cena de vinculación empresarial'],
    nota: 'Incluye acreditación nominal. Para delegaciones de 5 o más, usá la tarifa grupal.'
  }
];

/** Descuento grupal (por persona) y mínimo de personas para aplicarlo. */
export const GRUPO = Object.freeze({ descuento: 0.2, minimo: 5 });

/** FAQ corta de la sección Entradas (handoff v4). */
export const FAQ_ENTRADAS = [
  ['¿La Entrada General es realmente gratis?', 'Sí. Solo pedimos registro previo online para organizar el ingreso por día. Con el registro recibís tu QR en el portal y lo presentás en los accesos.'],
  ['¿Cómo funciona la tarifa grupal?', 'Para grupos de 5 o más personas (delegaciones, empresas, instituciones educativas) cada pase tiene 20 % de descuento. Se gestiona en un solo pago y cada integrante recibe su propio QR.'],
  ['¿Puedo cambiar de pase después de comprarlo?', 'Sí, podés subir de categoría desde tu portal hasta 48 h antes de la apertura abonando la diferencia. El QR se actualiza automáticamente.'],
  ['¿El QR funciona sin conexión?', 'Sí. Tu entrada queda guardada en el portal y en la PWA del evento, así que podés mostrarla aunque no tengas señal dentro del predio.']
];

/**
 * Sponsors (handoff v5). `h` = alto del logo en px por contexto (spotlight / fila / franja del
 * Inicio): los logos tienen proporciones muy distintas y se equilibran por alto, no por ancho.
 * `url: '#'` = pendiente de confirmar (se renderiza sin enlace). Oro y Plata son demostrativos.
 */
export const SPONSORS = {
  diamante: [ // el orden es el orden del spotlight
    { key: 'exar', name: 'Exar', logo: logoExar, url: 'https://www.exar.com.ar/',
      blurb: 'Litio para la transición energética, producido en las Salinas Grandes de Jujuy.', h: { spot: 64, row: 34, home: 30 } },
    { key: 'seguros', name: 'Compañía de Seguros de Jujuy', logo: logoSeguros, url: 'https://www.segurosdejujuy.com.ar/',
      blurb: 'La aseguradora de la provincia: protección para familias, comercios y empresas jujeñas.', h: { spot: 150, row: 58, home: 54 } },
    { key: 'cannava', name: 'Cannava', logo: logoCannava, url: 'https://cannava.com.ar/',
      blurb: 'Cannabis medicinal e industrial desde la primera empresa estatal del país.', h: { spot: 70, row: 34, home: 30 } },
    { key: 'kelimpio', name: 'KeLimpio', logo: logoKelimpio, url: '#',
      blurb: 'Higiene y limpieza profesional para hogares, comercios e industrias del NOA.', h: { spot: 112, row: 48, home: 44 } }
  ],
  oro: ['TelecomNorte', 'Cauchari Solar', 'Aerolíneas del Norte', 'Grupo Cerro Azul'].map(name => ({ name, url: '#' })),
  plata: ['Café Yungas', 'Quebrada Wines', 'TecnoJuy', 'Hostal del Carmen', 'Impulsa Fintech', 'Radio Visión', 'Norte Logística', 'Andes Data'].map(name => ({ name, url: '#' })),
  organiza: [{ name: 'Cámara de Comercio Exterior de Jujuy', logo: logoCamcomext, url: 'https://camcomexjujuy.com.ar/', h: 56 }],
  acompanan: [
    { name: 'Secretaría de Turismo, Ambiente y Deportes', logo: logoSecTurismo, url: 'https://www.argentina.gob.ar/turismo', h: 56 },
    { name: 'Cámara Argentina de Comercio y Servicios', logo: logoCac, url: 'https://www.cac.com.ar/', h: 50 },
    { name: 'Consejo Federal de Inversiones', logo: logoCfi, url: 'https://cfi.org.ar/', h: 56 },
    { name: 'Municipalidad de San Salvador de Jujuy', logo: logoMuniSsj, url: 'https://sansalvadordejujuy.gob.ar/', h: 66 }
  ],
  /** Métricas del CTA "Tu marca puede estar acá" (demostrativas). */
  metricas: [{ v: '45.000', l: 'visitantes' }, { v: '200+', l: 'expositores' }, { v: '4 días', l: 'de exposición' }]
};

/** Todo junto, para inyectar en el prototipo (`Component`) desde el runtime. */
export const DATA = Object.freeze({
  FECHA_APERTURA, PREDIO, FECHAS_TEXTO, DIAS, RUBROS, EJES, EJES_IMPRESION, DESCRIPCIONES_RUBRO, EXPOSITORES,
  DURACION_ACTIVIDAD_MIN, AGENDA, claveActividad, NOTICIAS, FAQS, TIPOS_ENTRADA, GRUPO, FAQ_ENTRADAS, SPONSORS,
  PLANO, SECTORES, SECTOR_POR_LETRA, COLOR_STAND, STANDS, STANDS_GASTRO, METRICAS_PREDIO, LEYENDA
});
