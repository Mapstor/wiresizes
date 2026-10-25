# R4-3: 314.16 box fill and NEC Chapter 9 Tables 1, 4, 5, 8, 9 (round 4)

- Agent: R4-3, wiresizes.com primary sourcing, round 4. It builds on A5 (round 2) and R3-3 (round 3):
  - /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/A5-ch9-boxfill.md
  - /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/R3-3-ch9-boxfill.md
- Retrieval date for every source below: 2026-10-20.
- Budget used:
  - WebSearch: **24 of 24** (queries listed in the blocked/failed log).
  - docinfofiles.nfpa.org: **6 network fetches** (the cap). One returned "error while fetching" on a guessed file name; the next fetch to the host succeeded, so it was a missing file, not a 429. There were also **8 re-reads** of three URLs inside the tool's 15-minute cache window, used for the raw-token and canary pulls. **No HTTP 429.**
  - Other hosts: 17 fetches; 1 failed (see the log).
- Status keys follow PREAMBLE, PREAMBLE-R3 and PREAMBLE-R4. Two notes on how they are applied here:
  - "**VERIFIED-2023 (A2025 FD base)**" means unrevised base text in a 2026-cycle First Draft. That draft's base text is NFPA 70-2023 (PREAMBLE rule 3). Round 2 used the same reasoning for PI base text.
  - "**verified-sd2023**" follows PREAMBLE-R4's three conditions. Condition 3 (2022 Technical Meeting and Standards Council) is **not checked** for every item: no A2022 motion list could be found.
- Quotes are short verbatim segments (under 120 characters). " … " marks a boundary where words may be missing.

---

## Status matrix

| # | Target | Status after R4-3 | Source | Notes |
|---|---|---|---|---|
| 1a | Table 314.16(B)(1), all 7 rows (18 AWG 1.50 … 6 AWG 5.00 in³) | **VERIFIED-2023 (A2025 FD base)**. Upgraded from VERIFIED-draft | N1 FR-7525 page; canary pull | 3 planted values rejected. The 2005 reprint (P13) matches |
| 1b | Table 314.16(A), rows 1–5 | **VERIFIED-2023** (carried A5, PI 3972) | A5 N3 | 2005 reprint P13 matches, including row 1, 8 AWG = **4** |
| 1c | Table 314.16(A), rows 6–24 and footnote | 2023: **UNVERIFIED**. New **VERIFIED-other-edition (2005)** from a third independent publisher; all 24 rows identical to the file | P13 (Crouse-Hinds, NFPA 70-2005 notice) | No 2023 Second Revision on the table (N11). 2023 First Draft changes: not seen |
| 1d | 314.16(B) intro | **VERIFIED-2023 (A2025 FD base)** | N1 FR-7529 | "(B)(1) through (B)(6)"; "paragraphs" is gone; "splicing connectors" is a 2026 insertion |
| 1e | 314.16(B)(1) Conductor, (B)(2) Clamp, (B)(3) Support Fittings | **UNVERIFIED** for 2023 (2011 wording only, carried A5) | none new | No 2023 Second Revision on them (N11) |
| 1f | 314.16(B)(4) Device or Equipment Fill | **VERIFIED-2023 (A2025 FD base)** | N1 FR-7525 | Body unrevised; the 2026 FR adds only an informational note |
| 1g | 314.16(B)(5) EGC Fill | **verified-sd2023** (conditions 1–2 met; condition 3 not checked) | N11 SR-7528 | **Contradicts the file**: "or equipment bonding jumpers" is gone, and the rule says "entering the box" |
| 1h | 314.16(B)(6) Terminal Block Fill | **VERIFIED-2023 (A2025 FD base)**: "…terminated tothe assembly" [sic] | N1 FR-7527; N11 SR-7529 | The Second Draft said "terminated to it". The wording changed **after** the Second Draft |
| 1i | 314.27(E): a weight-supporting ceiling receptacle (WSCR) in a box counts under 314.16(B)(4) (new) | **verified-sd2023** (condition 3 not checked) | N11 SR-7535 | Box-fill relevant |
| 1j | Panel for Article 314 in the 2023 cycle | **CMP-9** (A2022). In A2025 it is CMP-8 | N11 | The brief's panel-confirmation item |
| 2a | Ch. 9 Table 4, **IMC (Article 342)**, trade sizes ⅜ (dashes) and ½–4, all columns | **verified-sd2023** (condition 3 not checked) | N14 SR 8183 | Data pull and 2 raw pulls agree; 6 canaries rejected; every cell consistent with π/4·ID² |
| 2b | Ch. 9 Table 4, IMC trade sizes 5 and 6 | Second Draft values with draft defects: **HOLD** (treat as UNVERIFIED) | N14 SR 8183 | "136.39" printed in an mm² column; metric and inch IDs disagree |
| 2c | Ch. 9 Table 4: EMT, ENT, FMC, LFMC, LFNC, RMC, PVC-80, PVC-40/HDPE, Type A, EB | **UNVERIFIED** | none | The 2023 Second Draft revised **only** the IMC block (N14 is readable to its end), so 2023 text = A2022 First Draft text, which was not seen |
| 2d | Panel for Ch. 9 Table 4 in the 2023 cycle | **CMP-8** ("Committee: NEC-P08", SR 8183) | N14 | Table 1 ownership was not shown directly |
| 3a | Ch. 9 Table 5 | **UNVERIFIED** | none | Lead: the A2022 CMP-6 SR file (NFPA fetch cap reached) |
| 3b | Ch. 9 Table 1 (2023) and Notes 1–9 | **UNVERIFIED** | none | No 2023 Second Revision on Table 1 or its Notes (N14) |
| 4 | Ch. 9 Tables 8 and 9 | **UNVERIFIED** (no work: lowest priority, budget spent) | none | none |

---

## Sources

### NFPA's own documents (tier 1; no permission notice applies)

- **N11**: NFPA, Second Revision statements report, CMP-9, A2022 cycle (NFPA 70-2023).
  - Header: "National Fire Protection Association Report"; footers "12/6/2021, 12:35 PM".
  - SR records read "Committee: NEC-P09".
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf
  - Readable to 490.71. It lists 32 SRs: 7755 and 7853 are global; 7851–7548 are Article 100 definitions; then 245.15, 312.10, 314.5 (SR-7527), **314.16(B)(5) (SR-7528)**, **314.16(B)(6) (SR-7529)**, 314.24(C) (SR-7531), **314.27(E) (SR-7535)**, and Articles 404, 408, 450 and 490.
  - **No SR on 314.16(A), Table 314.16(A), Table 314.16(B)(1), or 314.16(B) intro/(B)(1)–(B)(4).**
  - Pulls: 1 network fetch, then a raw-token pull and a canary pull (cached).
- **N1 (re-read)**: NFPA, "WORKING DRAFT OF NEC CODE-MAKING PANEL 8 MEETING OUTPUT", First Draft, Revision Cycle A2025, printed 1/30/2024.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf
  - FR-7525 [314.16(B)(4)] p. 26 (Table 314.16(B)(1) is printed on this FR page); FR-7527 [314.16(B)(6)] p. 27; FR-7529 [314.16(B) excluding sub-sections] p. 28.
  - Other Article 314 FRs visible: 7564, 7638, 7519, 7521, 7522, 7960, 7531, 7532, 7539, 7541, 7544, 7553, 7555, 7556, 7557, 7516, 7866, 7562, 7775, 7869.
  - Pulls: 1 network fetch (raw-token pull), then a canary pull (cached).
