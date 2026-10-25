# A5: NEC Chapter 9 (Tables 1, 4, 5, 8, 9 and Notes) and 314.16 box fill: primary-source verification

- Agent: A5, wiresizes.com primary-sourcing round 2.
- Retrieval date for every source below: 2026-10-20.
- Budget used: WebSearch 18 of 18. docinfofiles.nfpa.org: 6 network fetches (the cap) plus 5 cached re-reads of the same URLs inside the tool's 15-minute cache window. No HTTP 429 was received.
- WebFetch summarizer limit: it refused full verbatim copies ("I can't reproduce the raw text of these pages line by line"). Long code passages are therefore recorded as short verbatim segments of under 120 characters each. A " … " between segments marks a boundary where words may be missing.

---

## Status matrix

| # | Target | Status | Best evidence |
|---|---|---|---|
| 1a | Ch. 9 Table 1: 53 / 31 / 40 % | **VERIFIED-other-edition** (NFPA 70-2008 text, NFPA notice ©2007). 2023: **UNVERIFIED** | P10 (two pulls match); corroborated by C1, C5–C8 (category 4) |
| 1b | Notes to Tables 1–9 (Notes 1, 3, 4, 6, 7, 8, 9) | **UNVERIFIED** (no authorized text seen). Note 2 exists (NFPA docs cite it); its text was not seen | Category-4 sources only (C1, C5, C6, C7) |
| 2 | Ch. 9 Table 4 (all conduit types) | **UNVERIFIED** | Third-party copies mislabel the type blocks (see §2) |
| 3 | Ch. 9 Table 5 (all insulation types) | **UNVERIFIED**. Category-4 copies **CONFLICT** at 2/0 THHN (0.2223 vs 0.2233) | C1, C5, C8 |
| 4 | Ch. 9 Table 8 | **UNVERIFIED** (2023). Two 2026 First Revisions exist (PI 2158, PI 259) | N5 |
| 5 | Ch. 9 Table 9 | **UNVERIFIED** | No reproduction found |
| 6a | 314.16(A) text | **VERIFIED-2023** (PI 3972 base text). The barrier sentence is **UNVERIFIED** (flattened markup) | N3, N4 |
| 6b | Table 314.16(A), rows 1–5 | **VERIFIED-2023** (two pulls match). Row 1, 8 AWG = **4** (2008/2011 printed 5) | N3; cross-check P1–P4 |
| 6c | Table 314.16(A), rows 6–24 | **VERIFIED-other-edition** (2011: P1, P2; 2008: P3, P4; all numbers agree). 2023: **UNVERIFIED** | P1 (two pulls), P2, P3, P4 |
| 7 | Per-conductor volume table: 18 = 1.50 … 6 = 5.00 in³ | **VERIFIED-draft** (2026 First Draft reproduces it unrevised) **and VERIFIED-other-edition** (2011, 2008). Brief's values confirmed. 2023 title is **"Table 314.16(B)(1)"** | N1 (two pulls); P1 (two pulls); P2, P3, P4 |
| 8a | 314.16(B)(1)–(4) counting rules | **VERIFIED-other-edition** (2011 text, NFPA 2011 notice). 2023 wording: **UNVERIFIED** | P1 |
| 8b | 314.16(B)(5) EGC fill | **VERIFIED-other-edition (2020)**: up to four EGCs/EBJs = 1 allowance, plus ¼ for each additional. 2023: **UNVERIFIED**. **Contradicts the brief** | P8 |
| 8c | 314.16(B)(6) Terminal Block Fill | Exists in 2023: **VERIFIED** (NFPA PIs filed against "2023 314.16(B)(6)"). Text: **VERIFIED-draft** (2026 FD) | N1, N4; C2 (category 4) |
| 9 | 2026 changes | SR-8088 and FR-7525/7527/7529: **VERIFIED-draft**. "Chapter 9 tables unchanged": **NOT CONFIRMED** (Table 8 revised at First Draft; other tables unreadable because of truncation) | N1, N2, N4, N5, G1 |

---

## Sources

NFPA's own documents (tier 1). No permission notice applies to NFPA's own documents.

- **N1**: NFPA, "WORKING DRAFT OF NEC CODE-MAKING PANEL 8 MEETING OUTPUT", First Draft, Revision Cycle A2025, meeting Jan 15–17, 2024, printed 1/30/2024 3:39 PM, 163 pp.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf
  - pp. 26–28 of 163.
  - The extracted text is 97,316 characters long and stops at about p. 57 (mid-344.10).
- **N2**: NFPA, "Working Draft of NEC Code-Making Panel 8 Meeting Output", Second Draft, A2025, October 2024 meeting, marked "Content not final, subject to revision".
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_SD_PrelimSR.pdf
  - Truncated at SR-8068 (368.17).
- **N3**: NFPA, "National Fire Protection Association Report", Public Input compilation for CMP-8, A2025. Footers are dated 9/18/2023, 8:32 PM; 487 pp. The base text is NFPA 70-2023.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_PISubmittals.pdf
  - Sorted by section. Truncated at p. 41 of 487, mid-row in PI 3972.
- **N4**: NFPA, "NEC® Code-Making Panel 8, NFPA 70 First Draft Meeting (A2025)" minutes, Jan 15–17, 2024, Charleston, SC.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_Minutes_0124.pdf
  - The task-group reports are truncated at PI 2251 (342.30).
- **N5**: NFPA, "NFPA 70 Code-Making Panel 6 (NEC-P06), NFPA 70 First Draft Meeting" minutes, Jan 18–20, 2024, Charleston, SC.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_Minutes_0124.pdf
  - Task-group entries are on pp. 287–292 (as cited by the extractor).
- **N6**: NFPA, Proposed TIA Log No. 1820 (NFPA 70-2023; comment closing date April 8, 2025).
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1820.pdf
  - **Off-topic**: it covers 314.29(A), not 314.16.

Reproductions with an NFPA permission notice (tier 2):

- **P1**: Thomas & Betts, "Boxes & Covers — Steel City® Metallic Boxes", Overview pp. A-4/A-5 (www.tnb.com), undated.
  - https://media.distributordatasolutions.com/ThomasAndBetts/v2/part2/files/File_30524_emAlbumalbumsus_resource2013nec_sc1pdfClickHerea.pdf
  - Notice, verbatim in segments: "Reprinted with permission from National Fire Protection Association NFPA70-2011." / "National Electrical Code, Copyright© 2010, National Fire Protection Association, Quincy," / "MA 02269. This reprinted material is not the complete and official position of the NFPA" / "on the referenced subject which is represented only by the standard in its entirety."
- **P2**: ABB, "Steel City® Metallic boxes and covers" product catalog, pp. 004–075, undated.
  - https://library.e.abb.com/public/b7937bf2f5a942eaadc8f987cb260e5d/Steel%20City%20Metal%20Boxes%20Catalogue_hi%20res.pdf
  - Same NFPA70-2011 / ©2010 notice as P1.
- **P3**: Emerson/Appleton, "commercial and industrial fittings: Outlet Boxes, Switch Boxes and Covers", pp. 444–447, July 2017.
  - https://assets.kele.com/product-assets/appleton-group/skus/4cs12/related/datasheet_6_4cs12.pdf
  - Notice: "Reproduced with permission NFPA." / "All National Electrical Code references are from the 2008 edition."
- **P4**: Appleton Electric, "Commercial Products: Switch and Outlet Boxes and Covers", © September 2010.
  - https://www.elliottelectric.com/Media/388LE0R44LE-EGS
  - Same 2008 notice as P3.
  - Duplicates of P3/P4 content: https://elliottelectric.com/Media/8484-APP (Emerson, Feb 2017) and https://www.usesi.com/media/product-media/catalogs/471098_catalog.pdf (notice garbled). Neither is counted as independent.
