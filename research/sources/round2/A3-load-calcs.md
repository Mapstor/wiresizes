# A3: Dwelling load-calculation rules, NEC 2023 Article 220 and their 2026 Article 120 locations

- Retrieval date for every source: **2026-10-20**.
- Budgets used: WebSearch 18 of 18; docinfofiles.nfpa.org 6 of 6 fetches. No HTTP 429 was received.
- Method note: every quote below was returned by WebFetch's extractor during this run. The extractor splits long lines into pieces under about 125 characters; " / " marks a split. PDF page numbers were not returned for the NFPA PDFs, so locations are given as PI, SR or section numbers.
- PI 4311 note: Public Input 4311 was filed in NFPA's A2025 cycle, which revises NFPA 70-2023. It reproduces the 2023 Article 220 text under new "120.x" numbers. Cross-references inside it were left unrenumbered ("220.42", "220.61"), which looks like a mechanical copy. Its 220.53 and 220.57 text matches the Leviton 2023 reproduction (which carries an NFPA permission notice) word for word. Its header and substantiation were **not** visible. Values read from it are therefore marked VERIFIED-2023, but they are quoted with the PI's "120.x" numbers as printed.

---

## 1. Status matrix

| # | Item | 2023 (Article 220) value | 2023 status | 2026 (Article 120) location and value | 2026 status |
|---|---|---|---|---|---|
| 1a | 220.41 dwelling minimum unit load | 33 VA/m² (3 VA/ft²) | VERIFIED-2023 (N1) | 120.41: 2 VA/ft² | UNVERIFIED. Secondary sources agree: C1 (NFPA-staff author), C2, C3, C9 |
| 1b | Floor area rule (2023: 220.5(C), printed as 120.5(C) in the PI) | Outside dimensions. Excludes "open porches or unfinished areas not adaptable for future use as a habitable room or occupiable space" | VERIFIED-2023 (N1). The link from 220.41 to 220.5(C) is extractor narrative only | 120.5(C), cited by C1 | Number from C sources only |
| 1c | Lighting demand table, 2023 location | **Table 220.45** "Lighting Load Demand Factors". Table 220.42(A) is the non-dwelling unit-load table | VERIFIED-2023 (N1, printed as Table 120.45). Number corroborated by G5 and C10 | Table 120.45 | Number from C sources only (C2, G5-2026) |
| 1d | Table 220.45 dwelling tiers | First 3000 at 100; From 3001 to 120,000 at 35; Remainder over 120,000 at 25 | VERIFIED-2023 (two N1 pulls match) | Same tiers per C2 | UNVERIFIED (no change seen) |
| 2 | 220.52(A) small-appliance and 220.52(B) laundry | 1500 VA per 2-wire circuit, each | VERIFIED-2023 (N1, two pulls). Government worksheets G1 and G2 match (other or unstated edition) | 120.52 | UNVERIFIED (no Second Revision seen; FD not read). 1500 VA reappears in SD 120.83(2) |
| 3 | 220.53 appliance demand factor | 75 percent for four or more fastened-in-place appliances (≥¼ hp or ≥500 W). Excludes cooking, dryers, space heating, A/C, EVSE | VERIFIED-2023 (L1 authorized + N1, identical) | 120.53 | UNVERIFIED (no Second Revision seen) |
| 4a | 220.54 dryer load | "either 5000 watts (volt-amperes) or the nameplate rating, whichever is larger" | VERIFIED-2023 (N1) | 120.54: "the nameplate rating if available or 5000 watts (volt-amperes), whichever is larger" | VERIFIED-other-edition (2026, N4 Handbook replacement page) |
| 4b | Table 220.54 | 1–4: 100; 5: 85; 6: 75; 7: 65; 8: 60; 9: 55; 10: 50; 11: 47; 12–23: 47% minus 1% for each dryer exceeding 11; 24–42: 35% minus 0.5% for each dryer exceeding 23; 43 and over: 25% | VERIFIED-2023. Rows 1–4 come from one NFPA read plus three secondary matches; rows 5 and up were read twice (N1 and N2) | **Table 120.54 CHANGED**: 1–2: 100; **3–5: 80**; rows 6 and up unchanged | VERIFIED-other-edition (N4). The N2 redline agrees |
| 5a | Table 220.55, all 30 rows (Columns A, B, C) | See section 3, T5 | VERIFIED-2023 (two N1 pulls, 0 mismatches; partial independent match with C6) | Table 120.55 | No Second Revision seen; FD not read. "Unchanged" is UNVERIFIED |
| 5b | Table 220.55 Notes 1–3 | Note 1: +5% per kW (or major fraction) over 12 kW, ranges up to 27 kW. Note 2: averaging rule. Note 3: Column A/B option, 1¾–8¾ kW | VERIFIED-2023 (N1) | — | UNVERIFIED |
| 5c | Table 220.55 Notes 4–5 | Note 4: one range per table; single wall oven or cooktop at nameplate; counter-mounted cooking unit plus up to two wall-mounted ovens on one circuit in the same room = one range. Note 5: instructional programs | **Text** VERIFIED-2023 (N1). **Numbering** UNVERIFIED: every item extracts as "(1)". C sources number them 4 and 5 | — | UNVERIFIED |
| 6 | Table 220.56 (non-dwelling kitchen equipment) | 1: 100; 2: 100; 3: 90; 4: 80; 5: 70; 6 and over: 65 | VERIFIED-2023 (two N1 pulls) | 120.56. C9 says instantaneous water heaters were added | UNVERIFIED |
| 7 | 220.60 noncoincident loads | Use only the largest load(s). Use 125% of the motor or A/C load if it is not the largest | VERIFIED-2023 (N1) | 120.60 | UNVERIFIED |
| 8 | 220.61 neutral | (B): extra 70% demand factor for the range/dryer neutral (per Tables 220.55/220.54) and for the portion of unbalanced load in excess of 200 A. (C): no reduction for listed cases | VERIFIED-2023 (N1) | 120.61(B)(1) reworded so the 70% applies to "the portion of the feeder or service supplying" those loads | VERIFIED-draft (N2, SR-7812) |
| 9a | 220.82(A) scope | Single 120/240-V or 208Y/120-V set of 3-wire conductors, "ampacity of 100 or greater" | VERIFIED-2023 (N1) | 120.82(A) | UNVERIFIED (C2 paraphrase is the same) |
| 9b | 220.82(B) general load | 100% of first 10 kVA + 40% of remainder; 3 VA/ft²; 1500 VA per small-appliance and laundry circuit; nameplate items (B)(3)a–d; motors (B)(4) | VERIFIED-2023 (N1). Government worksheets G1, G2, G6 and C7 match | **120.82(B): first 8 kVA at 100%, remainder 40%, 2 VA/ft²** | **UNVERIFIED** (C2, C3, C4, C5 only) |
| 9c | 220.82(C) heating/A/C, largest of six | 100% A/C; 100% heat pump without supplemental heat; 100% HP compressor + 65% supplemental heat; 65% if <4 separately controlled units; 40% if ≥4; 100% thermal storage | VERIFIED-2023 (N1). G1 and G2 match | Same six items per C4 | UNVERIFIED |
| 9d | 120.82(D) EVSE (new) | — | — | EVSE at 100% per C2 and C5 | UNVERIFIED |
| 10 | 220.83 existing dwelling | (A) no added A/C or heat: first 8 kVA 100%, remainder 40%. (B) A/C or heat added: A/C 100, central electric heat 100, <4 separately controlled units 100, first 8 kVA of all other 100, remainder 40. 3 VA/ft²; 1500 VA | (A) VERIFIED-2023 (two N1 pulls). (B) VERIFIED-2023 from one NFPA read plus government cross-check (G6, edition unstated). G3 and G4 match the 8 kVA/40% values | **120.83 restructured**: 2 VA/ft² (22 VA/m²) and a single table: First 8 kVA of existing and new load 100; Remainder of existing load 40; New EVSE 80; New central electric resistance space heating 80; All other new loads 50 | VERIFIED-draft (N2, SR-7832; single read). C3 and C5 agree |
| 11 | 220.84 multifamily + table | Conditions (1)–(3). (C)(1) 3 VA/ft². Table (printed "120.84(B)" in the PI): 3–5: 45 … 62 and over: 23 (23 rows) | VERIFIED-2023 (N1 rows match N2 2026 rows exactly) | Table relabeled **120.84(C)**, rows unchanged. (A) revised for single-phase 120/208-V units. **(C)(1) 2 VA/ft² was not re-seen in this run** | Table and (A): VERIFIED-draft (N2). (C)(1) 2 VA/ft²: UNVERIFIED in this run |
| 12a | 220.85 two dwelling units | Lesser of the Part III load or the load of three identical units under 220.84 | VERIFIED-2023 (N1) | 120.85 | UNVERIFIED |
| 12b | 220.87 existing load | (1) 1-year maximum-demand data; (2) maximum demand at 125% plus new load does not exceed feeder ampacity or service rating | VERIFIED-2023 (items (1) and (2) only) | 120.87(2) reworded: new load, minus any removed load | VERIFIED-draft (N2, SR-7849). Exact wording UNVERIFIED (flattened redline) |
| 13a | 220.57 EVSE | Larger of 7200 W (VA) or nameplate | VERIFIED-2023 (L1 + N1, identical) | 120.57: nameplate rating if available, otherwise 7200 W | Intent VERIFIED-draft (N2 committee statement). Exact wording UNVERIFIED. C2 states both rules (CONFLICTING within C2) |
| 13b | 120.5(E) (new) | — | — | "Load calculations shall not require continuous loads to be calculated at 125 percent." + Informational Note | VERIFIED-draft (N2, SR-7609). C3 quotes the same sentence |
| 13c | Article 220 → Article 120 | — | — | Article 120 "Branch-Circuit, Feeder, and Service Load Calculations" | VERIFIED-2026 (N4 page header) |

---

## 2. Source register

**NFPA documents (tier 1)**

**N1. NFPA 70 A2025 CMP-2 Public Input submittals, PI 4311 (new Article 120).** Base text NFPA 70-2023.
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_PISubmittals.pdf
- Read three times:
  - P1: excerpts plus data summaries.
  - P2: raw lines.
  - P3: remaining items plus a second data pull.
