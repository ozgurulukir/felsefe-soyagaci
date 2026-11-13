'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { HtmlEscape } = require('../js/core/html-escape.js');

test('escape: HTML özel karakterlerini kaçırır', () => {
  assert.strictEqual(HtmlEscape.escape('<b a="x">&\'</b>'), '&lt;b a=&quot;x&quot;&gt;&amp;&#39;&lt;/b&gt;');
});

test('escape: null ve undefined boş string olur', () => {
  assert.strictEqual(HtmlEscape.escape(null), '');
  assert.strictEqual(HtmlEscape.escape(undefined), '');
});

test('escape: düz Türkçe metni değiştirmez', () => {
  assert.strictEqual(HtmlEscape.escape('Ahlâk ve Özgürlük (1724)'), 'Ahlâk ve Özgürlük (1724)');
});
