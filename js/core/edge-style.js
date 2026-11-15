/**
 * =========================================================================
 * EDGE STYLE — Kenar (ilişki) görsel kararlarının tek doğruluk kaynağı
 * =========================================================================
 * Graf (vis-network) ve harita (Leaflet) görünümlerinin ikisi de aynı
 * soruya cevap verir: "Bu kenar hangi renk/kalınlık/opaklıkla çizilir?"
 * Renk paleti, kalınlık, kesik çizgi, soluk opaklık ve lejant etiketi
 * burada toplanır; adapter'lar yalnızca kendi piksel formatlarına çevirir.
 *
 * Saf ve DOM'dan bağımsızdır.
 */
const EdgeStyle = (function () {

  // Hoca-Öğrenci (Master) = Altın Sarısı / Amber (Düz Çizgi)
  // Entelektüel Etki (Influence) = Gök Mavisi / Sky Blue (Kesikli Çizgi)
  function palette(isDark) {
    return isDark
      ? {
          masterNormal: '#f59e0b', masterHighlight: '#fbbf24', masterDimmed: 'rgba(245, 158, 11, 0.15)',
          influenceNormal: '#38bdf8', influenceHighlight: '#38bdf8', influenceDimmed: 'rgba(56, 189, 248, 0.15)'
        }
      : {
          masterNormal: '#b45309', masterHighlight: '#d97706', masterDimmed: 'rgba(180, 83, 9, 0.18)',
          influenceNormal: '#0284c7', influenceHighlight: '#0ea5e9', influenceDimmed: 'rgba(2, 132, 199, 0.18)'
        };
  }

  /**
   * @param {{isMaster: boolean, isDimmed: boolean, isHighlighted: boolean, isDark: boolean}} state
   * @returns {{color: string, width: number, opacity: number, dash: [number, number]|null, arrowScale: number}}
   */
  function edgeVisual({ isMaster, isDimmed, isHighlighted, isDark }) {
    const p = palette(isDark);
    const baseColor = isMaster ? p.masterNormal : p.influenceNormal;
    const activeColor = isMaster ? p.masterHighlight : p.influenceHighlight;
    const dimmedColor = isMaster ? p.masterDimmed : p.influenceDimmed;

    return {
      color: isDimmed ? dimmedColor : (isHighlighted ? activeColor : baseColor),
      highlightColor: activeColor,
      width: isHighlighted ? (isMaster ? 3.5 : 2.8) : (isMaster ? 2.4 : 1.6),
      opacity: isDimmed ? 0.2 : (isHighlighted ? 1.0 : 0.85),
      dash: isMaster ? null : [6, 6],
      arrowScale: isHighlighted ? 1.0 : 0.8
    };
  }

  function legendLabel(isMaster) {
    return isMaster ? 'Hoca – Öğrenci (Düz Altın Çizgi)' : 'Entelektüel Etki (Kesikli Mavi Çizgi)';
  }

  /**
   * Kenar başlığı (hover metni), iki görünümde aynı metni kullanır.
   * @param {{type: string, label: string}} rel
   */
  function edgeTitle(rel, fromName, toName) {
    const isMaster = rel.type === 'master';
    return `${legendLabel(isMaster)} (${rel.label}): ${fromName} ➔ ${toName}`;
  }

  return Object.freeze({ palette, edgeVisual, legendLabel, edgeTitle });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EdgeStyle };
}
