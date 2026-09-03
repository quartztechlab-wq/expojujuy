// Helper mínimo de Chrome DevTools Protocol compartido por los tests E2E (sin dependencias).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean);

export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Abre Chrome headless en `url` y devuelve { evaluate, send, screenshot, close }.
 * @param {string} url
 * @param {{ width?: number, height?: number, mobile?: boolean }} [opts]
 */
export async function launch(url, opts = {}) {
  const chromePath = chromeCandidates.find(existsSync);
  if (!chromePath) throw new Error('No se encontró Chrome o Edge. Podés indicar su ruta con CHROME_PATH.');
  const port = 9300 + Math.floor(Math.random() * 500);
  const profilePath = join(tmpdir(), `expojuy-chrome-e2e-${process.pid}-${port}`);
  rmSync(profilePath, { recursive: true, force: true });
  const chrome = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    `--window-size=${opts.width || 1366},${opts.height || 900}`, `--remote-debugging-port=${port}`, `--user-data-dir=${profilePath}`, url
  ], { stdio: 'ignore' });

  let wsUrl;
  for (let attempt = 0; attempt < 60 && !wsUrl; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json());
      const page = pages.find((p) => p.type === 'page' && p.url.startsWith(url.slice(0, 22)));
      if (page) wsUrl = page.webSocketDebuggerUrl;
    } catch {}
    if (!wsUrl) await pause(250);
  }
  if (!wsUrl) { chrome.kill(); throw new Error('Chrome no abrió el puerto de depuración.'); }

  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const screenshot = async (file) => {
    if (!file) return;
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, Buffer.from(data, 'base64'));
  };
  const close = async () => {
    try { socket.send(JSON.stringify({ id: ++sequence, method: 'Browser.close', params: {} })); await pause(100); socket.close(); } catch {}
    chrome.kill();
    await pause(300);
    rmSync(profilePath, { recursive: true, force: true });
  };

  await send('Page.enable');
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await evaluate(`location.href.startsWith(${JSON.stringify(url)}) && document.readyState === 'complete'`).catch(() => false);
    if (ready) break;
    await pause(250);
  }
  if (opts.mobile) await send('Emulation.setDeviceMetricsOverride', { width: opts.width || 390, height: opts.height || 844, deviceScaleFactor: 2, mobile: true });
  return { send, evaluate, screenshot, close };
}
