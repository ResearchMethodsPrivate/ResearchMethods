import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Renderer, createParser } from '@openuidev/react-lang';
import { library } from '../../src/explore/library';
import { crdaProgram } from '../../src/explore/crda.oui';

test('authored OpenUI Lang program parses against the library with no errors or dangling refs', () => {
  const parser = createParser(library.toJSONSchema(), 'Explorer');
  const r = parser.parse(crdaProgram);
  assert.equal(r.root?.typeName, 'Explorer');
  assert.deepEqual(r.meta.errors, []);
  assert.deepEqual(r.meta.unresolved, []);
  assert.deepEqual(r.meta.orphaned, []);
  assert.equal(r.meta.incomplete, false);
});

test('OpenUI Renderer renders the explorer, first tab and claim labels (server-side render)', () => {
  const html = renderToStaticMarkup(createElement(Renderer, { response: crdaProgram, library, isStreaming: false }));
  assert.match(html, /data-openui="Explorer"/);
  assert.match(html, /Four stages/);
  assert.equal((html.match(/data-openui="StageCard"/g) ?? []).length, 4);
  assert.match(html, /katex/); // equations survived OpenUI string escaping
  assert.doesNotMatch(html, /Parse error|undefined/);
});
