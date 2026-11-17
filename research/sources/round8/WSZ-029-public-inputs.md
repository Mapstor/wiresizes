# WSZ-029: 2023 NEC text from NFPA's 2026-cycle public inputs (round 8)

Retrieved 2026-11-17. Targets: the gaps that held the 100 A guide, the garage subpanel calculator and the EV charger guide (225.39(A)–(D), 225.30, 225.32, the 250.32(B)(1) neutral sentence, 334.80, 340.80, 310.15(E)/(F)).

## Method

- Public inputs (PIs) to the 2026 NEC were filed against "NFPA 70-2023". NFPA's submission system prints the section as it stands in the 2023 edition, with the submitter's changes underlined (added) or struck through (deleted). Text with no mark is 2023 text.
- Earlier rounds read these reports through WebFetch, which returned "[binary data]" or cut them short. This round downloaded the PDFs from docinfofiles.nfpa.org with curl, extracted the text with pdftotext, and recovered the marks with `scripts/research/nfpa-markup.py` (pdfplumber: a line through the middle of a character = struck, a line under it = underlined).
- The script was checked on PI 227, where the submitter's change is known from its statement: it prints `electrode [-(s)] [+conductor]`, the one change the statement describes.
- Reading the extracted text directly involves no model, so no canary pull was needed. Every value below is in at least two NFPA documents from different submitters, or in one unmarked reprint plus a First Revision base text.
- TIAs on the 2023 edition: 23-1 to 23-20 (R4-7) touch none of these sections. TIA_70_23_21.pdf to _28.pdf return HTTP 404 (checked 2026-11-17). Errata 70-23-3 touches Table 225.3 only.

## Files (all https://docinfofiles.nfpa.org/files/AboutTheCodes/70/)

| file | pages | bytes | last-modified | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| 70_A2025_NEC_P10_PISubmittals.pdf (CMP-10 public inputs, report dated 9/18/2023) | 641 | 16,426,052 | 2023-10-12 | 56abe8a3092c4608 |
| 70_A2025_NEC_P05_PISubmittals.pdf (CMP-5) | 558 | 24,612,813 | 2023-10-02 | 3a90a4d3a382386f |
| 70_A2025_NEC_P06_PISubmittals.pdf (CMP-6) | 399 | 21,018,703 | 2024-01-12 | e6628cbc3d60429c |
| 70_A2025_NEC_P06_FD_PrelimFR.pdf (CMP-6 First Draft) | 136 | 2,071,016 | 2024-02-06 | c5778c0ded52b770 |

Page numbers below are PDF pages (open the file with `#page=N`), not the report's own "N of 504" footer.

## Findings

### 225.39(A)–(D), disconnect rating: VERIFIED-2023

- PI 140 (Russ Leblanc, filed 2023, "[ Article 225 ]") reprints all of Article 225. Its marks are all in Part I: "or Other Structures" added to 225.10, 225.15, 225.16, 225.19 and 225.21, plus underlines on two Table 225.3 header lines and two climbing-space list items in 225.14(D) (layout or table lines). Part II, pdf pages 179–181, carries no marks at all.
- PI 3246 (David Williams, Delta Charter Township, filed Aug 30, 2023, "[ Article 225 ]") renumbers Article 225 to parallel Article 230; its statement says the sections changed only in their numbers. Pdf page 207 prints 225.39 as "225.79 225.39" with the same words.
- Word-by-word comparison of the two 225.39 blocks: identical except page-break residue.
- Values: (A) one-circuit installation, limited loads of a single branch circuit: not less than 15 amperes. (B) not more than two 2-wire branch circuits: not less than 30 amperes. (C) one-family dwelling: feeder disconnect "not less than 100 amperes, 3-wire". (D) all other installations: "not less than 60 amperes".
- The lead-in (rating not less than the calculated load per Article 220; ratings of several switches or breakers may be combined under 225.33) matches the FR-9076 base text verified in round 4.
- The 2020-based values recorded in R4-5 (15/30/100/60) are unchanged in 2023.

### 225.30, number of supplies: VERIFIED-2023

- PI 140, pdf pages 179–180, unmarked. Main rule: a building or other structure served from the load side of a service disconnect gets one feeder or branch circuit unless 225.30(A) through (F) permit more; a multiwire branch circuit counts as one circuit.
- (A) special conditions, eight items, including (7) "Electric vehicle power transfer systems" and (8) "Docking facilities and piers". (B) common supply equipment: not more than six feeders from the same distribution equipment, disconnects grouped and marked. (C) special occupancies, by special permission. (D) capacity over 2000 amperes at 1000 volts or less. (E) different characteristics. (F) documented switching procedures.

### 225.31, disconnecting means: VERIFIED-2023 (third reprint)

- PI 140, pdf page 180, unmarked; same sentences and Exceptions No. 1–4 as the FR-9289 base text verified in round 4.

### 225.32: does not exist in the 2023 edition

- PI 140's unmarked Part II runs 225.31 → 225.33. PI 3246 uses "225.32" only as one of its proposed new numbers.

### 225.18, overhead clearances: third reprint

- PI 140, pdf page 178, unmarked: 10, 12, 15, 18 and 24½ ft, same conditions as the FR-8928 base text.

### 250.32(A), grounding electrode at a building supplied by a feeder: VERIFIED-2023

