# WSZ-033 · RV parks (NEC 551.71 and 551.73, 2023) from NFPA's own records

Retrieved 2026-11-17 with curl from docinfofiles.nfpa.org; read with `pdftotext -layout` and
`scripts/research/nfpa-markup.py` (`[+…]` inserted, `[-…]` struck; unmarked and struck text in a 2026-cycle record
filed against NFPA 70-2023 is the 2023 edition's text). Round 4 (R4-5) had left 551.73(A)'s per-site loads and
Table 551.73(A) unverified, with two conflicting leads (9,600 VA in trade press, 12,000 VA in a round-1 note).

## Documents

| id | document | url | pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| E1 | CMP-7 Public Input report, 2026 cycle (A2025), filed against NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P07_PISubmittals.pdf | 373 printed | f0b0956d50131f7d |
| E2 | CMP-7 First Draft working draft, 2026 cycle (A2025), printed 1/30/2024 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P07_FD_PrelimFR.pdf | 90 printed | 73f173f2ee692ed7 |

## Findings

- **551.73(A) and (B), Table 551.73(A).** E1 Public Input 3113 (Mike Holt, pdf p. 294) moves 551.73 to Article 220 and
  strikes the whole 2023 section: 12,000 VA per site with 50 A, 208Y/120 V or 120/240 V supply; 3600 VA per site with
  both 20 A and 30 A; 2400 VA with only 20 A; 600 VA with only 20 A dedicated to tent sites; the demand factors of Table
  551.73(A) are the minimum allowed; one supply serving two RVs is calculated for the two highest-rated receptacles;
  (B) the factor for a number of sites applies to all of them (20 sites × 45 % × 3600 VA = 1620 VA per site, 32,400 VA);
  other amenities calculated separately and added. E1 Public Input 638 (pdf p. 296) prints (B) and the table
  unmarked; E2 First Revision 8591 (pdf pp. 56–57) prints the table as base text. Table rows in all three: 1 → 100 %,
  2 → 90, 3 → 80, 4 → 75, 5 → 65, 6 → 60, 7–9 → 55, 10–12 → 50, 13–15 → 48, 16–18 → 47, 19–21 → 45, 22–24 → 43,
  25–35 → 42, 36 plus → 41 (pdftotext -raw on E2 p. 56 reads "36 plus 41"; E1's layout text drops the "36").
  9,600 VA is not the 2023 value.
- **551.71.** E2 First Revision 8657 (pdf pp. 48–51) rewrites 551.71 for 2026 and prints the 2023 text struck or
  unmarked: (B) at least 70 % of sites with a 30 A, 125 V weather-resistant receptacle; (C) at least 20 % of existing
  and 40 % of new sites with a 50 A, 125/250 V weather-resistant receptacle, each also with a 30 A, 125 V receptacle,
  the 50 A weather-resistant requirement effective January 1, 2026; (F)(1) GFCI for receptacles other than in site
  equipment as 210.8(B) requires; (F)(2) in site equipment only for 125 V, single-phase, 15 and 20 A receptacles. E1
  Public Inputs 1549 and 1766 (551.71(B), two submitters), 1550 (C) and 1551 (D: dedicated 15 or 20 A tent sites may be
  left out of the percentages) print the same sentences. (A), (B), (C) and (F)(2) also match Leviton's 2023 reprint
  (nec-2023-rules-round2.json).

## Result

nec-551-rv-demand → verified (data/verified/nec-551-2023.json). The 2026 edition's rewrite of 551.71 is not used.
