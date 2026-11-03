// WSZ-003b: the patterns of the three gates (scripts/lib/gate-rules.mjs) and the shared HTML parsing they use
// (scripts/lib/build-output.mjs), each with examples that must match and examples that must not.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeHtml, visibleText } from '../scripts/lib/build-output.mjs';
import {
  allowed,
  inlineJoinHits,
  joinedHits,
  necRefs,
  ogSourceTexts,
  parseAllowlist,
  textHits,
  traceNumbers,
  unitNumbers,
  validDataSrc,
} from '../scripts/lib/gate-rules.mjs';

const labels = (text: string): string[] => textHits(text).map((h: { label: string }) => h.label);
const joined = (text: string): string[] => joinedHits(text).map((h: { match: string }) => h.match);

describe('gate a: spec vocabulary, status notes, self-praise and UK spellings', () => {
  // [label, texts that must match, texts that must not]
  const RULES: [string, string[], string[]][] = [
    ['hook', ['a hook', 'two hooks'], ['a hookup', 'hooked']],
    ['promise', ['what they promise', 'response-time promises'], ['promised', 'a compromise']],
    ['wedge', ['the wedge', 'wedges'], ['wedged']],
    ['information gain', ['information gain', 'information gains'], ['information gained']],
    ['fan-out', ['the fan-out', 'fan-outs'], ['fan out']],
    ['attack plan', ['attack plan', 'attack plans'], ['attack planning']],
    ['ledger', ['the ledger', 'ledgers'], ['ledge']],
    ['registry', ['the registry', 'registries'], ['registrar']],
    ['archetype', ['archetype', 'archetypes'], ['archetypal']],
    ['cluster', ['a cluster', 'clusters'], ['clustered']],
    ['flagship', ['the flagship', 'flagships'], ['flags']],
    ['money query', ['money query', 'money queries'], ['money queue']],
    ['engine', ['the engine', 'engines'], ['engineer', 'engineering']],
    ['single-sourced', ['single-sourced'], ['single source']],
    ['by construction', ['true by construction'], ['under construction']],
    ['build pipeline', ['build pipeline', 'build pipelines'], ['pipeline']],
    ['crawlable', ['crawlable'], ['crawl']],
    ['crawler', ['crawler', 'crawlers'], ['crawling']],
    ['LLM', ['an LLM', 'LLMs'], ['LLMNR']],
    ['citation-worthy', ['citation-worthy'], ['a citation']],
    ['cite us', ['cite us'], ['cite usage']],
    ['coming soon', ['Coming soon'], ['coming back soon']],
    ['shipping later', ['shipping later'], ['shipping latency']],
    ['now shipped', ['now shipped'], ['now shipping']],
    ['when … ships', ['when the tool ships', 'When v2 ships'], ['when the ship sails']],
    ['trusted', ['trusted'], ['trust', 'untrusted']],
    ['professional-grade', ['professional-grade'], ['professional grades']],
    ['ultimate', ['the ultimate guide'], ['ultimately']],
    ['comprehensive guide', ['this comprehensive guide', 'Comprehensive guides'], ['a comprehensive FAQ']],
    ['rigorous', ['rigorous'], ['rigor']],
    ['honest', ['honest'], ['honestly', 'dishonest']],
    ['exact', ['the exact wire size'], ['exactly', 'exacting']],
    ['accurate', ['accurate'], ['accuracy', 'inaccurate']],
    ['compliant', ['NEC compliant', 'non-compliant'], ['compliance']],
    ['colour', ['colour', 'colours', 'coloured'], ['color']],
    ['behaviour', ['behaviour', 'behaviours'], ['behavior']],
    ['metre', ['metre', 'metres', 'kilometres'], ['meter', 'meters']],
    ['litre', ['litre', 'millilitres'], ['liter']],
    ['centre', ['centre', 'centres', 'centred'], ['center']],
    ['aluminium', ['aluminium'], ['aluminum']],
    ['analyse', ['analyse', 'analysed', 'analysing'], ['analyze', 'analyses']],
    ['modelling', ['modelling'], ['modeling']],
  ];
  for (const [label, yes, no] of RULES) {
    it(label, () => {
      for (const text of yes) assert.ok(labels(text).includes(label), `"${text}" should match ${label}`);
      for (const text of no) assert.ok(!labels(text).includes(label), `"${text}" should not match ${label}`);
    });
  }
});

