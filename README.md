# Handoff: Sitio Web ExpoJuy 2026

> Estado actual: prototipo frontend funcional y navegable preparado para ejecución local, con **Portal de Usuario** (sesión simulada, Mi Agenda con itinerario en PDF, Mi Entrada con QR y Mi Perfil). Esta entrega no incluye backend, base de datos, pasarela de pagos ni servicios externos.

## Handoffs aplicados
| Versión | Qué trajo |
|---|---|
| v3 | **Portal de Usuario** (sesión simulada, Mi Agenda + PDF, Mi Entrada + QR, Mi Perfil) — detalle abajo. |
| v4 | **Fondo fotográfico global** (`bg-mountains.jpg` + tokens translúcidos) y **Entradas** rehecha (tabs de tier, descuento grupal, credencial, FAQ). |
| v5 | **Sponsors** con spotlight Diamante rotativo y logos reales, y la franja "Nos acompañan" del Inicio. |
| v6 | **Contacto** con canales reales, motivo por chips, ilustración del predio y áreas desplegables (se quitó Leaflet). |
| v7 | **Mapa del predio**: plano ilustrativo SVG con stands clickeables, buscador, filtro por rubro y zoom; `src/data/predio.js`; hash routing. |
| v8 | **Sobre** rehecha: video de ExpoJuy 2024, perfil de la feria, los 13 objetivos del informe, actividades, sectores participantes, logos institucionales y doble CTA; `src/data/sobre.js`. |

El hero fotográfico y la navbar vienen de commits del equipo, no de un handoff. El modo claro que describen los handoffs **no** se implementó a propósito: el sitio tiene un único tema oscuro.

## Portal de Usuario (handoff v3, 2026-09-03)
Implementado según `design_handoff_expojuy_2026/PORTAL-USUARIO.md` sobre el stack actual del repo (Vite + runtime `.dc.html` propio). Sin backend: todo vive en el cliente.

- **Sesión simulada**: registro / ingreso desde el header (`Ingresar`) o desde "Más" en mobile. Los datos se guardan en `localStorage` (`expojuy2026.portal`) con la contraseña como hash SHA-256; `demo@…` ingresa sin registro. Con sesión, el header muestra el chip con iniciales, el conteo de actividades y el menú Mi Agenda / Mi Entrada / Mi Perfil / Cerrar sesión.
- **Mi Agenda**: "Agendar" en la Agenda escribe en la sesión (sin sesión abre el registro y agenda al terminar). El cronograma se agrupa por día y hora, estima 90 min por actividad, marca superposiciones (mismo día, inicios a menos de 90 min) y permite quitar actividades. **Descargar mi itinerario (PDF)** genera el documento en el cliente con jsPDF + autotable (carga diferida) siguiendo la plantilla del handoff.
- **Mi Entrada**: el CTA de Entradas crea la entrada (tipo + número) y muestra la tarjeta con un QR real (`qrcode`, carga diferida) con datos ficticios del titular, más tarjetas de Predio y Pase.
- **Mi Perfil**: nombre y email con validación, intereses compartidos con el recomendador de la Agenda ("Para vos") y cierre de sesión.
- **Accesibilidad**: modal `role=dialog` con `aria-modal`, foco inicial, Tab atrapado y Escape; tabs `role=tablist`/`aria-controls`; errores `role=alert`; avisos `role=status`; `aria-pressed`/`aria-busy`; targets ≥ 44 px en mobile; `prefers-reduced-motion` respetado por el sitio.
- **Tweak**: la prop `sesionDemo` del prototipo precarga una sesión con agenda, intereses y entrada.

