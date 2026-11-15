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
