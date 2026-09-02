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
      nav[aria-label="Navegación principal"] > div > div:nth-child(2), nav[aria-label="Navegación principal"] > div > button:last-child { display: none !important; }
      nav[aria-label="Navegación principal"] > div > div:first-child > div:last-child { font-size: 16px !important; }
      main { padding-top: 64px !important; }
      .mobile-bottom-nav { position: fixed; z-index: 80; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: repeat(5, 1fr); min-height: 66px; padding: 5px 8px calc(5px + env(safe-area-inset-bottom)); background: var(--navbg); border-top: 1px solid var(--l12); backdrop-filter: blur(16px); }
      .mobile-bottom-nav button { min-width: 0; min-height: 54px; border: 0; border-radius: 10px; background: transparent; color: var(--t3); font: 600 10.5px 'Ambit'; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
      .mobile-bottom-nav button[aria-current="page"], .mobile-bottom-nav button[aria-expanded="true"] { color: var(--tq); background: rgba(43,196,214,.1); }
      .mobile-bottom-nav svg { width: 19px; height: 19px; }
      .mobile-more-menu { position: fixed; z-index: 79; display: grid; left: 12px; right: 12px; bottom: calc(76px + env(safe-area-inset-bottom)); grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; background: var(--panel); border: 1px solid var(--l14); border-radius: 16px; box-shadow: 0 18px 50px rgba(0,0,0,.48); }
      .mobile-more-menu button { min-height: 46px; border: 1px solid var(--l10); border-radius: 10px; background: var(--bg2); color: var(--text); font: 600 13px 'Ambit'; text-align: left; padding: 10px 13px; }
      h1 { font-size: clamp(42px, 13vw, 64px) !important; }
      div[style*="grid-template-columns:repeat(4,1fr)"], div[style*="grid-template-columns:repeat(3,1fr)"], div[style*="grid-template-columns:repeat(2,1fr)"], div[style*="grid-template-columns:1fr 1fr"], div[style*="grid-template-columns:1.1fr .9fr"], div[style*="grid-template-columns:2fr 1fr"] { grid-template-columns: 1fr !important; }
      div[style*="padding:44px 48px"] { padding: 34px 22px !important; }
      div[style*="width:344px"] { width: min(344px, calc(100vw - 24px)) !important; right: 12px !important; }
      footer > div { padding-left: 22px !important; padding-right: 22px !important; }
    }
  `;
  document.head.appendChild(bootStyle);

  const expression = /^\s*\{\{([\s\S]+)\}\}\s*$/;
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
    return Function('DCLogic', `${script.textContent}\nreturn Component;`)(DCLogic);
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
        Array.from(node.childNodes).forEach((child) => {
          processNode(child, scope, refs);
          if (child.parentNode === node) fragment.appendChild(child);
        });
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
          templates.forEach((templateNode) => {
            const child = templateNode.cloneNode(true);
            processNode(child, childScope, refs);
            if (child.parentNode == null) fragment.appendChild(child);
          });
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

    component.__render = function render() {
      const active = root.contains(document.activeElement) ? document.activeElement : null;
      const focusKey = active && active.dataset.dcControl;
      const selectionStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
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
      if (modal) {
        modal.focus({ preventScroll: true });
        return;
      }

      if (focusKey != null) {
        const next = root.querySelector(`[data-dc-control="${focusKey}"]`);
        if (next) {
          next.focus({ preventScroll: true });
          if (selectionStart != null && typeof next.setSelectionRange === 'function') next.setSelectionRange(selectionStart, selectionStart);
        }
      }
    };

    component.__updateLive = function updateLiveValues() {
      const values = component.renderVals();
      const countdown = root.querySelector('[aria-label="Cuenta regresiva al evento"]');
      if (countdown) {
        Array.from(countdown.children).forEach((card, index) => {
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
      if (event.key !== 'Escape') return;
      if (component.state.expoSel) component.setState({ expoSel: null });
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