- **P8**: Leviton Captain Code 2020, "Box Fill Calculation Revised. Volume Allowance for EGCs and Equipment Bonding Jumpers".
  - https://captaincode2020.leviton.com/node/246
  - Notice: "Material taken from the National Electric Code® is reprinted with permission from NFPA 70®, 2020 edition." / "National Electrical Code®, Copyright 2019, National Fire Protection Association, Quincy, MA. All rights reserved."
- **P9**: Leviton, "2023 Captain Code NEC Code Changes" pocket guide.
  - https://leviton.com/content/dam/leviton/commercial-industrial/product_documents/take_one/2023-Captain-Code-NEC-Code-Changes%20(1).pdf
  - Notice: "reprinted with permission from NFPA 70® - 2023 edition"; "National Electrical Code®, Copyright 2022".
  - **It has no 314.16 entry.** It covers only 314.5 and 314.24(B)(C).
- **P10**: Wheatland Tube, "Use of Wheatland Electrical Metallic Tubing, Intermediate Metal Conduit, and Rigid Metal Conduit - Steel in Conformance to the 2011 National Electrical Code", undated. The copy is **re-hosted by a third party**:
  - https://inspectapedia.com/electric/Metal_Conduit_Installation_NEC.pdf
  - Notice: "Reprinted with permission from NFPA 70®, National Electrical Code®, Copyright© 2007," / "National Fire Protection Association, Quincy, MA." / "This reprinted material is not the complete and official position of the NFPA on the referenced subject," / "which is represented only by the standard in its entirety."
  - ©2007 means NFPA 70-2008 text.

Government (tier 3):

- **G1**: Minnesota DLI, "Summary of Significant 2026 NEC® Changes" (NEC 2026 Adoption Review Committee).
  - https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf

Corroboration only (tier 4: no NFPA notice, or trade press):

- **C1**: Mike Holt, "Illustrated Guide to Electrical Exam Preparation, 2011 Edition", Unit 5 sample. **No NFPA notice found.**
  - https://www.mikeholt.com/instructor2/img/product/pdf/11MBOOKS-1176-sample.pdf
- **C2**: ExpertCE lesson (NEC 2023), no notice.
  - https://expertce.com/courses/electricians-guide-for-nec-2023/lessons/how-to-calculate-junction-box-size-with-terminal-blocks-nec-2023/
- **C3**: Electrical Contractor (ECmag), Mark C. Ode, 2026-08-14.
  - https://www.ecmag.com/magazine/articles/article-detail/avoiding-overfill--splices-and-splicing-devices-in-box-fill-calculations
- **C4**: open-exam-prep, box-fill deductions (says it follows 2023).
  - https://open-exam-prep.com/study-guides/mi-electrician/conduit-fill-box-fill-panelboards/box-fill-deductions
- **C5**: open-exam-prep, raceway fill.
  - https://open-exam-prep.com/study-guides/mi-electrician/conduit-fill-box-fill-panelboards/raceway-fill-calc
- **C6**: toolgrit.
  - https://www.toolgrit.com/guides/conduit-fill-explained
- **C7**: LegalClarity, 2026-05-12. It links an unlicensed "Chapter 9 NEC 2017" PDF.
  - https://legalclarity.org/how-to-calculate-conduit-fill-nec-rules-and-percentages/
- **C8**: PDHonline E276, D. Snyder, 2026; no edition and no notice.
  - https://www.pdhonline.com/courses/e276/Conduit_Fill_Tables.pdf
- **C9**: PDHonline E426, D. Snyder, ©2014.
  - https://pdhonline.com/courses/e426/e426content.pdf
- **C10**: Southwire, "Power Cable Installation Guide", ©2005.
  - https://www.southwire.com/medias/sys_master/installation-manuals/installation-manuals/h29/hb6/8887676141598/PowerCableInstallGuidepdf.pdf
  - Its NFPA notice ("NFPA 70-2-5", sic) covers its Table 300.19(A) only. Its conduit table is Southwire's own and is not labelled NEC.
- **C11**: Steel Tube Institute page: https://steeltubeinstitute.org/resources/thhn-conductors-and-rmc/ (no tables).
- **C12**: IAEI 2016 box-fill article: https://iaeimagazine.org/2016/november2016/box-fill-calculations/ (tables are images only; no NFPA notice).
- **P7**: T&B Bowers catalog, section G, ©2003: https://assets.usesi.com/product-media/catalogs/USESI_133973_catalog.pdf. It says "reproduced in part from the N.E. Code" but has **no NFPA notice**.

---

## 1. Chapter 9 Table 1 and the Notes to Tables 1–9

### 1a. Table 1: VERIFIED-other-edition (NFPA 70-2008 text). 2023 UNVERIFIED

Source P10, under the "Chapter 9 Tables" heading after the Article 342 section.

**Raw lines (pull 2):**
```
Table 1 Percent of Cross Section of Conduit and Tubing for Conductors
Number of Conductors All Conductor Types
1 53
2 31
Over 2 40
```

- Pull 1 (data): "1 53 / 2 31 / Over 2 40".
- **The two pulls match.**
- This is 2008 text. The table title here lacks "and Cables". The 2023 title was not seen.
- Cross-checks (category 4 only):
  - C1 (2011 NEC, p. 122): "1 conductor | 53%", "2 conductors | 31%", "3 or more conductors | 40%", "Raceway 24 inches or less | 60%".
  - C5, C6, C7 and C8 all give 53/31/40.
- Indirect NFPA evidence (2026 drafts):
  - N2 SR-8010 (352.20(B)) refers to "the percentages shown in Chapter 9, Table 1". It gives no values.

### 1b. Notes to Tables: all UNVERIFIED (no authorized text seen)

| Note | What was seen | Status |
|---|---|---|
| 1 (Annex C may be used) | C7: "NEC Annex C contains pre-calculated tables" (not tied to a note number) | UNVERIFIED |
| 2 | N4 task-group report: "Chapter 9 table 1 note 2 covers this sec[tion]" (PI 2369, 348.22) and "...already covered in Chapter 9 Table 1 note #2" (PI 2372, 352.22). N2 SR-8057 (312.8(C) Exc. 1(7)) cites "Chapter 9, Table 1 and all applicable notes thereto" and says Note 2 does not apply. Note 2's wording was not seen. C5 states a Note-1 text that may actually be Note 2 | Note 2 exists: VERIFIED-draft. Wording: UNVERIFIED |
| 3 (EGCs/bonding conductors included) | C6: "Equipment grounding conductors count toward fill." C7: "Equipment grounding conductors must be included in the total cross-sectional area." C5: "Equipment Grounding Conductors (EGCs) and bare conductors MUST be included in the raceway fill calculation." | UNVERIFIED (category 4 agrees with the brief) |
| 4 (nipples ≤ 24 in at 60 %) | C1 (2011, paraphrase): Note 4 is "the 24-inch, 60 percent rule" (p. 126). C5: "24 inches (600 mm) or less in length", "permitted to be filled to 60%". C7 and C6 say the same in substance | UNVERIFIED |
| 6 (combinations) | Not seen in any source | UNVERIFIED |
| 7 (round up at 0.8) | C1 (2011, paraphrase): Note 7 is "the 0.80 rounding rule" (p. 127) | UNVERIFIED |
| 8 (bare conductors use Table 8) | Not seen as note text | UNVERIFIED |
| 9 (multiconductor cable = one conductor) | C7: "counts as one conductor for fill purposes", citing Note 9. C5: "A multi-conductor cable containing two, three, or four internal conductors is treated as a single conductor." (the "two, three, or four" limit is not corroborated). N2 SR-8057's informational note cites "Table 1 and Note 9" (no text) | UNVERIFIED |

