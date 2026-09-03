// PDF del itinerario personal — generado 100 % en el cliente con jsPDF + jspdf-autotable.
// Las librerías se cargan con dynamic import (chunk aparte): no pesan en el bundle inicial.
// Plantilla según PORTAL-USUARIO.md: encabezado con logo y datos del visitante, barra de
// 5 px con los colores de la Quebrada, título, chips de resumen, una sección por día con
// tabla Horario · Actividad · Sala · Disertante · Eje, filas superpuestas resaltadas y pie
// con la firma de Quartz Tech Labs. Tipografía: Helvetica (Ambit es OpenType-CFF y jsPDF
// solo embebe TrueType).
import { DIAS, EJES_IMPRESION, PREDIO, DURACION_ACTIVIDAD_MIN } from '../data/evento.js';

const logoUrl = new URL('../../assets/expojuy-logo.png', import.meta.url).href;

/**
 * @typedef {Object} ItemItinerario
 * @property {number} day        Índice en DIAS.
 * @property {string} time       "HH:MM" de inicio.
 * @property {string} end        "HH:MM" de fin estimado.
 * @property {string} title
 * @property {string} place
 * @property {string} speaker
 * @property {string} eje
 * @property {string} overlapWith  Título de la actividad con la que se superpone ("" si ninguna).
 */

const C = {
  text: '#141720', muted: '#667089', sub: '#4E566C', line: '#DDE2EE', row: '#EEF1F8', chip: '#CFD5E4',
  tq: '#0B93A5', vi: '#7857F5', oc: '#E09A45', ovBg: '#FFF7EA', ovTx: '#A66A12',
  barra: ['#2BC4D6', '#3FB380', '#E09A45', '#D4548F', '#7857F5']
};
const PAGE = { w: 210, h: 297, ml: 14, mr: 14, mt: 16, mb: 18 };
const CW = PAGE.w - PAGE.ml - PAGE.mr;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

async function cargarLogo() {
  try {
    const blob = await fetch(logoUrl).then((r) => (r.ok ? r.blob() : Promise.reject(r.status)));
    const dataUrl = await new Promise((resolve, reject) => { const fr = new FileReader(); fr.onload = () => resolve(fr.result); fr.onerror = reject; fr.readAsDataURL(blob); });
    const img = await new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = dataUrl; });
    return { dataUrl, ratio: img.naturalWidth / img.naturalHeight };
  } catch { return null; } // sin logo el documento sigue siendo válido
}

/**
 * Genera y descarga el PDF. Devuelve el nombre del archivo.
 * @param {{ user: { nombre: string, email: string }, tierName: string, items: ItemItinerario[] }} datos
 */
