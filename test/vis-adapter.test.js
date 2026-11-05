'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { ViewFilter } = require('../js/core/view-filter.js');
// vis-adapter global script olarak yazıldığı için Node'da ViewFilter'ı global'e koy
globalThis.ViewFilter = ViewFilter;
const { GraphToVisAdapter } = require('../js/core/vis-adapter.js');
const eraThemes = require('../js/data/era-themes.js');

// test/view-filter.test.js ile aynı sahte db arayüzü (adapter'ın ihtiyaç duyduğu kısım)
function makeFakeDb() {
  const entities = [
    { id: 'sokrates', era: 'antik', name: 'Sokrates' },
    { id: 'platon', era: 'antik', name: 'Platon' },
    { id: 'aristoteles', era: 'antik', name: 'Aristoteles' },
    { id: 'kant', era: 'aydinlanma', name: 'Kant' }
  ];
  const relations = [
    { id: 'edge_0', from: 'sokrates', to: 'platon', type: 'master', label: 'öğretti' },
    { id: 'edge_1', from: 'platon', to: 'aristoteles', type: 'master', label: 'öğretti' },
    { id: 'edge_2', from: 'kant', to: 'platon', type: 'influence', label: 'etkilendi' }
  ];
  return {
    getAllEntities: () => entities,
    getAllRelations: () => relations,
    getEntity: (id) => entities.find(e => e.id === id) || null,
    getLevel: () => 0,
    getNeighborhoodSet: (id) => {
      const set = new Set([id]);
      for (const r of relations) {
        if (r.from === id) set.add(r.to);
        if (r.to === id) set.add(r.from);
      }
      return set;
    }
  };
}

const getEraTheme = (era, mode) => eraThemes.getEraTheme(era, mode);

test('Geo düzeni: PhilosophyGeo konumu x/y olarak ve düğüm sabitlenir', () => {
  const adapter = new GraphToVisAdapter(makeFakeDb());
  globalThis.window = { PhilosophyGeo: { getNodePosition: () => ({ x: 1, y: 2 }) } };
  try {
    const nodes = adapter.toVisNodes({ layoutType: 'geo', isDark: false, getEraTheme });
    const node = nodes.find(n => n.id === 'sokrates');
    assert.equal(node.x, 1);
    assert.equal(node.y, 2);
    assert.deepEqual(node.fixed, { x: true, y: true });
  } finally {
    delete globalThis.window;
  }
});

test('Geo dışı düzen: fixed false olur, x/y atanmaz', () => {
  const adapter = new GraphToVisAdapter(makeFakeDb());
  const nodes = adapter.toVisNodes({ layoutType: 'UD', isDark: false, getEraTheme });
  const node = nodes.find(n => n.id === 'sokrates');
  assert.equal(node.fixed, false);
  assert.equal('x' in node, false);
  assert.equal('y' in node, false);
});

test('Donuk palet: koyu/açık tema renkleri değişmedi', () => {
  const adapter = new GraphToVisAdapter(makeFakeDb());

  // Soluk düğüm: dimmedBg / dimmedBorder / dimmedFont
  const darkDimmed = adapter.toVisNodes({ filteredEra: 'antik', isDark: true, getEraTheme })
    .find(n => n.id === 'kant');
  const lightDimmed = adapter.toVisNodes({ filteredEra: 'antik', isDark: false, getEraTheme })
    .find(n => n.id === 'kant');
  assert.equal(darkDimmed.color.background, '#090d16cc');
  assert.equal(darkDimmed.color.border, '#1e293b55');
  assert.equal(darkDimmed.font.color, '#475569');
  assert.equal(lightDimmed.color.background, '#f8fafcba');
  assert.equal(lightDimmed.color.border, '#cbd5e166');
  assert.equal(lightDimmed.font.color, '#94a3b8');

  // Birincil odakta soluk olmayan düğüm: focusBorder
  const darkFocus = adapter.toVisNodes({ focusedNodeId: 'platon', isDark: true, getEraTheme })
    .find(n => n.id === 'platon');
  const lightFocus = adapter.toVisNodes({ focusedNodeId: 'platon', isDark: false, getEraTheme })
    .find(n => n.id === 'platon');
  assert.equal(darkFocus.color.border, '#fbbf24');
  assert.equal(lightFocus.color.border, '#d97706');
});
