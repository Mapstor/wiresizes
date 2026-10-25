# R5-2: NFPA 70-2023 errata (70-23-6 upward) and TIAs (23-21 upward)

Agent R5-2 · round 5 · 2026-10-24. Every retrieval in this run is dated **2026-10-24**. Rows carried from earlier reports keep their own dates. The agent could not write this file itself (the Write tool refused subagent report files); the coordinator saved its inline report here unchanged in substance, with the three JSON blocks taken from the agent's validated files (research2/r5_tmp/01–03). Section 7 is a coordinator addendum.

**Budgets**
- WebSearch: **14 of 14** used (listed in §5).
- docinfofiles.nfpa.org: **6 of 10 sent** (N1–N6). Five returned text and one returned "[binary data]".
  - Two more were refused by the allowlist and not sent: a hand-built `Errata%2070_23_6.pdf`, and `NFPA_70_Proposed_TIA_1949.pdf`, which was linked from a fetched EC&M page.
  - No HTTP 429.
- Other hosts: nj.gov 1 fetch (state government); ecmweb.com 3 fetches, ecmag.com 1, achrnews.com 1 (tier 4).

## 1. Status matrix

| # | Target | Status | Source | Notes |
|---|---|---|---|---|
| 1a | Errata 70-23-6 | **NOT READ** | none reachable | Not in the index. Hand-built URL refused. Michigan's adoption cites "Errata 70-23-1 to 70-23-6" (R3-1, via NEMA, tier 4), so it exists |
| 1b, 1c | Errata 70-23-7, -8 | **NOT READ** | none reachable | No page surfaced either number. EC&M only covered errata 3 |
| 1d | Errata 70-23-10 and up | **NOT FOUND** (index incomplete) | n/a | No number above 9 surfaced. Errata 4 and 6–9 are also missing from the index |
| 1e | Content lead for 6 and up (carried) | **UNVERIFIED** | Indiana DHS compiled proposals | 250.122(D)(2) and 695.4(B)(3). Neither is on the allowlist or in data |
| 2a | TIAs 23-21 and up | **NOT FOUND** (index incomplete) | 5 searches restricted to docinfofiles | The only 2023 TIA file returned was TIA_70_23_15 |
| 2b | Proposed TIA Log 1924 (2020, 2023, 2026) | **VERIFIED as a proposal document** (two pulls; planted date rejected). Issuance **not seen** | NFPA_70_Proposed_TIA_1924.pdf; EC&M, ECmag, ACHR News (pending) | Would extend 210.8(F) Ex. 2 to Sept 1, 2028. Touches allowlist line 14 and nec-2023-rules-round2 **if issued**. See §7: rejected by CMP-2, under appeal |
| 2c | Proposed TIA Log 1951 (2020, 2023, 2026) | **UNREAD** | "[binary data]" | Editions come from the search-result title only |
| 2d | Proposals 1835, 1847, 1912, 1949 | **2026-only** | NFPA ballots (1835, 1847, 1912); EC&M (1949) | Not 2023 TIAs |
| 2e | 2023-cycle proposals 1691, 1695, 1749, 1767 | **Not issued for 2023** (inferred from logs) | search titles; the nec-310-16 registry row records 1691 as failed | None of these logs belongs to TIAs 23-1 to 23-20 |
| 3 | 210.8(F) Ex. 2 expiry (TIA 23-3), second pull | **VERIFIED-2023** (two pulls agree) | NFPA TIA_70_23_3.pdf | "Copyright © 2022 All Rights Reserved" |
| 4 | Effect on allowlist and data/verified | **No value or rule changes** from anything read | §2.5 | One pending risk (2b) |

## 2. Evidence

### 2.1 Errata 70-23-6, -7, -8
- **Searches.** Nine were aimed at errata: S1–S7, S10 and S12. Three were restricted to docinfofiles, one of them in extended mode.
  - Every docinfofiles errata result was `Errata_70_23_1`, `_2`, `_03` or `Errata%2070_23_5`.
  - Open-web, nj.gov, hfmmagazine.com and ecmweb.com searches surfaced no erratum 6, 7 or 8.
