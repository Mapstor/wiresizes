# WSZ-036 · Air conditioner circuits: 2023 text of 440.4(B), 440.14, 240.4(G) and 250.122(A) from NFPA's records

Retrieved 2026-11-17 with curl from docinfofiles.nfpa.org and read with `scripts/research/nfpa-markup.py` (`[+…]`
inserted, `[-…]` struck; unmarked and struck text in a public input filed against NFPA 70-2023 is the 2023 edition's
text). The round-4 data had 440.4(B) and 440.14 only as 2026 draft text and 250.122(A)'s second sentence as unseen
2023 wording.

## Documents

| id | document | url | pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| E1 | CMP-11 public inputs, 2026 cycle (A2025), filed against NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_PISubmittals.pdf | 349 | 10a60a07bab02c77 |
| E2 | CMP-10 public inputs, 2026 cycle (A2025) | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_PISubmittals.pdf | 642 | 56abe8a3092c4608 |
| E3 | CMP-5 public inputs, 2026 cycle (A2025) | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_PISubmittals.pdf | 559 | 3a90a4d3a382386f |
| E4 | Carrier 26SCA5 product data, Catalog No. 26SCA5-02PD, Edition Date 06/25 | https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf | 20 | 4d7d1fbd35a3e9b5 |
| E5 | Carrier 26SCA5C (coastal) product data, Catalog No. 26SCA5C-01PD, Edition Date 08/24 | https://www.shareddocs.com/hvac/docs/1009/Public/02/26SCA5C-01PD.pdf | 20 | adabe9158ee481fc |
| E6 | Amana ALXS3N specification sheet, SS-ALXS3N-R32, 04/25 | https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf | 24 | 7bfaf03a42e45e97 |

## Findings

- **440.4(B)** (E1 public input 487, pdf p. 159): multimotor and combination-load equipment carries a nameplate with
  the minimum supply circuit conductor ampacity and the maximum rating of the branch-circuit short-circuit and
  ground-fault protective device; the ampacity is calculated by Part IV, counting all motors and other loads operated
  at the same time, and the protective device rating shall not exceed the value calculated by Part III. Exceptions
  1 to 3 (single 15/20 A 120 V or 15 A 208/240 V circuits; room air conditioners; SCCR in one- and two-family
  dwellings). The input only adds an equivalent horsepower marking.
- **440.14** (E1 public input 1635, pdf p. 193): the disconnecting means within sight from, and readily accessible
  from, the equipment; permitted on or within the equipment; working space of 110.26(A); not on access panels or over
  the nameplate; Exceptions 1 and 2. The input only adds a reference to 110.29.
- **240.4(G) and Table 240.4(G)** (E2 public input 706, pdf p. 433): overcurrent protection for the specific
  conductors of the table is permitted as referenced there: air-conditioning and refrigeration equipment circuit
  conductors, Article 440 Parts III, IV, VI; motor and motor-control circuit conductors, Article 430 Parts II to VII;
  electric welder circuit conductors, 630.12 and 630.32. The input only adds a Services row (230.90(A)).
- **250.122(A)** (E3 public inputs 2573, pdf p. 433, and 3150, pdf p. 435; two submitters): wire-type equipment
  grounding conductors not smaller than Table 250.122, and "The equipment grounding conductor shall not be required
  to be larger than the circuit conductors supplying the equipment." Both print it unmarked.

- **440.22(A)** (already in data/verified/nec-430-440-2023.json: SR-7605 main rule, Eaton's 2023 reprint for the 175 %,
  225 % and 15 A values): used on the page only to say why the MOCP sits above the wire's ampacity.
- **440.4(B) exceptions** (E1, same page): No. 1, equipment for a single 15/20 A 120 V or 15 A 208/240 V circuit may be
  marked as a single load; No. 2, the MCA and maximum protective device need not be marked on a room air conditioner
  complying with 440.62(A); No. 3, no SCCR marking in one- and two-family dwellings.

## The makers' product data, re-read (E4 to E6)

Downloaded with curl and read with `pdftotext -layout`.

- **E4, pdf p. 9, Electrical Data:** sizes 18 to 60 at 208/230/1; MCA 10.9, 13.6, 16.5, 17.6, 22.7, 29.1, 31.1; MAX FUSE
  or CKT BRK 15, 20, 25, 30, 35, 40, 50; the dagger on MAX FUSE reads "Time-Delay fuse."; MCA is defined as Minimum
  Circuit Amps. Note under the table: "Copper wire must be used from service disconnect to unit." All match
  mfr-equipment.json.
- **E5, pdf p. 9:** the same table and note, but 40.0 and 50.0 for sizes 42 and 48. E5 is the coastal model 26SCA5C, a
  separate model, so the 2026-10-20 "CONFLICTING" label on Carrier's 3.5- and 4-ton rows is replaced: the rows carry
  E4's MOCP and E5's as `mocp_conflict`. Both MOCPs give the same wire and ground wire (asserted in src/lib/ac-page.ts).
- **E6, pdf p. 3, Electrical Data:** 208/230-1; Minimum Circuit Ampacity 10.9, 10.9, 14.7, 17.5, 19.4, 25.6, 31.1; Max.
  Overcurrent Protection 15, 15, 25, 30, 30, 45, 50. Footnote 4: wire size per the National Electrical Code, long runs
  need larger wire. Footnote 5: "Must use time-delay fuses or HACR-type circuit breakers of the same size as noted."
  Note: always check the S&R plate. Wiring diagrams (pdf pp. 20 and 21): "USE COPPER CONDUCTORS ONLY." All values match
  mfr-equipment.json.

## Not found

440.32, 440.35 and 440.62 to 440.64 are in no CMP-11 record read (A2022 inputs, revisions and comments; A2025 inputs
and First Draft). The air conditioner page sizes conductors to the nameplate's minimum circuit ampacity as 440.4(B)
names it, and states no 440.32 or 440.35 rule.