export async function generarItinerario({ user, tierName, items }) {
  const [{ jsPDF }, { default: autoTable }, logo] = await Promise.all([import('jspdf'), import('jspdf-autotable'), cargarLogo()]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const lineH = (pt) => (pt * 1.15) / doc.internal.scaleFactor; // alto de línea en mm para un cuerpo en pt
  const setText = (size, style = 'normal', color = C.text) => { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(color); };
  let y = PAGE.mt;

  // ---- Encabezado: logo + marca · datos del visitante ----
  const logoH = 11;
  let x = PAGE.ml;
  if (logo) { doc.addImage(logo.dataUrl, 'PNG', x, y, logoH * logo.ratio, logoH); x += logoH * logo.ratio + 4; }
  setText(16.5, 'bold'); doc.text('EXPOJUY', x, y + 7.5, { charSpace: 0.4 });
  const wExpo = doc.getTextWidth('EXPOJUY') + 1.5 + 0.4 * 7;
  setText(16.5, 'bold', C.vi); doc.text('2026', x + wExpo, y + 7.5, { charSpace: 0.4 });
  const right = PAGE.w - PAGE.mr;
  setText(12, 'bold'); doc.text(user.nombre, right, y + 3.5, { align: 'right' });
  setText(9, 'normal', C.muted); doc.text(user.email, right, y + 8, { align: 'right' }); doc.text(tierName, right, y + 12, { align: 'right' });
  y += logoH + 5;
  doc.setDrawColor(C.line); doc.setLineWidth(0.25); doc.line(PAGE.ml, y, right, y);

  // ---- Barra de energía: 5 colores interpolados ----
  y += 4;
  const segs = 120, segW = CW / segs, stops = C.barra.map(hex);
  for (let i = 0; i < segs; i += 1) {
    const t = (i / (segs - 1)) * (stops.length - 1), k = Math.min(stops.length - 2, Math.floor(t));
    const [r, g, b] = mix(stops[k], stops[k + 1], t - k);
    doc.setFillColor(r, g, b); doc.rect(PAGE.ml + i * segW, y, segW + 0.05, 1.3, 'F');
  }
  y += 8;

  // ---- Título, subtítulo y chips de resumen ----
  setText(19.5, 'bold'); doc.text('Mi itinerario', PAGE.ml, y + 5); y += 9.5;
  const generado = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  setText(9.5, 'normal', C.sub);
  const sub = doc.splitTextToSize(`24 al 27 de septiembre de 2026 · ${PREDIO.nombre}, ${PREDIO.ciudad} · Generado el ${generado}`, CW);
  doc.text(sub, PAGE.ml, y + 3); y += sub.length * lineH(9.5) + 5;
  const dias = new Set(items.map((i) => i.day)).size, hayOverlap = items.some((i) => i.overlapWith);
  const chips = [[String(items.length), items.length === 1 ? ' actividad' : ' actividades'], [String(dias), dias === 1 ? ' día' : ' días']];
  if (hayOverlap) chips.push(['', 'Hay horarios superpuestos']);
  x = PAGE.ml;
  chips.forEach(([b, t], i) => {
    const warn = hayOverlap && i === chips.length - 1;
    setText(8.5, 'bold'); const wb = doc.getTextWidth(b); setText(8.5, 'normal'); const wt = doc.getTextWidth(t);
    const w = wb + wt + 6;
    doc.setDrawColor(warn ? C.oc : C.chip); doc.setLineWidth(0.25); doc.roundedRect(x, y, w, 6.2, 3.1, 3.1, 'S');
    setText(8.5, 'bold', C.tq); doc.text(b, x + 3, y + 4.2);
    setText(8.5, 'normal', warn ? C.ovTx : C.sub); doc.text(t, x + 3 + wb, y + 4.2);
    x += w + 2.5;
  });
  y += 12;

  // ---- Secciones por día ----
  if (!items.length) {
    doc.setDrawColor(C.chip); doc.setLineDashPattern([1.2, 1.2], 0); doc.roundedRect(PAGE.ml, y, CW, 22, 3, 3, 'S'); doc.setLineDashPattern([], 0);
    setText(10, 'normal', C.muted); doc.text('Todavía no agendaste actividades.', PAGE.w / 2, y + 12.5, { align: 'center' });
  }
  const colW = { horario: 22, eje: 34, lugar: 34, disertante: 40 };
  colW.actividad = CW - colW.horario - colW.eje - colW.lugar - colW.disertante;
  const pad = 2.5, bodyPt = 9.5, smallPt = 8;
  const lineaInferior = (cell, section) => { doc.setDrawColor(section === 'head' ? C.line : C.row); doc.setLineWidth(0.2); doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); };
  DIAS.forEach((dia, d) => {
    const its = items.filter((i) => i.day === d);
    if (!its.length) return;
    // break-inside: avoid — si la sección no entra en lo que queda de página, arranca en una nueva.
    const estimado = 14 + 9 + its.reduce((acc, i) => acc + (i.overlapWith ? 13 : 10.5), 0);
    if (y + estimado > PAGE.h - PAGE.mb && estimado < PAGE.h - PAGE.mt - PAGE.mb) { doc.addPage(); y = PAGE.mt; }
    setText(12, 'bold', C.tq); doc.text(dia.largo, PAGE.ml, y + 4);
    const wl = doc.getTextWidth(dia.largo);
    setText(8.5, 'normal', C.muted); doc.text(`${dia.tema} · ${its.length} actividad${its.length > 1 ? 'es' : ''}`, PAGE.ml + wl + 3, y + 4);
    y += 7.5;

    autoTable(doc, {
      startY: y,
      margin: { left: PAGE.ml, right: PAGE.mr, top: PAGE.mt, bottom: PAGE.mb },
      theme: 'plain',
      rowPageBreak: 'avoid',
      head: [['Horario', 'Actividad', 'Sala / escenario', 'Disertante', 'Eje']],
      body: its.map((i) => [`${i.time}\n– ${i.end}`, i.overlapWith ? `${i.title}\nSe superpone con “${i.overlapWith}”` : i.title, i.place, i.speaker, i.eje]),
      styles: { font: 'helvetica', fontSize: bodyPt, textColor: C.text, cellPadding: pad, lineWidth: 0, valign: 'top', overflow: 'linebreak' },
      headStyles: { fontSize: 7.5, fontStyle: 'normal', textColor: C.muted, cellPadding: { top: 1.5, bottom: 2, left: pad, right: pad } },
      columnStyles: { 0: { cellWidth: colW.horario, fontStyle: 'bold' }, 1: { cellWidth: colW.actividad }, 2: { cellWidth: colW.lugar }, 3: { cellWidth: colW.disertante }, 4: { cellWidth: colW.eje } },
      didParseCell: (data) => {
        if (data.section === 'head') data.cell.text = data.cell.text.map((t) => t.toUpperCase());
        if (data.section === 'body' && its[data.row.index].overlapWith) data.cell.styles.fillColor = C.ovBg;
      },
      // Las celdas con estilos mixtos (hora + fin, título + nota, punto + eje) se dibujan a mano: el texto
      // que autotable calculó solo define el alto de la fila y no se imprime (así el PDF no duplica texto).
      willDrawCell: (data) => {
        const { cell, section, column } = data;
        if (section !== 'body' || ![0, 1, 4].includes(column.index)) return;
        const item = its[data.row.index], tx = cell.x + pad, ty = cell.y + pad + 0.4;
        if (item.overlapWith) { const [r, g, b] = hex(C.ovBg); doc.setFillColor(r, g, b); doc.rect(cell.x, cell.y, cell.width, cell.height, 'F'); }
        lineaInferior(cell, section);
        if (column.index === 0) {
          setText(bodyPt, 'bold'); doc.text(item.time, tx, ty, { baseline: 'top' });
          setText(smallPt, 'normal', C.muted); doc.text(`– ${item.end}`, tx, ty + lineH(bodyPt), { baseline: 'top' });
        } else if (column.index === 1) {
          setText(bodyPt, 'bold');
          const lines = doc.splitTextToSize(item.title, cell.width - pad * 2);
          doc.text(lines, tx, ty, { baseline: 'top' });
          if (item.overlapWith) {
            setText(smallPt, 'normal', C.ovTx);
            doc.text(doc.splitTextToSize(`Se superpone con “${item.overlapWith}”`, cell.width - pad * 2), tx, ty + lines.length * lineH(bodyPt) + 0.6, { baseline: 'top' });
          }
        } else if (column.index === 4) {
          const [r, g, b] = hex(EJES_IMPRESION[item.eje] || C.muted);
          doc.setFillColor(r, g, b); doc.circle(tx + 1.2, ty + 1.7, 1.2, 'F');
          setText(bodyPt, 'normal'); doc.text(doc.splitTextToSize(item.eje, cell.width - pad * 2 - 4), tx + 4, ty, { baseline: 'top' });
        }
        return false;
      },
      didDrawCell: (data) => lineaInferior(data.cell, data.section)
    });
    y = doc.lastAutoTable.finalY + 9;
  });

  // ---- Pie en todas las páginas ----
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    const fy = PAGE.h - PAGE.mb + 4;
    doc.setDrawColor(C.line); doc.setLineWidth(0.25); doc.line(PAGE.ml, fy, PAGE.w - PAGE.mr, fy);
    setText(8, 'normal', C.muted); doc.text('Cámara de Comercio Exterior de Jujuy · ExpoJuy 2026', PAGE.ml, fy + 4.5);
    const firma = 'Diseñado y desarrollado por ', qtl = 'Quartz Tech Labs', pag = pages > 1 ? `   ·   ${p}/${pages}` : '';
    setText(8, 'bold', C.sub); const wq = doc.getTextWidth(qtl); setText(8, 'normal', C.muted); const wp = doc.getTextWidth(pag), wf = doc.getTextWidth(firma);
    const fx = PAGE.w - PAGE.mr - wf - wq - wp;
    doc.text(firma, fx, fy + 4.5); setText(8, 'bold', C.sub); doc.text(qtl, fx + wf, fy + 4.5); setText(8, 'normal', C.muted); doc.text(pag, fx + wf + wq, fy + 4.5);
  }

  doc.setProperties({ title: 'Mi itinerario · ExpoJuy 2026', subject: `Itinerario de ${user.nombre}`, author: 'ExpoJuy 2026', creator: 'expojuy.quartztechlabs.com' });
  const fileName = `ExpoJuy2026-itinerario-${slug(user.nombre) || 'visitante'}.pdf`;
  doc.save(fileName);
  return fileName;
}

/** Duración estimada usada por el portal, re-exportada para quien arme los ítems. */
export { DURACION_ACTIVIDAD_MIN };