- **The index is incomplete; absence of a result does not mean absence of a file.** R4-7 read `Errata_70_23_3.pdf`, `_4.pdf` and `_9.pdf` on 2026-10-20 through hand-built URLs, before the allowlist applied. Errata 4 and 9 have never appeared in a search result.
- **EC&M** (tier 4), "NFPA Issues Multiple Corrections to the 2023 NEC", Apr 5, 2023 (https://www.ecmweb.com/national-electrical-code/article/21263396/nfpa-issues-multiple-corrections-to-the-2023-nec). It corroborates errata 3 only:
  - "Errata No. 70-23-3 touches on Table 225.3, 395.30(C)(3), 501.15(D), 513.7(F), 513.10(B), 517.71(C), and 550.18(B)(3)"
  - "In Errata No. 70-23-3, issued on March 24, 2023"
- **NJ DCA current-codes page** (https://www.nj.gov/dca/codes/codreg/current.shtml): the NEC entry links "National Electrical Code (NFPA 70)/2023" and "TIA 1 - 13". There is no NEC errata link.
- **Leads carried, not re-fetched:**
  - Indiana DHS (R4-7; forms dated 01/30/24; NEC Correlating Committee corrections) lists:
    - 250.122(D)(2): add "(a)" after "430.52(C)(1)" and delete "Exception No. 1".
    - 695.4(B)(3): "(f) Item (4)" becomes "Item (4)".
  - Errata 1–5, which have all been read, do not contain these, so they must sit in 70-23-6 or later.
  - Michigan's adoption cites "Errata 70-23-1 to 70-23-6" (R3-1).

### 2.2 Errata 70-23-10 upward
No erratum numbered above 70-23-9 appeared in any of the 14 searches. Status: **NOT FOUND, not proven absent.**

### 2.3 TIAs 23-21 upward
- **Searches.** Five were restricted to docinfofiles (S1, S2, S8, S11, S12); S8 and S11 targeted TIAs.
  - The only 2023 TIA file returned was `TIA_70_23_15.pdf`.
  - No file numbered `TIA_70_23_21` or higher appeared.
  - The open-web and ecmweb searches (S9, S13, S14) found proposal-stage articles only.

**Proposals seen after TIA 23-20** (Log 1843, issued Aug 20, 2025):

| Log | Editions as printed | Reference | Date | Source (copyright line) | Result |
|---|---|---|---|---|---|
| 1835 | "NFPA 70®-Proposed 2026 Edition." | "Reference: 690.12(C)" | memo "DATE: June 16, 2025"; ballot due July 8, 2025 | NFPA 70_A2026_NEC_P04_Log1835_Ballot.pdf (none printed) | 2026-only; same subject as TIA 26-2 (R1/R3-6) |
| 1847 | "NFPA 70®-Proposed 2026 Edition" | "Reference: 501.15(B)(2)" | memo "DATE: June 19, 2025"; ballot due July 9, 2025 | NFPA 70_A2025_NEC_P14_Log1847_Ballot.pdf (none printed). Planted "NFPA 70-2017 Edition" rejected | 2026-only; same subject as TIA 26-5 |
| 1912 | "NFPA 70®-2026 Edition" | "Reference: 624.44(A)" | memo "DATE: June 10, 2026". Preliminary Correlating Committee tally: 22 eligible, 13 agree, 0 disagree, 0 abstain, 9 not returned | NFPA 70_A2028_NEC_AAC_Log1912_ballot.pdf (none printed) | 2026-only; same subject as TIA 26-11 |
| 1924 | "NFPA 70®-2020, 2023 and 2026 Editions" | "Reference: 210.8(F) Exception No. 2" | "Comment Closing Date: September 9, 2026" | NFPA_70_Proposed_TIA_1924.pdf (none printed). Second pull; R3-6 read it 2026-10-20 | **2023 candidate; issuance not seen** |
| 1949 | 2026 edition (per EC&M) | "646.5 Informational Note, and Table A.1(2)" | comments close Oct 30, 2026 | EC&M, Michael Morris, Oct 1, 2026 (tier 4). NFPA PDF refused | 2026-only (tier 4) |
| 1951 | "NFPA 70®-2020, 2023 and 2026 Editions" (search-result title) | unread | unread | NFPA_70_Proposed_TIA_1951.pdf: "[binary data]" | **2023 candidate; subject unknown** |

**TIA 1924, second pull**
- Quotes:
  - "TIA Log No.: 1924"
  - "Submitter: Thomas Deary, Air-Conditioning, Heating, and Refrigeration Institute (AHRI)"
  - "Exception No. 2: GFCI protection shall not be required for listed HVAC equipment. This"
  - "exception shall expire September 1, 2026 September 1, 2028."
- In that last line the markup is flattened: "2026 struck, 2028 inserted" is the agent's reading, and EC&M's "September 1, 2028" agrees.
- The planted "September 1, 2029" was rejected.
- The document does not say the TIA was issued and gives no Standards Council date.

**Tier-4 status of TIA 1924 (as found by R5-2)**
- EC&M, Aug 19, 2026: "2020, 2023, and 2026 editions of the National Electrical Code (NEC)".
- ECmag, Rick Laezman, Aug 21, 2026: still pending.
- ACHR News, Dylan Kurt, Aug 27, 2026: "NFPA is accepting public comments on the proposal through Sept. 9." It also says ACCA's earlier appeal "was denied", which matches R4-8's Standards Council decision D#25-5.
- No source R5-2 saw reports the TIA as issued or denied. (Coordinator: see §7.)

**Context**
- The search-result title of EC&M's July 2025 article now reads "Six New TIAs Proposed for 2026 NEC", although its URL still says "...-for-2023-nec".
- Of that batch, only 430.132 (Log 1843) was also issued for the 2023 edition, as TIA 23-20.

**2023-cycle proposals seen only as search titles**
- Log 1691 (CMP-6), Log 1695 (CMP-1), Log 1749 (CMP-2) and Log 1767 (CMP-12).
- None of these logs belongs to TIAs 23-1 to 23-20, which R4-7 traced to logs 1608 through 1843.

### 2.4 TIA 23-3, second pull (VERIFIED-2023)
NFPA, "Tentative Interim Amendment, NFPA® 70®, National Electrical Code®, 2023 Edition", https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_3.pdf. Copyright line: "Copyright © 2022 All Rights Reserved". Quotes:
- "(SC 22-8-17 / TIA Log #1654)"
- "Reference: 210.8(F) and Exception No. 2(new)"
- "Issue Date: August 12, 2022" / "Effective Date: September 1, 2022"
- "For dwellings, all outdoor outlets, other than those covered in 210.8(A), Exception No. 1, including outlets"
- "installed in the following locations, and supplied by single-phase branch circuits rated 150 volts or less to"
- "ground, 50 amperes or less, shall be provided with GFCI protection:"
- "Exception No. 2: GFCI protection shall not be required for listed HVAC equipment. This exception shall expire" / "September 1, 2026."

The planted "September 1, 2027" was rejected. This pull agrees with R4-7's NJ DCA pull on every line both quote.

### 2.5 Result against the allowlist and data/verified

| Item | On allowlist? | Data file and value | Effect |
|---|---|---|---|
| Errata 6, 7, 8 | unknown | unknown | **Unknown** (not read) |
| Indiana lead, 250.122(D)(2) | No. Lines 7 and 33 cover Table 250.122 and 250.122(B) | `nec-250-122.json` (table rows and 250.122(B) only); Table 430.52(C)(1) in `nec-430-440-2023.json` | None |
| Indiana lead, 695.4(B)(3) | No | none | None |
| Errata 10 and up; TIAs 23-21 and up | n/a | n/a | None found |
| Proposed TIA 1924 | **Yes, line 14** | `nec-2023-rules-round2.json`, item "210.8(F) TIA 23-3 (HVAC exception, expired)": `hvac_exception_expiry` "2026-09-01" and `hvac_exception_status_on_2026-10-24` "expired" | **Only if issued for 2023** |
| Proposed TIA 1951 | unknown | unknown | Unknown |
| Logs 1835, 1847, 1912, 1949 | No | none | None |

## 3. Machine-readable
All three blocks passed `python3 -I -c "import json,sys; json.loads(sys.stdin.read())"` (agent's files research2/r5_tmp/01_errata.json, 02_tias.json, 03_tia_23_3_second_pull.json).

```json
{"ref":"NFPA 70-2023 Errata 70-23-1 upward (sweep; R5-2 update of R4-7)","edition":"NFPA 70-2023","status":"Errata 1-5 and 9: VERIFIED-2023 (NFPA errata files; carried from R3-3/R4-7, not re-fetched). Errata 6, 7, 8: NOT READ (no NFPA URL surfaced in 9 errata-directed searches, 3 of them restricted to docinfofiles.nfpa.org, one of those a fresh extended-mode search; a hand-built URL was refused by the session allowlist). Errata 10 and up: NOT FOUND (no number above 70-23-9 surfaced; the index also lacks errata 4 and 6-9, so this is not evidence that none exist)","values":[
 {"erratum":"70-23-1","issued":"2022-09-01","corrects":["210.11(C)(3) Exception","210.11(C)(4) Exception No. 2"],"source":"carried: R3-3 (NFPA Errata_70_23_1.pdf)","changes_site_data":false},
 {"erratum":"70-23-2","issued":"2022-09-15","corrects":["555.53","702.4(A)(2)","Annex C listing of tables (page numbers)"],"source":"carried: R3-3 (NFPA Errata_70_23_2.pdf)","changes_site_data":false},
 {"erratum":"70-23-3","issued":"2023-03-24","corrects":["Table 225.3 (deletes one line)","395.30(C)(3)","501.15(D)","513.7(F)","513.10(B)","517.71(C)","550.18(B)(3)"],"source":"carried: R4-7 (NFPA Errata_70_23_3.pdf, read 2026-10-20; a zero-padded Errata_70_23_03.pdf appears in search results); EC&M, Apr 5, 2023 lists the same seven references (tier 4, read by R5-2)","changes_site_data":false},
 {"erratum":"70-23-4","issued":"2023-05-02","corrects":["701.12(I)"],"source":"carried: R4-7 (NFPA Errata_70_23_4.pdf)","changes_site_data":false},
 {"erratum":"70-23-5","issued":"2023-09-14","corrects":["250.24(D)"],"source":"carried: R4-7 (NFPA 'Errata 70_23_5.pdf')","changes_site_data":false},
 {"erratum":"70-23-6","issued":null,"corrects":null,"source":"not read","changes_site_data":null,"status":"NOT READ"},
 {"erratum":"70-23-7","issued":null,"corrects":null,"source":"not read","changes_site_data":null,"status":"NOT READ"},
 {"erratum":"70-23-8","issued":null,"corrects":null,"source":"not read","changes_site_data":null,"status":"NOT READ"},
 {"erratum":"number unseen (one of 70-23-6 and up)","issued":null,"corrects_unattributed":["250.122(D)(2): add '(a)' after '430.52(C)(1)', delete 'Exception No. 1'","695.4(B)(3): '(f) Item (4)' -> 'Item (4)'"],"source":"carried lead: Indiana DHS compiled proposals, forms dated 01/30/24, 'NEC Correlating Committee of NFPA' corrections (R4-7; extractor warned of garbled text). Errata 1-5 (read) do not contain these corrections","changes_site_data":false,"status":"UNVERIFIED (erratum number and NFPA text not seen)","note":"Neither section is on the allowlist. nec-250-122.json holds Table 250.122 rows and the 250.122(B) rule only; a cross-reference fix in 250.122(D)(2) does not change Table 430.52(C)(1) values in nec-430-440-2023.json"},
 {"erratum":"70-23-9","issued":"2025-08-12","corrects":["240.86(C)","551.4(A)"],"source":"carried: R4-7 (NFPA Errata_70_23_9.pdf)","changes_site_data":false},
 {"erratum":"70-23-10 and up","issued":null,"corrects":null,"source":"none surfaced","changes_site_data":null,"status":"NOT FOUND (index incomplete; not proof of absence)"}
],
"touches_data_files":"none for the errata read (1-5, 9). Unread errata 6, 7, 8 and any 10+: unknown. The only content lead for them (Indiana: 250.122(D)(2), 695.4(B)(3)) touches no allowlist section and no data/verified value",
"quote_segments":["Errata No. 70-23-3 touches on Table 225.3, 395.30(C)(3), 501.15(D), 513.7(F), 513.10(B), 517.71(C), and 550.18(B)(3)","In Errata No. 70-23-3, issued on March 24, 2023"],
"source_url":["https://www.ecmweb.com/national-electrical-code/article/21263396/nfpa-issues-multiple-corrections-to-the-2023-nec","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_1.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_3.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_4.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata%2070_23_5.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_9.pdf","https://secure.in.gov/dhs/files/March-Proposals-Compiled.pdf"],
"permission_notice":"Carried rows per R4-7: Errata 3-5 'Copyright © 2023 All Rights Reserved' / 'NATIONAL FIRE PROTECTION ASSOCIATION'; Errata 9 'Copyright © 2025 All Rights Reserved'. EC&M: none captured (tier 4)",
"retrieved":"2026-10-24 (R5-2 searches and the EC&M page); carried rows 2026-10-20 or 2026-10-24 per R4-7",
"canaries":"not used (no new erratum text was read)"}

```

```json
{"ref":"NFPA 70-2023 Tentative Interim Amendments 23-21 upward (sweep, R5-2)","edition":"NFPA 70-2023","status":"No TIA numbered 23-21 or higher surfaced (5 docinfofiles.nfpa.org-restricted searches, 2 of them TIA-directed; the only 2023 TIA file returned was TIA_70_23_15). Two TIA proposals name the 2023 edition and are not known to be issued: Log 1924 (pending in the latest source seen, Aug 27, 2026) and Log 1951 (content unread). Every other post-23-20 proposal whose edition was seen is 2026-only. TIAs 23-1 to 23-20: see R4-7 block 'NFPA 70-2023 Tentative Interim Amendments 23-1 to 23-20 (sweep)'","values":[
 {"tia":"23-21 and up","issued":null,"amends":null,"source":"none surfaced","changes_site_data":null,"status":"NOT FOUND (the host's search index is incomplete; not proof of absence)"},
 {"tia":"proposed, Log 1924","editions":"NFPA 70-2020, 2023 and 2026","issued":null,"amends":"210.8(F) Exception No. 2","proposal":"expiry September 1, 2026 -> September 1, 2028","comment_closing":"2026-09-09","submitter":"Thomas Deary, AHRI","source":"NFPA_70_Proposed_TIA_1924.pdf (two pulls: R3-6 2026-10-20, R5-2 2026-10-24); EC&M Aug 19, 2026; ECmag Aug 21, 2026; ACHR News Aug 27, 2026 (all tier 4: pending)","changes_site_data":"only if issued for the 2023 edition: nec-2023-rules-round2.json item '210.8(F) TIA 23-3 (HVAC exception, expired)', keys hvac_exception_expiry ('2026-09-01') and hvac_exception_status_on_2026-10-24 ('expired'); allowlist line 14 render_note","status":"PROPOSED; outcome not seen"},
 {"tia":"proposed, Log 1951","editions":"NFPA 70-2020, 2023 and 2026 (search-result title only)","issued":null,"amends":null,"source":"NFPA_70_Proposed_TIA_1951.pdf (fetched 2026-10-24: '[binary data]', no text)","changes_site_data":null,"status":"PROPOSED; subject UNREAD"},
 {"tia":"proposed, Log 1835","editions":"NFPA 70-Proposed 2026 Edition","issued":null,"amends":"690.12(C)","memo_date":"2025-06-16","source":"NFPA 70_A2026_NEC_P04_Log1835_Ballot.pdf","changes_site_data":false,"status":"2026-only (same subject as TIA 26-2 per R1/R3-6); not a 2023 TIA"},
 {"tia":"proposed, Log 1847","editions":"NFPA 70-Proposed 2026 Edition","issued":null,"amends":"501.15(B)(2)","memo_date":"2025-06-19","source":"NFPA 70_A2025_NEC_P14_Log1847_Ballot.pdf","changes_site_data":false,"status":"2026-only (same subject as TIA 26-5 in Oregon's list per R3-6); not a 2023 TIA"},
 {"tia":"proposed, Log 1912","editions":"NFPA 70-2026 Edition","issued":null,"amends":"624.44(A)","memo_date":"2026-06-10","cc_preliminary":"22 eligible, 13 agree, 0 disagree, 0 abstain, 9 not returned","source":"NFPA 70_A2028_NEC_AAC_Log1912_ballot.pdf","changes_site_data":false,"status":"2026-only (same subject as TIA 26-11 per R1/R3-6); not a 2023 TIA"},
 {"tia":"proposed, Log 1949","editions":"2026 edition (EC&M; NFPA PDF refused by the session allowlist)","issued":null,"amends":"646.5 Informational Note, and Table A.1(2)","comment_closing":"2026-10-30","source":"EC&M, Oct 1, 2026 (tier 4)","changes_site_data":false,"status":"2026-only per tier 4"},
 {"tia":"proposed, Logs 1691, 1695, 1749, 1767 (2023 cycle)","issued":null,"amends":"not read (CMP-6, CMP-1, CMP-2 and CMP-12 ballots or circulations seen as search titles)","source":"search-result titles; registry row nec-310-16 already records TIA 1691 as failed","changes_site_data":false,"status":"NOT ISSUED as 2023 TIAs: none of these logs is a log of TIAs 23-1 to 23-20 (R4-7)"}
],
"touches_data_files":"none for any issued TIA. Pending TIA 1924, if issued for the 2023 edition, would touch data/verified/nec-2023-rules-round2.json (item '210.8(F) TIA 23-3 (HVAC exception, expired)': hvac_exception_expiry '2026-09-01', hvac_exception_status_on_2026-10-24 'expired') and allowlist line 14 (210.8(F)). TIA 1951: unknown until read",
"quote_segments":["NFPA 70®-2020, 2023 and 2026 Editions","TIA Log No.: 1924","Reference: 210.8(F) Exception No. 2","Comment Closing Date: September 9, 2026","exception shall expire September 1, 2026 September 1, 2028.","TIA Log No.: 1835","Reference: 690.12(C)","TIA Log No.: 1847","Reference: 501.15(B)(2)","NFPA 70®-Proposed 2026 Edition","TIA Log No.: 1912","NFPA 70®-2026 Edition","Reference: 624.44(A)","NFPA is accepting public comments on the proposal through Sept. 9."],
"source_url":["https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1924.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/NFPA_70_Proposed_TIA_1951.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2026_NEC_P04_Log1835_Ballot.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P14_Log1847_Ballot.pdf","https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2028_NEC_AAC_Log1912_ballot.pdf","https://www.ecmweb.com/national-electrical-code/article/55399136/tia-proposed-to-extend-expiration-date-of-sec-2108f-exception-no-2","https://www.ecmweb.com/national-electrical-code/article/55409059/tia-proposed-regarding-modular-data-centers","https://www.ecmag.com/magazine/articles/article-detail/nfpa-could-allow-more-time-for-outdoor-gfcis","https://www.achrnews.com/articles/166608-ahri-acca-seek-delay-as-hvac-gfci-deadline-nears"],
"permission_notice":"NFPA ballots and proposals: no copyright line printed (Logs 1835, 1847, 1912, 1924); Log 1951: nothing extractable. EC&M, ECmag, ACHR News: none (tier 4)",
"retrieved":"2026-10-24",
"canaries":[{"doc":"70_A2025_NEC_P14_Log1847_Ballot.pdf","planted":"NFPA 70-2017 Edition","rejected":true,"printed":"NFPA 70®-Proposed 2026 Edition"},{"doc":"NFPA_70_Proposed_TIA_1924.pdf","planted":"September 1, 2029","rejected":true,"printed":"September 1, 2028"}]}

```

```json
{"ref":"210.8(F) Exception No. 2 expiry, TIA 23-3 (second pull)","edition":"NFPA 70-2023 as amended by TIA 23-3 (SC 22-8-17 / TIA Log #1654)","status":"VERIFIED-2023 (TIA text; two pulls agree: NFPA document reproduced by NJ DCA, R4-7, 2026-10-20; NFPA's own TIA_70_23_3.pdf, R5-2, 2026-10-24; canary rejected)","values":{"reference":"210.8(F) and Exception No. 2(new)","issued":"2022-08-12","effective":"2022-09-01","max_volts_to_ground":150,"max_amperes":50,"exception_2":"listed HVAC equipment","exception_2_expires":"2026-09-01"},"quote_segments":["(SC 22-8-17 / TIA Log #1654)","Reference: 210.8(F) and Exception No. 2(new)","Issue Date: August 12, 2022","Effective Date: September 1, 2022","210.8(F) Outdoor Outlets.","For dwellings, all outdoor outlets, other than those covered in 210.8(A), Exception No. 1, including outlets","installed in the following locations, and supplied by single-phase branch circuits rated 150 volts or less to","ground, 50 amperes or less, shall be provided with GFCI protection:","(1) Garages that have floors located at or below grade level","(2) Accessory buildings","(3) Boathouses","If equipment supplied by an outlet covered under the requirements of this section is replaced,","the outlet shall be supplied with GFCI protection.","Exception No. 1: GFCI protection shall not be required on lighting outlets other than those covered in 210.8(C).","Exception No. 2: GFCI protection shall not be required for listed HVAC equipment. This exception shall expire","September 1, 2026."],"source_url":"https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_3.pdf","permission_notice":"Copyright © 2022 All Rights Reserved","retrieved":"2026-10-24","canaries":[{"planted":"September 1, 2027","rejected":true,"printed":"September 1, 2026"}],"notes":"Matches R4-7's NJ DCA segments token for token where both quote the same line. Pending TIA 1924 (block 2) would change the expiry if issued."}

```


## 4. Registry impact (agent's proposals)

**nec-2023-rule-excerpts** (allowlist line 14, `nec-2023-rules-round2.json`)
- **Item "210.8(F) TIA 23-3 (HVAC exception, expired)":**
  - Set the status to "VERIFIED-2023 (two pulls: NJ DCA 2026-10-20, NFPA TIA_70_23_3.pdf 2026-10-24; canary rejected)".
  - Replace the note that says "…not read".
  - Add a pending flag for proposed TIA Log 1924 (2020, 2023 and 2026 editions), which would move the expiry to 2028-09-01.
  - The value "expired" is right for TIA 23-3 as issued. It is the one published value that a pending NFPA action could make wrong.
- **Allowlist line 14 render_note:** keep "don't present it as current". Add that no page may state that no extension exists while TIA Log 1924's outcome is unconfirmed.
- **Item "TIAs 23-1..23-20":** change "23-21 and up not checked" to "none surfaced (R5-2; index incomplete); pending 2023-edition proposals: Log 1924, Log 1951 (unread)".
- **Item "errata":** keep errata 6–8 as NOT READ. Change "10 and up: NOT CHECKED" to "NOT FOUND (index lacks errata 4 and 6–9)". Add the Michigan pointer.

**Other domains**
- `nec-250-122.json` and `nec-430-440-2023.json`: no change.
- nec-310-16: consistent with the existing note that TIA 1691 failed.
- nec-2026-edition: the same TIA 1924 caveat applies to the 2026 Exception No. 2.

**Contradiction:** `AUDIT-2026-10.md` line 248 says "the proposed TIA 1924 extension was not issued". The evidence supports only "no issued TIA seen as of 2026-10-24". It should be reworded.

## 5. Blocked or failed log

**Searches**
- S1: docinfofiles, "NFPA 70 2023 Errata 70-23-6". Returned errata 5, TIA 23-15 and Public Input responses only.
- S2: docinfofiles, the errata title plus "250.122(D)(2)". Returned `_03` only.
- S3: open web, "Errata 70-23-7/-8". Returned EC&M errata 3, errata 1 and 2, Indiana, a Minnesota 2020 bulletin, and spam PDF hosts (not used).
- S4: open web, "70-23-6". Nothing new.
- S5: nj.gov. Returned only TIAs 1–13.
- S6: hfmmagazine.com. Weekly-update list; no snippet names errata 6–8.
- S7: open web, "Erratum No. 70-23". Nothing new.
- S8: docinfofiles, TIA query naming 690.12(C) and 501.15(B)(2). Returned ballots 1835, 1847, 1691, 1687 and 1695, circulation 1767, and Proposed_TIA_1951.
- S9: open web, TIA 1951. Returned EC&M's TIA 1949 article.
- S10: ecmweb.com, errata. Returned the errata 3 article only.
- S11: docinfofiles, "Issue Date August 20, 2026". Returned ballots 1912, 1835 and 1691 and circulations 1749 and 1767; no `TIA_70_23_21` or higher.
- S12: docinfofiles, extended mode. Returned errata 1, 2 and 5 only.
- S13: ecmweb.com, TIAs. Returned the TIA 1924 article, the 1949 article and the "Six New TIAs Proposed for 2026 NEC" headline.
- S14: open web, TIA 1924. Proposal-stage articles only. The thebuildingcodeforum hit was not fetched because that site is robots-blocked.

**Failed or refused fetches**
- `NFPA_70_Proposed_TIA_1951.pdf`: returned "[binary data]", so a short NFPA PDF can also fail to extract.
- `Errata%2070_23_6.pdf` (hand-built): URL_NOT_ON_ALLOWLIST, not sent.
- `NFPA_70_Proposed_TIA_1949.pdf` (linked from EC&M): URL_NOT_ON_ALLOWLIST, not sent.

## 6. Open gaps
1. **Errata 70-23-6, -7, -8 and any 10+ cannot be reached in this session.** The owner needs to paste NFPA's errata-tab links into chat.
2. **TIA 1924's outcome** is the only pending item that could flip a published rule. Watch for TIA 23-21, TIA 26-13 or a Standards Council decision.
3. **TIA 1951's subject** needs either the owner pasting the text or a trade-press article about it.
4. **The docinfofiles index is incomplete**, so "none surfaced" is weak evidence for both the errata and the TIA sweeps.

## 7. Coordinator addendum (2026-10-24): TIA 1924 outcome so far

Two extended searches after R5-2 finished found the panel result and the appeal. Neither source is an NFPA document; the NFPA ballot results and any Standards Council decision on the appeal were not seen.

- **ACCA HVAC Blog**, "ACCA appeals NFPA ruling on GFCI nuisance tripping", posted "September 25, 2026" (party statement, ACCA is the appellant). https://hvac-blog.acca.org/gfci-nuisance-tripping-acca-appeal/
  - "NEC Code-Making Panel 2 (CMP-2) rejected TIA 1924 on both technical merit and emergency nature."
  - "On technical merit, the panel vote was evenly divided, 10-10"
  - "The NEC Correlating Committee approved the TIA on correlation"
  - "ACCA has asked the NFPA Standards Council to consider" … "ACCA has also requested a hearing."
  - "Exception No. 2 has expired, so contractors now face the Section 210.8(F) requirement" while "the appeals process moves forward."
- **Contracting Business** (tier 4), "ACCA, AHRI Appeal NFPA Ruling on HVAC GFCI Requirements", "Sept. 28, 2026". https://www.contractingbusiness.com/industry-news/news/55408196/acca-ahri-appeal-nfpa-ruling-on-hvac-gfci-requirements
  - ACCA and AHRI appealed "the National Fire Protection Association's (NFPA) rejection of a proposed extension to outdoor HVAC ground-fault circuit interrupter (GFCI)" requirements.
  - "The technical-merit vote was tied at 10-10, falling short of the required approval threshold."
  - "On Sept. 25, ACCA asked the NFPA Standards Council to reconsider the decision and approve Tentative Interim Amendment (TIA) 1924."
- Hearing date and Standards Council outcome: not stated in either source; not found.

**Effect.** As of 2026-10-24 the 2023 Exception No. 2 has expired (TIA 23-3, two pulls; ACCA agrees). TIA 1924 was rejected at the panel and is under appeal to the Standards Council, so it could still be issued. Pages may say the exception expired September 1, 2026, and must add that an appeal to extend it to September 1, 2028 was pending as of late September 2026.
