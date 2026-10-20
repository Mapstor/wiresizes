# NEC table verification for the wiresizes.com audit

- Retrieval date for every source below: **2026-10-19**
- Target edition: NFPA 70 (NEC) **2023**; 2020 and 2026 differences noted where seen.
- Method: WebFetch only. The sandbox shell could not reach any of the source hosts. WebFetch passes each document through a small extraction model and truncates documents at about 100–107K characters, so long full-code PDFs (California Electrical Code, Public.Resource.Org NEC scans) could only be read in their first ~100 pages.
- Integrity rule applied: a value is marked **VERIFIED-seen-in-source** only if it came back from a fetched document. Nothing was filled from memory. Where only a different edition was seen, the edition is stated, and the 2023 value is **not** claimed as verified.
- Extraction safeguard: the core tables (310.16, 310.15(B)(1)(1), 310.15(C)(1), 310.12(A), 250.66, 250.122) were pulled twice: once as data and once as "raw extracted lines". The two pulls matched. Table 310.16 was also matched across three documents.

## Status legend

- **VERIFIED-2023**: seen in a document whose base text is NFPA 70-2023, either an NFPA document or one carrying an NFPA 2023 permission notice.
- **VERIFIED-other-edition**: seen in an NFPA-authored or NFPA-permission document for a different edition (2020, or the 2026 revision-cycle draft). The 2023 value is inferred from that source, not seen in it.
- **UNVERIFIED**: no authorized reproduction was found or fetchable this session.

## Status matrix

| # | Item | Status | Source(s) |
|---|---|---|---|
| 1 | Table 310.16 (18 AWG–2000 kcmil, Cu and Al/CCA, 60/75/90 °C) plus notes | **VERIFIED-2023**. 2026 draft deltas noted. | S1 + S2; cross-checked S3, S4, X1 |
| 2 | Table 310.12 rows (100–400 A) | VERIFIED-other-edition (2026 First Draft, base text) | S3 |
| 2 | 310.12(A)/(B) 83% text | Partial, 2026 First Draft wording; (C)/(D) UNVERIFIED | S3 |
| 3 | Table 310.15(B)(1)(1) ambient correction | VERIFIED-other-edition (2026 First Draft, base text) | S3 |
| 3 | Table 310.15(C)(1) 80/70/50/45/40/35 | VERIFIED-other-edition (2026 First Draft); all six brief values confirmed | S3 |
| 4 | 240.4(D) | 2023 lead-in and (D)(3) 14 AWG CCA = 10 A VERIFIED-2023; items (1),(2),(4)–(8) **UNVERIFIED** | S9, S16 |
| 4 | 240.6(A) | **UNVERIFIED** | — |
| 5 | Table 250.66 | VERIFIED-other-edition (NFPA 2020 fact sheet) | S5 |
| 5 | Table 250.122 (15–6000 A) | VERIFIED-other-edition (2020 fact sheet and 2026 Second Draft identical; "No technical changes") | S5, S6 |
| 6 | Table 314.16(A), 314.16(B), 314.16(B)(1)–(5) | **UNVERIFIED** | — |
| 7 | Chapter 9 Tables 1, 4, 5 | **UNVERIFIED** | — |
| 8 | Tables 430.248, 430.250 | **UNVERIFIED** | — |
| 8 | Table 430.52(C)(1) | VERIFIED-other-edition (2026 First Draft working draft; edit marks lost) | S7 |
| 8 | 430.22 (125%), 430.32 (115/125%) | **UNVERIFIED** | — |
| 9 | 220.53, 220.57 | **VERIFIED-2023** | S9 |
| 9 | Table 220.12 → 220.42(A) non-dwelling renumbering | VERIFIED-2023 (renumbering only; dwelling VA/ft² not seen) | S15 |
| 9 | Table 220.55, 220.54, 220.52, Table 220.42 dwelling, 220.82, 220.83, 220.87 | **UNVERIFIED** | — |
| 10 | Table 630.11(A), 630.12 | **UNVERIFIED** | — |
| 11 | 551.71(A)(B)(C)(F) | **VERIFIED-2023** | S9 |
| 11 | Table 551.73(A) | **UNVERIFIED** | — |
| 12 | 625.40, 625.42(A)(B), 625.43 | **VERIFIED-2023** | S9 |
| 12 | 625.41; 210.19(A)(1); 210.20(A); 210.19/215.2 voltage-drop informational notes | **UNVERIFIED** | — |
| 13 | 680.5(A)–(C), 680.22(A)(4) | **VERIFIED-2023** | S9 |
| 13 | 680.21, 680.42, 680.44 | **UNVERIFIED** | — |

**Audit flags from what was seen:**
- 2023 240.4(D) has **8 items**, with a new **(D)(3) 14 AWG copper-clad aluminum = 10 A** (continuous load ≤ 8 A; OCPD listed and marked for 14 AWG CCA). Any calculator that cites "240.4(D)(3)" for 14 AWG copper is mis-citing the 2023 numbering.
- 2023 310.3(A) minimum conductor sizes: 14 AWG Cu, 12 AWG CCA, 12 AWG Al.
- 2023 EVSE: 625.40 requires an individual branch circuit for EVSE outlets above 16 A or 120 V. 625.42 treats EV charging as a continuous load. 220.57 sets the EVSE load at the larger of 7200 VA or nameplate.
- 2026 (drafts only, final text not seen): the 18 AWG row is dropped from Table 310.16 (moved to MI/MTW notes); 16 AWG Cu 60 °C = 10 A and 14 AWG CCA = 10 A are added; Table 250.122 becomes 250.122(A); 310.3 becomes 310.5; load calculations move to Article 120 (secondary source).

---

## Source registry

