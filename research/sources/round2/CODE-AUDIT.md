# wiresizes.com — calculator code audit (20 Oct 2026)

Scope: the client-side logic of 14 calculators, the shared engine they call (`src/lib/calculations/wire-sizing.ts`, `src/lib/data/nec-tables.ts`, `src/lib/data/wire-properties.ts`), the result card, the visualizations, and `src/data/calculator-faqs.ts`. I read the source tree without running it. Each calculator's arithmetic was re-implemented by hand in Python (`/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/audit2_scripts/sitecode.py`), and the golden cases and defect scenarios were run through it with `check.py` in the same folder (`python3 -I check.py <that folder> <pack/data/verified> <pack/research/golden-cases.json>`).

None of the 14 in-scope `page.tsx` files compute anything. They only map static arrays, which the 19 Oct page audit already covered. The three-phase page tables are recomputed in §11 because the brief asked for them.

**Severity.**
- **P0**: a wrong or unsafe number in an output a reader would act on. Each P0 is tagged *unsafe* (the error points toward undersizing or understating) or *wrong* (incorrect but conservative).
- **P1**: a wrong label or claim.
- **P2**: polish.
- **U**: the output depends on an unverified rule (110.14(C), 125 % continuous, 240.4(D) for Al, 240.6(A), 430 FLC tables, conduit/box fill, Article 220). U outputs are not counted as P0; the recommendation for them is to remove the output.

**Known issues, not re-reported (they still apply wherever `calculateWireSize`, `calculateVoltageDrop`, the ambient table or the temperature factors are used):**
- 75 °C column with no 240.4(D) check
- equipment grounding conductor (EGC) sized from load amps, with the table ending at 1200 A
- voltage drop at 20 °C
- the "3 % recommendation / 5 % limit" wording
- shifted ambient-correction table
- ampacity calculator column mix-up
- wire-resistance `TEMPERATURE_FACTORS`

## Summary

| # | Calculator (live component) | P0 | Core formula | Recommendation |
|---|---|---|---|---|
| 1 | Ground wire (`GroundWireCalculator.tsx`) | 2 | Breaker mode ✓ (all 37 options match T250.122 Cu) | **Fix now.** Keep breaker mode and add the Al/CCA column. Delete the conductor-size and "upsized" modes. |
| 2 | Garage subpanel (`GarageSubpanelCalculator.tsx` is live; `GarageSubpanelWireSizeCalculator.tsx` is dead code) | 2 | Feeder via shared engine | **Remove** "Total Demand", "Recommended Panel" and the notes (Art. 220/225/250.32 unverified). Fix the EGC per material. Delete the dead file. |
| 3 | Service entrance (`ServiceEntranceCalculator.tsx`) | 5 | No load calc: the user types watts, and an invented 80 % rule picks the size | **Withdraw.** Replace with a verified 310.12 + 250.66 lookup for 120/240 V dwellings. |
| 4 | kW → A (`KilowattsToAmpsCalculator.tsx`) | 0 | ✓ | **Fix now.** Remove circuit amps, breaker, cost and motor preset. |
| 5 | kVA → A (`kVAToAmpsCalculator.tsx`) | 0 | ✓ | **Fix now.** Remove circuit amps, breaker and the "450.3" guidelines. Fix the "turns ratio" label. |
| 6 | Watts → A (`WattsToAmpsCalculator.tsx`) | 3 | Conversion ✓ | **Remove the wire-size output** (shared-engine defects plus voltage drop computed at 125 % current). Keep the conversion. |
| 7 | Amps → W (`AmpsToWattsCalculator.tsx`) | 0 | ✓ | **Fix now** (labels only). |
| 8 | Volts → A (`VoltsToAmpsCalculator.tsx`) | 1 | ✓, but it is P/(V·PF), not I = V/R | **Fix now** (table, description) or merge into watts → amps. |
| 9 | Ohm's law (`OhmsLawCalculator.tsx`) | 1 | ✓ (all 12 branches) | **Fix now** (rounding). |
| 10 | BTU → W (`BTUToWattsCalculator.tsx`) | 2 | Conversion ✓ (0.293071) | **Fix now.** Make it a thermal-only conversion. Remove "Electrical Power Required", current and the combustion presets. |
| 11 | Three-phase (`ThreePhaseCalculator.tsx` + page tables) | 5 (+2 page) | P↔I ✓ | **Remove** wire sizing, neutral current, load-balance factor and "Actual Power". Recompute the page PF table and drop the motor guide. |
| 12 | Low voltage (`LowVoltageCalculator.tsx`) | 3 | VD formula ✓ (it includes R; the page text is what omits resistivity) | **Fix now.** Use the full awg.json range with CM = 2·K·I·L/VD. Remove the fallback, the voltage-dependent "capacity" and the compliance badge. |
| 13 | Voltage drop (`VoltageDropCalculator.tsx`) | 2 | ✓ formula (20 °C R is known) | **Fix now.** Add R for 600–1000 kcmil, use 3·I²·R·L for three-phase loss, fix the "61 %" text. |
| 14 | Wire resistance (`WireResistanceCalculator.tsx`) | 3 | Loop-R formula ✓ | **Fix now.** Use R(T) from HB100/HB109 constants, add an ampacity floor, fix the 3φ loss, remove hidden inputs. |
| 15 | `CalculatorResult.tsx` + visualizations | 1 | n/a | **Fix now.** EGC per material, kcmil labels and diameters, and the duplicated 3 %/5 % wording. |
| 16 | `calculator-faqs.ts` (FAQPage JSON-LD on 30 pages, never shown on them) | 6 live (+2 in unused keys) | n/a | **Fix now.** Correct or delete 18 claims. Render the FAQs visibly or drop FAQPage. Fix the key mapping on well-pump and air-conditioner. |

Shared-engine defects (S1–S3 below) are counted in every calculator whose output they reach.

## Shared engine: new defects (not in the known list)

