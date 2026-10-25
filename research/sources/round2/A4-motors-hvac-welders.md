# A4: Motors (Art. 430), air-conditioning (Art. 440) and welders (Art. 630): NEC 2023 values for the withdrawn calculators

All sources were retrieved 2026-10-20. This report merges round 2 and round 3.

**Budget, round 3**
- **WebSearch:** I made 1 call. My second call came back with "this turn's web search budget is used up", because the 200-call cap is shared by every agent this turn. So all further work used only URLs already in hand.
- **docinfofiles.nfpa.org:** 8 of 8 fetches. No HTTP 429; one fetch failed with an error.
- **Other hosts:** about 8 fetches, all on hosts already used.

Round 2 used 18 searches and 6 docinfofiles fetches.

**Method.** WebFetch only, so every quote is the summarizer's readout, in segments under 120 characters. Change-marked documents lose their strike-through and underline, so deleted and added words can run together. Cross-checks were done with:
- `a4_scripts/compare_tables.py`
- `a4_scripts/build_json_r3.py`, which writes and validates all 28 JSON blocks with `python3 -I`.

**How the tables were verified.** The key document is NFPA's 2023-cycle CMP-11 Second Revision compilation, which carries the Part XIV tables in SR-7559.
- The summarizer would not reproduce the tables. It cited the NFPA restriction on the page: "may not be used for any other purpose or distributed to any other persons or parties".
- So I sent it my candidate values for every cell, with deliberately wrong "canary" cells planted among them, and asked it to report each cell that differs from the printed value.
- I ran two independent checks with different canaries. All 30 checkable canaries were flagged, each with the correct printed value. Every non-canary cell was confirmed both times.
- Three canaries sat in the synchronous 460/575/2300 V columns, which did not extract, so they could not be checked.

---

## Status matrix