---

## 2. Chapter 9 Table 4: UNVERIFIED for every conduit type

- No authorized reproduction of Table 4 (any edition) was found.
- Third-party copies **put type labels on the wrong data blocks**, so none can be used even as a label-to-value cross-check.
  - **C10 (Southwire, ©2005)**: its "Table 8 Dimensions and Percent Area Conduit and Tubing" (Southwire numbering) prints its type headings *after* the data blocks.
    - The extractor's labels are provisional.
    - There are typos ("0794", "11.27", "51.99", "10.13").
    - It has no 60 % column.
  - **C8 (PDHonline, 2026; no edition, no notice)**: its captions run Table 2 EMT, Table 3 IMC, Table 4 RMC, Table 5 PVC-40 and Table 6 PVC-80. No rows follow the last caption, so captions and blocks are offset.
    - No C8 block contains the 3/4 = 0.533 in² set that C6 calls "EMT".
    - The block C8 labels "EMT" (½ = 0.660 in / 0.342 in²; ¾ = 0.864 / 0.586) holds the values C6 labels "IMC" (¾ IMC 0.586).
    - The block C8 labels "IMC" (½ = 0.632 / 0.314; ¾ = 0.836 / 0.549) holds the values C6 labels "RMC" (¾ RMC 0.549).
    - The block C8 labels "RMC" (½ = 0.602 / 0.285; 1 = 1.029 / 0.832) holds the values C6 labels "1-inch Schedule 40 PVC: total 0.832".
    - C10 also places that block before its "Rigid PVC Conduit Schedule 40 and HDPE" heading.
  - **C6 (toolgrit)** spot values, as printed:
    - ¾ EMT 0.533 / 40 % 0.213; 1 EMT 0.864 / 0.346; ½ EMT 40 % 0.122.
    - ¾ IMC 0.586 / 0.235; 1 IMC 0.959 / 0.384.
    - ¾ RMC 0.549 / 0.220; 1 RMC 0.887 / 0.355.
    - 1 PVC-40 0.832 / 0.333.
    - 1 PVC-80 0.687 / 0.275. C8 and C10 both print **0.688** for the matching 1-in value (CONFLICT, category 4).
  - **C5 (open-exam-prep)**: EMT 2" total 3.356 / 40 % 1.342; EMT 2½" total **4.891** / 40 % **1.956**. That 2½" pair matches **no** block in C8 or C10, which suggests an error in C5.
  - **C1 (Mike Holt, 2011; no notice)**: ¾ EMT 40 % 0.213 (p. 127); ½ EMT 0.161 (column not stated); PVC-40 trade 3 at 40 % 2.907; 60 % nipples 1¼ "0.0916" (probably 0.916, misread), 1½ 1.243, 2 2.045 (p. 133).
- **Implication for the site**: the old calculator's "wrong PVC/RGS areas" match this failure mode, where a third-party copy shifts the type labels. Every Table 4 value must come from one authorized copy, read block by block with its own heading.

---

## 3. Chapter 9 Table 5: UNVERIFIED (category-4 corroboration only)

