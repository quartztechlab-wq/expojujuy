// Galería fotográfica de la ExpoJuy 2024 (handoff v9, INICIO-V9.md §2).
// Alimenta el carrusel del Inicio, la ruta oculta `#galeria` y el lightbox.
// En producción estas fotos vendrán del CMS; por ahora son las oficiales de 2024.

// Las fotos se importan para que Vite las copie a dist/ con hash: el <img src> se
// resuelve por binding del runtime y el bundler no lo ve (misma trampa que los logos).
import foto01 from '../../assets/galeria/2024-01.webp';
import foto02 from '../../assets/galeria/2024-02.webp';
import foto03 from '../../assets/galeria/2024-03.webp';
import foto04 from '../../assets/galeria/2024-04.webp';
import foto05 from '../../assets/galeria/2024-05.webp';
import foto06 from '../../assets/galeria/2024-06.webp';

/** Sin captions por decisión de diseño: el `label` es solo texto accesible. */
export const GALERIA = [foto01, foto02, foto03, foto04, foto05, foto06]
  .map((src, i) => ({ src, label: `ExpoJuy 2024 — foto ${i + 1}` }));
