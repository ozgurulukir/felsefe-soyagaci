'use strict';

// GeoMode.isLeafletReady: karo motoru kullanılabilir mi? (motor seçimi +
// Leaflet kütüphanesi hazır) — app.js ve pathfinder'ın ortak kapısı.

const test = require('node:test');
const assert = require('node:assert');
const { ViewUi } = require('../js/core/view-ui.js');
globalThis.ViewUi = ViewUi;
const { GeoMode } = require('../js/ui/geo-mode.js');

let layout = 'geo';
GeoMode.init({
  getLayout: () => layout,
  getNetwork: () => null,
  getNodesDataSet: () => null,
  refreshGraphVisuals: () => {},
  getNetworkOptions: () => ({}),
  getAnimOptions: () => ({}),
  selectAndFocus: () => {}
});

test('isLeafletReady: geo + Leaflet hazır → true', () => {
  layout = 'geo';
  globalThis.window = { LeafletMapManager: { isInitialized: true } };
  try {
    assert.strictEqual(GeoMode.isLeafletReady(), true);
  } finally {
    delete globalThis.window;
  }
});

test('isLeafletReady: geo + Leaflet henüz kurulmadı → false', () => {
  layout = 'geo';
  globalThis.window = { LeafletMapManager: { isInitialized: false } };
  try {
    assert.strictEqual(GeoMode.isLeafletReady(), false);
  } finally {
    delete globalThis.window;
  }
});

test('isLeafletReady: geo + Leaflet kütüphanesi yüklenemedi → false', () => {
  layout = 'geo';
  globalThis.window = {};
  try {
    assert.strictEqual(GeoMode.isLeafletReady(), false);
  } finally {
    delete globalThis.window;
  }
});

test('isLeafletReady: geo dışı düzen → false', () => {
  layout = 'UD';
  globalThis.window = { LeafletMapManager: { isInitialized: true } };
  try {
    assert.strictEqual(GeoMode.isLeafletReady(), false);
  } finally {
    layout = 'geo';
    delete globalThis.window;
  }
});

test('activateEngine: Atlas modunda tuval boyutunu geri yükler, seçenekleri uygular ve kadrajlar', () => {
  layout = 'geo';
  const calls = [];
  const fakeNetwork = {
    setSize: (w, h) => calls.push(['setSize', w, h]),
    setOptions: (opts) => calls.push(['setOptions', opts]),
    moveTo: (opts) => calls.push(['moveTo', opts]),
    redraw: () => calls.push(['redraw']),
    moveNode: () => calls.push(['moveNode'])
  };
  globalThis.document = {
    getElementById: () => null,
    querySelector: () => ({ appendChild: () => {} })
  };
  globalThis.window = { innerWidth: 1440 };

  GeoMode.init({
    getLayout: () => layout,
    getNetwork: () => fakeNetwork,
    getNodesDataSet: () => null,
    refreshGraphVisuals: () => calls.push(['refreshGraphVisuals']),
    getNetworkOptions: (l) => ({ layoutType: l }),
    getAnimOptions: (d) => ({ duration: d }),
    selectAndFocus: () => {}
  });

  try {
    GeoMode.setAtlasMode(true);
    assert.strictEqual(GeoMode.isAtlasMode(), true);
    assert.deepStrictEqual(calls.map(c => c[0]), [
      'setSize',
      'setOptions',
      'refreshGraphVisuals',
      'moveTo',
      'redraw'
    ]);
    const moveToArg = calls.find(c => c[0] === 'moveTo')[1];
    assert.strictEqual(moveToArg.scale, 0.43);
    assert.deepStrictEqual(moveToArg.position, { x: 320, y: -230 });
    assert.strictEqual(moveToArg.animation, false);
  } finally {
    layout = 'UD';
    GeoMode.init({
      getLayout: () => layout,
      getNetwork: () => null,
      getNodesDataSet: () => null,
      refreshGraphVisuals: () => {},
      getNetworkOptions: () => ({}),
      getAnimOptions: () => ({}),
      selectAndFocus: () => {}
    });
    GeoMode.setAtlasMode(false);
    layout = 'geo';
    delete globalThis.document;
    delete globalThis.window;
  }
});
