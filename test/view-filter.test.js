'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { ViewFilter } = require('../js/core/view-filter.js');
// vis-adapter global script olarak yazıldığı için Node'da ViewFilter'ı global'e koy
globalThis.ViewFilter = ViewFilter;
const { GraphToVisAdapter } = require('../js/core/vis-adapter.js');

// Küçük sahte db: ViewFilter'ın ihtiyaç duyduğu arayüz (getAllEntities,
// getAllRelations, getEntity, getNeighborhoodSet)
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

test('Yol vurgusu: yoldaki düğümler vurgulu, yoldakiler soluk', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, { highlightPath: ['sokrates', 'platon', 'aristoteles'] });

  assert.equal(view.nodeStates.get('sokrates').isHighlighted, true);
  assert.equal(view.nodeStates.get('platon').isHighlighted, true);
  assert.equal(view.nodeStates.get('kant').isDimmed, true);
  assert.equal(view.nodeStates.get('kant').isHighlighted, false);
});

test('Yol uçları birincil odak (isPrimaryFocus)', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, { highlightPath: ['sokrates', 'platon', 'aristoteles'] });

  assert.equal(view.nodeStates.get('sokrates').isPrimaryFocus, true);
  assert.equal(view.nodeStates.get('aristoteles').isPrimaryFocus, true);
  assert.equal(view.nodeStates.get('platon').isPrimaryFocus, false);
});

test('Yol kenarları iki yönde de vurgulu (yönsüz vurgu)', () => {
  const db = makeFakeDb();
  // kant -> platon etkisi ters kronolojik; platon -> sokrates yol kenarı ters yönde aranıyor
  const view = ViewFilter.resolveViewStates(db, { highlightPath: ['platon', 'sokrates'] });

  assert.equal(view.edgeStates.get('edge_0').isHighlighted, true, 'edge_0 ters yönde de vurgulu olmalı');
  assert.equal(view.edgeStates.get('edge_1').isDimmed, true);
});

test('Odak düğümü: komşuluk vurgusu, komşu olmayan soluk', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, { focusedNodeId: 'platon' });

  assert.equal(view.nodeStates.get('sokrates').isHighlighted, true);
  assert.equal(view.nodeStates.get('aristoteles').isHighlighted, true);
  assert.equal(view.nodeStates.get('kant').isHighlighted, true);
  assert.equal(view.nodeStates.get('platon').isPrimaryFocus, true);

  assert.equal(view.edgeStates.get('edge_0').isHighlighted, true);
  assert.equal(view.edgeStates.get('edge_2').isHighlighted, true);
  // edge_1 (platon->aristoteles) da odağa değiyor, vurgulu olmalı
  assert.equal(view.edgeStates.get('edge_1').isHighlighted, true);
  assert.equal(view.edgeStates.get('edge_1').isDimmed, false);
});

test('Dönem filtresi: dış dönemdeki düğümler soluk; iki ucu da dışarıda olan kenar soluk', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, { filteredEra: 'aydinlanma' });

  assert.equal(view.nodeStates.get('kant').isDimmed, false);
  assert.equal(view.nodeStates.get('sokrates').isDimmed, true);

  // kenar soluklaşması: iki uç da filtre döneminin dışındaysa
  assert.equal(view.edgeStates.get('edge_0').isDimmed, true, 'sokrates->platon: iki uç da aydinlanma dışı');
  assert.equal(view.edgeStates.get('edge_2').isDimmed, false, 'kant->platon: bir uç aydinlanma içinde');
});

test('Filtre yokken hiçbir şey soluk değil', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, {});

  for (const s of view.nodeStates.values()) {
    assert.equal(s.isDimmed, false);
  }
  for (const s of view.edgeStates.values()) {
    assert.equal(s.isDimmed, false);
  }
});

test('GraphToVisAdapter enjekte edilen isDark temasını kullanır (DOM okumadan)', () => {
  const db = makeFakeDb();
  const adapter = new GraphToVisAdapter(db);
  const eraThemes = require('../js/data/era-themes.js');

  const lightNodes = adapter.toVisNodes({
    filteredEra: 'antik',
    isDark: false,
    getEraTheme: (era, mode) => eraThemes.getEraTheme(era, mode)
  });
  const darkNodes = adapter.toVisNodes({
    filteredEra: 'antik',
    isDark: true,
    getEraTheme: (era, mode) => eraThemes.getEraTheme(era, mode)
  });

  const lightKant = lightNodes.find(n => n.id === 'kant');
  const darkKant = darkNodes.find(n => n.id === 'kant');

  // Soluk düğüm arka planı temaya göre farklı olmalı
  assert.equal(lightKant.color.background, '#f8fafcba');
  assert.equal(darkKant.color.background, '#090d16cc');
  // Soluk düğümde gölge kapalı
  assert.equal(lightKant.shadow, false);
  // Vurgusuz Platon temalı arka plan kullanır (light antik: #fffbeb)
  const lightPlaton = lightNodes.find(n => n.id === 'platon');
  assert.equal(lightPlaton.color.background, '#fffbeb');
});

test('GraphToVisAdapter kenar stilleri: enjekte edilen isDark ile soluk renkler', () => {
  const db = makeFakeDb();
  const adapter = new GraphToVisAdapter(db);

  const edges = adapter.toVisEdges({ filteredEra: 'aydinlanma', isDark: false });
  const sokratesEdge = edges.find(e => e.id === 'edge_0');
  assert.equal(sokratesEdge.color.opacity, 0.20, 'soluk kenar opaklığı 0.20 olmalı');
});

test('Tek elemanlı yol: uç düğüm hem vurgulu hem birincil odak, kenarlar soluk', () => {
  const db = makeFakeDb();
  const view = ViewFilter.resolveViewStates(db, { highlightPath: ['platon'] });

  const platon = view.nodeStates.get('platon');
  assert.equal(platon.isHighlighted, true);
  assert.equal(platon.isPrimaryFocus, true);
  for (const s of view.edgeStates.values()) {
    assert.equal(s.isDimmed, true, 'yol kenarı yokken tüm kenarlar soluklaşmalı');
  }
});

test('Var olmayan düşünüre işaret eden kenar dönem filtresi dışında soluklaşır (bilinçli değişiklik)', () => {
  const db = makeFakeDb();
  const relations = [
    { id: 'edge_0', from: 'sokrates', to: 'platon', type: 'master', label: 'x' },
    { id: 'edge_9', from: 'sokrates', to: 'hayali', type: 'master', label: 'x' }
  ];
  const brokenDb = {
    getAllEntities: db.getAllEntities,
    getAllRelations: () => relations,
    getEntity: db.getEntity,
    getNeighborhoodSet: db.getNeighborhoodSet
  };
  const view = ViewFilter.resolveViewStates(brokenDb, { filteredEra: 'aydinlanma' });
  assert.equal(view.edgeStates.get('edge_9').isDimmed, true, 'kayıp uç = dönem dışı sayılır');
});
