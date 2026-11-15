'use strict';

// LeafletMapManager'ın saf yay matematiği (getCurvedArcPoints):
// harita kütüphanesi (L) olmadan uç nokta ve kavis özelliklerini sınar.

const test = require('node:test');
const assert = require('node:assert');
const { getCurvedArcPoints } = require('../js/core/leaflet-map.js');

const p1 = [41.0, 28.9];   // İstanbul
const p2 = [38.0, 23.7];   // Atina

test('Yay: uç noktalar girdi noktalarıyla birebir aynı', () => {
  const pts = getCurvedArcPoints(p1, p2);
  assert.deepEqual(pts[0], p1);
  assert.deepEqual(pts[pts.length - 1], p2);
});

test('Yay: 17 örnek nokta üretir (16 segment)', () => {
  assert.equal(getCurvedArcPoints(p1, p2).length, 17);
});

test('Yay: orta nokta düz çizgiden sapar (kavisli)', () => {
  const pts = getCurvedArcPoints(p1, p2, 0.14);
  const mid = pts[Math.floor(pts.length / 2)];
  const straightMid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  const deviation = Math.hypot(mid[0] - straightMid[0], mid[1] - straightMid[1]);
  assert.ok(deviation > 0.05, `kavis sapması çok küçük: ${deviation}`);
});

test('Yay: curveFactor 0 ise düz çizgiye iner', () => {
  const pts = getCurvedArcPoints(p1, p2, 0);
  const mid = pts[Math.floor(pts.length / 2)];
  const straightMid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  assert.ok(Math.abs(mid[0] - straightMid[0]) < 1e-12);
  assert.ok(Math.abs(mid[1] - straightMid[1]) < 1e-12);
});
