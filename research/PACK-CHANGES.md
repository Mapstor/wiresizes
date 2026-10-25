# Research pack changes

## v4 (2026-10-25), replaces v3

Owner decisions (2026-10-25)
- Company details on /about, /contact, /privacy and /terms: Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia, company registration number 9041273000, VAT ID SI94001154 (ZEPT Article 5). Decision D-03 is replaced; the old "Maribor" publisher line is now a banned string.
- Google Analytics 4 runs only after consent for EU, EEA, UK and Swiss visitors, and by default elsewhere (WSZ-002 step 8b, decision D-10). The privacy notice describes the banner and the "Cookie settings" button.

WSZ-002
- Step 0 installs v4 and accepts research/wsz002-draft-review.md (from WSZ-013 DRAFTCHECK) in the diff; INSTALL.md keeps that file too.
- From chat's Chrome test of the live site (2026-10-25): length inputs become number inputs up to 2000 ft (the sliders stopped at 500 ft in 10 ft steps); every form control gets a programmatic label and the icon buttons get names (new step 6k; tests move to 6l); the BTU page's SEER-to-EER and AFUE blocks go (unsourced, and their tables caused React hydration error #418 on every load).
- check-structure adds three checks: table rows inside thead/tbody/tfoot, a label for every form control and a name for every button, and no Google Analytics script in prerendered HTML.
- Banned strings add privacy@wiresizes.com, dpo@wiresizes.com and the old publisher line.
- Backlog notes: the BTU and three-phase tools render only in the browser; 9 of 32 pages scrolled sideways at 320 px before WSZ-002.
- WSZ-004: the Organization schema carries legalName, address and vatID.

## v3 (2026-10-24), replaces v2

Prompts
- WSZ-002, after the first independent review (24 findings): the low-voltage tool sizes for current as well as voltage drop; results state the 30 °C / three-conductor basis; print and share output must match the screen; the 250.122(B) ground-wire area is computed multiply-first; check-banned also reads the source text of live modules; the homepage keeps a short list of sections; the Impeccable install is pinned to impeccable@4.7.0; this pack is verified with research/MANIFEST.sha256.
- WSZ-002, after the second review (12 findings plus nits): step 0 matches the pack as built; typed error codes in a fixed order; 240.4(D) limits shown only for the sizes the rows cover; the voltage-drop visual takes the reader's target; power loss stated in watts; Table 250.66 kcmil cells parsed as kcmil × 1000; check-banned follows re-exports and skips the withdrawn components; Impeccable checks cover ignored paths and large files.
- WSZ-002, after the third review: the ground wire is not capped at the conductor size until the 250.122(A) sentence is verified (decision D-08). Table 250.122 gives 25 A aluminum an 8 AWG EGC on a 10 AWG conductor; the tool shows it with a note that is true with or without voltage-drop upsizing, and says so when no Table 310.16 size is large enough (egc null). The voltage-drop target is 1 to 10 % (new error code vd-target-out-of-range; the page offers 1–5 %). The live check picks the first free port from 3022 to 3025 and never stops a process. Decision D-09 records how verified-sd2023 text is rendered.
- WSZ-003: accessors match WSZ-002 (sizes.ts, maxOcpd240_4D, multiply-first proportional EGC, dc-sizing rule); termination inputs (nec-110-14c.json engine rules) and a derating mode whose 250.122(B) baseline is sized to the OCPD rating; result fields for the termination and derated golden groups are defined.
- WSZ-004: schema and visible dates come only from page-dates.json; src/lib/article-dates.ts and the '2026-01-01' fallback dates go.
- WSZ-005: the NEC-editions page follows the rules array in nec-adoption.json; 110.14(C) stays off its pages until WSZ-008 lifts the check-structure ban.
- WSZ-008: step 0 removes "110.14(C)" from check-structure's forbidden text (keeps "334.80", adds "340.80").
- WSZ-009: cable correction and adjustment start from the 60 °C column; the derated baseline is sized to the OCPD rating; the EGC note also shows on the breaker tool.
- WSZ-010: the range tool uses the WSZ-009 termination inputs and defaults.
- WSZ-003 to WSZ-011 start with a PACK SYNC line; research/INSTALL.md describes the install.
- New: WSZ-008 to WSZ-011 (held waves, gated by research/held-pages-domains.csv).

Decision D-09 (owner can reverse)
- Text marked verified-sd2023 renders as 2023 NEC even where the 2022 Technical Meeting and Standards Council record was not seen. Each data file says which items that covers (110.14(C), 240.4(D)(4)–(D)(8), Table 300.5(A), 314.16(B)(5), 314.27(E), Chapter 9 Table 4 IMC rows, 430.52(C)(1)(b)). 625.54 is held: GFCI protection was a 2022 appeal topic and no post-issuance 2023 source prints it.

Data (rounds 4 and 5, 2026-10-20 to 2026-10-24; evidence in research/sources/round4/)
- New files: nec-110-14c.json (110.14(C) column rules), nec-225-2023.json (225.18, 225.31(B)), nec-300-5-2023.json (Table 300.5(A) burial depths), nec-680-2023.json (680.13, 680.43), nec-ch9-table4.json (IMC rows only).
- nec-240-4-d.json: all eight 2023 items and the 240.4(B) rule; Minnesota Board of Electricity minutes (Sept. 22, 2022) corroborate 240.4(B) and 240.4(D)(3) after issue.
- nec-250-122.json: 250.122(B) main rule (verified-sd2023; condition 3 met through the 2026 Second Draft base text) with the multiply-first method and a baseline sized to the OCPD rating; the exception and note stay CONFLICTING under their own status key; the 250.122(A) cap is not verified and not applied.
- nec-2023-rules-round2.json: TIAs 23-1 to 23-20 (none changes a published value; 210.8(F) Exception No. 2 expired 2026-09-01, now from two pulls; 680.43 Exception No. 3 deleted; 430.132 added); proposed TIA 1924 (extension to 2028) rejected by Code-Making Panel 2 and appealed to the Standards Council, outcome not seen; errata 70-23-1 to -5 and -9 read, 6–8 unread, none above 9 found; 625.54 held; 551.71.
- nec-314-16.json (2023 items), nec-430-440-2023.json (statuses), awg.json (19 AWG area from NBS Handbook 100 Table 6), nema-receptacle-configs.json (10 of 10), mfr-equipment.json (Jandy pump amps).
- nec-adoption.json: 49 of 51 jurisdictions verified on state or DC government pages (v2: 15 states and NYC). Local-adoption rows for AZ, IL, KS, MD, MO and NV; a second OH row (commercial); AR on the 2026 NEC since 2026-09-03. HI is not verified (under HRS 107-24(c) a newer NEC may have become the state code by default) and MS is not verified. The rules array now sets per-jurisdiction counts and a dated qualifier for TN.

Golden cases (214)
- Size keys normalised: nec-310-16 keys ("1/0", "4/0") in every group that feeds a Table 310.16 module; awg.json names only in awg-table, awg-geometry and weight.
- dc-sizing: new schema (voltage-drop size, 60 °C current size, the larger governs) and four new cases.
- wire-size-60c (34): three cases catch a ratio-first 250.122(B) computation; three 25 A aluminum cases have a Table 250.122 EGC larger than the conductor, one of them larger than any Table 310.16 size; every case carries egc_larger_than_conductor.
- New groups: wire-size-errors (7, typed error results), wire-size-termination (20, 110.14(C) column choice) and wire-size-derated (4, derating mode with the EGC baseline sized to the rating).

Gate (research/held-pages-domains.csv)
- BUILD: 200 A guide, service entrance, ground wire, wire size, ampacity, circuit breaker, residential load, range, dryer, horsepower to amps.
- HOLD until their domains are verified: 100 A guide, EV charger guide, garage subpanel, conduit fill, box fill, motor circuit, well pump, pool pump, hot tub, welder, air conditioner, RV hookup.

Trust copy
- /about no longer claims that every existing figure is already sourced; the corrections line names what the audit removed. OG image alt text added.

Banned strings
- Added the wrong sizes that survived the first list, the old calculator titles and outputs, and homepage claims. The 100 A subpanel line is now the exact old meta text, so a correct 75 °C answer is not blocked.
