# ExpoJuy 2026 — ejecución local

Este directorio contiene únicamente el frontend navegable. No requiere ni incluye backend, base de datos o variables de entorno.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Abrir la URL que muestra Vite (normalmente `http://127.0.0.1:5173`).

## Build local

```bash
npm run build
npm run preview
```

La compilación estática queda en `dist/`.

## Alcance

- Los formularios, entradas, QR y el asistente Cardón son demostraciones locales.
- Los datos están embebidos en el frontend.
- Los HTML `.dc.html` y las capturas originales se conservan como referencia.
