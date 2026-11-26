/**
 * =========================================================================
 * FELSEFE SOYAĞACI — DÜNYA HARİTASI (LEAFLET.JS ENTEGRASYONU)
 * =========================================================================
 * Gerçek dünya haritası üzerinde 79 düşünür ve 159 fikri bağlantının
 * kavisli jeodezik yaylarla (flight-path arcs) interaktif görselleştirmesi.
 */

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

const LeafletMapManager = (function () {
  let map = null;
  let tileLayer = null;
  let markersLayer = null;
  let edgesLayer = null;
  let isMapInitialized = false;
  // Veri katmanı bağımlılıkları init ile enjekte edilir (window.PhilosophyGeo küresel okuması yerine)
  let geoProvider = null;

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

  // options.geo: koordinat sağlayıcısı (PhilosophyGeo). Enjekte edilmezse render/focus/fit sessizce no-op olur.
  function init(containerId, onSelectNode, onTileFailure, { geo = null } = {}) {
    if (isMapInitialized) return;
    if (typeof L === 'undefined') {
      console.error('[Leaflet Error] Leaflet kütüphanesi yüklenemedi.');
      return;
    }
    geoProvider = geo;

    const isDark = Theme.isDark();
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

  function render({ db, filteredEra = 'all', focusedNodeId = null, highlightPath = null, isDark = true, getEraTheme = null, onSelectNode }) {
    if (!map || !isMapInitialized) return;

    markersLayer.clearLayers();
    edgesLayer.clearLayers();

    if (!geoProvider) return;

    // Tema girdisi dışarıdan enjekte edilir (vis-adapter'daki sözleşmeyle aynı)
    if (typeof getEraTheme !== 'function') {
      throw new Error('[LeafletMapManager] getEraTheme enjekte edilmeli (render).');
    }

    // Vurgu/karartma kararları ortak ViewFilter modülünden gelir (graf görünümüyle aynı semantik)
    const view = ViewFilter.resolveViewStates(db, { filteredEra, focusedNodeId, highlightPath });

    // 1. Kenarları (İlişkileri) Kavisli Yaylar Olarak Çiz
    const relations = db.getAllRelations();
    relations.forEach(rel => {
      const pFrom = db.getEntity(rel.from);
      const pTo = db.getEntity(rel.to);
      if (!pFrom || !pTo) return;

      const c1 = geoProvider.getPhilosopherLatLng(rel.from);
      const c2 = geoProvider.getPhilosopherLatLng(rel.to);
      if (!c1 || !c2) return;

      const edgeState = view.edgeStates.get(rel.id) || { isDimmed: false, isHighlighted: false };
      const isDimmed = edgeState.isDimmed;
      const isEdgeHighlighted = edgeState.isHighlighted;
      const isMaster = rel.type === 'master';
      const visual = EdgeStyle.edgeVisual({ isMaster, isDimmed, isHighlighted: isEdgeHighlighted, isDark });

      const arcPoints = getCurvedArcPoints(c1, c2, 0.12);

      const polyline = L.polyline(arcPoints, {
        color: visual.color,
        weight: visual.width,
        dashArray: visual.dash ? visual.dash.join(', ') : null,
        opacity: visual.opacity,
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.bindTooltip(
        `<b>${HtmlEscape.escape(pFrom.name)}</b> ➔ <b>${HtmlEscape.escape(pTo.name)}</b><br>` +
        // İşaret rengi EdgeStyle paletinden (SSOT): highlight tonu, iki motorda da aynı
        `<span style="color: ${EdgeStyle.palette(isDark)[isMaster ? 'masterHighlight' : 'influenceHighlight']}; font-weight: 600;">` +
        `${isMaster ? '● ' : '╌ '}${EdgeStyle.legendLabel(isMaster)}</span><br>` +
        `<span style="opacity: 0.85;">${HtmlEscape.escape(rel.label)}</span>`,
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
      const coords = geoProvider.getPhilosopherLatLng(p.id);
      if (!coords) return;

      const nodeState = view.nodeStates.get(p.id) || { isDimmed: false, isHighlighted: false, isPrimaryFocus: false };
      const isDimmed = nodeState.isDimmed;
      const isHighlighted = nodeState.isHighlighted;
      const isPrimaryFocus = nodeState.isPrimaryFocus;
      const theme = getEraTheme(p.era, isDark ? 'dark' : 'light');

      const markerHtml = `
        <div class="geo-philosopher-pill ${isPrimaryFocus ? 'is-focused' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${isDimmed ? 'is-dimmed' : ''}" style="--era-color: ${theme.border}; --era-bg: ${theme.background};">
          <span class="geo-dot" style="background: ${theme.border};"></span>
          <span class="geo-name">${HtmlEscape.escape(p.name)}</span>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'geo-marker-wrapper',
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker(coords, { icon });
      marker.bindTooltip(`<b>${HtmlEscape.escape(p.name)}</b> (${HtmlEscape.escape(p.dates)})<br><span style="opacity:0.8;">${HtmlEscape.escape(p.school)}</span><br><i>📍 ${HtmlEscape.escape(p.city)}</i>`, {
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
    if (!map || !geoProvider) return;
    const coords = geoProvider.getPhilosopherLatLng(id);
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
    if (!map || !geoProvider || !pathIds || pathIds.length === 0) return;
    const coordsList = pathIds.map(id => geoProvider.getPhilosopherLatLng(id)).filter(Boolean);
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

// Node.js (test) ortamında saf yay matematiği ve yönetici dışa açılır
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LeafletMapManager, getCurvedArcPoints };
}
