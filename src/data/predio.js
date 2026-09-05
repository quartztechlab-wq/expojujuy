// Plano del predio (ExpoJuy 2026) — datos de la sección Mapa.
// El plano ilustrativo reproduce la distribución del informe EXPOJUY 2024: pabellón
// cubierto arriba a la derecha (sectores A/B/C), stands descubiertos D en el centro,
// patio de comidas abajo y E1/E2 + estacionamiento sobre el lateral derecho.
//
// Todas las coordenadas están en el sistema del viewBox de PLANO (1000 × 700).
// Cuando exista la API/CMS, estas constantes se reemplazan por el plano del año en curso:
// mientras los `id` se mantengan, el SVG de index.html sigue funcionando igual.

/**
 * @typedef {Object} Forma
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {number} rx  Radio de las esquinas.
 */

/**
 * @typedef {Object} SectorPredio
 * @property {string} id
 * @property {string} name
 * @property {string} kicker           Etiqueta breve del panel de detalle ("Sector cubierto").
 * @property {string} sub              Bajada del panel ("95 stands · Multisectorial").
 * @property {string} c                Color base en "r,g,b" para componer rgba().
 * @property {string} [legend]         Texto en la leyenda del plano (ausente = no aparece).
 * @property {'A'|'B'|'C'} [letter]    Letra de stand que agrupa a los expositores del sector.
 * @property {string[]} [tags]         Rubros que contiene; los usa el filtro por rubro.
 * @property {string} [loc]            Nombre del lugar en AGENDA, para traer sus actividades.
 * @property {string} desc
 * @property {Forma} shape             Rectángulo que ocupa en el plano (las etiquetas de
 *                                     texto y las tramas viven en el SVG de index.html).
 */

/**
 * @typedef {Object} StandPredio
 * @property {string} id      Código del stand ("D29", "F03").
 * @property {number} [m2]    Superficie en m² (los gastronómicos no la publican).
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 */

/** Sistema de coordenadas del plano. */
export const PLANO = Object.freeze({ viewBox: '0 0 1000 700', ancho: 1000, alto: 700 });

