/**
 * =========================================================================
 * 5. UYGULAMA KONTROLÖRÜ (APPLICATION CONTROLLER & UI)
 * =========================================================================
 */
const graphDb = new PhilosophyGraphDatabase(RAW_ENTITIES, RAW_RELATIONS);
const visAdapter = new GraphToVisAdapter(graphDb);

let network = null;
let nodesDataSet = null;
let edgesDataSet = null;
let currentSelectedId = null;
let currentHighlightPath = null;
let currentLayout = 'UD'; // 'UD', 'LR', 'free', 'geo'
try {
  const urlLayout = new URLSearchParams(window.location.search).get('layout');
  if (['UD', 'LR', 'free', 'geo'].includes(urlLayout)) {
    currentLayout = urlLayout;
  } else {
    const lsLayout = localStorage.getItem('felsefe-layout');
    if (['UD', 'LR', 'free', 'geo'].includes(lsLayout)) {
      currentLayout = lsLayout;
    }
  }
} catch (e) {}
let currentEraFilter = 'all';
let searchActiveIndex = -1;
// Coğrafi modda motor seçimi: 'tiles' (Leaflet+Esri) veya 'atlas' (yerleşik vis-canvas haritası).
// Atlas motoru hem karo hatasında otomatik yedektir hem de araç çubuğundan manuel seçilebilir.
let geoAtlasMode = false;

const container = document.getElementById('network-container');

// Hareket azaltma tercihi kontrolü (better-accessibility & better-ui)
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getAnimOptions(duration = 600) {
  if (prefersReducedMotion()) return false;
  return { duration, easingFunction: 'easeInOutQuad' };
}

// Geo modda gerçek karo haritası mı, yerleşik Atlas (vis-canvas) motoru mu aktif?
function isLeafletEngine() {
  return currentLayout === 'geo' && !geoAtlasMode;
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
  if (currentLayout !== 'geo' || geoAtlasMode) return;
  setGeoAtlasMode(true, 'Harita karoları yüklenemedi — yerleşik Atlas görünümüne geçildi.');
}

// Atlas kadrajı: tüm dünyayı fit() ile sığdırmak ölçeği ~0.35'e düşürüp etiketleri
// okunmaz hâle getirir; bunun yerine projeksiyon merkezi (42°N, 18°E — Akdeniz çekirdeği,
// Math: projectRaw(42,18) = {0,0}) sabit ve okunabilir bir ölçekle gösterilir.
function getAtlasInitialScale() {
  return typeof window !== 'undefined' && window.innerWidth < 768 ? 0.42 : 0.62;
}

