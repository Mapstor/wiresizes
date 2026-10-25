# R4-2: OCPD and grounding (240.4(B), 240.4(D), 250.122, 250.66, 250.32, 210.19, 230.42), round 4

Agent R4-2, wiresizes.com primary sourcing. **Retrieval date for every item: 2026-10-20.** Target edition: NFPA 70-2023.

**Budget used**
- WebSearch: **22 of 24.**
- docinfofiles.nfpa.org: **6 of 6, no HTTP 429.**
  1. `70_A2022_NEC_P10_SD_SRStatements.pdf`, data pull (SR list, 240.4(B), 240.4(D)).
  2. Same file, canary pull.
  3. `70_A2022_NEC_P05_SD_SRStatements.pdf`, canary pull of SR-8071 (round 3 made the first pull).
  4. `70_A2022_NEC_P05_FD_BallotFinal.pdf` (found by search), FR list.
  5. `70_A2025_NEC_P05_SD_PrelimSR.pdf` (2026 Second Draft), SR list and SR-8360/SR-8125 text.
  6. `70_A2022_NEC_P02_SD_SRStatements.pdf`, Article 210 SR list and SR-8042.
- Other hosts: 12 fetches.
  - New hosts this round (owner approval may be needed): goodreads.com, eepower.com, campbellcountywy.gov.
  - Hosts used before: iaeimagazine.org, secure.utah.gov (2 reads), ecmag.com (2), nema.org (1, a repeat; see the blocked log), mikeholt.com (1, 404).

**Method**
- WebFetch only. Every quote is the summarizing model's readout, split into segments under 120 characters.
- Canary checks follow A4's method. I sent my candidate lines with deliberately wrong values mixed in and asked for MATCH or DIFFERS on each, with the printed words.
- NFPA drafts flatten strike-through and underline, so struck and inserted words run together. Each case found is flagged.
- JSON blocks were built and validated with `python3 -I`, one file per block. Script: `/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_2_work/build_json.py`. Blocks: `/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_tmp/r4_2_01.json` through `r4_2_13.json` in the same folder.