### Estructura del código
- `index.html` — el sitio: markup en `<x-dc>` y lógica (clase `Component`) en el `<script data-dc-script>`. Es la versión que se compila y despliega.
- `support.js` — runtime propio del prototipo (renderiza `sc-if`/`sc-for`/`{{ }}`, foco y accesibilidad, CSS mobile) e inyección de `DATA` y `services` en `Component`.
- `src/data/evento.js` — **mock data centralizada y tipada (JSDoc)**: `DIAS`, `RUBROS`, `EJES`, `EXPOSITORES`, `AGENDA`, `NOTICIAS`, `FAQS`, `TIPOS_ENTRADA`, `SPONSORS`, `PREDIO`. Buscador, mapa, agenda, recomendador, entradas y portal consumen esta única fuente; la API real reemplaza este módulo.
- `src/data/sobre.js` — **contenido de la sección Sobre**: perfil de la feria, cifras 2024, los 13 objetivos del informe, actividades, sectores participantes, valores, logos de organizador y apoyos, y el video. Los logos y el video se **importan** para que Vite los emita.
- `src/data/predio.js` — **plano del predio**: `PLANO` (viewBox 1000×700), `SECTORES` (14, con `shape` y color), `STANDS` (34 descubiertos, con m² y coordenadas), `STANDS_GASTRO` (12), `SECTOR_POR_LETRA`, `METRICAS_PREDIO` y `LEYENDA`. Reexportado dentro de `DATA`; pensado para venir del CMS con el plano de cada año.
- `src/services/auth.js` — servicio único de sesión (`cargar`, `registrar`, `ingresar`, `guardar`, `cerrar`) con interfaz de Promises lista para apuntar a Spring Boot sin tocar la UI.
- `src/services/qr.js` — QR de la entrada (`qrcode`, dynamic import, caché).
- `src/services/itinerario-pdf.js` — PDF del itinerario (jsPDF + jspdf-autotable, dynamic import).
- `scripts/` — tests E2E sin dependencias sobre Chrome headless: `smoke-test.mjs`, `mobile-audit.mjs`, `portal-test.mjs` (helper `cdp.mjs`).

## Overview
Propuesta conceptual y visual del sitio web oficial de **ExpoJuy 2026** (Desafío Digital ExpoJuy 2026, Cámara de Comercio Exterior de Jujuy), diseñada por **Quartz Tech Labs**. Incluye el sitio desktop navegable completo (10 secciones + entradas con QR + asistente IA "Cardón") y 6 pantallas mobile clave.

Concepto: **"Jujuy, tierra de innovación"** — dark mode tecnológico (tema único, sin modo claro) con acentos cromáticos de la Quebrada de Humahuaca, integrando la identidad oficial del evento (logo, tipografía Ambit, paleta turquesa/violeta/lila).

## About the Design Files
Los archivos de este paquete son **referencias de diseño creadas en HTML** (Design Components): prototipos que muestran el aspecto y comportamiento previstos, **no código de producción para copiar directamente**. La tarea es **recrear estos diseños en el stack objetivo del proyecto**:

- **Frontend:** Next.js (App Router, React Server Components, SSG/ISR)
- **Estilos:** Tailwind CSS (mapear los tokens de abajo a `tailwind.config`)
- **Animaciones:** Framer Motion / GSAP + micro-interacciones CSS
- **Backend previsto:** Spring Boot + Gradle (API REST: expositores, agenda, noticias, entradas, panel admin)
- **Extras:** PWA con modo offline (crítico para el QR de entrada dentro del predio), mapa interactivo (SVG propio; escalable a Mapbox/Leaflet)

> **Ojo:** ese es el stack *objetivo* que plantean los handoffs. **Este repo no es Next.js**: es `index.html` (markup `<x-dc>` + clase `Component`) sobre `support.js`, un runtime propio, empaquetado con Vite. Los `.dc.html` que quedan en la raíz son solo referencia de diseño.

## Fidelity
**High-fidelity (hifi).** Colores, tipografía, espaciado, copy e interacciones son finales. Las fechas, cifras, empresas y patrocinadores utilizados en el prototipo deberán validarse con la organización antes de una publicación oficial.