function frameAtlasView(animate = true) {
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
  } else if (network) {
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
  const isGeo = currentLayout === 'geo';
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

  if (currentLayout === 'geo') {
    const useAtlas = geoAtlasMode;
    if (netContainer) netContainer.classList.toggle('hidden', !useAtlas);
    if (mapContainer) mapContainer.classList.toggle('hidden', useAtlas);
  } else {
    if (mapContainer) mapContainer.classList.add('hidden');
    if (netContainer) netContainer.classList.remove('hidden');
  }
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

function updateDynamicCounts() {
  const totalEntities = graphDb.getEraCount('all');
  const totalRelations = graphDb.getAllRelations().length;

  document.getElementById('header-stats-text').textContent = `${totalEntities} Düşünür • ${totalRelations} Bağlantı`;
  document.getElementById('count-all').textContent = totalEntities;

  for (const era of PhilosophySchema.VALID_ERAS) {
    const el = document.getElementById('count-' + era);
    if (el) el.textContent = graphDb.getEraCount(era);
  }
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

function getNetworkOptions(layoutType) {
  const isHierarchical = layoutType === 'UD' || layoutType === 'LR';
  const isGeo = layoutType === 'geo';
  
  const options = {
    autoResize: true,
    interaction: {
      hover: true,
      tooltipDelay: 150,
      hideEdgesOnDrag: false,
      zoomView: true,
      dragView: true,
      navigationButtons: false,
      keyboard: {
        enabled: false
      }
    },
    physics: {
      enabled: !isHierarchical && !isGeo,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -70,
        centralGravity: 0.01,
        springLength: 120,
        springConstant: 0.08,
        damping: 0.4
      }
    }
  };

  if (isHierarchical) {
    options.layout = {
      hierarchical: {
        enabled: true,
        direction: layoutType,
        sortMethod: 'directed',
        levelSeparation: layoutType === 'UD' ? 140 : 220,
        nodeSpacing: layoutType === 'UD' ? 180 : 130,
        treeSpacing: 200,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true
      }
    };
  } else {
    options.layout = {
      hierarchical: {
        enabled: false
      }
    };
  }

  return options;
}

// Pozisyonları sıfırlamadan sadece düğüm ve kenar stillerini günceller
function refreshGraphVisuals() {
  if (isLeafletEngine()) {
    if (window.LeafletMapManager && window.LeafletMapManager.isInitialized) {
      window.LeafletMapManager.render({
        db: graphDb,
        filteredEra: currentEraFilter,
        focusedNodeId: currentSelectedId,
        highlightPath: currentHighlightPath,
        isDark: isDarkMode(),
        onSelectNode: function(id) {
          selectAndFocus(id);
        }
      });
    }
  } else {
    if (!nodesDataSet || !edgesDataSet) return;
    const updatedNodes = visAdapter.toVisNodes({
      filteredEra: currentEraFilter,
      focusedNodeId: currentSelectedId,
      highlightPath: currentHighlightPath,
      layoutType: currentLayout
    });
    const updatedEdges = visAdapter.toVisEdges({
      filteredEra: currentEraFilter,
      focusedNodeId: currentSelectedId,
      highlightPath: currentHighlightPath,
      layoutType: currentLayout
    });

    nodesDataSet.update(updatedNodes);
    edgesDataSet.update(updatedEdges);
  }
  updateFocusBanner();
}

function updateFocusBanner() {
  const banner = document.getElementById('active-focus-banner');
  const textEl = document.getElementById('active-focus-text');

  if (currentHighlightPath && currentHighlightPath.length > 1) {
    const first = graphDb.getEntity(currentHighlightPath[0]);
    const last = graphDb.getEntity(currentHighlightPath[currentHighlightPath.length - 1]);
    textEl.innerHTML = `<i class="fa-solid fa-route text-indigo-400 mr-1" aria-hidden="true"></i> Etki Zinciri: <b>${first.name}</b> ➔ <b>${last.name}</b> (${currentHighlightPath.length - 1} adım)`;
    banner.classList.remove('hidden');
  } else if (currentSelectedId) {
    const p = graphDb.getEntity(currentSelectedId);
    const teachersCount = graphDb.getTeachers(currentSelectedId).length;
    const studentsCount = graphDb.getStudents(currentSelectedId).length;
    textEl.innerHTML = `<i class="fa-solid fa-diagram-project text-amber-400 mr-1" aria-hidden="true"></i> <b>${p.name}</b> Soykütüğü (${teachersCount} öncül, ${studentsCount} ardıl)`;
    banner.classList.remove('hidden');
  } else {
    textEl.textContent = '';
    banner.classList.add('hidden');
  }
}

function initNetwork() {
  if (typeof vis === 'undefined') {
    console.error('[Vis Error] vis-network kütüphanesi yüklenemedi.');
    // Graf kütüphanesi yoksa tüm dinleyici zincirini patlatmadan dostane bir mesaj göster
    container.innerHTML = '<div class="h-full w-full flex items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">Ağ kütüphanesi (vis-network) yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.</div>';
    return;
  }
  nodesDataSet = new vis.DataSet(visAdapter.toVisNodes({ filteredEra: currentEraFilter, layoutType: currentLayout }));
  edgesDataSet = new vis.DataSet(visAdapter.toVisEdges({ filteredEra: currentEraFilter, layoutType: currentLayout }));

  const data = {
    nodes: nodesDataSet,
    edges: edgesDataSet
  };

  network = new vis.Network(container, data, getNetworkOptions(currentLayout));

  network.on('beforeDrawing', function(ctx) {
    if (currentLayout === 'geo' && window.PhilosophyGeo) {
      window.PhilosophyGeo.drawMap(ctx, isDarkMode());
    }
  });

  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const clickedId = params.nodes[0];
      currentHighlightPath = null;
      showPhilosopherDetails(clickedId);
      refreshGraphVisuals();
    } else {
      // Boş tuvale tıklandığında vurguyu ve çekmeceyi kapat
      clearFocusAndSelection();
    }
  });

  // Hiyerarşik düzende fizik kapalı olduğundan 'stabilized' hiç tetiklenmez; ilk çizimi bekle
  network.once('afterDrawing', function() {
    handleInitialHashRoute();
  });
}

