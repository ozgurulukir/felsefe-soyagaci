'use strict';

// Elle düzenlenen veri dosyalarının (entities, relations, geo-coordinates)
// dosyalar arası değişmezlerini (invariant) doğrulayan bütünlük testi.
// Şema içi kontroller schema.test.js'tedir; buradaki kurallar SSOT'lar ARASINDADIR:
//   - relation uçları var olan varlıklara işaret etmeli
//   - her varlığın koordinatı olmalı (yoksa düğüm {x:0,y:0}'a düşer — sessiz hata)
//   - koordinat listesinde artık var olmayan id kalmamalı
//   - master ilişkisi kronolojik olarak geriye dönük olmamalı

const test = require('node:test');
const assert = require('node:assert');
const { PhilosophySchema } = require('../js/core/schema.js');

globalThis.PhilosophySchema = PhilosophySchema;
const { RAW_ENTITIES } = require('../js/data/entities.js');
const { RAW_RELATIONS } = require('../js/data/relations.js');
const { PhilosophyGeo } = require('../js/data/geo-coordinates.js');

// RAW_ENTITIES id anahtarlı nesne; relations düz dizi
const entities = Object.values(RAW_ENTITIES);
const relations = RAW_RELATIONS;
const coords = PhilosophyGeo.PHILOSOPHER_COORDS;
const entityIds = new Set(entities.map(e => e.id));

test('entities: id alanı ile nesne anahtarı birebir aynı', () => {
  for (const [key, entity] of Object.entries(RAW_ENTITIES)) {
    assert.strictEqual(entity.id, key, `id alanı anahtarla uyuşmuyor: ${key} vs ${entity.id}`);
  }
});

test('relations: her uç var olan bir varlığa işaret ediyor (dangling yok)', () => {
  for (const rel of relations) {
    assert.ok(entityIds.has(rel.from), `dangling from: ${rel.from} -> ${rel.to}`);
    assert.ok(entityIds.has(rel.to), `dangling to: ${rel.from} -> ${rel.to}`);
  }
});

test('relations: self-loop yok (filozof kendi hocası olamaz)', () => {
  const loops = relations.filter(r => r.from === r.to);
  assert.deepStrictEqual(loops, [], `self-loop: ${loops.map(r => r.from).join(', ')}`);
});

test('relations: aynı (from,to,type) üçlüsü tekrar etmiyor', () => {
  const seen = new Map();
  for (const rel of relations) {
    const key = `${rel.from}>${rel.to}>${rel.type}`;
    assert.ok(!seen.has(key), `tekrar eden ilişki: ${key} (ilk: satır yok, ikinci kez)`);
    seen.set(key, rel);
  }
});

test('relations: karşılıklı (reciprocal) çift yok', () => {
  const pairs = new Set(relations.map(r => `${r.from}>${r.to}>${r.type}`));
  const reciprocals = relations
    .filter(r => r.from < r.to && pairs.has(`${r.to}>${r.from}>${r.type}`))
    .map(r => `${r.from} <-> ${r.to} (${r.type})`);
  assert.deepStrictEqual(reciprocals, [],
    'karşılıklı çiftler elle düzenlemeden kaynaklanan hatadır; kasıtlıysa buraya whitelist ekleyin');
});

test('relations: master ilişkisi kronolojik olarak geriye dönük değil', () => {
  // Hocanın dönemi, öğrencinin döneminden SONRA olamaz (influence geriye dönük
  // olabilir — canlanma/etki — ama master olamaz).
  const baseById = new Map(PhilosophySchema.ERAS.map(e => [e.id, e.baseLevel]));
  const byId = new Map(entities.map(e => [e.id, e]));
  const inverted = [];
  for (const rel of relations) {
    if (rel.type !== 'master') continue;
    const fromBase = baseById.get(byId.get(rel.from).era);
    const toBase = baseById.get(byId.get(rel.to).era);
    if (fromBase > toBase) {
      inverted.push(`${rel.from} (${byId.get(rel.from).era}) -> ${rel.to} (${byId.get(rel.to).era})`);
    }
  }
  assert.deepStrictEqual(inverted, [], `dönemi ters master ilişkisi: ${inverted.join(', ')}`);
});

test('coords: her varlığın koordinatı var (yoksa düğüm {x:0,y:0} köşesine düşer)', () => {
  const missing = entities.filter(e => !coords[e.id]).map(e => e.id);
  assert.deepStrictEqual(missing, [],
    'koordinat eksik: geo görünümde sessizce köşeye yerleşir — geo-coordinates.js\'e ekleyin');
});

test('coords: artık var olmayan varlığa ait koordinat kalmamış (orphan yok)', () => {
  const orphans = Object.keys(coords).filter(id => !entityIds.has(id));
  assert.deepStrictEqual(orphans, [], `artık var olmayan koordinat girdisi: ${orphans.join(', ')}`);
});

test('coords: koordinatlar makul Enlem/Boylam aralığında', () => {
  for (const [id, ll] of Object.entries(coords)) {
    assert.ok(Array.isArray(ll) && ll.length === 2, `koordinat formatı: ${id}`);
    const [lat, lng] = ll;
    assert.ok(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180,
      `Enlem/Boylam aralık dışı: ${id} (${lat}, ${lng})`);
  }
});

test('coords: her id için geocode jitter türetilebiliyor (getPhilosopherLatLng null dönmez)', () => {
  for (const id of entityIds) {
    const ll = PhilosophyGeo.getPhilosopherLatLng(id);
    assert.ok(Array.isArray(ll) && ll.length === 2, `getPhilosopherLatLng null/bozuk: ${id}`);
  }
});
