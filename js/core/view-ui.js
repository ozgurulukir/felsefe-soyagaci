'use strict';

/**
 * =========================================================================
 * VIEW-UI — Görünümden türetilen UI kararları (saf modül)
 * =========================================================================
 * app.js'in DOM işleyicilerinde elle kopyalanmış üç kararı tek SSOT'ta
 * toplar: odak bandı türü/seçimi, çekmece kapatma politikası ve geo motor
 * / konteyner seçimi. app.js yalnızca sonucu render eder; politika burada.
 * Node.js'de (node --test) sahte db ile sınanabilir.
 */
const ViewUi = (function () {

  /**
   * Odak bandı kararı: öncelik sırası etki zinciri (yol) > seçim > yok.
   * @param {object} db  getEntity/getTeachers/getStudents arayüzü
   * @param {{pathId?: string[]|null, selectedId?: string|null}} state
   * @returns {{kind:'path', first:object, last:object, steps:number}
   *          |{kind:'focus', person:object, teachersCount:number, studentsCount:number}
   *          |{kind:'none'}}
   */
  function deriveBanner(db, state) {
    const path = state.pathId;
    if (path && path.length > 1) {
      return {
        kind: 'path',
        first: db.getEntity(path[0]),
        last: db.getEntity(path[path.length - 1]),
        steps: path.length - 1
      };
    }
    if (state.selectedId) {
      const person = db.getEntity(state.selectedId);
      if (person) {
        return {
          kind: 'focus',
          person,
          teachersCount: db.getTeachers(state.selectedId).length,
          studentsCount: db.getStudents(state.selectedId).length
        };
      }
    }
    return { kind: 'none' };
  }

  /**
   * Çekmece kapatma politikası: aktif etki zinciri varken çekmeceyi kapatmak
   * zinciri korur; yoksa odak/ seçim tamamen temizlenir. Escape ve kapatma
   * düğmesi aynı politikanın iki çağrıcısıdır.
   * @param {{pathId?: string[]|null}} state
   * @returns {'close-drawer'|'clear-focus'}
   */
  function drawerActionFor(state) {
    return state.pathId ? 'close-drawer' : 'clear-focus';
  }

  /**
   * Geo motor/konteyner kararı: 2×2 matris (layout=geo?, geoAtlasMode?).
   *   visibleContainer: 'tiles'  → Leaflet karo haritası
   *                     'atlas'  → yerleşik vis-canvas Atlas
   *                     'graph'  → geo dışı, normal graf
   * @param {{layout: string, geoAtlasMode: boolean}} state
   * @returns {{isLeafletEngine: boolean, visibleContainer: 'tiles'|'atlas'|'graph'}}
   */
  function deriveEngineState(state) {
    const isGeo = state.layout === 'geo';
    const isLeafletEngine = isGeo && !state.geoAtlasMode;
    const visibleContainer = isGeo ? (state.geoAtlasMode ? 'atlas' : 'tiles') : 'graph';
    return { isLeafletEngine, visibleContainer };
  }

  return Object.freeze({ deriveBanner, drawerActionFor, deriveEngineState });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ViewUi };
}
