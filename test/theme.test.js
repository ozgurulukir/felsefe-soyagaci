'use strict';

// Theme: kayıtlı tercih > sistem tercihi kararını ve localStorage
// engellenmiş ortam davranışını (sessiz no-op) sınar.

const test = require('node:test');
const assert = require('node:assert');
const { Theme } = require('../js/core/theme.js');

test('resolveTheme: kayıtlı tercih sistem tercihine üstün gelir', () => {
  assert.strictEqual(Theme.resolveTheme('dark', false), true);
  assert.strictEqual(Theme.resolveTheme('light', true), false);
});

test('resolveTheme: kayıtlı tercih yoksa sistem tercihi geçerli', () => {
  assert.strictEqual(Theme.resolveTheme(null, true), true);
  assert.strictEqual(Theme.resolveTheme(null, false), false);
  assert.strictEqual(Theme.resolveTheme(undefined, true), true);
});

test('resolveTheme: tanınmayan kayıtlı değer açık temaya düşer (dark değil)', () => {
  assert.strictEqual(Theme.resolveTheme('mavi', true), false);
});

test('readStored/persist: localStorage yoksa patlamaz, null döner', () => {
  const original = globalThis.localStorage;
  delete globalThis.localStorage;
  try {
    assert.strictEqual(Theme.readStored(), null);
    assert.doesNotThrow(() => Theme.persist('dark'));
  } finally {
    if (original !== undefined) globalThis.localStorage = original;
  }
});

test('readStored/persist: localStorage varsa round-trip çalışır', () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v))
  };
  try {
    Theme.persist('dark');
    assert.strictEqual(Theme.readStored(), 'dark');
    assert.strictEqual(store.get(Theme.STORAGE_KEY), 'dark');
  } finally {
    delete globalThis.localStorage;
  }
});

test('readStored: localStorage erişimi hata fırlatırsa null döner', () => {
  globalThis.localStorage = {
    getItem: () => { throw new Error('denied'); },
    setItem: () => { throw new Error('denied'); }
  };
  try {
    assert.strictEqual(Theme.readStored(), null);
    assert.doesNotThrow(() => Theme.persist('light'));
  } finally {
    delete globalThis.localStorage;
  }
});

test('isDark/apply: documentElement.classList üzerinden çalışır', () => {
  const classes = new Set(['dark']);
  globalThis.document = {
    documentElement: {
      classList: {
        contains: (c) => classes.has(c),
        toggle: (c, force) => { if (force) classes.add(c); else classes.delete(c); }
      }
    }
  };
  try {
    assert.strictEqual(Theme.isDark(), true);
    Theme.apply(false);
    assert.strictEqual(Theme.isDark(), false);
    Theme.apply(true);
    assert.strictEqual(Theme.isDark(), true);
  } finally {
    delete globalThis.document;
  }
});
