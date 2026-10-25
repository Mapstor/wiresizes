# A2: OCPD rules (240.4(B), 240.4(D), 240.6(A)) and re-verification of the Article 310 tables

Run date and retrieval date for every source below: **2026-10-20**.
Budget used: WebSearch **16 of 16**. docinfofiles.nfpa.org fetches **6 of 6**, with no HTTP 429. Other hosts: about 30 WebFetch calls.
Method: WebFetch only. WebFetch answers through a summarizing model, so every "quote" below is that model's readout of the fetched text. The model refused requests for long verbatim passages ("copyrighted NFPA text"), so most quotes are short segments; where a table was read as a token sequence instead of verbatim lines, this report says so. Arithmetic was run with `python3 -I` (script: `/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/scripts/hb100_19awg.py`).

---

## Status matrix

| # | Item | Status | Primary evidence | Second pull / cross-check |
|---|---|---|---|---|
| 1 | 240.4(D) lead-in (2023) | **VERIFIED-2023** | Leviton Captain Code 2023 node 313 and the Eaton 2023 code-change brochure. Both carry NFPA 2023 permission notices | Two independent 2023 reproductions agree word for word |
| 1.1 | (D)(1) 18 AWG Cu, 7 A, continuous ≤ 5.6 A, Class CC/CF/J/T or listed and marked breakers/fuses | **VERIFIED-2023** | Eaton 2023 brochure | NFPA SR-8377 (2026 draft) identical values. EC&M (Ode, 2023) corroborates. "wire" vs "conductor" in a./b. is ambiguous (see §1) |
| 1.2 | (D)(2) 16 AWG Cu, 10 A, continuous ≤ 8 A, same OCPD options | **VERIFIED-2023** (values and conditions). Item number "(2)": VERIFIED-draft | Eaton 2023 brochure, which mislabels the item "240.4(D)(1) 16 AWG Copper." | SR-8377 prints "(2) 16 AWG copper". EC&M (Ode, 2023) corroborates |
| 1.3 | (D)(3) 14 AWG CCA, 10 A (already known) | **VERIFIED-2023** | Leviton node 313 | SR-8377 consistent. No conflict |
| 1.4 | (D)(4) 14 AWG Cu, 15 A | **VERIFIED-draft** (2023: UNVERIFIED) | NFPA CMP-10 SD SR-8377 | 2 pulls match. Encore Wire (older-edition wording) corroborates 15 A |
| 1.5 | (D)(5) 12 AWG Al and CCA, 15 A | **VERIFIED-draft** (2023: UNVERIFIED) | SR-8377 | 2 pulls match. Daily Reporter (2024) cites "240.4(D)(5)" for 12 AWG Al/CCA at 15 A. Encore corroborates |
| 1.6 | (D)(6) 12 AWG Cu, 20 A | **VERIFIED-draft** (2023: UNVERIFIED) | SR-8377 | 2 pulls match. Encore corroborates |
| 1.7 | (D)(7) 10 AWG Al and CCA, 25 A | **VERIFIED-draft** (2023: UNVERIFIED) | SR-8377 | 2 pulls match. Encore corroborates |
| 1.8 | (D)(8) 10 AWG Cu, 30 A | **VERIFIED-draft** (2023: UNVERIFIED) | SR-8377 | 2 pulls match. Encore corroborates |
| 2 | 240.4(B) next-higher-rating permission and its 3 conditions | **VERIFIED-draft** (2023: UNVERIFIED) | SR-8377 (2026 draft). It also shows the old heading "Overcurrent Devices Rated 800 Amperes or Less" in its committee statement | 2 pulls agree on all 3 conditions. One stray phrase from pull 1 could not be placed (see §2) |
| 3.1 | Table 240.6(A), 2023: 38 values from 10 to 6000 A | **VERIFIED-2023** | Eaton 2023 brochure (NFPA permission notice) | 2 complete pulls match (38 values plus 2 blank cells) |
| 3.2 | 240.6(A) "additional standard ampere ratings for fuses", 2023 | **CONFLICTING** | Eaton code-text line as extracted: "1, 3, 6, 10, and 601". The same brochure's explanation: "1, 3, 6 and 601" | The brochure's text layer merges struck and new words elsewhere ("wire conductor"), so the "10" may be struck text. Unresolved |
| 3.3 | Change 2020 → 2023: 10 A added for inverse-time breakers | **VERIFIED-2023** (from the explanation text) | Eaton: "A new standard rating of 10 amps was added to table 240.6(A) for inverse time circuit breakers." | Daily Reporter (2024) and ExpertCE corroborate |
| 3.4 | Full 2020 Table 240.6(A) list | **UNVERIFIED** | Not seen | ExpertCE shows it only as an image |
| 3.5 | Change 2023 → 2026 | **UNVERIFIED** (no change seen) | SR-8377 does not touch 240.6(A). A 2026 course outline lists only 240.6(C) | — |
| 4a | Table 310.16 (2023), 30 rows × 6 columns (180 cells) | **VERIFIED-2023**, 180/180 cells | NFPA TIA Log 1691 circulation (reprints the 2023 table) | Data pull and token-sequence pull match 180/180. Schneider (2017 basis, corroboration only) matches 176/180; its 4 differing cells look like errors on that page |
| 4b | Table 310.15(B)(1)(1), 16 rows × 3 factors plus °F | **VERIFIED-draft** (2026 FD, base text 2023); 2023 document not seen | NFPA CMP-6 FD ballot, under FR-7961 | Single NFPA pull (cap reached). Elliott Electric (2020 NEC, corroboration) 48/48. Schneider (2017, corroboration) 48/48 factors and 16/16 °F ranges |
| 4c | Table 310.15(C)(1), 6 rows | **VERIFIED-draft** (2026 FD); 2023 document not seen | FD ballot, FR-8033 | Single NFPA pull. Schneider (2017 Table 310.15(B)(3)(a)) 6/6 |
| 4d | Table 310.12, 11 rows | **VERIFIED-draft** (2026 FD, "Table 310.12(A)") and **VERIFIED-other-edition** (2011 NEC Table 310.15(B)(7), reproduced by the NC Office of State Fire Marshal) | FD ballot, FR-7943; NC OSFM 2017 and 2018 interpretations | Mike Holt 2020 Exam Prep (Table 310.12, corroboration) 11/11. All sources 11/11 |
| 4e | 310.12(A)–(D) full 2023 text | (A)/(B) key phrases: **VERIFIED-draft**. (C)/(D): **UNVERIFIED**. Full 2023 wording: **UNVERIFIED** | FD ballot FR-7943, FR-7953, FR-8031 | EC&M (Ode, 2024) paraphrases (A)/(B) |
| 5a | 2026 Table 310.16 kept the 16 AWG Cu and 14 AWG CCA rows? | **UNVERIFIED.** Corroboration says yes; values not seen; CAM 70-105 outcome not seen | — | IAEI, Winter 2026 (Mello and Graser; no NFPA notice): ampacities added "in the 60 °C, 75 °C, and 90 °C temperature columns" |
| 5b | 2026 Table 310.12 labeled 310.12(A), values unchanged? | **UNVERIFIED** for the final edition. The 2026 FD draft is labeled "Table 310.12(A)" with unchanged values | FD ballot FR-7943 | No final-edition source found |
| 6 | NIST HB100 Table 5, 19 AWG circular mils | **UNVERIFIED.** The text layer prints "1200". The page image could not be viewed | NIST HB100 PDF text layer | The same row's other columns fit about 1289 cmil, not 1200 |

---

## 1. 240.4(D) small conductors (2023)

### 1.0 Sources
- **E23**: Eaton, Bussmann series brochure "2023 NEC® Code Changes", publication bus-ele-br-11318 (the number is from the file name; no date is printed apart from the © 2022 NFPA line). NFPA 70-2023.
  - URL: https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf
  - Permission notice (extracted in segments): "Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition." / "Copyright© 2022, National Fire Protection Association." / "For a full copy of the NFPA 70®, please go to www.nfpa.org." / "NFPA 70®, National Electrical Code®, and NEC® are registered trademarks of the National Fire Protection Association," … "Quincy, MA."
  - **Caveat:** the brochure marks changes, and its text layer merges deleted and inserted words, for example "18 AWG copper wire conductor". Any word sitting next to a near-synonym may be a flattened strike-through.