- No permission notice was extracted (it is NFPA's own document).
- The extraction stops mid-word in 120.103 ("National Fire P"), after all target sections.

**N2. NFPA working draft, CMP-2 Second Draft.**
- Printed title: "WORKING DRAFT OF NEC CODE-MAKING PANEL 2 MEETING OUTPUT"
- Notice: "CONTENT NOT FINAL – SUBJECT TO REVISION PRIOR TO LETTER BALLOT AND PUBLICATION OF SECOND DRAFT REPORT"
- Cycle and meeting: "A2025"; "October 2024"; "Comment Stage"
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_SD_PrelimSR.pdf
- Coverage: the first window ran from SR-7974 (Annex D) to SR-7640 (210.12(A)), with the Article 120 Second Revisions in between.
- Text is a flattened redline: struck and inserted words run together.

**N3. NFPA working draft, CMP-2 First Draft.**
- Printed title: "WORKING DRAFT OF NEC CODE-MAKING PANEL 2 MEETING OUTPUT"
- Cycle and meeting: "A2025"; "January 15 - 20, 2024"; "Input Stage"; printed "2/5/24, 11:45 AM"
- Notices: "CONTENT NOT FINAL – SUBJECT TO REVISION"; "FOR COMMITTEE USE ONLY"
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf
- Coverage: the first window ends at 210.8(F), FR-774[8]. **No 220 or 120 First Revisions were visible.**

**N4. NFPA, "National Electrical Code® Handbook (2026)", "Replacement Page due to Errata".**
- Errata line: "Page 103, Table 120.54 correct table as follows:"
- Date: "March 27, 2026"
- Page header: "Article 120 ● Branch-Circuit, Feeder, and Service Load Calculations 120.54"
- Footer: "National Electrical Code Handbook 2026 103"
- Notice: "Note that this page incorporates the Errata listed below."
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_NEC_Handbook_2026_Table_120.54.pdf

**Authorized reproduction (tier 2)**

**L1. Leviton "Captain Code 2023", node/319, "EVSE Demand Factor Calculations | Captain Code 2023 Web Portal".**
- Notice as printed: "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association," / "Quincy, MA. All rights reserved."
- URL: https://captaincode2023.leviton.com/node/319

**Government documents (tier 3; reproductions or paraphrases, edition as stated)**

- **G1.** Placer County CDRA, Building Services Division, "RESIDENTIAL ELECTRICAL LOAD WORKSHEET".
  - Edition: cites "2022 California Building Standards Code of Regulations Title 24", "CEC Section: 220.82"; no date.
  - URL: https://www.placer.ca.gov/DocumentCenter/View/49092/Electric-Load-Worksheet-
- **G2.** City of Newark (CA), Building Inspection Division, "DWELLING UNIT FEEDER AND SERVICE LOAD CALCULATION ARTICLE 220.82".
  - Edition: not stated.
  - URL: https://www.newarkca.gov/home/showpublisheddocument/9587/639130513297370000
- **G3.** Town of Danville (CA), Building Services Division, "Dwelling Unit Electrical Load Calculation".
  - Edition: "REV 09/24/2026"; cites "CEC 220.83"; edition year not stated.
  - URL: https://www.danville.ca.gov/DocumentCenter/View/753/Electrical-Load-Calculations-PDF
- **G4.** City of Walnut Creek, Community Development Department, "DWELLING UNIT ELECTRICAL LOAD CALCULATION".
  - Edition: not stated.
  - URL: https://walnutcreekca.gov/home/showpublisheddocument/2682/635990810474870000
- **G5.** BlueVolt CE course outlines hosted by Utah. Section titles only; government-hosted third-party content, so corroboration only.
  - "Article 220 – Load Calculations – 2023 NEC": https://secure.utah.gov/ce-public/files/objectives/11933.pdf
  - "Article 120 – Load Calculations – 2026 NEC": https://secure.utah.gov/ce-public/files/objectives/13809.pdf
- **G6.** "LOAD ESTIMATING - OPTIONAL METHOD (CEC 220.82 or 220.83)". Edition not stated.
  - Hosted by the City of San Jose: https://sanjoseca.gov/home/showpublisheddocument/88355/637950546314130000
  - Hosted by the City of Campbell: https://www.campbellca.gov/DocumentCenter/View/20202
- **G7.** Denison TX and McKinney TX, "2026 National Electric Code – Significant Changes". Summaries; no author or date.
  - https://denisontx.gov/DocumentCenter/View/4131/2026-National-Electrical-Code-Significant-Changes
  - https://www.mckinneytexas.org/DocumentCenter/View/39888/2026-National-Electrical-Code-Significant-Changes

**Corroboration only (tier 4; never the sole source)**

- **C1.** EC&M, Dean Austin (byline: "NFPA Technical Services, Senior Electrical Specialist"), "Changes to Dwelling Unit Calculations in the 2026 NEC", May 19, 2026, "© 2026 All rights reserved." No reprint notice.
  - https://www.ecmweb.com/national-electrical-code/article/55371139/changes-to-dwelling-unit-calculations-in-the-2026-nec
- **C2.** Mike Holt Enterprises, "Electrical Exam Preparation, based on the 2026 NEC" (1st Printing), sample unit 6. A paraphrase with no permission notice.
  - https://www.mikeholt.com/instructor2/img/product/pdf/2678e0acc0def6f177511dfdc4fe0e28.pdf
- **C3.** Kopperfield blog, "NEC 2026 load calculations", Feb 26, 2026. No sources cited.
  - https://www.kopperfield.com/blog/nec-2026-load-calculations
- **C4.** OpenExamPrep (Ran Chen) study-guide pages. **The CT and MI pages contain errors versus the NFPA text; see the blocked/failed log.**
  - MN 6.3: https://open-exam-prep.com/study-guides/mn-electrician/ch06-load-calculations/optional-method-calculations
  - CT 7.2: https://open-exam-prep.com/study-guides/ct-electrician/electrical-load-calculations/appliance-heating-demands
  - MI 3.2: https://open-exam-prep.com/study-guides/mi-electrician/load-calculations-services-feeders/appliance-cooking-loads
- **C5.** Mike Holt forum threads.
  - "New 2026 NEC Optional Calculation 120.83" (Jan 2026): https://forums.mikeholt.com/threads/new-2026-nec-optional-calculation-120-83.2590280
  - "Dwelling Load Calculations - 220.82 vs. 220.83" (Feb 2026): https://forums.mikeholt.com/goto/post?id=3039843
- **C6.** ECmag, Charles R. Miller, "Codes & Standards: Branch-circuit, feeder and service calculations". Edition not stated.
  - Part XXVI (Apr 15, 2008): https://www.ecmag.com/magazine/articles/article-detail/codes-standards-branch-circuit-feeder-and-service-calculations-part-xxvi
  - Part XXIX (Jul 15, 2008): https://www.ecmag.com/magazine/articles/article-detail/codes-standards-branch-circuit-feeder-and-service-calculations-part-xxix
- **C7.** IAEI Magazine, Christel Hunter, "Residential Service Calculations in the National Electrical Code", May/June 2013. No reprint notice.
  - https://iaeimagazine.org/electrical-fundamentals/residential-service-calculations-in-the-national-electrical-code
- **C8.** IAEI Magazine, Dean Austin (NFPA), "A Look at the Proposed 2026 NEC Changes", Jul 1, 2025. No reprint notice.
  - https://iaeimagazine.org/columns/nfpa-code-talk/look-at-proposed-2026-nec-changes/
- **C9.** IEC, Ryan Jackson, "National Electrical Code 2026 Changes to Chapter One". Undated.
  - https://ieci.org/national-electrical-code-2026-changes-to-chapter-one/
- **C10.** Mike Holt tables of contents, titles only.
  - 2023 Understanding the NEC (1694808856.pdf, 1694808894.pdf, 1722364810.pdf): https://www.mikeholt.com/instructor2/img/product/pdf/1694808894.pdf
  - "Changes to the National Electrical Code 2026" (1758136674.pdf): https://www.mikeholt.com/instructor2/img/product/pdf/1758136674.pdf
- **C11.** EC&M, Mike Holt, "Load Calculations ― Part 2", Apr 17, 2020 (2020 NEC). Prose only.
  - https://ecmweb.com/national-electrical-code/code-basics/article/21129110/loads-calculations-part-2

---

## 3. Evidence by target

### T1. Dwelling general lighting: 220.41, the floor area rule, and Table 220.45 (2023)

**220.41, 2023 (N1, P2; printed as "1 20.41")**
- Quote: "In one-family, two-family, and multifamily dwellings, the minimum unit load shall be not less than" / "33 volt-amperes/ m" / "2 (3 volt-amperes/f t2)."
- P1 returned the same opening sentence.
- Corroboration (C1): "What was Sec. 220.41 in the 2023 NEC has now become Sec. 120.41 in the 2026 NEC". C1's 2023 example: "5,000 sq ft x 3VA/sq ft = 15,000VA ÷ 240V = 62.5A".
- Status: **VERIFIED-2023**.
- Not captured: any further sentences of 220.41.

**Floor area rule (N1, P2; printed as 120.5(C), so 2023 220.5(C))**
- Quote: "The floor area for each floor shall be calculated from the outside dimensions of the building, dwelling" / "unit, or other area involved. For dwelling units, the calculated floor area shall not include open porches or" / "unfinished areas not adaptable for future use as a habitable room or occupiable space."
- Status: text **VERIFIED-2023**.
- The extractor said 120.41 "references" 120.5(C). That link is narrative, not quoted, so it is **UNVERIFIED**.
- The optional-method floor-area wording is different; see T9.

**Location of the demand-factor table in 2023: Table 220.45**
- N1 prints it as "Table 120.45 Lighting Load Demand Factors" (2023 text, PI renumbering). P1 also quotes the PI text: "The demand factors specified in Table 120.45 shall apply…"
- G5 (2023 course outline): "220.45 Lighting Load Demand Factors" and "Table T220.42(A) General Lighting Loads by Occupancy".
- C10 (Mike Holt 2023 table of contents): "General Lighting Demand Factors" (220.45).
- So **Table 220.42 in 2023 is the non-dwelling unit-load table (220.42(A))**, not the demand table.
- 2026: N2 SR-7797 removes the note from "Table 120.42(A)". Committee statement: "The note in table 120.42(A) is removed to clarify that the table values are not to be adjusted by 125-percent".

**Table 220.45, pull A (N1 P2), raw lines**
- "Type of Occupancy | Portion of Lighting Load to Which Demand Factor Applies (Volt-Amperes) | Demand Factor (%)"
- "Dwelling units | First 3000 at 100"
- "From 3001 to 120,000 at 35"
- "Remainder over 120,000 at 25"
- "Hotels and motels, including apartment houses without provision for cooking by tenants* | First 20,000 or less at 60"
- "From 20,001 to 100,000 at 50"
- "Remainder over 100,000 at 35"
- "Warehouses (storage) | First 12,500 or less at 100"
- "Remainder over 12,500 at 50"
- "All others | Total volt-amperes 100"
- Footnote: "*The demand factors of this table shall not apply to the calculated load of feeders or services supplying" / "areas in hotels and motels where the entire lighting is likely to be used at one time, as in ballrooms or" / "dining rooms."

**Table 220.45, pull B (N1 P1), data**
- "Dwelling units are 100 percent of the first 3,000 VA, 35 percent from 3,001 to 120,000 VA, and 25 percent above 120,000 VA."
- **The dwelling rows match between pulls.** The hotel, warehouse and "all others" rows were read once.
- Corroboration: C7 prose "first 3000 VA at 100% and the remainder at 35%". C2 (2026): "First 3000 VA of Step 1 at a 100 percent demand factor"; "subtract 3,000 VA from 120,000 VA when using Table 120.45".
- Status: dwelling tiers **VERIFIED-2023**. Non-dwelling rows are a single read (UNVERIFIED by the two-pull rule).

**2026**
- C1: "decreasing the volt-amperes per square foot from 3 VA/ft2 to 2 VA/ft2"; "5,000 sq ft x 2VA/sq ft = 10,000 VA ÷ 240V = 42A".
- C9: "The lighting and general-purpose load calculations for dwelling units were reduced by 33 percent."
- C2: "The total connected load must include a 2 VA per sq ft load for general lighting and general-use receptacles."
- **120.41 = 2 VA/ft² is UNVERIFIED.** It appears in no NFPA document read in this run, because the First Draft revision was not reached.
- New 120.13 keeps 3 VA/ft² for counting branch circuits:
  - C1: "A branch-circuit load calculation must be performed based on 3VA/sq ft multiplied by the calculated square footage"
  - C2: "the load is based on 3 VA per sq ft [120.13]"
  - C9: "the required number of branch circuits is still calculated at 3 VA per square foot [120.13]"
  - Status: UNVERIFIED.

### T2. 220.52(A) and (B), 2023

N1, P3; printed as 120.52:
- (A): "In each dwelling unit, the load shall be calculated at 1500 volt-amperes for each 2-wire small-appliance branch circuit" / "as covered by 210.11(C)(1)."
- (B): "A load of not less than 1500 volt-amperes shall be included for each 2-wire laundry branch circuit" / "installed as covered by 210.11(C)(2)."
- P1 repeats the (A) phrase: "the load shall be calculated at 1500 volt-amperes for each 2-wire small-appliance branch circuit".
- Government worksheets match:
  - G1: "Kitchen appliance circuits (minimum 2 @ 1,500 volt-amperes)"; "Laundry circuits (minimum 1 @ 1,500 volt-amperes)"
  - G2: "1500 VA each"
- Status: **VERIFIED-2023 (1500 VA)**. Not captured: the remaining sentences and any exception.
- 2026: no Second Revision on 120.52 was visible in N2. The 1500 VA figure reappears in SD 120.83(2): "1500 volt-amperes for each 2-wire, 20-ampere small-appliance branch circuit and each laundry branch". The 120.52 value is UNVERIFIED (no change seen).

### T3. 220.53, 2023

L1 (authorized, 2023), quoted as printed:
- "220.53 Appliance Load — Dwelling Unit(s)."
- "Applying a demand factor of 75 percent to the nameplate rating load" / "of four or more appliances rated 1⁄4 hp or greater, or 500 watts or greater," / "that are fastened in place, and that are served by the same feeder or service" / "in a one-family, two-family, or multifamily dwelling shall be permitted."
- "This demand factor shall not apply to the following:" / "(1) Household electric cooking equipment that is fastened in place" / "(2) Clothes dryers" / "(3) Space heating equipment" / "(4) Air-conditioning equipment" / "(5) Electric vehicle supply equipment (EVSE)"

N1 P3 gives the same wording.

Status: **VERIFIED-2023** (two independent sources). For 2026, 120.53 had no Second Revision visible; UNVERIFIED.

### T4. 220.54 and Table 220.54, 2023, and the 2026 change

**220.54, 2023 (N1 P3)**
- Quote: "The load for household electric clothes dryers in a dwelling unit(s) shall be either 5000 watts (volt-amperes)" / "or the nameplate rating, whichever is larger, for each dryer served." / "The use of the demand factors in Table 120.54 shall be permitted."
- P1 has the same opening.
- G2 matches: "Clothes Dryer (5000 VA or the Nameplate Rating whichever is larger)".
- Status: **VERIFIED-2023**.
- Not captured for 2023: the 3-phase "twice the maximum number connected between any two phases" sentence and the kVA = kW sentence.

**Table 220.54, 2023 (N1 P2), raw lines**
- "Number of Dryers | Demand Factor (%)"
- "1–4 100"
- "5 85"
- "6 75"
- "7 65"
- "8 60"
- "9 55"
- "10 50"
- "11 47"
- "12–23 47% minus 1% for each dryer exceeding 11"
- "24–42 35% minus 0.5% for each dryer exceeding 23"
- "43 and over 25%"

Second NFPA pull: the N2 redline (2026 draft) shows struck text "5 85" and rows 6 through "43 and over 25%" identical to the above. Rows 1–4 were read once from NFPA, and three secondary sources match:
- C3, 2023 column: 1-2 100%, 3-4 100%, 5 85%
- C4 CT: "1 to 4 Dryers: 100%"
- C4 MI: "1 to 4 | 100%"

Status: **VERIFIED-2023.**

Secondary errors to avoid:
- C4 CT renders 24–42 as "35% - (Number of dryers - 24) × 0.5%". That does not match NFPA's wording, "for each dryer exceeding 23".
- C4 MI truncates the 24–42 row to "35%".

**120.54, 2026 (N4), as printed**
- "120.54 Electric Clothes Dryers — Dwelling Unit(s)."
- "The load for household electric clothes dryers in a dwelling unit(s) shall be the nameplate rating if available" / "or 5000 watts (volt-amperes), whichever is larger, for each dryer served."
- "The use of the demand factors in Table 120.54 shall be permitted."
- "Where two or more single-phase dryers are supplied by a 3-phase, 4-wire feeder or service," / "the total load shall be calculated on the basis of twice the maximum number connected between any two phases."
- "Kilovoltamperes (kVA) shall be considered equivalent to kilowatts (kW) for loads calculated in this section."

**Table 120.54, 2026 (N4), raw lines**
- "TABLE 120.54 Demand Factors for Household Electric" / "Clothes Dryers"
- "Number of Dryers Demand Factor (%)"
- "1–2 100"
- "3–5 80"
- "6 75"
- "7 65"
- "8 60"
- "9 55"
- "10 50"
- "11 47"
- "12–23 47% minus 1% for each dryer exceeding 11"
- "24–42 35% minus 0.5% for each dryer exceeding 23"
- "43 and over 25%"
- A stray "N" follows the table; the page does not explain it.

The data pull in the same N4 response gave identical pairs.

**Independent cross-check from the N2 redline (SR-7804).** The extracted lines are "1–5 1–2 80 100" and "3- 5 85 80", followed by 6→75 … 43 and over→25%. These read as FD "1–5 80" revised to "1–2 100", and "5 85" revised to "3–5 80", consistent with N4.
- SR-7804 committee statement: "This Second Revision corrects the inadvertent inclusion of the second row, as it is inconsistent with the first row."
- N4 Handbook commentary: "It is unlikely that all dryers will be in operation simultaneously," / "and Table 120.54 was developed based on utility demand that proves this point."

Status: **VERIFIED-other-edition (2026).**

A script comparison (python3 -I) confirms the only per-count changes from 2023 to 2026 are n=3 (100→80), n=4 (100→80) and n=5 (85→80).

### T5. 220.55 and Table 220.55, 2023

**220.55 (N1 P2)**
- Quote: "The load for household electric ranges, wall-mounted ovens, counter-mounted cooking units, and other" / "household cooking appliances individually rated in excess of 1 3/4 kW shall be permitted to be" / "calculated in accordance with Table 120.55. Kilovolt-amperes (kVA) shall be considered" / "equivalent to kilowatts (kW) for loads calculated under this section."
- Status: VERIFIED-2023.

**Table title and headings (N1 P2), raw lines**
- "Table 120.55 Demand Factors and Loads for Household Electric Ranges, Wall-Mounted Ovens,"
- "Counter-Mounted Cooking Units, and Other Household Cooking Appliances over 1 3/4 kW"
- "Rating (Column C to be used in all cases except as otherwise permitted in Note 3.)"
- "Number of Appliances | Demand Factor (%) (See Notes) | Column C Maximum Demand (kW) (See Notes)"
- "Column A (Less than 3 1/2 kW Rating) | Column B (3 1/2 kW through 8 3/4 kW Rating) | (Not over 12 kW Rating)"

**Rows, pull A (N1 P2), raw lines exactly as extracted**
```
1 80 80 8
2 75 65 11
3 70 55 14
4 66 50 17
5 62 45 20
6 59 43 21
7 56 40 22
8 53 36 23
9 51 35 24
10 49 34 25
11 47 32 26
12 45 32 27
13 43 32 28
14 41 32 29
15 40 32 30
16 39 28 31
17 38 28 32
18 37 28 33
19 36 28 34
20 35 28 35
21 34 26 36
22 33 26 37
23 32 26 38
24 31 26 39
25 30 26 40
26–30 30 24 | 15 kW + 1 kW for each range
31–40 30 22
41–50 30 20 25 kW + 3/4 kW for each range
51–60 30 18
61 and over 30 16
```

**Pull B (N1 P3), data**
- The table repeats every row with identical values.
- A python3 -I comparison found **30 rows, 0 mismatches.**

**Merged Column C cells.** Column C prints "15 kW + 1 kW for each range" once, on the 26–30 row, and "25 kW + 3/4 kW for each range" once, on the 41–50 row. The 31–40, 51–60 and "61 and over" rows carry no Column C entry, which is consistent with merged cells spanning 26–40 and 41 and over. That span reading is supported by C6 Part XXVI: "for 26 to 40 appliances you add 15 to the number of appliances to get the kW demand", and its example "30 units: Column C demand is 45 kW".

**Independent partial cross-checks (C6, 2008, edition not stated); all match**
- 10 ovens, Column A: 49%
- 15 ovens, Column A: 40%
- 10 cooktops, Column B: 34%
- 15 cooktops, Column B: 32%
- 20 units, Column C: 35 kW
- Part XXIX: "Column C for 10 ranges is 25 kW"; "Column C for 15 ranges is 30 kW"
- C4 MI, Column C for 1–5: 8, 11, 14, 17, 20 (match)
- C2 (2026): one 12 kW range, Column C = 8 kW (match)

**CONFLICT, secondary only.** C4 CT gives "28 to 40 Ranges: 25 kW + (3/4 kW for each additional range)" and "41 Ranges and over: 15 kW + (1 kW for each range)". Those are the two formulas swapped against the NFPA text. Do not use that page.

**Notes (N1 P2 and P3, raw lines; every list label extracts as "(1)")**
- [Note 1] "(1) Over 12 kW through 27 kW ranges all of same rating. For ranges individually rated more than" / "12 kW but not more than 27 kW, the maximum demand in Column C shall be increased 5 percent" / "for each additional kilowatt of rating or major fraction thereof by which the rating of individual" / "ranges exceeds 12 kW."
- [Note 2] "(1) Over 8 3/4 kW through 27 kW ranges of unequal ratings. For ranges individually rated" / "more than 8 3/4 kW and of different ratings, but none exceeding 27 kW, an average" / "value of rating shall be calculated by adding together the ratings of all ranges to obtain the" / "total connected load (using 12 kW for any range rated less than 12 kW) and dividing by the" / "total number of ranges. Then the maximum demand in Column C shall be increased" / "5 percent for each kilowatt or major fraction thereof by which this average value exceeds" / "12 kW."
- [Note 3] "(1) Over 1 3/4 kW through 8 3/4 kW. In lieu of the method provided in Column C," / "adding the nameplate ratings of all household cooking appliances rated more than" / "1 3/4 kW but not more than 8 3/4 kW and multiplying the sum by the demand factors" / "specified in Column A or Column B for the given number of appliances shall be permitted." / "Where the rating of cooking appliances falls under both Column A and Column B, the" / "demand factors for each column shall be applied to the appliances for that column, and the" / "results added together."
- [Note 4, item 1] "(1) Calculating the branch-circuit load for one range in accordance with Table 120.55 shall be permitted." (P2 and P3 identical)
- [Note 4, item 2] "(1) The branch-circuit load for one wall-mounted oven or one counter-mounted cooking unit" / "shall be the nameplate rating of the appliance." (P2 and P3 identical)
- [Note 4, item 3] "(1) The branch-circuit load for a counter-mounted cooking unit and not more than two wall-mounted ovens," / "all supplied from a single branch circuit and located in the same room, shall be calculated by adding" / "the nameplate rating of the individual appliances and treating this total as equivalent to one range." (P3 only)
- [Note 5] "(1) This table shall also apply to household cooking appliances rated over 1 3/4 kW and used in instructional programs." (P3 only)
- After the table: "Informational Note No. 1: See Informative Annex D for examples." / "Informational Note No. 2: See Table 120.56 for demand factors for commercial cooking equipment."

**Status of the notes**
- The text of all notes is **VERIFIED-2023**.
- The **note numbers** are **UNVERIFIED**, because the extractor printed every item as "(1)" and P3 reported "No 'Branch-Circuit Load' heading appears in the visible text". P2's extractor assigned the "Note 4" and "Note 5" labels by order and stopped early, so its labels are wrong.
- Grouping items 1–3 as Note 4 and the instructional item as Note 5 matches the C sources:
  - C5 thread title: "Single branch circuit for a cooktop and not more than two ovens 220.55 note 4"
  - C4 CT: "Note 4: … one counter-mounted cooktop plus up to two wall ovens in the same room on one circuit to be treated as one range"

**2026.** No Second Revision on 120.55 or Table 120.55 was visible in N2; the extractor noted only a cross-reference to Table 120.55. Table 120.55 values for 2026 are **UNVERIFIED** (no change seen). C2 paraphrases Note 1 and the Note 4 items unchanged.

### T6. 220.56 and Table 220.56, 2023 (quick confirmation)

- Pull A (N1 P1), data: "Demand factors are 100, 100, 90, 80, 70, and 65 percent for 1, 2, 3, 4, 5, and 6-or-more units."
- Pull B (N1 P3), rows: "1: 100", "2: 100", "3: 90", "4: 80", "5: 70", "6 and over: 65". The pulls match.
- Status: **VERIFIED-2023**. The 220.56 section text was not captured.
- 2026: C9 says "Instantaneous water heaters are now included in the demand factors formerly reserved for kitchen equipment." UNVERIFIED.

### T7. 220.60 noncoincident loads, 2023

N1 P3 quote:
- "If it is unlikely that two or more noncoincident loads will be in use simultaneously, using only the largest" / "load(s) that will be used at one time for calculating the total load of a feeder or service shall be permitted."
- "If a motor or air-conditioning load is part of the noncoincident load and is not the largest of the noncoincident loads," / "125 percent of either the motor load or air-conditioning load, whichever is larger, shall be used in the calculation."

P1 has the same opening. Status: **VERIFIED-2023**. For 2026, 120.60 is UNVERIFIED (no change seen).

### T8. 220.61 feeder or service neutral, 2023

N1, P2 and P3, quoted as printed:
- (A): "The feeder or service neutral load shall be the maximum unbalance of the load determined by this article." / "The maximum unbalanced load shall be the maximum net calculated load between the neutral conductor and any one ungrounded conductor."
- (B): "A service or feeder supplying the following loads shall be permitted to have an additional demand factor" / "of 70 percent applied to the amount in 120.61(B)(1) and a portion of the amount in" / "120.61(B)(2) ."
- (B)(1): "Household Electric Ranges, Wall-Mounted Ovens, Counter-Mounted Cooking Units, and Dryers . A feeder or" / "service supplying household electric ranges, wall-mounted ovens, counter-mounted cooking units, and electric" / "dryers, where the maximum unbalanced load has been determined in accordance with Table 120.55 for ranges and" / "Table 120.54 for dryers."
- (B)(2): "Unbalanced Load in Excess of 200 Amperes . That portion of the unbalanced load in excess of" / "200 amperes where the feeder or service is supplied from a 3-wire dc or single-phase ac system; a" / "4-wire, 3-phase system; a 3-wire, 2-phase system; or a 5-wire, 2-phase system."
- (C): "There shall be no reduction of the neutral or grounded conductor capacity applied to the amount in 120.61(C)(1)" / "(1) Any portion of a 3-wire circuit consisting of 2 ungrounded conductors and the neutral conductor of a 4-wire, 3-phase, wye-connected system" / "(2) That portion consisting of nonlinear loads supplied from a 4-wire, wye-connected, 3-phase system"

Status: **VERIFIED-2023** for (A) first sentences, (B), (B)(1), (B)(2) and (C)(1)–(2). Not captured: any (A) exception.

**2026 (N2, SR-7812, (B)(1) only)**
- Quote: "A demand factor of 70 percent shall be permitted to be applied to the portion of the feeder or service supplying"
- Committee statement: "The additional text clarifies that the 70% demand factor in 120.61(B)(1) applies only to the portion of the neutral load"
- Status: VERIFIED-draft. The 70 percent figure is unchanged.

### T9. 220.82 optional method, one dwelling, 2023

**(A) (N1 P3)**
- Quote: "This section applies to a dwelling unit having the total connected load served by a single 120/240-volt" / "or 208Y/120-volt set of 3-wire service or feeder conductors with an ampacity of 100 or greater."
- No unit word appears after "100" in the extraction. C7 gives the same opening phrase.
- Status: **VERIFIED-2023**.

**(B) lead-in (N1 P2)**
- Quote: "The general calculated load shall be not less than 100 percent of the first 10 kVA plus 40 percent of the" / "remainder of the following loads :"
- C7: "100 percent of the first 10 kVA plus 40 percent of the remainder".

**(B)(1)**
- Quote: "33 volt-amperes/ m2 or 3 volt-amperes/f t2 for general lighting and general-use receptacles. The" / "floor area for each floor shall be calculated from the outside dimensions of the dwelling unit. The" / "calculated floor area shall not include open porches, garages, or unused or unfinished spaces not" / "adaptable for future use ."
- This exclusion wording names "garages". The 220.5(C) wording in T1 does not.

**(B)(2)**
- Quote: "1500 volt-amperes for each 2-wire, 20-ampere small-appliance branch circuit and each laundry" / "branch circuit covered in 210.11(C)(1 ) and (C)(2) ."

**(B)(3) and (B)(4) (N1 P3)**
- Lead-in from P2: "The nameplate rating of the following:"
- Items; the list labels were garbled as (4)–(8):
  - "All appliances that are fastened in place, permanently connected, or located to be on a specific circuit"
  - "Ranges, wall-mounted ovens, counter-mounted cooking units"
  - "Clothes dryers that are not connected to the laundry branch circuit specified in 120.82(B)(2)"
  - "Water heaters"
  - "The nameplate ampere or kVA rating of all permanently connected motors not included in 120.82(B)(3)." This last item is (B)(4).

**(C) (N1 P2)**
- Lead-in: "The largest of the following six selections (load in kVA) shall be included :"
- (1) "100 percent of the nameplate rating(s) of the air conditioning and cooling ."
- (2) "100 percent of the nameplate rating(s) of the heat pump when the heat pump is used without any" / "supplemental electric heating ."
- (3) "100 percent of the nameplate rating(s) of the heat pump compressor and 65 percent of the" / "supplemental electric heating for central electric space-heating systems. If the heat pump compressor" / "is prevented from operating at the same time as the supplementary heat, it does not need to be added" / "to the supplementary heat for the total central space heating load ."
- (4) "65 percent of the nameplate rating(s) of electric space heating if less than four separately controlled" / "units ."
- (5) "40 percent of the nameplate rating(s) of electric space heating if four or more separately controlled" / "units ."
- (6) "100 percent of the nameplate ratings of electric thermal storage and other heating systems where the" / "usual load is expected to be continuous at the full nameplate value. Systems qualifying under this" / "selection shall not be calculated under any other selection in 120.82(C) ."

**Government cross-check (other or unstated edition)**
- G1 (2022 CEC):
  - General load and demand: "General light, power _______SF x 3 volt-amperes"; "The first 10,000 volt-amperes is calculated at 100%"; "The remaining volt-amperes are calculated at 40%"
  - "1. Air conditioning and cooling (100% NP rating)"
  - "2. Heat pump without supplemental heating (100% NP rating)"
  - "3. Heat pump with supplemental electric heating (100% NP rating plus 65%)"
  - "4. Electrical space heating < 4 separate units (65% NP rating)"
  - "5. Electrical space heating ≥ 4 separate units (40% NP rating)"
  - "6. Electrical thermal storage and other (100% NP rating)"
- G2: "3 VA per sqft"; "First 10k VA @100%"; "Remainder VA @ 40%"; the same six heating/AC items.

**Status: VERIFIED-2023** for (A), (B)(1)–(4) and (C)(1)–(6).

**2026, 120.82: UNVERIFIED, secondary sources only**
- C2: "applying a 100 percent demand load to the first 8 kVA of the total connected load," / "then a 40 percent demand to the remainder of the total connected load."; (B)(1): "2 VA per sq ft"; "Determine the electric vehicle supply equipment load at 100 percent [120.57 and 120.82(D)]."
- C3: 2023 "First 10 kVA at 100%, remainder at 40%" versus 2026 "First 8 kVA at 100%, remainder at 40%".
- C4 MN: 2026 uses the first 8 kVA; "2 VA/ft² (2026 NEC; formerly 3 VA/ft²)"; the same six heating/AC items; EVSE at 100%.
- C5: "General loads at 100% for the first 8 kVA and 40% above that, HVAC at various factors, and EVSE at 100%" (poster paraphrase).
- C9: "A similar change was made to the optional calculation method in 120.82."
- No 120.82 Second Revision was visible in N2. The change would sit in the First Draft (N3), whose 220.x revisions were beyond the window that was read.

### T10. 220.83 existing dwelling, 2023

**Text (N1 P3)**
- Lead-in: "This section shall be permitted to be used to determine if the existing service or feeder is of sufficient capacity"
- "(A) Where Additional Air-Conditioning Equipment or Electric Space-Heating Equipment Is Not to Be Installed."
- "General lighting and general-use receptacles at 33 volt-amperes/m2 or 3 volt-amperes/ft2 as determined by 120.42"
- "1500 volt-amperes for each 2-wire, 20-ampere small-appliance branch circuit and each laundry branch circuit"
- "The nameplate rating of the following: All appliances that are fastened in place, permanently connected"
- "Ranges, wall-mounted ovens, counter-mounted cooking units; clothes dryers; water heaters" (the extractor appears to have merged list items)
- "(B) Where Additional Air-Conditioning Equipment or Electric Space-Heating Equipment Is to Be Installed."

**Table 220.83(A), pull A (N1 P2), raw lines**
- "Load (kVA) | Percent of Load" / "First 8 kVA of load at 100" / "Remainder of load at 40"
- Pull B (N1 P1): "The first 8 kVA is at 100 percent and the remainder at 40 percent." The pulls match.

**Table 220.83(B) (N1 P2), raw lines; single NFPA read**
- "Load | Percent of Load"
- "Air-conditioning equipment 100"
- "Central electric space heating 100"
- "Less than four separately controlled space-heating units 100"
- "First 8 kVA of all other loads 100"
- "Remainder of all other loads 40"

**Government cross-check (G6, edition unstated)**
- "*Air conditioning @ 100%"
- "*Central elect. space heating @ 100%"
- "*Less than 4 separately controlled elect. space heaters @ 100%"
- "Or 8,000 watts @ 100% for Existing Dwelling"
- "Balance … @ 40%"
- G3 and G4: "First 8,000 VA at 100%"; "Use the first 8,000 Volt-Amperes for additional loads to existing dwellings."

Status: **VERIFIED-2023** for the values. Note that Table (B) has one NFPA read plus government corroboration.

**2026, 120.83 (N2, SR-7832; single read; flattened draft)**
- Quotes:
  - "This section shall be permitted to be used to determine if the existing service or feeder is of sufficient capacity to"
  - "(1) General lighting and general-use receptacles at 22 volt-amperes/m2 or 2 volt-amperes/ft"
  - "(2) 1500 volt-amperes for each 2-wire, 20-ampere small-appliance branch circuit and each laundry branch"
- Table 120.83 rows:
  - "Load (kVA) Percent of Load"
  - "First 8 kVA of existing and new load 100"
  - "Remainder of existing load 40"
  - "New EVSE 80"
  - "New central electric resistance space heating 80"
  - "All other new loads 50"
- Committee statement (editorial): "The term is replaced with “if”, as the usage is for a conditioned based statement."
- Corroboration:
  - C3 lists "New EVSE: 80%", "New central electric resistance heating: 80%", "All other new loads: 50%" and says the section "Replaces the prior multi-table structure with a single simplified table".
  - C5 (tortuga): 100% first 8 kVA, 40% remainder of existing, 80% new EVSE and central resistance heat, 50% other new.
- Status: **VERIFIED-draft.** Final text was not seen.

### T11. 220.84 multifamily and its table, 2023

**Conditions (N1 P3)**
- "(1) No dwelling unit is supplied by more than one feeder."
- "(2) Each dwelling unit is equipped with electric cooking equipment."
- "(3) Each dwelling unit is equipped with either electric space heating or air conditioning, or both."

**Calculated-load items (N1 P3)**
- "(1) 33 volt-amperes/m2 or 3 volt-amperes/ft2 for general lighting and general-use receptacles"
- "(2) 1500 volt-amperes for each 2-wire, 20-ampere small-appliance branch circuit and each laundry branch circuit"
- "(9) The larger of the air-conditioning load or the fixed electric space-heating load"
- Items (3)–(8) were not captured.

**Table 220.84 (PI label as extracted: "Table 120.84(B)")**
- Pull A (N1 P3), data: 3–5: 45; 6–7: 44; 8–10: 43; 11: 42; 12–13: 41; 14–15: 40; 16–17: 39; 18–20: 38; 21: 37; 22–23: 36; 24–25: 35; 26–27: 34; 28–30: 33; 31: 32; 32–33: 31; 34–36: 30; 37–38: 29; 39–42: 28; 43–45: 27; 46–50: 26; 51–55: 25; 56–61: 24; 62 and over: 23.
- Pull B (N1 P1), endpoints: "The demand factor falls from 45 percent for 3–5 units to 23 percent for 62 or more units."
- Independent NFPA pull (N2, 2026 draft), raw lines: "3–5 45" / "6–7 44" / "8–10 43" / "11 42" / "12–13 41" / "14–15 40" / "16–17 39" / "18–20 38" / "21 37" / "22–23 36" / "24–25 35" / "26–27 34" / "28–30 33" / "31 32" / "32–33 31" / "34–36 30" / "37–38 29" / "39–42 28" / "43–45 27" / "46–50 26" / "51–55 25" / "56–61 24" / "62 and over 23"
- **Identical across all 23 rows** (python3 -I check).
- Status: **VERIFIED-2023.**

**2026 (N2)**
- SR-7835 (120.84(A)): "If all the conditions of 120.84(A)(1) are met, and if three or more single-phase 120/208V dwelling units are". Statement: "Section 120.84(A) has been revised to properly address single phase 120/208 multifamily dwelling units."
- SR-8044:
  - Text: "House loads shall be calculated in accordance with Article 120, Part III and shall be in addition"
  - Text: "The calculated load to which the demand factors of Table 120.84(B) apply shall include the following:"
  - Table heading as extracted: "Table 120.84(B C )", that is, relabeled (C).
  - Statement: "Table 120.84(B) is located in the sub-section titled “House Loads”, but is used for “Calculated Loads” in"
- **The 2 VA/ft² value in 120.84(C)(1) was not in this run's extraction.** It is UNVERIFIED in this run (a prior session's note only).

