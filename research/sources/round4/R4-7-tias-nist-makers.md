# R4-7: TIA and errata sweep (NFPA 70-2023), NBS HB100 19 AWG, Franklin AIM 2026, NEMA 6-30R, pool-pump amps, water-heater breakers

Agent R4-7 · round 4 · report written 2026-10-24.

**Retrieval dates.** Work before the session-limit pause was fetched on **2026-10-20**. The rest was fetched on **2026-10-24**: Errata 70-23-5, the Hayward pages, the State sheet and the Bradford White page. Each row says which date applies. The preamble asks for "2026-10-20" on every retrieval, but this report records the real dates.

**Budgets.**
- WebSearch: **24 of 24** used (17 before the pause, 7 after).
- docinfofiles.nfpa.org: **12 of 12** in the original budget, all sent.
  - 9 returned documents.
  - 3 returned CLIENT_ERROR: Errata_70_23_5 twice, Errata_70_23_6 once. These were wrong file names.
- docinfofiles.nfpa.org, the 8 extra fetches the coordinator granted on 2026-10-24 for errata:
  - **1 sent**: "Errata 70_23_5.pdf", which worked.
  - **2 refused by the session URL allowlist, not sent**: Errata_70_23_7 and "Errata 70_23_6".
- No HTTP 429 at any point.

**Coordinator exchange (2026-10-24).**
- After the pause the coordinator asked for a full restart.
- I replied that the earlier results were intact and that a restart would spend the capped budgets a second time.
- The coordinator agreed to continue from context and granted the 8 errata fetches.
- After the pause, WebFetch accepted only URLs that a search in the new session had returned. That blocked the constructed NFPA errata URLs.

---

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1a | TIAs 23-1 to 23-20 on NFPA 70-2023 | **VERIFIED-2023** (TIA documents) | 23-1 to 23-13: NJ DCA reproduction. 23-14, 15, 16, 18, 19, 20: NFPA files. 23-17: R3-4 | **No data/verified value changes.** TIA 23-3 changes the **210.8(F) rule**: Exception No. 2 for listed HVAC equipment **expired Sept 1, 2026**. 23-21 and up: not fetched |
| 1b | Errata 70-23-1 to -5 and -9 | **VERIFIED-2023** (NFPA errata files) | 1, 2: R3-3. 3, 4, 5, 9: this run | None touches a target section or value |
| 1c | Errata 70-23-6, -7, -8 | **UNVERIFIED** (not read) | Indiana DHS compiled proposals (state government): NFPA Correlating Committee corrections at **250.122(D)(2)** and **695.4(B)(3)**, outside errata 1–5 (erratum numbers unseen) | File names are irregular. The allowlist refuses constructed URLs. The 250.122(D)(2) fix is a cross-reference only, so no Table 250.122 value changes |
| 1d | Errata 70-23-10 and up | **NOT CHECKED** | n/a | Allowlist and search index |
| 2 | HB100 Table 5, 19 AWG area | Table 5 cell **UNVERIFIED** (text layer "1200"; glyph not seen). **HB100 Table 6 prints 19 AWG = "1290"** in the OCR text, and two pulls agree | Internet Archive `copperwiretables100unit` (hOCR and PDF); NIST PDF | The IA scan is **not independent** of the NIST PDF: the text layers are identical, OCR errors included. HathiTrust is blocked (permission); Google Books is robots-blocked |
| 3 | Franklin AIM 2026, cable and fuse pages | **UNVERIFIED** | none reachable | No new copy. Changes from 2015: **unknown** |
| 4 | NEMA 6-30R | **VERIFIED (mfr)**, two makers agree | Hubbell HBL9330 spec sheet (REV 5/2026); Leviton 5372-IG page | 30 A, 250 V, 2-pole 3-wire grounding, NEMA WD-6 |
| 5a | Single-speed pool pump amps, Jandy | **VERIFIED (mfr)**, two pulls | Jandy Stealth manual H0573800_REVY (©2025 Fluidra) | SHPM1.0, 1.5, 2.0 and SHPF1.0, 1.5, 2.0. Amps follow THP, not nominal HP |
| 5b | Single-speed amps, Hayward and Pentair | **UNVERIFIED** | ca.hayward.com product pages show no amps; Pentair: retailer pages only | |
| 5c | Jandy recommended wire and breaker table | **SINGLE PULL** (not for publication) | same Jandy manual, §3.2.1 | The second pull was refused by the allowlist |
| 6 | Water heater (240 V, 4500 W) breaker/fuse and wire size | Breaker **UNVERIFIED**. Non-simultaneous default **VERIFIED (mfr)** for State | State SRESB00115 (© April 2020); Bradford White 238-44422-00Y REV 02/22 (ManualsLib copy) | No maker document reached states a breaker size |

---

## 2. Evidence per target

### 2.1 TIAs against NFPA 70-2023 (sweep 23-1 upward)

**Sources**
- **T-NJ.** "National Electrical Code (NEC), 2023 Edition, NFPA 70, Tentative Interim Amendments" 23-1 to 23-13: the NFPA TIA documents, reproduced by New Jersey DCA.
  - https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf (retrieved 2026-10-20).
  - Notices: TIA 23-1 "Copyright © 2021 All Rights Reserved"; 23-2 to 23-7 "Copyright © 2022 All Rights Reserved"; 23-8 to 23-13 "Copyright © 2023 All Rights Reserved" (NATIONAL FIRE PROTECTION ASSOCIATION).
  - This list matches R4-1's list of 23-1 to 23-13. NJ DCA is a free host, so the confirmation cost no NFPA fetch.
- **T-NFPA.** NFPA, TIA_70_23_14, _15, _16, _18, _19 and _20 (https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_N.pdf), retrieved 2026-10-20.
  - Each reads "NFPA 70, National Electrical Code, 2023 Edition" and carries "Copyright © [2023|2024|2025] All Rights Reserved".
