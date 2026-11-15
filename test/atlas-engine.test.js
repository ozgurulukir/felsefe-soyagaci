'use strict';

// PhilosophyAtlas: yerleşik vis-canvas harita çizicisinin (kara/deniz dolguları,
// kıyı konturları, ızgara etiketleri ve kapalı poligon değişmezleri) birim testleri.

const test = require('node:test');
const assert = require('node:assert');
const { PhilosophyAtlas } = require('../js/core/atlas-engine.js');
const { PhilosophyGeo } = require('../js/data/geo-coordinates.js');

function makeMockCtx() {
  const log = { fills: 0, strokes: 0, closePaths: 0, texts: [], saves: 0, restores: 0 };
  return {
    log,
    save: () => { log.saves++; },
    restore: () => { log.restores++; },
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => { log.closePaths++; },
    fill: () => { log.fills++; },
    stroke: () => { log.strokes++; },
    setLineDash: () => {},
    fillText: (text) => { log.texts.push(text); },
    translate: () => {},
    arc: () => {}
  };
}

test('LANDMASSES ve INLAND_SEAS: tüm poligonlar kapalıdır (ilk ve son köşe aynı)', () => {
  const allPolys = [...PhilosophyAtlas.LANDMASSES, ...PhilosophyAtlas.INLAND_SEAS];
  for (const poly of allPolys) {
    assert.ok(poly.length >= 4, 'Poligon en az 4 köşe içermeli');
    assert.deepStrictEqual(poly[0], poly[poly.length - 1], `Poligon kapalı değil: ${JSON.stringify(poly[0])}`);
  }
});

test('drawMap: hem koyu hem açık temada kara/deniz dolgularını (fill) ve etiketleri çizer', () => {
  for (const isDark of [true, false]) {
    const ctx = makeMockCtx();
    PhilosophyAtlas.drawMap(ctx, isDark, PhilosophyGeo.projectRaw);

    // 1 deniz zemini + LANDMASSES + INLAND_SEAS + 1 pusula oku = en az 14 fill çağrısı
    const expectedMinFills = 1 + PhilosophyAtlas.LANDMASSES.length + PhilosophyAtlas.INLAND_SEAS.length + 1;
    assert.ok(ctx.log.fills >= expectedMinFills, `Eksik fill çağrısı (${ctx.log.fills} < ${expectedMinFills})`);
    assert.ok(ctx.log.closePaths >= expectedMinFills, 'Kapalı poligonlarda closePath çağrılmalı');
    assert.strictEqual(ctx.log.saves, ctx.log.restores, 'ctx.save/restore dengeli olmalı');

    // Bölge etiketleri, yönlü boylam etiketleri ve Kuzey ('K') pusulası çizilmeli
    assert.ok(ctx.log.texts.includes('AKDENİZ / MARE NOSTRUM'));
    assert.ok(ctx.log.texts.includes('ANADOLU'));
    assert.ok(ctx.log.texts.includes('10° B'), 'Batı boylamı 10° B olarak etiketlenmeli');
    assert.ok(ctx.log.texts.includes('30° D'), 'Doğu boylamı 30° D olarak etiketlenmeli');
    assert.ok(ctx.log.texts.includes('40° K'), 'Kuzey enlemi 40° K olarak etiketlenmeli');
    assert.ok(ctx.log.texts.includes('K'), 'Pusula gülü K (Kuzey) harfini içermeli');
  }
});

test('drawMap: projeksiyon fonksiyonu verilmezse çizim yapmadan güvenli çıkar', () => {
  const ctx = makeMockCtx();
  const origError = console.error;
  let errorLogged = false;
  console.error = () => { errorLogged = true; };
  try {
    PhilosophyAtlas.drawMap(ctx, true, null);
    assert.strictEqual(errorLogged, true);
    assert.strictEqual(ctx.log.fills, 0);
    assert.strictEqual(ctx.log.strokes, 0);
  } finally {
    console.error = origError;
  }
});
