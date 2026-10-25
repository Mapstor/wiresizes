# R4-1: terminations and cables (110.14(C), 334.80/340.80, 310.15(E)/(F))

Agent R4-1, wiresizes.com primary sourcing, round 4. **Retrieval date for every item: 2026-10-20.** Target edition: NFPA 70-2023.

**Budget used**
- WebSearch: **24 of 24** (list in the blocked/failed log).
- docinfofiles.nfpa.org: **6 of 6**. Five returned text; the sixth (a pattern-built file name) returned CLIENT_ERROR. No HTTP 429 was identified, but a 404 cannot be told from a block.
  1. `70_A2022_NEC_P01_SD_SRStatements.pdf`, pull A (verbatim segments).
  2. Same file, pull B (canaries).
  3. `70_A2022_NEC_P06_SD_SRStatements.pdf` (SR list).
  4. `70_A2025_NEC_P01_FD_PrelimFR.pdf`, targeted re-read. Reason for repeating it: round 2 never listed its First Revisions, and the question here (are section-level FRs in the file at all?) is new.
  5. `70_A2022_NEC_P06_FD_BallotFinal.pdf`.
  6. `70_A2022_NEC_P06_SD_PCStatements.pdf`: CLIENT_ERROR.
- Other hosts, 6 fetches:
  - nj.gov (TIA compilation, round-2 host);
  - ecmweb.com (one article);
  - campbellcountywy.gov (one PDF);
  - ecmag.com (one article);
  - iaeimagazine.org (one article);
  - forums.mikeholt.com (one thread, tier 4).

**Method.** The 2023-cycle NFPA files carry the label "NFPA 70-2021" on every item. That is NFPA's internal tag for the A2022 cycle, which produced the 2023 edition. The files were printed in December 2021, and the edition was issued by the Standards Council on 12 Aug 2022.

---

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1a | **110.14(C) lead-in** | **verified-sd2023** | NFPA 2023-cycle CMP-1 Second Draft, **SR-7793** [Sections 110.14(C), 110.14(D)] | Lowest-rated termination, conductor or device governs. Higher-rated conductors may be used for adjustment and correction. Heading seen in one pull only |
| 1b | **110.14(C)(1) lead-in** | **verified-sd2023** (first sentence and heading: single pull) | SR-7793 | "Table 310.16 as appropriately modified by 310.12"; "Unless the equipment is listed and marked otherwise" |
| 1c | **110.14(C)(1)(a) items (1)–(4)** | **verified-sd2023** (item (1) wording and lead-in tail: single pull) | SR-7793 | **100 amperes or less**; **14 AWG through 1 AWG**; 60°C (140°F); listed and identified; **motor design letters B, C, or D** at 75°C (167°F) |
| 1d | **110.14(C)(1)(b) items (1)–(2)** | **verified-sd2023** | SR-7793 | **over 100 amperes**; **larger than 1 AWG**; 75°C (167°F); higher ampacity only if listed and identified. Items printed without a final period |
| 1e | **110.14(C)(2) Separate Connector Provisions** | **verified-sd2023** | SR-7793 | Ampacity at the connector's listed and identified temperature rating |
| 1f | 110.14(C) Informational Note | Content **verified-sd2023**; wording **VERIFIED-draft** (flattened redline) | SR-7793 | "equipment Equipment" run-together; SR statement: notes revised for the Style Manual |
| 1g | verified-sd2023 condition 3 (CAMs, Standards Council) | **not checked** (partial) | NJ DCA TIA compilation; searches | TIAs 23-1 to 23-13: none on 110.14. No CMP-1 CAM amendment ballot surfaced. CAM list, SC decisions, CC SCRs and errata not read |
| 1h | **110.14(C) in 2026: changed at First Draft stage?** | **UNVERIFIED** (no change seen) | A2025 CMP-1 FD working draft; R3-1 SD | No 2026 SR (R3-1). The 2026 global FRs FR-9168 and FR-9213 do not touch 110.14. **Section-level FRs are not in the only FD file reached**, so round 2's negative carries no weight |
| 2a | **334.80 national 2023 text** | **UNVERIFIED** | — | **No 2023-cycle Second Revision on 334.80** (CMP-6 SR list, single pull). 2023-cycle FRs not seen |
| 2b | **340.80 national 2023 text** | **UNVERIFIED** | — | **No 2023-cycle SR on 340.80** (same list) |
| 2c | Panel that owned 334/340 in the 2023 cycle | **VERIFIED (NFPA document)** | A2022 CMP-6 SR list; FR-8304 | **CMP-6, not CMP-3** as PREAMBLE.md says |
| 2d | 334.80 WA and MA deviations | unchanged from round 3 (VERIFIED, state only) | WAC 296-46B-334(8); 527 CMR 12.00 | Not re-fetched |
| 3a | **310.15(E) 2023 text** | **UNVERIFIED** | — | **No 2023-cycle SR on 310.15 or 310.15(E)** (single pull). So the 2023 text is the 2023 First Draft text, which was not seen |
| 3b | **310.15(F) 2023 text** | **UNVERIFIED** | — | No 2023-cycle SR on 310.15(F) |
| 4 | UL DIVQ listing note (optional) | not obtained | — | Search found only forums and product pages |

---

## 2. Evidence: 110.14(C)

