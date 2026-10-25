# R3-1: core sizing rules (110.14(C), 334.80/340.80, 210.19/210.20/215/230.42, voltage-drop notes, 310.15(E)/(F), 250.122, 625, 110.15, 240.4(D)/240.6(A))

Agent R3-1, wiresizes.com primary sourcing, round 3. **Retrieval date for every item: 2026-10-20.** Target edition: NFPA 70-2023.

**Budget used**
- WebSearch: 12 of 25. A 13th search was refused because the session-wide search budget was exhausted. Everything after that came from fetches of known or pattern-built URLs.
- docinfofiles.nfpa.org: **8 of 8, no HTTP 429.**
  1. P10 PISubmittals, data pull.
  2. P10 PISubmittals, verbatim pull.
  3. P10 FD PrelimFR, data pull.
  4. P10 FD PrelimFR, raw pull.
  5. P02 FD PrelimFR, refused verbatim.
  6. P02 FD PrelimFR, short excerpts.
  7. P12 SD PrelimSR.
  8. P01 SD PrelimSR.
- Other hosts: about 25 fetches.

**Status rules used (same convention as round 2)**
- Public Inputs (PIs) in the A2025 cycle are titled "Public Input No. … -NFPA 70-2023", so their base text is NFPA 70-2023.
- First Draft (FD) documents show 2023 base text with First Revisions (FRs) applied. Strike-through and underline are flattened.
- An FD or PI excerpt counts as **VERIFIED-2023** only when both of these hold:
  - it shows no merged struck and inserted words;
  - the FR's or PI's own statement confines the change to other words.
- Second Draft (SD) documents use the First Draft as their base, so SD text is **VERIFIED-draft** only.
- No document reached in this run carries an NFPA reprint notice; all tier-1 items are NFPA's own documents.

---

## Status matrix

| # | Ref (2023 numbering as seen) | Status | Best source | Key values seen |
|---|---|---|---|---|
| 1a | 110.14(C)(1)(a), (C)(1)(b), (C)(2): 2023 text | **UNVERIFIED** (still tier 4 only; nothing new reached) | none in tiers 1–3 | — |
| 1b | 110.14(C): 2026 change? | **No Second Revision touches 110.14(C)** (VERIFIED-draft, negative finding). The 2026 FD stage is still not established | NFPA CMP-1 SD working draft (whole of Art. 110 visible) | 2026 SRs on 110.14 touch only the intro paragraph (SR-7644) and (D) (SR-7618) |
| 1c | 110.14(A), Massachusetts | VERIFIED-2023 (**MA only**) | 527 CMR 12.00 | wire-binding screws allowed for 10 AWG or smaller solid or Class B stranded conductors |
| 2a | 334.80: NEC 2023 base text | **UNVERIFIED** | none in tiers 1–3 | — |
| 2b | 334.80, **Washington deviation** | **VERIFIED (WA only; WA adopts NFPA 70-2023)** | WAC 296-46B-334(8) | NM-B: 10 AWG and smaller at 60 °C; **larger than 10 AWG at 75 °C**; 90 °C for adjustment and correction; bundling and insulation rules (f) and (g) |
| 2c | 334.80, Massachusetts deviation | VERIFIED-2023 (MA only; re-confirmed) | 527 CMR 12.00 | 90 °C conductors; 60 °C ampacity in thermal insulation |
| 2d | 340.80 (UF) | **UNVERIFIED** | none | — |
| 3a | 210.19(A) lead-in, (A)(1), (A)(2), "Exception to (1)", "Exception to (1) and (2)" | **VERIFIED-2023** (exact excerpts; middle words of (1) and (2) not seen) | NFPA CMP-2 FD, FR-8210 (statement limits the change to the OCPD term) | 125 percent; "in accordance with 310.14" (item 1); "in accordance with 310.15" (item 2); exception labels as printed |
| 3b | 210.19 grounded-conductor exception | UNVERIFIED (not shown in FR-8210) | — | — |
| 3c | 210.19 household ranges (8¾ kW, 40 A) and its item number | **UNVERIFIED** | none | — |
| 3d | 210.20(A) main rule | **VERIFIED-2023** (excerpts) | FR-8210 | "…noncontinuous load plus 125 percent of the continuous load." |
| 3e | 210.20(A) Exception | VERIFIED-draft (round 2; merged redline) | FR-8210 | 100 percent-listed assembly |
| 3f | **215.2(A), (A)(1), Exceptions No. 1–3, (A)(2)** | **VERIFIED-2023** | NFPA CMP-10 PI compilation, PI 1824. PI 472 matches the overlapping text | 125 percent; 100 percent-listed assembly; separately installed pressure connections; grounded conductor at 100 percent |
| 3g | 215.2 heading; 2026 renumbering | Heading "Minimum Rating and Size." VERIFIED-2023. **2026 FD: 215.2 → 215.4 and 215.3 → 215.5** (VERIFIED-draft) | CMP-10 FD, FR-8995 | — |
| 3h | **215.3** continuous-load sentence and Exception | **VERIFIED-2023**. First sentence: VERIFIED-draft (merged) | CMP-10 FD, FR-9001 (2 pulls match) | 125 percent; 100 percent-listed assembly |
| 3i | **230.42(A)** intro, (A)(1) and Exception No. 1 | **VERIFIED-2023** (sentence 3 of the intro is merged, so VERIFIED-draft) | CMP-10 FD, FR-9117 and FR-9119 (2 pulls match) | "largest of 230.42(A)(1) or (A)(2)"; 125 percent; grounded conductor at 100 percent |
| 3j | 230.42(A)(1) Exception No. 2 | **CONFLICTING** (the 2 pulls differ; merged redline) | FR-9119 | 100 percent (listed OCPD and assembly) |
| 3k | 230.42(A)(2) | UNVERIFIED (not shown) | — | — |
| 4a | **215.2(A) voltage-drop note: Informational Note No. 2** | **VERIFIED-2023** (single PI, single pull) | PI 1824 | 3 percent feeder; 5 percent total; "will provide reasonable efficiency of operation" |
| 4b | 215.2(A) Informational Note No. 3 (cross-reference) | VERIFIED-2023 | PI 1824 | "See 210.19, Informational Note for voltage drop for branch circuits." |
| 4c | 210.19 voltage-drop note: wording and number | **UNVERIFIED** | — | Only the 215.2 cross-reference above shows that one exists |
| 5a | 310.15(E), 2023 wording | UNVERIFIED | — | 2026: "new list format" (MN government summary, VERIFIED-other-edition 2026, summary only) |
| 5b | 310.15(F) | UNVERIFIED | — | — |
| 6a | 250.122(A), including "need not be larger than circuit conductors" | UNVERIFIED (that sentence was not seen anywhere) | NFPA 2020 fact sheet (paraphrase, other edition) | EGC sized from the OCPD rating or setting |
| 6b | 250.122(B) | UNVERIFIED for 2023. **VERIFIED-other-edition (2020, NFPA paraphrase)** | NFPA "Using the Tables in Article 250", June 2020 | proportional increase except for temperature correction or number of conductors; worked ratio 1.4 |
| 7a | 625.41 | **UNVERIFIED for 2023.** 2026 SD: no Second Revision (VERIFIED-draft, negative) | CMP-12 SD | — |
| 7b | 625.17(A) cord lengths | **VERIFIED-draft** (values only; merged 2026 redline). 2023: UNVERIFIED | CMP-12 SD, SR-7856 | 300 mm (12 in.); 1.8 m (6 ft); 4.6 m (15 ft); 7.5 m (25 ft) overall |
| 7c | 625.50 location and heights | **UNVERIFIED.** 2026 SD: no Second Revision | — | — |
| 7d | 627.41(B) (2026; electric self-propelled vehicles; to be renumbered 624) | VERIFIED-draft | CMP-12 SD, SR-7908 | "…plus 125 percent of the continuous loads." |
| 8 | 110.15 high-leg marking | 2023: **UNVERIFIED.** 2026: **VERIFIED-draft** (SR-7619, merged) | CMP-1 SD | 4-wire delta; midpoint of one phase winding grounded; higher phase voltage to ground; **orange**; exception deleted in 2026 |
| 9a | 240.4(D)(4)–(D)(8), 2023 | Unchanged from round 2: VERIFIED-draft; 2023 UNVERIFIED (the CMP-10 PI and FD windows end before Art. 240) | — | — |
| 9b | 240.6(A) fuse-only sentence | **CONFLICTING** (unchanged from round 2; no second 2023 source reached) | — | — |