## Files
- `ExpoJuy 2026.dc.html` — sitio desktop completo (fuente de verdad de layout y lógica). El markup vive dentro de `<x-dc>`; la lógica (estado, filtros, chatbot, validación) en la clase `Component` al final del archivo.
- `ExpoJuy 2026 Mobile.dc.html` — 6 pantallas mobile en marcos de iPhone.
- `ios-frame.jsx` — marco de dispositivo usado solo para presentación (no implementar).
- `assets/fonts/Ambit-{Light,Regular,SemiBold,Bold}.otf` — tipografía oficial del kit.
- `assets/expojuy-logo.png`, `assets/logo-camcomext.png` — logos oficiales (usar sobre chips blancos: no funcionan sobre fondo oscuro).
- `assets/hero-expo.jpg` — foto del hero (reemplazó al video del handoff): `opacity .72`, `saturate(1.1) brightness(.8)`, `kenBurns` 22s y parallax `scrollY*0.22`.
- `assets/bg-mountains.jpg` — fondo fotográfico global (montañas nocturnas) en una capa fija `body::before` bajo el velo de `--pageveil`.
- `assets/expojuy-2024.mp4` — video aéreo de la edición 2024 que encabeza Sobre (11,8 MB, silenciado y en loop).
- `assets/sponsors/*.png` — logos reales de Diamante y de los organismos que acompañan (Sobre reusa los de Municipalidad y Secretaría de Turismo, y suma `assets/logo-gobierno-jujuy.png`); `assets/expojuy-mark.png` — monograma EJ del pin de Contacto. Los assets referenciados desde datos se **importan** en `src/data/evento.js`: Vite no copia a `dist/` las imágenes cuyo `src` es un binding.

### Screenshots
`screenshots/01–06-desktop.png` (Inicio, Expositores, Agenda, Mapa, Entradas, chat Cardón) y `07-mobile.png` — referencia visual. **Son capturas de v3**: el hero fotográfico y las secciones Entradas (v4), Sponsors (v5), Contacto (v6) y Mapa (v7) se rehicieron después; para verlas, correr el sitio.

## Tema visual
El sitio utiliza exclusivamente un **tema oscuro**, elegido para reforzar el carácter tecnológico de la propuesta y destacar los acentos cromáticos inspirados en Jujuy. Los tokens de `:root` constituyen la paleta única de la interfaz.

## Design Tokens
Los valores de abajo corresponden al tema único definido en `:root`.

### Colores
| Token | Valor | Uso |
|---|---|---|
| `bg-base` | `#05070D` | Fondo global |
| `bg-deep` | `#0A1428` | Gradiente de fondos hero |
| `bg-alt` | `rgba(7,11,22,.55)` | Franjas alternadas de sección (translúcido sobre el fondo fotográfico) |
| `panel` | `rgba(13,20,40,.78)` | Tarjetas y paneles |
| `page-bg` | `url(assets/bg-mountains.jpg)` | Fondo global fijo, `cover`, `center top` |
| `page-veil` | `linear-gradient(180deg,rgba(5,7,13,.55),rgba(5,7,13,.72))` | Velo sobre la foto (legibilidad) |
| `line` | `rgba(255,255,255,.08)` | Bordes (.06–.14 según jerarquía) |
| `text` | `#EEF0F8` | Texto principal |
| `text-2` | `#98A0B8` | Texto secundario |
| `text-3` | `#6A7390` | Texto terciario/metadatos |
| `brand-turquesa` | `#2BC4D6` | Acento primario, links, eyebrows |
| `brand-violeta` | `#7857F5` | Acento primario 2, CTAs |
| `brand-purpura` | `#8A00CE` | Monograma |
| `brand-lila` | `#C7A4F8` | Acentos suaves, tags "Para vos" |
| `q-ocre` | `#E09A45` | Quebrada: Minería / tier Oro |
| `q-magenta` | `#D4548F` | Quebrada: Turismo / Vinculación |
| `q-verde` | `#3FB380` | Quebrada: Agro / Cardón (asistente) |
| `q-terracota` | `#C06038` | Quebrada: Manufactura |

Gradientes:
- CTA primario: `linear-gradient(90deg,#2BC4D6,#7857F5)`
- Título hero: `linear-gradient(90deg,#2BC4D6 0%,#7857F5 45%,#D4548F 75%,#E09A45 100%)` con `background-clip:text`
- "Línea de energía" (divisor de 2px bajo hero y sobre footer): `linear-gradient(90deg,#2BC4D6,#3FB380,#E09A45,#D4548F,#7857F5,#C7A4F8)`
- Cardón (verde): `linear-gradient(120deg,#3FB380,#2BC4D6)`

