# R3-3: NEC Chapter 9 (Tables 1, 4, 5, 8, 9 and Notes) and 314.16 box fill, round 3

- Agent: R3-3, wiresizes.com primary sourcing, round 3. It builds on round 2's A5 report: /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/A5-ch9-boxfill.md
- Retrieval date for every source below: 2026-10-20.
- Budget used:
  - WebSearch: 14 executed out of 25. The 15th call was refused because the turn-wide search budget (200 calls shared by all agents) was used up, so no further searching was possible.
  - docinfofiles.nfpa.org: 5 of 8. The fifth fetch (a guessed file name) returned a generic "error while fetching". A 404 and a 429 could not be told apart, so the host was not used again.
  - Other hosts: 36 fetch attempts. 34 succeeded; 2 failed or were blocked (see the log).
- Integrity rule 1 means only values seen in this run count as verified here. Items taken from A5 and not re-seen in this run are marked **carried (A5)** and keep A5's status only as a record.
- WebFetch's summarizer limits still apply. Long code text is recorded as short verbatim segments, and a " … " between segments marks a boundary where words may be missing.

---

## Status matrix

| # | Target | Status after R3 | Evidence |
|---|---|---|---|
| 1a | Ch. 9 Table 1: 53 / 31 / 40 % | **VERIFIED-other-edition** (NFPA 70-2008 text; re-pulled in this run, two pulls match). 2023: **UNVERIFIED** | P10 |
| 1b | Notes 1–9 (Note 3 EGCs counted, Note 4 nipples at 60 %, Note 7 rounding) | **UNVERIFIED**. No authorized text of any edition was found | none |
| 2 | Ch. 9 Table 4 (EMT, IMC, RMC, PVC-40, PVC-80, FMC, LFMC) | **UNVERIFIED** for every type and size | none. The 2023 Annex C raceway list is **VERIFIED-2023** (N7): see §2 |
| 3 | Ch. 9 Table 5 (THHN/THWN/THWN-2, XHHW/XHHW-2, TW) | **UNVERIFIED**. The 2/0 THHN dispute is still **CONFLICTING** (category 4 only), but arithmetic consistency favours **0.2223** | C8; §3 |
| 4 | Ch. 9 Table 8 | **UNVERIFIED** (2023). The 2026 First Revision text is unreachable because the CMP-6 drafts cut off before Chapter 9 | N8, N9 |
| 5 | Ch. 9 Table 9 | **UNVERIFIED** | none |
| 6a | 314.16(B)(1)–(B)(6), 2023 wording | **UNVERIFIED**. No new authorized source. The RACO catalog is **rejected** because it mixes editions | carried (A5); R1 |
| 6b | Table 314.16(A), rows 6–24, as 2023 | 2023: **UNVERIFIED**. The 2011 text was re-verified in this run (two pulls match each other and A5's P1) | P11 |
| 6c | 300.14 free-conductor length, which the (B)(1) loop rule references (new in R3) | **VERIFIED-2023** | P12 |
| 7 | 2026 changes | Table 8's First Draft revisions: final status **NOT CONFIRMED**. No authorized or government source lists a 2026 change to Tables 1, 4, 5, 8 or 9. **VERIFIED**: Errata 70-23-1 and 70-23-2 correct none of the targets | N7–N10, G2, C13–C17 |

---

## Sources

### NFPA's own documents (tier 1; no permission notice applies)

- **N7**: NFPA, "Errata No. 70-23-2", NFPA 70, National Electrical Code, 2023 Edition, issued September 15, 2022.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf
  - Corrects 555.53, 702.4(A)(2) and the page numbers in the Annex C listing of tables.
- **N8**: NFPA, "Working Draft of NEC Code-Making Panel 6 Meeting Output", First Draft, Revision Cycle A2025, meeting dates January 18–20, 2024.
  - Footers read "1/30/2024, 9:52 AM" and "… of 109".
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf
  - Readable to p. 55 of 109. The text ends mid-record in FR 8040 (330.10(B)).
- **N9**: NFPA, "WORKING DRAFT OF NEC CODE-MAKING PANEL 6 MEETING OUTPUT", Second Draft, A2025, October 2024. The latest submittal stamp is Tue Oct 29, 2024 (SR-8604).
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_PrelimSR.pdf
  - Readable to SR-8582 (382.104(A)), which is cut off at "(A) Ungrounded Conductor (C".
- **N10**: NFPA, "Errata No. 70-23-1", NFPA 70, 2023 Edition, "First Printing Only", issued September 1, 2022.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_1.pdf
  - Corrects only the 210.11(C)(3) Exception and 210.11(C)(4) Exception No. 2.

### Reproductions with an NFPA permission notice (tier 2)

- **P10** (re-fetched twice): Wheatland Tube brochure, re-hosted by a third party.
  - https://inspectapedia.com/electric/Metal_Conduit_Installation_NEC.pdf
  - The extractor read its headings as "Conduit Tubing" and "Use of Wheatland Electrical Metallic Tubing in Conformance to the 2011 National Electrical Code®".
  - Notice, verbatim in segments: "Reprinted with permission from NFPA 70®, National Electrical Code®, Copyright© 2007," / "National Fire Protection Association, Quincy, MA." / "This reprinted material is not the complete and official position of the NFPA on the referenced subject," / "which is represented only by the standard in its entirety."
  - A ©2007 date means NFPA 70-2008 text.
  - **New in R3**: the brochure reproduces only Chapter 9 **Tables 1 and 2**, plus Table 300.1(C) and Table 344.30(B)(2). It has no Notes, no Table 4, 5 or 8, and no Annex C. **This lead is closed.**
- **P11**: Thomas & Betts ("now ABB Installation Products"), "Steel City® Metallic boxes and covers" catalog, pp. 7–9, undated.
  - https://assets.usesi.com/product-media/catalogs/USESI_65225_catalog.pdf
  - Notice: "Reprinted with permission from National Fire Protection Association NFPA70-2011." / "National Electrical Code, Copyright© 2010, National Fire Protection Association, Quincy,MA 02269." / "This reprinted material is not the complete and official position of the NFPA" / "on the referenced subject which is represented only by the standard in its entirety."
  - **This is the same catalog family as A5's P1 and P2, so it is not independent of them.**
- **P12**: Leviton, Captain Code 2023, "Clarification of 6" Out of Box Conductors Rule... Spliced or Unspliced?" (300.14).
  - https://captaincode2023.leviton.com/node/327
  - Notice, as extracted (the summarizer turned ® into "."): "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved."

### Government hosts (tier 3)

- **G2**: Minnesota DLI, "NEC 2026 Adoption Review Committee: Summary of Significant 2026 NEC® Changes". This is a Board of Electricity packet file; the file name implies 01/15/26, and the text itself is undated.
  - https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
- **G3**: Utah DOPL continuing-education objectives file 13511, "2026 NEC Changes Part 2", instructor Jerry Durham, JadeLearning.com, undated.
  - https://secure.utah.gov/ce-public/files/objectives/13511.pdf
  - The host is a state site, but the content is a private course outline, so its content is treated as **tier 4**.

### Corroboration only (tier 4), and rejected sources

- **C8** (re-fetched): PDHonline E276, David A. Snyder, PE, 2026. It names no NEC edition and carries no notice.
  - https://www.pdhonline.com/courses/e276/Conduit_Fill_Tables.pdf
- **C13**: EC&M, "NFPA Issues Multiple Corrections to the 2023 NEC" (summary of Errata 70-23-3, reported April 5, 2023).
  - https://ecmweb.com/national-electrical-code/article/21263396/nfpa-issues-multiple-corrections-to-the-2023-nec
- **C14**: APPA, "NFPA 70 National Electrical Code updates", a list of 2017 and 2020 TIAs and errata.
  - https://appa.org/nfpa-70-national-electrical-code-updates
- **C15**: Dean Austin, "A Look at the Proposed 2026 NEC Changes", IAEI Magazine, NFPA Code Talk column, July 1, 2025. It has no NFPA notice.
  - https://iaeimagazine.org/columns/nfpa-code-talk/look-at-proposed-2026-nec-changes/
- **C16**: Ryan Jackson, "Global Code-Wide Changes and Overview", EC&M, July 15, 2026.
  - https://www.ecmweb.com/national-electrical-code/code-basics/article/55387143/global-code-wide-changes-and-overview
- **C17**: CCCA factsheet, "The 2026 NEC® is Approved! What You Need to Know".
  - https://cccassoc.org/wp-content/uploads/2025/08/CCCA-Flyer-on-Changes-2026-NECR-Final-2-13-25.pdf
- **C18**: Cerrowire Raceway Fill Calculator page. It states its basis ("dimensions used are based on NEC Chapter 9 Table 5"; "based on NEC Chapter 9 Table 5a"; "values are taken from NEC Chapter 9 Table 8"). It shows no values and no notice.
  - https://www.cerrowire.com/products/resources/tables-calculators/raceway-fill-calculator/
- **R1 (rejected; do not cite)**: Hubbell RACO, "RACO BOXES, COVERS AND ACCESSORIES" catalog, pp. A3–A7. The heading reads "STANDARDS, 2020 NATIONAL ELECTRICAL CODE®". It has **no** NFPA permission notice and does not reproduce Table 314.16(A).
  - https://hubbellcdn.com/ohwassets/HCI/RACO/Catalog/SteelBoxesCoverAcc.pdf

---

## 1. Chapter 9 Table 1 and the Notes to Tables 1–9

### 1a. Table 1: VERIFIED-other-edition (NFPA 70-2008 text); 2023 UNVERIFIED

From P10 (re-fetched in this run).

- Pull 1 (data): "1 | 53%", "2 | 31%", "Over 2 | 40%".
- Pull 2 (raw tokens, printed order): "Table 1 Percent of Cross Section of Conduit and Tubing for Conductors Number of Conductors All Conductor Types" / "1 53 2 31 Over 2 40 From Article 300 Wiring Methods". The trailing "From Article 300 Wiring Methods" is the brochure's caption for the next table.
- **The two pulls match.** They also match A5's pulls of the same document.
- Edition: the ©2007 notice means NFPA 70-2008 text. The brochure says it conforms to the 2011 NEC.
- The 2023 title (which may add "and Cables") was not seen.
- Independent authorized cross-check: none exists. A5's category-4 sources (C1, C5–C8) agree; they were not re-fetched.

### 1b. Notes 1–9: UNVERIFIED

- No authorized text of any edition was found in this run.
- A search for the exact Note 3 phrase ("shall be included when calculating conduit or tubing fill") returned only forum and exam-prep pages (category 4).
- Leviton Captain Code 2023 has no Chapter 9 entry; all three index pages were checked.
- P10 prints no Notes.

---

## 2. Chapter 9 Table 4: UNVERIFIED for every conduit type

- **No authorized copy of Table 4, in any edition, was found.**
- Leads checked and closed in R3:
  - P10 has no Table 4.
  - The Carlon E985F catalog is a Canadian (www.tnb.ca) catalog with no NFPA notice. It has only derived conductor-count tables ("Based on Table 1, Chapter 9 of the NEC").
  - The T&B Liquidtight fittings catalog (Elliott Electric 5231-TAB) and the Electri-Flex Type LA page (Talley INF23102) contain no NEC tables.
  - The Cerrowire calculator (C18) shows no values.
- Per PREAMBLE-R3, third-party Table 4 copies stay banned, so no category-4 values are given here.

### New: the 2023 Annex C raceway list (N7). VERIFIED-2023 for the titles; single pull of a list

Errata 70-23-2 reprints the 2023 Annex C "Listing of Tables" to correct page numbers. Below are the raw extracted lines. The two page numbers on each line run together in the extraction, so they are dropped here.

```
C.1 — Electrical Metallic Tubing (EMT)
C.1(A)* — Electrical Metallic Tubing (EMT)
C.2 — Electrical Nonmetallic Tubing (ENT)
C.3 — Flexible Metal Conduit (FMC)
C.4 — Intermediate Metal Conduit (IMC)
C.5 — Liquidtight Flexible Nonmetallic Conduit (LFNC-A)
C.6 — Liquidtight Flexible Nonmetallic Conduit (LFNC-B)
C.7 — Liquidtight Flexible Nonmetallic Conduit (LFNC-C)
C.8 — Liquidtight Flexible Metal Conduit (LFMC)
C.9 — Rigid Metal Conduit (RMC)
C.10 — Rigid PVC Conduit, Schedule 80
C.11 — Rigid PVC Conduit, Schedule 40 and HDPE Conduit
C.12 — Type A, Rigid PVC Conduit
C.13 — Type EB, PVC Conduit
C.14 / C.15 — Type MC Cables Permitted in Cable Tray
C.16 / C.17 — Type TC Cables Permitted in Cable Tray
C.18 / C.19 / C.20 — Single Conductor Cables Permitted in Cable Tray
```

Each of C.1–C.13 also has a "(A)*" compact-conductor variant.

**Implications (inference, not verification):**
1. Annex C conduit tables are built from Chapter 9 Tables 1, 4, 5 and 5A, so 2023 Table 4 very likely has an **LFNC-C** block. A5's Table 4 type list (12 types) lacks LFNC-C.
2. **The 2023 Annex C numbers differ from older reprints.** RMC is **C.9**, LFMC **C.8**, PVC-80 **C.10**, PVC-40/HDPE **C.11**, Type A **C.12** and Type EB **C.13**. For example, the T&B Ocal reprint of NFPA 70-1999 labels RMC "Table C8". Any Annex C citation on the site must use the 2023 numbers.

---

## 3. Chapter 9 Table 5: UNVERIFIED. The 2/0 THHN conflict, analysed

- No authorized copy was found.
- **2/0 THHN/THWN/THWN-2 area: 0.2223 vs 0.2233 in².**
  - C8 (re-fetched): raw line "2/0 or 00 0.532 0.2223" (diameter in., area in²), under "TABLE 7 - Dimensions of Insulated Conductors".
  - The extractor assigns that block to THHN by inference: C8 prints its type labels ("THHW / THHN & THWN / XHHW") apart from the data blocks.
  - Neighbouring raw lines from the same block: "2 0.384 0.1158", "1 0.446 0.1562", "1/0 or 0 0.486 0.1855", "3/0 or 000 0.584 0.2679", "4/0 or 0000 0.642 0.3237", "250 0.711 0.3970".
  - C1 (Mike Holt 2011, which prints 0.2233) was not re-fetched; it is A5's record.
- **Consistency check** (`python3 -I`; arithmetic only, not a code value):
  - π/4 × 0.532² = **0.22229**, which rounds to 0.2223.
  - 0.2233 would need d = **0.53321 in**, and d = 0.533 gives 0.22312. So 0.2233 fits no 3-decimal diameter.
  - Every neighbouring C8 row (2, 1, 1/0, 3/0, 4/0, 250) equals π/4·d² to four decimals.
- **Verdict**: still **CONFLICTING / UNVERIFIED**, because no authorized copy has been seen. On consistency, **0.2223** is far better supported; 0.2233 looks like a digit transposition in C1. If the site must choose before an authorized copy is found, 0.2223 is the defensible value, labelled as unverified.
- TW, XHHW-2 and THWN-2: nothing new.

---

## 4. Chapter 9 Table 8: UNVERIFIED (2023); 2026 text unreachable

- No authorized copy was found. Rejected candidates:
  - Mike Holt sample 1220452413 has "Table 8–1. Conductor Properties, NEC Chapter 9, Table 8" for 14–6 AWG, but no notice and no stated edition.
  - ExpertCE (claims 2023) quotes a single value, has a trademark line only, and no permission notice.
- **2026 cycle (NFPA)**:
  - **N8** (CMP-6 First Draft) is readable only to p. 55 of 109, ending in FR 8040 (330.10(B)). The Chapter 9 Table 8 First Revisions (from PI 2158 and PI 259, per A5's N5) sit beyond the readable range.
  - In the readable part, Chapter 9 Table 8 appears only in an informational note under 310.15(A), which FR 7959 did not change. FR 7959's statement: "A revision was made to Informational note No. 1."
  - **N9** (CMP-6 Second Draft) is readable through SR-8582 (382.104(A)). **No Chapter 9 Second Revision appears in the readable part**, but Articles 393–402 and Chapter 9 are past the cut-off.
  - CMP-6's A2025 scope covers Article 310 and the cable articles: N8 and N9 show FRs and SRs on 320, 322, 324, 330–340 and 382. That is why its drafts are long and Chapter 9 falls past the ~100K-character limit.
- Status of the 2026 Table 8 change: First Revisions exist (A5, VERIFIED-draft, statements only). Their text and final disposition are **NOT CONFIRMED**.

## 5. Chapter 9 Table 9: UNVERIFIED

- No authorized copy was found.
- Mike Holt "Electrical Calculations – 2002 NEC Edition" (sample 1038225525) reproduces a partial Table 9 without a notice; it is unusable.

---

## 6. 314.16 box fill

### 6a. 314.16(B)(1)–(B)(6), 2023 wording: UNVERIFIED (no change from A5)

- Leviton Captain Code 2023 has **no 314.16 entry**. The index is sorted by section and runs from node 330 ("312.10, 314.5") straight to node 331 ("314.24(B)(C)"). The 2023 pocket guide (A5 P9) has none either.
- **R1 (the RACO catalog) is rejected because its text mixes editions.** Verbatim segments:
  - Intro: "(b) Box Fill Calculations. The volumes in paragraphs (1) through (5) below, as applicable,". This counts five subsections, so it is pre-2023.
  - (B)(1): "The conductor fill, in cubic inches, shall be computed using Table 314.16(B)(1)." This is the 2023 table designation.
  - (B)(2), (B)(3) and (B)(4) cite "NEC® 314.16(B)(2)", "(B)(3)" and "(B)(4)" where the code cites the table.
  - (B)(5): "Where one or more equipment grounding conductor(s) enter(s) a box," … "Where an additional set of equipment grounding conductors, as permitted by NEC® 314.16(B)(5)". This is the pre-2020 wording; 2020 reads "up to four" (A5 P8).
  - Heading: "STANDARDS, 2020 NATIONAL ELECTRICAL CODE®".
  - **Do not use R1, even as corroboration.**
- 2023 wording for (B)(1)–(B)(6) therefore remains as in A5: (B)(1)–(B)(4) in 2011 text, (B)(5) in 2020 text, and (B)(6) from the 2026 First Draft plus category 4. All are **carried (A5)**.

### 6b. Table 314.16(A): 2011 text re-verified; 2023 rows 6–24 UNVERIFIED

P11, pp. 7–8.
- Pull 1 (raw lines, with cm³) and pull 2 (data: in³ and the seven counts) **match on all 24 rows**.
- Both pulls are **identical to A5's P1 raw lines**: script /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/scripts/r3_boxcompare.py. P11 and P1 are the same catalog family, so this is not an independent check.
- Independent cross-check: A5's P3 and P4 (Appleton, NFPA 70-2008 notice) agree. They are **carried (A5)** and were not re-fetched.
- Footnote (both pulls): "* Where no volume allowances are required by 314.16(B)(2) through 314.16(B)(5)."
- Label quirk: both pulls misread the 4 × 2⅛ round/octagonal box as "4 x 2½". The cm³ (353) and in³ (21.5) identify the row.
- Floor check (`python3 -I`; not a code value): every cell equals floor(in³ ÷ allowance) **except row 1 at 8 AWG**. 12.5 ÷ 3.00 → 4, but 2011 prints **5**. The 2023 base text (A5 N3, PI 3972) prints **4**, carried (A5).
- 2023 status: rows 1–5 are **carried (A5)** as VERIFIED-2023. Rows 6–24 are **UNVERIFIED**, with no evidence that they changed. The 2023 footnote was not seen.
- Not used: USESI_7743 is a Steel City catalog ©2003 with a reprint credit to "National Fire Protection Association 70-1987". Its extraction contains an OCR artifact ("19") in the 120 × 32 square row.

### 6c. 300.14 (2023): VERIFIED-2023 (new in R3)

P12, verbatim segments:
- "300.14 Length of Free Conductors at Outlets, Junctions, and Switch Points."
- "At least 150 mm (6 in.) of free conductor,"
- "measured from the point in the box where it emerges from its raceway or cable sheath, shall be left at each"
- "outlet, junction, and switch point for splices or the connection of luminaires or devices."
- "The 150 mm (6 in.) free conductor shall be permitted to be spliced or unspliced." (the page says this sentence is new in 2023)
- "Where the opening to an outlet, junction, or switch point is less than 200 mm (8 in.) in any dimension,"
- "each conductor shall be long enough to extend at least 75 mm (3 in.) outside the opening."
- "Exception: Conductors that are not spliced or terminated at the outlet, junction, or switch point"
- "shall not be required to comply with 300.14."

Use in the calculator:
- In A5's 2011 text, the 314.16(B)(1) loop rule counts a loop "not less than twice the minimum length required for free" … "conductors in 300.14" **twice**.
- With the 2023 minimum of 150 mm (6 in.), the threshold works out to 300 mm (12 in.). That figure is **derived, not code text**, and the 2023 wording of the loop sentence itself is still unverified.

---

## 7. 2026 (A2025 cycle) and errata or TIA status

- **Errata on NFPA 70-2023 (VERIFIED, from NFPA's own documents)**:
  - 70-23-1 (N10) corrects only 210.11(C)(3) and (C)(4).
  - 70-23-2 (N7) corrects 555.53, 702.4(A)(2) and the Annex C listing page numbers.
  - **Neither touches Chapter 9 Tables 1, 4, 5, 5A, 8 or 9, the Notes, 314.16 or its tables.**
  - 70-23-3 (C13, EC&M summary; the NFPA file was not fetched) lists Table 225.3, 395.30(C)(3), 501.15(D), 513.7(F), 513.10(B), 517.71(C) and 550.18(B)(3), so none of the targets.
- **TIAs and errata, 2017 and 2020 (C14, category 4)**: none on Chapter 9 Tables 1, 4, 5, 8 or 9 or on 314.16. Errata 70-20-2 (December 23, 2019) affected "Table C.16".
- **2026 Chapter 9 tables**:
  - Table 8: First Revisions from PI 2158 and PI 259 exist (A5). Their text and the final 2026 text were **not seen** (N8 and N9 are cut off before Chapter 9).
  - **G2** (MN DLI, January 2026): its only Chapter 9 entry is "Chapter 9 Annex L Annex L, Proposed Organization of the 2029 National Electrical Code." It lists **no 2026 change** to Tables 1, 4, 5, 5A, 8 or 9, to Annex C or to 314.16.
  - **G3** (Jade outline, tier 4): its only Chapter 9 item is "95 9 Tables (Chapter 9) Table 13. Equipment Suitable for Hazardous (Classified) Locations. 4.0". That suggests a new Chapter 9 Table 13 in 2026, which is off-target.
  - **C15** (IAEI, proposal stage): "Chapter 9 may see minor changes for clarity and to align with new definitions in Article 100." It also says: "We could see some significant changes in Article 310, especially in Table 310.4(1)," / "where there were modifications made to include new wire sizes." and "Table 310.16 may also see some changes due to new wires sizes being added with correlating ampacity." If new sizes reached Table 310.16, check whether the final 2026 Table 8 gained matching rows.
  - **C16** and **C17**: no Chapter 9 mention.
  - **Verdict**: "Chapter 9 tables unchanged in 2026" is **still NOT CONFIRMED** for Table 8. For Tables 1, 4, 5 and 9, no source of any tier reports a change.
- **2026 314.16**: nothing new beyond A5 (SR-8088 and FR-7525/7527/7529 are VERIFIED-draft). Final disposition was not checked.

---

## Machine-readable

Conventions:
- `status` uses the preamble keys.
- `values: []` means no value was verified.
- "carried (A5)" marks a value not re-seen in this run.

```json
{"ref":"NFPA 70 Chapter 9 Table 1","edition":"NFPA 70-2008 text (notice Copyright 2007; brochure says it conforms to the 2011 NEC)","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","values":[{"conductors":"1","percent":53},{"conductors":"2","percent":31},{"conductors":"over 2","percent":40}],"pulls_match":true,"quote_segments":["Table 1 Percent of Cross Section of Conduit and Tubing for Conductors","Number of Conductors All Conductor Types","1 53 2 31 Over 2 40"],"source_url":"https://inspectapedia.com/electric/Metal_Conduit_Installation_NEC.pdf","source_note":"Wheatland Tube brochure re-hosted by a third party (A5 P10); reproduces Chapter 9 Tables 1 and 2 only","permission_notice":"Reprinted with permission from NFPA 70®, National Electrical Code®, Copyright© 2007, National Fire Protection Association, Quincy, MA. This reprinted material is not the complete and official position of the NFPA on the referenced subject, which is represented only by the standard in its entirety.","retrieved":"2026-10-20"}
```

```json
{"ref":"NFPA 70 Chapter 9 Notes to Tables 1-9","edition":"2023","status":"UNVERIFIED","values":[{"note":3,"topic":"equipment grounding/bonding conductors included in fill","text":null},{"note":4,"topic":"nipples not over 24 in. filled to 60 %","text":null},{"note":7,"topic":"rounding rule for conductors of the same size","text":null}],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No authorized text of any edition found in R3; only A5's category-4 corroboration exists"}
```

```json
{"ref":"NFPA 70 Chapter 9 Table 4","edition":"2023","status":"UNVERIFIED","values":[],"per_type_status":{"EMT":"UNVERIFIED","IMC":"UNVERIFIED","RMC":"UNVERIFIED","PVC Schedule 40 (and HDPE)":"UNVERIFIED","PVC Schedule 80":"UNVERIFIED","FMC":"UNVERIFIED","LFMC":"UNVERIFIED","LFNC-C (likely present in 2023, inferred from Annex C)":"UNVERIFIED"},"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"Third-party Table 4 copies remain banned (PREAMBLE-R3 item 7)"}
```

```json
{"ref":"NFPA 70-2023 Informative Annex C, listing of tables (titles)","edition":"2023","status":"VERIFIED-2023","values":[{"table":"C.1","title":"Electrical Metallic Tubing (EMT)"},{"table":"C.2","title":"Electrical Nonmetallic Tubing (ENT)"},{"table":"C.3","title":"Flexible Metal Conduit (FMC)"},{"table":"C.4","title":"Intermediate Metal Conduit (IMC)"},{"table":"C.5","title":"Liquidtight Flexible Nonmetallic Conduit (LFNC-A)"},{"table":"C.6","title":"Liquidtight Flexible Nonmetallic Conduit (LFNC-B)"},{"table":"C.7","title":"Liquidtight Flexible Nonmetallic Conduit (LFNC-C)"},{"table":"C.8","title":"Liquidtight Flexible Metal Conduit (LFMC)"},{"table":"C.9","title":"Rigid Metal Conduit (RMC)"},{"table":"C.10","title":"Rigid PVC Conduit, Schedule 80"},{"table":"C.11","title":"Rigid PVC Conduit, Schedule 40 and HDPE Conduit"},{"table":"C.12","title":"Type A, Rigid PVC Conduit"},{"table":"C.13","title":"Type EB, PVC Conduit"},{"table":"C.14-C.15","title":"Type MC Cables Permitted in Cable Tray"},{"table":"C.16-C.17","title":"Type TC Cables Permitted in Cable Tray"},{"table":"C.18-C.20","title":"Single Conductor Cables Permitted in Cable Tray"}],"compact_variants":"C.1(A)* through C.13(A)*","quote_segments":["C.1 — Electrical Metallic Tubing (EMT)","C.7 — Liquidtight Flexible Nonmetallic Conduit (LFNC-C)","C.8 — Liquidtight Flexible Metal Conduit (LFMC)","C.9 — Rigid Metal Conduit (RMC)","C.11 — Rigid PVC Conduit, Schedule 40 and HDPE Conduit"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","note":"Single pull of a title list; page numbers run together in the extraction and are omitted"}
```

```json
{"ref":"NFPA 70 Chapter 9 Table 5","edition":"2023","status":"UNVERIFIED","values":[],"conflict":{"item":"2/0 THHN/THWN/THWN-2 approximate area, in2","status":"CONFLICTING (category 4 only)","candidates":[{"value":0.2223,"diameter_in":0.532,"source":"PDHonline E276 (C8, category 4; THHN block assignment inferred by the extractor)","url":"https://www.pdhonline.com/courses/e276/Conduit_Fill_Tables.pdf","seen_in_R3":true},{"value":0.2233,"source":"Mike Holt 2011 exam-prep sample (C1, category 4)","url":"https://www.mikeholt.com/instructor2/img/product/pdf/11MBOOKS-1176-sample.pdf","seen_in_R3":false}],"consistency_check":"pi/4 x 0.532^2 = 0.22229; 0.2233 implies d = 0.53321 in; d = 0.533 gives 0.22312; C8 rows 2, 1, 1/0, 3/0, 4/0 and 250 all equal pi/4 x d^2 to 4 decimals","leaning":"0.2223 (arithmetic consistency only; not a verification)"},"quote_segments":["2/0 or 00 0.532 0.2223"],"source_url":"https://www.pdhonline.com/courses/e276/Conduit_Fill_Tables.pdf","permission_notice":null,"retrieved":"2026-10-20"}
```

```json
{"ref":"NFPA 70 Chapter 9 Table 8","edition":"2023","status":"UNVERIFIED","values":[],"status_2026":"First Revisions from PI 2158 and PI 259 recorded at First Draft (A5: VERIFIED-draft, statements only); FR text and final 2026 text not seen: CMP-6 First Draft readable only to p. 55 of 109 (Article 330); CMP-6 Second Draft readable only to 382.104(A), with no Chapter 9 SR in that part","quote_segments":["A revision was made to Informational note No. 1."],"quote_context":"FR 7959 (310.15(A)) statement; Chapter 9 Table 8 appears only in an informational note there","source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_PrelimSR.pdf"],"permission_notice":"NFPA's own documents (no notice applies)","retrieved":"2026-10-20"}
```

```json
{"ref":"NFPA 70 Chapter 9 Table 9","edition":"2023","status":"UNVERIFIED","values":[],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No authorized reproduction found; the Mike Holt 2002 sample is partial and has no notice"}
```

```json
{"ref":"NFPA 70 Table 314.16(A) Metal Boxes","edition":"NFPA 70-2011 (notice: NFPA70-2011, Copyright 2010)","status":"VERIFIED-other-edition","pulls_match":true,"matches_A5_P1":true,"independent_crosscheck":"A5 P3/P4 (Appleton, NFPA 70-2008) agree; carried (A5), not re-fetched","footnote_2011":"* Where no volume allowances are required by 314.16(B)(2) through 314.16(B)(5).","footnote_2023":"UNVERIFIED","values":[
 {"row":1,"box":"100 x 32 (4 x 1-1/4) round/octagonal","cm3":205,"in3":12.5,"max":{"18":8,"16":7,"14":6,"12":5,"10":5,"8":5,"6":2},"status_2023":"carried (A5): VERIFIED-2023 via N3 PI 3972 base text, where 8 AWG = 4"},
 {"row":2,"box":"100 x 38 (4 x 1-1/2) round/octagonal","cm3":254,"in3":15.5,"max":{"18":10,"16":8,"14":7,"12":6,"10":6,"8":5,"6":3},"status_2023":"carried (A5): VERIFIED-2023 via N3"},
 {"row":3,"box":"100 x 54 (4 x 2-1/8) round/octagonal","cm3":353,"in3":21.5,"max":{"18":14,"16":12,"14":10,"12":9,"10":8,"8":7,"6":4},"status_2023":"carried (A5): VERIFIED-2023 via N3","note":"extractor misreads the size label as 4 x 2-1/2"},
 {"row":4,"box":"100 x 32 (4 x 1-1/4) square","cm3":295,"in3":18.0,"max":{"18":12,"16":10,"14":9,"12":8,"10":7,"8":6,"6":3},"status_2023":"carried (A5): VERIFIED-2023 via N3"},
 {"row":5,"box":"100 x 38 (4 x 1-1/2) square","cm3":344,"in3":21.0,"max":{"18":14,"16":12,"14":10,"12":9,"10":8,"8":7,"6":4},"status_2023":"carried (A5): VERIFIED-2023 via N3"},
 {"row":6,"box":"100 x 54 (4 x 2-1/8) square","cm3":497,"in3":30.3,"max":{"18":20,"16":17,"14":15,"12":13,"10":12,"8":10,"6":6},"status_2023":"UNVERIFIED"},
 {"row":7,"box":"120 x 32 (inch label extracted as 4L x 1-1/4) square","cm3":418,"in3":25.5,"max":{"18":17,"16":14,"14":12,"12":11,"10":10,"8":8,"6":5},"status_2023":"UNVERIFIED"},
 {"row":8,"box":"120 x 38 (inch label extracted as 4L x 1-1/2) square","cm3":484,"in3":29.5,"max":{"18":19,"16":16,"14":14,"12":13,"10":11,"8":9,"6":5},"status_2023":"UNVERIFIED"},
 {"row":9,"box":"120 x 54 (inch label extracted as 4L x 2-1/8) square","cm3":689,"in3":42.0,"max":{"18":28,"16":24,"14":21,"12":18,"10":16,"8":14,"6":8},"status_2023":"UNVERIFIED"},
 {"row":10,"box":"75 x 50 x 38 (3 x 2 x 1-1/2) device","cm3":123,"in3":7.5,"max":{"18":5,"16":4,"14":3,"12":3,"10":3,"8":2,"6":1},"status_2023":"UNVERIFIED"},
 {"row":11,"box":"75 x 50 x 50 (3 x 2 x 2) device","cm3":164,"in3":10.0,"max":{"18":6,"16":5,"14":5,"12":4,"10":4,"8":3,"6":2},"status_2023":"UNVERIFIED"},
 {"row":12,"box":"75 x 50 x 57 (3 x 2 x 2-1/4) device","cm3":172,"in3":10.5,"max":{"18":7,"16":6,"14":5,"12":4,"10":4,"8":3,"6":2},"status_2023":"UNVERIFIED"},
 {"row":13,"box":"75 x 50 x 65 (3 x 2 x 2-1/2) device","cm3":205,"in3":12.5,"max":{"18":8,"16":7,"14":6,"12":5,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":14,"box":"75 x 50 x 70 (3 x 2 x 2-3/4) device","cm3":230,"in3":14.0,"max":{"18":9,"16":8,"14":7,"12":6,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":15,"box":"75 x 50 x 90 (3 x 2 x 3-1/2) device","cm3":295,"in3":18.0,"max":{"18":12,"16":10,"14":9,"12":8,"10":7,"8":6,"6":3},"status_2023":"UNVERIFIED"},
 {"row":16,"box":"100 x 54 x 38 (4 x 2-1/8 x 1-1/2) device","cm3":169,"in3":10.3,"max":{"18":6,"16":5,"14":5,"12":4,"10":4,"8":3,"6":2},"status_2023":"UNVERIFIED"},
 {"row":17,"box":"100 x 54 x 48 (4 x 2-1/8 x 1-7/8) device","cm3":213,"in3":13.0,"max":{"18":8,"16":7,"14":6,"12":5,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":18,"box":"100 x 54 x 54 (4 x 2-1/8 x 2-1/8) device","cm3":238,"in3":14.5,"max":{"18":9,"16":8,"14":7,"12":6,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":19,"box":"95 x 50 x 65 (3-3/4 x 2 x 2-1/2) masonry box/gang","cm3":230,"in3":14.0,"max":{"18":9,"16":8,"14":7,"12":6,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":20,"box":"95 x 50 x 90 (3-3/4 x 2 x 3-1/2) masonry box/gang","cm3":344,"in3":21.0,"max":{"18":14,"16":12,"14":10,"12":9,"10":8,"8":7,"6":4},"status_2023":"UNVERIFIED"},
 {"row":21,"box":"min. 44.5 depth FS - single cover/gang (1-3/4)","cm3":221,"in3":13.5,"max":{"18":9,"16":7,"14":6,"12":6,"10":5,"8":4,"6":2},"status_2023":"UNVERIFIED"},
 {"row":22,"box":"min. 60.3 depth FD - single cover/gang (2-3/8)","cm3":295,"in3":18.0,"max":{"18":12,"16":10,"14":9,"12":8,"10":7,"8":6,"6":3},"status_2023":"UNVERIFIED"},
 {"row":23,"box":"min. 44.5 depth FS - multiple cover/gang (1-3/4)","cm3":295,"in3":18.0,"max":{"18":12,"16":10,"14":9,"12":8,"10":7,"8":6,"6":3},"status_2023":"UNVERIFIED"},
 {"row":24,"box":"min. 60.3 depth FD - multiple cover/gang (2-3/8)","cm3":395,"in3":24.0,"max":{"18":16,"16":13,"14":12,"12":10,"10":9,"8":8,"6":4},"status_2023":"UNVERIFIED"}],
 "quote_segments":["100 x 32 (4 x 11⁄4) Round/Octagonal 205 12.5 8 7 6 5 5 5 2","Min. 60.3 depth FD – Multiple-Cover/Gang (23⁄8) 395 24.0 16 13 12 10 9 8 4"],
 "source_url":"https://assets.usesi.com/product-media/catalogs/USESI_65225_catalog.pdf","permission_notice":"Reprinted with permission from National Fire Protection Association NFPA70-2011. National Electrical Code, Copyright© 2010, National Fire Protection Association, Quincy,MA 02269. This reprinted material is not the complete and official position of the NFPA on the referenced subject which is represented only by the standard in its entirety.","retrieved":"2026-10-20","note":"cm3 seen in the raw pull only in R3 (matches A5 P1); rows 7-9 inch labels are not legible in the extraction (printed as 4L); the metric designator is 120; the box column text is normalized to ASCII fractions"}
```

```json
{"ref":"NFPA 70 314.16(B)(1)-(B)(6) counting rules","edition":"2023","status":"UNVERIFIED","values":[],"carried_from_A5":{"(B)(1)-(B)(4)":"VERIFIED-other-edition (2011 text, A5 P1)","(B)(5)":"VERIFIED-other-edition (2020 text, A5 P8: up to four EGCs/EBJs = 1 allowance; 1/4 allowance for each additional)","(B)(6)":"exists in 2023 (A5 N4); text VERIFIED-draft (2026 First Draft, A5 N1)"},"rejected_source":{"url":"https://hubbellcdn.com/ohwassets/HCI/RACO/Catalog/SteelBoxesCoverAcc.pdf","reason":"no NFPA notice; text mixes editions: intro '(1) through (5)', (B)(1) cites 'Table 314.16(B)(1)', (B)(5) uses the pre-2020 'additional set' wording under a '2020 NEC' heading"},"quote_segments":["(b) Box Fill Calculations. The volumes in paragraphs (1) through (5) below, as applicable,","The conductor fill, in cubic inches, shall be computed using Table 314.16(B)(1).","Where an additional set of equipment grounding conductors, as permitted by NEC® 314.16(B)(5)"],"quote_source":"R1 (rejected source; quoted only to show the defects)","source_url":null,"permission_notice":null,"retrieved":"2026-10-20"}
```

```json
{"ref":"NFPA 70 300.14 Length of Free Conductors at Outlets, Junctions, and Switch Points","edition":"2023","status":"VERIFIED-2023","values":{"min_free_conductor":"150 mm (6 in.)","opening_threshold":"less than 200 mm (8 in.) in any dimension","min_extension_outside_opening":"75 mm (3 in.)","spliced_or_unspliced_permitted":true,"exception":"conductors not spliced or terminated at the outlet, junction, or switch point"},"derived_for_314_16_B_1":"loop threshold = twice 150 mm (6 in.) = 300 mm (12 in.); derived arithmetic, and the 2023 wording of the loop sentence is UNVERIFIED (2011 text in A5)","quote_segments":["300.14 Length of Free Conductors at Outlets, Junctions, and Switch Points.","At least 150 mm (6 in.) of free conductor,","measured from the point in the box where it emerges from its raceway or cable sheath, shall be left at each","outlet, junction, and switch point for splices or the connection of luminaires or devices.","The 150 mm (6 in.) free conductor shall be permitted to be spliced or unspliced.","Where the opening to an outlet, junction, or switch point is less than 200 mm (8 in.) in any dimension,","each conductor shall be long enough to extend at least 75 mm (3 in.) outside the opening.","Exception: Conductors that are not spliced or terminated at the outlet, junction, or switch point","shall not be required to comply with 300.14."],"source_url":"https://captaincode2023.leviton.com/node/327","permission_notice":"Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved.","permission_notice_note":"quoted as extracted; the two '.' characters are probably ® in the original","retrieved":"2026-10-20"}
```

```json
{"ref":"NFPA 70-2023 errata and 2026 change status for Chapter 9 and 314.16","edition":"2023 / 2026","status":"mixed (see items)","values":[
 {"item":"Errata 70-23-1 (2022-09-01)","corrects":["210.11(C)(3) Exception","210.11(C)(4) Exception No. 2"],"touches_targets":false,"status":"VERIFIED-2023","url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_1.pdf"},
 {"item":"Errata 70-23-2 (2022-09-15)","corrects":["555.53","702.4(A)(2)","Annex C listing of tables (page numbers only)"],"touches_targets":false,"status":"VERIFIED-2023","url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf"},
 {"item":"Errata 70-23-3 (2023-03-24)","corrects":["Table 225.3","395.30(C)(3)","501.15(D)","513.7(F)","513.10(B)","517.71(C)","550.18(B)(3)"],"touches_targets":false,"status":"category 4 (EC&M summary; NFPA file not fetched)","url":"https://ecmweb.com/national-electrical-code/article/21263396/nfpa-issues-multiple-corrections-to-the-2023-nec"},
 {"item":"2026 Chapter 9 Table 8","change":"First Revisions from PI 2158 and PI 259 (A5)","final":"NOT CONFIRMED","status":"VERIFIED-draft (statements only, A5)"},
 {"item":"2026 Chapter 9 Tables 1, 4, 5, 9","change":"none reported by any source seen","final":"NOT CONFIRMED (drafts unreadable past the cut-off)","status":"UNVERIFIED"},
 {"item":"2026 Chapter 9 Table 13 (Equipment Suitable for Hazardous (Classified) Locations)","change":"appears in a 2026 changes course outline","status":"category 4 (Jade Learning outline on a Utah state host)","url":"https://secure.utah.gov/ce-public/files/objectives/13511.pdf"},
 {"item":"MN DLI Summary of Significant 2026 NEC Changes","finding":"no Chapter 9 table, Annex C or 314.16 entry; only Annex L","status":"tier 3","url":"https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf"}],
 "quote_segments":["Chapter 9 Annex L Annex L, Proposed Organization of the 2029 National Electrical Code.","Chapter 9 may see minor changes for clarity and to align with new definitions in Article 100."],
 "source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_1.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf","https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf","https://iaeimagazine.org/columns/nfpa-code-talk/look-at-proposed-2026-nec-changes/"],"permission_notice":null,"retrieved":"2026-10-20"}
```

---

## Blocked or failed log

1. **WebSearch**: 14 executed. The 15th ("distributordatasolutions ThomasAndBetts nectable …") was refused because the turn-wide budget of 200 shared calls was exhausted. No workaround was attempted.
   Queries, in order:
   1. "Reprinted with permission from NFPA 70" + Chapter 9 Table 4 EMT
   2. Table 8 + Table 9 titles + permission
   3. Southwire/Cerrowire/Encore + Table 8 + permission
   4. Exact Note 3 phrase + permission
   5. Table 4 LFMC/PVC-80 article headings + permission
   6. Cerrowire/Southwire + Table 9 title
   7. docinfofiles TIA/errata + Chapter 9
   8. Table 314.16(A) box catalogs + permission
   9. 314.16(B)(5)/(B)(6) + permission
   10. Pocket guide + Chapter 9 + permission
   11. IAEI + Chapter 9 + permission (the site: operator was ignored)
   12. Carlon/Cantex/JM Eagle/IPEX + Table 4 PVC
   13. 2026 NEC + Chapter 9 Table 8 change
   14. NABCEP + Table 8 + permission
2. **docinfofiles.nfpa.org**: 5 of 8 fetches.
   - N8 and N9: both read, both cut off before Chapter 9.
   - Errata 70-23-2 and 70-23-1: both read.
   - `70_A2025_NEC_P08_PCSubmittals.pdf` (guessed name): "There was an error while fetching." A 404 could not be told from a 429, so **I stopped using the host** and did not try further guessed names.
3. **leviton.com 2026 Captain Code pocket guide** (guessed by analogy with the 2023 file): https://leviton.com/content/dam/leviton/commercial-industrial/product_documents/take_one/2026-Captain-Code-NEC-Code-Changes.pdf
   - Refused with PROVENANCE_REQUIRED: the user did not answer the permission request in time. **Not retried.** It needs the owner's approval to test.
4. **assets.usesi.com/…/USESI_154496_catalog.pdf**: "There was an error while fetching." Not retried.
5. **Checked and off-target** (no authorized Chapter 9 or 314.16 2023 content):
   - **Chicago Title 14E** (amlegal dev page): incorporates NFPA 70 articles by reference and reproduces no Chapter 9.
   - **MSHA District 9 "INDEX.pdf"**: the index of NFPA 70-**1968** (NFPA notice, ©1967), as referenced by 30 CFR.
   - **Mike Holt samples**:
     - 1038225525: "Electrical Calculations – 2002 NEC Edition", partial Table 9, no notice.
     - 1220452413: Unit 8 voltage drop, partial Table 8 (14–6 AWG), no edition, no notice.
     - 1037794283: "Understanding the NEC – 2002", Article 358 only.
   - **T&B Ocal "nectable8"**: Annex C **Table C8 (RMC)**, NFPA 70-**1999** notice (©1998).
   - **Elliott 5231-TAB**: T&B LFMC fittings (Canada). No NEC tables, no notice.
   - **Talley INF23102**: Electri-Flex LA page. No NEC tables.
   - **Carlon E985F**: Canadian. Derived counts only, no notice.
   - **Encore Wire sheets**: res.cloudinary bwes TFFN/TFN page and IEWC Encore.pdf (fire-alarm cable page). No NEC tables.
   - **Cerrowire pages**: tables index, voltage-drop tables (own data) and raceway-fill calculator (C18). No values, no notice.
   - **ExpertCE Table 8 article**: claims 2023 but has no notice and one value only.
   - **USESI_7743**: Steel City ©2003 with an NFPA 70-1987 reprint credit.
   - **Captain Code 2023 index pages** (?page=0, 1, 2): no 314.16 or Chapter 9 entries. Pages 0 and 1 returned the same list.
   - **CCCA flyer**: covers only the Chapter 7/8 limited-energy restructure.
   - **EC&M 2026 global changes**: no Chapter 9.
6. **Not used, by rule**: third-party Table 4 copies, Scribd and UpCodes (UpCodes not attempted).

## Open gaps

1. **Tables 4, 5, 8 and 9**: still no authorized copy of any edition. This is the biggest gap.
   - NFPA's own panel drafts cannot reach Chapter 9 because of the ~100K-character cut-off. The CMP-6 First Draft has 109 pp. and is readable to p. 55; the CMP-6 Second Draft is readable to Article 382.
   - Next leads, which need a fresh search budget:
     - other T&B/ABB "nectable" or "nec" reprint files on media.distributordatasolutions.com (the host already serves NFPA-noticed T&B pages);
     - the wire-maker handbooks: Southwire Power Cable Manual and Prysmian/General Cable technical guides;
     - newer conduit-maker technical guides (Allied/Atkore, Zekelman/Wheatland 2017+, Nucor/Republic, JM Eagle, Electri-Flex, Southwire Alflex);
     - in each case, check for "Reprinted with permission from NFPA 70®-2020/2023".
   - The most reliable route is reading NFPA 70-2023 directly (NFPA free-access viewer with a login, or a purchased copy).
   - Every tier-2 copy found carries an NFPA permission notice. Republishing whole tables verbatim on the site is a separate permissions question from using the values in calculators.
2. **Table 1 (2023 title and values) and Notes 1–9 wording**: there is no authorized 2023 text. Note 3 (EGCs counted), Note 4 (nipples at 60 %) and Note 7 (rounding) rest on category 4 only.
3. **2026 Table 8**: the First Revision text and final disposition are unknown. Check whether the new Table 310.16 conductor sizes (C15, proposal stage) gained Table 8 rows.
4. **314.16(B)(1)–(B)(6), 2023 wording**: no authorized source.
   - Captain Code 2023 has no entry, and RACO is rejected.
   - Leads:
     - the Leviton 2026 pocket guide (needs owner approval of the URL);
     - the CMP-8 A2025 Public Comment file (needs the correct file name from a search);
     - the A2022 (2023-cycle) CMP-9 First Draft working draft, where Article 314 sits near the start and the (B)(6) addition and Table 314.16(B)(1) rename should appear (file name unknown).
5. **Table 314.16(A) rows 6–24 and the footnote, as 2023**: unverified. When row 1's 8 AWG value went from 5 to 4 (some edition between 2011 and 2023) is still unknown.
6. **LFNC-C in Table 4**: inferred from 2023 Annex C only. Confirm the Table 4 block once an authorized copy is found.
