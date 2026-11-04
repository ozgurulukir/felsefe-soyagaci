/**
 * =========================================================================
 * FELSEFE SOYAĞACI — DÜNYA HARİTASI (LEAFLET.JS ENTEGRASYONU)
 * =========================================================================
 * Gerçek dünya haritası üzerinde 79 düşünür ve 136 fikri bağlantının
 * kavisli jeodezik yaylarla (flight-path arcs) interaktif görselleştirmesi.
 */

const LeafletMapManager = (function () {
  let map = null;
  let tileLayer = null;
  let markersLayer = null;
  let edgesLayer = null;
  let isMapInitialized = false;

  // Karo hata sezgisi: art arda hata, tek başarılı yükleme bile olmadan birikirse
  // onTileFailure callback'i (yerleşik Atlas motoruna geçiş) bir kez tetiklenir.
  let tileErrorCount = 0;
  let tileLoadCount = 0;
  let tileFailureReported = false;
  let tileFailureCallback = null;

  const TILES = {
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  };

  // İki coğrafi nokta arasında hafif kavisli yay (Quadratic Bezier) noktaları üretir
  function getCurvedArcPoints(p1, p2, curveFactor = 0.14) {
    const lat1 = p1[0];
    const lng1 = p1[1];
    const lat2 = p2[0];
    const lng2 = p2[1];

    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    // Normal vektör ile hafif kavisleme
    const ctrlLat = midLat - dLng * curveFactor;
    const ctrlLng = midLng + dLat * curveFactor;

    const points = [];
    const segments = 16;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
      const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
      points.push([lat, lng]);
    }
    return points;
  }

  function init(containerId, onSelectNode, onTileFailure) {
    if (isMapInitialized) return;
    if (typeof L === 'undefined') {
      console.error('[Leaflet Error] Leaflet kütüphanesi yüklenemedi.');
      return;
    }

    const isDark = typeof isDarkMode === 'function' ? isDarkMode() : true;
    tileFailureCallback = typeof onTileFailure === 'function' ? onTileFailure : null;

    // Akdeniz / Avrasya odaklı başlangıç görünümü (İskoçya'dan Horasan'a, Kurtuba'dan İskenderiye'ye)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    map = L.map(containerId, {
      center: [41.5, 18.0],
      zoom: isMobile ? 3.0 : 3.8,
      // Kesirli başlangıç zoom'undan tamsayıya sıçramayı önler (zoomIn: 3.8 → 4.8)
      zoomSnap: 0.25,
      minZoom: 2.8,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Zoom kontrolü sayfanın kendi şık yüzen butonları (#zoom-in-btn, #zoom-out-btn) ile yönetilir
    // Esri karo kullanım şartları gereği atıf gösterilir (konum: sağ alt, temalı stil styles.css'te)
    L.control
      .attribution({ position: 'bottomright', prefix: false })
      .addAttribution(TILES.attribution)
      .addTo(map);

    tileLayer = L.tileLayer(isDark ? TILES.dark : TILES.light, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayer.on('tileload', () => {
      tileLoadCount++;
    });
    tileLayer.on('tileerror', () => {
      tileErrorCount++;
      if (!tileFailureReported && tileErrorCount >= 3 && tileLoadCount === 0) {
        tileFailureReported = true;
        if (tileFailureCallback) tileFailureCallback();
      }
    });

    edgesLayer = L.layerGroup().addTo(map);
    markersLayer = L.layerGroup().addTo(map);

    isMapInitialized = true;
  }

  function setTheme(isDark) {
    if (!tileLayer) return;
    tileLayer.setUrl(isDark ? TILES.dark : TILES.light);
  }

  function render({ db, filteredEra = 'all', focusedNodeId = null, highlightPath = null, isDark = true, onSelectNode }) {
    if (!map || !isMapInitialized) return;

    markersLayer.clearLayers();
    edgesLayer.clearLayers();

    if (!window.PhilosophyGeo) return;

    const pathSet = highlightPath ? new Set(highlightPath) : null;
    const neighborhood = focusedNodeId ? db.getNeighborhoodSet(focusedNodeId) : null;
    const pathEdges = new Set();

    if (highlightPath && highlightPath.length > 1) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        pathEdges.add(highlightPath[i] + '->' + highlightPath[i + 1]);
        pathEdges.add(highlightPath[i + 1] + '->' + highlightPath[i]);
      }
    }

    // Hoca-Öğrenci (Master) = Altın Sarısı / Amber (Düz Çizgi)
    const masterNormal = isDark ? '#f59e0b' : '#b45309';
    const masterHighlight = isDark ? '#fbbf24' : '#d97706';
    const masterDimmed = isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(180, 83, 9, 0.15)';

    // Entelektüel Etki (Influence) = Gök Mavisi / Sky Blue (Kesikli Çizgi)
    const influenceNormal = isDark ? '#38bdf8' : '#0284c7';
    const influenceHighlight = isDark ? '#38bdf8' : '#0ea5e9';
    const influenceDimmed = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.15)';

    // 1. Kenarları (İlişkileri) Kavisli Yaylar Olarak Çiz
    const relations = db.getAllRelations();
    relations.forEach(rel => {
      const pFrom = db.getEntity(rel.from);
      const pTo = db.getEntity(rel.to);
      if (!pFrom || !pTo) return;

      const c1 = window.PhilosophyGeo.getPhilosopherLatLng(rel.from);
      const c2 = window.PhilosophyGeo.getPhilosopherLatLng(rel.to);
      if (!c1 || !c2) return;

      let isDimmed = false;
      let isEdgeHighlighted = false;

      if (highlightPath) {
        isEdgeHighlighted = pathEdges.has(rel.from + '->' + rel.to);
        isDimmed = !isEdgeHighlighted;
      } else if (focusedNodeId) {
        isEdgeHighlighted = (rel.from === focusedNodeId || rel.to === focusedNodeId);
        isDimmed = !isEdgeHighlighted;
      } else if (filteredEra !== 'all') {
        isDimmed = (pFrom.era !== filteredEra && pTo.era !== filteredEra);
      }

      const isMaster = rel.type === 'master';
      const baseColor = isMaster ? masterNormal : influenceNormal;
      const activeColor = isMaster ? masterHighlight : influenceHighlight;
      const inactiveColor = isMaster ? masterDimmed : influenceDimmed;
      const resolvedColor = isDimmed ? inactiveColor : (isEdgeHighlighted ? activeColor : baseColor);

      const arcPoints = getCurvedArcPoints(c1, c2, 0.12);

      const polyline = L.polyline(arcPoints, {
        color: resolvedColor,
        weight: isEdgeHighlighted ? (isMaster ? 3.5 : 2.8) : (isMaster ? 2.4 : 1.5),
        dashArray: isMaster ? null : '6, 7',
        opacity: isDimmed ? 0.18 : (isEdgeHighlighted ? 1.0 : 0.85),
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.bindTooltip(
        `<b>${pFrom.name}</b> ➔ <b>${pTo.name}</b><br>` +
        `<span style="color: ${isMaster ? '#fbbf24' : '#38bdf8'}; font-weight: 600;">` +
        `${isMaster ? '● Hoca – Öğrenci (Düz Altın Çizgi)' : '╌ Entelektüel Etki (Kesikli Mavi Çizgi)'}</span><br>` +
        `<span style="opacity: 0.85;">${rel.label}</span>`,
        {
          sticky: true,
          direction: 'top',
          className: 'geo-arc-tooltip'
        }
      );

      edgesLayer.addLayer(polyline);
    });

    // 2. Düğümleri (Filozofları) Şık HTML Hapları (Pill Markers) Olarak Yerleştir
    const entities = db.getAllEntities();
    entities.forEach(p => {
      const coords = window.PhilosophyGeo.getPhilosopherLatLng(p.id);
      if (!coords) return;

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
      const theme = getEraTheme(p.era);

      const markerHtml = `
        <div class="geo-philosopher-pill ${isPrimaryFocus ? 'is-focused' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${isDimmed ? 'is-dimmed' : ''}" style="--era-color: ${theme.border}; --era-bg: ${theme.background};">
          <span class="geo-dot" style="background: ${theme.border};"></span>
          <span class="geo-name">${p.name}</span>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'geo-marker-wrapper',
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker(coords, { icon });
      marker.bindTooltip(`<b>${p.name}</b> (${p.dates})<br><span style="opacity:0.8;">${p.school}</span><br><i>📍 ${p.city}</i>`, {
        direction: 'top',
        offset: [0, -14],
        className: 'geo-node-tooltip'
      });

      marker.on('click', () => {
        if (typeof onSelectNode === 'function') {
          onSelectNode(p.id);
        }
      });

      markersLayer.addLayer(marker);
    });
  }

  function focusNode(id, db) {
    if (!map || !window.PhilosophyGeo) return;
    const coords = window.PhilosophyGeo.getPhilosopherLatLng(id);
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 6), { duration: 1.2 });
    }
  }

  function fitAll() {
    if (!map) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    map.setView([41.5, 18.0], isMobile ? 3.0 : 3.8);
  }

  function fitPath(pathIds) {
    if (!map || !window.PhilosophyGeo || !pathIds || pathIds.length === 0) return;
    const coordsList = pathIds.map(id => window.PhilosophyGeo.getPhilosopherLatLng(id)).filter(Boolean);
    if (coordsList.length > 1) {
      map.fitBounds(L.latLngBounds(coordsList).pad(0.25), { animate: true, duration: 1.0 });
    }
  }

  function invalidateSize() {
    if (map) {
      setTimeout(() => map.invalidateSize(), 150);
    }
  }

  function zoomIn() { if (map) map.zoomIn(); }
  function zoomOut() { if (map) map.zoomOut(); }

  return Object.freeze({
    init,
    setTheme,
    render,
    focusNode,
    fitAll,
    fitPath,
    zoomIn,
    zoomOut,
    invalidateSize,
    get isInitialized() { return isMapInitialized; }
  });
})();

if (typeof window !== 'undefined') {
  window.LeafletMapManager = LeafletMapManager;
}
