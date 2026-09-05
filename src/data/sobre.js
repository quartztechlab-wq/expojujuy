// Contenido de la sección "Sobre" (handoff v8).
// Fuente: informe EXPOJUY 2024 (objetivos, perfil de la feria, sectores, ronda de
// negocios, conferencias, presencia internacional). Las cifras marcadas como 2024 son
// del informe; "17ª · 2026" y las de la edición anterior están a confirmar con la
// organización, igual que el resto de la mock data.

// Logos institucionales: importados para que Vite los copie a dist/ (se usan por binding).
import logoCamcomext from '../../assets/logo-camcomext.png';
import logoMuniSsj from '../../assets/sponsors/municipalidad-ssj.png';
import logoGobiernoJujuy from '../../assets/logo-gobierno-jujuy.png';
import logoSecTurismo from '../../assets/sponsors/secretaria-turismo.png';
// El video también se importa: el <video src> se resuelve por binding y Vite no lo vería.
import video2024 from '../../assets/expojuy-2024.mp4';

/** Ficha rápida de la feria, en la franja de 4 celdas. */
export const PERFIL_EXPO = [
  { l: 'Edición', v: '17ª · 2026' },
  { l: 'Frecuencia', v: 'Bianual' },
  { l: 'Carácter', v: 'Multisectorial' },
  { l: 'Superficie', v: '18.000 m²' }
];

/** Cifras de la edición 2024. `n` es el valor final del count-up de la sección. */
export const EDICION_ANTERIOR = [
  { n: 180, l: 'expositores en 2024' },
  { n: 38000, l: 'visitantes en 2024' },
  { n: 9, l: 'países participantes' }
];

/** Los 13 objetivos de la exposición, en el orden del informe. */
export const OBJETIVOS = [
  'Presentar las ventajas económicas y comerciales de la provincia',
  'Presentar y demostrar productos, maquinaria, nuevas tecnologías y servicios',
  'Construir o ampliar la lista de clientes potenciales',
  'Sumar nuevos mercados',
  'Internacionalización y expansión de marcas',
  'Buscar inversiones',
  'Buscar cooperación y desarrollar alianzas estratégicas para proyectos públicos y privados',
  'Difundir la cultura de la provincia y fomentar el turismo',
  'Actualizarse sobre la situación del mercado',
  'Capacitarse e informarse sobre las tendencias en los negocios',
  'Encontrar distribuidores y agentes',
  'Conocer mejor a los competidores',
  'Descubrir nuevas oportunidades'
];

/**
 * Los 6 objetivos que se muestran como tarjetas, con título corto y detalle.
 * `n` es la posición dentro de {@link OBJETIVOS} (1-based): los que no están acá
 * arman la lista del desplegable.
 */
export const OBJETIVOS_DESTACADOS = [
  { n: 1, t: 'Mostrar las ventajas de Jujuy', d: 'Las ventajas económicas y comerciales de la provincia frente a compradores e inversores.' },
  { n: 2, t: 'Presentar productos y tecnologías', d: 'Demostraciones de productos, maquinaria, nuevas tecnologías y servicios.' },
  { n: 4, t: 'Sumar nuevos mercados', d: 'Internacionalización y expansión de marcas jujeñas hacia la región y el mundo.' },
  { n: 6, t: 'Atraer inversiones', d: 'Vinculación con fondos, organismos y líneas de financiamiento para proyectos productivos.' },
  { n: 7, t: 'Construir alianzas estratégicas', d: 'Cooperación para proyectos públicos y privados.' },
  { n: 8, t: 'Difundir la cultura y el turismo', d: 'La identidad jujeña como parte de la propuesta económica de la provincia.' }
];

