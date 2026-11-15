/**
 * =========================================================================
 * 4. ARCHITECTURAL SEAM & ADAPTÖR (VERİ İLE GÖRÜNÜMÜ AYIRAN KATMAN)
 * =========================================================================
 * Vurgu/karartma kararları ViewFilter'da (js/core/view-filter.js) alınır;
 * bu adapter yalnızca vis-network piksel sabitleriyle state'i gösterir.
 */
class GraphToVisAdapter {
  // geo, veri katmanındaki koordinat sağlayıcısıdır (PhilosophyGeo); enjekte edilmezse
  // geo konumlandırma devre dışı kalır (non-geo davranış: fixed=false)
  constructor(graphDb, { geo = null } = {}) {
    this._db = graphDb;
    this._geo = geo;
  }

  // Tema girdileri dışarıdan enjekte edilir (isDark zorunlu; getEraTheme düğümler için zorunlu)
  _resolveTheme({ isDark, getEraTheme: eraThemeFn }) {
    if (typeof isDark !== 'boolean') {
      throw new Error('[VisAdapter] isDark enjekte edilmeli (true/false).');
    }
    return { isDark, getEraTheme: eraThemeFn || null };
  }

  toVisNodes({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD', isDark = null, getEraTheme = null, view = null } = {}) {
    const theme = this._resolveTheme({ isDark, getEraTheme });
    if (!theme.getEraTheme) {
      throw new Error('[VisAdapter] getEraTheme enjekte edilmeli (toVisNodes).');
    }
    const isDarkModeOn = theme.isDark;
    const entities = this._db.getAllEntities();
    if (!view) view = ViewFilter.resolveViewStates(this._db, { filteredEra, focusedNodeId, highlightPath });
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
    if (isGeo && this._geo) {
      const geoPos = this._geo.getNodePosition(p.id);
      if (geoPos) {
        nodeObj.x = geoPos.x;
        nodeObj.y = geoPos.y;
        nodeObj.fixed = { x: true, y: true };
      } else {
        // Koordinatı olmayan düşünür serbest kalır (vis-network varsayılanı zaten fixed=false)
        nodeObj.fixed = false;
      }
    } else {
      nodeObj.fixed = false;
    }
    return nodeObj;
  }

  // Düğümleri ve kenarları tek geçişte üretir; ViewFilter yalnızca bir kez çözülür
  toVisGraph(ctx = {}) {
    const view = ViewFilter.resolveViewStates(this._db, ctx);
    return {
      nodes: this.toVisNodes({ ...ctx, view }),
      edges: this.toVisEdges({ ...ctx, view })
    };
  }

  toVisEdges({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD', isDark = null, view = null } = {}) {
    const theme = this._resolveTheme({ isDark });
    const isDarkModeOn = theme.isDark;
    const relations = this._db.getAllRelations();
    if (!view) view = ViewFilter.resolveViewStates(this._db, { filteredEra, focusedNodeId, highlightPath });

    const forceDir = layoutType === 'LR' ? 'horizontal' : (layoutType === 'UD' ? 'vertical' : 'none');

    return relations.map(e => {
      const state = view.edgeStates.get(e.id) || { isDimmed: false, isHighlighted: false };
      const isDimmed = state.isDimmed;
      const isEdgeHighlighted = state.isHighlighted;
      const isMaster = e.type === 'master';
      const fromNode = this._db.getEntity(e.from);
      const toNode = this._db.getEntity(e.to);
      const visual = EdgeStyle.edgeVisual({ isMaster, isDimmed, isHighlighted: isEdgeHighlighted, isDark: isDarkModeOn });

      return {
        id: e.id,
        from: e.from,
        to: e.to,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: visual.arrowScale
          }
        },
        color: {
          color: visual.color,
          highlight: visual.highlightColor,
          hover: visual.highlightColor,
          opacity: visual.opacity
        },
        width: visual.width,
        dashes: visual.dash || false,
        smooth: layoutType === 'geo' ? {
          type: 'curvedCW',
          roundness: 0.18
        } : (layoutType === 'free' ? { type: 'dynamic' } : {
          type: 'cubicBezier',
          forceDirection: forceDir,
          roundness: 0.4
        }),
        title: EdgeStyle.edgeTitle(e, fromNode ? fromNode.name : e.from, toNode ? toNode.name : e.to)
      };
    });
  }
}

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GraphToVisAdapter };
}
