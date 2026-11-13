'use strict';

// HtmlEscape: innerHTML / Leaflet tooltip şablonlarına giren metinlerin tek kaçış noktası (SSOT).
const HtmlEscape = (function () {
  const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ENTITIES[ch]);
  }

  return Object.freeze({ escape });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HtmlEscape };
}
