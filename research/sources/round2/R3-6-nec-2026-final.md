# R3-6: final NFPA 70-2026 text and values (round 3)

- Run and retrieval date for every source: **2026-10-20**.
- Budgets used:
  - docinfofiles.nfpa.org: **8 of 8** fetches, **no HTTP 429**. Two of the eight returned a fetch error: the A2028 PI probe and TIA_70_26_13.
  - WebSearch: **19 performed.** The 20th was refused because the **session-wide** search budget was exhausted, so no further searches were possible.
  - Other hosts: 27 WebFetch calls.
- Method: WebFetch only. Quotes are the extractor's readout, split into segments under about 120 characters (" / " marks a split).
  - NFPA redlines and the Oregon amendment table flatten strike-through and underline. Words that sit next to near-synonyms are treated as possibly struck.
- Round-1 findings (`research/nec-editions.md`, `research/nec-tables.md`, retrieved 2026-10-19) are cited as **"R1 (not re-fetched)"**. Per integrity rule 1, they are **not** counted as VERIFIED in this run.

---

## Status matrix

| # | Item | Status (this run) | Value / finding | Primary evidence (this run) |
|---|---|---|---|---|
| 1a | CAM 70-105 ("Reject SR 8481", Table 310.16) at the June 2025 Technical Meeting | **VERIFIED** | **"No Vote — CAM NOT PURSUED"**, so SR/CC-8481 stood | NFPA "Confirmed Results of NFPA Membership Voting", posted 6/23/2025 |
| 1b | Table 310.16 (2026), 16 AWG Cu row | **VERIFIED-draft** (final UNVERIFIED) | 60 °C **10**; 75 °C **15**² ; 90 °C **20**² (2023's 18 struck; 18 A for MI/MTW moved to Note 5); Al columns — | CMP-6 Second Draft final ballot (8481 passed 15–4). Matches the R1 working-draft tokens on all values |
| 1c | Table 310.16 (2026), 14 AWG CCA (Al/CCA columns) | **VERIFIED-draft** (final UNVERIFIED) | 60 °C **10**(†,2,3 as extracted); 75 °C **15**²˒³ ; 90 °C **20**²˒³ ; Cu 14 AWG unchanged 15/20/25 | same |
| 1d | Table 310.16 (2026) footnotes | **VERIFIED-draft** | Notes 1–3 as 2023; **Note 4** 18 AWG MI/MTW 14 A at 90 °C; **Note 5** 16 AWG MI/MTW 18 A at 90 °C; sup. 1 = 240.4(D); **sup. 2 = "Ampacity shall be used for adjustment or correction only."**; †3 = CCA only | same |
| 1e | 18 AWG row in the final 2026 table | **CONFLICTING (draft)** | SR-8602 (deletes the 18 AWG row) passed 19–0, but the 8481 table display still prints an "18*" row (possibly struck text) | same |
| 2a | 120.41 (2 VA/ft²) | **UNVERIFIED** | No final-text source. No CAM on 120.41 (R1, not re-fetched) | — |
| 2b | 120.82 (first 8 kVA at 100 %, EVSE item) | **UNVERIFIED** | No final-text source | — |
| 2c | Table 120.55 | **UNVERIFIED** (no change seen) | — | — |
| 2d | 120.57 exact wording | **UNVERIFIED** | — | — |
| 2e | 120.84(C)(1) | **UNVERIFIED** | — | — |
| 2f | RV park and mobile-home sections | **VERIFIED-other-edition (2026)**, gov. summary, numbers only | **Part VIII = RV parks, 120.130; Part IX = mobile and manufactured home parks, 120.140** | MN DLI "Summary of Significant 2026 NEC® Changes", line 10 |
| 2g | CAM 70-87 (120.13) | **VERIFIED** (floor vote only) | Passed on the floor 319–184; CMP-2 ratification ballot **not seen** | NFPA voting results |
| 3a | Table 310.12(A) (2026) label and values | **UNVERIFIED** | MA 527 CMR "310.12. Delete the second paragraph." shows only that 310.12 exists | — |
| 3b | 240.6(A) (2026) | **UNVERIFIED** (no change seen) | Oregon amends only 240.6(D); the MN summary lists no 240.6 change | — |
| 3c | 240.4(D) (2026) final wording | **UNVERIFIED** | — | — |
| 4a | 210.8(F) (2026) ampere threshold | **VERIFIED-other-edition (2026)** | **60 amperes or less**, single-phase, ≤150 V to ground (2023: 50 A) | NFPA proposed TIA 1924 (reprints the 2026 rule); Oregon Table 1-E 2026; MN DLI summary |
| 4b | 210.8(F) (2026) exact rule wording | **CONFLICTING** | TIA 1924 reprint: "...including outdoor outlets installed at the following locations and ... shall be GFCI protected:". Oregon (flattened): "...including outlets installed in the following locations, and ... shall be provided with GFCI protection" | same |
| 4c | 210.8(F) Ex. No. 2 (listed HVAC) | **VERIFIED-other-edition (2026)** | "GFCI protection shall not be required for listed HVAC equipment. This exception shall expire September 1, 2026." | Texas Register adoption preamble; Oregon reprint; TIA 1924 |
| 4d | 210.8(F) Ex. No. 3 (new) | **VERIFIED-other-edition (2026)** (rule); marking sentence single-source | Listed **Class C SPGFCI** permitted for listed HVAC equipment, no expiry; disconnect marked "Warning: Class C SPGFCI Protection Provided for HVAC Unit." | Oregon reprint + MN summary |
| 4e | TIA 1924 (extend Ex. 2 to **September 1, 2028**) | **VERIFIED** (proposal); **not issued** as of 2026-10-20 as far as seen | Comment close 9 Sep 2026. No TIA_70_26_13 file | NFPA proposed TIA 1924; 26-13 fetch error |
| 4f | Texas amendment | **VERIFIED** (gov) | 16 TAC §73.100(b): Exception No. 2 "is extended without expiration" (eff. 1 Sep 2026) | Texas Register, Aug 28 2026 issue |
| 4g | 210.8(D) (2026) | **VERIFIED-other-edition (2026)** for limits and list; exact lead-in UNVERIFIED | Appliances rated **150 V or less to ground and 60 A or less, single- or 3-phase**; 12-item list (ranges, wall ovens and cooktops are items 8, 9, 10) | Oregon reprint; NFPA CMP-2 ballot memo on CAM 70-85; MA 527 CMR (exception "to 8, 9, and 10") |
| 4h | CAM 70-85 (210.8(D): "60 A single-phase or 100 A 3-phase", "identified in 422.5") | **VERIFIED** | Floor: passed (standing vote). **CMP-2 ratification failed, 10 agree / 11 disagree of 21 (14 needed)** | NFPA voting results; CMP-2 ballot memo 15 Jul 2025 |
| 4i | CAM 70-107 (210.8(A)) | **VERIFIED** | Failed on the floor (standing vote) | NFPA voting results |
| 5 | 110.14(C) (2026) changed? | **UNVERIFIED** | No source reprints it. Not in the MN significant-changes list; Oregon amends only 110.14(D); MA only the first paragraph of 110.14 | — |
| 6 | 230.85 (2026) | **VERIFIED-other-edition (2026)** (gov statement + two state reprints) | **Deleted; moved to 230.70** "and reclassified as a service disconnect". Dwelling rule = **230.70(A)(1)**, marking 230.70(B)(2), replacement 230.70(E) | MN DLI minutes 28 Oct 2025; MN summary l. 28; Oregon Table 1-E; MA 527 CMR ("230.85" not found) |
| 7a | 625.54 (2026) heading as issued | **VERIFIED-other-edition (2026)** (NFPA reprint, unchanged line) | "625.54 Ground-Fault Circuit-Interrupter Protection for Personnel." (not "GFCI and SPGFCI Protection") | NFPA proposed TIA 1892 |
| 7b | 625.54 (2026) body | **UNVERIFIED** (flattened) | Probable base: "All receptacles installed for the connection of electric vehicle charging shall have ground-fault circuit-interrupter protection for personnel." | same |
| 7c | MN summary "625.54 GFCI and SPGFCI Protection … permanently wired equipment" | **CONFLICTING** | Reflects the pre-appeal draft. SC D#25-2 removed SR 7875 (R1, not re-fetched) | MN summary l. 91 vs NFPA TIA 1892 docs |
| 7d | TIA 1892 | **VERIFIED** | **Not issued.** SC D#26-8 (20 Aug 2026) denied the appeal; "will not include the text of TIA No. 1892." | NFPA FD_D26_8 |
| 7e | TIAs 26-1 … 26-N | 26-1 to 26-12: R1 (not re-fetched). Oregon list seen this run. **26-13: not found** | See §7 table | Oregon Table 1-E; TIA_70_26_13 fetch error |
| 8 | A2028 PI submittals (reprint of final 2026 text) | **Not available** | `70_A2028_NEC_P02_PISubmittals.pdf` returned a fetch error. Probing stopped, per the brief | — |

---

## 1. Table 310.16 (2026) and CAM 70-105

### 1.1 CAM 70-105 outcome: VERIFIED
- **Source:** NFPA, "Confirmed Results of NFPA Membership Voting", 2025 Technical Meeting, posted 6/23/2025. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/2025_Technical_Meeting_Voting_Results.pdf. NFPA's own document; no notice captured.
- **Quotes:**
  - "NFPA 70 70-105 No Vote CAM NOT PURSUED."
  - "NFPA 70 70-87 319-184 CAM PASSED."
  - "NFPA 70 70-85 Standing Vote Only CAM PASSED."
  - "NFPA 70 70-107 Standing Vote Only CAM FAILED."
- **Mapping of motion numbers to sections.** The results file lists numbers only.
  - 70-105 = Table 310.16, "Reject SR 8481"; 70-87 = 120.13; 70-107 = 210.8(A). These come from R1's read of NITMAM_MC_Report_A2025.pdf (not re-fetched).
  - 70-85 = 210.8(D) is confirmed this run by the CMP-2 ballot memo (§4.3).
- **Effect:** no floor action removed the 8481 revision. The Second Draft content therefore went forward to issuance, unless the Correlating Committee or Standards Council changed it. No such change was seen.

### 1.2 Draft values (SD ballot): VERIFIED-draft
- **Source:** NFPA CMP-6 Second Draft final ballot, A2025 cycle (items labelled "NFPA 70-2024"). https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_BallotFinal.pdf. NFPA's own document.
- **Label caveat:** the extractor reports item 8481 as **"Committee Comment No. 8481-NFPA 70-2024"**, with response "CC-8481". The CAM (per R1) targeted "SR 8481". Whether 8481 is labelled SR in the final SD report is **UNVERIFIED** this run.
- **Ballot tallies:**
  - 8481: 20 eligible, 1 not returned, 12 affirmative + 3 affirmative with comments, **4 negative** (Deacy, Hunter, Stene, Watson), 0 abstain. **Passed.** `python3 -I`: 15/19 = 0.789.
  - SR-8602 (deletes the 18 AWG row): 13 + 6 affirmative, 0 negative. **Passed.**
- **Raw tokens as extracted, pull A (this run, SD ballot):**
  - 16 AWG: `"16*", "1", "10", "—152", "1820", "2", "—", "—", "—", "—"`
  - 14 AWG: `"14*", "1", "15", "20", "25", "10†", "2,3", "—152,3", "—202,3", "14†", "1"`
  - 18 AWG: `"18*", "—", "—", "14", "—", "—", "—", "—"`
- **Raw tokens, pull B** (independent NFPA document: CMP-6 SD working draft `70_A2025_NEC_P06_SD_PrelimSR.pdf`, from R1, 2026-10-19, not re-fetched; footnotes lettered a/b/c there):
  - 16 AWG: `16* a 10— 15c 18 20c — — — —`
  - 14 AWG: `14* a 15 20 25 10† bc — 15bc — 20bc 14† a`
- **Comparison.** Footnote map: a ↔ 1 (240.4(D)); c ↔ 2 (adjustment or correction only); b ↔ †3 (CCA only).
  - **All numeric values match** (16 AWG: 10, 15, 20 with 18 struck; 14 AWG: 15, 20, 25 Cu and 10, 15, 20 CCA).
  - **All footnote placements match.**
- **Data reading (draft):**

| Size | Cu 60 °C | Cu 75 °C | Cu 90 °C | Al/CCA 60 °C | Al/CCA 75 °C | Al/CCA 90 °C |
|---|---|---|---|---|---|---|
| 16 AWG (Cu) | 10 | 15 (note 2) | 20 (note 2); "18" struck | — | — | — |
| 14 AWG | 15 | 20 | 25 | 10 (marks †, 2, 3 as extracted) | 15 (2, 3) | 20 (2, 3) |

  - Whether footnote 2 ("adjustment or correction only") really applies to the **14 AWG CCA 60 °C "10"** is **UNVERIFIED.** Both drafts place it there, but the 16 AWG Cu 60 °C "10" carries no such mark, and the "†" may be struck SR-8602 residue.
- **Footnotes as extracted (SD ballot):**
  - "1. Section 310.15(B) shall be referenced for ampacity correction factors where the ambient" / "temperature is other than 30°C (86°F)."
  - "2. Section 310.15(C)(1) shall be referenced for more than three current-carrying conductors."
  - "3. Section 310.16 shall be referenced for conditions of use."
  - "4. Ampacity for 18 AWG copper Type MI and Type MTW shall be 14 amperes at 90°C (194°F)."
  - "5. Ampacity for 16 AWG copper Type MI and Type MTW shall be 18 amperes at 90°C (194°F)."
  - "1Section 240.4(D) shall be referenced for conductor overcurrent protection limitations," / "except as modified elsewhere in the code."
  - "2Ampacity shall be used for adjustment or correction only."
  - "†3Ampacity shall be applicable only to copper-clad aluminum conductors."
- **Committee statement (8481):** "The NEC now allows conductor sizes of 16 AWG copper and 14 AWG copper-clad aluminum;" / "therefore values were added to the ampacity table for making ampacity adjustments and corrections."
- **Status:**
  - Values and footnotes: **VERIFIED-draft**, with two independent NFPA pulls matching.
  - Final printed values: **UNVERIFIED**, because no final 2026 document was seen.
  - Corroboration (R2, class 4): IAEI Winter 2026 says the ampacities were added "in the 60 °C, 75 °C, and 90 °C temperature columns". That is consistent with 8481 being in the issued edition.
- **18 AWG row: CONFLICTING (draft).** SR-8602 deletes the row and creates Note 4. The 8481 display still prints an 18 row, which is probably struck text that was flattened.

---

## 2. Article 120 (2026)

- **2f. RV park and mobile-home sections (VERIFIED-other-edition 2026; government summary, numbers only).**
  - Source: Minnesota DLI, NEC 2026 Adoption Review Committee, "Summary of Significant 2026 NEC® Changes" (Attachment A to the 25 Sep and 28 Oct 2025 meetings). https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf. No NFPA notice.
  - Quote: "10 120.130 and 120.140 120 Branch-Circuit, Feeder, and Service Load Calculations. Part VIII and Part IX." / "Calculations for RV parks and Mobile and Manufactured Home Parks were relocated to Article 120 - Parts VIII, and IX."
  - Mapping by listed order: Part VIII / 120.130 = RV parks; Part IX / 120.140 = mobile and manufactured home parks. This agrees with the drafts:
    - R2 CMP-2 SD: "Part VIII provides calculation methods for recreational vehicle parks."
    - R2 CMP-7 SD: former 550.18 → 120.140 and 550.31 → 120.141 (Part IX).
  - Section numbers after 120.130 and 120.141 are **UNVERIFIED**.
- **Also seen (gov):**
  - MN line 9: "120.7 Power Control System (PCS). The energy management system (EMS) has now been renamed" / "Power Control Systems (PCS)."
  - MA 527 CMR amends **120.40**, adding Informational Note No. 3 on the Specialized Stretch Energy Code. That confirms 120.40 exists; its text was not seen.
- **120.41, 120.82, Table 120.55, 120.57, 120.84(C)(1): UNVERIFIED.**
  - No final-text document was found this run.
  - The A2028 PI file is not posted, and no state amendment reprints these sections: Oregon has no Article 120 amendments, MA amends only 120.40, and WA adopts by reference with no reprint.
  - R1 (not re-fetched) recorded the NITMAM report's only Article 120 CAM as 70-87 (120.13). The voting results confirm 70-87 passed the floor (319–184); its CMP-2 ratification ballot was **not seen**.
  - So no floor action touched 120.41, 120.82, 120.55, 120.57 or 120.84. The Second Draft text stands as the best evidence (A3: VERIFIED-draft for 120.83 and 120.84; UNVERIFIED for 120.41 and 120.82).

---

## 3. Table 310.12(A), 240.6(A), 240.4(D) (2026): UNVERIFIED

- Table 310.12(A):
  - The only final-edition evidence is MA 527 CMR (effective 4/24/26): "310.12. Delete the second paragraph." https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-42426/download
  - The label "Table 310.12(A)" remains **draft-only** (R2: FR-7943).
- 240.6(A):
  - Oregon Table 1-E amends only **240.6(D)**: "A circuit breaker(s) that can be adjusted remotely to modify the adjusting means shall be permitted to have an" / "ampere rating(s) that is equal to the adjusted current setting (long-time pickup setting)." This is 2026 text plus any Oregon amendment, flattened.
  - The MN significant-changes summary has no 240.6 entry (this run).
  - Status: no change seen; **UNVERIFIED**.
- 240.4(D): not in any document read this run. It remains **VERIFIED-draft** (A2: SR-8377).

---

## 4. 210.8(F) and 210.8(D) (2026)

### 4.1 210.8(F): threshold VERIFIED-other-edition (2026); wording CONFLICTING
**Source F1, NFPA proposed TIA 1924.** https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1924.pdf
- Details: Log 1924; editions "NFPA 70-2020, 2023, and 2026"; reference 210.8(F) Exception No. 2; comment closing **September 9, 2026**; submitter Thomas Deary, AHRI. NFPA's own document; no notice captured.
- Rule as reprinted (unchanged by the TIA):
  - "210.8(F) Outdoor Outlets. For dwellings, all outdoor outlets other than those covered in"
  - "210.8(A), Exception No. 1, including outdoor outlets installed at the following locations and"
  - "supplied by single-phase branch circuits rated 150 volts or less to ground, 60 amperes or less,"
  - "shall be GFCI protected:"
  - The locations list is elided ("…") in the TIA.
- Exception No. 2 (flattened): "GFCI protection shall not be required for listed HVAC equipment. This" / "exception shall expire September 1, 2026 September 1, 2028." Read as 2026 struck and 2028 inserted.
- Substantiation: "If Exception No. 2 is allowed to expire on September 1, 2026, and section 210.8(F) is enforced for…"

**Source F2, Oregon BCD, Table 1-E, OESC amendments to the 2026 NEC.** Effective October 1, 2026, OAR 918-305-0105. https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf
- Base edition per the document: "approved as an American National Standard on September 9, 2025". Strike and underline are flattened. No NFPA notice.
- Rule:
  - "210.8(F) Outdoor Receptacles Outlets. For dwellings, a outlets, other than those covered in 210.8(A), Exception No. 1,"
  - "including outlets installed in the following locations, and All outdoor general-purpose receptacles supplied by"
  - "singlephase branch circuits rated 150 volts or less to ground, 60 amperes or less, shall be provided with GFCI"
  - "protection.:"
- Locations: "(1) Garages that have floors located at or below grade level" / "(2) Accessory buildings" / "(3) Boathouses"
- Replacement: "If equipment supplied by an outlet covered under the requirements of this section is replaced, the outlet shall be" / "supplied with GFCI protection."
- Exceptions:
  - "Exception No. 1: GFCI protection shall not be required on lighting outlets other than those covered in 210.8(C)."
  - "Exception No. 2: GFCI protection shall not be required for listed HVAC equipment. This exception shall expire" / "September 1, 2026."
  - "Exception No. 3: Listed Class C SPGFCI protection shall be permitted for listed HVAC equipment. If a Class C" / "SPGFCI is provided, the disconnect serving the HVAC equipment shall be marked “Warning: Class C SPGFCI" / "Protection Provided for HVAC Unit.”"
- Informational Notes:
  - "Informational Note No. 1: See UL 943C, Outline of Investigation for Special Purpose Ground-Fault Circuit-Interrupters," / "for further information. SPGFCIs marked “HF” or “HF+” do not trip when the frequency weighted differential current is" / "less than the specified value for a Class C, Class D, or Class E SPGFCI."
  - "Informational Note No. 2: This requirement does not apply to specific-use receptacles that are regulated by other" / "sections in this code such as 551.71."

**Source F3, MN DLI summary, line 17 (government paraphrase).**
- "The amperage threshold has been increased from 50 amps to 60 amps for single-phase branch circuits" / "rated 150 volts or less to ground. New Exception No. 3 permits a listed Class C SPGFCI protection" / "for listed HVAC equipment. No expiration date was given."

**Source F4, Texas Register, Aug 28, 2026 issue.** Adopted Rules, TDLR, 16 TAC §73.100. Cited by TDLR as 51 TexReg 5776; proposal 51 TexReg 1785, Mar 20, 2026. Effective Sep 1, 2026. https://www.sos.texas.gov/texreg/archive/August282026/Adopted%20Rules/16.ECONOMIC%20REGULATION.html#170
- The preamble says the 2026 NEC "again includes the GFCI requirement of Section 210.8(F), with an exception, stating," / "Exception No. 2: GFCI protection shall not be required for listed HVAC equipment." / "This exception shall expire September 1, 2026."
- New subsection (b) "specifies that NFPA's 'Exception No. 2' is extended without expiration."
- Reason: "the compatibility issues that pose a risk for nuisance tripping and air conditioning outages have not yet been resolved."
- The operative §73.100 text was not in the extracted content.

**Corroboration (class 4):**
- EC&M, Michael Morris, "TIA Proposed To Extend Expiration Date of Sec. 210.8(F) Exception No. 2", Aug 19, 2026: Log 1924, proposed September 1, 2028; AHRI had asked for September 1, 2029. https://www.ecmweb.com/national-electrical-code/article/55399136/tia-proposed-to-extend-expiration-date-of-sec-2108f-exception-no-2
- ACCA statement, Sep 15, 2025: the Standards Council denied ACCA's two appeals, including "Extend the effective date to exempt GFCI protection for outdoor HVAC equipment under 210.8(F) to September 1, 2029." https://www.acca.org/news/release/acca-releases-statement-on-nfpa-standards-council-decision-on-nec-appeals

**Status:**
- **60 A**: VERIFIED-other-edition (2026). F1 is an NFPA reprint and F2 a government reprint; F3 agrees.
- Exception No. 2 text: VERIFIED-other-edition (2026). F2 and F4 agree; F1 is consistent.
- Exception No. 3 rule: VERIFIED-other-edition (F2 text + F3). Its **marking sentence** and the two Informational Notes rest on one flattened Oregon reprint (possible Oregon text). Wording: UNVERIFIED.
- Main-rule wording: **CONFLICTING** between F1 and F2 ("including outdoor outlets installed at" … "shall be GFCI protected" versus "including outlets installed in" … "shall be provided with GFCI protection").
- TIA 1924 outcome: **not issued as far as seen.** TIA_70_26_13.pdf returned a fetch error on 2026-10-20, as R1's fetch did on 2026-10-19.

### 4.2 210.8(D) (2026): limits and list VERIFIED-other-edition (2026)
- **Oregon Table 1-E (F2, flattened; Oregon inserted "for specific appliances … in accordance with 422.5"):**
  - "210.8(D) Specific Appliances. GFCI protection for specific appliances shall be provided in accordance with 422.5." / "for the branch circuit or outlet supplying the following appliances rated 150 volts or less to ground and 60" / "amperes or less, single- or 3-phase:"
  - The list, as printed in two columns: "(1) Automotive vacuum machines (7) Dishwashers" / "(2) Drinking water coolers and bottle fill stations (8) Electric ranges" / "(3) High-pressure spray washing machines (9) Wall-mounted ovens" / "(4) Tire inflation machines (10) Counter-mounted cooking units" / "(5) Vending machines (11) Clothes dryers" / "(6) Sump pumps (12) Microwave ovens"
- **MA 527 CMR:** "Exception to 8, 9, and 10: Permanently connected cooking equipment and cord-and-plug" / "connected stationary cooking equipment that is listed, but incompatible with GFCI protective" / "devices as made available by the manufacturer of the circuit protection currently installed, shall" / "be permitted to omit such protection provided it is installed and inspected in accordance with the" / "provisions of Rule 11 of this Code. This exception expire on January 1, 2029." Items 8–10 are the three cooking items, which is consistent with the list.
- **Status:**
  - 12-item list: both sources match 12/12 (the Oregon list and the 70-85 memo).
  - Limits "150 volts or less to ground and 60 amperes or less, single- or 3-phase": VERIFIED-other-edition (2026).
  - Exact base lead-in: UNVERIFIED (Oregon text is flattened). The likely base is "GFCI protection shall be provided for the branch circuit or outlet supplying the following appliances rated 150 volts or less to ground and 60 amperes or less, single- or 3-phase:", which is the text both the Oregon and CAM 70-85 versions share.

### 4.3 CAM 70-85 ratification ballot: VERIFIED
- **Source:** NFPA memo, Sarah Caldwell to CMP-2, July 15, 2025, ballot on amending motion 70-85. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_70-85_AmendBallotFinal.pdf
- Motion text ("agree" option): "GFCI protection shall be provided for the branch circuit or outlet supplying the following appliances rated" / "150 volts or less to ground and 60 amperes or less, single-phase or 100 amperes or less, 3-phase:" / "identified in 422.5." plus the same 12 items.
- Tally: 21 eligible, 0 not returned, **10 agree, 11 disagree**, 0 abstain. **Not ratified.** `python3 -I`: 2/3 of 21 = 14.0, and the memo uses 21 × 0.66 = 13.86, which rounds up to 14.
- **Caveat:** the extractor paraphrased the consequence as a recommendation "to return to the previous edition text".
  - Oregon's final 2026 reprint and the MA exception both show the Second Draft list, not the 2023 422.5(A) cross-reference.
  - The "previous text" therefore means the Second Draft text. That is inference; the exact memo sentence was not captured.

---

## 5. 110.14(C) (2026): UNVERIFIED

- No document read this run reprints 2026 110.14(C).
- Negative evidence only:
  - The MN DLI summary and the 28 Oct 2025 minutes have no 110.14 entry ("Not found … 110.14").
  - Oregon amends **110.14(D)**: "Tightening torque values for terminal connections shall be as indicated on equipment" / "or in installation instructions provided by the manufacturer."
  - MA replaces part of the first paragraph of 110.14 ("Connection by means of wire binding screws or studs and nuts having upturned lugs or equivalent").
- None of this shows whether (C) changed.

---

## 6. 230.85 (2026): deleted; emergency-disconnect function now in 230.70

- **MN DLI minutes, NEC 2026 Adoption Review Committee, Oct 28, 2025** (government): "Emergency disconnect requirement (230.85) moved to 230.70 and reclassified as a service disconnect." https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-102825-minutes.pdf
- **MN summary:**
  - Line 28: "28 230.70(A)(1) 230.70(A) Service Disconnect Location Section 230.70(A)(1), One- and Two-Family Dwellings," / "requires that the service disconnecting means be installed in a readily accessible outdoor location" / "either on the dwelling unit or within sight."
  - Line 29: "29 230.70(D) 230.70(D) Identification of Other Source Disconnects" / "Previously, this applied only to emergency disconnects. Now, all sources not located at the service disconnect" / "must be listed on a plaque or directory to show their location."
- **Oregon Table 1-E (2026):**
  - "230.70(A) Service Disconnect Location. Service disconnects shall be installed in accordance with 230.70(A)(1)" / "230.70(A)(2) and through 230.70(A)(3)."
  - "(1) One- and Two-Family Dwellings. Not adopted by the State of Oregon."
  - "(2) Other than One- and Two-Family Dwellings. Readily Accessible Location. Service disconnects shall be" / "installed in a readily accessible location either outside of a building or structure or inside nearest the" / "point of entrance of the service conductors."
  - "230.70(B) Service Disconnect Marking. Service disconnects shall be marked in accordance with 230.70(B)(1) and" / "230.70(B)(2)." and "230.70(B)(2) One- and Two-Family Dwellings. Not adopted by the State of Oregon."
  - "230.70(E) Replacement. Not adopted by the State of Oregon."
  - There is **no 230.85 row**. Oregon's 2023 table did list "230.85 Emergency Disconnects. Not adopted" (R1).
- **MA 527 CMR:**
  - Instruction: "230.70(A)(1) One- and Two-Family Dwellings. Revise as follows:"
  - MA's replacement ends "…Service disconnects shall be installed in a" / "readily accessible outdoor location in accordance with one of the following:"
  - 230.70(E): "Exception: If only meter sockets, service entrance conductors, service overcurrent protection main circuit" / "breakers, or related raceways and fittings are replaced, the requirements of 230.70(A)(l)" / "and 230.70(B)(2) shall not apply."
  - A full-text search for "230.85" returned **not found**.
- **Draft (R1, not re-fetched):** P10 FD minutes: "Section 230.85 has been deleted as the service disconnect is now required to be the emergency disconnect."
- **Status:** deletion and relocation are VERIFIED-other-edition (2026), from a government statement plus two state reprints that are consistent with it.
  - The final dwelling subsection is **230.70(A)(1)**. R1 wrote "(A)(2)", which is the draft numbering and is wrong for the final edition.
  - The national wording of 230.70(A)(1) was seen only as MA's amended replacement and MN's paraphrase. **Exact text: UNVERIFIED.**

---

## 7. 625.54 (2026), TIA 1892, and all TIAs against NFPA 70-2026

### 7.1 625.54 as issued
- **NFPA proposed TIA 1892** (NFPA 70-2026; reference 625.54; comment close May 20, 2026; submitter Bryce Nesbitt, EV Plugbox LLC). https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1892.pdf. No notice captured.
  - "1. Revise section 625.54 to read as follows:"
  - "625.54 Ground-Fault Circuit-Interrupter Protection for Personnel."
  - "Only All receptacles installed for the connection of electric vehicle charging EVSE and WPTE shall be required to" / "have ground-fault circuit-interrupter GFCI protection for personnel." (flattened)
  - Substantiation: "The technical information provided to the NFPA Standards Council that led to their decision identified a safety hazard for permanently wired EVSE where GFCI is required." It cites "Decision 25-2" / "SC D25-2".
- **Reading:**
  - The heading line carries no change marks, so the 2026 heading is the old one, not the draft's "GFCI and SPGFCI Protection". Status: **VERIFIED-other-edition (2026).**
  - The probable base body is "All receptacles installed for the connection of electric vehicle charging shall have ground-fault circuit-interrupter protection for personnel." It is **UNVERIFIED** because the text is flattened.
- **Conflict:** MN summary line 91 reads "625.54 GFCI and SPGFCI Protection Requirements were added for permanently wired equipment." / "The title and new requirements recognize SPGFCI protection."
  - That describes the pre-appeal draft. R1 (not re-fetched) read SC D#25-2: "will not include the text of Second Revision No. 7875, or any related First Revisions or First Correlating Revisions." https://docinfofiles.nfpa.org/files/AboutTheCodes/70/FD_D25_2_SC_25_8_6_d_1_d_3_NFPA_70.pdf
  - Mike Holt forum (class 4, Sep 27, 2025): "625.54(B) has been removed from the 2026 NEC."
- Oregon: "625.54 … Not adopted by the State of Oregon."

### 7.2 TIA 1892: VERIFIED not issued
- **Source:** NFPA Standards Council Final Decision **D#26-8**, agenda item SC#26-8-44-d, dated 20 Aug 2026; letter of 2 Sep 2026. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/FD_D26_8_SC26_8_44_d_TIA_1892_NFPA_70.pdf
- Quotes:
  - "The Standards Council voted to deny the appeal to overturn the Code-Making Panel 12 ballot results" / "and thereby issue Tentative Interim Amendment No. 1892." / "The effect of this action is that NFPA 70®, National Electrical Code®" / "will not include the text of TIA No. 1892."
  - "a task group established at the direction of the Standards Council in Decision D#25-2 (issued August of 2025)."
- Votes: CMP-12 did not reach three-fourths on technical merit or emergency nature. The Correlating Committee supported the TIA on correlation. The appeal was filed by Anthony Solino, Martin County Building Department.

### 7.3 TIAs issued against NFPA 70-2026
| TIA | Section | Issue / effective | Evidence |
|---|---|---|---|
| 26-1 | 680.21(C) | Apr 10 2025 / Apr 30 2025 | R1 (TIA_70_26_1.pdf). Oregon lists "TIA 26-1 (680.21)" (this run) |
| 26-2 | 690.12(C) | Aug 20 2025 / Sep 9 2025 | R1. Oregon "26-2 (690.12)" |
| 26-3 | 430.132 (new) | Aug 20 2025 / Sep 9 2025 | R1. Oregon "26-3 (430.132)" |
| 26-4 | 500.30, 505.30 (Oregon) | **not seen** | Oregon only; TIA not read |
| 26-5 | 501.15 (Oregon) | **not seen** | Oregon only; TIA not read |
| 26-6 | 505.30(A) | Aug 20 2025 / Sep 9 2025 | R1 only (Oregon does not list 26-6) |
| 26-7 | 506.30(A) | Aug 20 2025 / Sep 9 2025 | R1. Oregon "26-7 (506.30)" |
| 26-8 | 270.50 | Apr 15 2026 / May 5 2026 | R1 only (Oregon does not list 26-8). File exists (search hit this run) |
| 26-9 | Table 501.10(A)(1) (R1) vs "Table 510.10(A)(1)" (Oregon extraction) | Aug 20 2026 / Sep 9 2026 | **CONFLICTING table number**, probably a typo |
| 26-10 | 700.6(C) | Aug 20 2026 / Sep 9 2026 | R1. Matches proposed TIA 1903 (EC&M, Jun 25 2026) |
| 26-11 | 624.44(A) | Aug 20 2026 / Sep 9 2026 | R1. Matches proposed TIA 1912 |
| 26-12 | Tables 270.122(B)(1)–(3) headings | Aug 20 2026 / Sep 9 2026 | R1. Matches proposed TIA 1915 |
| 26-13 | — | — | **Not found**: fetch error 2026-10-20 (also 2026-10-19 in R1) |

- None touches Table 310.16, 240.4(D), 240.6, 310.12, 110.14, 210.8, 230.70, 625.54 or Article 120 (R1, plus Oregon's list this run).
- Proposed but not issued: 1892 (625.54, denied), 1924 (210.8(F) Ex. 2, pending), 1949 (modular data centers per an EC&M headline; section not seen).
- MA 527 CMR adopts only the TIAs "adopted by the NFPA Standards Council at its August 2025 meeting".
- **Errata:**
  - Errata_70_26_1.pdf exists (search hit); content **not read**.
  - HFM (class 4, Nov 17, 2025): "Erratum No. 70-26-4 has been issued for NFPA 70, National Electrical Code," / "to include Table 430.22(H) Conductor Short Circuit Factors in the 2026 edition," / "which was inadvertently omitted from the print copy". No erratum touching a target was seen.

### 7.4 Adoption side notes (government, this run)
- WA L&I, WSR 25-23-069 (permanent rule, filed Nov 18, 2025): adopts the 2026 NFPA 70 "in its entirety by reference", with a delayed effective date of **December 31, 2026** (WAC 296-46B-010(1)). There are no NEC 2026 section amendments in this filing. https://lawfilesext.leg.wa.gov/law/wsrpdf/2025/23/25-23-069.pdf
- Oregon Table 1-E: effective Oct 1, 2026. MA 527 CMR: permits after Apr 24, 2026. Texas: Sep 1, 2026.

---

## Machine-readable

```json
{"ref":"CAM 70-105 (Table 310.16, Reject SR 8481)","edition":"NFPA 70-2026 (A2025 cycle), 2025 Technical Meeting","status":"VERIFIED","values":{"outcome":"No Vote - CAM NOT PURSUED","other_cams":{"70-87 (120.13)":"PASSED 319-184 on floor; TC ballot not seen","70-85 (210.8(D))":"PASSED standing vote on floor; CMP-2 ratification FAILED 10-11 of 21 (14 needed)","70-107 (210.8(A))":"FAILED standing vote"},"section_mapping_source":"70-105/70-87/70-107 per R1 read of NITMAM_MC_Report_A2025.pdf (not re-fetched); 70-85 confirmed by CMP-2 ballot memo"},"quote_segments":["NFPA 70 70-105 No Vote CAM NOT PURSUED.","NFPA 70 70-87 319-184 CAM PASSED.","NFPA 70 70-85 Standing Vote Only CAM PASSED.","NFPA 70 70-107 Standing Vote Only CAM FAILED."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/2025_Technical_Meeting_Voting_Results.pdf","source_title":"Confirmed Results of NFPA Membership Voting (posted 6/23/2025)","permission_notice":"NFPA's own document; none captured","retrieved":"2026-10-20"}
```

```json
{"ref":"Table 310.16 (2026) rows 16 AWG Cu and 14 AWG CCA","edition":"NFPA 70-2026 Second Draft (CMP-6 SD final ballot; item 8481 labelled 'Committee Comment No. 8481-NFPA 70-2024')","status":"VERIFIED-draft","status_final":"UNVERIFIED (no final 2026 document seen)","values":{"columns":["cu60","cu75","cu90","al60","al75","al90"],"rows":[{"size":"16","cu60":10,"cu75":15,"cu90":20,"al60":null,"al75":null,"al90":null,"notes":"cu75 and cu90 carry footnote 2 (adjustment or correction only); 2023 cu90 value 18 struck and moved to Note 5 for Type MI/MTW"},{"size":"14","cu60":15,"cu75":20,"cu90":25,"al60":10,"al75":15,"al90":20,"notes":"Al/CCA cells carry footnote 3 (CCA only) and footnote 2 (adjustment or correction only) as extracted; footnote 2 on al60 '10' UNVERIFIED"}],"row_18_awg":"CONFLICTING: SR-8602 (passed 19-0) deletes it; 8481 display still prints '18*, -, -, 14, -, -, -, -'","ballot_8481":{"eligible":20,"not_returned":1,"affirmative":15,"negative":4,"abstain":0,"result":"passed"},"ballot_sr8602":{"affirmative":19,"negative":0,"result":"passed"},"pull_comparison":"SD ballot raw tokens vs R1 SD working-draft raw tokens: all numeric values and footnote placements match (a=1, c=2, b=dagger3)","raw_pull_A":{"16":["16*","1","10","—152","1820","2","—","—","—","—"],"14":["14*","1","15","20","25","10†","2,3","—152,3","—202,3","14†","1"]},"raw_pull_B_R1":{"16":"16* a 10— 15c 18 20c — — — —","14":"14* a 15 20 25 10† bc — 15bc — 20bc 14† a"}},"quote_segments":["4. Ampacity for 18 AWG copper Type MI and Type MTW shall be 14 amperes at 90°C (194°F).","5. Ampacity for 16 AWG copper Type MI and Type MTW shall be 18 amperes at 90°C (194°F).","1Section 240.4(D) shall be referenced for conductor overcurrent protection limitations,","except as modified elsewhere in the code.","2Ampacity shall be used for adjustment or correction only.","†3Ampacity shall be applicable only to copper-clad aluminum conductors.","The NEC now allows conductor sizes of 16 AWG copper and 14 AWG copper-clad aluminum;","therefore values were added to the ampacity table for making ampacity adjustments and corrections."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_BallotFinal.pdf","permission_notice":"NFPA's own document; none captured","corroboration":"IAEI Winter 2026 (R2, class 4): ampacities added in the 60, 75 and 90 degC columns","retrieved":"2026-10-20"}
```

```json
{"ref":"210.8(F)","edition":"NFPA 70-2026","status":"VERIFIED-other-edition (2026) for threshold and Exception No. 2; Exception No. 3 rule VERIFIED-other-edition (Oregon reprint + MN summary); main-rule wording CONFLICTING","values":{"max_volts_to_ground":150,"max_amperes":60,"max_amperes_2023":50,"phase":"single-phase","locations":["Garages that have floors located at or below grade level","Accessory buildings","Boathouses"],"exception_1":"lighting outlets other than those covered in 210.8(C)","exception_2":{"text":"GFCI protection shall not be required for listed HVAC equipment. This exception shall expire September 1, 2026.","expires":"2026-09-01"},"exception_3":{"rule":"Listed Class C SPGFCI protection permitted for listed HVAC equipment (no expiry)","marking_as_reprinted_by_Oregon":"Warning: Class C SPGFCI Protection Provided for HVAC Unit.","marking_status":"single flattened government reprint; wording UNVERIFIED"},"tia_1924":{"proposal":"extend Exception No. 2 to September 1, 2028","comment_close":"2026-09-09","status":"not issued as far as seen (no TIA_70_26_13 on 2026-10-20)"},"texas":"16 TAC 73.100(b): Exception No. 2 extended without expiration, effective 2026-09-01","wording_variants":{"nfpa_tia_1924_reprint":"For dwellings, all outdoor outlets other than those covered in 210.8(A), Exception No. 1, including outdoor outlets installed at the following locations and supplied by single-phase branch circuits rated 150 volts or less to ground, 60 amperes or less, shall be GFCI protected:","oregon_reprint_flattened":"For dwellings, a outlets, other than those covered in 210.8(A), Exception No. 1, including outlets installed in the following locations, and All outdoor general-purpose receptacles supplied by singlephase branch circuits rated 150 volts or less to ground, 60 amperes or less, shall be provided with GFCI protection.:"}},"quote_segments":["210.8(F) Outdoor Outlets. For dwellings, all outdoor outlets other than those covered in","210.8(A), Exception No. 1, including outdoor outlets installed at the following locations and","supplied by single-phase branch circuits rated 150 volts or less to ground, 60 amperes or less,","shall be GFCI protected:","Exception No. 2: GFCI protection shall not be required for listed HVAC equipment.","This exception shall expire September 1, 2026.","Exception No. 3: Listed Class C SPGFCI protection shall be permitted for listed HVAC equipment.","The amperage threshold has been increased from 50 amps to 60 amps for single-phase branch circuits"],"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1924.pdf","https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf","https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf","https://www.sos.texas.gov/texreg/archive/August282026/Adopted%20Rules/16.ECONOMIC%20REGULATION.html#170"],"permission_notice":"none on any source (NFPA own document; government documents)","retrieved":"2026-10-20"}
```

```json
{"ref":"210.8(D)","edition":"NFPA 70-2026","status":"VERIFIED-other-edition (2026) for limits and 12-item list; exact lead-in UNVERIFIED","values":{"max_volts_to_ground":150,"max_amperes":60,"phases":"single- or 3-phase","appliances":["Automotive vacuum machines","Drinking water coolers and bottle fill stations","High-pressure spray washing machines","Tire inflation machines","Vending machines","Sump pumps","Dishwashers","Electric ranges","Wall-mounted ovens","Counter-mounted cooking units","Clothes dryers","Microwave ovens"],"list_match":"Oregon reprint vs CMP-2 70-85 ballot memo: 12/12 identical, same order","cam_70_85":{"proposed":"60 A single-phase or 100 A 3-phase; 'identified in 422.5'","floor":"passed (standing vote)","cmp2_ballot":{"eligible":21,"agree":10,"disagree":11,"abstain":0,"needed":14,"result":"not ratified"}},"massachusetts":"Exception to items 8, 9 and 10 (listed cooking equipment incompatible with GFCI), expires 2029-01-01"},"quote_segments":["for the branch circuit or outlet supplying the following appliances rated 150 volts or less to ground and 60","amperes or less, single- or 3-phase:","GFCI protection shall be provided for the branch circuit or outlet supplying the following appliances rated","150 volts or less to ground and 60 amperes or less, single-phase or 100 amperes or less, 3-phase:","Exception to 8, 9, and 10: Permanently connected cooking equipment and cord-and-plug"],"source_url":["https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_70-85_AmendBallotFinal.pdf","https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-42426/download"],"permission_notice":"none","retrieved":"2026-10-20"}
```

```json
{"ref":"230.85 / 230.70 (2026)","edition":"NFPA 70-2026","status":"VERIFIED-other-edition (2026) for deletion and relocation (government statement + two state reprints); exact 230.70(A)(1) wording UNVERIFIED","values":{"230_85":"deleted; moved to 230.70 and reclassified as a service disconnect","dwelling_rule":"230.70(A)(1) One- and Two-Family Dwellings: service disconnecting means in a readily accessible outdoor location, on the dwelling unit or within sight","other_occupancies":"230.70(A)(2)","marking":"230.70(B)(2) One- and Two-Family Dwellings","replacement":"230.70(E) Replacement","other_source_directory":"230.70(D) Identification of Other Source Disconnects","r1_numbering_correction":"R1 cited 230.70(A)(2) for dwellings (draft numbering); final is 230.70(A)(1)"},"quote_segments":["Emergency disconnect requirement (230.85) moved to 230.70 and reclassified as a service disconnect.","Section 230.70(A)(1), One- and Two-Family Dwellings,","requires that the service disconnecting means be installed in a readily accessible outdoor location","either on the dwelling unit or within sight.","230.70(E) Replacement. Not adopted by the State of Oregon."],"source_url":["https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-102825-minutes.pdf","https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf","https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf","https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-42426/download"],"permission_notice":"none","retrieved":"2026-10-20"}
```

```json
{"ref":"625.54 (2026) and TIA 1892","edition":"NFPA 70-2026","status":"heading VERIFIED-other-edition (2026); body UNVERIFIED (flattened); TIA 1892 not issued VERIFIED","values":{"heading":"625.54 Ground-Fault Circuit-Interrupter Protection for Personnel.","probable_body":"All receptacles installed for the connection of electric vehicle charging shall have ground-fault circuit-interrupter protection for personnel.","permanently_wired_spgfci_text":"not in 2026 (SC D#25-2 removed SR 7875; R1, not re-fetched)","mn_summary_conflict":"MN line 91 describes pre-appeal draft ('GFCI and SPGFCI Protection', permanently wired equipment)","tia_1892":{"decision":"D#26-8","date":"2026-08-20","result":"appeal denied; TIA not issued"}},"quote_segments":["625.54 Ground-Fault Circuit-Interrupter Protection for Personnel.","Only All receptacles installed for the connection of electric vehicle charging EVSE and WPTE shall be required to","have ground-fault circuit-interrupter GFCI protection for personnel.","The Standards Council voted to deny the appeal to overturn the Code-Making Panel 12 ballot results","and thereby issue Tentative Interim Amendment No. 1892.","will not include the text of TIA No. 1892."],"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1892.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/FD_D26_8_SC26_8_44_d_TIA_1892_NFPA_70.pdf"],"permission_notice":"NFPA's own documents; none captured","retrieved":"2026-10-20"}
```

```json
{"ref":"TIAs to NFPA 70-2026","edition":"NFPA 70-2026","status":"26-1..26-12 per R1 (2026-10-19, not re-fetched); Oregon list seen this run; 26-13 not found this run","values":[{"tia":"26-1","section":"680.21(C)","issued":"2025-04-10","effective":"2025-04-30"},{"tia":"26-2","section":"690.12(C)","issued":"2025-08-20","effective":"2025-09-09"},{"tia":"26-3","section":"430.132 (new)","issued":"2025-08-20","effective":"2025-09-09"},{"tia":"26-4","section":"500.30, 505.30 (Oregon list)","issued":null,"effective":null},{"tia":"26-5","section":"501.15 (Oregon list)","issued":null,"effective":null},{"tia":"26-6","section":"505.30(A)","issued":"2025-08-20","effective":"2025-09-09"},{"tia":"26-7","section":"506.30(A)","issued":"2025-08-20","effective":"2025-09-09"},{"tia":"26-8","section":"270.50","issued":"2026-04-15","effective":"2026-05-05"},{"tia":"26-9","section":"Table 501.10(A)(1) (R1) / 'Table 510.10(A)(1)' (Oregon extraction) - CONFLICTING","issued":"2026-08-20","effective":"2026-09-09"},{"tia":"26-10","section":"700.6(C)","issued":"2026-08-20","effective":"2026-09-09"},{"tia":"26-11","section":"624.44(A)","issued":"2026-08-20","effective":"2026-09-09"},{"tia":"26-12","section":"Tables 270.122(B)(1)-(3) headings","issued":"2026-08-20","effective":"2026-09-09"},{"tia":"26-13","section":null,"issued":null,"effective":null,"note":"TIA_70_26_13.pdf fetch error 2026-10-20"}],"quote_segments":["TIA 26-1 (680.21)","TIA 26-2 (690.12)","TIA 26-3 (430.132)","TIA 26-4 (500.30, 505.30)","TIA 26-5 (501.15)","TIA 26-7 (506.30)","TIA No. 26-9 (Table 510.10(A)(1))"],"source_url":["https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_26_13.pdf"],"permission_notice":"none (government document)","retrieved":"2026-10-20"}
```

```json
{"ref":"Article 120 (2026) targets","edition":"NFPA 70-2026","status":"Part VIII/IX numbers VERIFIED-other-edition (2026, government summary); all other targets UNVERIFIED","values":{"part_VIII":{"topic":"RV parks","first_section":"120.130"},"part_IX":{"topic":"Mobile and manufactured home parks","first_section":"120.140"},"120.7":"Power Control System (PCS), EMS renamed (MN summary)","120.40":"exists (MA adds Informational Note No. 3)","120.41_2VA_ft2":"UNVERIFIED","120.82_first_8kVA_and_EVSE":"UNVERIFIED","Table_120.55":"UNVERIFIED (no change seen)","120.57_wording":"UNVERIFIED","120.84C1":"UNVERIFIED","120.13_CAM_70-87":"floor passed 319-184; CMP-2 ratification not seen"},"quote_segments":["10 120.130 and 120.140 120 Branch-Circuit, Feeder, and Service Load Calculations. Part VIII and Part IX.","Calculations for RV parks and Mobile and Manufactured Home Parks were relocated to Article 120 - Parts VIII, and IX."],"source_url":"https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-change-summary.pdf","permission_notice":"none","retrieved":"2026-10-20"}
```

```json
{"ref":"Table 310.12(A), 240.6(A), 240.4(D), 110.14(C) (2026)","edition":"NFPA 70-2026","status":"UNVERIFIED","values":{"table_310_12A":"label and values not seen; MA deletes second paragraph of 310.12","240_6A":"no change seen; Oregon amends only 240.6(D); MN summary lists no 240.6 change","240_4D":"final wording not seen (remains VERIFIED-draft via SR-8377, A2)","110_14C":"not reprinted anywhere; MN summary lists no 110.14 change; Oregon amends 110.14(D) only; MA amends 110.14 first paragraph only"},"quote_segments":["310.12. Delete the second paragraph.","A circuit breaker(s) that can be adjusted remotely to modify the adjusting means shall be permitted to have an","Tightening torque values for terminal connections shall be as indicated on equipment"],"source_url":["https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-42426/download","https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf"],"permission_notice":"none","retrieved":"2026-10-20"}
```

---

## Blocked or failed log

| Host / URL | What happened |
|---|---|
| docinfofiles.nfpa.org | **8 of 8 used, no 429.** OK: FD_D26_8 (TIA 1892 decision); NFPA_70_Proposed_TIA_1892; 2025_Technical_Meeting_Voting_Results (in /70/); NFPA_70_Proposed_TIA_1924; 70_A2025_NEC_P02_70-85_AmendBallotFinal; 70_A2025_NEC_P06_SD_BallotFinal. **Fetch errors:** 70_A2028_NEC_P02_PISubmittals.pdf (probably not posted; probing stopped, per the brief) and TIA_70_26_13.pdf |
| WebSearch | 19 performed. The 20th (site:docinfofiles "2025 Technical Meeting Voting Results") was refused: **session-wide search budget used up** |
| Eaton/Bussmann 2026 code-change brochure | Not found by search |
| Leviton 2026 Captain Code brochure | The leviton.com Captain Code page lists 2014–2023 only. captaincode2026 is robots-blocked (R2) and was not retried |
| IAEI "reprinted with permission" 2026 articles | None found by search |
| 2026 NEC Handbook errata (other than Table 120.54) | None found by search; NFPA cap prevented probing |
| Errata_70_26_1.pdf | Exists (search hit). Not read (NFPA cap) |
| Texas Register Aug 28 2026 | Page is 122K characters. The first 100K held the §73.100 preamble but not the operative rule text; the offset-100000 read held other rules |
| WA WSR 25-23-069 | Adopts the 2026 NEC by reference; no section text |
| MN DLI node/7911, Review Summer 2026 | No target content |
| HFM weekly updates (3 pages) | Only Erratum 70-26-4; no TIA list |
| goodreads NFPA blog post | The 2022 meeting, not 2025 (wasted fetch) |

## Open gaps

1. **Final printed Table 310.16 (2026)** rows for 16 AWG Cu and 14 AWG CCA. Only Second Draft values exist (two NFPA drafts that match). Also open:
   - whether the 18 AWG row survives;
   - whether footnote 2 sits on the 14 AWG CCA 60 °C "10" cell;
   - whether 8481 is labelled SR or CC in the SD report.
2. **Article 120 final text:** 120.41, 120.82 (8 kVA, EVSE item), Table 120.55, 120.57 wording, 120.84(C)(1). Also the CMP-2 ratification of CAM 70-87 (120.13): try 70_A2025_NEC_P02_70-87_AmendBallotFinal.pdf.
3. **Table 310.12(A) label and values, 240.6(A), 240.4(D) final wording, 110.14(C):** no final-text source.
4. **A2028 (2029 NEC) Public Input files** were not posted on 2026-10-20. Re-probe P02, P06 and P10 later; they will reprint the final 2026 text for gaps 1–3.
5. **210.8(F) wording:** NFPA TIA 1924 and Oregon reprints differ. The Exception No. 3 marking sentence and the Informational Notes rest on one flattened reprint.
6. **TIA 1924 outcome** (Exception No. 2 to Sep 1, 2028): watch for TIA_70_26_13.
7. **625.54 body wording:** flattened in both TIA 1892 documents. Re-reading SC D#25-2 in this run was not possible.
8. **TIAs 26-4 and 26-5** (issue and effective dates), and the 26-9 table number (501 vs 510).
9. **Errata 70-26-1 to 70-26-3** and any later errata: not read.
10. **230.70(A)(1) exact national wording:** seen only as MA's amended text and MN's paraphrase.
