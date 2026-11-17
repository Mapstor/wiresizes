# WSZ-037 · Welders: the 2023 text of 630.8, 630.12 and 630.13, and six makers' service guides re-read

Retrieved 2026-11-17 with curl and read with `scripts/research/nfpa-markup.py` (NFPA records: `[+…]` inserted,
`[-…]` struck; unmarked and struck text in a record filed against NFPA 70-2023 is the 2023 text) and
`pdftotext -layout` (makers' manuals). The round-4 note (R4-4) had 630.12 only as 2026 draft text, 630.13 from the
2023-cycle Second Draft, and 630.11 unverified.

## Documents

| id | document | url | pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| N1 | CMP-12 public inputs, 2026 cycle (A2025), filed against NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_PISubmittals.pdf | 372 | 5fb8e5faa4614a7f |
| N2 | CMP-12 Second Draft (preliminary Second Revisions), 2026 cycle | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf | 111 | 1b19145219fbfcba |
| N3 | CMP-12 Second Revision statements, 2023 cycle (A2022) | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf | 78 | 68dc1a989a499a2d |
| M1 | Miller Millermatic 211 PRO, Owner's Manual OM-298867B (2026-04) | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F45d3ad-o298867b_mil.pdf?v=8ae830d3 | 68 | 7ac425af019a7853 |
| M2 | Miller Multimatic 215 PRO, Owner's Manual OM-298868B (2026-04) | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F4f23d4-o298868b_mil.pdf?v=378aac7a | 84 | 31af8c21db3316ae |
| M3 | Miller Multimatic 220 AC/DC, Owner's Manual OM-281426D (2023-07) | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F0aaee0-o281426d_mil.pdf?v=b6e603d8 | 80 | 1205f0a3886914c1 |
| M4 | Miller Millermatic 211 (2016), Owner's Manual OM-265809C (2016-03) | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/owners-manual/299d5c-o265809c_mil.pdf | 52 | 5da0b763fdb683b2 |
| L1 | Lincoln POWER MIG 210 MP, Operator's Manual IMT10164-A (May-22), on Lincoln's content host | https://ch-delivery.lincolnelectric.com/api/public/content/a5d73057b1274855aba7d13096462a48 | 104 | f8bf269c734cd7b2 |
| L2 | Lincoln AC-225C, Operator's Manual IMT380-B (January 2010) | https://ch-delivery.lincolnelectric.com/api/public/content/9144d34ccc934e35b98493291853ac06 | 40 | 09f49fbb516ebd6a |

L1 replaces the Aug-19 issue that round 2 read from a university server: the May-22 issue on Lincoln's own host gives
the same input table.

## NEC findings

- **630.12** (N2, Second Revision 7788, pdf p. 75; N1, Public Input 2333, pdf p. 253): the 2023 text, with "overcurrent
  device" struck for "OCPD" in N2. Where the values do not correspond to the standard ratings of 240.6, or the setting
  results in unnecessary opening, the next higher standard rating is permitted. (A) For welders: not more than 200
  percent of I1max, or, if I1max is not given, of the rated primary current; no separate device where the supply
  conductors are protected at that value. (B) For conductors: not more than 200 percent of the conductor ampacity.
  Informational note: I1max is the maximum value of the rated supply current at maximum rated output; I1eff is
  calculated from I1, the duty cycle and the no-load current. No First Revision touched 630.12 (N2's base is the 2023
  text), and N1 prints 630.12(A) unmarked: two records agree on (A).
- **630.13** (N3, Second Revision 7589, pdf p. 46): a disconnecting means in the supply circuit of each arc welder
  without an integral one: a switch, circuit breaker or listed cord-and-plug connector, rated not less than needed to
  accommodate the overcurrent protection of 630.12 (verified-sd2023, D-09).
- **630.8** (N1, Public Inputs 2238, 243 and 577, pdf pp. 250 to 252; each proposes deleting it and prints the 2023
  text struck): 125-volt, 15- and 20-ampere receptacles for electrical hand tools or portable lighting equipment,
  supplied by single-phase branch circuits rated 150 volts or less to ground, in work areas where welders are operated,
  have GFCI protection for personnel. Three post-issuance records, so D-09's GFCI caution is met.
- **240.4(G)**: Table 240.4(G)'s electric welder row points to 630.12 and 630.32 (WSZ-036, public input 706).

## Not found

630.11 (the ampacity of supply conductors, Table 630.11(A)'s duty-cycle multipliers, 630.11(B) for groups of welders)
is in no CMP-12 record read: no public input, revision or comment in the 2026 cycle (N1, N2, its PC submittals and
responses, both ballots), the 2023 cycle (FD PI report, PI responses, both ballots, SR statements, PC submittals) or
the 2020 cycle's Second Draft statements and ballot touches it. The welder page states no rule for sizing the supply
conductors; it starts from the minimum wire in the welder's manual, which Miller says it sizes by the NEC "including
article 630".

## The makers' service guides (all 240 V; Lincoln 230 V)

| machine | I1max / I1eff | fuse or breaker | min wire, ground | max length | NEC edition | page |
| --- | --- | --- | --- | --- | --- | --- |
| Millermatic 211 PRO | 28.9 / 14.6 A | 35 A time-delay, 40 A normal | 14, 14 AWG | 40 ft | 2026 | M1 p. 18 |
| Multimatic 215 PRO | 28.9 / 14.6 A | 35 A time-delay, 40 A normal | 14, 14 AWG | 40 ft (12.2 m) | 2026 | M2 p. 20 |
| Multimatic 220 AC/DC | 32 / 15 A | 40 A time-delay, 45 A normal | 12, 12 AWG | 34 ft (10 m) | 2023 | M3 p. 23 |
| POWER MIG 210 MP | 27 A max / 14.7 A effective | 40 A super lag fuse or inverse-time breaker | 12 AWG (75 °C, conduit, 40 °C ambient) | not given | not given | L1 p. 9 |
| Millermatic 211 (2016) | 16.6 A at rated output, no I1max | 25 A time-delay, 30 A normal | 14, 14 AWG | 72 ft (22 m) | 2014 | M4 p. 19 |
| AC-225C | not given | 50 A super lag fuses | three 10 AWG copper in conduit; 8 AWG over 100 ft | n/a | not given | L2 p. 7 (NEMA 6-50R receptacle, 6-50P plug) |

Miller's guides: time-delay fuses are UL class RK5 and normal operating fuses class K5 (to 60 A); a circuit breaker in
place of a fuse should have comparable time-current curves; raceway conductors per Table 310.16 at 75 °C (M1, M2:
corrected for 40 °C ambient). M3 warns not to use its specification table for the electrical service. Rated outputs
from each manual's specification table.
