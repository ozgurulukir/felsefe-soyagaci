'use strict';

/**
 * =========================================================================
 * DETAIL-CONTENT — Çekmece detay içeriği için saf model üreticileri
 * =========================================================================
 * showPhilosopherDetails içindeki DOM'suz yardımcılar (rozet, tırnak,
 * kavram/eser/ilişki modelleri) burada taşınır. Byte-kopya string'ler;
 * tıklama/olay dinleyicileri app.js'te kalır. Node'da require edilebilir.
 */
const DetailContent = (function () {

  /**
   * Dönem rozeti: metin + tema.badgeClass ile birleşik className.
   * @param {{eraName?: string}} p
   * @param {{badgeClass?: string}} theme
   * @returns {{text: string, className: string}}
   */
  function eraBadge(p, theme) {
    return {
      text: p.eraName,
      className: 'px-2.5 py-1 rounded-full text-[11px] font-semibold border ' + theme.badgeClass
    };
  }

  /**
   * Tipografik tırnak işaretleri (better-typography).
   * @param {{quote?: string}} p
   * @returns {string}
   */
  function quoteText(p) {
    return '“' + p.quote + '”';
  }

  /**
   * Kavram etiketindeki parantez öncesi ana terim (arama için).
   * @param {string} concept
   * @returns {string}
   */
  function conceptSearchTerm(concept) {
    return concept.split('(')[0].trim();
  }

  /**
   * Tıklanabilir kavram filtre etiketi modeli (click dinleyicisi app.js'te).
   * @param {string} concept
   * @returns {{textContent: string, title: string, className: string}}
   */
  function conceptButtonModel(concept) {
    return {
      textContent: concept,
      title: `“${concept}” kavramını ara`,
      className: 'ui-pressable surface-card surface-card-interactive px-2.5 py-1 rounded-lg text-[11px] text-amber-800 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer'
    };
  }

  /**
   * Eser satırı modeli (li.className + ikon + metin).
   * @param {string} work
   * @returns {{className: string, iconClass: string, text: string}}
   */
  function workItemModel(work) {
    return {
      className: 'flex items-center gap-2',
      iconClass: 'fa-solid fa-book text-[10px] text-emerald-600 dark:text-emerald-400',
      text: work
    };
  }

  /**
   * Hoca/öğrenci listesi durumu: boş durum HTML'i veya dolu modeller.
   * @param {Array|null|undefined} items
   * @param {string} emptyHtml
   * @returns {{isEmpty: boolean, emptyHtml: string, models: Array}}
   */
  function relationListState(items, emptyHtml) {
    const list = Array.isArray(items) ? items : [];
    if (list.length === 0) {
      return { isEmpty: true, emptyHtml, models: [] };
    }
    return { isEmpty: false, emptyHtml, models: list };
  }

  /**
   * Doğrudan hoca buton modeli (isMaster dalı dâhil).
   * @param {{relationType?: string, relationLabel?: string, name?: string, id?: string}} t
   * @returns {{className: string, title: string, innerHTML: string, isMaster: boolean}}
   */
  function teacherModel(t) {
    const isMaster = t.relationType === 'master';
    return {
      className: 'ui-pressable surface-card surface-card-interactive px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ' +
        (isMaster ? 'text-amber-800 dark:text-amber-300 border border-amber-500/25' : 'text-sky-800 dark:text-sky-300 border border-sky-500/25'),
      title: (isMaster ? 'Doğrudan Hocası (Düz Altın Çizgi): ' : 'Entelektüel Öncülü (Kesikli Mavi Çizgi): ') + t.relationLabel,
      innerHTML: `<i class="fa-solid ${isMaster ? 'fa-user-graduate text-amber-600 dark:text-amber-400' : 'fa-arrow-up text-sky-600 dark:text-sky-400'} text-[10px]" aria-hidden="true"></i> <span>${t.name}</span> <span class="opacity-50 text-[10px] font-mono">(${isMaster ? 'Hoca' : 'Etki'})</span>`,
      isMaster
    };
  }

  /**
   * Ardıl/öğrenci buton modeli (emerald varyantı; isMaster dalı dâhil).
   * @param {{relationType?: string, relationLabel?: string, name?: string, id?: string}} s
   * @returns {{className: string, title: string, innerHTML: string, isMaster: boolean}}
   */
  function studentModel(s) {
    const isMaster = s.relationType === 'master';
    return {
      className: 'ui-pressable surface-card surface-card-interactive px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ' +
        (isMaster ? 'text-amber-800 dark:text-amber-300 border border-amber-500/25' : 'text-emerald-800 dark:text-emerald-300 border border-emerald-500/25'),
      title: (isMaster ? 'Doğrudan Öğrencisi (Düz Altın Çizgi): ' : 'Etkilediği Düşünür (Kesikli Mavi Çizgi): ') + s.relationLabel,
      innerHTML: `<i class="fa-solid ${isMaster ? 'fa-user-graduate text-amber-600 dark:text-amber-400' : 'fa-arrow-down text-emerald-600 dark:text-emerald-400'} text-[10px]" aria-hidden="true"></i> <span>${s.name}</span> <span class="opacity-50 text-[10px] font-mono">(${isMaster ? 'Öğrenci' : 'Etki'})</span>`,
      isMaster
    };
  }

  return Object.freeze({
    eraBadge,
    quoteText,
    conceptSearchTerm,
    conceptButtonModel,
    workItemModel,
    relationListState,
    teacherModel,
    studentModel
  });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DetailContent };
}