/** @type {SectorPredio[]} */
export const SECTORES = [
  { id: 'acc', name: 'Acceso principal', kicker: 'Acceso', sub: 'Ingreso y acreditación', c: '43,196,214', shape: { x: 44, y: 548, w: 80, h: 34, rx: 6 }, desc: 'Ingreso principal al predio por la calle interna de Ciudad Cultural. Acreditación con QR, informes y punto de encuentro. Abre 30 minutos antes de cada jornada.' },
  { id: 'cce', name: 'Eventos CCE', kicker: 'Auditorio', sub: 'Auditorio Principal', c: '199,164,248', legend: 'Institucional y auditorios', tags: [], loc: 'Auditorio Principal', shape: { x: 62, y: 60, w: 148, h: 60, rx: 5 }, desc: 'Escenario principal de la expo: acto de apertura, paneles, keynotes y premiación del Hackathon. Capacidad para 600 personas, con intérprete de LSA.' },
  { id: 'fne', name: 'Sala FNE', kicker: 'Sala', sub: 'Conferencias y talleres', c: '199,164,248', loc: 'Sala de Conferencias', shape: { x: 62, y: 128, w: 148, h: 96, rx: 5 }, desc: 'Talleres prácticos y charlas técnicas en formato reducido. Requiere reserva de lugar desde la agenda.' },
  { id: 'min', name: 'Ministerio de la Producción', kicker: 'Institucional', sub: 'Zona Startups', c: '199,164,248', loc: 'Zona Startups', tags: ['Economía del Conocimiento', 'Tecnología'], shape: { x: 62, y: 232, w: 148, h: 96, rx: 5 }, desc: 'Espacio del Ministerio de la Producción de Jujuy junto a la Zona Startups: Demo Day, mentorías y el Hackathon ExpoJuy con equipos universitarios.' },
  { id: 'emerg', name: 'Emergencia', kicker: 'Servicio', sub: 'Salud · Bomberos', c: '212,84,143', shape: { x: 218, y: 60, w: 88, h: 60, rx: 5 }, desc: 'Puesto sanitario y de emergencias. Enfermería, ambulancia y personal de bomberos durante todo el horario de la expo.' },
  { id: 'secA', name: 'Sector A', kicker: 'Sector cubierto', sub: '19 stands · Minería y Energía', c: '224,154,69', legend: 'Sector A · Cubiertos', letter: 'A', tags: ['Minería', 'Energía'], loc: 'Pabellón A', shape: { x: 344, y: 66, w: 412, h: 30, rx: 4 }, desc: 'Franja frontal del pabellón cubierto: empresas de litio, minería y energías renovables del NOA, con maquetas, demos y espacios de proveeduría.' },
  { id: 'secB', name: 'Sector B', kicker: 'Sector cubierto', sub: '95 stands · Multisectorial', c: '120,87,245', legend: 'Sector B · Cubiertos', letter: 'B', tags: ['Tecnología', 'Economía del Conocimiento', 'Comercio Exterior', 'Turismo'], loc: 'Pabellón B', shape: { x: 348, y: 110, w: 348, h: 222, rx: 6 }, desc: 'El corazón del pabellón cubierto, en trama diagonal: tecnología, servicios, fintech, turismo y comercio exterior. Acá también se realizan las rondas de negocios internacionales.' },
  { id: 'secC', name: 'Sector C', kicker: 'Sector cubierto', sub: '25 stands · Artesanos', c: '212,84,143', legend: 'Sector C · Artesanos', letter: 'C', tags: ['Manufactura', 'Agroindustria'], loc: 'Pabellón C', shape: { x: 708, y: 110, w: 48, h: 222, rx: 5 }, desc: 'Artesanos y manufactura con identidad jujeña: cerámica, textiles, diseño y producción local. Feria de productores el domingo.' },
  { id: 'secE1', name: 'E1 · Institucional', kicker: 'Sector descubierto', sub: '450 m² · Fuerzas y educación vial', c: '106,115,144', legend: 'Institucional E', shape: { x: 735, y: 372, w: 112, h: 96, rx: 6 }, desc: 'Bomberos, Policía, Ejército y Educación Vial: demostraciones, vehículos y actividades para escuelas.' },
  { id: 'secE2', name: 'E2 · Juegos infantiles', kicker: 'Sector descubierto', sub: '700 m² · Espacio familiar', c: '63,179,128', legend: 'Juegos infantiles', shape: { x: 722, y: 482, w: 150, h: 118, rx: 10 }, desc: 'Área de juegos y actividades para chicos, con sombra y espacio de descanso para las familias.' },
  { id: 'esc', name: 'Escenario', kicker: 'Zona de espectáculos', sub: 'Shows y cierre', c: '224,154,69', loc: 'Predio central', shape: { x: 618, y: 522, w: 46, h: 52, rx: 5 }, desc: 'Escenario al aire libre para espectáculos, música en vivo y el cierre con show de drones sobre el predio.' },
  { id: 'gastro', name: 'Patio de comidas', kicker: 'Sector gastronómico', sub: 'Sector F · 12 stands', c: '192,96,56', legend: 'Gastronómico F', tags: ['Gastronómico'], loc: 'Plaza Gastronómica', shape: { x: 262, y: 592, w: 380, h: 56, rx: 8 }, desc: 'Cocina jujeña y regional: tamales, humita, café de Yungas y vinos de la Quebrada. Sede del After Expo del viernes.' },
  { id: 'san', name: 'Sanitarios', kicker: 'Servicio', sub: 'Accesibles · Lactario', c: '106,115,144', legend: 'Servicios', shape: { x: 660, y: 600, w: 40, h: 30, rx: 5 }, desc: 'Sanitarios accesibles, lactario y guardarropa.' },
  { id: 'park', name: 'Estacionamiento', kicker: 'Servicio', sub: 'Gratuito', c: '106,115,144', shape: { x: 905, y: 60, w: 80, h: 330, rx: 8 }, desc: 'Estacionamiento gratuito sobre el lateral del predio, con acceso desde Av. de los Estudiantes Jujeños. Bicicletero junto al acceso.' }
];

/** Letra de stand cubierto → id de sector del plano. Los stands "D-xx" son descubiertos. */
export const SECTOR_POR_LETRA = { A: 'secA', B: 'secB', C: 'secC' };

/** Color base de los stands descubiertos (turquesa de marca), en "r,g,b". */
export const COLOR_STAND = '43,196,214';