describe('gate a: a digit run into a letter or into %, °C or °F', () => {
  it('flags joined units, one hit per token', () => {
    for (const text of ['240V', '15A', '1500W', '3%', '104°F', '75°C', '1000ft', '10kΩ', '4mm²', '15A*']) {
      assert.deepEqual(joined(`a ${text} b`), [text], text);
    }
    assert.deepEqual(joined('12V/24V DC'), ['12V/24V']);
    assert.deepEqual(joined('208Y/120V system'), ['208Y/120V']);
    assert.deepEqual(joined('(Ω/1000ft)'), ['Ω/1000ft']);
    // letters before the digit don't exempt it: a formula or model name needs an allowlist line
    assert.deepEqual(joined('H2O'), ['H2O']);
  });

  it('passes spaced units, wye designations, ordinals, plane angles, URLs, hashes and ISO dates', () => {
    for (const text of [
      '240 V',
      '3 %',
      '104 °F',
      '480Y/277 V',
      '1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st, 22nd and 100th',
      'three waves 120° apart',
      'https://wiresizes.com/guides/a1b2',
      'https://wiresizes.com/opengraph-image?b3d387a9c1e2f',
      'hash b3d387a9',
      '2026-10-19T08:00:00Z',
      '2026-10-19',
      'v2, AWG14',
    ]) {
      assert.deepEqual(joined(text), [], text);
    }
  });
});

describe('gate a: a closing inline tag run into a letter', () => {
  const hits = (html: string): string[] => inlineJoinHits(tokenizeHtml(html)).map((h: { match: string }) => h.match);

  it('flags the FAQ label and a unit after a closing tag', () => {
    assert.deepEqual(hits('<h3 class="flex"><span>Q:</span>What size?</h3>'), ['Q:</span>What']);
    assert.deepEqual(hits('<p><strong>240</strong>V</p>'), ['240</strong>V']);
  });

  it('passes a space before or after the tag, a tag between, and block tags', () => {
    assert.deepEqual(hits('<h3><span>Q: </span>What size?</h3>'), []);
    assert.deepEqual(hits('<h3><span>Q:</span> What size?</h3>'), []);
    assert.deepEqual(hits('<nav><a href="/guides">Guides</a><a href="/about">About</a></nav>'), []);
    assert.deepEqual(hits('<p><span data-src="input">20 A</span>.</p>'), []);
    assert.deepEqual(hits('<div>Sizes</div>Text'), []);
  });
});

describe('gate a: OG image sources and the allowlist', () => {
  it('reads JSX text and the alt export, not comments or styles', () => {
    const source = [
      "export const alt = 'wiresizes.com: wire gauge charts';",
      '// a comment with 240V',
      "export default function X() { return (<div style={{ width: '100%' }}>{/* 15A */}<span>Wire Size Calculator</span></div>); }",
    ].join('\n');
    assert.deepEqual(ogSourceTexts(source), ['Wire Size Calculator', 'wiresizes.com: wire gauge charts']);
  });

  it('matches route and text without regard to case, and needs a reason', () => {
    const list = parseAllowlist('# comment\n/privacy | _ga_X1 | cookie name\n* | 10x | multiplier\n', 'test');
    assert.ok(allowed(list, '/privacy', '_GA_X1'));
    assert.ok(allowed(list, '/calculators', '10x'));
    assert.ok(!allowed(list, '/about', '_ga_X1'));
    assert.throws(() => parseAllowlist('/x | y', 'test'), /need/);
  });
});

describe('shared parsing', () => {
  it('skips <noscript>, <script> and <style> bodies', () => {
    const events = tokenizeHtml('<body><p>Shown</p><noscript><p>Hidden 20A</p></noscript><script>var a = "$12";</script><style>p{}</style></body>');
    assert.equal(visibleText(events), 'Shown');
  });
});

