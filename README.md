# Handoff: Sitio Web ExpoJuy 2026

> Estado actual: prototipo frontend funcional y navegable preparado para ejecución local. Esta entrega no incluye backend, base de datos, pasarela de pagos ni servicios externos.

## Overview
Propuesta conceptual y visual del sitio web oficial de **ExpoJuy 2026** (Desafío Digital ExpoJuy 2026, Cámara de Comercio Exterior de Jujuy), diseñada por **Quartz Tech Labs**. Incluye el sitio desktop navegable completo (10 secciones + entradas con QR + asistente IA "Cardón") y 6 pantallas mobile clave.

Concepto: **"Jujuy, tierra de innovación"** — dark mode tecnológico (con **Modo Claro** alternativo) con acentos cromáticos de la Quebrada de Humahuaca, integrando la identidad oficial del evento (logo, tipografía Ambit, paleta turquesa/violeta/lila).

## About the Design Files
Los archivos de este paquete son **referencias de diseño creadas en HTML** (Design Components): prototipos que muestran el aspecto y comportamiento previstos, **no código de producción para copiar directamente**. La tarea es **recrear estos diseños en el stack objetivo del proyecto**:

- **Frontend:** Next.js (App Router, React Server Components, SSG/ISR)
- **Estilos:** Tailwind CSS (mapear los tokens de abajo a `tailwind.config`)
- **Animaciones:** Framer Motion / GSAP + micro-interacciones CSS
- **Backend previsto:** Spring Boot + Gradle (API REST: expositores, agenda, noticias, entradas, panel admin)
- **Extras:** PWA con modo offline (crítico para el QR de entrada dentro del predio), mapa interactivo (SVG propio; escalable a Mapbox/Leaflet)

## Fidelity
**High-fidelity (hifi).** Colores, tipografía, espaciado, copy e interacciones son finales. Las fechas, cifras, empresas y patrocinadores utilizados en el prototipo deberán validarse con la organización antes de una publicación oficial.

## Files
- `ExpoJuy 2026.dc.html` — sitio desktop completo (fuente de verdad de layout y lógica). El markup vive dentro de `<x-dc>`; la lógica (estado, filtros, chatbot, validación) en la clase `Component` al final del archivo.
- `ExpoJuy 2026 Mobile.dc.html` — 6 pantallas mobile en marcos de iPhone.
- `ios-frame.jsx` — marco de dispositivo usado solo para presentación (no implementar).
- `assets/fonts/Ambit-{Light,Regular,SemiBold,Bold}.otf` — tipografía oficial del kit.
- `assets/expojuy-logo.png`, `assets/logo-camcomext.png` — logos oficiales (usar sobre chips blancos: no funcionan sobre fondo oscuro).
- `assets/hero-video.mp4` — video aéreo del predio para el fondo del hero (loop, muted, autoplay).

### Screenshots
`screenshots/01–06-desktop.png` (Inicio, Expositores, Agenda, Mapa, Entradas, chat Cardón) y `07-mobile.png` — referencia visual del resultado esperado.

## Tema visual
El sitio utiliza exclusivamente un **tema oscuro**, elegido para reforzar el carácter tecnológico de la propuesta y destacar los acentos cromáticos inspirados en Jujuy. Los tokens de `:root` constituyen la paleta única de la interfaz.

## Design Tokens
Los valores de abajo corresponden al tema único definido en `:root`.

### Colores
| Token | Valor | Uso |
|---|---|---|
| `bg-base` | `#05070D` | Fondo global |
| `bg-deep` | `#0A1428` | Gradiente de fondos hero |
| `bg-alt` | `#070B16` | Franjas alternadas de sección |
| `panel` | `#0D1428` | Tarjetas y paneles |
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
SPA con router por estado (`route`); en Next.js implementar como rutas reales (`/`, `/sobre`, `/expositores`, …) con scroll-to-top en navegación.