/** Stands descubiertos del Sector D, en cuatro corridas sobre la plaza central. @type {StandPredio[]} */
export const STANDS = [
  { id: 'D1', m2: 80, x: 62, y: 352, w: 60, h: 45 }, { id: 'D2', m2: 100, x: 62, y: 402, w: 60, h: 55 },
  { id: 'D3', m2: 100, x: 62, y: 462, w: 60, h: 55 }, { id: 'D4', m2: 55, x: 62, y: 522, w: 70, h: 36 },
  { id: 'D5', m2: 50, x: 228, y: 140, w: 34, h: 52 },
  { id: 'D6b', m2: 40, x: 140, y: 372, w: 44, h: 32 }, { id: 'D6', m2: 40, x: 140, y: 410, w: 44, h: 32 },
  { id: 'D7', m2: 50, x: 205, y: 352, w: 44, h: 52 }, { id: 'D8', m2: 50, x: 205, y: 412, w: 44, h: 52 },
  { id: 'D9', m2: 25, x: 200, y: 472, w: 40, h: 36 }, { id: 'D10', m2: 25, x: 248, y: 462, w: 40, h: 36 },
  { id: 'D11', m2: 25, x: 270, y: 376, w: 42, h: 34 }, { id: 'D12', m2: 25, x: 316, y: 384, w: 42, h: 34 },
  { id: 'D13', m2: 25, x: 362, y: 394, w: 42, h: 34 },
  { id: 'D14', m2: 70, x: 420, y: 380, w: 56, h: 42 }, { id: 'D14b', m2: 80, x: 478, y: 380, w: 48, h: 42 },
  { id: 'D15', m2: 75, x: 528, y: 380, w: 80, h: 42 }, { id: 'D16', m2: 25, x: 640, y: 385, w: 40, h: 36 },
  { id: 'D17', m2: 25, x: 300, y: 470, w: 34, h: 30 }, { id: 'D24', m2: 25, x: 336, y: 470, w: 34, h: 30 },
  { id: 'D18', m2: 25, x: 372, y: 470, w: 34, h: 30 }, { id: 'D19', m2: 25, x: 408, y: 470, w: 34, h: 30 },
  { id: 'D20', m2: 50, x: 460, y: 470, w: 54, h: 30 }, { id: 'D21', m2: 50, x: 516, y: 470, w: 54, h: 30 },
  { id: 'D22', m2: 25, x: 600, y: 470, w: 34, h: 30 }, { id: 'D23', m2: 25, x: 636, y: 470, w: 34, h: 30 },
  { id: 'D25', m2: 25, x: 672, y: 470, w: 34, h: 30 },
  { id: 'D26', m2: 80, x: 180, y: 522, w: 52, h: 42 }, { id: 'D27', m2: 80, x: 234, y: 522, w: 52, h: 42 },
  { id: 'D28', m2: 120, x: 305, y: 522, w: 80, h: 42 }, { id: 'D29', m2: 80, x: 430, y: 522, w: 62, h: 42 },
  { id: 'D30', m2: 75, x: 90, y: 600, w: 40, h: 45 }, { id: 'D31', m2: 75, x: 132, y: 600, w: 40, h: 45 },
  { id: 'D32', m2: 18, x: 176, y: 600, w: 26, h: 26 }
];

/** Stands del patio de comidas (Sector F). @type {StandPredio[]} */
export const STANDS_GASTRO = [
  { id: 'F01', x: 225, y: 600, w: 30, h: 24 }, { id: 'F02', x: 225, y: 628, w: 30, h: 24 },
  { id: 'F03', x: 268, y: 655, w: 34, h: 22 }, { id: 'F04', x: 306, y: 655, w: 34, h: 22 },
  { id: 'F05', x: 344, y: 655, w: 34, h: 22 }, { id: 'F06', x: 382, y: 655, w: 34, h: 22 },
  { id: 'F07', x: 420, y: 655, w: 34, h: 22 }, { id: 'F08', x: 458, y: 655, w: 34, h: 22 },
  { id: 'F09', x: 496, y: 655, w: 34, h: 22 }, { id: 'F10', x: 534, y: 655, w: 34, h: 22 },
  { id: 'F11', x: 560, y: 608, w: 34, h: 22 }, { id: 'F12', x: 598, y: 608, w: 34, h: 22 }
];

/** Métricas del predio que encabezan la sección (informe 2024). */
export const METRICAS_PREDIO = [
  { v: '18.000 m²', l: 'de superficie' },
  { v: String(STANDS.length), l: 'stands descubiertos' },
  { v: '139', l: 'stands cubiertos' }
];

/** Ids de sector que aparecen en la leyenda del plano, en orden. */
export const LEYENDA = ['secA', 'secB', 'secC', 'gastro', 'cce', 'secE1', 'secE2', 'san'];
