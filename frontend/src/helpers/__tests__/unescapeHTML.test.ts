import { unescapeHTML } from '../unescapeHTML';

it('should unescape HTML characters', () => {
  expect(
    unescapeHTML(
      `&lt;test&gt;&#39;hello&#39; &amp; &quot;world&quot;&hellip;&lt;/test&gt;`,
    ),
  ).toEqual(`<test>'hello' & "world"...</test>`);
});
