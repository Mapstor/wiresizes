# Page specs — wiresizes.com rebuild (WSZ-005, WSZ-006, WSZ-007)

Written 2026-10-19 from: the Bing keyword export (2,401 queries, 12 months), the GSC www export, the live crawl, and the verified registry. Query counts are Bing impressions unless marked. Held pages (WSZ-008 to WSZ-011) get specs after their GAP domains close; the blocking GAP is listed at the end.

## Rules for every page (apply before the per-page notes)
- Build standard: .claude/skills/content-page (v2.1) and anti-slop-prose. Tool pages use the tool-first layout: H1 plus at most two plain lines, first input within about 60 rendered words, results only after the button, and a server-rendered twin (worked example, typical-values table, how to read the results).
- Every unit-bearing number renders through the data/engine components with a data-src attribute (number-trace gate). No hand-typed numbers in page prose.
- NEC references only from research/nec-sections-allowlist.csv, with the edition next to every code value ("2023 NEC").
- Byline block, "Sources" block built from registry attribution strings, "Updated" = last commit that changed the page's content or its data file.
- Imperial first, metric second (mm, mm², Ω/km, kg/km). US spelling.
- No costs, prices, rebates, savings, energy bills, "typical" claims or brand specs unless a verified registry domain backs them. No personas, no "experts say".
- Sibling pages must not share one H2 skeleton. Section, example and FAQ counts follow each page's own queries below.
- Meta title up to 60 characters, meta description up to 155, written for the primary query. "Complete" only where the table really is complete.
- Spec words in this file (wedge, primary query, hold, GAP, domain, engine) never render.

---

## WSZ-005 — flagships and hubs

