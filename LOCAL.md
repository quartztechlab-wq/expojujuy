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

La compilación estática queda en `dist/`. Con el preview activo en `http://127.0.0.1:4173`, `npm test` corre los tests E2E (smoke, mobile y portal; requieren Chrome o Edge).

## Alcance

- Los formularios, entradas, QR, el asistente Cardón y el Portal de Usuario (sesión en `localStorage`) son demostraciones locales.
- Los datos están embebidos en el frontend.
- Los HTML `.dc.html` y las capturas originales se conservan como referencia.
