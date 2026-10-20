# wiresizes.com — raw findings log (pre-verification)
Legend: [X] wrong vs code/physics (verify vs primary) · [F] fabricated/unsourced · [I] internal contradiction · [N] wrong NEC section number/edition · [B] bug · [OK] checked correct

## Site-wide (every page)
- [F] "Trusted by 50,000+ Electricians", "Used in 50+ Countries", "used by licensed electricians", "Trusted worldwide", "Professional Grade", "Industry Standard", "NEC 2023 Compliant"/"NEC Code Compliant" badges in header/footer/meta.
- No named author anywhere; meta author = "WireSizes.com". No published/updated/reviewed dates; only "© 2026".
- Canonical + sitemap = apex https://wiresizes.com ; www also serves 200 (no redirect seen by fetcher). Bing has both hosts indexed.
- Generic "authority links" block (NFPA homepage, UL news, copper.org, aluminum.org, IAEI, NECA homepages) — homepage links, not deep links to the claim.
- Emoji in H2s on homepage.
- sitemap lastmod all 2026-05-08..13 (bulk).

## / (homepage)
- [X] "310.16 Copper (75°C)" table, Breaker column: 8→40A, 6→50A, 4→70A, 3→90A, 2→100A, 1/0→125A, 2/0→150A, 3/0→175A, 4/0→200A — not derivable from the 75°C ampacity shown (8 AWG 50A, 6 AWG 65A …).
- [OK] CM column; Ω/kft column matches NEC Ch9 T8 75°C (solid for 14–8, stranded 6+), but unlabeled solid/stranded.
- [X] Voltage Drop Limits: "Feeder 5% (NEC 215.2)" — IN says feeder 3%, total 5%; both are informational notes, not limits.
- [X] "Continuous loads: not to exceed 90% of ampacity" (NEC: 125% / 80%).
- [X] Equipment table: water heater 4.5 kW → 25A breaker + 12 AWG (12 AWG Cu max 20A per 240.4(D)); Central AC 3 ton = 7.2 kW/35A/8 AWG (fabricated); hot tub 30–40A, 8–10 AWG (contradicts 50A elsewhere).
- [X] "100A subpanel: 4 AWG copper up to 60 ft" (4 AWG Cu 85A; 310.12 only for dwelling service/main feeder).
- [X] Example 1 VD 1.85% (computes 1.54% @240V); Example 2 "VD 11.2%" = 11.19 VOLTS printed as percent (4.66% @240V).
- [X] Visual wire diameters "14 AWG 12mm … 4 AWG 32mm" nonsense.
- [F] "Poor workmanship causes 60% of electrical failures"; "Voltage below 97% causes inefficient operation".
- [X/YMYL] Arc-flash PPE by voltage (120–240V glasses+leather gloves; 480–600V Cat 1; >600V Cat 2+) — not how NFPA 70E assigns PPE.
- [OK] Motor FLC single-phase 1/4–2 hp matches T430.248 (verify).
- [OK?] GEC table 100/125/150/200A vs 310.12 sizes consistent with T250.66 (verify).
- [?] Regional section (CA Title 24, TX, NYC) and "NEC evolution 2017→2020→2023" — omits 2026 NEC; verify each claim.
- [I] Service table 150A: 1/0 Cu (310.12 = 1 AWG Cu).

## /guides/awg-wire-size-chart (Bing #1 page: 222,588 impr, 4,248 clicks)
- [OK] Diameters/areas 18–4/0 match AWG formula; Cu/Al 75°C ampacity columns match T310.16.
- [X] Resistance column unlabeled — values are 20 °C solid annealed Cu (NIST HB100), not 75 °C (NEC T8). Must label temperature + solid.
- [I] 12 AWG 2.052 vs 2.053 mm; 6 AWG 4.115 vs 4.116 mm; 4/0 area 107.00 vs 107.2.
- [F] Wire cost table ($/ft, "approximate 2024 market averages", no source).
- [X] "Stranded required above 8 AWG" (310.3(C): 8 AWG and larger in raceways).
- [X] "Solid required for fixed wiring 14–10 AWG (334.10)" — 334.10 is NM uses permitted; no solid requirement.
- [X] "R20 = 1.588 (NEC Ch9 T8)" — T8 is 75 °C; 1.588 is the 20 °C NIST value.
- [X] Heat-balance "derivation" of 25 A — not how T310.16 is derived (Neher-McGrath, 310.14(B)); pseudo-derivation.
- [X] Application list: "Range 50A → 6 AWG", "Sub panel 100A → 2 AWG", "Service 200A → 3/0" unqualified (conductor type/310.12 ambiguity).
- Gap: table stops at 18 AWG; queries exist for 20–40 AWG diameters (20/22/24/26/28/30 awg diameter) and 250–2000 kcmil.
- [F] Quick ref "6 AWG → 60A circuits, EV chargers" (depends on cable type: NM-B 6 AWG = 55A).

## /guides/nec-table-310-16 (26,196 impr, 1,512 clicks)
- [OK] T310.16 rows shown match; but omits 700, 800, 900, 1250–2000 kcmil rows while titled "Complete".
- [OK] Ambient correction (to 56–60 °C) and bundling factors match; ambient table truncated (61–85 °C rows missing), no °F.
- [X] Circuit table "200A Service: 4/0 Al @75°C" (180A under 310.16).
- [X] Worked example (60A continuous EV, 41 °C, 6 CCC): applies 125% to the DERATED ampacity → picks 3 AWG; correct method (210.19(A)(1)(a)/(b)) gives 4 AWG. "60 A breaker" for a 60 A continuous load (needs ≥75 A → 80 A). "4 AWG EGC (250.122)" wrong (60A→10 Cu; 80A→8 Cu).
- [N] "310.15(B)(7) engineering supervision" (is 310.14(B)); "310.15(B)(5)" neutral (2023: 310.15(E)); "210.19(A)/215.2(A): OCPD ≥125%" (OCPD is 210.20(A)/215.3).
- [X] "requires PE stamp" — NEC says engineering supervision.
- [Legal] "Download NEC Table 310.16 PDF".

