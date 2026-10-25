# R4-4: Motors (Art. 430), air-conditioning (Art. 440), welders (Art. 630) and EV (Art. 625), round 4

Retrieved 2026-10-20 (every item). Target: NFPA 70-2023.

**Budget**
- WebSearch: **21 of 24.**
- docinfofiles.nfpa.org: **6 of 6, no HTTP 429.**
- Other hosts: 15 fetches, all on hosts already used in rounds 2–3:
  - iaeimagazine.org
  - forums.mikeholt.com and mikeholt.com
  - captaincode2023.leviton.com
  - eaton.com
  - dca.georgia.gov
  - app.leg.wa.gov
  - www1.eere.energy.gov

  No new host needs approval.

**Method**
- All reads were WebFetch summarizer readouts. Quotes are split into segments under 120 characters.
- Where a value is called verified-sd2023, the pull included planted wrong values ("canaries") and the extractor rejected each one with the printed value. Two such pulls were made:
  - **Fetch D2** (CMP-12, 2023 cycle). Planted: 625.43 at "50 A / 120 V"; 625.44(A)(3) at "20, 30, or 40 A"; 625.54 citing "210.12".
  - **Fetch D5** (CMP-11, 2023 cycle). Planted: 430.52(C)(1)(b)(2) at "250 %"; (b)(3) with a "50 A" threshold; 440.22(A) at "150 %"; 440.22(A) Exception No. 3 at "20 A".

  All 7 canaries were rejected with the printed values.
- Condition 3 of verified-sd2023 is "nothing at the 2022 Technical Meeting or in Standards Council decisions changed it". **I could not check it directly.** NFPA's CAM list was not reached. The NFPA-staff IAEI column (Hannahs, 31 Aug 2022) gives only counts: "Of those CAMs, 18 passed, 23 failed, and 14 were not pursued." Where a final-2023 reprint or the 2026 base text agrees, that is noted per item.

---

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1 | 430.22 lead-in (125 % of FLC); Table 430.22(E) duty-cycle table | **UNVERIFIED** | — | 2023 cycle: no SR, no PC cited. 2026 SD: SR-8012 adds 430.22(H) and does not print the lead-in. PC 1262-NFPA 70-2024 [430.22] exists, but its file was not found |
| 2 | 430.24 | VERIFIED-2023 (unchanged; not re-pulled) | PI 445 (A4) | — |
| 3 | 430.32(A)(1) overload percentages | **UNVERIFIED** | — | 2023 cycle: no SR, no PC. 2026: only (D)(2), editorial (PI 2702 / FR-7945) |
| 4 | Table 430.52(C)(1) | VERIFIED-2023 (unchanged) | Eaton E23 | Offset read re-confirms the notes' cross-reference to "430.52(C)(1)(a) and (C)(1)(b)" |
| 5 | 430.52(C)(1)(a): next higher standard rating | rule VERIFIED-draft (unchanged) | SR-7526 (A4) | wording flattened |
| 6 | 430.52(C)(1)(b)(2) 225 %; (b)(3) 400 % if FLC ≤ 100 A, 300 % if > 100 A; (b)(4) 300 % | **verified-sd2023** | SD11-23 SR-7526 (A4 pull + D5 canary pull) | canaries "250 %" and "50 A" rejected. TM: not checked |
| 7 | 430.52(C)(1)(b)(1) 400 % (nontime-delay ≤ 600 A, or time-delay Class CC) | VERIFIED-draft (single pull, A4) | SR-7526 | not in D5's checks |
| 8 | Table 430.7(B) rows | **UNVERIFIED** | — | Meaning only, VERIFIED-draft: "kilovolt-amperes per horsepower with locked rotor" by code letter (SR-7538). DOE tip-sheet table rejected (NEMA MG 1-2011, anomalous) |
| 9 | 430.110(A): disconnect ≥ 115 % of FLC | **verified-sd2023** | SD11-23 SR-7538 (D5) + 2026 FD base text (A4) | "1000 volts, nominal, or less" is single-pull VERIFIED-draft. The wording "a current rating" (not "ampere rating") is confirmed by the 2026 base text |
| 10 | 430.110(B) torque motors 115 % of nameplate; (C)(2) 115 % of summed full-load currents; (C)(3) small-motor LRC = 6 × FLC | VERIFIED-draft (2023 SD, single pull) | SR-7538 | — |
| 11 | 440.4(B) | 2023 UNVERIFIED; VERIFIED-draft (2026 SD SR-8073), unchanged | — | no SR or PC on 440.4 in the 2023 cycle |
| 12 | 440.22(A) main paragraph and Exceptions 1–3 | **verified-sd2023** (paragraph); VERIFIED-2023 (values, Eaton) | SR-7605 (A4 + D5); E23 re-read | canaries "150 %" and "20 A" rejected. 175 / 225 / 15 agree with the final-2023 Eaton reprint |
| 13 | 440.32 | **UNVERIFIED** | — | no SR or PC in either cycle's documents read |
| 14 | 440.33 | VERIFIED-draft (2026 FD), unchanged | — | — |
| 15 | 440.62(A)–(C), 440.63, 440.64 | **UNVERIFIED** | — | 2026-cycle PIs 811/812/813 (on 440.62/440.63/440.64) carry 2023 text, but sit beyond the readable window |
| 16 | 630.11(A) incl. I1eff, Table 630.11(A), 630.11(B) | **UNVERIFIED** | — | No SR in the 2023 cycle (two pulls). No 630 PI in the readable 2026 PI window |
| 17 | 630.12(A)/(B) 200 % | VERIFIED-draft (2026 SD SR-7788), unchanged | — | no SR in the 2023 cycle (two pulls) |
| 18 | 625.40 | VERIFIED-2023 (Leviton 357); verified-sd2023 agrees (SR-7714) | Leviton; SD12-23 | The SD's Exception includes struck words; use the Leviton wording |
| 19 | 625.41 (125 %) | **UNVERIFIED** | tier 4 only | No SR in the 2023 cycle or in the 2026 SD. T4 forum quote of the 2023-era text says 125 percent |
| 20 | 625.42 | VERIFIED-2023 (Leviton, re-read); verified-sd2023 agrees (SR-7715) | Leviton; SD12-23 | — |
| 21 | 625.44(A)/(B) lead-ins and items (1), (2), (4) | VERIFIED-draft (2023 SD, one canary-protected pull; word for word equal to the 2020 Leviton reprint) | SR-7725/7727 | — |
| 22 | 625.44 item (3): 14-60R (125/250 V, 60 A) added in 2023 | **verified-sd2023 (intent only)**; exact wording UNVERIFIED | SR-7725/7727 text + statements | printed "30, 50, or 50 60 amperes" |
| 23 | 625.50 | **UNVERIFIED** | — | no SR in 2023 or 2026 |
| 24 | 625.17(A) | **UNVERIFIED** (2023) | — | no SR in the 2023 cycle; 2026 SR-7856 values are draft only |
| 25 | 625.54 core sentence | **verified-sd2023** | SR-7731 (D1 + D2) | The 2020 lead-in "In addition to the requirements in 210.8" is gone in 2023 |
| 26 | 625.54 trailing "in accordance with 210.8" | **CONFLICTING** | SR-7731 vs a T4 2023 quote and the 2026 base text | do not render |

---

## 2. Evidence

### 2.1 Documents used