1. **Inicio** — Hero full-viewport: **video de fondo** (`assets/hero-video.mp4`: loop/muted/autoplay/playsInline, object-fit cover, opacity .3, blur 5.2px, saturate .75, máscara radial + fundido vertical hacia el fondo — el video acompaña, nunca protagoniza; sobre él van las capas geométricas), fondo grid de 72px con máscara radial, 2 capas de montañas `clip-path` (siluetas Quebrada, opacidad baja), glows radiales violeta/turquesa. Eyebrow con fecha y sede, H1 "Viví la expo que **mueve al Norte**" con gradiente en segunda línea, 2 CTAs ("Conseguí tu entrada" primario, "Quiero exponer" outline), countdown live (4 cajas de 96px: días/horas/min/seg). Luego: línea de energía, franja de 4 contadores animados (200+ expositores, 45.000 visitantes, 12.000 m², 120+ actividades; count-up 1.4s ease-out al montar), 3 tarjetas destacadas (barra de color 42×8px arriba), strip de sponsors (chips outline), banner de redes (#ExpoJuy2026).
2. **Sobre** — Header + 2 columnas: texto histórico + placeholder de video institucional 16:10 (botón play con `pulseGlow`); 3 mini-tarjetas de cifras 2024; grilla 3×2 de valores con marca escalonada (clip-path en L) del color de cada valor.
3. **Expositores** — Buscador (input 520px) + 9 chips de rubro (pill; activo: borde+fondo turquesa al 16%) + grilla 3 col de tarjetas (avatar 48px con gradiente del rubro e iniciales, nombre, stand, tag rubro). Click → **modal ficha** (overlay `rgba(3,4,9,.72)` + blur, tarjeta 520px, botones "Ubicar en el mapa" — navega al mapa con el sector preseleccionado — y "Agendar reunión"). Estado vacío con mensaje.
4. **Agenda** — Recomendador por intereses (chips de eje; al activar, las actividades del eje reciben borde lila + tag "PARA VOS"); 4 tabs de día (activo: gradiente + borde turquesa); chips de eje; lista de filas (hora turquesa 19px, título, meta, dot+eje, botón "Agendar" ↔ "✓ Agendado" verde).
5. **Noticias** — Destacada grande (fondo gradiente + grid, tag sólido turquesa) + 4 tarjetas laterales; bloque "ExpoJuy en redes": 4 tiles cuadrados con gradientes Quebrada + botones IG/X/IN/YT.
6. **Mapa del predio** — Grilla CSS 12 col × 60px con 10 sectores clickeables (fondo `rgba(color,.13)`, borde `.45`; seleccionado: fondo `.30` + borde sólido 2px) + panel lateral sticky con detalle del sector y expositores destacados. Nota "plano ilustrativo".
7. **Sponsors** — Tiers: Diamante (2 tarjetas grandes, borde lila + glow hover), Oro (4, borde ocre), Plata (6 chips) + CTA "Convertite en sponsor".
8. **FAQ** — Acordeón de 6 ítems (uno abierto a la vez, ícono +/−, `aria-expanded`), links a Cardón y Contacto.
9. **Contacto** — Form (nombre, email, motivo select, mensaje) con validación client-side (nombre ≥3, email regex, mensaje ≥10; errores en `#D4548F` bajo el campo; éxito: banner verde) + tarjeta institucional (labels tipográficos PREDIO/EMAIL/TEL/HORARIO en turquesa) + placeholder de mapa de ubicación con pin animado (`floaty`).
10. **Entradas** (CTA nav, no está en el menú) — 3 tiers seleccionables (General gratis / Full $15.000 / Empresarial $60.000; seleccionado: borde turquesa) + ticket sticky: franja gradiente 6px, QR generado en canvas (en producción: QR real por API), titular, tier, nº.
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
- `route` (string), `q` + `rubro` (filtro expositores), `expoSel` (modal), `day` + `eje` + `intereses` + `saved` (agenda), `stand` (mapa), `faqOpen`, `tier` (entradas), `chatOpen` + `chatMsgs` + `chatInput`, campos + `errs` + `formOk` (contacto), `now` (countdown), `statP` (progreso count-up).
- Datos hoy hardcodeados en la clase (`EXPOS`, `AGENDA`, `NOTIS`, `MAP`, `FAQS`, `TIERS`, `SPONSORS`) → reemplazar por fetch a la API Spring Boot / CMS.

## Assets
- Fuentes Ambit y logos: **Kit de Diseño oficial del concurso** (provistos por la organización).
- Todo lo demás (montañas, grids, cactus Cardón, QR demo, placeholders de video/mapa/feed) es CSS/canvas generado — sin dependencias externas. Fotos e imágenes institucionales reales llegarán del kit.

## Notas para el implementador
- Las fechas, cifras y los nombres de expositores y sponsors utilizados en el prototipo deben validarse contra el material definitivo de la organización.
- El QR debe generarse server-side o con lib (`qrcode`) firmado por entrada; el del prototipo es decorativo.
- El mapa está pensado para escalar: cada sector es un nodo de datos (id, nombre, sub, área, color, descripción, expositores) — misma estructura sirve para un SVG real del predio.

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

La interfaz parte de contenedores fluidos y reorganiza grillas, columnas, tarjetas y paneles en los cortes de 900 y 600 píxeles. En pantallas pequeñas utiliza navegación inferior, objetivos táctiles de al menos 44 píxeles, contenidos en una sola columna y espacio inferior seguro para evitar que la barra tape información.

Las acciones más utilizadas permanecen accesibles con el pulgar y el menú “Más” agrupa el resto de las secciones. El video, las fuentes y los recursos se sirven localmente para que el prototipo no dependa de terceros durante la evaluación.

### Uso responsable de Inteligencia Artificial

Cardón representa un asistente contextual para responder preguntas sobre agenda, entradas, expositores, ubicación, horarios y gastronomía. En este prototipo utiliza respuestas determinísticas por palabras clave: no envía datos, no toma decisiones ni simula una conexión real con un modelo de IA.

En producción podría conectarse a un modelo con recuperación de información desde fuentes oficiales del evento. Debería identificar claramente su naturaleza automatizada, limitarse a contenido verificado, ofrecer derivación a contacto humano y evitar almacenar datos personales innecesarios.

### Alcance y limitaciones

- Fechas, precios, cifras, agenda, expositores y patrocinadores son datos demostrativos hasta recibir confirmación oficial.
- El QR es visual y no acredita acceso real.
- El formulario valida datos localmente pero no envía información.
- Los botones de registro, reuniones y Wallet son demostrativos.
- El mapa representa una distribución ilustrativa del predio.
- No se incluyen autenticación, administración, pagos ni persistencia.

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

La salida se crea en `dist/`. También puede ejecutarse `npm run test:smoke` mientras el servidor de desarrollo está disponible en `http://127.0.0.1:4173`.