| ID | File:line | What the code does | Correct (source) | Sev |
|---|---|---|---|---|
| S1 | `wire-sizing.ts:98-128,185-195` with `wire-properties.ts:20-219` and `nec-tables.ts:69-71` | 600, 750 and 1000 kcmil exist in `NEC_310_16` and the voltage-drop dropdown, but `WIRE_PROPERTIES` stops at 500 kcmil. `calculateVoltageDrop` therefore returns 0 V and 0 %, the upsizing loop never runs, and the result reads "0.0 % … meets NEC requirements" (`isCompliant` = true). | R for every listed size from awg.json (`r20_cu_ohm_per_1000ft_derived`, r75, Al EC-H19). Examples: 79 kW, 208 V 1φ, 500 ft gives 750 kcmil "0.00 %". On the code's own basis (20 °C R, at the 475 A it sizes with) the drop is 3.16 %; at 75 °C on the real 379.8 A it is 3.07 %. 400 A, 500 ft, 240 V on 600 kcmil gives 0 %, against 2.88 % from HB100 at 20 °C. | P0 unsafe |
| S2 | `wire-sizing.ts:134` (`getGroundWireSize(amps)` without material), displayed at `CalculatorResult.tsx:92-95` | Every aluminum card shows the copper EGC under an "Aluminum" badge. | T250.122 Al/CCA column. At 125 A the card shows #6 where Al/CCA needs #4; 60 A shows #10 vs #8; 100 A shows #8 vs #6; 150–200 A show #6 vs #4. | P0 unsafe |
| S3 | `wire-sizing.ts:149` | `parseInt(awg) > 8` treats "250"…"1000" as small, so a 200 A garage feeder on 250 kcmil Al gets "Small aluminum conductors not recommended". | Compare by area (awg.json), not by `parseInt`. | P1 |
| S4 | `nec-tables.ts:49-72` | All 21 rows present match verified 310.16 (0 mismatches). It omits 700, 800, 900 and 1250–2000 kcmil, so it picks 750 where 700 suffices and 1000 where 900 suffices, and copper above 545 A returns "No wire size". | Add the missing verified rows. | P2 |
| S5 | `wire-properties.ts:164-218` | 250–500 kcmil Cu and Al resistances are 3.9–4.1 % above the HB100/HB109-derived 20 °C values (250 kcmil Cu 0.0431 vs 0.04148). AWG rows match within rounding. | awg.json derived values. | P2 |
| S6 | `nec-tables.ts:31` (feeds `app/page.tsx:122` and `guides/wire-sizing-guide/GuideClient.tsx:21`) | `dc_resistance_ohms_per_1000ft` is labeled "at 25 °C … (NEC Chapter 9 Table 8)", but the values are 75 °C values (14 AWG 3.07 = 2.52 × (1 + 0.00393 × 55)). | Label "75 °C, calculated from HB100". Do not cite Table 8 (unverified). | P1 |
| S7 | `wire-sizing.ts:172-176` (comment); `nec-tables.ts:135-169` | The comment gives K = 12.9 Cu / 21.2 Al, while the verified constants give 12.61 / 20.77 at 75 °C. `NEC_250_122` (unused) stops at 2000 A and inserts 30/40 A pseudo-rows. `NEC_240_4_D_MAX_OCPD` exists but is never used. | Verified constants; the 6000 A table. | P2 |

## 1. Ground wire: `GroundWireCalculator.tsx` (/calculators/ground-wire-calculator)

**Inputs:** method (OCPD rating or phase conductor size), OCPD 15–6000 A (37 options) or conductor 14 AWG–1000 kcmil, installation type, an "upsized" checkbox with ratio 1–4.
**Outputs:** one copper EGC size, method text, notes, a partial Table 250.122, NEC reference.

