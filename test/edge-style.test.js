'use strict';

// EdgeStyle: graf ve harita görünümlerinin ortak kenar görsel kararları.
// İki adapter'ın da aynı palet/kalınlık/kesik çizgiyi kullandığını doğrular.

const test = require('node:test');
const assert = require('node:assert');
const { EdgeStyle } = require('../js/core/edge-style.js');

test('Palet: koyu ve açık tema master/influence renkleri farklı', () => {
  const dark = EdgeStyle.palette(true);
  const light = EdgeStyle.palette(false);
  assert.notEqual(dark.masterNormal, light.masterNormal);
  assert.notEqual(dark.influenceNormal, light.influenceNormal);
  assert.equal(dark.masterHighlight, '#fbbf24');
  assert.equal(light.masterHighlight, '#d97706');
});

test('Kenar görseli: master düz, influence kesikli', () => {
  const master = EdgeStyle.edgeVisual({ isMaster: true, isDimmed: false, isHighlighted: false, isDark: true });
  const influence = EdgeStyle.edgeVisual({ isMaster: false, isDimmed: false, isHighlighted: false, isDark: true });
  assert.equal(master.dash, null);
  assert.deepEqual(influence.dash, [6, 6]);
});

test('Kenar görseli: soluk kenar dimmed rengi ve 0.2 opaklık alır', () => {
  const dimmed = EdgeStyle.edgeVisual({ isMaster: true, isDimmed: true, isHighlighted: false, isDark: true });
  assert.equal(dimmed.color, 'rgba(245, 158, 11, 0.15)');
  assert.equal(dimmed.opacity, 0.2);
});

test('Kenar görseli: vurgulu kenar highlight rengi, tam opaklık ve kalın çizgi', () => {
  const hot = EdgeStyle.edgeVisual({ isMaster: false, isDimmed: false, isHighlighted: true, isDark: false });
  assert.equal(hot.color, '#0ea5e9');
  assert.equal(hot.opacity, 1.0);
  assert.equal(hot.width, 2.8);
  assert.equal(hot.arrowScale, 1.0);
});

test('Kenar görseli: normal durumda base renk ve 0.85 opaklık', () => {
  const base = EdgeStyle.edgeVisual({ isMaster: true, isDimmed: false, isHighlighted: false, isDark: false });
  assert.equal(base.color, '#b45309');
  assert.equal(base.opacity, 0.85);
  assert.equal(base.width, 2.4);
});

test('Lejant etiketi ve başlık metni iki görünümde aynı', () => {
  assert.equal(EdgeStyle.legendLabel(true), 'Hoca – Öğrenci (Düz Altın Çizgi)');
  assert.equal(EdgeStyle.legendLabel(false), 'Entelektüel Etki (Kesikli Mavi Çizgi)');
  const title = EdgeStyle.edgeTitle({ type: 'master', label: 'öğretti' }, 'Sokrates', 'Platon');
  assert.equal(title, 'Hoca – Öğrenci (Düz Altın Çizgi) (öğretti): Sokrates ➔ Platon');
});
