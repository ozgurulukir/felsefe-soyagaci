'use strict';

/**
 * =========================================================================
 * GEO-MODE — Coğrafi mod motor seçimi (tiles ↔ atlas) durumu ve UI'ı
 * =========================================================================
 * geoAtlasMode bu namespace'in özel durumudur; app.js ham duruma dokunmaz,
 * yalnızca isAtlasMode()/setAtlasMode üzerinden etkileşime girer. Motor
 * kararı (SSOT) ViewUi.deriveEngineState'te; burada yalnızca uygulanır.
 * Üst düzey DOM erişimi yoktur (Node require güvenli).
 */
const GeoMode = (function () {

  // Coğrafi modda motor seçimi: 'tiles' (Leaflet+Esri) veya 'atlas' (yerleşik vis-canvas haritası).
  // Atlas motoru hem karo hatasında otomatik yedektir hem de araç çubuğundan manuel seçilebilir.
  let geoAtlasMode = false;

  let getLayout = null;
  let getNetwork = null;
  let getNodesDataSet = null;
  let refreshGraphVisuals = null;
  let getNetworkOptions = null;
  let getAnimOptions = null;
  let selectAndFocus = null;

  /**
   * app.js DOMContentLoaded başında çağrılır (SearchUi/PathfinderUi init'den sonra).
   * @param {object} deps — plana göre: getLayout, getNetwork, getNodesDataSet
   *   thunks + refreshGraphVisuals, getNetworkOptions, getAnimOptions, selectAndFocus
   */
  function init(deps) {
    getLayout = deps.getLayout;
    getNetwork = deps.getNetwork;
    getNodesDataSet = deps.getNodesDataSet;
    refreshGraphVisuals = deps.refreshGraphVisuals;
    getNetworkOptions = deps.getNetworkOptions;
    getAnimOptions = deps.getAnimOptions;
    selectAndFocus = deps.selectAndFocus;
  }

  // Atlas modu mu? — app.js'in ham durum okuması için tek erişim
  function isAtlasMode() {
    return geoAtlasMode;
  }

  // Geo modda gerçek karo haritası mı, yerleşik Atlas (vis-canvas) motoru mu aktif?
  // Karar ViewUi.deriveEngineState'te (SSOT); burada yalnızca uygulanır.
  function isLeafletEngine() {
    return ViewUi.deriveEngineState({ layout: getLayout(), geoAtlasMode }).isLeafletEngine;
  }

  // Geo motorları arasındaki seam: ileride üçüncü bir motor (ör. stilize tema) buraya eklenir.
  // Leaflet kütüphanesi (CDN) yüklenemediysen null döner — çağıran taraf Atlas'a düşebilir.
  function initLeafletIfNeeded() {
    if (!window.LeafletMapManager) return null;
    if (!window.LeafletMapManager.isInitialized) {
      window.LeafletMapManager.init('map-container', function (id) {
        selectAndFocus(id);
      }, handleTileFailure);
      if (!window.LeafletMapManager.isInitialized) return null;
    }
    return window.LeafletMapManager;
  }

  // Esri karoları yüklenemediğinde (leaflet-map.js'teki sezgi oturum başına bir kez tetikler)
  // yerleşik Atlas motoruna otomatik geç
  function handleTileFailure() {
    if (getLayout() !== 'geo' || geoAtlasMode) return;
    setGeoAtlasMode(true, 'Harita karoları yüklenemedi — yerleşik Atlas görünümüne geçildi.');
  }

  // Atlas kadrajı: tüm dünyayı fit() ile sığdırmak ölçeği ~0.35'e düşürüp etiketleri
  // okunmaz hâle getirir; bunun yerine projeksiyon merkezi (42°N, 18°E — Akdeniz çekirdeği,
  // Math: projectRaw(42,18) = {0,0}) sabit ve okunabilir bir ölçekle gösterilir.
  function getAtlasInitialScale() {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 0.42 : 0.62;
  }

  function frameAtlasView(animate = true) {
    const network = getNetwork();
    if (!network) return;
    network.moveTo({
      position: { x: 0, y: 0 },
      scale: getAtlasInitialScale(),
      animation: animate ? getAnimOptions(700) : false
    });
  }

  // Etkin geo motorunu kaplara, görsellere ve kadraja uygula
  function activateGeoEngine() {
    applyGeoContainerVisibility();
    updateGeoModeToggle();

    if (isLeafletEngine()) {
      const lm = initLeafletIfNeeded();
      if (!lm) {
        // Leaflet kütüphanesi yüklenemedi: çalışır durumdaki tek motora (Atlas) düş
        setGeoAtlasMode(true, 'Harita kütüphanesi yüklenemedi — yerleşik Atlas görünümü kullanılıyor.');
        return;
      }
      lm.invalidateSize();
      refreshGraphVisuals();
      setTimeout(() => lm.fitAll(), 150);
    } else if (getNetwork()) {
      const network = getNetwork();
      const nodesDataSet = getNodesDataSet();
      // Atlas motoru: hiyerarşi/fizik kapalı geo seçenekleri uygulanmadan dataset güncellemesi
      // hiyerarşi düzen motorunu tetikler ve sabit harita konumlarını ezer
      network.setOptions(getNetworkOptions('geo'));
      refreshGraphVisuals();
      // vis-network, update() ile gelen x/y'yi yalnızca düğüm OLUŞTURULURKEN uygular;
      // mevcut düğümler (ör. UD'den geçişte) harita projeksiyonuna açıkça taşınmalı
      if (nodesDataSet && window.PhilosophyGeo) {
        nodesDataSet.forEach(node => {
          const pos = window.PhilosophyGeo.getNodePosition(node.id);
          network.moveNode(node.id, pos.x, pos.y);
        });
      }
      setTimeout(() => {
        frameAtlasView();
      }, 200);
    }
  }

  function setGeoAtlasMode(on, notice) {
    if (geoAtlasMode === on) return;
    geoAtlasMode = on;
    activateGeoEngine();
    if (notice) showGeoNotice(notice);
  }

  function updateGeoModeToggle() {
    const btn = document.getElementById('geo-mode-toggle-btn');
    if (!btn) return;
    const isGeo = getLayout() === 'geo';
    btn.classList.toggle('hidden', !isGeo);
    btn.setAttribute('aria-pressed', String(geoAtlasMode));
    btn.title = geoAtlasMode ? 'Esri Karo Haritasına Geç' : 'Yerleşik Atlas Görünümüne Geç';
    btn.setAttribute('aria-label', btn.title);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = geoAtlasMode
        ? 'fa-solid fa-globe text-teal-600 dark:text-teal-400 text-xs'
        : 'fa-solid fa-atlas text-amber-600 dark:text-amber-400 text-xs';
    }
  }

  function applyGeoContainerVisibility() {
    const netContainer = document.getElementById('network-container');
    const mapContainer = document.getElementById('map-container');

    const { visibleContainer } = ViewUi.deriveEngineState({ layout: getLayout(), geoAtlasMode });
    const showMap = visibleContainer === 'tiles';
    const showAtlas = visibleContainer === 'atlas';
    if (mapContainer) mapContainer.classList.toggle('hidden', !showMap);
    if (netContainer) netContainer.classList.toggle('hidden', !(showAtlas || visibleContainer === 'graph'));
  }

  // Geçici durum bildirimi (motor değişimi vb.) — aria-live ile ekran okuyuculara da duyurulur
  function showGeoNotice(text) {
    const old = document.getElementById('geo-mode-notice');
    if (old) old.remove();
    const pill = document.createElement('div');
    pill.id = 'geo-mode-notice';
    pill.setAttribute('role', 'status');
    pill.setAttribute('aria-live', 'polite');
    pill.className = 'floating-island absolute left-1/2 -translate-x-1/2 bottom-6 z-40 rounded-full px-4 py-1.5 text-xs text-slate-700 dark:text-slate-200';
    pill.textContent = text;
    document.querySelector('main').appendChild(pill);
    setTimeout(() => pill.remove(), 3800);
  }

  // Genel API — app.js plan tablosundaki adlarla çağırır (activateEngine/setAtlasMode/...)
  return Object.freeze({
    init,
    isAtlasMode,
    setAtlasMode: setGeoAtlasMode,
    isLeafletEngine,
    activateEngine: activateGeoEngine,
    updateModeToggle: updateGeoModeToggle,
    applyContainerVisibility: applyGeoContainerVisibility,
    frameAtlasView,
    initLeafletIfNeeded,
    handleTileFailure,
    getAtlasInitialScale,
    showGeoNotice
  });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GeoMode };
}