## /guides/wire-size-for-200-amp (10,776 impr)
- [N] "follows NEC 2024 requirements" (no 2024 edition).
- [X] Meta: "4/0 copper or 250 kcmil aluminum (NEC 310.12)" — 310.12 = 2/0 Cu / 4/0 Al.
- [X/I] "3/0 Cu and 4/0 Al each rated 200A at 75°C" (4/0 Al = 180A); table "Copper 2/0 Too small" contradicts its own 310.12 section.
- [X] Voltage-drop table ~2× too high (3/0 Cu 200A 100ft: ~1.28% @240V vs page 2.4%; 4/0 Al ~1.67% vs 2.8%).
- [X] Conduit: "1.25 in for 2/0 Cu" (3×2/0 THHN ≈0.667 in² > 1¼ EMT 40% 0.598) vs "2 in" vs "1.5 in" — inconsistent (verify T4/T5).
- [F] Costs ($8–12/ft, $4,250–10,600 project), "homes over 2,000 sq ft", "demand 60–70% of connected", typical load list.
- [?] "bend radius 5× cable diameter" (source?).
- [OK] T310.12 rows (100–400A) match; GEC #4 Cu/#2 Al for 2/0 Cu/4/0 Al (verify T250.66).

## /guides/wire-size-for-100-amp (5,013 impr)
- [X] Meta: "100A service 1 AWG Cu or 1/0 Al (NEC 310.12)" — 310.12 = 4 Cu / 2 Al.
- [X] Distance table VD % invented (computed ≤~2% for each row at 100A/240V).
- [F] Cost table.
- [X] "Attics over 40°C derate to 88%" (41–45 °C @75 °C = 0.82).
- [X] "GEC #6 copper (250.66)" for 3 Cu service (T250.66: 8 Cu; 6 Cu only avoids 250.64(B) protection).
- [X] "1¼ in conduit minimum for 4 wires" (3×3 AWG THHN + 8 AWG fits 1 in EMT — verify).
- [I] #4 Cu "only 85A" vs 310.12 allowing 4 Cu for dwelling 100A service.
- [X] "THHN-2" designation.

## /calculators/wire-resistance-calculator (8,389 impr, 256 clicks)
- [X] "Copper DC resistance (75 °C)" table: 18–8 AWG values are COATED-copper solid column (8.08/5.08/3.19/2.01/1.26/0.786), large sizes uncoated stranded — mixed, mislabeled.
- [X] Aluminum 12/10/8 (3.28/2.07/1.30) vs T8 (verify; expect ~3.18/2.00/1.26).
- [X] Transmission example: 500 kcmil Al "0.206 Ω/kft @20 °C" (≈0.034) — 6× off.
- [X] Motor feeder: 6 AWG "DC 0.410 @75 °C" (T8 0.491).
- [X] Control example: 14 AWG "2.57 Ω/kft @75 °C" (that is ~20 °C value; T8 3.07/3.14).
- [X] RF example: 12 AWG "3.31 mm diameter" (that is mm²; d=2.053 mm) → radius/ratio/Rac wrong.
- [X] Al temp factor 90 °C "1.29" (1.28).
- [B] SSR default result "0 Ω, 0%"; size options "250…500 AWG" (kcmil).
- [I] FAQ 12 AWG 1.93 vs table 2.01.

## /calculators/service-entrance-calculator (3,877 Bing impr; Google: 884 impr)
- [F] Utility table (PG&E/ConEd/ComEd/Duke/Oncor max service, meter heights, clearances) — unsourced; rebuild from utility service manuals or cut.
- [F] Upgrade cost/timeline tables, "increases home value $5,000–8,000", "$15,000 property value", $5,800 install, cable lifespan 30–50 yr.
- [X] Worked 220.82 example: range entered as "8 kW" (optional method uses nameplate), HVAC (geothermal 7 kW) lumped into the 40% bucket (220.82(C) treats heat/AC separately).
- [X] FAQ "add 25% for continuous loads and largest motor (NEC 220)", "size at 125% for growth" — not NEC.
- [X] "GEC 4 AWG Cu minimum" for 200A (250.66(A): rod-only GEC need not exceed 6 Cu).
- [X] Working space "3 ft wide" (110.26(A)(2): 30 in wide).
- [OK] 230.24(B) clearances 10/12/18 ft; 230.67 SPD (2020); rods 8 ft, 6 ft spacing; T250.66 100A→8, 200A→4, 400A→1/0 Cu (verify).

## /guides/wire-size-for-ev-charger (3,478 impr, 167 clicks)
- [OK] Quick table sizes valid for THHN @75 °C; [X] no NM-B caveat (40A charger on 8 AWG NM-B fails; 48A on 6 AWG NM-B fails).
- [X] Long-run table inconsistent with its own "<3% at 240V" note (e.g., 40A @100 ft on 8 AWG ≈2.6% → table says 6 AWG; 150 ft 6 AWG ≈2.4% → table says 4 AWG).
- [X] FAQ "6 AWG at 50A under 3% only to 75 ft" (≈1.5% at 75 ft; 3% at ~147 ft).
- [N] 125% OCPD cited to 625.42 (625.41 is OCPD; verify 2023 text).
- [X/drift] "Federal tax credit 30% up to $1,000" — 30C terminated by OBBBA for property placed in service after 2026-06-30 (verify IRS); eligible-census-tract rule omitted.
- [F] State/utility rebate ranges, cost table, "most homes need 200A", "Al saves 40–60%", DC fast "100–200+ A", charge-time figures w/o assumptions, panel-capacity example logic.
- [?] Tesla Gen 3 (48A/60A, 11.5 kW, 15–60A, 24 ft cable, "6 AWG"), ChargePoint Home Flex (16–50A, 23 ft, 6 AWG for 50A) — verify vs manuals.
- [?] 625.50 heights 18–48 in indoor (outdoor 24 in min omitted); 625.17 25 ft cable; 625.44 — verify.

