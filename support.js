import { DATA } from './src/data/evento.js';
import { authService } from './src/services/auth.js';
import * as qrService from './src/services/qr.js';
import * as pdfService from './src/services/itinerario-pdf.js';

// Servicios que el prototipo usa detrás de una interfaz única (ver src/services/*).
// Los pesados se cargan bajo demanda con dynamic import: Vite los separa en chunks
// propios y no penalizan el bundle inicial del sitio.
const services = {
  auth: authService,
  qr: qrService, // la librería `qrcode` se carga bajo demanda dentro del servicio
  pdf: pdfService // jsPDF + autotable se cargan bajo demanda dentro del servicio
};

(function () {
  const bootStyle = document.createElement('style');
  bootStyle.textContent = `
    x-dc { display: none; }
    .mobile-bottom-nav, .mobile-more-menu { display: none; }
    [style-hover] { transition: border-color .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease, transform .2s ease, filter .2s ease; }
    :focus-visible { outline: 3px solid color-mix(in srgb, var(--tq) 72%, white); outline-offset: 3px; }
    @media (max-width: 900px) {
      nav > div { height: auto !important; min-height: 64px; padding: 10px 16px !important; flex-wrap: wrap; }
      nav > div > div:nth-child(2) { order: 3; width: 100%; padding-bottom: 2px; }
      main { padding-top: 112px !important; }
      section > div[style*="padding:96px 48px"], section[style*="padding:96px 48px"], section > div[style*="padding:80px 48px"], section[style*="padding:80px 48px"] { padding: 64px 22px !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"], div[style*="grid-template-columns:repeat(3,1fr)"], div[style*="grid-template-columns:1.1fr .9fr"], div[style*="grid-template-columns:1fr 1fr"], div[style*="grid-template-columns:2fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 600px) {
      body { padding-bottom: calc(74px + env(safe-area-inset-bottom)); }
      nav[aria-label="Navegación principal"] > div { min-height: 64px; height: 64px !important; padding: 0 14px !important; flex-wrap: nowrap; }
      nav[aria-label="Navegación principal"] > div > div:nth-child(2) { display: none !important; }
      /* Portal de usuario: marcas data-m del handoff (oculto en mobile, menú de usuario a todo el ancho, grillas apiladas). */
      [data-m="hide"] { display: none !important; }
      [data-m="umenu"] { left: 12px !important; right: 12px !important; width: auto !important; }
      [data-m="pad"] { padding-left: 20px !important; padding-right: 20px !important; }
      [data-m="stack"] { grid-template-columns: 1fr !important; }
      nav[aria-label="Navegación principal"] > div > div:first-child > div:last-child { font-size: 16px !important; }
      main { padding-top: 64px !important; }
      .mobile-bottom-nav { position: fixed; z-index: 80; left: 0; right: 0; bottom: 0; width: 100%; max-width: 100vw; box-sizing: border-box; overflow: hidden; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); min-height: 66px; padding: 5px 8px calc(5px + env(safe-area-inset-bottom)); background: var(--navbg); border-top: 1px solid var(--l12); backdrop-filter: blur(16px); }
      .mobile-bottom-nav button { min-width: 0; max-width: 100%; overflow: hidden; padding: 0 2px; white-space: nowrap; text-overflow: ellipsis; min-height: 54px; border: 0; border-radius: 10px; background: transparent; color: var(--t3); font: 600 10.5px 'Ambit'; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
      .mobile-bottom-nav button > * { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
      .mobile-bottom-nav button[aria-current="page"], .mobile-bottom-nav button[aria-expanded="true"] { color: var(--tq); background: rgba(43,196,214,.1); }
      .mobile-bottom-nav svg { width: 19px; height: 19px; }
      .mobile-more-menu { position: fixed; z-index: 79; display: grid; left: 12px; right: 12px; bottom: calc(76px + env(safe-area-inset-bottom)); grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; background: var(--panel); border: 1px solid var(--l14); border-radius: 16px; box-shadow: 0 18px 50px rgba(0,0,0,.48); }
      .mobile-more-menu button { min-height: 46px; border: 1px solid var(--l10); border-radius: 10px; background: var(--bg2); color: var(--text); font: 600 13px 'Ambit'; text-align: left; padding: 10px 13px; }
      h1 { font-size: clamp(42px, 13vw, 64px) !important; }
      section[aria-label="Portada"] { min-height: auto !important; }
      /* Todas las grillas multicolumna pasan a una columna (incluye Mapa 1fr 320px, Entradas 1fr 380px, Noticias 1.2fr .8fr, Sobre/Contacto 1.1fr .9fr) */
      div[style*="grid-template-columns:repeat(4,1fr)"], div[style*="grid-template-columns:repeat(3,1fr)"], div[style*="grid-template-columns:repeat(2,1fr)"], div[style*="grid-template-columns:1fr 1fr"], div[style*="grid-template-columns:1.1fr .9fr"], div[style*="grid-template-columns:1.2fr .8fr"], div[style*="grid-template-columns:2fr 1fr"], div[style*="grid-template-columns:1fr 320px"], div[style*="grid-template-columns:1fr 380px"] { grid-template-columns: 1fr !important; }
      /* Cifras y sponsors Oro se ven mejor a dos columnas */
      section[aria-label="Cifras del evento"] > div, div[style*="grid-template-columns:repeat(4,1fr);gap:14px"] { grid-template-columns: 1fr 1fr !important; }
      /* Plano del predio: celdas más bajas y padding reducido para que las 12 columnas entren */
      div[style*="grid-template-columns:repeat(12,1fr)"] { grid-auto-rows: 46px !important; padding: 12px !important; gap: 6px !important; }
      div[style*="grid-template-columns:repeat(12,1fr)"] > div { padding: 6px 7px !important; }
      div[style*="position:sticky;top:88px"] { position: static !important; }
      div[style*="padding:44px 48px"], div[style*="padding:56px 48px"], div[style*="padding:72px 48px"], div[style*="padding:96px 48px"], div[style*="padding:80px 48px"], section[style*="padding:96px 48px"], section[style*="padding:72px 48px"] { padding-left: 20px !important; padding-right: 20px !important; }
      /* Cardón: queda por encima de la barra inferior, no encima de ella */
      div[style*="position:fixed;right:26px;bottom:26px"] { right: 14px !important; bottom: calc(84px + env(safe-area-inset-bottom)) !important; }
      div[style*="position:fixed;right:26px;bottom:26px"] > button { width: 56px !important; height: 56px !important; }
      div[style*="width:344px"] { width: calc(100vw - 28px) !important; max-width: 344px; height: min(480px, calc(100dvh - 190px - env(safe-area-inset-bottom))) !important; }
      /* Ficha de expositor: sin recorte en pantallas chicas */
      div[role="dialog"][aria-label="Ficha de expositor"] { max-height: calc(100dvh - 48px); overflow-y: auto; }
      footer > div { padding-left: 22px !important; padding-right: 22px !important; grid-template-columns: 1fr 1fr !important; }
      /* Ningún hijo de grilla puede imponer su ancho mínimo (inputs, selects, textos largos):
         evita que el viewport móvil se "aleje" para que entre el contenido. */
      div[style*="grid-template-columns"] > * { min-width: 0; }
      input, select, textarea { max-width: 100%; min-width: 0; box-sizing: border-box; }
      /* Palabras largas se cortan solo si no entran en la línea (no altera el ancho mínimo). */
      main { overflow-wrap: break-word; }
      /* Emails/URLs sin espacios: acá sí hace falta 'anywhere' para que la celda pueda encoger.
         No usarlo en todo main: en filas flex reduce el ancho mínimo a un carácter y aplasta
         los títulos en una columna vertical (pasó en Agenda). */
      footer, div[style*="grid-template-columns:64px 1fr"] { overflow-wrap: anywhere; }
      /* Agenda: la fila hora · título · eje · botón "Agendar" no entra en una línea. */
      div[style*="padding:20px 24px;display:flex;gap:22px;align-items:center"] { flex-wrap: wrap; gap: 12px 16px !important; padding: 18px !important; }
      div[style*="padding:20px 24px;display:flex;gap:22px;align-items:center"] > div[style*="flex:1"] { flex: 1 1 200px; min-width: 65%; }
      div[style*="padding:20px 24px;display:flex;gap:22px;align-items:center"] > button[aria-label="Agendar actividad"] { margin-left: auto; }
      /* Contacto: el panel del formulario con padding de 32px por lado no deja lugar a los campos. */
      div[style*="border-radius:18px;padding:32px;display:flex;flex-direction:column"] { padding: 22px 18px !important; }
    }
    @media (max-width: 420px) {
      /* Cifras: "45.000" a 38px no entra en media columna de 320px. */
      section[aria-label="Cifras del evento"] div[style*="font:700 38px/1 'Ambit'"] { font-size: 30px !important; }
      /* Footer a una columna: el email de contacto no se puede partir y a dos columnas fuerza 375px de ancho. */
      footer > div { grid-template-columns: 1fr !important; gap: 28px !important; }
      /* Plano del predio: en 320px las celdas son muy angostas; nombre más chico, sin subtítulo y sin partir palabras. */
      div[style*="grid-template-columns:repeat(12,1fr)"] { grid-auto-rows: 44px !important; padding: 10px !important; gap: 5px !important; }
      div[style*="grid-template-columns:repeat(12,1fr)"] > div { padding: 4px 5px !important; overflow-wrap: normal; border-radius: 9px !important; }
      div[style*="grid-template-columns:repeat(12,1fr)"] > div > div:first-child { font-size: 10.5px !important; line-height: 1.1 !important; }
      div[style*="grid-template-columns:repeat(12,1fr)"] > div > div:nth-child(2) { display: none; }
      footer { overflow-wrap: anywhere; }
    }
  `;
  document.head.appendChild(bootStyle);

  const expression = /^\s*\{\{((?:(?!\}\})[\s\S])+)\}\}\s*$/;
  const interpolation = /\{\{([\s\S]+?)\}\}/g;

  function evaluate(code, scope) {
    try {
      return Function('scope', `with (scope) { return (${code}); }`)(scope);
    } catch (error) {
      console.error(`No se pudo evaluar la expresion: ${code}`, error);
      return undefined;
    }
  }

  function boundValue(raw, scope) {
    const exact = raw.match(expression);
    if (exact) return evaluate(exact[1], scope);
    return raw.replace(interpolation, (_, code) => {
      const result = evaluate(code, scope);
      return result == null ? '' : String(result);
    });
  }

  function parseDeclarations(value) {
    return value.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
      const colon = part.indexOf(':');
      return colon < 0 ? null : [part.slice(0, colon).trim(), part.slice(colon + 1).trim()];
    }).filter(Boolean);
  }

  class DCLogic {
    constructor(props) {
      this.props = props || {};
    }

    setState(update) {
      const patch = typeof update === 'function' ? update(this.state, this.props) : update;
      this.state = { ...this.state, ...patch };
      if (this.__render) {
        const keys = Object.keys(patch || {});
        const isLiveUpdate = keys.length > 0 && keys.every((key) => key === 'now' || key === 'statP');
        if (isLiveUpdate && this.__updateLive) this.__updateLive();
        else this.__render();
        if (typeof this.componentDidUpdate === 'function') this.componentDidUpdate();
      }
    }
  }

  function propsFrom(script) {
    try {
      const schema = JSON.parse(script.dataset.props || '{}');
      return Object.fromEntries(Object.entries(schema).map(([key, config]) => [key, config.default]));
    } catch (error) {
      console.warn('No se pudieron leer las propiedades del prototipo.', error);
      return {};
    }
  }

  function compileComponent(script) {
    // El prototipo recibe la mock data centralizada como `DATA` (src/data/evento.js)
    // y los servicios (sesión, QR, PDF) como `services`.
    return Function('DCLogic', 'DATA', 'services', `${script.textContent}\nreturn Component;`)(DCLogic, DATA, services);
  }

  function start() {
    const root = document.querySelector('x-dc');
    const script = document.querySelector('script[data-dc-script]');
    if (!root || !script) return;

    const helmet = root.querySelector('helmet');
    if (helmet) {
      Array.from(helmet.childNodes).forEach((node) => document.head.appendChild(node.cloneNode(true)));
      helmet.remove();
    }

    const source = root.innerHTML;
    const Component = compileComponent(script);
    const component = new Component(propsFrom(script));
    let controlCounter = 0;

    function processNode(node, scope, refs) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes('{{')) node.textContent = boundValue(node.textContent, scope);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const tag = node.tagName.toLowerCase();
      if (tag === 'sc-if') {
        if (!boundValue(node.getAttribute('value') || '{{false}}', scope)) {
          node.remove();
          return;
        }
        const fragment = document.createDocumentFragment();
        Array.from(node.childNodes).forEach((child) => processNode(child, scope, refs));
        while (node.firstChild) fragment.appendChild(node.firstChild);
        node.replaceWith(fragment);
        return;
      }

      if (tag === 'sc-for') {
        const list = boundValue(node.getAttribute('list') || '{{[]}}', scope) || [];
        const alias = node.getAttribute('as') || 'item';
        const templates = Array.from(node.childNodes).map((child) => child.cloneNode(true));
        const fragment = document.createDocumentFragment();
        Array.from(list).forEach((item, index) => {
          const childScope = Object.assign(Object.create(scope), { [alias]: item, $index: index });
          // Los clones se procesan dentro de un fragmento para que sc-if/sc-for hijos puedan reemplazarse a sí mismos.
          const row = document.createDocumentFragment();
          templates.forEach((templateNode) => row.appendChild(templateNode.cloneNode(true)));
          Array.from(row.childNodes).forEach((child) => processNode(child, childScope, refs));
          fragment.appendChild(row);
        });
        node.replaceWith(fragment);
        return;
      }

      const attrs = Array.from(node.attributes);
      attrs.forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = boundValue(attr.value, scope);

        if (name.startsWith('on') && typeof value === 'function') {
          node.removeAttribute(attr.name);
          let eventName = name.slice(2);
          if (eventName === 'change' && (tag === 'input' || tag === 'textarea')) eventName = 'input';
          node.addEventListener(eventName, value);
          return;
        }

        if (name === 'ref' && typeof value === 'function') {
          node.removeAttribute(attr.name);
          refs.push(() => value(node));
          return;
        }

        if (name === 'style-hover') {
          node.setAttribute('style-hover', String(value || ''));
          const original = node.getAttribute('style') || '';
          node.addEventListener('mouseenter', () => parseDeclarations(String(value || '')).forEach(([property, val]) => node.style.setProperty(property, val)));
          node.addEventListener('mouseleave', () => node.setAttribute('style', original));
          return;
        }

        if (name === 'style-focus') {
          node.removeAttribute(attr.name);
          const original = node.getAttribute('style') || '';
          node.addEventListener('focus', () => parseDeclarations(String(value || '')).forEach(([property, val]) => node.style.setProperty(property, val)));
          node.addEventListener('blur', () => node.setAttribute('style', original));
          return;
        }

        if (name === 'value' && ['input', 'textarea', 'select'].includes(tag)) {
          node.value = value == null ? '' : value;
          node.setAttribute('value', value == null ? '' : String(value));
          return;
        }

        if (typeof value === 'boolean' && !name.startsWith('aria-')) {
          node.toggleAttribute(attr.name, value);
          if (attr.name in node) node[attr.name] = value;
          return;
        }

        if (value == null) node.removeAttribute(attr.name);
        else node.setAttribute(attr.name, String(value));
      });

      if (['input', 'textarea', 'select', 'button'].includes(tag)) {
        node.dataset.dcControl = String(controlCounter++);
      }
      if (node.getAttribute('role') === 'button' && !['button', 'a', 'input'].includes(tag)) {
        if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
        node.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            node.click();
          }
        });
      }
      Array.from(node.childNodes).forEach((child) => processNode(child, scope, refs));
    }

    let modalReturnKey = null; // control que abrió el modal activo; recupera el foco al cerrarlo
    component.__render = function render() {
      const active = root.contains(document.activeElement) ? document.activeElement : null;
      const focusKey = active && active.dataset.dcControl;
      const selectionStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
      const previousModal = root.querySelector('[role="dialog"][aria-modal="true"]');
      const activeInModal = !!(active && previousModal && previousModal.contains(active));
      const template = document.createElement('template');
      template.innerHTML = source;
      const refs = [];
      controlCounter = 0;
      const values = component.renderVals();
      const scope = Object.assign(Object.create(null), values);
      Array.from(template.content.childNodes).forEach((node) => processNode(node, scope, refs));
      root.replaceChildren(template.content);
      root.style.display = 'block';
      refs.forEach((callback) => callback());

      const modal = root.querySelector('[role="dialog"][aria-modal="true"]');
      if (modal && !previousModal) modalReturnKey = activeInModal ? null : focusKey;
      if (!modal && previousModal) {
        // El modal se cerró: el foco vuelve a quien lo abrió (los índices de los controles cambiaron).
        const back = modalReturnKey != null ? root.querySelector(`[data-dc-control="${modalReturnKey}"]`) : null;
        modalReturnKey = null;
        if (back) back.focus({ preventScroll: true });
        else if (activeInModal && document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
        if (back || activeInModal) return;
      }
      const next = focusKey != null ? root.querySelector(`[data-dc-control="${focusKey}"]`) : null;
      if (next && (!modal || modal.contains(next))) {
        next.focus({ preventScroll: true });
        if (selectionStart != null && typeof next.setSelectionRange === 'function') next.setSelectionRange(selectionStart, selectionStart);
        return;
      }
      if (modal) modal.focus({ preventScroll: true });
    };

    component.__updateLive = function updateLiveValues() {
      const values = component.renderVals();
      const countdown = root.querySelector('[aria-label="Cuenta regresiva al evento"]');
      if (countdown) {
        Array.from(countdown.children).forEach((card, index) => {
          // The flip clock owns the contents of `.fc-card` and updates them from
          // componentDidUpdate. Replacing its text destroys the flap markup.
          if (card.classList.contains('fc-unit')) return;
          const valueNode = card.firstElementChild;
          if (valueNode && values.cdUnits[index]) valueNode.textContent = values.cdUnits[index].v;
        });
      }

      const statsSection = root.querySelector('[aria-label="Cifras del evento"]');
      const statsGrid = statsSection && statsSection.firstElementChild;
      if (statsGrid) {
        Array.from(statsGrid.children).forEach((card, index) => {
          const valueNode = card.firstElementChild;
          if (valueNode && values.stats[index]) valueNode.textContent = values.stats[index].v;
        });
      }
    };

    component.__render();
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = root.querySelector('[role="dialog"][aria-modal="true"]');
        if (!modal) return;
        const focusables = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.disabled && el.getClientRects().length > 0);
        if (!focusables.length) { event.preventDefault(); return; }
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        return;
      }
      if (event.key !== 'Escape') return;
      if (component.state.authOpen) component.closeAuth();
      else if (component.state.expoSel) component.setState({ expoSel: null });
      else if (component.state.userMenu) component.setState({ userMenu: false });
      else if (component.state.mobileMore) component.setState({ mobileMore: false });
      else if (component.state.chatOpen) component.setState({ chatOpen: false });
    });
    if (typeof component.componentDidMount === 'function') component.componentDidMount();
    window.addEventListener('beforeunload', () => {
      if (typeof component.componentWillUnmount === 'function') component.componentWillUnmount();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
