'use strict';

/**
 * =========================================================================
 * PATHFINDER-UI — Entelektüel Etki Köprüsü (Pathfinder) paneli
 * =========================================================================
 * populatePathfinderSelects + runPathfinder. Ortak durum (currentSelectedId /
 * currentHighlightPath) app.js'te kalır (SSOT); setPathState ile yazılır.
 * Olay BAĞLANTILARI app.js DOMContentLoaded'da kalır; burada yalnızca
 * işleyiciler vardır. Üst düzey DOM erişimi yoktur (Node require güvenli).
 */
const PathfinderUi = (function () {

  let graphDb = null;
  let getNetwork = null;
  let setPathState = null;
  let closeDrawer = null;
  let refreshGraphVisuals = null;
  let showPhilosopherDetails = null;
  let getAnimOptions = null;
  let isLeafletEngine = null;

  /**
   * app.js DOMContentLoaded başında çağrılır (SearchUi.init'den sonra).
   * @param {object} deps — plana göre: graphDb, getNetwork, setPathState,
   *   closeDrawer, refreshGraphVisuals, showPhilosopherDetails, getAnimOptions,
   *   isLeafletEngine (thunk; GeoMode hazır olduktan sonra değerlendirilir)
   */
  function init(deps) {
    graphDb = deps.graphDb;
    getNetwork = deps.getNetwork;
    setPathState = deps.setPathState;
    closeDrawer = deps.closeDrawer;
    refreshGraphVisuals = deps.refreshGraphVisuals;
    showPhilosopherDetails = deps.showPhilosopherDetails;
    getAnimOptions = deps.getAnimOptions;
    isLeafletEngine = deps.isLeafletEngine;
  }

  function populatePathfinderSelects() {
    const startSelect = document.getElementById('path-start-select');
    const endSelect = document.getElementById('path-end-select');
    const all = graphDb.getAllEntities();

    startSelect.innerHTML = '';
    endSelect.innerHTML = '';

    all.forEach(p => {
      const opt1 = document.createElement('option');
      opt1.value = p.id;
      opt1.textContent = `${p.name} (${p.dates})`;
      startSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = p.id;
      opt2.textContent = `${p.name} (${p.dates})`;
      endSelect.appendChild(opt2);
    });

    startSelect.value = 'sokrates';
    endSelect.value = 'nietzsche';
  }

  // Entelektüel Etki Köprüsü (Pathfinder) Çalıştırıcı
  function runPathfinder() {
    const startId = document.getElementById('path-start-select').value;
    const endId = document.getElementById('path-end-select').value;
    const resultContainer = document.getElementById('path-result-steps');

    const path = graphDb.findPath(startId, endId);
    resultContainer.innerHTML = '';

    if (!path) {
      resultContainer.innerHTML = '<span class="text-rose-400">Bu iki düşünür arasında bağlantı bulunamadı. Farklı bir başlangıç veya hedef seçin.</span>';
      return;
    }

    setPathState(path);
    closeDrawer();
    refreshGraphVisuals();

    path.forEach((nodeId, idx) => {
      const entity = graphDb.getEntity(nodeId);
      const stepBtn = document.createElement('button');
      stepBtn.type = 'button';
      stepBtn.className = 'path-step-btn ui-pressable px-2 py-0.5 rounded surface-card surface-card-interactive text-amber-800 dark:text-amber-300 font-medium';
      stepBtn.textContent = entity.name;
      stepBtn.addEventListener('click', () => {
        resultContainer.querySelectorAll('.path-step-btn').forEach(b => { b.classList.remove('bg-amber-400', 'text-slate-950', 'font-semibold'); b.classList.add('text-amber-800', 'dark:text-amber-300'); });
        stepBtn.classList.remove('text-amber-800', 'dark:text-amber-300');
        stepBtn.classList.add('bg-amber-400', 'text-slate-950', 'font-semibold');
        showPhilosopherDetails(nodeId, { preservePath: true });
        if (isLeafletEngine() && window.LeafletMapManager) {
          window.LeafletMapManager.focusNode(nodeId, graphDb);
        } else if (getNetwork()) {
          getNetwork().focus(nodeId, { scale: 1.15, animation: getAnimOptions(500) });
        }
      });
      resultContainer.appendChild(stepBtn);

      if (idx < path.length - 1) {
        const arrow = document.createElement('i');
        arrow.className = 'fa-solid fa-chevron-right text-[9px] text-slate-400 dark:text-slate-500 mx-0.5';
        arrow.setAttribute('aria-hidden', 'true');
        resultContainer.appendChild(arrow);
      }
    });

    if (isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.fitPath(path);
    } else if (getNetwork()) {
      getNetwork().fit({ nodes: path, animation: getAnimOptions(700) });
    }
  }

  return Object.freeze({ init, populatePathfinderSelects, runPathfinder });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PathfinderUi };
}