function handleInitialHashRoute() {
  const hashId = window.location.hash.replace(/^#/, '').trim();
  if (hashId && graphDb.getEntity(hashId)) {
    selectAndFocus(hashId);
  } else {
    network.fit({ animation: getAnimOptions(800) });
  }
}

function clearFocusAndSelection() {
  currentSelectedId = null;
  currentHighlightPath = null;
  if (network) network.unselectAll();
  closeDrawer();
  refreshGraphVisuals();
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

// Detay Panelini Göster (preservePath: true ise aktif Etki Köprüsü vurgusunu korur)
function showPhilosopherDetails(id, { preservePath = false } = {}) {
  const p = graphDb.getEntity(id);
  if (!p) return;

  if (!preservePath) {
    currentSelectedId = id;
  }
  history.replaceState(null, '', '#' + id);

  document.getElementById('drawer-name').textContent = p.name;
  document.getElementById('drawer-dates').textContent = p.dates;
  document.getElementById('drawer-city').innerHTML = '<i class="fa-solid fa-location-dot text-[11px] text-slate-400 mr-1" aria-hidden="true"></i>' + p.city;
  document.getElementById('drawer-school').textContent = p.school;

  // Dönem rozetini dinamik renklendir
  const badgeEl = document.getElementById('drawer-era-badge');
  const theme = getEraTheme(p.era);
  badgeEl.textContent = p.eraName;
  badgeEl.className = 'px-2.5 py-1 rounded-full text-[11px] font-semibold border ' + theme.badgeClass;

  // Tipografik tırnak işaretleri (better-typography)
  document.getElementById('drawer-quote').textContent = '“' + p.quote + '”';
  document.getElementById('drawer-summary').textContent = p.summary;

  // Temel Kavramlar (Tıklanabilir Filtre Etiketleri)
  const conceptsContainer = document.getElementById('drawer-concepts');
  conceptsContainer.innerHTML = '';
  (p.concepts || []).forEach(concept => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ui-pressable surface-card surface-card-interactive px-2.5 py-1 rounded-lg text-[11px] text-amber-800 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer';
    btn.textContent = concept;
    btn.title = `“${concept}” kavramını ara`;
    btn.addEventListener('click', () => {
      // Parantez öncesi ana terimi arat
      const cleanTerm = concept.split('(')[0].trim();
      searchInput.value = cleanTerm;
      handleSearch(cleanTerm);
      searchInput.focus();
    });
    conceptsContainer.appendChild(btn);
  });

  // Eserler
  const worksContainer = document.getElementById('drawer-works');
  worksContainer.innerHTML = '';
  (p.works || []).forEach(work => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';
    li.innerHTML = '<i class="fa-solid fa-book text-[10px] text-emerald-600 dark:text-emerald-400" aria-hidden="true"></i> <span>' + work + '</span>';
    worksContainer.appendChild(li);
  });

  // GraphDB'den Doğrudan Hocaları Çek
  const teachersContainer = document.getElementById('drawer-teachers');
  teachersContainer.innerHTML = '';
  const teachers = graphDb.getTeachers(id);
  if (teachers.length === 0) {
    teachersContainer.innerHTML = '<span class="text-slate-500 dark:text-slate-400 text-[11px] italic">Kayıtlı doğrudan öncül bulunmuyor (Kurucu Düşünür)</span>';
  } else {
    teachers.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isMaster = t.relationType === 'master';
      btn.className = 'ui-pressable surface-card surface-card-interactive px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ' +
        (isMaster ? 'text-amber-800 dark:text-amber-300 border border-amber-500/25' : 'text-sky-800 dark:text-sky-300 border border-sky-500/25');
      btn.title = (isMaster ? 'Doğrudan Hocası (Düz Altın Çizgi): ' : 'Entelektüel Öncülü (Kesikli Mavi Çizgi): ') + t.relationLabel;
      btn.innerHTML = `<i class="fa-solid ${isMaster ? 'fa-user-graduate text-amber-600 dark:text-amber-400' : 'fa-arrow-up text-sky-600 dark:text-sky-400'} text-[10px]" aria-hidden="true"></i> <span>${t.name}</span> <span class="opacity-50 text-[10px] font-mono">(${isMaster ? 'Hoca' : 'Etki'})</span>`;
      btn.addEventListener('click', () => {
        selectAndFocus(t.id);
      });
      teachersContainer.appendChild(btn);
    });
  }

  // GraphDB'den Doğrudan Öğrencilerini Çek
  const studentsContainer = document.getElementById('drawer-students');
  studentsContainer.innerHTML = '';
  const students = graphDb.getStudents(id);
  if (students.length === 0) {
    studentsContainer.innerHTML = '<span class="text-slate-500 dark:text-slate-400 text-[11px] italic">Bu ağda kayıtlı ardıl listelenmemiş</span>';
  } else {
    students.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isMaster = s.relationType === 'master';
      btn.className = 'ui-pressable surface-card surface-card-interactive px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ' +
        (isMaster ? 'text-amber-800 dark:text-amber-300 border border-amber-500/25' : 'text-emerald-800 dark:text-emerald-300 border border-emerald-500/25');
      btn.title = (isMaster ? 'Doğrudan Öğrencisi (Düz Altın Çizgi): ' : 'Etkilediği Düşünür (Kesikli Mavi Çizgi): ') + s.relationLabel;
      btn.innerHTML = `<i class="fa-solid ${isMaster ? 'fa-user-graduate text-amber-600 dark:text-amber-400' : 'fa-arrow-down text-emerald-600 dark:text-emerald-400'} text-[10px]" aria-hidden="true"></i> <span>${s.name}</span> <span class="opacity-50 text-[10px] font-mono">(${isMaster ? 'Öğrenci' : 'Etki'})</span>`;
      btn.addEventListener('click', () => {
        selectAndFocus(s.id);
      });
      studentsContainer.appendChild(btn);
    });
  }

  const drawer = document.getElementById('detail-drawer');
  drawer.classList.remove('translate-x-[105%]');
  drawer.removeAttribute('inert');

  // Kademeli giriş animasyonunu (stagger-group) yeniden tetikle (better-ui/enter-exit.md)
  const scrollBody = document.getElementById('drawer-scroll-body');
  if (scrollBody) {
    scrollBody.scrollTop = 0;
    const groups = scrollBody.querySelectorAll('.stagger-group');
    groups.forEach(g => {
      g.style.animation = 'none';
      void g.offsetHeight; // reflow
      g.style.animation = '';
    });
  }
}