---

## Sources (tier; title; publisher; edition and date; URL; notice)

**Tier 1: NFPA's own documents** (no reprint notice; NFPA's own text)

- **P10PI.** NFPA Public Input compilation for NEC CMP-10, revision cycle A2025.
  - Running header: "National Fire Protection Association Report".
  - Every PI is titled "…-NFPA 70-2023", so the base text is NFPA 70-2023.
  - 504 pages ("40 of 504"). Text visible to p. 40, ending mid-PI 472 (215.2(A)(1) Exception No. 2).
  - In this cycle CMP-10 owns Article 215 and the service and feeder definitions.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_PISubmittals.pdf
- **P10FD.** "Working Draft of NEC Code-Making Panel 10 Meeting Output", revision cycle A2025.
  - Meeting Jan 24–26, 2024; printed 2/12/24 9:02 AM; 113 pages.
  - Visible to p. 56, ending at "(2) Dorm" in 230.67(A).
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_FD_PrelimFR.pdf
- **P02FD.** "WORKING DRAFT OF NEC CODE-MAKING PANEL 2 MEETING OUTPUT", A2025 First Draft (the same file round 2 called N2).
  - Contains FR-8210-NFPA 70-2024 [Global Input].
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf
- **P12SD.** "Working Draft of NEC Code-Making Panel 12 Meeting Output (Second Draft Meeting, October 2024)", A2025. Marked as not final.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf
- **P01SD.** "Working Draft of NEC Code-Making Panel 1 Meeting Output", A2025, October 2024, Comment Stage.
  - Visible text runs through Annex A Table A.2 (Article 315 row), so every Article 110 Second Revision is in view.
  - https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_SD_PrelimSR.pdf
- **NFPAFS.** NFPA, "GROUNDING AND BONDING / Using the Tables in Article 250 of the NEC®". "© 2020 National Fire Protection Association / June 2020". No edition year named; 2020 NEC era.
  - Hosted by the City of Salinas: https://www.salinas.gov/files/sharedassets/city/v/1/fire-department/documents/grounding-bonding-fact-sheet.pdf
  - Disclaimer (segments): "This material is not the official position of any NFPA Technical Committee on any referenced topic" / "which is represented solely by the NFPA documents on such topic in their entirety."

**Tier 3: government documents**

- **WA334.** WAC 296-46B-334, "Nonmetallic-sheathed cable", Washington State Legislature. History: "WSR 25-23-069, s 296-46B-334, filed 11/18/25, effective 12/19/25". http://app.leg.wa.gov/WAC/default.aspx?cite=296-46B-334
- **WA010.** WAC 296-46B-010 (adoption).
  - "The 2023 edition of the National Electrical Code (NFPA 70 - 2023) including Annex A, B, C,"
  - A later sentence (extractor summary) adopts NFPA 70-2026 effective December 31, 2026.
  - History: "WSR 25-23-069, s 296-46B-010, filed 11/18/25, effective 12/19/25".
  - http://app.leg.wa.gov/WAC/default.aspx?cite=296-46B-010
