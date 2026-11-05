'use strict';

// DetailContent: showPhilosopherDetails içinden çıkarılan saf modeller
// (rozet, tırnak, kavram/eser/ilişki). DOM yok; byte-kopya string'ler.

const test = require('node:test');
const assert = require('node:assert');
const { DetailContent } = require('../js/ui/detail-content.js');

test('quoteText: tipografik tırnaklarla sarar', () => {
  assert.strictEqual(DetailContent.quoteText({ quote: 'bilgi güçtür' }), '“bilgi güçtür”');
});

test('conceptSearchTerm: parantez öncesi ana terimi alır', () => {
  assert.strictEqual(DetailContent.conceptSearchTerm('Epistemoloji (bilgi kuramı)'), 'Epistemoloji');
});

test('conceptSearchTerm: parantezsiz girdide olduğu gibi döner', () => {
  assert.strictEqual(DetailContent.conceptSearchTerm('Bilgi'), 'Bilgi');
});

test('teacherModel: master vs non-master — title öneki ve ikon sınıfı farklı', () => {
  const master = DetailContent.teacherModel({
    relationType: 'master',
    relationLabel: 'Hocası',
    name: 'Aristoteles'
  });
  const nonMaster = DetailContent.teacherModel({
    relationType: 'influence',
    relationLabel: 'Etkisi',
    name: 'Platon'
  });

  assert.ok(master.title.startsWith('Doğrudan Hocası'));
  assert.ok(nonMaster.title.startsWith('Entelektüel Öncülü'));
  assert.ok(master.innerHTML.includes('fa-user-graduate'));
  assert.ok(nonMaster.innerHTML.includes('fa-arrow-up'));
  assert.notStrictEqual(master.title, nonMaster.title);
});

test('studentModel: master vs non-master — fa-user-graduate vs fa-arrow-down', () => {
  const master = DetailContent.studentModel({
    relationType: 'master',
    relationLabel: 'Öğrencisi',
    name: 'Platon'
  });
  const nonMaster = DetailContent.studentModel({
    relationType: 'influence',
    relationLabel: 'Etkisi',
    name: 'Aristoteles'
  });

  assert.ok(master.innerHTML.includes('fa-user-graduate'));
  assert.ok(nonMaster.innerHTML.includes('fa-arrow-down'));
  assert.ok(master.title.startsWith('Doğrudan Öğrencisi'));
  assert.ok(nonMaster.title.startsWith('Etkilediği Düşünür'));
});

test('relationListState: boş liste isEmpty; dolu listede models uzunluğu eşleşir', () => {
  const empty = DetailContent.relationListState([], '<span>yok</span>');
  assert.strictEqual(empty.isEmpty, true);
  assert.strictEqual(empty.emptyHtml, '<span>yok</span>');
  assert.deepStrictEqual(empty.models, []);

  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const full = DetailContent.relationListState(items, '<span>yok</span>');
  assert.strictEqual(full.isEmpty, false);
  assert.strictEqual(full.models.length, items.length);
  assert.strictEqual(full.models, items);
});

test('eraBadge: theme.badgeClass className birleşimine katılır', () => {
  const badge = DetailContent.eraBadge(
    { eraName: 'Antik Yunan' },
    { badgeClass: 'bg-amber-500/10 text-amber-700' }
  );
  assert.strictEqual(badge.text, 'Antik Yunan');
  assert.ok(badge.className.includes('bg-amber-500/10 text-amber-700'));
  assert.ok(badge.className.startsWith('px-2.5 py-1 rounded-full'));
});