- **N14**: NFPA, Second Revision statements report, CMP-8, A2022 cycle. Footers "12/7/2021, 12:16 PM"; "30 of 30"; "Committee: NEC-P08".
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P08_SD_SRStatements.pdf
  - The extractor reports the text runs to the last page (p. 30 of 30) with no truncation.
  - 21 SRs: globals 8108, 8183, 8185, 8190; details 8122, 8149; definitions 8161 and 8148; and sections 342.20(B), 348.8, 350.8, 353.48, 354.10, 356.10, 356.30, 358.10(A), 358.24(B), 362.8, Article 369, Article 371 and 392.10(A).
  - **SR 8183** = Chapter 9 Table 4, Article 342 IMC. SR 8185 and SR 8190 = Annex C.
  - Pulls: 1 network fetch, then a data pull, two raw-token pulls, a canary pull and a topics pull (cached).
- **N12 (no target content)**: NFPA memorandum "NEC® First Draft Technical Committee FINAL Ballot Results (A22)", to CMP-9, April 15, 2021.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_FD_BallotFinal.pdf
  - Only FR 7940 and FR 7941 [Global Input] are visible; the text is truncated at 495.117.
- **N13 (no target content)**: NFPA Public Comment compilation, CMP-9, A2022, printed 8/26/2021, 143 pp.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_PCSubmittals.pdf
  - Only PCs 1392 (Art. 245), 1398 (490), 1424 (495), 1963 (CC Note 384) and 901 (CMP-9 definitions) are visible; the text is truncated at 495.132.

### Reproductions with an NFPA permission notice (tier 2)

- **P13**: Eaton's Crouse-Hinds Division, "Commercial Products Catalog", Outlet Boxes and "Switch & Outlet Boxes – Technical Data", p. 172. Pages carry "Copyright© 2015" and "Copyright© 2016".
  - https://assets.usesi.com/product-media/catalogs/USESI_14868_catalog.pdf
  - Notice, in segments:
    - "Reprinted with permission from NFPA 70-2005, the National Electrical Code®,"
    - "Copyright® 2005 National Fire Protection Association, Quincy MA 02269."
    - "This reprinted material is not the complete and official position of the National Fire Protection Association,"
    - "on the referenced subject which is represented only by the standard in its entirety."
  - **It is independent of A5's Steel City (P1/P2, 2011) and Appleton (P3/P4, 2008) reprints.**
- **P14 (same publisher family as P13; not independent)**: Cooper Crouse-Hinds, "Switch & Outlet Boxes – Technical Data", © 2010, same NFPA 70-2005 notice. Row 1 extracts as "8765542".
  - https://assets.usesi.com/product-media/catalogs/USESI_14856_catalog.pdf

### Corroboration only (tier 4) and rejected sources

- **IAEI-H**: Corey Hannahs (NFPA Senior Electrical Specialist), "Making of the 2023 NEC: A Cycle Like No Other", IAEI Magazine, NFPA Code Talk, August 31, 2022.
  - https://iaeimagazine.org/columns/nfpa-code-talk/making-of-the-2023-nec-a-cycle-like-no-other/
  - It gives counts only: 55 CAMs on the NEC (18 passed, 23 failed, 14 not pursued). **No section list.**
- **LC-IMC**: LegalClarity, IMC page, 2026-05-13. It gives the 4 in IMC internal area as 13.631 in², with no edition and no notice.
  - https://legalclarity.org/intermediate-metal-conduit-sizes-uses-and-nec-rules/
- **Rejected**:
  - Hubbell Bell weatherproof catalog (HES-MULTI-CAT-EN-03988_D): 2020 NEC text with a trademark line only and no permission notice; same family as R3's rejected RACO catalog.
  - ICC shop sample 8950P229: no notice, no edition.
  - NJ DOT "Cross Sectional Area Charts": Table 4/5/8-derived values converted to mm², no edition, no notice.

---

## 1. 314.16 box fill (2023)

### 1.1 Table 314.16(B)(1): VERIFIED-2023 (A2025 FD base text)

N1, p. 26, printed on the page of First Revision No. 7525-NFPA 70-2024 [Section No. 314.16(B)(4)]. FR-7525's only change is an informational note (statement: "An informational note was added to alert code users to minimum box depth requirements."). The table is therefore unrevised 2023 base text.

- Raw pull (R4-3), lines exactly as extracted:
```
Table 314.16(B)(1) Volume Allowance Required per Conductor
Size of Conductor (AWG)
Free Space Within Box for Each Conductor
cm3 in.3
18 24.6 1.50
16 28.7 1.75
14 32.8 2.00
12 36.9 2.25
10 41.0 2.50
8 49.2 3.00
6 81.9 5.00
```
- Canary pull (R4-3):
  - Rejected: "18 24.6 1.75", "12 36.9 2.50" and "6 81.9 4.00". Each was answered FALSE, with the true row quoted.
  - Confirmed: "14 32.8 2.00", "8 49.2 3.00", "10 41.0 2.50" and "16 28.7 1.75".
- Agrees with A5's two pulls of the same file.
- The 2023-cycle SRs (N11 SR-7528, SR-7529) also cite "Table 314.16(B)(1)", so the designation is 2023 text.
- Cross-checks (all match): P13 (NFPA 70-2005) "No. 18 1.5 … No. 6 5"; A5 P1 (2011); A5 P3/P4 (2008).

### 1.2 314.16(B) intro: VERIFIED-2023 (A2025 FD base text)

N1, p. 28, First Revision No. 7529-NFPA 70-2024 [Section No. 314.16(B) [Excluding any Sub-Sections]].
- Segments (2026 FD text):
  - "The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together. No allowance"
  - "shall be required for small fittings such as locknuts, splicing connectors, and bushings. Each space"
  - "within a box installed with a barrier shall be calculated separately."
