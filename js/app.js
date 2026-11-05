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
} catch (e) {
  // URL/localStorage okunamadı (ör. gizli sekme, kota): varsayılan 'UD' düzeniyle devam et
  console.warn('[App] Varsayılan düzen tercihi okunamadı; "UD" ile devam ediliyor.', e);
}
let currentEraFilter = 'all';

const container = document.getElementById('network-container');

// Hareket azaltma tercihi kontrolü (better-accessibility & better-ui)
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getAnimOptions(duration = 600) {
  if (prefersReducedMotion()) return false;
  return { duration, easingFunction: 'easeInOutQuad' };
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
  if (GeoMode.isLeafletEngine()) {
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
      layoutType: currentLayout,
      isDark: isDarkMode()
    });
    const updatedEdges = visAdapter.toVisEdges({
      filteredEra: currentEraFilter,
      focusedNodeId: currentSelectedId,
      highlightPath: currentHighlightPath,
      layoutType: currentLayout,
      isDark: isDarkMode()
    });

    nodesDataSet.update(updatedNodes);
    edgesDataSet.update(updatedEdges);
  }
  updateFocusBanner();
}

function updateFocusBanner() {
  const banner = document.getElementById('active-focus-banner');
  const textEl = document.getElementById('active-focus-text');

  // Karar ViewUi.deriveBanner'da (SSOT): yol > seçim > yok önceliği
  const view = ViewUi.deriveBanner(graphDb, { pathId: currentHighlightPath, selectedId: currentSelectedId });
  if (view.kind === 'path') {
    textEl.innerHTML = `<i class="fa-solid fa-route text-indigo-400 mr-1" aria-hidden="true"></i> Etki Zinciri: <b>${view.first.name}</b> ➔ <b>${view.last.name}</b> (${view.steps} adım)`;
    banner.classList.remove('hidden');
  } else if (view.kind === 'focus') {
    textEl.innerHTML = `<i class="fa-solid fa-diagram-project text-amber-400 mr-1" aria-hidden="true"></i> <b>${view.person.name}</b> Soykütüğü (${view.teachersCount} öncül, ${view.studentsCount} ardıl)`;
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
  nodesDataSet = new vis.DataSet(visAdapter.toVisNodes({ filteredEra: currentEraFilter, layoutType: currentLayout, isDark: isDarkMode() }));
  edgesDataSet = new vis.DataSet(visAdapter.toVisEdges({ filteredEra: currentEraFilter, layoutType: currentLayout, isDark: isDarkMode() }));

  const data = {
    nodes: nodesDataSet,
    edges: edgesDataSet
  };

  network = new vis.Network(container, data, getNetworkOptions(currentLayout));

  network.on('beforeDrawing', function(ctx) {
    if (currentLayout === 'geo' && window.PhilosophyAtlas && window.PhilosophyGeo) {
      window.PhilosophyAtlas.drawMap(ctx, isDarkMode(), window.PhilosophyGeo.projectRaw);
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

  // Dönem rozetini dinamik renklendir (saf model: DetailContent)
  const badge = DetailContent.eraBadge(p, getEraTheme(p.era));
  const badgeEl = document.getElementById('drawer-era-badge');
  badgeEl.textContent = badge.text;
  badgeEl.className = badge.className;

  // Tipografik tırnak işaretleri (better-typography)
  document.getElementById('drawer-quote').textContent = DetailContent.quoteText(p);
  document.getElementById('drawer-summary').textContent = p.summary;

  // Bölüm içerikleri: DOM + tıklama olayları bu dosyada, modeller DetailContent'te
  renderConceptButtons(p);
  renderWorkItems(p);
  renderRelationButtons('drawer-teachers', graphDb.getTeachers(id), DetailContent.teacherModel,
    '<span class="text-slate-500 dark:text-slate-400 text-[11px] italic">Kayıtlı doğrudan öncül bulunmuyor (Kurucu Düşünür)</span>');
  renderRelationButtons('drawer-students', graphDb.getStudents(id), DetailContent.studentModel,
    '<span class="text-slate-500 dark:text-slate-400 text-[11px] italic">Bu ağda kayıtlı ardıl listelenmemiş</span>');

  const drawer = document.getElementById('detail-drawer');
  drawer.classList.remove('translate-x-[105%]');
  drawer.removeAttribute('inert');

  // Kademeli giriş animasyonunu (stagger-group) yeniden tetikle (better-ui/enter-exit.md)
  const scrollBody = document.getElementById('drawer-scroll-body');
  if (scrollBody) {
    scrollBody.scrollTop = 0;
    scrollBody.querySelectorAll('.stagger-group').forEach(g => {
      g.style.animation = 'none';
      void g.offsetHeight; // reflow
      g.style.animation = '';
    });
  }
}

// Temel Kavramlar: tıklanabilir filtre etiketleri (tıklayınca ana terimi arar)
function renderConceptButtons(p) {
  const container = document.getElementById('drawer-concepts');
  container.innerHTML = '';
  (p.concepts || []).forEach(concept => {
    const model = DetailContent.conceptButtonModel(concept);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = model.className;
    btn.textContent = model.textContent;
    btn.title = model.title;
    btn.addEventListener('click', () => {
      // Parantez öncesi ana terimi arat
      const cleanTerm = DetailContent.conceptSearchTerm(concept);
      searchInput.value = cleanTerm;
      SearchUi.handleSearch(cleanTerm);
      searchInput.focus();
    });
    container.appendChild(btn);
  });
}

// Eserler: ikonlu satır listesi
function renderWorkItems(p) {
  const container = document.getElementById('drawer-works');
  container.innerHTML = '';
  (p.works || []).forEach(work => {
    const model = DetailContent.workItemModel(work);
    const li = document.createElement('li');
    li.className = model.className;
    li.innerHTML = '<i class="' + model.iconClass + '" aria-hidden="true"></i> <span>' + model.text + '</span>';
    container.appendChild(li);
  });
}

// Hoca/Ardıl buton listesi (boş durum HTML'i dahil); master ayrımı DetailContent modellerinde
function renderRelationButtons(containerId, items, makeModel, emptyHtml) {
  const state = DetailContent.relationListState(items, emptyHtml);
  const container = document.getElementById(containerId);
  container.innerHTML = state.isEmpty ? state.emptyHtml : '';
  state.models.forEach(item => {
    const model = makeModel(item);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = model.className;
    btn.title = model.title;
    btn.innerHTML = model.innerHTML;
    btn.addEventListener('click', () => selectAndFocus(item.id));
    container.appendChild(btn);
  });
}

function selectAndFocus(id) {
  currentHighlightPath = null;
  currentSelectedId = id;
  showPhilosopherDetails(id);
  refreshGraphVisuals();

  if (GeoMode.isLeafletEngine() && window.LeafletMapManager) {
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

document.addEventListener('DOMContentLoaded', () => {
  // UI namespace init — arama → yol bulucu → geo mod (modül yüklenme sırası)
  SearchUi.init({ graphDb, selectAndFocus });
  PathfinderUi.init({
    graphDb,
    getNetwork: () => network,
    setPathState: (path) => { currentSelectedId = null; currentHighlightPath = path; },
    closeDrawer,
    refreshGraphVisuals,
    showPhilosopherDetails,
    getAnimOptions,
    isLeafletEngine: () => GeoMode.isLeafletEngine()
  });
  GeoMode.init({
    getLayout: () => currentLayout,
    getNetwork: () => network,
    getNodesDataSet: () => nodesDataSet,
    refreshGraphVisuals,
    getNetworkOptions,
    getAnimOptions,
    selectAndFocus
  });

  updateDynamicCounts();
  PathfinderUi.populatePathfinderSelects();
  initNetwork();

  // Hash değişimini dinle (Geri/İleri butonları için)
  window.addEventListener('hashchange', () => {
    const hashId = window.location.hash.replace(/^#/, '').trim();
    if (hashId && graphDb.getEntity(hashId) && hashId !== currentSelectedId) {
      selectAndFocus(hashId);
    }
  });

  document.getElementById('drawer-close-btn').addEventListener('click', () => {
    if (ViewUi.drawerActionFor({ pathId: currentHighlightPath }) === 'close-drawer') {
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

  document.getElementById('path-find-btn').addEventListener('click', () => PathfinderUi.runPathfinder());

  document.getElementById('path-swap-btn').addEventListener('click', () => {
    const startSel = document.getElementById('path-start-select');
    const endSel = document.getElementById('path-end-select');
    const tmp = startSel.value;
    startSel.value = endSel.value;
    endSel.value = tmp;
    PathfinderUi.runPathfinder();
  });

  document.getElementById('path-reset-btn').addEventListener('click', () => {
    document.getElementById('path-result-steps').innerHTML = '';
    clearFocusAndSelection();
  });

  document.getElementById('zoom-in-btn').addEventListener('click', () => {
    if (GeoMode.isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.zoomIn();
    } else if (network) {
      const currentScale = network.getScale();
      network.moveTo({ scale: currentScale * 1.3, animation: getAnimOptions(300) });
    }
  });

  document.getElementById('zoom-out-btn').addEventListener('click', () => {
    if (GeoMode.isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.zoomOut();
    } else if (network) {
      const currentScale = network.getScale();
      network.moveTo({ scale: currentScale * 0.7, animation: getAnimOptions(300) });
    }
  });

  document.getElementById('fit-btn').addEventListener('click', () => {
    if (GeoMode.isLeafletEngine() && window.LeafletMapManager) {
      window.LeafletMapManager.fitAll();
    } else if (network && currentLayout === 'geo') {
      GeoMode.frameAtlasView();
    } else if (network) {
      network.fit({ animation: getAnimOptions(600) });
    }
  });

  // Geo modda motor geçişi: karo harita ↔ yerleşik Atlas (vis-canvas)
  document.getElementById('geo-mode-toggle-btn').addEventListener('click', () => {
    const goingAtlas = !GeoMode.isAtlasMode();
    GeoMode.setAtlasMode(goingAtlas, goingAtlas
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
      } catch (err) {
        // localStorage erişimi engellenmiş: mevcut tema bozulmadan kalır; dinleyici kurulmaz
        console.warn('[App] Sistem tema tercihi uygulanamadı; mevcut tema korunuyor.', err);
      }
    });
  }

  const searchShortcutHint = document.getElementById('search-shortcut-hint');

  searchInput.addEventListener('input', (e) => {
    if (searchShortcutHint) {
      searchShortcutHint.classList.toggle('hidden', e.target.value.length > 0);
    }
    SearchUi.handleSearch(e.target.value);
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
    SearchUi.handleKeydown(e);
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    if (searchShortcutHint) searchShortcutHint.classList.remove('hidden');
    SearchUi.closeSearchDropdown();
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
        SearchUi.closeSearchDropdown();
        searchInput.focus();
      }
      if (menuWasOpen) {
        layoutMenu.classList.add('hidden');
        layoutToggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (searchWasOpen || menuWasOpen) return;
      if (ViewUi.drawerActionFor({ pathId: currentHighlightPath }) === 'close-drawer') {
        closeDrawer();
      } else {
        clearFocusAndSelection();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      SearchUi.closeSearchDropdown();
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
      try { localStorage.setItem('felsefe-layout', layout); } catch (e) {
        // Kalıcılık yok: düzen bu oturumda uygulanır ama sayfa yenilenince unutulur
        console.warn('[App] Düzen tercihi kaydedilemedi; seçim yalnızca bu oturum için geçerli.', e);
      }
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
      GeoMode.activateEngine();
    } else {
      GeoMode.applyContainerVisibility();
      GeoMode.updateModeToggle();

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

      if (GeoMode.isLeafletEngine() && window.LeafletMapManager) {
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