| ID | Publisher / reproduction | Edition / base text | URL | Permission / copyright notice (as extracted) | Notes |
|---|---|---|---|---|---|
| S1 | NFPA. TIA Log 1691 public comment circulation memo (Feb 14, 2023) | NFPA 70-2023 Table 310.16, reprinted in full with a proposed TIA edit | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_PubCommCirc.pdf | NFPA's own document; carries "1. Revise Table 310.16 to read as follows:" | The proposal added 14 AWG copper-clad aluminum (CCA). Strike/underline marks are lost in extraction. |
| S2 | NFPA. TIA Log 1691 final ballot memo (Feb 21, 2023) | NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_BallotFinal.pdf | NFPA's own document | **TIA failed**: technical merit 9 agree / 5 disagree / 1 abstain (11 needed); emergency nature 8 / 7 / 0 (12 needed). The 2023 Table 310.16 therefore stands as printed, without the TIA-proposed CCA row. |
| S3 | NFPA. CMP-6 First Draft final ballot results, A2025 cycle (memo Apr 29, 2024) | Draft revision toward NFPA 70-2026. FRs are tagged "NFPA 70-2024". Base text is 2023. | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_BallotFinal.pdf | NFPA's own document | Contains FR-8257 (Table 310.16), FR-7943/7953/8031 (310.12), FR-7961 (310.15(B)), FR-8033/8034 (310.15(C)(1)). |
| S4 | NFPA. CMP-6 Second Draft working draft, A2025 (Oct 2024; "content not final") | Draft toward NFPA 70-2026 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_PrelimSR.pdf | NFPA's own document | SR-8602 (Table 310.16), CC-8481, SR-8425 (310.3 renumbered to 310.5), SR-8473 (310.12(D) text relocated). |
| S5 | NFPA. "Using the Tables in Article 250 of the NEC®" (© 2020 National Fire Protection Association / June 2020), hosted by the City of Salinas | NEC 2020-era (edition not printed; dated June 2020) | https://www.salinas.gov/files/sharedassets/city/v/1/fire-department/documents/grounding-bonding-fact-sheet.pdf (linked as https://cityofsalinas.org/files/sharedassets/city/v/1/fire/documents/grounding-bonding-fact-sheet.pdf, which redirects) | "© 2020 National Fire Protection Association / June 2020"; "This material is not the official position of any NFPA Technical Committee on any referenced topic." | NFPA-authored, so primary. Tables 250.66, 250.102(C)(1), 250.122. |
| S6 | NFPA. CMP-5 Second Draft working draft, A2025 (Oct 2024) | Draft toward NFPA 70-2026 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf | NFPA's own document | SR-8360: Table 250.122 relabeled 250.122(A). Committee statement: "No technical changes occurred as a result of this revision." |
| S7 | NFPA. CMP-11 First Draft working draft, A2025 (meeting Jan 18–20, 2024; printed 2/2/2024) | Draft toward NFPA 70-2026 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_FD_PrelimFR.pdf | NFPA's own document | FR-7971: Table 430.52(C)(1), with proposed edits mixed in (marks lost). |
| S8 | NFPA. CMP-11 Second Draft working draft, A2025 (Oct 2024) | Draft toward NFPA 70-2026 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P11_SD_PrelimSR.pdf | NFPA's own document | Tables 430.247/248/249/250 and 430.52(C)(1) are **referenced only** (no rows). New Table 430.22(H) (SR-8012). |
| S9 | Leviton. "Captain Code 2023" web pages (nodes 313, 319, 324, 346, 352, 357, 362, 365) | NFPA 70-2023 | https://captaincode2023.leviton.com/node/313 (and /node/319, /324, /346, /352, /357, /362, /365) | "Material taken from the National Electric Code[®] is reprinted with permission from NFPA 70[®], 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved." (The extractor rendered the bracketed ® marks as "."; node/324 carries no notice.) | Excerpts of individual sections only; no full tables. |
| S10 | NFPA. Errata 70-23-1 (Sep 1, 2022) and 70-23-2 (Sep 15, 2022) | NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_1.pdf ; https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_70_23_2.pdf | NFPA's own documents | Neither touches any table in scope. 70-23-1 fixes 210.11(C)(3)/(C)(4) cross-references; 70-23-2 fixes 555.53, 702.4(A)(2) and Annex C page numbers. |
| S11 | New Jersey DCA. Compilation of NFPA 70-2023 TIAs 23-1 to 23-13 | NFPA 70-2023 | https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf | NFPA TIA pages: "Copyright © 2021/2022/2023 All Rights Reserved … NATIONAL FIRE PROTECTION ASSOCIATION" | Only TIA 23-9 (pool definition; 680.26 bonding) touches an in-scope article. None touches any in-scope table. |
| S12 | NFPA. TIA 23-20 (issued Aug 20, 2025; effective Sep 9, 2025) | NFPA 70-2023 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/TIA_70_23_20.pdf | NFPA's own document | New 430.132: GFCI/SPGFCI shall not be installed between power conversion equipment output and the motor. Not in scope; recorded for completeness. |
| S13 | NFPA. TIA Log 1892 final ballot (May 29, 2026) | NFPA 70-2026, 625.54 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2028_NEC_AAC_Log1892_BallotFinal.pdf | NFPA's own document | Memo says passed 8–2 (one voter comment says it failed). Concerns EVSE receptacle GFCI wording in the 2026 NEC. |
| S14 | NFPA. CMP-12 Second Draft final ballot, A2025 (Jan 9, 2025) | Draft toward NFPA 70-2026 | https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_SD_BallotFinal.pdf | NFPA's own document | SR-8103 revises 625.42. No 625.40/625.41/630.x content. |
| S15 | NFPA presentation "Changes to the National Electrical Code® 2023 Edition" (3/29/2023), hosted by Georgia DCA | NFPA 70-2023 | https://dca.georgia.gov/document/public-notices/2023necchangespresentationpdf/download | "© National Fire Protection Association. All rights reserved." | Slide shows "Table 220.12 → 220.42(A) General Lighting Loads by Non-Dwelling Occupancy". |
| S16 | Leviton "2023 Captain Code NEC Code Changes" PDF brochure | NFPA 70-2023 | https://leviton.com/content/dam/leviton/commercial-industrial/product_documents/take_one/2023-Captain-Code-NEC-Code-Changes%20(1).pdf | "Material taken from the National Electric Code® is reprinted with permission from NFPA 70®, 2023 edition." / "National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved." | Same section list as S9. Adds the exact 240.4(D) lead-in sentence. No NEC tables. |
| X4 | EC&M article, "NEC General Requirements for Branch-Circuit, Feeder, and Service Load Calculations" (secondary, **not authorized**) | NEC 2026 | https://www.ecmweb.com/national-electrical-code/article/55384556/nec-general-requirements-for-branch-circuit-feeder-and-service-load-calculations | No NFPA notice | Quote: "Article 120 in the 2026 NEC provides the requirements for branch-circuit, feeder, and service load calculations." Used only to flag the 2026 renumbering. |
| X1 | Cerrowire ampacity chart (non-authorized; cross-check only) | "Ampacities are based on the 2017 NEC" | https://www.cerrowire.com/products/resources/tables-calculators/ampacity-charts/ | **No NFPA permission notice** | Partial table (no 400/700/800/900/1250–2000 kcmil rows; no Al 60 °C column). |
| X2 | 2022 California Electrical Code (Title 24 Part 3), Public.Resource.Org copy | NEC 2020 with CA amendments | https://law.resource.org/pub/us/code/ca/2022_California_Electrical_Code.pdf | "Portions of this publication are reproduced with permission from the National Electrical Code®, 2020 edition, copyright © 2019 National Fire Protection Association…" | **Authorized, but unreadable past ~103K chars.** Article 310 starts on p. 70-177, beyond what WebFetch could extract. No values taken. |
| X3 | Public.Resource.Org NEC scans on archive.org: 1999, 2002, 2005, 2008, 2011, 2014, 2017 (no 2020 or 2023 found) | Various | https://archive.org/details/gov.law.nfpa.nec.2017 | PRO statement: "legally binding document duly incorporated by reference" | The djvu text truncates at ~107K chars in WebFetch. No table values reachable. |