- **LEV**: Leviton, "Captain Code 2023" web portal, node 313 "10 Amp Branch Circuits". NFPA 70-2023. https://captaincode2023.leviton.com/node/313
  - Notice (extractor rendered ® as "."): "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved."
- **SR8377**: NFPA, CMP-10 Second Draft working draft, A2025 cycle (toward NFPA 70-2026). "Second Revision No. 8377-NFPA 70-2024 [ Global Comment ]", submittal date "Thu Oct 24 13:36:28 EDT 2024". File-name residue "70_CMP-10_SR8377_440.4.docx".
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_SD_PrelimSR.pdf
  - NFPA's own document; no reprint notice needed.
  - **Draft text; strike-through and underline are flattened.** Residue seen: "OCPDovercurrent", "protectionprotected", "withspecified", "Copper-Clad" next to "CopperClad".

### 1.1 Lead-in (2023): VERIFIED-2023
- LEV (segments): "Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed that required by" / "240.4(D)(1) through (D)(8) after any correction factors for ambient temperature" / "and number of conductors have been applied."
- E23 (segments): "Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed that required by" / "240.4(D)(1) through (D)(8) after any correction factors for ambient temperature and number of conductors have been applied."
- The two sources match. The 2026 draft lead-in (SR8377) reads "…required by 240.4(D)(1) through 240.4(D)(8)" with residue "the following", so it is reworded.

### 1.2 Items

| Item | Conductor | 2023 evidence (E23 / LEV) | SR8377 raw line (2026 draft) | Status |
|---|---|---|---|---|
| (D)(1) | 18 AWG Cu | Heading "240.4(D)(1) 18 AWG Copper."; 7 A, "7 amperes, provided all the following conditions are met"; "Continuous loads do not exceed 5.6 amperes."; "Overcurrent protection is provided by one of the following"; a. "Branch-circuit-rated circuit breakers listed and marked for use with 18 AWG copper wire conductor"; b. "Branch-circuit-rated fuses listed and marked for use with 18 AWG copper wire conductor"; c. "Class CC, Class CF, Class J, or Class T fuses." | "(1) 18 AWG copper: Copper. 7 amperes, provided all the following conditions are met:" Conditions: "Continuous loads do not exceed 5.6 amperes."; "…listed and marked for use with 18 AWG copper conductor"; "Class CC, Class CF, Class J, or Class T fuses" | **VERIFIED-2023** (value and conditions). Whether a./b. say "wire" or "conductor" in 2023: UNVERIFIED (E23 reads "wire conductor") |
| (D)(2) | 16 AWG Cu | Heading as printed: "240.4(D)(1) 16 AWG Copper." (the brochure mislabels the item number); "10 amperes, provided all the following conditions are met"; "Continuous loads do not exceed 8 amperes."; a./b. "…listed and marked for use with 16 AWG copper wire conductor"; c. "Class CC, Class CF, Class J, or Class T fuses." | "(2) 16 AWG copper: Copper.10 amperes, provided all the following conditions are met:"; "Continuous loads do not exceed 8 amperes."; Class CC/CF/J/T | **VERIFIED-2023** (value and conditions). Item number (2): VERIFIED-draft only |
| (D)(3) | 14 AWG CCA | LEV: "14 AWG Copper-Clad Aluminum." "10 amperes, provided all the following conditions are met:" (1) "Continuous loads do not exceed 8 amperes" (2) "Overcurrent protection is provided by one of the following:" a. "Branch-circuit-rated circuit breakers are listed and marked for use with 14 AWG copper-clad aluminum conductor." b. "Branch-circuit-rated fuses are listed and marked for use with 14 AWG copper-clad aluminum conductor." | "(3) 14 AWG copper-clad aluminum: Copper-Clad Aluminum.10 amperes, provided all the following conditions are" [met:]; the 2026 draft adds "OCPDs in accordance withspecified in 240.7 shall be marked for use with 14 AWG copper-clad aluminum conductor" | **VERIFIED-2023** (already known; consistent) |
| (D)(4) | 14 AWG Cu | not in E23 or LEV | "(4) 14 AWG copper: Copper.15 amperes" (no conditions printed) | **VERIFIED-draft**; 2023 UNVERIFIED |
| (D)(5) | 12 AWG Al and CCA | not in E23 or LEV | "(5) 12 AWG aluminum and copper-clad aluminum: Aluminum and Copper-Clad" / "Aluminum.15 amperes" | **VERIFIED-draft**; 2023 UNVERIFIED |
| (D)(6) | 12 AWG Cu | — | "(6) 12 AWG copper: Copper.20 amperes" | **VERIFIED-draft**; 2023 UNVERIFIED |
| (D)(7) | 10 AWG Al and CCA | — | "(7) 10 AWG aluminum and copper-clad aluminum: Aluminum and CopperClad Aluminum.25 amperes" | **VERIFIED-draft**; 2023 UNVERIFIED |
| (D)(8) | 10 AWG Cu | — | "(8) 10 AWG copper: Copper.30 amperes" | **VERIFIED-draft**; 2023 UNVERIFIED |

- **Two pulls of SR8377:** pull 1 (data) and pull 2 (raw printed lines) give the same item numbers, sizes and ampere values for all eight items. **Match.**
- **SR-8377 committee statement (excerpts):** "The revision improves usability and accuracy of requirements associated with the terminology"; "Revise 240.4(D)(1)(2)a. "Branch-circuit-rated circuit breakers listed and" to "OCPDs in accordance with 240.7 shall be""; "Additional revisions are made to 240.4(D) to comply with the NEC Style Manual."
- **E23 explanation (summarized by the extractor, then quoted):** "240.4(D)(1)(2)(c) and 240.4(D)(2)(2)(c) now offer the option to include Class CF fuses." The extractor's summary also said Class CF gives Class J-equivalent let-through and aligns with UL 508A. **This means Class CF was new in 2023.**
- **Why the SR8377 headings read "18 AWG copper: Copper.":** the 2026 draft apparently replaced each 2023 heading ("18 AWG Copper.") with a "18 AWG copper:" lead, and both survived flattening. The 2023 item headings therefore appear to have the form "(4) 14 AWG Copper.", but that is inferred, not seen in a 2023 document.

**Corroboration (class 4, never sole source):**
- EC&M Electrical Contractor, Mark C. Ode, "New Sizes for Branch Circuit: Tracing the history of these changes and what's in the 2023 Code", Jan 16, 2023. https://www.ecmag.com/magazine/articles/article-detail/new-sizes-for-branch-circuit-tracing-the-history-of-these-changes-and-what-s-in-the-2023-code
  - Quotes: "The 18 AWG copper conductors are limited to 7A of overcurrent protection."; "continuous loads not exceeding 5.6A"; "16 AWG copper conductors are limited to 10A of overcurrent protection."; "continuous loads not exceeding 8A"; these sizes "remain in the 2023 edition".
  - Also: "Table 210.24(2) restricts 10A branch circuits to 12 AWG aluminum and copper-clad aluminum."
  - Notice: "© 2003-2025. All rights reserved. Electrical Contractor Magazine" (no NFPA notice).
- Daily Reporter "Code Corner", Mark Cook (Faith Technologies), "10 amp branch circuits", May 6, 2024. https://dailyreporter.com/2024/05/06/10-amp-branch-circuits/
  - Says (extractor summary) that 240.4(D)(5) allows 12 AWG CCA and aluminum at 15 amperes. Also quotes "Table 240.6(A) now includes the 10-amp rating as a standard overcurrent protective device."
  - No NFPA notice.
