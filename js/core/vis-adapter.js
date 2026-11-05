/**
 * =========================================================================
 * 4. ARCHITECTURAL SEAM & ADAPTÖR (VERİ İLE GÖRÜNÜMÜ AYIRAN KATMAN)
 * =========================================================================
 * Vurgu/karartma kararları ViewFilter'da (js/core/view-filter.js) alınır;
 * bu adapter yalnızca vis-network piksel sabitleriyle state'i gösterir.
 */
class GraphToVisAdapter {
  constructor(graphDb) {
    this._db = graphDb;
  }

  // Tema girdileri artık dışarıdan enjekte edilir; verilmezse tarayıcıdaki
  // global fonksiyonlara düşer (geriye dönük uyumluluk / headless test).
  _resolveTheme({ isDark, getEraTheme: eraThemeFn }) {
    return {
      isDark: isDark !== null && isDark !== undefined
        ? isDark
        : (typeof isDarkMode === 'function' ? isDarkMode() : true),
      getEraTheme: eraThemeFn || (typeof getEraTheme === 'function' ? getEraTheme : null)
    };
  }

  toVisNodes({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD', isDark = null, getEraTheme = null } = {}) {
    const theme = this._resolveTheme({ isDark, getEraTheme });
    const isDarkModeOn = theme.isDark;
    const entities = this._db.getAllEntities();
    const view = ViewFilter.resolveViewStates(this._db, { filteredEra, focusedNodeId, highlightPath });
    const isGeo = layoutType === 'geo';
    const palette = this._dimPalette(isDarkModeOn);

    return entities.map(p => {
      const state = view.nodeStates.get(p.id) || { isDimmed: false, isHighlighted: false, isPrimaryFocus: false };
      const colors = theme.getEraTheme(p.era, isDarkModeOn ? 'dark' : 'light');
      const nodeObj = this._buildNodeVisual(p, state, colors, palette, isGeo, isDarkModeOn);
      return this._applyGeoPosition(nodeObj, p, isGeo);
    });
  }

  // Koyu / Açık tema duyarlı gölge ve donuklaştırma (dimming) renkleri
  _dimPalette(isDarkModeOn) {
    return {
      dimmedBg: isDarkModeOn ? '#090d16cc' : '#f8fafcba',
      dimmedBorder: isDarkModeOn ? '#1e293b55' : '#cbd5e166',
      dimmedFont: isDarkModeOn ? '#475569' : '#94a3b8',
      focusBorder: isDarkModeOn ? '#fbbf24' : '#d97706'
    };
  }

  _buildNodeVisual(p, state, colors, palette, isGeo, isDarkModeOn) {
    const isDimmed = state.isDimmed;
    const isHighlighted = state.isHighlighted;
    const isPrimaryFocus = state.isPrimaryFocus;
    const { dimmedBg, dimmedBorder, dimmedFont, focusBorder } = palette;

    return {
      id: p.id,
      level: this._db.getLevel(p.id),
      label: '<b>' + p.name + '</b>\n<i>' + p.dates + '</i>',
      shape: 'box',
      shapeProperties: {
        borderRadius: 10
      },
      margin: { top: 10, bottom: 10, left: 16, right: 16 },
      borderWidth: isPrimaryFocus ? 3 : (isHighlighted ? 2.5 : 1.5),
      borderWidthSelected: 3,
      color: {
        background: isDimmed ? dimmedBg : (isPrimaryFocus ? colors.highlight.background : colors.background),
        border: isDimmed ? dimmedBorder : (isPrimaryFocus ? focusBorder : colors.border),
        highlight: colors.highlight,
        hover: {
          background: colors.highlight.background,
          border: colors.highlight.border
        }
      },
      font: {
        color: isDimmed ? dimmedFont : colors.color,
        multi: 'html',
        // Atlas görünümünde kadraj sabit ölçekle (~0.62) başladığından etiketler
        // ekran üzerinde ~10px'de okunur kalsın diye geo modda biraz büyütülür
        size: isGeo ? (isPrimaryFocus ? 17 : 16) : (isPrimaryFocus ? 14 : 13),
        face: 'Inter, system-ui, sans-serif'
      },
      shadow: isDimmed ? false : {
        enabled: true,
        color: isPrimaryFocus
          ? (isDarkModeOn ? 'rgba(251, 191, 36, 0.55)' : 'rgba(217, 119, 6, 0.4)')
          : (isDarkModeOn ? 'rgba(0, 0, 0, 0.65)' : 'rgba(15, 23, 42, 0.10)'),
        size: isPrimaryFocus ? 18 : 8,
        x: 0,
        y: isPrimaryFocus ? 4 : 2
      }
    };
  }

  _applyGeoPosition(nodeObj, p, isGeo) {
    if (isGeo && window.PhilosophyGeo) {
      const geoPos = window.PhilosophyGeo.getNodePosition(p.id);
      if (geoPos) {
        nodeObj.x = geoPos.x;
        nodeObj.y = geoPos.y;
        nodeObj.fixed = { x: true, y: true };
      }
    } else {
      nodeObj.fixed = false;
    }
    return nodeObj;
  }

  toVisEdges({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD', isDark = null } = {}) {
    const theme = this._resolveTheme({ isDark });
    const isDarkModeOn = theme.isDark;
    const relations = this._db.getAllRelations();
    const view = ViewFilter.resolveViewStates(this._db, { filteredEra, focusedNodeId, highlightPath });

    const forceDir = layoutType === 'LR' ? 'horizontal' : (layoutType === 'UD' ? 'vertical' : 'none');

    // Hoca-Öğrenci (Master) = Altın Sarısı / Amber (Düz Çizgi)
    const masterNormal = isDarkModeOn ? '#f59e0b' : '#b45309';
    const masterHighlight = isDarkModeOn ? '#fbbf24' : '#d97706';
    const masterDimmed = isDarkModeOn ? 'rgba(245, 158, 11, 0.15)' : 'rgba(180, 83, 9, 0.18)';

    // Entelektüel Etki (Influence) = Gök Mavisi / Sky Blue (Kesikli Çizgi)
    const influenceNormal = isDarkModeOn ? '#38bdf8' : '#0284c7';
    const influenceHighlight = isDarkModeOn ? '#38bdf8' : '#0ea5e9';
    const influenceDimmed = isDarkModeOn ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.18)';

    return relations.map(e => {
      const state = view.edgeStates.get(e.id) || { isDimmed: false, isHighlighted: false };
      const isDimmed = state.isDimmed;
      const isEdgeHighlighted = state.isHighlighted;
      const isMaster = e.type === 'master';
      const fromNode = this._db.getEntity(e.from);
      const toNode = this._db.getEntity(e.to);

      const baseColor = isMaster ? masterNormal : influenceNormal;
      const activeColor = isMaster ? masterHighlight : influenceHighlight;
      const inactiveColor = isMaster ? masterDimmed : influenceDimmed;
      const resolvedColor = isDimmed ? inactiveColor : (isEdgeHighlighted ? activeColor : baseColor);

      return {
        id: e.id,
        from: e.from,
        to: e.to,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: isEdgeHighlighted ? 1.0 : 0.8
          }
        },
        color: {
          color: resolvedColor,
          highlight: activeColor,
          hover: activeColor,
          opacity: isDimmed ? 0.20 : 1.0
        },
        width: isEdgeHighlighted ? (isMaster ? 3.5 : 2.8) : (isMaster ? 2.4 : 1.6),
        dashes: isMaster ? false : [6, 6],
        smooth: layoutType === 'geo' ? {
          type: 'curvedCW',
          roundness: 0.18
        } : (layoutType === 'free' ? { type: 'dynamic' } : {
          type: 'cubicBezier',
          forceDirection: forceDir,
          roundness: 0.4
        }),
        title: (isMaster ? 'Hoca – Öğrenci [Düz Altın]' : 'Entelektüel Etki [Kesikli Mavi]') + ` (${e.label}): ` + (fromNode ? fromNode.name : e.from) + ' ➔ ' + (toNode ? toNode.name : e.to)
      };
    });
  }
}

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GraphToVisAdapter };
}