### T12. 220.85 and 220.87, 2023

**220.85 (N1 P2)**
- Quote: "Where two dwelling units are supplied by a single feeder or service and the calculated load under Part III" / "of this article exceeds that for three identical units calculated under 120.84, the lesser of the two" / "loads shall be permitted to be used."
- Status: **VERIFIED-2023**.

**220.87 (N1 P2)**
- Item (1): "The maximum demand data is available for a 1-year period."
- Item (2): "The maximum demand at 125 percent plus the new load does not exceed the ampacity of the feeder" / "or rating of the service ."
- Status: **VERIFIED-2023**. The lead-in sentence and any exception were not captured.

**2026, 120.87 (N2, SR-7849)**
- Quotes: "The calculation of a feeder or service load for existing installations shall be permitted to use" / "(2) The maximum demand at 125 percent plus the new load does load minus any removed load determined in accordance" (flattened).
- Committee statements: "Item (2) currently references “new load” without specifying how that is determined." / "The impact to industrial establishments who have metering equipment that does not capture data at".
- Status: 125 percent is VERIFIED-draft. Exact wording is UNVERIFIED.

### T13. 2026 Article 120 priorities

- **Article 120 location.** N4 header: "Article 120 ● Branch-Circuit, Feeder, and Service Load Calculations". G7: "Article 120 Branch Circuits, Feeders, and Service Load Calculations: Previously located in 220." VERIFIED.
- **120.41.** See T1. UNVERIFIED (C only).
- **120.82.** See T9. UNVERIFIED (C only): 2 VA/ft², first 8 kVA, new (D) EVSE at 100%.
- **Table 120.54.** See T4. VERIFIED-other-edition (2026).
- **120.57 (N2, SR-7809; flattened)**
  - Quote: "For each EVSE served, the EVSE loads shall be calculated at either the nameplate rating of the equipment, if" / "available, or at 7200 watts (volt-amperes) or if the nameplate rating of the equipment, whichever is larger"
  - Committee statement: "The revision allows the use of nameplate ratings, in lieu of the 7200 VA value."
  - C3: 2026 "Nameplate rating if available, otherwise 7,200 W".
  - C2 says both: "based on the nameplate rating of the equipment" / "if available at the time of the calculation, or 7200 VA if the nameplate is not available." and "The EVSE load is determined at the larger of 7200 VA or the nameplate rating of the equipment."
  - Status: intent VERIFIED-draft. Exact final wording UNVERIFIED; CONFLICTING within C2.
