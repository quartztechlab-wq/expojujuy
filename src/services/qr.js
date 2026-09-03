// QR de la entrada digital, generado en el cliente con la librería `qrcode` (carga diferida).
// El contenido es demostrativo: en producción el QR debe emitirse firmado por la API.

/** @type {Promise<typeof import('qrcode')>|null} */
let libPromise = null;
/** Canvas ya renderizados por contenido, para repintar sin parpadeo cuando el prototipo re-renderiza. */
const cache = new Map();

const COLOR_OSCURO = '#0A1428'; // --bg1 del sitio: el QR sigue siendo legible por cualquier lector
const COLOR_CLARO = '#FFFFFF';

/** Contenido del QR de una entrada (ficticio, sin firma). */
export const payloadEntrada = ({ nro, tier, email }) => `EXPOJUY2026|${nro}|${tier}|${email}`;

/**
 * Dibuja el QR de `texto` en `canvas`. Si ya se generó antes lo copia de inmediato;
 * si no, carga la librería bajo demanda y lo genera. Marca `data-qr="ok"` al terminar.
 * @param {HTMLCanvasElement} canvas
 * @param {string} texto
 * @param {{ size?: number }} [opts]  Tamaño en píxeles del bitmap (se escala por CSS).
 */
export async function dibujarQr(canvas, texto, { size = 360 } = {}) {
  const key = size + '|' + texto;
  const listo = cache.get(key);
  if (listo) {
    canvas.width = listo.width; canvas.height = listo.height;
    canvas.getContext('2d').drawImage(listo, 0, 0);
    canvas.dataset.qr = 'ok';
    return;
  }
  libPromise = libPromise || import('qrcode').then((m) => m.default || m);
  const QRCode = await libPromise;
  const fuente = document.createElement('canvas');
  await QRCode.toCanvas(fuente, texto, { width: size, margin: 2, errorCorrectionLevel: 'M', color: { dark: COLOR_OSCURO, light: COLOR_CLARO } });
  cache.set(key, fuente);
  if (!canvas.isConnected) return; // el prototipo ya reemplazó el canvas; el próximo ref usa la caché
  canvas.width = fuente.width; canvas.height = fuente.height;
  canvas.getContext('2d').drawImage(fuente, 0, 0);
  canvas.dataset.qr = 'ok';
}