| ID | File:line | What it does | Correct (source) | Sev |
|---|---|---|---|---|
| G1 | 88-97, 108-113 | The conductor-size method sizes the EGC from the conductor's 75 °C ampacity, as if OCPD = ampacity. It gives #14 Cu → #12 EGC and #12 Cu → #10 EGC. Wherever the OCPD can legitimately exceed the 75 °C ampacity (240.4(B), Art. 430; both unverified), it undersizes. | T250.122 is indexed by OCPD rating. With 240.4(D) (verified), #14 → 15 A → #14 and #12 → 20 A → #12. | P0 wrong |
| G2 | 119-141, 296-324 | "Upsized" adds `ceil(ratio)` list steps instead of scaling area. Ratio 1.0 (no upsizing) still adds a size (#12 → #8). Ratio 2–4 undersizes: 4/0 at ratio 4 gives code #1/0 (105,600 cmil) where proportional needs 166,960 cmil, i.e. #3/0; 500 kcmil at ratio 4 gives #2/0 where it should be #4/0. The "original ground size" note divides ampacity by the ratio, which means nothing. | 250.122(B) text is unverified, so **remove**. Once sourced: required cmil = EGC cmil × (installed ÷ minimum phase cmil), then the smallest awg.json size at or above it. | P0 unsafe |
| G3 | 345 | "Must be copper unless specifically allowed." | Contradicted by T250.122's Al/CCA column. (Also flagged in the page audit.) | P1 |
| G4 | 163 | "Size based on 75 °C temperature rating." | T250.122 has no temperature basis; this is false in breaker mode. | P1 |
| G5 | 144-155, 158-160 | Notes: "Over 1200 A requires engineering supervision", flexible-cord notes and "400.23". | Unsourced or unverified. Remove. | U |
| G6 | 409-421 | The "NEC Table 250.122 (Partial)" display shows 30 A and 40 A rows the table does not have (it steps 20 → 60), highlights several rows at once, and has no Al/CCA column. | nec-250-122.json rows. | P2 |
| G7 | 85 | Above 6000 A it returns #800. This is unreachable from the UI. | Golden case 6001 A expects "no result". | P2 |

**Golden checks.**
- Breaker mode at OCPD 15, 20, 30, 60, 100, 125, 200, 400 and 6000 returns 14, 12, 10, 10, 8, 6, 6, 3 and 800, all ✓. All 37 options match. 61 A and 6001 A are not selectable.
- Conductor mode on #12 Cu returns #10, where 240.4(D) plus T250.122 give #12 ✗.

**Recommendation: fix now.**
- Replace `GROUNDING_CONDUCTOR_TABLE` with nec-250-122.json (15–6000 A, both columns) and show Cu and Al/CCA.
- Delete the conductor-size method and the upsize block (lines 88-141 and the matching inputs). If a conductor mode is wanted, limit it to 14/12/10 Cu via nec-240-4-d.json (15/20/30 A → 14/12/10).
- Delete the notes at 144-163 and line 345.

## 2. Garage subpanel (/calculators/garage-subpanel-calculator)

**Which file is live:** the page imports `ClientGarageSubpanelCalculator.tsx`, which dynamically imports `GarageSubpanelCalculator` with `ssr:false`, so crawlers see "Loading calculator…". `GarageSubpanelWireSizeCalculator.tsx` is imported nowhere (only `update_layouts.sh` names it). It is dead code. If anyone revives it, its `Object.entries(ampacity)` loop (line 133) enumerates integer-like keys first, so for a 60 A feeder it tests 1 AWG before 14 AWG and returns "1 AWG".

**Inputs:** panel size (60/100/125/150/200 A), load type, installation method, distance, ft², outlets, EV amps, 240 V tool amps.
**Outputs:** "Total Demand" in amps, "Recommended Panel", and Cu and Al feeders via `calculateWireSize(max(panel, load), 240 V, 1φ, 75 °C)` with ampacity, VD %, ground and notes.

| ID | File:line | What it does | Correct (source) | Sev |
|---|---|---|---|---|
| GS1 | 536-545 → S2 | The aluminum card shows the copper EGC. | T250.122 Al/CCA: 60 A #8, 100 A #6, 125–200 A #4. | P0 unsafe |
| GS2 | 50-72, 119-139 | Load calculation: 3/5/7 VA/ft², 180 VA per outlet, and a "continuous load factor" of 0.8–0.9 that *reduces* the load ("per NEC 220.83"). An EV is counted at 85 % of nameplate. | Article 220 is unverified. Remove "Total Demand". | U |
| GS3 | 147-156 | "+25 % per NEC 220.87", and when the requirement exceeds 200 A it returns 200 A. A computed 291 A load gets "Recommended Panel: 200A". | Remove, together with GS2. As written, it recommends a panel smaller than its own computed load. | P0 wrong |
| GS4 | 75-100, 369 vs 165-171 | Displays "Temperature Rating: 90 °C" but sizes from the 75 °C column. | Which column applies (110.14(C)) is unverified. Do not show a rating the sizing doesn't use. | P1 |
| GS5 | → S3 | A 200 A Al feeder (250 kcmil) gets "Small aluminum conductors not recommended". | See S3. | P1 |
| GS6 | 203-206, 549-560 | 225.31 disconnect, 250.32 electrode, "GFCI all 120 V outlets" and "separate neutral/ground" are emitted for every method, including "Attached Garage". | Unverified, and 225/250.32 concern separate buildings. Remove. | U |
| GS7 | 89, 141-144, 516 | Labels a feeder "Overhead (Service Drop)". Results aren't gated on `showResults`: Reset leaves them on screen and they go stale when inputs change. `resultsRef` is never attached. | Fix the label; gate and reset the results. | P2 |

**Golden checks.**
- T250.122 at OCPD 125: the Cu card shows #6 ✓, the Al card shows #6 where #4 is expected ✗.
- 125 A gives 1 AWG Cu (130 A) / 2/0 Al (135 A), consistent with 310.16 at 75 °C (column choice unverified).
- 100 A at 100 ft gives 3 AWG Cu with VD 1.64 % (20 °C, known).

**Recommendation: remove outputs and fix.** Treat the panel rating as the feeder OCPD. Set the EGC from nec-250-122.json using the card's material column. Remove the load-type inputs, "Total Demand", "Recommended Panel" and the code notes. Delete `GarageSubpanelWireSizeCalculator.tsx`.

## 3. Service entrance: `ServiceEntranceCalculator.tsx` (/calculators/service-entrance-calculator)

**Does it compute service size from a load calculation?** No. The user types "Calculated Demand Load (Watts)" ("From load calculation (NEC 220)"), and no Article 220 method is run. The code:
1. computes I = W/V, or W/(1.732·V) for three-phase (236);
2. multiplies by (1 + growth %) (237);
3. picks the first rating in {60…1200} with demand × growth ≤ 80 % of the rating (240-247), an 80 % rule with no source;
4. reads conductors from a hard-coded table (74-87) whose 100–225 A rows equal dwelling Table 310.12, whatever the building type, voltage or phase;
5. reads the "Ground Wire" (a GEC) from a table keyed on service rating (205-211).

**Outputs:** service size, Cu/Al conductors, GEC, neutral, VD, meter base, main breaker, panel spaces, mast, weatherhead, anchoring, cost estimate, utilization, and "NEC Compliance: Compliant".

| ID | File:line | What it does | Correct (source) | Sev |
|---|---|---|---|---|
| SE1 | 240-247 | When no rating fits (demand × growth > 960 A), `recommendedSize` stays at its initial value of 100. 250 kW at 240 V (1,302 A with growth) gets a "100 AMP" service, 4 AWG Cu, "Compliant", utilization 1,042 %. The same happens for 400 kW at 208 V three-phase. | Return "outside the tool's range". | P0 unsafe |
| SE2 | 74-87, 250 | Table 310.12 (dwelling, 83 %) sizes are used for commercial, 208/277/480 V and three-phase services. A commercial 480 V three-phase 50 kW load gets a 100 A service on 4 AWG Cu. | 310.12 applies only to 120/240 V single-phase dwelling services and main feeders (verified note). Under 310.16, 4 AWG Cu is 70/85/95 A, below 100 A in every column. | P0 unsafe |
| SE3 | 81-84 | The 300 A row (350 Cu / 500 Al) and 400 A row (500 Cu / 750 Al) match neither 310.12 (300 A: 250/350; 400 A: 400/600) nor 310.16 at 75 °C for 400 A (500 Cu = 380 A, 750 Al = 385 A). The 800 A row, 2×500 Cu, gives 760 A. | Golden 310.12 400 A expects 400/600; the code gives 500/750 ✗. Values under 400 A at 75 °C depend on 240.4(B) (unverified). | P0 wrong |
| SE4 | 205-211, 259-261, 675 | The GEC is looked up by service rating. Above 400 A there is no row, so it falls back to the 200 A row and returns #4. Also 125 A gives #6 and 225 A gives #2. The result is labeled "Ground Wire". | T250.66 on the code's own conductors: 600 A (2×350 = 700 kcmil) and 800 A (2×500) need #2/0; 1000 A (3×500) and 1200 A (4×500) need #3/0; 125 A (2 Cu) needs #8; 225 A (3/0 Cu) needs #4. Label it "grounding electrode conductor". | P0 unsafe |
| SE5 | 254-256 | VD uses R = 0.05 Ω/kft for every conductor (0.025 if parallel), with ×2 even for three-phase. A 100 A service on 4 AWG Cu, 150 ft, 80 A shows "0.50 % ✓ Acceptable" against 3.02 % from HB100 at 75 °C. A 200 A service on 2/0, 100 ft, 160 A shows 0.67 % vs 1.26 %. | VD from awg.json R; √3 for three-phase. | P0 unsafe |
| SE6 | 335, 867-883 | `nec310_12Compliant: true` is hard-coded, so "Compliant (Table 310.12)" appears for commercial, three-phase and the SE1 fallback. | Remove. | P1 |
| SE7 | 318, 681-686 | "Neutral" shows the aluminum phase size with no material. | Neutral sizing is unverified. Remove. | P1 |
| SE8 | 236-247 | The 80 % rule stacks on top of growth: 32 kW at 240 V (133 A) becomes 225 A, or 200 A at 0 % growth. | No basis in the verified set. | U |
| SE9 | 263-307 | The cost estimate is fabricated (page audit), and the solar and generator add-ons are no-op expressions (`adjustedMaterialCost + 800;`, 284-291). Mast size, "12 ft minimum" weatherhead, anchoring, panel spaces and meter base are all unsourced. | Remove. | U |
| SE10 | 470-495, 236, 324 | Accepts three-phase at 120/277 V (line-to-neutral values). Uses 1.732. Utilization excludes growth. `totalConnectedLoad` = load × 1.25 (not displayed). | Validate inputs. | P2 |

**Golden checks.**
- T310.12 at 100 A gives 4 / 2 ✓, 150 A gives 1 / 2/0 ✓, 200 A gives 2/0 / 4/0 ✓. 400 A gives 500 / 750 where 400 / 600 is expected ✗. 120 A is not reachable.
- T250.66: 2/0 Cu (200 A) gives #4 ✓ and 500 kcmil Cu (400 A) gives #1/0 ✓. 2×350 Cu (600 A) gives #4 where #2/0 is expected ✗.

**Recommendation: withdraw.** The core output, the recommended service size, rests on unverified Article 220/230 rules plus an invented 80 % rule. Replace the tool with a verified lookup:
- **Input:** a 120/240 V single-phase dwelling service rating from the nec-310-12.json rows.
- **Outputs:** Cu and Al conductors from 310.12; the GEC from nec-250-66.json keyed on the chosen conductor (golden table-250-66); and optionally VD from awg.json at 75 °C for a user length and current.
- **Delete everything else.**

If it has to stay up for a few days, apply at minimum: the SE1 guard, disabling commercial and three-phase, the SE4 table fix and the SE5 resistance fix.

## 4. kW → A: `KilowattsToAmpsCalculator.tsx`

**Inputs:** kW, V (120–600), phase, PF, presets.
**Outputs:** load current, "Circuit Amperage (125 %)", "Breaker Size", S, Q, PF rating, current at 120/208/240/480 V, operating cost.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| KW1 | 98-103, 314-331, 411/416 | Shows 125 % "circuit amps", the next "standard" breaker, and a "Circuit Size" column. | 125 % and 240.6(A) are unverified. Remove. | U |
| KW2 | 28 | Preset "Industrial Motor – 10HP" = 7.5 kW input at PF 0.85, giving 10.61 A at 480 V. | 10 hp is shaft output (7.46 kW at 746 W/hp, NIST), so electrical input = 7.46 kW ÷ η; at η = 0.9 that is 8.29 kW and 11.73 A. Motor circuits use FLC tables (unverified). Remove the preset; the HVAC "5 Ton = 6 kW" preset is also unsourced. | P1 |
| KW3 | 425-446 | Cost at $0.12/kWh: monthly = 22 d × 8 h, but annual = 250 d, so monthly × 12 ≠ annual. | Unsourced rate. Remove. | P1 |
| KW4 | 356-392, 251 | PF rated Excellent/Good/Fair/Poor, with "improve efficiency". | Unsourced bands, and PF = P/S is not an efficiency. | P2 |
| KW5 | 12-19, 407-419 | Three-phase at 120/277 V is allowed, and the table computes a "3φ 120 V" current. PF > 1 is not rejected. | Validate inputs. | P2 |

**Golden checks:** 7.2 kW/240 V/1φ gives 30.00 ✓; 50 kW/480 V/3φ/0.9 gives 66.82 ✓ (66.823); 10 kW at 240 V/1φ, 208 V/3φ and 480 V/3φ give 41.67, 27.76 and 12.03 ✓.

**Recommendation: fix now.** Keep I, S and Q. Delete KW1–KW3. Restrict three-phase to line-to-line voltages.

## 5. kVA → A: `kVAToAmpsCalculator.tsx`

**Inputs:** kVA, secondary V (120 V–13.8 kV), phase, PF, transformer flag with primary V, presets.
**Outputs:** current; primary current; "Circuit Amperage" (125 % if transformer); breaker; P; Q; voltage, current and "turns" ratios; current at 4 voltages; PF warning; sizing guidelines.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| KV1 | 114-119, 381-398, 506-526 | Circuit amps and breaker, plus "Primary protection 125 % (NEC 450.3)", "Conductor sizing 125 % (450.3(B))" and "Breaker sizing 125 %". The non-transformer breaker is sized at 100 %, contradicting its own guideline. | Unverified. Remove. | U |
| KV2 | 440-445 | "Turns Ratio" = primary ÷ secondary line voltage. | This holds only for like-connected windings. For 480 Δ → 208Y/120 the voltage ratio is 2.31 but the turns ratio is 4.0. Remove it or label it "line-to-line voltage ratio". | P1 |
| KV3 | 146-149, 345, 323 | Reset doesn't reset inputs, `resultsRef` isn't attached, three-phase at 120/277 V is allowed, and "Service Entrance: 100, 200, 400 kVA" appears (services are rated in amperes). | Polish. | P2 |

**Golden checks:** 75 kVA at 208 V/3φ gives 208.18 ✓; 75 kVA at 480 V gives 90.21 ✓; 25 kVA at 240 V/1φ gives 104.17 ✓. P = S·PF and Q = S·sin(acos PF) are ✓.

**Recommendation: fix now.** Keep current, primary current, P and Q. Delete KV1 and fix KV2.

## 6. Watts → A: `WattsToAmpsCalculator.tsx`

**Inputs:** W, V (120–480), phase, PF, distance (0–500 ft).
**Outputs:** current; "Wire sized for X A (125 % continuous load)"; and Cu and Al results from `calculateWireSize(ceil(1.25 × I))`, meaning the smallest 75 °C size at or above 1.25 × I, upsized until VD ≤ 3 % on 20 °C R, with ampacity, VD %, EGC (from that amp value, copper column on both cards) and a compliance colour.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| WA1 | 38, 199-203 | Applies 125 % to every load. | Unverified rule. | U |
| WA2 | 38 → `wire-sizing.ts:98-105` | VD is computed at 1.25 × the load current. For 4500 W/240 V it uses 24 A and shows 1.59 % where 18.75 A gives 1.24 % on the same table. | VD = I·R uses the real current (physics). | P0 wrong |
| WA3 | → S1 | Wires of 600–1000 kcmil show VD 0.00 % and "meets NEC". 79 kW at 208 V/1φ over 500 ft gives 750 kcmil at "0 %" against 3.16 % on the code's own basis (3.07 % at 75 °C on load current). | See S1. | P0 unsafe |
| WA4 | 242-251 → S2 | The aluminum card shows the copper EGC. | See S2. | P0 unsafe |
| WA5 | 201 vs 38; error path | Shows "23.4 A" but sizes for 24 A. Above 545 A Cu it renders "#N/A AWG", "0A" and a green "0.00 %". Three-phase at 277 V is allowed. | Polish. | P2 |

**Golden checks:** 4500 W/240 V gives 18.75 A ✓. The wire then comes out as 12 AWG Cu "rated 25A" with VD 1.59 % and EGC #10; 240.4(D) caps 12 AWG at 20 A, which gives EGC #12 (this reproduces the known items). 10 kW at 208 V/3φ gives 27.76 ✓.

**Recommendation: remove the wire-size output** (lines 36-49 and 206-254) until the shared engine is rebuilt with the ampacity column, 240.4(D), EGC by OCPD and material, VD on load current at 75 °C, and the full size range. Keep the conversion.

## 7. Amps → W: `AmpsToWattsCalculator.tsx`

**Inputs:** A; V (12/24/48 DC, 120–600 AC, custom); AC/DC; phase; PF; h/day; $/kWh.
**Outputs:** W, kW, VA, kVA, hp, a PF % / "DC Efficiency" card, the formula, energy cost, and a PF-improvement tip.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| AW1 | 94, 381-401 | The DC card shows "DC Efficiency 100.0 %", which is not computed. The AC card colours PF as if it were an efficiency. | Remove the DC card; label PF as "PF = P/S". | P1 |
| AW2 | 83-84, 374-379 | "Mechanical Power … HP @ 100 % efficiency" = W/746. The comment calls 746 W "mechanical horsepower". | This is electrical power expressed in electric hp (746 W, NIST). Mechanical hp is 745.6999 W. Relabel. | P2 |
| AW3 | 31-39 | Typical-PF presets ("0.90 LED", "0.60 welding"). | Unsourced. | P2 |

**Golden checks:** 50 A, 3φ, 480 V, PF 0.92 gives 38,243.68 W ✓ (38,243.7). The PF tip for 0.80 → 0.95 gives 15.79 % ✓ (golden pf-correction).

**Recommendation: fix now** (AW1–AW3 are label changes only).

## 8. Volts → A: `VoltsToAmpsCalculator.tsx`

**Inputs:** V, W, phase, load type (resistive fixes PF at 1.0, inductive fixes it at 0.85, mixed makes it editable).
**Outputs:** current = P/(V·PF) (or with √3), S, Q, a PF label, "Breaker Size", energy cost, and a 120/240/480 V comparison table.

**Is it I = V/R?** No. There is no resistance input; the tool is a duplicate of watts → amps. The page metadata promises it anyway: `app/calculators/volts-to-amps-calculator/page.tsx:11` says "Convert voltage and resistance to amps via Ohm's Law (I = V/R)", and lines 15 and 28 say the same.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| VA1 | page.tsx:11,15,28 vs 56-85 | The description promises I = V/R; the tool computes P/(V·PF). | Add an I = V/R mode or change the description. Best: merge with watts→amps and Ohm's law. | P1 |
| VA2 | 360-374 | The 120 V and 240 V table rows always use the single-phase formula; only the 480 V row applies √3. With three-phase at 240 V and 10 kW, the highlighted 240 V row says 41.7 A while the headline says 24.06 A. | Apply the selected phase's formula to every row. | P0 wrong |
| VA3 | 316-317 | "Breaker Size: ceil(1.25·I) A", which produces non-ratings such as "7A". | 125 % and 240.6(A) are unverified. Remove. | U |
| VA4 | 42-54, 194-205 | Inductive loads get PF 0.85 with no way to change it. | The headline current rests on a hidden, unsourced assumption. Show the PF input for every load type. | P1 |
| VA5 | 303, 324-345, 99-102 | 0.85 is labeled "Poor" while the guide calls 0.8–0.9 typical. Cost uses a fixed $0.12/kWh × 8 h × 30 d. Reset does nothing to the inputs. | Remove or fix. | P2 |

**Golden checks:** 4500 W/240 V gives 18.75 ✓; 7.2 kW/240 V gives 30.00 ✓; 10 kW/208 V/3φ gives 27.76 ✓.

**Recommendation: fix now** (VA2, VA4, delete VA3/VA5, fix the description), or withdraw and 308-redirect to watts → amps.

## 9. Ohm's law: `OhmsLawCalculator.tsx`

**Inputs:** the target quantity plus any two of V, I, R, P.
**Outputs:** V, I, R, P, plus kW, mA, kΩ, conductance and an energy cost.

All 12 branches (45-101) are correct: V = IR and P = VI = I²R = V²/R.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| OL1 | 104-109, 337, 345 | Rounds to 3 decimals in base units. 12 V / 10 kΩ shows 1.0 mA (true 1.2 mA, −17 %). 5 V / 47 kΩ shows 0 A and "0.0 mA". Conductance uses the rounded R, so R < 0.0005 Ω gives "Infinity". | Keep raw values and format to 4 significant figures. | P0 wrong |
| OL2 | 44-101 | A third entered value is silently overwritten. | Warn when the inputs are over-determined. | P2 |
| OL3 | 253 | The JSX text renders "Ohm\'s Law Formulas" with a visible backslash. | Fix the typo. | P2 |
| OL4 | 350-361 | Energy cost at 24 h/day and $0.12/kWh. | Unsourced. Remove. | P1 |

**Golden checks (physics):** 12 V / 4 Ω gives 3 A and 36 W ✓; 5 V / 220 Ω gives 23.0 mA (true 22.73) ✗ in the third digit.

**Recommendation: fix now.**

## 10. BTU → W: `BTUToWattsCalculator.tsx`

**Inputs:** BTU value and time unit, efficiency % (0–400), V, phase, PF, $/kWh, presets.
**Outputs:** "Electrical Power Required" (thermal ÷ efficiency), BTU/h, cooling tons, thermal W, current, "Circuit Size (125 %)", 24 h/day costs, an equipment table and efficiency text.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| BT1 | 18-29, 102, 112-115, 267 | Furnace and boiler presets, with the hint "Furnaces 80–98 %". A 60,000 Btu/h furnace at 80 % shows "Electrical Power Required 21.98 kW" and "Current Draw 96.4 A" at 240 V. | Output ÷ combustion efficiency is fuel input, not electrical draw. Delete the combustion presets and allow only electric resistance (100 %) or a user-entered COP. | P0 wrong |
| BT2 | 19-23, 61 | The AC and heat-pump presets keep the default efficiency of 100 %. A 12,000 Btu/h window AC shows 3.52 kW and 15.4 A. | At EER 10 (the site's own FAQ example) the input is 1.20 kW and 5.3 A. | P0 wrong |
| BT3 | 450-491 | The comparison table has an unlabeled "kW" column beside an "Electrical Power Required" headline. The furnace row reads 60–80k Btu/h = "20–25 kW". | Thermal 17.6–23.4 kW (0.2930711 W per Btu/h, NIST). Label it thermal or delete it. | P1 |
| BT4 | 406-409 | "Circuit Size (125 %)". | Unverified. Remove. | U |
| BT5 | 99, 389, 147-150 | Uses the factor 0.293071. Shows "cooling tons" for heaters, "Combustion Equipment" text at 100 %, and 24 h/day costs. Reset does nothing. | 0.2930711. Polish. | P2 |

**Golden checks:**
- 12,000 Btu/h gives an engine value of 3,516.852 W against golden 3,516.853 (tolerance 0.001; off by 0.0012). The displayed 3,517 W is fine. 1 ton is the same.
- The tool cannot convert W → Btu/h (golden 1000 W = 3,412.14).

**Recommendation: fix now.** Make it a thermal conversion only: W ↔ Btu/h with 0.2930711, tons = Btu/h ÷ 12,000. Remove electrical power, current, circuit size, costs, presets and the table, or compute electrical input only when the user enters a COP or EER.

## 11. Three-phase: `ThreePhaseCalculator.tsx` (+ page tables)

**Inputs:** system (208Y/120, 240Δ high-leg, 480Y/277, 480Δ, 600Y/347), connection, load balance (×1.00/1.05/1.15/1.25), mode (kW / A / motor hp with η and PF), PF, distance, neutral.
**Outputs:** line current, "neutral current", "Actual Power", and Cu and Al wire via `calculateWireSize(max(line, neutral), mapped V, 3φ)`.

Motor current is computed by formula, I = hp·746 / (√3·V·η·PF), at line 169. That is a valid physics estimate, but NEC conductor sizing uses table FLC (430.6, T430.250, unverified), so motor-mode wire sizing is U. The default 75 hp at 208 V gives 203.0 A.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| TP1 | 220 | VD % is computed against 240 V for 208 V systems and against 480 V for 600 V systems. A 208Y/120 system at 30 kW, PF 0.85, 300 ft picks 1 AWG and shows 2.63 %; on 208 V the same wire is 3.03 %, and with the right voltage the code would pick 1/0. | Pass `voltageSystem.line_voltage`. | P0 unsafe |
| TP2 | 60-85, 174, 201-207 | The line current is multiplied by 1.05/1.15/1.25, and "Actual Power" is recomputed from the inflated current: a 50 kW input reads 52.51 / 57.51 / 62.51 kW. | Invented factors that contradict the input. Remove. | P0 wrong |
| TP3 | 185-198 | Neutral current = I × (factor − 1) × 0.5 ("Severely unbalanced" gives 10.45 A on an 83.5 A line). | Not a phasor sum; the real neutral current can be far higher. Remove. | P0 wrong |
| TP4 | → S1 | 300 kW, 480 V, PF 0.85, 2000 ft gives 750 kcmil at "0.00 %". | 4.24 % at 20 °C and 5.15 % at 75 °C (HB100). | P0 unsafe |
| TP5 | 635-644 → S2 | The aluminum card shows the copper EGC. | See S2. | P0 unsafe |
| TP6 | 167-170, 209-226 | Motor-mode current feeds conductor sizing with no FLC table and no 125 %. | Remove wire sizing in motor mode. | U |
| TP7 | 88-110 vs 16-57, 571-574, 176 | The system and connection selectors are independent, so "480Δ + Wye" and "208Y + High-Leg Delta" are possible. "NEC 220.22: Neutral conductor sizing" is unverified. `ceil` rounding gives 66.83 vs 66.823. | Validate inputs; drop the citation. | P1 |

**Page tables** (static; also in the 19 Oct page audit):

| ID | page.tsx line | Page says | Correct |
|---|---|---|---|
| TPp1 | 219-248 | PF correction to 0.95 per 100 kW: 0.70 → 51.4 kVAR, 35.7 %; 0.80 → 32.9, 18.8 %; 0.85 → 22.3, 11.8 %; 0.90 → 11.0, 5.6 %. | Qc = P(tan φ1 − tan φ2) and ΔI = 1 − PF1/PF2 give 69.15 / 26.32 %, **42.13 / 15.79 %** (golden), 29.11 / 10.53 % and 15.56 / 5.26 %. The page's "improvement" column is 0.95/PF − 1, which is inverted. **P0 wrong.** |
| TPp2 | 119-174 | Motor guide. Every 208 V current is 3.45–3.48× the 460 V one, e.g. 33.4 A vs 9.6 A. Wire sizes state no voltage: 10 hp on 12 AWG fails at 208 V (33.4 A vs 12 AWG Cu at 25 A, 75 °C); 50 hp on 6 AWG gives 167 A at 208 V. | Same power means current ∝ 1/V, so the ratio must be 460/208 = 2.21. **P0 unsafe.** Delete the table (FLC tables are unverified). |
| TPp3 | 176-217 | Transformer guide secondary currents. | Off by up to 0.5 A (225 kVA: 624.5, page 625.0; 112.5 kVA: 312.3, page 312.5). P2. |

**Golden checks:** 10 kW at 208 V and 480 V give 27.76 and 12.03 ✓. 50 kW at 480 V, PF 0.9 gives 66.83 (ceil; true 66.823). PF 0.80 → 0.95 gives 42.13 kVAR and 15.79 % where the page has 32.9 / 18.8 ✗.

**Recommendation: remove outputs.**
- Remove wire sizing (all modes), neutral current, load balance and "Actual Power".
- Keep a balanced three-phase P ↔ I converter on line-to-line voltage.
- If wire sizing is kept, apply TP1 first.
- Recompute TPp1 from the formulas, delete TPp2, and recompute TPp3.

## 12. Low voltage: `LowVoltageCalculator.tsx`

**Inputs:** system (12/24 VDC, 24/12 VAC, 48 VDC PoE, "Audio/Video 75Ω"), load type and count or a manual current, distance, max VD %.
**Outputs:** recommended AWG (22–10), VD %, voltage at load, resistance, "current capacity", and COMPLIANT / NON-COMPLIANT.

**Actual formula:** VD = 2·I·R(Ω/kft)·L/1000 at line 190. Resistivity is included through the per-gauge 20 °C resistance, so the component is correct physics. It is the page text "CM = I × L / VD" that omits resistivity.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| LV1 | 80-88, 201-208 | The gauge list stops at 10 AWG. When nothing passes, the fallback "recommends" 10 AWG without the current filter. 30 A over 5 ft at 12 V gives "Recommended 10 AWG", VD 2.5 %, **COMPLIANT**, while its own line says "Current Capacity 15A". The manual input allows up to 50 A on the same path, which exceeds the verified 240.4(D) 30 A limit for 10 AWG Cu. | Golden dc-sizing (12 V, 400 W, 40 ft, 2 %; 33.3 A) expects 140,141 cmil, 3/0, at 75 °C or 115,233 cmil, 2/0, at 20 °C. The code gives 10 AWG at 22.23 % ✗. | P0 unsafe |
| LV2 | 145-148 defaults | At default inputs (8 × 0.25 A, 100 ft, 12 V, 3 %) the headline is "Recommended Wire: 10 AWG" at 3.34 % (NON-COMPLIANT). | 11,523 cmil is needed: 9 AWG (13,090 cmil) on the full HB100 list, or 8 AWG if only even sizes are offered. | P0 wrong |
| LV3 | 80-88, 180-186 | "Max amps" doubles at 24 V (22 AWG: 0.92 A vs 1.84 A) and is used as a hard filter. The 12 V column is a 700 cmil/A rule of thumb. | A conductor's current limit is thermal and does not depend on system voltage. Unsourced. Remove. | P1 |
| LV4 | 157-161 | 48 V PoE uses the 24 V current per load (a 12 W camera at 0.5 A). | 12 W ÷ 48 V = 0.25 A. Compute I = W/V. | P0 wrong |
| LV5 | 282-320, 340, 370, 515-518, 591-596, 48-66 | "COMPLIANT" only means VD ≤ the user's limit. Further claims: "Class 2 limited to 100VA per NEC 725", "725.121/725.136", "PoE 802.3at" at 90 W, and "Landscape 300 W (Class 2)", which contradicts its own 100 VA. The 20 °C basis is unlabeled. | Unverified or self-contradictory. Remove; label the temperature. | P1 |
| LV6 | 91-140, 67-76 | Per-load wattages (irrigation valve 20 W) and an "Audio/Video 75Ω" system at 12 V DC. | Unsourced. | P2 |

**Recommendation: fix now.**
1. Replace `LOW_VOLTAGE_WIRE_GAUGES` with awg.json (40 AWG to 0000 and the kcmil rows).
2. Compute CM_req = 2·K·I·L/VD with K = 10.371·(1 + 0.00393(T − 20)) and a stated T (golden cases at 20 °C and 75 °C), and pick the smallest area at or above CM_req.
3. Use I = W/V per load.
4. Delete the "max amps" filter, the fallback, the compliance badge and the code claims.

## 13. Voltage drop: `VoltageDropCalculator.tsx`

**Inputs:** wire size (14 AWG–1000 kcmil from `NEC_310_16`), A, distance (0–500 ft), V (1–1000), phase.
**Outputs:** Cu and Al VD in V and %, end voltage, "Power Loss", a visual, and a material comparison.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| VD1 | 16-19 → S1 | 600, 750 and 1000 kcmil can be selected but have no R. The headline reads "0.00 % (0.0V drop) ✓ Within NEC 3 % recommendation" at any current or distance (400 A, 500 ft, 240 V on 600 kcmil should be 2.88 % at 20 °C). The comparison then prints "NaN %". | Add R for these sizes from awg.json. | P0 unsafe |
| VD2 | 229-232, 281-284 | "Power Loss" = VD × I. For three-phase that is √3·I²RL instead of 3·I²RL: 4 AWG, 60 A, 150 ft shows 233 W against 403 W on the same R (42 % low). | 3·I²·R·L/1000 for three-phase; 2·I²·R·L/1000 for single-phase. | P0 wrong |
| VD3 | 307 | "Aluminum has approximately 61 % higher resistance than copper." | 17.002/10.371 = 1.639, about 64 % higher; 61 % is EC-H19's IACS conductivity. The dynamic figure printed beside it already says 64 %. | P1 |
| VD4 | 49-50 | 14 AWG aluminum is offered. | 310.16 has no 14 AWG Al row. | P2 |

**Golden checks** (all six voltage-drop cases run through the code reproduce the known 20 °C understatement, about 18 % low):
- 3/0 Cu, 200 A, 100 ft, 240 V gives 2.47 V / 1.03 % where 3.007 V / 1.253 % is expected.
- 12 Cu, 16 A, 50 ft, 120 V gives 2.54 V / 2.12 % where 3.094 V / 2.578 % is expected.
- 4 Cu, 60 A, 150 ft, 480 V, 3φ gives 3.88 V / 0.81 % where 4.711 V / 0.981 % is expected.
- 750 kcmil returns 0 % in every case (new, VD1).

**Recommendation: fix now.** Use 75 °C R (awg.json r75, Cu and Al) for every option, extended to 2000 kcmil. Fix VD2 and VD3. Drop 14 AWG Al.

## 14. Wire resistance: `WireResistanceCalculator.tsx` (beyond `TEMPERATURE_FACTORS`)

**Inputs:** mode (resistance / wire size from VD / distance from resistance / power loss), size (14–500), material, circuit type (DC and 1φ ×2, 3φ ×√3), distance, °F, current, voltage, max VD, max R.
**Outputs:** loop resistance, VD, power loss, recommended wire, max distance, efficiency.

**Aluminum values.** Base Al resistances are within 0.4 % of HB109 EC-H19-derived values for AWG sizes; 250 kcmil is +1.5 % (0.069 vs 0.06801). The Al temperature factors belong to the known-wrong table; the correct α is 0.00403.

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| WR1 | 156-168 | "Wire Size from Voltage Drop" ignores ampacity. 100 A over 10 ft at 240 V and 3 % gives "Recommended Wire 14 AWG". | 310.16: 14 AWG Cu is 15/20/25 A; 240.4(D): 15 A. Add a verified ampacity floor or relabel the result "VD-only minimum, check ampacity". | P0 unsafe |
| WR2 | 80-84, 144-153, 192, 225 | For three-phase, "resistance" = √3·R·L and loss = I²·√3·R·L: 4 AWG, 60 A, 150 ft gives 233 W where it should be 403 W. | Report per-conductor R; loss = 3·I²·R·L. | P0 wrong |
| WR3 | 56-61, 72-76, 185-198, 221-231, 546-551, 583-588 | Hidden inputs. "Resistance" mode shows a VD % from a current (20 A) and voltage (240 V) it doesn't display. "Power Loss" mode computes VD % and "Efficiency" against a hidden 240 V: 12 AWG, 20 A, 100 ft DC shows 97.4 %, where at 12 V it is 47.1 %. | Show the inputs in each mode or don't compute those outputs. | P0 wrong |
| WR4 | 183-233, 627-661 | Values from a previous mode persist (e.g. "Distance from Resistance" shows 127 W loss and "Significant power loss"). | Clear results per mode. | P1 |
| WR5 | 360-363, 559, 603, 167 | Labels such as "250 AWG" and "500 AWG". When nothing meets the VD target it silently returns 500 kcmil. | Use kcmil labels; state the failure. | P1 |
| WR6 | 16-35 | Two-significant-figure kcmil values. Small diameter errors (1/0 325.0 vs 324.9, 2/0 365.0 vs 364.8, 350 591.2 vs 591.6). 4/0 Al 0.080 vs 0.08035 fails the golden tolerance of 1e-5. | awg.json values. | P2 |

**Golden checks.**
- 14, 12, 10, 6 and 3/0 Cu at 75 °C give 3.497, 2.199, 1.384, 0.547 and 0.0859 against 3.0647, 1.9337, 1.2147, 0.4806 and 0.0752 (+14 %, caused by the known factor table).
- 500 kcmil Al at 20 °C gives 0.034 ✓ (golden 0.034004). The live 0.206 comes from page.tsx:251, not the component.
- 4/0 Al at 75 °C gives 0.1116 against 0.09816.

**Recommendation: fix now.**
- Use R(T) = (K/cmil)·1000·(1 + α(T − 20)) with K and α for Cu (10.371 / 0.00393) and Al (17.002 / 0.00403) and cmil from awg.json. This also replaces the known factor table.
- Apply the WR1–WR5 changes.

## 15. `CalculatorResult.tsx` and visualizations

| ID | File:line | What it does | Correct | Sev |
|---|---|---|---|---|
| CR1 | `CalculatorResult.tsx:92-95` (+S2) | "Ground Wire" under an "Aluminum" badge shows the copper EGC. | Select the size by material and say which material. | P0 unsafe |
| CR2 | `CalculatorResult.tsx:26-55,80-90` | Titles "Recommended / With Caution / Not Recommended" keyed to 3 %/5 %, and the 75 °C ampacity with no 240.4(D). | Known items; fix with the engine. | (known) |
| CR3 | `CalculatorResult.tsx:70,81,89` | Error results render "#N/A AWG", "0A" and a green "0.00 %". | Render an error state. | P2 |
| WV1 | `WireVisualization.tsx:5-24,41,131,137` | Sizes outside the map (600/750/1000 kcmil, "N/A") fall back to "5.00 mm". kcmil shows as "#250 AWG". `toFixed(2)` gives false precision (4/0 "11.70" vs 11.684 mm; 500 "18.00" vs 17.96). | d = √cmil mils × 0.0254 from awg.json; kcmil labels. | P1 |
| VDV1 | `VoltageDropVisual.tsx:180-182` | A second copy of "within NEC 3 % recommendation / within 5 % limit". | Same fix as the known wording item, in both places. | (known wording, separate copy) |
| WC1 | `WireComparison.tsx:50` | "Aluminum wire must be larger than copper for the same ampacity." | Consistent with 310.16. OK. | — |
| WSS | `WireSizeScale.tsx` | Unused (exported only); lacks 3, 1 and 3/0. | Delete. | P2 |

**Recommendation: fix now** (CR1, WV1, CR3).

## 16. `src/data/calculator-faqs.ts` (FAQPage JSON-LD, not rendered on any page)

**Where each key goes:** `CombinedSchema` on 30 pages. No page renders `calculatorFAQs`, so every page's FAQPage schema describes content users can't see. Google requires FAQ markup to match visible content (P1, all 30 pages).

| Key | Pages |
|---|---|
| wire-size, voltage-drop, ampacity, motor-circuit | No page (those pages use local arrays) |
| electrical-load | electrical-load, **well-pump**, **air-conditioner**; the last two carry off-topic residential-load FAQs (P1) |
| ev-charger | ev-charger, ev-charger-wire-size |
| hot-tub | hot-tub, hot-tub-wire-size |
| Every other key | Its own page |

**Claims that contradict the verified data or the physics:**

| ID | Line | Feeds | Claim | Correct | Sev |
|---|---|---|---|---|---|
| F1 | 9 | (no page) | 12 AWG, 100 ft, 20 A, 120 V: "You would need 10 AWG to stay under 3 %". | 10 AWG is 4.05 % at 75 °C and 3.33 % at 20 °C. 8 AWG is needed (2.55 % at 75 °C). | P0 (dead key) |
| F2 | 21 | (no page) | 10 AWG Cu "30 A at 75 °C … 35 A at 90 °C". | 310.16: 30 / **35** / **40** A (60/75/90 °C). | P0 (dead key) |
| F3 | 75 | watts-to-amps | "Power factor represents how efficiently electrical power is used." | PF = P/S, the ratio of real to apparent power, not an efficiency. | P1 |
| F4 | 93 | amps-to-watts | 20 × 480 × 1.732 × 0.9 = "14,956 W". | 14,964.5 W (14,964.9 with √3). | P1 |
| F5 | 101 | amps-to-watts | "Input watts = FLA × V × PF ÷ Efficiency … 2,267 W". | Electrical input = V·I·PF = 2,040 W; shaft output = 2,040 × 0.90 = 1,836 W. | P0 |
| F6 | 167 | ground-wire | "No, EGCs are not upsized for voltage drop … However … must be proportionally increased per 250.122(B)." | Contradicts itself (the rule text is unverified). | P1 |
| F7 | 181 | circuit-breaker | "up to 800 % (11 times) FLA". | 800 % is 8×. | P1 |
| F8 | 189 | circuit-breaker | "14 AWG wire is only rated for 15 A." | 310.16 ampacity is 15/20/25 A; 15 A is the 240.4(D) OCPD limit. The conclusion is right, the statement is wrong. | P1 |
| F9 | 203 | three-phase | 480 × 30 × 1.732 × 0.85 = "21,207 W". | 21,199.7 W (21,200.3 with √3). | P1 |
| F10 | 211 | three-phase | "Output HP = (kW × 0.746) × efficiency." | hp = kW ÷ 0.746 (NIST 746 W/hp). 70.7 kW at 90 % is 85.3 hp, not 47.5. | P0 |
| F11 | 263 | electrical-load, well-pump, air-conditioner | "83 % rule … apply 83 % factor per NEC 220.83 … if calculated load exceeds 100 A." | Verified 310.12: the 83 % is a conductor-ampacity allowance for 120/240 V dwelling services and main feeders (Table 310.12), not a load-calculation factor. | P0 |
| F12 | 515 | btu-to-watts | "Efficiency = BTU output ÷ watts input × 3.412." | COP = (Btu/h ÷ W) ÷ 3.412. EER 10 is COP 2.93; the FAQ's formula gives 34.1. | P1 |
| F13 | 527 | btu-to-watts | "SEER 16 uses 23 % less power than SEER 13." | 1 − 13/16 = 18.75 % less. 23 % is the inverted ratio. | P1 |
| F14 | 585 | wire-resistance | "Wire at 75 °C has 20 % higher resistance than at 20 °C." | 0.00393 × 55 = 21.6 % for Cu (22.2 % for Al). | P2 |
| F15 | 599 | low-voltage | 100 W (8.3 A), 100 ft, 12 V, 10 %: "Typically need 10 AWG." | 10 AWG gives 13.9 % at 20 °C. 14,404 cmil is needed, i.e. 8 AWG. | P0 |
| F16 | 615 | low-voltage | 5 A, 200 ft, 10 %: "12 V needs 10 AWG, 24 V needs 14 AWG." | 12 V: 10 AWG gives 16.7 %; 17,285 cmil is needed (7 AWG; 6 AWG in building sizes). 24 V: 14 AWG gives 21.0 %; 8,642 cmil is needed, i.e. 10 AWG. | P0 |
| F17 | 637 | service-entrance | 200 A service: "4 AWG copper to ground rod, 2 AWG if connecting to water pipe." | T250.66 for 2/0 Cu or 4/0 Al service conductors gives #4 Cu, with no larger size for water pipe. | P0 wrong |
| F18 | 131 | ohms-law | LED: P = 0.02² × 470 = 0.188 W. | With 470 Ω, I = 19.15 mA and P = 0.172 W (inconsistent but conservative). | P2 |
| F19 | 31 | (no page) | "12 AWG at 20 A has 3.96 V drop per 100 feet." | That is 100 ft of one conductor at 1.98 Ω/kft (a Table 8 value, unverified). A 100 ft circuit is 7.7 V at 75 °C. Ambiguous. | P2 |

**Checked and consistent with the verified data:** 20 A → 12 Cu / 10 Al; derating bands 80/70/50 %; 90 °C at 40 °C → 0.91; 100 A EGC 8 Cu / 6 Al; 200 A EGC 6 Cu; 60 A EGC 10 Cu; 200 A service 2/0 Cu / 4/0 Al; 100 A GEC #8; 400 A GEC #1/0; every "6 Cu / 4 Al for 50–60 A", "8 Cu / 6 Al for 40 A" and "10 Cu / 8 Al for 30 A" pairing; all kW, kVA, W, A and Ohm's-law arithmetic not listed above; 3 gauges double the resistance (2.005); α 0.00393 / 0.00403.

**Rely on unverified rules** (remove until sourced; several are probably wrong):
- 210.19 / 125 % continuous loads (57, 87, 185, 259)
- motor 250 % / 115 % / 125 % / 400 % (181, 229, 233, 241)
- Art. 220 demand factors (247, 251, 629, 643, 647)
- 220.55 range values (379, 383)
- conduit-fill percentages and Table 4 areas (65, 137-153). The 0.213 in² and 0.122 in² look like 40 %-column values reused as total area.
- box fill (555-571)
- 680.x hot tub and pool rules (291-303, 317)
- 625.43 "within sight" (281)
- 551.73 (439)
- 300.5 depths (409, 611)
- 250.32 "connect to neutral bus" at a detached building (417; high risk)
- T430.250 "5 hp 480 V = 6.1 A" (489)
- motor code letters as "× FLA" (545; Table 430.7(B) is kVA per hp)
- SEER minimums (527)

**Recommendation: fix now.** Correct F3–F17 with the values above or delete those entries. Delete the four unused keys. Point well-pump and air-conditioner at their own FAQ sets (or none). Either render each page's FAQ set visibly or remove FAQPage from `CombinedSchema`.
