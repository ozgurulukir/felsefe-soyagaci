'use strict';

// Dönem (era) tanımlarının dosyalar arası tutarlılık testi:
// schema.js ERAS listesi SSOT; graph-db.js taban seviyelerini, era-themes.js
// renklerini ve data/entities.js geçerliliğini buradan doğrularız.

const test = require('node:test');
const assert = require('node:assert');
const { PhilosophySchema, normalizeTurkish } = require('../js/core/schema.js');
const { PhilosophyGraphDatabase } = require('../js/core/graph-db.js');

// data dosyaları global script olarak yazıldığı için Node'da global'e koy
globalThis.PhilosophySchema = PhilosophySchema;
const { RAW_ENTITIES } = require('../js/data/entities.js');
const { RAW_RELATIONS } = require('../js/data/relations.js');
const { RAW_ERA_THEMES } = require('../js/data/era-themes.js');

// graph-db.js tarayıcıda CDN'den gelen graphology'yi bekler; Node'da test için
// kullanılan minimal API yüzeyini (addNode, addEdgeWithKey, map*, order) taklit et.
class StubGraph {
  constructor() { this._nodes = new Map(); this._edges = new Map(); }
  get order() { return this._nodes.size; }
  addNode(id, attrs) { this._nodes.set(id, attrs); }
  hasNode(id) { return this._nodes.has(id); }
  getNodeAttributes(id) { return this._nodes.get(id); }
  addEdgeWithKey(key, from, to, attrs) { this._edges.set(key, { attrs, from, to }); }
  mapNodes(fn) { return [...this._nodes].map(([id, attrs]) => fn(id, attrs)); }
  mapEdges(fn) { return [...this._edges].map(([eid, e]) => fn(eid, e.attrs, e.from, e.to)); }
  mapInEdges(id, fn) { return [...this._edges].filter(e => e.to === id).map(([eid, e]) => fn(eid, e.attrs, e.from)); }
  mapOutEdges(id, fn) { return [...this._edges].filter(e => e.from === id).map(([eid, e]) => fn(eid, e.attrs, e.from, e.to)); }
}
globalThis.window = { graphology: { Graph: StubGraph } };

const ERAS = PhilosophySchema.ERAS;

test('ERAS: id\'ler benzersiz ve sıralı', () => {
  const ids = ERAS.map(e => e.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'duplicate era id');
  assert.deepStrictEqual(ids, PhilosophySchema.VALID_ERAS);
});

test('ERAS: baseLevel katı artan (kronolojik katman geometrisi)', () => {
  for (let i = 1; i < ERAS.length; i++) {
    assert.ok(ERAS[i].baseLevel > ERAS[i - 1].baseLevel,
      `baseLevel artmalı: ${ERAS[i - 1].id} -> ${ERAS[i].id}`);
  }
});

test('ERAS: her id için label ve baseLevel mevcut', () => {
  for (const e of ERAS) {
    assert.ok(typeof e.id === 'string' && e.id.length > 0, 'id eksik');
    assert.ok(typeof e.label === 'string' && e.label.length > 0, `label eksik: ${e.id}`);
    assert.ok(Number.isInteger(e.baseLevel) && e.baseLevel >= 0, `baseLevel eksik: ${e.id}`);
  }
});

test('tüm varlıkların dönemi VALID_ERAS içinde (schema doğrulamasından bağımsız çapraz kontrol)', () => {
  for (const entity of Object.values(RAW_ENTITIES)) {
    assert.ok(PhilosophySchema.VALID_ERAS.includes(entity.era),
      `bilinmeyen dönem: ${entity.era} (id: ${entity.id})`);
  }
});

test('her dönemin hem dark hem light teması var (era-themes ile SSOT uyumu)', () => {
  for (const era of PhilosophySchema.VALID_ERAS) {
    assert.ok(RAW_ERA_THEMES.dark[era], `dark teması eksik: ${era}`);
    assert.ok(RAW_ERA_THEMES.light[era], `light teması eksik: ${era}`);
  }
});

test('gerçek veriyle graf kurulumu seviye ataması ERAS tabanlarından gelir', () => {
  const db = new PhilosophyGraphDatabase(RAW_ENTITIES, RAW_RELATIONS);
  const baseById = new Map(ERAS.map(e => [e.id, e.baseLevel]));
  for (const entity of db.getAllEntities()) {
    const base = baseById.get(entity.era);
    assert.ok(Number.isInteger(base), `ERAS tabanı yok: ${entity.era}`);
    const level = db.getLevel(entity.id);
    assert.ok(level >= base, `level < baseLevel: ${entity.id} (${level} < ${base})`);
  }
});

test('normalizeTurkish: Türkçe duyarlı normalizasyon çalışıyor', () => {
  assert.strictEqual(normalizeTurkish('ŞİMDİ'), 'simdi');
  assert.strictEqual(normalizeTurkish('IĞDIR'), 'igdir');
  assert.strictEqual(normalizeTurkish(null), '');
});
