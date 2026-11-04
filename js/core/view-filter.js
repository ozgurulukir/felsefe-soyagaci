/**
 * =========================================================================
 * VIEW FILTER — GRAF GÖRÜNÜMÜ VE HARİTA GÖRÜNÜMÜNÜN ORTAK VURGU BEYNİ
 * =========================================================================
 * Graf (vis-network) ve harita (Leaflet) görünümlerinin ikisi de aynı
 * soruya cevap vermek zorunda: "Bu düğüm/kenar şu an soluk mu, vurgulu mu?"
 * Bu modül o kararları tek yerde toplar (deep module); adapter'lar yalnızca
 * kendi piksel sabitleriyle (renk, kalınlık, opaklık) state'i gösterir.
 *
 * Saf ve DOM'dan bağımsızdır: yalnızca db arayüzüne ihtiyaç duyar
 * (getAllEntities, getAllRelations, getNeighborhoodSet).
 */
const ViewFilter = (function () {

  /**
   * @param {object} db  PhilosophyGraphDatabase benzeri arayüz
   * @param {object} ctx { filteredEra, focusedNodeId, highlightPath }
   * @returns {{
   *   nodeStates: Map<string, {isDimmed, isHighlighted, isPrimaryFocus}>,
   *   edgeStates: Map<string, {isDimmed, isHighlighted}>,
   *   pathSet: Set|null,
   *   pathEdges: Set
   * }}
   */
  function resolveViewStates(db, { filteredEra = 'all', focusedNodeId = null, highlightPath = null } = {}) {
    const pathSet = highlightPath ? new Set(highlightPath) : null;
    const neighborhood = focusedNodeId ? db.getNeighborhoodSet(focusedNodeId) : null;

    // Yol kenarlarını her iki yönde de kaydet (yönsüz vurgu)
    const pathEdges = new Set();
    if (highlightPath && highlightPath.length > 1) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        pathEdges.add(highlightPath[i] + '->' + highlightPath[i + 1]);
        pathEdges.add(highlightPath[i + 1] + '->' + highlightPath[i]);
      }
    }

    // Öncelik sırası: yol > komşuluk (odak) > dönem filtresi
    const nodeStates = new Map();
    for (const p of db.getAllEntities()) {
      let isDimmed = false;
      let isHighlighted = false;

      if (pathSet) {
        isHighlighted = pathSet.has(p.id);
        isDimmed = !isHighlighted;
      } else if (neighborhood) {
        isHighlighted = neighborhood.has(p.id);
        isDimmed = !isHighlighted;
      } else if (filteredEra !== 'all') {
        isDimmed = p.era !== filteredEra;
      }

      const isPrimaryFocus = (focusedNodeId === p.id) ||
        (pathSet && (highlightPath[0] === p.id || highlightPath[highlightPath.length - 1] === p.id));

      nodeStates.set(p.id, { isDimmed, isHighlighted, isPrimaryFocus });
    }

    const edgeStates = new Map();
    for (const e of db.getAllRelations()) {
      const fromNode = db.getEntity(e.from);
      const toNode = db.getEntity(e.to);

      let isDimmed = false;
      let isHighlighted = false;

      if (highlightPath) {
        isHighlighted = pathEdges.has(e.from + '->' + e.to);
        isDimmed = !isHighlighted;
      } else if (focusedNodeId) {
        isHighlighted = (e.from === focusedNodeId || e.to === focusedNodeId);
        isDimmed = !isHighlighted;
      } else if (filteredEra !== 'all') {
        // Kenar ancak iki ucu da filtrelenen dönemin dışındaysa soluklaşır
        isDimmed = (!fromNode || fromNode.era !== filteredEra) && (!toNode || toNode.era !== filteredEra);
      }

      edgeStates.set(e.id, { isDimmed, isHighlighted });
    }

    return { nodeStates, edgeStates, pathSet, pathEdges };
  }

  return Object.freeze({ resolveViewStates });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ViewFilter };
}