- **120.5(E) (N2, SR-7609)**
  - Quote: "Load calculations shall not require continuous loads to be calculated at 125 percent." Informational Note: "A 125-percent multiplier could be required for reasons other than continuous load."
  - The SR-7609 committee statement concerns an acronym: "Applying the acronym in this occurrence is consistent with the action taken at the first draft."
  - C3 quotes the same sentence for the 2026 NEC.
  - G7: "Clarification was added on how to treat continuous loads for service and feeder calculations, specifically about the 125% rule."
  - Status: **VERIFIED-draft.**

---

## 4. Machine-readable

Conventions:
- Section numbers inside "text" fields are kept **as printed in PI 4311** ("120.x"). The 2023 edition prints 220.x.
- "status" uses the preamble keys.

```json
{"ref":"Table 220.55","edition":"2023","status":"VERIFIED-2023","source":"N1 PI 4311 (printed as Table 120.55)","title":"Demand Factors and Loads for Household Electric Ranges, Wall-Mounted Ovens, Counter-Mounted Cooking Units, and Other Household Cooking Appliances over 1 3/4 kW Rating (Column C to be used in all cases except as otherwise permitted in Note 3.)",
"columns":{"A":"less than 3.5 kW (printed: Less than 3 1/2 kW Rating) — demand factor %","B":"3.5–8.75 kW (printed: 3 1/2 kW through 8 3/4 kW Rating) — demand factor %","C":"not over 12 kW (printed: Maximum Demand (kW), Not over 12 kW Rating)"},
"rows":[{"n":1,"A_pct":80,"B_pct":80,"C_kw":8},{"n":2,"A_pct":75,"B_pct":65,"C_kw":11},{"n":3,"A_pct":70,"B_pct":55,"C_kw":14},{"n":4,"A_pct":66,"B_pct":50,"C_kw":17},{"n":5,"A_pct":62,"B_pct":45,"C_kw":20},{"n":6,"A_pct":59,"B_pct":43,"C_kw":21},{"n":7,"A_pct":56,"B_pct":40,"C_kw":22},{"n":8,"A_pct":53,"B_pct":36,"C_kw":23},{"n":9,"A_pct":51,"B_pct":35,"C_kw":24},{"n":10,"A_pct":49,"B_pct":34,"C_kw":25},{"n":11,"A_pct":47,"B_pct":32,"C_kw":26},{"n":12,"A_pct":45,"B_pct":32,"C_kw":27},{"n":13,"A_pct":43,"B_pct":32,"C_kw":28},{"n":14,"A_pct":41,"B_pct":32,"C_kw":29},{"n":15,"A_pct":40,"B_pct":32,"C_kw":30},{"n":16,"A_pct":39,"B_pct":28,"C_kw":31},{"n":17,"A_pct":38,"B_pct":28,"C_kw":32},{"n":18,"A_pct":37,"B_pct":28,"C_kw":33},{"n":19,"A_pct":36,"B_pct":28,"C_kw":34},{"n":20,"A_pct":35,"B_pct":28,"C_kw":35},{"n":21,"A_pct":34,"B_pct":26,"C_kw":36},{"n":22,"A_pct":33,"B_pct":26,"C_kw":37},{"n":23,"A_pct":32,"B_pct":26,"C_kw":38},{"n":24,"A_pct":31,"B_pct":26,"C_kw":39},{"n":25,"A_pct":30,"B_pct":26,"C_kw":40},
{"n":"26–30","A_pct":30,"B_pct":24,"C_kw":"15 kW + 1 kW for each range"},
{"n":"31–40","A_pct":30,"B_pct":22,"C_kw":"15 kW + 1 kW for each range","C_cell":"merged; printed once on the 26–30 row"},
{"n":"41–50","A_pct":30,"B_pct":20,"C_kw":"25 kW + 3/4 kW for each range"},
{"n":"51–60","A_pct":30,"B_pct":18,"C_kw":"25 kW + 3/4 kW for each range","C_cell":"merged; printed once on the 41–50 row"},
{"n":"61 and over","A_pct":30,"B_pct":16,"C_kw":"25 kW + 3/4 kW for each range","C_cell":"merged; printed once on the 41–50 row"}],
"notes":{"1":"Over 12 kW through 27 kW ranges all of same rating. For ranges individually rated more than 12 kW but not more than 27 kW, the maximum demand in Column C shall be increased 5 percent for each additional kilowatt of rating or major fraction thereof by which the rating of individual ranges exceeds 12 kW.",
"2":"Over 8 3/4 kW through 27 kW ranges of unequal ratings. For ranges individually rated more than 8 3/4 kW and of different ratings, but none exceeding 27 kW, an average value of rating shall be calculated by adding together the ratings of all ranges to obtain the total connected load (using 12 kW for any range rated less than 12 kW) and dividing by the total number of ranges. Then the maximum demand in Column C shall be increased 5 percent for each kilowatt or major fraction thereof by which this average value exceeds 12 kW.",
"3":"Over 1 3/4 kW through 8 3/4 kW. In lieu of the method provided in Column C, adding the nameplate ratings of all household cooking appliances rated more than 1 3/4 kW but not more than 8 3/4 kW and multiplying the sum by the demand factors specified in Column A or Column B for the given number of appliances shall be permitted. Where the rating of cooking appliances falls under both Column A and Column B, the demand factors for each column shall be applied to the appliances for that column, and the results added together.",
"4":["Calculating the branch-circuit load for one range in accordance with Table 120.55 shall be permitted.","The branch-circuit load for one wall-mounted oven or one counter-mounted cooking unit shall be the nameplate rating of the appliance.","The branch-circuit load for a counter-mounted cooking unit and not more than two wall-mounted ovens, all supplied from a single branch circuit and located in the same room, shall be calculated by adding the nameplate rating of the individual appliances and treating this total as equivalent to one range."],
"5":"This table shall also apply to household cooking appliances rated over 1 3/4 kW and used in instructional programs."},
"notes_text_status":"VERIFIED-2023","notes_numbering_status":"UNVERIFIED (every item extracted as '(1)'; 4/5 grouping per order + C sources)",
"pulls":{"raw":"N1 P2","data":"N1 P3","rows_compared":30,"mismatches":0},"cross_check":"partial match C6 (n=10,15 A/B; C for 10,15,20,30); C4-CT has Column C formulas swapped (do not use)"}
```

