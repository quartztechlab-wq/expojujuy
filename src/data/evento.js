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
 * @property {string} stand   Código de stand: letra de pabellón + número (ej. "A-04").
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

/**
 * @typedef {Object} Sector
 * @property {string} id
 * @property {string} name
 * @property {string} sub
 * @property {string} area     Posición en la grilla CSS del plano (grid-area).
 * @property {string} c        Color base en "r,g,b" para rgba().
 * @property {string} desc
 */

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
  { nombre: 'Litio Andino SA', rubro: 'Minería', stand: 'A-04' },
  { nombre: 'SolNorte Energía', rubro: 'Energía', stand: 'A-11' },
  { nombre: 'Quantum Software Jujuy', rubro: 'Tecnología', stand: 'B-02' },
  { nombre: 'Tabacal Agroindustria', rubro: 'Agroindustria', stand: 'C-07' },
  { nombre: 'Altos Andes Turismo', rubro: 'Turismo', stand: 'B-15' },
  { nombre: 'NOA Export Group', rubro: 'Comercio Exterior', stand: 'A-09' },
  { nombre: 'Data Puna', rubro: 'Economía del Conocimiento', stand: 'B-05' },
  { nombre: 'Cerámica Humahuaca', rubro: 'Manufactura', stand: 'C-12' },
  { nombre: 'Verde Litio Tech', rubro: 'Minería', stand: 'A-06' },
  { nombre: 'Andes Cloud', rubro: 'Tecnología', stand: 'B-08' },
  { nombre: 'Quinua del Sol', rubro: 'Agroindustria', stand: 'C-03' },
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

/** @type {Sector[]} */
export const SECTORES = [
  { id: 'acc', name: 'Acceso y acreditación', sub: 'Ingreso principal', area: '1 / 1 / 2 / 4', c: '152,160,184', desc: 'Ingreso principal al predio. Acreditación con QR, informes y punto de encuentro. Abre 30 minutos antes de cada jornada.' },
  { id: 'pabA', name: 'Pabellón A', sub: 'Minería y Energía', area: '2 / 1 / 4 / 6', c: '224,154,69', desc: 'El corazón productivo de la expo: empresas de litio, minería y energías renovables del NOA, con maquetas, demos y espacios de proveeduría.' },
  { id: 'pabB', name: 'Pabellón B', sub: 'Tecnología y Conocimiento', area: '1 / 6 / 4 / 10', c: '120,87,245', desc: 'Software, servicios cloud, fintech y el polo de economía del conocimiento jujeño. Acá también se realizan las rondas de negocios internacionales.' },
  { id: 'aud', name: 'Auditorio Principal', sub: 'Charlas y paneles', area: '1 / 10 / 3 / 13', c: '43,196,214', desc: 'Escenario principal: apertura oficial, paneles, keynotes y la premiación del Hackathon. Capacidad para 600 personas, con intérprete de LSA.' },
  { id: 'sala', name: 'Sala de Conferencias', sub: 'Talleres', area: '3 / 10 / 4 / 13', c: '199,164,248', desc: 'Talleres prácticos y charlas técnicas en formato reducido. Requiere reserva de lugar desde la agenda.' },
  { id: 'pabC', name: 'Pabellón C', sub: 'Agroindustria y Manufactura', area: '4 / 1 / 6 / 5', c: '63,179,128', desc: 'Productores y manufactura regional: agroindustria, alimentos, cerámica y diseño con identidad jujeña. Feria de productores el domingo.' },
  { id: 'start', name: 'Zona Startups', sub: 'Emprendimientos', area: '4 / 5 / 6 / 8', c: '212,84,143', desc: 'El espacio más joven de la expo: startups del NOA, Demo Day, mentorías y el Hackathon ExpoJuy con equipos universitarios.' },
  { id: 'gastro', name: 'Plaza Gastronómica', sub: 'Sabores jujeños', area: '4 / 8 / 6 / 11', c: '192,96,56', desc: 'Cocina jujeña y regional: tamales, humita, café de Yungas y vinos de la Quebrada. Sede del After Expo del viernes.' },
  { id: 'serv', name: 'Servicios', sub: 'Sanitarios · Enfermería', area: '4 / 11 / 5 / 13', c: '106,115,144', desc: 'Sanitarios accesibles, enfermería, lactario y guardarropa.' },
  { id: 'inst', name: 'Espacio CCEJ', sub: 'Institucional', area: '5 / 11 / 6 / 13', c: '43,196,214', desc: 'Stand institucional de la Cámara de Comercio Exterior de Jujuy: información sobre cómo exportar y programas de vinculación.' }
];

/** Letra de stand → id de sector del plano. */
export const SECTOR_POR_LETRA = { A: 'pabA', B: 'pabB', C: 'pabC' };

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
export const TIPOS_ENTRADA = [
  { name: 'Entrada General', price: 'Gratis', desc: 'Acceso a pabellones, plaza gastronómica y actividades abiertas durante los 4 días. Requiere registro previo online.' },
  { name: 'Pase Full', price: '$ 15.000', desc: 'Todo lo de General + acceso prioritario al Auditorio, talleres con reserva y descuentos en la plaza gastronómica.' },
  { name: 'Pase Empresarial', price: '$ 60.000', desc: 'Acreditación business: rondas de negocios internacionales, sala VIP, agenda de reuniones 1:1 y networking con delegaciones.' }
];

export const SPONSORS = {
  dia: ['Andes Litio Corp', 'Banco NOA'],
  oro: ['TelecomNorte', 'Cauchari Solar', 'Aerolíneas del Norte', 'Grupo Cerro Azul'],
  plata: ['Café Yungas', 'Quebrada Wines', 'TecnoJuy', 'Hostal del Carmen', 'Impulsa Fintech', 'Radio Visión']
};

/** Todo junto, para inyectar en el prototipo (`Component`) desde el runtime. */
export const DATA = Object.freeze({
  FECHA_APERTURA, PREDIO, FECHAS_TEXTO, DIAS, RUBROS, EJES, EJES_IMPRESION, DESCRIPCIONES_RUBRO, EXPOSITORES,
  DURACION_ACTIVIDAD_MIN, AGENDA, claveActividad, NOTICIAS, SECTORES, SECTOR_POR_LETRA, FAQS, TIPOS_ENTRADA, SPONSORS
});