**Blocked or declined (not routed around):**
- UpCodes viewer for NFPA 70-2023 (https://up.codes/viewer/nfpa/nfpa-70-2023 and https://up.codes/code/nfpa-70-national-electrical-code-2023): blocked by robots.txt.
- law.resource.org directory listing (https://law.resource.org/pub/us/code/ibr/): permission request timed out; not retried.
- Thomas & Betts "NEC 310.16" PDF on media.distributordatasolutions.com: blocked by robots.txt.
- NFPA "Using the NEC Ampacity Charts" download (https://go.nfpa.org/l/14662/2021-06-25/8hmv17): gated lead form, no table content.
- Schneider/Square D NA Digest motor protection tables (https://productinfo.se.com/nadigest/...): states "2017 National Electrical Code", has no permission notice, and the extractor declined to copy it. Not used.
- 2025 California Electrical Code docx from DGS/BSC (https://www.dgs.ca.gov/-/media/Divisions/BSC/02-Codes/2025-CEC_2025-07-01.docx): 404 page not found.
- Appleton/O-Z Gedney steel box catalog (https://appleton.emerson.com/documents/catalog-general-steel-box-cover-information-appleton-o-z-gedney-en-7441948.pdf): returned page metadata only, no content.
- Woodstock CT solar drawing set (https://www.woodstockct.gov/sites/g/files/vyhlif5481/f/pages/2025-06-06_woodstock_solar_-_ifp-2.pdf): reproduces Tables 250.102(C)(1) and 250.122 but has **no NFPA permission notice**. Not used.
- IAEI "NFPA Code Talk" (https://iaeimagazine.org/?p=21045, same article as the /columns/ URL): NFPA staff author, but no permission notice and no table rows. Not used.
- Web-search budget for this session ran out partway through. Sources that a further search might find were not pursued: manufacturer Chapter 9 conduit-fill charts, box-fill charts, Bussmann/Eaton motor FLC tables, and RV and welder tables.

---

## 1. Table 310.16: Ampacities of insulated conductors, not more than three current-carrying conductors in raceway, cable, or earth (directly buried), based on 30 °C ambient

### 1a. NFPA 70-2023 (base text). Status: **VERIFIED-2023**

- Source: S1 (NFPA TIA 1691 circulation, which reprints the 2023 table). S2 confirms the TIA failed, so the 2023 printed table is the S1 table **without** the TIA-proposed 14 AWG CCA value.
- Edition: NFPA 70-2023
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_PubCommCirc.pdf
- Permission notice: NFPA-published document (no reprint notice needed)
- Retrieved: 2026-10-19
- Cross-checks: identical values for every row 12 AWG to 2000 kcmil in S3 (NFPA 2026 First Draft, FR-8257). X1 (Cerrowire, 2017 basis) matches every value it lists.

Title (raw): "Table 310.16 Ampacities of Insulated Conductors with Not More Than Three Current-Carrying Conductors in Raceway, Cable, or Earth (Directly Buried)". Header: "Temperature Rating of Conductor [See Table 310.4(A)]". The extractor rendered the table reference as 310.4(A); in other places the 2023 code numbers it 310.4(1). Check against the printed code.

Column types (raw, as extracted):
- Copper 60 °C (140 °F): Types TW, UF
- Copper 75 °C (167 °F): Types RHW, THHW, THW, THWN, XHHW, XHWN, USE, ZW
- Copper 90 °C (194 °F): Types TBS, SA, SIS, FEP, FEPB, MI, PFA, RHH, RHW-2, THHN, THHW, THW-2, THWN-2, USE-2, XHH, XHHW, XHHW-2, XHWN, XHWN-2, XHHN, Z, ZW-2
- Aluminum or copper-clad aluminum 60 °C: Types TW, UF
- Aluminum/CCA 75 °C: Types RHW, THHW, THW, THWN, XHHW, XHWN, USE
- Aluminum/CCA 90 °C: Types TBS, SA, SIS, THHN, THHW, THW-2, THWN-2, RHH, RHW-2, USE-2, XHH, XHHW, XHHW-2, XHWN, XHWN-2, XHHN

| Size (AWG/kcmil) | Cu 60 °C | Cu 75 °C | Cu 90 °C | Al/CCA 60 °C | Al/CCA 75 °C | Al/CCA 90 °C |
|---|---|---|---|---|---|---|
| 18* | — | — | 14 | — | — | — |
| 16* | — | — | 18 | — | — | — |
| 14* | 15 | 20 | 25 | — (TIA proposed "10†"; TIA failed) | — | — |
| 12* | 20 | 25 | 30 | 15 | 20 | 25 |
| 10* | 30 | 35 | 40 | 25 | 30 | 35 |
| 8 | 40 | 50 | 55 | 35 | 40 | 45 |
| 6 | 55 | 65 | 75 | 40 | 50 | 55 |
| 4 | 70 | 85 | 95 | 55 | 65 | 75 |
| 3 | 85 | 100 | 115 | 65 | 75 | 85 |
| 2 | 95 | 115 | 130 | 75 | 90 | 100 |
| 1 | 110 | 130 | 145 | 85 | 100 | 115 |
| 1/0 | 125 | 150 | 170 | 100 | 120 | 135 |
| 2/0 | 145 | 175 | 195 | 115 | 135 | 150 |
| 3/0 | 165 | 200 | 225 | 130 | 155 | 175 |
| 4/0 | 195 | 230 | 260 | 150 | 180 | 205 |
| 250 | 215 | 255 | 290 | 170 | 205 | 230 |
| 300 | 240 | 285 | 320 | 195 | 230 | 260 |
| 350 | 260 | 310 | 350 | 210 | 250 | 280 |
| 400 | 280 | 335 | 380 | 225 | 270 | 305 |
| 500 | 320 | 380 | 430 | 260 | 310 | 350 |
| 600 | 350 | 420 | 475 | 285 | 340 | 385 |
| 700 | 385 | 460 | 520 | 315 | 375 | 425 |
| 750 | 400 | 475 | 535 | 320 | 385 | 435 |
| 800 | 410 | 490 | 555 | 330 | 395 | 445 |
| 900 | 435 | 520 | 585 | 355 | 425 | 480 |
| 1000 | 455 | 545 | 615 | 375 | 445 | 500 |
| 1250 | 495 | 590 | 665 | 405 | 485 | 545 |
| 1500 | 525 | 625 | 705 | 435 | 520 | 585 |
| 1750 | 545 | 650 | 735 | 455 | 545 | 615 |
| 2000 | 555 | 665 | 750 | 470 | 560 | 630 |

Raw rows for the small sizes (S1): "18* — — 14 — — — —", "16* — — 18 — — — —", "14* 15 20 25 10† — — 14*". The 18 and 16 AWG rows have an extra trailing dash, so their column mapping is inferred from order. The 90 °C placement (14 A for 18 AWG, 18 A for 16 AWG) is corroborated by S3 and S4.

Notes under the table (raw, S1):
1. "Section 310.15(B) shall be referenced for ampacity correction factors where the ambient temperature is other than 30°C (86°F)."
2. "Section 310.15(C)(1) shall be referenced for more than three current-carrying conductors."
3. "Section 310.16 shall be referenced for conditions of use."
- "*Section 240.4(D) shall be referenced for conductor overcurrent protection limitations, except as modified elsewhere in the Code."
- "†Applicable only to copper-clad aluminum conductors." **Probably part of the failed TIA proposal; extraction cannot show whether this line is new or existing text.**
- "Informational Note: See 300.26, 724.49, and Article 725, Part II for sizing of 18 AWG and 16 AWG copper and 14 AWG copper-clad aluminum control conductors as referenced in 330.104 and 336.104." **Same caveat: may be TIA-proposed text, not 2023 printed text.**

### 1b. 2026 cycle changes seen in NFPA drafts. Status: **VERIFIED-other-edition (2026 drafts, not final text)**

- S3, FR-8257 (First Draft, passed ballot 7 affirmative + 6 affirmative with comment; 5 negative; 1 abstention; 1 not returned). Adds **16 AWG Cu 60 °C = 10 A** and **14 AWG CCA 60 °C = 10 A†**. The committee statement cites "the data provided for 14 AWG copper-clad aluminum and historical use of 16 AWG copper". The S3 footnotes match S1 except for "Code code", which looks like a tracked-change artifact.
- S4, SR-8602 (Second Draft working draft): **deletes the 18 AWG row**. Type MTW and MI 90 °C ampacities move to table notes "to avoid conflict with the newly added 16 AWG copper ampacities for 10-amp lighting circuits". The 16 AWG Cu and 14 AWG CCA entries are retained. CC-8481 shows further values with footnote letters (raw: "16* a 10— 15c 18 20c — — — —"; "14* a 15 20 25 10† bc — 15bc — 20bc 14† a"). These are a committee comment, not adopted text, and are unresolved.
- S4 SR-8602 rows for 12 AWG through 2000 kcmil were re-extracted. **All values are identical to the 2023 table in 1a.**
- S4 SR-8602 adds Note 4, "Ampacity for 18 AWG copper Type MI and Type MTW shall be 14 amperes at 90°C (194 °F).", and Note 5, "Ampacity for 16 AWG copper Type MI and Type MTW shall be 18 amperes at 90°C (194°F)."
- CC-8481 footnote letters (proposed): a, "Section 240.4(D) shall be referenced for conductor overcurrent protection limitations, except as modified elsewhere in the code."; b, "Ampacity shall be applicable only to copper-clad aluminum conductors."; c, "Ampacity shall be used for adjustment or correction only."
- **The final 2026 printed Table 310.16 was not seen.** Treat the 2026 deltas above as UNVERIFIED for the final edition.

### 1c. 2020 edition

- No 2020 Table 310.16 values were seen. X2, which is authorized, could not be read that far. **UNVERIFIED** for 2020.

---

## 2. Table 310.12: Single-phase dwelling services and feeders

### 2a. Table rows. Status: **VERIFIED-other-edition (NFPA 2026 First Draft; base text carried from 2023)**

- Source: S3 (FR-7943 / FR-7953 / FR-8031). The table is labeled "Table 310.12(A)" in the draft; the 2023 printed label was not seen.
- URL: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_BallotFinal.pdf
- Permission notice: NFPA's own document. Retrieved 2026-10-19.
- The FR committee statements describe wording and scope changes only: the 75 °C-or-greater sentence and relocation of the correction/adjustment sentence. No FR changed table values. A direct 2023 reproduction was **not** seen.

Raw lines (S3): "Table 310.12(A) Single-Phase Dwelling Services and Feeders"

| Service or feeder rating (A) | Copper (AWG/kcmil) | Aluminum or copper-clad aluminum (AWG/kcmil) |
|---|---|---|
| 100 | 4 | 2 |
| 110 | 3 | 1 |
| 125 | 2 | 1/0 |
| 150 | 1 | 2/0 |
| 175 | 1/0 | 3/0 |
| 200 | 2/0 | 4/0 |
| 225 | 3/0 | 250 |
| 250 | 4/0 | 300 |
| 300 | 250 | 350 |
| 350 | 350 | 500 |
| 400 | 400 | 600 |

### 2b. 310.12(A)–(D) text (83% rule). Status: **partially VERIFIED-other-edition (2026 First Draft text)**

Seen in S3 (short excerpts; full text not returned):
- 310.12(A) Services (FR-7943): "…shall be permitted to have an ampacity not less than 83 percent of the service rating." Then: "If no adjustment or correction factors are required, Table 310.12(A) shall be permitted to be applied for conductors or cables rated 75°C (167°F) or greater." The 75 °C sentence is the 2026 First Draft addition.
- 310.12(B) Feeders (FR-7953): "…shall be permitted to have an ampacity not less than 83 percent of the feeder rating." Ends with the same Table 310.12(A) / 75 °C language.
- 310.12 parent text (FR-8031): "Where correction or adjustment factors are required by 310.15(B) or 310.15(C), they shall be [applied]…", relocated from former subdivision (D).
- 310.12(C) and (D) text: **UNVERIFIED**, not returned. S4 SR-8473 relocates 310.12(D) text in the 2026 Second Draft.
- 2023 printed wording: **UNVERIFIED**, not directly seen.

---

## 3. Ambient correction and adjustment factors

### 3a. Table 310.15(B)(1)(1): Ambient temperature correction factors based on 30 °C (86 °F). Status: **VERIFIED-other-edition (NFPA 2026 First Draft; base text carried from 2023)**

- Source: S3, appearing under FR-7961 (310.15(B)(2)). The FR statement covers only the XHHW-2 rooftop exception wording ("ampacity adjustment" changed to "temperature correction"), so the table is unchanged base text. Direct 2023 copy **not** seen.
- Raw header (S3): "Table 310.15(B)(1)(1) Ambient Temperature Correction Factors Based on 30°C (86°F)"; "For ambient temperatures other than 30°C (86°F), multiply the ampacities specified in the ampacity tables by the appropriate correction factor shown below."
- S3 also mentions a companion **Table 310.15(B)(1)(2)**, which was not extracted.

| Ambient °C | 60 °C | 75 °C | 90 °C | Ambient °F |
|---|---|---|---|---|
| 10 or less | 1.29 | 1.20 | 1.15 | 50 or less |
| 11–15 | 1.22 | 1.15 | 1.12 | 51–59 |
| 16–20 | 1.15 | 1.11 | 1.08 | 60–68 |
| 21–25 | 1.08 | 1.05 | 1.04 | 69–77 |
| 26–30 | 1.00 | 1.00 | 1.00 | 78–86 |
| 31–35 | 0.91 | 0.94 | 0.96 | 87–95 |
| 36–40 | 0.82 | 0.88 | 0.91 | 96–104 |
| 41–45 | 0.71 | 0.82 | 0.87 | 105–113 |
| 46–50 | 0.58 | 0.75 | 0.82 | 114–122 |
| 51–55 | 0.41 | 0.67 | 0.76 | 123–131 |
| 56–60 | — | 0.58 | 0.71 | 132–140 |
| 61–65 | — | 0.47 | 0.65 | 141–149 |
| 66–70 | — | 0.33 | 0.58 | 150–158 |
| 71–75 | — | — | 0.50 | 159–167 |
| 76–80 | — | — | 0.41 | 168–176 |
| 81–85 | — | — | 0.29 | 177–185 |

### 3b. Table 310.15(C)(1): Adjustment factors for more than three current-carrying conductors. Status: **VERIFIED-other-edition (NFPA 2026 First Draft)**. All six values in the brief are confirmed.

- Source: S3, FR-8033 (editorial split of the first paragraph) and FR-8034 (column heading revised to refer to Tables 310.16, 310.18 and 310.20). Raw heading in FR-8033: "Percent of Values in Table 310.16 Through Table 310.19, 310.18, and 310.20 as Adjusted for Ambient Temperature if Necessary". The heading mixes struck and new text. Direct 2023 copy **not** seen.

| Number of conductors* | Percent of table values (adjusted for ambient if necessary) |
|---|---|
| 4–6 | 80 |
| 7–9 | 70 |
| 10–20 | 50 |
| 21–30 | 45 |
| 31–40 | 40 |
| 41 and above | 35 |

---

## 4. 240.4(D) small-conductor protection and 240.6(A) standard ratings

### 4a. 240.4(D). Status: **mostly UNVERIFIED**; one item VERIFIED-2023

- 2023 lead-in, raw from S16 (Leviton 2023 brochure, NFPA 2023 permission notice): "(D) Small Conductors. Unless specifically permitted in 240.4(E) or (G), the overcurrent protection shall not exceed that required by 240.4(D)(1) through (D)(8) after any correction factors for ambient temperature and number of conductors have been applied." **This confirms that 2023 has eight items, (D)(1) through (D)(8).**
- Source S9 (Leviton Captain Code 2023, node/313; permission notice present). Only **240.4(D)(3)** was shown:
  - "(D)(3) 14 AWG Copper-Clad Aluminum. 10 amperes, provided all the following conditions are met: (1) Continuous loads do not exceed 8 amperes. (2) Overcurrent protection is provided by one of the following: a. Branch-circuit-rated circuit breakers are listed and marked for use with 14 AWG copper-clad aluminum conductor. b. Branch-circuit-rated fuses are listed and marked for use with 14 AWG copper-clad aluminum conductor."
  - **Implication for the audit:** in 2023 the 240.4(D) list includes a 14 AWG CCA item at (D)(3), so the item numbers of the copper and aluminum items after it differ from 2020. **The numbering and ampere values for 18 AWG, 16 AWG, 14 AWG Cu, 12 AWG Al/CCA, 12 AWG Cu, 10 AWG Al/CCA and 10 AWG Cu were not seen. UNVERIFIED.**
- Related 2023 text seen in S9 (node/313):
  - 310.3(A): "The minimum size of conductors for voltage ratings up to and including 2000 volts shall be 14 AWG copper, 12 AWG copper-clad aluminum, or 12 AWG aluminum, except as permitted elsewhere in this Code."
  - 210.23(A), 10-ampere branch circuits. Permitted: lighting outlets; dwelling unit exhaust fans on bathroom or laundry room lighting circuits; a gas fireplace unit on an individual branch circuit. Not permitted: receptacle outlets; fixed appliances (except individual branch circuits); garage door openers; laundry equipment.
- 2026: S4 SR-8425 renumbers 310.3 to **310.5** (draft).

### 4b. 240.6(A) standard ampere ratings. Status: **UNVERIFIED** (no authorized reproduction found or fetchable)

---

## 5. Grounding tables

### 5a. Table 250.66: Grounding electrode conductor for alternating-current systems. Status: **VERIFIED-other-edition (NFPA 2020-era fact sheet)**; 2023 not directly seen

- Source: S5 (NFPA, "Using the Tables in Article 250 of the NEC®", © 2020 NFPA, June 2020). URL above. Retrieved 2026-10-19.
- Raw title: "Table 250.66 Grounding Electrode Conductor for Alternating-Current Systems"

| Largest ungrounded conductor (or equivalent area for parallel), Copper | … Aluminum or CCA | GEC Copper | GEC Aluminum or CCA |
|---|---|---|---|
| 2 or smaller | 1/0 or smaller | 8 | 6 |
| 1 or 1/0 | 2/0 or 3/0 | 6 | 4 |
| 2/0 or 3/0 | 4/0 or 250 | 4 | 2 |
| Over 3/0 through 350 | Over 250 through 500 | 2 | 1/0 |
| Over 350 through 600 | Over 500 through 900 | 1/0 | 3/0 |
| Over 600 through 1100 | Over 900 through 1750 | 2/0 | 4/0 |
| Over 1100 | Over 1750 | 3/0 | 250 |

Notes (summarized by extractor, not verbatim): (1) For multiple sets of service-entrance conductors, the equivalent size is based on the largest sum of the corresponding conductor areas. (2) Where there are no service-entrance conductors, the GEC is sized to the largest service-entrance conductor required for the load served. (3) See installation restrictions in 250.64.

**Caution (2026 draft, different table):** NFPA CMP-5 First Draft ballot (https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_FD_BallotFinal.pdf, FR-8825, memo Apr 29, 2024) creates a new over-1000 V ac / 1500 V dc grounding article. It was drafted as Article 350 and the statement says it was renumbered to 252. Its "Table 350.66" extracted as "2/0 or 3/0 | 4/0 or 350 | 4 | 2", "Over 3/0 through 350 | Over 350 through 500 | 2 | 1/0", and "Over 1100 | Over 1750 | 3/0 | 350". In other words it reads **350 where S5's Table 250.66 reads 250**, in three cells. This is a different table in a draft and possibly an extraction glitch. **Do not use it for 250.66**; it is listed only so nobody mistakes it for a 2026 change to 250.66.

Bonus, same source: **Table 250.102(C)(1)** (grounded conductor, main bonding jumper, system bonding jumper, supply-side bonding jumper) has the same rows as 250.66 down to "Over 600 through 1100 / Over 900 through 1750 → 2/0 Cu, 4/0 Al". The last row, "Over 1100 / Over 1750", reads "See Notes 1 and 2". Note 1 (summarized): not less than 12½ percent of the area of the largest ungrounded conductor when above 1100 kcmil Cu / 1750 kcmil Al.

### 5b. Table 250.122: Minimum size equipment grounding conductors for grounding raceway and equipment. Status: **VERIFIED-other-edition (NFPA 2020 fact sheet and NFPA 2026 Second Draft agree; 2026 SR says "No technical changes")**; 2023 not directly seen

- Sources: S5 (2020-era) and S6 (2026 Second Draft working draft, SR-8360, labeled "Table 250.122(A)"). The raw rows are identical in both.

| OCPD rating not exceeding (A) | Copper (AWG/kcmil) | Aluminum or copper-clad aluminum* (AWG/kcmil) |
|---|---|---|
| 15 | 14 | 12 |
| 20 | 12 | 10 |
| 60 | 10 | 8 |
| 100 | 8 | 6 |
| 200 | 6 | 4 |
| 300 | 4 | 2 |
| 400 | 3 | 1 |
| 500 | 2 | 1/0 |
| 600 | 1 | 2/0 |
| 800 | 1/0 | 3/0 |
| 1000 | 2/0 | 4/0 |
| 1200 | 3/0 | 250 |
| 1600 | 4/0 | 350 |
| 2000 | 250 | 400 |
| 2500 | 350 | 600 |
| 3000 | 400 | 600 |
| 4000 | 500 | 750 |
| 5000 | 700 | 1250 |
| 6000 | 800 | 1250 |

- Note (raw, both sources): "Note: Where necessary to comply with 250.4(A)(5) or (B)(4), the equipment grounding conductor shall be sized larger than given in this table."
- "*See installation restrictions in 250.120." (raw, S6)
- 2026 draft: renumbered **Table 250.122(A)** (S6, SR-8360).

---

## 6. Box fill: Table 314.16(A), Table 314.16(B), 314.16(B)(1)–(5). Status: **UNVERIFIED**

- NFPA CMP-9 First Draft working draft (https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P09_FD_PrelimFR.pdf) was fetched. It truncated before any 314.16 content; only 314.3, 314.20 and 314.70(A) references were visible.
- No authorized reproduction of the table values or counting rules was obtained.

---

## 7. Chapter 9 Tables 1, 4, 5. Status: **UNVERIFIED**

- The CMP-6 First Draft prelim (https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf) truncated at page 55 of 109 with no Chapter 9 Table 5 content. Its only Chapter 9 mention is a Table 8 informational note.
- S10 (Errata 70-23-2) corrects Annex C table page numbers only. TIA 23-7 (S11) revises headers of Annex C Tables C.18–C.20 (cable tray), not Chapter 9.
- No values captured for fill percentages (53/31/40), Table 4 conduit areas, or Table 5 conductor areas.

---

## 8. Motors (Article 430)

### 8a. Table 430.248 (single-phase FLC) and Table 430.250 (three-phase FLC). Status: **UNVERIFIED**

- NFPA CMP-11 drafts S7 and S8 only reference these tables; they were not revised in the 2026 cycle drafts seen. The Schneider Digest page (2017 NEC basis, no permission notice) was not used.

### 8b. Table 430.52(C)(1): Maximum rating or setting of motor branch-circuit short-circuit and ground-fault protective devices (percent of FLC). Status: **VERIFIED-other-edition (NFPA 2026 First Draft working draft, with proposed edits mixed in)**; 2023 not directly seen

- Source: S7, FR-7971 (from Public Input No. 1471). Committee statement excerpt: "the ratings for instantaneous trip circuit breakers need further technical substantiation"; it also notes the need to include Design BE and CE motors.
- Columns, in order: nontime-delay fuse | dual-element (time-delay) fuse | instantaneous-trip breaker | inverse-time breaker.
- Raw rows (S7):

| Type of motor (raw text) | Nontime-delay fuse | Dual-element fuse | Instantaneous-trip breaker | Inverse-time breaker |
|---|---|---|---|---|
| Single-phase motors | 300 | 175 | 800 | 250 |
| AC polyphase motors other than wound-rotor | 300 | 175 | 800 | 250 |
| Squirrel cage — other than Design B or C energy-efficient — and Design B or C premium efficiency | 300 | 175 | 800 | 250 |
| "Design B energy-efficient and , Design B premium efficiency, Design BE and Design CE" | 300 | 175 | 1100 | 250 |
| Synchronous (footnote 3) | 300 | 175 | 800 | 250 |
| Wound-rotor | 150 | 150 | 800 | 150 |
| DC (constant voltage) | 150 | 150 | 250 | 150 |

- Caveat: the row labels contain struck and added words (for example "Design B energy-efficient and , …"). Which words are 2023 text and which are 2026 proposals cannot be separated from this extraction. Use for cross-checking only.

### 8c. 430.22 (125%), 430.32 (115%/125%). Status: **UNVERIFIED**

- S8 shows a new 430.22(H) for Design BE and CE motors (2026 draft) with new **Table 430.22(H) Conductor Short Circuit Factors (Fc)**. Raw: .0662 Cu thermoset 75/200 °C; .0614 Cu thermoset 90/200; .0587 Cu thermoplastic 60/150; .0529 Cu thermoplastic 75/150; .0468 Cu thermoplastic 90/150; .0433 Al thermoset 75/200; .0402 Al thermoset 90/200; .0384 Al thermoplastic 60/150; .0346 Al thermoplastic 75/150; .0306 Al thermoplastic 90/150. This is 2026-only; not in scope unless the site adds 2026 content.
- S7 shows only 430.32(D)(2) (FR-7945, editorial). The percentage rules were not seen.

### 8d. 430.6(A) (2023). Status: **VERIFIED-2023 (partial)**

- S9 node/346 contains only the start of 430.6(A): "Other than for motors built for low speeds (less than 1200 RPM) or high torques, and for multispeed motors…" The rest was not returned.

---

## 9. Load calculations (Article 220)

### 9a. 220.53 and 220.57 (2023). Status: **VERIFIED-2023**

- Source: S9 node/319 (Leviton, 2023 permission notice).
- 220.53: "Applying a demand factor of 75 percent to the nameplate rating load of four or more appliances rated 1⁄4 hp or greater, or 500 watts or greater, that are fastened in place, and that are served by the same feeder or service in a one-family, two-family, or multifamily dwelling shall be permitted." The demand factor does not apply to: (1) household electric cooking equipment that is fastened in place, (2) clothes dryers, (3) space heating equipment, (4) air-conditioning equipment, (5) electric vehicle supply equipment (EVSE).
- 220.57: "The EVSE load shall be calculated at either 7200 watts (volt-amperes) or the nameplate rating of the equipment, whichever is larger."

### 9b. Table 220.12 renumbering (2023). Status: **VERIFIED-2023 (renumbering only)**

- Source: S15 (NFPA 2023 changes presentation). The slide shows "Table 220.12 → 220.42(A) General Lighting Loads by Non-Dwelling Occupancy", with sample rows "School/university 33 16 3 1.5" and "Sports arena 33 16 3 1.5". The columns are garbled. **The dwelling-unit VA/ft² value was not seen.**

### 9c. Table 220.55, 220.54, 220.52, Table 220.42 (dwelling demand factors), 220.82, 220.83, 220.87. Status: **UNVERIFIED**

- 2026 note (secondary, X4, not authorized): load calculations are in **Article 120** of the 2026 NEC. New section numbers for the 220.x items in this list were not seen.
- No authorized reproduction was obtained. An IAEI "NFPA Code Talk" article by NFPA staff (Mar 2021, https://iaeimagazine.org/columns/nfpa-code-talk/performing-calculations-a-necessity-to-apply-the-requirements-of-the-nec) only paraphrases Table 220.55 ("25 kW plus ¾ kW per range") and carries no permission notice. Not counted.

---

## 10. Welders: Table 630.11(A), 630.12. Status: **UNVERIFIED**

- CMP-12 Second Draft ballot (S14) contains no 630.x content. Captain Code 2023 has 630.8 (GFCI for hand-tool receptacles in welding areas) only; not fetched as out of scope.

---

## 11. RV parks

### 11a. 551.71 receptacle requirements (2023). Status: **VERIFIED-2023**

- Source: S9 node/352 (Leviton, 2023 permission notice).
- (A) 20-ampere: every RV site with electrical supply shall have "at least one 20-ampere, 125-volt weather-resistant receptacle", which "shall not be required to be tamper-resistant in accordance with 406.12."
- (B) 30-ampere: "A minimum of 70 percent of all recreational vehicle sites with electrical supply" shall have "a 30-ampere, 125-volt weather-resistant receptacle conforming to 551.46(C)(1)". The remainder have "one or more of the receptacle configurations conforming to 551.81."
- (C) 50-ampere: "A minimum of 20 percent of existing and 40 percent of all new recreational vehicle sites with electrical supply" shall have "a 50-ampere, 125/250-volt weather-resistant receptacle" conforming to Figure 551.46(C)(1). Every site with a 50 A receptacle shall also have a 30 A, 125 V receptacle. "The weather-resistant requirement for 50-ampere, 125/250-volt receptacles shall become effective January 1, 2026."
- (F) GFCI: "Ground-fault circuit-interrupter protection shall only be required for" 125-volt, single-phase, 15- and 20-ampere receptacles (RV site equipment).

### 11b. Table 551.73(A) demand factors. Status: **UNVERIFIED**

---

## 12. EVSE and continuous-load rules

### 12a. 625.40, 625.42, 625.43 (2023). Status: **VERIFIED-2023**

- Source: S9 node/357 (Leviton, 2023 permission notice).
- 625.40: "Each outlet installed for the purpose of supplying EVSE greater than 16 amperes or 120 volts shall be supplied by an individual branch circuit." Exception: "Branch circuits shall be permitted to feed multiple EVSE's as permitted by 625.42(A) or (B)."
- 625.42: "The EVSE shall have sufficient rating to supply the load served. Electric vehicle charging loads shall be considered to be continuous loads for the purposes of this article. Service and feeder shall be sized in accordance with the product ratings, unless the overall rating of the installation can be limited through controls as permitted by 625.42(A) or (B)."
  - (A) EMS: "Where an EMS in accordance with 750.30 provides load management of EVSE, the maximum equipment load on a service and feeder shall be the maximum load permitted by the EMS."
  - (B) Adjustable settings: "EVSE with restricted access to an ampere adjusting means complying with 750.30(C) shall be permitted. EVSE as referenced shall be permitted to have ampere ratings that are equal to the adjusted current settings."
- 625.43: "For EVSE and WPTE rated more than 60 amperes or more than 150 volts to ground, the disconnecting means shall be provided and installed in a readily accessible location. If the disconnecting means is installed remote from the equipment, a plaque shall be installed on the equipment denoting the location of the disconnecting means. The disconnecting means shall be lockable open in accordance with 110.25."
- 2026 draft: S14 SR-8103 revises 625.42, opening "The service, feeder, and branch circuit supplying EVSE shall have sufficient rating to supply the load served," and adds "EVSE with a current adjustment setting shall be permitted if restricted access to the adjustment setting…". Committee statement: aligns terminology with Article 130, Part II.
- 2026 TIA: S13, TIA Log 1892 on 625.54 (EVSE GFCI) of NFPA 70-2026; memo reports passed 8–2.

### 12b. 625.41 (125% overcurrent protection). Status: **UNVERIFIED**, not on any fetched page

### 12c. 210.19(A)(1), 210.20(A) 125% continuous rule; 210.19 and 215.2 informational notes (3% / 5% voltage drop). Status: **UNVERIFIED**

---

## 13. Pools, spas and hot tubs

### 13a. 680.5(A)–(C) and 680.22(A)(4) (2023). Status: **VERIFIED-2023**

- Source: S9 node/362 and node/365 (Leviton, 2023 permission notice).
- 680.5(A): "The GFCI and SPGFCI requirements in this article, unless otherwise noted, are in addition to the requirements in 210.8."
- 680.5(B), 150 V or less to ground: "Where required in this article, ground-fault protection of receptacles and outlets on branch circuits rated 150 volts or less to ground and 60 amperes or less, single- or 3-phase, shall be provided with a Class A GFCI."
  - Exception: listed low-voltage equipment supplied by listed transformers or power supplies complying with 680.23(A)(2).
  - Informational Note: the high leg of a 120/240-volt 4-wire delta system exceeds 150 V to ground.
- 680.5(C), above 150 V to ground: "…operating at voltages above 150 volts to ground, not exceeding 480 volts phase-to-phase, single- or 3-phase, shall be provided with SPGFCI protection not to exceed 20-mA ground-fault trip current." The Informational Note cites UL 943C (Classes C, D, E).
- 680.22(A)(4): "All receptacles rated 125 volts through 250 volts, 60 amperes or less, located within 6.0 m (20 ft.) of the inside walls of a pool shall have GFCI protection complying with 680.5(B) or SPGFCI protection complying with 680.5(C), as applicable."
- 2023 TIA 23-9 (S11) revises the "Pool" definition and 680.26 equipotential bonding. Affects bonding content only.

### 13b. 680.21 (pool pump motor GFCI), 680.42, 680.44 (spa/hot tub). Status: **UNVERIFIED**