## /guides/single-vs-three-phase (4,097 impr, 20 clicks — CTR 0.49%)
- [F] Decision matrix: "30–50% lower cost", "15–25% more efficient", "~3 HP single-phase max" (T430.248 lists to 10 hp), "~25 kW limit", "$2,000–5,000 adds, 10–15% savings", "three-phase required for motors over 3 HP", converter prices/percentages.
- [X] "High leg marked orange or '408 V'" (110.15: orange or other effective means).
- [X] 4/0 Cu "0.609 lb/ft" (NIST HB100 solid 4/0 ≈ 0.6405 lb/ft); 4/0 "260 A" & 6 AWG "75 A" = 90 °C column in a 75 °C context.
- [X] "three-phase needs 1/3 the wire diameter, 1/2 conduit, 70% less copper", "50 HP single-phase… above 25 HP" garbled.
- [OK] 50 hp @460 V FLC 65 A (T430.250), 250% → 175 A breaker; VD arithmetic both cases.

## /guides/power-factor-explained (1,576 impr)
- [F] Equipment PF table (unloaded induction motor 0.65 — real no-load PF far lower; LED "capacitive" 0.95; etc.), annual cost example ($1,200 vs $1,680, "40% penalty", $5,760), target thresholds — no sources at all on page.
- [OK] Power-triangle numbers and 1/PF² loss multiples arithmetic correct; framing "pays 4× more" overreaches (I²R in own wiring only).
- og/twitter description = generic "Free wire size calculator…" (wrong per-page metadata).