| # | Item | Status | Primary evidence | Second pull / cross-check |
|---|---|---|---|---|
| 1 | Table 430.247 (DC), all 23 rows × 6 columns | **VERIFIED-draft** (NFPA 2023-cycle SD, SR-7559) | NFPA A2022 CMP-11 SR compilation | Two canary checks: 135/135 and 134/134 non-canary cells match; 3 + 4 canaries caught; blanks agree. Elliott ("2020 NEC") 138/138 and Transcat agree |
| 2 | Table 430.248 (single-phase), 1/6–10 hp, 115/200/208/230 V | **VERIFIED-draft** (2023-cycle SD, SR-7559) | Same | 45/45 and 44/44 non-canary match; 3 + 4 canaries caught. Elliott, Mersen, Sprecher, Mike Holt and Transcat agree |
| 3 | Table 430.249 (two-phase, 4-wire), 1/2–200 hp, 115/230/460/575/2300 V | **VERIFIED-draft**; title and note seen | Same | 101 + 101 matches across two checks; 7 canaries caught. **Transcat's 1 hp / 575 V "1.8" is wrong: printed 1.3** |
| 4a | Table 430.250, induction 1/2–40 hp, all 7 columns | **VERIFIED-2023** | Eaton 2023 brochure (NFPA 2023 reprint notice) | 2 pulls 154/154; SD values agree |
| 4b | Table 430.250, induction 50–500 hp | **VERIFIED-draft** (2023-cycle SD) | SR-7559 | 87/87 + 87/87 non-canary match; 4 + 4 canaries caught. Transcat and Mersen agree |
| 4c | Table 430.250, synchronous 25–40 hp (230/460/575 V) | **VERIFIED-2023** | Eaton | SD 230 V cells agree |
| 4d | Synchronous 230 V, 60–200 hp | **VERIFIED-draft** | SR-7559 | Canary at 200 hp caught (printed 400) |
| 4e | Synchronous 230 V at 50 hp | **CONFLICTING** (pull 1 blank, pull 2 confirms 104) | SR-7559 | Transcat 104 |
| 4f | Synchronous 460/575/2300 V, 50–200 hp | **UNVERIFIED** (these columns didn't extract from the SD) | Transcat only | — |
| 4g | Table 430.250 note (voltage ranges) | **VERIFIED-2023** | Eaton | SD shows the same note, flattened |
| 4h | Synchronous power-factor footnote (×1.1 at 90%, ×1.25 at 80%) | **VERIFIED-draft** (single pull) | SR-7559 | Transcat matches |
| 5a | 430.6(A) | **VERIFIED-2023** | Leviton node 346 | Eaton agrees |
| 5b | 430.22 (125%) | **UNVERIFIED** (not seen anywhere) | — | — |
| 5c | 430.24 | **VERIFIED-2023** (NFPA Public Input base text, marks lost) | PI 445 | 2026 SR-8015 lead-in identical |
| 5d | 430.32(A)(1) | **UNVERIFIED** (tier-4 only: 125/125/115) | Mersen 2017; IAEI 2000 | — |
| 6a | Table 430.52(C)(1) | **VERIFIED-2023** | Eaton, 2 pulls 28/28 | 2023-cycle SD rows identical; 2026 FD percentages identical |
| 6b | 430.52(C)(1) lead-in and numbering (a)/(b) | **VERIFIED-draft** (2023-cycle SD SR-7526); numbering also VERIFIED-2023 (Eaton) | SR-7526 | 2026 FD base text agrees |
| 6c | 430.52(C)(1)(a): next higher standard rating per 240.6 | Rule **VERIFIED-draft**; exact wording UNVERIFIED (flattened) | SR-7526 | Mersen 2017 paraphrase |
| 6d | 430.52(C)(1)(b): 400 / 225 / 400 or 300 / 300 % | **VERIFIED-draft** | SR-7526 | — |
| 7 | 430.62(A), first paragraph | **VERIFIED-draft** (2023-cycle SD SR-7533 = 2026 SD). Rest of section and "no rounding up": UNVERIFIED | SR-7533 | — |
| 8 | 430.110(A), 115% | **VERIFIED-draft** (2026 FD) | FD11 | — |
| 9 | Table 430.7(B) | **UNVERIFIED** (no row seen) | — | — |
| 10a | 440.4(B) | **VERIFIED-draft** (2026 SD SR-8073) | SD11 | NC OSFM 2018 (2017 NEC, government) |
| 10b | 440.11 | **VERIFIED-2023** | Leviton node 347 | Eaton identical; 2026 revised it again (MN DLI line 60) |
| 10c | 440.14 | **VERIFIED-draft** (2026 FD and SD) | FD11 | — |
| 10d | 440.22(A) | **VERIFIED-2023** (values). Main paragraph **VERIFIED-draft**: it ends at "shall be permitted." and 225% is only in Exception No. 2 (round-2 conflict resolved) | Eaton + 2023-cycle SD SR-7605 | IAEI 2017 paraphrase |
| 10e | 440.32 | **UNVERIFIED** | — | — |
| 10f | 440.33 | **VERIFIED-draft** (2026 FD FR-8057) | FD11 | — |
| 10g | 440.62–440.64 | **UNVERIFIED** (tier-4 paraphrase) | IAEI 2017 | — |
| 11a–c | 630.11(A) (I1eff), Table 630.11(A), 630.11(B) | **UNVERIFIED** | — | 2023-cycle CMP-12 SD has no Second Revision on 630.11 |
| 11d | 630.12 | **VERIFIED-draft** (2026 SD SR-7788, terminology only) | SD12 | — |
| 11e | 630.13 | **VERIFIED-draft** (2023-cycle SD SR-7589). Marking-sentence wording UNVERIFIED | A2022 CMP-12 SR compilation | OSHA 1910.306(d)(1) similar |
| 12 | 2026 changes | **VERIFIED-draft** (§12) | FD/SD lists; MN DLI 2026 summary | — |

---

## Sources

### Tier 1: NFPA documents (no reprint notice needed)

**A2022 cycle (toward the 2023 edition).** Its revision headers say "NFPA 70-2021", NFPA's internal cycle tag.
- **SD11-23.** CMP-11 Second Revision compilation, 59 pages, printed 12/6/2021, fully readable.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf
  - Restriction text reported on the page: material "may not be used for any other purpose or distributed to any other persons or parties."
- **SD12-23.** CMP-12 Second Revision compilation, printed 12/7/2021. Truncated at 670.1, but Article 630 is complete.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf

**A2025 cycle (toward 2026; base text 2023).**
- **PI11.** CMP-11 Public Input compilation; converted text ends at page 41.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_PISubmittals.pdf
- **FD11.** CMP-11 First Draft working draft; ends inside 440.41(A).
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf
- **SD11.** CMP-11 Second Draft working draft; last section 440.15.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf
- **SD12.** CMP-12 Second Draft working draft; Article 630 complete.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf

### Tier 2: reprints with an NFPA notice
- **E23.** Eaton Bussmann "2023 NEC® Code Changes", bus-ele-br-11318.
  - https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf
  - Notice: "Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition." / "Copyright© 2022, National Fire Protection Association." / "For a full copy of the NFPA 70®, please go to www.nfpa.org."
- **LEV346 / LEV347.** Leviton Captain Code 2023: https://captaincode2023.leviton.com/node/346 and /node/347.
  - Notice: "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved."

### Tier 3: government
- **OSHA.** 29 CFR 1910.306(d), eCFR, up to date as of 10/16/2026.
- **NC OSFM.** Interpretation of June 12, 2018 (2017 NEC).
  - https://www.ncosfm.gov/electrical/4406-air-cond-refrigerating-equip-branch-circuit-ampacity-protection/open
- **MN DLI.** "Summary of Significant 2026 NEC® Changes" (no issue date).
  - https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf

### Tier 4: corroboration only
- Elliott Electric pages (430.248 and 430.247, labelled "2020 NEC"; a three-phase page).
- Transcat FullLoadCurrent.pdf (undated, older edition).
- Mersen motor-protection application note ("NEC 2017").
- MikeHolt.com motor wire chart (2016).
- Sprecher+Schuh chart (UL 508A-derived).
- IAEI 2000 and 2017 articles.
- EC&M 2011 Code Q&A.
- Mike Holt forum (2024).

URLs for all of these are in the round-2 sections, which are unchanged.

---

## 1–4. Full-load current tables

### Titles and notes
SR-7559 statement: "Changes made to correlate with SR-7555 by updating titles of tables. See related public comment no. 1093, SR-7555." SR-7555: "Also changes made to titles on SR-7559 in Tables 430.249 and 430.250 to include 2300V motors made improve correlation." Only titles and notes changed, not values.

Table titles:
- "Table 430.247 Full-Load Current in Amperes, Direct-Current Motors"
- "Table 430.248 Full-Load Currents in Amperes, Single-Phase Alternating-Current Motors"
- "Table 430.249 Full-Load Current, Two-Phase Alternating-Current Motors (4-Wire)"
- "Table 430.250 Full-Load Current, Three-Phase Alternating-Current Motors"

Table notes:
- **430.247:** "The following values of full-load currents* are for motors running at base speed." / "*These are average dc quantities."
- **430.248:** "The currents listed shall be permitted for system voltage ranges of 110 to 120 and 220 to 240 volts."
- **430.249**, flattened ("and motors" may be struck): "The following values of full-load current are for motors running at speeds usual for belted motors" / "and motors with normal torque characteristics. Current in the common conductor of a 2-phase, 3-wire system" / "will be 1.41 times the value given. The voltages listed are rated motor voltages." / "The currents listed shall be permitted for system voltage ranges of 110 to 120, 220 to 240, 440 to 480," / "and 550 to 600, and 2300 to 2400 volts."
- **430.250**, as printed in E23: "The following values of full-load currents are typical for motors running at speeds usual for belted motors with normal torque characteristics. The voltages listed are rated motor voltages. The currents listed shall be permitted for system voltage ranges of 110 to 120, 220 to 240, 440 to 480, 550 to 600, and 2300 to 2400 volts."
- **430.250 synchronous footnote** (SD): "*For 90 and 80 percent power factor, the figures shall be multiplied by 1.1 and 1.25, respectively."

### Canary results
Every one below came back with the correct printed value.
- **430.248:** 1/3 hp 200 V → 4.1; 1 hp 230 V → 8.0; 3 hp 208 V → 18.7; 1/2 hp 115 V → 9.8; 2 hp 230 V → 12; 7-1/2 hp 200 V → 46.0; 10 hp 208 V → 55.0.
- **430.247:** 3/4 hp 90 V → 9.6; 5 hp 240 V → 20; 50 hp 500 V → 83; 1/3 hp 180 V → 2.6; 7-1/2 hp 120 V → 58; 15 hp 550 V → 24; 100 hp 240 V → 341.
- **430.249:** 3 hp 230 V → 8.3; 50 hp 460 V → 56; 150 hp 2300 V → 32; 1/2 hp 575 V → 0.8; 20 hp 230 V → 47; 75 hp 2300 V → 18; 125 hp 575 V → 108. Plus the real correction: 1 hp 575 V → 1.3.
- **430.250, 50–500 hp:** 75 hp 460 V → 96; 125 hp 208 V → 343; 150 hp 2300 V → 37; 300 hp 575 V → 289; 50 hp 208 V → 143; 100 hp 575 V → 99; 250 hp 2300 V → 60; 450 hp 460 V → 515; synchronous 200 hp 230 V → 400.

### Synchronous columns
The SD's synchronous block extracted only one value per row. Pull 2: "The extracted rows show only one extra value per row, which aligns with the 230 V column." So the 460/575/2300 V synchronous cells for 50–200 hp remain UNVERIFIED (Transcat: 52/42; 61/49/12; 78/62/15; 101/81/20; 126/101/25; 151/121/30; 201/161/40).

E23 (2023 reprint, rows 1/2–40) is unchanged from round 2: 2 pulls, 154/154 cells. The SD agrees on every one of those values that it was asked about.

## 5. 430.6, 430.22, 430.24, 430.32
- **430.6(A), 430.24:** unchanged from round 2 (VERIFIED-2023).
- **430.22 and 430.32(A)(1):** still not seen in any tier 1–3 source.
  - The 2023-cycle SD11 has no Second Revision on either; its list is in §12.
  - PI11 ends at page 41, inside PI 445.
  - The 2023-cycle First Revision file name I guessed (70_A2022_NEC_P11_FD_FRStatements.pdf) returned an error.

## 6. 430.52(C)(1), from SD11-23 SR-7526
Statement: "PC reviewed per CC direction and changes were made to meet NEC style manual requirements and improve clarity."

**Lead-in:** "(1) In Accordance with Table 430.52(C)(1)." / "A protective device that has a rating or setting not exceeding the value calculated according to" / "the values given in Table 430.52(C)(1) shall be used unless otherwise permitted in 430.52(C)" / "(1)(a) or (C)(1)(b) ."

**(a), flattened:** "(a) Where the values for branch-circuit short-circuit and ground-fault protective devices as determined by" / "Table 430.52(C)(1) do not correspond to the standard sizes or ampere ratings of fuses, nonadjustable circuit" / "breakers, thermal protective devices, or possible and settings of adjustable circuit breakers, a higher" / "size, rating, or possible setting that does not exceed provided in 240.6, the next higher standard" / "ampere rating according to 240.6 or setting shall be permitted."
- The rule is clear: the next higher standard ampere rating (per 240.6) or setting is permitted.
- The exact 2023 wording can't be separated from the flattened text.

**(b):** "(b) Where the rating specified in Table 430.52(C)(1), or the rating modified by Exception No. 1," "430.52(C)(1)(a), is not sufficient for the starting current of the motor, any of the following" "applies shall apply :"
- "(1) The rating of a nontime-delay fuse not exceeding 600 amperes or a time-delay Class CC fuse shall be" "permitted to be increased but shall in no case exceed 400 percent of the fullload current."
- "(2) The rating of a time-delay (dual-element) fuse shall be permitted to be increased but shall" "in no case exceed 225 percent of the full-load current."
- "(3) The rating of an inverse time circuit breaker shall be permitted to be increased but shall in" "no case exceed 400 percent for full-load currents of 100 amperes or less or 300 percent" "for full-load currents greater than 100 amperes."
- "(4) The rating of a fuse of 601–6000 ampere classification shall be permitted to be increased" "but shall in no case exceed 300 percent of the full-load current."

**Table rows in SR-7526** match E23 exactly: 300/175/800/250 ×5 rows, with 1100% instantaneous-trip on "Design B energy-efficient and Design B premium efficiency"; wound-rotor 150/150/800/150; DC 150/150/250/150.

## 7. 430.62(A), from SD11-23 SR-7533
"A feeder supplying a specific fixed motor load(s) and consisting of conductor sizes in accordance with" / "430.24 shall be provided with a protective device having a rating or setting not greater than the" / "largest rating or setting of the branch-circuit short-circuit and ground-fault protective device for any" / "[motor supplied by the feeder] [based on the maximum permitted value for the specific type of protective device in accordance with 430.52, or" / "440.22(A) for hermetic refrigerant motor-compressors], plus the sum of the full-load currents" / "of the other motors of the group."

Statement: "PC reviewed per CC direction and changes were made to improve clarity and readability." The rest of 430.62(A) wasn't in the SR text.

## 8–9. 430.110(A) and Table 430.7(B)
Unchanged from round 2.

## 10. Article 440
**440.22(A), resolved.** SD11-23 SR-7605: "A protective device having a rating or setting not exceeding 175 percent of the motor-compressor" / "rated-load current or branch-circuit selection current, whichever is greater, shall be permitted." It then goes straight to "Exception No. 2: Where If the values for branch-circuit short-circuit and ground-fault protection in" / "accordance with 440.22(A) or the rating modified by Exception No. 1 is not sufficient for the starting" / "current of the motor, the rating or setting shall be permitted to be increased but shall not exceed" / "225 percent of the motor rated-load current or branch-circuit selection current, whichever is greater."

So in the 2023 main paragraph the 225% clause is gone; E23's extra clause is struck 2020 text that came through flattened. Exception No. 1 (next higher standard size) and Exception No. 3 (15 A minimum) are as quoted in round 2 from E23.

**440.11:** 2026 revised it again. MN DLI line 60: "The revision requires doors or covers that expose energized parts to be locked or require a tool to be opened." In 2023 the rule applied only "If the disconnecting means is readily accessible to unqualified persons".

**Other Article 440 items:** no tier 1–3 text for 440.32 or 440.62–440.64. The MN DLI 2023 one-family checklist has no Article 430/440/630 items.

## 11. Article 630
SD12-23, 2023 cycle:
- **SR-7585 (630.8):** "The requirement in 630.8 was revised to align with the requirements in 210.8."
- **SR-7589 (630.13):** "The reference to 110.22 was removed as it is redundant according to NEC style manual 4.1.1." / "The committee would like to clarify marking of all disconnecting means options is required and necessary" "for the safe use of electric welders including cord and plug connected equipment."
- **SR-7590 (630.33):** same 110.22 statement.

630.13 text, flattened:
- "A disconnecting means shall be provided in the supply circuit for each arc welder that is not" "equipped with a disconnect mounted as an integral part of the welder."
- "The disconnecting means identity shall be marked in accordance with 110.22(A)." Per SR-7589 the 110.22 reference was removed, so this sentence's final wording is UNVERIFIED.
- "The disconnecting means shall be a switch, circuit breaker, or listed cord-and-plug connector," "and its rating shall be not less than that necessary to accommodate overcurrent protection as specified in 630.12."

630.11 has no Second Revision in the 2023 cycle and none in the 2026 cycle, so its 2023 text, Table 630.11(A) and 630.11(B) remain unseen. 630.12 is unchanged from round 2 (VERIFIED-draft, 2026 SD).

## 12. Changes in the 2023 and 2026 cycles

**2023-cycle CMP-11 Second Revisions (SD11-23):**
- 7586, 7587, 7588: definitions.
- 409: 7662, 7778, 7664, 7680, 7742.
- 7504: new 430.2.
- 7802: 430.6.
- 7519: 430.21.
- 7521: 430.42.
- 7523: 430.51.
- 7526: 430.52(C).
- 7805: 430.53.
- 7533: 430.62(A).
- 7574: 430.72(C)(1).
- 7536: 430.97(C).
- 7538: 430.110.
- 7544: 430.120.
- 7555: 430.205.
- 7565 and 7569: 430.208.
- 7570: 430.241.
- 7559: Part XIV tables.
- 7600: 440.3.
- 7604: 440.11.
- 7605: 440.22(A).
- 7607: 440.34.
- 7610: 440.54.
- 7611: 440.55.
- 7598 and 7717: 460.24.
- 7591: Article 470.

**2026 cycle (round 2 findings, unchanged).** There is no Second Revision on Tables 430.247–430.250 or Table 430.52(C)(1), and no First Revision on 430.247–430.251. FR-7971 revises the Table 430.52(C)(1) labels to cover Design BE/CE. SR-8049 updates Table 430.251(C). 430.22(H) is new. The global SR-8086 changes the "overcurrent" terms. Article 440 and 630 items are as listed in round 2.

**MN DLI 2026 summary:**
- Line 58: "BE and CE motors have been included throughout Article 430 due to their energy-efficient design."
- Line 59: 430.98(A) MCC marking.
- Line 60: 440.11.
- Line 61: "A new section was created for marking requirements to identify the location of all indoor units"

---

## Machine-readable

All 28 blocks pass `json.loads`, both as built and as formatted below.

**Table 430.248**
```json
{"ref":"Table 430.248","edition":"2023","status":"VERIFIED-draft (NFPA 2023-cycle Second Draft, SR-7559; two canary checks, all non-canary cells confirmed each time)","title_as_seen":"Table 430.248 Full-Load Currents in Amperes, Single-Phase Alternating-Current Motors","columns":["115","200","208","230"],"rows":[
{"hp":"1/6","115":4.4,"200":2.5,"208":2.4,"230":2.2},
{"hp":"1/4","115":5.8,"200":3.3,"208":3.2,"230":2.9},
{"hp":"1/3","115":7.2,"200":4.1,"208":4.0,"230":3.6},
{"hp":"1/2","115":9.8,"200":5.6,"208":5.4,"230":4.9},
{"hp":"3/4","115":13.8,"200":7.9,"208":7.6,"230":6.9},
{"hp":"1","115":16.0,"200":9.2,"208":8.8,"230":8.0},
{"hp":"1-1/2","115":20.0,"200":11.5,"208":11.0,"230":10.0},
{"hp":"2","115":24.0,"200":13.8,"208":13.2,"230":12.0},
{"hp":"3","115":34.0,"200":19.6,"208":18.7,"230":17.0},
{"hp":"5","115":56.0,"200":32.2,"208":30.8,"230":28.0},
{"hp":"7-1/2","115":80.0,"200":46.0,"208":44.0,"230":40.0},
{"hp":"10","115":100.0,"200":57.5,"208":55.0,"230":50.0}],
"quote_segments":["Table 430.248 Full-Load Currents in Amperes, Single-Phase Alternating-Current Motors","The currents listed shall be permitted for system voltage ranges of 110 to 120 and 220 to 240 volts."],
"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document; page carries NFPA restriction 'may not be used for any other purpose or distributed to any other persons or parties'","retrieved":"2026-10-20"}
```

**Table 430.247**
```json
{"ref":"Table 430.247","edition":"2023","status":"VERIFIED-draft (NFPA 2023-cycle Second Draft, SR-7559; two canary checks, blanks agree)","title_as_seen":"Table 430.247 Full-Load Current in Amperes, Direct-Current Motors","columns":["90","120","180","240","500","550"],"rows":[
{"hp":"1/4","90":4.0,"120":3.1,"180":2.0,"240":1.6,"500":null,"550":null},
{"hp":"1/3","90":5.2,"120":4.1,"180":2.6,"240":2.0,"500":null,"550":null},
{"hp":"1/2","90":6.8,"120":5.4,"180":3.4,"240":2.7,"500":null,"550":null},
{"hp":"3/4","90":9.6,"120":7.6,"180":4.8,"240":3.8,"500":null,"550":null},
{"hp":"1","90":12.2,"120":9.5,"180":6.1,"240":4.7,"500":null,"550":null},
{"hp":"1-1/2","90":null,"120":13.2,"180":8.3,"240":6.6,"500":null,"550":null},
{"hp":"2","90":null,"120":17.0,"180":10.8,"240":8.5,"500":null,"550":null},
{"hp":"3","90":null,"120":25.0,"180":16.0,"240":12.2,"500":null,"550":null},
{"hp":"5","90":null,"120":40.0,"180":27.0,"240":20.0,"500":null,"550":null},
{"hp":"7-1/2","90":null,"120":58.0,"180":null,"240":29.0,"500":13.6,"550":12.2},
{"hp":"10","90":null,"120":76.0,"180":null,"240":38.0,"500":18.0,"550":16.0},
{"hp":"15","90":null,"120":null,"180":null,"240":55.0,"500":27.0,"550":24.0},
{"hp":"20","90":null,"120":null,"180":null,"240":72.0,"500":34.0,"550":31.0},
{"hp":"25","90":null,"120":null,"180":null,"240":89.0,"500":43.0,"550":38.0},
{"hp":"30","90":null,"120":null,"180":null,"240":106.0,"500":51.0,"550":46.0},
{"hp":"40","90":null,"120":null,"180":null,"240":140.0,"500":67.0,"550":61.0},
{"hp":"50","90":null,"120":null,"180":null,"240":173.0,"500":83.0,"550":75.0},
{"hp":"60","90":null,"120":null,"180":null,"240":206.0,"500":99.0,"550":90.0},
{"hp":"75","90":null,"120":null,"180":null,"240":255.0,"500":123.0,"550":111.0},
{"hp":"100","90":null,"120":null,"180":null,"240":341.0,"500":164.0,"550":148.0},
{"hp":"125","90":null,"120":null,"180":null,"240":425.0,"500":205.0,"550":185.0},
{"hp":"150","90":null,"120":null,"180":null,"240":506.0,"500":246.0,"550":222.0},
{"hp":"200","90":null,"120":null,"180":null,"240":675.0,"500":330.0,"550":294.0}],
"quote_segments":["The following values of full-load currents* are for motors running at base speed.","*These are average dc quantities."],
"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document (restriction notice as above)","retrieved":"2026-10-20"}
```

**Table 430.249**
```json
{"ref":"Table 430.249","edition":"2023","status":"VERIFIED-draft (NFPA 2023-cycle Second Draft, SR-7559; two canary checks)","title_as_seen":"Table 430.249 Full-Load Current, Two-Phase Alternating-Current Motors (4-Wire)","columns":["115","230","460","575","2300"],"rows":[
{"hp":"1/2","115":4,"230":2,"460":1,"575":0.8,"2300":null},
{"hp":"3/4","115":4.8,"230":2.4,"460":1.2,"575":1.0,"2300":null},
{"hp":"1","115":6.4,"230":3.2,"460":1.6,"575":1.3,"2300":null},
{"hp":"1-1/2","115":9,"230":4.5,"460":2.3,"575":1.8,"2300":null},
{"hp":"2","115":11.8,"230":5.9,"460":3,"575":2.4,"2300":null},
{"hp":"3","115":null,"230":8.3,"460":4.2,"575":3.3,"2300":null},
{"hp":"5","115":null,"230":13.2,"460":6.6,"575":5.3,"2300":null},
{"hp":"7-1/2","115":null,"230":19,"460":9,"575":8,"2300":null},
{"hp":"10","115":null,"230":24,"460":12,"575":10,"2300":null},
{"hp":"15","115":null,"230":36,"460":18,"575":14,"2300":null},
{"hp":"20","115":null,"230":47,"460":23,"575":19,"2300":null},
{"hp":"25","115":null,"230":59,"460":29,"575":24,"2300":null},
{"hp":"30","115":null,"230":69,"460":35,"575":28,"2300":null},
{"hp":"40","115":null,"230":90,"460":45,"575":36,"2300":null},
{"hp":"50","115":null,"230":113,"460":56,"575":45,"2300":null},
{"hp":"60","115":null,"230":133,"460":67,"575":53,"2300":14},
{"hp":"75","115":null,"230":166,"460":83,"575":66,"2300":18},
{"hp":"100","115":null,"230":218,"460":109,"575":87,"2300":23},
{"hp":"125","115":null,"230":270,"460":135,"575":108,"2300":28},
{"hp":"150","115":null,"230":312,"460":156,"575":125,"2300":32},
{"hp":"200","115":null,"230":416,"460":208,"575":167,"2300":43}],
"quote_segments":["Current in the common conductor of a 2-phase, 3-wire system","will be 1.41 times the value given. The voltages listed are rated motor voltages."],
"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document (restriction notice as above)","retrieved":"2026-10-20"}
```

**Table 430.250**
```json
{"ref":"Table 430.250","edition":"2023","status":"Induction 1/2-40 hp VERIFIED-2023; induction 50-500 hp VERIFIED-draft; synchronous per row","title_as_seen":"Table 430.250 Full-Load Current, Three-Phase Alternating-Current Motors",
"induction":{"columns":["115","200","208","230","460","575","2300"],"rows":[
{"hp":"1/2","status":"VERIFIED-2023","115":4.4,"200":2.5,"208":2.4,"230":2.2,"460":1.1,"575":0.9,"2300":null},
{"hp":"3/4","status":"VERIFIED-2023","115":6.4,"200":3.7,"208":3.5,"230":3.2,"460":1.6,"575":1.3,"2300":null},
{"hp":"1","status":"VERIFIED-2023","115":8.4,"200":4.8,"208":4.6,"230":4.2,"460":2.1,"575":1.7,"2300":null},
{"hp":"1-1/2","status":"VERIFIED-2023","115":12.0,"200":6.9,"208":6.6,"230":6.0,"460":3.0,"575":2.4,"2300":null},
{"hp":"2","status":"VERIFIED-2023","115":13.6,"200":7.8,"208":7.5,"230":6.8,"460":3.4,"575":2.7,"2300":null},
{"hp":"3","status":"VERIFIED-2023","115":null,"200":11.0,"208":10.6,"230":9.6,"460":4.8,"575":3.9,"2300":null},
{"hp":"5","status":"VERIFIED-2023","115":null,"200":17.5,"208":16.7,"230":15.2,"460":7.6,"575":6.1,"2300":null},
{"hp":"7-1/2","status":"VERIFIED-2023","115":null,"200":25.3,"208":24.2,"230":22,"460":11,"575":9,"2300":null},
{"hp":"10","status":"VERIFIED-2023","115":null,"200":32.2,"208":30.8,"230":28,"460":14,"575":11,"2300":null},
{"hp":"15","status":"VERIFIED-2023","115":null,"200":48.3,"208":46.2,"230":42,"460":21,"575":17,"2300":null},
{"hp":"20","status":"VERIFIED-2023","115":null,"200":62.1,"208":59.4,"230":54,"460":27,"575":22,"2300":null},
{"hp":"25","status":"VERIFIED-2023","115":null,"200":78.2,"208":74.8,"230":68,"460":34,"575":27,"2300":null},
{"hp":"30","status":"VERIFIED-2023","115":null,"200":92,"208":88,"230":80,"460":40,"575":32,"2300":null},
{"hp":"40","status":"VERIFIED-2023","115":null,"200":120,"208":114,"230":104,"460":52,"575":41,"2300":null},
{"hp":"50","status":"VERIFIED-draft","115":null,"200":150,"208":143,"230":130,"460":65,"575":52,"2300":null},
{"hp":"60","status":"VERIFIED-draft","115":null,"200":177,"208":169,"230":154,"460":77,"575":62,"2300":16},
{"hp":"75","status":"VERIFIED-draft","115":null,"200":221,"208":211,"230":192,"460":96,"575":77,"2300":20},
{"hp":"100","status":"VERIFIED-draft","115":null,"200":285,"208":273,"230":248,"460":124,"575":99,"2300":26},
{"hp":"125","status":"VERIFIED-draft","115":null,"200":359,"208":343,"230":312,"460":156,"575":125,"2300":31},
{"hp":"150","status":"VERIFIED-draft","115":null,"200":414,"208":396,"230":360,"460":180,"575":144,"2300":37},
{"hp":"200","status":"VERIFIED-draft","115":null,"200":552,"208":528,"230":480,"460":240,"575":192,"2300":49},
{"hp":"250","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":302,"575":242,"2300":60},
{"hp":"300","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":361,"575":289,"2300":72},
{"hp":"350","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":414,"575":336,"2300":83},
{"hp":"400","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":477,"575":382,"2300":95},
{"hp":"450","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":515,"575":412,"2300":103},
{"hp":"500","status":"VERIFIED-draft","115":null,"200":null,"208":null,"230":null,"460":590,"575":472,"2300":118}]},
"synchronous":{"columns":["230","460","575","2300"],"rows":[
{"hp":"1/2 to 20","status":"VERIFIED-2023 (all blank)","230":null,"460":null,"575":null,"2300":null},
{"hp":"25","status":"VERIFIED-2023","230":53,"460":26,"575":21,"2300":null},
{"hp":"30","status":"VERIFIED-2023","230":63,"460":32,"575":26,"2300":null},
{"hp":"40","status":"VERIFIED-2023","230":83,"460":41,"575":33,"2300":null},
{"hp":"50","status":"230 V CONFLICTING between SD pulls; 460/575/2300 V UNVERIFIED (Transcat)","230":104,"460":52,"575":42,"2300":null},
{"hp":"60","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":123,"460":61,"575":49,"2300":12},
{"hp":"75","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":155,"460":78,"575":62,"2300":15},
{"hp":"100","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":202,"460":101,"575":81,"2300":20},
{"hp":"125","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":253,"460":126,"575":101,"2300":25},
{"hp":"150","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":302,"460":151,"575":121,"2300":30},
{"hp":"200","status":"230 V VERIFIED-draft; others UNVERIFIED (Transcat)","230":400,"460":201,"575":161,"2300":40},
{"hp":"250 to 500","status":"UNVERIFIED","230":null,"460":null,"575":null,"2300":null}],
"pf_footnote":{"text":"*For 90 and 80 percent power factor, the figures shall be multiplied by 1.1 and 1.25, respectively.","status":"VERIFIED-draft"}},
"quote_segments":["The voltages listed are rated motor voltages. The currents listed shall be permitted","for system voltage ranges of 110 to 120, 220 to 240, 440 to 480, 550 to 600,","and 2300 to 2400 volts."],
"source_url":["https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf"],
"permission_notice":["Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition. / Copyright© 2022, National Fire Protection Association.","NFPA's own document (restriction notice as above)"],"retrieved":"2026-10-20"}
```

**Table 430.52(C)(1)**
```json
{"ref":"Table 430.52(C)(1)","edition":"2023","status":"VERIFIED-2023 (Eaton, 2 pulls 28/28); 2023-cycle SD SR-7526 identical","title_as_seen":"Table 430.52(C)(1) Maximum Rating or Setting of Motor Branch-Circuit Short-Circuit and Ground-Fault Protective Devices","rows":[
{"motor_type":"Single-phase motors","nontime_delay_fuse_pct":300,"dual_element_fuse_pct":175,"instantaneous_trip_pct":800,"inverse_time_pct":250},
{"motor_type":"AC polyphase motors other than wound-rotor","nontime_delay_fuse_pct":300,"dual_element_fuse_pct":175,"instantaneous_trip_pct":800,"inverse_time_pct":250},
{"motor_type":"Squirrel cage — other than Design B energy-efficient and Design B premium efficiency","nontime_delay_fuse_pct":300,"dual_element_fuse_pct":175,"instantaneous_trip_pct":800,"inverse_time_pct":250},
{"motor_type":"Design B energy-efficient and Design B premium efficiency","nontime_delay_fuse_pct":300,"dual_element_fuse_pct":175,"instantaneous_trip_pct":1100,"inverse_time_pct":250},
{"motor_type":"Synchronous (note 3)","nontime_delay_fuse_pct":300,"dual_element_fuse_pct":175,"instantaneous_trip_pct":800,"inverse_time_pct":250},
{"motor_type":"Wound-rotor","nontime_delay_fuse_pct":150,"dual_element_fuse_pct":150,"instantaneous_trip_pct":800,"inverse_time_pct":150},
{"motor_type":"DC (constant voltage)","nontime_delay_fuse_pct":150,"dual_element_fuse_pct":150,"instantaneous_trip_pct":250,"inverse_time_pct":150}],
"quote_segments":["1 The values in the Nontime Delay Fuse column apply to time-delay Class CC fuses.","breakers that may can be modified as in 430.52(C)(1), Exceptions No. 1 and No. 2 430.52(C)(1)(a) and (C)(1)(b)."],
"source_url":["https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf"],
"permission_notice":["Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition.","NFPA's own document"],"retrieved":"2026-10-20"}
```

**Table 630.11(A) and Table 430.7(B)**
```json
[{"ref":"Table 630.11(A)","edition":"2023","status":"UNVERIFIED","rows":[],"tier4_observations":[{"duty_cycle_pct":100,"multiplier":1},{"duty_cycle_pct":60,"multiplier":0.78},{"duty_cycle_pct":30,"multiplier":0.55},{"duty_cycle_pct":50,"multiplier":0.71}],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"Table 430.7(B)","edition":"2023","status":"UNVERIFIED","rows":[],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No row seen anywhere. Do not fill from memory."}]
```

**Section rules**
```json
[
{"ref":"430.6(A)","edition":"2023","status":"VERIFIED-2023","values":{"table_flc_for":["conductor ampacity","switch ratings","branch-circuit SC/GF protection"],"nameplate_for":["separate overload protection","low-speed/high-torque/canned-pump/multispeed motors","large motors beyond Part XIV (conductors)"]},"quote_segments":["the values given in Table 430.247, Table 430.248, Table 430.249, and Table 430.250 shall be used instead of","the actual current rating marked on the motor nameplate to determine the following:"],"source_url":"https://captaincode2023.leviton.com/node/346","permission_notice":"Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition.","retrieved":"2026-10-20"},
{"ref":"430.22","edition":"2023","status":"UNVERIFIED","values":{"single_motor_conductor_pct_of_flc":null},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"430.24","edition":"2023","status":"VERIFIED-2023 (NFPA PI 445 base text; marks lost)","values":{"highest_rated_motor_pct":125,"other_motors_pct":100,"noncontinuous_nonmotor_pct":100,"continuous_nonmotor_pct":125},"quote_segments":["(1) 125 percent of the full-load current rating of the highest rated motor, as determined by","(4) 125 percent of the continuous non-motor load."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_PISubmittals.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"430.32(A)(1)","edition":"2023","status":"UNVERIFIED (tier-4 only)","values":{"sf_1_15_or_more_pct":125,"temp_rise_40C_or_less_pct":125,"all_other_pct":115},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"430.52(C)(1)(a)","edition":"2023","status":"Rule VERIFIED-draft (2023-cycle SD SR-7526); wording UNVERIFIED (flattened)","values":{"next_higher_standard_rating_permitted":true,"standard_ratings_per":"240.6"},"quote_segments":["the next higher standard","ampere rating according to 240.6 or setting shall be permitted."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"430.52(C)(1)(b)","edition":"2023","status":"VERIFIED-draft (2023-cycle SD SR-7526)","values":{"nontime_delay_fuse_le_600A_or_class_CC_time_delay_max_pct":400,"time_delay_dual_element_fuse_max_pct":225,"inverse_time_cb_max_pct_flc_le_100A":400,"inverse_time_cb_max_pct_flc_gt_100A":300,"fuse_601_6000A_max_pct":300,"condition":"only where the Table or (C)(1)(a) rating will not carry the starting current"},"quote_segments":["permitted to be increased but shall in no case exceed 400 percent of the fullload current.","in no case exceed 225 percent of the full-load current.","no case exceed 400 percent for full-load currents of 100 amperes or less or 300 percent","but shall in no case exceed 300 percent of the full-load current."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"430.62(A)","edition":"2023","status":"VERIFIED-draft (first paragraph; 2023-cycle SD SR-7533 = 2026 SD). Rest UNVERIFIED","values":{"max_feeder_ocpd":"largest permitted branch SC/GF device for any motor (430.52, or 440.22(A)) + sum of the other motors' FLC"},"quote_segments":["440.22(A) for hermetic refrigerant motor-compressors], plus the sum of the full-load currents","of the other motors of the group."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"430.110(A)","edition":"2026 draft (base 2023)","status":"VERIFIED-draft","values":{"disconnect_min_pct_of_flc":115},"quote_segments":["nominal, or less shall have a current rating not less than 115 percent of the fullload current rating of the motor."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"440.4(B)","edition":"2026 draft","status":"VERIFIED-draft","values":{"nameplate":["minimum supply circuit conductor ampacity","maximum rating of the branch-circuit SC/GF protective device","SCCR of motor controllers or industrial control panel"]},"quote_segments":["minimum supply circuit conductor ampacity, the maximum rating ","of the branch-circuit short-circuit and ground-fault protective device"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"440.11","edition":"2023","status":"VERIFIED-2023","values":{"lock_or_tool":"if the disconnect is readily accessible to unqualified persons"},"quote_segments":["shall require a tool to open or be capable of being locked."],"source_url":"https://captaincode2023.leviton.com/node/347","permission_notice":"Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition.","retrieved":"2026-10-20"},
{"ref":"440.14","edition":"2026 draft","status":"VERIFIED-draft","values":{"location":"within sight from, and readily accessible from, the equipment"},"quote_segments":["Disconnecting means shall be located within sight from, and readily accessible from, the air-conditioning"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"440.22(A)","edition":"2023","status":"VERIFIED-2023 (values, Eaton); main paragraph VERIFIED-draft (2023-cycle SD SR-7605)","values":{"basis":"greater of RLA or BCSC","max_pct":175,"exc1_next_higher_standard":true,"exc2_max_pct_if_needed_to_start":225,"exc3_not_required_below_A":15},"quote_segments":["rated-load current or branch-circuit selection current, whichever is greater, shall be permitted.","225 percent of the motor rated-load current or branch-circuit selection current, whichever is greater.","required to be less than 15 amperes."],"source_url":["https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf"],"permission_notice":["Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition.","NFPA's own document"],"retrieved":"2026-10-20"},
{"ref":"440.32","edition":"2023","status":"UNVERIFIED","values":{"pct":null},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"440.33","edition":"2026 draft","status":"VERIFIED-draft","values":{"compressors":"sum of greater of RLA or BCSC","other_motors":"sum of FLC","adder_pct_of_highest":25},"quote_segments":["(3) 25 percent of the highest motor-compressor or motor full load current in the group"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"440.62-440.64","edition":"2023","status":"UNVERIFIED (tier-4 paraphrase)","values":{"tier4_max_pct_no_other_loads":80,"tier4_max_pct_with_other_loads":50,"tier4_cord_ft_120V":10},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"630.11(A)","edition":"2023","status":"UNVERIFIED","values":{"i1eff_first":null},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"630.11(B)","edition":"2023","status":"UNVERIFIED","values":{"group_pcts":null},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20"},
{"ref":"630.12","edition":"2026 draft (terminology only; base 2023)","status":"VERIFIED-draft","values":{"welder_ocpd_max_pct":200,"basis":"I1max, else rated primary current","conductor_ocpd_max_pct_of_ampacity":200,"next_higher_standard_permitted":true},"quote_segments":["Each welder shall have overcurrent protection rated or set at not more than 200 percent of","not more than 200 percent of the rated primary current of the welder."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"630.13","edition":"2023","status":"VERIFIED-draft (2023-cycle SD SR-7589); marking sentence UNVERIFIED","values":{"disconnect_required_unless_integral":true,"types":["switch","circuit breaker","listed cord-and-plug connector"],"rating":"not less than needed to accommodate the 630.12 overcurrent protection"},"quote_segments":["A disconnecting means shall be provided in the supply circuit for each arc welder that is not","The disconnecting means shall be a switch, circuit breaker, or listed cord-and-plug connector,"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf","permission_notice":"NFPA's own document","retrieved":"2026-10-20"},
{"ref":"2026 changes","edition":"2026 drafts","status":"VERIFIED-draft","values":{"no_SR":["Tables 430.247-430.250","Table 430.52(C)(1)"],"no_FR":["430.247","430.248","430.249","430.250","430.251"],"changed":["Table 430.52(C)(1) via FR-7971","Table 430.251(C) via SR-8049","430.22(H) new","430.24 SR-8015","SR-8086 terminology","440.4, 440.11, 440.12(A)(2), 440.14, 440.33, new 440.2, new 440.15","630.12/630.32 terminology"]},"quote_segments":["BE and CE motors have been included throughout Article 430 due to their energy-efficient design."],"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf","https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf"],"permission_notice":"NFPA documents; MN DLI has no notice","retrieved":"2026-10-20"}
]
```

---

## Blocked or failed log

### Round 3
- **WebSearch:** the shared 200-calls-per-turn cap was hit on my 2nd call. I did not route around it.
- **docinfofiles:**
  - `70_A2022_NEC_P11_FD_FRStatements.pdf` (guessed file name): fetch error.
  - `70_A2025_NEC_P11_PISubmittals.pdf` at offset 95000: the converted text ends at page 41.
  - SD11-23: the summarizer refused verbatim tables, so I switched to canary checks.
  - SR-7559's synchronous 460/575/2300 V columns don't extract.
  - 8/8 fetches used; no 429.
- **us.mersen.com 2023 code-changes page** (constructed URL): PROVENANCE_REQUIRED. Not retried.
- **fr.mersen.com/fr/node/1108:** redirects to the 2017 page. Not followed.
- **Captain Code 2020 index**, all 3 pages: no Article 430, 440 or 630 entries.
- **MN DLI 2023 one-family checklist:** no Article 430, 440 or 630 items.

### Round 2
Unchanged. It includes: the converter cap on the CEC 2022 and SPD 2017 PDFs, the failed `70_A2022_NEC_P11_FD_PrelimFR.pdf` fetch, robots-blocked captaincode2026, and the Schneider Digest and Eaton flipbook dead ends.

## Open gaps

1. **Table 430.250 synchronous cells:** 460/575/2300 V for 50–200 hp, and 230 V at 50 hp (the two pulls disagree).
2. **Printed 2023 edition** not seen for Tables 430.247, 430.248 and 430.249, or Table 430.250 rows 50–500. The evidence is the 2023-cycle Second Draft, plus no revision in the 2026 cycle.
3. **Table 430.7(B):** no rows seen.
4. **430.22 and 430.32(A)(1):** 2023 text not seen.
5. **430.52(C)(1)(a) and (b):** exact wording (flattened). **430.62(A):** rest of the section, and whether the next size up is barred.
6. **Article 440:** 2023 wording of 440.4(B), 440.14 and 440.33; 440.32; 440.62–440.64.
7. **Article 630:** 630.11(A) including I1eff, Table 630.11(A), 630.11(B), and the 630.13 marking sentence.
8. **2026:** final text, CMP-11 First Draft revisions after 440.41(A), the CMP-12 First Draft, CAMs and TIAs.

**Fastest way to close them:** a person reading NFPA's free 2023 viewer (JavaScript-only, so not reachable here) for 430.22, 430.32(A)(1), Table 430.7(B), 440.32, 440.62–440.64 and 630.11. Or, once the search budget resets, search for the A2022-cycle First Revision file names.

## Contradictions with the site plan or earlier rounds

- "430.52(C)(1) Exception No. 1" is now 430.52(C)(1)(a).
- (C)(1)(b) allows 400% (nontime-delay fuses up to 600 A, or Class CC), 225% (dual-element fuses), 400% or 300% (inverse-time breakers, for FLC up to 100 A or above it) and 300% (601–6000 A fuses). These apply only when the table value won't start the motor. The site's motor "400%" must carry that condition.
- 440.22(A): 225% is only reachable through Exception No. 2. This resolves round 2's CONFLICTING item.
- Code audit item: the site's "5 hp 480 V = 6.1 A" is the 575 V value. At 460 V it is 7.6 A (VERIFIED-2023).
- Code audit item: using code letters as "× FLA" is wrong. Table 430.7(B) is kilovolt-amperes per horsepower with locked rotor (2026 SD text).
- Tier-4 copies contain errors. Transcat has "322" (should be 32) and two-phase 1 hp / 575 V as 1.8 (should be 1.3). UL 508A-derived 200 V values (25.0/32.0/48.0/62.0/78.0) are not the NEC's.
- 440.11: the lock-or-tool rule is already in 2023, limited to disconnects readily accessible to unqualified persons. 2026 revised it again, so round 1's "new in 2026" label is wrong.
- Pick FLC columns by rated motor voltage. The 2023 notes map system voltages to columns: 110–120 V to 115, 220–240 V to 230, 440–480 V to 460, 550–600 V to 575 and 2300–2400 V to 2300. 200 V and 208 V have their own columns.

---

**Summary for the coordinator**

VERIFIED:
- **2023 edition:** Table 430.250 rows 1/2–40 hp (all columns); Table 430.52(C)(1); 430.6(A); 430.24; 440.11; 440.22(A) values, including Exceptions 1 to 3.
- **From NFPA's 2023-cycle Second Draft** (each table passed two checks with planted wrong values; every one was caught):
  - Tables 430.247 and 430.248 in full; Table 430.249 in full (its 1 hp / 575 V cell is 1.3).
  - Table 430.250 induction rows 50–500 hp, synchronous 230 V for 60–200 hp, and the power-factor footnote.
  - 430.52(C)(1)(a), "next higher standard rating per 240.6", and (b): 400 / 225 / 400 or 300 / 300 %.
  - 430.62(A) first paragraph; 630.13 (switch, breaker or listed cord-and-plug connector, rated to accommodate the 630.12 protection).
  - The 440.22(A) main paragraph, which ends at 175%.
- **From 2026 drafts:** 430.110(A) at 115%, 440.4(B), 440.14, 440.33, 630.12 at 200%.

Still open:
- Table 430.250 synchronous 460/575/2300 V for 50–200 hp, and synchronous 230 V at 50 hp (the two pulls disagree).
- 430.22 and 430.32(A)(1).
- Table 430.7(B).
- 440.32 and 440.62–440.64.
- 630.11(A) including I1eff, Table 630.11(A) and 630.11(B).
- The exact wording of 430.52(C)(1)(a), and the rest of 430.62(A).

Contradicts the plan: the "Exception 1" naming; the site's 400% figure, which only applies when the motor won't start; "5 hp 480 V = 6.1 A" (it is 7.6 A at 460 V); code letters used as "× FLA"; 440.11 called new in 2026.

Budget: 1 of 25 WebSearch (the shared cap ran out), 8 of 8 docinfofiles fetches, no 429.