- PI 2649 (David Williams, filed Aug 23, 2023), CMP-5 file pdf page 148. Its only marks change "Part III of Article 250" to "Article 250, Part III".
- Rule: the building or structure "shall have a grounding electrode system and grounding electrode conductor" installed per Part III of Article 250. Exception: not required where a single branch circuit (a multiwire branch circuit counts as one) with an equipment grounding conductor supplies it.

### 250.32(B)(1), feeder to a separate building: VERIFIED-2023, including the neutral sentence

- PI 227 (Mark Hilbert, filed Jan 25, 2023), CMP-5 file pdf page 151. Marks: "(s)" struck and "conductor" added in the first sentence. Everything else, both exceptions included, is unmarked.
- PI 1556 (Norman Feck, State of Colorado, pdf page 149) and PI 4533 (Peter Noval Jr, pdf page 153) print the same neutral sentence, unmarked.
- Rule: an equipment grounding conductor "as described in 250.118" is run with the supply conductors and connected to the building disconnecting means and to the grounding electrode(s); it is sized per 250.122. Neutral sentence: "Any installed grounded conductor shall not be connected to the equipment grounding conductor or to the grounding electrode(s)."
- Exception No. 1 (existing installations under earlier editions): the neutral may serve as the ground-fault return path only if no EGC runs with the supply, there are no continuous metallic paths bonded to the grounding system in each building, and no ground-fault protection of equipment is on the supply side; the neutral is then at least the larger of the 220.61 neutral load and the 250.122 EGC size. Exception No. 2: system bonding jumpers under 250.30(A)(1) Exception No. 2.

### 334.80, NM cable ampacity: VERIFIED-2023

- PI 3051 (Mike Holt, filed Aug 29, 2023), CMP-6 file pdf page 261. Its only marks add the labels (A) General, (B) Cables Through Same Opening, (C) Cables in Contact with Thermal Insulation.
- PI 1129 (Greg Chontow, Boro of Hopatcong NJ, filed Jun 19, 2023), pdf page 260. Its marks strike the sentence "The ampacity shall not exceed that of a 60°C (140°F) rated conductor." and change the second 60°C (140°F) to 75°C (167°F). Both are its proposals, so both 60 °C limits are 2023 text.
- First Revision FR-8100 (2026 First Draft, pdf page 89): the same sentences as base text; the FR adds the (A)–(C) labels and "Types ... and NMC" in (B) and (C).
- Rule: NM and NMC ampacity per 310.14, "shall not exceed that of a 60°C (140°F) rated conductor"; the 90°C (194°F) rating may be used for adjustment and correction if the final ampacity does not exceed the 60 °C value; cable trays per 392.80(A); more than two NM cables with two or more current-carrying conductors through one sealed opening in wood framing, or in contact with thermal insulation without spacing: adjust per Table 310.15(C)(1), and the 310.14(A)(2) Exception does not apply.

### 310.15(E), neutral conductor counting: VERIFIED-2023 (content)

- PI 779 (CMP-6 file pdf page 136): lead-in and items unmarked except item (1), which its proposal strikes. PI 3112 (Mike Holt, pdf page 135) adds a new first item and rewords item openings. FR-8035 (2026 First Draft, pdf page 43) strikes the 2023 lead-in and item (1), which shows both were 2023 text.
- Items: (1) a neutral carrying only the unbalanced current of the same circuit is not required to be counted under 310.15(C)(1); (2) in a 3-wire circuit of two phase conductors and the neutral of a 4-wire, 3-phase wye system, the neutral is counted; (3) on a 4-wire, 3-phase wye circuit where most of the load is nonlinear, the neutral is counted as current-carrying.
- The lead-in's exact wording differs between PI 3112 (shown as added) and PI 779 and FR-8035 (shown as existing). The site needs only the items.

### Not found this round

- 340.80 (UF cable ampacity): no 2026-cycle public input or First Revision reprints it. CMP-6 PIs on Article 340 cover 340.6, 340.10, 340.12, 340.24 and 340.104 only.
- 310.15(F) (grounding and bonding conductors not counted): no public input or First Revision reprints it.
- Both stay unverified. check-structure check 7 keeps "340.80" off rendered pages; 310.15(F) stays off the section allowlist.

## Registry changes

- nec-feeders-outbuildings: GAP → verified (Article 225 only; url → the CMP-10 public-input file, #page=179).
- nec-250-32 (new): verified (250.32(A) and (B)(1); url → the CMP-5 public-input file, #page=151).
- nec-cable-rules: GAP → verified for 334.80 and 310.15(E); 340.80 and 310.15(F) named as not covered.
- data/verified/nec-225-2023.json updated; data/verified/nec-250-32-2023.json and data/verified/nec-cable-rules-2023.json added.

## Same route for the other held pages

Each committee has the same three files (`70_A2025_NEC_P<NN>_PISubmittals.pdf`, `_FD_PrelimFR.pdf`, `_SD_PrelimSR.pdf`), and all download from the shell: CMP-7 (551 RV parks), CMP-8 (Chapter 9 conduit tables), CMP-9 (314.16 box fill), CMP-11 (430 motors, 440 air conditioning), CMP-12 (630 welders), CMP-17 (680 pools and spas). A section appears only if someone filed a public input on it or the committee revised it.
