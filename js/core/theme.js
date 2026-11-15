/**
 * =========================================================================
 * THEME — Koyu/Açık tema durumunun tek doğruluk kaynağı (SSOT)
 * =========================================================================
 * Tema kararları (kayıtlı tercih > sistem tercihi) ve tema uygulaması
 * (documentElement.classList) burada toplanır. index.html'deki FOUC
 * başlatıcısı bu modül yüklenmeden çalıştığı için aynı kararı satır içi
 * tekrarlar; kararın kendisi resolveTheme'de sabitlenir ve test edilir.
 */
const Theme = (function () {
  const STORAGE_KEY = 'felsefe-theme';

  /**
   * @param {string|null} saved      localStorage'daki tercih ('dark'|'light'|null)
   * @param {boolean} prefersDark    sistem tercihi (prefers-color-scheme)
   */
  function resolveTheme(saved, prefersDark) {
    return saved ? saved === 'dark' : !!prefersDark;
  }

  function isDark() {
    return typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark');
  }

  function apply(isDarkOn) {
    document.documentElement.classList.toggle('dark', !!isDarkOn);
  }

  // localStorage engellenmiş ortamlarda (private mod vb.) sessizce null/no-op
  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function persist(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // LocalStorage erişimi engellenmiş ortamlarda sessizce geç
    }
  }

  return Object.freeze({ STORAGE_KEY, resolveTheme, isDark, apply, readStored, persist });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Theme };
}