- Encore Wire, "Wire Ampacity Size Table" page (edition not stated; this is the older single-sentence 240.4(D) wording). https://www.encorewire.com/products/tools-and-resources/calculators/wire-size-table.html
  - Quotes: "Unless specifically permitted in 240.4(E) through (G), the overcurrent protection shall not exceed 15 amperes for 14 AWG," / "20 amperes for 12 AWG, and 30 amperes for 10 AWG copper;" / "or 15 amperes for 12 AWG and 25 amperes for 10 AWG aluminum and copper-clad aluminum" / "after any correction factors for ambient temperature and number of conductors have been applied."
  - No NFPA notice.

---

## 2. 240.4(B), overcurrent devices rated 800 A or less

- **Source:** SR8377 (as in §1.0). Status **VERIFIED-draft** (2026 Second Draft). **The 2023 text was not seen in any 2023 document: UNVERIFIED for 2023.**
- **Pull 2, consecutive segments as extracted:**
  - Heading: "240.4(B) Overcurrent Protective Devices Rated 800 Amperes or Less."
  - Lead-in: "The next higher standard OCPDovercurrent device rating" + "(above the ampacity of the conductors being protected)" + "shall be permitted to be used, provided all of the following conditions are met:". The run-together "OCPDovercurrent" is flattened markup: old "overcurrent device", new "OCPD".
  - (1) "(1) The conductors being protected are not part of a branch circuit" + "supplying more than one receptacle for cord-and-plug-connected portable loads."
  - (2) "(2) The ampacity of the conductors does not correspond with the standard ampere rating" + "of a fuse or a circuit breaker without overload trip adjustments above its rating" + "(but that shall be permitted to have other trip or rating adjustments)."
  - (3) "(3) The next higher standard rating selected does not exceed 800 amperes."
- **2023 heading:** the extractor reported that the SR-8377 committee statement pairs the old title "Overcurrent Devices Rated 800 Amperes or Less" with the new "Overcurrent Protective Devices Rated…". The 2023 heading is therefore probably "Overcurrent Devices Rated 800 Amperes or Less". That is seen only as the "old" text inside a 2026 draft.
- **Pull 1 vs pull 2:** both give the same three conditions. Pull 1 also said the 240.4(B) text references "as shown in Table 240.6(A) where restricted access in accordance with 240.6(C) is provided". That phrase does **not** appear in pull 2's full 240.4(B) passage, so where it sits in SR-8377 is **unresolved**. Do not put it in 240.4(B).
- **2026 heading corroboration (class 4):** "2026 NEC Chapter 2 Code Changes Outline", course objectives file hosted on secure.utah.gov (no author, no date, no NFPA notice), https://secure.utah.gov/ce-public/files/objectives/13441.pdf. Quote: "(B) Overcurrent Protective Devices Rated 800 Amperes or Less."

---

## 3. 240.6(A) standard ampere ratings

### 3.1 2023 text: source E23 (NFPA 2023 permission notice; see §1.0)
- Headings: "240.6 Standard Ampere Ratings"; "240.6(A) Fuses and Fixed-Trip Circuit Breakers"; label "Revised text".
- Sentences (each quoted exactly as extracted):
  - "The standard ampere ratings for fuses and inverse time circuit breakers shall be considered as shown in Table 240.6(A)."
  - "Additional standard ampere ratings for fuses shall be 1, 3, 6, 10, and 601." (The extractor confirmed that "10" is present in the text layer.)
  - "The use of fuses and inverse time circuit breakers with nonstandard ampere ratings shall be permitted."
- Table title as extracted: "Table 240.6(A) standard ampere ratings for fuses and inverse time circuit breakers".
- **Pull 1 (raw lines):** "10 15 20 25 30 35 40 45 50 60 70 80 90 100 110 125 150 175 200 225" / "250 300 350 400 450 500 600 700 800 1000 1200 1600 2000 2500 3000 4000 5000 6000"
- **Pull 2 (data list):** 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000, —, —. That is 40 cells: 38 values and 2 blank cells at the end of the last row.
- **The two pulls match** (38 values). A separate pull also confirmed first = "10" and last = "6000".
- **Status: VERIFIED-2023** for the 38-value table.
  - Caveat: E23 has flattened markup. Its explanation mentions only one table change (10 A added), so no struck values are expected in the list. The only cell marked as new is 10.
- **Explanation ("Significance of Change") quotes:**
  - "Prior to the 2023 NEC the smallest standard rating for a circuit breaker was 15 amps."
  - "A new standard rating of 10 amps was added to table 240.6(A) for inverse time circuit breakers."
  - "Fuses have additional standard ampere ratings of 1, 3, 6 and 601."