```json
{"ref":"220.82","edition":"2023","status":"VERIFIED-2023","source":"N1 PI 4311 (printed as 120.82); cross-check G1 (2022 CEC), G2, C7",
"scope_A":"a dwelling unit having the total connected load served by a single 120/240-volt or 208Y/120-volt set of 3-wire service or feeder conductors with an ampacity of 100 or greater",
"general_first_kva":10,"general_first_pct":100,"general_rest_pct":40,"va_per_ft2":3,"va_per_m2":33,
"floor_area":"outside dimensions of the dwelling unit; shall not include open porches, garages, or unused or unfinished spaces not adaptable for future use",
"small_appliance_and_laundry_va_each":1500,
"B3_nameplate_items":["All appliances that are fastened in place, permanently connected, or located to be on a specific circuit","Ranges, wall-mounted ovens, counter-mounted cooking units","Clothes dryers that are not connected to the laundry branch circuit specified in 120.82(B)(2)","Water heaters"],
"B4":"The nameplate ampere or kVA rating of all permanently connected motors not included in 120.82(B)(3).",
"heating_ac_rule":"The largest of the following six selections (load in kVA) shall be included",
"heating_ac_items":[
{"item":"(C)(1)","text":"100 percent of the nameplate rating(s) of the air conditioning and cooling.","pct":100},
{"item":"(C)(2)","text":"100 percent of the nameplate rating(s) of the heat pump when the heat pump is used without any supplemental electric heating.","pct":100},
{"item":"(C)(3)","text":"100 percent of the nameplate rating(s) of the heat pump compressor and 65 percent of the supplemental electric heating for central electric space-heating systems. If the heat pump compressor is prevented from operating at the same time as the supplementary heat, it does not need to be added to the supplementary heat for the total central space heating load.","pct":{"compressor":100,"supplemental_heat":65}},
{"item":"(C)(4)","text":"65 percent of the nameplate rating(s) of electric space heating if less than four separately controlled units.","pct":65},
{"item":"(C)(5)","text":"40 percent of the nameplate rating(s) of electric space heating if four or more separately controlled units.","pct":40},
{"item":"(C)(6)","text":"100 percent of the nameplate ratings of electric thermal storage and other heating systems where the usual load is expected to be continuous at the full nameplate value. Systems qualifying under this selection shall not be calculated under any other selection in 120.82(C).","pct":100}]}
```

```json
{"ref":"120.82","edition":"2026","status":"UNVERIFIED","basis":"secondary only (C2 Mike Holt 2026 Exam Prep sample, C3, C4-MN, C5); no NFPA text seen; no SR in N2; FD (N3) 220.x FRs not reached",
"general_first_kva":8,"general_first_pct":100,"general_rest_pct":40,"va_per_ft2":2,"new_D_evse":"EVSE at 100 percent [120.57 and 120.82(D)] per C2","heating_ac_items":"same six items per C4-MN (paraphrase)"}
```

```json
{"ref":"220.41","edition":"2023","status":"VERIFIED-2023","source":"N1 PI 4311 (printed as 120.41); C1",
"text":"In one-family, two-family, and multifamily dwellings, the minimum unit load shall be not less than 33 volt-amperes/m2 (3 volt-amperes/ft2).","va_per_ft2":3,"va_per_m2":33,
"floor_area_section_2023":"220.5(C) (printed 120.5(C) in the PI)",
"floor_area_text":"The floor area for each floor shall be calculated from the outside dimensions of the building, dwelling unit, or other area involved. For dwelling units, the calculated floor area shall not include open porches or unfinished areas not adaptable for future use as a habitable room or occupiable space.",
"link_220.41_to_220.5C":"UNVERIFIED (extractor narrative)",
"2026":{"ref":"120.41","va_per_ft2":2,"status":"UNVERIFIED (C1 NFPA-staff EC&M, C2, C3, C9)","new_120.13_branch_circuit_count_va_per_ft2":3,"new_120.13_status":"UNVERIFIED (C1, C2, C9)"}}
```

```json
{"ref":"Table 220.45","edition":"2023","status":"VERIFIED-2023 (dwelling rows: 2 pulls); other rows single read","source":"N1 PI 4311 (printed as Table 120.45)","title":"Lighting Load Demand Factors",
"dwelling_units":[{"portion":"First 3000 at","pct":100},{"portion":"From 3001 to 120,000 at","pct":35},{"portion":"Remainder over 120,000 at","pct":25}],
"hotels_motels_incl_apartment_houses_without_cooking_by_tenants":[{"portion":"First 20,000 or less at","pct":60},{"portion":"From 20,001 to 100,000 at","pct":50},{"portion":"Remainder over 100,000 at","pct":35}],
"warehouses_storage":[{"portion":"First 12,500 or less at","pct":100},{"portion":"Remainder over 12,500 at","pct":50}],
"all_others":[{"portion":"Total volt-amperes","pct":100}],
"footnote":"The demand factors of this table shall not apply to the calculated load of feeders or services supplying areas in hotels and motels where the entire lighting is likely to be used at one time, as in ballrooms or dining rooms.",
"note_2023_numbering":"Table 220.42(A) in 2023 = non-dwelling general lighting unit loads (G5; N2 SR-7797 for 120.42(A)); the demand table is 220.45",
"2026":{"ref":"Table 120.45","status":"UNVERIFIED (no change seen; C2 uses same tiers)"}}
```

```json
{"ref":"220.52","edition":"2023","status":"VERIFIED-2023","source":"N1 (printed 120.52); G1; G2",
"A_small_appliance_va_per_2wire_circuit":1500,"A_text":"In each dwelling unit, the load shall be calculated at 1500 volt-amperes for each 2-wire small-appliance branch circuit as covered by 210.11(C)(1).",
"B_laundry_va_per_2wire_circuit":1500,"B_text":"A load of not less than 1500 volt-amperes shall be included for each 2-wire laundry branch circuit installed as covered by 210.11(C)(2).",
"not_captured":"superseded: full (A), (B) and the Exception captured in section 'Follow-up 2026-10-20'","2026":{"ref":"120.52","status":"UNVERIFIED (no SR seen)"}}
```

