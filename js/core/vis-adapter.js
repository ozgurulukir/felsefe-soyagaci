/**
 * =========================================================================
 * 4. ARCHITECTURAL SEAM & ADAPTÖR (VERİ İLE GÖRÜNÜMÜ AYIRAN KATMAN)
 * =========================================================================
 */
class GraphToVisAdapter {
  constructor(graphDb) {
    this._db = graphDb;
  }

  toVisNodes({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD' } = {}) {
    const isDark = isDarkMode();
    const entities = this._db.getAllEntities();
    const neighborhood = focusedNodeId ? this._db.getNeighborhoodSet(focusedNodeId) : null;
    const pathSet = highlightPath ? new Set(highlightPath) : null;
    const isGeo = layoutType === 'geo';

    return entities.map(p => {
      const colors = getEraTheme(p.era);
      
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

      const isPrimaryFocus = (focusedNodeId === p.id) || (pathSet && (highlightPath[0] === p.id || highlightPath[highlightPath.length - 1] === p.id));

      // Koyu / Açık tema duyarlı gölge ve donuklaştırma (dimming) renkleri
      const dimmedBg = isDark ? '#090d16cc' : '#f8fafcba';
      const dimmedBorder = isDark ? '#1e293b55' : '#cbd5e166';
      const dimmedFont = isDark ? '#475569' : '#94a3b8';
      const focusBorder = isDark ? '#fbbf24' : '#d97706';

      const nodeObj = {
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
            ? (isDark ? 'rgba(251, 191, 36, 0.55)' : 'rgba(217, 119, 6, 0.4)') 
            : (isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(15, 23, 42, 0.10)'),
          size: isPrimaryFocus ? 18 : 8,
          x: 0,
          y: isPrimaryFocus ? 4 : 2
        }
      };

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
    });
  }

  toVisEdges({ filteredEra = 'all', focusedNodeId = null, highlightPath = null, layoutType = 'UD' } = {}) {
    const isDark = isDarkMode();
    const relations = this._db.getAllRelations();
    const pathEdges = new Set();

    if (highlightPath && highlightPath.length > 1) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        pathEdges.add(highlightPath[i] + '->' + highlightPath[i + 1]);
        pathEdges.add(highlightPath[i + 1] + '->' + highlightPath[i]);
      }
    }

    const forceDir = layoutType === 'LR' ? 'horizontal' : (layoutType === 'UD' ? 'vertical' : 'none');

    // Hoca-Öğrenci (Master) = Altın Sarısı / Amber (Düz Çizgi)
    const masterNormal = isDark ? '#f59e0b' : '#b45309';
    const masterHighlight = isDark ? '#fbbf24' : '#d97706';
    const masterDimmed = isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(180, 83, 9, 0.18)';

    // Entelektüel Etki (Influence) = Gök Mavisi / Sky Blue (Kesikli Çizgi)
    const influenceNormal = isDark ? '#38bdf8' : '#0284c7';
    const influenceHighlight = isDark ? '#38bdf8' : '#0ea5e9';
    const influenceDimmed = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.18)';

    return relations.map(e => {
      const isMaster = e.type === 'master';
      const fromNode = this._db.getEntity(e.from);
      const toNode = this._db.getEntity(e.to);

      let isDimmed = false;
      let isEdgeHighlighted = false;

      if (highlightPath) {
        isEdgeHighlighted = pathEdges.has(e.from + '->' + e.to);
        isDimmed = !isEdgeHighlighted;
      } else if (focusedNodeId) {
        isEdgeHighlighted = (e.from === focusedNodeId || e.to === focusedNodeId);
        isDimmed = !isEdgeHighlighted;
      } else if (filteredEra !== 'all') {
        isDimmed = (fromNode && fromNode.era !== filteredEra) && (toNode && toNode.era !== filteredEra);
      }

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
