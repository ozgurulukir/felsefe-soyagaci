'use strict';

// SearchUi.matchEntities: saf filtre + slice(0,10). Türkçe normalize
// schema.normalizeTurkish ile; boş sorgu ve eşleşme yok → [].

const test = require('node:test');
const assert = require('node:assert');
const { SearchUi, matchEntities } = require('../js/ui/search.js');
const { normalizeTurkish } = require('../js/core/schema.js');

function makeEntities() {
  return [
    { id: 'sokrates', name: 'Sokrates', school: 'Agora', city: 'Atina', concepts: ['Erdem'], works: ['Savunma'] },
    { id: 'platon', name: 'Platon', school: 'Akademi', city: 'Atina', concepts: ['Idealar'], works: ['Devlet'] },
    { id: 'aristoteles', name: 'Aristoteles', school: 'Liseum', city: 'Atina', concepts: ['Etik'], works: ['Metafizik'] },
    { id: 'ibn-sina', name: 'İbn Sînâ', school: 'İslam Felsefesi', city: 'Buhara', concepts: ['Tıp'], works: ['Şifa'] },
    { id: 'descartes', name: 'Descartes', school: 'Rasyonalizm', city: 'Paris', concepts: ['Cogito'], works: ['Metot'] }
  ];
}

test('matchEntities: ada göre Türkçe karakter eşleşmesi (sokrates → Sokrates, İ/ı)', () => {
  const entities = makeEntities();
  const byName = matchEntities(entities, 'sokrates', normalizeTurkish);
  assert.strictEqual(byName.length, 1);
  assert.strictEqual(byName[0].id, 'sokrates');

  const byIbn = matchEntities(entities, 'ibn sina', normalizeTurkish);
  assert.ok(byIbn.some(e => e.id === 'ibn-sina'));
});

test('matchEntities: school, concepts, works, city alanlarında eşleşir', () => {
  const entities = makeEntities();

  assert.ok(matchEntities(entities, 'Akademi', normalizeTurkish).some(e => e.id === 'platon'));
  assert.ok(matchEntities(entities, 'Idealar', normalizeTurkish).some(e => e.id === 'platon'));
  assert.ok(matchEntities(entities, 'Devlet', normalizeTurkish).some(e => e.id === 'platon'));
  assert.ok(matchEntities(entities, 'Buhara', normalizeTurkish).some(e => e.id === 'ibn-sina'));
  assert.ok(matchEntities(entities, 'Metafizik', normalizeTurkish).some(e => e.id === 'aristoteles'));
});

test('matchEntities: boş sorgu → []', () => {
  const entities = makeEntities();
  assert.deepStrictEqual(matchEntities(entities, '', normalizeTurkish), []);
  assert.deepStrictEqual(matchEntities(entities, '   ', normalizeTurkish), []);
});

test('matchEntities: eşleşme yok → []', () => {
  const entities = makeEntities();
  assert.deepStrictEqual(matchEntities(entities, 'zzzz-yok-boyle', normalizeTurkish), []);
});

test('matchEntities: 12 eşleşen varlık → en fazla 10 döner', () => {
  const entities = Array.from({ length: 12 }, (_, i) => ({
    id: 'p' + i,
    name: 'Filozof ' + i,
    school: 'Okul',
    city: 'Şehir',
    concepts: [],
    works: []
  }));
  const matches = matchEntities(entities, 'Filozof', normalizeTurkish);
  assert.strictEqual(matches.length, 10);
  assert.strictEqual(matches[0].id, 'p0');
  assert.strictEqual(matches[9].id, 'p9');
});

test('matchEntities: 3. argüman yoksa varsayılan normalizeTurkish devreye girer (defaultNormalize)', () => {
  const entities = makeEntities();
  // normalize parametresi bilinçli olarak geçirilmiyor: Node'da require('../core/schema.js')
  const matches = matchEntities(entities, 'sokrates');
  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0].id, 'sokrates');
  assert.deepStrictEqual(matchEntities(entities, '   '), []);

  // Dış aktarım sözleşmesi: { SearchUi, matchEntities } — ikisi de mevcut
  assert.strictEqual(typeof SearchUi.init, 'function');
  assert.strictEqual(typeof SearchUi.handleSearch, 'function');
  assert.strictEqual(typeof SearchUi.handleKeydown, 'function');
});