function selectAndFocus(id) {
  currentHighlightPath = null;
  currentSelectedId = id;
  showPhilosopherDetails(id);
  refreshGraphVisuals();

  if (isLeafletEngine() && window.LeafletMapManager) {
    window.LeafletMapManager.focusNode(id, graphDb);
  } else if (network) {
    network.selectNodes([id]);
    network.focus(id, {
      scale: 1.15,
      animation: getAnimOptions(600)
    });
  }
}

function closeDrawer() {
  const drawer = document.getElementById('detail-drawer');
  drawer.classList.add('translate-x-[105%]');
  // Ekran dışındaki panelin odaklanabilir öğelerine klavye/ekran okuyucu erişimini kapat
  drawer.setAttribute('inert', '');
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

  currentSelectedId = null;
  currentHighlightPath = path;
  closeDrawer();
  refreshGraphVisuals();

  path.forEach((nodeId, idx) => {
    const entity = graphDb.getEntity(nodeId);
    const stepBtn = document.createElement('button');
    stepBtn.type = 'button';
    stepBtn.className = 'path-step-btn ui-pressable px-2 py-0.5 rounded surface-card surface-card-interactive text-amber-800 dark:text-amber-300 font-medium';
    stepBtn.textContent = entity.name;
    stepBtn.addEventListener('click', () => {
      resultContainer.querySelectorAll('.path-step-btn').forEach(b => {
        b.classList.remove('bg-amber-400', 'text-slate-950', 'font-semibold');
        b.classList.add('text-amber-800', 'dark:text-amber-300');
      });
      stepBtn.classList.remove('text-amber-800', 'dark:text-amber-300');
      stepBtn.classList.add('bg-amber-400', 'text-slate-950', 'font-semibold');
      showPhilosopherDetails(nodeId, { preservePath: true });
      if (isLeafletEngine() && window.LeafletMapManager) {
        window.LeafletMapManager.focusNode(nodeId, graphDb);
      } else if (network) {
        network.focus(nodeId, { scale: 1.15, animation: getAnimOptions(500) });
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
  } else if (network) {
    network.fit({
      nodes: path,
      animation: getAnimOptions(700)
    });
  }
}

// Geçiş Bastırma Yardımcısı (Theme Transition Suppression — better-ui)
function disableTransitionsDuring(callback) {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
    )
  );
  document.head.appendChild(css);

  callback();

  // Reflow tetikle
  void document.body.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (css.parentNode) {
        css.parentNode.removeChild(css);
      }
    });
  });
}

