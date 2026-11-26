/**
 * =========================================================================
 * LAYOUT-PREF — Ağ düzeni tercihinin tek doğruluk kaynağı (SSOT)
 * =========================================================================
 * Theme modülünün düzen karşılığı: geçerli düzen listesi, localStorage
 * anahtarı, çözümleme önceliği (URL > kayıtlı tercih > varsayılan) ve
 * etiketler burada toplanır. app.js yalnızca kararı tüketir.
 *
 * Saf ve DOM'dan bağımsızdır (readStored/persist localStorage'ı try/catch
 * ile sarar; Theme ile aynı sessiz düşüş davranışı).
 */
const LayoutPref = (function () {
  const STORAGE_KEY = 'felsefe-layout';
  const DEFAULT_LAYOUT = 'UD';

  const VALID_LAYOUTS = Object.freeze(['UD', 'LR', 'free', 'geo']);
  const LABELS = Object.freeze({
    UD: 'Dikey Ağaç',
    LR: 'Yatay Ağaç',
    free: 'Serbest Ağ',
    geo: 'Dünya Haritası'
  });

  function isValid(layout) {
    return VALID_LAYOUTS.includes(layout);
  }

  /**
   * @param {string|null} urlValue    ?layout= parametresi (öncelikli)
   * @param {string|null} storedValue localStorage'daki tercih
   * @returns {string} geçerli bir düzen ('UD' | 'LR' | 'free' | 'geo')
   */
  function resolve(urlValue, storedValue) {
    if (isValid(urlValue)) return urlValue;
    if (isValid(storedValue)) return storedValue;
    return DEFAULT_LAYOUT;
  }

  function label(layout) {
    return LABELS[layout] || LABELS[DEFAULT_LAYOUT];
  }

  // localStorage engellenmiş ortamlarda (private mod vb.) sessizce null/no-op
  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function persist(layout) {
    try {
      localStorage.setItem(STORAGE_KEY, layout);
    } catch (e) {
      // LocalStorage erişimi engellenmiş ortamlarda sessizce geç
    }
  }

  return Object.freeze({ STORAGE_KEY, DEFAULT_LAYOUT, VALID_LAYOUTS, resolve, label, readStored, persist });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LayoutPref };
}
