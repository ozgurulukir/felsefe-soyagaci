'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { Viewport } = require('../js/core/viewport.js');

// Sahte motorlar: her test öncesi sıfırlanır
let leafletReady = false;
let geoLayout = false;
let leafletCalls = [];
let networkCalls = [];
let atlasFrames = 0;

const fakeLeaflet = {
  zoomIn: () => leafletCalls.push('zoomIn'),
  zoomOut: () => leafletCalls.push('zoomOut'),
  fitAll: () => leafletCalls.push('fitAll'),
  fitPath: (ids) => leafletCalls.push(['fitPath', ids]),
  focusNode: (id) => leafletCalls.push(['focusNode', id])
};

const fakeNetwork = {
  getScale: () => 1,
  moveTo: (o) => networkCalls.push(['moveTo', o]),
  fit: (o) => networkCalls.push(['fit', o]),
  selectNodes: (ids) => networkCalls.push(['selectNodes', ids]),
  focus: (id, o) => networkCalls.push(['focus', id, o])
};

Viewport.init({
  getNetwork: () => fakeNetwork,
  getAnimOptions: (ms) => ({ duration: ms }),
  isLeafletReady: () => leafletReady,
  getLeafletManager: () => fakeLeaflet,
  isGeoLayout: () => geoLayout,
  frameAtlas: () => { atlasFrames++; }
});

function reset() {
  leafletReady = false;
  geoLayout = false;
  leafletCalls = [];
  networkCalls = [];
  atlasFrames = 0;
}

test('zoomIn/zoomOut: Leaflet hazırsa karo motoruna gider', () => {
  reset();
  leafletReady = true;
  Viewport.zoomIn();
  Viewport.zoomOut();
  assert.deepStrictEqual(leafletCalls, ['zoomIn', 'zoomOut']);
  assert.deepStrictEqual(networkCalls, []);
});

test('zoomIn/zoomOut: ağ modunda vis-network ölçeğini çarpar', () => {
  reset();
  Viewport.zoomIn();
  Viewport.zoomOut();
  assert.strictEqual(networkCalls[0][0], 'moveTo');
  assert.strictEqual(networkCalls[0][1].scale, Viewport.ZOOM_IN_FACTOR);
  assert.strictEqual(networkCalls[1][1].scale, Viewport.ZOOM_OUT_FACTOR);
  assert.deepStrictEqual(leafletCalls, []);
});

test('fitAll: Leaflet > Atlas kadrajı > ağ önceliği', () => {
  reset();
  leafletReady = true;
  Viewport.fitAll();
  assert.deepStrictEqual(leafletCalls, ['fitAll']);

  reset();
  geoLayout = true;
  Viewport.fitAll();
  assert.strictEqual(atlasFrames, 1);
  assert.deepStrictEqual(networkCalls, []);

  reset();
  Viewport.fitAll();
  assert.strictEqual(networkCalls[0][0], 'fit');
  assert.strictEqual(atlasFrames, 0);
});

test('fitNodes: Leaflet\'te fitPath, ağda nodes ile fit', () => {
  reset();
  leafletReady = true;
  Viewport.fitNodes(['a', 'b']);
  assert.deepStrictEqual(leafletCalls, [['fitPath', ['a', 'b']]]);

  reset();
  Viewport.fitNodes(['a']);
  assert.strictEqual(networkCalls[0][0], 'fit');
  assert.deepStrictEqual(networkCalls[0][1].nodes, ['a']);
});

test('fitNodes: boş liste motoru hiç uğraştırmaz', () => {
  reset();
  Viewport.fitNodes([]);
  Viewport.fitNodes(null);
  assert.deepStrictEqual(networkCalls, []);
  assert.deepStrictEqual(leafletCalls, []);
});

test('focusNode: Leaflet\'te db ile odaklanır, ağda seçip yakınlaştırır', () => {
  reset();
  leafletReady = true;
  Viewport.focusNode('sokrates', {});
  assert.deepStrictEqual(leafletCalls, [['focusNode', 'sokrates']]);

  reset();
  Viewport.focusNode('sokrates', {});
  assert.deepStrictEqual(networkCalls[0], ['selectNodes', ['sokrates']]);
  assert.strictEqual(networkCalls[1][0], 'focus');
  assert.strictEqual(networkCalls[1][2].scale, Viewport.FOCUS_SCALE);
});

test('ağ motoru yokken çağrılar patlamaz', () => {
  reset();
  Viewport.init({
    getNetwork: () => null,
    getAnimOptions: () => ({}),
    isLeafletReady: () => false,
    getLeafletManager: () => fakeLeaflet,
    isGeoLayout: () => false,
    frameAtlas: () => {}
  });
  assert.doesNotThrow(() => {
    Viewport.zoomIn();
    Viewport.zoomOut();
    Viewport.fitAll();
    Viewport.fitNodes(['a']);
    Viewport.focusNode('a', {});
  });
});