describe('gate b: unit-bearing numbers', () => {
  const found = (text: string): string[] => unitNumbers(text).map((n: { match: string }) => n.match);

  it('finds numbers with a unit or a dollar sign', () => {
    for (const text of ['20 A', '3.5 %', '1,200 ft', '$12', '240V', '75 °C', '−40 °F', '250 kcmil', '2.05 mm²', '1 hp', '3 tons', '20 amps', '120 volts', '10 ohms', '5 kW', '1,500 W']) {
      assert.deepEqual(found(text), [text], text);
    }
    assert.deepEqual(found('0.081 in)'), ['0.081 in']);
    assert.deepEqual(found('12 in. of cover'), ['12 in']);
  });

  it('skips section numbers, years, dates, size names and "in" as a word', () => {
    for (const text of ['Table 310.16', 'NEC 240.4(D)', 'Article 220', 'NEC 2023', 'Oct 2026', '2026-10-19', '14 AWG', '3 in the table', 'PF = 0.85']) {
      assert.deepEqual(found(text), [], text);
    }
  });

  it('traces a number to its nearest data-src, and skips [data-size]', () => {
    const isValid = (src: string): boolean =>
      validDataSrc(src, new Set(['nec-310-16']), new Map([['voltage-drop', ['nec-310-16']], ['mixed', ['nec-310-16', 'mfr-well-pump']]]));
    const html =
      '<html><head><title>20 A</title></head><body><p><span data-src="calc:voltage-drop">2.02 %</span> at ' +
      '<span data-src="input">20 A</span>, 12 AWG carries 20<!-- --> A, <span data-size="250">250 kcmil</span>, ' +
      '<span data-src="calc:mixed">5 V</span>, <li data-src="nec-310-16"><a>Source: 75 °C values</a></li></p></body></html>';
    const result = traceNumbers(tokenizeHtml(html), isValid).map((n: { match: string; traced: boolean }) => [n.match, n.traced]);
    assert.deepEqual(result, [
      ['2.02 %', true],
      ['20 A', true],
      ['20 A', false],
      ['5 V', false],
      ['75 °C', true],
    ]);
  });

  it('a data-src traces when it is input, a verified domain, or a calc id whose domains are all verified', () => {
    const verified = new Set(['nec-310-16']);
    const engines = new Map([['voltage-drop', ['nec-310-16']], ['mixed', ['nec-310-16', 'mfr-well-pump']]]);
    for (const src of ['input', 'nec-310-16', 'calc:voltage-drop']) assert.ok(validDataSrc(src, verified, engines), src);
    for (const src of ['calc:unknown', 'calc:mixed', 'mfr-well-pump', 'Input', '']) assert.ok(!validDataSrc(src, verified, engines), src);
  });
});

describe('gate c: NEC references', () => {
  const articles = new Set([110, 120, 220, 240, 250, 310]);
  const refs = (text: string): string[] => necRefs(text, articles).map((r: { ref: string }) => r.ref);

  it('reads tables, sections, subdivisions, lists, ranges and articles', () => {
    assert.deepEqual(refs('Table 310.16'), ['310.16']);
    assert.deepEqual(refs('Tables 310.15(B)(1)(1) and 310.15(C)(1)'), ['310.15(B)(1)(1)', '310.15(C)(1)']);
    assert.deepEqual(refs('NEC 240.4(D)'), ['240.4(D)']);
    assert.deepEqual(refs('as 240.4(D)(3) allows'), ['240.4(D)(3)']);
    assert.deepEqual(refs('Article 120'), ['Article 120']);
    assert.deepEqual(refs('Articles 210 and 220'), ['Article 210', 'Article 220']);
    assert.deepEqual(refs('sized from 310.12'), ['310.12']);
    assert.deepEqual(refs('NEC 250.118'), ['250.118']);
    assert.deepEqual(refs('Tables 430.247–430.250'), ['430.247', '430.250']);
    assert.deepEqual(refs('§ 230.70'), ['230.70']);
  });

  it('skips measurements, constants, prices and the code name', () => {
    for (const text of ['120.5 V', '17.002 Ω·cmil/ft', '10.371 Ω·cmil/ft', 'NFPA 70 (NEC) 2023', '$110.02', 'a factor of 1.25', 'I = 831.36 A', 'times 831.36', 'NEC 2023']) {
      assert.deepEqual(refs(text), [], text);
    }
  });
});
