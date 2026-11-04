'use strict';

// ViewUi: app.js'in DOM'suz UI kararlarının (bant, çekmece politikası,
// motor/konteyner) saf türetimi. app.js Node'da yüklenemediği için bu
// kararlar burada, sahte db ile sınanır.

const test = require('node:test');
const assert = require('node:assert');
const { ViewUi } = require('../js/core/view-ui.js');

function makeFakeDb() {
  const entities = [
    { id: 'sokrates', era: 'antik', name: 'Sokrates' },
    { id: 'platon', era: 'antik', name: 'Platon' }
  ];
  return {
    getEntity: (id) => entities.find(e => e.id === id) || null,
    getTeachers: (id) => (id === 'platon' ? [entities[0]] : []),
    getStudents: (id) => (id === 'sokrates' ? [entities[1]] : [])
  };
}
const db = makeFakeDb();

test('Bant: çok elemanlı yol önceliklidir (seçim olsa bile)', () => {
  const view = ViewUi.deriveBanner(db, { pathId: ['sokrates', 'platon'], selectedId: 'sokrates' });
  assert.strictEqual(view.kind, 'path');
  assert.strictEqual(view.first.name, 'Sokrates');
  assert.strictEqual(view.last.name, 'Platon');
  assert.strictEqual(view.steps, 1);
});

test('Bant: seçim varken odak türü döner, hocayı/öğrenciyi sayar', () => {
  const view = ViewUi.deriveBanner(db, { pathId: null, selectedId: 'platon' });
  assert.strictEqual(view.kind, 'focus');
  assert.strictEqual(view.person.name, 'Platon');
  assert.strictEqual(view.teachersCount, 1);
  assert.strictEqual(view.studentsCount, 0);
});

test('Bant: ne yol ne seçim → none', () => {
  assert.strictEqual(ViewUi.deriveBanner(db, { pathId: null, selectedId: null }).kind, 'none');
});

test('Bant: tek elemanlı yol bant üretmez (eşik > 1) ve seçime düşer', () => {
  const view = ViewUi.deriveBanner(db, { pathId: ['sokrates'], selectedId: 'sokrates' });
  assert.strictEqual(view.kind, 'focus');
});

test('Bant: seçilen id var olmayan bir düşünüreyse none döner (çökmez)', () => {
  const view = ViewUi.deriveBanner(db, { pathId: null, selectedId: 'yok-boyle' });
  assert.strictEqual(view.kind, 'none');
});

test('Çekmece politikası: yol varken close-drawer, yokken clear-focus', () => {
  assert.strictEqual(ViewUi.drawerActionFor({ pathId: ['sokrates', 'platon'] }), 'close-drawer');
  assert.strictEqual(ViewUi.drawerActionFor({ pathId: null }), 'clear-focus');
  assert.strictEqual(ViewUi.drawerActionFor({}), 'clear-focus');
});

test('Motor: geo + karo → Leaflet etkin, tiles konteyneri görünür', () => {
  assert.deepStrictEqual(
    ViewUi.deriveEngineState({ layout: 'geo', geoAtlasMode: false }),
    { isLeafletEngine: true, visibleContainer: 'tiles' }
  );
});

test('Motor: geo + atlas → yerleşik Atlas etkin', () => {
  assert.deepStrictEqual(
    ViewUi.deriveEngineState({ layout: 'geo', geoAtlasMode: true }),
    { isLeafletEngine: false, visibleContainer: 'atlas' }
  );
});

test('Motor: geo dışı düzen → normal graf konteyneri', () => {
  for (const layout of ['UD', 'LR', 'free']) {
    const view = ViewUi.deriveEngineState({ layout, geoAtlasMode: false });
    assert.strictEqual(view.isLeafletEngine, false, layout);
    assert.strictEqual(view.visibleContainer, 'graph', layout);
  }
});