Colores por rubro de expositor: Minería `#E09A45`, Energía `#F2C14E`, Tecnología `#2BC4D6`, Agroindustria `#3FB380`, Turismo `#D4548F`, Comercio Exterior `#7857F5`, Economía del Conocimiento `#C7A4F8`, Manufactura `#C06038`.
Colores por eje de agenda: Innovación `#2BC4D6`, Producción `#E09A45`, Vinculación `#D4548F`, Economía del Conocimiento `#C7A4F8`.

### Tipografía
Familia única: **Ambit** (kit oficial; pesos 300/400/600/700). Fallback `system-ui, sans-serif`.
- H1 hero: 700, `clamp(48px,6.4vw,84px)`, line-height 1.02, letter-spacing -0.025em
- H2 sección: 700 42–46px / 1.08, letter-spacing -0.02em
- H3: 700 26px
- Eyebrow: 600 11px, letter-spacing 0.24em, uppercase, color turquesa
- Cuerpo: 300–400 15–20px / 1.5–1.7
- Metadatos: 400 12–13.5px, `text-3`
- Nav links: 600 13px; botones: 700 14–16px

### Espaciado y forma
- Contenedores: max-width 1240px (1080 en Agenda/Sponsors, 840 en FAQ), padding lateral 48px
- Padding vertical de sección: 80–96px
- Radios: botones 9–11px, chips/pills 16–20px, tarjetas 14–18px, paneles grandes 20px
- Gaps de grillas: 14–28px
- Sombra/glow hover CTA: `box-shadow: 0 0 24px rgba(120,87,245,.55)`

## Screens / Views (desktop)
SPA con router por estado (`route`) reflejado en el hash de la URL (`#mapa`, `#contacto`…, vía `history.replaceState`; el portal queda afuera porque exige sesión), así una sección se puede compartir y recargar. En Next.js implementar como rutas reales (`/`, `/sobre`, `/expositores`, …) con scroll-to-top en navegación.

