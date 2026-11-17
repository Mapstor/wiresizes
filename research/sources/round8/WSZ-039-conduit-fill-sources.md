# WSZ-039: conduit fill sources (NEC 2023 Chapter 9 Table 1 and Informative Annex C)

Retrieved 2026-11-17. Registry domain: nec-ch9-fill (GAP before; verified, scoped). Data: data/verified/nec-ch9-annex-c.json.

## Sources read

| # | Record | What it gives | Status |
|---|---|---|---|
| N1 | NFPA, 2026-cycle CMP-8 public input submittals, Public Input No. 1588-NFPA 70-2023 [Annex C], submitted by "CMP ON NEC-P08", from TIA 23-7 (Log 1678, issued by the Standards Council on December 8, 2022). https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_PISubmittals.pdf, PDF pages 431-518 | The whole 2023 Informative Annex C. Tables C.1 to C.13 and C.1(A) to C.13(A) are on PDF pages 432 to 512 | VERIFIED-2023: a public input on NFPA 70-2023 prints the 2023 text, and these tables carry no revision marks |
| N2 | NFPA, 2026-cycle CMP-8 First Draft (working draft of panel meeting output, printed 1/30/2024), First Revision No. 7763-NFPA 70-2024 [Chapter 9, Table 1]. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P08_FD_PrelimFR.pdf, PDF pages 171-174 | Table 1 (1: 53 %, 2: 31 %, over 2: 40 %), its two informational notes, and Notes 1 to 10 to the tables | VERIFIED-2023: unmarked and struck text is the 2023 text. The FR changes the wording of Informational Note No. 1 ("conduit" to "raceway") and Notes 7 and 8 only |
| N3 | NFPA, 2023-cycle CMP-8 First Draft ballot, First Revision No. 7626-NFPA 70-2020 [Chapter 9, Table 4, Article 358]. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P08_FD_BallotFinal.pdf | Table 4's EMT block with the new trade sizes 5 and 6 | Read, not used (the calculator computes no areas) |

Records searched for Chapter 9 Table 5, without a hit: CMP-6 2026 public inputs, First Draft and Second Draft; CMP-6 2023 public input responses, ballots and Second Revision statements; CMP-6 2020 Second Revision statements and ballot; CMP-8 2020 Second Revision statements and ballot; CMP-8 2023 public input report, responses, public comments and Second Revision statements. Table 5 therefore stays unverified, and conductors of different sizes are not calculated.

## How the counts were read

- Two extractions of PDF pages 432 to 512: poppler's `pdftotext -layout` and pdfplumber's layout text. A parser took every line with a size and thirteen counts under the CONDUCTORS and COMPACT CONDUCTORS headings. The two agree cell for cell on all 2,483 rows (134 conductor rows and 57 compact rows a table; fixture wires are not carried).
- Revision marks: scripts/research/nfpa-markup.py over the same pages, with table rules wider than 300 points left out (they print as underlines), shows no struck text and no underlined count; the only marks left are header rules and one cell border under a "2000" size cell.
- Row order is the same in every table (RHH, RHW, RHW-2 14 to 2000; TW, THHW, THW, THW-2 14 to 8; RHH*, RHW*, RHW-2* 14 to 8; TW, THW, THHW, THW-2, RHH*, RHW*, RHW-2* 6 to 2000; THHN, THWN, THWN-2 14 to 1000; FEP, FEPB, PFA, PFAH, TFE 14 to 2; PFA, PFAH, TFE 1 to 4/0; Z 14 to 1; XHHW, ZW, XHHW-2, XHH 14 to 2; XHHW, XHHW-2, XHH 1 to 2000; compact THW, THW-2, THHW, then THHN, THWN, THWN-2, then XHHW, XHHW-2, each 8 to 1000), and the printed type labels fall in their groups.
- Checks on the numbers: within a row the counts never fall as the trade size grows; down a group they never rise as the wire grows; each table's dash columns are the same on every row (compact THHN 8 AWG is dashes in every (A) table, so compact THHN starts at 6 AWG).
- Known values match: 12 AWG THHN in EMT 9, 16 and 26 in trade sizes 1/2, 3/4 and 1; 14 AWG 12, 22 and 35; 10 AWG 5, 10 and 16.

## Two printing slips in the record

- Table C.9 (RMC): the rows for THHN, THWN, THWN-2 500 kcmil and for FEP, FEPB, PFA, PFAH, TFE 2 AWG print twelve counts with no dash in the 3/8 column. RMC has no 3/8 trade size in the table, and the twelve values line up under 1/2 to 6, so the 3/8 cell is read as the dash.
- Table C.7 (LFNC-C): the THHN rows are labeled "THHW, THWN, THWN-2". They sit in the THHN position of every other table and are read as THHN, THWN, THWN-2.

## Scope on the site

The calculator and page use Annex C counts as printed, for conductors all of one size and type, in 13 raceways, with compact stranding for THHN, XHHW and THW. Not used: fixture wires, the cable tray tables C.14 to C.20 (the only part TIA 23-7 changed), Table 4 (other than the IMC block in nec-ch9-table4.json, also unused), Tables 5 and 5A, and the nipple allowance of Note 4 beyond stating it.
