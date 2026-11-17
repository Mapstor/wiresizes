# WSZ-032 · Box fill (NEC 314.16, 2023): the open items closed from NFPA's own records

Retrieved 2026-11-17 with curl from docinfofiles.nfpa.org (no login, no fetch tool in between); read with
`pdftotext -layout` and `scripts/research/nfpa-markup.py` (underline = inserted `[+…]`, strike = deleted `[-…]`).
Round 4 (research/sources/round4/R4-3-ch9-boxfill.md) had left open: Table 314.16(A) rows 6–24 and its footnote as
2023 text, and the 2023 wording of 314.16(B)(1) conductor fill, (B)(2) clamp fill and (B)(3) support fittings fill.

## Documents read (all NFPA's own committee records; no permission notice applies)

| id | document | url | pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| D1 | CMP-8 Public Input report, 2026 cycle (A2025): public inputs filed in 2023 against NFPA 70-2023. Article 314 moved to CMP-8 in this cycle. | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_PISubmittals.pdf | 564 | 623acfc6b5715953 |
| D2 | CMP-9 First Draft ballot report, 2023 cycle (A2022), First Revisions with text, printed 4/15/2021 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_FD_BallotFinal.pdf | 191 | 39e263fce1a33948 |
| D3 | CMP-9 Public Input report, 2023 cycle (A2022): public inputs filed in 2020 against NFPA 70-2020, printed 10/1/2020 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_FD_PIReport_rev.pdf | 503 | 0d0426edd2e05999 |
| D4 | CMP-9 Second Revision statements, 2023 cycle (33 Second Revisions) | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_SRStatements.pdf | 55 | 476e7a0c96bbc407 |
| D5 | CMP-9 Public Comment report, 2023 cycle | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P09_SD_PCSubmittals.pdf | — | 37c8783b352196f8 |
| D6 | Correlating Committee: Second Correlating Revisions, 2023 cycle | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_AAC_SD_SCRreport.pdf | 303 | 56bb53684cd668dc |
| D7 | Correlating Committee: First Correlating Revisions, 2023 cycle | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_AAC_FD_FCRreport.pdf | 12 | 2c7b9aa280a23252 |

Also downloaded and searched, with no 314.16 content: the 2026-cycle CMP-9 public inputs, First Draft and Second Draft
(CMP-9 no longer has Article 314), and the 2026-cycle CMP-8 First Draft and Second Draft (First Revisions 7525, 7527
and 7529 only, read in round 4).

## Findings

### Table 314.16(A), all 24 rows and the footnote: 2023

- D1, Public Input 3972 (pdf pp. 58–61), filed against NFPA 70-2023 to split 314.16(A) into list items: prints all 24
  rows and the footnote "*Where no volume allowances are required by 314.16(B)(2) through (B)(6)." The rows carry no
  revision marks; the markup reader prints `[+…]` on every third row, where the table's group rules run under the
  text (a known limit of the reader), and the public input's own statement proposes no table change.
- D2, First Revision 7727 (pdf p. 79), the 2023-cycle First Draft: prints the same 24 rows; row 1 (4 × 1¼ round or
  octagonal) shows the 8 AWG column `[-5] [+4]`, the one change, and the footnote "(B)(5)" struck and "(6)" inserted.
  D4 lists no Second Revision on the table.
- D3, Public Input 1291 (pdf p. 128; NEMA, 2020-05-28), 2020 text: rows 2–24 equal; row 1, 8 AWG reads 5.
- A script parsed the volume (cm³, in.³) and the seven counts of each row from the three texts: rows 2–24 equal in all
  three; row 1 equal in D1 and D2 with 4, 5 in D3. data/verified/nec-314-16.json held the same values from
  2005–2011 reprints; the script asserted them before marking rows 6–24 VERIFIED-2023.

### 314.16(B)(1) conductor fill and (B)(3) support fittings fill: unchanged from 2020

- D3, Public Input 1291 reprints all of 314.16 as NFPA 70-2020 printed it; its only proposed change is two words in
  (B)(5). (B)(1): counted once if it originates outside and terminates or is spliced inside; once if it passes through;
  a loop or coil at least twice the 300.14 free length counts twice; a conductor no part of which leaves the box is not
  counted; Exception: an equipment grounding conductor or up to four fixture wires smaller than 14 AWG entering from a
  domed luminaire canopy and terminating in the box may be omitted. (B)(3): one allowance for each type of fitting
  (luminaire studs, hickeys) on the largest conductor present.
- The 2023 cycle left both alone: D2 lists every CMP-9 First Revision (91, globals included); on 314.16 they are 7726
  (lead-in), 7727 ((A)(2) and the table), 7977 ((B) lead-in), 7731 ((B)(2)) and 7734 ((B)(5)). The five global First
  Revisions are Article 245, Article 495, the Article 314 Part renumbering (314.40 and on), Part IV of Article 490 and
  the definitions. D4's Second Revisions on 314: 314.5, 314.16(B)(5), (B)(6), 314.24(C), 314.27(E); its globals 7755
  and 7853 are Articles 495 and 245. D5's public comments on 314.16: (B)(5) and (B)(6). D6: Second Correlating
  Revision 1 on (B)(6) only; D7: none on 314.
- The table they name reads "Table 314.16(B)(1)" in every 2023-cycle text (First Revision 7731, Second Revisions 7528
  and 7529), so the 2023 wording is the 2020 wording with that designation. Recorded as verified-sd2023 (D-09).

### 314.16(B)(2) clamp fill: First Revision 7731

- D2 pdf p. 81: the first paragraph unmarked (one allowance for one or more internal cable clamps, on the largest
  conductor present; none for a connector with its clamping mechanism outside the box); the 2020 second paragraph on
  clamp assemblies with a cable termination struck whole. No Second Revision, comment or correlating revision.

### 314.16 lead-in: First Revision 7726

- D2 pdf p. 87: "Boxes and conduit bodies shall be of an approved size to provide free space for all enclosed
  conductors. In no case shall the volume of the box, as calculated in 314.16(A), be less than the fill calculation as
  calculated in 314.16(B)." unmarked; the revisions are editorial (motor terminal housings, 314.28). No Second Revision.

## Result

nec-314-16-box-fill → verified: Table 314.16(A) (24 rows, footnote), Table 314.16(B)(1), the 314.16 lead-in, 314.16(A)
and (B), (B)(1)–(B)(6), and 314.27(E) (a weight-supporting ceiling receptacle counts as device fill). Nothing estimated;
the 2026 edition's changes (First Draft 7525, 7527, 7529) are not used.