### 2.1 Source
- **Document:** NFPA Second Revision compilation for NEC Code-Making Panel 1, 2023 revision cycle (A2022).
  - Running header: "National Fire Protection Association Report", with a submittals URL.
  - Every item is labelled "Second Revision No. …-NFPA 70-2021".
  - Printed 12/6/2021 12:09 PM; 98 pages ("x of 98"). Text visible to p. 54.
  - Publisher: NFPA. Tier 1 (NFPA's own document).
  - Permission notice: none captured in this run. Round 3 (A4) reported an NFPA use restriction on this document family: "may not be used for any other purpose or distributed to any other persons or parties."
- **URL:** https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf
- **Item:** "Second Revision No. 7793-NFPA 70-2021 [ Sections 110.14(C), 110.14(D) ]".
- **SR-7793 Committee Statement** (one segment): "The Informational Notes to 110.14(C)(2) and 110.14(D) have been revised to comply with the NEC Style Manual."
- **Other 110.14 SRs in the same file:**
  - SR-7788, 110.14(A);
  - SR-7690, "110.14 [Excluding any Sub-Sections]".
  - Neither covers (C).
- The full CMP-1 SR list (30 SRs) is in the JSON block for the CMP-1 SR list.

### 2.2 Text, pull A (exactly as returned, segments under 120 characters; longest 101)
```
(C) Temperature Limitations.
The temperature rating associated with the ampacity of a conductor shall be selected and coordinated
so as not to exceed the lowest temperature rating of any connected termination, conductor, or device.
Conductors with temperature ratings higher than specified for terminations shall be permitted
to be used for ampacity adjustment, correction, or both.
(1) Equipment Provisions.
The determination of termination provisions of equipment shall be based on 110.14(C)(1)(a) or
(C)(1)(b). Unless the equipment is listed and marked otherwise, conductor ampacities used in
determining equipment termination provisions shall be based on Table 310.16 as appropriately
modified by 310.12.
(a) Termination provisions of equipment for circuits rated 100 amperes or less, or marked
for 14 AWG through 1 AWG conductors, shall be used only for one of the following:
(1) Conductors rated 60°C (140°F).
(2) Conductors with higher temperature ratings, provided the ampacity of such conductors is
determined based on the 60°C (140°F) ampacity of the conductor size used.
(3) Conductors with higher temperature ratings if the equipment is listed and identified for use
with such conductors.
(4) For motors marked with design letters B, C, or D, conductors having an insulation rating of
75°C (167°F) or higher shall be permitted to be used, provided the ampacity of such
conductors does not exceed the 75°C (167°F) ampacity.
(b) Termination provisions of equipment for circuits rated over 100 amperes, or marked
for conductors larger than 1 AWG, shall be used only for one of the following:
(1) Conductors rated 75°C (167°F)
(2) Conductors with higher temperature ratings, provided the ampacity of such conductors
does not exceed the 75°C (167°F) ampacity of the conductor size used, or up to their ampacity
if the equipment is listed and identified for use with such conductors
(2) Separate Connector Provisions.
Separately installed pressure connectors shall be used with conductors at the ampacities not
exceeding the ampacity at the listed and identified temperature rating of the connector.
Informational Note: With respect to 110.14(C)(1) and (C)(2), equipment Equipment
markings or listing information may additionally restrict the sizing and temperature
ratings of connected conductors.
```

### 2.3 Pull B (same file, second extractor run, with canaries)
Ten statements were tested; six carried planted wrong values. The extractor returned the printed words for every WRONG one.

| # | Planted or true statement (short form) | Result | Printed words returned |
|---|---|---|---|
| S1 | (a) "125 amperes or less … 14 AWG through 1/0 AWG" (canary) | **WRONG, rejected** | "rated 100 amperes or less, or marked for 14 AWG through 1 AWG conductors," |
| S2 | (a)(4) "design letters B, C, D, or E" (canary) | **WRONG, rejected** | "For motors marked with design letters B, C, or D, conductors having an insulation rating of 75°C (167°F) or higher" |
| S3 | (b)(1) "Conductors rated 90°C (194°F)." (canary) | **WRONG, rejected** | "Conductors rated 75°C (167°F)" |
| S4 | (1) lead-in "…modified by 310.15(B)(7)." (canary) | **WRONG, rejected** | "as appropriately modified by 310.12." |
| S5 | (a)(2) full sentence (true) | EXACT | — |
| S6 | (C)(2) heading and sentence (true) | EXACT | — |
| S7 | (b) lead-in (true) | EXACT | — |
| S8 | lead-in "shall not be used for ampacity adjustment or correction" (canary) | **WRONG, rejected** | "…shall be permitted to be used for ampacity adjustment, correction, or both." |
| S9 | (a)(3) full sentence (true) | EXACT | — |
| S10 | (1) lead-in "…based on Table 310.17" (canary) | **WRONG, rejected** | "shall be based on Table 310.16" |

Pull B also re-quoted four passages; all match pull A exactly:
- (a)(4): "For motors marked with design letters B, C, or D, conductors having an insulation rating of 75°C (167°F) or higher" / "shall be permitted to be used, provided the ampacity of such conductors does not exceed the 75°C (167°F) ampacity."
- (b)(2): "Conductors with higher temperature ratings, provided the ampacity of such conductors does not exceed the 75°C (167°F)" / "ampacity of the conductor size used, or up to their ampacity if the equipment is listed and identified" / "for use with such conductors"
- The Informational Note.
- The first sentence of the (C) lead-in.

It also confirmed that **(b)(1) and (b)(2) have no final period** in the SR text.

**Mechanical comparison** (`python3 -I research2/r4_1_scripts/compare_pulls.py`):
- All 14 strings that pull B returned as printed occur verbatim in pull A.
- Canaries: 6 of 6 rejected.
- True statements: 4 of 4 confirmed.

**Seen in pull A only (single pull):**
- the headings "(C) Temperature Limitations." and "(1) Equipment Provisions.";
- the (C)(1) first sentence "The determination of termination provisions of equipment shall be based on 110.14(C)(1)(a) or (C)(1)(b).";
- the (a)(1) item "Conductors rated 60°C (140°F).";
- the (a) lead-in tail "shall be used only for one of the following:".

**What the single-pull pieces mean for the values:**
- Every **rule value** is still confirmed by both pulls: 100 A, 14–1 AWG (S1), and 60 °C through (a)(2) (S5).
- Round 2's tier-4 text (Mike Holt forum PI draft, 21 Mar 2023) matches the single-pull pieces word for word. It is corroboration only.

### 2.4 verified-sd2023 conditions
1. **Passage.** It is the text of SR-7793, a Second Revision in the 2023-cycle Second Draft. The statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft. Met.
2. **Two pulls with canaries.** Two pulls agree, and pull B rejected 6 of 6 canaries. Met, except for the single-pull pieces listed above.
3. **2022 Technical Meeting and Standards Council: not checked (partial).**
   - **TIAs 23-1 to 23-13: none on 110.14** (§5). TIAs 23-3 to 23-6 were issued on 12 Aug 2022, with the edition.
   - Two targeted searches for 2022 CAM amendment ballots found only CMP-3 (70-53), CMP-9 (70-115) and CMP-16 (70-48). None was found for CMP-1 or CMP-6.
   - Not read:
     - the 2022 CAM list (no Motions Committee report file name found);
     - Standards Council decisions issuing NFPA 70-2023;
     - the Correlating Committee SCR report `70_A2022_NEC_AAC_SD_SCRreport.pdf`;
     - Errata 70-23-1 to 70-23-6.

### 2.5 Informational Note wording
- The note's wording is flattened: the run-together "With respect to 110.14(C)(1) and (C)(2), equipment Equipment" shows a strike and an insertion. Do not quote the note verbatim.
- Its content is unambiguous: equipment markings or listing information may further restrict conductor sizing and temperature ratings.
- The probable 2023 wording, "Informational Note: Equipment markings or listing information may additionally restrict the sizing and temperature ratings of connected conductors.", is **UNVERIFIED**.

### 2.6 110.14(C) in 2026 (First Draft stage)
- **Second Draft:** no SR on 110.14(C) (R3-1; VERIFIED-draft negative).
- **First Draft, this run:** the CMP-1 FD working draft `70_A2025_NEC_P01_FD_PrelimFR.pdf` holds only:
  - FR-9168 [Global Input]: new 110.39, "In Sight From (Within Sight From, Within Sight)";
  - FR-9213 [Global Input]: voltage-rating wording in 110.26(A), 110.26(A)(4), 110.27(A), 110.28, 110.30, 110.33(A)(2), 110.34(B), 110.34(C), 110.73, 110.74(A) and 110.74(B);
  - FR-9025 [Detail]: Annex A Table A.1(a);
  - the marker "Revised by FR-8939" at the Part III heading before 110.30.
- 110.14, 110.16, 110.21, 110.22 and 110.24 do not appear at all. **The file therefore contains only global and detail FRs.** It can neither show nor exclude a section-level FR on 110.14(C). Round 2's "no 110.14 FR in the visible portion" carries no weight.
- **Result: no 2026 change seen; First Draft stage UNVERIFIED.** Weak signals of no change:
  - The EC Magazine 2026 Article 90–130 changes article (Kyle Krueger, 15 Jan 2026, tier 4) lists only 110.3(B), 110.16, 110.26 and 110.26(C)(2) for Article 110.
  - The MN 2026 summary omits 110.14 (R3-1).
  - Oregon amends only 110.14(D) (R3-1).

---

## 3. Evidence: 334.80 and 340.80

- **2023 national text: UNVERIFIED.** No tier 1–3 document reached in this run prints it.
- **Negative finding (single pull): no 2023-cycle Second Revision on 334.80 or 340.80.**
  - **Document:** NFPA Second Revision compilation, CMP-6, 2023 cycle (A2022).
    - Items labelled "NFPA 70-2021"; printed 12/7/2021 12:11 PM.
    - 76 pages, visible to p. 57, ending mid-sentence.
    - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf
  - **Layout of the 37 SRs:**
    - two out-of-order items after the global SR: SR-8426 (310.10(G)(4)) and SR-8432 (labelled "Detail"; its body refers to Tables 310.16 and 310.17);
    - then 18 definition SRs;
    - then section SRs in code order: 310.1, 310.3(A), 310.10(G), 310.14(A)(1), 310.21, 315.1, 320.23, 322.56(B), 330.104, 330.112(A), **334.40(B), 334.104**, 336.104, Article 337, **340.10, 340.104**.
  - **What this shows:** the visible list runs past the code-order positions of 334.80 and 340.80, so neither had a Second Revision.
  - **Caveat:** pages 58–76 were not seen. A late out-of-order item cannot be fully excluded, but out-of-order items in these files sit at the start.
  - The 2023 text therefore equals the 2023 First Draft text, which was not seen.
- **Panel ownership in the 2023 cycle: CMP-6.**
  - Shown by the SRs above and by FR-8304 in the CMP-6 FD ballot.
  - FR-8304 [Global Input] moves CMP-6 definitions to Article 100 and deletes the xxx.2 sections of Articles 311, 320–340, 382 and 394–399, including 334.2 and 340.2.
  - **This contradicts PREAMBLE.md** ("CMP-3 300/334/340").
- **2023-cycle First Revisions on 334.80/340.80: not seen.**
  - `70_A2022_NEC_P06_FD_BallotFinal.pdf`: memo "NEC® First Draft Technical Committee FINAL Ballot Results (A22)", to CMP-6, dated April 15, 2021; 194 pages.
  - Text was visible only to p. 8, because FR-8304 is very long.
  - Visible: FR-8304; FR-8560 (Article 399 → 395); FR-8616 (Article 311 → 315); FR-8562 (Article 337 title "Drilling Rig Cable: Type P Cable"); FR-8430 (copper-clad aluminum definition, cut off).
- **Tier-4 context only, never evidence** (Mike Holt forum, "2026 NEC MN-B Cable Changes", posts of 24–25 Jan 2026):
  - A poster quotes the 2026 NEC as keeping "The ampacity shall not exceed that of a 60°C (140°F) rated conductor." and the 90 °C sentence for adjustment and correction.
  - Another poster says Public Comment 1609-NFPA 70-2024 on 334.80(A) (adding "termination requirements") was rejected.
  - Not verified.
- WA (WAC 296-46B-334(8)) and MA (527 CMR 12.00) deviations stay as verified in rounds 2–3. They were not re-fetched.

## 4. Evidence: 310.15(E) and 310.15(F)

- **2023 text of both: UNVERIFIED.**
- **Negative finding (single pull): no 2023-cycle Second Revision on 310.15, 310.15(E) or 310.15(F).** Source: the same CMP-6 SR list as §3, whose 310 entries are 310.1, 310.3(A), 310.10(G), 310.10(G)(4), 310.14(A)(1), 310.21 and the Tables 310.16/310.17 Detail item. So the 2023 text is the 2023 First Draft text.
- **2023-cycle First Revisions: not seen**, because the FD ballot window ends on p. 8.
- **2026 (unchanged from rounds 2–3):**
  - 310.15(E) was reorganized into list format by FR-8035 (VERIFIED-draft).
  - 310.15(F) was not revised in the 2026 First Draft.
- Fetched with no target text:
  - IAEI "The Reorganization of NEC Article 310" (Keith Lofland, 1 Jul 2021; 2020 NEC; no NFPA notice; no 310.15(E)/(F) text);
  - Campbell County WY DocumentCenter/View/217 (2017 NEC excerpts; no target text; no notice).

## 5. Evidence: 2023 TIAs (support for condition 3)

- **Source:** "National Electrical Code (NEC), 2023 Edition, NFPA 70, Tentative Interim Amendments", NFPA documents hosted by NJ DCA. https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf (round-2 host).
- **TIAs, with log number and reference:**
  - 23-1 (1608): 250.114(3)e, (4)e
  - 23-2 (1617): Art. 100 Ignitible Fibers/Flyings, 506.5, 506.9(B)
  - 23-3 (1654): 210.8(F) Ex. No. 2
  - 23-4 (1655): 215.15
  - 23-5 (1659): 555.30
  - 23-6 (1660): 555.35
  - 23-7 (1678): Tables C.18–C.20
  - 23-8 (1688): 300.26
  - 23-9 (1687): Pool, 680.26
  - 23-10 (1690): 314.29(A)
  - 23-11 (1692): 700.32(C), 701.32(C), 708.54(C)
  - 23-12 (1699): 408.6
  - 23-13 (1731): 400.47
- None references 110.14, 334.80, 340.80 or 310.15(E)/(F). TIA 23-8 only cites 310.15 inside 300.26.
- TIA Log 1695 (a CMP-1 log, found by search) is not among the issued TIAs. Its subject was not read.

---

## 6. Machine-readable

Each block was validated with `python3 -I -c "import json,sys; json.loads(sys.stdin.read())" < block.json` (files in research2/r4_tmp/r4_1_block_NN.json).

```json
{"ref": "110.14(C) lead-in (Temperature Limitations)", "edition": "NFPA 70-2023 (text as set by the 2023-cycle Second Draft)", "status": "verified-sd2023", "sd2023_conditions": {"1_passage": "text of Second Revision SR-7793 [Sections 110.14(C), 110.14(D)] in the 2023-cycle Second Draft. The SR statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft", "2_pulls_and_canaries": "two pulls of the same NFPA file agree (14 of 14 pull-B strings occur verbatim in pull A); pull B rejected 6 of 6 canaries", "3_tech_meeting_sc": "not checked (partial): TIAs 23-1 to 23-13 checked, none touches 110.14; no CMP-1 or CMP-6 CAM amendment ballot found in two targeted searches (only CMP-3 70-53, CMP-9 70-115, CMP-16 70-48 surfaced); the 2022 CAM list, Standards Council decisions, Correlating Committee SCR report (70_A2022_NEC_AAC_SD_SCRreport.pdf) and errata 70-23-1 to 70-23-6 were not read"}, "values": {"governing_rating": "lowest temperature rating of any connected termination, conductor, or device", "higher_rated_conductors": "permitted to be used for ampacity adjustment, correction, or both"}, "quote_segments": ["(C) Temperature Limitations.", "The temperature rating associated with the ampacity of a conductor shall be selected and coordinated", "so as not to exceed the lowest temperature rating of any connected termination, conductor, or device.", "Conductors with temperature ratings higher than specified for terminations shall be permitted", "to be used for ampacity adjustment, correction, or both."], "single_pull_segments": ["(C) Temperature Limitations."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [{"planted": "Conductors with temperature ratings higher than specified for terminations shall not be used for ampacity adjustment or correction.", "rejected": true, "printed": "Conductors with temperature ratings higher than specified for terminations shall be permitted to be used for ampacity adjustment, correction, or both."}]}
```
```json
{"ref": "110.14(C)(1) Equipment Provisions (lead-in)", "edition": "NFPA 70-2023 (text as set by the 2023-cycle Second Draft)", "status": "verified-sd2023 (first sentence and heading: single pull)", "sd2023_conditions": {"1_passage": "text of Second Revision SR-7793 [Sections 110.14(C), 110.14(D)] in the 2023-cycle Second Draft. The SR statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft", "2_pulls_and_canaries": "two pulls of the same NFPA file agree (14 of 14 pull-B strings occur verbatim in pull A); pull B rejected 6 of 6 canaries", "3_tech_meeting_sc": "not checked (partial): TIAs 23-1 to 23-13 checked, none touches 110.14; no CMP-1 or CMP-6 CAM amendment ballot found in two targeted searches (only CMP-3 70-53, CMP-9 70-115, CMP-16 70-48 surfaced); the 2022 CAM list, Standards Council decisions, Correlating Committee SCR report (70_A2022_NEC_AAC_SD_SCRreport.pdf) and errata 70-23-1 to 70-23-6 were not read"}, "values": {"basis": "110.14(C)(1)(a) or (C)(1)(b)", "ampacity_table": "Table 310.16 as appropriately modified by 310.12", "override": "unless the equipment is listed and marked otherwise"}, "quote_segments": ["(1) Equipment Provisions.", "The determination of termination provisions of equipment shall be based on 110.14(C)(1)(a) or", "(C)(1)(b). Unless the equipment is listed and marked otherwise, conductor ampacities used in", "determining equipment termination provisions shall be based on Table 310.16 as appropriately", "modified by 310.12."], "single_pull_segments": ["(1) Equipment Provisions.", "The determination of termination provisions of equipment shall be based on 110.14(C)(1)(a) or (C)(1)(b)."], "notes": "The second sentence was confirmed in pull B as the unflagged words of canaries S4 and S10.", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [{"planted": "shall be based on Table 310.17", "rejected": true, "printed": "shall be based on Table 310.16"}, {"planted": "as appropriately modified by 310.15(B)(7).", "rejected": true, "printed": "as appropriately modified by 310.12."}]}
```
```json
{"ref": "110.14(C)(1)(a) (circuits rated 100 A or less, or marked 14 AWG through 1 AWG)", "edition": "NFPA 70-2023 (text as set by the 2023-cycle Second Draft)", "status": "verified-sd2023 (item (1) wording and the lead-in tail: single pull)", "sd2023_conditions": {"1_passage": "text of Second Revision SR-7793 [Sections 110.14(C), 110.14(D)] in the 2023-cycle Second Draft. The SR statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft", "2_pulls_and_canaries": "two pulls of the same NFPA file agree (14 of 14 pull-B strings occur verbatim in pull A); pull B rejected 6 of 6 canaries", "3_tech_meeting_sc": "not checked (partial): TIAs 23-1 to 23-13 checked, none touches 110.14; no CMP-1 or CMP-6 CAM amendment ballot found in two targeted searches (only CMP-3 70-53, CMP-9 70-115, CMP-16 70-48 surfaced); the 2022 CAM list, Standards Council decisions, Correlating Committee SCR report (70_A2022_NEC_AAC_SD_SCRreport.pdf) and errata 70-23-1 to 70-23-6 were not read"}, "values": {"applies_to": "termination provisions of equipment for circuits rated 100 amperes or less, or marked for 14 AWG through 1 AWG conductors", "item_1": "conductors rated 60°C (140°F)", "item_2": "higher-rated conductors, ampacity determined from the 60°C (140°F) ampacity of the conductor size used", "item_3": "higher-rated conductors if the equipment is listed and identified for use with such conductors", "item_4_motor_design_letters": ["B", "C", "D"], "item_4": "motors marked design B, C or D: conductors insulated 75°C (167°F) or higher permitted, ampacity not exceeding the 75°C (167°F) ampacity"}, "quote_segments": ["(a) Termination provisions of equipment for circuits rated 100 amperes or less, or marked", "for 14 AWG through 1 AWG conductors, shall be used only for one of the following:", "(1) Conductors rated 60°C (140°F).", "(2) Conductors with higher temperature ratings, provided the ampacity of such conductors is", "determined based on the 60°C (140°F) ampacity of the conductor size used.", "(3) Conductors with higher temperature ratings if the equipment is listed and identified for use", "with such conductors.", "(4) For motors marked with design letters B, C, or D, conductors having an insulation rating of", "75°C (167°F) or higher shall be permitted to be used, provided the ampacity of such", "conductors does not exceed the 75°C (167°F) ampacity."], "single_pull_segments": ["shall be used only for one of the following:", "(1) Conductors rated 60°C (140°F)."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [{"planted": "circuits rated 125 amperes or less, or marked for 14 AWG through 1/0 AWG conductors", "rejected": true, "printed": "rated 100 amperes or less, or marked for 14 AWG through 1 AWG conductors,"}, {"planted": "For motors marked with design letters B, C, D, or E", "rejected": true, "printed": "For motors marked with design letters B, C, or D, conductors having an insulation rating of 75°C (167°F) or higher"}], "confirmed_exact_in_pull_b": ["item (2) full sentence", "item (3) full sentence", "item (4) full sentence (re-quoted)"]}
```
```json
{"ref": "110.14(C)(1)(b) (circuits rated over 100 A, or marked for conductors larger than 1 AWG)", "edition": "NFPA 70-2023 (text as set by the 2023-cycle Second Draft)", "status": "verified-sd2023", "sd2023_conditions": {"1_passage": "text of Second Revision SR-7793 [Sections 110.14(C), 110.14(D)] in the 2023-cycle Second Draft. The SR statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft", "2_pulls_and_canaries": "two pulls of the same NFPA file agree (14 of 14 pull-B strings occur verbatim in pull A); pull B rejected 6 of 6 canaries", "3_tech_meeting_sc": "not checked (partial): TIAs 23-1 to 23-13 checked, none touches 110.14; no CMP-1 or CMP-6 CAM amendment ballot found in two targeted searches (only CMP-3 70-53, CMP-9 70-115, CMP-16 70-48 surfaced); the 2022 CAM list, Standards Council decisions, Correlating Committee SCR report (70_A2022_NEC_AAC_SD_SCRreport.pdf) and errata 70-23-1 to 70-23-6 were not read"}, "values": {"applies_to": "termination provisions of equipment for circuits rated over 100 amperes, or marked for conductors larger than 1 AWG", "item_1": "conductors rated 75°C (167°F)", "item_2": "higher-rated conductors not exceeding the 75°C (167°F) ampacity of the conductor size used, or up to their ampacity if the equipment is listed and identified for use with such conductors"}, "quote_segments": ["(b) Termination provisions of equipment for circuits rated over 100 amperes, or marked", "for conductors larger than 1 AWG, shall be used only for one of the following:", "(1) Conductors rated 75°C (167°F)", "(2) Conductors with higher temperature ratings, provided the ampacity of such conductors", "does not exceed the 75°C (167°F) ampacity of the conductor size used, or up to their ampacity", "if the equipment is listed and identified for use with such conductors"], "single_pull_segments": [], "notes": "Items (1) and (2) are printed without a final period in SR-7793 (both pulls). The printed 2023 edition's punctuation is not verified.", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [{"planted": "(1) Conductors rated 90°C (194°F).", "rejected": true, "printed": "Conductors rated 75°C (167°F)"}], "confirmed_exact_in_pull_b": ["(b) lead-in", "item (2) (re-quoted)"]}
```
```json
{"ref": "110.14(C)(2) Separate Connector Provisions", "edition": "NFPA 70-2023 (text as set by the 2023-cycle Second Draft)", "status": "verified-sd2023", "sd2023_conditions": {"1_passage": "text of Second Revision SR-7793 [Sections 110.14(C), 110.14(D)] in the 2023-cycle Second Draft. The SR statement confines the revision to the Informational Notes, so the body is First Draft text carried unchanged into the Second Draft", "2_pulls_and_canaries": "two pulls of the same NFPA file agree (14 of 14 pull-B strings occur verbatim in pull A); pull B rejected 6 of 6 canaries", "3_tech_meeting_sc": "not checked (partial): TIAs 23-1 to 23-13 checked, none touches 110.14; no CMP-1 or CMP-6 CAM amendment ballot found in two targeted searches (only CMP-3 70-53, CMP-9 70-115, CMP-16 70-48 surfaced); the 2022 CAM list, Standards Council decisions, Correlating Committee SCR report (70_A2022_NEC_AAC_SD_SCRreport.pdf) and errata 70-23-1 to 70-23-6 were not read"}, "values": {"rule": "separately installed pressure connectors are used at ampacities not exceeding the ampacity at the connector's listed and identified temperature rating"}, "quote_segments": ["(2) Separate Connector Provisions.", "Separately installed pressure connectors shall be used with conductors at the ampacities not", "exceeding the ampacity at the listed and identified temperature rating of the connector."], "single_pull_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [], "confirmed_exact_in_pull_b": ["heading and full sentence (statement S6)"]}
```
```json
{"ref": "110.14(C) Informational Note (after (C)(2))", "edition": "NFPA 70-2023 (2023-cycle Second Draft; revised by SR-7793)", "status": "content verified-sd2023; exact wording VERIFIED-draft (strike/underline flattened)", "values": {"content": "equipment markings or listing information may additionally restrict the sizing and temperature ratings of connected conductors", "probable_2023_wording_unverified": "Informational Note: Equipment markings or listing information may additionally restrict the sizing and temperature ratings of connected conductors.", "sr_statement": "The Informational Notes to 110.14(C)(2) and 110.14(D) have been revised to comply with the NEC Style Manual."}, "quote_segments": ["Informational Note: With respect to 110.14(C)(1) and (C)(2), equipment Equipment", "markings or listing information may additionally restrict the sizing and temperature", "ratings of connected conductors."], "notes": "'equipment Equipment' is a flattened redline. Which words were struck is not shown, so do not quote the note verbatim.", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "source_title": "NFPA Second Revision compilation, NEC Code-Making Panel 1, 2023 revision cycle (A2022; items labelled 'Second Revision No. ...-NFPA 70-2021'); running header 'National Fire Protection Association Report'; printed 12/6/2021 12:09 PM; 98 pages, text visible to p. 54", "permission_notice": null, "retrieved": "2026-10-20", "canaries": []}
```
```json
{"ref": "110.14(C) in NFPA 70-2026", "edition": "2026 cycle (A2025)", "status": "UNVERIFIED (no change seen; First Draft stage not established)", "values": {"2026_second_revisions": "none on 110.14(C) (R3-1, CMP-1 SD working draft; SR-7644 = 110.14 intro, SR-7618 = 110.14(D))", "2026_global_first_revisions": "FR-9168 (new 110.39 'In Sight From') and FR-9213 (voltage-rating wording in 110.26(A), (A)(4), 110.27(A), 110.28, 110.30, 110.33(A)(2), 110.34(B), (C), 110.73, 110.74(A), (B)) do not touch 110.14", "2026_section_level_first_revisions": "not visible: the CMP-1 FD working draft (70_A2025_NEC_P01_FD_PrelimFR.pdf) holds only global and detail FRs (FR-9168, FR-9213, FR-9025 Annex A, marker 'Revised by FR-8939'), so round 2's 'no 110.14 FR seen' carries no weight", "tier4": "EC Magazine (Kyle Krueger, 15 Jan 2026) lists 2026 Article 110 changes as 110.3(B), 110.16, 110.26, 110.26(C)(2); 110.14 is not mentioned"}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": []}
```
```json
{"ref": "334.80 (Type NM ampacity), NEC 2023 national text", "edition": "NFPA 70-2023", "status": "UNVERIFIED (text); negative SR finding single pull", "values": {"2023_cycle_second_revision": "none: the 2023-cycle CMP-6 SR list (37 SRs, sections in order, last visible SR-8446 = 340.104 on p. 57 of 76) has no SR on 310.15, 310.15(E), 310.15(F), 334.80 or 340.80 (single pull)", "panel_2023_cycle": "CMP-6 (SRs on 320.23, 322.56(B), 330.104, 330.112(A), 334.40(B), 334.104, 336.104, Article 337, 340.10, 340.104)", "2023_cycle_FR": "not seen (CMP-6 FD ballot visible only to p. 8 of 194)", "FR-8304": "Global: CMP-6 definitions moved to Article 100; 334.2 deleted"}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [], "notes": "334.80 state deviations stay as verified in rounds 2-3 (WA WAC 296-46B-334(8); MA 527 CMR 12.00)."}
```
```json
{"ref": "340.80 (Type UF ampacity), NEC 2023 national text", "edition": "NFPA 70-2023", "status": "UNVERIFIED (text); negative SR finding single pull", "values": {"2023_cycle_second_revision": "none: the 2023-cycle CMP-6 SR list (37 SRs, sections in order, last visible SR-8446 = 340.104 on p. 57 of 76) has no SR on 310.15, 310.15(E), 310.15(F), 334.80 or 340.80 (single pull)", "panel_2023_cycle": "CMP-6 (SRs on 320.23, 322.56(B), 330.104, 330.112(A), 334.40(B), 334.104, 336.104, Article 337, 340.10, 340.104)", "2023_cycle_FR": "not seen (CMP-6 FD ballot visible only to p. 8 of 194)", "FR-8304": "Global: CMP-6 definitions moved to Article 100; 340.2 deleted"}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [], "notes": ""}
```
```json
{"ref": "310.15(E) neutral conductor and 310.15(F) grounding or bonding conductor, NEC 2023 text", "edition": "NFPA 70-2023", "status": "UNVERIFIED (text); negative SR finding single pull", "values": {"2023_cycle_second_revision": "none: the 2023-cycle CMP-6 SR list (37 SRs, sections in order, last visible SR-8446 = 340.104 on p. 57 of 76) has no SR on 310.15, 310.15(E), 310.15(F), 334.80 or 340.80 (single pull)", "panel_2023_cycle": "CMP-6 (SRs on 320.23, 322.56(B), 330.104, 330.112(A), 334.40(B), 334.104, 336.104, Article 337, 340.10, 340.104)", "2023_cycle_FR": "not seen (CMP-6 FD ballot visible only to p. 8 of 194)"}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": [], "notes": ""}
```
```json
{"ref": "2023-cycle CMP-1 Second Revision list (context for other agents)", "edition": "2023 cycle (A2022) Second Draft", "status": "VERIFIED-draft (list only)", "values": {"SR_list_in_order": ["7841 Global Comment (Article 100 definitions, style manual)", "7706 Detail (new section after 110.28; 110.29)", "7803 Detail (110.26(A)(6))", "7534 90.2(E)", "7537 90.7", "7603 def In Sight From", "7582 def Industrial Establishment", "7655 def Occupiable Space", "7745 def Reconditioned", "7743 def Servicing", "7702 def Voltage, Nominal", "7666 110.3(A)", "7668 110.3(B)", "7671 110.4", "7672 110.5", "7788 110.14(A)", "7793 110.14(C), 110.14(D)", "7690 110.14 excluding sub-sections", "7704 110.16(B)", "7732 110.17", "7751 110.21(A)(1)", "7762 110.22(A)", "7763 110.24(A)", "7801 110.26", "7765 110.27(C)", "7806 110.28", "7809 110.31 excluding sub-sections", "7810 110.33(A)", "7811 110.34(A)", "7541 A.1"]}, "quote_segments": ["Second Revision No. 7793-NFPA 70-2021 [ Sections 110.14(C), 110.14(D) ]"], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": []}
```
```json
{"ref": "2023-cycle CMP-6 Second Revision list (context for other agents)", "edition": "2023 cycle (A2022) Second Draft", "status": "VERIFIED-draft (list only)", "values": {"header": "NFPA 70-2021 labels; printed 12/7/2021 12:11 PM; 76 pages, visible to p. 57", "SR_list_in_order": ["8347 Global Comment (Article 100 definitions)", "8426 310.10(G)(4) Ampacity Correction or Adjustment", "8432 Detail (Tables 310.16 and 310.17)", "8224 def Bottom Shield, Type FCC", "8226 def Cable Connector, Type FCC", "8234 def Cable Joint, Type MV", "8239 def Cable Termination, Type MV", "8716 def Cable, Medium Voltage, Type MV", "8251 def Cable, Portable Power Feeder", "8254 def Compact", "8255 def Compressed", "8321 def Conductor, Insulated (messenger-supported wiring)", "8456 def Cord Connector", "8242 def Cord, Flexible", "8340 def Drilling Rig Cable, Type P", "8221 def Flat Conductor Cable, Type FCC", "8228 def Insulating End, Type FCC", "8229 def Metal Shield Connections, Type FCC", "8250 def Power-Supply Cord", "8230 def Top Shield, Type FCC", "8232 def Transition Assembly, Type FCC", "8276 310.1", "8404 310.3(A)", "8420 310.10(G)", "8429 310.14(A)(1)", "8287 310.21", "8260 315.1", "8306 320.23", "8296 322.56(B)", "8436 330.104", "8309 330.112(A)", "8337 334.40(B)", "8437 334.104", "8443 336.104", "8298 Article 337", "8310 340.10", "8446 340.104"]}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf", "permission_notice": null, "retrieved": "2026-10-20", "canaries": []}
```
```json
{"ref": "TIAs 23-1 to 23-13 (2023 edition) vs. target sections", "edition": "NFPA 70-2023", "status": "VERIFIED-2023 (negative: no TIA on 110.14, 310.15(E)/(F), 334.80 or 340.80)", "values": {"TIA_to_log": {"23-1": "1608 (250.114)", "23-2": "1617 (Art. 100, 506.5, 506.9(B))", "23-3": "1654 (210.8(F) Ex. 2, issued Aug 12 2022)", "23-4": "1655 (215.15)", "23-5": "1659 (555.30)", "23-6": "1660 (555.35)", "23-7": "1678 (Tables C.18-C.20)", "23-8": "1688 (300.26)", "23-9": "1687 (Pool, 680.26)", "23-10": "1690 (314.29(A))", "23-11": "1692 (700.32(C), 701.32(C), 708.54(C))", "23-12": "1699 (408.6)", "23-13": "1731 (400.47)"}, "log_1695_CMP1": "not among issued TIAs 23-1..23-13; subject not read"}, "quote_segments": ["Reference: 300.26", "Reference: 408.6"], "source_url": "https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf", "permission_notice": "NFPA TIA documents reproduced by NJ DCA; round 2 recorded 'Copyright © [year] All Rights Reserved … NATIONAL FIRE PROTECTION ASSOCIATION' on each TIA", "retrieved": "2026-10-20", "canaries": []}
```

---

## 7. Registry impact

### nec-110-14c: can move from GAP to **verified** (status key verified-sd2023)
- **url:** https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf
- **source:** "NFPA 70-2023 110.14(C) (2023-cycle Second Draft, SR-7793)".
- **attribution:** "Source: NFPA 70 (NEC) 2023, 110.14(C) (NFPA 2023-cycle Second Draft, SR-7793) — retrieved Oct 2026".
- **verified_date:** 2026-10-20. **next_check:** 2027-01-20.
- **coverage (exact line):** "110.14(C) lead-in, (C)(1) lead-in, (C)(1)(a)(1)–(4) incl. motor design letters B, C, or D, (C)(1)(b)(1)–(2), (C)(2) and the Informational Note's content; 2023 text from NFPA 2023-cycle Second Draft SR-7793 (verified-sd2023: 2 pulls, 6/6 canaries rejected); 2022 CAM/Standards Council/CC check not done, TIAs 23-1–23-13 none; 2026: no SR, First Draft stage unconfirmed."
- **sample_note:** "SR-7793 statement confines the change to the Informational Notes; headings, the (C)(1) first sentence and the (a)(1) wording are single-pull; (b)(1)/(b)(2) carry no final period in the SR text; note wording flattened, do not quote it."
- **Data file:** new `data/verified/nec-110-14c.json`, holding the first seven JSON blocks above plus the engine rules below. Nothing in the existing data/verified files contradicts it.
- **Allowlist rows to add** (nec-sections-allowlist.csv):
  - `110.14(C),section,2023,"Termination temperature: lowest-rated termination, conductor or device governs",nec-110-14c,verified,"2023-cycle Second Draft SR-7793; values only, do not quote the Informational Note"`
  - `110.14(C)(1)(a),section,2023,"100 A or less, or 14–1 AWG: 60 °C; higher-rated at 60 °C ampacity; listed and identified; motors B, C, D at 75 °C",nec-110-14c,verified,`
  - `110.14(C)(1)(b),section,2023,"Over 100 A, or larger than 1 AWG: 75 °C; higher ampacity only if listed and identified",nec-110-14c,verified,`
  - `110.14(C)(2),section,2023,"Separately installed pressure connectors: ampacity at the connector's listed and identified temperature rating",nec-110-14c,verified,`
- **Engine rules the site can now use** (each traced to a segment above):
  1. **Column cap:** the column used may not exceed the lowest temperature rating of any connected termination (both ends), the conductor, or any device. [(C) lead-in]
  2. **Default termination rating when the user doesn't know the marking:**
     - circuit rated 100 A or less, or terminals marked for 14–1 AWG: **60 °C column**;
     - circuit rated over 100 A, or terminals marked for conductors larger than 1 AWG: **75 °C column**.
     [(C)(1)(a), (b)]
  3. **75 °C column for a 100 A-or-less circuit** only when the equipment at every termination is "listed and identified for use with such conductors". This should be a user confirmation, never a silent default. [(a)(3)]
  4. **90 °C ampacity at any size** only when the equipment is listed and identified for it. [(a)(3), (b)(2)]
  5. **Motors marked design letter B, C or D:** 75 °C (or higher) insulation may be used at the 75 °C ampacity, even at 100 A or less. [(a)(4)]
  6. **Derating with higher-rated conductors:** a 90 °C conductor may start from its own column for correction and adjustment, but the final ampacity may not exceed the termination column's ampacity for that size. [(C) lead-in sentence 2; (a)(2); (b)(2)]
  7. **Ampacity basis:** ampacities used for terminations come from Table 310.16 (as modified by 310.12), unless the equipment is listed and marked otherwise. [(C)(1) lead-in]
  8. **Separately installed pressure connectors** are limited to their own listed and identified temperature rating. [(C)(2)]
- This also **unlocks the held-wave "75 °C column" feature** (held-waves-rules.md §1), within rules 2–4.
- The golden cases that say "termination-temperature limit not applied until 110.14(C) is sourced" need regeneration by chat.
- **Contradicts current site copy, not data files** (lines per REVIEW-WSZ-002.md):
  - wire-size-calculator/page.tsx:188, "This assumes 75°C rated conductors and terminations, which is standard…". Under (C)(1)(a), 60 °C is the default for circuits of 100 A or less and for 14–1 AWG terminations; 75 °C needs listed-and-identified equipment.
  - wire-size-for-100-amp meta, "100A subpanel: 3 AWG copper, 1 AWG aluminum at 75°C". A 100 A circuit is "100 amperes or less", so 3 AWG Cu needs 75 °C listed-and-identified terminations at both ends.
  - page-specs-held.md says "unless the equipment is listed for 75 °C". Tighten it to "listed and identified for use with 75 °C conductors, at every termination".

### nec-cable-rules: stays **GAP**
- **Notes line to use:** "Round 4: no 2023-cycle Second Revision on 334.80, 340.80, 310.15(E) or 310.15(F) (NFPA A2022 CMP-6 SR list through SR-8446, single pull); CMP-6 (not CMP-3) owned Articles 320–340 in the 2023 cycle; national 2023 text of all four still unverified; WA WAC 296-46B-334(8) and MA 527 CMR 12.00 deviations verified (state-only)."
- **No data file yet.** The WA/MA deviations stay in nec-continuous-load-2023.json `state_amendments`.
- **Engine consequences while it stays GAP:**
  - **Wiring method = NM:** never offer the 75 °C column, even with 75 °C-listed terminations. 334.80 is unverified and may forbid it.
  - For NM circuits of 100 A or less, the 60 °C answer can be cited to 110.14(C)(1)(a) as the default termination rule. It cannot be cited to 334.80.
  - **NM/UF derating** ("90 °C for adjustment, capped at 60 °C") and the bundling and thermal-insulation adjustments: HOLD. Do not render.
  - **Current-carrying conductor count:** the tool must take the count from the user. Pages must not state when a neutral counts or that the EGC is excluded until 310.15(E)/(F) are verified.

### Other
- PREAMBLE.md's panel list "CMP-3 300/334/340" is wrong for the 2023 and 2026 cycles: cables sit with CMP-6.
- The 2023-cycle SD PC files are named `70_A2022_NEC_Pnn_SD_PCStatements.pdf` (seen for P02, P03, P09, P10, P11, P14). PREAMBLE-R4's `_SD_PCSubmittals.pdf` was not seen.

---

## 8. Blocked or failed log

**docinfofiles.nfpa.org**
- `70_A2025_NEC_P01_FD_PrelimFR.pdf` (fetch 4): not empty, but **inconclusive**. Only global and detail FRs are present (§2.6).
- `70_A2022_NEC_P06_FD_BallotFinal.pdf` (fetch 5): visible only to p. 8 of 194, because global FR-8304 fills the window. Nothing on 310.15, 334 or 340.
- `70_A2022_NEC_P06_SD_PCStatements.pdf` (fetch 6): **CLIENT_ERROR** "There was an error while fetching." The name was built from the P02/P03/P09/P10/P11/P14 pattern. A 404 cannot be told from a block. Host budget then spent.

**Other hosts, fetched but no target text**
- ecmweb.com "TIA Proposed for 2023 NEC Regarding Short-Circuit Current Rating" (15 Mar 2023): it is TIA Log 1699 (408.6), not 1695.
- campbellcountywy.gov DocumentCenter/View/217: 2017 NEC excerpts.
- iaeimagazine.org "The Reorganization of NEC Article 310" (2021): 2020 NEC, no 310.15(E)/(F).
- ecmag.com Krueger 2026 Article 90–130 changes: no 110.14 (used as a tier-4 signal only).
- forums.mikeholt.com "2026 NEC MN-B Cable Changes": tier 4 context only.

**WebSearch: 24 of 24**
1. "110.14(C)" "reprinted with permission" 2023: industrialmonitordirect only.
2. IAEI 110.14(C) 2023: IAEI article from 2000; ecmag.
3. "110.14(C)(1)(a)" "design letters" permission: found the A2022 FD PI report names (P03 rev_1106, P11 rev_1116).
4. docinfofiles "Separate Connector Provisions": generic list of A2022 SD SR files.
5. "334.80" "reprinted with permission": forums.
6. docinfofiles "334.80" NFPA 70-2021: generic.
7. 110.14(C) quoted 60 °C phrases: ecmag, forums.
8. docinfofiles 2022 NITMAM: 2022_Submitter_Substantiations_Committee_Statements_Part_2.pdf; CAM amendment ballots for P03 (70-53) and P09 (70-115).
9. 334.80 quoted 60 °C sentence: tier 4.
10. docinfofiles FR P06 334.80/310.15(E): nothing.
11. Motions Committee 2022 (exact title): not found (only the A2023 and A2024 reports).
12. CAM amendment ballots CMP-1/CMP-6: none; P06 Log1478 TIA documents.
13. "Confirmed Results" 2022: amendment ballots for P03 70-53, P16 70-48, P09 70-115.
14. CAMs on 110.14/334.80/310.15: P01 Log1695 TIA ballot files; P08 FD PI report.
15. TIA 1695: EC&M TIA 1699 article.
16. Motions Committee "Annual 2022": 70_A2022_NEC_AAC_SD_SCRreport.pdf.
17. 2022 Technical Meeting results: A2022 P06 and P05 FD BallotFinal.
18. 310.15(E)/(F) quoted: forums; Campbell County.
19. A2022 P06 PC file name: PCStatements pattern (P06 itself not listed).
20. 2026 NEC 110.14(C): ecmag 2026 Article 90–130 article; MN DLI 2026 minutes; Utah CE outlines; WSR 25-23-069.
21. 334.80 90 °C sentence quoted: tier 4.
22. UL DIVQ terminal marking: forums and Eaton/Schneider product pages; not fetched.
23. IAEI NM/310.15(E): 2021 Article 310 reorganization article.
24. "The ampacity of Types NM and NMC cable shall be determined…": forums.

---

## 9. Open gaps

1. **110.14(C) condition 3:**
   - the 2022 CAM list (Motions Committee report for the 2022 meeting, name unknown, or `2022_Submitter_Substantiations_Committee_Statements_Part_1.pdf`/`_Part_2.pdf`);
   - Standards Council decisions issuing NFPA 70-2023 (Aug 2022);
   - the CC report `70_A2022_NEC_AAC_SD_SCRreport.pdf`;
   - Errata 70-23-1 to 70-23-6.

   Also needed: a third pull of SR-7793 for the single-pull pieces (headings, the (C)(1) first sentence, (a)(1)).
2. **110.14(C), 2026 First Draft stage:**
   - Section-level FRs are not in `70_A2025_NEC_P01_FD_PrelimFR.pdf`.
   - Next: a CMP-1 A2025 FD ballot or FR report (name unknown; ballots can be swamped by global FRs), or a 2026 reprint with an NFPA notice.
   - Tier 4 shows no change.
3. **334.80 and 340.80, 2023 national text:**
   - Routes left: the A2022 CMP-6 PC file (confirm its real name first); a 2023 reprint with an NFPA notice (none found in 24 searches); a government handout quoting it verbatim.
   - The A2025 P06 PI file is too long to reach Article 334.
4. **310.15(E) and (F), 2023 text:** same routes. A 2023-cycle FR on them is still possible, because the FD ballot window ended on p. 8.
5. **UL DIVQ 60/75 °C terminal marking note** (optional): not obtained.
6. **TIA Log 1695** (CMP-1, 2023 edition, not issued): subject unknown. Low priority.

## Sources (tier 1–3 used for findings)
- [NFPA CMP-1 Second Revisions, 2023 cycle (A2022)](https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P01_SD_SRStatements.pdf)
- [NFPA CMP-6 Second Revisions, 2023 cycle (A2022)](https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_SD_SRStatements.pdf)
- [NFPA CMP-6 First Draft ballot, 2023 cycle](https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P06_FD_BallotFinal.pdf)
- [NFPA CMP-1 First Draft working draft, 2026 cycle](https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_FD_PrelimFR.pdf)
- [NFPA 2023 TIAs 23-1 to 23-13 (NJ DCA)](https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf)

Tier 4 (context only):
- [EC Magazine, 2026 Articles 90–130 changes](https://www.ecmag.com/magazine/articles/article-detail/building-the-foundation--key-changes-to-articles-90-130-of-the-2026-nec)
- [Mike Holt forum, 2026 NM-B changes](https://forums.mikeholt.com/threads/2026-nec-mn-b-cable-changes.2590444)
- [EC&M TIA 1699 article](https://www.ecmweb.com/national-electrical-code/article/21262027/tia-proposed-for-2023-nec-regarding-short-circuit-current-rating)
- [IAEI Article 310 reorganization (2021)](https://iaeimagazine.org/issue/july-august-2021/the-reorganization-of-nec-article-310/)