- Statement: "The term 'splicing connectors' was added to the section to clarify it is not required to be" / "counted for box fill calculation."
- **2023 text** (the base, without the FR's insertion): "The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together. No allowance shall be required for small fittings such as locknuts and bushings. Each space within a box installed with a barrier shall be calculated separately."
  - "locknuts and bushings" is also the 2020 wording (A5 P8).
- Canary pull:
  - "(B)(1) through (B)(5)" was rejected.
  - "paragraphs" is NOT SHOWN. The 2020 text read "The volumes in paragraphs 314.16(B)(1) through (B)(5)", and a 2026 deletion would appear in the flattened markup, so the word was already gone in 2023.
  - "In no case shall the volume of the box" is NOT SHOWN in (B). That sentence may sit in the 314.16 lead paragraph, which was not checked.

### 1.3 314.16(B)(4) Device or Equipment Fill: VERIFIED-2023 (A2025 FD base text)

N1, p. 26, FR-7525. Segments:
- "(4) Device or Equipment Fill."
- "For each yoke or strap containing one or more devices or equipment, a double volume"
- "allowance in accordance with Table 314.16(B)(1) shall be made for each yoke or strap based on the"
- "largest conductor connected to a device(s) or equipment supported by that yoke or strap. A device or"
- "utilization equipment wider than a single 50 mm (2 in.) device box as described in Table 314.16(A) shall"
- "have double volume allowances provided for each gang required for mounting."
- The 2026 FR adds "Informational Note: See 314.24(B) for additional information on minimum box depth." That note is **not** 2023 text.

Canary pull: "a single volume allowance" for each yoke or strap was rejected; the double allowance for each gang was confirmed. The wording matches A5's 2011 text except "Table 314.16(B)(1)" and "50 mm (2 in.)".

### 1.4 314.16(B)(5) Equipment Grounding Conductor Fill: verified-sd2023

N11, Second Revision No. 7528-NFPA 70-2021 [Section No. 314.16(B)(5)]; Committee NEC-P09; submitted Wed Oct 13 12:40:15 EDT 2021; responds to Public Comment No. 940.
- Text pull and raw-token pull agree:
  - "(5) Equipment Grounding Conductor Fill."
  - "Where up to four equipment grounding conductors enter a box, a single volume allowance"
  - "in accordance with Table 314.16(B)(1) shall be made based on the largest equipment grounding conductor"
  - "entering the box."
  - "A 1/4 volume allowance shall be made for each additional equipment grounding conductor that enters the box,"
  - "based on the largest equipment grounding conductor in entering the box."
- Statement:
  - "Equipment grounding conductors are only counted in box fill if they are part of a wiring entry to or exit from a box."
  - "A bonding jumper that never leaves the box is not counted,"
  - "just as a short, energized wire connecting two devices in a box is not counted."
  - "CMP 9 is changing the word "in" to "entering" at the end of the paragraph so the rule will not be misapplied."
- The phrase "equipment bonding jumper" does not occur anywhere in SR-7528. The 2020 text (A5 P8) read "equipment grounding conductors or equipment bonding jumpers".
- Canary pull:
  - Rejected: "up to six"; "A 1/2 volume allowance"; "Table 314.16(B)(2)" (NOT SHOWN).
  - Confirmed: "up to four", "A 1⁄4 volume allowance", "Table 314.16(B)(1)", printed "12/6/2021", "NEC-P09".
- Condition 3 is **not checked**. Caution: §1.5 shows that (B)(6) changed between the Second Draft and the printed 2023 edition, so an editorial change to (B)(5) cannot be excluded.

### 1.5 314.16(B)(6) Terminal Block Fill: VERIFIED-2023 (A2025 FD base); the Second Draft wording was superseded

- **2023 print** (N1, p. 27, First Revision No. 7527-NFPA 70-2024 [Section No. 314.16(B)(6)]):
  - "(6) Terminal Block Fill."
  - "Where a terminal block is present in a box, a single volume allowance in accordance with Table"
  - "314.16(B)(1) shall be made for each terminal block assembly based on the largest conductor(s)"
  - "terminated tothe to the assembly."
  - Statement: "Editorial change was made to address consolidated words."
  - So the 2023 edition printed "…terminated tothe assembly." [sic], and 2026 fixes it to "to the assembly". The canary pull confirmed the token "tothe" and rejected "for each pole of the terminal block".
- **Second Draft** (N11, SR-7529; NEC-P09; submitted Wed Oct 13 12:42:29 EDT 2021; PC 1062):
  - "Where a terminal block is present in a box, a single volume allowance in accordance with Table 314.16(B)(1)"
  - "shall be made for each terminal block assembly based on the largest conductor(s) terminated within to it."
  - Statement:
    - "CMP 9 accepts the concept of applying the allowance for each terminal block, but adds the word "assembly""
    - "to clarify that the allowance does not apply to each pole of a multipole terminal block,"
    - "CMP 9 is also changing the end of the rule from "within" to "to""
  - The Second Draft therefore ended "terminated to it."
- **Conflict (wording only)**: the Second Draft says "to it"; the 2023 print says "tothe assembly". Some step after the Second Draft changed it; which step was not identified. The substance is the same in both: one allowance per terminal block assembly, not per pole, sized on the largest conductor terminated to it.
- Canary pulls on N11 rejected "a double volume allowance" and "for each pole of the terminal block".

### 1.6 314.27(E): a WSCR counts as device fill (new; verified-sd2023)

N11, Second Revision No. 7535-NFPA 70-2021 [Section No. 314.27(E)]; NEC-P09; PC 2179.
- "Where the WSCR is installed within a box , it shall be included in the box fill calculation"
- "covered in 314.16(B)(4)."
- Canary "314.16(B)(2)" was rejected.
- The calculator should treat a weight-supporting ceiling receptacle as a (B)(4) device.

### 1.7 Table 314.16(A): rows 6–24 still not seen as 2023; new 2005 cross-check

- **N11 shows no Second Revision on Table 314.16(A)**. The SR list runs past Article 314 to 490.71. Whether the 2023 First Draft changed the table is unknown: the CMP-9 First Draft ballot (N12) and the PC file (N13) are truncated inside the Article 245/490/495 material.
- **P13** (Crouse-Hinds, NFPA 70-2005 notice, p. 172):
  - Data pull: all 24 rows.
  - Raw strings for 7 rows. The summarizer refused the whole block ("I can't reproduce the two table blocks line by line"), so these were requested one row at a time:
    - "4 x 11/4 Round or Octagonal 12.5 8 7 6 5 5 4 2"
    - "4 x 21/8 Square 30.3 20 17 15 13 12 10 6"
    - "411/16 x 11/4 Square 25.5 17 14 12 11 10 8 5"
    - "411/16 x 21/2 Square 29.5 19 16 14 13 11 9 5"
    - "411/16 x 21/8 Square 42.0 28 24 21 18 16 14 8"
    - "FS-Minimum Internal Depth 13/4 Single Cover Gang 13.5" / "9766542"
    - "FD-Minimum Internal Depth 23/8 Multiple Cover Gang 24.0" / "16 13 12 10 9 8 4"
  - These match the data pull.
  - Script /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_3_scripts/compare_2005_2011.py: **P13 matches data/verified/nec-314-16.json on all 24 rows (0 differences)**. The file's row 1 holds the 2023 value; rows 2–24 hold the 2011 values. Every P13 cell equals floor(in³ ÷ allowance); this is arithmetic only.
  - Label quirk: the 29.5 in³ row is printed "411/16 x 21/2"; 2011 prints 4-11/16 × 1-1/2. The volume identifies the row.
  - No footnote was extracted under P13's table.
- **Row 1, 8 AWG, by reprint**:

  | Reprint | Value |
  |---|---|
  | 2002 Steel City text (USESI_25232; notice "NFPA 70-1987") | 5 |
  | 2005 Crouse-Hinds (P13, P14) | **4** |
  | 2008 Appleton | 5 |
  | 2011 Steel City (P1/P2/P11 and USESI_464436/256142, State Electric s-c5g) | 5 |
  | 2023 (A5, PI 3972) | **4** |

  When the printed code settled on 4 is still unknown. The 2023 value is not in doubt (A5, two pulls).

### 1.8 314.16(B)(1) to (B)(3), 2023 wording: UNVERIFIED (no change from A5)

- The A2022 CMP-9 Second Draft has **no SR** on (B)(1), (B)(2) or (B)(3).
- The 2026 First Draft has no FR on them. Their base text would show only inside the A2025 PI file (A5 N3), which is truncated before them.
- Their 2023 wording equals the A2022 First Draft text, which was not seen. A5's 2011 text stays the best evidence.

---

## 2. Chapter 9 Table 4

### 2.1 Article 342 IMC block: verified-sd2023 for ⅜ and ½–4; HOLD for 5 and 6

- Source: N14, Second Revision No. 8183-NFPA 70-2021 [ Global Comment ].
  - "Committee: NEC-P08"; "Submittal Date: Fri Oct 22 13:46:51 EDT 2021"; "Public Comment No. 1210-NFPA 70-2021 [Section No. Table]".
  - Statement: "Table 4 Article 342 was revised to correlate with the trade sizes between IMC, RMC" / "and EMT. It also correlates with the action taken on Public Comment 1209 for 342.20(B)."
- Column headings in printed order:
  - Metric Designator | Trade Size
  - Over 2 Wires 40% (mm², in.²) | 60% (mm², in.²)
  - 1 Wire 53% (mm², in.²) | 2 Wires 31% (mm², in.²)
  - Nominal Internal Diameter (mm, in.) | Total Area 100% (mm², in.²)
- Raw-token pulls (two requests): the final digit of some cells wraps onto the next line. Examples:
  - "16 1⁄2 89 0.137 133 0.205 117 0.181 69 0.10" / "6 16.8 0.660 222 0.342" (0.10 + 6 = 0.106)
  - "27 1 248 0.384 372 0.575 329 0.508 192 0.29" / "7 28.1 1.10" / "5 620 0.959"
  - "103 4 349" / "0 5.452 5235 8.179 4624 7.224 2705" / "4.22" / "6 105.4 4.166 8725 13.631"
  - "129 5 545" / "5 8.528 8183 12.792 7229 11.30 4228" / "6.61" / "0" / "131.7" / "8" / "5.21" / "0" / "136.3" / "9 21.32"
- The data pull (all rows) agrees with the raw lines once the wrapped digits are rejoined. Values are in the JSON block (§4, b08).
- Inch values, as pulled:

| Trade size | 40% in² | 60% in² | 53% in² | 31% in² | ID in. | Total in² |
|---|---|---|---|---|---|---|
| ⅜ | — | — | — | — | — | — |
| ½ | 0.137 | 0.205 | 0.181 | 0.106 | 0.660 | 0.342 |
| ¾ | 0.235 | 0.352 | 0.311 | 0.182 | 0.864 | 0.586 |
| 1 | 0.384 | 0.575 | 0.508 | 0.297 | 1.105 | 0.959 |
| 1¼ | 0.659 | 0.988 | 0.873 | 0.510 | 1.448 | 1.647 |
| 1½ | 0.890 | 1.335 | 1.179 | 0.690 | 1.683 | 2.225 |
| 2 | 1.452 | 2.178 | 1.924 | 1.125 | 2.150 | 3.630 |
| 2½ | 2.054 | 3.081 | 2.722 | 1.592 | 2.557 | 5.135 |
| 3 | 3.169 | 4.753 | 4.199 | 2.456 | 3.176 | 7.922 |
| 3½ | 4.234 | 6.351 | 5.610 | 3.281 | 3.671 | 10.584 |
| 4 | 5.452 | 8.179 | 7.224 | 4.226 | 4.166 | 13.631 |
| 5 (HOLD) | 8.528 | 12.792 | 11.30 | 6.610 | 5.210 | 21.32 |
| 6 (HOLD) | 12.304 | 18.456 | 16.302 | 9.536 | 6.258 | 30.76 |

- Canary pull:
  - Rejected 6 planted values: ¾ total 0.533; 1 ID 1.049; 2 total 3.356; 4 at 40 % 5.022; 3 ID 3.068; heading "Article 344 — Rigid Metal Conduit (RMC)".
  - Confirmed 8 true values: ¾ 0.586; 1 ID 1.105; 2 total 3.630; 4 at 40 % 5.452; ½ at 31 % 0.106; trade size 6 row present; 2½ total 5.135; 1¼ at 53 % 0.873.
- Consistency check (arithmetic only): /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_3_scripts/imc_consistency.py
  - ½ to 3½: every cell is consistent with π/4·ID² in both mm and inches, so no column was mis-assigned.
  - 4: the in² and mm² columns are each self-consistent, but 105.4 mm ≠ 4.166 in (105.82 mm). This may be how the table prints; the in² values are unaffected.
  - **5 and 6**: the total-mm² cell is printed "136.39" (π/4 × 131.78² = 13,639). The metric and inch IDs disagree (131.78 mm vs 5.210 in = 132.33 mm; 158.36 mm vs 6.258 in = 158.95 mm). Formatting is two-decimal. These are newly added Second Draft rows with draft defects, and the published 2023 values may have been edited. **Hold.**
- Category-4 agreement:
  - toolgrit (A5 C6): ¾ IMC 0.586 / 0.235; 1 IMC 0.959 / 0.384.
  - PDHonline E276 (A5 C8): its block labelled "EMT" has ½ 0.660 / 0.342 and ¾ 0.864 / 0.586. Those are these IMC values, which confirms C8's label is wrong.
  - LegalClarity: 4 in IMC 13.631 in².
- Context: SR 8190 (Annex C) says "Table C.8 was revised to include trade size 5 and 6 for IMC." Together with SR 8183 and PC 1209 on 342.20(B), this indicates that IMC trade sizes 5 and 6 entered the 2023 code. The 342.20(B) text itself was not seen.

### 2.2 The other Table 4 blocks: UNVERIFIED

- N14 is readable to its last page. SR 8183 is the only SR touching Table 4.
- The topics pull answered "the document doesn't show changes to the EMT, RMC, PVC, FMC, LFMC, or LFNC blocks".
- The 2023 values of those blocks therefore equal the A2022 First Draft text, which was not seen. **No value is verified.**

## 3. Table 5, Table 1, Notes, Tables 8 and 9

- **Table 1 and the Notes**: N14 has no SR on Table 1 or the Notes, so 2023 equals the A2022 First Draft text (not seen). **UNVERIFIED.**
- **Table 5** (CMP-6 in A2022, by the A2025 assignment of Table 5B to CMP-6 per A5 N5; not confirmed for A2022):
  - Not fetched; the NFPA cap was reached.
  - The ICC 8950P229 sample shows an unlabelled "THHN, THWN, THWN-2" block with "12 | 0.130 | 0.0133". It has no notice and no edition, so it is category 4 only.
  - **UNVERIFIED.**
- **Tables 8 and 9**: no fetch spent. **UNVERIFIED.**

---

## 4. Machine-readable

Conventions:
- `status` uses the PREAMBLE, PREAMBLE-R3 and PREAMBLE-R4 keys.
- `canaries` lists the planted wrong values and whether the extractor rejected them.
- Every block was validated with `python3 -I -c "import json,sys; json.loads(sys.stdin.read())"`. The validated files are in /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_tmp/r4_3/

### 314.16(B) intro (2023)

```json
{"ref":"NFPA 70 314.16(B) (paragraph excluding sub-sections)","edition":"2023","status":"VERIFIED-2023","status_basis":"Unrevised base text of the A2025 (2026-cycle) First Draft, whose base is NFPA 70-2023. FR-7529 inserted only 'splicing connectors' (statement); removing that insertion leaves the 2020 wording 'locknuts and bushings' (A5 P8).","values":{"text_2023":"The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together. No allowance shall be required for small fittings such as locknuts and bushings. Each space within a box installed with a barrier shall be calculated separately.","subsection_range":"(B)(1) through (B)(6)","word_paragraphs_present":false,"sentence_in_no_case_present_in_B":false,"text_2026_first_draft":"... small fittings such as locknuts, splicing connectors, and bushings. ..."},"quote_segments":["The volumes in 314.16(B)(1) through (B)(6), as applicable, shall be added together. No allowance","shall be required for small fittings such as locknuts, splicing connectors, and bushings. Each space","within a box installed with a barrier shall be calculated separately."],"quote_note":"Segments are the 2026 FD text (FR-7529); the 2023 text omits the FR-stated insertion 'splicing connectors,'.","source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf","source_page":"p. 28 of 163, First Revision No. 7529-NFPA 70-2024 [Section No. 314.16(B) [Excluding any Sub-Sections]]","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"The volumes in 314.16(B)(1) through (B)(5)","rejected":true},{"planted":"text contains the word 'paragraphs'","result":"NOT SHOWN"},{"planted":"text contains 'In no case shall the volume of the box'","result":"NOT SHOWN"}]}
```

### 314.16(B)(4) Device or Equipment Fill (2023)

```json
{"ref":"NFPA 70 314.16(B)(4) Device or Equipment Fill","edition":"2023","status":"VERIFIED-2023","status_basis":"Base text of A2025 FD FR-7525; statement: 'An informational note was added to alert code users to minimum box depth requirements.' Body text unrevised.","values":{"text_2023":"For each yoke or strap containing one or more devices or equipment, a double volume allowance in accordance with Table 314.16(B)(1) shall be made for each yoke or strap based on the largest conductor connected to a device(s) or equipment supported by that yoke or strap. A device or utilization equipment wider than a single 50 mm (2 in.) device box as described in Table 314.16(A) shall have double volume allowances provided for each gang required for mounting.","allowance_per_yoke":"double","basis":"largest conductor connected to a device(s) or equipment supported by that yoke or strap","wide_device":"double allowance for each gang required for mounting (wider than a single 50 mm (2 in.) device box)","added_in_2026_FD_not_2023":"Informational Note: See 314.24(B) for additional information on minimum box depth."},"quote_segments":["(4) Device or Equipment Fill.","For each yoke or strap containing one or more devices or equipment, a double volume","allowance in accordance with Table 314.16(B)(1) shall be made for each yoke or strap based on the","largest conductor connected to a device(s) or equipment supported by that yoke or strap. A device or","utilization equipment wider than a single 50 mm (2 in.) device box as described in Table 314.16(A) shall","have double volume allowances provided for each gang required for mounting."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf","source_page":"p. 26 of 163, First Revision No. 7525-NFPA 70-2024 [Section No. 314.16(B)(4)]","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"'a single volume allowance' for each yoke or strap","rejected":true}]}
```

### 314.16(B)(5) Equipment Grounding Conductor Fill (2023 Second Draft)

```json
{"ref":"NFPA 70 314.16(B)(5) Equipment Grounding Conductor Fill","edition":"2023 (Second Draft text)","status":"verified-sd2023","conditions":{"1_sd_text":"met: Second Revision SR-7528 (A2022 SD), responding to Public Comment No. 940","2_two_pulls_and_canaries":"met: text pull + raw-token pull agree; canary pull rejected 3 planted values","3_tm_sc_check":"not checked (no A2022 CAM list found; NITMAM_MC_Report_A2022.pdf does not resolve; IAEI/NFPA-staff column gives counts only: 55 CAMs, 18 passed)"},"caution":"314.16(B)(6) changed between this Second Draft and the printed 2023 edition (see b04), so a post-SD editorial change to (B)(5) cannot be excluded.","values":{"text_sd":"Where up to four equipment grounding conductors enter a box, a single volume allowance in accordance with Table 314.16(B)(1) shall be made based on the largest equipment grounding conductor entering the box. A 1/4 volume allowance shall be made for each additional equipment grounding conductor that enters the box, based on the largest equipment grounding conductor entering the box.","count_covered_by_single_allowance":4,"additional_allowance_each":"1/4","basis":"largest equipment grounding conductor entering the box","equipment_bonding_jumpers_in_text":false,"markup_note":"Raw tokens end '...largest equipment grounding conductor in entering the box.'; the SR statement says CMP 9 changed 'in' to 'entering', so 'in' is the struck word."},"quote_segments":["(5) Equipment Grounding Conductor Fill.","Where up to four equipment grounding conductors enter a box, a single volume allowance","in accordance with Table 314.16(B)(1) shall be made based on the largest equipment grounding conductor","entering the box.","A 1/4 volume allowance shall be made for each additional equipment grounding conductor that enters the box,","based on the largest equipment grounding conductor in entering the box.","A bonding jumper that never leaves the box is not counted,","CMP 9 is changing the word “in” to “entering” at the end of the paragraph so the rule will not be misapplied."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf","source_page":"Second Revision No. 7528-NFPA 70-2021 [Section No. 314.16(B)(5)]; Committee NEC-P09; submitted Wed Oct 13 12:40:15 EDT 2021; printed 12/6/2021","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"Where up to six equipment grounding conductors enter a box","rejected":true},{"planted":"A 1/2 volume allowance ... each additional equipment grounding conductor","rejected":true},{"planted":"refers to Table 314.16(B)(2)","rejected":true,"result":"NOT SHOWN"}],"contradicts":"data/verified/nec-314-16.json item (5) uses the 2020 wording 'equipment grounding conductors or equipment bonding jumpers'"}
```

### 314.16(B)(6) Terminal Block Fill (2023)

```json
{"ref":"NFPA 70 314.16(B)(6) Terminal Block Fill","edition":"2023","status":"VERIFIED-2023","status_basis":"Base text of A2025 FD FR-7527 (statement: 'Editorial change was made to address consolidated words'). The 2023 print ends 'terminated tothe assembly' [sic]; 2026 FD corrects it to 'to the assembly'.","values":{"text_2023":"Where a terminal block is present in a box, a single volume allowance in accordance with Table 314.16(B)(1) shall be made for each terminal block assembly based on the largest conductor(s) terminated tothe assembly. [sic: 'to the']","allowance":"single, per terminal block assembly (not per pole)","basis":"largest conductor(s) terminated to the assembly","second_draft_text_superseded":"... shall be made for each terminal block assembly based on the largest conductor(s) terminated to it. (SR-7529, A2022 SD; raw tokens 'terminated within to it', statement: 'within' changed to 'to')","sd_vs_print":"CONFLICT in final words only: SD 'to it' vs 2023 print 'tothe assembly'. Source of the post-SD change not identified."},"quote_segments":["(6) Terminal Block Fill.","Where a terminal block is present in a box, a single volume allowance in accordance with Table","314.16(B)(1) shall be made for each terminal block assembly based on the largest conductor(s)","terminated tothe to the assembly.","CMP 9 accepts the concept of applying the allowance for each terminal block, but adds the word “assembly”","to clarify that the allowance does not apply to each pole of a multipole terminal block,"],"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf"],"source_page":"FR-7527 p. 27 of 163 (A2025 FD); SR-7529 (A2022 SD, Committee NEC-P09, PC 1062)","permission_notice":"NFPA's own documents (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"'a double volume allowance' for a terminal block (SR-7529)","rejected":true},{"planted":"allowance made 'for each pole of the terminal block' (SR-7529)","rejected":true},{"planted":"allowance made 'for each pole of the terminal block' (FR-7527)","rejected":true}]}
```

### Table 314.16(B)(1) (2023)

```json
{"ref":"NFPA 70 Table 314.16(B)(1) Volume Allowance Required per Conductor","edition":"2023","status":"VERIFIED-2023","status_basis":"Unrevised base text shown on the A2025 FD page of FR-7525 (whose only change is an informational note). Designation 'Table 314.16(B)(1)' is also cited in 2023-cycle SR-7528 and SR-7529.","pulls":"A5 two pulls + R4-3 raw pull + R4-3 canary pull: all agree","headers":["Size of Conductor (AWG)","Free Space Within Box for Each Conductor","cm3","in.3"],"values":[{"awg":"18","cm3":24.6,"in3":1.50},{"awg":"16","cm3":28.7,"in3":1.75},{"awg":"14","cm3":32.8,"in3":2.00},{"awg":"12","cm3":36.9,"in3":2.25},{"awg":"10","cm3":41.0,"in3":2.50},{"awg":"8","cm3":49.2,"in3":3.00},{"awg":"6","cm3":81.9,"in3":5.00}],"quote_segments":["Table 314.16(B)(1) Volume Allowance Required per Conductor","18 24.6 1.50","16 28.7 1.75","14 32.8 2.00","12 36.9 2.25","10 41.0 2.50","8 49.2 3.00","6 81.9 5.00"],"crosscheck":"Eaton Crouse-Hinds catalog, NFPA 70-2005 notice (P13): 1.5 / 1.75 / 2 / 2.25 / 2.5 / 3 / 5 in3: match. A5: 2011 (Steel City) and 2008 (Appleton): match.","source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf","source_page":"p. 26 of 163 (FR-7525 page)","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"18 24.6 1.75","rejected":true},{"planted":"12 36.9 2.50","rejected":true},{"planted":"6 81.9 4.00","rejected":true}]}
```

### Table 314.16(A): status per row and the 2005 cross-check

```json
{"ref":"NFPA 70 Table 314.16(A) Metal Boxes","edition":"2023 status per row; new cross-check from NFPA 70-2005 reprint","status":"rows 1-5 VERIFIED-2023 (carried A5, PI 3972 base text); rows 6-24 UNVERIFIED as 2023, VERIFIED-other-edition (2005, 2008, 2011; three publishers agree)","new_source":{"id":"P13","title":"Commercial Products Catalog: Outlet Boxes / Switch & Outlet Boxes - Technical Data","publisher":"Eaton's Crouse-Hinds Division","date":"Copyright 2015 and 2016 on pages","page":"p. 172","pulls":"data pull (24 rows) + raw strings for 7 rows (1, 6, 7, 8, 9, 21, 24): agree; full raw block refused by the summarizer","duplicate_not_independent":"Cooper Crouse-Hinds 'Switch & Outlet Boxes - Technical Data' (c) 2010, same NFPA 70-2005 notice, row 1 extracted '8765542': https://assets.usesi.com/product-media/catalogs/USESI_14856_catalog.pdf"},"values":[
 {"row":1,"box":"4 x 1-1/4 round/octagonal","in3":12.5,"max":{"18":8,"16":7,"14":6,"12":5,"10":5,"8":4,"6":2},"status_2023":"VERIFIED-2023 (A5, PI 3972)","row1_8awg_history":{"2002 Steel City text (notice NFPA 70-1987)":5,"2005 Crouse-Hinds (NFPA 70-2005 notice)":4,"2008 Appleton":5,"2011 Steel City":5,"2023 PI 3972 base text":4}},
 {"row":"2-24","match":"P13 equals data/verified/nec-314-16.json rows 2-24 in every in3 value and every count (script r4_3_scripts/compare_2005_2011.py: 0 differing rows)","status_2023":"UNVERIFIED"}],
 "label_quirk":"P13 prints the 29.5 in3 row as '411/16 x 21/2 Square'; 2011 prints 4-11/16 x 1-1/2. Volume identifies the row.","floor_check":"every P13 cell equals floor(in3 / Table 314.16(B)(1) allowance) (arithmetic only)","footnote_2005":"none extracted","footnote_2023":"UNVERIFIED","sd_2023":"No Second Revision on Table 314.16(A) in the A2022 CMP-9 SR list (readable past Article 314 to 490.71). A2022 First Draft changes: not seen (ballot truncated).","quote_segments":["4 x 11/4 Round or Octagonal 12.5 8 7 6 5 5 4 2","4 x 21/8 Square 30.3 20 17 15 13 12 10 6","411/16 x 11/4 Square 25.5 17 14 12 11 10 8 5","411/16 x 21/8 Square 42.0 28 24 21 18 16 14 8","FD-Minimum Internal Depth 23/8 Multiple Cover Gang 24.0","16 13 12 10 9 8 4"],"source_url":"https://assets.usesi.com/product-media/catalogs/USESI_14868_catalog.pdf","permission_notice":"Reprinted with permission from NFPA 70-2005, the National Electrical Code®, Copyright® 2005 National Fire Protection Association, Quincy MA 02269. This reprinted material is not the complete and official position of the National Fire Protection Association, on the referenced subject which is represented only by the standard in its entirety.","retrieved":"2026-10-20"}
```

### 314.27(E) WSCR counted under 314.16(B)(4) (2023 Second Draft)

```json
{"ref":"NFPA 70 314.27(E) WSCR box-fill sentence (box-fill relevant)","edition":"2023 (Second Draft text)","status":"verified-sd2023","conditions":{"1_sd_text":"met: SR-7535 (A2022 SD, PC 2179)","2_two_pulls_and_canaries":"met: text pull + raw pull agree; canary '314.16(B)(2)' rejected","3_tm_sc_check":"not checked"},"values":{"rule":"A weight-supporting ceiling receptacle (WSCR) installed within a box is included in the box fill calculation under 314.16(B)(4) (device or equipment fill)."},"quote_segments":["Where the WSCR is installed within a box , it shall be included in the box fill calculation","covered in 314.16(B)(4)."],"markup_note":"The space before the comma suggests flattened markup nearby; the cited subsection 314.16(B)(4) was confirmed by the canary pull.","source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf","source_page":"Second Revision No. 7535-NFPA 70-2021 [Section No. 314.27(E)]; Committee NEC-P09","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"included in the box fill calculation covered in 314.16(B)(2)","rejected":true}]}
```

### Chapter 9 Table 4, Article 342 IMC (2023 Second Draft)

```json
{"ref":"NFPA 70 Chapter 9 Table 4, Article 342 - Intermediate Metal Conduit (IMC)","edition":"2023 (Second Draft text)","status":"verified-sd2023 (trade sizes 3/8 dashes and 1/2-4); trade sizes 5 and 6: SD text with draft defects, HOLD","conditions":{"1_sd_text":"met: Second Revision No. 8183-NFPA 70-2021 [Global Comment], Committee NEC-P08, submitted Fri Oct 22 13:46:51 EDT 2021, cites Public Comment No. 1210; statement: 'Table 4 Article 342 was revised to correlate with the trade sizes between IMC, RMC and EMT.'","2_two_pulls_and_canaries":"met: data pull (all rows) + two raw-token pulls (rows 3/8-1-1/2; rows 2-6) agree after rejoining line-wrapped digits; canary pull rejected 6 planted values and confirmed 8 true ones","3_tm_sc_check":"not checked"},"columns":["metric_designator","trade_size","over2_40pct_mm2","over2_40pct_in2","pct60_mm2","pct60_in2","one_wire_53pct_mm2","one_wire_53pct_in2","two_wires_31pct_mm2","two_wires_31pct_in2","id_mm","id_in","total_100pct_mm2","total_100pct_in2"],"values":[
 ["12","3/8",null,null,null,null,null,null,null,null,null,null,null,null],
 ["16","1/2",89,0.137,133,0.205,117,0.181,69,0.106,16.8,0.660,222,0.342],
 ["21","3/4",151,0.235,226,0.352,200,0.311,117,0.182,21.9,0.864,377,0.586],
 ["27","1",248,0.384,372,0.575,329,0.508,192,0.297,28.1,1.105,620,0.959],
 ["35","1-1/4",425,0.659,638,0.988,564,0.873,330,0.510,36.8,1.448,1064,1.647],
 ["41","1-1/2",573,0.890,859,1.335,759,1.179,444,0.690,42.7,1.683,1432,2.225],
 ["53","2",937,1.452,1405,2.178,1241,1.924,726,1.125,54.6,2.150,2341,3.630],
 ["63","2-1/2",1323,2.054,1985,3.081,1753,2.722,1026,1.592,64.9,2.557,3308,5.135],
 ["78","3",2046,3.169,3069,4.753,2711,4.199,1586,2.456,80.7,3.176,5115,7.922],
 ["91","3-1/2",2729,4.234,4093,6.351,3616,5.610,2115,3.281,93.2,3.671,6822,10.584],
 ["103","4",3490,5.452,5235,8.179,4624,7.224,2705,4.226,105.4,4.166,8725,13.631],
 ["129","5",5455,8.528,8183,12.792,7229,11.30,4228,6.610,131.78,5.210,"136.39 [sic]",21.32],
 ["155","6",7878,12.304,11817,18.456,10439,16.302,6106,9.536,158.36,6.258,19696,30.76]],
 "row_3_8_note":"printed as dashes in every column","hold_reason_5_6":"New SD rows show draft defects: total mm2 printed '136.39' (pi/4 x 131.78^2 = 13639); metric ID 131.78 mm vs 5.210 in (=132.33 mm); 158.36 mm vs 6.258 in (=158.95 mm); two-decimal formatting (11.30, 21.32, 30.76). Published 2023 values may differ.","consistency_check":"r4_3_scripts/imc_consistency.py: trade sizes 1/2-3-1/2 all cells consistent with pi/4 x ID^2; trade size 4: in2 and mm2 columns each consistent, but 105.4 mm vs 4.166 in (=105.82 mm) (arithmetic only)","crosscheck_category4":"toolgrit (A5 C6): 3/4 IMC 0.586 / 0.235, 1 IMC 0.959 / 0.384: match. PDHonline E276 (A5 C8) block labelled 'EMT': 1/2 0.660 / 0.342, 3/4 0.864 / 0.586: match IMC (confirms that C8 label is wrong). LegalClarity 2026: 4 in IMC 13.631 in2: match.","quote_segments":["Table 4 Article 342 was revised to correlate with the trade sizes between IMC, RMC","and EMT. It also correlates with the action taken on Public Comment 1209 for 342.20(B).","12 3⁄8 — — — — — — — — — — — —","16 1⁄2 89 0.137 133 0.205 117 0.181 69 0.10","6 16.8 0.660 222 0.342","21 3⁄4 151 0.235 226 0.352 200 0.311 117 0.18","2 21.9 0.864 377 0.586","53 2 937 1.452 1405 2.178 1241 1.924 726 1.12","5 54.6 2.150 2341 3.630","6 105.4 4.166 8725 13.631","9 21.32","6 30.76"],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P08_SD_SRStatements.pdf","source_page":"SR 8183 (document printed 12/7/2021, 30 pp.)","permission_notice":"NFPA's own document (no notice applies)","retrieved":"2026-10-20","canaries":[{"planted":"3/4 total area 0.533 in2","rejected":true},{"planted":"1 ID 1.049 in","rejected":true},{"planted":"2 total area 3.356 in2","rejected":true},{"planted":"4 over-2-wires 40% 5.022 in2","rejected":true},{"planted":"3 ID 3.068 in","rejected":true},{"planted":"heading 'Article 344 - Rigid Metal Conduit (RMC)'","rejected":true}]}
```

### 2023-cycle Second Draft scope for Chapter 9 Tables 1, 2, 4 and Notes; panel assignments

```json
{"ref":"NFPA 70-2023 cycle (A2022) Second Draft scope for Chapter 9 Tables 1, 2, 4 and Notes; panel assignments","edition":"2023 cycle","status":"VERIFIED (NFPA documents) for the facts listed; table values other than IMC: UNVERIFIED","values":{"panel_article_314_A2022":"CMP-9 (SR-7528/7529/7535 statements: 'CMP 9 ...'; Committee: NEC-P09)","panel_ch9_table4_A2022":"CMP-8 (SR 8183, Committee: NEC-P08)","panel_article_314_A2025":"CMP-8 (A5 N1)","A2022_P08_SR_list":["8108 global: delete 'Type' from article titles 342-362","8183 Chapter 9 Table 4 Article 342 (IMC)","8185 Annex C: remove 'Type' from Table C.1 and headings C.10-C.15","8190 Annex C IMC table: add trade sizes 5 and 6","8122 / 8149 definitions moved to Article 100 (371, 369)","plus 342.20(B), 348.8, 350.8, 353.48, 354.10, 356.10, 356.30, 358.10(A), 358.24(B), 362.8, Articles 369 and 371, 392.10(A), definitions (LFNC, Raceway)"],"A2022_P08_SR_document_complete":"extractor reports text ends at page 30 of 30, last section 392.10(A) (SRs are in section order with globals first)","no_SD_revision_on":["Chapter 9 Table 1","Notes to Chapter 9 tables","Chapter 9 Table 2","Chapter 9 Table 4 blocks other than Article 342 IMC (EMT, ENT, FMC, LFMC, LFNC, RMC, PVC, HDPE, Type A, Type EB)"],"implication":"2023 text of those tables equals the A2022 First Draft text, which was not seen; they stay UNVERIFIED."},"quote_segments":["Committee: NEC-P08","Table 4 Article 342 was revised to correlate with the trade sizes between IMC, RMC","Table C.8 was revised to include trade size 5 and 6 for IMC. Table C.9 will need to be revised in a future edition of the NEC."],"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P08_SD_SRStatements.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf"],"permission_notice":"NFPA's own documents (no notice applies)","retrieved":"2026-10-20"}
```

### Chapter 9 Tables 5, 1 (+Notes), 8, 9 (2023)

```json
[{"ref":"NFPA 70 Chapter 9 Table 5","edition":"2023","status":"UNVERIFIED","values":[],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No authorized copy found in R4-3. ICC shop sample 8950P229 (no notice, no edition) shows an unlabelled 'THHN, THWN, THWN-2' block with 12 AWG 0.130 in / 0.0133 in2: category 4 only. Lead: 70_A2022_NEC_P06_SD_SRStatements.pdf (not fetched: NFPA budget)."},
 {"ref":"NFPA 70 Chapter 9 Table 1 and Notes to Tables 1-9","edition":"2023","status":"UNVERIFIED","values":[],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No Second Revision on Table 1 or the Notes in the A2022 CMP-8 SR document, so 2023 text = A2022 First Draft text (unseen)."},
 {"ref":"NFPA 70 Chapter 9 Tables 8 and 9","edition":"2023","status":"UNVERIFIED","values":[],"quote_segments":[],"source_url":null,"permission_notice":null,"retrieved":"2026-10-20","note":"No fetch spent (lowest priority; site uses NIST HB100)."}]
```

---

## 5. Registry impact (research/data-sources.csv; data/verified/)

### nec-314-16-box-fill: does NOT move to "verified" (still partial, but stronger)

- **Why not**:
  - Table 314.16(A) rows 6–24 and its footnote have no 2023 source.
  - The 2023 wording of 314.16(B)(1) Conductor Fill, (B)(2) Clamp Fill and (B)(3) Support Fittings Fill was not seen.
  - Under the "perfect" standard the calculator still cannot be rebuilt as 2023.
- **Proposed coverage line**:
  > Partial. 2023: 314.16(A) text and Table 314.16(A) rows 1–5 (VERIFIED-2023, PI 3972); Table 314.16(B)(1) all 7 rows, 314.16(B) intro, (B)(4), (B)(6) (VERIFIED-2023, A2025 First Draft base text, canary-checked); (B)(5) (verified-sd2023, SR-7528; TM/SC not checked); 314.27(E) WSCR counted under (B)(4) (verified-sd2023). Not 2023: Table 314.16(A) rows 6–24 (2005/2008/2011 reprints identical across three publishers), table footnote, (B)(1)–(B)(3) (2011 wording). data/verified/nec-314-16.json.
- **Edits for data/verified/nec-314-16.json** (values in the JSON blocks above):
  1. "Table 314.16(B)": retitle it "Table 314.16(B)(1) Volume Allowance Required per Conductor" and raise its status to VERIFIED-2023 (b05). The values are unchanged.
  2. "(B) intro": replace the 2020 and 2026-FD items with the 2023 text (b01).
  3. "(4)": replace the 2011 text with the 2023 text (b02). The informational note is 2026 only.
  4. **"(5)": CONTRADICTION.** The file holds the 2020 wording, "equipment grounding conductors **or equipment bonding jumpers**". The 2023 Second Draft text (b03) has no bonding jumpers and bases the allowance on the largest EGC "**entering** the box". SR statement: "A bonding jumper that never leaves the box is not counted". Replace it and mark it verified-sd2023.
  5. "(6)": the file's text ("terminated to the assembly", labelled 2026 First Draft) is right in substance. Relabel it as the 2023 print "terminated tothe assembly" [sic] (b04) and note the superseded Second Draft wording "to it".
  6. Add 314.27(E): a WSCR inside a box is counted as device fill under 314.16(B)(4) (b07).
  7. Table 314.16(A):
     - row 1 note: add "2005 reprint (Crouse-Hinds, NFPA 70-2005 notice) also prints 4";
     - rows 6–24: add corroboration from P13 (2005; independent publisher). Their status stays VERIFIED-other-edition.
- **Calculator logic affected** (once the owner accepts the statuses above):
  - EGC fill: count only EGCs entering the box. Up to four count as one allowance on the largest EGC entering; each additional one adds ¼ allowance. No allowance for bonding jumpers that stay in the box.
  - A WSCR counts as a device (double allowance).
  - Terminal blocks: one allowance per assembly, not per pole.

### nec-ch9-fill: stays GAP (first 2023-cycle table values recorded)

- **Proposed coverage line**:
  > GAP (partial). Table 4 Article 342 IMC, trade sizes 3/8 (dashes) to 4, all columns: verified-sd2023 (A2022 Second Draft SR 8183; 2022 TM/SC not checked). IMC 5 and 6: Second Draft values with draft defects, held. EMT, ENT, FMC, LFMC, LFNC, RMC, PVC-80, PVC-40/HDPE, Type A, Type EB blocks, Table 5, Table 1 (2023) and Notes: UNVERIFIED (none revised at the 2023 Second Draft; First Draft text unseen). 2023 Annex C numbering verified (R3). Conduit-fill tool stays withdrawn.
- **File**: a new data/verified/nec-ch9-table4.json holding only the IMC block (b08), with trade sizes 5 and 6 excluded or flagged "hold".
- **Contradictions with data/verified/**: none (no Table 4 file exists). The finding supports PREAMBLE-R3's ban on third-party Table 4 copies: PDHonline's "EMT" block is the IMC block.
- The conduit-fill tool still cannot return: EMT, PVC and RMC, and all of Table 5, are unverified.

### nec-ch9-t8-t9: no change (GAP)

- Proposed coverage line: "Rounds 2–4: unverified (no authorized copy; R4 spent no fetch). Site uses NIST HB100."

---

## 6. Blocked or failed log

1. **docinfofiles.nfpa.org** (6 network fetches, the cap; 8 cached re-reads; no 429):
   - `NITMAM_MC_Report_A2022.pdf`: "There was an error while fetching." The name was guessed from `/70/NITMAM_MC_Report_A2025.pdf` and `/4/NITMAM_MC_Report_A2023.pdf`, both seen in search results. The next fetch to the host succeeded, so this was a missing file.
   - `70_A2022_NEC_P09_FD_BallotFinal.pdf` (N12): only the global FRs 7940 and 7941 are visible; truncated at 495.117. No 314.16 content.
   - `70_A2022_NEC_P09_SD_PCSubmittals.pdf` (N13): five PCs visible; truncated at 495.132. No 314.16 content.
2. **assets.usesi.com/…/USESI_154496_catalog.pdf**: "There was an error while fetching." This is the second failure across rounds (R3 had one too). Do not retry.
3. **USESI_14868 (P13), full raw block**: refused ("I can't reproduce the two table blocks line by line"). Worked around with short raw strings for 7 rows.
4. **Steel City duplicates, no new data**: USESI_464436 and USESI_256142 (NFPA70-2011 notice); State Electric s-c5g-1_2-3_4.pdf (2011 notice); USESI_25232 (© 2002 T&B, notice "NFPA 70-1987"). In all of them row 1 reads 8 AWG = 5.
5. **Rejected or off-target**:
   - Hubbell HES-MULTI-CAT-EN-03988_D (Bell): 2020 text, trademark line only.
   - ECmag "Box-Fill Calculations, Part II" (Charles R. Miller, 2004): no tables, no notice.
   - IAEI "Box Fill Calculations" (Keith Lofland, 2016; A5's C12): tables are images.
   - ICC 8950P229 sample: no notice, no edition.
   - NJ DOT "Cross Sectional Area Charts": mm² conversions, no edition, no notice.
   - IAEI Hannahs 2022: CAM counts only.
   - LegalClarity IMC: category 4.
6. **WebSearch, 24 of 24.** Queries in order:
   1. NFPA fact sheet box fill
   2. NFPA fact sheet box/conduit fill on .gov
   3. "Using the Tables in Article 250" series
   4. "70_A2022_NEC_P09"
   5. A2022 FD "First Revision No." 314.16
   6. "Table 314.16(B)(1)" + permission
   7. Table 314.16(A) handout .gov
   8. 2023 + "Volume Allowance Required per Conductor" + permission
   9. Table 4 title + permission
   10. Steel City + 2020/2023 notice
   11. city box-fill handout 2023
   12. 2022 TM CAM list
   13. "NITMAM_MC_Report_A2022"
   14. "Reproduced with permission of NFPA" + Chapter 9 Table 4
   15. Steel Tube Institute fill chart
   16. "Corresponds to 356.2(2)" + permission
   17. Cantex / JM Eagle / Prime + Table 4
   18. "70_A2025_NEC_P08" PC/SD/Ballot
   19. "70_A2025_NEC" "PCSubmittals"
   20. "Reproduced with permission of NFPA" + 314.16
   21. Crouse-Hinds Code Digest + Table 4
   22. MN DLI 2023 change summary + 314.16
   23. 2022 Technical Meeting motions
   24. IMC Table 4 trade sizes 5/6 values

   Most hits were content-farm "chart" pages or sources already seen. The NFPA fact-sheet route (searches 1–3) found no box-fill, raceway-fill or Chapter 9 fact sheet; only the Article 250 sheet (salinas.gov, go.nfpa.org) exists.
7. **Not used, by rule**: law.resource.org copies of the California Electrical Code (a full-code copy NFPA did not authorize), Scribd, UpCodes, third-party Table 4 copies.

---

## 7. Open gaps

1. **Table 314.16(A) rows 6–24 and footnote, and the 2023 wording of 314.16(B)(1)–(B)(3).**
   - No readable A2022 CMP-9 First Draft content: the ballot and PC files are truncated inside the Article 245/490/495 material, and `_FD_FRStatements` / `_FD_PrelimFR` names failed for P11 in round 2.
   - Leads:
     - `70_A2019_NEC_P09_FD_PISubmittals.pdf`. The A2019 naming is confirmed by `70_A2019_NEC_P12_FD_PISubmittals.pdf`. It holds 2017 base text and could date the row-1 change, but it is still another edition.
     - A 2020-or-later box catalog with an NFPA notice. None found in three rounds.
     - Reading NFPA 70-2023 directly, which is a human step.
2. **314.16(B)(5) as printed in 2023, and the TM/SC condition for every verified-sd2023 item.** The A2022 motions report was not found. `70/NITMAM_MC_Report_A2025.pdf` exists but covers the 2026 cycle.
3. **Table 4 blocks other than IMC (2023).**
   - They were not revised at the Second Draft, so the A2022 CMP-8 First Draft text or a 2023 reprint is needed.
   - `70_A2022_NEC_P08_FD_BallotFinal.pdf` (the pattern exists for P03, P05, P06 and P09) would show only blocks the First Draft revised.
4. **IMC trade sizes 5 and 6**: the published values, and the 2023 text of 342.20(B).
5. **Table 5**: `70_A2022_NEC_P06_SD_SRStatements.pdf` and `70_A2022_NEC_P06_FD_BallotFinal.pdf` (the latter exists, per search) were not fetched because of the NFPA cap. CMP-6 ownership of Table 5 in A2022 is not confirmed.
6. **Table 1 (2023) and Notes 1–9**: unchanged at the Second Draft; the First Draft text is needed.
7. **Tables 8 and 9**: untouched this round.
8. **314.16 lead paragraph**: the 2023 wording and placement of "In no case shall the volume of the box…" were not checked.