```json
{"ref":"220.53","edition":"2023","status":"VERIFIED-2023","source":"L1 (NFPA permission notice) + N1",
"pct":75,"min_appliances":4,"qualifying":"rated 1/4 hp or greater, or 500 watts or greater, fastened in place, served by the same feeder or service in a one-family, two-family, or multifamily dwelling",
"excluded":["Household electric cooking equipment that is fastened in place","Clothes dryers","Space heating equipment","Air-conditioning equipment","Electric vehicle supply equipment (EVSE)"],"2026":{"ref":"120.53","status":"UNVERIFIED (no SR seen)"}}
```

```json
{"ref":"220.54","edition":"2023","status":"VERIFIED-2023","source":"N1 (printed 120.54); G2",
"text":"The load for household electric clothes dryers in a dwelling unit(s) shall be either 5000 watts (volt-amperes) or the nameplate rating, whichever is larger, for each dryer served. The use of the demand factors in Table 120.54 shall be permitted.","min_w":5000,
"table":{"ref":"Table 220.54","rows":[{"n":"1–4","pct":100},{"n":"5","pct":85},{"n":"6","pct":75},{"n":"7","pct":65},{"n":"8","pct":60},{"n":"9","pct":55},{"n":"10","pct":50},{"n":"11","pct":47},{"n":"12–23","pct":"47% minus 1% for each dryer exceeding 11"},{"n":"24–42","pct":"35% minus 0.5% for each dryer exceeding 23"},{"n":"43 and over","pct":"25%"}],
"pulls":"rows 1–4: one NFPA read (N1) + C3, C4-CT, C4-MI agree; rows 5–43+: N1 + N2 redline"}}
```

```json
{"ref":"120.54","edition":"2026","status":"VERIFIED-other-edition (NFPA 70-2026 via N4 NEC Handbook 2026 replacement page, errata dated March 27, 2026)",
"text":"The load for household electric clothes dryers in a dwelling unit(s) shall be the nameplate rating if available or 5000 watts (volt-amperes), whichever is larger, for each dryer served. The use of the demand factors in Table 120.54 shall be permitted. Where two or more single-phase dryers are supplied by a 3-phase, 4-wire feeder or service, the total load shall be calculated on the basis of twice the maximum number connected between any two phases. Kilovoltamperes (kVA) shall be considered equivalent to kilowatts (kW) for loads calculated in this section.",
"table":{"ref":"Table 120.54","title":"Demand Factors for Household Electric Clothes Dryers","rows":[{"n":"1–2","pct":100},{"n":"3–5","pct":80},{"n":"6","pct":75},{"n":"7","pct":65},{"n":"8","pct":60},{"n":"9","pct":55},{"n":"10","pct":50},{"n":"11","pct":47},{"n":"12–23","pct":"47% minus 1% for each dryer exceeding 11"},{"n":"24–42","pct":"35% minus 0.5% for each dryer exceeding 23"},{"n":"43 and over","pct":"25%"}],
"pulls":"N4 raw == N4 pairs; rows 6–43+ == N2 redline; N2 redline consistent with 1–2→100, 3–5→80"},
"changed_counts_vs_2023":[{"n":3,"2023":100,"2026":80},{"n":4,"2023":100,"2026":80},{"n":5,"2023":85,"2026":80}]}
```

```json
{"ref":"Table 220.56","edition":"2023","status":"VERIFIED-2023 (2 pulls)","source":"N1 (printed Table 120.56)","rows":[{"n":"1","pct":100},{"n":"2","pct":100},{"n":"3","pct":90},{"n":"4","pct":80},{"n":"5","pct":70},{"n":"6 and over","pct":65}],
"2026":{"ref":"120.56","status":"UNVERIFIED","note":"C9: instantaneous water heaters now included"}}
```

```json
{"ref":"220.57","edition":"2023","status":"VERIFIED-2023","source":"L1 + N1","text":"The EVSE load shall be calculated at either 7200 watts (volt-amperes) or the nameplate rating of the equipment, whichever is larger.","min_w":7200,"rule":"larger of 7200 W (VA) or nameplate",
"2026":{"ref":"120.57","status":"intent VERIFIED-draft (N2 SR-7809 committee statement); exact wording UNVERIFIED; CONFLICTING within C2","rule_per_draft_and_C3":"nameplate rating if available, otherwise 7200 W (VA)","committee_statement":"The revision allows the use of nameplate ratings, in lieu of the 7200 VA value."}}
```

```json
{"ref":"220.60","edition":"2023","status":"VERIFIED-2023","source":"N1","text":"If it is unlikely that two or more noncoincident loads will be in use simultaneously, using only the largest load(s) that will be used at one time for calculating the total load of a feeder or service shall be permitted. If a motor or air-conditioning load is part of the noncoincident load and is not the largest of the noncoincident loads, 125 percent of either the motor load or air-conditioning load, whichever is larger, shall be used in the calculation.","2026":{"ref":"120.60","status":"UNVERIFIED (no SR seen)"}}
```

```json
{"ref":"220.61","edition":"2023","status":"VERIFIED-2023","source":"N1 (printed 120.61)",
"A":"The feeder or service neutral load shall be the maximum unbalance of the load determined by this article. The maximum unbalanced load shall be the maximum net calculated load between the neutral conductor and any one ungrounded conductor.",
"B_additional_demand_pct":70,
"B1":"ranges, wall-mounted ovens, counter-mounted cooking units, and electric dryers, where the maximum unbalanced load has been determined in accordance with Table 120.55 for ranges and Table 120.54 for dryers",
"B2_threshold_a":200,"B2":"That portion of the unbalanced load in excess of 200 amperes where the feeder or service is supplied from a 3-wire dc or single-phase ac system; a 4-wire, 3-phase system; a 3-wire, 2-phase system; or a 5-wire, 2-phase system.",
"C_no_reduction":["Any portion of a 3-wire circuit consisting of 2 ungrounded conductors and the neutral conductor of a 4-wire, 3-phase, wye-connected system","That portion consisting of nonlinear loads supplied from a 4-wire, wye-connected, 3-phase system"],
"2026":{"ref":"120.61(B)(1)","status":"VERIFIED-draft (N2 SR-7812)","change":"70% applies to the portion of the feeder or service (neutral) supplying ranges/ovens/cooktops/dryers; 70% unchanged"}}
```

```json
{"ref":"220.83","edition":"2023","status":"VERIFIED-2023 ((A) table 2 pulls; (B) table 1 NFPA read + G6)","source":"N1 (printed 120.83); G3, G4, G6",
"va_per_ft2":3,"va_per_m2":33,"small_appliance_laundry_va":1500,
"A_no_added_ac_or_heat":[{"load":"First 8 kVA of load at","pct":100},{"load":"Remainder of load at","pct":40}],
"B_ac_or_heat_added":[{"load":"Air-conditioning equipment","pct":100},{"load":"Central electric space heating","pct":100},{"load":"Less than four separately controlled space-heating units","pct":100},{"load":"First 8 kVA of all other loads","pct":100},{"load":"Remainder of all other loads","pct":40}]}
```

```json
{"ref":"120.83","edition":"2026","status":"VERIFIED-draft (N2 SR-7832, single read, flattened)","va_per_ft2":2,"va_per_m2":22,"small_appliance_laundry_va":1500,
"table":[{"load":"First 8 kVA of existing and new load","pct":100},{"load":"Remainder of existing load","pct":40},{"load":"New EVSE","pct":80},{"load":"New central electric resistance space heating","pct":80},{"load":"All other new loads","pct":50}],"corroboration":"C3, C5"}
```

```json
{"ref":"220.84","edition":"2023","status":"VERIFIED-2023","source":"N1 (printed 120.84; table label extracted as 'Table 120.84(B)')",
"conditions":["No dwelling unit is supplied by more than one feeder.","Each dwelling unit is equipped with electric cooking equipment.","Each dwelling unit is equipped with either electric space heating or air conditioning, or both."],
"C1_va_per_ft2":3,"C2_va_each":1500,"C9":"The larger of the air-conditioning load or the fixed electric space-heating load","C3_to_C8":"not captured",
"table":[{"units":"3–5","pct":45},{"units":"6–7","pct":44},{"units":"8–10","pct":43},{"units":"11","pct":42},{"units":"12–13","pct":41},{"units":"14–15","pct":40},{"units":"16–17","pct":39},{"units":"18–20","pct":38},{"units":"21","pct":37},{"units":"22–23","pct":36},{"units":"24–25","pct":35},{"units":"26–27","pct":34},{"units":"28–30","pct":33},{"units":"31","pct":32},{"units":"32–33","pct":31},{"units":"34–36","pct":30},{"units":"37–38","pct":29},{"units":"39–42","pct":28},{"units":"43–45","pct":27},{"units":"46–50","pct":26},{"units":"51–55","pct":25},{"units":"56–61","pct":24},{"units":"62 and over","pct":23}],
"pulls":"N1 data == N1 endpoints == N2 raw (23/23 identical)",
"2026":{"ref":"120.84 / Table 120.84(C)","status":"VERIFIED-draft (table rows, relabel, (A) revision); (C)(1) 2 VA/ft2 UNVERIFIED in this run"}}
```

```json
{"ref":"220.85","edition":"2023","status":"VERIFIED-2023","text":"Where two dwelling units are supplied by a single feeder or service and the calculated load under Part III of this article exceeds that for three identical units calculated under 120.84, the lesser of the two loads shall be permitted to be used."}
```

```json
{"ref":"220.87","edition":"2023","status":"VERIFIED-2023 (items (1),(2) only)","item_1":"The maximum demand data is available for a 1-year period.","item_2":"The maximum demand at 125 percent plus the new load does not exceed the ampacity of the feeder or rating of the service.","multiplier_pct":125,
"2026":{"ref":"120.87","status":"VERIFIED-draft (125%); exact wording UNVERIFIED","draft_line_flattened":"(2) The maximum demand at 125 percent plus the new load does load minus any removed load determined in accordance"}}
```

```json
{"ref":"120.5(E)","edition":"2026","status":"VERIFIED-draft (N2 SR-7609)","text":"Load calculations shall not require continuous loads to be calculated at 125 percent.","informational_note":"A 125-percent multiplier could be required for reasons other than continuous load.","corroboration":"C3 (identical sentence); G7"}
```

```json
[
{"2023":"220.5(C) floor area","2026":"120.5(C)","value_change":"none seen","status_2026":"number per C1 only"},
{"2023":"(none)","2026":"120.5(E)","value_change":"new: continuous loads not required at 125% in load calculations","status_2026":"VERIFIED-draft"},
{"2023":"(none)","2026":"120.13","value_change":"new: branch-circuit count at 3 VA/ft2","status_2026":"UNVERIFIED (C)"},
{"2023":"220.41","2026":"120.41","value_change":"3 VA/ft2 -> 2 VA/ft2","status_2026":"UNVERIFIED (C, incl. NFPA-staff EC&M)"},
{"2023":"Table 220.42(A) (non-dwelling)","2026":"Table 120.42(A)","value_change":"125% note removed; values not changed per committee intent","status_2026":"VERIFIED-draft (statement)"},
{"2023":"Table 220.45","2026":"Table 120.45","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.52","2026":"120.52","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.53","2026":"120.53","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.54 + Table 220.54","2026":"120.54 + Table 120.54","value_change":"table 1–4@100,5@85 -> 1–2@100,3–5@80; text now 'nameplate rating if available or 5000 watts (volt-amperes), whichever is larger'","status_2026":"VERIFIED-other-edition (N4)"},
{"2023":"220.55 + Table 220.55","2026":"120.55 + Table 120.55","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.56 + Table 220.56","2026":"120.56","value_change":"instantaneous water heaters added (C9); values not seen","status_2026":"UNVERIFIED"},
{"2023":"220.57","2026":"120.57","value_change":"larger of 7200 W or nameplate -> nameplate if available, else 7200 W","status_2026":"intent VERIFIED-draft; wording UNVERIFIED"},
{"2023":"220.60","2026":"120.60","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.61","2026":"120.61","value_change":"(B)(1) reworded (portion of feeder/service); 70% and 200 A unchanged as far as seen","status_2026":"VERIFIED-draft ((B)(1) only)"},
{"2023":"220.82","2026":"120.82","value_change":"secondary: 3->2 VA/ft2; first 10 kVA -> first 8 kVA at 100%; new (D) EVSE at 100%","status_2026":"UNVERIFIED"},
{"2023":"220.83 (A)/(B) tables","2026":"120.83 single Table 120.83","value_change":"3->2 VA/ft2; new table (8 kVA existing+new 100; rest of existing 40; new EVSE 80; new central resistance heat 80; other new 50)","status_2026":"VERIFIED-draft"},
{"2023":"220.84 + Table 220.84(B)","2026":"120.84 + Table 120.84(C)","value_change":"table rows none; relabel B->C; (A) single-phase 120/208V units; (C)(1) 3->2 VA/ft2 not re-seen this run","status_2026":"VERIFIED-draft (except (C)(1))"},
{"2023":"220.85","2026":"120.85","value_change":"none seen","status_2026":"UNVERIFIED"},
{"2023":"220.87","2026":"120.87","value_change":"(2) reworded (new load, minus removed load); 125% unchanged","status_2026":"VERIFIED-draft (125%)"}
]
```

