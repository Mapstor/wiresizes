# R4-8: NFPA document leads (210.19, 230.42/240.6/225.39, Art. 430/440, 625/630, 250.x, 334.80/340.80/310.15, 2022 CAM record)

Agent R4-8, wiresizes.com primary sourcing, round 4. Target edition: NFPA 70-2023.

**Retrieval date for every new item: 2026-10-24.** PREAMBLE-R4 asks for 2026-10-20 on every retrieval, but that date would be false for this run. Items carried from other reports keep their own dates.

**Budget used**
- WebSearch: **12 of 12** (listed in §5).
- docinfofiles.nfpa.org: **8 of 12 network fetches. No HTTP 429 was identified.**
  - One more attempt was refused by the session URL allowlist before any request was made.
  - 4 fetches were left unused on purpose (see "Access conditions").
- Other hosts: goodreads.com (1), dli.mn.gov (2), ncosfm.gov (1). All were used in earlier rounds, so no new host needs approval.

## Access conditions on 2026-10-24 (these decide every result below)

1. **The session URL allowlist.**
   - WebFetch now accepts only URLs that a WebSearch or WebFetch in this session returned, or that a person pasted. A URL built from a file-name pattern is refused before any request is sent. R4-7 saw the same thing after its pause.
   - **Not in the search index (so not fetchable):**
     - the 2023-cycle First Draft ballots for CMP-2, CMP-10, CMP-11 and CMP-12;
     - the 2023-cycle PC files for CMP-6 and CMP-12;
     - every 2026-cycle `FD_PIResponses` file for CMP-5, CMP-6, CMP-11 and CMP-12.