// Türkçe Duyarlı Arama ve Klavye Navigasyonu
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const searchClearBtn = document.getElementById('search-clear-btn');

// Arama açılır listesini kapatır ve combobox durumunu (aria-expanded/aria-activedescendant) sıfırlar
function closeSearchDropdown() {
  searchDropdown.classList.add('hidden');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
  searchActiveIndex = -1;
}

function handleSearch(query) {
  const trimmed = query.trim();
  const normQuery = normalizeTurkish(trimmed);
  searchActiveIndex = -1;

  if (!normQuery) {
    closeSearchDropdown();
    searchClearBtn.classList.add('hidden');
    return;
  }

  searchClearBtn.classList.remove('hidden');

  const matches = graphDb.getAllEntities().filter(p => {
    return normalizeTurkish(p.name).includes(normQuery) ||
           normalizeTurkish(p.school).includes(normQuery) ||
           (p.concepts && p.concepts.some(c => normalizeTurkish(c).includes(normQuery))) ||
           (p.works && p.works.some(w => normalizeTurkish(w).includes(normQuery))) ||
           normalizeTurkish(p.city).includes(normQuery);
  }).slice(0, 10);

  if (matches.length === 0) {
    // better-writing: Empty state names the query and offers a clear recovery action
    searchDropdown.innerHTML = '';
    const emptyBox = document.createElement('div');
    emptyBox.className = 'px-4 py-3 text-xs text-slate-600 dark:text-slate-300 text-center space-y-2';
    const msg = document.createElement('p');
    msg.textContent = `“${trimmed}” için filozof, kavram veya eser bulunamadı.`;
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'ui-pressable px-2.5 py-1 rounded-md surface-card surface-card-interactive text-amber-700 dark:text-amber-300 text-[11px] font-medium';
    resetBtn.textContent = 'Aramayı Temizle';
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      closeSearchDropdown();
      searchClearBtn.classList.add('hidden');
      searchInput.focus();
    });
    emptyBox.appendChild(msg);
    emptyBox.appendChild(resetBtn);
    searchDropdown.appendChild(emptyBox);
  } else {
    searchDropdown.innerHTML = '';
    matches.forEach((m, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.id = 'search-option-' + idx;
      item.setAttribute('aria-selected', 'false');
      item.dataset.index = idx;
      item.className = 'search-result-item ui-pressable w-full text-left px-3 py-2 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.07] flex items-center justify-between text-xs';
      item.innerHTML = '<div><div class="font-medium text-slate-900 dark:text-slate-100">' + m.name + ' <span class="text-[10px] text-amber-600 dark:text-amber-400 font-normal tabular-nums">(' + m.dates + ')</span></div><div class="text-[10px] text-slate-500 dark:text-slate-400">' + m.school + '</div></div><i class="fa-solid fa-arrow-right text-[10px] text-slate-400" aria-hidden="true"></i>';
      item.addEventListener('click', () => {
        searchInput.value = m.name;
        closeSearchDropdown();
        selectAndFocus(m.id);
      });
      searchDropdown.appendChild(item);
    });
  }

  searchDropdown.classList.remove('hidden');
  searchInput.setAttribute('aria-expanded', 'true');
}