/** Lo que pasa durante la expo, con la cifra grande de cada tarjeta (datos 2024). */
export const ACTIVIDADES = [
  { big: '330', bigl: 'reuniones · 116 empresas', t: 'Ronda de negocios', d: 'Empresas de Jujuy, Salta, Córdoba, Buenos Aires, Chile y Brasil en reuniones programadas uno a uno.', color: 'var(--tq)' },
  { big: '6', bigl: 'jornadas temáticas', t: 'Conferencias', d: 'Corredor Bioceánico, Turismo, Comercio Exterior, Financiamiento, Inteligencia Artificial y Minería. Sin costo, junto al Ministerio de Producción.', color: 'var(--vi)' },
  { big: '3', bigl: 'delegaciones', t: 'Presencia internacional', d: 'Antofagasta (Chile), Tarija (Bolivia) y el Corredor Bioceánico desde Brasil, más 10 municipios del interior jujeño.', color: 'var(--oc)' },
  { big: '30+', bigl: 'artistas en escena', t: 'Espectáculos y actividades', d: 'Folklore, cumbia, rock y fusión en el escenario central; desfiles, catas, masterclass y talleres cada día.', color: 'var(--ma)' }
];

/** Sectores que participan de la feria. El color de la marca rota en la vista. */
export const SECTORES_PARTICIPANTES = [
  'Minero', 'Servicios mineros', 'Agro y agroindustrial', 'Turismo', 'Energético',
  'Reciclaje', 'Logística y transporte', 'Financiero', 'Académico', 'Inmobiliario',
  'Artesanal', 'Vitivinicultura', 'Indumentaria', 'Tecnológico', 'Medios de comunicación'
];

/** Valores de la marca: nombre, color e ícono (path SVG de 24×24). */
export const VALORES = [
  { n: 'Innovación', color: 'var(--tq)', icon: 'M9 18h6m-5 3h4m-5.2-6.4A6 6 0 1 1 15.2 14.6c-.9.7-1.2 1.7-1.2 3.4h-4c0-1.7-.3-2.7-1.2-3.4Z' },
  { n: 'Tecnología', color: 'var(--vi)', icon: 'M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 4h6v6H9V9Z' },
  { n: 'Producción', color: 'var(--oc)', icon: 'M4 20V11h4v9m2 0V5h4v15m2 0v-7h4v7M3 20h18' },
  { n: 'Desarrollo', color: 'var(--ve)', icon: 'M12 21v-8m0 0C7 13 4 10 4 5c5 0 8 3 8 8Zm0 3c0-4 2.7-7 8-7 0 5-3 7-8 7Z' },
  { n: 'Vinculación empresarial', color: 'var(--ma)', icon: 'M8.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM14.5 5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8.2 10l2.3-3m3 0 2.3 3m-7.3 2h7' },
  { n: 'Economía del Conocimiento', color: 'var(--li)', icon: 'M9.5 4.5A3 3 0 0 0 5 7a3.2 3.2 0 0 0 .5 6.3A3.5 3.5 0 0 0 9 18h1V6.5a2 2 0 0 0-.5-2Zm5 0A3 3 0 0 1 19 7a3.2 3.2 0 0 1-.5 6.3A3.5 3.5 0 0 1 15 18h-1V6.5a2 2 0 0 1 .5-2ZM7 9h3m4 0h3m-7 5H7m7 0h3' }
];

/** Organizador de la feria. */
export const ORGANIZA = {
  logo: logoCamcomext, alt: 'Cámara de Comercio Exterior de Jujuy',
  t: 'Cámara de Comercio Exterior', sub: 'de Jujuy', href: 'https://camcomexjujuy.com.ar/'
};

/** Organismos que acompañan la edición. */
export const APOYOS = [
  { logo: logoMuniSsj, alt: 'Municipalidad de San Salvador de Jujuy', t: 'Municipalidad de', sub: 'San Salvador de Jujuy' },
  { logo: logoGobiernoJujuy, alt: 'Gobierno de Jujuy', t: 'Gobierno de Jujuy', sub: 'Con la gente' },
  { logo: logoSecTurismo, alt: 'Secretaría de Turismo, Ambiente y Deportes', t: 'Secretaría de Turismo,', sub: 'Ambiente y Deportes · Nación' }
];

/** Video de la edición anterior que encabeza la sección. */
export const VIDEO_2024 = { src: video2024, kicker: 'Así se vivió', titulo: 'ExpoJuy 2024 · 16ª edición', aria: 'Video de la edición ExpoJuy 2024' };
