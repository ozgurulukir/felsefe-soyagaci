'use strict';

// PhilosophyGraphDatabase.findPath: yönlü BFS → ters yönlü BFS → yönsüz BFS
// öncelik sırasını ve sınır durumlarını (aynı düğüm, bilinmeyen id, ulaşılmaz) sınar.

const test = require('node:test');
const assert = require('node:assert');
const { PhilosophySchema } = require('../js/core/schema.js');
globalThis.PhilosophySchema = PhilosophySchema;
const { PhilosophyGraphDatabase } = require('../js/core/graph-db.js');

// schema.test.js ile aynı minimal graphology taklidi
class StubGraph {
  constructor() { this._nodes = new Map(); this._edges = new Map(); }
  get order() { return this._nodes.size; }
  addNode(id, attrs) { this._nodes.set(id, attrs); }
  hasNode(id) { return this._nodes.has(id); }
  getNodeAttributes(id) { return this._nodes.get(id); }
  addEdgeWithKey(key, from, to, attrs) { this._edges.set(key, { attrs, from, to }); }
  mapNodes(fn) { return [...this._nodes].map(([id, attrs]) => fn(id, attrs)); }
  mapEdges(fn) { return [...this._edges].map(([eid, e]) => fn(eid, e.attrs, e.from, e.to)); }
  mapInEdges(id, fn) { return [...this._edges].filter(([, e]) => e.to === id).map(([eid, e]) => fn(eid, e.attrs, e.from)); }
  mapOutEdges(id, fn) { return [...this._edges].filter(([, e]) => e.from === id).map(([eid, e]) => fn(eid, e.attrs, e.from, e.to)); }
}
globalThis.window = { graphology: { Graph: StubGraph } };

function makeEntity(id, era = 'antik') {
  return {
    id, name: id, dates: 'MÖ 470–399', era, eraName: 'Antik Yunan',
    school: 'okul', city: 'Atina', quote: 'söz', summary: 'özet'
  };
}

// a ➔ b (master), c ➔ b (influence): b ortak ardıl, d izole
function makeDb() {
  const entities = { a: makeEntity('a'), b: makeEntity('b'), c: makeEntity('c'), d: makeEntity('d') };
  const relations = [
    { from: 'a', to: 'b', type: 'master', label: 'öğretti' },
    { from: 'c', to: 'b', type: 'influence', label: 'etkilendi' }
  ];
  return new PhilosophyGraphDatabase(entities, relations);
}

const db = makeDb();

test('findPath: yönlü yol varsa onu döner', () => {
  assert.deepStrictEqual(db.findPath('a', 'b'), ['a', 'b']);
});

test('findPath: ters yönde seçimde end→start yönlü yolunun tersi döner', () => {
  assert.deepStrictEqual(db.findPath('b', 'a'), ['b', 'a']);
});

test('findPath: yönlü akış yoksa yönsüz bağlantıyı bulur', () => {
  // a ve c arasında yönlü yol yok (ikisi de b'ye akar); yönsüz: a—b—c
  assert.deepStrictEqual(db.findPath('a', 'c'), ['a', 'b', 'c']);
});

test('findPath: izole düğüme ulaşamazsa null döner', () => {
  assert.strictEqual(db.findPath('a', 'd'), null);
});

test('findPath: aynı düğüm → tek elemanlı yol', () => {
  assert.deepStrictEqual(db.findPath('a', 'a'), ['a']);
});

test('findPath: bilinmeyen id → null', () => {
  assert.strictEqual(db.findPath('a', 'yok'), null);
  assert.strictEqual(db.findPath('yok', 'a'), null);
});
