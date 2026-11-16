/**
 * =========================================================================
 * LAYOUT-OPTIONS — vis-network ağ düzeni seçeneklerinin tek doğruluk kaynağı
 * =========================================================================
 * app.js'teki 'Ağ Kontrolörü'nden taşıyan saf modül. Düzen türüne
 * ('UD', 'LR', 'free', 'geo') göre vis-network için tam options nesnesi
 * üretir. DOM'dan bağımsızdır; Node.js (node --test) ortamında doğrudan
 * test edilebilir.
 *
 * Dizayn notları:
 * - 'UD' / 'LR': hiyerarşik düzen (fizik kapalı, yönlü akış)
 * - 'free': serbest fizik tabanlı düzen
 * - 'geo': coğrafi düzen, kavisli kenarlar, düğümler sabit konumlandırılır
 * =========================================================================
 */

const LayoutOptions = (function () {

  /**
   * @param {string} layoutType 'UD' | 'LR' | 'free' | 'geo'
   * @returns {object} vis-network options nesnesi
   */
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

  return Object.freeze({ getNetworkOptions });

})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof window !== 'undefined') {
  window.LayoutOptions = LayoutOptions;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LayoutOptions };
}
