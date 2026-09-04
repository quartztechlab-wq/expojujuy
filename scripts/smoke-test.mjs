import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);
const chromePath = chromeCandidates.find(existsSync);

if (!chromePath) {
  console.error('No se encontró Chrome o Edge. Podés indicar su ruta con CHROME_PATH.');
  process.exit(1);
}

const port = 9300 + Math.floor(Math.random() * 500);
const profilePath = join(tmpdir(), `expojuy-chrome-smoke-${process.pid}-${port}`);
rmSync(profilePath, { recursive: true, force: true });
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  'http://127.0.0.1:4173/'
], { stdio: 'ignore' });

const pause = (ms) => new Promise((resolvePause) => setTimeout(resolvePause, ms));

async function pageSocket() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = pages.find((entry) => entry.type === 'page' && entry.url.includes('127.0.0.1:4173'));
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await pause(250);
  }
  throw new Error('Chrome no abrió el puerto de depuración.');
}

let sequence = 0;
const pending = new Map();
let socket;
let send;

try {
  socket = new WebSocket(await pageSocket());
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', rejectOpen, { once: true });
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolvePending, rejectPending } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) rejectPending(new Error(message.error.message));
      else resolvePending(message.result);
    }
  });

  send = (method, params = {}) => new Promise((resolvePending, rejectPending) => {
    const id = ++sequence;
    pending.set(id, { resolvePending, rejectPending });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await pause(1500);
  const title = await evaluate('document.title');
  const homeReady = await evaluate(`document.body.innerText.includes('Viví la expo que') && !document.querySelector('sc-if')`);
  if (title !== 'ExpoJuy 2026' || !homeReady) {
    const diagnostic = await evaluate(`({ title: document.title, text: document.body.innerText.slice(0, 180), customTags: document.querySelectorAll('sc-if').length })`);
    throw new Error(`La portada no terminó de renderizar: ${JSON.stringify(diagnostic)}`);
  }

  await evaluate(`window.__expoJuyHero = document.querySelector('section[aria-label="Portada"] img')`);
  await pause(1200);
  const stableCountdown = await evaluate(`window.__expoJuyHero === document.querySelector('section[aria-label="Portada"] img') && document.documentElement.contains(window.__expoJuyHero) && document.querySelectorAll('#expo-cd .fc-unit').length === 4`);
  if (!stableCountdown) throw new Error('La cuenta regresiva volvió a reconstruir la página.');

  const socialIconsReady = await evaluate(`Array.from(document.querySelectorAll('section[aria-label="Redes sociales"] a')).every((link) => link.href !== location.href + '#' && link.querySelector('svg path')?.getAttribute('d')?.length > 20)`);
  if (!socialIconsReady) throw new Error('Los íconos de redes sociales no se renderizaron.');

  await evaluate(`Array.from(document.querySelectorAll('nav button')).find((button) => button.textContent.trim() === 'Sobre').click()`);
  await pause(250);
  const valueIconsReady = await evaluate(`Array.from(document.querySelectorAll('h3')).find((heading) => heading.textContent.includes('valores que nos mueven'))?.nextElementSibling?.querySelectorAll('svg path').length === 6`);
  if (!valueIconsReady) throw new Error('Los íconos de valores no se renderizaron.');

  await evaluate(`Array.from(document.querySelectorAll('nav button')).find((button) => button.textContent.trim() === 'Expositores').click()`);
  await pause(250);
  const exhibitorsReady = await evaluate(`document.body.innerText.includes('Quiénes exponen') && document.body.innerText.includes('Litio Andino SA')`);
  if (!exhibitorsReady) throw new Error('La navegación a Expositores falló.');

  const filtered = await evaluate(`(() => { const input = document.querySelector('input[aria-label="Buscar expositores"]'); input.value = 'Quantum'; input.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await pause(100);
  const filterReady = filtered && await evaluate(`document.body.innerText.includes('Quantum Software Jujuy') && !document.body.innerText.includes('Litio Andino SA')`);
  if (!filterReady) throw new Error('El filtro de expositores no respondió.');

  const keyboardReady = await evaluate(`(() => { const card = document.querySelector('[role="button"][aria-label="Ver ficha del expositor"]'); const tabbable = card?.tabIndex === 0; card?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return tabbable; })()`);
  await pause(100);
  if (!keyboardReady || !await evaluate(`document.querySelector('[role="dialog"][aria-modal="true"]') === document.activeElement`)) throw new Error('La interacción por teclado o el foco del modal falló.');
  const fichaReady = await evaluate(`(() => { const t = document.querySelector('[role="dialog"][aria-modal="true"]').innerText; return t.includes('· Stand ') && !t.includes('undefined'); })()`);
  if (!fichaReady) throw new Error('La ficha del expositor no interpola "Rubro · Stand".');
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);

  if (await evaluate(`document.querySelector('button[aria-label="Cambiar tema claro/oscuro"]') !== null || document.body.hasAttribute('data-light')`)) throw new Error('El selector de tema claro todavía está presente.');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await pause(100);
  const mobileReady = await evaluate(`getComputedStyle(document.querySelector('.mobile-bottom-nav')).display === 'grid' && document.documentElement.scrollWidth <= window.innerWidth`);
  if (!mobileReady) {
    const mobileDiagnostic = await evaluate(`({ display: getComputedStyle(document.querySelector('.mobile-bottom-nav')).display, width: innerWidth, scrollWidth: document.documentElement.scrollWidth })`);
    throw new Error(`La navegación móvil o el ancho responsive falló: ${JSON.stringify(mobileDiagnostic)}`);
  }
  await evaluate(`Array.from(document.querySelectorAll('.mobile-bottom-nav button')).find((button) => button.textContent.trim() === 'Más').click()`);
  await pause(100);
  if (!await evaluate(`getComputedStyle(document.querySelector('.mobile-more-menu')).display === 'grid'`)) throw new Error('El menú móvil Más no abrió.');

  console.log('Smoke test OK: portada, navegación, filtro, accesibilidad y responsive.');
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ id: ++sequence, method: 'Browser.close', params: {} }));
    await pause(100);
    socket.close();
  }
  chrome.kill();
  await pause(300);
  try {
    rmSync(profilePath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (error) {
    console.warn(`No se pudo limpiar el perfil temporal de Chrome: ${error.code || error.message}`);
  }
}
