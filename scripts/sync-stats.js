#!/usr/bin/env node
/**
 * =========================================================================
 * SYNC-STATS — index.html istatistik sayaçlarını veri setiyle senkronize eder
 * =========================================================================
 * `index.html`'deki sayaçlar (header-stats-text, count-all, count-<era>)
 * elle yazıldığı için veri dosyalarıyla iyileşmeyebilir. Bu betik
 * `js/data/entities.js` ve `js/data/relations.js`'den gerçek sayıları okur
 * ve index.html'deki karşılıkları yazar.
 *
 * Kullanım:
   node scripts/sync-stats.js          # index.html'i yaz (dry-run yok)
   node scripts/sync-stats.js --check  # sadece farkı raporla, çıkış kodu 1 döner
 * =========================================================================
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(ROOT, 'index.html');

const { RAW_ENTITIES } = require(path.join(ROOT, 'js/data/entities.js'));
const { RAW_RELATIONS } = require(path.join(ROOT, 'js/data/relations.js'));
const { PhilosophySchema } = require(path.join(ROOT, 'js/core/schema.js'));

const entities = Object.values(RAW_ENTITIES);
const relations = RAW_RELATIONS;

const totalEntities = entities.length;
const totalRelations = relations.length;
const eraCounts = {};
for (const eraId of PhilosophySchema.VALID_ERAS) {
  eraCounts[eraId] = entities.filter((e) => e.era === eraId).length;
}

/**
 * index.html'deki tekil sayacı günceller.
 * @param {string} html
 * @param {string} id
 * @param {number} value
 * @returns {string}
 */
function setCount(html, id, value) {
  const regex = new RegExp(`(id="${id}">)\\d+`, 'g');
  return html.replace(regex, `$1${value}`);
}

const expectedHeaderText = `${totalEntities} Düşünür • ${totalRelations} Bağlantı`;
let html = fs.readFileSync(INDEX_HTML, 'utf8');

// 1. Header stats metni — id hedeflenir (setCount ile aynı yaklaşım); düz
//    metin araması ileride metne ikinci bir geçiş yapılırsa yanlış yeri
//    güncelleyebileceğinden id'li elemente sabitlenir
const headerRegex = /(id="header-stats-text">)\d+ Düşünür • \d+ Bağlantı/;
html = html.replace(headerRegex, `$1${expectedHeaderText}`);

// 2. count-all
html = setCount(html, 'count-all', totalEntities);

// 3. Her dönem için count-<era>
for (const [era, count] of Object.entries(eraCounts)) {
  html = setCount(html, `count-${era}`, count);
}

const changed = html !== fs.readFileSync(INDEX_HTML, 'utf8');

if (process.argv.includes('--check')) {
  if (changed) {
    console.error(`[sync-stats] index.html güncel değil (farklı sayılar tespit edildi).`);
    console.error(`  Beklenen: "${expectedHeaderText}", eraCounts: ${JSON.stringify(eraCounts)}`);
    process.exit(1);
  }
  console.log(`[sync-stats] index.html güncel: ${expectedHeaderText} / ${JSON.stringify(eraCounts)}`);
  process.exit(0);
}

if (changed) {
  fs.writeFileSync(INDEX_HTML, html, 'utf8');
  console.log(`[sync-stats] index.html güncellendi:`);
  console.log(`  header: "${expectedHeaderText}"`);
  console.log(`  eraCounts: ${JSON.stringify(eraCounts)}`);
} else {
  console.log(`[sync-stats] index.html zaten güncel.`);
}