- **TIA 23-17**: carried from R3-4 (NFPA TIA_70_23_17.pdf, Log #1809, SC 25-4-6). Not re-fetched.

| TIA | Log | Reference (as printed) | Issued | Effective | One-line summary |
|---|---|---|---|---|---|
| 23-1 | 1608 | 250.114(3)e and 250.114(4)e | Dec 8, 2021 | Dec 28, 2021 | Grounding of cord-and-plug portable handlamps and luminaires |
| 23-2 | 1617 | Article 100 (Ignitible Fibers/Flyings), 506.5, and 506.9(B) | Apr 12, 2022 | May 2, 2022 | Ignitible fibers/flyings definition; Zone 20–22 classification and listing |
| 23-3 | 1654 | 210.8(F) and Exception No. 2(new) | Aug 12, 2022 | Sep 1, 2022 | Dwelling outdoor-outlet GFCI; listed-HVAC exception expiring Sept 1, 2026 |
| 23-4 | 1655 | 215.15 | Aug 12, 2022 | Sep 1, 2022 | Barriers for busbars/terminals fed by feeder taps or transformer secondaries |
| 23-5 | 1659 | 555.30 | Aug 12, 2022 | Sep 1, 2022 | Docking facilities: equipment heights; floating-structure splices |
| 23-6 | 1660 | 555.35 | Aug 12, 2022 | Sep 1, 2022 | Docking facilities: ground-fault protection |
| 23-7 | 1678 | Table C.18, Table C.19 and Table C.20 | Dec 8, 2022 | Dec 28, 2022 | Annex C cable-tray table headers |
| 23-8 | 1688 | 300.26 | Mar 21, 2023 | Apr 10, 2023 | Remote-control and signaling circuit classification |
| 23-9 | 1687 | Definition of Pool, and 680.26 | Mar 21, 2023 | Apr 10, 2023 | Pool definition; equipotential bonding and perimeter surfaces |
| 23-10 | 1690 | 314.29(A) | Mar 21, 2023 | Apr 10, 2023 | Accessibility of recessed boxes and conduit bodies |
| 23-11 | 1692 | 700.32(C), 701.32(C), and 708.54(C) | Aug 25, 2023 | Sep 14, 2023 | Selective-coordination informational notes and figure titles |
| 23-12 | 1699 | 408.6 | Aug 25, 2023 | Sep 14, 2023 | SCCR; field marking of available fault current |
| 23-13 | 1731 | 400.47 | Aug 25, 2023 | Sep 14, 2023 | Bending radius of portable power feeder cables |
| 23-14 | 1752 | 517.30(B)(3)(a) | Nov 30, 2023 | Dec 20, 2023 | Fuel cells as EES alternate source: which Parts of Art. 692 apply ("Parts I through VI VII", flattened) |
| 23-15 | 1753 | 210.70 | Nov 30, 2023 | Dec 20, 2023 | Battery-powered lighting switch/control: notification of impending battery depletion (flattened; wording UNVERIFIED) |
| 23-16 | 1800 | 680.43, Exception No. 3 | Dec 4, 2024 | Dec 24, 2024 | Deletes 680.43 Exception No. 3 (indoor spas/hot tubs) |
| 23-17 | 1809 | 680.21(C) | Apr 10, 2025 | Apr 30, 2025 | Pool-motor ground-fault protection per 680.5(B)/(C); none between ASD output and motor (R3-4) |
| 23-18 | 1820 | 314.29(A) | Aug 20, 2025 | Sep 9, 2025 | Recessed boxes: access openings; new exception for nonmetallic device boxes |
| 23-19 | 1821 | 315.6 | Aug 20, 2025 | Sep 9, 2025 | Type MV cables and accessories shall be listed; joint/termination date printed "20262029" (flattened) |
| 23-20 | 1843 | 430.132(new) | Aug 20, 2025 | Sep 9, 2025 | No GFCI/SPGFCI between power-conversion-equipment output and motor |
| 23-21 and up | n/a | n/a | n/a | n/a | **Not fetched.** The original budget ran out, and the allowlist then refused constructed URLs. None of the 10 TIA/errata searches surfaced a 23-21 file (one query named "TIA 70 23 21"); they surfaced TIA_70_23_3, _12 and _20 |

**Key quotes**
- **TIA 23-3** (T-NJ, one pull):
  - "Exception No. 2: GFCI protection shall not be required for listed HVAC equipment."
  - " This exception shall expire September 1, 2026."
  - Full 210.8(F) segments are in JSON block 3.
- **TIA 23-20**:
  - "430.132 GFCI and SPGFCI Between Power Conversion Equipment and Motors. Ground-fault circuit interrupters"
  - "and special purpose ground-fault circuit interrupters shall not be installed between power conversion"
  - "equipment output terminals and the motor."
- **TIA 23-16**:
  - "Reference: 680.43, Exception No. 3"
  - "680.43 Indoor Installations. A spa or hot tub installed indoors shall comply with the provisions of Parts I"
  - The deleted exception text was summarized by the extractor, not quoted.
- **TIA 23-19**: "shall be effective January 1, 20262029." The redline is flattened. Reading it as 2026 struck and 2029 inserted is an inference.

### 2.2 Errata against NFPA 70-2023 (sweep 70-23-1 upward)

| Erratum | Issued | Corrects | Source | Status |
|---|---|---|---|---|
| 70-23-1 | Sep 1, 2022 ("First Printing Only") | 210.11(C)(3) Exception; 210.11(C)(4) Exception No. 2 | R3-3 (NFPA Errata_70_23_1.pdf) | VERIFIED-2023 |
| 70-23-2 | Sep 15, 2022 | 555.53; 702.4(A)(2); Annex C listing of tables (page numbers) | R3-3 (NFPA Errata_70_23_2.pdf) | VERIFIED-2023 |
| 70-23-3 | Mar 24, 2023 | Table 225.3 (one line deleted); 395.30(C)(3); 501.15(D); 513.7(F); 513.10(B); 517.71(C); 550.18(B)(3) | NFPA Errata_70_23_3.pdf (2026-10-20) | VERIFIED-2023 |
| 70-23-4 | May 2, 2023 | 701.12(I): "shall comply with 701.12(H) 700.12(H)." | NFPA Errata_70_23_4.pdf (2026-10-20) | VERIFIED-2023 |
| 70-23-5 | Sep 14, 2023 | 250.24(D): "with 250.24(C)(1) and 250.24(D)(1) through (D)(4)." | NFPA "Errata 70_23_5.pdf" (**space in file name**; 2026-10-24) | VERIFIED-2023 |
| 70-23-6, -7, -8 | not seen | Probably include 250.122(D)(2) (add "(a)" after "430.52(C)(1)", delete "Exception No. 1") and 695.4(B)(3) ("(f) Item (4)" → "Item (4)"); numbers unseen | Indiana DHS, "Electrical Codes 2023 Edition - NFPA 70" compiled proposals, forms dated 01/30/24, reason "Correcting an error in the first printing of this standard, as submitted by the NEC Correlating Committee of NFPA." https://secure.in.gov/dhs/files/March-Proposals-Compiled.pdf (single pull; the extractor warned of garbled text) | UNVERIFIED |
| 70-23-9 | Aug 12, 2025 | 240.86(C) ("(C) Motor Contribution. Series ratings shall not be used where in the following situations:"); 551.4(A) ("not used for the purposes as defined in 551.2 Article 100,") | NFPA Errata_70_23_9.pdf (2026-10-20). HFM weekly update Aug 18, 2025 (tier 4) agrees: "Errata 70-23-9 … were issued Aug. 12" | VERIFIED-2023 |
| 70-23-10 and up | n/a | n/a | n/a | NOT CHECKED |

**Notices**
- Errata 3–5: "Copyright © 2023 All Rights Reserved" / "NATIONAL FIRE PROTECTION ASSOCIATION".
- Errata 9: "Copyright © 2025 All Rights Reserved".

**File-name finding.** NFPA errata names are irregular.
- A host-restricted search on 2026-10-24 returned `Errata_70_23_03.pdf` (zero-padded) and `Errata%2070_23_5.pdf` (space instead of underscore).
- The earlier CLIENT_ERRORs on `Errata_70_23_5.pdf` and `_6.pdf` were therefore wrong names, not missing errata.
- So "two consecutive missing numbers" was **not** reached. The sweep is incomplete, not finished.

**Not NFPA errata: the Oregon "Errata" rows.**
- Oregon's 2023 OESC Table 1-E (https://www.oregon.gov/bcd/codes-stand/Documents/23oesc-table1-E.pdf, "Amended to include errata Jan. 1, 2025") labels eight rows "Errata". They cover 110.26(C)(3), 210.8(A), 210.8(B), 340.24, 393.14(A), 547.28, 551.71(C) and 700.
- These are **Oregon's own amendment language**. For example, the 210.8(A) row has "(5) Unfinished portions or areas of basements not intended as habitable rooms" and "Not adopted by the State of Oregon" against item (7).
- They are not NFPA errata. Oregon moved to the 2026 OESC on Oct 1, 2026, so this table is now historical.

### 2.3 Section-by-section result against S/pack/data/verified/

| Data file / rule | TIA or erratum that touches it | Effect on site values |
|---|---|---|
| nec-310-16.json, nec-310-12.json, nec-310-15-B-1-1.json, nec-310-15-C-1.json | none | none |
| nec-240-6-a.json, nec-240-4-d.json | none (Errata 9 is 240.86(C)) | none |
| nec-250-122.json | erratum after 70-23-5 (number unseen): 250.122(D)(2) cross-reference only | none (Table 250.122 rows and 250.122(B) untouched) |
| nec-250-66.json | none (Errata 5 is 250.24(D)) | none |
| nec-220-2023.json (Article 220) | none | none |
| nec-430-440-2023.json (Tables 430.247–430.250, 430.52) | TIA 23-20 adds new 430.132 (no table change) | none; optional new rule for pool/motor pages |
| 210.8 (allowlist, nec-2023-rule-excerpts) | **TIA 23-3**, 210.8(F) Ex. 2 | Rule changes: HVAC exception existed Sep 1, 2022 – Sep 1, 2026; **expired now**. Threshold values (150 V, 50 A) unchanged |
| nec-continuous-load-2023.json (210.19/210.20, 215.2/215.3, 230.42) | none (TIA 23-4 is 215.15; 23-15 is 210.70) | none |
| nec-314-16.json | none (TIAs 23-10 and 23-18 are 314.29(A)) | none |
| nec-2023-rules-round2.json, 680.21(C)/680.5 | TIA 23-17 (known; already applied); TIA 23-9 (680.26, already applied); TIA 23-16 (680.43, not in data) | none |
| Article 625 items | none | none |

Coverage caveats: errata 70-23-6 to -8 and -10 and up are unread. The Indiana list, as of Jan–Mar 2024, shows nothing on a target section beyond the 250.122(D)(2) cross-reference.

### 2.4 NBS Handbook 100, Table 5, 19 AWG

**Documents**
- NBS Handbook 100, *Copper Wire Tables*, issued Feb 21, 1966. US government work; no notice captured.
- **NIST PDF:** https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf (2026-10-20).
- **Internet Archive item `copperwiretables100unit`.**
  - Metadata: contributor and sponsor "NIST Research Library"; scanned at scribe4.beltsville.archive.org; scan date 20180105150255; Canon EOS 5D Mark II; 350 ppi; 54 images; call number "QC1 .U51 no. 100 1966".
  - Files read: the IA PDF https://dn760005.eu.archive.org/0/items/copperwiretables100unit/copperwiretables100unit.pdf and the hOCR https://ia800401.us.archive.org/27/items/copperwiretables100unit/copperwiretables100unit_hocr.html (both 2026-10-20).

**Independence check: failed.**
- The IA PDF and the NIST PDF have **identical** text layers.
- Both start "KTL INST OF STANDARDS & TECH FUC" and share "arid making".
- Both give the same Table 5 row 19 token for token.
- The IA copy is therefore the same scan and OCR lineage as NIST's file, not an independent scan.

**Raw OCR lines (hOCR, two pulls agree)**
- Table 5 heading: "Table 5. Wire table, standard annealed copper" / "American Wire Gage. English units. Values at 20 °C."
- Table 5 row 19: `19 35.9 1200 .001 01 8.05 124 3.90 256 2.06 .485`. The NIST PDF and the IA PDF read the same.
- Table 6 title: "Table 6. Wire table, standard annealed copper American Wire Gage. English units. Ohms per 1,000 feet. 0 to 200 °C."
- Table 6 header: "Gage Diam- Cross section at 20 °C Ohms per 1,000 feet 14 at the temperature of — 20 °C mils Circular mils" / "Square inch 0 °C 20 °C 25 °C 50 °C 75 °C 100 °C 200 °C"
- **Table 6 row 19: `19 35.9 1290 .001 01 7.41 8.05 8.21 9.00 9.79 10.6 13.7`**

**Consistency (python3 -I; nothing corrected)**
- In rows 17, 18, 20 and 21, Table 6 matches Table 5 token for token in diameter, circular mils and square inches.
- Table 6's 20 °C ohms equal Table 5's ohms for gauges 17–21.
- Row 19 is the **only** mismatch, and only in the circular-mil cell: Table 5 "1200", Table 6 "1290".
- 35.9² = 1288.81.

**Reading**
- HB100 itself prints 1290 cmil for 19 AWG in Table 6 (p. 17), as read by OCR.
- The Table 5 cell is either an OCR misread or a misprint. Its glyph is still unseen.

**Routes that failed** (details in §5)
- HathiTrust catalog and babel: PROVENANCE_REQUIRED.
- Google Books: ROBOTS_DISALLOWED. Books API: CLIENT_ERROR.
- IA djvu.txt: WebFetch text stops at 63,536 characters (about p. 10).
- IA page image: SERVER_ERROR. IA inside-search: PROVENANCE_REQUIRED.
- govdocs1 copy: its text layer has no Table 5 rows.
- NTIS NTRL: no download link.

### 2.5 Franklin Electric AIM Manual, 2026

- Two searches (Franklin 2026 cable selection; .gov/.edu copies) returned only copies already known:
  - the Nebraska 2026 copy, whose text ends at p. 40;
  - the 2015 metatek mirror;
  - the 2007 NDEE copy;
  - RCWorst's "feaim_manual23.pdf", a **2023 edition** that was robots-blocked in round 1 and was not retried.
- https://py.franklinwater.com/support/franklin-aim/ lists no downloads, only "Download the AIM App Now!".
- **2026 pp. 49–52 and 57: UNVERIFIED. Changes from 2015: unknown.**

### 2.6 NEMA 6-30R

- **Hubbell**, https://hubbellcdn.com/specsheet/WDK_CA-HBL9330-SPEC-EN.pdf (2026-10-20):
  - "WDK_CA-HBL9330-SPEC-EN | REV 5/2026"
  - "© 2026 Hubbell Incorporated. All rights reserved"
  - "Straight Blade Devices, Receptacles, RTP, Industrial Grade, 2-Pole" / "3-Wire Grounding, 30A 250V, 6-30R, Black, Single Pack."
  - Nema Rating "6-30R"; Amperage Rating "30 A"; Voltage Rating "250 V"; "2-Pole"; "3-Wire Grounding"
  - "NEMA® WD-6 Compliant"; "UL Listed File E2186"; "CSA Certified"
- **Leviton**, https://leviton.com/products.5372-ig (2026-10-20):
  - "30 Amp, 250 Volt, 2P, 3W, Flush Mtg Receptacle, Straight Blade, Industrial Grade, Grounding, Orange"
  - "Nema : 6-30R"; "Amperage : 30 A"; "Voltage : 250 VAC"; "Pole : 2"; "Wire : 3"
  - "Grounding : Isolated Ground" (the IG variant)
  - "NEMA : WD-6"; "UL498 : File E13399"
  - No notice captured.
- Result: two manufacturers agree on 30 A, 250 V, 2-pole 3-wire grounding.

### 2.7 Pool pumps, single-speed

**Jandy**
- Document: "Jandy® Stealth™ Pumps | Installation & Operation Manual" (SHPF, SHPM), H0573800_REVY.
- Notice: "©2025 Fluidra. All rights reserved. The trademarks and trade names used herein are the property of their respective owners."
- URL: https://zodiacpoolsystems.com/~/media/43DD98976ABE48C1A8223FBCBFC41E56 (2026-10-20).
- Section 7.4 was read twice and the six rows below matched.

| Model | Nominal HP (model code) | THP | Voltage (printed) | Amps (printed) | Reading by position |
|---|---|---|---|---|---|
| SHPM1.0 | 1.0 | 1.14 | 208-230/115 | 5.4-5.2/10.3 | 5.4 A @208, 5.2 A @230, 10.3 A @115 |
| SHPM1.5 | 1.5 | 1.65 | 208-230/115 | 7.8-7.4/14.8 | 7.8 / 7.4 / 14.8 |
| SHPM2.0 | 2.0 | 2.21 | 208-230 | 9.6-8.8 | 9.6 @208, 8.8 @230; no 115 V |
| SHPF1.0 | 1.0 | 1.65 | 208-230/115 | 7.8-7.4/14.8 | 7.8 / 7.4 / 14.8 |
| SHPF1.5 | 1.5 | 2.21 | 208-230 | 9.6-8.8 | 9.6 / 8.8 |
| SHPF2.0 | 2.0 | 2.60 | 208-230 | 11.0-10.0 | 11.0 / 10.0 |

- The column header is "Amps". No note says full-load, service-factor or maximum.
- The pairing of voltage and amps by position is inferred from the layout, not stated in the manual.
- Section 1.2: "Overloads shall be set at a maximum of 125% of the full-load current rating of the pump motor assembly."
- **Finding:** a nominal "1 HP" pump can draw 10.3 A (SHPM1.0, 1.14 THP) or 14.8 A (SHPF1.0, 1.65 THP) at 115 V. Nominal HP is not a load input.

**Jandy §3.2.1 wire/breaker table (single pull)**
- Heading: "RECOMMENDED MINIMUM WIRE SIZE FOR SHP PUMPS* (1-PHASE POWER)"
- Note: "*Assumes three (3) copper conductors in a buried conduit and 3% maximum voltage loss in branch circuit."
- Example row: "SHPF1.0 / SHPM1.5 15A 20A 12 10 10 8 8 6 6 4"
- Column order is in JSON block 9. A second pull was refused by the allowlist on 2026-10-24.

**Hayward** (ca.hayward.com, 2026-10-24)
- MaxFlo XL SP2305X7: "Total HP" "0.95 HP", title "3/4HP", "Voltage at 60 Hz" "115/208-230", **no amps**.
- TriStar XE SP3210X15XE: "Total HP | 1.85 HP", "Voltage at 60 Hz | 230/115", **no amps**.
- Round 1 found the Super Pump manual defers to the motor nameplate.

**Pentair**
- Two searches returned only retailer and distributor pages (Leslie's, pool360, Walmart, inyopools) and spam mirrors. **UNVERIFIED.**

### 2.8 Electric water heaters, 240 V 4500 W dual element

- **State Water Heaters (A.O. Smith brand)**, "Residential Electric Element Availability Sheet", SRESB00115, "© April 2020 State Water Heaters. All Rights Reserved"
  - URL: https://assets.statewaterheaters.com/damroot/Original/10001/SRESB00115.pdf (2026-10-24).
  - "Element operation shall be double element, non-simultaneous (unless ordered differently)."
  - "Caution should be taken when ordering P4 Circuit (simultaneous operation) to ensure breaker amperage is sufficient"
  - "Note: Simultaneous operation doubles recovery"
  - **No breaker, fuse or AWG values.**
- **Bradford White**, "ELECTRIC WATER HEATER INSTRUCTION MANUAL", 238-44422-00Y REV 02/22, as a ManualsLib copy (third-party aggregator; partial text visible)
  - URL: https://www.manualslib.com/manual/3068355/Bradford-White-Re250ln6-1ncww.html (2026-10-24).
  - Only: "Check the rating plate and wiring diagram before proceeding."
  - **No breaker or wire size seen.**
- **American Water Heaters**: nresb00115 resolved to a media-library index page with no data.
- **Rheem**: searches returned only aggregator viewers. mans.io failed (CLIENT_ERROR).
- **Result:** breaker size still UNVERIFIED for every maker checked (Rheem, A.O. Smith, State, Bradford White). Wire size is still only A.O. Smith's "Use 10 gauge solid copper wire." (round 1).

---

## 3. Machine-readable

One JSON block per rule or table. Each block was validated with `python3 -I -c "import json,sys; json.loads(sys.stdin.read())"` (files in research2/r4_tmp/r4_7/).

```json
{"ref":"NFPA 70-2023 Tentative Interim Amendments 23-1 to 23-20 (sweep)","edition":"NFPA 70-2023","status":"VERIFIED-2023 (TIA documents): 23-1..23-13 via NJ DCA reproduction of the NFPA TIAs; 23-14, 23-15, 23-16, 23-18, 23-19, 23-20 via NFPA files; 23-17 carried from R3-4 (NFPA file, not re-fetched). 23-21 and up: not fetched","values":[
 {"tia":"23-1","log":1608,"reference":"250.114(3)e and 250.114(4)e","issued":"2021-12-08","effective":"2021-12-28","summary":"Cord-and-plug equipment grounding: portable handlamps and portable luminaires","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-2","log":1617,"reference":"Article 100 (Ignitible Fibers/Flyings), 506.5, and 506.9(B)","issued":"2022-04-12","effective":"2022-05-02","summary":"Adds ignitible fibers/flyings definition; Zone 20/21/22 classification and listing","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-3","log":1654,"reference":"210.8(F) and Exception No. 2(new)","issued":"2022-08-12","effective":"2022-09-01","summary":"Dwelling outdoor outlets GFCI; new Exception No. 2 for listed HVAC equipment, expiring September 1, 2026","source":"NJ DCA","changes_site_data":false,"changes_site_rule":"210.8(F) (allowlist line 14, domain nec-2023-rule-excerpts): exception existed 2022-09-01 to 2026-09-01; expired now"},
 {"tia":"23-4","log":1655,"reference":"215.15","issued":"2022-08-12","effective":"2022-09-01","summary":"Barriers for energized busbars/terminals supplied by feeder taps or transformer secondaries","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-5","log":1659,"reference":"555.30","issued":"2022-08-12","effective":"2022-09-01","summary":"Docking facilities: equipment heights/locations; floating-structure splices","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-6","log":1660,"reference":"555.35","issued":"2022-08-12","effective":"2022-09-01","summary":"Docking facilities: ground-fault protection","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-7","log":1678,"reference":"Table C.18, Table C.19 and Table C.20","issued":"2022-12-08","effective":"2022-12-28","summary":"Headers of three Annex C cable-tray tables","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-8","log":1688,"reference":"300.26","issued":"2023-03-21","effective":"2023-04-10","summary":"Classification of remote-control and signaling circuits; non-power-limited circuits","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-9","log":1687,"reference":"Definition of Pool, and 680.26","issued":"2023-03-21","effective":"2023-04-10","summary":"Pool definition; equipotential bonding and perimeter surfaces","source":"NJ DCA","changes_site_data":false,"note":"Already reflected in nec-2023-rules-round2.json item 680.26(B)(2)"},
 {"tia":"23-10","log":1690,"reference":"314.29(A)","issued":"2023-03-21","effective":"2023-04-10","summary":"Accessibility of recessed boxes and conduit bodies","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-11","log":1692,"reference":"700.32(C), 701.32(C), and 708.54(C)","issued":"2023-08-25","effective":"2023-09-14","summary":"Selective coordination informational notes and figure titles","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-12","log":1699,"reference":"408.6","issued":"2023-08-25","effective":"2023-09-14","summary":"Short-circuit current rating; field marking of available fault current","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-13","log":1731,"reference":"400.47","issued":"2023-08-25","effective":"2023-09-14","summary":"Minimum bending radius of portable power feeder cables","source":"NJ DCA","changes_site_data":false},
 {"tia":"23-14","log":1752,"sc":"SC 23-11-9","reference":"517.30(B)(3)(a)","issued":"2023-11-30","effective":"2023-12-20","summary":"Fuel cells as EES alternate source: which Parts of Article 692 apply (text flattened: 'Parts I through VI VII')","source":"NFPA TIA_70_23_14.pdf","changes_site_data":false},
 {"tia":"23-15","log":1753,"sc":"SC 23-11-10","reference":"210.70","issued":"2023-11-30","effective":"2023-12-20","summary":"Battery-powered lighting switch or control: notification of impending battery depletion (flattened redline; exact final wording UNVERIFIED)","source":"NFPA TIA_70_23_15.pdf","changes_site_data":false},
 {"tia":"23-16","log":1800,"sc":"SC 24-12-6","reference":"680.43, Exception No. 3","issued":"2024-12-04","effective":"2024-12-24","summary":"Deletes 680.43 Exception No. 3 (indoor spas and hot tubs; extractor summary, deleted wording not quoted)","source":"NFPA TIA_70_23_16.pdf","changes_site_data":false,"note":"Relevant to the held hot-tub page (680.42-680.44)"},
 {"tia":"23-17","log":1809,"sc":"SC 25-4-6","reference":"680.21(C)","issued":"2025-04-10","effective":"2025-04-30","summary":"Pool motor outlets: ground-fault protection per 680.5(B) or (C); none between ASD output and motor","source":"R3-4 (NFPA TIA_70_23_17.pdf), not re-fetched","changes_site_data":false,"note":"Already in nec-2023-rules-round2.json (680.21(C))"},
 {"tia":"23-18","log":1820,"sc":"SC 25-8-10","reference":"314.29(A)","issued":"2025-08-20","effective":"2025-09-09","summary":"Recessed boxes and conduit bodies: access openings; new exception for nonmetallic device boxes","source":"NFPA TIA_70_23_18.pdf","changes_site_data":false},
 {"tia":"23-19","log":1821,"sc":"SC 25-8-11","reference":"315.6","issued":"2025-08-20","effective":"2025-09-09","summary":"Type MV cables, joints, terminations, connectors and fittings shall be listed; listing date for joints/terminations/connectors printed flattened as '20262029'","source":"NFPA TIA_70_23_19.pdf","changes_site_data":false},
 {"tia":"23-20","log":1843,"sc":"SC 25-8-13","reference":"430.132(new)","issued":"2025-08-20","effective":"2025-09-09","summary":"No GFCI or SPGFCI between power conversion equipment output terminals and the motor","source":"NFPA TIA_70_23_20.pdf","changes_site_data":false,"note":"Same subject as 2026 TIA 26-3; supports the 680.21(C)(2) ASD statement on the pool-pump page"},
 {"tia":"23-21 and up","status":"NOT CHECKED by fetch (NFPA budget, then allowlist); none of the 10 TIA/errata searches (one named 'TIA 70 23 21') surfaced a 23-21 file; they surfaced TIA_70_23_3, _12 and _20"}
],
"touches_data_files":"none",
"quote_segments":["Reference: 210.8(F) and Exception No. 2(new)","Reference: 430.132(new)","Issue Date: August 20, 2025","Effective Date: September 9, 2025","Reference: 680.43, Exception No. 3"],
"source_url":["https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_14.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_15.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_16.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_17.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_18.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_19.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_20.pdf"],
"permission_notice":"Each TIA: 'Copyright © [2021|2022|2023|2024|2025] All Rights Reserved' (NATIONAL FIRE PROTECTION ASSOCIATION)",
"retrieved":"2026-10-20",
"canaries":"not used (metadata and short-text reads of single short documents)"}
```

```json
{"ref":"NFPA 70-2023 Errata 70-23-1 upward (sweep)","edition":"NFPA 70-2023","status":"Errata 1, 2 (R3-3), 3, 4, 5, 9: VERIFIED-2023 (NFPA errata files). Errata 6, 7, 8: NOT READ (file names irregular; constructed URLs refused by the session allowlist). Errata 10 and up: NOT CHECKED","values":[
 {"erratum":"70-23-1","issued":"2022-09-01","corrects":["210.11(C)(3) Exception","210.11(C)(4) Exception No. 2"],"source":"R3-3 (NFPA Errata_70_23_1.pdf)","changes_site_data":false},
 {"erratum":"70-23-2","issued":"2022-09-15","corrects":["555.53","702.4(A)(2)","Annex C listing of tables (page numbers)"],"source":"R3-3 (NFPA Errata_70_23_2.pdf)","changes_site_data":false},
 {"erratum":"70-23-3","issued":"2023-03-24","corrects":["Table 225.3 (deletes one line)","395.30(C)(3) (Table 490.24(a) -> 495.24)","501.15(D) (cross-reference)","513.7(F) (warning text)","513.10(B) (duplicate warning deleted)","517.71(C) (Article 490 -> 495)","550.18(B)(3) (Table 550.18(B) -> 550.18(B)(2))"],"source":"NFPA Errata_70_23_3.pdf","changes_site_data":false},
 {"erratum":"70-23-4","issued":"2023-05-02","corrects":["701.12(I) (reference -> 700.12(H))"],"source":"NFPA Errata_70_23_4.pdf","changes_site_data":false},
 {"erratum":"70-23-5","issued":"2023-09-14","corrects":["250.24(D) (cross-reference: 250.24(C)(1) and 250.24(D)(1) through (D)(4))"],"source":"NFPA 'Errata 70_23_5.pdf' (space in file name)","changes_site_data":false},
 {"erratum":"70-23-6 / 70-23-7 / 70-23-8","issued":null,"corrects_unattributed":["250.122(D)(2): add '(a)' after '430.52(C)(1)', delete 'Exception No. 1'","695.4(B)(3): '(f) Item (4)' -> 'Item (4)'"],"source":"Indiana DHS compiled proposals (state government; forms dated 01/30/24 citing 'NEC Correlating Committee of NFPA'); erratum numbers not seen; extractor warned the text is garbled","status":"UNVERIFIED (numbers and NFPA text not seen)","changes_site_data":false},
 {"erratum":"70-23-9","issued":"2025-08-12","corrects":["240.86(C) (Motor Contribution paragraph, markup artifacts)","551.4(A) (551.2 -> Article 100)"],"source":"NFPA Errata_70_23_9.pdf","changes_site_data":false},
 {"erratum":"70-23-10 and up","status":"NOT CHECKED"}
],
"touches_data_files":"none (for the errata read). 250.122(D)(2) cross-reference fix does not touch Table 250.122 rows or 250.122(B) in nec-250-122.json",
"quote_segments":["Errata No.: 70-23-5","Reference: 250.24(D)","with 250.24(C)(1) and 250.24(D)(1) through (D)(4).","Errata No.: 70-23-9","(C) Motor Contribution. Series ratings shall not be used where in the following situations:","not used for the purposes as defined in 551.2 Article 100,","shall comply with 701.12(H) 700.12(H)."],
"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_3.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_4.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata%2070_23_5.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_9.pdf","https://secure.in.gov/dhs/files/March-Proposals-Compiled.pdf"],
"permission_notice":"Errata 3-5: 'Copyright © 2023 All Rights Reserved' / 'NATIONAL FIRE PROTECTION ASSOCIATION'; Errata 9: 'Copyright © 2025 All Rights Reserved'",
"retrieved":"2026-10-20 (errata 3, 4, 9, Indiana); 2026-10-24 (errata 5)",
"canaries":"not used"}
```

```json
{"ref":"210.8(F) as amended by TIA 23-3","edition":"NFPA 70-2023 (TIA 23-3, issued 2022-08-12, effective 2022-09-01)","status":"VERIFIED-2023 (TIA text, NFPA document reproduced by NJ DCA; one pull)","rule_summary":"Dwelling outdoor outlets on single-phase branch circuits rated 150 V or less to ground and 50 A or less need GFCI, including garages with floors at or below grade, accessory buildings and boathouses; replaced equipment brings the outlet under the rule. Exception No. 1: lighting outlets other than 210.8(C). Exception No. 2: listed HVAC equipment, expired September 1, 2026.","values":{"max_volts_to_ground":150,"max_amperes":50,"hvac_exception":"Exception No. 2, listed HVAC equipment","hvac_exception_expiry":"2026-09-01","hvac_exception_status_on_2026-10-24":"expired"},"quote_segments":["210.8(F) Outdoor Outlets.","For dwellings, all outdoor outlets, other than those covered in 210.8(A), Exception No. 1, including outlets"," rated 150 volts or less to ground, 50 amperes or less, shall be provided with GFCI protection:","(1) Garages that have floors located at or below grade level","(2) Accessory buildings","(3) Boathouses","Exception No. 1: GFCI protection shall not be required on lighting outlets other than those covered in 210.8(C).","Exception No. 2: GFCI protection shall not be required for listed HVAC equipment."," This exception shall expire September 1, 2026."],"source_url":"https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf","source_title":"NFPA 70 2023 Edition Tentative Interim Amendments 1-13 (NFPA documents hosted by New Jersey DCA), TIA 23-3, Log #1654","permission_notice":"Copyright © 2022 All Rights Reserved (NATIONAL FIRE PROTECTION ASSOCIATION)","retrieved":"2026-10-20","canaries":"not used","notes":"NFPA's own TIA_70_23_3.pdf surfaced in search on 2026-10-24 and is now fetchable; not read (extra NFPA fetches were reserved for errata)."}
```

```json
{"ref":"430.132 (new, TIA 23-20)","edition":"NFPA 70-2023 as amended by TIA 23-20 (issued 2025-08-20, effective 2025-09-09)","status":"VERIFIED-2023 (TIA text, NFPA file; one pull)","rule_summary":"GFCIs and SPGFCIs shall not be installed between power conversion equipment output terminals and the motor.","values":{"tia":"23-20","log":1843,"sc":"SC 25-8-13"},"quote_segments":["430.132 GFCI and SPGFCI Between Power Conversion Equipment and Motors. Ground-fault circuit interrupters","and special purpose ground-fault circuit interrupters shall not be installed between power conversion","equipment output terminals and the motor."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_20.pdf","permission_notice":"Copyright © 2025 All Rights Reserved","retrieved":"2026-10-20","canaries":"not used"}
```

```json
{"ref":"NBS Handbook 100 (1966), 19 AWG cross section at 20 °C","edition":"NBS Handbook 100, Copper Wire Tables, issued February 21, 1966","status":"Table 5 cell: UNVERIFIED (text layer reads 1200; printed glyph not seen). Table 6 cell: 1290 seen in the OCR text layer, two pulls agree","values":{"table_5_ocr_area_cmil":"1200","table_6_ocr_area_cmil":"1290","diameter_mils":"35.9","area_sq_in":".001 01","ohm_per_1000ft_20C":"8.05"},"raw_lines":{"table_5_row_19":"19 35.9 1200 .001 01 8.05 124 3.90 256 2.06 .485","table_6_row_19":"19 35.9 1290 .001 01 7.41 8.05 8.21 9.00 9.79 10.6 13.7","table_6_rows_17_18_20_21":["17 45.3 2050 .001 61 4.66 5.05 5.15 5.65 6.15 6.64 8.63","18 40.3 1620 .001 28 5.88 6.39 6.51 7.14 7.77 8.39 10.9","20 32.0 1020 .000 804 9.33 10.1 10.3 11.3 12.3 13.3 17.3","21 28.5 812 .000 638 11.8 12.8 13.0 14.3 15.5 16.8 21.8"]},"quote_segments":["Table 5. Wire table, standard annealed copper","American Wire Gage. English units. Values at 20 °C.","Table 6. Wire table, standard annealed copper American Wire Gage. English units. Ohms per 1,000 feet. 0 to 200 °C.","Gage Diam- Cross section at 20 °C Ohms per 1,000 feet 14 at the temperature of — 20 °C mils Circular mils","Square inch 0 °C 20 °C 25 °C 50 °C 75 °C 100 °C 200 °C"],"scan":{"item":"Internet Archive copperwiretables100unit","scanned":"2018-01-05, scribe4.beltsville.archive.org, Canon EOS 5D Mark II, 350 ppi, 54 images","contributor":"NIST Research Library","call_number":"QC1 .U51 no. 100 1966","independence":"NOT independent of the NIST PDF: the IA PDF and the NIST nvlpubs PDF have identical text layers, including OCR errors ('KTL INST OF STANDARDS & TECH FUC', 'arid making')"},"source_url":["https://ia800401.us.archive.org/27/items/copperwiretables100unit/copperwiretables100unit_hocr.html","https://dn760005.eu.archive.org/0/items/copperwiretables100unit/copperwiretables100unit.pdf","https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf"],"permission_notice":"US government work; no notice captured","retrieved":"2026-10-20","canaries":"not used; consistency check only: Table 6 rows 17, 18, 20, 21 match Table 5 rows token for token in the diameter, cmil and square-inch columns, and Table 6's 20 °C ohms equal Table 5's ohms for 17-21"}
```

```json
{"ref":"Franklin Electric AIM Manual 60 Hz (M1311), 2026 edition: cable selection (p. 49-52) and motor fuses/circuit breakers (p. 57)","edition":"2026","status":"UNVERIFIED","values":[],"changes_vs_2015":"UNKNOWN","quote_segments":[],"source_url":["https://dwee.nebraska.gov/sites/default/files/water/2026_60Hz_AIM_Manual_Submersible_Systems.pdf","https://py.franklinwater.com/support/franklin-aim/"],"permission_notice":null,"retrieved":"2026-10-20","notes":"Two searches found no new copy of the 2026 edition: only the Nebraska copy (text ends at p. 40), the 2015 metatek mirror, the 2007 NDEE copy and a 2023 edition on RCWorst (robots-blocked in round 1). py.franklinwater.com lists no downloads. 2015 Tables 11/11A/14 stay the only verified edition."}
```

```json
{"ref":"NEMA 6-30R configuration","edition":"Manufacturer spec sheets stating NEMA WD 6 compliance (WD 6 itself not read)","status":"VERIFIED (mfr), two manufacturers agree","values":{"config":"6-30R","amps":30,"volts":"250","poles":2,"wires":3,"grounding":true},"quote_segments":["WDK_CA-HBL9330-SPEC-EN | REV 5/2026","Straight Blade Devices, Receptacles, RTP, Industrial Grade, 2-Pole","3-Wire Grounding, 30A 250V, 6-30R, Black, Single Pack.","Nema Rating 6-30R","Amperage Rating 30 A","Voltage Rating 250 V","NEMA® WD-6 Compliant","30 Amp, 250 Volt, 2P, 3W, Flush Mtg Receptacle, Straight Blade, Industrial Grade, Grounding, Orange","Nema : 6-30R","Amperage : 30 A","Voltage : 250 VAC","Pole : 2","Wire : 3","NEMA : WD-6"],"source_url":["https://hubbellcdn.com/specsheet/WDK_CA-HBL9330-SPEC-EN.pdf","https://leviton.com/products.5372-ig"],"permission_notice":"Hubbell: '© 2026 Hubbell Incorporated. All rights reserved'; Leviton page: none captured","retrieved":"2026-10-20","canaries":"not used","notes":"Leviton 5372-IG is the isolated-ground variant ('Grounding : Isolated Ground'); the NEMA configuration and rating are the same. Proposed data row: {\"config\":\"6-30R\",\"amps\":30,\"volts\":\"250\",\"poles\":2,\"wires\":3,\"grounding\":true,\"source\":\"Hubbell HBL9330 spec sheet WDK_CA-HBL9330-SPEC-EN REV 5/2026; Leviton 5372-IG product page\",\"status\":\"VERIFIED (mfr)\"}"}
```

```json
{"ref":"Jandy Stealth single-speed pool pumps (SHPF, SHPM): amps by model","edition":"Jandy Stealth Pumps Installation & Operation Manual H0573800_REVY (©2025 Fluidra)","status":"VERIFIED (mfr): two pulls agree on the six 1-2 HP rows below","amps_column_meaning":"Column header is just 'Amps'; no note says full-load, service-factor or maximum. Voltage '208-230/115' pairs positionally with amps 'a-b/c' (a at 208 V, b at 230 V, c at 115 V); that pairing is inferred from the layout, not stated","values":[
 {"model":"SHPM1.0","thp":1.14,"voltage":"208-230/115","amps_raw":"5.4-5.2/10.3"},
 {"model":"SHPM1.5","thp":1.65,"voltage":"208-230/115","amps_raw":"7.8-7.4/14.8"},
 {"model":"SHPM2.0","thp":2.21,"voltage":"208-230","amps_raw":"9.6-8.8"},
 {"model":"SHPF1.0","thp":1.65,"voltage":"208-230/115","amps_raw":"7.8-7.4/14.8"},
 {"model":"SHPF1.5","thp":2.21,"voltage":"208-230","amps_raw":"9.6-8.8"},
 {"model":"SHPF2.0","thp":2.60,"voltage":"208-230","amps_raw":"11.0-10.0"}
],
"quote_segments":["7.4.2 SHPM Pump Specifications","Model No. THP WEF Voltage Amps Pipe Size Carton Weight Overall Length 'A'","SHPM1.0 1.14 N/A 208-230/115 5.4-5.2/10.3","SHPM1.5 1.65 N/A 208-230/115 7.8-7.4/14.8","SHPM2.0 2.21 N/A 208-230 9.6-8.8","7.4.1 SHPF Pump Specifications","SHPF1.0 1.65 N/A 208-230/115 7.8-7.4/14.8","SHPF1.5 2.21 N/A 208-230 9.6-8.8","SHPF2.0 2.60 N/A 208-230 11.0-10.0"],"source_url":"https://zodiacpoolsystems.com/~/media/43DD98976ABE48C1A8223FBCBFC41E56","permission_notice":"©2025 Fluidra. All rights reserved. The trademarks and trade names used herein are the property of their respective owners.","retrieved":"2026-10-20","canaries":"not used","notes":"Nominal HP is not a load: SHPM1.5 and SHPF1.0 are the same 1.65 THP pump (7.8-7.4/14.8 A). No 2.0 HP model is rated for 115 V. Hayward and Pentair single-speed amps: not found in manufacturer documents (see 10_hayward_pentair.json)."}
```

```json
{"ref":"Jandy Stealth pumps: recommended minimum wire size and breaker/fuse (1-phase), Section 3.2.1","edition":"H0573800_REVY (©2025 Fluidra)","status":"SINGLE PULL: not verified for publication (a second pull was refused by the session allowlist on 2026-10-24)","basis_note":"*Assumes three (3) copper conductors in a buried conduit and 3% maximum voltage loss in branch circuit.","column_order_as_extracted":["Pump Model","Breaker/fuse A at 208-230 VAC","Breaker/fuse A at 115 VAC","0-50 ft AWG 208-230","0-50 ft AWG 115","50-100 ft AWG 208-230","50-100 ft AWG 115","100-150 ft AWG 208-230","100-150 ft AWG 115","150-200 ft AWG 208-230","150-200 ft AWG 115"],"raw_rows":["SHPF.75 / SHPM1.0 15A 15A 14 12 12 8 10 6 8 6","SHPF1.0 / SHPM1.5 15A 20A 12 10 10 8 8 6 6 4","SHPF1.5 / SHPM2.0 15A N/A 12 N/A 10 N/A 8 N/A 6 N/A","SHPF2.0 / SHPM2.5 15A N/A 12 N/A 8 N/A 6 N/A 6 N/A"],"quote_segments":["RECOMMENDED MINIMUM WIRE SIZE FOR SHP PUMPS* (1-PHASE POWER)","Inverse - Time Circuit Breaker or Branch Fuse AMPs","Class: CC, G, H, J, K, RK, or T","Table shows minimum wire size and branch fuse recommendations for a typical installation per NEC.","**Two-speed pumps are not rated for use with 208 VAC."],"source_url":"https://zodiacpoolsystems.com/~/media/43DD98976ABE48C1A8223FBCBFC41E56","permission_notice":"©2025 Fluidra. All rights reserved.","retrieved":"2026-10-20","canaries":"not used"}
```

```json
{"ref":"Hayward and Pentair single-speed pool pump amps (1, 1.5, 2 HP)","edition":"current product pages (ca.hayward.com); no Pentair manufacturer document found","status":"UNVERIFIED (not published in any manufacturer document reached)","values":[{"model":"Hayward MaxFlo XL SP2305X7","total_hp":"0.95 HP","title_hp":"3/4HP","voltage":"115/208-230","amps":null},{"model":"Hayward TriStar XE SP3210X15XE","total_hp":"1.85 HP","voltage":"230/115","amps":null}],"quote_segments":["MaxFlo XL, High Efficiency Pump, 3/4HP","Voltage at 60 Hz | 115/208-230","Total HP | 1.85 HP","Voltage at 60 Hz | 230/115"],"source_url":["https://ca.hayward.com/maxflo-xl-pump-0-95hp-sp2305x7.html","https://ca.hayward.com/tristar-xe-pump-1-85hp-sp3210x15xe.html"],"permission_notice":null,"retrieved":"2026-10-24","canaries":"not used","notes":"Round 1 already found the Hayward Super Pump manual defers to the motor nameplate. Pentair searches returned only retailer pages (Leslie's, pool360, Walmart), which are not primary sources."}
```

```json
{"ref":"Electric water heaters 240 V 4500 W dual element: maker-stated breaker/fuse and wire size","edition":"State SRESB00115 (© April 2020); Bradford White 238-44422-00Y REV 02/22 (ManualsLib copy)","status":"Breaker/fuse size: UNVERIFIED (no maker document reached states one). Wire size: still only A.O. Smith '10 gauge solid copper' (round 1). Non-simultaneous default: VERIFIED (mfr) for State","values":{"state_default_operation":"double element, non-simultaneous (unless ordered differently)","state_breaker_size":null,"bradford_white_breaker_size":null,"bradford_white_wire_size":null},"quote_segments":["Element operation shall be double element, non-simultaneous (unless ordered differently).","Caution should be taken when ordering P4 Circuit (simultaneous operation) to ensure breaker amperage is sufficient","Note: Simultaneous operation doubles recovery","Check the rating plate and wiring diagram before proceeding."],"source_url":["https://assets.statewaterheaters.com/damroot/Original/10001/SRESB00115.pdf","https://www.manualslib.com/manual/3068355/Bradford-White-Re250ln6-1ncww.html"],"permission_notice":"State: '© April 2020 State Water Heaters. All Rights Reserved'; Bradford White (ManualsLib): none captured","retrieved":"2026-10-24","canaries":"not used","notes":"The Bradford White text came from a third-party aggregator (ManualsLib) and only partial page text was visible; use it only as a pointer."}
```

---

## 4. Registry impact

### Target 1: TIAs and errata

**No data/verified/*.json value changes.**
- No TIA (23-1 to 23-20) or erratum read (70-23-1 to -5, -9) changes a value in nec-310-16, nec-310-12, nec-310-15-B-1-1, nec-310-15-C-1, nec-240-6-a, nec-240-4-d, nec-250-122, nec-250-66, nec-220-2023, nec-430-440-2023, nec-continuous-load-2023 or nec-314-16.
- The same holds for the 680.21(C) and 625 items in nec-2023-rules-round2.

**Rule-level updates**
- **nec-2023-rules-round2.json**, item "NFPA 70-2023 TIAs 23-1..23-13":
  - Extend to 23-20: 23-14 517.30(B)(3)(a); 23-15 210.70; 23-16 680.43 Ex. 3 deleted; 23-17 680.21(C); 23-18 314.29(A); 23-19 315.6; 23-20 430.132 (new).
  - Add the errata status: 1–5 and 9 read, none on a target; 6–8 and 10 and up unread.
  - Its summary "None of the 13 TIAs … amends any section targeted here" stays true for A1's targets. It is **not** true for 210.8: TIA 23-3 amends 210.8(F).
- **nec-sections-allowlist.csv** line 14, 210.8(F), domain nec-2023-rule-excerpts:
  - Add: "2023 as amended by TIA 23-3 (effective Sep 1, 2022): Exception No. 2, listed HVAC equipment, expired September 1, 2026."
  - This matches AUDIT-2026-10 line 248. The status key for that fact is VERIFIED-2023 (TIA text).
- **Candidate allowlist row:** 430.132 (2023 via TIA 23-20; 2026 via TIA 26-3), "No GFCI/SPGFCI between power-conversion-equipment output and motor". Use on the pool-pump and motor pages next to 680.21(C)(2).
- **Held hot-tub page** (page-specs-held line 116, 680.42–680.44): do not cite 680.43 Exception No. 3. TIA 23-16 deleted it effective Dec 24, 2024.
- **nec-250-122.json:** no change. If any page cites 250.122(D)(2), its 430.52 reference reads "430.52(C)(1)(a)" after the NFPA CC correction. That is UNVERIFIED as to erratum number and NFPA text.

### Target 2: awg-geometry (data/verified/awg.json, 19 AWG row)

**Proposed `note` text:**
> "Area 1290 cmil as printed in NBS Handbook 100 Table 6 (p. 17), OCR line '19 35.9 1290 .001 01 7.41 8.05 8.21 9.00 9.79 10.6 13.7' (Internet Archive copperwiretables100unit hOCR, read twice 2026-10-20). The Table 5 row's text layer reads '1200' in both the NIST and Internet Archive PDFs (same scan and OCR); the printed Table 5 glyph has not been seen. Cite Table 6 for this cell."

- `area_cmil` 1290.0 stays, with the source changed to HB100 Table 6.
- `area_mm2` 0.6537 is derived from 1290 and stays labeled as derived.
- **Contradiction:** data-sources.csv row "awg-geometry", sample_note, says `19 AWG area OCR "1200" corrected to 1290`.
  - "Corrected" breaks integrity rule 5.
  - Replace it with: "19 AWG area 1290 cmil per HB100 Table 6 (OCR, two pulls); Table 5 text layer reads 1200 (glyph not seen)."
  - The awg.json `sources[0].document` should add "Table 6 (p. 17) for the 19 AWG area".

### Target 3: mfr-well-pump (candidate)

- Stays **candidate**. data/verified/mfr-equipment.json `franklin_2026` is unchanged (`readable: false`).
- Coverage line unchanged: "2015 edition values (identical in the 2007 edition); 2026 edition cable (p. 49) and fuse (p. 57) pages unread".
- Add to notes: "A 2023 edition exists (RCWorst feaim_manual23.pdf, robots-blocked)."
- Changes from 2015 to 2026: unknown.

### Target 4: nema-receptacle-configs

- Can be **verified, 10 of 10**.
- Coverage line: "TT-30R, 5-15R, 5-20R, 6-20R, 6-30R, 6-50R, 10-30R, 10-50R, 14-30R, 14-50R (manufacturer spec sheets stating NEMA WD 6 compliance)".
- In data/verified/nema-receptacle-configs.json, replace the 6-30R row with:
  `{"config":"6-30R","amps":30,"volts":"250","poles":2,"wires":3,"grounding":true,"source":"Hubbell HBL9330 spec sheet WDK_CA-HBL9330-SPEC-EN REV 5/2026; Leviton 5372-IG product page","status":"VERIFIED (mfr)"}`
- Change the file status to "verified (10 of 10 configurations)".

### Target 5: mfr-pool-pumps (verified)

- **Contradiction:** the coverage line says "Single-speed 1/1.5/2 hp FLA NOT published in manuals (nameplate)". That is now false for Jandy.
- New coverage line: "Variable-speed input currents (Pentair, Hayward); single-speed amps by model and THP for Jandy Stealth SHPF/SHPM (H0573800 Rev Y, ©2025 Fluidra; 1.14–2.60 THP, 208/230/115 V); Hayward and Pentair single-speed amps not published (nameplate); 8 AWG solid Cu bonding; GFCI required."
- The data file has no pool-pump array. Add `pool_pumps` to data/verified/mfr-equipment.json with the six rows in JSON block 8.
- Keep the Jandy wire/breaker table (block 9) **out** until a second pull.
- Page rule: input THP or nameplate amps, never nominal HP. SHPM1.5 and SHPF1.0 are the same 1.65 THP pump.

### Target 6: mfr-water-heaters (verified)

- No value change.
- Coverage line: "… Breaker rating NOT stated by any maker document read (Rheem, A.O. Smith, State, Bradford White)."
- Add State SRESB00115: "double element, non-simultaneous (unless ordered differently)".
- No data/verified file holds water-heater values. 18.75 A stays a labeled calculation.

---

## 5. Blocked or failed log

| URL / item | Date | Result |
|---|---|---|
| docinfofiles …/Errata_70_23_5.pdf (2 tries) and …/Errata_70_23_6.pdf | 2026-10-20 | CLIENT_ERROR. These are wrong file names; the real errata 5 file is "Errata 70_23_5.pdf" |
| docinfofiles …/Errata_70_23_7.pdf, …/Errata%2070_23_6.pdf | 2026-10-24 | URL_NOT_ON_ALLOWLIST (not sent). After the pause, only search-returned URLs are fetchable |
| Three host-restricted searches for 2023 errata | 2026-10-24 | The index holds only errata 1, 2 ("_03" variant of 3) and 5; it surfaced TIA_70_23_3.pdf and Errata_70_26_1.pdf (2026; title "Reference: 240.86(C)") |
| https://www.dli.mn.gov/sites/default/files/pdf/eli_bulletin_2023_nec_tia_errata.pdf (guessed) | 2026-10-20 | CLIENT_ERROR |
| https://appa.org/nfpa-70-national-electrical-code-updates | 2026-10-20 | "2023 Edition" heading has no entries |
| goodreads.com NFPA blog mirror post 14537580 | 2026-10-20 | Covers 2017 Errata 70-17-3 only |
| hfmmagazine.com weekly updates (Aug 11-15 2025, Oct 20-24 2025, Nov 10-14 2025, Apr 7-11 2025; nodes 706936, 705847, 707198, 704063) | 2026-10-20 | Tier 4. Only Errata 70-23-9 (Aug 12, 2025) and 70-26-4; no errata 6–8 |
| https://www.oregon.gov/bcd/codes-stand/Documents/23oesc-table1-E.pdf | 2026-10-20 | "Errata" rows are Oregon amendment text, not NFPA errata (see §2.2) |
| https://secure.in.gov/dhs/files/March-Proposals-Compiled.pdf | 2026-10-20 | First read found no errata numbers. Second read listed NFPA CC corrections without numbers (garbled-text warning) |
| https://catalog.hathitrust.org/Search/Home?… and https://babel.hathitrust.org/cgi/ls?… | 2026-10-20 | PROVENANCE_REQUIRED (permission not answered; "Do not retry") |
| https://books.google.com/books?q=… | 2026-10-20 | ROBOTS_DISALLOWED |
| https://www.googleapis.com/books/v1/volumes?q=… | 2026-10-20 | CLIENT_ERROR |
| IA …/copperwiretables100unit_djvu.txt (via dn760005.eu.archive.org) and archive.org/stream/… | 2026-10-20 | WebFetch text ends at 63,536 characters (about p. 10); no table rows |
| IA …/page/n20.jpg | 2026-10-20 | SERVER_ERROR |
| IA dn760005.eu.archive.org/fulltext/inside.php?… | 2026-10-20 | PROVENANCE_REQUIRED |
| https://corpora.tika.apache.org/base/docs/govdocs1/534/534347.pdf (older HB100 copy) | 2026-10-20 | Text layer of 67,035 characters with no Table 5 rows |
| https://ntrl.ntis.gov/NTRL/dashboard/searchResults/titleDetail/NBSHB100.xhtml | 2026-10-20 | Record only; "Download PDF" links are placeholders |
| https://py.franklinwater.com/support/franklin-aim/ | 2026-10-20 | No downloads listed |
| https://www.royalswimmingpools.com/SuperPump-Brochure.pdf | 2026-10-20 / 10-24 | Session-limit error, then URL_NOT_ON_ALLOWLIST |
| zodiacpoolsystems.com Jandy manual, second wire-table pull | 2026-10-24 | URL_NOT_ON_ALLOWLIST |
| https://www.americanwaterheater.com/media/72522/nresb00115.pdf | 2026-10-24 | Returned a media-library index page; no data |
| https://mans.io/files/viewer/1683051/1 (Rheem) | 2026-10-24 | CLIENT_ERROR |
| ManualsLib Bradford White page | 2026-10-24 | Partial text; no breaker or wire values |
| WebSearch | n/a | 24 of 24 used |

---

## 6. Open gaps

1. **Errata 70-23-6, -7, -8 and -10 and up.**
   - The file names are irregular ("Errata 70_23_5.pdf" with a space; "Errata_70_23_03.pdf" zero-padded), and constructed URLs are refused after the pause.
   - Fix: the owner pastes NFPA's errata links from the NFPA 70 "current & prior editions" errata tab, or approves the docinfofiles URLs. That leaves 7 of the 8 extra fetches for them.
   - Expected content (Indiana list): 250.122(D)(2) and 695.4(B)(3) cross-references. Errata issued between Mar 2024 and Aug 2025, other than 70-23-9, are unknown.
2. **TIA 23-21 and up.** Not fetched. The 2026-edition TIAs 26-9 to 26-12 were issued Aug 20, 2026, so 2023-edition twins are possible.
3. **TIA 23-3 from NFPA's own host.** TIA_70_23_3.pdf is now allowlisted. One fetch would give a second pull of the expiry text.
4. **HB100 Table 5, 19 AWG glyph.** Needs a visual check of p. 16 (the NIST PDF page image) or a HathiTrust or Google Books scan. Until then, cite Table 6.
5. **Franklin AIM 2026 pp. 49–52 and 57.** The owner downloads the official M1311 PDF (13.54 MB, franklinwater.com) and attaches it.
6. **Jandy §3.2.1 wire/breaker table.** Needs a second pull.
7. **Hayward and Pentair single-speed amps.** Not published by either maker in the documents reached. Motor-maker data (Regal/Century) would be the next route; it is outside this brief.
8. **Water-heater breaker size.** No maker states one. Keep the NEC-based calculation labeled "calculated".