- WAC 296-46B-110, -210, -215, -230, -240 and -250 (all effective 4/1/24) were checked. **None amends 110.14, 110.15, 210.19, 210.20, 215.2, 215.3, 230.42, 240.4, 240.6 or 250.122.**
- **MA.** 527 CMR 12.00, Massachusetts Electrical Code (Amendments), Board of Fire Prevention Regulations, 2/17/23 (Mass. Register #1489).
  - Amends NFPA 70-2023 "as released by the NFPA Standards Council on August 12, 2022" (extractor wording).
  - https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download
- **MN26.** "Summary of Significant 2026 NEC® Changes", NEC 2026 Adoption Review Committee. Hosted by MN DLI; undated (file name boe-011526).
  - https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
- **OR26.** "Table 1-E, Oregon Electrical Specialty Code (OESC) amendments to the 2026 National Electrical Code", effective October 1, 2026.
  - It describes the 2026 edition as "approved as an American National Standard on September 9, 2025" and adopts TIAs 26-1 to 26-9.
  - https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf
  - Index page: https://www.oregon.gov/bcd/codes-stand/Pages/electrical.aspx (says the OESC is based on the 2026 NEC, effective Oct. 1, 2026).
- **NC.** "2023 State Electrical Code Amendments – Compact Web Version 3" (JDS 3/4/2024). The effective date is "Indefinite Delay" under Session Law 2025-2. None of its 37 items touches a target section.
  - https://www.ncosfm.gov/electrical/electrical-amendments-v3/open
- **SNBO.** "Southern Nevada Amendments to the 2023 National Electrical Code". Adopted by Clark County 15 July 2025; effective 11 January 2026. None of its 48 items touches a target section.
  - https://www.clarkcountynv.gov/adobe/assets/urn:aaid:aem:9f7141aa-c587-49e3-8ecd-ad22f2775a07/original/as/2023-NEC-Amendments---Clark-County.pdf

**Tier 2: checked, but no target text**
- Leviton Captain Code 2023 index (3 pages). No node for 110.14, 110.15, 210.19, 210.20, 215.2/215.3, 230.42, 240.6, 250.122, 310.15, 334.80, 340.80, 625.17, 625.41 or 625.50.
- Leviton Captain Code 2020 index (3 pages). Same result. In Article 625 it has nodes only for 625/625.1, 625.44, 625.54 and 625.56.
- Eaton bus-ele-br-11318 (2023). Among the targets it covers only 240.4(D)(1)–(2) and 240.6(A).

**Tier 4: corroboration and context only**
- EC&M, "Six New TIAs Proposed for 2023 NEC", 1 July 2025. The six proposals cover 690.12(C), 430.132, 500.30(A), 501.15(B)(2), 505.30(A) and 506.30(A). None is a target section.
  - https://www.ecmweb.com/national-electrical-code/article/55300785/six-new-tias-proposed-for-2023-nec
- NEMA "code alerts" page. It says Michigan's code is "based on the second printing of the NEC including TIA 70-23-1 to 70-23-13, Errata 70-23-1 to 70-23-6".
  - https://nema.org/standards/technical/code-alerts
- Mike Holt forum, "2029 future PI 110.14(C)" (wwhitney, 12 Feb 2025). Quotes 110.14(C) text without naming an edition. No 2023→2026 change is stated.
  - https://forums.mikeholt.com/threads/2029-future-pi-110-14-c.2585713/latest

---

## 1. 110.14(C) temperature limitations

**2023 text: UNVERIFIED.** No tier 1–3 document reached in this run prints 110.14(C)(1)(a), (C)(1)(b) or (C)(2). Round 2's tier-4 text (Mike Holt forum, PI draft of 21 Mar 2023) stays corroboration only. That includes the motor design letters "B, C, or D", which are still unverified.

**2026 change: none at the Second Draft stage (VERIFIED-draft, negative finding).**
- P01SD lists 43 Second Revisions and is readable through Annex A Table A.2, so every Article 110 SR is in view.
- The 110.14 SRs are:
  - SR-7644, "110.14 [Excluding any Sub-Sections]": the dissimilar-metals intro paragraph.
  - SR-7618, 110.14(D).
- The extractor stated: "No SR touches 110.14(A), (B), (C), (C)(1)(a), (C)(1)(b), (C)(2), or (E)." None of these phrases occurs anywhere in the visible text: "100 amperes or less", "14 AWG through 1 AWG", "60°C (140°F)", "75°C (167°F)", motor design letters, "separately installed pressure connectors".
- **Limit:** a First-Draft-stage revision of 110.14(C) is not excluded. Round 2 found no 110.14 FR in the visible part of the CMP-1 FD, but that file was cut off inside Annex A Table A.1(a).
- Weak supporting signals: the Minnesota 2026 "significant changes" summary (MN26) does not mention 110.14. Oregon's 2026 amendment table amends 110.14(D) but not 110.14(C).

**2026 text of 110.14(D), for context (SR-7618, VERIFIED-draft).** Committee statement: "The editorial changes align with the NEC Style Manual, section 2.1.10.3."
- "(D) Terminal Connection Torque."
- "Tightening torque values for terminal connections shall be as indicated on equipment or in"
- "installation instructions provided by the manufacturer. An approved means shall be used to"
- "achieve the indicated torque value."

**2026 SR-7644 (110.14 intro), for context only.** Merged redline, for example "shall be identified for , installed and used". Committee statement: "The revision clarifies the requirement by removing terms that are unenforceable or" / "Vague as per NEC. Style Manual 3.2..1".

**Massachusetts deviation (MA, tier 3; VERIFIED-2023 for MA only).** The last sentence of the first paragraph of 110.14(A) is deleted and replaced with:
- "Connection by means of wire binding screws or studs and nuts having upturned lugs or equivalent"
- "shall be permitted for 10 AWG or smaller solid conductors, or conductors with Class B stranding."

## 2. 334.80 (NM) and 340.80 (UF)

**NEC 2023 base text: UNVERIFIED.** No reachable NFPA document holds it:
- the CMP-6 FD PrelimFR stops at 330.10(B);
- the CMP-6 FD ballot stops at FR-8229 (324.100(A));
- the PI files are far too long to reach 334.

**Washington deviation (WA334, tier 3; VERIFIED, WA only).**
- WA adopts NFPA 70-2023 (WA010), and NFPA 70-2026 from Dec 31, 2026.
- Subsection (8) is headed "080 Ampacity of Types NM and NMC cable carrying suffix letter "-B"." (WAC numbering mirrors NEC 334.80).
- Raw segments:
  - "(8)(a) The ampacity of Types NM and NMC cable carrying suffix letter "-B" shall be determined"
  - "in accordance with NEC 310.14."
  - "(b) The ampacity of #10 AWG and smaller ungrounded conductors shall not exceed that of a 60°C (140°F) rated conductor."
  - "(c) The ampacity of ungrounded conductors larger than #10 AWG shall not exceed that of a 75°C (167°F) rated conductor."
  - "(d) The 90°C (194°F) rating shall be permitted to be used for ampacity adjustment and correction calculations,"
  - "provided the final calculated ampacity for #10 AWG and smaller ungrounded conductors does not exceed that of a"
  - "60°C (140°F) rated conductor or exceed that of a 75°C (167°F) rated conductor"
  - "for ungrounded conductors larger than #10 AWG."
  - "(e) The ampacity of Types NM and NMC cable carrying suffix letter "-B" installed in cable trays shall be determined"
  - "in accordance with NEC 392.80(A)."
  - "(f) Where more than two NM cables carrying suffix letter "-B" containing two or more current-carrying conductors are installed,"
  - "without maintaining spacing between the cables, through the same opening in wood framing that is to be sealed"
  - "with thermal insulation, caulk, or sealing foam, the ampacity of each conductor shall be adjusted in accordance with"
  - "NEC Table 310.15(C)(1) and NEC 310.14(A)(2), Exception, shall not apply."
  - "(g) Where more than two NM cables carrying suffix letter "-B" containing two or more current-carrying conductors are installed"
  - "in contact with thermal insulation without maintaining spacing between cables, the ampacity of each conductor shall be"
  - "adjusted in accordance with NEC Table 310.15(C)(1) and NEC 310.14(A)(2), Exception, shall not apply."
- Items (f) and (g) look as if they paraphrase the NEC's own bundling and thermal-insulation paragraph. This is **WA text, not NEC base text**, so it does not verify NEC 334.80.

**Massachusetts deviation (MA, tier 3; re-confirmed this run).** 334.80 is amended: "334.80 Ampacity. Type NM, and NMC cables shall have conductors rated at 90°C (194°F)." The second paragraph is deleted. Where cables are in thermal insulation, ampacity is based on 60 °C conductors (extractor summary this run; round 2 quoted "Where installed in thermal insulation, the ampacity of conductors shall be that of 60°C (140°F) conductors.").

MA also replaces Table 310.15(C)(1), with the heading "Percent of Values in Tables 310.16 through 310.19, as Adjusted for Ambient Temperature if Necessary.":
- 4–6 conductors: 80 %
- 7–24: 70 %
- 25–42: 60 %
- 43 and above: 50 %
- These values come from an extractor summary. Round 2's summary pull matched, but **no raw-line pull was made**, so treat the values as unconfirmed table data.
- MA also deletes 310.15(C)(1)(d), the AC/MC cable item.

**340.80: UNVERIFIED.** Nothing new.

## 3. 210.19, 210.20, 215.2, 215.3, 230.42

### 3.1 210.19(A): VERIFIED-2023 (exact excerpts)

Source: P02FD, FR-8210-NFPA 70-2024 [Global Input], first appearance in the file. Committee statement: "This revision applies consistent usage of the defined term “branch circuit overcurrent protective device.”" The file prints the label "[210.19(A)]" with no heading. Excerpts, copied exactly (each was requested as a run of up to 100 characters):
- Lead-in: "Branch-circuit conductors shall have an ampacity not less than the larger of the following..."
- (1), start: "(1) Where a branch circuit supplies continuous loads or any combination of continuous and noncontinu"
- (1), end: "less than the noncontinuous load plus 125 percent of the continuous load in accordance with 310.14."
- (2), start: "(2) The minimum branch-circuit conductor size shall have an ampacity not less than the maximum load"
- (2), end: "be served after the application of any adjustment or correction factors in accordance with 310.15."
- Exception to (1), start: "Exception to (1): If the assembly, including the overcurrent devices protecting the branch circuits"
- Exception to (1), end: "less than the sum of the continuous load plus the noncontinuous load in accordance with 110.14(C)."
- Exception to (1) and (2), start: "Exception to (1) and (2): Where a portion of a branch circuit is connected at both its supply and"

Notes:
- The words between the start and end excerpts of (1) and (2) were **not seen**. Do not fill them in.
- The later working-draft copy in the same file prints the merged "circuitsbranch-circuit OCPDs", which is the OCPD-term edit, inside the Exception to (1).
- **2023 numbering:** 210.19(A), with list items (1) and (2) and the exception labels "Exception to (1)" and "Exception to (1) and (2)". It is not the older (A)(1)(a)/(b) form.
- Tier-4 corroboration: round 2's forum paste of the 2023 text has "noncontinuous load plus 125 percent of the continuous load in accordance with 310.14." This matches.
- **Not seen in FR-8210:** any 210.19 informational note, a grounded-conductor exception, and the (B), (C) or (D) text (extractor statement). **The household-range minimum (8¾ kW / 40 A) and its 2023 item number are UNVERIFIED.**

### 3.2 210.20(A): main rule VERIFIED-2023 (excerpts)

Same source as 3.1. The file prints the label "[210.20(A)]" with no heading.
- Start: "Where a branch circuit supplies continuous loads or any combination of continuous and noncontinuous"
- End: "shall not be less than the noncontinuous load plus 125 percent of the continuous load."
- The Exception (100 percent-listed assembly) stays VERIFIED-draft from round 2 (merged OCPD terms).
- Context from the extractor summary (not quoted): the 210.20 intro covers circuits "not exceeding 1000 volts ac or 1500 volts dc nominal" and refers to 210.20(A)–(D). Round 2 could not tell whether that phrase is base text or inserted.

### 3.3 215.2(A): VERIFIED-2023

Source: P10PI, Public Input No. 1824-NFPA 70-2023 [Section No. 215.2(A)], p. ≤40 of 504 (the extractor did not report the exact page). Raw segments, exactly as extracted:
- "(A) General."
- "Feeder conductors shall have an ampacity not less than the larger of 215.2(A)(1) or (A)(2) and shall comply"
- "with 110.14(C) ."
- "(1) Continuous and Noncontinuous Loads."
- "Where a feeder supplies continuous loads or any combination of continuous and noncontinuous loads, the"
- "minimum feeder conductor size shall have an ampacity not less than the noncontinuous load plus"
- "125 percent of the continuous load."
- "Exception No. 1: If the assembly, including the overcurrent devices protecting the feeder(s), is listed for"
- "operation at 100 percent of its rating, the ampacity of the feeder conductors shall be permitted to be not"
- "less than the sum of the continuous load plus the noncontinuous load."
- "Exception No. 2: Where a portion of a feeder is connected at both its supply and load ends to separately"
- "installed pressure connections as covered in 110.14(C)(2) , it shall be permitted to have an ampacity not"
- "less than the sum of the continuous load plus the noncontinuous load. No portion of a feeder installed"
- "under this exception shall extend into an enclosure containing either the feeder supply or the feeder load"
- "terminations, as covered in 110.14(C)(1) ."
- "Exception No. 3: Grounded conductors that are not connected to an overcurrent device shall be permitted"
- "to be sized at 100 percent of the continuous and noncontinuous load."
- "(2) Ampacity Adjustment or Correction Factors."
- "The minimum feeder conductor size shall have an ampacity not less than the maximum load to be served"
- "after the application of any adjustment or correction factors in accordance with 310.14 ."
- Informational notes: see §4.

**Cross-check against a second PI.** Source: Public Input No. 472-NFPA 70-2023, on the same section in the same file.
- PI 472 matches PI 1824 word for word from "(A) General." to "…either the feeder suppl", where the visible text ends.
- The one difference is the (1) heading. PI 472 reads "(1) Continuous and Noncontinuous Loads Without Adjustment and Correction Factors ." These are PI 472's proposed added words, so the 2023 heading is "(1) Continuous and Noncontinuous Loads."
- Spaces before punctuation, such as "110.14(C) .", appear in one PI and not the other. They are cross-reference link artifacts, not edit marks.

**What PI 1824 proposes.** Statement: "Sizing conductors to 125% of the continuous load is only required when the conductor is connected to an" + "overcurrent device." / "The same rules exist in Article 210 and Article 215." The extractor summarized the proposal as consolidating the 125 % rules into Article 240 (with companion PIs 1822 and 1823).
- Deleting text would leave the struck 2023 words in the extraction.
- The extractor reported no merged or inserted words.
- **Caveat:** Exception No. 3, item (2) and the informational notes come from PI 1824 alone (one source, one pull).
- **Flag:** 215.2(A)(2) ends "in accordance with 310.14". 210.19(A)(2) ends "in accordance with 310.15". Both are reported exactly as seen; do not harmonize them.

### 3.4 215.2 heading and 2026 renumbering

P10FD, FR-8995 (Global). Statement: "These sections are renumbered to comply with NEC Style Manual section 2.2.1."
- "215.2 215.4 Minimum Rating and Size. [Move 215.2 to 215.4]"
- "215.3 215.5 Overcurrent Protection. [Move 215.3 to 215.5]"

Status:
- The 2023 headings, "215.2 Minimum Rating and Size." and "215.3 Overcurrent Protection.", are VERIFIED-2023 (unrevised).
- **The 2026 move of 215.2 to 215.4 and 215.3 to 215.5 is VERIFIED-draft (First Draft).** The final 2026 numbering was not seen.

### 3.5 215.3: VERIFIED-2023 (continuous-load sentence and Exception)

P10FD, FR-9001. Statement: "The language is being revised to comply with the NEC Style Manual section 4.1.4." The same panel's FR-9117 describes section 4.1.4 as being about references to Parts. Pulls 1 and 2 are identical:
- "215.3 Overcurrent Protection."
- "Feeders shall be protected against overcurrent in accordance with Part I of Article 240, Part I ." This is merged redline: the struck "Part I of" plus the inserted ", Part I". The 2023 sentence is probably "…in accordance with Part I of Article 240." but that is **VERIFIED-draft** only.
- "Where a feeder supplies continuous loads or any combination of continuous and noncontinuous"
- "loads, the rating of the overcurrent device shall not be less than the noncontinuous load plus"
- "125 percent of the continuous load."
- "Exception: Where the assembly, including the overcurrent devices protecting the feeder(s), is"
- "listed for operation at 100 percent of its rating, the ampere rating of the overcurrent device"
- "shall be permitted to be not less than the sum of the continuous load plus the noncontinuous"
- "load."
- There is a single "Exception:", not "Exception No. 1".

### 3.6 230.42(A): mostly VERIFIED-2023

P10FD, FR-9117, "230.42(A) [Excluding any Sub-Sections]". Statement: "The text is revised to comply with the NEC Style Manual section 4.1.4, regarding the use of parts." Pull 2 gave all of the lines below; pull 1 gave the first two sentences, identically.
- "Service-entrance conductors shall have an ampacity of not less than the maximum load to be served."
- "Conductors shall be sized not less than the largest of 230.42(A)(1) or (A)(2)."
- "Loads shall be determined in accordance with Article 220, Part III, IV, or V of Article 220 , as" / "applicable." This is merged; the 2023 text is "…Part III, IV, or V of Article 220, as applicable" (VERIFIED-draft).
- "Ampacity shall be determined from 310.14 and shall comply with 110.14(C)."
- "The maximum current of busways shall be that value for which the busway has been listed or labeled."
- "Informational Note: See UL 857, Standard for Safety for Busways, for information on busways."

P10FD, FR-9119, 230.42(A)(1). Statement: "The text of exception 2 is revised for clarity." Both pulls match for the heading, the body and Exception No. 1:
- "(1) Continuous and Noncontinuous Loads."
- "Where the service-entrance conductors supply continuous loads or any combination of"
- "noncontinuous and continuous loads, the minimum service-entrance conductor size shall have"
- "an ampacity not less than the sum of the noncontinuous loads plus 125 percent of continuous"
- "loads."
- "Exception No. 1: Grounded conductors that are not connected to an overcurrent device shall"
- "be permitted to be sized at 100 percent of the sum of the continuous and noncontinuous load."
- **Exception No. 2 is CONFLICTING.** Both pulls are merged redline and they differ:
  - Pull 1: "…100 percent of the sum of" / "the continuous load and the continuous load if the service-entrance conductors terminate in if they terminate to an overcurrent device…"
  - Pull 2: "…100 percent of the sum of" / "the continuous and noncontinuous load and the continuous load if the service-entrance" / "conductors terminate in if they terminate to an overcurrent device where both the overcurrent" / "device and its assembly are listed for operation at 100 percent of their rating shall be" / "permitted ."
  - Only the condition (OCPD and assembly listed for 100 percent operation) is clear.
- **230.42(A)(2): not shown, UNVERIFIED.**

**Context (not a target): FR-9000 (215.2(B)), 2026 merged.**
- "(B) Grounded Conductor." / "The size of the If a feeder circuit has a grounded conductor, it shall not be smaller than the" / "equipment grounding conductor size required by 250.122, except that 250.122(F) shall not apply where" / "grounded conductors are run in parallel."
- This shows that 2023 215.2(B) ties the feeder grounded-conductor minimum to 250.122 (VERIFIED-draft wording).

## 4. Voltage-drop informational notes

**215.2(A), 2023: VERIFIED-2023.** Source: P10PI, PI 1824, as in §3.3. Single PI, single pull, no merged words. The notes are printed after the 215.2(A)(2) text.
- "Informational Note No. 1: See Informative Annex D for Examples D1 through D11."
- "Informational Note No. 2: Conductors for feeders, as defined in Article 100, sized to prevent a voltage"
- "drop exceeding 3 percent at the farthest outlet of power, heating, and lighting loads, or combinations"
- "of such loads, and where the maximum total voltage drop on both feeders and branch circuits to the"
- "farthest outlet does not exceed 5 percent, will provide reasonable efficiency of operation."
- "Informational Note No. 3: See 210.19, Informational Note for voltage drop for branch circuits."

The extraction cannot show whether the notes attach to 215.2(A) or to 215.2(A)(2). Cite them as "215.2(A), Informational Note No. 2".

**210.19 branch-circuit note, 2023: wording and number UNVERIFIED.** FR-8210 shows no 210.19 informational note. The 215.2 cross-reference above says one exists ("See 210.19, Informational Note …"), but the reference carries no note number.

**For the site:** the 2023 text frames 3 % (feeder) and 5 % (total) as giving "reasonable efficiency of operation". It is an informational note. It is not a requirement or a limit.

## 5. 310.15(E) and 310.15(F)

- 2023 wording of both: **UNVERIFIED.** No new tier 1–3 text was reached. The docinfofiles budget went to targets with better odds (§3).
- 2026 (MN26, government summary, VERIFIED-other-edition 2026, summary only): "A new list format will clearly identify when a neutral is considered as a current-carrying conductor." This agrees with round 2's FR-8035 finding (VERIFIED-draft).
- Massachusetts: 310.15(C)(1)(d) is deleted and Table 310.15(C)(1) is replaced (§2). 310.15(E) and (F) are not amended in MA.

## 6. 250.122(A) and (B)

**2023 wording: UNVERIFIED.** The CMP-5 documents are far too long to reach 250.122. The sentence saying the EGC need not be larger than the circuit conductors was **not seen** in any source.

**NFPA June 2020 fact sheet (NFPAFS; VERIFIED-other-edition 2020, NFPA paraphrase):**
- Sizing:
  - "Table 250.122 uses the rating of the overcurrent protective device (OCPD) ahead of the equipment"
  - "or load that is being supplied to properly size the EGC."
  - "Generally, the minimum-sized EGC is selected from Table 250.122 based on the rating or setting"
  - "of the feeder or branch-circuit OCPD(s)."
- Proportional increase:
  - "If the ungrounded circuit conductors are increased in size for any reason other than temperature correction"
  - "or due to the number of current-carrying conductors in a raceway, the EGC must be increased proportionally."
  - "Where the ungrounded circuit conductors are increased in size to compensate for voltage drop,"
  - "the EGCs must be increased proportionately."
- Table note:
  - "Where necessary to comply with 250.4(A)(5) or (B)(4), the equipment grounding conductor"
  - "shall be sized larger than given in this table."
  - "*See installation restrictions in 250.120."
- Worked example:
  - 250 kcmil Cu increased to 350 kcmil.
  - "Size ratio = 350,000 circular mils = 1.4" over "250,000 circular mils".
  - "41,740 circular mils × 1.4 = 58,436 circular mils".
  - "58,436 circular mils is too large for a 3 AWG EGC."
  - "The next larger size is 66,360 circular mils, which converts to a 2 AWG copper EGC."
  - Arithmetic re-run with `python3 -I`: 350000/250000 = 1.4; 41740 × 1.4 = 58,436.
- No qualified-person exception is mentioned. Its 2023 existence is UNVERIFIED.

## 7. Article 625

**625.41: UNVERIFIED for 2023.**
- P12SD lists the Article 625 Second Revisions: SR 7843 (625.2), 7853 (new 625.4), 7855 (new 625.5), 7847 (625.4 Voltages), 7856 (625.17), 8103 (625.42), 7866 (625.43), 8104 (625.44(A)(B)), 8105 (625.44(C)), 7870 (625.44), 7873 (625.48), 7875 (625.54) and 7874 (625.102(C)).
- **No Second Revision touches 625.41 or 625.50.** Their text does not appear.
- The 125 % rule for EV branch circuits is still supported indirectly by these verified items:
  - 625.42 (2023): EV charging loads are continuous. Verified in round 2 (Leviton, NFPA notice).
  - 210.19(A)(1) and 210.20(A) (2023): 125 percent of the continuous load. Verified in this run.

**625.17: VERIFIED-draft (values only).** Source: P12SD, SR-7856, extracted text. The 2026 redline is merged, and the item labels are garbled ((3), (4), (5), (6), a., b.).
- "(5) For portable equipment in accordance with 625.44(A) , the power-supply cord"
- "shall be not more than 300 mm (12 in.) long."
- "(6) For hand fastened -in-place a. i. equipment in accordance with 625.44(B) , the power-supply cord"
- "shall be not more than 1.8 m (6 ft) long and the equipment shall be installed at a height that prevents"
- "the power-supply cord from contacting the floor when it is connected to the proper receptacle."
- "b. When the interrupting device of the personnel protection system is located at the attachment plug,"
- "or within the first 300 mm (12 in.) of the power-supply cord, the overall cord length shall be not"
- "greater than 4.6 m (15 ft)."
- "(C) Overall Cord and Cable Length. The overall usable length shall not exceed 7.5 m (25 ft) unless equipped with a cable management system" / "that is part of the listed electric vehicle supply equipment."
- SR-7856 statement (excerpt): "The term "fastened in place" was replaced with "hand fastened" for clarity and consistency throughout the Code."
- **Which value belongs to which condition in 2023 is UNVERIFIED.** So is the 2023 wording.

**625.50: UNVERIFIED.** No Second Revision. The 450 mm / 18 in., 1.2 m / 4 ft and 600 mm / 24 in. text was not seen.

**627.41(B) (2026, VERIFIED-draft).** Source: P12SD, SR-7908. Article 627 covers electric self-propelled vehicles, and SR-7898 renumbers it to Article 624.
- "(B) Noncontinuous Loads. Where noncontinuous loads are supplied from the same feeder, overcurrent devices OCPDs"
- "shall have current ratings of not less than the sum of the noncontinuous loads plus 125 percent"
- "of the continuous loads."

## 8. 110.15 high-leg marking

**2023: UNVERIFIED.**

**2026 Second Draft (P01SD, SR-7619): VERIFIED-draft, merged redline.**
- "110.15 High-Leg Marking."
- "On a 4-wire, delta-connected system where the midpoint of one phase winding is grounded,"
- "only the conductor or busbar having the higher phase voltage to ground shall be durably and"
- "permanently marked orange in color by an outer finish or by other effective means such that"
- "orange is visible to all accessible points and terminations at all splices and terminations ."
- "Such identification shall be placed at each point on the system where a connection is made if the"
- "grounded conductor is also present."

Committee statement:
- "The revision in this section reflects the elimination of accessible points along the wiring"
- "system and adds all splices to the requirement. "All accessible locations" is removed"
- "because marking of the high leg is only required at the terminations, and not in fittings"
- "and other enclosures used for pulling."
- "The exception does not add clarity to the marking requirement."

What this shows:
- The base text (the 2026 First Draft, and possibly 2023) required orange to be visible at accessible points and terminations, and had an exception. **The 2026 SD deletes the exception.** The 2023 exception's wording is UNVERIFIED.
- Stable facts across the merged text: a 4-wire delta system with the midpoint of one phase winding grounded; the higher-voltage-to-ground conductor is marked orange.

## 9. 240.4(D)(4)–(D)(8) and 240.6(A)

- No new 2023 source was reached. Round 2's statuses stand (VERIFIED-draft; and CONFLICTING for the fuse-only sentence).
- P10PI and P10FD are the CMP-10 documents that would carry Article 240. Both windows end before Article 240: in 215.2(A) and 230.67(A) respectively.
- The Eaton 2023 brochure was re-checked for coverage only. Among the targets it covers just 240.4(D)(1)–(2) and 240.6(A).

---

## Machine-readable

```json
{"ref": "110.14(C)(1)(a),(C)(1)(b),(C)(2)", "edition": "2023", "status": "UNVERIFIED", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20", "notes": "No tier 1-3 text reached. Round-2 tier-4 text (incl. motor letters B, C, or D) remains corroboration only."}
```
```json
{"ref": "110.14(C) 2026 change check", "edition": "2026 Second Draft (A2025)", "status": "VERIFIED-draft (negative finding: no Second Revision on 110.14(C))", "values": {"sr_on_110_14": ["SR-7644 110.14 [Excluding any Sub-Sections]", "SR-7618 110.14(D)"], "sr_on_110_14_C": "none"}, "quote_segments": ["(D) Terminal Connection Torque.", "Tightening torque values for terminal connections shall be as indicated on equipment or in", "installation instructions provided by the manufacturer. An approved means shall be used to", "achieve the indicated torque value."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "Visible text runs through Annex A Table A.2, so all Art. 110 SRs are in view. A First-Draft-stage revision of 110.14(C) is not excluded."}
```
```json
{"ref": "110.14(A) (Massachusetts amendment)", "edition": "2023 NEC as amended by 527 CMR 12.00", "status": "VERIFIED-2023 (MA only)", "values": {"wire_binding_screws_permitted_for": "10 AWG or smaller solid conductors, or conductors with Class B stranding"}, "quote_segments": ["Connection by means of wire binding screws or studs and nuts having upturned lugs or equivalent", "shall be permitted for 10 AWG or smaller solid conductors, or conductors with Class B stranding."], "source_url": "https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "334.80", "edition": "2023", "status": "UNVERIFIED", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20", "notes": "NEC base text not reached in tiers 1-3. See the WA and MA deviation blocks."}
```
```json
{"ref": "334.80 (Washington: WAC 296-46B-334(8))", "edition": "NFPA 70-2023 as adopted and amended by Washington (WAC 296-46B-010)", "status": "VERIFIED (WA only)", "values": {"ungrounded_10AWG_and_smaller": "60°C (140°F) ampacity", "ungrounded_larger_than_10AWG": "75°C (167°F) ampacity", "adjustment_correction_basis": "90°C (194°F) rating", "cable_tray": "NEC 392.80(A)", "bundled_through_sealed_framing_opening": "more than two NM-B cables with two or more CCCs, no spacing: adjust per NEC Table 310.15(C)(1); 310.14(A)(2) Exception shall not apply", "in_contact_with_thermal_insulation": "same adjustment rule"}, "quote_segments": ["(8)(a) The ampacity of Types NM and NMC cable carrying suffix letter \"-B\" shall be determined", "in accordance with NEC 310.14.", "(b) The ampacity of #10 AWG and smaller ungrounded conductors shall not exceed that of a 60°C (140°F) rated conductor.", "(c) The ampacity of ungrounded conductors larger than #10 AWG shall not exceed that of a 75°C (167°F) rated conductor.", "(d) The 90°C (194°F) rating shall be permitted to be used for ampacity adjustment and correction calculations,", "provided the final calculated ampacity for #10 AWG and smaller ungrounded conductors does not exceed that of a", "60°C (140°F) rated conductor or exceed that of a 75°C (167°F) rated conductor", "for ungrounded conductors larger than #10 AWG.", "(f) Where more than two NM cables carrying suffix letter \"-B\" containing two or more current-carrying conductors are installed,", "without maintaining spacing between the cables, through the same opening in wood framing that is to be sealed", "with thermal insulation, caulk, or sealing foam, the ampacity of each conductor shall be adjusted in accordance with", "NEC Table 310.15(C)(1) and NEC 310.14(A)(2), Exception, shall not apply.", "(g) Where more than two NM cables carrying suffix letter \"-B\" containing two or more current-carrying conductors are installed", "in contact with thermal insulation without maintaining spacing between cables, the ampacity of each conductor shall be", "adjusted in accordance with NEC Table 310.15(C)(1) and NEC 310.14(A)(2), Exception, shall not apply."], "source_url": "http://app.leg.wa.gov/WAC/default.aspx?cite=296-46B-334", "permission_notice": null, "retrieved": "2026-10-20", "notes": "WSR 25-23-069, filed 11/18/25, effective 12/19/25. WA adopts NFPA 70-2023 and NFPA 70-2026 effective Dec 31, 2026 (WAC 296-46B-010). This is state text, not NEC base text."}
```
```json
{"ref": "334.80 (Massachusetts amendment)", "edition": "2023 NEC as amended by 527 CMR 12.00", "status": "VERIFIED-2023 (MA only)", "values": {"conductor_rating": "90°C (194°F)", "in_thermal_insulation": "60°C conductor ampacity (summary this run; round 2 quoted the sentence)"}, "quote_segments": ["334.80 Ampacity. Type NM, and NMC cables shall have conductors rated at 90°C (194°F)."], "source_url": "https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "Table 310.15(C)(1) (Massachusetts replacement) and 310.15(C)(1)(d) deletion", "edition": "2023 NEC as amended by 527 CMR 12.00", "status": "VERIFIED-2023 (MA only) for the fact of replacement; factor values from extractor summaries only (round 2 and round 3 agree); no raw-line pull", "values": {"4-6": "80%", "7-24": "70%", "25-42": "60%", "43_and_above": "50%", "header": "Percent of Values in Tables 310.16 through 310.19, as Adjusted for Ambient Temperature if Necessary.", "310.15(C)(1)(d)": "deleted"}, "quote_segments": ["Percent of Values in Tables 310.16 through 310.19, as Adjusted for Ambient Temperature if Necessary."], "source_url": "https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "340.80", "edition": "2023", "status": "UNVERIFIED", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "210.19(A)", "edition": "2023 (base text of 2026 First Draft FR-8210)", "status": "VERIFIED-2023 (excerpts; middle words of items (1) and (2) not seen)", "values": {"structure": "210.19(A) lead-in + items (1), (2); 'Exception to (1)'; 'Exception to (1) and (2)'", "continuous_multiplier": "125 percent", "item1_reference": "310.14", "item2_reference": "310.15", "exception_to_1_reference": "110.14(C)"}, "quote_segments": ["Branch-circuit conductors shall have an ampacity not less than the larger of the following...", "(1) Where a branch circuit supplies continuous loads or any combination of continuous and noncontinu", "less than the noncontinuous load plus 125 percent of the continuous load in accordance with 310.14.", "(2) The minimum branch-circuit conductor size shall have an ampacity not less than the maximum load", "be served after the application of any adjustment or correction factors in accordance with 310.15.", "Exception to (1): If the assembly, including the overcurrent devices protecting the branch circuits", "less than the sum of the continuous load plus the noncontinuous load in accordance with 110.14(C).", "Exception to (1) and (2): Where a portion of a branch circuit is connected at both its supply and"], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "FR-8210 statement: 'This revision applies consistent usage of the defined term “branch circuit overcurrent protective device.”' No informational notes, grounded-conductor exception or (B)-(D) shown."}
```
```json
{"ref": "210.19 household ranges (8 3/4 kW, 40 A) and grounded-conductor exception", "edition": "2023", "status": "UNVERIFIED", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20", "notes": "Item number for the range rule in 2023 not seen; do not cite one."}
```
```json
{"ref": "210.20(A)", "edition": "2023 (base text of FR-8210)", "status": "VERIFIED-2023 (main-rule excerpts); Exception VERIFIED-draft (round 2)", "values": {"continuous_multiplier": "125 percent", "exception": "assembly listed for 100 percent operation (draft wording)"}, "quote_segments": ["Where a branch circuit supplies continuous loads or any combination of continuous and noncontinuous", "shall not be less than the noncontinuous load plus 125 percent of the continuous load."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "215.2(A), (A)(1), (A)(2)", "edition": "2023", "status": "VERIFIED-2023", "values": {"lead_in": "larger of 215.2(A)(1) or (A)(2); comply with 110.14(C)", "continuous_multiplier": "125 percent", "exception_1": "assembly incl. OCPDs listed for 100 percent: sum of continuous plus noncontinuous", "exception_2": "portion connected at both ends to separately installed pressure connections (110.14(C)(2)); not into enclosures with terminations", "exception_3": "grounded conductors not connected to an overcurrent device: 100 percent", "item2_reference": "310.14"}, "quote_segments": ["(A) General.", "Feeder conductors shall have an ampacity not less than the larger of 215.2(A)(1) or (A)(2) and shall comply", "with 110.14(C) .", "(1) Continuous and Noncontinuous Loads.", "Where a feeder supplies continuous loads or any combination of continuous and noncontinuous loads, the", "minimum feeder conductor size shall have an ampacity not less than the noncontinuous load plus", "125 percent of the continuous load.", "Exception No. 1: If the assembly, including the overcurrent devices protecting the feeder(s), is listed for", "operation at 100 percent of its rating, the ampacity of the feeder conductors shall be permitted to be not", "less than the sum of the continuous load plus the noncontinuous load.", "Exception No. 2: Where a portion of a feeder is connected at both its supply and load ends to separately", "installed pressure connections as covered in 110.14(C)(2) , it shall be permitted to have an ampacity not", "less than the sum of the continuous load plus the noncontinuous load. No portion of a feeder installed", "under this exception shall extend into an enclosure containing either the feeder supply or the feeder load", "terminations, as covered in 110.14(C)(1) .", "Exception No. 3: Grounded conductors that are not connected to an overcurrent device shall be permitted", "to be sized at 100 percent of the continuous and noncontinuous load.", "(2) Ampacity Adjustment or Correction Factors.", "The minimum feeder conductor size shall have an ampacity not less than the maximum load to be served", "after the application of any adjustment or correction factors in accordance with 310.14 ."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_PISubmittals.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "Public Input No. 1824-NFPA 70-2023; cross-checked against PI 472 (identical up to '…either the feeder suppl' except PI 472's proposed added words in the (1) heading). Exception No. 3 and (2) are from PI 1824 only."}
```
```json
{"ref": "215.2 / 215.3 headings and 2026 renumbering", "edition": "2023 headings; 2026 First Draft numbering", "status": "VERIFIED-2023 (headings); VERIFIED-draft (2026 215.2->215.4, 215.3->215.5)", "values": {"215.2_heading_2023": "Minimum Rating and Size.", "215.3_heading_2023": "Overcurrent Protection.", "2026_FD": {"215.2": "215.4", "215.3": "215.5", "215.4": "215.14", "215.5": "215.13"}}, "quote_segments": ["215.2 215.4 Minimum Rating and Size. [Move 215.2 to 215.4]", "215.3 215.5 Overcurrent Protection. [Move 215.3 to 215.5]", "These sections are renumbered to comply with NEC Style Manual section 2.2.1."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "FR-8995 (Global). The 215.4->215.14 and 215.5->215.13 moves are from the extractor's FR list. Final 2026 numbering not seen."}
```
```json
{"ref": "215.3", "edition": "2023 (base text of FR-9001)", "status": "VERIFIED-2023 (continuous-load sentence and Exception); first sentence VERIFIED-draft (merged)", "values": {"continuous_multiplier": "125 percent", "exception": "assembly incl. OCPDs listed for 100 percent: OCPD rating not less than continuous plus noncontinuous"}, "quote_segments": ["215.3 Overcurrent Protection.", "Feeders shall be protected against overcurrent in accordance with Part I of Article 240, Part I .", "Where a feeder supplies continuous loads or any combination of continuous and noncontinuous", "loads, the rating of the overcurrent device shall not be less than the noncontinuous load plus", "125 percent of the continuous load.", "Exception: Where the assembly, including the overcurrent devices protecting the feeder(s), is", "listed for operation at 100 percent of its rating, the ampere rating of the overcurrent device", "shall be permitted to be not less than the sum of the continuous load plus the noncontinuous", "load."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "FR-9001 statement: 'The language is being revised to comply with the NEC Style Manual section 4.1.4.' Two pulls identical."}
```
```json
{"ref": "230.42(A), (A)(1)", "edition": "2023 (base text of FR-9117, FR-9119)", "status": "VERIFIED-2023 (intro sentences 1, 2, 4, 5 and note; (A)(1) heading, body and Exception No. 1); intro sentence 3 VERIFIED-draft; Exception No. 2 CONFLICTING; (A)(2) UNVERIFIED", "values": {"lead_in": "largest of 230.42(A)(1) or (A)(2)", "ampacity_source": "310.14 and comply with 110.14(C)", "continuous_multiplier": "125 percent", "exception_1": "grounded conductors not connected to an overcurrent device: 100 percent", "exception_2_condition": "OCPD and its assembly listed for 100 percent operation (wording CONFLICTING)"}, "quote_segments": ["Service-entrance conductors shall have an ampacity of not less than the maximum load to be served.", "Conductors shall be sized not less than the largest of 230.42(A)(1) or (A)(2).", "Loads shall be determined in accordance with Article 220, Part III, IV, or V of Article 220 , as", "applicable.", "Ampacity shall be determined from 310.14 and shall comply with 110.14(C).", "The maximum current of busways shall be that value for which the busway has been listed or labeled.", "Informational Note: See UL 857, Standard for Safety for Busways, for information on busways.", "(1) Continuous and Noncontinuous Loads.", "Where the service-entrance conductors supply continuous loads or any combination of", "noncontinuous and continuous loads, the minimum service-entrance conductor size shall have", "an ampacity not less than the sum of the noncontinuous loads plus 125 percent of continuous", "loads.", "Exception No. 1: Grounded conductors that are not connected to an overcurrent device shall", "be permitted to be sized at 100 percent of the sum of the continuous and noncontinuous load."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_FD_PrelimFR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "FR-9117 statement: 'The text is revised to comply with the NEC Style Manual section 4.1.4, regarding the use of parts.' FR-9119 statement: 'The text of exception 2 is revised for clarity.' Exception No. 2 pulls differ ('the continuous load and the continuous load' vs 'the continuous and noncontinuous load and the continuous load')."}
```
```json
{"ref": "215.2(A) Informational Notes No. 1-3 (voltage drop)", "edition": "2023", "status": "VERIFIED-2023 (single PI, single pull)", "values": {"feeder_drop": "3 percent at the farthest outlet", "total_drop": "5 percent (feeders plus branch circuits to the farthest outlet)", "effect_stated": "will provide reasonable efficiency of operation", "note_number": "Informational Note No. 2", "cross_reference_note": "Informational Note No. 3: See 210.19, Informational Note"}, "quote_segments": ["Informational Note No. 1: See Informative Annex D for Examples D1 through D11.", "Informational Note No. 2: Conductors for feeders, as defined in Article 100, sized to prevent a voltage", "drop exceeding 3 percent at the farthest outlet of power, heating, and lighting loads, or combinations", "of such loads, and where the maximum total voltage drop on both feeders and branch circuits to the", "farthest outlet does not exceed 5 percent, will provide reasonable efficiency of operation.", "Informational Note No. 3: See 210.19, Informational Note for voltage drop for branch circuits."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P10_PISubmittals.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "Public Input No. 1824-NFPA 70-2023. Notes printed after 215.2(A)(2); attachment to (A) vs (A)(2) not determinable from extraction."}
```
```json
{"ref": "210.19 voltage-drop informational note", "edition": "2023", "status": "UNVERIFIED (wording and number)", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20", "notes": "Its existence is implied by 215.2(A) Informational Note No. 3 ('See 210.19, Informational Note ...')."}
```
```json
{"ref": "310.15(E)", "edition": "2023 / 2026", "status": "UNVERIFIED (2023 wording); VERIFIED-other-edition (2026, government summary only)", "values": {"2026_change": "new list format identifying when a neutral counts as current-carrying"}, "quote_segments": ["A new list format will clearly identify when a neutral is considered as a current-carrying conductor."], "source_url": "https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "310.15(F)", "edition": "2023", "status": "UNVERIFIED", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "250.122(A)", "edition": "2023", "status": "UNVERIFIED (2023 wording; 'need not be larger than circuit conductors' sentence not seen); OCPD-based sizing VERIFIED-other-edition (NFPA 2020 paraphrase)", "values": {"sizing_basis": "rating or setting of the OCPD ahead of the equipment"}, "quote_segments": ["Table 250.122 uses the rating of the overcurrent protective device (OCPD) ahead of the equipment", "or load that is being supplied to properly size the EGC.", "Where necessary to comply with 250.4(A)(5) or (B)(4), the equipment grounding conductor", "shall be sized larger than given in this table."], "source_url": "https://www.salinas.gov/files/sharedassets/city/v/1/fire-department/documents/grounding-bonding-fact-sheet.pdf", "permission_notice": "NFPA fact sheet: '© 2020 National Fire Protection Association / June 2020'; 'This material is not the official position of any NFPA Technical Committee on any referenced topic'", "retrieved": "2026-10-20"}
```
```json
{"ref": "250.122(B)", "edition": "2020 (NFPA paraphrase); 2023 wording UNVERIFIED", "status": "VERIFIED-other-edition (2020, paraphrase)", "values": {"rule": "increase EGC proportionally when ungrounded conductors are upsized for any reason other than temperature correction or number of current-carrying conductors", "example_ratio": "1.4 (350,000 / 250,000 cmil)", "example_result": "58,436 cmil -> 2 AWG Cu (66,360 cmil)"}, "quote_segments": ["If the ungrounded circuit conductors are increased in size for any reason other than temperature correction", "or due to the number of current-carrying conductors in a raceway, the EGC must be increased proportionally.", "Where the ungrounded circuit conductors are increased in size to compensate for voltage drop,", "the EGCs must be increased proportionately.", "41,740 circular mils × 1.4 = 58,436 circular mils", "The next larger size is 66,360 circular mils, which converts to a 2 AWG copper EGC."], "source_url": "https://www.salinas.gov/files/sharedassets/city/v/1/fire-department/documents/grounding-bonding-fact-sheet.pdf", "permission_notice": "NFPA fact sheet: '© 2020 National Fire Protection Association / June 2020'", "retrieved": "2026-10-20", "notes": "Arithmetic re-run with python3 -I: 1.4; 58,436. No qualified-person exception mentioned; its 2023 status UNVERIFIED."}
```
```json
{"ref": "625.41", "edition": "2023 / 2026 SD", "status": "UNVERIFIED (2023); VERIFIED-draft negative finding: no 2026 Second Revision", "values": {}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "125% for EV circuits is still supported via 625.42 (continuous, VERIFIED-2023 round 2) + 210.19(A)(1)/210.20(A) (VERIFIED-2023 this run)."}
```
```json
{"ref": "625.17(A)/(C) cord and cable lengths", "edition": "2026 Second Draft (merged redline)", "status": "VERIFIED-draft (values only); 2023 UNVERIFIED", "values": {"portable_cord_max": "300 mm (12 in.)", "fastened_in_place_cord_max": "1.8 m (6 ft)", "interrupter_at_plug_or_first_300mm_cord_max": "4.6 m (15 ft)", "overall_usable_length_max": "7.5 m (25 ft) unless cable management system part of listed EVSE"}, "quote_segments": ["(5) For portable equipment in accordance with 625.44(A) , the power-supply cord", "shall be not more than 300 mm (12 in.) long.", "(6) For hand fastened -in-place a. i. equipment in accordance with 625.44(B) , the power-supply cord", "shall be not more than 1.8 m (6 ft) long and the equipment shall be installed at a height that prevents", "b. When the interrupting device of the personnel protection system is located at the attachment plug,", "or within the first 300 mm (12 in.) of the power-supply cord, the overall cord length shall be not", "greater than 4.6 m (15 ft).", "(C) Overall Cord and Cable Length. The overall usable length shall not exceed 7.5 m (25 ft) unless equipped with a cable management system"], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "SR-7856. Item labels garbled by flattening; the condition each value applies to in 2023 is not established."}
```
```json
{"ref": "625.50", "edition": "2023 / 2026 SD", "status": "UNVERIFIED (2023); no 2026 Second Revision (VERIFIED-draft negative)", "values": {}, "quote_segments": [], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "627.41(B) (2026; electric self-propelled vehicles; Article 627 renumbered 624 by SR-7898)", "edition": "2026 Second Draft", "status": "VERIFIED-draft", "values": {"continuous_multiplier": "125 percent"}, "quote_segments": ["(B) Noncontinuous Loads. Where noncontinuous loads are supplied from the same feeder, overcurrent devices OCPDs", "shall have current ratings of not less than the sum of the noncontinuous loads plus 125 percent", "of the continuous loads."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20"}
```
```json
{"ref": "110.15", "edition": "2026 Second Draft (merged redline); 2023 UNVERIFIED", "status": "VERIFIED-draft", "values": {"system": "4-wire, delta-connected, midpoint of one phase winding grounded", "marked_conductor": "conductor or busbar having the higher phase voltage to ground", "color": "orange", "2026_change": "visibility moved to all splices and terminations; 'all accessible' removed; exception deleted"}, "quote_segments": ["110.15 High-Leg Marking.", "On a 4-wire, delta-connected system where the midpoint of one phase winding is grounded,", "only the conductor or busbar having the higher phase voltage to ground shall be durably and", "permanently marked orange in color by an outer finish or by other effective means such that", "orange is visible to all accessible points and terminations at all splices and terminations .", "Such identification shall be placed at each point on the system where a connection is made if the", "grounded conductor is also present."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_SD_PrelimSR.pdf", "permission_notice": null, "retrieved": "2026-10-20", "notes": "SR-7619 statement: 'The exception does not add clarity to the marking requirement.'"}
```
```json
{"ref": "240.4(D)(4)-(D)(8); 240.6(A) fuse-only sentence", "edition": "2023", "status": "unchanged from round 2: (D)(4)-(D)(8) VERIFIED-draft / 2023 UNVERIFIED; fuse-only sentence CONFLICTING", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-20", "notes": "CMP-10 PI window ends in 215.2(A) (p.40 of 504); CMP-10 FD window ends in 230.67(A) (p.56 of 113); neither reaches Art. 240."}
```
```json
{"ref": "adoption context seen in this run", "edition": "n/a", "status": "VERIFIED (government sources)", "values": {"WA": "NFPA 70-2023 in force; NFPA 70-2026 effective Dec 31, 2026 (WAC 296-46B-010)", "OR": "OESC based on 2026 NEC, effective Oct 1, 2026; adopts TIAs 26-1 to 26-9 (Table 1-E)", "NC": "2023 State Electrical Code effective date indefinitely delayed (Session Law 2025-2)", "Clark County NV": "SNBO amendments to 2023 NEC effective Jan 11, 2026", "2026_NEC_ANS_approval": "September 9, 2025 (per OR Table 1-E)"}, "quote_segments": ["The 2023 edition of the National Electrical Code (NFPA 70 - 2023) including Annex A, B, C,"], "source_url": "http://app.leg.wa.gov/WAC/default.aspx?cite=296-46B-010", "permission_notice": null, "retrieved": "2026-10-20"}
```

---

## Blocked or failed log

- **WebSearch:** 12 calls succeeded. The 13th (an IAEI 110.14(C) query) was refused with "this turn's web search budget is used up (limit: 200 WebSearch calls per turn, shared by every agent in it)". No further searches were attempted.
- **docinfofiles.nfpa.org:** 8 of 8 calls, no 429.
  - P10 PISubmittals: data pull, then verbatim pull.
  - P10 FD PrelimFR: data pull, then raw pull.
  - P02 FD PrelimFR, first read: **the summarizer refused verbatim lines** ("I'm not reproducing every line verbatim").
  - P02 FD PrelimFR, second read: worked when short excerpts (under 100 characters) were requested.
  - P12 SD PrelimSR: one pull.
  - P01 SD PrelimSR: one pull.
  - Not fetched (budget): P06 PISubmittals (310.15(E)/(F)), P12 PISubmittals (625.41/625.50 2023), P05 documents (250.122 is out of reach anyway), TIA_70_23_14 to TIA_70_23_20, and Errata_70_23_1 to Errata_70_23_6.
- **Fetched, no target text:**
  - Leviton Captain Code 2023 index (3 pages; `?page=0` returns page 1) and 2020 index (3 pages).
  - Mike Holt product PDFs 1694808856, 1690397573 and 1674235054. All are tables of contents; no NFPA notice.
  - NC OSFM interpretation index and 2023 amendments v3.
  - Clark County SNBO 2023 amendments.
  - WAC 296-46B-110, -210, -215, -230, -240 and -250.
  - hfmmagazine NFPA weekly update (Apr 21–25, 2025).
  - NEMA code-alerts page.
  - Mike Holt forum "2029 future PI 110.14(C)".
  - Eaton bus-ele-br-11318, coverage check only.
  - MN DLI 2026 change summary (only a 310.15(E) line).
  - Oregon OESC 2026 Table 1-E.
- **Avoided:** origin.golfpride.com, which served an Eaton SPD page on an unrelated domain (looks like a mirror). Not fetched.

## Open gaps

1. **110.14(C) 2023 verbatim text, including the motor design letters.** Still tier 4 only. The best remaining routes:
   - a person reading NFPA's free-access 2023 viewer;
   - a 2023 reproduction carrying a permission notice (IAEI or a connector manufacturer), found by search, which needs search budget;
   - the CMP-1 First Draft beyond Table A.1(a), which is unreachable through WebFetch.
   - 2026: no Second Revision; the First Draft stage is still unknown.
2. **334.80 and 340.80 NEC 2023 base text.** Not reachable. WA and MA deviations are verified and need state notes on the site.
3. **210.19 household-range rule (8¾ kW, 40 A), its 2023 item number, the 210.19 grounded-conductor exception, and the 210.19 voltage-drop note wording and number.** The CMP-2 PI and SD files are swamped by Article 120 material (round 2).
4. **230.42(A)(1) Exception No. 2 wording (CONFLICTING) and 230.42(A)(2).**
5. **310.15(E) and 310.15(F) 2023 wording.** Next: P06 PISubmittals, though the 310.15 PIs may lie beyond the visible window.
6. **250.122(A) and (B) 2023 wording**, including the "not required to be larger than the circuit conductors" sentence and any qualified-person exception.
7. **625.41, 625.50 and 625.17 (2023 wording).** No 2026 Second Revision exists on 625.41 or 625.50, so a 2026 reproduction would also show the 2023 wording, unless a First Revision changed it.
8. **110.15 2023 wording,** including the exception that 2026 deletes.
9. **240.4(D)(4)–(D)(8) 2023 and the 240.6(A) fuse-only sentence.** Unchanged from round 2.
10. **TIAs 70-23-14 to 23-20 and Errata 70-23-1 to 23-6.** Their sections were not checked individually. EC&M's list of the 2025 proposals has no target section, but the errata are unknown.
11. **Final 2026 numbering** of 215.4 and 215.5, and the final text of every 2026 draft item above.