function updateSearchHighlight(items) {
  items.forEach((item, idx) => {
    const isActive = idx === searchActiveIndex;
    item.classList.toggle('bg-black/[0.07]', isActive);
    item.classList.toggle('dark:bg-white/[0.12]', isActive);
    item.setAttribute('aria-selected', String(isActive));
    if (isActive) {
      item.scrollIntoView({ block: 'nearest' });
      searchInput.setAttribute('aria-activedescendant', item.id);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateDynamicCounts();
  populatePathfinderSelects();
  initNetwork();

  // Hash değişimini dinle (Geri/İleri butonları için)
  window.addEventListener('hashchange', () => {
    const hashId = window.location.hash.replace(/^#/, '').trim();
    if (hashId && graphDb.getEntity(hashId) && hashId !== currentSelectedId) {
      selectAndFocus(hashId);
    }
  });

  document.getElementById('drawer-close-btn').addEventListener('click', () => {
    if (currentHighlightPath) {
      closeDrawer();
    } else {
      clearFocusAndSelection();
    }
  });
  document.getElementById('clear-focus-btn').addEventListener('click', clearFocusAndSelection);

  document.getElementById('drawer-focus-btn').addEventListener('click', () => {
    const hashId = window.location.hash.replace(/^#/, '').trim();
    const targetId = currentSelectedId || hashId;
    if (targetId && graphDb.getEntity(targetId)) {
      selectAndFocus(targetId);
    }
  });

  // Bağlantıyı Kopyala (Deep Link)
  document.getElementById('drawer-share-btn').addEventListener('click', () => {
    if (!currentSelectedId) return;
    const shareUrl = window.location.origin + window.location.pathname + '#' + currentSelectedId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        const label = document.getElementById('share-btn-label');
        label.textContent = 'Bağlantı Kopyalandı';
        setTimeout(() => { label.textContent = 'Bağlantıyı Kopyala'; }, 1800);
      }).catch(() => {
        // İzin reddi veya güvenli olmayan bağlam: kullanıcıyı sessizlikte bırakma
        const label = document.getElementById('share-btn-label');
        label.textContent = 'Kopyalanamadı';
        setTimeout(() => { label.textContent = 'Bağlantıyı Kopyala'; }, 1800);
      });
    }
  });

  // Çekmeceden "Köprü Kur" butonu
  const pathToggleBtn = document.getElementById('pathfinder-toggle-btn');
  const pathfinderBar = document.getElementById('pathfinder-bar');

  document.getElementById('drawer-bridge-btn').addEventListener('click', () => {
    pathfinderBar.classList.remove('hidden');
    pathToggleBtn.setAttribute('aria-expanded', 'true');
    if (currentSelectedId) {
      document.getElementById('path-start-select').value = currentSelectedId;
    }
  });

  // Pathfinder Kontrolleri
  pathToggleBtn.addEventListener('click', () => {
    const isHidden = pathfinderBar.classList.toggle('hidden');
    pathToggleBtn.setAttribute('aria-expanded', String(!isHidden));
  });

  document.getElementById('path-find-btn').addEventListener('click', runPathfinder);

  document.getElementById('path-swap-btn').addEventListener('click', () => {
    const startSel = document.getElementById('path-start-select');
    const endSel = document.getElementById('path-end-select');
    const tmp = startSel.value;
    startSel.value = endSel.value;
    endSel.value = tmp;
    runPathfinder();
  });

  document.getElementById('path-reset-btn').addEventListener('click', () => {
    document.getElementById('path-result-steps').innerHTML = '';
    clearFocusAndSelection();
  });

  document.getElementById('zoom-in-btn').addEventListener('click', () => {
    if (isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.zoomIn();
    } else if (network) {
      const currentScale = network.getScale();
      network.moveTo({ scale: currentScale * 1.3, animation: getAnimOptions(300) });
    }
  });

  document.getElementById('zoom-out-btn').addEventListener('click', () => {
    if (isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.zoomOut();
    } else if (network) {
      const currentScale = network.getScale();
      network.moveTo({ scale: currentScale * 0.7, animation: getAnimOptions(300) });
    }
  });

  document.getElementById('fit-btn').addEventListener('click', () => {
    if (isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.fitAll();
    } else if (network && currentLayout === 'geo') {
      frameAtlasView();
    } else if (network) {
      network.fit({ animation: getAnimOptions(600) });
    }
  });

  // Geo modda motor geçişi: karo harita ↔ yerleşik Atlas (vis-canvas)
  document.getElementById('geo-mode-toggle-btn').addEventListener('click', () => {
    const goingAtlas = !geoAtlasMode;
    setGeoAtlasMode(goingAtlas, goingAtlas
      ? 'Yerleşik Atlas görünümüne geçildi.'
      : 'Esri karo haritasına geçildi.');
  });

  document.getElementById('random-btn').addEventListener('click', () => {
    const pool = graphDb.getByEra(currentEraFilter);
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    selectAndFocus(pool[randomIndex].id);
  });

  // Tema Değiştirici (Dark / Light Mode Toggle)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      const targetTheme = isDarkNow ? 'light' : 'dark';

      disableTransitionsDuring(() => {
        if (targetTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });

      try {
        localStorage.setItem('felsefe-theme', targetTheme);
      } catch (e) {
        // LocalStorage erişimi engellenmiş ortamlarda sessizce geç
      }

      // Vis-network tuval düğüm ve kenarlarını yeni temaya göre tazele
      refreshGraphVisuals();

      if (window.LeafletMapManager && window.LeafletMapManager.isInitialized) {
        window.LeafletMapManager.setTheme(targetTheme === 'dark');
      }

      // Açık çekmece varsa dönem rozetini yeni temaya göre tazele
      if (currentSelectedId) {
        const p = graphDb.getEntity(currentSelectedId);
        if (p) {
          const badgeEl = document.getElementById('drawer-era-badge');
          const theme = getEraTheme(p.era);
          if (badgeEl && theme) {
            badgeEl.className = 'px-2.5 py-1 rounded-full text-[11px] font-semibold border ' + theme.badgeClass;
          }
        }
      }
    });
  }

  // Sistem tema değişikliğini dinle (kullanıcı henüz el ile seçim yapmamışsa)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('felsefe-theme')) {
          disableTransitionsDuring(() => {
            if (e.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          });
          refreshGraphVisuals();
          if (window.LeafletMapManager && window.LeafletMapManager.isInitialized) {
            window.LeafletMapManager.setTheme(e.matches);
          }
        }
      } catch (err) {}
    });
  }

  const searchShortcutHint = document.getElementById('search-shortcut-hint');

  searchInput.addEventListener('input', (e) => {
    if (searchShortcutHint) {
      searchShortcutHint.classList.toggle('hidden', e.target.value.length > 0);
    }
    handleSearch(e.target.value);
  });

  searchInput.addEventListener('focus', () => {
    if (searchShortcutHint) searchShortcutHint.classList.add('hidden');
  });

  searchInput.addEventListener('blur', () => {
    if (searchShortcutHint && !searchInput.value) {
      searchShortcutHint.classList.remove('hidden');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    const items = searchDropdown.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length > 0) {
        searchActiveIndex = (searchActiveIndex + 1) % items.length;
        updateSearchHighlight(items);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        searchActiveIndex = (searchActiveIndex - 1 + items.length) % items.length;
        updateSearchHighlight(items);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchActiveIndex >= 0 && items[searchActiveIndex]) {
        items[searchActiveIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    }
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    if (searchShortcutHint) searchShortcutHint.classList.remove('hidden');
    closeSearchDropdown();
    searchClearBtn.classList.add('hidden');
    searchInput.focus();
  });

  const layoutToggleBtn = document.getElementById('layout-toggle-btn');
  const layoutMenu = document.getElementById('layout-menu');

  // Global Escape, "/" Arama Kısayolu ve Dış Tıklama Yönetimi
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      searchInput.focus();
      return;
    }
    if (e.key === 'Escape') {
      // Katmanlı kapatma: önce geçici açılır yüzeyler, en son ağ odağı/çekmece
      const searchWasOpen = !searchDropdown.classList.contains('hidden');
      const menuWasOpen = !layoutMenu.classList.contains('hidden');
      if (searchWasOpen) {
        closeSearchDropdown();
        searchInput.focus();
      }
      if (menuWasOpen) {
        layoutMenu.classList.add('hidden');
        layoutToggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (searchWasOpen || menuWasOpen) return;
      if (currentHighlightPath) {
        closeDrawer();
      } else {
        clearFocusAndSelection();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      closeSearchDropdown();
    }
    if (!layoutToggleBtn.contains(e.target) && !layoutMenu.contains(e.target)) {
      layoutMenu.classList.add('hidden');
      layoutToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  layoutToggleBtn.addEventListener('click', () => {
    const isHidden = layoutMenu.classList.toggle('hidden');
    layoutToggleBtn.setAttribute('aria-expanded', String(!isHidden));
  });

  const layoutChoiceBtns = document.querySelectorAll('.layout-choice-btn');
  const layoutLabel = document.getElementById('current-layout-label');

  function switchLayout(layout, shouldPersist = true) {
    currentLayout = layout;
    if (shouldPersist) {
      try { localStorage.setItem('felsefe-layout', layout); } catch (e) {}
    }

    if (layout === 'UD') layoutLabel.textContent = 'Dikey Ağaç';
    else if (layout === 'LR') layoutLabel.textContent = 'Yatay Ağaç';
    else if (layout === 'geo') layoutLabel.textContent = 'Dünya Haritası';
    else layoutLabel.textContent = 'Serbest Ağ';

    layoutChoiceBtns.forEach(b => {
      const icon = b.querySelector('.layout-active-icon');
      const isSelected = (b.getAttribute('data-layout') === layout);
      b.setAttribute('aria-checked', String(isSelected));
      if (icon) {
        if (isSelected) icon.classList.remove('hidden');
        else icon.classList.add('hidden');
      }
    });

    layoutMenu.classList.add('hidden');
    layoutToggleBtn.setAttribute('aria-expanded', 'false');

    if (currentLayout === 'geo') {
      activateGeoEngine();
    } else {
      applyGeoContainerVisibility();
      updateGeoModeToggle();

      if (network) {
        network.setOptions(getNetworkOptions(currentLayout));

        const unfixes = [];
        nodesDataSet.forEach(node => {
          unfixes.push({
            id: node.id,
            fixed: false
          });
        });
        nodesDataSet.update(unfixes);

        refreshGraphVisuals();
        setTimeout(() => {
          network.fit({ animation: getAnimOptions(700) });
        }, 200);
      }
    }
  }

  layoutChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const layout = btn.getAttribute('data-layout');
      switchLayout(layout, true);
    });
  });

  // Kaydedilmiş veya URL ile belirtilmiş varsayılan düzen varsa uygula
  if (currentLayout !== 'UD') {
    switchLayout(currentLayout, false);
  }

  // Dönem Filtre Butonları (Yüzen hap [pill] tasarımı + aria-pressed durumu)
  const eraFilterBtns = document.querySelectorAll('.era-filter-btn');
  eraFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const era = btn.getAttribute('data-era');
      currentEraFilter = era;
      currentSelectedId = null;
      currentHighlightPath = null;
      closeDrawer();

      eraFilterBtns.forEach(b => {
        const inactiveClasses = b.getAttribute('data-inactive-class');
        const isSelected = (b === btn);
        b.setAttribute('aria-pressed', String(isSelected));
        if (isSelected) {
          b.className = 'era-filter-btn ui-pressable px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-semibold whitespace-nowrap shadow-sm tabular-nums flex items-center gap-1.5';
        } else {
          b.className = 'era-filter-btn ui-pressable px-3 py-1 rounded-full whitespace-nowrap tabular-nums flex items-center gap-1.5 ' + inactiveClasses;
        }
      });

      refreshGraphVisuals();

      if (isLeafletEngine() && window.LeafletMapManager) {
        if (era === 'all') {
          window.LeafletMapManager.fitAll();
        } else {
          const eraIds = graphDb.getByEra(era).map(p => p.id);
          if (eraIds.length > 0) {
            window.LeafletMapManager.fitPath(eraIds);
          }
        }
      } else if (network) {
        if (era === 'all') {
          network.fit({ animation: getAnimOptions(500) });
        } else {
          const eraIds = graphDb.getByEra(era).map(p => p.id);
          if (eraIds.length > 0) {
            network.fit({ nodes: eraIds, animation: getAnimOptions(600) });
          }
        }
      }
    });
  });

  const legendToggleBtn = document.getElementById('legend-toggle-btn');
  const legendContent = document.getElementById('legend-content');

  // Mobil ekranlarda (< 640px) göstergeyi başlangıçta daraltılmış olarak aç
  if (window.innerWidth < 640) {
    legendContent.classList.add('hidden');
    legendToggleBtn.setAttribute('aria-expanded', 'false');
    const initIcon = legendToggleBtn.querySelector('i');
    if (initIcon) initIcon.className = 'fa-solid fa-chevron-up';
  }

  legendToggleBtn.addEventListener('click', () => {
    const isHidden = legendContent.classList.toggle('hidden');
    legendToggleBtn.setAttribute('aria-expanded', String(!isHidden));
    const icon = legendToggleBtn.querySelector('i');
    if (isHidden) {
      icon.className = 'fa-solid fa-chevron-up';
    } else {
      icon.className = 'fa-solid fa-chevron-down';
    }
  });
});