### 3.2 Fuse-only ("additional") ratings, 2023: CONFLICTING
- The code-text line in E23 reads "1, 3, 6, 10, and 601". E23's own explanation reads "1, 3, 6 and 601".
- E23's text layer demonstrably merges struck and inserted words ("copper wire conductor"). It is therefore possible that "10" is struck in the printed brochure, now that 10 sits in the table. It is also possible that the 2023 sentence still lists 10, redundantly.
- No second 2023 source was found. ExpertCE (class 4, no NFPA notice, https://expertce.com/courses/electricians-guide-for-nec-2023/lessons/how-does-the-2023-nec-change-standard-circuit-breaker-amp-ratings/) writes "listed standard fuse sizes of 1, 3, 6, 10, and 601 amperes" without saying which edition.
- **Do not publish the fuse-only list until this is resolved.**

### 3.3 Edition changes
- **2020 → 2023:** 10 A added to Table 240.6(A) (for inverse-time breakers; it also applies to fuses).
  - Evidence: E23 quotes above. Daily Reporter 2024: "Table 240.6(A) now includes the 10-amp rating as a standard overcurrent protective device."
  - ExpertCE (2020 table shown only as an image): minimum standard breaker "limited to 15-amperes".
  - Status: the change is **VERIFIED-2023** from E23's explanation. **The full 2020 list is UNVERIFIED** (not seen).
- **2023 → 2026: no change seen. UNVERIFIED for the final edition.**
  - SR8377 does not revise 240.6(A); this run's extractor said "SR-8377 does not revise 240.6(A) or Table 240.6(A)".
  - The prior run found no 240.6 Second Revision, and the CMP-10 First Draft minutes cover 240.6(B)–(D) only.
  - The 2026 Chapter 2 outline (Utah file above) lists only "(C) Local Restricted Access Adjustable-Trip Circuit Breakers" under 240.6.

---

## 4. Re-verification of the Article 310 tables

### 4a. Table 310.16 (2023): VERIFIED-2023, 180/180 cells
- **Source:** NFPA, "NEC® Proposed Tentative Interim Amendment (TIA) No. 1691", memo dated February 14, 2023, to CMP-6 and the NEC Correlating Committee, from Sarah Caldwell (Committee Administrator).
  - NFPA 70®-2023 Edition. Submitter David Hittinger (Independent Electrical Contractors). Comment closing date February 10, 2023. Ballot deadline February 20, 2023.
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_PubCommCirc.pdf
  - NFPA's own document.
- **Table title:** "Table 310.16 Ampacities of Insulated Conductors with Not More Than Three Current-Carrying Conductors in Raceway," "Cable, or Earth (Directly Buried)".
- **Pull 1 (data):** all 30 rows equal the pack values.
- **Pull 2 (token sequence per row, left to right).** A verbatim-line request was refused by the extractor, so the token form was used instead. Every row has 8 tokens.
  ```
  18: 18*, —, —, 14, —, —, —, —
  16: 16*, —, —, 18, —, —, —, —
  14: 14*, 15, 20, 25, 10†, —, —, 14*
  12: 12*, 20, 25, 30, 15, 20, 25, 12*
  10: 10*, 30, 35, 40, 25, 30, 35, 10*
  8: 8, 40, 50, 55, 35, 40, 45, 8
  6: 6, 55, 65, 75, 40, 50, 55, 6
  4: 4, 70, 85, 95, 55, 65, 75, 4
  3: 3, 85, 100, 115, 65, 75, 85, 3
  2: 2, 95, 115, 130, 75, 90, 100, 2
  1: 1, 110, 130, 145, 85, 100, 115, 1
  1/0: 1/0, 125, 150, 170, 100, 120, 135, 1/0
  2/0: 2/0, 145, 175, 195, 115, 135, 150, 2/0
  3/0: 3/0, 165, 200, 225, 130, 155, 175, 3/0
  4/0: 4/0, 195, 230, 260, 150, 180, 205, 4/0
  250: 250, 215, 255, 290, 170, 205, 230, 250
  300: 300, 240, 285, 320, 195, 230, 260, 300
  350: 350, 260, 310, 350, 210, 250, 280, 350
  400: 400, 280, 335, 380, 225, 270, 305, 400
  500: 500, 320, 380, 430, 260, 310, 350, 500
  600: 600, 350, 420, 475, 285, 340, 385, 600
  700: 700, 385, 460, 520, 315, 375, 425, 700
  750: 750, 400, 475, 535, 320, 385, 435, 750
  800: 800, 410, 490, 555, 330, 395, 445, 800
  900: 900, 435, 520, 585, 355, 425, 480, 900
  1000: 1000, 455, 545, 615, 375, 445, 500, 1000
  1250: 1250, 495, 590, 665, 405, 485, 545, 1250
  1500: 1500, 525, 625, 705, 435, 520, 585, 1500
  1750: 1750, 545, 650, 735, 455, 545, 615, 1750
  2000: 2000, 555, 665, 750, 470, 560, 630, 2000
  ```
- **The two pulls match on all 180 cells.**
- **18 and 16 AWG rows:** these rows end with "—" where other rows repeat the size label, so placing 14 and 18 in the Cu 90 °C column is inferred from token order. That placement is corroborated by Schneider (below), which also shows 18 → 90 °C 14 and 16 → 90 °C 18.
- **14 AWG "10†"** is the TIA's proposed copper-clad-aluminum value. TIA 1691 failed (prior run: Log1691 BallotFinal, technical merit 9-5-1 with 11 needed). The 2023 printed 14 AWG Al/CCA cells are therefore "—", which matches the pack.
  - TIA statement quote: "14 AWG copper-clad aluminum is added to recognize the permitted use of this conductor for control conductors."
  - IAEI Winter 2026 independently says a 2023-cycle TIA to give 14 AWG CCA an ampacity "failed to gain the necessary support from CMP-6."
- **Footnotes (as extracted):**
  - Note 1: "Section 310.15(B) shall be referenced for ampacity correction factors where the ambient temperature is other than 30°C (86°F)."
  - Note 2: "Section 310.15(C)(1) shall be referenced for more than three current-carrying conductors."
  - Note 3: "Section 310.16 shall be referenced for conditions of use."
  - Asterisk: "Section 240.4(D) shall be referenced for conductor overcurrent protection limitations, except as modified elsewhere in the Code."
  - Dagger: "Applicable only to copper-clad aluminum conductors." This line, and the Informational Note on 18/16 AWG Cu and 14 AWG CCA control conductors, may be TIA-proposed text rather than 2023 printed text. Treat them as UNVERIFIED for 2023.
- **Independent cross-check (class 4: manufacturer page, no NFPA notice).** Schneider Electric, "Conductor Ampacity Based on the 2017 National Electrical Code®" (Table 310.15(B)(16)), "© 2018 – Schneider Electric".
  - URL: https://productinfo.se.com/na-std-ref/viewer/5c0fee4b347bdf0001de4d55/5c0fee5b347bdf0001de4d6b/r/ConductorAmpacityBasedOnThe2017Nati-F20AB318 (redirected from productinfo.schneider-electric.com).
  - 176 of 180 cells match. A targeted re-read confirmed that the page text itself shows the 4 mismatches:
    - "2/0, 145, 175, 145, 115, 135, 150, 2/0" (Cu 90 °C = 145; NFPA 195)
    - "3/0, 165, 200, 165, …" (Cu 90 °C = 165; NFPA 225)
    - "4/0, 195, 230, 195, …" (Cu 90 °C = 195; NFPA 260)
    - "2000, 555, 655, 750, …" (Cu 75 °C = 655; NFPA 665)
  - The first three copy the 60 °C value into the 90 °C column, and the last looks like a typo. These are judged to be **errors on the Schneider page**. The NFPA primary, read twice today, and the 2026 drafts FR-8257 and SR-8602 (prior run) all give the pack values. **Do not use Schneider as a source.**

### 4b. Table 310.15(B)(1)(1): VERIFIED-draft (values agree across 2017, 2020 and the 2026 FD)
- **Source:** NFPA CMP-6 First Draft final ballot, A2025 cycle (FR tags "NFPA 70-2024"). The table appears under **FR-7961** (section 310.15(B)(2)). The FR changes only XHHW-2 rooftop wording (prior run).
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_BallotFinal.pdf
  - NFPA's own document.
  - The fetched text ends at "[Content truncated due to length...]" after the header of FR-8229 (324.100(A)).
- **NFPA pull (data):** all 16 rows equal the pack:
  - ≤10 → 1.29/1.20/1.15 (°F 50 or less); 11–15 → 1.22/1.15/1.12 (51–59); 16–20 → 1.15/1.11/1.08 (60–68); 21–25 → 1.08/1.05/1.04 (69–77); 26–30 → 1.00/1.00/1.00 (78–86)
  - 31–35 → 0.91/0.94/0.96 (87–95); 36–40 → 0.82/0.88/0.91 (96–104); 41–45 → 0.71/0.82/0.87 (105–113); 46–50 → 0.58/0.75/0.82 (114–122); 51–55 → 0.41/0.67/0.76 (123–131)
  - 56–60 → —/0.58/0.71 (132–140); 61–65 → —/0.47/0.65 (141–149); 66–70 → —/0.33/0.58 (150–158); 71–75 → —/—/0.50 (159–167); 76–80 → —/—/0.41 (168–176); 81–85 → —/—/0.29 (177–185)
- **Second NFPA pull: NOT DONE** (NFPA fetch cap reached). Two independent sources were used instead:
  - Elliott Electric Supply, "Ambient Temperature Correction Factors Based on 30°C (86°F)", which cites "Table 310.15(B)(1), 2020 NEC®". Notice "©2026 Elliott Electric Supply. All Rights Reserved." (no NFPA notice). https://www.elliottelectric.com/StaticPages/ElectricalReferences/ElectricalTables/ambient-temperature-correction-factors.aspx. **48/48 factors match** (the page has no °F column).
  - Schneider Electric, "Correction and Adjustment Factors—See NEC Tables 310.15(B)(2)(a) and 310.15(B)(3)(a)" (2017 numbering), "© 2018 – Schneider Electric". https://productinfo.se.com/na-std-ref/viewer/5c0fee4b347bdf0001de4d55/5c0fee5b347bdf0001de4d6b/r/CorrectionAndAdjustmentFactors-F20BC8E5. **48/48 factors and 16/16 °F ranges match.**
- **2023 document not seen.** The 2023 label "310.15(B)(1)(1)" rests on the 2026 FD's base text.

### 4c. Table 310.15(C)(1): VERIFIED-draft
- **Source:** the same FD ballot, **FR-8033** (FR-8034 changes only the column heading and does not reprint the rows).
- **NFPA pull:** 4–6 → 80; 7–9 → 70; 10–20 → 50; 21–30 → 45; 31–40 → 40; 41 and above → 35. **Equals the pack.**
- **Cross-check:** Schneider "Correction and Adjustment Factors" (2017 Table 310.15(B)(3)(a)), "4—6 80, 7—9 70, 10—20 50, 21—30 45, 31—40 40, 41 and above 35". **6/6 match.**
- **Second NFPA pull: NOT DONE** (cap). **2023 document not seen.**

### 4d. Table 310.12: values VERIFIED-draft and VERIFIED-other-edition
- **NFPA FD ballot, FR-7943.** Title as extracted: "Table 310.12(A) Single-Phase Dwelling Services and Feeders." The table is not reprinted under FR-7953 or FR-8031.
  - Rows: 100 → 4 / 2; 110 → 3 / 1; 125 → 2 / 1/0; 150 → 1 / 2/0; 175 → 1/0 / 3/0; 200 → 2/0 / 4/0; 225 → 3/0 / 250; 250 → 4/0 / 300; 300 → 250 / 350; 350 → 350 / 500; 400 → 400 / 600.
  - **Equals the pack (11/11).**
- **Government reproduction (class 3, official interpretation; no NFPA notice): NC Department of Insurance, Office of State Fire Marshal, Engineering Division.**
  - (i) "Service and Feeder Conductor Sizing in One- and Two-Family Dwellings", June 12, 2018. 2017 NC Electrical Code; Table 310.15(B)(7) carried from the 2011 NEC by NC amendment. https://www.ncosfm.gov/media/1953/open
  - (ii) "Main Power Feeder and Feeder Sizing in One- and Two-Family Dwellings", August 7, 2017. 2014 code with the 2011 table. https://ncosfm.gov/electrical/31016b7-main-power-feeder-and-feeder-sizing-one-and-two-family-dwellings/open
  - Both reproduce Table 310.15(B)(7) with exactly the same 11 rows as above. **11/11 match.**
  - Quotes: "in place of "83 percent" throughout this section" (2018 doc); "the entire load of the individual dwelling unit" (2018 doc); "no feeder to the dwelling is required to have an allowable ampacity rating greater than their service-entrance conductors." (2017 doc).
- **Corroboration (class 4, no NFPA notice): Mike Holt Enterprises, "Electrical Exam Preparation, based on the 2020 NEC", Unit 9, §9.11.** https://www.mikeholt.com/files/PDF/20EP_Table_310.12.pdf
  - Title "Table 310.12 Single-Phase Dwelling Services and Feeders". Rows "100A 4 AWG 2 AWG" … "400A 400 kcmil 600 kcmil". **11/11 match.**
- **Second NFPA pull: NOT DONE** (cap). **2023 document not seen.**
- **2023 table label is unresolved:**
  - 2020 (Mike Holt): "Table 310.12".
  - 2026 FD: "Table 310.12(A)". This could be an FR insertion that flattened into the title.
  - The EC&M 2024 article (below) calls it "Table 310.12(A)" while working a 2023 example.

### 4e. 310.12 text
- **FD ballot quotes (2026 First Draft; base text 2023 with FR edits, flattened):**
  - Parent 310.12 (FR-8031): "service and feeder conductors supplied by a single-phase, 120/240-volt system"; "Where correction or adjustment factors are required by 310.15(B) or 310.15(C)". The FR-8031 statement says this sentence was moved up from subdivision (D).
  - 310.12(A) Services (FR-7943): "For a service rated 100 amperes through 400 amperes"; "shall be permitted to have an ampacity not less than 83 percent of the service rating"; "individual dwelling unit in a two-family or multifamily dwelling". The prior run also read: "If no adjustment or correction factors are required, Table 310.12(A) shall be permitted to be applied for conductors or cables rated 75°C (167°F) or greater." (75 °C clause added in the 2026 FD.)
  - 310.12(B) Feeders (FR-7953): "For a feeder rated 100 amperes through 400 amperes"; "shall be permitted to have an ampacity not less than 83 percent of the feeder rating".
  - 310.12(C) and (D): **not in the received text.**
- **Corroboration (paraphrase quality, class 4):** EC&M Electrical Contractor, Mark C. Ode, "Heat Is the Enemy: Using 310.12 to size service and feed conductors, except where it's hot", May 14, 2024. https://www.ecmag.com/magazine/articles/article-detail/heat-is-the-enemy-using-310.12-to-size-service-and-feed-conductors-except-where-it-s-hot
  - Quotes: "for a service rated 100 amperes through 400 amperes"; "the service conductors supplying the entire load associated with a one-family dwelling"; "the service conductors supplying the entire load associated with an individual dwelling unit"; "in a two-family or multifamily dwelling"; "are permitted to have an ampacity that is not less than eighty-three (83) percent of the service rating."; "If no adjustment or correction factors are required, Table 310.12(A) can be applied."
  - Not code wording ("can be applied", "eighty-three (83)"). No NFPA notice.
- **Status:**
  - Scope (services and feeders rated 100–400 A; one-family dwelling or individual dwelling unit of a two- or multifamily dwelling; 83 percent of the rating): **VERIFIED-draft**.
  - Full 2023 wording of 310.12(A)–(D): **UNVERIFIED.**

---

## 5. 2026 final-text questions

### 5a. Did 2026 Table 310.16 keep the 16 AWG Cu and 14 AWG CCA rows? UNVERIFIED (corroboration says yes; values unknown)
- **IAEI Magazine, "The Evolution of the 10-ampere Branch Circuit", Chuck Mello and Peter Graser, January 1, 2026 (Winter 2026).**
  - URL: https://iaeimagazine.org/?p=26808
  - Notice: "© 1998-2021. All rights reserved. IAEI News Magazine" (no NFPA notice). The authors filed the 10-A proposals, so they are not neutral.
  - Quotes: "10-amp general branch circuit conductors are established in the 2026 NEC"; "Also updated was Table 310.16 for sizing conductors by ampacity to include ampacities for 10 ampere conductors" / "in the 60 °C, 75 °C, and 90 °C temperature columns."; "Two sizes of 10-ampere conductors were added: 16 AWG copper and 14 AWG copper-clad aluminum (CCA)."
  - **No ampere values are given.**
- **Minnesota DLI, NEC 2026 Adoption Review Committee, "Summary of Significant 2026 NEC® Changes"**, line 44, 310.5(A). Government document.
  - Quote: "The minimum sizes of the conductor ratings are now 16 AWG copper, 14 AWG copper-clad aluminum, or 12 AWG aluminum."
  - URLs: https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf and https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
  - Neither summary mentions Table 310.16, 310.12, 240.4 or 240.6.
- **Reading:**
  - "60 °C, 75 °C, and 90 °C" suggests the CC-8481/SR-8481 values (75/90 °C entries with footnote c, "for adjustment or correction only") reached the final edition. That would mean CAM 70-105 ("Reject SR 8481") did not take effect. **This is inference.**
  - The CAM 70-105 vote, Technical Meeting results and final printed rows were **not seen**.
  - **Do not publish 2026 values for 16 AWG Cu or 14 AWG CCA.**
- **Not found or not reachable:**
  - NFPA 2025 Technical Meeting results or transcript. Search showed only the 2024 transcript pattern, https://docinfofiles.nfpa.org/files/AboutTheCodes/20/2024_NFPA_Technical_Meeting_Transcript_06_20_2024.pdf. A 2025 equivalent was not located, and the NFPA fetch cap was reached.
  - McKinney TX "2026 National Electrical Code Significant Changes" (https://www.mckinneytexas.org/DocumentCenter/View/39888/2026-National-Electrical-Code-Significant-Changes): no Article 240 or 310 content.
  - IAEI NFPA Code Talk, Dean Austin (NFPA staff), July 1, 2025, "A Look at the Proposed 2026 NEC Changes", https://iaeimagazine.org/columns/nfpa-code-talk/look-at-proposed-2026-nec-changes/: describes drafts only. Quote: "Table 310.16 may also see some changes due to new wires sizes being added with correlating ampacity."

### 5b. Is 2026 Table 310.12 labeled 310.12(A) with unchanged values? UNVERIFIED for the final edition
- The 2026 First Draft labels it "Table 310.12(A)" (FR-7943) with values identical to the 2011, 2020 and pack rows.
- The prior run found only SR-8473 at the Second Draft (310.12(D) text relocated) and no value change.
- **No final-edition source was found.**

---

## 6. NIST Handbook 100, Table 5, 19 AWG

- **Source:** NBS Handbook 100, "Copper Wire Tables" (1966).
  - URL: https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf
  - Table title as extracted: "Table 5. Wire table, standard annealed copper" / "American Wire Gage. English units. Values at 20 °C."
  - The contents list puts Table 5 on p. 16; the page marker just before the heading reads "15".
  - Permission/copyright notice not captured (U.S. government work).
- **Raw text-layer rows (two separate fetches agree):**
  ```
  17 45.3 2050 .001 61 5.05 198 6.21 161 .814 1.23
  18 40.3 1620 .001 28 6.39 157 4.92 203 1.30 0.770
  19 35.9 1200 .001 01 8.05 124 3.90 256 2.06 .485
  20 32.0 1020 .000 804 10.1 98.7 3.10 323 3.27 .306
  21 28.5 812 .000 638 12.8 78.3 2.46 407 5.19 .193
  ```
  Table 1 row: "19 35.9 34 6.3 49 1.11" (diameters only).
- **Page image: not viewable.** WebFetch returns only the text layer, and shell network access is blocked, so the PDF could not be rasterized. The text layer has OCR artifacts (for example "Diam¬ eter").
- **Consistency check (python3 -I; not a correction of the value):**
  - 35.9² = 1288.81 cmil.
  - In square inches: 1288.81 cmil → 0.001012 in²; 1290 → 0.001013; 1200 → 0.000942. The row prints ".001 01", which fits about 1290.
  - Using the HB100 10.371 constant: 1288.81 cmil → 8.047 Ω/1000 ft; 1200 → 8.643. The row prints "8.05", which fits about 1290.
- **Status: UNVERIFIED.** The printed glyph was not seen.
- Table 10 (metric) would give an independent check, but the extracted text ends inside Table 5.
- NBS Circular 31, 1st ed. (1912), https://nvlpubs.nist.gov/nistpubs/Legacy/circ/nbscircular31.pdf: its extracted text has no table rows.

---

## Machine-readable

```json
{"ref":"240.4(D)","edition_note":"2023 = NFPA 70-2023 via Eaton bus-ele-br-11318 and Leviton Captain Code 2023 node 313 (NFPA permission notices); draft = NFPA 70 A2025 CMP-10 Second Draft SR-8377 (Oct 2024), flattened redline","retrieved":"2026-10-20",
 "leadin_2023":{"text":"Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed that required by 240.4(D)(1) through (D)(8) after any correction factors for ambient temperature and number of conductors have been applied.","status":"VERIFIED-2023"},
 "items":[
  {"item":"(D)(1)","conductor":"18 AWG","material":"Cu","max_a":7,"conditions":"(1) Continuous loads do not exceed 5.6 amperes. (2) Overcurrent protection is provided by one of the following: a. Branch-circuit-rated circuit breakers listed and marked for use with 18 AWG copper [wire|conductor]; b. Branch-circuit-rated fuses listed and marked for use with 18 AWG copper [wire|conductor]; c. Class CC, Class CF, Class J, or Class T fuses.","status":"VERIFIED-2023","caveat":"Eaton text layer reads 'copper wire conductor' (flattened markup); 2023 word choice UNVERIFIED. Class CF new in 2023.","sources":["Eaton bus-ele-br-11318","NFPA SR-8377 (draft, identical values)"]},
  {"item":"(D)(2)","conductor":"16 AWG","material":"Cu","max_a":10,"conditions":"(1) Continuous loads do not exceed 8 amperes. (2) Overcurrent protection is provided by one of the following: a. Branch-circuit-rated circuit breakers listed and marked for use with 16 AWG copper [wire|conductor]; b. Branch-circuit-rated fuses listed and marked for use with 16 AWG copper [wire|conductor]; c. Class CC, Class CF, Class J, or Class T fuses.","status":"VERIFIED-2023","caveat":"Eaton prints the heading as '240.4(D)(1) 16 AWG Copper.'; item number (2) seen only in SR-8377 (VERIFIED-draft)","sources":["Eaton bus-ele-br-11318","NFPA SR-8377 (draft)"]},
  {"item":"(D)(3)","conductor":"14 AWG","material":"CCA","max_a":10,"conditions":"(1) Continuous loads do not exceed 8 amperes. (2) Overcurrent protection is provided by one of the following: a. Branch-circuit-rated circuit breakers are listed and marked for use with 14 AWG copper-clad aluminum conductor. b. Branch-circuit-rated fuses are listed and marked for use with 14 AWG copper-clad aluminum conductor.","status":"VERIFIED-2023","sources":["Leviton Captain Code 2023 node 313","NFPA SR-8377 (draft, consistent)"]},
  {"item":"(D)(4)","conductor":"14 AWG","material":"Cu","max_a":15,"conditions":"none printed","status":"VERIFIED-draft","status_2023":"UNVERIFIED","sources":["NFPA SR-8377 raw: '(4) 14 AWG copper: Copper.15 amperes'"]},
  {"item":"(D)(5)","conductor":"12 AWG","material":"Al and CCA","max_a":15,"conditions":"none printed","status":"VERIFIED-draft","status_2023":"UNVERIFIED","sources":["NFPA SR-8377 raw: '(5) 12 AWG aluminum and copper-clad aluminum: Aluminum and Copper-Clad' / 'Aluminum.15 amperes'"],"corroboration":["Daily Reporter 2024 (240.4(D)(5), 15 A)","Encore Wire (older wording)"]},
  {"item":"(D)(6)","conductor":"12 AWG","material":"Cu","max_a":20,"conditions":"none printed","status":"VERIFIED-draft","status_2023":"UNVERIFIED","sources":["NFPA SR-8377 raw: '(6) 12 AWG copper: Copper.20 amperes'"]},
  {"item":"(D)(7)","conductor":"10 AWG","material":"Al and CCA","max_a":25,"conditions":"none printed","status":"VERIFIED-draft","status_2023":"UNVERIFIED","sources":["NFPA SR-8377 raw: '(7) 10 AWG aluminum and copper-clad aluminum: Aluminum and CopperClad Aluminum.25 amperes'"],"corroboration":["Encore Wire (older wording)"]},
  {"item":"(D)(8)","conductor":"10 AWG","material":"Cu","max_a":30,"conditions":"none printed","status":"VERIFIED-draft","status_2023":"UNVERIFIED","sources":["NFPA SR-8377 raw: '(8) 10 AWG copper: Copper.30 amperes'"]}
 ],
 "pulls_match":true}
```

```json
{"ref":"240.4(B)","edition":"NFPA 70 A2025 CMP-10 Second Draft, SR-8377 (2026 draft, flattened redline)","status":"VERIFIED-draft","status_2023":"UNVERIFIED","retrieved":"2026-10-20",
 "heading_2026_draft":"Overcurrent Protective Devices Rated 800 Amperes or Less.",
 "heading_2023_as_old_text_in_SR_statement":"Overcurrent Devices Rated 800 Amperes or Less",
 "leadin_as_extracted":"The next higher standard OCPDovercurrent device rating (above the ampacity of the conductors being protected) shall be permitted to be used, provided all of the following conditions are met:",
 "conditions":[
  "(1) The conductors being protected are not part of a branch circuit supplying more than one receptacle for cord-and-plug-connected portable loads.",
  "(2) The ampacity of the conductors does not correspond with the standard ampere rating of a fuse or a circuit breaker without overload trip adjustments above its rating (but that shall be permitted to have other trip or rating adjustments).",
  "(3) The next higher standard rating selected does not exceed 800 amperes."],
 "unplaced_phrase_pull1_only":"as shown in Table 240.6(A) where restricted access in accordance with 240.6(C) is provided"}
```

```json
{"ref":"240.6(A)","edition":"NFPA 70-2023 (Eaton bus-ele-br-11318, 'Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition.')","retrieved":"2026-10-20",
 "breaker_and_fuse_a":[10,15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400,450,500,600,700,800,1000,1200,1600,2000,2500,3000,4000,5000,6000],
 "breaker_and_fuse_status":"VERIFIED-2023 (2 pulls match, 38 values)",
 "fuse_additional_a":null,
 "fuse_additional_status":"CONFLICTING",
 "fuse_additional_readings":{"code_text_as_extracted":[1,3,6,10,601],"brochure_explanation":[1,3,6,601]},
 "nonstandard_sentence":"The use of fuses and inverse time circuit breakers with nonstandard ampere ratings shall be permitted.",
 "change_2020_to_2023":{"text":"10 A added to Table 240.6(A) for inverse time circuit breakers; before 2023 the smallest standard breaker rating was 15 A","status":"VERIFIED-2023 (Eaton explanation)"},
 "list_2020":"UNVERIFIED",
 "change_2023_to_2026":"none seen in CMP-10 Second Draft; UNVERIFIED for final 2026"}
```

```json
{"ref":"Table 310.16","edition":"NFPA 70-2023 as reprinted in NFPA TIA Log 1691 public-comment circulation (14 Feb 2023); TIA failed","status":"VERIFIED-2023","pulls_match":true,"retrieved":"2026-10-20",
 "columns":["cu60","cu75","cu90","al60","al75","al90"],
 "rows_confirmed":[
  {"size":"18","cu60":null,"cu75":null,"cu90":14,"al60":null,"al75":null,"al90":null,"note":"column placement inferred from token order"},
  {"size":"16","cu60":null,"cu75":null,"cu90":18,"al60":null,"al75":null,"al90":null,"note":"column placement inferred from token order"},
  {"size":"14","cu60":15,"cu75":20,"cu90":25,"al60":null,"al75":null,"al90":null,"note":"reprint shows TIA-proposed al60 '10†'; TIA failed, so 2023 printed cell is blank"},
  {"size":"12","cu60":20,"cu75":25,"cu90":30,"al60":15,"al75":20,"al90":25},
  {"size":"10","cu60":30,"cu75":35,"cu90":40,"al60":25,"al75":30,"al90":35},
  {"size":"8","cu60":40,"cu75":50,"cu90":55,"al60":35,"al75":40,"al90":45},
  {"size":"6","cu60":55,"cu75":65,"cu90":75,"al60":40,"al75":50,"al90":55},
  {"size":"4","cu60":70,"cu75":85,"cu90":95,"al60":55,"al75":65,"al90":75},
  {"size":"3","cu60":85,"cu75":100,"cu90":115,"al60":65,"al75":75,"al90":85},
  {"size":"2","cu60":95,"cu75":115,"cu90":130,"al60":75,"al75":90,"al90":100},
  {"size":"1","cu60":110,"cu75":130,"cu90":145,"al60":85,"al75":100,"al90":115},
  {"size":"1/0","cu60":125,"cu75":150,"cu90":170,"al60":100,"al75":120,"al90":135},
  {"size":"2/0","cu60":145,"cu75":175,"cu90":195,"al60":115,"al75":135,"al90":150},
  {"size":"3/0","cu60":165,"cu75":200,"cu90":225,"al60":130,"al75":155,"al90":175},
  {"size":"4/0","cu60":195,"cu75":230,"cu90":260,"al60":150,"al75":180,"al90":205},
  {"size":"250","cu60":215,"cu75":255,"cu90":290,"al60":170,"al75":205,"al90":230},
  {"size":"300","cu60":240,"cu75":285,"cu90":320,"al60":195,"al75":230,"al90":260},
  {"size":"350","cu60":260,"cu75":310,"cu90":350,"al60":210,"al75":250,"al90":280},
  {"size":"400","cu60":280,"cu75":335,"cu90":380,"al60":225,"al75":270,"al90":305},
  {"size":"500","cu60":320,"cu75":380,"cu90":430,"al60":260,"al75":310,"al90":350},
  {"size":"600","cu60":350,"cu75":420,"cu90":475,"al60":285,"al75":340,"al90":385},
  {"size":"700","cu60":385,"cu75":460,"cu90":520,"al60":315,"al75":375,"al90":425},
  {"size":"750","cu60":400,"cu75":475,"cu90":535,"al60":320,"al75":385,"al90":435},
  {"size":"800","cu60":410,"cu75":490,"cu90":555,"al60":330,"al75":395,"al90":445},
  {"size":"900","cu60":435,"cu75":520,"cu90":585,"al60":355,"al75":425,"al90":480},
  {"size":"1000","cu60":455,"cu75":545,"cu90":615,"al60":375,"al75":445,"al90":500},
  {"size":"1250","cu60":495,"cu75":590,"cu90":665,"al60":405,"al75":485,"al90":545},
  {"size":"1500","cu60":525,"cu75":625,"cu90":705,"al60":435,"al75":520,"al90":585},
  {"size":"1750","cu60":545,"cu75":650,"cu90":735,"al60":455,"al75":545,"al90":615},
  {"size":"2000","cu60":555,"cu75":665,"cu90":750,"al60":470,"al75":560,"al90":630}],
 "rows_conflicting":[
  {"size":"2/0","cell":"cu90","source":"Schneider 2017 page (class 4)","source_value":"145","pack_value":"195","nfpa_primary":"195","judgement":"error on Schneider page"},
  {"size":"3/0","cell":"cu90","source":"Schneider 2017 page (class 4)","source_value":"165","pack_value":"225","nfpa_primary":"225","judgement":"error on Schneider page"},
  {"size":"4/0","cell":"cu90","source":"Schneider 2017 page (class 4)","source_value":"195","pack_value":"260","nfpa_primary":"260","judgement":"error on Schneider page"},
  {"size":"2000","cell":"cu75","source":"Schneider 2017 page (class 4)","source_value":"655","pack_value":"665","nfpa_primary":"665","judgement":"error on Schneider page"}]}
```

```json
{"ref":"Table 310.15(B)(1)(1)","edition":"NFPA 70 A2025 CMP-6 First Draft ballot (FR-7961 context; base text 2023)","status":"VERIFIED-draft","status_2023":"UNVERIFIED (no 2023 document)","nfpa_pulls":1,"retrieved":"2026-10-20",
 "rows_confirmed":[
  {"ambient_c":"10 or less","f60":1.29,"f75":1.20,"f90":1.15,"ambient_f":"50 or less"},
  {"ambient_c":"11-15","f60":1.22,"f75":1.15,"f90":1.12,"ambient_f":"51-59"},
  {"ambient_c":"16-20","f60":1.15,"f75":1.11,"f90":1.08,"ambient_f":"60-68"},
  {"ambient_c":"21-25","f60":1.08,"f75":1.05,"f90":1.04,"ambient_f":"69-77"},
  {"ambient_c":"26-30","f60":1.00,"f75":1.00,"f90":1.00,"ambient_f":"78-86"},
  {"ambient_c":"31-35","f60":0.91,"f75":0.94,"f90":0.96,"ambient_f":"87-95"},
  {"ambient_c":"36-40","f60":0.82,"f75":0.88,"f90":0.91,"ambient_f":"96-104"},
  {"ambient_c":"41-45","f60":0.71,"f75":0.82,"f90":0.87,"ambient_f":"105-113"},
  {"ambient_c":"46-50","f60":0.58,"f75":0.75,"f90":0.82,"ambient_f":"114-122"},
  {"ambient_c":"51-55","f60":0.41,"f75":0.67,"f90":0.76,"ambient_f":"123-131"},
  {"ambient_c":"56-60","f60":null,"f75":0.58,"f90":0.71,"ambient_f":"132-140"},
  {"ambient_c":"61-65","f60":null,"f75":0.47,"f90":0.65,"ambient_f":"141-149"},
  {"ambient_c":"66-70","f60":null,"f75":0.33,"f90":0.58,"ambient_f":"150-158"},
  {"ambient_c":"71-75","f60":null,"f75":null,"f90":0.50,"ambient_f":"159-167"},
  {"ambient_c":"76-80","f60":null,"f75":null,"f90":0.41,"ambient_f":"168-176"},
  {"ambient_c":"81-85","f60":null,"f75":null,"f90":0.29,"ambient_f":"177-185"}],
 "rows_conflicting":[],
 "cross_checks":[{"source":"Elliott Electric (2020 NEC Table 310.15(B)(1)), class 4","match":"48/48 factors"},{"source":"Schneider (2017 Table 310.15(B)(2)(a)), class 4","match":"48/48 factors, 16/16 F ranges"}]}
```

```json
{"ref":"Table 310.15(C)(1)","edition":"NFPA 70 A2025 CMP-6 First Draft ballot (FR-8033; base text 2023)","status":"VERIFIED-draft","status_2023":"UNVERIFIED (no 2023 document)","nfpa_pulls":1,"retrieved":"2026-10-20",
 "rows_confirmed":[{"conductors":"4-6","percent":80},{"conductors":"7-9","percent":70},{"conductors":"10-20","percent":50},{"conductors":"21-30","percent":45},{"conductors":"31-40","percent":40},{"conductors":"41 and above","percent":35}],
 "rows_conflicting":[],
 "cross_checks":[{"source":"Schneider (2017 Table 310.15(B)(3)(a)), class 4","match":"6/6"}]}
```

```json
{"ref":"Table 310.12","edition":"NFPA 70 A2025 CMP-6 First Draft ballot FR-7943 (labelled 'Table 310.12(A)'); 2011 NEC Table 310.15(B)(7) via NC OSFM","status":"VERIFIED-draft + VERIFIED-other-edition (2011)","status_2023":"UNVERIFIED (no 2023 document); label 'Table 310.12' vs 'Table 310.12(A)' in 2023 unresolved","nfpa_pulls":1,"retrieved":"2026-10-20",
 "rows_confirmed":[
  {"rating_a":100,"cu":"4","al_cca":"2"},{"rating_a":110,"cu":"3","al_cca":"1"},{"rating_a":125,"cu":"2","al_cca":"1/0"},{"rating_a":150,"cu":"1","al_cca":"2/0"},{"rating_a":175,"cu":"1/0","al_cca":"3/0"},{"rating_a":200,"cu":"2/0","al_cca":"4/0"},{"rating_a":225,"cu":"3/0","al_cca":"250"},{"rating_a":250,"cu":"4/0","al_cca":"300"},{"rating_a":300,"cu":"250","al_cca":"350"},{"rating_a":350,"cu":"350","al_cca":"500"},{"rating_a":400,"cu":"400","al_cca":"600"}],
 "rows_conflicting":[],
 "cross_checks":[{"source":"NC OSFM 2018 and 2017 interpretations (2011 NEC Table 310.15(B)(7)), class 3 government","match":"11/11"},{"source":"Mike Holt 2020 Exam Prep Table 310.12, class 4","match":"11/11"}],
 "text":{"scope":"services/feeders rated 100 through 400 A supplying the entire load of a one-family dwelling or of an individual dwelling unit in a two-family or multifamily dwelling, 120/240 V single-phase","rule":"ampacity not less than 83 percent of the service (or feeder) rating","status_scope_and_rule":"VERIFIED-draft","310_12_C_D_2023":"UNVERIFIED"}}
```

```json
{"ref":"2026 final text","retrieved":"2026-10-20",
 "table_310_16_16awg_cu_and_14awg_cca_rows_kept":{"status":"UNVERIFIED","corroboration":"IAEI Winter 2026 (Mello/Graser): ampacities for 16 AWG Cu and 14 AWG CCA added 'in the 60 °C, 75 °C, and 90 °C temperature columns'","values":"not seen","cam_70_105_outcome":"not seen"},
 "table_310_12A_label_and_values":{"status":"UNVERIFIED","draft_evidence":"2026 First Draft FR-7943 'Table 310.12(A)', values identical to 2011/2020"},
 "240_4_D_2026":{"status":"VERIFIED-draft (SR-8377); final UNVERIFIED"},
 "240_6_A_2026":{"status":"no revision seen; final UNVERIFIED"}}
```

```json
{"ref":"NBS Handbook 100 Table 5, 19 AWG","url":"https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf","raw_text_layer":"19 35.9 1200 .001 01 8.05 124 3.90 256 2.06 .485","status":"UNVERIFIED","page_image_seen":false,"consistency":"other columns fit ~1289 cmil (35.9^2 = 1288.81; 0.001012 in^2; 8.047 ohm/1000 ft), not 1200 (0.000942 in^2; 8.643 ohm/1000 ft)","retrieved":"2026-10-20"}
```

---

## Blocked or failed log

| Host / URL | What happened |
|---|---|
| docinfofiles.nfpa.org | 6 of 6 fetches used; **no 429.** (1) Log1691 PubCommCirc data pull; (2) the same file's verbatim raw-line pull, **refused by the WebFetch summarizer** ("can't reproduce … verbatim"), so no data; (3) P06 FD BallotFinal data pull; (4) P10 SD PrelimSR SR-8377 data; (5) the same SR-8377 raw lines and 240.4(B); (6) Log1691 token-sequence pull. No further NFPA fetches, so there is **no second pull** for 310.15(B)(1)(1), 310.15(C)(1) and 310.12 |
| WebSearch | **16 of 16 used.** Cap reached |
| eaton.com bus-ele-br-11318 | Long verbatim passages refused (copyright). Only short quotes obtained |
| law.resource.org 2022 California Electrical Code | WebFetch text is capped at **102,630 characters**; offset 1,000,000 returned "Nothing left to read". Article 240/310 unreachable |
| thebuildingcodeforum.com/forum/goto/post?id=287572 | ROBOTS_DISALLOWED |
| captaincode2026.leviton.com | ROBOTS_DISALLOWED |
| productinfo.schneider-electric.com | 302 redirect to productinfo.se.com (same company); followed |
| nvlpubs.nist.gov HB100 | Text extraction ends inside Table 5. Table 10 (metric) not reachable. Page image cannot be viewed through WebFetch; shell network is blocked |
| nvlpubs.nist.gov NBS Circular 31 (1912) | Table rows absent from the extracted text |
| captaincode2023.leviton.com node/324 | No code text, only a pointer to node 313 |
| mckinneytexas.org 2026 NEC changes | No Article 240/310 content |
| NFPA 2025 Technical Meeting results/transcript | Not located; NFPA cap reached |

## Open gaps

1. **240.4(D)(4)–(D)(8) and 240.4(B) in 2023 text:** seen only in the 2026 Second Draft (SR-8377). No 2023 reproduction found. Values are consistent with older-edition corroboration (Encore) and the Daily Reporter (D)(5) reference.
2. **240.6(A) fuse-only list (2023):** "1, 3, 6, 10, and 601" (code-text extraction) vs "1, 3, 6 and 601" (Eaton explanation). Needs a second 2023 reproduction or a look at the printed brochure page to check for strike-through.
3. **240.6(A):** the full 2020 list is not seen, and the 2026 final text is not seen.
4. **240.4(D)(1)/(D)(2) a./b.:** "wire" vs "conductor" in 2023.
5. **310.15(B)(1)(1), 310.15(C)(1), 310.12:** no 2023 document seen. Only one NFPA pull each (draft); independent cross-checks all match.
6. **310.12(A)–(D) full 2023 wording and (C)/(D):** not seen. The 2023 table label ("Table 310.12" vs "Table 310.12(A)") is unresolved.
7. **2026 Table 310.16 final rows for 16 AWG Cu and 14 AWG CCA:** values, footnotes and the CAM 70-105 outcome are not seen. Corroboration only (IAEI Winter 2026).
8. **2026 Table 310.12(A):** final label and values not seen.
9. **HB100 19 AWG:** the printed value needs a human look at the page image (Table 5, PDF p. 16).
10. **SR-8377:** the phrase "as shown in Table 240.6(A) where restricted access in accordance with 240.6(C) is provided" has not been located.
11. **Possible next sources** (not tried; caps reached):
    - The NFPA 2025 Technical Meeting transcript, on the pattern of `.../AboutTheCodes/20/2024_NFPA_Technical_Meeting_Transcript_06_20_2024.pdf`.
    - The A2028-cycle (2029 NEC) Public Input submittals for CMP-6 and CMP-10, which would reproduce the final 2026 text.
    - The CMP-10 First Draft PrelimFR, which shows the 240.4 base text.
