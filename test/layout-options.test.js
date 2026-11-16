'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { LayoutOptions } = require('../js/core/layout-options.js');

test('LayoutOptions.getNetworkOptions: UD → hiyerarşik, fizik kapalı, dikey', () => {
  const o = LayoutOptions.getNetworkOptions('UD');
  assert.ok(o.layout.hierarchical.enabled);
  assert.equal(o.layout.hierarchical.direction, 'UD');
  assert.equal(o.physics.enabled, false);
  assert.equal(o.layout.hierarchical.levelSeparation, 140);
  assert.equal(o.layout.hierarchical.nodeSpacing, 180);
});

test('LayoutOptions.getNetworkOptions: LR → hiyerarşik, fizik kapalı, yatay', () => {
  const o = LayoutOptions.getNetworkOptions('LR');
  assert.ok(o.layout.hierarchical.enabled);
  assert.equal(o.layout.hierarchical.direction, 'LR');
  assert.equal(o.physics.enabled, false);
  assert.equal(o.layout.hierarchical.levelSeparation, 220);
  assert.equal(o.layout.hierarchical.nodeSpacing, 130);
});

test('LayoutOptions.getNetworkOptions: free → fizik açık, hiyerarşi kapalı', () => {
  const o = LayoutOptions.getNetworkOptions('free');
  assert.equal(o.layout.hierarchical.enabled, false);
  assert.equal(o.physics.enabled, true);
  assert.equal(o.physics.solver, 'forceAtlas2Based');
});

test('LayoutOptions.getNetworkOptions: geo → fizik kapalı, kavisli yapılandırma', () => {
  const o = LayoutOptions.getNetworkOptions('geo');
  assert.equal(o.layout.hierarchical.enabled, false);
  assert.equal(o.physics.enabled, false);
});

test('LayoutOptions.getNetworkOptions: interaction klavye devre dışı, hover açık', () => {
  const o = LayoutOptions.getNetworkOptions('UD');
  assert.equal(o.interaction.hover, true);
  assert.equal(o.interaction.keyboard.enabled, false);
});
