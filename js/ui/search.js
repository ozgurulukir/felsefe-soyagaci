'use strict';

/**
 * =========================================================================
 * SEARCH-UI — Saf arama eşleştirici + SearchUi namespace
 * =========================================================================
 * matchEntities: filter + slice(0,10). SearchUi: açılır liste, temizleme
 * düğmesi, sonuç vurgusu ve ok/Enter navigasyonu. searchActiveIndex bu
 * namespace'in özel durumudur (app.js'e taşınmaz). Üst düzey DOM/window
 * erişimi yoktur; DOM referansları init()/ilk kullanımda tembel çözülür
 * (Node require güvenli).
 */
const SearchUi = (function () {

  // Arama açılır listesinde ok tuşlarıyla seçili öğenin indeksi
  let searchActiveIndex = -1;
  let graphDb = null;
  let selectAndFocus = null;
  let searchInput = null;
  let searchDropdown = null;
  let searchClearBtn = null;

  // DOM referanslarını tembel çözer (Node'da document yoksa çağrıda patlar; init çağırmayın)
  function resolveRefs() {
    if (!searchInput) searchInput = document.getElementById('search-input');
    if (!searchDropdown) searchDropdown = document.getElementById('search-dropdown');
    if (!searchClearBtn) searchClearBtn = document.getElementById('search-clear-btn');
  }

  /**
   * Varsayılan normalizeResolver: tarayıcıda global normalizeTurkish,
   * Node'da require('../core/schema.js'). Yalnızca çağrı gövdesinde, güvenli.
   * @param {string} str
   * @returns {string}
   */
  function defaultNormalize(str) {
    if (typeof normalizeTurkish === 'function') {
      return normalizeTurkish(str);
    }
    if (typeof require === 'function') {
      return require('../core/schema.js').normalizeTurkish(str);
    }
    throw new Error('normalizeTurkish tanımlı değil; normalize parametresini geçirin.');
  }

  /**
   * Saf arama eşleştirici: ad, okul, kavram, eser, şehir üzerinde alt dize
   * eşleşmesi; boş sorgu veya eşleşme yoksa []. En fazla 10 sonuç.
   * @param {Array<{name?: string, school?: string, concepts?: string[], works?: string[], city?: string}>} entities
   * @param {string} query
   * @param {(s: string) => string} [normalize] varsayılan: normalizeTurkish
   * @returns {Array}
   */
  function matchEntities(entities, query, normalize) {
    const norm = typeof normalize === 'function' ? normalize : defaultNormalize;
    const normQuery = norm(String(query == null ? '' : query).trim());
    if (!normQuery) return [];
    return (entities || []).filter(p =>
      norm(p.name).includes(normQuery) ||
      norm(p.school).includes(normQuery) ||
      (p.concepts && p.concepts.some(c => norm(c).includes(normQuery))) ||
      (p.works && p.works.some(w => norm(w).includes(normQuery))) ||
      norm(p.city).includes(normQuery)
    ).slice(0, 10);
  }

  /**
   * Bağımlılıklar: { graphDb, selectAndFocus } — DOM referansları DEĞİL;
   * SearchUi kendi tembel referanslarını çözer. DOMContentLoaded başında
   * app.js tarafından çağrılır.
   * @param {{graphDb: object, selectAndFocus: function}} deps
   */
  function init(deps) {
    graphDb = deps.graphDb;
    selectAndFocus = deps.selectAndFocus;
    resolveRefs();
  }

  // Arama açılır listesini kapatır ve combobox durumunu (aria-expanded/aria-activedescendant) sıfırlar
  function closeSearchDropdown() {
    resolveRefs();
    searchDropdown.classList.add('hidden');
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    searchActiveIndex = -1;
  }

  // 3-way dal sözleşmesi: (a) boş sorgu → kapat+döndür; (b) eşleşme yok → boş durum; (c) sonuçlar
  function handleSearch(query) {
    resolveRefs();
    const trimmed = query.trim();
    const normQuery = defaultNormalize(trimmed);
    searchActiveIndex = -1;

    if (!normQuery) {
      closeSearchDropdown();
      searchClearBtn.classList.add('hidden');
      return;
    }

    searchClearBtn.classList.remove('hidden');

    const matches = matchEntities(graphDb.getAllEntities(), trimmed);

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
      resetBtn.addEventListener('click', () => { searchInput.value = ''; closeSearchDropdown(); searchClearBtn.classList.add('hidden'); searchInput.focus(); });
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
        item.addEventListener('click', () => { searchInput.value = m.name; closeSearchDropdown(); selectAndFocus(m.id); });
        searchDropdown.appendChild(item);
      });
    }

    searchDropdown.classList.remove('hidden');
    searchInput.setAttribute('aria-expanded', 'true');
  }

  function updateSearchHighlight(items) {
    resolveRefs();
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

  // ArrowDown / ArrowUp / Enter — searchActiveIndex'in tek sahibi (bağlama app.js'te)
  function handleKeydown(e) {
    resolveRefs();
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
  }

  return Object.freeze({
    init,
    handleSearch,
    closeSearchDropdown,
    updateSearchHighlight,
    handleKeydown,
    matchEntities
  });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SearchUi, matchEntities: SearchUi.matchEntities };
}