---

## 5. Blocked or failed

1. **docinfofiles.nfpa.org**: all 6 of 6 fetches were used, with no 429:
   - FD PrelimFR ×1
   - SD PrelimSR ×1
   - Handbook errata ×1
   - PI submittals ×3

   The FD (N3) first window ended at 210.8(F) with **no 220/120 First Revisions**. No offset read was possible within budget, so the 120.41 and 120.82 First Revisions were not reached.
2. **Clark County NV** "NEC_Art_220-08SR15232.pdf" (https://files.clarkcountynv.gov/Building & Fire Prevention/Plan Review/Disciplines/NEC_Art_220-08SR15232.pdf): ROBOTS_DISALLOWED.
3. **captaincode2026.leviton.com/node/319**: ROBOTS_DISALLOWED. The URL was built from the 2023 pattern.
4. **Mike Holt 2023 samples** (23_CALC_220.70.pdf, "23_CC_220.70 .pdf"): only 220.70 content; no target values.
5. **Title-only sources**: Mike Holt TOC PDFs (C10) and the Utah course outlines (G5) gave section titles only.
6. **No usable values**: MN DLI change summary (https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf) had no Article 120 values beyond the relocation. G7, C7 and C8 had no tables.
7. **Secondary sources with errors (do not use)**:
   - C4 CT: Table 220.55 Column C formulas swapped for 28 and up; dryer 24–42 formula differs from the NFPA wording.
   - C4 MI: dryer 24–42 row truncated to "35%".
8. **WebSearch**: 18 of 18 used.

## 6. Open gaps

1. **2026 120.82**: VA/ft², 8 versus 10 kVA, and new (D) EVSE at 100%. NFPA text not seen. Next step: read N3 (FD PrelimFR) past the 210.x First Revisions, or the CMP-2 FD minutes (70_A2025_NEC_P02_FD_Minutes_0124.pdf), in a run with a fresh docinfofiles budget.
2. **2026 120.41 at 2 VA/ft²**: not seen in any NFPA document; same next step.
3. **2026 120.57 exact wording**: the redline is flattened, and C2 contradicts itself.
4. **2026 values with no Second Revision seen**: Table 120.55, 120.52, 120.53, 120.56 (including the water-heater scope change), 120.60, 120.85 and Table 120.45. The First Draft was not read for these.
5. **Final 2026 text** for 120.5(E), 120.61(B)(1), 120.83, 120.84 and 120.87: only the October 2024 draft was seen. 120.84(C)(1) at 2 VA/ft² was not re-seen in this run.
6. **Table 220.55 note numbering**: the extractor prints every item as "(1)". The grouping into Note 4 and Note 5 rests on order plus C sources.
7. **2023 text captured only in part**:
   - 220.41: sentences after the first
   - 220.52: (A) and (B) remainder, and the exception
   - 220.54: 3-phase and kVA sentences
   - 220.61(A): any exception
   - 220.82(B)(3): exact sub-item lettering
   - 220.83: lead-in remainder and (B) item list
   - 220.84(B) house loads and (C)(3)–(8)
   - 220.87: lead-in and exception
8. **PI 4311 header and substantiation** were not visible, so "relocation without technical change" is inferred. Supporting evidence: unrenumbered cross-references, and a word-for-word match with L1 for 220.53 and 220.57.
9. **220.82(A)**: the extraction reads "ampacity of 100 or greater", with no unit word. Confirm with a second 2023 reproduction before quoting it as "100 A".
10. **PDF page numbers** are unavailable for N1, N2 and N3.

## 7. Contradictions with the current site plan (from the brief)

1. **The brief's 220.82(C) list is wrong for 2023.** It has no "65% of central electric space heating" item. The actual list is:
   - 100% A/C
   - **100% heat pump without supplemental heat**
   - 100% HP compressor + 65% supplemental heat
   - 65% if <4 separately controlled units
   - 40% if ≥4 units
   - 100% thermal storage
2. **Two floor-area exclusion wordings in 2023.**
   - The standard method's floor area rule (220.5(C)) excludes "open porches or unfinished areas not adaptable for future use as a habitable room or occupiable space". It does not name garages.
   - 220.82(B)(1) excludes "open porches, garages, or unused or unfinished spaces not adaptable for future use".
   - Calculators should apply the wording that belongs to each method.
3. **A "2026 mode" cannot reuse the 2023 math.** Each item has a different status:
   - Table 120.54 changed: 3–5 dryers at 80%. Verified.
   - 120.83 is a new single table with 2 VA/ft². Draft.
   - 120.57 uses nameplate if available, else 7200 W. Draft intent.
   - 120.82 may use first 8 kVA, 2 VA/ft² and EVSE at 100%. Unverified.
   - 120.41 at 2 VA/ft². Unverified.
4. **Note 4 is confirmed.** Its text includes the counter-mounted cooking unit plus up to two wall-mounted ovens item, and Note 5 is the instructional-programs note. The numbers 4 and 5 themselves are inferred, not printed.

---

## Follow-up 2026-10-20

- **Scope:** the coordinator's narrow follow-up: the rest of 220.52; 220.50; 220.51; 220.14 (only if in the same window); Annex D Examples D1(a) and D1(b).
- **Retrieval date:** 2026-10-20.
- **docinfofiles.nfpa.org:** 6 of 6 fetches used (F1–F6), no 429.
- **WebSearch: none performed.** Both attempts were refused with "this turn's web search budget is used up (limit: 200 WebSearch calls per turn, shared by every agent in it)". I did not try to work around the limit.

**Source for F1, F2, F3 and F6: N1.**
- Document: NFPA, NFPA 70 A2025 CMP-2 Public Input submittals, PI 4311. It reproduces the NFPA 70-2023 Article 220 text under "120.x" numbers.
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_PISubmittals.pdf
- No permission notice was extracted; it is NFPA's own document.
- PDF page numbers were not returned.
- Every 220.14–220.52 section sits in the same readable window as PI 4311, which runs from 120.1 to 120.103.

### FU status matrix

| Item | 2023 value | Status |
|---|---|---|
| 220.52(A), complete | 1500 VA per 2-wire small-appliance circuit. Where the load is subdivided through two or more feeders, each feeder includes at least 1500 VA per such circuit. **The loads may be included with the general lighting load and subjected to the Table 220.45 demand factors.** Exception: the individual branch circuit permitted by 210.52(B)(1) Exception No. 2 may be excluded | VERIFIED-2023. Full text in F1; the inclusion sentence re-pulled in F3 |
| 220.52(B), complete | At least 1500 VA per 2-wire laundry circuit. **May be included with the general lighting load and subjected to the Table 220.45 demand factors** | VERIFIED-2023 (F1 + F3) |
| 220.50 | Title "Motors and Air-Conditioning Equipment". (A) Motors: 430.24, 430.25 and 430.26. (B) A/C hermetic refrigerant motor-compressors: Part IV of Article 440. **No 440.6 cross-reference** | VERIFIED-2023 (F1 and F6 identical) |
| 220.51 | 100 percent of the total connected load. The feeder or service load current rating may not be less than the largest branch circuit supplied. The Exception lets the AHJ permit less than 100 percent for duty-cycle, intermittent or non-simultaneous units | VERIFIED-2023. First sentence pulled twice (F1, F6); the rest once (F1) |
| 220.14 | Subdivisions **(A)–(K)**, not (A)–(L). Values: (D) luminaire maximum VA rating; (E) 600 VA; (F) 1200 VA per required branch circuit; (G) 200 VA per 300 mm (1 ft) of show window; (H) 180 VA per 1.5 m (5 ft) when appliances are unlikely to be used simultaneously, or per 300 mm (1 ft) when likely; (I) 180 VA per single or multiple receptacle on one yoke; (J) 11 VA/m² (1 VA/ft²) for office buildings; (K) 180 VA per outlet | The quoted phrases are VERIFIED-2023. The full text was not obtained (the extractor declined), so the rest is UNVERIFIED |
| Annex D Examples D1(a) and D1(b), 2023 | — | **NOT FOUND (UNVERIFIED).** No authorized copy was reached |

### FU-T1. 220.52, complete (N1; printed as 120.52)

**Pull F1, consecutive segments as extracted**
- Title: "120.52 Small-Appliance and Laundry Loads — Dwelling Unit ."
- (A), label extracted as "(1)":
  - "In each dwelling unit, the load shall be calculated at 1500 volt-amperes for each 2-wire small-appliance" / "branch circuit as covered by 210.11(C)(1 ) ."
  - "Where the load is subdivided through two or more feeders, the calculated load for each shall include not less than" / "1500 volt-amperes for each 2-wire small-appliance branch circuit."
  - "These loads shall be permitted to be included with the general lighting load and subjected to the demand" / "factors provided in Table 1 20.4 5 ."
  - "Exception: The individual branch circuit permitted by 210.52(B)(1 ) , Exception No. 2, shall be permitted to be" / "excluded from the calculation required by 1 20.5 2 ."
- (B), label extracted as "(1)":
  - "A load of not less than 1500 volt-amperes shall be included for each 2-wire laundry branch circuit installed" / "as covered by 210.11(C)(2 ) ."
  - "This load shall be permitted to be included with the general lighting load and shall be subjected to the" / "demand factors provided in Table 1 20.4 5 ."

**Pull F3, inclusion sentences only**
- The extractor returned only the opening clauses, citing its 125-character limit:
  - (A): "These loads shall be permitted to be included with the general lighting load"
  - (B): "This load shall be permitted to be included with the general lighting load"
- Both match F1.

**Notes**
- "Table 1 20.4 5" is Table 120.45 under the PI's renumbering, which is 2023 Table 220.45 (see T1).
- The (A) and (B) subdivision titles did not extract. They are corroborated by the G5 2023 outline: "220.52(A) Small-appliance Circuit Load"; "220.52(B) Laundry Circuit Load".

Status: **VERIFIED-2023**.

### FU-T2. 220.50 and 220.51 (N1; printed as 120.50 and 120.51)

**220.50, pull F1**
- Title: "120.50 Motors and Air-Conditioning Equipment ."
- (A) Motors, label extracted "(1)(a)": "The conductor sizing requirements specified in 430.2 4 and 430.2 5 and the feeder demand factor calculation" / "method specified in 430.2 6 shall be used to determine motor loads."
- (B) Air-Conditioning Equipment: "The conductor sizing requirements specified in Part IV of Article 440 shall be used to determine airconditioning" / "loads for hermetic refrigerant motor-compressors."
- Extractor's note: "440.6 is not referenced in 120.50 as extracted. It appears elsewhere in the visible text (120.11(B))."

**220.50, pull F6**
- Title: "120.50 Motors and Air-Conditioning Equipment ."
- (A): "The conductor sizing requirements specified in 430.2 4 and 430.2 5 and the feeder demand factor" / "calculation method specified in 430.2 6 shall be used to determine motor loads."
- (B): "The conductor sizing requirements specified in Part IV of Article 440 shall be used to determine" / "airconditioning loads for hermetic refrigerant motor-compressors."
- Asked whether "440.6" appears in 120.50, the extractor answered: "**No.**"

Status: **VERIFIED-2023** (two pulls, identical). The brief expected a 440.6 cross-reference; the 2023 text has none.

**220.51, pull F1**
- Title: "120.51 Fixed Electric Space Heating ."
- "Fixed electric space-heating loads shall be calculated at 100 percent of the total connected load."
- "However, in no case shall a feeder or service load current rating be less than the rating of the largest" / "branch circuit supplied."
- "Exception: If reduced loading of the conductors results from units operating on duty-cycle or intermittently," / "or from all units not operating at the same time, the authority having jurisdiction sha ll be permitted to grant" / "permission for feeder and service conductors to have an ampacity less than 100 percent if the conductors have an" / "ampacity for the load so determined."

**220.51, pull F6 (first sentence)**
- "Fixed electric space-heating loads shall be calculated at 100 percent of the total connected load." Matches F1.

Status: **VERIFIED-2023**. The text after the first sentence is a single pull.

### FU-T3. 220.14 (N1; printed as 120.14; same window as PI 4311)

**Pull F2.** The extractor declined to reproduce the whole section: "reproducing every subdivision, VA value, and note verbatim would amount to copying most of a copyrighted NFPA code section". It returned:
- Lead-in: "Branch-circuit load calculations shall include calculation of a minimum load on each outlet as calculated"
- Titles:
  - (A) Specific Appliances or Loads
  - (B) Electric Dryers and Electric Cooking Appliances in Dwellings and Household Cooking Appliances Used in Instructional Programs
  - (C) Motor Outlets
  - (D) Luminaires
  - (E) Heavy-Duty Lampholders
  - (F) Sign and Outline Lighting
  - (G) Show Windows
  - (H) Fixed Multioutlet Assemblies
  - (I) Receptacle Outlets
  - (J) Receptacle Outlets in Office Buildings
  - (K) Other Outlets
- Quote: "120.14 has subdivisions **(A) through (K)**, not (L). The section ends with "(K) Other Outlets.""

**Pull F3, numeric phrases**
- (E): "shall be calculated at a minimum of 600 volt-amperes"
- (F): "calculated at a minimum of 1200 volt-amperes for each required branch circuit"
- (G): "At 200 volt-amperes per linear 300 mm (1 ft) of show window"
- (H): "shall be considered as an outlet of not less than 180 volt-amperes"
- (I): "calculated at not less than 180 volt-amperes for each single or for each multiple receptacle on one yoke"
- (J): "11 volt-amperes/ m2 (1 volt-ampere/f t2 )"
- (K): "calculated based on 180 volt-amperes per outlet"
- (A)–(D): "no numeric value"

**Pull F6**
- (H): "Where appliances are unlikely to be used simultaneously, each 1.5 m (5 ft) or fraction thereof of" / "each separate and continuous length shall be considered as one outlet of not less than 180 voltamperes ." / "Where appliances are likely to be used simultaneously, each 300 mm (1 ft) or fraction thereof shall" / "be considered as an outlet of not less than 180 volt-amperes ."
- (D): "An outlet supplying a luminaire(s) shall be calculated based on the maximum volt-ampere rating of the" / "equipment and lamps for which the luminaire(s) is rated."

**Status**
- The quoted phrases are **VERIFIED-2023**. The (H) 180 VA value was seen in both F3 and F6; every other phrase was pulled once.
- **UNVERIFIED:** the rest of 220.14, including the (A)–(C) rules, any other text in (G), the (I) and (J) conditions and exceptions, and any informational notes.
- The brief says (A)–(L); PI 4311 shows (A)–(K).

### FU-T4. Annex D Examples D1(a) and D1(b), 2023: NOT FOUND

**Checked on 2026-10-20**
- **N1 PI submittals (F3):** "No Annex D PI is visible that reproduces Example D1(a) or D1(b)." "The first PI number in the document is Public Input No. 3085."
- **N3 FD PrelimFR (F4):** "FR 8210-NFPA 70-2024 (Global Input) covers Example D3(a)." "Examples D1(a) and D1(b): Not visible." Committee statement: "This revision applies consistent usage of the defined term "branch circuit overcurrent protective device.""
- **N2 SD PrelimSR (F5):** "SR-7974-NFPA 70-2024 (Global Comment), examples visible: Example D3 (Store Building) and Example D3(a) (Industrial Feeders in a Common Raceway)." "D1 not visible." Statement: "Revisions are made throughout Annex D Examples under the purview of CMP 2 to" / "address the deletion of the term "Overcurrent Protective Device, Branch-Circuit". This" / "term is replaced by "Overcurrent Protective Device", and is abbreviated as "OCPD"."
- **S15**, NFPA, "NFPA 70® Changes to the National Electrical Code® 2023 Edition", 3/29/2023, "© National Fire Protection Association. All rights reserved.", hosted by Georgia DCA (https://dca.georgia.gov/document/public-notices/2023necchangespresentationpdf/download): "no slide on Informative Annex D, Example D1(a), or Example D1(b)".
- **IAEI, two articles; neither reproduces D1:**
  - C7, Hunter, May 16, 2013 (https://iaeimagazine.org/?p=8433). Its own example tables "appear only as images". No reprint notice.
  - W. A. Werning, "House Divided", undated (https://iaeimagazine.org/?p=9182). A multifamily example. No reprint notice.
- **Corroboration-tier pages; neither is Annex D:**
  - EC&M, Mike Holt, "One-Family Dwelling Unit Load Calculations", Aug 17, 2015 (https://ecmweb.com/national-electrical-code/code-basics/article/20900596/onefamily-dwelling-unit-load-calculations). No worked example.
  - OpenExamPrep ICC 5.3 (https://open-exam-prep.com/study-guides/icc-electrical-plans-examiner/feeder-load-calculations/dwelling-optional-method). The page's own 3,000 sq ft example, edition not stated. Not usable as Annex D.

**Search attempts.** Two queries were tried and both were refused by the shared search limit:
- "Example D1(a)" "One-Family Dwelling" 2023 NEC Annex D load calculation pdf
- "Example D1(b)" "Optional Calculation for One-Family Dwelling" Annex D

**Observation, not a finding.** In the A2025 FD and SD working drafts, Annex D revisions come first, and only D3 and D3(a) were visible. "Not visible" does not prove that D1(a) and D1(b) were left unrevised for 2026.

**Leads for a next run (not tried here)**
1. 70_A2025_NEC_AAC_SD_SCRReport.pdf. Correlating Committee revisions might carry Annex D edits that correlate with 120.41 and 120.82.
2. The Annex D PIs near the end of 70_A2025_NEC_P02_PISubmittals.pdf. These need an offset read.
3. 70_A2022_NEC_P02_SD_PCSubmittals.pdf. Its public comments reproduce the 2023-cycle First Draft text.
4. Authorized reproductions found by search: IAEI articles with an NFPA permission notice, NFPA Handbook sample pages, or city plan-review handouts that reproduce D1(a) or D1(b).

### FU machine-readable

Whitespace artifacts inside numbers ("430.2 4", "1 20.4 5", "210.11(C)(1 )") are closed up below. No word or value is changed. The section numbers are the PI's, so 120.x corresponds to 2023 220.x.

```json
{"ref":"220.52","edition":"2023","status":"VERIFIED-2023","source":"N1 PI 4311 (printed 120.52); pulls F1 (full) + F3 (inclusion sentences)","retrieved":"2026-10-20",
"A":{"va_per_2wire_small_appliance_circuit":1500,"text":"In each dwelling unit, the load shall be calculated at 1500 volt-amperes for each 2-wire small-appliance branch circuit as covered by 210.11(C)(1). Where the load is subdivided through two or more feeders, the calculated load for each shall include not less than 1500 volt-amperes for each 2-wire small-appliance branch circuit. These loads shall be permitted to be included with the general lighting load and subjected to the demand factors provided in Table 120.45.","exception":"The individual branch circuit permitted by 210.52(B)(1), Exception No. 2, shall be permitted to be excluded from the calculation required by 120.52.","may_add_to_general_lighting_before_lighting_demand_table":true},
"B":{"va_per_2wire_laundry_circuit_min":1500,"text":"A load of not less than 1500 volt-amperes shall be included for each 2-wire laundry branch circuit installed as covered by 210.11(C)(2). This load shall be permitted to be included with the general lighting load and shall be subjected to the demand factors provided in Table 120.45.","may_add_to_general_lighting_before_lighting_demand_table":true},
"numbering":"PI prints Table 120.45 and 120.52; 2023 edition = Table 220.45 and 220.52"}
```

```json
{"ref":"220.50","edition":"2023","status":"VERIFIED-2023 (F1 and F6 identical)","title":"Motors and Air-Conditioning Equipment",
"A_motors":"The conductor sizing requirements specified in 430.24 and 430.25 and the feeder demand factor calculation method specified in 430.26 shall be used to determine motor loads.",
"B_air_conditioning":"The conductor sizing requirements specified in Part IV of Article 440 shall be used to determine airconditioning loads for hermetic refrigerant motor-compressors.",
"cites":["430.24","430.25","430.26","Article 440, Part IV"],"cites_440_6":false}
```

```json
{"ref":"220.51","edition":"2023","status":"VERIFIED-2023 (first sentence 2 pulls; remainder 1 pull)","pct_of_total_connected_load":100,
"text":"Fixed electric space-heating loads shall be calculated at 100 percent of the total connected load. However, in no case shall a feeder or service load current rating be less than the rating of the largest branch circuit supplied.",
"exception":"If reduced loading of the conductors results from units operating on duty-cycle or intermittently, or from all units not operating at the same time, the authority having jurisdiction shall be permitted to grant permission for feeder and service conductors to have an ampacity less than 100 percent if the conductors have an ampacity for the load so determined."}
```

```json
{"ref":"220.14","edition":"2023","status":"PARTIAL — quoted phrases VERIFIED-2023; full text UNVERIFIED (extractor declined)","subdivisions":"A–K (no L in PI 4311)",
"lead_in":"Branch-circuit load calculations shall include calculation of a minimum load on each outlet as calculated",
"items":[
{"sub":"A","title":"Specific Appliances or Loads","value":null},
{"sub":"B","title":"Electric Dryers and Electric Cooking Appliances in Dwellings and Household Cooking Appliances Used in Instructional Programs","value":null},
{"sub":"C","title":"Motor Outlets","value":null},
{"sub":"D","title":"Luminaires","text":"An outlet supplying a luminaire(s) shall be calculated based on the maximum volt-ampere rating of the equipment and lamps for which the luminaire(s) is rated."},
{"sub":"E","title":"Heavy-Duty Lampholders","text":"shall be calculated at a minimum of 600 volt-amperes","va":600},
{"sub":"F","title":"Sign and Outline Lighting","text":"calculated at a minimum of 1200 volt-amperes for each required branch circuit","va":1200},
{"sub":"G","title":"Show Windows","text":"At 200 volt-amperes per linear 300 mm (1 ft) of show window","va_per_linear_ft":200,"rest_of_G":"not seen"},
{"sub":"H","title":"Fixed Multioutlet Assemblies","text":["Where appliances are unlikely to be used simultaneously, each 1.5 m (5 ft) or fraction thereof of each separate and continuous length shall be considered as one outlet of not less than 180 voltamperes.","Where appliances are likely to be used simultaneously, each 300 mm (1 ft) or fraction thereof shall be considered as an outlet of not less than 180 volt-amperes."],"va":180},
{"sub":"I","title":"Receptacle Outlets","text":"calculated at not less than 180 volt-amperes for each single or for each multiple receptacle on one yoke","va":180,"conditions_exceptions":"not seen"},
{"sub":"J","title":"Receptacle Outlets in Office Buildings","text":"11 volt-amperes/ m2 (1 volt-ampere/f t2 )","va_per_ft2":1,"va_per_m2":11,"conditions":"not seen"},
{"sub":"K","title":"Other Outlets","text":"calculated based on 180 volt-amperes per outlet","va":180}]}
```

```json
{"ref":"Annex D Example D1(a) and D1(b)","edition":"2023","status":"UNVERIFIED — no authorized copy reached","inputs":null,"intermediate_figures":null,"final_figures":null,
"checked":["N1 PI submittals first window: no Annex D PI (first PI 3085)","N3 FD first window: only FR-8210, Example D3(a)","N2 SD first window: only SR-7974, Examples D3 and D3(a)","S15 NFPA 2023 changes presentation: no Annex D slide","IAEI Hunter 2013 and Werning 'House Divided': no D1","EC&M Holt 2015 and OpenExamPrep ICC 5.3: not Annex D"],
"websearch":"0 performed — shared per-turn limit reached",
"leads":["70_A2025_NEC_AAC_SD_SCRReport.pdf","Annex D PIs near the end of 70_A2025_NEC_P02_PISubmittals.pdf (offset read)","70_A2022_NEC_P02_SD_PCSubmittals.pdf","authorized reproductions via search"]}
```

### FU blocked or failed
1. **WebSearch:** 2 attempts refused by the shared per-turn limit; 0 searches performed. Not worked around.
2. **docinfofiles.nfpa.org:** 6 of 6 used (F1–F6), no 429. F4 and F5 found no D1(a) or D1(b) in the first windows.
3. **F2:** the extractor declined to reproduce 120.14 in full. Partial values were recovered in F3 and F6.

### FU open gaps
1. Annex D Examples D1(a) and D1(b), 2023: inputs, intermediate figures and final figures not obtained. See the leads list.
2. 220.14: full text, conditions and exceptions not obtained.
3. 220.51: everything after the first sentence is a single pull.

### FU contradictions with the brief
1. **220.50 (2023) does not cite 440.6.** It is titled "Motors and Air-Conditioning Equipment" and cites 430.24, 430.25, 430.26, and Part IV of Article 440 for hermetic refrigerant motor-compressors.
2. **220.14 runs (A) through (K) in 2023** per PI 4311, not (A) through (L).
3. **220.52(A) and (B) both allow** adding the small-appliance and laundry loads to the general lighting load before the Table 220.45 demand factors are applied. The load engine should do this.