**verified-sd2023, condition 3:** I could not check the 2022 Technical Meeting or the Standards Council record.
- The A2022 NITMAM/CAM report and the 2022 voting results were not located after 5 searches. nfpa.org is JavaScript-only.
- Every verified-sd2023 item below is therefore marked "condition 3 not checked".
- In its place, each item gives evidence that the text reached the 2023 edition (a 2023 reprint, or the 2026 Second Draft's base text).

---

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1a | 240.4(D)(4)–(D)(8): 14 Cu 15 A; 12 Al/CCA 15 A; 12 Cu 20 A; 10 Al/CCA 25 A; 10 Cu 30 A | **verified-sd2023** (condition 3 not checked) | NFPA A2022 CMP-10 SD, **SR-8285** [240.4(D)] | 2 pulls agree; 6 of 6 canaries rejected. **2023 item numbers (4)–(8) now seen.** Leviton 2023 node 313 shows SR-8285's new (D)(3) and "(D)(1) through (D)(8)", so SR-8285 reached the 2023 edition. No contradiction with nec-240-4-d.json |
| 1b | 240.4(D)(1)–(D)(3) item numbers and values | **verified-sd2023** (also VERIFIED-2023 via Eaton/Leviton) | SR-8285 | "(2) 16 AWG Copper." is item (2). Eaton's "(D)(1) 16 AWG" label is Eaton's error |
| 1c | (D)(1)/(D)(2) a./b.: "wire" or "conductor" | **"conductor"**: VERIFIED-draft (A2022 SD, 1 pull) | SR-8285 | Printed "18 AWG copper conductor" and "16 AWG copper conductor", with no run-together. So Eaton's flattened "wire conductor" = struck 2020 "wire" + 2023 "conductor" |
| 1d | 240.4(B) heading, lead-in, 3 conditions, 800 A | **verified-sd2023** (heading, lead-in, (3) 800 A, closing references); (1)–(2) wording from 1 A2022 pull, identical to 2 SR-8377 pulls | NFPA A2022 CMP-10 SD, **SR-8283** | 2023 heading: "(B) Overcurrent Devices Rated 800 Amperes or Less." 2023 adds a closing sentence on adjustable-trip devices (Table 240.6(A), 240.6(C)). This settles A2's unplaced phrase |
| 2a | 250.122(B) main rule (proportional increase by circular mil area; except as required in 310.15(B)/(C)) | **verified-sd2023** (condition 3 not checked) | NFPA A2022 CMP-5 SD, **SR-8071** | Pull 1 = R3-4, pull 2 = R4-2 with 4 of 4 canaries rejected. The same main sentence is the 2026 SD base text, so it reached 2023 |
| 2b | 250.122(B) Exception and Informational Note | **CONFLICTING** | SR-8071 vs 2026 SD (SR-8360) | A2022 SD: long exception (engineering supervision or qualified person; documentation to the AHJ) plus a GEMI note. 2026 SD base: short exception ("sized by a qualified person to provide an effective ground fault current path…") and no note. Final 2023 not seen. **Do not render** |
| 2c | 250.122(A) "not required to be larger than the circuit conductors" | **VERIFIED-draft** (2026 SD, 1 pull); 2023 wording UNVERIFIED | 2026 SD SR-8360 | The 2026 SR adds "in the raceway or cable". The rule itself is in the 2023 base text |
| 2d | Table 250.122 in an A2022 document | **Not found** | A2022 CMP-5 SD (no table SR, no rows); A2022 CMP-5 FD ballot (ends at 250.30) | Values still rest on the 2020 fact sheet = 2026 SD |
| 2e | Table 250.122 caption suffix ("(A)") | **CONFLICTING** (label only) | SR-8360 statement | "…returns the table to its original numbering." This may mean the "(A)" belongs to the 2023 caption, not to 2026, which contradicts the pack's "2026 label 250.122(A)" |
| 3 | 250.66(A)/(B)/(C) and Table 250.66 (2023) | **UNVERIFIED** (no change from round 3) | none in tiers 1–3 | No SR in either cycle's SD. 2026 outline: 250.66(A) "Revised" in 2026. Two T4 table lookups (2023) match nec-250-66.json |
| 4a | 250.32(A) GES at the separate building | VERIFIED-2023 (gov paraphrase, no change) + VERIFIED-other-edition (2017 county text) | Maine/St. Paul 2023; Campbell County WY (2017) | — |
| 4b | 250.32(B)(1) EGC with feeder | VERIFIED-2023 (gov paraphrase) + **VERIFIED-draft wording (2026 SD SR-8125)** | 2026 SD | No 2023-cycle SR on 250.32 |
| 4c | 250.32(B)(1) no neutral-to-EGC or electrode connection at the separate building | **UNVERIFIED for 2023.** VERIFIED-other-edition (2017, county gov text); 2023 T4 only | Campbell County WY; EEPower 2023 | — |
| 5a | 210.19 household ranges (8¾ kW, 40 A), tap and neutral exceptions | **UNVERIFIED** | — | SR-8042 covers only the 210.19 main paragraph. **2023 210.19 has (A) through (D)** (VERIFIED-draft) |
| 5b | 210.19 voltage-drop Informational Note (bonus) | **VERIFIED-draft** (A2022 SD, 1 pull) | SR-8042 | 3 % / 5 %; cross-reference "Informational Note No. 2 of 215.2(A)(2)" |
| 5c | 230.42(A)(1) Exception No. 2 | **CONFLICTING** (no change from round 3) | — | No A2022 SR on 230.42, so the 2023 text is First Draft text, which was not reached |
| 6 | 2022 Technical Meeting / Standards Council | Totals only | IAEI NFPA Code Talk, Aug 31 2022 | 55 CAMs: 18 passed, 23 failed, 14 not pursued. CAM 70-126 (minimum-size CCA branch-circuit conductors) failed 196–198 |

---

## 2. Sources

**T1, NFPA's own documents (no reprint notice needed)**
- **SR10-23.** NFPA, Second Revision statements, NEC CMP-10, A2022 cycle.
  - Running header "National Fire Protection Association Report"; revisions labelled "Second Revision No. ####-NFPA 70-2021"; printed 12/6/2021 9:22 AM; 55 pages.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P10_SD_SRStatements.pdf
  - Notice on most pages: "Important Notice: This document is the copyright property of the National Fire Protection Association (NFPA)," / "Copyright © 2021 NFPA, and may not be used for any other purpose or distributed to any other persons or parties."
  - In the 2023 cycle **CMP-10 covered Articles 215, 225, 230, 240 and 242.** Its SR list is in JSON block 13.
- **SR05-23.** NFPA, Second Revision statements, NEC CMP-5, A2022 cycle. Printed 12/6/2021 12:33 PM; 50 pages; no notice in the extracted text.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P05_SD_SRStatements.pdf
- **FD05-23.** NFPA, "NEC® First Draft Technical Committee FINAL Ballot Results (A22)". Memo from Sarah Caldwell to CMP-5, April 15, 2021; 174 pages; visible text about pp. 1–58; no notice.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P05_FD_BallotFinal.pdf
- **SR02-23.** NFPA, Second Revision statements, NEC CMP-2, A2022 cycle. Printed 12/6/2021 5:22 PM; 88 pages, text ends at p. 62 after SR-8067 (210.65(B)); no notice.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P02_SD_SRStatements.pdf
- **SD05-26.** NFPA, "Working Draft of NEC Code-Making Panel 5 Meeting Output", A2025, Second Draft meeting October 2024. SR labels "NFPA 70-2024". Truncated in Article 270.
  - Notice: "CONTENT NOT FINAL – SUBJECT TO REVISION PRIOR TO LETTER BALLOT AND PUBLICATION OF SECOND DRAFT REPORT".
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf

**T1/T4, NFPA staff writing hosted by IAEI**
- IAEI Magazine, NFPA Code Talk, Corey Hannahs, "Making of the 2023 NEC: A Cycle Like No Other", Aug 31, 2022.
  - https://iaeimagazine.org/columns/nfpa-code-talk/making-of-the-2023-nec-a-cycle-like-no-other/
  - Table 1 notice: "Copyright © 2022, National Fire Protection Association (NFPA). All rights reserved."

**T3, government**
- Campbell County, WY. DocumentCenter/View/217. No title, office or date; based on the 2017 NEC ("Article 250.32 (A) of the 2017 NEC"); no notice.
  - https://www.campbellcountywy.gov/DocumentCenter/View/217
- "2026 NEC Chapter 2 Code Changes Outline" (Utah CE course objectives file; no author, date or notice).
  - https://secure.utah.gov/ce-public/files/objectives/13441.pdf

**T2, reproductions with an NFPA 2023 notice (from round 2, cited here as carry-through evidence only)**
- Leviton Captain Code 2023 node 313: https://captaincode2023.leviton.com/node/313
- Eaton bus-ele-br-11318: https://eaton.com/content/dam/eaton/products/electrical-circuit-protection/fuses/code-updates/bus-ele-br-11318-2023-NEC-code-changes.pdf

**T4, corroboration only (no NFPA notice)**
- EEPower, Lorenzo Mari:
  - "NEC 2023 Basics: Sizing Equipment Grounding Conductors" (Sep 3, 2023)
  - "National Electrical Code 2023 Basics: Grounding and Bonding Part 8" (Jan 24, 2023)
  - "… Part 12" (Mar 10, 2023)
  - Footer "© EETech Group, LLC. All rights reserved".
- EC&M Electrical Contractor, Michael Johnston, "Sizing equipment grounding conductors: simple calculations for correct proportions", Feb 15, 2023. Edition not stated.

---

## 3. Evidence per target

### 3.1 240.4(D) (2023): verified-sd2023 for all eight items

**Source:** SR10-23, Second Revision No. 8285 [Section No. 240.4(D)].

**Pull 1 (data; segments as extracted)**
- "(D) Small Conductors."
- Lead-in:
  - "Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed"
  - "that required by 240.4 (D)(1) through (D)(7) (8) after any correction factors for ambient temperature"
  - "and number of conductors have been applied."
  - "(D)(7) (8)" is flattened markup: struck "(7)", inserted "(8)".
- Items (heading | value):
  - (1) "18 AWG Copper." | "7 amperes"
  - (2) "16 AWG Copper." | "10 amperes"
  - (3) "14 AWG Copper-Clad Aluminum." | "10 amperes"
  - (4) "14 AWG Copper." | "15 amperes"
  - (5) "12 AWG Aluminum and Copper-Clad Aluminum." | "15 amperes"
  - (6) "12 AWG Copper." | "20 amperes"
  - (7) "10 AWG Aluminum and Copper-Clad Aluminum." | "25 amperes"
  - (8) "10 AWG Copper." | "30 amperes"

**Pull 2 (canary check)**
- True lines confirmed (MATCH):
  - (D)(1) 18 Cu, 7 A, continuous ≤ 5.6 A
  - (D)(2) 16 Cu, 10 A, continuous ≤ 8 A
  - (D)(4) 14 Cu, 15 A
  - (D)(6) 12 Cu, 20 A
  - (D)(8) 10 Cu, 30 A
- Canaries, all rejected with the printed value:
  - (D)(3) continuous 7.5 A → "Continuous loads do not exceed 8 amperes."
  - (D)(5) 20 A → 15 A
  - (D)(7) 30 A → 25 A
  - c. "Class G" → "Class CC, Class CF, Class J, or Class T fuses."
  - 240.4(B)(3) 1000 A → 800 A
  - 240.4(B) closing "240.6(B)" → "240.6(C)"
- Words after "listed and marked for use with":
  - (D)(1) a. and b.: "18 AWG copper conductor"
  - (D)(2) a. and b.: "16 AWG copper conductor"
  - (D)(3) a.: "14 AWG copper-clad aluminum conductor"; b.: "14 AWG copperclad aluminum conductor" (printing artifact)

**SR-8285 committee statement**
- "A new list item (3) is added to address specific requirements for 14 AWG Copper-Clad Aluminum with a maximum"
- "overcurrent protection rating of 10 Amps to align with the other small conductors permitted in 240.4(D)."
- "The following sections were renumbered accordingly."

**verified-sd2023 conditions**
1. Met. SR-8285 revised 240.4(D) (new item (3), renumbered the rest) and prints the whole list.
2. Met. Two pulls agree; 6 of 6 canaries rejected.
3. Not checked; see the note at the top. Evidence that SR-8285 reached the 2023 edition:
   - Leviton 2023 (NFPA notice) prints the new (D)(3) and the lead-in "(D)(1) through (D)(8)". Both would have disappeared if a CAM had rejected SR-8285.
   - IAEI reports the only named CCA motion (CAM 70-126) **failed**.
   - The 2026 SD SR-8377, whose base is the 2023 text, prints identical (D)(4)–(D)(8) values.

**Data-file check:** every value matches `nec-240-4-d.json`. The notes there need updating:
- the item numbers (4)–(8) can now be cited;
- "[wire|conductor]" becomes "conductor";
- the (D)(4)–(D)(8) status becomes verified-sd2023 (SR-8285).

### 3.2 240.4(B) (2023): verified-sd2023 for the 800 A rule

**Source:** SR10-23, Second Revision No. 8283 [Section No. 240.4(B)]. Pull 1 segments:
- Heading: "(B) Overcurrent Devices Rated 800 Amperes or Less."
- Lead-in:
  - "The next higher standard overcurrent device rating (above the ampacity of the conductors being protected)"
  - " shall be permitted to be used, provided all of the following conditions are met:"
- (1) "The conductors being protected are not part of a branch circuit supplying more than one receptacle" / " for cord-and-plug-connected portable loads."
- (2) "The ampacity of the conductors does not correspond with the standard ampere rating of a fuse or a circuit breaker" / " without overload trip adjustments above its rating" / " (but that shall be permitted to have other trip or rating adjustments)."
- (3) "The next higher standard rating selected does not exceed 800 amperes."
- Closing paragraph:
  - "Where If the overcurrent protective device is an adjustable trip device, installed in accordance with 240.4(B) (1),"
  - " (B)(2), and (B)(3), it shall be permitted to be set to a value that does not exceed the next higher standard value"
  - " above the ampacity of the conductors being protected as shown in Table 240.6(A)"
  - " where restricted access in accordance with 240.6(C) is provided."
  - "Where If" is flattened (struck "Where", inserted "If"). The 2023 sentence probably opens with "If", but treat that one word as unverified.

**Pull 2 and committee statement**
- Pull 2 rejected two canaries: (3) "1000" → 800, and "240.6(B)" → 240.6(C).
- SR-8283 statement: "The last sentence is modified for compliance with the NEC style manual and to clarify that all of 240.4(B) applies."

**What this settles and what remains**
- The 2023 heading and the three conditions are word-identical to round 2's two SR-8377 (2026 SD) pulls. The only exception is "overcurrent device", which 2026 changes to "OCPD".
- **Resolves A2 open gap 10:** the stray SR-8377 phrase "…as shown in Table 240.6(A) where restricted access in accordance with 240.6(C) is provided" is the end of this 2023 closing sentence.
- Conditions (1) and (2) were not re-asked in pull 2, so their A2022 wording rests on one pull plus two 2026-SD pulls.

### 3.3 250.122(B) (2023): main rule verified-sd2023; exception and note CONFLICTING

**Source:** SR05-23, SR-8071 [Section No. 250.122(B)].

**Pull 2 (R4-2, canary check)**
- True lines confirmed (MATCH):
  - N1 "(B) Increased in Size."
  - N2 "If ungrounded conductors are increased in size for any reason other than as required in 310.15(B) or"
  - N3 "wire-type equipment grounding conductors, if installed, shall be increased in size proportionately"
  - N7 "Documentation of the method used and the equipment grounding conductor size shall be made available to the authority having jurisdiction upon request."
- Canaries, all rejected with the printed value:
  - "ampacity" → "to the increase in circular mil area of the ungrounded conductors."
  - "licensed professional engineer" → "sized under engineering supervision or by a qualified person"
  - "250.4(A)(3) or (B)(3)" → "using industry practices to meet the performance objectives of 250.4(A)(5) or (B)(4)."
  - "IEEE Std 80" → "See GEMI Analysis Software for an industry practice method for determining acceptable equipment grounding conductor sizes."
- Cross-reference exactly as printed: "310.15(B) or 310.15(C) (C) ," (flattened).
- SR-8071 statement: "An informational note is added to provide guidance on a method for calculating equipment grounding conductor sizes."
- Pull 1 (R3-4, earlier today) gave the same text; the two pulls agree on every line.

**Conflict with the 2026 Second Draft** (SD05-26, SR-8360, where the subsection is relettered "(D) Increased in Size")
- The main sentence is the same: "If ungrounded conductors are increased in size for any reason other than as required in" / "310.15(B) or 310.15(C) , wire-type equipment grounding conductors, if installed, shall be" / "increased in size proportionately to the increase in circular mil area of the ungrounded" / "conductors."
- But the exception is the short form, and there is no informational note:
  - "Equipment grounding conductors shall be permitted to be sized by a qualified person to"
  - "provide an effective ground fault current path in accordance with 250.4(A)(5) or 250.4(B)(4) ."
- In a Second Draft working draft, First Revision changes are not marked. So the short form came either from the 2022 Technical Meeting or Standards Council (SR-8071 not carried into 2023) or from a 2026 First Revision. **I cannot tell which.**
- EEPower 2023 (T4) paraphrases the 2023 exception as one that "permits a qualified person to size the equipment grounding conductor". It mentions neither engineering supervision nor GEMI. That leans toward the short form, but it is T4 and a paraphrase.

**Status**
- Main sentence: **verified-sd2023** (conditions 1–2 met). For condition 3, the main sentence survives into the 2026 base text, so it is in 2023.
- Exception and note: **CONFLICTING.** The site should not render either as 2023 text.
- Cross-reference: the referenced sections, 310.15(B) and 310.15(C), are certain. The exact 2023 string is not ("310.15(B) or 310.15(C)" in the 2026 SD and in EC&M 2023 (T4)).

**Engine note:** `nec-250-122.json` scales from the "minimum ungrounded cmil with sufficient ampacity". That matches the 2023 rule only if that minimum already includes any 310.15(B) or (C) correction or adjustment, because upsizing "as required in 310.15(B) or 310.15(C)" does not trigger the increase. Please confirm the engine computes it that way.

### 3.4 250.122(A) and Table 250.122

**250.122(A)**
- No 2023-cycle document reached it:
  - The A2022 CMP-5 SD has no SR on 250.122(A).
  - The A2022 CMP-5 FD ballot's visible text ends in FR-8233 (250.30).
- The 2026 SD (SR-8360) prints:
  - "Equipment grounding conductors shall not be required to be larger than the circuit conductors"
  - "in the raceway or cable supplying the equipment."
- SR-8360 statement (segments):
  - "Section 250.122 and its subsections are revised for readability and to comply with the NEC Style"
  - "Manual for formatting. No technical changes occurred as a result of this revision."
  - "The reorganization of 250.122 moves the first table reference from 250.122(A)(1) to the main"
  - "paragraph (250.122), which returns the table to its original numbering."
  - "The phrase “in the raceway or cable” is added to the remaining sentence to clarify that if circuit"
- So the cap rule (the EGC need not exceed the circuit conductors) is in the 2023 base text. The 2023 wording is probably the sentence without "in the raceway or cable", but that is inferred.
- **Status:** VERIFIED-draft for the rule; 2023 wording UNVERIFIED.
- T4 2023 corroboration:
  - EC&M (Feb 2023): "in no case are the EGCs required to be larger than the circuit conductors supplying the equipment."
  - EEPower (Sep 2023): "The equipment grounding conductors are not required to be larger than the phase conductors."

**Table 250.122**
- Not printed in any A2022 document reached. SR05-23 contains no table rows: Q4 answer "No", and it only cites Table 250.102(C)(1).
- The 19 rows still rest on the 2020 NFPA fact sheet and the 2026 SD (identical; "No technical changes").
- **Caption conflict (new):**
  - Round 1 read SR-8360 as relabelling the table "Table 250.122(A)" in 2026.
  - This pull extracted the caption as "Table 250.122 (A) Minimum Minimum Size". The statement says the 2026 change "returns the table to its original numbering".
  - Read together, the "(A)" may be struck 2023 text. If so, the 2023 caption would be "Table 250.122(A)" or similar, and 2026 would go back to "Table 250.122". That is the reverse of the pack's note.
  - **Unresolved.** It affects labels only, not values.

**2026 lettering** (VERIFIED-draft; final 2026 text not seen)
- The 2026 Chapter 2 outline lists "(New) … (B) Other Than Wire Type EGCs." and "(New) … (C) Sectioned EGCs."
- SR-8360 puts "Increased in Size" at (D).
- So on 2026 pages the proportional rule would be cited as 250.122(D).

### 3.5 250.66 (2023): no change, UNVERIFIED

- No SR on 250.66 or Table 250.66 in the A2022 CMP-5 SD (SR05-23, Q3) or in the 2026 SD (SD05-26).
- The A2022 CMP-5 FD ballot ends before Part III.
- No 2023 reprint with an NFPA notice and no government 2023 reprint was found. Searches covered "Reprinted with permission" and a 2023 NFPA fact sheet; only the June 2020 fact sheet exists.
- 2026 outline: "(Revised) 250.66 Size of ac Grounding Electrode Conductor. (A) Connections to a Rod, Pipe, or Plate Electrode(s)." So 2026 changes 250.66(A). Pages should not carry 2023 wording forward to 2026.
- T4 (EEPower, Mar 10, 2023):
  - "Enter Table 250.66 with conductor 1 000 kcmil Cu and read conductor size N° 2/0 AWG." This matches the pack row "Over 600 through 1100 → 2/0".
  - "Enter Table 250.66 with conductor 3/0 AWG Cu and read conductor size N° 4 AWG." This matches the "2/0 or 3/0 → 4" row.
  - (A) "does not require a conductor size larger than N° 6 AWG"; (B) "…N° 4 AWG"; (C) "…N° 2 AWG". The (C) line is a paraphrase; NFPA's 2020 wording is "not required to be larger than the conductor used for the ground ring".
- **No contradiction with nec-250-66.json. No upgrade.**

### 3.6 250.32 (2023): PARTIAL, no change in status

- No SR on 250.32 in the A2022 CMP-5 SD (confirmed again this run). The A2022 FD ballot ends in 250.30, just before 250.32.
- **2026 SD, SR-8125 [250.32(B)(1)]**, VERIFIED-draft, single pull:
  - "Equipment grounding conductors, as described in 250.118(A), shall be run with supply"
  - "conductors and be connected to the enclosure containing the building or structure"
  - "disconnecting means and to the grounding electrode conductor."
  - Exception No. 1 is flattened ("…conductorsare not run with the supply to the buildings or structures."; "If grounded conductorsare used for grounding in accordance with this exception").
  - Statement: "The phrase “enclosure containing the” was added to clarify when equipment grounding conductors" … "The use of the word “connected” was not deleted, as proposed in PC-1032, because it is consistent" / "with usage elsewhere in Article 250."
  - The neutral-isolation sentence was not in the extract.
- **Campbell County WY (T3, 2017 NEC, untitled and undated):**
  - 250.32(A): "Building(s) or structure(s) supplied by feeder(s) or branch circuits(s) shall have a grounding electrode" / "or grounding electrode system installed in accordance with Part III of Article 250."
  - Exception: a single branch circuit, including a multiwire branch circuit, that includes an EGC.
  - 250.32(B): "…an equipment grounding conductor as described in 250.118 shall be run with the supply conductors…" and "Any installed grounded conductor shall not be connected to the equipment grounding conductor" / "or to the grounding electrode(s)."
  - Also 225.32 (2017): "…at a readily accessible location nearest the point of entrance of the conductors."
- **EEPower Part 8 (T4, Jan 24, 2023):**
  - Connecting the grounded conductor to the grounding electrode or the EGC at the separate building is prohibited.
  - Exception No. 1 for installations under pre-2008 editions applies only with no EGC in the supply, no continuous metallic path between the buildings, and no GFPE on the supply side.
- **Status:**
  - "EGC run with the feeder" and "GES at the building": VERIFIED-2023 as government paraphrase (rounds 2–3).
  - "No neutral-to-EGC or electrode connection": 2017 government text plus 2023 T4 only. **Not verified for 2023.**

### 3.7 210.19 (2023)

**SR02-23, SR-8042 [210.19 Excluding any Sub-Sections]**, VERIFIED-draft, single pull:
- "Branch-circuit conductors for circuits not more than exceeding 1000 volts ac or 1500 volts dc" / "shall be sized in accordance with 210.19(A) through (D)."
- "not more than exceeding" is flattened; it is unclear which phrase was struck.
- Statement: "The text has been changed to clarify that the voltage limitation is intended to apply" / "to the circuit, not the conductor's insulation rating." / "1500 volts dc has been added to align with the proposed new Article 235."
- The same SR prints the 210.19 voltage-drop note:
  - "Informational Note: Conductors for branch circuits as defined in Article 100, sized to prevent a voltage drop"
  - "exceeding 3 percent at the farthest outlet of power, heating, and lighting loads, or combinations of such loads,"
  - "and where the maximum total voltage drop on both feeders and branch circuits to the farthest outlet does not exceed"
  - "5 percent, provide reasonable efficiency of operation."
  - "See Informational Note No. 2 of 215.2(A)(2) for information on voltage drop on feeder conductors."
- This settles two round-3 open points at draft level:
  - the 210.19 note is a single, unnumbered "Informational Note" on the main paragraph;
  - the feeder note it points to is attached to 215.2(A)(2).

**Household ranges: UNVERIFIED**
- SR-8042 has no range text, so the four canaries (N1–N4) could not be checked.
- Article 210 SRs visible: 210.4(A), 210.6(D), 210.7, 210.8(A), (B), (D), (F), 210.8, 210.12, 210.13, 210.15, 210.18, 210.19, 210.20, 210.23(A)(1), (A)(2), 210.24, 210.52(C), (E), (G), 210.62, 210.65(B), plus Global and Detail SRs. None is on a 210.19 subdivision.
- So the 2023 range rule is A2022 First Draft text, which was not reached. Its letter is probably (C), since (A)–(D) exist, but it is **not seen**.

### 3.8 230.42(A)(1) Exception No. 2: CONFLICTING (no change)

- The A2022 CMP-10 SR list (block 13) has no SR on 230.42. CMP-10 owned Article 230 in the 2023 cycle.
- So the 2023 text is that cycle's First Draft text. No document reaching it was available within the budget.
- The obvious next document is the CMP-10 counterpart of the confirmed `70_A2022_NEC_P0x_FD_BallotFinal.pdf` pattern (P03, P05 and P06 exist). In it, Articles 215, 225 and 230 come before 240.

### 3.9 2022 Technical Meeting and Standards Council (condition 3)

- IAEI NFPA Code Talk (Hannahs, Aug 31, 2022): "Of those CAMs, 18 passed, 23 failed, and 14 were not pursued."
  - 55 CAMs were prepared for June 9 in Boston.
  - CAM 70-126 (minimum-size CCA branch-circuit conductors) failed 196–198.
  - Appeals went to the Standards Council's meeting of August 10–12.
  - No per-CAM list of targets is given.
- The NFPA blog mirror on goodreads (posted June 7, 2022) predates the NFPA 70 results.
- **The per-CAM record was not seen.**

---

## 4. Machine-readable

One block per rule or table. Each was written to its own file and validated with `python3 -I`; all 13 passed, and no quote segment reaches 120 characters.

**Block 01: 240.4(D)** (validated file `r4_2_01.json`)

```json
{"ref": "240.4(D)", "edition": "NFPA 70-2023 cycle (A2022) Second Draft, Second Revision No. 8285-NFPA 70-2021 [Section No. 240.4(D)], CMP-10 SR statements printed 12/6/2021 9:22 AM, 55 pages", "status": "verified-sd2023 (conditions 1 and 2 met; condition 3 not checked against a Technical Meeting/Standards Council document)", "condition_1": "SR-8285 revised 240.4(D): new item (3) and renumbering of the rest; items (1)-(8) are printed in the SR text", "condition_2": "pull 1 (data) and pull 2 (canary check) agree on all 8 item numbers, headings and ampere values; 6 of 6 canaries rejected with the printed value", "condition_3": "not checked: the A2022 NITMAM/CAM report and 2022 voting results were not located (5 searches); IAEI NFPA Code Talk (Hannahs, Aug 31 2022) gives totals only: 55 CAMs, 18 passed, 23 failed, 14 not pursued; CAM 70-126 (minimum-size CCA branch-circuit conductors) failed 196-198", "carry_through_evidence": ["Leviton Captain Code 2023 node 313 (NFPA 2023 permission notice) prints SR-8285's new (D)(3) and the lead-in '(D)(1) through (D)(8)'", "Eaton bus-ele-br-11318 (2023, NFPA permission) prints (D)(1) 7 A / 5.6 A and (D)(2) 10 A / 8 A", "NFPA 2026 Second Draft SR-8377 (base text 2023) prints the same (D)(4)-(D)(8) sizes and values"], "heading": "(D) Small Conductors.", "leadin_2023": "Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed that required by 240.4(D)(1) through (D)(8) after any correction factors for ambient temperature and number of conductors have been applied.", "items": [{"item": "(D)(1)", "heading": "18 AWG Copper.", "max_a": 7, "continuous_max_a": 5.6, "ocpd": "a. branch-circuit-rated circuit breakers listed and marked for use with 18 AWG copper conductor; b. branch-circuit-rated fuses listed and marked for use with 18 AWG copper conductor; c. Class CC, Class CF, Class J, or Class T fuses"}, {"item": "(D)(2)", "heading": "16 AWG Copper.", "max_a": 10, "continuous_max_a": 8, "ocpd": "a./b. as (D)(1) with '16 AWG copper conductor'; c. Class CC, Class CF, Class J, or Class T fuses"}, {"item": "(D)(3)", "heading": "14 AWG Copper-Clad Aluminum.", "max_a": 10, "continuous_max_a": 8, "ocpd": "a./b. listed and marked for use with 14 AWG copper-clad aluminum conductor (b. printed 'copperclad')", "new_in_2023_cycle": true}, {"item": "(D)(4)", "heading": "14 AWG Copper.", "max_a": 15}, {"item": "(D)(5)", "heading": "12 AWG Aluminum and Copper-Clad Aluminum.", "max_a": 15}, {"item": "(D)(6)", "heading": "12 AWG Copper.", "max_a": 20}, {"item": "(D)(7)", "heading": "10 AWG Aluminum and Copper-Clad Aluminum.", "max_a": 25}, {"item": "(D)(8)", "heading": "10 AWG Copper.", "max_a": 30}], "ab_word_D1_D2": "conductor (not 'wire'): one A2022 pull (the canary run), no run-together; resolves Eaton 2023's flattened 'copper wire conductor' as struck 2020 'wire' + 2023 'conductor'; 2026 SR-8377 also prints 'conductor'. Two-pull condition not met for this word.", "quote_segments": ["(D) Small Conductors.", "Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed", "that required by 240.4 (D)(1) through (D)(7) (8) after any correction factors for ambient temperature", "and number of conductors have been applied.", "(1) 18 AWG Copper. | 7 amperes", "(2) 16 AWG Copper. | 10 amperes", "(3) 14 AWG Copper-Clad Aluminum. | 10 amperes", "(4) 14 AWG Copper. | 15 amperes", "(5) 12 AWG Aluminum and Copper-Clad Aluminum. | 15 amperes", "(6) 12 AWG Copper. | 20 amperes", "(7) 10 AWG Aluminum and Copper-Clad Aluminum. | 25 amperes", "(8) 10 AWG Copper. | 30 amperes", "Continuous loads do not exceed 8 amperes.", "Class CC, Class CF, Class J, or Class T fuses.", "18 AWG copper conductor", "16 AWG copper conductor", "14 AWG copper-clad aluminum conductor", "14 AWG copperclad aluminum conductor"], "flattened_markup": ["lead-in '(D)(7) (8)' = struck (7), inserted (8)", "(D)(3) b. 'copperclad'"], "committee_statement": ["A new list item (3) is added to address specific requirements for 14 AWG Copper-Clad Aluminum with a maximum", "overcurrent protection rating of 10 Amps to align with the other small conductors permitted in 240.4(D).", "The following sections were renumbered accordingly."], "canaries": [{"planted": "(D)(3) continuous loads do not exceed 7.5 amperes", "rejected": true, "printed": "8 amperes"}, {"planted": "(D)(5) 12 AWG Al and CCA 20 amperes", "rejected": true, "printed": "15 amperes"}, {"planted": "(D)(7) 10 AWG Al and CCA 30 amperes", "rejected": true, "printed": "25 amperes"}, {"planted": "(D)(1)/(D)(2) c. 'Class CC, Class G, Class J, or Class T fuses'", "rejected": true, "printed": "Class CC, Class CF, Class J, or Class T fuses."}, {"planted": "240.4(B)(3) 1000 amperes (same run)", "rejected": true, "printed": "800 amperes"}, {"planted": "240.4(B) closing '240.6(B)' (same run)", "rejected": true, "printed": "240.6(C)"}], "true_lines_confirmed": ["(D)(1) 18 Cu 7 A, continuous 5.6 A", "(D)(2) 16 Cu 10 A, continuous 8 A", "(D)(4) 14 Cu 15 A", "(D)(6) 12 Cu 20 A", "(D)(8) 10 Cu 30 A"], "matches_data_file": "nec-240-4-d.json: all ampere values identical; no contradiction", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P10_SD_SRStatements.pdf", "permission_notice": "Important Notice: This document is the copyright property of the National Fire Protection Association (NFPA), Copyright © 2021 NFPA, and may not be used for any other purpose or distributed to any other persons or parties.", "retrieved": "2026-10-20"}
```

**Block 02: 240.4(B)** (validated file `r4_2_02.json`)

```json
{"ref": "240.4(B)", "edition": "NFPA 70-2023 cycle (A2022) Second Draft, Second Revision No. 8283-NFPA 70-2021 [Section No. 240.4(B)]", "status": "verified-sd2023 for heading, lead-in, condition (3) (800 A) and the closing-sentence references (condition 3 of the key not checked); conditions (1)-(2): one A2022 pull, word-identical to two 2026 SD SR-8377 pulls (round 2); closing sentence opening flattened ('Where If')", "condition_3": "not checked: the A2022 NITMAM/CAM report and 2022 voting results were not located (5 searches); IAEI NFPA Code Talk (Hannahs, Aug 31 2022) gives totals only: 55 CAMs, 18 passed, 23 failed, 14 not pursued; CAM 70-126 (minimum-size CCA branch-circuit conductors) failed 196-198", "values": {"heading_2023": "(B) Overcurrent Devices Rated 800 Amperes or Less.", "max_next_higher_rating_a": 800, "conditions": ["(1) The conductors being protected are not part of a branch circuit supplying more than one receptacle for cord-and-plug-connected portable loads.", "(2) The ampacity of the conductors does not correspond with the standard ampere rating of a fuse or a circuit breaker without overload trip adjustments above its rating (but that shall be permitted to have other trip or rating adjustments).", "(3) The next higher standard rating selected does not exceed 800 amperes."], "closing_sentence_substance": "an adjustable-trip OCPD installed per 240.4(B)(1)-(B)(3) may be set to a value not exceeding the next higher standard value above the conductor ampacity, as shown in Table 240.6(A), where restricted access per 240.6(C) is provided"}, "quote_segments": ["(B) Overcurrent Devices Rated 800 Amperes or Less.", "The next higher standard overcurrent device rating (above the ampacity of the conductors being protected)", " shall be permitted to be used, provided all of the following conditions are met:", "The conductors being protected are not part of a branch circuit supplying more than one receptacle", " for cord-and-plug-connected portable loads.", "The ampacity of the conductors does not correspond with the standard ampere rating of a fuse or a circuit breaker", " without overload trip adjustments above its rating", " (but that shall be permitted to have other trip or rating adjustments).", "The next higher standard rating selected does not exceed 800 amperes.", "Where If the overcurrent protective device is an adjustable trip device, installed in accordance with 240.4(B) (1),", " (B)(2), and (B)(3), it shall be permitted to be set to a value that does not exceed the next higher standard value", " above the ampacity of the conductors being protected as shown in Table 240.6(A)", " where restricted access in accordance with 240.6(C) is provided."], "committee_statement": "The last sentence is modified for compliance with the NEC style manual and to clarify that all of 240.4(B) applies.", "canaries": [{"planted": "(3) does not exceed 1000 amperes", "rejected": true, "printed": "800 amperes"}, {"planted": "closing sentence ends 'in accordance with 240.6(B) is provided'", "rejected": true, "printed": "240.6(C)"}], "resolves": "A2 open gap 10: the SR-8377 phrase 'as shown in Table 240.6(A) where restricted access in accordance with 240.6(C) is provided' is the end of 240.4(B)'s closing sentence", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P10_SD_SRStatements.pdf", "permission_notice": "Important Notice: This document is the copyright property of the National Fire Protection Association (NFPA), Copyright © 2021 NFPA, and may not be used for any other purpose or distributed to any other persons or parties.", "retrieved": "2026-10-20"}
```

**Block 03: 250.122(B)** (validated file `r4_2_03.json`)

```json
{"ref": "250.122(B)", "edition": "NFPA 70-2023 cycle (A2022) Second Draft, Second Revision No. 8071-NFPA 70-2021 [Section No. 250.122(B)], CMP-5 SR statements printed 12/6/2021 12:33 PM, 50 pages", "status": "main sentence: verified-sd2023 (conditions 1-2 met; condition 3 not checked in a TM/SC document). Exception and Informational Note: CONFLICTING (do not render)", "condition_1": "SR-8071 is a Second Revision on 250.122(B); the section is printed in the SR", "condition_2": "pull 1 = R3-4 (this session, round 3); pull 2 = R4-2 canary run; all non-canary lines match; 4 of 4 canaries rejected", "condition_3": "not checked: the A2022 NITMAM/CAM report and 2022 voting results were not located (5 searches); IAEI NFPA Code Talk (Hannahs, Aug 31 2022) gives totals only: 55 CAMs, 18 passed, 23 failed, 14 not pursued; CAM 70-126 (minimum-size CCA branch-circuit conductors) failed 196-198; the same main sentence is the base text of the 2026 Second Draft (SR-8360, relettered (D)), so it reached the 2023 edition", "values": {"heading": "(B) Increased in Size.", "trigger": "ungrounded conductors increased in size for any reason other than as required in 310.15(B) or 310.15(C)", "applies_to": "wire-type equipment grounding conductors, if installed", "rule": "increased in size proportionately to the increase in circular mil area of the ungrounded conductors", "cross_reference_as_printed": "310.15(B) or 310.15(C) (C) ,", "cross_reference_note": "flattened; referenced sections 310.15(B) and 310.15(C) are certain; exact 2023 string UNVERIFIED (2026 SD prints '310.15(B) or 310.15(C)')", "exception_A2022_SD": "sized under engineering supervision or by a qualified person using industry practices to meet the performance objectives of 250.4(A)(5) or (B)(4); documentation of the method and EGC size made available to the AHJ upon request", "informational_note_A2022_SD": "See GEMI Analysis Software for an industry practice method for determining acceptable equipment grounding conductor sizes.", "exception_2026_SD_base": "Equipment grounding conductors shall be permitted to be sized by a qualified person to provide an effective ground fault current path in accordance with 250.4(A)(5) or 250.4(B)(4).", "informational_note_2026_SD": null, "2026_lettering": "(D) Increased in Size (SR-8360, 2026 SD); not final"}, "quote_segments": ["(B) Increased in Size.", "If ungrounded conductors are increased in size for any reason other than as required in 310.15(B) or", "310.15(B) or 310.15(C) (C) ,", "wire-type equipment grounding conductors, if installed, shall be increased in size proportionately", "to the increase in circular mil area of the ungrounded conductors.", "sized under engineering supervision or by a qualified person", "using industry practices to meet the performance objectives of 250.4(A)(5) or (B)(4).", "Documentation of the method used and the equipment grounding conductor size shall be made available", "to the authority having jurisdiction upon request.", "See GEMI Analysis Software for an industry practice method for determining acceptable equipment grounding", "conductor sizes."], "committee_statement": "An informational note is added to provide guidance on a method for calculating equipment grounding conductor sizes.", "canaries": [{"planted": "'to the increase in ampacity of the ungrounded conductors.'", "rejected": true, "printed": "to the increase in circular mil area of the ungrounded conductors."}, {"planted": "'...or by a licensed professional engineer'", "rejected": true, "printed": "sized under engineering supervision or by a qualified person"}, {"planted": "'...performance objectives of 250.4(A)(3) or (B)(3).'", "rejected": true, "printed": "250.4(A)(5) or (B)(4)."}, {"planted": "'Informational Note: See IEEE Std 80 for ...'", "rejected": true, "printed": "See GEMI Analysis Software for an industry practice method ..."}], "corroboration_t4": ["EC&M Electrical Contractor, Michael Johnston, Feb 15 2023 (no NFPA notice): 'other than as required in 310.15(B) or 310.15(C).'", "EEPower, Lorenzo Mari, Sep 3 2023 (no NFPA notice): exception 'permits a qualified person to size the equipment grounding conductor'; no engineering supervision or GEMI mentioned; 41,740 x 1.4 = 58,436 cmil -> 2 AWG"], "engine_note": "nec-250-122.json method is consistent with the rule only if 'minimum ungrounded cmil with sufficient ampacity' already includes any 310.15(B)/(C) correction or adjustment; upsizing required by 310.15(B)/(C) does not trigger the increase", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P05_SD_SRStatements.pdf", "permission_notice": "none in extracted text (NFPA committee report)", "retrieved": "2026-10-20"}
```

**Block 04: 250.122(A) 'not required to be larger than the circuit conductors'** (validated file `r4_2_04.json`)

```json
{"ref": "250.122(A) 'not required to be larger than the circuit conductors'", "edition": "NFPA 70 A2025 (2026 cycle) Second Draft working draft, SR-8360 [Section No. 250.122] (2023 base text plus 2026 changes, flattened)", "status": "VERIFIED-draft (2026 SD, single pull) for the rule; 2023 wording UNVERIFIED (inferred from the SR statement); no 2023-cycle document reached", "values": {"rule": "EGCs are not required to be larger than the circuit conductors supplying the equipment", "wording_2026_SD": "Equipment grounding conductors shall not be required to be larger than the circuit conductors in the raceway or cable supplying the equipment.", "phrase_added_in_2026": "in the raceway or cable", "inferred_2023_wording_do_not_publish": "Equipment grounding conductors shall not be required to be larger than the circuit conductors supplying the equipment.", "structure_hint_2023": "2023 base had the first table reference in 250.122(A)(1); flattened labels '(2) Cable Trays' and '(3) ... Sectioned' suggest (A)(1)-(A)(3) subdivisions in 2023"}, "quote_segments": ["Equipment grounding conductors shall not be required to be larger than the circuit conductors", "in the raceway or cable supplying the equipment.", "Copper, aluminum, or copper-clad aluminum equipment grounding conductors of the wire type", "shall not be smaller than shown in Table 250.122 unless otherwise permitted by 250.122 (A) through 250 . 122(I).", "Section 250.122 and its subsections are revised for readability and to comply with the NEC Style", "Manual for formatting. No technical changes occurred as a result of this revision.", "The reorganization of 250.122 moves the first table reference from 250.122(A)(1) to the main", "paragraph (250.122), which returns the table to its original numbering.", "The phrase “in the raceway or cable” is added to the remaining sentence to clarify that if circuit"], "corroboration_t4": ["EC&M Johnston Feb 15 2023: 'in no case are the EGCs required to be larger than the circuit conductors supplying the equipment.'", "EEPower Mari Sep 3 2023: 'The equipment grounding conductors are not required to be larger than the phase conductors.'"], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf", "permission_notice": "CONTENT NOT FINAL – SUBJECT TO REVISION PRIOR TO LETTER BALLOT AND PUBLICATION OF SECOND DRAFT REPORT", "retrieved": "2026-10-20"}
```

**Block 05: Table 250.122 caption and number (2023 vs 2026)** (validated file `r4_2_05.json`)

```json
{"ref": "Table 250.122 caption and number (2023 vs 2026)", "edition": "2023 / 2026 SD", "status": "CONFLICTING (label only; no row values affected)", "values": {"round1_reading_2026-10-19": "SR-8360 relabels Table 250.122 as 'Table 250.122(A)' in 2026", "r4_2_reading": "SR-8360 statement says the 2026 reorganization 'returns the table to its original numbering'; caption extracted as 'Table 250.122 (A) Minimum Minimum Size' (flattened)", "implication": "the '(A)' suffix may be struck 2023 text (2023 caption 'Table 250.122(A)' or similar) rather than inserted 2026 text", "rows": "19 rows unchanged per SR-8360 ('No technical changes'); 2020 fact sheet = 2026 SD"}, "quote_segments": ["The reorganization of 250.122 moves the first table reference from 250.122(A)(1) to the main", "paragraph (250.122), which returns the table to its original numbering.", "Table 250.122 (A) Minimum Minimum Size"], "contradicts": "nec-250-122.json 'edition' ('2026 label 250.122(A)') and nec-sections-allowlist.csv render note ('2026 label 250.122(A)') may be reversed; unresolved", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf", "permission_notice": "CONTENT NOT FINAL – SUBJECT TO REVISION PRIOR TO LETTER BALLOT AND PUBLICATION OF SECOND DRAFT REPORT", "retrieved": "2026-10-20"}
```

**Block 06: Table 250.122 and Table 250.66 in 2023-cycle (A2022) NFPA documents** (validated file `r4_2_06.json`)

```json
{"ref": "Table 250.122 and Table 250.66 in 2023-cycle (A2022) NFPA documents", "edition": "A2022 (2023 cycle)", "status": "not found (negative finding)", "values": {"P05_SD_SRStatements": "only SR on 250.122 is SR-8071 (250.122(B)); no SR on 250.32, 250.64, 250.66, Table 250.122 or Table 250.66; no Global SR; no table rows printed (only 'Table 250.102(C)(1)' cited in 250.24(D)(1) and 250.30(A)(3)(a))", "P05_FD_BallotFinal": "'NEC First Draft Technical Committee FINAL Ballot Results (A22)', memo Apr 15 2021, 174 pages; visible text ~pp. 1-58 ends in FR-8233 (250.30(A)(1)); 35 FRs visible; FRs on 250.32 and later not visible", "P05_FD_global_FR": "FR-8280 [Global Input] adds acronyms (GFPE, GEC, EBJ, SSBJ, MBJ, SBJ) to definitions", "P05_FD_250_64": "FR-8079 [Detail] revises 250.64(B), (B)(1), (B)(2) (text not pulled)"}, "quote_segments": ["NEC® First Draft Technical Committee FINAL Ballot Results (A22)"], "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P05_SD_SRStatements.pdf", "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P05_FD_BallotFinal.pdf"], "permission_notice": "none in extracted text", "retrieved": "2026-10-20"}
```

**Block 07: 250.66(A)-(C) and Table 250.66** (validated file `r4_2_07.json`)

```json
{"ref": "250.66(A)-(C) and Table 250.66", "edition": "2023", "status": "UNVERIFIED for 2023 printing and wording (no 2023-cycle SR; FD ballot not reached; no permission-noticed or government 2023 reprint found). nec-250-66.json stays on the 2020 NFPA fact sheet", "values": {"A2022_SD_SR": "none on 250.66 or Table 250.66", "A2025_SD_SR": "none on 250.66 or Table 250.66", "2026_change_outline": "(Revised) 250.66 Size of ac Grounding Electrode Conductor. (A) Connections to a Rod, Pipe, or Plate Electrode(s).", "t4_2023_table_lookups": ["1000 kcmil Cu -> 2/0 AWG", "3/0 AWG Cu -> 4 AWG"], "t4_2023_limits_paraphrase": {"A": "not larger than 6 AWG", "B": "not larger than 4 AWG", "C": "not larger than 2 AWG"}, "data_file_check": "both T4 lookups match nec-250-66.json rows (Over 600 through 1100 -> 2/0; 2/0 or 3/0 -> 4)"}, "quote_segments": ["(Revised) 250.66 Size of ac Grounding Electrode Conductor. (A) Connections to a Rod, Pipe, or Plate Electrode(s).", "Enter Table 250.66 with conductor 1 000 kcmil Cu and read conductor size N° 2/0 AWG.", "Enter Table 250.66 with conductor 3/0 AWG Cu and read conductor size N° 4 AWG."], "source_url": ["https://secure.utah.gov/ce-public/files/objectives/13441.pdf", "https://eepower.com/technical-articles/national-electrical-code-2023-basics-grounding-and-bonding-part-12/"], "permission_notice": "none (Utah outline: no notice; EEPower: '© EETech Group, LLC. All rights reserved', no NFPA notice)", "retrieved": "2026-10-20"}
```

**Block 08: 250.32(A), 250.32(B)(1)** (validated file `r4_2_08.json`)

```json
{"ref": "250.32(A), 250.32(B)(1)", "edition": "2023 target; evidence from 2026 SD (A2025 SR-8125), a 2017-based county document and 2023 trade press", "status": "PARTIAL: 2023 wording UNVERIFIED. 250.32(B)(1) EGC-with-feeder wording VERIFIED-draft (2026 SD, single pull). Neutral isolation VERIFIED-other-edition (2017, government text) with 2023 T4 corroboration only. No 2023-cycle SR on 250.32", "values": {"egc_with_feeder_2026_SD": "Equipment grounding conductors, as described in 250.118(A), shall be run with supply conductors and be connected to the enclosure containing the building or structure disconnecting means and to the grounding electrode conductor.", "phrase_added_2026": "enclosure containing the", "neutral_isolation_2017": "Any installed grounded conductor shall not be connected to the equipment grounding conductor or to the grounding electrode(s).", "ges_at_building_2017": "Building(s) or structure(s) supplied by feeder(s) or branch circuits(s) shall have a grounding electrode or grounding electrode system installed in accordance with Part III of Article 250.", "single_branch_circuit_exception_2017": "no grounding electrode required where only a single branch circuit, including a multiwire branch circuit, with an EGC supplies the building", "existing_installation_exception_t4_2023": "grounded conductor may serve as ground-fault return only if: no EGC in the supply, no continuous metallic path between buildings, no GFPE on the supply side"}, "quote_segments": ["Equipment grounding conductors, as described in 250.118(A), shall be run with supply", "conductors and be connected to the enclosure containing the building or structure", "disconnecting means and to the grounding electrode conductor.", "The phrase “enclosure containing the” was added to clarify when equipment grounding conductors", "Any installed grounded conductor shall not be connected to the equipment grounding conductor", "or to the grounding electrode(s).", "Building(s) or structure(s) supplied by feeder(s) or branch circuits(s) shall have a grounding electrode", "or grounding electrode system installed in accordance with Part III of Article 250."], "source_url": ["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf", "https://www.campbellcountywy.gov/DocumentCenter/View/217", "https://eepower.com/technical-articles/national-electrical-code-2023-basics-grounding-and-bonding-part-8/"], "permission_notice": "2026 SD: 'CONTENT NOT FINAL – SUBJECT TO REVISION...'; Campbell County: none (untitled, undated, '2017 NEC'); EEPower: no NFPA notice", "retrieved": "2026-10-20"}
```

**Block 09: 210.19 [main paragraph] and its Informational Note (voltage drop)** (validated file `r4_2_09.json`)

```json
{"ref": "210.19 [main paragraph] and its Informational Note (voltage drop)", "edition": "NFPA 70-2023 cycle (A2022) Second Draft, Second Revision No. 8042-NFPA 70-2021 [Section No. 210.19 [Excluding any Sub-Sections]], CMP-2 SR statements printed 12/6/2021 5:22 PM, 88 pages (text ends p. 62)", "status": "VERIFIED-draft (A2022 SD, single pull, no canaries on these lines); voltage phrase flattened", "values": {"subdivisions_2023": "210.19(A) through (D)", "voltage_scope_flattened": "circuits 'not more than exceeding' 1000 volts ac or 1500 volts dc", "vd_note_branch": "3 percent at the farthest outlet", "vd_note_total": "5 percent (feeders plus branch circuits)", "vd_note_effect": "provide reasonable efficiency of operation", "vd_note_number": "single unnumbered 'Informational Note'", "feeder_note_cross_reference": "Informational Note No. 2 of 215.2(A)(2)"}, "quote_segments": ["Branch-circuit conductors for circuits not more than exceeding 1000 volts ac or 1500 volts dc", "shall be sized in accordance with 210.19(A) through (D).", "Informational Note: Conductors for branch circuits as defined in Article 100, sized to prevent a voltage drop", "exceeding 3 percent at the farthest outlet of power, heating, and lighting loads, or combinations of such loads,", "and where the maximum total voltage drop on both feeders and branch circuits to the farthest outlet does not exceed", "5 percent, provide reasonable efficiency of operation.", "See Informational Note No. 2 of 215.2(A)(2) for information on voltage drop on feeder conductors."], "committee_statement": ["The text has been changed to clarify that the voltage limitation is intended to apply", "to the circuit, not the conductor's insulation rating.", "1500 volts dc has been added to align with the proposed new Article 235."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P02_SD_SRStatements.pdf", "permission_notice": "none in extracted text", "retrieved": "2026-10-20"}
```

**Block 10: 210.19 household ranges and cooking appliances (8 3/4 kW, 40 A) and tap/neutral exceptions** (validated file `r4_2_10.json`)

```json
{"ref": "210.19 household ranges and cooking appliances (8 3/4 kW, 40 A) and tap/neutral exceptions", "edition": "2023", "status": "UNVERIFIED", "values": {"known": "2023 210.19 has subdivisions (A) through (D) (SR-8042); the range rule's letter and wording not seen"}, "quote_segments": [], "canaries": [{"planted": "N1-N4 (40 A; 30 A tap; 60 percent neutral; Column A)", "rejected": "not checkable: SR-8042 contains no range text"}], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P02_SD_SRStatements.pdf", "permission_notice": "none in extracted text", "retrieved": "2026-10-20"}
```

**Block 11: 230.42(A)(1) Exception No. 2** (validated file `r4_2_11.json`)

```json
{"ref": "230.42(A)(1) Exception No. 2", "edition": "2023", "status": "CONFLICTING (unchanged from round 3)", "values": {"A2022_SD": "no Second Revision on 230.42 (CMP-10 owned Articles 215, 225, 230, 240 and 242 in the 2023 cycle), so the 2023 text is 2023-cycle First Draft text, not reached"}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P10_SD_SRStatements.pdf", "permission_notice": "Important Notice: This document is the copyright property of the National Fire Protection Association (NFPA), Copyright © 2021 NFPA, and may not be used for any other purpose or distributed to any other persons or parties.", "retrieved": "2026-10-20"}
```

**Block 12: 2022 NFPA Technical Meeting and Standards Council (NFPA 70-2023)** (validated file `r4_2_12.json`)

```json
{"ref": "2022 NFPA Technical Meeting and Standards Council (NFPA 70-2023)", "edition": "A2022 cycle", "status": "partial: totals only; per-CAM targets not seen", "values": {"cams_prepared": 55, "passed": 18, "failed": 23, "not_pursued": 14, "meeting": "June 9 (2022), Boston", "cam_70_126": "minimum size copper-clad aluminum branch-circuit conductors; failed 196-198", "standards_council_appeals": "August 10-12 (2022), Quincy, MA; outcome not reported"}, "quote_segments": ["Of those CAMs, 18 passed, 23 failed, and 14 were not pursued."], "source_url": "https://iaeimagazine.org/columns/nfpa-code-talk/making-of-the-2023-nec-a-cycle-like-no-other/", "source_title": "IAEI Magazine, NFPA Code Talk, Corey Hannahs, 'Making of the 2023 NEC: A Cycle Like No Other', Aug 31 2022", "permission_notice": "Table 1: 'Copyright © 2022, National Fire Protection Association (NFPA). All rights reserved.'", "retrieved": "2026-10-20"}
```

**Block 13: A2022 CMP-10 Second Revision list (context)** (validated file `r4_2_13.json`)

```json
{"ref": "A2022 CMP-10 Second Revision list (context)", "edition": "A2022 (2023 cycle)", "status": "VERIFIED (NFPA document, single pull)", "values": {"srs": ["8472 Global", "8704 Global", "8705 Global", "8722 Detail", "8442 Def. OCPD, Branch-Circuit", "8447 Def. Supervised Industrial Installation", "8449 Defs Service-Ent...", "8215 215.1", "8216 215.15", "8382 215.18(B)", "8218 215.18(E)", "8698 225.3", "8275 225.41(B)", "8379 225.42(B)", "8236 230.7", "8238 230.31(C)", "8241 230.43", "8244 230.67(B)", "8249 230.71(B)", "8253 230.82", "8262 230.85(B)", "8265 230.85(C)", "8268 230.85(D)", "8453 230.91", "8703 230.95", "8281 240.3", "8283 240.4(B)", "8285 240.4(D)", "8394 240.6(C)", "8391 240.6(D)", "8295 240.7", "8631 240.14", "8440 new section after 240.15(B)(4)", "8313 240.24", "8323 240.67", "8320 240.87", "8331 242.1", "8334 242.28", "8335 242.42", "8457 Part IX 240.100-240.102", "8272 Part VIII 230.200-230.205"], "no_SR_on": ["215.2", "215.3", "225.18", "225.31", "225.39", "230.42", "240.6(A)"]}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2022_NEC_P10_SD_SRStatements.pdf", "permission_notice": "Important Notice: This document is the copyright property of the National Fire Protection Association (NFPA), Copyright © 2021 NFPA, and may not be used for any other purpose or distributed to any other persons or parties.", "retrieved": "2026-10-20"}
```

---

## 5. Registry impact (research/data-sources.csv)

### nec-240-ocpd (currently "verified")
- **Upgrade:** rows (D)(4)–(D)(8) move from "2026 Second Draft values" to **2023-cycle text** (verified-sd2023, SR-8285). 240.4(B) moves from "2026 draft only" to verified-sd2023 (SR-8283).
- **Proposed coverage line:** "Table 240.6(A) standard ratings 10–6000 A (38 values, 2023, Eaton reprint); 240.4(D)(1)–(D)(8) item numbers and ampere limits (2023-cycle Second Draft SR-8285, 2 pulls, 6 canaries rejected; (D)(1)–(D)(3) also in 2023 Eaton/Leviton reprints); 240.4(B) heading, 3 conditions, 800 A cap (SR-8283)".
- **Proposed sample_note:** "TM/SC record for 2022 not seen; SR-8285 carry-through shown by Leviton 2023 node 313. Fuse-only additional ratings still CONFLICTING: no A2022 SR on 240.6(A)."
- **File: data/verified/nec-240-4-d.json.** No value contradicts it. Edits needed:
  - set the (D)(4)–(D)(8) status to "verified-sd2023 (SR-8285)";
  - replace "[wire|conductor]" with "conductor" in (D)(1)/(D)(2);
  - delete the note "Cite as 'NEC 240.4(D)' without item numbers…";
  - update `edition` and `source` to add the A2022 URL;
  - optionally add a `rule_240_4_b` block (heading, 3 conditions, 800 A, adjustable-trip sentence with 240.6(C)).

### nec-250-grounding (currently "verified")
- **No upgrade for the tables.** No 2023-cycle or 2023-edition printing of Table 250.122 or Table 250.66 was reached.
- **Upgrade for 250.122(B):** the allowlist row "250.122(B) … verified-other-edition" can become **verified-sd2023 (main sentence only)**.
- **Proposed coverage line:** "T250.122 19 rows (2020 NFPA fact sheet = 2026 SD SR-8360, no technical changes; 2023 printing not seen; caption suffix unresolved); T250.66 7 rows (2020 fact sheet only; 2026 revises 250.66(A)); 250.122(B) proportional increase, main sentence (2023-cycle SD SR-8071, verified-sd2023; exception and note CONFLICTING)".
- **File: data/verified/nec-250-122.json.**
  - Change `rule_250_122_b.status` and add the SR-8071 quote. Keep the note "applying it only enlarges the EGC".
  - Add the engine check: the baseline must already include any 310.15(B)/(C) correction or adjustment.
  - **Possible contradiction:** `edition` says "2026 label 250.122(A)", and so does the allowlist render note. SR-8360's statement ("returns the table to its original numbering") points the other way. Until resolved, do not print an edition-specific caption suffix. Note too that on 2026 pages the proportional rule is cited as 250.122(D) (2026 SD).
- **File: data/verified/nec-250-66.json.** Unchanged; no contradiction (two T4 2023 lookups match).

### nec-grounding-rules (currently "GAP")
- **Partial.** The 250.122(B) main rule can be marked verified (verified-sd2023).
- The domain as a whole stays **GAP**, because these remain unverified:
  - 250.66(A)/(B)/(C) 2023 wording (copper limits are a 2023 government paraphrase only);
  - 250.118(A) (A2022 SD, single pull, no canaries);
  - 250.52/250.53 national 2023 wording.
- **Proposed coverage line:** "250.122(B) proportional EGC increase, main sentence (2023-cycle SD SR-8071, verified-sd2023; exception/GEMI note CONFLICTING, not rendered); 250.66(A)/(B) copper limits (2023 gov paraphrase); 250.118(A) list (A2022 SD, 1 pull)".
- **File:** values live in nec-250-122.json (`rule_250_122_b`).

### nec-feeders-outbuildings, 250.32 part (currently "GAP")
- **Stays GAP.**
- **Proposed coverage line:** "250.32(A) GES at a separate building + single-branch-circuit exception (2023 gov paraphrase; 2017 county text); 250.32(B)(1) EGC run with the feeder (2023 gov paraphrase; 2026 SD SR-8125 wording); neutral not connected to the EGC or electrodes at the separate building: 2017 gov text + 2023 T4 only".
- The garage subpanel tool should stay withdrawn for the no-bond claim.
- **File:** none yet (no 2023 verbatim text).

### Other files touched
- **nec-continuous-load-2023.json** (no contradiction). Two draft-level refinements:
  - the 210.19 voltage-drop note now has A2022 SD text (SR-8042, VERIFIED-draft);
  - SR-8042 cross-references "Informational Note No. 2 of 215.2(A)(2)", so the feeder note can be cited at 215.2(A)(2) rather than 215.2(A).
  - The household-range rule stays unverified.

---

## 6. Blocked or failed log

| Fetch / search | Result |
|---|---|
| docinfofiles.nfpa.org | 6 of 6 used, **no 429.** All 6 returned content |
| 70_A2022_NEC_P05_FD_BallotFinal.pdf | Visible text ends at about p. 58 of 174, in FR-8233 (250.30(A)(1)). FRs on 250.32, 250.66 and 250.122 are not reachable through WebFetch |
| 70_A2025_NEC_P05_SD_PrelimSR.pdf | Truncated in Article 270. The extract did not include the 250.32(B)(1) neutral-isolation sentence |
| 70_A2022_NEC_P02_SD_SRStatements.pdf | Text ends at p. 62 of 88, after SR-8067 (210.65(B)). No SR on any 210.19 subdivision |
| A2022 NITMAM/CAM report | **Not located.** 5 searches ("NITMAM" A2022; NITMAM_MC_Report_A2022; "CAM 70-126"; NITMAM directory; "Motions Committee Report" Annual 2022). Known patterns: /4/NITMAM_MC_Report_A2023.pdf and /70/NITMAM_MC_Report_A2025.pdf. A guessed /70/NITMAM_MC_Report_A2022.pdf was **not tried** (NFPA budget) |
| goodreads.com NFPA blog mirror "NFPA Technical Meeting results" | Posted June 7, 2022, before the NFPA 70 results. Nothing usable |
| eepower.com (3 articles) | T4, no NFPA notice. Used as corroboration only |
| ecmag.com, Johnston Feb 2023 | T4, edition not stated |
| ecmag.com, "Sizing Conductors Part III" | Charles R. Miller, 2011. Edition too old; no 230.42 2023 text |
| nema.org Bulletin No. 97 (Rev. 6/15) | **A repeat of a fetch R3-4 had already logged as unusable** (2014 notice, no 250.118 text). My mistake; nothing new (no GEMI-in-NEC statement) |
| mikeholt.com/files/PDF/23_BG_250.122.pdf | 404 (URL guessed from the 23_BG_250.118.pdf pattern) |
| campbellcountywy.gov DocumentCenter/View/217 | Readable but 2017-based, untitled and undated. VERIFIED-other-edition (2017) only |
| secure.utah.gov 13441 (read twice) | 2026 change outline. No table captions; 250.32, 210.19 and 230.42 not listed |
| WebSearch | 22 of 24 used. Searches for a 2023 range-rule reprint, a 230.42 2023 reprint, a 250.32 2023 reprint with notice, a Table 250.66 2023 reprint with notice, the 250.122(A) verbatim sentence and a 2023 NFPA fact sheet returned forums, T4 pages or 2020 material only |

---

## 7. Open gaps

1. **Condition 3 for SR-8285, SR-8283 and SR-8071.** The 2022 per-CAM record has not been seen.
   - Next: one fetch of `https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NITMAM_MC_Report_A2022.pdf` (a guess), or a person reading the NFPA 70 "next edition / 2023 TM" page in a browser.
2. **250.122(B) Exception and Informational Note, final 2023 wording (CONFLICTING).**
   - The A2022 SD long form with GEMI note conflicts with the short form, without note, in the 2026 SD base.
   - The same per-CAM record would settle it. So would a 2026 First Revision on 250.122(B) (CMP-5 A2025 FD) whose statement says what it changed.
3. **Table 250.122 caption: "(A)" in 2023 or in 2026.**
   - Settle it with a 2023 reprint showing the caption, or a 2026-cycle PI on 250.122 (it would reprint the 2023 caption).
4. **250.122(A) 2023 wording** (2026 SD and T4 only), and the 2023 subdivision layout ((A)(1)–(A)(3)?).
5. **Table 250.66 and 250.66(A)/(B)/(C), 2023 printing and wording**, including the aluminum/CCA wording. No SR in either cycle; the 2023 FD is not reached. 2026 revises 250.66(A).
6. **250.32(B)(1) 2023 verbatim**, including the neutral-isolation sentence and Exception No. 1. No 2023-cycle SR exists; the A2022 FD ballot stops at 250.30.
7. **210.19 household ranges** (2023 letter, 8¾ kW / 40 A wording, tap and neutral exceptions). This is 2023-cycle First Draft text.
   - Next: `70_A2022_NEC_P02_FD_BallotFinal.pdf` (pattern confirmed for P03, P05, P06). Article 210 opens CMP-2's FD, so 210.19 should fall inside the first 100K characters.
8. **230.42(A)(1) Exception No. 2** and the **240.6(A) fuse-only sentence**: both are 2023-cycle First Draft text.
   - Next: `70_A2022_NEC_P10_FD_BallotFinal.pdf` (the CMP-10 FD covers 215, 225, 230 and 240 in that cycle). It may also give 225.18, 225.31(B) and 225.39 for nec-feeders-outbuildings.
9. **(D)(1)/(D)(2) "conductor"**: one A2022 pull. A second pull would make it verified-sd2023.
10. **240.4(B) closing sentence**: whether 2023 opens "If" or "Where" (flattened).
