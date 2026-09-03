// E2E del Portal de Usuario contra `vite preview` (http://127.0.0.1:4173).
// Cubre: registro/login simulados, persistencia, agendado desde la Agenda, Mi Agenda con
// superposiciones, Mi Entrada con QR, Mi Perfil y la generación del PDF del itinerario.
// Con SHOTS_DIR=<carpeta> guarda capturas de cada paso.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, pause } from './cdp.mjs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173/';
const SHOTS = process.env.SHOTS_DIR || '';
const shot = (page, name) => (SHOTS ? page.screenshot(join(SHOTS, name + '.png')) : Promise.resolve());
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
const clickText = (text, scope = 'button, [role="button"], [role="tab"], [role="menuitem"]') =>
  `(() => { const el = Array.from(document.querySelectorAll(${JSON.stringify(scope)})).find((n) => n.textContent.trim() === ${JSON.stringify(text)}); if (!el) throw new Error('No hay control con texto ' + ${JSON.stringify(text)}); el.click(); return true; })()`;
const type = (sel, value) => `(() => { const el = ${q(sel)}; if (!el) throw new Error('No existe ' + ${JSON.stringify(sel)}); el.focus(); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`;
const text = () => 'document.body.innerText';

const page = await launch(BASE);
try {
  await page.evaluate('localStorage.clear()');
  await page.send('Page.navigate', { url: BASE });
  await pause(1200);
  assert(await page.evaluate(`${text()}.includes('Viví la expo que') && !document.querySelector('sc-if')`), 'La portada no renderizó.');

  // --- Header sin sesión y modal de auth ---
  assert(await page.evaluate(clickText('Ingresar')), 'No hay botón Ingresar en el header.');
  await pause(150);
  assert(await page.evaluate(`${q('[role="dialog"][aria-modal="true"]')} === document.activeElement`), 'El modal de auth no recibió el foco.');
  await shot(page, '01-modal-login');
  await page.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await pause(100);
  assert(await page.evaluate(`${q('[role="dialog"]')} === null`), 'Escape no cerró el modal de auth.');

  // --- Registro: validación, foco estable al tipear, intereses ---
  await page.evaluate(clickText('Ingresar'));
  await pause(100);
  await page.evaluate(clickText('Registrarme', '[role="tab"]'));
  await pause(100);
  await page.evaluate(clickText('Crear cuenta'));
  await pause(100);
  assert(await page.evaluate(`${q('[role="dialog"] [role="alert"]')} !== null && ${q('input[aria-invalid="true"]')} !== null`), 'La validación del registro no marcó errores.');
  await page.evaluate(type('input[autocomplete="name"]', 'Valentina Quispe'));
  await pause(60);
  assert(await page.evaluate(`document.activeElement === ${q('input[autocomplete="name"]')} && document.activeElement.value === 'Valentina Quispe'`), 'El foco se perdió al escribir dentro del modal.');
  await page.evaluate(type('input[type="email"]', 'valentina@datapuna.com.ar'));
  await page.evaluate(type('input[type="password"]', 'secreto1'));
  await page.evaluate(clickText('Innovación', '[role="dialog"] button'));
  await pause(60);
  await shot(page, '02-modal-registro');
  await page.evaluate(clickText('Crear cuenta'));
  await pause(120);
  assert(await page.evaluate(`${q('[role="dialog"] button[aria-busy="true"]')} !== null`), 'El botón no mostró el estado de carga.');
  await pause(1100);
  assert(await page.evaluate(`${q('[role="dialog"]')} === null && ${text()}.toUpperCase().includes('MI PORTAL') && ${text()}.includes('Valentina Quispe')`), 'El registro no abrió el portal.');
  assert(await page.evaluate(`${q('button[aria-label="Abrir menú de usuario"]')}?.textContent.includes('VQ')`), 'El chip de usuario no muestra las iniciales.');
  assert(await page.evaluate(`JSON.parse(localStorage.getItem('expojuy2026.portal')).intereses['Innovación'] === true`), 'Los intereses del registro no se persistieron.');
  await shot(page, '03-portal-vacio');

  // --- Menú de usuario ---
  await page.evaluate(`${q('button[aria-label="Abrir menú de usuario"]')}.click()`);
  await pause(100);
  assert(await page.evaluate(`${q('[role="menu"]')} !== null && ${q('[role="menu"]')}.innerText.includes('Pendiente')`), 'El menú de usuario no abrió o no muestra el estado de la entrada.');
  await shot(page, '04-menu-usuario');
  await page.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await pause(60);
  assert(await page.evaluate(`${q('[role="menu"]')} === null`), 'Escape no cerró el menú de usuario.');

  // --- Persistencia: recargar mantiene la sesión ---
  await page.send('Page.navigate', { url: BASE });
  await pause(1200);
  assert(await page.evaluate(`${q('button[aria-label="Abrir menú de usuario"]')} !== null`), 'La sesión no sobrevivió a la recarga.');

  // --- Agendar desde la Agenda (con sesión) y ver Mi Agenda ---
  await page.evaluate(clickText('Agenda', 'nav[aria-label="Navegación principal"] button'));
  await pause(120);
  const agendar = (i) => `(() => { const b = document.querySelectorAll('button[aria-pressed][aria-label="Agendar actividad"]')[${i}]; b.click(); return b.textContent.trim(); })()`;
  await page.evaluate(agendar(0)); await pause(80);   // 09:30 apertura
  await page.evaluate(agendar(0)); await pause(80);   // 11:00 (el índice 0 ahora es el siguiente no agendado)
  await page.evaluate(agendar(0)); await pause(80);   // 11:30 proveedores (se superpone con 11:00)
  assert(await page.evaluate(`document.querySelectorAll('button[aria-pressed="true"][aria-label="Quitar de mi agenda"]').length === 3`), 'No se agendaron 3 actividades desde la Agenda.');
  assert(await page.evaluate(`${q('button[aria-label="Abrir menú de usuario"] span[aria-label="Actividades agendadas"]')}?.textContent === '3'`), 'El badge del header no cuenta las actividades.');
  await shot(page, '05-agenda-agendado');
  await page.evaluate(`${q('button[aria-label="Abrir menú de usuario"]')}.click()`); await pause(80);
  await page.evaluate(clickText('Mi Agenda', '[role="menuitem"] span')); await pause(150);
  const miAgenda = await page.evaluate(text());
  assert(miAgenda.includes('Mi cronograma') && miAgenda.includes('3 actividades en 1 día'), 'Mi Agenda no lista el cronograma.');
  assert(miAgenda.includes('Se superpone con') && await page.evaluate(`${q('#portal-agenda [role="status"]')} !== null`), 'No se detectó la superposición 11:00/11:30.');
  assert(await page.evaluate(`Array.from(document.querySelectorAll('#portal-agenda [style*="font:700 19px"]')).map((n) => n.textContent).join(',') === '09:30,11:00,11:30'`), 'Mi Agenda no ordena por horario.');
  await shot(page, '06-mi-agenda');
  await page.evaluate(`document.querySelector('#portal-agenda button[aria-label*="Proveedores locales"]').click()`); await pause(100);
  assert(await page.evaluate(`!${text()}.includes('Se superpone con') && ${text()}.includes('2 actividades en 1 día')`), 'Quitar no eliminó la actividad ni la superposición.');

  // --- Mi Entrada: vacío → obtener desde Entradas → QR real ---
  await page.evaluate(clickText('Mi Entrada', '[role="tab"]')); await pause(100);
  assert(await page.evaluate(`${text()}.includes('Todavía no tenés tu entrada')`), 'Mi Entrada no muestra el estado vacío.');
  await shot(page, '07-mi-entrada-vacia');
  await page.evaluate(clickText('Obtener mi entrada')); await pause(120);
  assert(await page.evaluate(`${text()}.includes('Tu pase a ExpoJuy 2026') && ${text()}.includes('Valentina Quispe') && ${text()}.includes('Obtener mi QR')`), 'Entradas no muestra el titular ni el CTA con sesión.');
  await page.evaluate(clickText('Pase Full', '[role="button"][aria-pressed] div')); await pause(80);
  await page.evaluate(clickText('Obtener mi QR')); await pause(150);
  const entrada = await page.evaluate(text());
  assert(entrada.toUpperCase().includes('ACTIVA') && entrada.includes('Pase Full') && /Nº\s*\d{6}/.test(entrada), 'Mi Entrada no muestra la entrada activa.');
  for (let i = 0; i < 40 && !(await page.evaluate(`${q('#portal-entrada canvas')}?.dataset.qr === 'ok'`)); i += 1) await pause(250);
  assert(await page.evaluate(`${q('#portal-entrada canvas')}?.dataset.qr === 'ok' && ${q('#portal-entrada canvas')}.width >= 180`), 'El QR real no se renderizó en Mi Entrada.');
  assert(await page.evaluate(`JSON.parse(localStorage.getItem('expojuy2026.portal')).ticket.tier === 1`), 'La entrada no se persistió.');
  await shot(page, '08-mi-entrada');

  // --- Mi Perfil: validación, guardado, intereses compartidos ---
  await page.evaluate(clickText('Mi Perfil', '[role="tab"]')); await pause(100);
  await page.evaluate(type('#portal-perfil input[type="email"]', 'no-es-un-email'));
  await page.evaluate(clickText('Guardar cambios')); await pause(80);
  assert(await page.evaluate(`${q('#portal-perfil [role="alert"]')} !== null`), 'El perfil no validó el email.');
  await page.evaluate(type('#portal-perfil input[type="email"]', 'vale@datapuna.com.ar'));
  await page.evaluate(type('#portal-perfil input:not([type="email"])', 'Valentina Q. Puna'));
  await page.evaluate(clickText('Guardar cambios')); await pause(80);
  assert(await page.evaluate(`${text()}.includes('Perfil actualizado') && ${q('button[aria-label="Abrir menú de usuario"]')}.textContent.includes('Valentina') && JSON.parse(localStorage.getItem('expojuy2026.portal')).user.email === 'vale@datapuna.com.ar'`), 'El perfil no se guardó.');
  await page.evaluate(clickText('Producción', '#portal-perfil button[aria-pressed]')); await pause(80);
  assert(await page.evaluate(`JSON.parse(localStorage.getItem('expojuy2026.portal')).intereses['Producción'] === true`), 'Los intereses del perfil no se comparten con el recomendador.');
  await shot(page, '09-mi-perfil');

  // --- PDF del itinerario (jsPDF por dynamic import) ---
  await page.evaluate(`${q('[role="tab"][aria-controls="portal-agenda"]')}.click()`); await pause(100);
  // jsPDF guarda vía FileSaver (URL.createObjectURL + <a download>): interceptamos el blob para verificarlo.
  await page.evaluate(`window.__pdfSaves = []; const origCreate = URL.createObjectURL.bind(URL); URL.createObjectURL = (b) => { if (b && b.type === 'application/pdf') { window.__pdfSaves.push(b.size); const fr = new FileReader(); fr.onload = () => { window.__pdfB64 = fr.result.split(',')[1]; }; fr.readAsDataURL(b); } return origCreate(b); };`);
  await page.evaluate(clickText('Descargar mi itinerario (PDF)'));
  for (let i = 0; i < 60 && !(await page.evaluate('window.__pdfSaves.length > 0 && !!window.__pdfB64')); i += 1) await pause(250);
  assert(await page.evaluate(`window.__pdfSaves[0] > 5000 && window.__pdfB64.startsWith('JVBER')`), 'No se disparó la descarga del PDF.');
  if (SHOTS) writeFileSync(join(SHOTS, 'itinerario.pdf'), Buffer.from(await page.evaluate('window.__pdfB64'), 'base64'));
  assert(await page.evaluate(`!${text()}.includes('Generando') && ${q('#portal-agenda [role="alert"]')} === null`), 'El estado del botón de PDF no volvió a la normalidad.');

  // --- Cerrar sesión y volver a ingresar validando contra el storage ---
  await page.evaluate(`${q('[role="tab"][aria-controls="portal-perfil"]')}.click()`); await pause(100);
  await page.evaluate(clickText('Cerrar sesión', '#portal-perfil button')); await pause(100);
  assert(await page.evaluate(`localStorage.getItem('expojuy2026.portal') === null && ${text()}.includes('Viví la expo que') && ${q('button[aria-label="Abrir menú de usuario"]')} === null`), 'Cerrar sesión no limpió la sesión.');

  // --- Sin sesión: Agendar abre el registro y, al completarlo, agenda la actividad ---
  await page.evaluate(clickText('Agenda', 'nav[aria-label="Navegación principal"] button')); await pause(100);
  await page.evaluate(`document.querySelector('button[aria-label="Registrate para agendar esta actividad"]').click()`); await pause(100);
  assert(await page.evaluate(`${q('[role="dialog"]')}?.getAttribute('aria-label') === 'Creá tu cuenta'`), 'Agendar sin sesión no abrió el registro.');
  await page.evaluate(clickText('Ingresar', '[role="tab"]')); await pause(60);
  await page.evaluate(type('input[type="email"]', 'nadie@example.com'));
  await page.evaluate(type('input[type="password"]', 'secreto1'));
  await page.evaluate(clickText('Ingresar', '[role="dialog"] button:not([role="tab"])')); await pause(1000);
  assert(await page.evaluate(`${q('[role="dialog"] [role="alert"]')}?.textContent.includes('No encontramos una cuenta')`), 'Login con email desconocido no mostró error.');
  await page.evaluate(type('input[type="email"]', 'demo@expojuy.com'));
  await page.evaluate(clickText('Ingresar', '[role="dialog"] button:not([role="tab"])')); await pause(1000);
  assert(await page.evaluate(`${q('[role="dialog"]')} === null && ${q('button[aria-label="Abrir menú de usuario"]')}?.textContent.includes('Visitante') && document.querySelectorAll('button[aria-pressed="true"][aria-label="Quitar de mi agenda"]').length === 1`), 'El login demo no agendó la actividad pendiente.');

  // --- Mobile: el portal no ensancha el viewport y "Más" ofrece Mi portal ---
  await page.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await pause(100);
  await page.evaluate(clickText('Más', '.mobile-bottom-nav button')); await pause(80);
  await page.evaluate(clickText('Mi portal', '.mobile-more-menu button')); await pause(150);
  for (const tab of ['agenda', 'entrada', 'perfil']) {
    await page.evaluate(`${q('[role="tab"][aria-controls="portal-' + tab + '"]')}.click()`); await pause(100);
    assert(await page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), `El portal (${tab}) desborda el viewport móvil.`);
    await shot(page, '10-mobile-' + tab);
  }
  await page.evaluate(clickText('Cerrar sesión', '#portal-perfil button')); await pause(100);
  await page.evaluate(clickText('Más', '.mobile-bottom-nav button')); await pause(80);
  await page.evaluate(clickText('Ingresar / Registrarme', '.mobile-more-menu button')); await pause(100);
  assert(await page.evaluate(`${q('[role="dialog"][aria-modal="true"]')} !== null && document.documentElement.scrollWidth <= window.innerWidth`), 'Ingresar desde "Más" no abrió el modal en mobile.');
  await shot(page, '11-mobile-modal');

  console.log('Portal test OK: auth, persistencia, Mi Agenda + PDF, Mi Entrada + QR, Mi Perfil, integraciones y mobile.');
} finally {
  await page.close();
}