**Tier 1 (NFPA's own documents; no reprint notice)**
- **SD12-23.** NFPA 70, A2022 cycle, CMP-12 Second Revision compilation.
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf
  - Printed 12/7/2021 (A4). Readable to 670.1.
  - Fetches D1 (data) and D2 (canary pull).
- **SD11-23.** NFPA 70, A2022 cycle, CMP-11 Second Revision compilation, printed 12/6/2021.
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf
  - SR-7538 header: "Submittal Date: Wed Oct 13 13:28:16 EDT 2021. Response Message: SR-7538-NFPA 70-2021."
  - Fetch D5 (canary pull).
- **SD11-26.** NFPA 70, A2025 cycle, CMP-11 Second Draft working draft. Last section visible: 440.15 (SR-8080).
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf
  - Fetch D4.
- **AG11-26.** CMP-11 Second Draft meeting packet, A2025 cycle: agenda for 18–19 Oct 2024 (Torrance, CA), roster dated 09/27/2024, January 2024 minutes, Task Group 1 and 2 PI reports, one Global PC (No. 1651).
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_MeetingAgenda_1024.pdf
  - Fetch D6.
- **PI12-26.** NFPA 70, A2025 cycle, CMP-12 Public Input compilation, 323 pages. Readable only to p. 33, where it ends inside PI 1246 (new 620.7).
  - URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_PISubmittals.pdf
  - Fetch D3.

**Tier 2 (reprints with an NFPA notice)**
- **E23.** Eaton Bussmann "2023 NEC® Code Changes", bus-ele-br-11318.
  - URL: https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf
  - Read twice: once without an offset (text ends at p. 38, inside 430.6(A)), once at offset 90000 (pp. 34–43).
  - Notice: "Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition. Copyright© 2022, National Fire Protection Association. For a full copy of the NFPA 70®, please go to www.nfpa.org."
- **LEV357.** Leviton Captain Code 2023, node 357: https://captaincode2023.leviton.com/node/357
  - Notice: "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved."
  - Sections on the page: 625.40, 625.42(A), 625.42(B), 625.42, 625.43, 750.30, 750.30(C), 110.25. **No 625.41.**

**Tier 4 (corroboration only)**
- Mike Holt forum, "PI 625.41", wwhitney, 30 Mar 2023: https://forums.mikeholt.com/threads/pi-625-41.2573515
- Mike Holt forum, "EVSE and GFCI PROTECTION", post #61 of 30 Mar 2024: https://forums.mikeholt.com/threads/evse-and-gfci-protection.2579989/post-2909748
- Mike Holt Enterprises, "Understanding 2023 NEC Requirements for Solar PV and Energy Storage Systems", Article 625 excerpt. No notice; paraphrase. https://mikeholt.com/files/PDF/23_SOLAR_Article_625.pdf
- IAEI NFPA Code Talk, "Making of the 2023 NEC: A Cycle Like No Other", Corey Hannahs (NFPA Senior Electrical Specialist), 31 Aug 2022: https://iaeimagazine.org/columns/nfpa-code-talk/making-of-the-2023-nec-a-cycle-like-no-other/

### 2.2 Article 430

**430.110 (SR-7538, 2023-cycle SD; D5).** Statement: "Updates included to address CC concerns on use of ampacity vs current." / "Changes made to better address Design A motor LRC calculations." PCs cited: 996 [430.110] and 1582 [430.110(C)(1)].

- "430.110 Ampere Current Rating and Interrupting Capacity." / "(A) General."
- "The disconnecting means for motor circuits rated 1000 volts, nominal, or less shall have an ampere a"
- "current rating not less than 115 percent of the full-load current rating of the motor."
  - "an ampere a" is flattened markup: "an ampere" struck, "a current" inserted.
  - A4's pull of the 2026 First Draft, whose base text is the 2023 edition, reads "nominal, or less shall have a current rating not less than 115 percent of the fullload current rating of the motor."
  - **The two documents agree.** In D5, candidate K1 (115 %) matched while the same pull rejected four canaries.
- Exception: "A listed unfused motor-circuit switch having a horsepower rating not less than the motor horsepower" / "shall be permitted to have an ampere a current rating less than 115 percent of the full-load current" / "rating of the motor."
- (B): "Disconnecting means for a torque motor shall have an ampere a current rating of at least 115 percent" / "of the motor nameplate current."
- (C)(2): "The ampere current rating of the disconnecting means shall not be less than 115 percent of the sum of all currents" / "at the full-load condition determined in accordance with 430.110(C)(1)."
- (C)(3): "For small motors not covered by Table 430.247, Table 430.248, Table 430.249, or Table 430.250," / "the locked-rotor current shall be assumed to be six times the full-load current."
- (C)(1) Exception No. 1 (Design A motors) defines the table's meaning: "kVA/hp = maximum range value of kilovolt-amperes per horsepower with locked rotor" / "in Table 430.7(B) associated with the motor's marked locked-rotor" / "indicating code letter". Equations 430.110(C)(1)a and b were not extracted (placeholders).
- 2026 note: SR-8089 revises 430.110(C)(1) Exception No. 1 again (SD11-26, D4).

**430.52(C)(1)(b) (SR-7526; D5 canary pull plus A4's earlier pull)**
- K2, planted "250 percent": rejected. Printed: "shall be permitted to be increased but shall in no case exceed 225 percent of the full-load current."
- K3, planted "50 amperes": rejected. Printed: "shall in no case exceed 400 percent for full-load currents of 100 amperes or less" / "or 300 percent for full-load currents greater than 100 amperes."
- K4, (b)(4) 601–6000 A fuses at "300 percent": MATCH.
- Item (b)(1) (400 %) was not in this pull, so it stays single-pull VERIFIED-draft.
- The E23 table notes, read at offset 90000, show the 2023 renaming flattened: "may can be modified as in 430.52(C)(1), Exceptions No. 1 and No. 2 430.52(C)(1)(a) and (C)(1)(b)."

**430.22 (lead-in and Table 430.22(E)): UNVERIFIED.**
- D5 Part 3: the 2023-cycle CMP-11 SR compilation cites no Public Comment for 430.22, 430.32, 430.7, 440.4, 440.32, 440.62, 440.63 or 440.64. Those numbers appear only as cross-references. A4 already showed there is no SR on them.
- D4 (2026 SD): "SR-8012-NFPA 70-2024 adds 430.22(H) under the bracketed note '[ New Section after 430.22(G) ].' It does not print or revise the 430.22 heading or lead-in paragraph."
  - SR-8012 statement: "This requirement will provide an adequate level of safety for the protection of conductors for these motor designs." / "Language changes were made to clarify the references to short circuit current temperatures."
- D4 also cites "Public Comment No. 1262-NFPA 70-2024 [Section No. 430.22]".
  - A 2026-cycle PC on the whole section normally reprints the First Draft text, which would show the 2023 lead-in.
  - Its compilation file was not found. AG11-26 (D6) holds no PC text, and the "1262" listed there is **PI** 1262 on 440.11 (TG2-4), a different item.
- T4 only (IAEI 2000, Johnston, paraphrase, no notice).

**430.32(A)(1): UNVERIFIED.**
- No SR and no PC in the 2023 cycle (D5).
- No SR in the 2026 SD (D4).
- 2026 cycle: only PI 2702 on 430.32(D)(2), "editorial change made for section to meet NEC Style manual section 4.1.4." (D6), which matches round 1's FR-7945.
- All searches returned forums, exam-prep and trade press only.

**Table 430.7(B): rows UNVERIFIED.**
- D4: "Table 430.7(B) is not printed in this document. It is only referenced in the Exception No. 1 text under 430.110(C)(1) (SR-8089)". SD11-23 also only references it.
- Rejected source: US DOE AMO Motor Systems Tip Sheet #6, "Avoid Nuisance Tripping with Premium Efficiency Motors", DOE/GO-102012-3731, Nov 2012. https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/avoid_nuisance_motorsys_ts6.pdf
  - Its "Table 1. NEMA Locked-Rotor Code Letters" is attributed to NEMA MG 1-2011, not the NEC.
  - As extracted it runs A–L only and includes a letter "I" (for example "I 7.1–8.0", "J 8.0–9.0").
  - **Do not use it, even as a cross-check.**

### 2.3 Article 440

**440.22(A) (SR-7605; D5 canary pull plus A4's earlier pull)**
- K5, planted "150 percent": rejected. Printed: "A protective device having a rating or setting not exceeding 175 percent of the motor-compressor" / "rated-load current or branch-circuit selection current, whichever is greater, shall be permitted."
- K6 (Exception No. 2, "225 percent ... whichever is greater"): MATCH.
- K7, planted "20 amperes": rejected. Printed: "shall not be required to be less than 15 amperes."
- E23 at offset 90000 (final 2023 reprint) gives the same values. Its main paragraph again includes the struck 2020 clause "provided that, where the protection specified is not sufficient for the starting current of the motor, ... shall not exceed 225 percent ...". Per SR-7605 that clause is not 2023 text, which is A4's resolution.
- E23 Exception No. 1: "or available settings of adjustable circuit breakers, a higher size, rating, or available setting that does not exceed" / "the next higher standard ampere rating shall be permitted."

**440.4(B), 440.32, 440.62–440.64: UNVERIFIED (2023).**
- D5: no 2023-cycle PC cited. D4: no 2026 SR. "440.62(A)" appears only as a cross-reference in SR-8073's 440.4 Exception No. 2.
- D6: 2026-cycle PIs 811 (440.62), 812 (440.63) and 813 (440.64) exist, all with: "Resolve. Substantiation has not been provided for adding 277 V single phase, 250 V three phase."
  - These PIs reprint the 2023 text.
  - In the CMP-11 PI compilation they sit after Article 430, beyond the page-41 window that A4 found.

### 2.4 Article 630

- D1 Task C: "No. The provided content has SRs for 630.8 (SR-7585), 630.13 (SR-7589), and 630.33 (SR-7590) only." So no Second Revision touched 630.11, Table 630.11(A) or 630.12 in the 2023 cycle. A4 agrees.
- D3: no PI on 630.x is visible. The PI window ends at p. 33 of 323, inside Article 620.
- Searches (welders, IAEI, Eaton, government hosts) found only forums, OSHA 1910.254/1910.304 (not NEC) and a 2005 Cooper Bussmann page.
  - The Bussmann page (https://www.eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/solution-center/bus-ele-tech-lib-welder-protection.pdf) has no notice and no table. It paraphrases 630.12: "Arc Welders must be protected by a fuse rated at not more than 200% of the rated primary current."
- **Table 630.11(A), 630.11(A) including I1eff, and 630.11(B) remain UNVERIFIED.**

### 2.5 Article 625

**2023-cycle Article 625 Second Revisions (D1; D2 confirms the numbers used):**

| SR | Section |
|---|---|
| 7703 | 625.6 |
| 7713 | 625.22 |
| 7714 | 625.40 |
| 7715 | 625.42 |
| 7716 | 625.42(A) |
| 7721 | 625.42(B) |
| 7722 | 625.43 |
| 7725 | 625.44(A) |
| 7727 | 625.44(B) |
| 7728 | 625.46 |
| 7731 | 625.54 |
| 7744 | Art. 100, EVSE |
| 7749 | Art. 100, Power-Supply Cord (as applied to EVSE), deleted |
| 7748 | Art. 100, Load Management System, deleted |
| 7753 | Art. 100, WPTE |

**No SR on 625.17, 625.41 or 625.50.**

**625.40.**
- C1 MATCH on "Each outlet installed for the purpose of supplying EVSE greater than 16 amperes or 120 volts" / "shall be supplied by an individual branch circuit." This equals the Leviton 2023 text.
- The SD Exception reads "Exception: Branch circuits shall be permitted to feed multiple EVSEs provided a load" / "management system is used as permitted by 625.42(A) or (B)."
- The final 2023 Exception (Leviton, round 1) has no "provided a load management system is used". That phrase is struck text, consistent with SR-7748 deleting the "Load Management System" definition.

**625.41: UNVERIFIED.**
- No SR (D1); Leviton 357 has no 625.41 (re-confirmed).
- T4: the PI author's quote of the then-current text (30 Mar 2023):
  - "Overcurrent protection for feeders and branch circuits supplying EVSE and WPTE, including bidirectional EVSE and WPTE,"
  - "shall be sized for continuous duty and shall have a current rating of not less than 125 percent"
  - "of the maximum load of the equipment."
  - "Where noncontinuous loads are supplied from the same feeder, the overcurrent device shall have a current rating"
  - "of not less than the sum of the noncontinuous loads plus 125 percent of the continuous loads."
- T4: Mike Holt 2023 paraphrase, "Overcurrent protection must be sized at no less than 125 percent of the electric vehicle supply equipment current rating."
- A phrase search shows the "including bidirectional EVSE and WPTE, shall be sized for continuous duty" wording inside 70_A2025_NEC_P12_FD_PrelimFR.pdf. This is probably the new 627.41 copy, since A1 read pages 1–21 and saw no 625.41 there. Not read.

**625.42.**
- Leviton re-read: "625.42 Rating. The EVSE shall have sufficient rating to supply the load served." / "Electric vehicle charging loads shall be considered to be continuous loads for the purposes of this article."
- SR-7715, C6: MATCH. The continuous-load sentence is present in the SD.

**625.44 (SR-7725 for (A), SR-7727 for (B); D2).**
- Both statements: "Section revised to allow 14-60R receptacles."
- (A): "Portable equipment shall be connected to the premises wiring system by one or more of the following methods:"
  - (1) "...rated at 125 volts, single phase, 15 or 20 amperes"
  - (2) "...rated at 250 volts, single phase, 15 or 20 amperes"
  - (3) "A nonlocking, 2-pole, 3-wire or 3-pole, 4-wire grounding-type receptacle outlet rated at 250 volts, single phase," / "30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"
  - (4) "...rated at 60 volts dc maximum, 15 or 20 amperes"
- (B): "Equipment that is fastened-in-place shall be connected to the premises wiring system by one of the following methods:"
  - (1) "...rated 125 volts or 250 volts," / "single phase, up to 50 amperes"
  - (2) "...3-pole, 4-wire ... rated 250 volts, three phase, up to 50 amperes"
  - (3) "A nonlocking, 3-pole, 4-wire grounding-type receptacle outlet rated 125/250 volts, single phase," / "30, 50, or 50 60 amperes"
  - (4) "...rated 60 volts dc maximum, 15 or 20 amperes"
- Reading of the (3) items:
  - "30, 50, or 50 60" is what the markup produces if First Draft "30 or 50" became "30, 50, or 60": ", 50," inserted, "50" struck, "60" inserted. That fits the statement.
  - It is still an inference. Whether "250 volts, single phase, 30 or 50 amperes, or" in (A)(3) survives in the final text can't be told.
  - **Render neither (3) item word for word.**
- Items (1), (2) and (4) carry no markup and equal the 2020 Leviton text word for word.

**625.50 and 625.17(A): UNVERIFIED.**
- No SR in the 2023 cycle (D1); none on 625.50 in the 2026 SD (R3-1).
- The search for the 625.50 heights found only EC&M, a 2024 California city .docx (CEC 2022 era) and a NYSERDA overview. None was fetched.

**625.54 (SR-7731).**
- D1: "All receptacles installed for the connection of electric vehicle charging shall have ground-fault" / "circuit-interrupter protection for personnel in accordance with 210.8 ."
- D2: the "210.12" canary was rejected, with the printed text "in accordance with 210.8". "In addition to the requirements in 210.8" does not appear.
- Statement: "Section revised for clarity and eliminated confusion."
- The trailing phrase conflicts with two other sources:
  - the T4 2023 quote (Fred B, quoted by don_resqcapt19, 30 Mar 2024): "All receptacles installed for the connection of electric vehicle charging shall have" / "ground-fault circuit-interrupter protection for personnel.";
  - the 2026 base text in the TIA 1892 redline (rounds 2–3).

  Both lack it. Like the 625.40 and 625.43 cases, it is probably struck text. Do not render it.

**Method warning: flattened 2023 Second Draft text contains struck words.**
- 625.43, SR-7722, printed: "For EVSE and WPTE rated more than 60 amperes or more than 150 volts to ground, the disconnecting means" / "shall be provided and installed in a readily accessible location, adjacent to or remote from the equipment."
- The final 2023 text (Leviton) has no "adjacent to or remote from the equipment".
- With 625.40's Exception, that makes two confirmed cases. **Any SD-only item must be rendered by value, never word for word.**

### 2.6 What a calculator may use (verified items only)

- **Motor branch SC/GF device** (Table 430.52(C)(1), VERIFIED-2023):
  - max rating = table percent (by motor type and device) × Table FLC (430.6(A)).
  - If that is not a standard size, the next higher standard rating per 240.6 is allowed (430.52(C)(1)(a), rule VERIFIED-draft).
  - Only if the motor will not start:
    - dual-element fuse ≤ 225 %;
    - inverse-time breaker ≤ 400 % (FLC ≤ 100 A) or ≤ 300 % (FLC > 100 A);
    - 601–6000 A fuse ≤ 300 %.

    These are verified-sd2023. The 400 % nontime-delay / Class CC limit is draft only.
- **Motor disconnect:** current rating ≥ 1.15 × Table FLC (430.110(A), verified-sd2023; 430.6(A) puts switch ratings on table values).
- **Motor feeder conductors** (430.24, VERIFIED-2023): ≥ 1.25 × FLC of the largest motor + Σ other motors' FLC + noncontinuous non-motor + 1.25 × continuous non-motor.
- **Hermetic compressor SC/GF** (440.22(A)):
  - ≤ 1.75 × max(RLA, BCSC);
  - next higher standard rating permitted (Exc. 1);
  - ≤ 2.25 × max(RLA, BCSC) if needed to start (Exc. 2);
  - never required below 15 A (Exc. 3).
- **EV branch circuit:** conductor ampacity and OCPD ≥ 1.25 × EVSE continuous current + 1.0 × noncontinuous. Basis: 625.42 (continuous, VERIFIED-2023) with 210.19(A)(1) and 210.20(A) (VERIFIED-2023). **Cite those, not 625.41.**
- **Not computable from verified text:**
  - single-motor conductor 125 % (430.22);
  - overload percentages (430.32(A)(1));
  - code-letter LRC (Table 430.7(B));
  - compressor conductor 125 % (440.32);
  - room-AC 80 % / 50 % / cord length (440.62–440.64);
  - welder duty-cycle multipliers and group factors (630.11).

---

## 3. Machine-readable

Each block below was written to research2/r4_tmp/r4_4_NN.json and passed `python3 -I -c "import json,sys; json.loads(sys.stdin.read())"` (17 of 17). No quote segment exceeds 120 characters. Builder: research2/r4_4_work/build_json.py. Section order follows PREAMBLE-R4.

**430.110(A)**
```json
{"ref": "430.110(A)", "edition": "2023", "status": "verified-sd2023 (value 115 percent and the words 'a current rating'); voltage threshold '1000 volts, nominal, or less' VERIFIED-draft (single pull)", "values": {"disconnect_min_pct_of_table_flc": 115, "applies_to": "motor circuits rated 1000 volts, nominal, or less (single pull)", "exception": "listed unfused motor-circuit switch with hp rating not less than motor hp may have a current rating below 115 percent"}, "quote_segments": ["430.110 Ampere Current Rating and Interrupting Capacity.", "(A) General.", "The disconnecting means for motor circuits rated 1000 volts, nominal, or less shall have an ampere a", "current rating not less than 115 percent of the full-load current rating of the motor.", "Exception: A listed unfused motor-circuit switch having a horsepower rating not less than the motor horsepower", "shall be permitted to have an ampere a current rating less than 115 percent of the full-load current", "rating of the motor."], "flattened_markup": "'an ampere a current' = struck 'an ampere' + inserted 'a current' (SR statement: CC concern on ampacity vs current); 2026 FD base text reads 'a current rating' (A4)", "second_pull": "A4 round 2, 2026 FD11 (base = 2023 edition): 'nominal, or less shall have a current rating not less than 115 percent of the fullload current rating of the motor.'", "sr": "SR-7538-NFPA 70-2021; PCs 996 [430.110] and 1582 [430.110(C)(1)]", "committee_statement": ["Updates included to address CC concerns on use of ampacity vs current.", "Changes made to better address Design A motor LRC calculations."], "tm_check": "2022 Technical Meeting / Standards Council: not checked directly (NFPA CAM list not reached; IAEI NFPA Code Talk, Hannahs, 31 Aug 2022: 55 CAMs, 18 passed, 23 failed, 14 not pursued, sections not named); indirect: 2026 First Draft base text (the 2023 edition) agrees on 115 percent", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20", "canaries": [{"planted": "430.52(C)(1)(b)(2) dual-element fuse 250 percent", "rejected": true, "printed": "225 percent"}, {"planted": "430.52(C)(1)(b)(3) inverse-time CB threshold 50 amperes", "rejected": true, "printed": "100 amperes or less / 300 percent greater than 100 amperes"}, {"planted": "440.22(A) 150 percent", "rejected": true, "printed": "175 percent"}, {"planted": "440.22(A) Exception No. 3 20 amperes", "rejected": true, "printed": "15 amperes"}]}
```

**430.110(B), (C)(2), (C)(3); (C)(1) Exception No. 1 definition of kVA/hp**
```json
{"ref": "430.110(B), (C)(2), (C)(3); (C)(1) Exception No. 1 definition of kVA/hp", "edition": "2023", "status": "VERIFIED-draft (2023-cycle SD SR-7538, single pull)", "values": {"torque_motor_disconnect_min_pct_of_nameplate": 115, "combination_load_disconnect_min_pct_of_sum_full_load": 115, "small_motor_locked_rotor_assumed_multiple_of_flc": 6, "table_430_7B_meaning": "kilovolt-amperes per horsepower with locked rotor, by locked-rotor indicating code letter"}, "quote_segments": ["Disconnecting means for a torque motor shall have an ampere a current rating of at least 115 percent", "of the motor nameplate current.", "The ampere current rating of the disconnecting means shall not be less than 115 percent of the sum of all currents", "at the full-load condition determined in accordance with 430.110(C)(1).", "the locked-rotor current shall be assumed to be six times the full-load current.", "kVA/hp = maximum range value of kilovolt-amperes per horsepower with locked rotor", "in Table 430.7(B) associated with the motor's marked locked-rotor", "indicating code letter"], "note": "Equations 430.110(C)(1)a/b were not extracted (placeholders). 2026 cycle revises 430.110(C)(1) Exception No. 1 again (SR-8089, 2026 SD).", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**430.52(C)(1)(b)**
```json
{"ref": "430.52(C)(1)(b)", "edition": "2023", "status": "items (2), (3), (4) verified-sd2023; item (1) VERIFIED-draft (single pull, A4)", "values": {"b1_nontime_delay_fuse_le_600A_or_time_delay_class_CC_max_pct": {"value": 400, "status": "VERIFIED-draft"}, "b2_time_delay_dual_element_fuse_max_pct": {"value": 225, "status": "verified-sd2023"}, "b3_inverse_time_cb_max_pct_flc_le_100A": {"value": 400, "status": "verified-sd2023"}, "b3_inverse_time_cb_max_pct_flc_gt_100A": {"value": 300, "status": "verified-sd2023"}, "b4_fuse_601_6000A_class_max_pct": {"value": 300, "status": "verified-sd2023"}, "condition": "only where the Table 430.52(C)(1) rating, or the rating modified by (C)(1)(a), is not sufficient for the starting current"}, "quote_segments": ["shall be permitted to be increased but shall in no case exceed 225 percent of the full-load current.", "shall in no case exceed 400 percent for full-load currents of 100 amperes or less", "or 300 percent for full-load currents greater than 100 amperes.", "shall in no case exceed 300 percent of the full-load current"], "second_pull": "A4 round 2/3 pull of SR-7526 (same values; (b)(1) 400 percent seen only there)", "tm_check": "2022 Technical Meeting / Standards Council: not checked directly (NFPA CAM list not reached; IAEI NFPA Code Talk, Hannahs, 31 Aug 2022: 55 CAMs, 18 passed, 23 failed, 14 not pursued, sections not named)", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20", "canaries": [{"planted": "430.52(C)(1)(b)(2) dual-element fuse 250 percent", "rejected": true, "printed": "225 percent"}, {"planted": "430.52(C)(1)(b)(3) inverse-time CB threshold 50 amperes", "rejected": true, "printed": "100 amperes or less / 300 percent greater than 100 amperes"}]}
```

**440.22(A)**
```json
{"ref": "440.22(A)", "edition": "2023", "status": "main paragraph verified-sd2023 (SR-7605; A4 pull + this run's canary pull); values VERIFIED-2023 (Eaton, re-read this run at offset 90000)", "values": {"max_pct_of_greater_of_RLA_or_BCSC": 175, "exc1": "next higher standard ampere rating permitted", "exc2_max_pct_if_not_sufficient_for_starting": 225, "exc3_not_required_below_A": 15}, "quote_segments": ["A protective device having a rating or setting not exceeding 175 percent of the motor-compressor", "rated-load current or branch-circuit selection current, whichever is greater, shall be permitted.", "but shall not exceed 225 percent of the motor rated-load current or branch-circuit selection current,", "whichever is greater.", "shall not be required to be less than 15 amperes."], "eaton_flattened_note": "E23 main paragraph also prints the struck 2020 clause 'provided that, where the protection specified is not sufficient for the starting current ... 225 percent'; per SR-7605 that clause is not 2023 text (A4 resolution, re-confirmed).", "tm_check": "final-2023 Eaton reprint agrees on 175/225/15", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf"], "permission_notice": ["NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "Reproduced with permission of NFPA from NFPA 70®, National Electrical Code®, 2023 edition. Copyright© 2022, National Fire Protection Association. For a full copy of the NFPA 70®, please go to www.nfpa.org."], "retrieved": "2026-10-20", "canaries": [{"planted": "440.22(A) 150 percent", "rejected": true, "printed": "175 percent"}, {"planted": "440.22(A) Exception No. 3 20 amperes", "rejected": true, "printed": "15 amperes"}]}
```

**Table 430.7(B)**
```json
{"ref": "Table 430.7(B)", "edition": "2023", "status": "UNVERIFIED (rows); meaning VERIFIED-draft (SR-7538 text: kVA per hp with locked rotor)", "rows": [], "quote_segments": ["kVA/hp = maximum range value of kilovolt-amperes per horsepower with locked rotor"], "not_printed_in": ["70_A2022_NEC_P11_SD_SRStatements.pdf", "70_A2025_NEC_P11_SD_PrelimSR.pdf (referenced only in 430.110(C)(1) Exc. 1, SR-8089)"], "rejected_source": {"doc": "US DOE AMO Motor Systems Tip Sheet #6, DOE/GO-102012-3731 (Nov 2012), 'Table 1. NEMA Locked-Rotor Code Letters'", "url": "https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/avoid_nuisance_motorsys_ts6.pdf", "reason": "NEMA MG 1-2011, not NEC; single extraction; letter sequence as extracted includes 'I' and runs A-L only. Do not use."}, "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**430.22 (lead-in 125 percent; Table 430.22(E))**
```json
{"ref": "430.22 (lead-in 125 percent; Table 430.22(E))", "edition": "2023", "status": "UNVERIFIED", "values": {"single_motor_conductor_pct_of_flc": null}, "quote_segments": [], "negative_evidence": ["2023 cycle: no SR on 430.22 and no Public Comment cited for 430.22 in the CMP-11 SR compilation (this run, D5)", "2026 SD: SR-8012 adds 430.22(H) '[ New Section after 430.22(G) ]' without printing the lead-in (D4)"], "lead": "Public Comment No. 1262-NFPA 70-2024 [Section No. 430.22] (2026 cycle) would reprint the 2026 First Draft text of 430.22; its compilation file was not found (CMP-11 SD agenda packet has no PC text).", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_MeetingAgenda_1024.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**430.32(A)(1)**
```json
{"ref": "430.32(A)(1)", "edition": "2023", "status": "UNVERIFIED", "values": {"sf_1_15_or_more_pct": null, "temp_rise_40C_or_less_pct": null, "all_other_pct": null}, "quote_segments": [], "negative_evidence": ["2023 cycle: no SR, no PC cited (D5)", "2026 SD: no SR on 430.32 (D4)", "2026 cycle: only PI 2702 / FR-7945 on 430.32(D)(2), editorial (agenda packet D6; round 1)"], "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_MeetingAgenda_1024.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**440.4(B), 440.32, 440.62(A)-(C), 440.63, 440.64**
```json
{"ref": "440.4(B), 440.32, 440.62(A)-(C), 440.63, 440.64", "edition": "2023", "status": "UNVERIFIED (2023 text); 440.4(B) remains VERIFIED-draft from 2026 SD SR-8073", "values": {}, "quote_segments": ["Resolve. Substantiation has not been provided for adding 277 V single phase, 250 V three phase."], "negative_evidence": ["2023 cycle: no SR and no PC cited for 440.4, 440.32, 440.62, 440.63, 440.64 (D5)", "2026 SD: no SR on 440.32 or 440.62-440.64; 440.62(A) only cross-referenced in SR-8073 Exception No. 2 (D4)"], "lead": "2026-cycle PIs 811 (440.62), 812 (440.63), 813 (440.64) reprint the 2023 text, but sit beyond the readable window of 70_A2025_NEC_P11_PISubmittals.pdf (ends p. 41).", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P11_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_MeetingAgenda_1024.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**630.11(A), Table 630.11(A), 630.11(B), 630.12(A)/(B)**
```json
{"ref": "630.11(A), Table 630.11(A), 630.11(B), 630.12(A)/(B)", "edition": "2023", "status": "630.11: UNVERIFIED. 630.12: VERIFIED-draft (2026 SD SR-7788, unchanged). Negative: no 2023-cycle SR on 630.11, Table 630.11(A) or 630.12 (verified-sd2023, two pulls)", "values": {"table_630_11A_rows": [], "group_pcts_630_11B": null, "welder_ocpd_max_pct_630_12A": {"value": 200, "status": "VERIFIED-draft (2026 SD)"}, "conductor_ocpd_max_pct_of_ampacity_630_12B": {"value": 200, "status": "VERIFIED-draft (2026 SD)"}}, "quote_segments": [], "sr_list_2023_cycle_art630": ["SR-7585 (630.8)", "SR-7589 (630.13)", "SR-7590 (630.33)"], "lead": "No PI on 630.x inside the readable window of 70_A2025_NEC_P12_PISubmittals.pdf (window ends p. 33 of 323, in 620.7).", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_PISubmittals.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**Article 625 Second Revisions, 2023 cycle (CMP-12)**
```json
{"ref": "Article 625 Second Revisions, 2023 cycle (CMP-12)", "edition": "2023 cycle (A2022)", "status": "verified-sd2023 (list; two pulls)", "values": {"SR": {"7703": "625.6", "7713": "625.22", "7714": "625.40", "7715": "625.42", "7716": "625.42(A)", "7721": "625.42(B)", "7722": "625.43", "7725": "625.44(A)", "7727": "625.44(B)", "7728": "625.46", "7731": "625.54", "7744": "Art. 100 EVSE", "7749": "Art. 100 Power-Supply Cord (as applied to EVSE), deleted", "7748": "Art. 100 Load Management System, deleted", "7753": "Art. 100 WPTE"}, "no_SR": ["625.17", "625.41", "625.50"]}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**625.40**
```json
{"ref": "625.40", "edition": "2023", "status": "VERIFIED-2023 (Leviton node 357) and verified-sd2023 (SR-7714, canary-protected MATCH) agree on the main sentence", "values": {"individual_branch_circuit_when": "EVSE greater than 16 amperes or 120 volts"}, "quote_segments": ["Each outlet installed for the purpose of supplying EVSE greater than 16 amperes or 120 volts", "shall be supplied by an individual branch circuit."], "flattened_markup": "SD Exception reads 'feed multiple EVSEs provided a load management system is used as permitted by 625.42(A) or (B)'; the final 2023 Exception (Leviton, round 1) has no 'provided a load management system is used' (struck; SR-7748 deleted that definition). Use the Leviton wording.", "source_url": ["https://captaincode2023.leviton.com/node/357", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf"], "permission_notice": ["Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. / National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved.", "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)"], "retrieved": "2026-10-20", "canaries": [{"planted": "625.43 more than 50 amperes or more than 120 volts to ground", "rejected": true, "printed": "more than 60 amperes or more than 150 volts to ground"}, {"planted": "625.44(A)(3) 250 volts, single phase, 20, 30, or 40 amperes", "rejected": true, "printed": "250 volts, single phase, 30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"}, {"planted": "625.54 in accordance with 210.12", "rejected": true, "printed": "in accordance with 210.8"}]}
```

**625.41**
```json
{"ref": "625.41", "edition": "2023", "status": "UNVERIFIED (no tier 1-3 source). No SR in the 2023 cycle (two pulls) or the 2026 SD (R3-1)", "values": {"ocpd_pct_of_max_load": null}, "quote_segments": [], "tier4_observations": [{"source": "Mike Holt forum, 'PI 625.41', wwhitney, 30 Mar 2023 (existing text as quoted by the PI author)", "url": "https://forums.mikeholt.com/threads/pi-625-41.2573515", "segments": ["Overcurrent protection for feeders and branch circuits supplying EVSE and WPTE, including bidirectional EVSE and WPTE,", "shall be sized for continuous duty and shall have a current rating of not less than 125 percent", "of the maximum load of the equipment."]}, {"source": "Mike Holt Enterprises, Understanding 2023 NEC Requirements for Solar PV and ESS, Art. 625 excerpt (no notice; paraphrase)", "url": "https://mikeholt.com/files/PDF/23_SOLAR_Article_625.pdf", "segments": ["Overcurrent protection must be sized at no less than 125 percent of the electric vehicle supply equipment", "current rating."]}], "calculator_rule_instead": "625.42 (EV loads continuous, VERIFIED-2023) + 210.19(A)(1) and 210.20(A) (VERIFIED-2023): conductor ampacity and OCPD >= noncontinuous + 125 percent of continuous load", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**625.42**
```json
{"ref": "625.42", "edition": "2023", "status": "VERIFIED-2023 (Leviton node 357, re-read) and verified-sd2023 (SR-7715, canary-protected MATCH on the continuous-load sentence)", "values": {"ev_charging_load": "continuous"}, "quote_segments": ["625.42 Rating. The EVSE shall have sufficient rating to supply the load served.", "Electric vehicle charging loads shall be considered to be continuous loads for the purposes of this article."], "source_url": ["https://captaincode2023.leviton.com/node/357", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf"], "permission_notice": ["Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. / National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved.", "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)"], "retrieved": "2026-10-20", "canaries": [{"planted": "625.43 more than 50 amperes or more than 120 volts to ground", "rejected": true, "printed": "more than 60 amperes or more than 150 volts to ground"}, {"planted": "625.44(A)(3) 250 volts, single phase, 20, 30, or 40 amperes", "rejected": true, "printed": "250 volts, single phase, 30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"}, {"planted": "625.54 in accordance with 210.12", "rejected": true, "printed": "in accordance with 210.8"}]}
```

**625.44(A), (B)**
```json
{"ref": "625.44(A), (B)", "edition": "2023", "status": "items (1), (2), (4) and lead-ins: VERIFIED-draft (2023 SD, one canary-protected pull; word-for-word equal to the 2020 Leviton reprint). Item (3) change to allow 14-60R: verified-sd2023 (intent, two pulls + SR statement). Exact item (3) wording: UNVERIFIED (flattened '50 60'). (C): not seen", "values": {"A_portable": {"1": "125 V, 1-ph, 15 or 20 A, 2-pole 3-wire", "2": "250 V, 1-ph, 15 or 20 A, 2-pole 3-wire", "3": "UNVERIFIED wording; tokens: 250 V 1-ph 30 or 50 A, or 125/250 V 1-ph 30, 50, or [50 60] A", "4": "60 V dc max, 15 or 20 A, 2-pole 3-wire"}, "B_fastened_in_place": {"1": "125 V or 250 V, 1-ph, up to 50 A, 2-pole 3-wire", "2": "250 V, 3-ph, up to 50 A, 3-pole 4-wire", "3": "UNVERIFIED wording; tokens: 125/250 V 1-ph 30, 50, or [50 60] A, 3-pole 4-wire", "4": "60 V dc max, 15 or 20 A, 2-pole 3-wire"}, "sr_intent": "Section revised to allow 14-60R receptacles."}, "quote_segments": ["Portable equipment shall be connected to the premises wiring system by one or more of the following methods:", "(3) A nonlocking, 2-pole, 3-wire or 3-pole, 4-wire grounding-type receptacle outlet rated at 250 volts, single phase,", "30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes", "Equipment that is fastened-in-place shall be connected to the premises wiring system by one of the following methods:", "(3) A nonlocking, 3-pole, 4-wire grounding-type receptacle outlet rated 125/250 volts, single phase,", "30, 50, or 50 60 amperes", "Section revised to allow 14-60R receptacles."], "tm_check": "2022 Technical Meeting / Standards Council: not checked directly (NFPA CAM list not reached; IAEI NFPA Code Talk, Hannahs, 31 Aug 2022: 55 CAMs, 18 passed, 23 failed, 14 not pursued, sections not named)", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20", "canaries": [{"planted": "625.43 more than 50 amperes or more than 120 volts to ground", "rejected": true, "printed": "more than 60 amperes or more than 150 volts to ground"}, {"planted": "625.44(A)(3) 250 volts, single phase, 20, 30, or 40 amperes", "rejected": true, "printed": "250 volts, single phase, 30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"}, {"planted": "625.54 in accordance with 210.12", "rejected": true, "printed": "in accordance with 210.8"}]}
```

**625.50, 625.17(A)**
```json
{"ref": "625.50, 625.17(A)", "edition": "2023", "status": "UNVERIFIED (no SR in the 2023 cycle; none in the 2026 SD for 625.50; 625.17 2026 SR-7856 values are 2026 draft only)", "values": {}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20"}
```

**625.54**
```json
{"ref": "625.54", "edition": "2023", "status": "core sentence verified-sd2023 (SR-7731, two pulls, canary '210.12' rejected); trailing 'in accordance with 210.8' CONFLICTING (do not render)", "values": {"gfci_required_for": "all receptacles installed for the connection of electric vehicle charging", "in_addition_to_210_8_phrase_2020": "absent from SR-7731 (pull 2)"}, "quote_segments": ["All receptacles installed for the connection of electric vehicle charging shall have ground-fault", "circuit-interrupter protection for personnel in accordance with 210.8 ."], "conflict": {"sd_2023": "'... for personnel in accordance with 210.8.' (space before the period in pull 1 suggests change markup)", "tier4_2023_quote": "Mike Holt forum, Fred B quoted by don_resqcapt19, 30 Mar 2024, '2023NEC 625.54': ends '...protection for personnel.'", "base_2026": "TIA 1892 redline base (2026 edition) has no 'in accordance with 210.8' (round 2/3)"}, "committee_statement": "Section revised for clarity and eliminated confusion.", "tm_check": "2022 Technical Meeting / Standards Council: not checked directly (NFPA CAM list not reached; IAEI NFPA Code Talk, Hannahs, 31 Aug 2022: 55 CAMs, 18 passed, 23 failed, 14 not pursued, sections not named)", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/FD_D26_8_SC26_8_44_d_TIA_1892_NFPA_70.pdf"], "permission_notice": "NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "retrieved": "2026-10-20", "canaries": [{"planted": "625.43 more than 50 amperes or more than 120 volts to ground", "rejected": true, "printed": "more than 60 amperes or more than 150 volts to ground"}, {"planted": "625.44(A)(3) 250 volts, single phase, 20, 30, or 40 amperes", "rejected": true, "printed": "250 volts, single phase, 30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"}, {"planted": "625.54 in accordance with 210.12", "rejected": true, "printed": "in accordance with 210.8"}]}
```

**625.43 (method warning)**
```json
{"ref": "625.43 (method warning)", "edition": "2023", "status": "VERIFIED-2023 (Leviton) values; SD SR-7722 text differs from the final", "values": {"disconnect_required_above": "60 amperes or 150 volts to ground"}, "quote_segments": ["For EVSE and WPTE rated more than 60 amperes or more than 150 volts to ground, the disconnecting means", "shall be provided and installed in a readily accessible location, adjacent to or remote from the equipment."], "note": "The final 2023 text (Leviton) has no 'adjacent to or remote from the equipment'. Flattened SD text carries struck words; SD-only items must not be rendered word for word.", "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P12_SD_SRStatements.pdf", "https://captaincode2023.leviton.com/node/357"], "permission_notice": ["NFPA's own document; no reprint notice (A4 recorded on SD11-23 the restriction 'may not be used for any other purpose or distributed to any other persons or parties'; not re-captured this run)", "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. / National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved."], "retrieved": "2026-10-20", "canaries": [{"planted": "625.43 more than 50 amperes or more than 120 volts to ground", "rejected": true, "printed": "more than 60 amperes or more than 150 volts to ground"}, {"planted": "625.44(A)(3) 250 volts, single phase, 20, 30, or 40 amperes", "rejected": true, "printed": "250 volts, single phase, 30 or 50 amperes, or 125/250 volts, single-phase, 30, 50, or 50 60 amperes"}, {"planted": "625.54 in accordance with 210.12", "rejected": true, "printed": "in accordance with 210.8"}]}
```

---

## 4. Registry impact

| Domain (research/data-sources.csv) | Move to verified? | Coverage line to write | Data file |
|---|---|---|---|
| nec-430-motors | **No, stays GAP.** Single-motor conductor sizing (430.22) and overload sizing (430.32(A)(1)) are still unverified, so a motor-circuit calculator can't be rebuilt | "Verified 2023: 430.6(A); 430.24; Table 430.52(C)(1); 430.52(C)(1)(b)(2)–(4) 225 %, 400 %/300 % (FLC ≤/> 100 A), 300 % (verified-sd2023); 430.110(A) disconnect ≥ 115 % of FLC (verified-sd2023). Draft only: 430.52(C)(1)(a), (b)(1) 400 %, 430.62(A) first paragraph, 430.110(B)/(C). Unverified: 430.22 incl. Table 430.22(E), 430.32(A)(1), Table 430.7(B) rows." | nec-430-440-2023.json |
| nec-440-hvac | **No, stays GAP** (440.32, 440.62–440.64 unverified). The air-conditioner page can keep running on manufacturer MCA/MOCP (mfr-hvac-specs) | "Verified 2023: 440.11; 440.22(A) ≤ 175 % of max(RLA, BCSC), Exc. 1 next standard size, Exc. 2 ≤ 225 %, Exc. 3 15 A floor (Eaton values; paragraph verified-sd2023). Draft only (2026): 440.4(B), 440.14, 440.33. Unverified: 440.32, 440.62–440.64." | nec-430-440-2023.json |
| nec-630-welders | **No, stays GAP** | "630.12 200 % (2026 draft; no SR on 630.11/630.12 in the 2023 cycle); 630.13 (2023 Second Draft). 630.11(A) incl. I1eff, Table 630.11(A), 630.11(B) unverified: no duty-cycle multipliers may be output." | nec-430-440-2023.json |
| nec-2023-rule-excerpts (Article 625 part) | **Stays verified** for its listed sections. Add 625.54 under the new key; do **not** add 625.41, 625.44(3), 625.50 or 625.17(A) | Add: "625.54: GFCI protection for personnel on all receptacles installed for the connection of electric vehicle charging (NFPA 2023 Second Draft SR-7731, verified-sd2023; trailing '210.8' clause unresolved, not rendered). 625.44(A)/(B) items (1), (2), (4) as 2020 (unchanged in 2023 SD); 2023 added a 60 A 125/250 V (14-60R) option per SR-7725/7727, wording unverified." | nec-2023-rules-round2.json (625.44/625.54 items), or a new data/verified/nec-625-2023.json |
| nec-continuous-load | No change | Its note "625.41 is unverified; EV branch circuits get the 125 % from 625.42 + 210.19(A)/210.20(A)" stays correct | nec-continuous-load-2023.json |

**Against nec-430-440-2023.json:**
- **No value contradicts it.** Every value I saw matches: 115, 225, 400/300, 300, 175, 225, 15.
- Status labels to update:
  - "430.110(A)": edition "2026 draft (base 2023)" → "2023"; status → verified-sd2023 (SR-7538, D5 canaries). Keep the voltage words as draft.
  - "430.52(C)(1)(b)": split the status; (2)–(4) verified-sd2023, (1) stays VERIFIED-draft.
  - "440.22(A)": main paragraph VERIFIED-draft → verified-sd2023.
- The file's verified-sd2023 key text ends "no revision in the 2026 cycle". That clause is true for the FLC tables but **not for 430.110**: 2026 SR-8089 revises 430.110(C)(1) Exception No. 1. Don't copy the key text onto 430.110.
- "unverified_rules" (430.22, 430.32(A)(1), 440.32, 440.62–440.64, 630.11(A), 630.11(B)) and the note on Table 430.7(B) remain correct.

**Against other data files (outside my brief, noted for the coordinator):**
- nec-2023-rules-round2.json, 625.44, labelled 2020: correct as 2020, but must not be shown as 2023. The 2023 text adds the 14-60R (60 A, 125/250 V) option.
- nec-2023-rules-round2.json, 625.54 2026 item: it still says the TIA 1892 "Standards Council final action UNVERIFIED". R3-4 settled it as NOT ISSUED (SC D#26-8).

---

## 5. Blocked or failed log

| # | Target | Result |
|---|---|---|
| D3 | 70_A2025_NEC_P12_PISubmittals.pdf | Readable text ends at "33 of 323", inside PI 1246 (new 620.7). No PI on 625.x or 630.x visible. Visible 625-related PIs are definitions (719, 2580, 2460, 4230, 4231, 4262, 4295) and Article 627 proposals (3887, 3893, 3894) |
| D4 | 70_A2025_NEC_P11_SD_PrelimSR.pdf | No 430.22 lead-in, no Table 430.7(B) rows, no SR on 430.32/440.32/440.62–64 |
| D6 | 70_A2025_NEC_P11_SD_MeetingAgenda_1024.pdf | Agenda packet. No PC text except Global PC 1651. PC 1262 [430.22] text not present |
| — | docinfofiles.nfpa.org | 6/6 used; no 429. Not fetched (budget): 70_A2022_NEC_P11_SD_PCSubmittals.pdf, 70_A2022_NEC_P12_SD_PCSubmittals.pdf, 70_A2025_NEC_P11_FD_PIResponses.pdf / P12 (pattern seen in search for P02, P08, P15), 70_A2025_NEC_P12_FD_PrelimFR.pdf beyond p. 21 |
| — | captaincode2023.leviton.com/node/357 | Re-fetched: no 625.41 (the search snippet that suggested it was wrong) |
| — | mikeholt.com 23_SOLAR_Article_625.pdf | No notice, paraphrase only (T4) |
| — | Eaton E23 (no offset) | Text ends p. 38 in 430.6(A) Exc. 2. With offset 90000: pp. 34–43 read; no 430.52(C)(1)(a)/(b) text, no 625/630/430.22/430.32/440.32 |
| — | dca.georgia.gov NFPA "Changes to the NEC 2023" deck | 22 slides; only EV slide is 220.57 |
| — | app.leg.wa.gov WAC 296-46B index and -430 | No WAC sections for 440/625/630. 296-46B-430 covers motor marking (NEMA/IEC) only (WSR 19-15-117) |
| — | www1.eere.energy.gov DOE TS6 | NEMA MG 1-2011 code-letter table, anomalous; rejected |
| — | eaton.com bus-ele-tech-lib-welder-protection.pdf (©2005) | No notice, no Table 630.11(A); 630.12 paraphrase |
| — | iaeimagazine.org p=8901 (2000), p=26293 (2025, CE Code), "Powering Forward" (2025) | No notice; paraphrase or non-NEC |
| — | WebSearch | 21 of 24. Hits were mostly EC&M, ECmag, CSE, EEPower, exam-prep and forums (T4). Searches for exact 2023 phrases of 430.22, 625.41, 625.50 and 625.54 found no government or permission-noticed copy |

Not fetched: Ontario CA IB 201 (.docx, 2024 revision, CEC 2022/NEC 2020 era), NYSERDA "EVSE Overview NEC Article 625" (edition unknown), Hubbell EVSE manual, calchiefs.org PDF (unrelated host).

---

## 6. Open gaps

1. **430.22 lead-in (125 %) and Table 430.22(E).** Best lead: 2026-cycle **PC 1262-NFPA 70-2024 [430.22]**. Find its compilation file first; try the A2025 "PIResponses"/PC naming via one search, since the PCSubmittals name is unconfirmed for A2025. Otherwise, a person reads NFPA's free 2023 viewer.
2. **430.32(A)(1).** No NFPA document found that prints it (no SR or PC in either cycle). Needs a person reading the free viewer, or a 2023 reprint with an NFPA notice.
3. **Table 430.7(B) rows.** Not printed in either Second Draft. Same route as item 2.
4. **440.32 and 440.62–440.64.** PIs 811/812/813 (2026 cycle) reprint 440.62–440.64. They are beyond the PI11 window. Try 70_A2025_NEC_P11_FD_PIResponses.pdf, whose name pattern was seen for P02/P08/P15, if it orders or sizes differently. 440.32 has no NFPA route.
5. **630.11(A) incl. I1eff, Table 630.11(A), 630.11(B).** No route found in tiers 1–3. Use a person-read or a reprint with a notice.
6. **625.41, 625.50, 625.17(A) (2023).** Leads:
   - the Whitney PI on 625.41 in the A2025 CMP-12 PI set (beyond p. 33) or a P12 PIResponses file;
   - 70_A2022_NEC_P12_SD_PCSubmittals.pdf (2023-cycle PCs; not fetched).
7. **625.44(A)(3)/(B)(3) exact 2023 wording, and 625.54's trailing "in accordance with 210.8".** Needs a final-2023 reprint (Leviton has no node), or the 2026 SR-8104/SR-7875 base text read for these words.
8. **2022 Technical Meeting CAM list for NFPA 70.** This would settle condition 3 for every verified-sd2023 item above. Name unknown on docinfofiles.
9. **430.52(C)(1)(b)(1) 400 %.** One more canary pull of SR-7526.