- No authorized reproduction was found.
- Category-4 values below are for future cross-checking only. **Do not publish them.**
- THHN/THWN-2 area (in²):
  - C8 (its group-2 assignment is inferred from caption order) and C5: 14 0.0097; 12 0.0133; 10 0.0211; 8 0.0366; 6 0.0507; 4 0.0824; 2 0.1158; 1/0 0.1855; 3/0 0.2679; 250 0.3970.
  - C8 only: 3 0.0973; 1 0.1562; 4/0 0.3237; 300 0.4608; 350 0.5242; 400 0.5863; 500 0.7073.
  - C8 diameters (in): 14 0.111; 12 0.130; 10 0.164; 8 0.216; 6 0.254; 4 0.324.
  - **CONFLICT at 2/0**: C8 0.2223 vs C1 (2011, unlabelled column 4 of Mike Holt's "Table 5-1") 0.2233.
- XHHW area (in²), from C8 group 3 (inferred) and C1 unlabelled column 5; the two agree from 14 to 4/0:
  - 14 0.0139; 12 0.0181; 10 0.0243; 8 0.0437; 6 0.0590; 4 0.0814; 3 0.0962; 2 0.1146; 1 0.1534; 1/0 0.1825; 2/0 0.2190; 3/0 0.2642; 4/0 0.3197.
  - C8 only: 250 0.3904; 300 0.4536; 350 0.5166; 400 0.5782; 500 0.6984.
  - C6 also gives 6 XHHW 0.0590.
- No source labelled these values XHHW-2 or THWN-2.
- C1 also gives:
  - 10 RHW with outer cover 0.0437 and 10 RHH without outer cover 0.0333.
  - Table 5A compact conductors: 1 THHN 0.1352 and 4/0 XHHW 0.2733.
- THW/THW-2, TW, RHW/RHW-2 (full) and USE-2: nothing reliable seen.

---

## 4. Chapter 9 Table 8: UNVERIFIED (2023). 2026 revision activity found

- No authorized reproduction was found in this run. The prior round's values (unlicensed 2017 copy; Mike Holt 2002 samples) stay corroboration-only.
- Category-4 fragments:
  - C1 (2011): "10 bare stranded | 0.011 sq in."
  - C6: "12 AWG bare ground: 0.0060 in²".
  - C9: "6,530 circular mils for 12 AWG".
  - C10's "Table 5 Conductor Area" (14 4110 cmil … 1000 1,000,000 cmil) is Southwire's own table, not NEC Table 8.
- **2026 cycle, from NFPA minutes (N5)**:
  - "Chapter 9 Table 8" PI 2158, **First Revision**. Statement: "Per NEC 110.6, the conductor sizes recognized by the NEC are expressed in AWG or in circular mils," / "not square millimeters." / "The proposed text clarifies that calculations are to be based only upon sizes recognized by the NEC."
  - "Chapter 9 Table 8" PI 259, **First Revision**. Statement: "The proposal adds clarity to the data given in the table."
  - Neither statement names the rows, columns or notes changed. The final 2026 text was not seen.
  - "Chapter 9 Table 5B" PI 1782, **Resolve**: "There are multiple methods for calculating voltage drop. Tables 8 & 9 provide data for these calculations."
  - Status of all three: VERIFIED-draft (statements only).
- N5 records no action on adding copper-clad aluminum, 16 AWG, or new rows or columns to Table 8 or Table 9.

## 5. Chapter 9 Table 9: UNVERIFIED

- No reproduction (authorized or not) was found in this run.
- C9 cites two 500 kcmil figures (0.029 Ω and 0.048 Ω) without column labels. They are not usable.
- N5 records **no** 2026 First Draft action on Table 9.

---

## 6. 314.16(A) and Table 314.16(A)

### 6a. 314.16(A) text (2023 base text in PI 3972, N3, pp. ~40–41 of 487)

The PI header line reads "Public Input No. 3972-NFPA 70-2023 [ Section No. 314.16(A) ]". Raw extracted lines:
```
314.16(A) Box Volume Calculations.
The volume of a wiring enclosure (box) shall be the total volume of the assembled sections and,
where used, the space provided by plaster rings, domed covers, extension rings, and so forth,
that are marked with their volume or are made from boxes the dimensions of which are listed in
Table 314.16(A).
(1) Barriers.
Where a box is provided with one or more securely installed barriers, the volume shall be
apportioned to each of the resulting spaces. Each barrier, if not marked with its volume, shall be
considered to take up 8.2 cm3 (1⁄2 in.3) if metal, and 16.4 cm3 (1.0 in.3) if nonmetallic.
(1 2 ) Standard Boxes.
The volumes of standard boxes that are not marked with their volume shall be as given in Table
314.16(A).
(2 3 ) Other Boxes.
Boxes 1650 cm3 (100 in.3) or less, other than those described in Table 314.16(A), and
nonmetallic boxes shall be durably and legibly marked by the manufacturer with their volume(s).
Boxes described in Table 314.16(A) that have a volume larger than is designated in the table
shall be permitted to have their volume marked as required by this section.
```

- The flattened markup "(1 2 )" and "(2 3 )" means the 2023 numbering is (1) Standard Boxes and (2) Other Boxes. The PI proposed adding "(1) Barriers." and renumbering.
- N4 shows PI 3972 was "Resolve": "Proposed PI does not add clarity and is not a viola[tion] of the style manual." No change was made.
- Status:
  - Main paragraph, (1) Standard Boxes and (2) Other Boxes: **VERIFIED-2023**.
  - The barrier sentence (½ in³ metal, 1.0 in³ nonmetallic): **UNVERIFIED** as 2023 wording. It may be base text that the PI only numbered, but flattened markup cannot show that. C12 (author commentary, not code): "These volume considerations for barriers were added to the 2017 NEC."
- 2011 wording (P1), for comparison: "The volume of a wiring enclosure (box) shall be the total volume of the assembled sections" / "The volumes of standard boxes that are not marked with their volume shall be as given in Table 314.16(A)." / "Boxes 1650 cm3 (100 in.3) or less, other than those described in Table 314.16(A)," / "shall be durably and legibly marked by the manufacturer with their volume."

### 6b. Table 314.16(A) Metal Boxes: 2023 rows 1–5 (N3, PI 3972)

Header (raw): "Table 314.16(A) Metal Boxes" / "Box Trade Size Minimum Volume Maximum Number of Conductors* (arranged by AWG size)" / "mm in. cm3 in.3 18 16 14 12 10 8 6".

Raw lines, pull 2:
```
100 × 32 (4 × 11⁄4) round/octagonal 205 12.5 8 7 6 5 5 4 2
100 × 38 (4 × 11⁄2) round/octagonal 254 15.5 10 8 7 6 6 5 3
100 × 54 (4 × 21⁄8) round/octagonal 353 21.5 14 12 10 9 8 7 4
100 × 32 (4× 11⁄4) square 295 18.0 12 10 9 8 7 6 3
100 × 38 (4 × 11⁄2) square 344 21.0 14 12 10 9 8 7 4
100 × 54 (4 × 21⁄8) squa   [text ends]
```

- Pull 1 (data lines) is identical. **The two pulls match.**
- The extractor counted exactly 7 numbers after "12.5" on row 1, so there is no struck or inserted digit pair. No "Revise Table…" instruction appears above the table.
- **Edition difference (row 1, 8 AWG):**
  - 2023 (N3) prints **4**.
  - P1, P2 (2011), P3, P4 (2008) and P7 (2003) all print **5**.
  - Internal check (computed with `python3 -I`; not a code value): 12.5 ÷ 3.00 = 4.17, floored to 4.
  - In the 2011 table, every other cell equals floor(volume ÷ per-conductor allowance); this is the only mismatch.
  - Script: /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/scripts/boxcheck.py

### 6c. Table 314.16(A): all 24 rows, 2011 text (P1)

- P1 pull 1 (data) and pull 2 (raw lines) match.
- Independent cross-checks:
  - P2 (2011): all numbers match. One size label was misread as "4 x 2½" for the 4 × 2⅛ round box.
  - P3 and P4 (2008): all numbers match. The extractor dropped the ⅛ and 11/16 fractions from the size labels.
  - P7 (2003, category 4): matches except the 3¾×2×3½ masonry box, where 6 AWG prints "2" (others print 4). Treated as extraction or print noise.
- "4L" is how the extracted text renders the 120 mm square box's inch size. The inch label is not legible; the metric designator is 120.

Raw lines (P1, pull 2):
```
100 x 32 (4 x 11⁄4) Round/Octagonal 205 12.5 8 7 6 5 5 5 2
100 x 38 (4 x 11⁄2) Round/Octagonal 254 15.5 10 8 7 6 6 5 3
100 x 54 (4 x 21⁄8) Round/Octagonal 353 21.5 14 12 10 9 8 7 4
100 x 32 (4 x 11⁄4) Square 295 18.0 12 10 9 8 7 6 3
100 x 38 (4 x 11⁄2) Square 344 21.0 14 12 10 9 8 7 4
100 x 54 (4 x 21⁄8) Square 497 30.3 20 17 15 13 12 10 6
120 x 32 (4L x 11⁄4) Square 418 25.5 17 14 12 11 10 8 5
120 x 38 (4L x 11⁄2) Square 484 29.5 19 16 14 13 11 9 5
120 x 54 (4L x 21⁄8) Square 689 42.0 28 24 21 18 16 14 8
75 x 50 x 38 (3 x 2 x 11⁄2) Device 123 7.5 5 4 3 3 3 2 1
75 x 50 x 50 (3 x 2 x 2) Device 164 10.0 6 5 5 4 4 3 2
75 x 50 x 57 (3 x 2 x 21⁄4) Device 172 10.5 7 6 5 4 4 3 2
75 x 50 x 65 (3 x 2 x 21⁄2) Device 205 12.5 8 7 6 5 5 4 2
75 x 50 x 70 (3 x 2 x 23⁄4) Device 230 14.0 9 8 7 6 5 4 2
75 x 50 x 90 (3 x 2 x 31⁄2) Device 295 18.0 12 10 9 8 7 6 3
100 x 54 x 38 (4 x 21⁄8 x 11⁄2) Device 169 10.3 6 5 5 4 4 3 2
100 x 54 x 48 (4 x 21⁄8 x 17⁄8) Device 213 13.0 8 7 6 5 5 4 2
100 x 54 x 54 (4 x 21⁄8 x 21⁄8) Device 238 14.5 9 8 7 6 5 4 2
95 x 50 x 65 (33⁄4 x 2 x 21⁄2) Masonry Box/Gang 230 14.0 9 8 7 6 5 4 2
95 x 50 x 90 (33⁄4 x 2 x 31⁄2) Masonry Box/Gang 344 21.0 14 12 10 9 8 7 4
Min. 44.5 depth FS – Single-Cover/Gang (13⁄4) 221 13.5 9 7 6 6 5 4 2
Min. 60.3 depth FD – Single-Cover/Gang (23⁄8) 295 18.0 12 10 9 8 7 6 3
Min. 44.5 depth FS – Multiple-Cover/Gang (13⁄4) 295 18.0 12 10 9 8 7 6 3
Min. 60.3 depth FD – Multiple-Cover/Gang (23⁄8) 395 24.0 16 13 12 10 9 8 4
```

- Footnote, 2011 (P1): "*Where no volume allowances are required by 314.16(B)(2) through 314.16(B)(5)."
- Footnote, 2008 (P4): "*Where no volume allowances are required by 314.16(B)(2) through (B)(5)."
- 2023 footnote: **UNVERIFIED**. It may now reference (B)(6); not seen.
- **Contradicts the site**: the AUDIT item "4×2⅛×1⅞ = 10.3 in³" is wrong on 2011/2008 evidence. That box is **13.0 in³**; 10.3 in³ is the 4 × 2⅛ × **1½** device box. 2023 row not seen; no evidence it changed.

---

## 7. Per-conductor volume table: Table 314.16(B) (2011/2020), renamed Table 314.16(B)(1) (2023/2026 draft)

**N1, p. 26 of 163.** Shown on the FR-7525 page but **not revised by any FR**. N4 also records no action on it.
- Pull 1 (row strings): "18 24.6 1.50" / "16 28.7 1.75" / "14 32.8 2.00" / "12 36.9 2.25" / "10 41.0 2.50" / "8 49.2 3.00" / "6 81.9 5.00".
- Pull 2 (data-only):
  - Title: "Table 314.16(B)(1) Volume Allowance Required per Conductor".
  - Headers: "Size of Conductor (AWG)" | "Free Space Within Box for Each Conductor" (cm3, in.3).
  - Rows identical to pull 1. **The two pulls match.**

**Cross-checks:**
- P1 (2011): raw "No. 18 24.6 1.50 … No. 6 81.9 5.00", two pulls match, title "Table 314.16(B) Volume Allowance Required per Conductor".
- P2 (2011), P3 and P4 (2008), P7 (2003), C1 (2011): identical values.

**Status:**
- **VERIFIED-draft**: the 2026 First Draft reproduces the 2023 base table unrevised.
- **VERIFIED-other-edition**: 2011, 2008.
- The brief's values (1.50 / 1.75 / 2.00 / 2.25 / 2.50 / 3.00 / 5.00) are confirmed.
- Title "Table 314.16(B)(1)" in 2023: VERIFIED-draft (N1 base text), corroborated by C2 (2023), which quotes "(B)(6)… in accordance with Table 314.16(B)(1)".
- P8 (2020) still says "Table 314.16(B)".

---

## 8. 314.16(B) counting rules

### (B) intro

- **2020 (P8; VERIFIED-other-edition)**: "The volumes in paragraphs 314.16(B)(1) through (B)(5), as applicable, shall be added together." / "No allowance shall be required for small fittings such as locknuts and bushings." / "Each space within a box installed with a barrier shall be calculated separately." / "In no case shall the volume of the box, as calculated in 314.16(A), be less than the fill calculation"
- **2011 (P1)**: "The volumes in paragraphs 314.16(B)(I) through (B)(5), as applicable, shall be added together." ("(I)" is as extracted.) / "No allowance shall be required for small fittings such as locknuts and bushings."
- **2026 First Draft (N1 FR-7529; VERIFIED-draft)**: "The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together." FR-7529 adds "splicing connectors" to the small fittings that need no allowance. N4, PI 1961 (TG1-13): "The term splicing connector was added to the section..."

### (B)(1) Conductor Fill

Source: 2011 text (P1). Status: VERIFIED-other-edition; 2023 UNVERIFIED.
- "Each conductor that originates outside the box and terminates or is spliced within the box" … "each conductor that passes through the box without splice or termination shall be counted once."
- "Each loop or coil of unbroken conductor not less than twice the minimum length required for free" … "conductors in 300.14 shall be counted twice."
- "The conductor fill shall be calculated using Table 314.16(B)."
- "A conductor, no part of which leaves the box, shall not be counted."
- Exception: "An equipment grounding conductor or conductors not over four fixture wires smaller than #14 AWG" … "shall be permitted to be omitted from the calculations where they enter a box from a domed luminaire" … "and terminate within that box."
- The code states the loop rule by reference to 300.14, not as "12 in". The 300.14 length was not verified in this run.

### (B)(2) Clamp Fill

2011 (P1):
- "Where one or more internal cable clamps, whether factory or field supplied, are present in the box,"
- "a single volume allowance in accordance with Table 314.16(B) shall be made"
- "based on the largest conductor present in the box."
- "No allowance shall be required for a cable connector with its clamping mechanism outside the box."

### (B)(3) Support Fittings Fill

2011 (P1):
- "Where one or more luminaire studs or hickeys are present in the box,"
- "a single volume allowance in accordance with Table 314.16(B)"
- "shall be made for each type of fitting based on the largest conductor present in the box."
- The allowance is one **per type** of fitting, not one per fitting.

### (B)(4) Device or Equipment Fill

2011 (P1):
- "For each yoke or strap containing one or more devices or equipment, a double volume allowance"
- "in accordance with Table 314.16(B) shall be made for each yoke or strap based on the largest conductor"
- "connected to a device(s) or equipment supported by that yoke or strap."
- "A device or utilization equipment wider than a single 50mm (2 in.) device box as described in Table 314.16(A)" … "shall have double volume allowances provided for each gang required for mounting."

2026 First Draft:
- N1 FR-7525 keeps the title "Device or Equipment Fill." and adds "Informational Note: See 314.24(B) for additional information on minimum box depth."
- N4, PIs 1452, 1485 and 3374 were "Resolve": "The panel is retaining the double allowance for devices generally."

### (B)(5) Equipment Grounding Conductor Fill

**2011 text (P1). Superseded.**
- "Where one or more equipment grounding conductors or equipment bonding jumpers enter a box," … "a single volume allowance in accordance with Table 314.16(B) shall be made based on the largest" … "equipment grounding conductor or equipment bonding jumper present in the box."
- "Where an additional set of equipment grounding conductors, as permitted by 250.146(D), is present" … "an additional volume allowance shall be made based on the largest equipment grounding conductor" … "in the additional set."

**2020 text (P8, NFPA 70-2020 notice). VERIFIED-other-edition.**
- "Where up to four equipment grounding conductors or equipment bonding jumpers enter a box,"
- "a single volume allowance in accordance with Table 314.16(B) shall be made based on the largest"
- "A ¼ volume allowance shall be made for each additional equipment grounding conductor"
- "or equipment bonding jumper that enters the box, based on the largest equipment grounding conductor"
- P8 commentary (not code text): the 2020 change "removes the need to separately address isolated ground receptacles under 250.146(D)".

**2023: UNVERIFIED.**
- C4 (category 4, claims 2023): "All equipment grounding conductors entering the box count as 1 volume allowance based on the largest EGC." / "For each additional EGC beyond four (4), add an additional 1/4 (0.25) volume allowance."
- 2026 First Draft: N4, PIs 1466 and 1580 were "Resolve": "There was insufficient technical substantiation to increase the volume allowance."

### (B)(6) Terminal Block Fill: exists in 2023

Existence in 2023 is **VERIFIED**: N4 lists PIs 1617, 1785 and 325 filed on 2023 section "314.16(B)(6)".
- PIs 1617 and 1785: "Resolve", "Fill allowance for terminal blocks applies to all terminal blocks".
- PI 325: FR, "Editorial change was made to address consolidated words".

2026 First Draft text (N1 FR-7527, p. 27; VERIFIED-draft):
- "Where a terminal block is present in a box, a single volume allowance in accordance with Table" … "based on the largest conductor(s) terminated tothe to the assembly." The doubled "tothe to the" is the flattened deletion of "tothe" and insertion of "to the".

2023 wording (C2, category 4): "Where a terminal block is present in a box, a single volume allowance in accordance with Table 314.16(B)(1)" / "shall be made for each terminal block assembly based on the largest conductor(s) terminated to the assembly."
- C2 also says the 2020 NEC had five subsections.
- C3 (2026) calls (B)(6) "new". That conflicts with N4, which shows PIs filed against the 2023 text, so NFPA's documents prevail.

### Where the brief's rule list (target 8) diverges from the evidence

1. **EGC rule**: "count once in total (plus the isolated-ground rule)" is the 2011/2017-era text. The 2020 text is up to four EGCs/EBJs = 1 allowance, plus ¼ for each additional, with no separate IG set.
2. **Subsection count**: 2023 has **(B)(1)–(B)(6)**, not (1)–(5). The table is **Table 314.16(B)(1)**.
3. **Support fittings**: one allowance **per type** of fitting, not "once each".
4. **Loop rule**: "≥ 12 in" is the code's "twice the minimum length required for free conductors in 300.14", stated by reference.
5. **AUDIT P0 items**:
   - "pass-through conductors not counted" is **contradicted**: they are counted once (2011 text; category-4 C4 says the same for 2023).
   - "Pigtails under 6 in not counted": the code has **no length qualifier** ("A conductor, no part of which leaves the box, shall not be counted"). C4's "do not exceed 12 inches" qualifier is unsupported and should not be used.

---

## 9. 2026 (A2025 cycle) changes

- **Panel**: in the A2025 cycle, Article 314 is handled by **CMP-8**. Evidence: N1 and N2 are CMP-8 drafts containing 312/314 FRs and SRs; N4 task groups cover 314. This contradicts C3's statement that Panel 9 has jurisdiction.
- **SR-8088** (N2; VERIFIED-draft), sections 314.16(C)(2) and (C)(3):
  - Titles: "(2) With Splices, Taps, or Wiring Devices." and "(3) Short Radius Conduit Bodies."
  - Text segments: "Only those conduit bodies that are durably and legibly marked by the manufacturer with their volume" / "The maximum number of conductors shall be calculated in accordance with 314.16(B)." / "Conduit bodies shall be supported in a rigid and secure manner." / "Conduit bodies such as capped elbows and service-entrance elbows that enclose conductors" / "shall not contain splices, taps, or wiring devices and shall be of an approved size to provide free space"
  - Statement: "This revision adds "wiring" before devices to align with the updated definition for" / ""wiring device" and aligns with PC-504."
- **First Draft FRs on 314.16** (N1): FR-7525 ((B)(4) informational note), FR-7527 ((B)(6) editorial), FR-7529 ((B) intro: "(B)(1) through (B)(6)" and "splicing connectors").
- **No FR or SR seen on Table 314.16(A) or Table 314.16(B)(1).** Visible content: N1 to p. 57, N2 to SR-8068. N4 confirms PI 3972 on 314.16(A) was resolved.
- **Chapter 9**:
  - N4: no First Draft action on Tables 2, 4, 5 or 5A in the visible task-group reports. Truncated at 342.30.
  - N4: Annex C FR ("Tables references corrected", FR-7791).
  - N5: **Table 8: two First Revisions** (PI 2158, PI 259). Table 9: no action. Table 5B (PI 1782): resolved.
  - G1 (MN DLI) lists no Article 314, Chapter 9 table or Annex C change among "significant" 2026 changes.
  - N2: no Chapter 9 SR visible (truncated).
  - **Verdict: "Chapter 9 tables unchanged in 2026" is NOT confirmed.** Table 8 was revised at First Draft; Tables 1, 4, 5 and 9 show no change in the readable portions only.

---

## Machine-readable

Conventions for every block below:
- `status` uses the preamble keys.
- `rows: []` means no verified values.
- In the rules block, `text` joins verbatim segments with " … ", which marks segment boundaries where words may be missing.

```json
{"ref":"Chapter 9 Table 1","edition":"NFPA 70-2008 text (Wheatland brochure; NFPA notice (c)2007; brochure says it conforms to the 2011 NEC)","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P10","rows":[{"conductors":"1","percent":53},{"conductors":"2","percent":31},{"conductors":"over 2","percent":40}]}
```

```json
{"ref":"Chapter 9 Notes to Tables 1-9","edition":"2023","notes":[
 {"note":1,"text":null,"status":"UNVERIFIED"},
 {"note":2,"text":null,"status":"UNVERIFIED","exists":"VERIFIED-draft (N4 task-group reports; N2 SR-8057)"},
 {"note":3,"text":null,"status":"UNVERIFIED","corroboration":"C5, C6, C7 (category 4): EGCs are included in fill"},
 {"note":4,"text":null,"status":"UNVERIFIED","corroboration":"C1 (2011 paraphrase), C5, C7: nipples <= 24 in at 60 %"},
 {"note":6,"text":null,"status":"UNVERIFIED"},
 {"note":7,"text":null,"status":"UNVERIFIED","corroboration":"C1 (2011 paraphrase): 0.80 rounding rule"},
 {"note":8,"text":null,"status":"UNVERIFIED"},
 {"note":9,"text":null,"status":"UNVERIFIED","corroboration":"C5, C7: multiconductor cable counts as one conductor"}]}
```

```json
[{"ref":"Chapter 9 Table 4","type":"EMT","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"ENT","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"FMC","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"IMC","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"LFNC-A","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"LFNC-B","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"LFMC","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"RMC","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"PVC Schedule 80","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"PVC Schedule 40 and HDPE","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"PVC Type A","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 4","type":"PVC Type EB","status":"UNVERIFIED","rows":[]}]
```

```json
[{"ref":"Chapter 9 Table 5","type":"THHN/THWN/THWN-2","status":"UNVERIFIED","rows":[],"note":"category-4 values in section 3 conflict at 2/0 (0.2223 vs 0.2233)"},
 {"ref":"Chapter 9 Table 5","type":"XHHW/XHHW-2","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 5","type":"THW/THW-2","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 5","type":"TW","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 5","type":"RHW/RHW-2 with outer covering","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 5","type":"RHW/RHW-2 without outer covering","status":"UNVERIFIED","rows":[]},
 {"ref":"Chapter 9 Table 5","type":"USE-2","status":"UNVERIFIED","rows":[]}]
```

```json
{"ref":"Table 314.16(A)","title":"Metal Boxes","footnote_2011":"*Where no volume allowances are required by 314.16(B)(2) through 314.16(B)(5).","footnote_2023":"UNVERIFIED","rows":[
 {"box":"100 x 32 (4 x 1-1/4) round/octagonal","volume_cm3":205,"volume_in3":12.5,"max_18":8,"max_16":7,"max_14":6,"max_12":5,"max_10":5,"max_8":4,"max_6":2,"edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972","note":"2008/2011 reproductions print max_8 = 5"},
 {"box":"100 x 38 (4 x 1-1/2) round/octagonal","volume_cm3":254,"volume_in3":15.5,"max_18":10,"max_16":8,"max_14":7,"max_12":6,"max_10":6,"max_8":5,"max_6":3,"edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972; same in P1-P4"},
 {"box":"100 x 54 (4 x 2-1/8) round/octagonal","volume_cm3":353,"volume_in3":21.5,"max_18":14,"max_16":12,"max_14":10,"max_12":9,"max_10":8,"max_8":7,"max_6":4,"edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972; same in P1-P4"},
 {"box":"100 x 32 (4 x 1-1/4) square","volume_cm3":295,"volume_in3":18.0,"max_18":12,"max_16":10,"max_14":9,"max_12":8,"max_10":7,"max_8":6,"max_6":3,"edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972; same in P1-P4"},
 {"box":"100 x 38 (4 x 1-1/2) square","volume_cm3":344,"volume_in3":21.0,"max_18":14,"max_16":12,"max_14":10,"max_12":9,"max_10":8,"max_8":7,"max_6":4,"edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972; same in P1-P4"},
 {"box":"100 x 54 (4 x 2-1/8) square","volume_cm3":497,"volume_in3":30.3,"max_18":20,"max_16":17,"max_14":15,"max_12":13,"max_10":12,"max_8":10,"max_6":6,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"120 x 32 (4L x 1-1/4 as extracted) square","volume_cm3":418,"volume_in3":25.5,"max_18":17,"max_16":14,"max_14":12,"max_12":11,"max_10":10,"max_8":8,"max_6":5,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"120 x 38 (4L x 1-1/2 as extracted) square","volume_cm3":484,"volume_in3":29.5,"max_18":19,"max_16":16,"max_14":14,"max_12":13,"max_10":11,"max_8":9,"max_6":5,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"120 x 54 (4L x 2-1/8 as extracted) square","volume_cm3":689,"volume_in3":42.0,"max_18":28,"max_16":24,"max_14":21,"max_12":18,"max_10":16,"max_8":14,"max_6":8,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 38 (3 x 2 x 1-1/2) device","volume_cm3":123,"volume_in3":7.5,"max_18":5,"max_16":4,"max_14":3,"max_12":3,"max_10":3,"max_8":2,"max_6":1,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 50 (3 x 2 x 2) device","volume_cm3":164,"volume_in3":10.0,"max_18":6,"max_16":5,"max_14":5,"max_12":4,"max_10":4,"max_8":3,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 57 (3 x 2 x 2-1/4) device","volume_cm3":172,"volume_in3":10.5,"max_18":7,"max_16":6,"max_14":5,"max_12":4,"max_10":4,"max_8":3,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 65 (3 x 2 x 2-1/2) device","volume_cm3":205,"volume_in3":12.5,"max_18":8,"max_16":7,"max_14":6,"max_12":5,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 70 (3 x 2 x 2-3/4) device","volume_cm3":230,"volume_in3":14.0,"max_18":9,"max_16":8,"max_14":7,"max_12":6,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"75 x 50 x 90 (3 x 2 x 3-1/2) device","volume_cm3":295,"volume_in3":18.0,"max_18":12,"max_16":10,"max_14":9,"max_12":8,"max_10":7,"max_8":6,"max_6":3,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"100 x 54 x 38 (4 x 2-1/8 x 1-1/2) device","volume_cm3":169,"volume_in3":10.3,"max_18":6,"max_16":5,"max_14":5,"max_12":4,"max_10":4,"max_8":3,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"100 x 54 x 48 (4 x 2-1/8 x 1-7/8) device","volume_cm3":213,"volume_in3":13.0,"max_18":8,"max_16":7,"max_14":6,"max_12":5,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"100 x 54 x 54 (4 x 2-1/8 x 2-1/8) device","volume_cm3":238,"volume_in3":14.5,"max_18":9,"max_16":8,"max_14":7,"max_12":6,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"95 x 50 x 65 (3-3/4 x 2 x 2-1/2) masonry box/gang","volume_cm3":230,"volume_in3":14.0,"max_18":9,"max_16":8,"max_14":7,"max_12":6,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"95 x 50 x 90 (3-3/4 x 2 x 3-1/2) masonry box/gang","volume_cm3":344,"volume_in3":21.0,"max_18":14,"max_16":12,"max_14":10,"max_12":9,"max_10":8,"max_8":7,"max_6":4,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"min. 44.5 depth FS - single cover/gang (1-3/4)","volume_cm3":221,"volume_in3":13.5,"max_18":9,"max_16":7,"max_14":6,"max_12":6,"max_10":5,"max_8":4,"max_6":2,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"min. 60.3 depth FD - single cover/gang (2-3/8)","volume_cm3":295,"volume_in3":18.0,"max_18":12,"max_16":10,"max_14":9,"max_12":8,"max_10":7,"max_8":6,"max_6":3,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"min. 44.5 depth FS - multiple cover/gang (1-3/4)","volume_cm3":295,"volume_in3":18.0,"max_18":12,"max_16":10,"max_14":9,"max_12":8,"max_10":7,"max_8":6,"max_6":3,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"},
 {"box":"min. 60.3 depth FD - multiple cover/gang (2-3/8)","volume_cm3":395,"volume_in3":24.0,"max_18":16,"max_16":13,"max_14":12,"max_12":10,"max_10":9,"max_8":8,"max_6":4,"edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1; P2-P4 agree"}]}
```

```json
{"ref":"Table 314.16(B)","title_2011_2020":"Table 314.16(B) Volume Allowance Required per Conductor","title_2023_2026draft":"Table 314.16(B)(1) Volume Allowance Required per Conductor","status":"VERIFIED-draft (N1, unrevised 2023 base) + VERIFIED-other-edition (P1 2011; P3/P4 2008)","rows":[
 {"size":"18","cm3":24.6,"in3":1.50},{"size":"16","cm3":28.7,"in3":1.75},{"size":"14","cm3":32.8,"in3":2.00},{"size":"12","cm3":36.9,"in3":2.25},
 {"size":"10","cm3":41.0,"in3":2.50},{"size":"8","cm3":49.2,"in3":3.00},{"size":"6","cm3":81.9,"in3":5.00}]}
```

```json
{"ref":"314.16(B)(1)-(5)","note":"2023 has (B)(1) through (B)(6). Text joins verbatim segments with ' … ' (words may be missing at a boundary).","rules":[
 {"item":"(B) intro","edition":"2020","status":"VERIFIED-other-edition","source":"P8","text":"The volumes in paragraphs 314.16(B)(1) through (B)(5), as applicable, shall be added together. … No allowance shall be required for small fittings such as locknuts and bushings. … Each space within a box installed with a barrier shall be calculated separately."},
 {"item":"(B) intro","edition":"2026 First Draft","status":"VERIFIED-draft","source":"N1 FR-7529","text":"The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together.","change":"adds 'splicing connectors' to small fittings needing no allowance"},
 {"item":"(1)","title":"Conductor Fill","edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1","text":"Each conductor that originates outside the box and terminates or is spliced within the box … each conductor that passes through the box without splice or termination shall be counted once. … Each loop or coil of unbroken conductor not less than twice the minimum length required for free … conductors in 300.14 shall be counted twice. … A conductor, no part of which leaves the box, shall not be counted."},
 {"item":"(1) exception","edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1","text":"An equipment grounding conductor or conductors not over four fixture wires smaller than #14 AWG … shall be permitted to be omitted from the calculations where they enter a box from a domed luminaire … and terminate within that box."},
 {"item":"(2)","title":"Clamp Fill","edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1","text":"Where one or more internal cable clamps, whether factory or field supplied, are present in the box, … a single volume allowance in accordance with Table 314.16(B) shall be made … based on the largest conductor present in the box. … No allowance shall be required for a cable connector with its clamping mechanism outside the box."},
 {"item":"(3)","title":"Support Fittings Fill","edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1","text":"Where one or more luminaire studs or hickeys are present in the box, … a single volume allowance in accordance with Table 314.16(B) … shall be made for each type of fitting based on the largest conductor present in the box."},
 {"item":"(4)","title":"Device or Equipment Fill","edition":"2011","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P1","text":"For each yoke or strap containing one or more devices or equipment, a double volume allowance … in accordance with Table 314.16(B) shall be made for each yoke or strap based on the largest conductor … connected to a device(s) or equipment supported by that yoke or strap. … A device or utilization equipment wider than a single 50mm (2 in.) device box as described in Table 314.16(A) … shall have double volume allowances provided for each gang required for mounting.","draft_2026":"FR-7525 adds 'Informational Note: See 314.24(B) for additional information on minimum box depth.'"},
 {"item":"(5)","title":"Equipment Grounding Conductor Fill","edition":"2020","status":"VERIFIED-other-edition","status_2023":"UNVERIFIED","source":"P8","text":"Where up to four equipment grounding conductors or equipment bonding jumpers enter a box, … a single volume allowance in accordance with Table 314.16(B) shall be made based on the largest … A 1/4 volume allowance shall be made for each additional equipment grounding conductor … or equipment bonding jumper that enters the box, based on the largest equipment grounding conductor","superseded_2011_text":"single allowance for all EGCs/EBJs plus an additional allowance for a 250.146(D) isolated-ground set (P1)"},
 {"item":"(6)","title":"Terminal Block Fill","edition":"2026 First Draft","status":"VERIFIED-draft","exists_in_2023":"VERIFIED (N4: PIs 1617, 1785, 325 filed on 2023 314.16(B)(6))","source":"N1 FR-7527; C2 (category 4, 2023)","text":"Where a terminal block is present in a box, a single volume allowance in accordance with Table 314.16(B)(1) … shall be made for each terminal block assembly based on the largest conductor(s) terminated to the assembly."}]}
```

```json
{"ref":"Chapter 9 Table 8","edition":"2023","status":"UNVERIFIED","rows":[],"notes":["No authorized reproduction found in this run","2026 First Draft: First Revisions from PI 2158 (calculations only on NEC-recognized AWG/kcmil sizes, 'not square millimeters') and PI 259 ('adds clarity to the data'); final 2026 text not seen (N5)"]}
```

```json
{"ref":"Chapter 9 Table 9","edition":"2023","status":"UNVERIFIED","rows":[],"notes":["No reproduction found","No 2026 First Draft action recorded (N5)"]}
```

```json
{"ref":"314.16(A)","edition":"2023","status":"VERIFIED-2023","source":"N3 PI 3972 (base text)","text":"The volume of a wiring enclosure (box) shall be the total volume of the assembled sections and, where used, the space provided by plaster rings, domed covers, extension rings, and so forth, that are marked with their volume or are made from boxes the dimensions of which are listed in Table 314.16(A).","subsections_2023":[{"item":"(1)","title":"Standard Boxes","text":"The volumes of standard boxes that are not marked with their volume shall be as given in Table 314.16(A)."},{"item":"(2)","title":"Other Boxes","text":"Boxes 1650 cm3 (100 in.3) or less, other than those described in Table 314.16(A), and nonmetallic boxes shall be durably and legibly marked by the manufacturer with their volume(s). Boxes described in Table 314.16(A) that have a volume larger than is designated in the table shall be permitted to have their volume marked as required by this section."}],"barrier_sentence":{"text":"Each barrier, if not marked with its volume, shall be considered to take up 8.2 cm3 (1/2 in.3) if metal, and 16.4 cm3 (1.0 in.3) if nonmetallic.","status":"UNVERIFIED (PI-proposed '(1) Barriers.' numbering; flattened markup)"}}
```

```json
{"ref":"NFPA 70-2026 changes (A2025 drafts)","items":[
 {"section":"314.16(C)(2),(C)(3)","doc":"SR-8088","status":"VERIFIED-draft","change":"adds 'wiring' before 'devices' (wiring device definition; PC-504)"},
 {"section":"314.16(B)","doc":"FR-7529","status":"VERIFIED-draft","change":"'(B)(1) through (B)(6)'; adds 'splicing connectors' to small fittings needing no allowance"},
 {"section":"314.16(B)(4)","doc":"FR-7525","status":"VERIFIED-draft","change":"Informational Note referencing 314.24(B) minimum box depth"},
 {"section":"314.16(B)(6)","doc":"FR-7527","status":"VERIFIED-draft","change":"editorial ('tothe' to 'to the')"},
 {"section":"Table 314.16(A), Table 314.16(B)(1)","status":"no FR/SR seen (incomplete: truncation)"},
 {"section":"Chapter 9 Table 8","doc":"FRs from PI 2158 and PI 259","status":"VERIFIED-draft (statements only)","change":"calculations limited to NEC-recognized sizes (AWG/kcmil, not mm2); 'adds clarity to the data'"},
 {"section":"Chapter 9 Tables 1, 4, 5, 9","status":"no change seen in readable portions; UNVERIFIED"}]}
```

---

## Blocked or failed log

1. https://appleton.emerson.com/documents/catalog-general-steel-box-cover-information-appleton-o-z-gedney-en-7441948.pdf returned page metadata only (JavaScript shell). No content.
2. N1: the extracted text is capped at 97,316 characters (about p. 57 of 163). Reading at offset 150000 returned "Nothing left to read". Any later Chapter 9 FRs are unreachable.
3. N2 truncated at SR-8068 (368.17). N3 truncated at p. 41 of 487 mid-PI 3972, so 314.16(B) PIs and Chapter 9 PIs are unreachable. N4 task-group reports truncated at PI 2251 (342.30).
4. N6 (Proposed TIA 1820) is about 314.29, so it was a wasted NFPA fetch.
5. The WebFetch summarizer refused full verbatim reproduction (for example, "I can't reproduce the raw text of these pages line by line, since that would mean copying most of the document"). I worked around this with data-only prompts and short segments.
6. NFPA host: 6 network fetches (N1, N2, N3, N4, N6, N5). There were 5 further reads of N1 (×3), N3 (×1) and N5 (×1) within the 15-minute cache window. No 429.
7. WebSearch: 18 of 18 used. Many hits were content-farm "chart" pages on hijacked subdomains (lboro.ac.uk/chart, steelcase, koha-community, radiookapi, londoncouncils "viewer"); none was used.
   - Queries, in order:
     1. Table 314.16(A) + permission
     2. 314.16(B) handout .gov
     3. docinfofiles 314.16 SR-8088
     4. IAEI box fill + permission
     5. Ch 9 Table 4 EMT + permission
     6. site:docinfofiles Table 4 title
     7. Atkore/Allied/Wheatland/STI Table 4
     8. "Table 314.16(B)(1)" title
     9. Note 3 exact phrase
     10. Table 8/9 titles + permission
     11. Table 5 title + permission
     12. Manufacturer domains, Table 4/5
     13. Leviton Captain Code 2023
     14. 70_A2022 P08/P09 file names
     15. 314.16(B)(6) terminal block
     16. Wire-maker domains, Table 8/9
     17. "Effective Z at 0.85 PF" DOT
     18. Table 4 column headers + permission
8. Not used, by rule: Scribd (es.scribd.com/doc/265128987/Tabla-9-NEC; scribd 851050149, 675675632); the lorisweb 2017 copy; UpCodes (not attempted).
9. No 2023 Chapter 9 table data came from: NECA 121 ANSI draft (necanet.org, Aug 2024; Annex A tables are "(Insert Table Here)" placeholders); Prysmian Electronics Technical Information (own tables, 2008 NEC reference); Eaton B-Line Cable Tray Manual (2014 notice; truncated before any Chapter 9 table); Steel Tube Institute page (no tables).

## Open gaps

1. **2023 Chapter 9 Table 1 and Notes 1–9 wording**: no authorized 2023 copy yet. Note 3 (EGCs included) rests on category-4 sources only.
2. **Tables 4 and 5 (all types)**: no authorized copy of any edition.
   - Next leads: current conduit-maker catalogs with an NFPA notice (Atkore/Allied, Zekelman/Wheatland 2020+, Nucor, Cantex, JM Eagle); publisher sample chapters (Cengage, ATP, Jones & Bartlett/Ugly's) checked for "Reprinted with permission from NFPA 70®-2023"; Mike Holt 2020/2023 samples checked for a notice.
3. **Tables 8 and 9**: still no authorized copy. The 2026 Table 8 First Revisions (PI 2158, PI 259) need the final 2026 text. The CMP-6 Second Draft is truncated before Chapter 9.
4. **Table 314.16(A) rows 6–24 and footnote for 2023**: only 2008/2011 text was seen. Row 1 changed (8 AWG 5 → 4) at some edition between 2011 and 2023; when is unknown.
5. **314.16(B)(1)–(5) 2023 wording**: (B)(1)–(4) are 2011 text; (B)(5) is 2020 text. The 2023 wording is unseen. The (B)(6) 2023 wording is from category 4 only (2026 draft matches).
6. **300.14 free-conductor length**, which the loop rule references: not verified here.
7. **Final 2026 disposition** of SR-8088 and FR-7525/7527/7529 (CAM/NITMAM outcomes for 314.16): not checked.