## /calculators/ampacity-calculator (1,502 impr)
- [X] Every "real-world derating" example uses a wrong correction factor: 60 °C attic 90 °C-col 0.58 (=75 °C col; 90 °C = 0.71); 30 °C "0.94" (=1.00); 46 °C "0.76" (=0.82); 20 °C "1.04" (=1.08); 40 °C "0.87" (=0.91). FAQ 104 °F ×0.87 (=0.91).
- [F] 110/125/150 °C correction columns (not in T310.15(B)(1)(1); don't match the 310.15(B) formula either).
- [X][N] Rooftop adders 33/22/17/14 °C by height = pre-2017 table (2017+ : 33 °C only <7/8 in above roof; 2023 310.15(B)(2)); "33 °F" used for 33 °C.
- [F] Altitude derating 0.96/0.93/0.90; "add 20 °F for sunlight".
- [X] "1 AWG Al = 130 A" (100 A), "T310.16 assumes 30-in burial", "continuous alternative: use 90 °C ampacity with 75 °C terminals", THWN treated as 90 °C in examples.
- [N] 10% rule cited 310.15(A)(2) Exc (2023: 310.14(A)(2) Exc); rooftop "T310.15(B)(2)(c)".
- [OK] 60/75/90 correction rows 10–60 °C, bundling, insulation-type ratings (verify T310.4(A)).

## /calculators/rv-hookup-calculator (1,357 impr, 75 clicks)
- [X][N] "551.41 requires GFCI for all RV receptacles" (551.41 = receptacles in the RV; site supply: 551.71(F) 125 V 15/20 A; dwelling outdoor 14-50R/TT-30R → 210.8(A)(3)); "210.8(B)(3)" (=rooftops); "220.21" in meta.
- [X] T551.73(A) demand factors misapplied: 41% used for 10 and 20 sites (10–12 sites = 50%, 19–21 = 45%; 41% is 36+); amps of 120 V and 240 V sites added directly (551.73 uses 3,600/12,000 VA per site).
- [X] "50A welder-style 6-50R for specialty RVs"; residential "58A → 60A circuit" for a 14-50R (receptacle 50 A max OCPD).
- [F] All costs; park/military/commercial examples.

## /calculators/well-pump-calculator (1,096 impr, 44 clicks)
- [F] "3-wire control box current multiplier 1.15×", "circuit requirement 125%×FLC×1.15"; "branch circuit factor FLA×2.5" (250% is max inverse-time breaker per T430.52, not conductor sizing).
- [X] Chart FLA: 1/3 hp 230 V "3.2 A" (T430.248: 3.6), 1.5 hp "12.0 A" (10); breakers 2 hp 3φ "25 A" (6.8×2.5=17→20), 3 hp "30 A" (24→25); max distances inconsistent with own 3% criterion (e.g., 1/3 hp 14 AWG ≈340 ft vs "150 ft"). Submersible sizing should come from manufacturer (Franklin AIM) tables.
- [X] "Short-circuit protection 300–1700% of FLA", "GF 30 mA personnel / 1200 mA equipment" (GFCI Class A trips ≤6 mA).
- [X] 25 hp @460 V "32 A" (T430.250: 34); example 2 "17 A→20 A" vs header "30 A".
- [F] Costs, "300–400 ft typical depth", pressure-tank sizes.

## /calculators/hot-tub-calculator (1,030 impr, 40 clicks)
- [F] Person-count → amps mapping (2–3p 30A, 4–5p 40A, 6+ 50A, 8+ 60A); energy-use table; costs; "multi-zone demand 75%/65% (NEC 220)".
- [X] Reference table breaks its own ×1.25 rule (20 A load → 20 A GFCI on 12 AWG; 30 A → 30 A; 50 A → 60 A).
- [X] VD examples use 2.6 Ω/kft for 6 AWG (≈0.49) and 1.6 for 2 AWG (≈0.19), no ×2 return path; results meaningless.
- [N] 680.41(A) GFCI 5 mA (680.44 = GFCI; 680.41 = emergency switch); 680.41(B) disconnect (680.13); 680.42 bonding (680.26/680.42(B)); 680.43(A) 5 ft; 680.8 "22.5 ft for >600 V" (T680.9(A): 22.5 ft = insulated 0–750 V on messenger); 680.23 "12 V" (15 V low-voltage contact limit).
- [OK] 8 AWG solid Cu equipotential bonding (680.26(B)); basement 45 A→56.25→60 A/6 AWG.

## /calculators/kilowatts-to-amps-calculator (1,023 impr, 3 clicks, pos 8.3)
- [OK] Formulas; FAQ 20.8 A / 21.2 A; 100 hp @460 V = 124 A (T430.250).
- [X] Range example "8 kW + 40% of remainder" (T220.55 Col C: 12 kW → 8 kW); "VD limits 5% feeders / 3% branch"; "leading PF = PF > 1.0".
- [F] PF-by-equipment table (unsourced), kW ranges, "data centers 5–100 kW/rack".

## /calculators/range-calculator (981 impr, 19 clicks)
- [X] P0: "NEC 220.55: first 8 kW at 100%, remainder at 80%" — not Table 220.55. Col A (<3.5 kW) 80%, Col B (3.5–8.75 kW) 80%, Col C one range ≤12 kW = 8 kW, Note 1 +5% per kW over 12 kW. All six examples wrong (12 kW→33.3 A not 46.6 A; 15 kW→38.3 A not 56.6 A).
- [X] P0: wall oven 5 kW → 25 A breaker on 12 AWG (240.4(D) 20 A max); "6-25R" receptacle (not a NEMA config); cooktop+2 ovens Note 4 ignored.
- [X] Product table: "Whirlpool WEE750H0HZ 6.4 kW" (6.4 = cu ft capacity), "KitchenAid KODE500ESS" is a double wall oven not a range; all kW/prices unverified.
- [?] 2023 GFCI for 250 V kitchen receptacles (210.8(A)) not mentioned — verify.
- [F] Costs, "induction 85–90%", "convection 20% faster".

## /calculators/welder-calculator (799 impr, 23 clicks)
- [X] P0: method ignores NEC 630.11(A) duty-cycle multipliers (meta promises them); sizes from invented arc-power/efficiency/PF guesses ×1.25. 630.12 is the 200% OCPD rule, not 125%. "T630.11(B) demand when 3+ welders" (630.11(B): 100/100/85/70/60%).
- [X] FAQ "62.5 A → 60 A breaker" (rounds down).
- [N] 630.33 disconnect for arc welders (630.13).
- [F] Energy, costs, "3-phase required above 300 A", PF ranges; "use magnetic-only breakers" advice.

## /calculators/box-fill-calculator (781 impr, 17 clicks)
- [OK] T314.16(B) per-conductor volumes; most T314.16(A) rows.
- [X] "4×2⅛×1⅞ = 10.3 in³" (T314.16(A): 1½ in deep = 10.3; 1⅞ = 13.0).
- [X] Single-switch example "3×2×2¾ (18 in³)" — own table says 14.0.
- [X] "3-way: 20 in³ in an 18 in³ box is 'tight'" — it is a violation.
- [X] "Don't count pigtails under 6 in" (pigtails not counted at any length); "Don't count pass-through conductors" (count once; ≥12 in loop counts twice).
- [B] SSR shows "Loading calculator…" (no inputs/results server-rendered).

## /calculators/wire-size-calculator (core tool; only 49 Bing impr — weak for "wire size calculator" 1,548 impr query owned by other pages)
- [X] P0: Temperature-correction table shifted one row (21–25 °C shown 1.00; 26–30 °C shown 0.91/0.94/0.96 — NEC: 1.08/1.05/1.04 and 1.00). Example "12 AWG @104 °F ×0.82" (75 °C col 36–40 °C = 0.88).
- [X] P0: "Ground wire T250.122: 15–20A → 14 AWG" (20 A → 12 Cu).
- [X] P0: "Dwelling 200A: 2/0 aluminum per 310.12" (310.12: 4/0 Al for 200 A; 2/0 Al is 150 A).
- [X] Max-distance table (14 AWG 15A 45 ft, 12 AWG 20A 60 ft, 10 AWG 30A 85 ft, 8 AWG 40A 70 ft, 6 AWG 50A 75 ft, 4 AWG 60A 65 ft, 1 AWG 100A 50 ft) — none match 3% with T8 75 °C R (≈38, 47, 97, 116, 147, 195, 234 ft); FAQ "57 ft" uses 20 °C R — mixed bases.
- [X] "Three-phase: reduce distance 13%" (3φ allows 2/√3 = 1.155× the 1φ distance at the same V); "each AWG step roughly halves resistance" (×1.26 per step; 3 steps ≈ ½).
- [I] 100A subpanel = 1 AWG here vs 3 AWG on /guides/wire-size-for-100-amp; EV 40A→6 AWG / 48A→4 AWG here vs 8/6 AWG on EV guide (both defensible only with stated cable type).
- [F] Cost table, "Al 40–50% cheaper", "oversize +30–40% cost", "sensitive electronics 2%".
- [OK] T310.16 rows 14–4/0; 5 hp 230 V 28 A → 35 A; 125% continuous examples; 240.4(D) FAQ.

## /calculators/voltage-drop-calculator (9 impr)
- [OK] Quick-answer % values (computed with T8 75 °C stranded R); T8 Cu/Al stranded column 18 AWG–500 kcmil looks right (verify).
- [X] Temperature table (25 °C base: 75 °C ×1.12) — real ≈1.19; contradicts own FAQ (0.4 %/°C).
- [X] PF "multiplier 1/PF" table and "VD×(0.85+0.15/PF)" formula — invented; AC drop = I(R cosθ + X sinθ).
- [X] P0 math: "2×1/0 = 3/0", "2×2/0 = 4/0", "2×4/0 = 350 kcmil" (2×1/0 = 211,200 cmil ≈ 4/0).
- [X] "200A at 150 ft needs 350 kcmil Cu for 3%" (2/0 Cu ≈ 2.4%).
- [X] Real-world scenario table: % values don't match the recommended sizes (EV 48A 50 ft 6 AWG ≈0.98% vs 1.8%; hot tub 40A 60 ft 8 AWG ≈1.56% vs 2.0%).
- [F] "8% = fire hazard", "10% = code violation", impact table, annual-loss table ($21/$131 per 1% — computes ≈$8/$42 at its own $0.12/kWh; $0.12 also stale), ROI, equipment-life %, "PVC reaches 70 °C".
- [?] 700.31 "emergency 5%", IEEE 1100 "2%" — verify; 695.7 15% ✓.
- [OK] torque ∝ V² (5%→~10%, 10%→19%); T430.248 230 V FLC column.

## /calculators/ground-wire-calculator (299 impr)
- [OK] T250.122 rows 15–1200 A; T250.66 copper rows.
- [X] Meta "15A through 2000A" — table stops at 1200 A (1600/2000+ missing); T250.66 aluminum-service-conductor column missing (ambiguous).
- [X] "Must be copper unless specifically allowed" (250.118 allows Al/CCA EGCs); pool "rebar bonded at 18 in on center" (680.26(B): 12×12 in grid; perimeter conductor 18–24 in from wall).
- [?] Telecom IBT "#6 minimum" — verify 250.94.
- [B] "Loading calculator…" SSR.

## /calculators/conduit-fill-calculator (35 Bing; 178 Google impr)
- [X] P0: "Equipment grounds not counted (per 250.122)" — Ch9 Note 3: EGCs ARE counted. Repeated in FAQ.
- [X] Conduit area table: PVC-40 2½/3/4 in, PVC-80 ½/1/2½/3/4 in and all "RGS" values look wrong (verify vs T4); XHHW column 10 AWG–4/0 wrong (verify vs T5); "UF cable" column not a T5 item.
- [I] Example 5 uses 12 AWG THHN 0.0197 (table 0.0133); example 6 uses 250 kcmil 0.3718 and 4 in RGS 12.72 (table 15.949).
- [N] "314.16(B) fill percentages", "314.17(B) nipples" (Ch9 T1 + Note 4).
- [X] "24 more 14 AWG" (23).

## /calculators/circuit-breaker-calculator (35 impr)
- [X] Default panel "20 A load → conductor requirement 25 A → breaker 20 A" (self-contradictory).
- [X] T430.52 row "Inverse time w/MCP 150%" (no such row).
- [OK] 240.6 sizes; LED/mixed/water-heater (25 A on 10 AWG)/oven examples; 20 hp 460 V 27 A, 250% → 70 A.

## /calculators/residential-load-calculator (Google 3,176 impr — the site's biggest Google page)
- [N] P0 meta: "220.82 (Standard) or 220.83 (Optional)" — 220.82 IS the optional method; 220.83 = existing dwelling; standard = Part III.
- [X] Mixes standard-method factors (T220.42 35%, 220.53 75%) into an "optional method" calculator; "range ≤12 kW = 80%" (T220.55 Col C = 8 kW); "+25% of largest motor" (not part of 220.82); AC lumped in the 40% bucket (220.82(C) separate, 100%).
- [X] Johnson example understated (AC must be 100%): ≈30.6 kVA/128 A not 28.1 kVA/117 A.
- [F] "1,200 W/ton", service-size-by-sq-ft table, "100A ≈ 20 kW", permit cost by state table (incl. "Georgia: IRC adoption"), upgrade costs/paybacks, "upgrade at 80%", appliance wattage table (unsourced; DOE has a primary table).
- [?] 2026 NEC moved load calcs to Article 120 — whole page's section numbers may be one edition stale.

## /calculators/air-conditioner-calculator (Google 1,721 impr; Bing 348)
- [F] Tonnage→nameplate-amps mapping (2 ton = 11.2 A), "SEER efficiency multiplier", manufacturer spec list (Carrier 19VS, Trane XV20i, Mitsubishi MSZ-FH18NA [indoor model], Rheem RA1048AJ1NA, Daikin DX16SA — RLA/MCA/MOCP/prices unverified), install hours, costs.
- [N] 440.22 "overload" (=SC/GF OCPD 175/225%), 440.62 "dedicated circuit per unit" (room-AC rules), 440.61 "EGC" (room-AC general).
- [X] VD example with 2.6 Ω/kft for 12 AWG; heat strip 62.5→78 A "→ 90 A" (80 A); RTU 40 A vs 50 A breaker; "10 SEER minimum legal", "14 SEER minimum" — SEER2 regime since 2023-01-01 (verify DOE); $0.12/kWh stale.

## /calculators/electrical-load-calculator (432 impr)
- [X] P0: 2,000 ft² example drops the 10 kW heat and keeps 3.5 kW AC (220.60 keeps the LARGER); total 29.625 kVA is also an addition error (items sum to 26.625).
- [X] P0: multifamily "first 8 units 100%, rest 75%" (T220.84: one factor on total by unit count, 12 units = 41%).
- [X] T220.56 inverted ("65% + 5% per unit over 3"; real: 3 units 90%, 4 80%, 5 70%, 6+ 65%).
- [X] Range 16 kW → "11.2 kW (70%)" (Note 1: 8 kW × 1.20 = 9.6 kW); small-appliance gets its own 3 kVA@100% tier; "water heater 220.51" (220.51 = space heating); motors summed in HP not FLC amps; office 3.5 VA/ft² (2020+: 1.3).
- [F] Service sizing table, "+25% above calculated", cost ranges.

## /guides/electrical-power-calculations (494 Bing; 231 Google impr)
- [X] P0: "Example 5, 220.82 Standard Method" — 220.82 is Optional; uses 35% (220.82(B) = 40%); adds WH/dryer/range at 100% outside the 40% bucket; EV ×1.25 in a load calc; concludes a 2,400 ft² home needs 225–250 A (correct optional calc ≈ 136 A → 200 A is ample).
- [F] P0: refrigerator 1,200 W, 3,154 kWh/yr, $504.60/yr (real fridges ~350–700 kWh/yr — verify DOE/ENERGY STAR).
- [X] PF treated as "efficiency" (86.6% at PF 0.866); "3φ = 73% more power for same conductor size"; capacitor example "18% less I²R" (≈33%); 25 hp overload "1.15 × table FLC" (430.32 uses nameplate FLA; SF 1.15 → 125%); "utilities charge PF fee below 0.95" for a residential 5-ton AC; 5-ton "7.2 kW, PF 0.85 typical for unloaded scroll".
- [F] Voltage-system "max power" cards.
- [OK] Formula table; capacitor kVAR/current math; 25 hp 34 A, 42.5 A → 8 AWG, 90 A breaker.

## /calculators/motor-circuit (383 impr)
- [OK] T430.52 percentages incl. wound-rotor/DC rows (verify 2023 table number); 430.24 feeder example (129.25 A → 1 AWG).
- [X] 430.62 feeder OCPD "161.75 → 175 A" (no round-up for feeders; computed from the selected branch device).
- [F] "DOL <30 hp, soft start >30 hp, synchronous >100 hp".
- [X] "Overloads 115–125% of nameplate (or FLC if higher)".

## /calculators/horsepower-to-amps-calculator (314 impr)
- [X] P0: "Single-phase 230 V (Table 430.247)" lists the 115 V column (1 hp 16 A; 230 V = 8 A) and 430.247 is the DC-motor table.
- [X] P0: table map "430.247 single-phase / 430.248 three-phase 115/200 V / 430.249 three-phase 230/460 V / 430.250 575/2300 V" — real: 247 DC, 248 single-phase, 249 two-phase, 250 three-phase.
- [X] 460 V 3φ: 2 hp "3.9" (T430.250: 3.4), 3 hp "5.7" (4.8) — verify.
- [X] 5 hp compressor "branch protection 40 A max" (250% → 70 A; hermetic compressors are Article 440); 500 hp 2300 V example uses T310.16 and LV rules.
- [F] "×2 for multispeed 115 V", "nameplate 10–15% lower than FLC".

## /calculators/btu-to-watts-calculator (335 impr)
- [OK] 3.412 BTU/h per W, thermal-watt column, pool-heat physics, fuel-cost arithmetic.
- [F] MCA/MOP-by-tonnage table, AC circuit column, rules of thumb (600–800 ft²/ton, 25–55 BTU/ft²), furnace blower watts, COP 5 pool HP, warehouse/server examples; fuel prices ($0.12/kWh, $1.50/therm, $3/gal; oil price unstated) unsourced and stale; "SEER min 14, ENERGY STAR 15+, HSPF min 8.2" pre-2023 (SEER2/HSPF2 now — verify DOE).
- [F] "EER = SEER × 0.875".

## /calculators/dryer-calculator (31 impr)
- [N] 210.11(C)(2) "dedicated 30A dryer circuit" (=20 A laundry circuit), 422.16(B)(2) (=dishwasher/compactor cords), 210.19(A)(3) (=ranges), 210.52(F) for "within 6 ft" (=210.50(C)).
- [X] "Dedicated 30A required", "125% of nameplate" — no such NEC rule for dryers (manufacturer instructions govern; 220.54 is for load calcs).
- [X] P0 omission: 2020+ 210.8(A) GFCI for 125–250 V receptacles in laundry areas (dryer receptacle) — verify.
- [X] VD examples (1.6 Ω/kft for 10 AWG, 2.6 for 14 AWG, 1.2 for 8 AWG; no ×2).
- [F] Heat-pump dryer specs ("2,000–3,000 W, 15–20 A", "50% savings"), costs, install hours, "3–4 ft receptacle height".

## /calculators/pool-pump-calculator (28 impr)
- [X] P0: T430.248 230 V values wrong: 1.5 hp "8.0 A" (10), 3 hp "15.2 A" (17), "2.5 hp 12.0 A" (no 2.5 hp row); formula FLA "5.5 A" contradicts.
- [N] GFCI cited 680.22(B) (pool pump motor GFCI is 680.21 — verify 2023 letter); "680.22(A)(5) 5-ft equipment clearance" (no such motor rule; receptacle distances are 6 ft since 2020 — verify).
- [X] "Cord-and-plug connection" listed as a violation (680.21 permits ≤3 ft cord — verify); 11 kW heater 45.8 A on 50 A (pool heater 125% → 60 A; verify 680.10).
- [X] VD with 2.6 Ω/kft for 14 AWG, no ×2.
- [F] Manufacturer pump currents (Pentair/Hayward/Jandy/Sta-Rite), prices, warranties, energy table (hp treated as kW), savings %, $0.12/kWh.

## /calculators/garage-subpanel-calculator (22 impr)
- [X] P0: 125 A feeder EGC "8 AWG" (T250.122: >100 A → 6 Cu).
- [X] VD table caption "5% at 100 ft, 240 V" but values computed at 120 V (10 AWG 24 A vs 48 A); ampacity column is 60 °C while feeder table uses 75 °C.
- [N] 225.30 "EGC" (=number of supplies), 225.27 "24 in burial" (=raceway seal; burial = T300.5), 225.39 garbled, 225.18 "10 ft over driveways" (12 ft), 310.15(B)(7) (2017 dwelling-service rule) on a subpanel.
- [X] Example resistances (2.6, 1.6, 1.0 Ω/kft for 2 AWG–3/0) — 10×+ off; demand factors 0.8/0.85/0.75 invented.
- [F] Costs, repair costs, maintenance schedule, "NY frost 4 ft+".

## /calculators/three-phase-calculator (161 impr)
- [X] P0 SAFETY: motor table FLA computed by formula, not T430.250 — 460 V: 5 hp 4.8 (7.6), 10 hp 9.6 (14), 25 hp 24.2 (34), 50 hp 48.3 (65), 100 hp 96.6 (124), 200 hp 193.1 (240); 208 V 10–200 hp also low. Wire sizes undersized: 25 hp → 10 AWG (needs 8), 50 hp → 6 AWG (needs 4), 100 hp → 3 AWG (needs 2/0), 200 hp → 4/0 (needs 350 kcmil).
- [X] P0: 50 hp example: 6 AWG, "100 A breaker at 125% of FLA per 430.52".
- [X] PF-correction table: every kVAR/100 kW and % current figure wrong (0.80→0.95 needs 42.1 kVAR, current −15.8%; page 32.9 / 18.8%).
- [X] HVAC/water-plant/welding-shop examples use formula currents, invented duty-cycle math ("×√0.6"), "GF 30 mA personnel".
- [OK] Transformer FLA table; 3φ formulas.

## /calculators/low-voltage-calculator (2 impr)
- [X] P0: DC sizing formula omits resistivity — "CM = I×L_total/VD" (needs K ≈ 10.4–12.9 Ω·cmil/ft): every example ~10× undersized (12 V 400 W solar 40 ft at 2% needs ≈2/0, page says #10/#8; 240 W light bar needs ≈8 AWG, page #12; 1,000 W amp needs ≈1 AWG, page #4).
- [?] Resistance table = 20 °C NIST values, unlabeled; capacity tables basis unstated.
- [N] Class 2 sections 725.121/725.136 — 2023 reorganized Article 725/722/724 (verify).
- [?] ABYC 3%/10% ✓-ish, 18 in support ✓; "fuse within 18 in", "RVIA 4.5 ft", "SAE J1128 −40 to +200 °F" — verify or cut.

## /calculators/ev-charger-calculator (2 impr)
- [N] 625.43 "within sight" (rule is lockable/readily accessible disconnect >60 A or >150 V to ground — verify), 625.15 "10 AWG ground" (EGC from T250.122).
- [X] EV table: F-150 Lightning "9.6 kW onboard" (11.3 kW std / 19.2 kW ext. range — verify), Bolt "7.2 kW / 65 kWh" (model-year dependent), Model 3 all trims "11.5 kW" (SR RWD 7.6 kW) — vehicle specs need manufacturer sources or removal.
- [X] VD examples (2.6/1.6 Ω/kft, no ×2); DC-fast "200+ miles in 30 min from 50 kW", "60–1000 miles/hour".
- [X] "GFCI required for all EV charging equipment" (625.54 = receptacles; hardwired EVSE use built-in personnel protection — verify).
- [F] Costs, "many homes need 100→200 A".

## /about, /contact, /privacy, /terms, /disclaimer (trust frame)
- [F] P0 /about: "reviewed by licensed electrical engineers and master electricians" (nobody named — fake expert review); "Industry Recognition" quotes attributed to NECA, IAEI, EC&M, IEEE (fabricated endorsements by real organizations — legal + Raptive risk); "100,000+ calculations/month", "99.9% uptime SLA", "±0.1% precision", "Accuracy Guarantee", "monthly code review cycles"; claims values come from "primary code documents… validated against Mike Holt materials" — contradicted by the error rate; says "trusted-by claims were removed" while hero still shows them; tool counts 10+12+18+10 = 50 vs "30+"; no named person, no company, no address.
- [F] P0 /contact: six addresses (emergency@, support@, consulting@, legal@, education@, international@) with "24/7, 2-hour response guarantee", "Headquarters: United States", regional desks (EU/APAC) — none of this exists (owner runs no mailbox; company is in Slovenia).
- [X] /privacy: controller "WireSizes.com" (not a legal entity; real controller Moving Data Systems d.o.o., EU → GDPR applies directly); fake DPO address; names only Google Analytics — must match the actual stack (verify GA4/Raptive/consent).
- [X] /terms: "Jurisdiction: United States". /disclaimer: repeats 24/7 emergency claims.
- [X] /calculators/ac-wire-size serves the AC page (canonical → air-conditioner-calculator) — make it a 308 redirect.

## /guides/electrical-safety (11 impr)
- [F] YMYL: arc-flash incident-energy/boundary table unsourced; five "real-world scenarios" with invented claim costs ($2.8M, $875,000…); "NFPA 1584"/"NFPA 497" padding; GFCI attributed to NFPA 70E; old 70E table numbers.
- [OK-ish] OSHA "LOTO prevents ~120 deaths/50,000 injuries a year" (OSHA's own estimate — must be cited); PPE Cat 1 = 4 cal/cm² (70E).
- Decision candidate: cut, or rebuild as a narrow, sourced home-safety page (GFCI/AFCI by NEC edition + NFPA/CPSC/BLS stats).

## /guides/nec-code-compliance (176 impr)
- [X] P0 SAFETY: its "NEC Table 310.16" is shifted one column high everywhere (14 AWG Cu 60 °C "20 A", 75 °C "25 A", 90 °C "30 A"; real 15/20/25; invents a 14 AWG Al row; 4/0 Cu 90 °C "300 A" vs 260).
- [X] P0: "250.122" table EGC for 200/300/400 A = 4/2/1/0 (real 6/4/3 Cu); bonding-jumper column not per T250.102(C)(1).
- [X] Sample dwelling calc uses 3.5 VA/ft² (dwelling = 3), stops after lighting/small-appliance/laundry and concludes "100 A"; demand table "lighting 100%", "range 80%".
- [X] NM "90 °C" and UF "90 °C" with no 60 °C ampacity caveat (334.80/340.80); "AFCI bedrooms 2020+" (since 2002 NEC, expanded 2008/2014/2017…); "310.15(B)(3)(a)" (2023: 310.15(C)(1)); "FPN".

## /guides/wire-sizing-guide (2 impr)
- [OK] AWG table diameters/areas/weights (NIST HB100 bare Cu) and 75 °C ampacities; T310.12 200 A = 2/0 Cu / 4/0 Al.
- [X] "EGCs count as current-carrying" (they count for conduit FILL — Ch9 Note 3 — not for ampacity adjustment, 310.15(F)); contradicts conduit page ("not counted").
- [X] EMT 4 in "15.949 in²" (conduit page: 14.753); EMT "3 conductors in ½ in" (unspecified size).
- [X] Scenarios: "100 HP single-phase motor on 100 A breaker", "3/0 = 225 A @75 °C" (200), "4 AWG = 75 A", VD arithmetic mixed (25 A vs 20 A).
- [F] Scenario costs ($15,000 motor, $30,000 electrification…).

## /calculators/ev-charger-wire-size-calculator (11 impr) — near-duplicate of /calculators/ev-charger-calculator + /guides/wire-size-for-ev-charger
- [F] P0: "Sarah's Tesla Model 3 Home Installation" — invented persona/anecdote (also "Sarah's Backyard Oasis" on hot-tub-wire-size).
- [X] P0 drift: "Federal credit 30% up to $1,000 through 2032 (Form 8911)" — verify OBBBA termination of §30C (property placed in service after 2026-06-30).
- [X] JuiceBox 48 recommended (Enel X Way exited North America in 2024 — verify); charger prices/warranties/cable lengths unverified; state incentive table unsourced ("MOR-EV" is a vehicle rebate).
- [N] 625.41 "GFCI", 625.40 "50 A receptacle limit", 625.42 "disconnect"; FAQ ">50 A or 250 V" vs section ">60 A or 150 V".
- [X] Distance claims (6 AWG to 75 ft at 50 A circuit; real ≈180 ft at 40 A for 3%).

## /calculators/hot-tub-wire-size-calculator (38 impr) — near-duplicate of /calculators/hot-tub-calculator
- [F] P0: "Sarah's Backyard Oasis" persona; "+$5,000–7,000 property value"; brand table (power, heater kW, prices, "5-year warranty" for all); model dropdown specs (jets, gallons, heater W).
- [X] "240 V tubs heat 6–8 °F/hour" — physically impossible for 450 gal with 6 kW (≤5.5 °F/h with zero losses).
- [N] GFCI cited 680.42 (680.44).
- [X] "6 AWG minimum for 50 A" (8 AWG Cu @75 °C qualifies), ">75 ft go 4 AWG" (6 AWG ≈1.5% at 75 ft).

## /calculators/kva-to-amps-calculator (355 impr, 0 clicks)
- [OK] FLA columns (1φ 240 V, 3φ 480 V) and PF table.
- [X] Wire/breaker columns violate 240.4: breakers above conductor ampacity (37.5 kVA 2/0 on 200 A; 75 kVA 3 AWG on 110 A; 112.5 kVA 1/0 on 175 A; 1000 kVA 4×300 kcmil on 1600 A…) and conductors below FLA (75 kVA 1φ 350 kcmil < 312.5 A; 167 kVA 2×350 < 695.8 A; 500/750/1000 kVA 3φ sets < FLA).
- [X] 450.3 summary garbled ("250% for primary ≤9 A"); unloaded-motor PF 0.35–0.60 vs 0.65 on PF page.
- [OK] NEMA code-letter kVA/hp ranges (T430.7(B)).

## Converters
- /calculators/watts-to-amps (11 impr): [X] water heater "12 AWG for 25 A"; "most appliances are continuous loads" (NEC continuous = max current ≥3 h); 1 hp pool pump "3.1–4.2 A @240 V" (T430.248 1 hp 230 V = 8 A); [F] "max practical amps" table, PF table unsourced.
- /calculators/amps-to-watts (31 impr): [X] "25 A × 240 V × 0.85 = ~7 hp" (input W ≠ shaft hp); 3φ 50 A 480 V 0.92 = 38,243 W (page 38,323); "220.54 Column B for cooking" (220.54 = dryers); "424.3(B) 100% demand"; [F] PF penalty %, generator "6× running kW", altitude 3%/1,000 ft.
- /calculators/volts-to-amps (422 impr): meta says I = V/R but tool computes P/(V·PF); [X] P0: EV 30 A on 10 AWG (37.5 A → 8 AWG), 20 kW furnace 83.3 A on 3 AWG (continuous → 104 A → 2 AWG), 10 hp 1φ motor "36.6 A" (T430.248: 50 A) → undersized 8 AWG; 2 hp pool pump "7.8 A" (12 A); solar current from P/V instead of Isc; "10% low voltage → 11% more current" (resistive loads draw less).
- /calculators/ohms-law (10 impr): [OK] worked examples correct (heater, LED resistor, divider, series/parallel); only "+40% hot winding" unsourced.
- /calculators/horsepower-to-amps, /kilowatts-to-amps, /kva-to-amps, /btu-to-watts — see above.

## Hubs
- /calculators: [F] "Trusted by over 100,000 electrical professionals", "Used by over 50,000 professionals monthly", per-tool "usage %" bars (95%, 92%…); [X] "10 AWG THHN 90 °C 40 A derated to 35 A at 30 °C" (35 A is the 75 °C terminal limit, not a derate); "25 hp → 40 A wire, 70 A breaker, 38 A overloads" (460 V: 34 A FLC → 42.5 A wire, ≤85 A breaker).
- /guides: [F] "50,000+ engineers educated", "29 calculators" vs "30+", "6 guides" (11 listed); [X] P0 drift: "NEC 2023 is the most recent edition as of 2026; NEC 2026 publishes mid-2026" (verify NFPA issue date); [Rendering] reader-facing FAQ "Do AI assistants cite these guides?", schema/llms.txt/dateModified-from-git talk; unverifiable update-cadence promises.

## Crawl coverage
- 53/53 sitemap URLs captured + /calculators/ac-wire-size (GSC-only). All pages: no named author, no visible date, site-wide fabricated social proof.
