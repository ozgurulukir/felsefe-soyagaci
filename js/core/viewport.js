/**
 * =========================================================================
 * VIEWPORT — Kamera davranışının tek doğruluk kaynağı (SSOT)
 * =========================================================================
 * "Görünümü kim yönetiyor?" sorusunun tek cevabı: aktif motor Leaflet
 * (karo harita) ise LeafletMapManager, değilse vis-network ağı; geo düzenin
 * Atlas motorunda ise kadraj GeoMode.frameAtlasView ile yapılır. Bu motor
 * seçimi daha önce zoom-in/zoom-out/fit/odak çağrı noktalarında ayrı ayrı,
 * farklı animasyon süreleriyle tekrarlanıyordu; artık tek yerde.
 *
 * Saf değildir; motorlara enjekte edilen thunk'lar üzerinden gider
 * (GeoMode.init ile aynı desen). Node.js'te sahte motorlarla test edilir.
 */
const Viewport = (function () {
  // Yakınlaştırma ve odak sabitleri — tek yerde, iki motorda da aynı
  const FOCUS_SCALE = 1.15;
  const ZOOM_IN_FACTOR = 1.3;
  const ZOOM_OUT_FACTOR = 0.7;
  const FOCUS_ANIM_MS = 600;
  const FIT_ANIM_MS = 600;
  const ZOOM_ANIM_MS = 300;

  let getNetwork = null;
  let getAnimOptions = null;
  let isLeafletReady = null;
  let getLeafletManager = null; // thunk: GeoMode.isLeafletReady() doğruysa LeafletMapManager
  let isGeoLayout = null;       // thunk: aktif düzen 'geo' mu?
  let frameAtlas = null;        // thunk: Atlas kadrajı (GeoMode.frameAtlasView)

  /**
   * app.js DOMContentLoaded başında çağrılır.
   * @param {object} deps — getNetwork, getAnimOptions, isLeafletReady,
   *   getLeafletManager, isGeoLayout, frameAtlas (hepsi thunk)
   */
  function init(deps) {
    getNetwork = deps.getNetwork;
    getAnimOptions = deps.getAnimOptions;
    isLeafletReady = deps.isLeafletReady;
    getLeafletManager = deps.getLeafletManager;
    isGeoLayout = deps.isGeoLayout;
    frameAtlas = deps.frameAtlas;
  }

  function zoomIn() {
    if (isLeafletReady()) {
      getLeafletManager().zoomIn();
    } else {
      const network = getNetwork();
      if (!network) return;
      network.moveTo({ scale: network.getScale() * ZOOM_IN_FACTOR, animation: getAnimOptions(ZOOM_ANIM_MS) });
    }
  }

  function zoomOut() {
    if (isLeafletReady()) {
      getLeafletManager().zoomOut();
    } else {
      const network = getNetwork();
      if (!network) return;
      network.moveTo({ scale: network.getScale() * ZOOM_OUT_FACTOR, animation: getAnimOptions(ZOOM_ANIM_MS) });
    }
  }

  /**
   * Tüm görünümü sığdır: Leaflet'te fitAll, geo+Atlas'ta kadraj, ağda fit.
   */
  function fitAll() {
    if (isLeafletReady()) {
      getLeafletManager().fitAll();
    } else if (isGeoLayout()) {
      frameAtlas();
    } else {
      const network = getNetwork();
      if (!network) return;
      network.fit({ animation: getAnimOptions(FIT_ANIM_MS) });
    }
  }

  /**
   * Verilen düğüm kümesini sığdır (dönem filtresi, Etki Köprüsü yolu).
   * @param {string[]} nodeIds
   */
  function fitNodes(nodeIds) {
    if (!nodeIds || nodeIds.length === 0) return;
    if (isLeafletReady()) {
      getLeafletManager().fitPath(nodeIds);
    } else {
      const network = getNetwork();
      if (!network) return;
      network.fit({ nodes: nodeIds, animation: getAnimOptions(FIT_ANIM_MS) });
    }
  }

  /**
   * Düğümü seç ve kamerayı odakla (selectAndFocus'un kamera yarısı).
   * @param {string} id
   * @param {object} db — Leaflet odaklaması için graf veritabanı
   */
  function focusNode(id, db) {
    if (isLeafletReady()) {
      getLeafletManager().focusNode(id, db);
    } else {
      const network = getNetwork();
      if (!network) return;
      network.selectNodes([id]);
      network.focus(id, {
        scale: FOCUS_SCALE,
        animation: getAnimOptions(FOCUS_ANIM_MS)
      });
    }
  }

  return Object.freeze({
    FOCUS_SCALE, ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR, FOCUS_ANIM_MS, FIT_ANIM_MS, ZOOM_ANIM_MS,
    init, zoomIn, zoomOut, fitAll, fitNodes, focusNode
  });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Viewport };
}
