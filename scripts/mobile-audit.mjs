// Auditoría mobile: emula un teléfono, recorre las 10 rutas y avisa si alguna ensancha el
// viewport (síntoma: la página se ve "alejada" y recortada en el celular) o desborda.
// Uso: npm run test:mobile [-- <url> <ancho>]   (por defecto http://127.0.0.1:4173/ y 390)
// Requiere `npm run preview` corriendo para la URL local. Recarga la página en cada ruta
// porque el viewport móvil se expande y no vuelve a encoger dentro de la misma carga.
// Ejemplos: npm run test:mobile -- http://127.0.0.1:4173/ 320
//           npm run test:mobile -- https://expojujuy.quartztechlabs.com 390
import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const [urlArg, widthArg] = process.argv.slice(2);
const url = urlArg || 'http://127.0.0.1:4173/';
const width = Number(widthArg || 390), height = 844;
const tag = 'mobile';
const routes = ['Inicio', 'Sobre', 'Expositores', 'Agenda', 'Noticias', 'Mapa', 'Sponsors', 'FAQ', 'Contacto', 'Entradas'];
const chromePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync);
if (!chromePath) { console.error('No se encontró Chrome/Edge. Indicá la ruta con CHROME_PATH.'); process.exit(1); }
const port = 9500 + Math.floor(Math.random() * 400);
const profile = join(tmpdir(), `rprobe-${process.pid}-${port}`);
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--window-size=${width},${height}`, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl; for (let i = 0; i < 60 && !wsUrl; i += 1) { try { wsUrl = (await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json())).find((e) => e.type === 'page')?.webSocketDebuggerUrl; } catch {} if (!wsUrl) await pause(250); }
const sock = new WebSocket(wsUrl); let id = 0; const pending = new Map();
const send = (m, p = {}) => new Promise((res) => { id += 1; pending.set(id, res); sock.send(JSON.stringify({ id, method: m, params: p })); });
sock.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await new Promise((r) => { sock.onopen = r; });
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });

const probe = `(() => {
  const W = ${width};
  const all = [...document.querySelectorAll('body *')].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > W + 1; });
  const set = new Set(all);
  const roots = all.filter(el => { let p = el.parentElement; while (p && p !== document.body) { if (set.has(p) && p.getBoundingClientRect().right >= el.getBoundingClientRect().right - 1) return false; p = p.parentElement; } return true; });
  return JSON.stringify({ vw: innerWidth, items: roots.slice(0, 6).map(el => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), right: Math.round(b.right), w: Math.round(b.width), minW: Math.round(el.scrollWidth), pos: cs.position, disp: cs.display, cols: cs.gridTemplateColumns !== 'none' ? cs.gridTemplateColumns.split(' ').length + ' cols' : '', aria: el.getAttribute('aria-label') || '', cls: el.className || '', style: (el.getAttribute('style') || '').slice(0, 110), text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40) }; }) });
})()`;

let failed = false;
for (const label of routes) {
  await send('Page.navigate', { url }); await pause(4500);
  await send('Runtime.evaluate', { expression: `(() => { const els=[...document.querySelectorAll('button, a, [role=button], nav *')].filter(n => n.children.length === 0 && n.textContent.trim() === ${JSON.stringify(label)}); const el = els.find(n => n.closest('.mobile-bottom-nav, .mobile-more-menu')) || els[0]; if (el) (el.closest('button') || el).click(); })()` });
  await pause(1800);
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  const d = JSON.parse(r?.result?.value || '{}');
  if (d.vw !== width) failed = true;
  console.log(`[${tag} ${width}px] ${label.padEnd(11)} viewport=${d.vw}px ${d.vw === width ? 'ok' : 'ENSANCHA'}`);
  for (const it of d.items || []) console.log(`      right=${it.right} w=${it.w} <${it.tag}> ${it.pos !== 'static' ? it.pos + ' ' : ''}${it.cols ? it.cols + ' ' : ''}${it.aria ? '[' + it.aria + '] ' : ''}${it.cls ? '.' + it.cls + ' ' : ''}style="${it.style}" "${it.text}"`);
}
chrome.kill(); await pause(300); try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(failed ? 1 : 0);
