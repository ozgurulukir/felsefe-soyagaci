'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { LayoutPref } = require('../js/core/layout-pref.js');

test('resolve: URL tercihi geçerliyse kazanır', () => {
  assert.strictEqual(LayoutPref.resolve('LR', 'free'), 'LR');
});

test('resolve: URL boşsa kayıtlı tercih kullanılır', () => {
  assert.strictEqual(LayoutPref.resolve(null, 'free'), 'free');
  assert.strictEqual(LayoutPref.resolve('', 'geo'), 'geo');
});

test('resolve: geçersiz değerler varsayılan düzene düşer', () => {
  assert.strictEqual(LayoutPref.resolve('hacked', 'also-bad'), 'UD');
  assert.strictEqual(LayoutPref.resolve(null, null), 'UD');
});

test('resolve: kayıtlı tercih geçersizse URL bile geçersizse varsayılan', () => {
  assert.strictEqual(LayoutPref.resolve('xx', 'yy'), LayoutPref.DEFAULT_LAYOUT);
});

test('label: tüm geçerli düzenlerin Türkçe etiketi vardır', () => {
  for (const layout of LayoutPref.VALID_LAYOUTS) {
    assert.ok(LayoutPref.label(layout).length > 0, `${layout} etiketsiz`);
  }
  assert.strictEqual(LayoutPref.label('UD'), 'Dikey Ağaç');
  assert.strictEqual(LayoutPref.label('geo'), 'Dünya Haritası');
});

test('label: bilinmeyen düzen varsayılan etikete düşer', () => {
  assert.strictEqual(LayoutPref.label('bukkit'), LayoutPref.label('UD'));
});

test('STORAGE_KEY modüller arası sözleşmedir', () => {
  assert.strictEqual(LayoutPref.STORAGE_KEY, 'felsefe-layout');
});

test('readStored/persist: localStorage engellendiğinde sessizce düşer', () => {
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); }
  };
  try {
    assert.strictEqual(LayoutPref.readStored(), null);
    assert.doesNotThrow(() => LayoutPref.persist('LR'));
  } finally {
    delete globalThis.localStorage;
  }
});

test('readStored/persist: çalışan localStorage yuvarlak yolculuğu', () => {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; }
  };
  try {
    LayoutPref.persist('free');
    assert.strictEqual(LayoutPref.readStored(), 'free');
  } finally {
    delete globalThis.localStorage;
  }
});
