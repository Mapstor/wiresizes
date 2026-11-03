# WSZ-003b GATES: report (2026-11-03)

The reader-facing half of WSZ-003: the source registry and the `<Val>`, `<Size>`, `<Sources>` and `<AsOf>` components, a
Sources section on the seven calculators, number–unit spacing and wording fixed site-wide, and three build gates in
postbuild. Commits: 1d1e349 (registry, components, Sources), 74ac215 (spacing, FAQ labels, wording), 63925d1 (gates),
then the docs commit with this file. All checks below ran on a clean build (`rm -rf .next && npm run build`, postbuild
included) made at e0ac6d8, the first version of 63925d1. Amending it only removed an unused import from
scripts/check-rendered-text.mjs, which no page uses; gate a, eslint and `npm test` ran again after the amend.

## 1. Gate a: rendered text (`scripts/check-rendered-text.mjs`, enforced site-wide)

**0 hits** on the 34 live pages, public/llms.txt and the OG image sources (src/app/opengraph-image.tsx,
src/app/twitter-image.tsx). On the baseline build (e689101) the same gate found 709: 689 joined text (659 numbers run
into a unit, 30 FAQ `Q:</span>` joins), 15 self-praise, 5 spec vocabulary. Every one of the 20 word hits was one of the
12 wording items; "Comprehensive guides" on /calculators and the electrical power calculations JSON-LD fell under item
10 ("wherever it appears").

Allowlist (`scripts/check-rendered-text.allow.txt`), 7 lines, all in use:

| Route | Matched text | Reason |
|---|---|---|
| /calculators/three-phase-calculator | 240Δ/120 | delta system designation (240 V delta, 120 V center tap), named like the wye designations the gate excepts ("208Y/120") |
| /calculators/three-phase-calculator | 480Δ | delta system designation (480 V delta), named like the wye designations the gate excepts |
| /calculators/watts-to-amps-calculator | 1Φ | phase-count notation: 1Φ is single-phase, a symbol name, not a number and a unit |
| /calculators/watts-to-amps-calculator | 3Φ | phase-count notation: 3Φ is three-phase, a symbol name, not a number and a unit |
| /guides/wire-size-for-ev-charger | §30C | section 30C of the Internal Revenue Code (the IRS credit's name) |
| /privacy | _ga_T871GVJZE2 | the name of Google Analytics' session cookie, which the privacy notice must name exactly |
| /calculators/voltage-drop-calculator | 10x | a multiplier ("10x more impact"), not a number and a unit: pending chat wording (CHAT 4) |

What the spacing fix changed: 336 string literals and JSX texts (an AST pass over the live modules, every change read),
14 units that followed an interpolated value straight, in 13 places (`{row.ampacity}A`, `` `${v}V` `` option labels;
74ac215's message says 9, which is wrong), 9 `&deg;` joins, the 30 FAQ
labels (`Q: `) and the three-phase system names, which are form values and URL parameters (`system=208Y/120V`): they
keep their values and get display labels (`208Y/120 V`). Left alone: CSS (OG image gradients, the print stylesheet),
data keys (`r20_al_ech19_ohm_per_1000ft_derived`, `default-100A-or-less`), and two modules nothing imports
(src/components/ui/VoltageInput.tsx, src/lib/utils/validators.ts). The 15 withdrawn pages keep their text (the gate
skips them; WSZ-008–011 replace them): their titles still join units ("RV Hookup Calculator — 30A / 50A").

## 2. Gate b: number trace (`scripts/check-number-trace.mjs`, report-only)

`numberTrace.enforce` is empty. 109 traced, 1,323 untraced unit-bearing numbers on the 34 live pages; every data-src
value on the site traces (0 invalid).

| Route | Untraced | Traced |
|---|---:|---:|
| /_global-error | 0 | 0 |
| /_not-found | 2 | 0 |
| /about | 2 | 0 |
| /calculators | 5 | 0 |
| /calculators/ampacity-calculator | 153 | 11 |
| /calculators/amps-to-watts-calculator | 78 | 0 |
| /calculators/btu-to-watts-calculator | 20 | 0 |
| /calculators/ground-wire-calculator | 75 | 21 |
| /calculators/kilowatts-to-amps-calculator | 41 | 0 |
| /calculators/kva-to-amps-calculator | 73 | 0 |
| /calculators/low-voltage-calculator | 35 | 4 |
| /calculators/ohms-law-calculator | 105 | 0 |
| /calculators/service-entrance-calculator | 21 | 1 |
| /calculators/three-phase-calculator | 24 | 0 |
| /calculators/voltage-drop-calculator | 85 | 20 |
| /calculators/volts-to-amps-calculator | 20 | 0 |
| /calculators/watts-to-amps-calculator | 45 | 0 |
| /calculators/wire-resistance-calculator | 75 | 14 |
| /calculators/wire-size-calculator | 117 | 38 |
| /contact | 2 | 0 |
| /disclaimer | 2 | 0 |
| /guides | 11 | 0 |
| /guides/awg-wire-size-chart | 54 | 0 |
| /guides/electrical-power-calculations | 44 | 0 |
| /guides/nec-code-compliance | 9 | 0 |
| /guides/nec-table-310-16 | 75 | 0 |
| /guides/power-factor-explained | 8 | 0 |
| /guides/single-vs-three-phase | 32 | 0 |
| /guides/wire-size-for-100-amp | 17 | 0 |
| /guides/wire-size-for-200-amp | 50 | 0 |
| /guides/wire-size-for-ev-charger | 20 | 0 |
| / | 19 | 0 |
| /privacy | 2 | 0 |
| /terms | 2 | 0 |

What the seven calculators still count: quick-reference blocks, FAQs and page prose (left for the rebuild waves), plus
two kinds inside the calculator components that step 4 doesn't cover:
- form option labels: rating, voltage and target choices, the kcmil sizes of the size selects, the temperature and
  ambient options (an `<option>` can't hold a `<span>`, but it can carry `data-src`/`data-size` itself);
- fixed prose in the result panels: the "60 °C ampacity" label and BASIS_LINES (wire size), ALUMINUM_RESISTANCE_NOTE
  ("about 64 %") and RESISTANCE_BASIS_LABEL ("75 °C") (voltage drop), "Resistance per 1000 ft", "Resistance at 20 °C",
  "20 °C (68 °F) reference" and RESISTANCE_NOTES (wire resistance), "60 °C column" and BASIS_LINE (low voltage),
  "120/240 V dwelling" (service entrance), and the temperature hint under the wire resistance input.
Every number an engine returns, every repeated input and every size name in the seven result panels renders through
`<Val>`/`<Size>` (the conductor-sizing steps, the voltage-drop ampacity note, the 14 AWG aluminum note and the 240.4(D)
label as text parts).

## 3. Gate c: NEC references (`scripts/check-nec-refs.mjs`)

`necRefs.enforce` lists the 25 live routes with 0 hits (`/_global-error` and `/_not-found` included: they are live
prerendered pages). A held ref (625.54, D-09) does not count as allowed; none appears on a live page. 310 references
read.

| Route | Gate c | Hits | References outside the allowlist |
|---|---|---:|---|
| /_global-error | enforced | 0 |  |
| /_not-found | enforced | 0 |  |
| /about | enforced | 0 |  |
| /calculators | enforced | 0 |  |
| /calculators/ampacity-calculator | enforced | 0 |  |
| /calculators/amps-to-watts-calculator | enforced | 0 |  |
| /calculators/btu-to-watts-calculator | enforced | 0 |  |
| /calculators/ground-wire-calculator | report | 3 | Article 250 [text] ×2, 250.118 [text] |
| /calculators/kilowatts-to-amps-calculator | enforced | 0 |  |
| /calculators/kva-to-amps-calculator | enforced | 0 |  |
| /calculators/low-voltage-calculator | enforced | 0 |  |
| /calculators/ohms-law-calculator | enforced | 0 |  |
| /calculators/service-entrance-calculator | report | 1 | Article 250 [text] |
| /calculators/three-phase-calculator | enforced | 0 |  |
| /calculators/voltage-drop-calculator | enforced | 0 |  |
| /calculators/volts-to-amps-calculator | enforced | 0 |  |
| /calculators/watts-to-amps-calculator | enforced | 0 |  |
| /calculators/wire-resistance-calculator | enforced | 0 |  |
| /calculators/wire-size-calculator | report | 1 | Article 250 [text] |
| /contact | enforced | 0 |  |
| /disclaimer | enforced | 0 |  |
| /guides | enforced | 0 |  |
| /guides/awg-wire-size-chart | report | 1 | Article 310 [JSON-LD] |
| /guides/electrical-power-calculations | enforced | 0 |  |
| /guides/nec-code-compliance | report | 9 | 240.4 [text], Article 250 [text], 250.50 [text], 250.52(A)(1) [text], 250.52(A)(3) [text], 250.52(A)(4) [text], 250.52(A)(5) [text], 250.118 [text], 210.8 [text] |
| /guides/nec-table-310-16 | report | 4 | Article 310 [text], 310.17 [text], 310.21 [text], Article 310 [JSON-LD] |
| /guides/power-factor-explained | enforced | 0 |  |
| /guides/single-vs-three-phase | report | 1 | 220.61(C) [text] |
| /guides/wire-size-for-100-amp | report | 1 | 230.79 [text] |
| /guides/wire-size-for-200-amp | enforced | 0 |  |
| /guides/wire-size-for-ev-charger | report | 4 | Article 625 [text] ×3, Article 625 [JSON-LD] |
| / | enforced | 0 |  |
| /privacy | enforced | 0 |  |
| /terms | enforced | 0 |  |

Out of the enforce list, as chat expected: /guides/nec-code-compliance, /calculators/ground-wire-calculator,
/guides/nec-table-310-16, /guides/single-vs-three-phase, /guides/wire-size-for-100-amp,
/guides/wire-size-for-ev-charger. Also out, which chat's scan didn't predict:
- /calculators/wire-size-calculator and /calculators/service-entrance-calculator: "Article 250" in their new Sources
  section, from the registry attribution of nec-250-grounding ("Using the Tables in Article 250 of the NEC"); ground
  wire has the same line (CHAT 2);
- /guides/awg-wire-size-chart: "Article 310" in its Dataset JSON-LD citation, "NFPA 70 (NEC) 2023 Article 310 Table
  310.16" (CHAT 3).

## 4. Snapshot check

`node scripts/snapshot-pages.mjs /tmp/wsz003b/before` (e689101) and `…/after` (e0ac6d8 build), then `diff -r`: 29 of 49
files differ. Changed lines per route (snapshot lines are text runs, so a new `<Val>` span splitting a run counts too):

| Route | Lines removed | Lines added |
|---|---:|---:|
| / | 13 | 13 |
| /about | 1 | 1 |
| /calculators | 1 | 1 |
| /calculators/ampacity-calculator | 53 | 71 |
| /calculators/amps-to-watts-calculator | 26 | 26 |
| /calculators/btu-to-watts-calculator | 11 | 11 |
| /calculators/ground-wire-calculator | 21 | 32 |
| /calculators/kilowatts-to-amps-calculator | 17 | 17 |
| /calculators/kva-to-amps-calculator | 12 | 12 |
| /calculators/low-voltage-calculator | 8 | 14 |
| /calculators/ohms-law-calculator | 51 | 51 |
| /calculators/service-entrance-calculator | 8 | 23 |
| /calculators/three-phase-calculator | 11 | 11 |
| /calculators/voltage-drop-calculator | 20 | 39 |
| /calculators/volts-to-amps-calculator | 7 | 7 |
| /calculators/watts-to-amps-calculator | 16 | 16 |
| /calculators/wire-resistance-calculator | 27 | 46 |
| /calculators/wire-size-calculator | 35 | 116 |
| /guides | 1 | 1 |
| /guides/awg-wire-size-chart | 22 | 22 |
| /guides/electrical-power-calculations | 31 | 31 |
| /guides/nec-code-compliance | 3 | 3 |
| /guides/nec-table-310-16 | 23 | 23 |
| /guides/power-factor-explained | 3 | 3 |
| /guides/single-vs-three-phase | 11 | 11 |
| /guides/wire-size-for-100-amp | 7 | 7 |
| /guides/wire-size-for-200-amp | 7 | 7 |
| /guides/wire-size-for-ev-charger | 10 | 10 |
| /terms | 2 | 2 |

Normalized diff: the before pages (the baseline HTML) got step 6's changes (the spacing rule applied to each text run,
consecutive text nodes counting as one run; `Q: `; the 12 wording changes), both sides were joined into one line per
block (inline tags don't split a block), the withdrawn pages were left as they are, and the two were diffed. Result: 16
files, 62 lines, all of them expected:
- the seven Sources sections, 40 added lines (wire size 9, ampacity 7, ground wire 6, voltage drop 5, low voltage 5,
  service entrance 5, wire resistance 3), nothing removed;
- JSON-LD `dateModified` on the nine guides whose page files 74ac215 changed (11 lines, 2026-10-25/26 → 2026-11-03):
  the git-derived re-dating of DEVLOG §4, which handoff §5 answer 12 accepted.
The same check on the uncommitted build of 74ac215's tree (before the re-dating) left only the 40 Sources lines. Form
values and links (value, name, min, max, step, type, href and selected of every option, input, select, a and form): the
same 2,489 elements in the same order on all 49 pages, apart from the new Sources links. React's generated `useId` ids
are left out of that comparison: they follow the component tree and changed on the low voltage page (labels still
match, check-structure 9).

## 5. data-src on the seven calculators' default results

| Route | data-src | calc: | input | registry domain (Sources items, diameters) | data-size | Not tracing |
|---|---:|---:|---:|---:|---:|---:|
| /calculators/wire-size-calculator | 40 | 18 | 13 | 9 | 14 | 0 |
| /calculators/voltage-drop-calculator | 22 | 14 | 5 | 3 | 3 | 0 |
| /calculators/ampacity-calculator | 15 | 8 | 2 | 5 | 2 | 0 |
| /calculators/ground-wire-calculator | 25 | 20 | 1 | 4 | 40 | 0 |
| /calculators/wire-resistance-calculator | 14 | 8 | 4 | 2 | 2 | 0 |
| /calculators/low-voltage-calculator | 6 | 2 | 1 | 3 | 3 | 0 |
| /calculators/service-entrance-calculator | 4 | 0 | 1 | 3 | 10 | 0 |

Values used: calc:conductor-sizing, calc:voltage-drop, calc:ampacity, calc:grounding, calc:resistance, calc:dc-sizing
(existing engines, all domains verified), input, and the verified domains of the Sources items plus awg-geometry for
the wire diameters (wire size, wire resistance). The low voltage "Total load" (loads × watts per load) is marked input.

## 6. Engines and Sources

| ENGINE_ID | DOMAINS |
|---|---|
| ampacity | nec-310-16, nec-310-15-corrections, nec-240-4-d |
| awg-geometry | awg-geometry |
| breaker-sizing | nec-continuous-load, nec-240-ocpd, nec-310-16, nec-240-4-d, nec-250-grounding |
| conductor-sizing | nec-310-16, nec-240-4-d, nec-240-ocpd, nec-250-grounding, conductor-resistance-20c, awg-geometry, nec-110-14c, nec-310-15-corrections |
| conversions | nist-sp811-conversions |
| dc-sizing | conductor-resistance-20c, awg-geometry, nec-310-16 |
| grounding | nec-250-grounding, nec-240-ocpd |
| load-calc-2023 | nec-220-load-calcs, nec-310-12 |
| motor-flc | nec-430-flc |
| ohms-law | power-definitions |
| power | power-definitions |
| resistance | conductor-resistance-20c |
| service-lookup | nec-310-12, nec-250-grounding, awg-geometry |
| voltage-drop | conductor-resistance-20c, nec-310-16, awg-geometry |

Each page's Sources list is the union of the DOMAINS of the engines its page and calculator import, in order, with
repeats dropped. All its domains were verified in October 2026, so each page shows one "Data as of Oct 2026" line.
Wire size leaves out nec-110-14c (CHAT 1).

**/calculators/wire-size-calculator** (7 sources; Data as of Oct 2026)
- nec-310-16 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026
- nec-240-4-d (2026-10-19): Source: NFPA 70 (NEC), 240.4(D) — NFPA revision record SR-8377 and 2023 text (Leviton reprint) — retrieved Oct 2026
- nec-240-ocpd (2026-10-20): Source: NFPA 70 (NEC) 2023, Table 240.6(A), 240.4(B) and 240.4(D) (NFPA 2023-cycle Second Draft; Eaton and Leviton 2023 reprints) — retrieved Oct 2026
- nec-250-grounding (2026-10-19): Source: NFPA, Using the Tables in Article 250 of the NEC (fact sheet, 2020), Tables 250.66 and 250.122; Table 250.122 also in NFPA 2026 revision record SR-8360 — retrieved Oct 2026
- conductor-resistance-20c (2026-10-19): Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026
- nec-310-15-corrections (2026-10-19): Source: NFPA 70 (NEC) 2023, Tables 310.15(B)(1)(1) and 310.15(C)(1) — retrieved Oct 2026

**/calculators/voltage-drop-calculator** (3 sources; Data as of Oct 2026)
- conductor-resistance-20c (2026-10-19): Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated
- nec-310-16 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026

**/calculators/ampacity-calculator** (5 sources; Data as of Oct 2026)
- nec-310-16 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026
- nec-310-15-corrections (2026-10-19): Source: NFPA 70 (NEC) 2023, Tables 310.15(B)(1)(1) and 310.15(C)(1) — retrieved Oct 2026
- nec-240-4-d (2026-10-19): Source: NFPA 70 (NEC), 240.4(D) — NFPA revision record SR-8377 and 2023 text (Leviton reprint) — retrieved Oct 2026
- conductor-resistance-20c (2026-10-19): Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026

**/calculators/ground-wire-calculator** (4 sources; Data as of Oct 2026)
- nec-250-grounding (2026-10-19): Source: NFPA, Using the Tables in Article 250 of the NEC (fact sheet, 2020), Tables 250.66 and 250.122; Table 250.122 also in NFPA 2026 revision record SR-8360 — retrieved Oct 2026
- nec-240-ocpd (2026-10-20): Source: NFPA 70 (NEC) 2023, Table 240.6(A), 240.4(B) and 240.4(D) (NFPA 2023-cycle Second Draft; Eaton and Leviton 2023 reprints) — retrieved Oct 2026
- nec-310-12 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.12 — retrieved Oct 2026
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026

**/calculators/wire-resistance-calculator** (1 sources; Data as of Oct 2026)
- conductor-resistance-20c (2026-10-19): Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated

**/calculators/low-voltage-calculator** (3 sources; Data as of Oct 2026)
- conductor-resistance-20c (2026-10-19): Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026
- nec-310-16 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026

**/calculators/service-entrance-calculator** (3 sources; Data as of Oct 2026)
- nec-310-12 (2026-10-19): Source: NFPA 70 (NEC) 2023, Table 310.12 — retrieved Oct 2026
- nec-250-grounding (2026-10-19): Source: NFPA, Using the Tables in Article 250 of the NEC (fact sheet, 2020), Tables 250.66 and 250.122; Table 250.122 also in NFPA 2026 revision record SR-8360 — retrieved Oct 2026
- awg-geometry (2026-10-19): Source: NIST (NBS) Handbook 100, Copper Wire Tables, Table 5 — retrieved Oct 2026

## 7. Numeric literals that no data file backs

Regenerated (WSZ-003a's list is not in the repo): every numeric literal in src/lib/calculations/ and
src/lib/verified/ through the TypeScript AST, then sorted by hand. Not listed: 0, 1 and 2 as counters or indices,
module paths, the golden-test parsing of rule text in src/lib/verified (it reads values from the data files).

Values a verified registry domain covers, typed in code (no data file):

| File:line | Value | What it is |
|---|---|---|
| src/lib/calculations/conversions.ts:8 | 0.2930711 | W per Btu/h (nist-sp811-conversions) |
| src/lib/calculations/conversions.ts:9 | 746 | W per electrical hp (nist-sp811-conversions) |
| src/lib/calculations/conversions.ts:10 | 745.6999 | W per mechanical hp (nist-sp811-conversions) |
| src/lib/calculations/conversions.ts:11 | 3516.853 | W per ton of refrigeration (nist-sp811-conversions) |
| src/lib/calculations/conversions.ts:12 | 12000 | Btu/h per ton |
| src/lib/calculations/inputs.ts:6 | 120, 208, 240, 277, 480 | single-phase voltages offered (us-nominal-voltages) |
| src/lib/calculations/inputs.ts:7 | 208, 240, 480, 600 | three-phase line voltages offered (us-nominal-voltages) |
| src/lib/calculations/inputs.ts:10 | 240 | the voltage kept when the phase changes |
| src/lib/calculations/power.ts:214–218 | 208, 240, 480, 480, 600 | line voltages of the three-phase systems |

Text that repeats data values or their conversions:

| File:line | Value | What it is |
|---|---|---|
| src/lib/calculations/resistance.ts:98 | 20 °C, α = 0.00393, α = 0.00403 | RESISTANCE_NOTES; α is in awg.json constants |
| src/lib/calculations/voltage-drop.ts:35 | 75 °C | RESISTANCE_BASIS_LABEL (the 75 °C resistances of awg.json) |
| src/lib/calculations/voltage-drop.ts:37 | about 64 % | ALUMINUM_RESISTANCE_NOTE (17.002 ÷ 10.371 − 1 from awg.json constants, rounded) |
| src/lib/calculations/conductor-sizing.ts:78 | 60 °C, 2023, 30 °C (86 °F), 120/240 V | BASIS_LINES |
| src/lib/calculations/dc-sizing.ts:20 | 60 °C, 30 °C | BASIS_LINE |
| src/lib/calculations/service-lookup.ts:20 | 120/240 V, 30 °C | SCOPE_LINES |
| src/lib/calculations/ampacity.ts:108–110 | 140, 167, 194 °F | °F equivalents in the temperature-column labels |
| src/lib/calculations/dc-sizing.ts:16–17 | 20 °C (68 °F), 75 °C (167 °F) | the conductor temperatures offered |
| src/lib/calculations/ampacity.ts:32 | 1–3 | the Table 310.15(C)(1) band that takes no adjustment |
| src/lib/calculations/conductor-sizing.ts:59–65 | 15 A, 400 A, 0 ft, 2000 ft, 1 %, 10 %, 0 V, 208, 240, 480, 600 V | SIZING_ERROR_MESSAGES (repeat the ranges below) |

Policies, ranges and defaults (design constants):

| File:line | Value | What it is |
|---|---|---|
| src/lib/calculations/conductor-sizing.ts:396 | 60 | ampacity60: the 60 °C column (D-06) |
| src/lib/calculations/voltage-drop.ts:165 | 60 | AMPACITY_NOTE_COLUMN, the column of the WSZ-015 ampacity note |
| src/lib/calculations/dc-sizing.ts:67 | 60 | the 60 °C copper column for the current size |
| src/lib/calculations/conductor-sizing.ts:68–71 | 15, 400, 1, 10 | rating range (A) and voltage-drop target range (%) |
| src/lib/calculations/voltage-drop.ts:42–45 | 1–5, 3, 0, 2000 | target options and default (%), length range (ft) |
| src/lib/calculations/resistance.ts:104–107 | 1, 5000, −40, 200 | distance (ft) and temperature (°F) ranges |
| src/lib/calculations/grounding.ts:17 | 15, 6000 | ground wire ratings offered (A) |
| src/lib/calculations/ampacity.ts:105 | '14' | the smallest size offered |
| defaults: conductor-sizing.ts:252–258, voltage-drop.ts:202–209, ampacity.ts:130–136, grounding.ts:19, resistance.ts:143–152, dc-sizing.ts:81–88, service-lookup.ts:44, power.ts (converter defaults) | | first-render inputs |

Unit definitions and arithmetic (exact, no source needed): 25.4 mm per inch and 1000 mils per inch
(awg-geometry.ts:12–13), 0.0254 mm per mil (verified/awg.ts:19), 1000 cmil per kcmil (verified/nec-250-66.ts:10),
1000 VA per kVA and W per kW (verified/nec-220-2023.ts:9, load-calc-2023.ts:15), 100 for percent (several), °F → °C
(resistance.ts:49), the per-1000-ft basis (÷ 1000), 2 and √3 phase factors (voltage-drop.ts:74, power.ts:42), 2 or 3
conductors in the power-loss loop (resistance.ts:81), REFERENCE_TEMP_C 20 (the 20 °C basis of the awg.json values,
resistance.ts:15), SI prefixes (ohms-law.ts:100–106).

## 8. Test assertions and check-script strings changed

None. No existing assertion in tests/*.ts and no expected string in scripts/check-banned.mjs or
scripts/check-structure.mjs changed (both files are unchanged). tests/register.mjs gained one resolve rule ("server-only"
loads as an empty module, as Next.js does at compile time); scripts/lib/build-output.mjs gained the `<noscript>` skip,
the text events' ancestors and the new gates' helpers, and re-exports parseCsv from src/lib/verified/csv.mjs. New tests:
tests/wsz003b-registry.test.ts (7) and tests/wsz003b-gates.test.ts (55): 331 tests, 0 failed, 0 skipped.

## 9. Other notes

- Client chunks: `du -sb .next/static/chunks` 1,481,239 bytes (WSZ-003a recorded 1,460,271). `<Size>` checks
  nec-310-16.json as well as awg.json, which adds that file to the service entrance bundle.
- research/wsz002-banned-strings.txt has 15 phrases written with joined units (`99.9%`, `±0.1%`, `60% of electrical`,
  `408V`, `remainder @ 80%`, `100A subpanel: 3 AWG copper, 1 AWG aluminum at 75°C`, `May use 50A breaker`,
  `8 AWG copper, 50A breaker`, `making it suitable for 30A breakers`, `assumes 75°C rated conductors and terminations`,
  `NEC 3% recommendation`, `within 5% limit`, `NEC recommendation of 3%`, `Circuit Current (125%)`,
  `125% continuous load`). Gate a now fails on the joined forms, but check-banned would pass their spaced forms
  (CHAT 6).
- Impeccable: its launcher was not run (D-07). The Sources sections reuse each page's own section and FAQ classes and
  the existing `text-blue-600 hover:underline` link class (`dark:text-blue-300` on the three pages with dark variants):
  no new colours, fonts or components. Layout at 320 and 390 px: unverified (D-16).
- anti-slop: 0 fixes. All new reader-facing text is chat's wording, the heading "Sources" or registry text.

## 10. CHAT questions

1. **nec-110-14c on the wire size page.** The union rule puts nec-110-14c (conductor-sizing's DOMAINS) in the wire size
   Sources, but its attribution prints "110.14(C)", which check-structure 7 fails on any rendered page. The page leaves
   it out (comment in src/app/calculators/wire-size-calculator/page.tsx). Keep it out until WSZ-009 adds the termination
   inputs, or change check 7 or the attribution?
2. **"Article 250" in the nec-250-grounding attribution.** Gate c counts it on wire size, service entrance and ground
   wire, so wire size and service entrance stay out of necRefs.enforce. Add "Article 250" (location only) to
   research/nec-sections-allowlist.csv, reword the attribution in the next pack, or let gate c skip registry
   attribution text?
3. **/guides/awg-wire-size-chart** has "Article 310" in its Dataset JSON-LD citation, so it stays out of
   necRefs.enforce. Add "Article 310" to the allowlist, or leave it for WSZ-005's rebuild?
4. **"10x"** (voltage drop FAQ: "The same voltage drop has 10x more impact at 12 V.") is allowlisted as pending
   wording. Keep it, or give the wording (for example "10 times")?
5. **Literals without a data file** in the seven calculators' engines and inputs.ts (section 7): should the nominal
   voltages (inputs.ts) and the °F equivalents in labels come from data (us-nominal-voltages has no data file), and
   should the typed text that repeats data values (RESISTANCE_NOTES α values, "about 64 %", the basis lines) render
   from data in the rebuild waves? The ranges and defaults look like design constants that stay in code.
6. **Banned phrases with joined units** (section 9): add their spaced forms to the next pack's banned-strings list?
7. **Gate b scope on the calculators.** Form option labels and the fixed prose of the result panels (section 2) are
   counted but outside step 4. Should their rebuild waves wire them (options can carry `data-src`/`data-size` on
   `<option>`)? DEVLOG §5 has a line for this.