1. **Inicio** — Hero full-viewport: **foto de fondo** (`assets/hero-expo.jpg`, opacity .72, `saturate(1.1) brightness(.8)`, `kenBurns` 22s y parallax `scrollY*0.22`; reemplaza al video del handoff), fondo grid de 72px con máscara radial, 2 capas de montañas `clip-path` (siluetas Quebrada, opacidad baja), glows radiales violeta/turquesa. Eyebrow con fecha y sede, H1 "Viví la expo que **mueve al Norte**" con gradiente en segunda línea, 2 CTAs ("Conseguí tu entrada" primario, "Quiero exponer" outline), countdown live (4 cajas de 96px: días/horas/min/seg). Luego: línea de energía, franja de 4 contadores animados (200+ expositores, 45.000 visitantes, 12.000 m², 120+ actividades; count-up 1.4s ease-out al montar), 3 tarjetas destacadas (barra de color 42×8px arriba), franja "Nos acompañan" con los 4 logos Diamante (realce de brillo en hover), banner de redes (#ExpoJuy2026). Todo el sitio se lee sobre un fondo fotográfico fijo (`body::before` con `--pagebg` + `--pageveil`).
2. **Sobre** — Header + intro a 2 columnas: texto, **perfil de la feria** (edición, frecuencia, carácter, superficie) y las 3 cifras de 2024 con count-up, junto al **video real de ExpoJuy 2024** (16/10, autoplay silenciado en loop, degradé y rótulo abajo, botón play/pausa de 44px). Sigue **Objetivos**: columna sticky + 6 tarjetas destacadas del informe y un desplegable (`grid-template-rows 0fr→1fr`, filas con fade escalonado) con los 7 restantes. Después, **lo que pasa durante la expo** (4 tarjetas: ronda de negocios 330 reuniones, 6 jornadas de conferencias, 3 delegaciones internacionales, 30+ artistas), **15 sectores participantes** en chips con marca en L, la grilla de **valores**, el bloque **Organiza / Con el acompañamiento de** con los logos reales, y una tarjeta de cierre con doble CTA ("Quiero exponer" precarga el motivo en Contacto; "Quiero visitar" va a Entradas).
3. **Expositores** — Buscador (input 520px) + 9 chips de rubro (pill; activo: borde+fondo turquesa al 16%) + grilla 3 col de tarjetas (avatar 48px con gradiente del rubro e iniciales, nombre, stand, tag rubro). Click → **modal ficha** (overlay `rgba(3,4,9,.72)` + blur, tarjeta 520px, botones "Ubicar en el mapa" — navega al mapa y selecciona el stand exacto si es `D-xx`, o el sector si es A/B/C — y "Agendar reunión"). Estado vacío con mensaje.
4. **Agenda** — Recomendador por intereses (chips de eje; al activar, las actividades del eje reciben borde lila + tag "PARA VOS"); 4 tabs de día (activo: gradiente + borde turquesa); chips de eje; lista de filas (hora turquesa 19px, título, meta, dot+eje, botón "Agendar" ↔ "✓ Agendado" verde).
5. **Noticias** — Destacada grande (fondo gradiente + grid, tag sólido turquesa) + 4 tarjetas laterales; bloque "ExpoJuy en redes": 4 tiles cuadrados con gradientes Quebrada + botones IG/X/IN/YT.
6. **Mapa del predio** — **Plano ilustrativo SVG** (viewBox 1000×700, `aspect-ratio` 10/7) que reproduce la distribución del informe 2024: pabellón cubierto con los sectores A/B/C (cada uno con su trama en `<defs>`), 34 stands descubiertos D y 12 gastronómicos F individuales, E1/E2, escenario, sanitarios, acceso, estacionamiento y rosa de los vientos. Header con 3 métricas del predio (18.000 m² · 34 descubiertos · 139 cubiertos). Cada sector y cada stand es un `<g role="button">` que se levanta 5px en hover y, seleccionado, sube el fill y suma glow del color; los ocupados llevan un punto turquesa. **Panel lateral sticky** con expositor (avatar + "Ver perfil"), actividades del espacio (si el sector tiene `loc` en la agenda), expositores confirmados del sector o, si el stand está libre, el CTA "Consultar por este stand" que precarga Contacto. **Buscador** "¿Dónde está…?" (hasta 6 resultados: stands por código o por expositor, expositores de sectores cubiertos, sectores), **filtro por rubro** (los que no coinciden bajan a `opacity .28`) y **zoom/arrastre** (botones ±/1:1, Ctrl+rueda, pinza; escala 1→4 con clamp para no sacar el plano del marco).
7. **Sponsors** — **Spotlight Diamante**: tarjeta grande rotativa (autoplay cada 4,5 s, en pausa con el puntero encima, detenido con `prefers-reduced-motion`) con logo, texto y puntos de navegación, más la fila de los 4 logos Diamante para saltar entre ellos. Debajo: **Oro** (4 tarjetas, borde ocre), **Plata** (6 chips), bloque **Organiza / Acompañan** con los logos institucionales reales y CTA "Tu marca puede estar acá" con las métricas del evento. Los logos van sobre chips claros: no funcionan sobre fondo oscuro.
8. **FAQ** — Acordeón de 6 ítems (uno abierto a la vez, ícono +/−, `aria-expanded`), links a Cardón y Contacto.
9. **Contacto** — **Tiles de canal** (WhatsApp, teléfono, email, Instagram) con los datos reales de la Cámara. **Form** con el motivo como chips (radio) que cambian la ayuda y el placeholder del mensaje, y la validación client-side de siempre (nombre ≥3, email regex, mensaje ≥10; errores en `#D4548F` bajo el campo; éxito: banner verde). **Ilustración SVG** del entorno del predio (calles reales) con pin-logo animado (`floaty` + `ctoPing`) y "Ver en Google Maps" / "Cómo llegar". **Áreas de contacto** desplegables: elegir un área preselecciona el motivo y scrollea al formulario. El sitio ya no usa Leaflet.
10. **Entradas** (CTA nav, no está en el menú) — **Tabs de tier** (`role=tablist`, paneles `tier-<0|1|2>`): General gratis / Full $15.000 / Empresarial $60.000, con **toggle grupal** (−20 % por persona desde 5 entradas) y panel de detalle por tier (para quién es, qué incluye, beneficios y nota). Al confirmar se emite la **credencial** con QR real (`qrcode`, carga diferida) pensada para funcionar sin conexión, más una FAQ corta de entradas y el bloque de acceso al portal.
11. **Footer** (global) — Línea de energía, logos oficiales sobre chips blancos, 2 columnas de navegación, redes, y la firma: "Diseñado y desarrollado por **Quartz Tech Labs**" → https://quartztechlabs.com/ con dot glow.

### Asistente Cardón (global)
Botón flotante 66px (bottom/right 26px): cactus geométrico CSS (cuerpo verde con costillas, ojos, flor lila romboidal) con animación `sway` 3.5s + `pulseGlow` 4s. Abre panel 344×480: header con avatar mini, mensajes (bot: fondo verde .1, radio `4px 14px 14px 14px`; usuario: violeta .18, radio espejado), chips de sugerencia, input + enviar (Enter también envía). El prototipo responde por keywords (entradas, agenda, stands, horarios, cómo llegar, gastronomía); en producción conectar a LLM con contexto del evento (agenda + expositores + FAQ vía API).

## Screens (mobile — `ExpoJuy 2026 Mobile.dc.html`)
Patrón: navegación por **barra inferior** de 5 tabs (Inicio/Expositores/Agenda/Mapa/Más), targets ≥44px, una columna, safe areas iOS respetadas (59px top). Pantallas: Inicio (hero + countdown), Expositores (lista), Agenda (tabs día + tarjetas), Mapa (grilla 6 col + detalle), Mi entrada (QR grande + "Agregar a Wallet", pensada offline/PWA), chat Cardón full-screen.

## Interactions & Behavior
- Navegación: scroll-to-top al cambiar de ruta; sección activa en blanco en el nav.
- Countdown: `setInterval` 1s hacia `2026-09-24T09:00:00-03:00` (configurable; clamp a 0).
- Hovers: links → turquesa/lila; tarjetas → borde acento + `translateY(-2/-3px)`; CTAs → glow violeta; nav links → fondo blanco .06.
- Animación de entrada de vista: `fadeUp` 0.45s (opacity + translateY 14px).
- Accesibilidad: WCAG 2.1 AA — contraste verificado sobre oscuro, `aria-pressed/expanded/label` en toggles y acordeón, labels en form, navegación por teclado, y `prefers-reduced-motion` desactiva todas las animaciones (además existe un flag manual `reducirAnimaciones`).
- Sin emojis; los íconos de redes son chips tipográficos (IG/X/IN/YT).

## State Management
- `route` (string), `q` + `rubro` (filtro expositores), `expoSel` (modal), `day` + `eje` + `intereses` + `saved` (agenda), `stand` + `mapQ` + `mapRubro` + `mz` (mapa: selección, buscador, filtro por rubro y zoom/paneo), `faqOpen`, `objOpen` + `vidPaused` (Sobre: desplegable de objetivos y video), `tier` + `grupo` + `tFaq` (entradas), `spSpot` (spotlight de Sponsors), `chatOpen` + `chatMsgs` + `chatInput`, campos + `errs` + `formOk` + `areasOpen` (contacto), `now` (countdown), `statP`/`statP2` (progreso count-up), y el bloque del portal (`user`, `ticket`, `authOpen`, `portalTab`…).
- Los datos llegan de `src/data/evento.js` y `src/data/predio.js` inyectados como `DATA` (`EXPOS`, `AGENDA`, `NOTIS`, `MAP`, `STANDS`, `FAQS`, `TIERS`, `SPONSORS`) → reemplazar por fetch a la API Spring Boot / CMS.

## Assets
- Fuentes Ambit y logos: **Kit de Diseño oficial del concurso** (provistos por la organización).
- Fotos incorporadas: `hero-expo.jpg` (hero) y `bg-mountains.jpg` (fondo global). Los logos de sponsors y organismos son los archivos reales; KeLimpio sigue siendo un recorte de captura, pendiente del oficial.
- Todo lo demás (montañas, grids, cactus Cardón, ilustración del predio en Contacto, plano del Mapa) es CSS/SVG generado — sin dependencias externas. El QR y el PDF sí usan librerías (`qrcode`, jsPDF), cargadas bajo demanda.

## Notas para el implementador
- Las fechas, cifras y los nombres de expositores y sponsors utilizados en el prototipo deben validarse contra el material definitivo de la organización.
- El QR debe generarse server-side o con lib (`qrcode`) firmado por entrada; el del prototipo es decorativo.
- El plano del predio ya es un SVG propio y toda su geometría vive en `src/data/predio.js`: un plano exportado de CAD puede reemplazar los `<rect>` manteniendo los mismos `id`, y el viewBox y las coordenadas deberían pasar al CMS para que la organización actualice la distribución sin tocar código. La ocupación de stands es la relación expositor ↔ `stand` (`D-29` → `D29`); el resto figura como "Disponible", así el plano también funciona como pieza comercial.

---

## Memoria descriptiva

### Concepto general

La propuesta adopta el concepto **“Jujuy, tierra de innovación”**. La identidad combina un lenguaje digital contemporáneo con colores inspirados en la Quebrada de Humahuaca y la paleta institucional de ExpoJuy. El contraste entre fondos profundos, acentos turquesa y violeta, relieves cromáticos y formas de montaña busca comunicar tecnología sin perder el vínculo con el territorio.

La experiencia se plantea como una plataforma de orientación antes y durante el evento: permite descubrir la propuesta de ExpoJuy, encontrar expositores, organizar actividades, recorrer el predio, consultar información práctica y conservar una entrada digital demostrativa.

### Objetivos

- Presentar ExpoJuy 2026 como el principal punto de encuentro productivo y tecnológico del Norte Argentino.
- Facilitar el acceso a información relevante mediante una arquitectura clara y predecible.
- Dar visibilidad equilibrada a empresas, actividades, patrocinadores e instituciones organizadoras.
- Reducir la fricción para buscar expositores, planificar una agenda y orientarse dentro del predio.
- Proponer una base visual y funcional técnicamente viable, escalable y adaptable a futuros contenidos oficiales.
- Incorporar innovación de forma responsable mediante un asistente contextual demostrativo.

### Organización del contenido

La arquitectura se divide en Inicio, Sobre ExpoJuy, Expositores, Agenda, Noticias, Mapa, Sponsors, FAQ, Contacto y Entradas. En escritorio se utiliza navegación superior persistente. En móvil se priorizan las cuatro tareas más frecuentes —Inicio, Expositores, Agenda y Mapa— mediante una barra inferior; las secciones secundarias se agrupan en “Más”.

El Inicio funciona como síntesis y puerta de entrada. Las vistas de Expositores, Agenda y Mapa concentran las interacciones principales. FAQ y Cardón resuelven dudas rápidas, mientras que Contacto cubre necesidades comerciales e institucionales.

### Criterios y justificación del diseño

- **Jerarquía:** títulos de gran escala, etiquetas breves y agrupación por tarjetas permiten escanear rápidamente el contenido.
- **Identidad territorial:** los colores secundarios remiten a la diversidad cromática de Jujuy y distinguen rubros, ejes y zonas sin depender únicamente del texto.
- **Continuidad visual:** la línea multicolor, los gradientes y las geometrías se repiten con moderación para unir las distintas secciones.
- **Orientación:** la navegación persistente, los estados seleccionados y las etiquetas de color mantienen visible el contexto del usuario.
- **Legibilidad:** Ambit se utiliza con distintos pesos y tamaños, acompañada por contraste alto y anchos de lectura controlados.
- **Progresión:** las llamadas a la acción conducen desde el descubrimiento general hacia tareas concretas como consultar agenda, buscar una empresa o gestionar una entrada.

### Tecnología utilizada y evolución prevista

El prototipo actual utiliza HTML, CSS y JavaScript, un runtime local para los componentes del handoff y Vite como servidor de desarrollo y herramienta de compilación. Los datos son demostrativos y se encuentran embebidos en el frontend.

Esta elección permite evaluar la propuesta sin instalar un backend. Para una implementación productiva, la interfaz puede migrarse a React/Next.js u otro framework equivalente y consumir una API o CMS para agenda, expositores, noticias, entradas y administración. La arquitectura visual no depende de una tecnología específica.

### Estrategia de accesibilidad

- HTML semántico para navegación, contenido principal, secciones y pie de página.
- Nombres accesibles en controles e imágenes; labels asociados a los campos del formulario.
- Navegación mediante teclado en botones nativos y componentes interactivos personalizados.
- Indicadores de foco visibles y activación con Enter o barra espaciadora.
- Estados comunicados mediante `aria-pressed`, `aria-expanded`, `aria-label` y regiones de diálogo.
- Paleta oscura con contraste diferenciado para textos, controles, estados y superficies.
- Respeto de `prefers-reduced-motion` y opción técnica para reducir animaciones.
- Íconos decorativos ocultos a lectores de pantalla; el significado se conserva mediante texto o nombres accesibles.

Antes de una publicación productiva se recomienda completar una auditoría WCAG 2.1 AA con herramientas automáticas y pruebas manuales de teclado y lector de pantalla.

### Estrategia responsive

La interfaz parte de contenedores fluidos y reorganiza grillas, columnas, tarjetas y paneles en los cortes de 900 y 600 píxeles (el plano del predio suma los suyos en 980 y 700, donde el panel de detalle deja de ser fijo y los rubros pasan a una fila desplazable). En pantallas pequeñas utiliza navegación inferior, objetivos táctiles de al menos 44 píxeles, contenidos en una sola columna y espacio inferior seguro para evitar que la barra tape información.

Las acciones más utilizadas permanecen accesibles con el pulgar y el menú “Más” agrupa el resto de las secciones. El video, las fuentes y los recursos se sirven localmente para que el prototipo no dependa de terceros durante la evaluación.

### Uso responsable de Inteligencia Artificial

Cardón representa un asistente contextual para responder preguntas sobre agenda, entradas, expositores, ubicación, horarios y gastronomía. En este prototipo utiliza respuestas determinísticas por palabras clave: no envía datos, no toma decisiones ni simula una conexión real con un modelo de IA.

En producción podría conectarse a un modelo con recuperación de información desde fuentes oficiales del evento. Debería identificar claramente su naturaleza automatizada, limitarse a contenido verificado, ofrecer derivación a contacto humano y evitar almacenar datos personales innecesarios.

### Alcance y limitaciones

- Fechas, precios, cifras, agenda, expositores y patrocinadores son datos demostrativos hasta recibir confirmación oficial. En Sobre quedan a confirmar la "17ª edición" (2024 fue la 16ª, con frecuencia bianual) y las cifras 180 / 38.000 / 9 de la edición anterior.
- El QR es visual y no acredita acceso real.
- El formulario valida datos localmente pero no envía información.
- Los botones de registro, reuniones y Wallet son demostrativos.
- El plano reproduce la distribución del informe 2024 (a confirmar para 2026), y la asignación de stands por expositor es demostrativa.
- La autenticación del portal es simulada en el cliente (localStorage de este dispositivo); no hay administración ni pagos.

## Ejecución y verificación

```bash
npm install
npm run dev
```

Para generar la versión estática:

```bash
npm run build
npm run preview
```

La salida se crea en `dist/`. Con `npm run preview` sirviendo `dist/` en `http://127.0.0.1:4173` se pueden ejecutar los tests E2E (requieren Chrome o Edge; `CHROME_PATH` para otra ruta):

```bash
npm run test:smoke    # portada, navegación, filtros, ficha, responsive
npm run test:mobile   # cada ruta a 390 px sin ensanchar el viewport
npm run test:portal   # registro/login, Mi Agenda + PDF, Mi Entrada + QR, Mi Perfil, mobile
npm test              # los tres
```

`SHOTS_DIR=<carpeta> npm run test:portal` guarda además capturas de cada paso y el PDF generado.