2. **Large NFPA PDFs no longer extract.**
   - Five large NFPA PDFs came back as "[binary data]". One of them is the CMP-5 2023-cycle First Draft ballot that R4-2 read on 2026-10-20.
   - A short NFPA decision (D#25-5) extracted normally, and so did a small state PDF.
   - **So the large-compilation route is closed today, even with a valid URL.** That route covers First Draft ballots, SR/PC/PI compilations and meeting packets.
3. **Two search-indexed 2023-cycle PC files return CLIENT_ERROR** (CMP-2 and CMP-10, `_SD_PCStatements.pdf`).
   - The CMP-11 file and D#25-5 were both served between those two errors, so this is not a rate-limit pattern.
   - The two files are probably gone from the host or cannot be served.
4. **Correction to the brief's file-name note.** The 2023-cycle PC compilations exist under both names:
   - `_SD_PCStatements.pdf` is indexed for CMP-2, CMP-10 and CMP-11.
   - `_SD_PCSubmittals.pdf` served text for CMP-9 on 2026-10-20 (R4-3, item N13).
   - Neither name was found for CMP-6 or CMP-12.

---

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1 | 210.19 household-range rule (2023 letter, 8¾ kW, 40 A, tap and neutral exceptions) | **UNVERIFIED** (no change) | none | CMP-2 2023-cycle FD ballot: refused by the allowlist (not in the index). CMP-2 PC file: CLIENT_ERROR |
| 2a | 230.42(A)(1) Exception No. 2 | **CONFLICTING** (no change) | none | CMP-10 2023-cycle FD ballot: not in the index. CMP-10 PC file: CLIENT_ERROR |
| 2b | 240.6(A) fuse-only "additional standard ratings" sentence | **CONFLICTING** (no change) | none | Same CMP-10 routes as 2a |
| 2c | 225.18, 225.31(B) | VERIFIED-2023 by R4-5 (base text in the 2026 First Draft); not re-fetched | R4-5 | Nothing new |
| 2d | 225.39(A)–(D) ampere values | **UNVERIFIED for 2023** (no change; R4-5 has them as 2020 values) | none | Same CMP-10 routes as 2a |
| 2e (new) | **240.4(B): adjustable-trip setting provision; conditions (B)(1)–(B)(3) still apply** | **VERIFIED-2023 (government paraphrase)**: 2 pulls agree, 4 of 4 canaries rejected | Minnesota Board of Electricity, NEC 2023 Adoption Review Committee minutes, 22 Sep 2022 | SR-8283's adjustable-trip content reached the issued 2023 code, so condition 3 is met at content level. Whether the closing sentence opens "If" or "Where" is still open |
| 2f (new) | **240.4(D)(3) 14 AWG copper-clad aluminum, added in 2023** | **VERIFIED-2023 (government paraphrase)**; corroborates the Leviton reprint | Same MN minutes | The copper-clad aluminum appeal (row 7b) did not remove it |
| 3a | 430.22 lead-in (125 %) and Table 430.22(E) | **UNVERIFIED** (no change) | none | CMP-11 2023-cycle PC file: "[binary data]". CMP-11 2026-cycle PIResponses: not in the index |
| 3b | 430.32(A)(1) | **UNVERIFIED** (no change) | none | Same as 3a |
| 3c | 440.32; 440.62–440.64 | **UNVERIFIED** (no change) | none | Same as 3a |
| 4a | 625.41, 625.50, 625.17(A) | **UNVERIFIED** (no change) | none | CMP-12 PC file and PIResponses: not in the index. CMP-12 2026 FD meeting packet: "[binary data]" |
| 4b | 630.11(A) incl. I1eff, Table 630.11(A), 630.11(B) | **UNVERIFIED** (no change) | none | Same as 4a |
| 5a | 250.122(A) 2023 wording | **UNVERIFIED** (2026 Second Draft wording only, R4-2) | none | CMP-5 2026-cycle PIResponses: not in the index |
| 5b | Table 250.122 caption suffix | **CONFLICTING** (label only; no change) | none | Same as 5a |
| 5c | 250.66(A)–(C) and Table 250.66 (2023 printing) | **UNVERIFIED** (no change) | none | Same as 5a |
| 5d | 250.32(B)(1) | **UNVERIFIED for 2023** (no change) | none | Same as 5a |
| 6 | 334.80, 340.80, 310.15(E), 310.15(F) | **UNVERIFIED** (no change) | none | CMP-6 2023-cycle PC file: real name not found by search. CMP-6 2026-cycle PI compilation: "[binary data]". CMP-6 PIResponses: not in the index |
| 7a | 2022 Technical Meeting record per CAM (sections and outcomes) | **NOT FOUND** | none | NFPA's CAM substantiation compilation (Part 2): "[binary data]". The name of the A2022 Motions Committee report is still unknown. 7 searches spent |
| 7b (new) | **Standards Council appeals on the 2023 NEC** | **PARTIAL**: one NFPA statement, single pull | NFPA blog post, 31 Aug 2022 | **14 appeals**, which "resulted in 18 amendments and four concurrently issuing" TIAs. Topics: optical fiber cable, CCA wiring, SPDs, GFCI protection, swimming pool bonding. Issued 12 Aug 2022; effective 1 Sep 2022 |
| 7c (new) | **Condition-3 map for every round-4 verified-sd2023 item** | **ANALYSIS** (not the CAM record) | Block r4_8_04 | Met: 240.4(D)(1)–(3); 240.4(B) content; 250.122(B) main sentence; 430.110(A); 440.22(A) values; 625.40; 625.42. Open: 110.14(C); 240.4(D)(4)–(8); 314.16(B)(5); 314.27(E); Ch. 9 Table 4 IMC; Table 300.5(A); 430.52(C)(1)(b); 625.54 core sentence (GFCI topic overlap); 625.44(3) |
| 8 (incidental) | Standards Council D#25-5 (2026 edition) | VERIFIED-other-edition (2026) | NFPA decision document | 210.8(F) Exception No. 2 appeals denied; CC 7584 is not in 2026. No target section |
| 9 (incidental) | North Carolina 2023 amendments | No target section | ncosfm.gov | Prints "January 1, 2025" as the effective date. nec-adoption.json says NC's 2023 code is on indefinite delay. Pointer for R4-6; not checked here |

---

## 2. Evidence

### 2.1 Target 7: the 2022 Technical Meeting and Standards Council record (condition 3 of verified-sd2023)

**What NFPA published about the Standards Council's work on the 2023 NEC (new)**
- **Document:** NFPA blog post, "Now Issued, We Thank Those That Brought the 2023 NEC to the Top of the Mountain".
  - Author shown: National Fire Protection Association (NFPA). Posted August 31, 2022, 17:00.
  - Read through the goodreads author-blog mirror of NFPA's blog, a host that R4-2 and R4-5 also used.
  - https://www.goodreads.com/author_blog_posts/22876842-now-issued-we-thank-those-that-brought-the-2023-nec-to-the-top-of-the
  - Permission notice: none captured. Retrieved 2026-10-24, single pull.
- **Quote segments:**
  - "The NFPA Standards Council has voted to issue the 2023 National Electrical Code® (NEC®)" / "with an effective date of September 1, 2022."
  - "During the meeting, the 55 CAMs for the 2023 NEC were presented" / "and most were debated by membership on the meeting floor."
  - "In early August, the NFPA Standards Council heard fourteen appeals related to the 2023 NEC," / "which after the voting of the Council resulted in 18 amendments and four concurrently issuing" / "Tentative Interim Amendments (TIAs)."
  - "Some of the topics of the appeals that were heard dealt with optical fiber cable," / "copper-clad aluminum wiring, surge protection devices, GFCI protection, and swimming pool bonding."
  - "the Council set an issuance date for the 2023 NEC as August 12, 2022," / "and the aforementioned effective date as September 1, 2022."
- **Why it matters.** Condition 3 is not only about floor motions. The Standards Council's appeal decisions also changed text before issuance. No earlier report had this.
- **The "18 amendments" sentence can be read two ways:**
  - amendments the Council made when it decided the appeals; or
  - the final count of floor amendments after the Council's votes. IAEI (R4-2) says 18 CAMs passed on the floor.

  **Neither reading may be cited.** The per-appeal decisions would settle it.
- **The four concurrent TIAs are probably TIAs 23-3 to 23-6:**
  - 23-3: 210.8(F) Exception No. 2
  - 23-4: 215.15
  - 23-5: 555.30
  - 23-6: 555.35

  This is an inference. In R4-7's TIA table, these four have the issue date Aug 12, 2022 and the effective date Sep 1, 2022, the same dates as the edition. The NFPA post does not number them.
- **Corroboration (state government, two pulls):** Minnesota NEC 2023 Adoption Review Committee minutes, 22 Sep 2022.
  - Its list of 2023-cycle submissions ends "441 Correlating Notes", then "55 Certified Amending Motions".
  - It gives no pass/fail counts.

**What was not found**
- The A2022 Motions Committee (NITMAM) report. R4-3 and R4-5 had already tried `/70/NITMAM_MC_Report_A2022.pdf` (CLIENT_ERROR).
- The Standards Council's August 2022 minutes and decision files (D#22-x).
  - Three searches (6, 7 and 11) returned only the minutes for December 2022, August 2023 and August 2025, plus 2025 decisions.
  - Search 12 targeted the agenda-item numbering "SC#22-8" and found nothing.
- NFPA's CAM substantiation compilation:
  - Part 2: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/2022_Submitter_Substantiations_Committee_Statements_Part_2.pdf (title in the index: "Motion Substantiation Certified Amending Motion 70-33 June 2022"). Fetched; returned "[binary data]".
  - Part 1: not in the index.
- **So no section in data/verified can be cleared or flagged by the CAM record itself.**

**Condition-3 map** (block r4_8_04). This is my analysis of evidence already fetched, not the CAM record.
- A post-issuance source is a 2023 reprint carrying NFPA's notice, a 2026-cycle base text, or a government review of the issued code.
- Where such a source prints the text, the TM/SC question is moot.
- "Topic overlap" means the item's subject is one of the five appeal topics.

| Item (data file) | Basis | Post-issuance 2023 evidence | Appeal-topic overlap | TIA/errata overlap | Condition 3 |
|---|---|---|---|---|---|
| 110.14(C), all parts (nec-110-14c.json) | SR-7793 | none | none | none (TIAs 23-1 to 23-20; errata 1–5, 9) | **open** |
| 240.4(D)(1)–(D)(3) (nec-240-4-d.json) | Leviton/Eaton 2023 | yes; MN minutes repeat (D)(3) | CCA (moot) | none | met |
| 240.4(D)(4)–(D)(8) (nec-240-4-d.json) | SR-8285 | partial: Leviton's lead-in cites "(D)(1) through (D)(8)" | **CCA**: (D)(5) and (D)(7) are the Al/CCA items | none | **open (low risk)** |
| 240.4(B), heading, (1)–(3), adjustable trip (R4-2 block 02) | SR-8283 | **yes: MN minutes (block r4_8_02)** | none | none | met at content level |
| 250.122(B), main sentence (nec-250-122.json) | SR-8071 | yes: same sentence in the 2026 SD base (R4-2) | none | errata 6–8 unseen; R4-7's lead puts a fix in 250.122(D)(2) | met |
| 250.122(B), Exception and GEMI note | SR-8071 vs 2026 SR-8360 | conflicting | none | as above | **open (CONFLICTING)**. A passed CAM or a 2026 FR could each explain the difference; neither was seen |
| 314.16(B)(5) (nec-314-16.json) | SR-7528 | none | none | TIAs 23-10/23-18 touch 314.29(A) only | **open** |
| 314.27(E) (nec-314-16.json) | SR-7535 | none | none | as above | **open** |
| Ch. 9 Table 4, IMC (R4-3) | SR-8183 | none | none | none | **open** |
| Table 300.5(A) (R4-5) | SR-8551 | none | none | none | **open** |
| 430.52(C)(1)(b)(2)–(4) (nec-430-440-2023.json) | SR-7526 | partial: Eaton's table notes show the (C)(1)(a)/(b) names, not the percentages | none | TIA 23-20 adds 430.132 only | **open** |
| 430.110(A), 115 % | SR-7538 | yes: 2026 FD base text (A4, R4-4) | none | none | met |
| 440.22(A), 175/225/15 | SR-7605 | yes: Eaton 2023 (values) | none | none | met for values |
| 625.40, 625.42 | Leviton 357 | yes | none | none | met |
| **625.54, core sentence** (R4-4 proposal) | SR-7731 | **tier 4 only**: R4-4's "TIA 1892 base" is **2026** text, not post-issuance 2023 text | **GFCI protection** | none | **open (topic overlap)** |
| 625.44(A)(3)/(B)(3), 14-60R intent | SR-7725/7727 | none | none | none | **open** |

Items from 2026-cycle base texts or 2023 reprints are post-issuance by construction. That covers nec-220-2023.json, 215.2/215.3/230.42(A)(1) Exception No. 1, the 310 tables, Table 240.6(A), 225.18/225.31, and the Leviton-based 210.8/230.67/230.85 items. TIA-based items (680.26(B)(2), TIA 23-9) are final text, so condition 3 does not apply to any of them. Note that TIA 23-3 is temporary: its 210.8(F) Exception No. 2 expired 1 Sep 2026 (R4-7).

### 2.2 Target 2 (new carry-through evidence): 240.4(B) and 240.4(D)(3) in the issued 2023 code

- **Document:** "Meeting Minutes: NEC 2023 Adoption Review Committee (Board of Electricity)", Sept. 22, 2022. Meeting held at DLI, St. Paul, Minnesota.
  - The lines are from the Item 4A presentation by Dean Hunter.
  - https://dli.mn.gov/sites/default/files/pdf/minutes-NEC23-092222.pdf
  - Tier 3 (state government). No permission notice. Retrieved 2026-10-24.
- **Pull 1 (data) gave these lines. Pull 2 matched lines 2–4 and rejected all four canaries with the printed words:**
  1. "Requirements of 240.4(B)(1), 240.4(B)(2), and 240.4(B)(3) still apply." Canary "(B)(4)" was rejected.
  2. "Adjustable trip overcurrent protective devices are permitted to have an ampacity value set that does not exceed"
  3. "the next higher standard overcurrent protection device ampacity value [per Table 240.6(A)] above"
  4. "the ampacity of the conductors being protected."
  5. "Adjustable trip overcurrent protective device must be provided with restricted access per 240.6(C)." Canary "240.6(B)" was rejected.
  6. "Has been added to align with other small conductors permitted per 240.4(D)." Canary "240.4(E)" was rejected.
     - Pull 2 places it under "240.4(D)(3) 14 AWG Copper-Clad Aluminum".
     - The sentence before it (single pull) reads: "14 AWG copper-clad aluminum was added to the list of permitted small conductors."
  7. "55 Certified Amending Motions". Canary "65" was rejected.
- **Context as reported by the extractor (not a quote):** lines 1–5 sit under "Chapter 2; 240.4(B) Overcurrent Devices Rated 800 Amperes or Less".
- **Effect:**
  - R4-2's SR-8283 item gains a post-issuance government source for the adjustable-trip provision and the three conditions. Condition 3 is met for that content.
  - The paraphrase does not give NEC wording, so whether the sentence opens "If" or "Where" stays open.
  - For 240.4(D), a post-issuance review still lists 14 AWG CCA, so the CCA appeal did not remove (D)(3).
- **Single-pull negative:** the minutes do not mention 110.14, 210.19, 230.42, 250.66, 250.122, 310.15, 334.80, 340.80, 430.22, 430.32, 440.32, 440.62, 625.41, 625.50 or 630.11.

### 2.3 Targets 1–6: routes tried and why each failed

| Target | Planned document | What happened | What it would give if it could be read |
|---|---|---|---|
| 1 (210.19) | `70_A2022_NEC_P02_FD_BallotFinal.pdf` | Refused by the allowlist before any request. Search 1 (exact name) did not return it | The 2023-cycle FR that reorganized 210.19 into (A)–(D), if one exists. SR-8042 changed only the main paragraph, so the range text is First Draft text |
| 1 (alternative) | `70_A2022_NEC_P02_SD_PCStatements.pdf` (indexed: first item "Public Comment No. 894-NFPA 70-2021 [ Global Input ]") | CLIENT_ERROR | A PC on 210.19 would reprint the 2023 First Draft text |
| 2 | `70_A2022_NEC_P10_FD_BallotFinal.pdf` | Not in the index | The FRs on 230.42 and 240.6(A) (the 10 A breaker rating was added at First Draft: no A2022 SR on 240.6(A)) |
| 2 (alternative) | `70_A2022_NEC_P10_SD_PCStatements.pdf` (indexed: "Public Comment No. 1394-NFPA 70-2021 [ Global Input ]") | CLIENT_ERROR | PCs on 230.42, 240.6(A) or 225.39 |
| 3 | `70_A2022_NEC_P11_SD_PCStatements.pdf` (indexed: "Public Comment No. 1096-NFPA 70-2021 [ Global Input ]") | "[binary data]" | PCs on 430.22, 430.32 and 440.x, if any. The CMP-11 2023-cycle SR compilation cites no PC on these sections (R4-4), so any such PC was rejected |
| 3 | `70_A2025_NEC_P11_FD_PIResponses.pdf` | Not in the index (search 9, extended) | 2026-cycle PIs 811–813 reprint 440.62–440.64 |
| 4 | `70_A2022_NEC_P12_SD_PCStatements.pdf`, `70_A2025_NEC_P12_FD_PIResponses.pdf` | Neither is in the index (searches 8 and 9) | 625.41 (the Whitney PI) and 630.11 |
| 4 (substitute) | `70_A2025_NEC_P12_FD_MeetingAgenda_0124.pdf` | "[binary data]" | Task-group reports might reprint PIs |
| 5 | `70_A2025_NEC_P05_FD_PIResponses.pdf` | Not in the index | PIs on 250.122, 250.66 and 250.32 reprint 2023 text and captions |
| 6 | A2022 CMP-6 PC file | Neither name found (searches 2, 4, 8) | PCs on 334.80, 340.80 and 310.15 |
| 6 | `70_A2025_NEC_P06_PISubmittals.pdf` (indexed; never read before) | "[binary data]" | 2026-cycle PIs on 310.15(E)/(F) reprint 2023 text |
| 6 | `70_A2025_NEC_P06_FD_PIResponses.pdf` | Not in the index | Same as above |

**Target 5 pointer (R4-7's work, not mine).** R4-7 found a state-government lead (Indiana DHS) to an unseen NFPA erratum. It corrects 250.122(D)(2) by adding "(a)" after "430.52(C)(1)" and deleting "Exception No. 1". So 2023's 250.122 still has a (D)(2) motor-circuit item. This does not settle the Table 250.122 caption.

### 2.4 Incidental items

- **D#25-5 (2026 edition).** NFPA, "Standards Council Decision (Final): D#25-5", NFPA 70 2026 Edition.
  - Date of decision: 20 August 2025. Cover letter: 4 September 2025. Agenda item: SC#25-8-6-o-1_o-3_o-5.
  - Three appeals were consolidated (Bixby/ACCA, Koffel/AHRI, Sprague/Mitsubishi). They concern 210.8(F) Exception No. 2: Committee Comment 7584 (from SR 7584), PC 1820, and CAM 70-130/70-160.
  - "The Standards Council voted to deny the appeal seeking to overturn the results of the NFPA Membership" / "at the 2025 Technical Session of CAM 70-130/70-160 and to Accept Committee Comment No. 7584."
  - Effect: "will not include the text of" / "Committee Comment No. 7584 in the 2026 edition."
  - Single pull.
  - Relevant only to the site's 2026 210.8(F) notes.
- **North Carolina.** "NORTH CAROLINA ELECTRICAL CODE, 2023 EDITION" (ncosfm.gov; it calls itself "a recreated compact version").
  - Adopted Dec 12, 2023; effective date printed as January 1, 2025.
  - It amends 210.8, 210.12(E), 230.71(B), 230.85, 250.50, 250.53(A)(2), Table 300.5, 334.15(C), 680.x and others.
  - **It amends none of the R4-8 targets.**
  - The printed effective date differs from nec-adoption.json, which says the NC 2023 code is on indefinite delay. The delay may postdate this document, so this is a pointer for R4-6, not a contradiction.

---

## 3. Machine-readable

One JSON block per item. Each block was written to its own file in /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_tmp/r4_8/ and validated with `python3 -I -c "import json,sys; json.loads(sys.stdin.read())" < block.json`. No quote segment reaches 120 characters. Builder script: /tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research2/r4_8_work/scripts/build_json.py.

**Block 01: NFPA 70-2023 issuance record (TM CAMs and Standards Council appeals)** (`r4_8_01.json`)

```json
{"ref": "NFPA 70-2023 issuance record: 2022 Technical Meeting CAMs and Standards Council appeals (condition 3 of verified-sd2023)", "edition": "2023 (A2022 revision cycle)", "status": "PARTIAL: counts, appeal topics and dates seen in an NFPA statement (single pull); per-CAM and per-appeal records NOT seen", "values": {"cams_presented": 55, "cam_floor_outcomes": {"passed": 18, "failed": 23, "not_pursued": 14, "source": "carried from R4-2 (IAEI NFPA Code Talk, Hannahs, 31 Aug 2022); not re-fetched by R4-8"}, "sc_appeals_heard": 14, "sc_result_as_printed": "resulted in 18 amendments and four concurrently issuing Tentative Interim Amendments (TIAs)", "sc_result_reading": "ambiguous: '18 amendments' may be amendments the Council made on appeal, or the final count of floor amendments (IAEI: 18 CAMs passed) after the Council's votes. Do not cite either reading.", "concurrent_tias_inferred": ["23-3 (210.8(F) Exception No. 2)", "23-4 (215.15)", "23-5 (555.30)", "23-6 (555.35)"], "concurrent_tias_basis": "inferred: R4-7's TIA table gives these four the issue date Aug 12, 2022 and effective date Sep 1, 2022, the same as the edition; the NFPA post does not number them", "appeal_topics": ["optical fiber cable", "copper-clad aluminum wiring", "surge protection devices", "GFCI protection", "swimming pool bonding"], "issuance_date": "2022-08-12", "effective_date": "2022-09-01"}, "quote_segments": ["The NFPA Standards Council has voted to issue the 2023 National Electrical Code® (NEC®)", "with an effective date of September 1, 2022.", "During the meeting, the 55 CAMs for the 2023 NEC were presented", "and most were debated by membership on the meeting floor.", "In early August, the NFPA Standards Council heard fourteen appeals related to the 2023 NEC,", "which after the voting of the Council resulted in 18 amendments and four concurrently issuing", "Tentative Interim Amendments (TIAs).", "Some of the topics of the appeals that were heard dealt with optical fiber cable,", "copper-clad aluminum wiring, surge protection devices, GFCI protection, and swimming pool bonding.", "the Council set an issuance date for the 2023 NEC as August 12, 2022,", "and the aforementioned effective date as September 1, 2022."], "source_url": "https://www.goodreads.com/author_blog_posts/22876842-now-issued-we-thank-those-that-brought-the-2023-nec-to-the-top-of-the", "source_title": "NFPA blog post 'Now Issued, We Thank Those That Brought the 2023 NEC to the Top of the Mountain', author National Fire Protection Association (NFPA), posted August 31, 2022 17:00 (goodreads author-blog mirror of NFPA's blog; host used by R4-2 and R4-5)", "permission_notice": null, "retrieved": "2026-10-24", "corroboration": [{"source_url": "https://dli.mn.gov/sites/default/files/pdf/minutes-NEC23-092222.pdf", "source_title": "Minnesota Board of Electricity, NEC 2023 Adoption Review Committee, Meeting Minutes, Sept. 22, 2022 (meeting at DLI, St. Paul); lines from the Item 4A presentation by Dean Hunter", "quote_segments": ["55 Certified Amending Motions"], "note": "last item of a list of 2023-cycle submissions after '441 Correlating Notes'; no pass/fail counts (two pulls)"}]}
```

**Block 02: 240.4(B) adjustable-trip provision and conditions (1)-(3) in the issued 2023 code** (`r4_8_02.json`)

```json
{"ref": "240.4(B) (2023): adjustable-trip setting provision; conditions (B)(1)-(B)(3) still apply", "edition": "2023 (as issued; state committee review of the 2023 NEC dated Sept. 22, 2022)", "status": "VERIFIED-2023 (government paraphrase; two pulls agree; 4 of 4 canaries rejected). NEC wording itself not shown", "values": {"adjustable_trip_setting_limit": "not exceeding the next higher standard rating [per Table 240.6(A)] above the ampacity of the conductors protected", "restricted_access_reference": "240.6(C)", "conditions_still_apply": ["240.4(B)(1)", "240.4(B)(2)", "240.4(B)(3)"]}, "context_as_reported": "extractor places these lines under 'Chapter 2; 240.4(B) Overcurrent Devices Rated 800 Amperes or Less' (context, not a quote)", "quote_segments": ["Requirements of 240.4(B)(1), 240.4(B)(2), and 240.4(B)(3) still apply.", "Adjustable trip overcurrent protective devices are permitted to have an ampacity value set that does not exceed", "the next higher standard overcurrent protection device ampacity value [per Table 240.6(A)] above", "the ampacity of the conductors being protected.", "Adjustable trip overcurrent protective device must be provided with restricted access per 240.6(C)."], "sd2023_link": "R4-2 block r4_2_02 (SR-8283): this government review of the issued 2023 code shows the adjustable-trip provision and conditions (1)-(3) reached the 2023 edition, so condition 3 is met at content level for those parts. The exact closing-sentence wording ('If' or 'Where') stays open.", "source_url": "https://dli.mn.gov/sites/default/files/pdf/minutes-NEC23-092222.pdf", "source_title": "Minnesota Board of Electricity, NEC 2023 Adoption Review Committee, Meeting Minutes, Sept. 22, 2022 (meeting at DLI, St. Paul); lines from the Item 4A presentation by Dean Hunter", "permission_notice": null, "retrieved": "2026-10-24", "canaries": [{"planted": "240.4(B)(1), 240.4(B)(2), and 240.4(B)(4) still apply", "rejected": true, "printed": "240.4(B)(1), 240.4(B)(2), and 240.4(B)(3) still apply"}, {"planted": "restricted access per 240.6(B)", "rejected": true, "printed": "restricted access per 240.6(C)"}, {"planted": "small conductors permitted per 240.4(E)", "rejected": true, "printed": "small conductors permitted per 240.4(D)"}, {"planted": "65 Certified Amending Motions", "rejected": true, "printed": "55 Certified Amending Motions"}]}
```

**Block 03: 240.4(D)(3) 14 AWG copper-clad aluminum in the issued 2023 code** (`r4_8_03.json`)

```json
{"ref": "240.4(D)(3) 14 AWG copper-clad aluminum (added in 2023)", "edition": "2023 (as issued)", "status": "VERIFIED-2023 (government paraphrase). Second segment: two pulls agree, canary '240.4(E)' rejected; first segment: single pull. Corroborates the Leviton 2023 reprint already used in nec-240-4-d.json", "values": {"item": "(D)(3)", "conductor": "14 AWG copper-clad aluminum", "change": "added in the 2023 edition"}, "context_as_reported": "extractor places these lines under '240.4(D)(3) 14 AWG Copper-Clad Aluminum' (context, not a quote)", "quote_segments": ["14 AWG copper-clad aluminum was added to the list of permitted small conductors.", "Has been added to align with other small conductors permitted per 240.4(D)."], "note": "The 2022 appeals included a copper-clad aluminum topic (block r4_8_01). A post-issuance government review still lists 14 AWG CCA in 240.4(D), so that appeal did not remove it. It says nothing about the values of (D)(5) and (D)(7) (aluminum and CCA).", "source_url": "https://dli.mn.gov/sites/default/files/pdf/minutes-NEC23-092222.pdf", "source_title": "Minnesota Board of Electricity, NEC 2023 Adoption Review Committee, Meeting Minutes, Sept. 22, 2022 (meeting at DLI, St. Paul); lines from the Item 4A presentation by Dean Hunter", "permission_notice": null, "retrieved": "2026-10-24", "canaries": [{"planted": "small conductors permitted per 240.4(E)", "rejected": true, "printed": "small conductors permitted per 240.4(D)"}]}
```

**Block 04: condition-3 risk map for round-4 verified-sd2023 items (analysis, not the CAM record)** (`r4_8_04.json`)

```json
{"ref": "Condition-3 risk map for round-4 verified-sd2023 items (NOT the CAM record)", "edition": "2023", "status": "ANALYSIS of fetched evidence: says, per item, whether a post-issuance source already shows the text (making the CAM/appeal question moot) and whether the item's topic overlaps an appeal topic. The per-CAM record was not seen, so 'open' items may or may not have been touched by a CAM", "values": {"items": [{"ref": "110.14(C) all parts", "data_file": "nec-110-14c.json", "basis": "SR-7793 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open"}, {"ref": "240.4(D)(1)-(D)(3)", "data_file": "nec-240-4-d.json", "basis": "Leviton/Eaton 2023 reprints", "post_issuance_2023_evidence": "yes: Leviton 2023 node 313; MN DLI 2022 (block r4_8_03)", "appeal_topic_overlap": "CCA ((D)(3)), moot", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "met"}, {"ref": "240.4(D)(4)-(D)(8)", "data_file": "nec-240-4-d.json", "basis": "SR-8285 (A2022 SD)", "post_issuance_2023_evidence": "partial: Leviton 2023 lead-in cites '(D)(1) through (D)(8)'; values not printed in a post-issuance source", "appeal_topic_overlap": "CCA: (D)(5) and (D)(7) are aluminum and copper-clad aluminum items", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open (low risk)"}, {"ref": "240.4(B) heading, conditions (1)-(3), adjustable-trip provision", "data_file": "nec-240-4-d.json (optional rule_240_4_b)", "basis": "SR-8283 (A2022 SD)", "post_issuance_2023_evidence": "yes: MN DLI 2022 government paraphrase (block r4_8_02)", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "met at content level; closing-sentence wording open"}, {"ref": "250.122(B) main sentence", "data_file": "nec-250-122.json", "basis": "SR-8071 (A2022 SD)", "post_issuance_2023_evidence": "yes: same sentence is the 2026 SD base text (R4-2)", "appeal_topic_overlap": "none", "tia_errata_overlap": "errata 70-23-6 to -8 unseen; R4-7's state lead puts a cross-reference fix in 250.122(D)(2), not (B)", "condition_3": "met"}, {"ref": "250.122(B) Exception and GEMI note", "data_file": "nec-250-122.json", "basis": "SR-8071 vs 2026 SD SR-8360", "post_issuance_2023_evidence": "conflicting", "appeal_topic_overlap": "none", "tia_errata_overlap": "as above", "condition_3": "open: CONFLICTING. A passed CAM or a 2026 First Revision could each explain the difference; neither seen"}, {"ref": "314.16(B)(5)", "data_file": "nec-314-16.json", "basis": "SR-7528 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-10 and 23-18 touch 314.29(A) only", "condition_3": "open"}, {"ref": "314.27(E) box-fill sentence", "data_file": "nec-314-16.json", "basis": "SR-7535 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "as above", "condition_3": "open"}, {"ref": "Chapter 9 Table 4, Article 342 IMC", "data_file": "none yet (R4-3)", "basis": "SR-8183 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open"}, {"ref": "Table 300.5(A)", "data_file": "none yet (R4-5)", "basis": "SR-8551 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open"}, {"ref": "430.52(C)(1)(b)(2)-(4)", "data_file": "nec-430-440-2023.json", "basis": "SR-7526 (A2022 SD)", "post_issuance_2023_evidence": "partial: Eaton 2023 table notes show the (C)(1)(a)/(b) renaming, not the percentages", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIA 23-20 adds 430.132 only", "condition_3": "open"}, {"ref": "430.110(A) 115 %", "data_file": "nec-430-440-2023.json", "basis": "SR-7538 (A2022 SD)", "post_issuance_2023_evidence": "yes: 2026 First Draft base text (A4, R4-4)", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "met"}, {"ref": "440.22(A) values 175/225/15", "data_file": "nec-430-440-2023.json", "basis": "SR-7605 (A2022 SD)", "post_issuance_2023_evidence": "yes: Eaton 2023 reprint (values)", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "met for values; paragraph wording open"}, {"ref": "625.40, 625.42", "data_file": "nec-2023-rules-round2.json", "basis": "Leviton 2023 node 357", "post_issuance_2023_evidence": "yes", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "met"}, {"ref": "625.54 core sentence", "data_file": "nec-2023-rules-round2.json (proposed)", "basis": "SR-7731 (A2022 SD)", "post_issuance_2023_evidence": "tier 4 only; the 'TIA 1892 base' cited by R4-4 is 2026 text, not post-issuance 2023 text", "appeal_topic_overlap": "GFCI protection", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open (topic overlap)"}, {"ref": "625.44(A)(3)/(B)(3) 14-60R intent", "data_file": "nec-2023-rules-round2.json (proposed)", "basis": "SR-7725/7727 (A2022 SD)", "post_issuance_2023_evidence": "none", "appeal_topic_overlap": "none", "tia_errata_overlap": "TIAs 23-1 to 23-20 and errata 70-23-1 to -5 and -9: none (R4-1, R4-7)", "condition_3": "open"}]}, "sources": ["https://www.goodreads.com/author_blog_posts/22876842-now-issued-we-thank-those-that-brought-the-2023-nec-to-the-top-of-the", "https://dli.mn.gov/sites/default/files/pdf/minutes-NEC23-092222.pdf", "R4-1, R4-2, R4-3, R4-4, R4-5, R4-7 reports (carried evidence)"], "quote_segments": [], "source_url": "https://www.goodreads.com/author_blog_posts/22876842-now-issued-we-thank-those-that-brought-the-2023-nec-to-the-top-of-the", "permission_notice": null, "retrieved": "2026-10-24"}
```

**Block 05: Standards Council Decision D#25-5 (2026 edition, incidental)** (`r4_8_05.json`)

```json
{"ref": "Standards Council Decision D#25-5 (NFPA 70-2026): 210.8(F) Exception No. 2 appeals", "edition": "2026", "status": "VERIFIED-other-edition (2026; NFPA decision document; single pull)", "values": {"agenda_item": "SC#25-8-6-o-1_o-3_o-5", "date_of_decision": "2025-08-20", "appellants": ["David Bixby (ACCA)", "William Koffel (AHRI)", "Erik Sprague (Mitsubishi Electric US)"], "section": "210.8(F) Exception No. 2", "items": ["Committee Comment No. 7584 (from SR 7584)", "PC 1820", "CAM 70-130/70-160"], "action": "appeal denied; CC 7584 not in the 2026 edition"}, "quote_segments": ["The Standards Council voted to deny the appeal seeking to overturn the results of the NFPA Membership", "at the 2025 Technical Session of CAM 70-130/70-160 and to Accept Committee Comment No. 7584.", "The effect of this action is that the NFPA 70, National Electrical Code, will not include the text of", "Committee Comment No. 7584 in the 2026 edition."], "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/FD_D25_5_SC_25_8_6_o_1_o_3_o_5_NFPA_70.pdf", "source_title": "NFPA, 'Standards Council Decision (Final): D#25-5', NFPA 70, 2026 Edition; cover letter 4 Sept 2025", "permission_notice": null, "retrieved": "2026-10-24", "note": "None of the R4-8 target sections. Fetched as the extraction diagnostic (short NFPA PDFs still extract)."}
```

**Block 06: targets still UNVERIFIED or CONFLICTING, with routes tried** (`r4_8_06.json`)

```json
{"ref": "R4-8 targets still UNVERIFIED or CONFLICTING (2023), with NFPA routes tried", "edition": "2023", "status": "no change from earlier rounds", "values": {"targets": [{"ref": "210.19 household ranges and cooking appliances (letter, 8 3/4 kW, 40 A, tap and neutral exceptions)", "status": "UNVERIFIED", "data_file": "nec-continuous-load-2023.json (note only)", "routes_tried_2026_10_24": ["70_A2022_NEC_P02_FD_BallotFinal.pdf: refused by session URL allowlist (not in search index)", "70_A2022_NEC_P02_SD_PCStatements.pdf: client_error"]}, {"ref": "230.42(A)(1) Exception No. 2", "status": "CONFLICTING", "data_file": "nec-continuous-load-2023.json", "routes_tried_2026_10_24": ["70_A2022_NEC_P10_FD_BallotFinal.pdf: not in search index", "70_A2022_NEC_P10_SD_PCStatements.pdf: client_error"]}, {"ref": "240.6(A) fuse-only additional ratings sentence", "status": "CONFLICTING", "data_file": "nec-240-6-a.json", "routes_tried_2026_10_24": ["same CMP-10 files as above"]}, {"ref": "225.39(A)-(D) ampere values", "status": "UNVERIFIED (2023); VERIFIED-other-edition 2020 per R4-5", "data_file": "none yet", "routes_tried_2026_10_24": ["same CMP-10 files as above"]}, {"ref": "430.22 lead-in (125 %) and Table 430.22(E); 430.32(A)(1)", "status": "UNVERIFIED", "data_file": "nec-430-440-2023.json", "routes_tried_2026_10_24": ["70_A2022_NEC_P11_SD_PCStatements.pdf: '[binary data]'", "70_A2025_NEC_P11_FD_PIResponses.pdf: not in search index"]}, {"ref": "440.32; 440.62-440.64", "status": "UNVERIFIED", "data_file": "nec-430-440-2023.json", "routes_tried_2026_10_24": ["as above"]}, {"ref": "625.41, 625.50, 625.17(A)", "status": "UNVERIFIED", "data_file": "nec-2023-rules-round2.json (not added)", "routes_tried_2026_10_24": ["70_A2022_NEC_P12_SD_PCStatements.pdf and 70_A2025_NEC_P12_FD_PIResponses.pdf: not in search index", "70_A2025_NEC_P12_FD_MeetingAgenda_0124.pdf: '[binary data]'"]}, {"ref": "630.11(A) incl. I1eff, Table 630.11(A), 630.11(B)", "status": "UNVERIFIED", "data_file": "nec-430-440-2023.json", "routes_tried_2026_10_24": ["as for 625"]}, {"ref": "250.122(A) 2023 wording; Table 250.122 caption suffix", "status": "UNVERIFIED / CONFLICTING (label only)", "data_file": "nec-250-122.json", "routes_tried_2026_10_24": ["70_A2025_NEC_P05_FD_PIResponses.pdf: not in search index"]}, {"ref": "250.66(A)-(C) and Table 250.66 (2023 printing); 250.32(B)(1)", "status": "UNVERIFIED", "data_file": "nec-250-66.json; none for 250.32", "routes_tried_2026_10_24": ["as above"]}, {"ref": "334.80, 340.80, 310.15(E), 310.15(F)", "status": "UNVERIFIED", "data_file": "none (nec-cable-rules is GAP)", "routes_tried_2026_10_24": ["A2022 CMP-6 PC file: real name not found by search", "70_A2025_NEC_P06_PISubmittals.pdf: '[binary data]'", "70_A2025_NEC_P06_FD_PIResponses.pdf: not in search index"]}]}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-24"}
```

---

## 4. Registry impact (research/data-sources.csv)

**Domains this round cannot move.** No target in 1–6 was verified, so none of these changes status. Each one gets a dated note, and the data files keep their values:
- nec-continuous-load
- nec-feeders-outbuildings
- nec-430-motors
- nec-440-hvac
- nec-630-welders
- nec-250-grounding
- nec-grounding-rules
- nec-cable-rules

**No value in data/verified is contradicted.**

**Text for every condition-3 field.** Use this in nec-110-14c.json (`verified_sd2023_conditions`), in the (D)(4)–(D)(8) row statuses of nec-240-4-d.json, in nec-314-16.json and in nec-430-440-2023.json, and in the proposed 250.122(B), 625.54 and Table 300.5(A) items:
> "Condition 3 (checked 2026-10-24): 2022 Technical Meeting per-CAM results and Standards Council per-appeal decisions not seen. NFPA (blog, 31 Aug 2022): 55 CAMs; 14 appeals 'resulted in 18 amendments and four concurrently issuing' TIAs (by date, TIAs 23-3 to 23-6); appeal topics optical fiber cable, copper-clad aluminum wiring, surge protection devices, GFCI protection, swimming pool bonding."

Then add the item's overlap from the map in §2.1: none, CCA or GFCI.

### nec-240-ocpd: stays verified, with one addition
- **Proposed coverage line.** This is R4-2's line plus the two Minnesota confirmations:
  > "Table 240.6(A) standard ratings 10–6000 A (38 values, 2023, Eaton reprint); 240.4(D)(1)–(D)(8) item numbers and ampere limits (2023-cycle Second Draft SR-8285, 2 pulls, 6 canaries rejected; (D)(1)–(D)(3) also in 2023 Eaton/Leviton reprints; (D)(3) 14 AWG CCA also in Minnesota Board of Electricity 2023 review minutes); 240.4(B) heading, 3 conditions, 800 A cap (SR-8283); adjustable-trip provision and conditions (1)–(3) confirmed in the issued 2023 code by Minnesota Board of Electricity review minutes, 22 Sep 2022 (government paraphrase)"
- **Proposed sample_note:**
  > "Fuse-only additional ratings still CONFLICTING: no A2022 SR on 240.6(A); the A2022 CMP-10 PC file returns CLIENT_ERROR and its First Draft ballot is not in the search index (2026-10-24). Copper-clad aluminum wiring was a 2022 appeal topic (NFPA, 31 Aug 2022); a post-issuance government review still lists 14 AWG CCA in 240.4(D)."
- **nec-240-4-d.json:**
  - If R4-2's optional `rule_240_4_b` block is added, give it:
    > `"condition_3": "met at content level: Minnesota Board of Electricity, NEC 2023 Adoption Review Committee minutes, 22 Sep 2022 (government paraphrase, 2 pulls, 4 of 4 canaries rejected); 'If'/'Where' wording open"`
  - For rows (D)(4)–(D)(8), extend "TM/SC record not seen" with: "; CCA was a 2022 appeal topic; post-issuance MN review lists (D)(3) 14 AWG CCA".
  - No value changes.
- **nec-240-6-a.json:** unchanged. The fuse-only sentence stays CONFLICTING.

### nec-continuous-load: no change
- **Coverage line stays:**
  > "210.19(A)(1)/(2), 210.20(A), 215.2(A), 215.3, 230.42(A) (125 % of continuous load + 100 % noncontinuous; OCPD the same); 215.2(A) Informational Notes 1–3 on voltage drop"
- **Append to notes:**
  > "R4-8 (2026-10-24): 210.19 household-range rule still UNVERIFIED; 230.42(A)(1) Exception No. 2 still CONFLICTING. A2022 CMP-2/CMP-10 PC files return CLIENT_ERROR; their First Draft ballots are not in the search index."
- **nec-continuous-load-2023.json:** unchanged. Its note "The household-range rule in 210.19 (8¾ kW, 40 A) is unverified…" stays true.

### nec-feeders-outbuildings: no change from R4-5's proposal
- 225.39(A)–(D) values stay UNVERIFIED for 2023.
- Keep R4-5's coverage line and its rule that pages may not state 225.39 minimum ratings as 2023 values.

### nec-430-motors, nec-440-hvac, nec-630-welders: no change (all stay GAP)
- Keep R4-4's proposed coverage lines.
- **Append to each domain's notes:**
  > "R4-8 (2026-10-24): CMP-11 2023-cycle PC compilation returns '[binary data]'; CMP-11/CMP-12 2026-cycle PIResponses and the CMP-12 2023-cycle PC file are not in the search index; 430.22, Table 430.22(E), 430.32(A)(1), 440.32, 440.62–440.64 and 630.11 stay UNVERIFIED."
- **nec-430-440-2023.json:** `unverified_rules` is still correct.

### nec-2023-rule-excerpts (Article 625 part): no change, with one caution on R4-4's proposal
- R4-4 proposes adding 625.54 as verified-sd2023 "with 2026 base text agreeing". **That base text is the TIA 1892 redline, which is 2026-edition text, not post-issuance 2023 text.**
- If the item is added, its status should read:
  > "core sentence verified-sd2023 (SR-7731); condition 3 open: GFCI protection was a 2022 appeal topic and no tier 1–3 post-issuance 2023 source prints 625.54; trailing '210.8' clause CONFLICTING (not rendered)"
- 625.41, 625.50 and 625.17(A) stay out.

### nec-250-grounding and nec-grounding-rules: no change
- **Append to notes:**
  > "R4-8 (2026-10-24): CMP-5 2026-cycle PIResponses not in the search index; Table 250.122 caption suffix and 250.122(A)/250.66/250.32(B)(1) 2023 wording still open."
- **nec-250-122.json:** when `rule_250_122_b` is upgraded (R4-2), add to its exception note:
  > "SR-8071's long exception and GEMI note differ from the 2026 SD's short exception; a 2022 CAM or Standards Council amendment is one possible cause, a 2026 First Revision the other; neither record seen."

### nec-cable-rules: stays GAP
- **Append to notes:**
  > "R4-8 (2026-10-24): A2022 CMP-6 PC file not found under either name; A2025 CMP-6 PI compilation returns '[binary data]'; CMP-6 PIResponses not in the search index."
- The engine treatment stays as R4-1 set it: NM/UF at 60 °C only, no 334.80/340.80 citation, and the conductor count taken from the user.

### Corrections for the coordinator (not data values)
- The brief says the 2023-cycle PC files are named `_SD_PCStatements`, "not `_PCSubmittals`". Both names exist: R4-3 read `70_A2022_NEC_P09_SD_PCSubmittals.pdf` on 2026-10-20.
- The large-PDF regression and the allowlist (see "Access conditions") affect every agent. Until one of them changes, an NFPA fetch is worth spending only on a short document whose URL a search has returned.

---

## 5. Blocked or failed log

**docinfofiles.nfpa.org** (8 network fetches plus 1 refused before sending; no HTTP 429 identified)

| # | File | Result |
|---|---|---|
| — | `70_A2022_NEC_P02_FD_BallotFinal.pdf` | **URL_NOT_ON_ALLOWLIST**: refused before any request. The name was built from the pattern; search 1 did not return it |
| 1 | `2022_Submitter_Substantiations_Committee_Statements_Part_2.pdf` | "[binary data]" |
| 2 | `70_A2025_NEC_P06_PISubmittals.pdf` | "[binary data]" (never read before) |
| 3 | `70_A2022_NEC_P02_SD_PCStatements.pdf` | CLIENT_ERROR (the URL came from search 8) |
| 4 | `70_A2022_NEC_P11_SD_PCStatements.pdf` | "[binary data]" |
| 5 | `FD_D25_5_SC_25_8_6_o_1_o_3_o_5_NFPA_70.pdf` | **Text OK** (short PDF). 2026 210.8(F) decision |
| 6 | `70_A2022_NEC_P10_SD_PCStatements.pdf` | CLIENT_ERROR (the URL came from search 8) |
| 7 | `70_A2025_NEC_P12_FD_MeetingAgenda_0124.pdf` | "[binary data]" |
| 8 | `70_A2022_NEC_P05_FD_BallotFinal.pdf` | "[binary data]". **This repeats a fetch on purpose.** R4-2 read this file on 2026-10-20. The repeat tests whether the failure is new and general (it is) or specific to particular files |

**Other hosts**

| Host / document | Result |
|---|---|
| goodreads.com 22876842, NFPA "Now Issued…" (31 Aug 2022) | Read: target 7 facts |
| dli.mn.gov minutes-NEC23-092222.pdf (2 pulls) | Read: 240.4(B), 240.4(D)(3), CAM count |
| ncosfm.gov 2023 NC amendments | Read: no target section |

**Unlocked but not fetched, with the reason**

| Document | Reason |
|---|---|
| content.nfpa.org Standards Council minutes (Dec 2022, Aug 2023, Aug 2025) and agenda (Mar 2023) | New host. The August 2022 decisions would be in the August 2022 minutes, which were not found |
| D#25-1 | Its TIA Log 1809 is TIA 23-17 on 680.21(C), already covered by R3-4 and R4-7 |
| D#25-2 | Already read in round 1 |
| `70_A2022_NEC_P11_SD_MeetingAgenda_10_21.pdf`, `70_A2025_NEC_P10_SD_MeetingAgenda_1024.pdf` | Large packets; would return "[binary data]" today |
| 2026-cycle PISubmittals for P04, P07, P09, P11, P12, P13 | Large. Earlier windows for P11 and P12 already stop before the target sections |
| nyc.gov TIA 23-10 reprint, CA BSC bulletins, mass.gov BFPR minutes, ASPE/NESA news, EC&M Q&A pages | Not targets, or tier 4 |

**WebSearch: 12 of 12.** S = standard mode, E = extended mode.

| # | Mode | Query | Result |
|---|---|---|---|
| 1 | S | `"70_A2022_NEC_P02_FD_BallotFinal" OR "70_A2022_NEC_P10_FD_BallotFinal"` | Only the 2023-cycle CMP-3, CMP-5 and CMP-6 FD ballots, an appa.org TIA ballot and 2026-cycle files |
| 2 | S | `docinfofiles.nfpa.org 70 A2022 NEC SD PCStatements P02 P10 P11 P12 P06` | 2026-cycle PISubmittals (P04, P06, P07, P09, P11, P12, P13); CMP-1 2023-cycle SR file; CMP-1 2026 SD PrelimSR |
| 3 | S | `site:docinfofiles.nfpa.org "tapped from a 50-ampere branch circuit"` | The `site:` operator was ignored; forums and two EC&M Q&A pages |
| 4 | S | `"SD PCStatements" 70 A2022 NEC` | 2026-cycle meeting agendas, ICC shop, goodreads |
| 5 | E | `NFPA 70 2023 NEC 2022 Technical Meeting certified amending motions results list "CAM 70-" passed failed` | CAM compilation Part 2; NFPA blog mirror posts; MN minutes; mass.gov minutes; 2025 Standards Council files |
| 6 | E | `NFPA Standards Council minutes August 2022 NFPA 70 appeals 2023 NEC decision D#22 amendments` | Standards Council minutes for Dec 2022 and Aug 2023; D#25-1, -2, -5; ASPE and NESA news; IAEI |
| 7 | E | `"Standards Council" "Final Minutes" August 2022 NFPA 70 National Electrical Code appeals issued August 12 2022` | The same minutes; IEEE-hosted FD_D16-13; goodreads |
| 8 | E | OR of four exact 2023-cycle PCStatements names | **Unlocked** the CMP-2, CMP-10 and CMP-11 PC files and the CMP-11 2023-cycle SD agenda. CMP-12 not returned |
| 9 | E | OR of four exact 2026-cycle FD_PIResponses names | Nothing from NFPA |
| 10 | E | `Standards Council decision "D#22" NFPA 70 appeal 2022 Certified Amending Motion 2023 National Electrical Code` | No 2022 decision files |
| 11 | E | `"SC_Final_Minutes_08_2022" OR "SC_Minutes_Final_08_2022" OR "SC_Preliminary_Minutes_08_2022" NFPA Standards Council August 2022` | No August 2022 minutes. NFPA 101 agendas; `/150/SC_Transcript_8_2024.pdf`; nfpa.org pages (JavaScript-only host, not used) |
| 12 | E | `"SC#22-8" OR "SC_22_8" "NFPA 70" Standards Council decision appeal 2023 National Electrical Code` | No 2022 decision files. Unlocked the NC 2023 amendments, the NYC TIA 23-10 reprint, CA BSC bulletins and the Mar 2023 SC agenda |

---

## 6. Open gaps

1. **Target texts still unverified:**
   - 210.19 household ranges;
   - 230.42(A)(1) Exception No. 2;
   - 240.6(A) fuse-only sentence;
   - 225.39(A)–(D);
   - 430.22 and Table 430.22(E);
   - 430.32(A)(1);
   - 440.32 and 440.62–440.64;
   - 625.41, 625.50, 625.17(A);
   - 630.11(A)/(B) and Table 630.11(A);
   - 250.122(A) wording and the Table 250.122 caption;
   - 250.66(A)–(C) and Table 250.66;
   - 250.32(B)(1);
   - 334.80, 340.80, 310.15(E), 310.15(F).

   **Routes, fastest first:**
   - **(a) The owner downloads the large NFPA PDFs in a browser and attaches them.** Local extraction has neither the 100,000-character window nor today's "[binary data]" failure. Priority files, all under `https://docinfofiles.nfpa.org/files/AboutTheCodes/70/`:
     - `70_A2022_NEC_P02_FD_BallotFinal.pdf` (210.19)
     - `70_A2022_NEC_P10_FD_BallotFinal.pdf` (230.42, 240.6(A), 225.39)
     - `70_A2022_NEC_P11_FD_BallotFinal.pdf` and `70_A2022_NEC_P11_SD_PCStatements.pdf` (430/440)
     - `70_A2022_NEC_P12_FD_BallotFinal.pdf` (625/630)
     - `70_A2022_NEC_P05_FD_BallotFinal.pdf` (250.32/250.66/250.122, which lie past R4-2's page-58 window)
     - `70_A2022_NEC_P06_FD_BallotFinal.pdf` (310.15/334.80/340.80, which lie past R4-1's page-8 window)

     Caveat: an FD ballot prints only First Revisions. A section that no First Revision touched will not appear in it. Its 2023 text would then equal the 2020 text only by inference, which needs complete FR and SR lists. That is not verification.
   - **(b)** A person reads NFPA's free 2023 viewer (JavaScript-only, so it cannot be reached from here) for these sections.
   - **(c)** If WebFetch's large-PDF extraction comes back, URLs pasted by the owner pass the allowlist.
2. **Condition 3 for all verified-sd2023 items:**
   - **Standards Council August 2022 minutes and the D#22 decisions.** These are short PDFs, which do extract today. The owner can open nfpa.org's Standards Council "agendas, minutes and decisions" page in a browser and paste the August 2022 links.
   - **The A2022 Motions Committee report**, which lists each CAM with its section.
   - **Which reading of "18 amendments" is right.**
3. **625.54 core sentence:** needs a tier 1–3 print of the post-issuance 2023 text, because GFCI protection was a 2022 appeal topic.
4. **240.4(B) closing sentence:** whether it opens "If" or "Where" (flattened in SR-8283; the Minnesota paraphrase does not show it).
5. **NC effective date** (pointer for R4-6): the NC document prints January 1, 2025, while nec-adoption.json records an indefinite delay.