### /guides/awg-wire-size-chart
Traffic: Bing 222,588 impressions, 4,248 clicks, average position 5.0 (79% of the site's Bing impressions with the 310.16 page).
- Queries: "awg wire size chart" 4,498 (193 clicks, pos 3.4) · "awg" 10,257 · "wire gauge chart" 5,059 · "wire size chart" 4,860 · "awg chart" 2,307 · "wire gauge size chart" 1,419 · "awg table" 560 / "awg wire table" 474 · "awg meaning" 402 · "wire diameter" 125 · per gauge: "14awg" 1,057, "12 awg" 936, "16awg" 734, "10 awg" 564, "18 awg" 536, "4awg" 243, "6 awg" 213, "8 awg" 203, "24 awg" 88 · diameter in mm: 20, 18, 16, 30, 4, 6, 24, 10, 26, 22 AWG (10–45 each) · "14 awg in mm2" 43, "12 awg in mm" 24 · questions: "what is awg", "is 6 awg bigger than 24 awg", "how are awg sizes calculated", "1/0 awg meaning" 42, "difference between 10awg and 12awg".
- Intent: look up the physical size of a gauge (inch, mm, mm²) and how much current it is rated for; understand what the gauge numbers mean.
- Type: data reference page, table first. Schema: Article + Dataset (isBasedOn NIST HB100) + BreadcrumbList.
- H1 idea: "AWG Wire Size Chart: Diameter, Area, Resistance and Ampacity".
- Information gain (state it in plain words where it helps the reader, never labeled): AWG is a geometric series fixed by two points, 0000 = 0.4600 in and 36 = 0.0050 in with 39 steps between them. So every 6 steps halves the diameter (×2.005), every 3 steps halves the area and doubles the resistance, and 10 steps multiplies resistance by about 10 (×10.19). The page shows the full 0000–40 range plus 250–2000 kcmil, where most charts stop at 18 AWG or 4/0. All ratios are engine outputs from the definition in awg.json.
- Direct answer (40–60 words): what AWG is, "a smaller number is a thicker wire", the 6-step and 3-step rules, one example pair from data (14 AWG vs 12 AWG diameter in inches and mm).
- Tables (server-rendered, scroll-wrapped, first column sticky; one value basis throughout = awg.json, which settles the old 2.052/2.053 mm and 107.0/107.2 mm² mismatches):
  1. Size: AWG 0000–40 · diameter in · diameter mm · area cmil · area mm² · nearest IEC 60228 size (only inside 0.5–1600 mm²).
  2. Resistance and weight, solid annealed copper: Ω/1000 ft and Ω/km at 20 °C (NIST) · Ω/1000 ft at 75 °C (labeled "calculated") · aluminum EC-H19 at 20 °C for 12 AWG and larger (labeled "calculated") · lb/1000 ft · kg/km.
  3. Ampacity excerpt, 14 AWG–4/0, 2023 NEC Table 310.16 (Cu and Al, 60/75/90 °C), plus a column "maximum overcurrent protection, NEC 240.4(D)" filled only for 14/12/10 AWG copper; link to the full table page.
  4. kcmil 250–2000: area cmil and mm², copper and aluminum resistance (calculated), nearest IEC size.
- Per-gauge anchors (#awg-18, #awg-16, #awg-14, #awg-12, #awg-10, #awg-8, #awg-6, #awg-4, #awg-2, #awg-1-0, #awg-4-0, #awg-20, #awg-22, #awg-24): a small card each with diameter, area, resistance and, where Table 310.16 lists the size, its three ampacities. One sentence of context, no "typical uses" unless sourced.
- H2 order: the chart · what the gauge numbers mean (incl. why 0000 is written 4/0) · how diameter, area and resistance scale · AWG to mm² (IEC sizes do not line up with AWG; 14 AWG is 2.08 mm² and the next IEC size up is 2.5 mm²) · ampacity is a code rating, not part of the gauge (link to Table 310.16; 240.4(D)) · resistance at operating temperature (link to the resistance calculator) · FAQ · sources and method.
- Solid vs stranded: diameters in the chart are for solid conductors. Concentric-lay geometry makes a 7-strand conductor about 13.4% larger in overall diameter and a 19-strand one about 14.7% larger (calculated as (2k+1)/√N). Strand counts per size are not published here (ASTM B8 is paywalled); say so. Insulated diameter depends on the insulation type and is not in this data.
- FAQ (real queries): What does AWG mean? Is 6 AWG bigger than 24 AWG? How are AWG sizes calculated? What is 14 AWG in mm²? What is the diameter of 20 AWG wire in mm? What does 1/0 or 4/0 mean? What is the difference between 10 AWG and 12 AWG? How much current can 12 AWG copper carry? (Table 310.16 columns plus the 240.4(D) 20 A limit.)
- SVGs: hero = to-scale circles for 4/0, 1/0, 4, 10, 14 and 24 AWG drawn from data, showing that 6 steps halve the diameter. Supporting = a diagram of 3 gauge steps halving the area. Charts (resistance vs gauge, log scale) do not count toward the two.
- Remove: cost table, the old "stranded required above 8 AWG" line (replace with 2023 NEC 310.3(C): in raceways, 8 AWG and larger shall be stranded unless permitted or required elsewhere), the 334.10 solid claim, the heat-balance "derivation", the unconditioned application list, "R20 … (NEC Ch.9 Table 8)".
- Links out: NEC 310.16 page, wire resistance calculator, voltage drop calculator, low-voltage calculator, /methodology. Links in: homepage, both hubs, the 310.16 page.

### /guides/nec-table-310-16
Traffic: Bing 26,196 impressions, 1,512 clicks, position 4.1.
- Queries: "nec table 310.16" 2,200 (316 clicks, pos 2.6) · "nec 310.16" 1,349 · "310.16" 465 · "nec ampacity chart" 174 · "wire ampacity chart" 149 (pos 8.2) · "ampacity" 144 · "table 310.16" 146 · "310.16 nec table" 126 · "nec ampacity table" 77 · per size: "10 awg ampacity" 56, "8 awg ampacity" 47, "14 awg ampacity" 41, "12 awg ampacity" 19, "16 awg ampacity" 16.
- Intent: read the table and apply ambient and bundling corrections; confirm the edition.
- Type: data reference. Schema: Article + Dataset (isBasedOn NFPA 70-2023, no license claim) + BreadcrumbList.
- H1 idea: "NEC Table 310.16 Ampacity Chart (2023 NEC)".
- Information gain: the full 30-row table to 2000 kcmil, both correction tables in °C and °F, a correction worked out by the same engine the calculator uses, and a dated edition panel (2026 NEC issued Aug 20, 2025, effective Sep 9, 2025; which states enforce which edition, verified states only).
- Direct answer: what the table covers (allowable ampacities, not more than three current-carrying conductors, 30 °C / 86 °F ambient) and one example row (12 AWG Cu 20/25/30 A) with the 240.4(D) 20 A protection limit.
- Tables: Table 310.16 all 30 rows with the insulation types per column (columns_types) and markers on 240.4(D) sizes · Table 310.15(B)(1)(1), 16 rows, °C and °F · Table 310.15(C)(1), 6 bands · 240.4(D) limits (verified rows only) · Table 310.12 excerpt with a link to the 200 A guide · edition panel.
- Worked example (engine, golden case): 6 AWG copper, 90 °C column, 41–45 °C ambient, 4–6 current-carrying conductors: 75 A × 0.87 × 80% = 52.2 A.
- Optional mini-tool (button-gated): size + column + ambient + number of conductors → corrected ampacity, with the 240.4(D) limit shown for 14/12/10 AWG copper.
- H2 order: the table · reading the columns (insulation temperature ratings; copper vs aluminum/CCA) · ambient temperature correction · more than three current-carrying conductors · small conductors and 240.4(D) · dwelling services and Table 310.12 · what changed in 2026 · FAQ · sources.
- FAQ: What is NEC Table 310.16? What is the ampacity of 10 AWG copper? Of 8 AWG? Of 14 AWG (and why it is protected at 15 A)? Why do 200 A dwelling services use 4/0 aluminum when Table 310.16 lists 180 A? (Table 310.12, 83% rule). Did the 2026 NEC change Table 310.16? (Revision drafts show 14 AWG–2000 kcmil unchanged; final text not seen — say exactly that.)
- Not in WSZ-005 (sources pending): which temperature column a circuit may use (110.14(C)), NM cable at 60 °C (334.80), Table 310.17 free air.
- Remove: "Download PDF", "requires PE stamp", the worked EV example, wrong section numbers (310.15(B)(7), 310.15(B)(5), "210.19(A)/215.2(A) OCPD"), "200 A service = 4/0 Al at 75 °C".
- Legal: NFPA trademark notice on the page; values as data; no verbatim table notes; short quotes only.

### / (homepage)
Traffic: Bing 15,369 impressions, 284 clicks; Google www 433 impressions at position 52.9.
- Query: "wire size calculator" 1,548 (pos 7.2) lands here, but the wire size calculator is held until its sources close. Do not imply it exists.
- Type: hub. H1 idea: "Wire Size Charts and Electrical Calculators". Two lines: what the site covers (NEC tables and NIST conductor physics) and who keeps it (Marko Visic, BSc Physics), linking /about and /methodology.
- Cards for live pages only, derived from the route list (withdrawn pages excluded automatically). A compact verified reference: 14 AWG–4/0 with diameter (mm) and the 2023 Table 310.16 75 °C copper/aluminum values, linking the chart.
- Remove: the breaker column, "feeder 5% (215.2)", "continuous ≤90%", the equipment table, "100 A subpanel on 4 AWG", both voltage-drop examples, diameter visuals, arc-flash PPE, "60% of failures", the regional section, the NEC timeline, the 150 A row.

### /calculators and /guides (hubs)
- List live pages only (derived), one factual line each, no counts unless derived, no usage bars, no AI/schema/llms.txt talk.
- Edition line from data: pages use the 2023 NEC; the 2026 NEC was issued Aug 20, 2025 (effective Sep 9, 2025) and is enforced in Texas, Massachusetts, Minnesota and Oregon (link the editions page).

### /guides/nec-code-compliance → NEC editions by state (slug unchanged)
- Traffic: 176 impressions. Repurposed because the old page carried a shifted Table 310.16 and wrong grounding sizes.
- H1 idea: "NEC Edition by State (Verified October 2026)". The title must not promise all 50 states.
- Content: the nec-adoption.json table (16 jurisdictions: state, edition, effective date, scheduled change, source link); the not-yet-verified list; what changed in the 2026 NEC (final-edition facts from nec-2026-edition only); the 2023 GFCI changes (210.8(A)(6), 210.8(D), 210.8(F)) and EV rules (625.40, 625.42, 625.43, 220.57). Local amendments can differ; say so.
- Never publish IAEI counts. Re-check date visible.

---

## WSZ-006 — physics tools

### /calculators/wire-resistance-calculator
Traffic: Bing 8,389 impressions, 256 clicks. Queries: "wire resistance calculator" 196 (pos 4.1), "wire resistance" 33, "cable resistance calculator" 26, "copper wire resistance calculator" 17, "resistance of copper wire" 17, "resistance per 100 feet", "resistance of conductor per 1000 feet table", "copper wire resistance ohms/metre", "resistance of 24 awg wire per 1000 ft".
- Inputs: size (AWG 0000–40, kcmil 250–2000, or mm² converted to the nearest listed size with a note), material (copper; aluminum EC-H19 for 12 AWG and larger), length (ft or m), one-way or round-trip, conductor temperature (°C/°F; default 20 °C with a one-click 75 °C).
- Outputs: resistance of the run in Ω, per 1000 ft and per km at the chosen temperature, the round-trip value for a two-wire circuit, the same run at 20 °C and 75 °C side by side, and neighbouring sizes.
- Information gain: temperature changes resistance a lot. Copper at 75 °C is 21.6% above its 20 °C value (1 + 0.00393 × 55 = 1.21615), and EC-H19 aluminum has 1.639 times the resistance of copper of the same area (17.002 / 10.371). Both computed from the published constants.
- Server-rendered twin: worked example 14 AWG copper, 100 ft, 75 °C (engine; R75 = 3.0647 Ω/1000 ft); typical-values table 14 AWG–4/0 copper at 20 and 75 °C and aluminum for 12 AWG and larger; how to read the results.
- FAQ: What is the resistance of copper wire per 1000 ft? Per 100 ft? How does temperature change it? Copper vs aluminum? How is wire resistance calculated (R = ρL/A, with ρ = 10.371 Ω·cmil/ft at 20 °C)? Ohms per metre?
- Say: values are for solid conductors; stranded conductors of the same size have slightly higher resistance because of strand lay (not quantified here).
- Remove: the mixed and mislabeled "75 °C" table, the 500 kcmil aluminum value, the RF/skin-effect example (no verified AC data), the server-rendered "0 Ω, 0%" default, "AWG" labels on kcmil sizes.

### /calculators/voltage-drop-calculator
Traffic: 9 impressions (the drop topic lives on other pages today). Queries: "wire size calculator voltage drop", "voltage drop ampacity chart".
- Inputs: system (single-phase two-wire, three-phase), voltage, load current (or watts with PF), one-way length, conductor size, material, conductor temperature (default 75 °C), parallel sets 1–4. Mode 2: find the smallest size for a drop target the reader sets (default 3%, labeled as the reader's target).
- Outputs: drop in volts and percent, voltage at the load, resistance used, conductor loss in watts (I²R), comparison with the next sizes.
- Method on the page: VD = k × L × I × R / 1000, k = 2 single-phase, √3 three-phase; R from NIST at the chosen temperature; resistive approximation; AC reactance not included (no verified Chapter 9 Table 9 data).
- Worked examples (golden cases): 3/0 Cu, 200 A, 100 ft, 240 V → 3.007 V, 1.253% · 12 AWG Cu, 16 A, 50 ft, 120 V → 3.094 V, 2.578% · 4 AWG Cu, 60 A, 150 ft, 480 V three-phase → 4.711 V, 0.981%.
- Parallel sets: total area is the sum (2 × 1/0 = 211,200 cmil, just under 4/0 at 211,600).
- Optional energy line: conductor loss × hours (reader input) × the EIA residential average (18.31 ¢/kWh, July 2026), with the month shown.
- Not in WSZ-006: the NEC informational notes on 3% and 5% (sources pending).
- Remove: the temperature table, the PF "multiplier" and its formula, the wrong parallel equivalences, "200 A at 150 ft needs 350 kcmil", "8% fire hazard", "10% code violation", the loss and ROI tables, $0.12/kWh.

### /calculators/low-voltage-calculator (12 V / 24 V / 48 V DC)
- Inputs: system voltage (12, 24, 48 or custom), load in amps or watts, one-way length, allowed drop (reader's target), conductor temperature (20 °C or 75 °C), copper.
- Outputs: required circular mils and mm², smallest gauge that meets it, actual drop for that size and its neighbours.
- Method on the page: CM = 2 × K × I × L / VD, K = 10.371 × (1 + 0.00393 × (T − 20)) Ω·cmil/ft.
- Worked example (golden): 12 V, 400 W, 40 ft, 2% → about 115,000 cmil at 20 °C (2/0) or 140,000 cmil at 75 °C (3/0). The old page said 10 or 8 AWG.
- Say: this checks voltage drop only; the conductor must also be rated for the current (link Table 310.16 for building wiring).
- Remove: the formula without K, every example built on it, Class 2 section numbers, ABYC/RVIA/SAE claims, the unlabeled resistance table.

### /calculators/three-phase-calculator
Traffic: 161 impressions.
- Inputs: any two of kW, kVA, amps, voltage (line-to-line), PF. Optional: target PF.
- Outputs: amps, kVA, kW, kVAR; line-to-neutral voltage (V_LN = V_LL / √3) for 208Y/120 and 480Y/277 (nominal systems listed in NCUC Rule R8-17 / ANSI C84.1); PF correction: capacitor kVAR and the drop in current.
- Worked examples (golden): 50 kW at 480 V, PF 0.9 → 66.84 A · 100 kW from PF 0.80 to 0.95 → 42.13 kVAR, current down 15.79% (the old page printed 32.9 kVAR and 18.8%).
- Remove: the motor table with formula FLA and every wire size derived from it, the 50 hp example, HVAC/water-plant/welding examples, "GF 30 mA personnel".

---

## WSZ-007 — converters and power guides
One worked example each from research/golden-cases.json, a short "how the formula works" section, the reader's real questions, and nothing that needs a GAP domain.
- /calculators/kilowatts-to-amps-calculator ("kw to amps" 105, pos 8.9; "kw to amps calculator" 25): 7.2 kW at 240 V → 30 A; 50 kW at 480 V three-phase PF 0.9 → 66.84 A. Remove the range rule, the PF-by-equipment table, "leading PF > 1.0", the kW ranges and rack claims.
- /calculators/kva-to-amps-calculator ("750 kva to amps", "125 kva to amps"): 75 kVA at 208 V three-phase → 208.18 A; 75 kVA at 480 V → 90.21 A; 25 kVA at 240 V single-phase → 104.17 A. Remove the wire and breaker columns, the 450.3 summary, the motor code-letter table.
- /calculators/watts-to-amps-calculator: 4500 W at 240 V → 18.75 A (Rheem and A.O. Smith wire their two 4500 W elements so only one heats at a time). Remove "12 AWG for 25 A", "most appliances are continuous loads", the pool-pump amps, the "max practical amps" table.
- /calculators/amps-to-watts-calculator: 50 A at 480 V three-phase PF 0.92 → 38,243.4 W (the old page printed 38,323). Remove "≈7 hp", the 220.54/424.3 references, PF penalty figures, generator and altitude rules.
- /calculators/volts-to-amps-calculator: make the tool match its description (I = P / (V × PF), or I = V / R with Ohm's law). Remove the EV, furnace, motor, pool-pump and solar examples.
- /calculators/ohms-law-calculator: keep the correct examples; remove "+40% hot winding".
- /calculators/btu-to-watts-calculator ("btu to watts converter for heat pump", "9000 btu in watts"): 12,000 Btu/h = 3,516.85 W; 1 ton of refrigeration = 3,516.853 W; 1,000 W = 3,412.14 Btu/h (NIST SP 811). Remove the MCA/MOP table, SEER/HSPF minimums, fuel prices, rules of thumb, "EER = SEER × 0.875".
- /guides/power-factor-explained: EIA definitions of real, reactive and apparent power and power factor; the DOE example (100 kW drawing 142 kVA has PF 0.70; correcting to 0.95 takes about 68 kVAR and cuts current about 26%); 0.80 → 0.95 on 100 kW = 42.13 kVAR, 15.79% less current. Remove the equipment PF table and every cost figure.
- /guides/single-vs-three-phase ("single phase vs 3 phase" 446 impressions, 0 clicks, pos 7.9 — title and meta must answer the question): definitions, P = √3 × V × I × PF, US nominal systems (NCUC R8-17 / ANSI C84.1), one computed comparison: the same 10 kW load at 240 V single-phase, 208 V three-phase and 480 V three-phase (engine). Remove the decision matrix, motor-size claims, converter prices, "408 V", and correct 4/0 copper to 0.6405 lb/ft (NIST) if weight stays.
- /guides/electrical-power-calculations: the formula table (verified) and worked examples from golden cases. Remove Example 5 (dwelling load calculation), the refrigerator figures, "PF = efficiency", "73% more power", the 25 hp overload example.

---

## Held — specs after the next sourcing session
| Wave | Pages | Blocked by |
|---|---|---|
| WSZ-008 | /guides/wire-size-for-200-amp, /guides/wire-size-for-100-amp, /calculators/service-entrance-calculator, /guides/wire-size-for-ev-charger, /calculators/ground-wire-calculator, /calculators/garage-subpanel-calculator | G14 (110.14(C), 334.80), G2 (125% rules), G13 (225.x, 250.32, 250.122(B), 230.24, 300.5) |
| WSZ-009 | /calculators/wire-size-calculator, /calculators/ampacity-calculator, /calculators/circuit-breaker-calculator, /calculators/conduit-fill-calculator, /calculators/box-fill-calculator | G1 (240.6(A), 240.4(B)), G14, G3 (Ch. 9 T1/T4/T5), G5 (314.16) |
| WSZ-010 | /calculators/residential-load-calculator, /calculators/range-calculator, /calculators/dryer-calculator | G7 (Article 220/120 values), G16 (dryer/range instructions), G18 (NEMA WD 6) |
| WSZ-011 | /calculators/motor-circuit, /calculators/horsepower-to-amps-calculator, /calculators/well-pump-calculator, /calculators/pool-pump-calculator, /calculators/hot-tub-calculator, /calculators/welder-calculator, /calculators/air-conditioner-calculator, /calculators/rv-hookup-calculator | G6 (430 tables), G8 (440), G10 (680), G11 (630), G12 (551.73), G16 (AC MCA/MOCP, Franklin 2026), G18 |
