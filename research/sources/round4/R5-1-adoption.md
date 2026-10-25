# R5-1: NEC adoption loose ends (HI, AR, WY, TN, LA, MS, NV), state government sources

Continues R4-6 and R4-6b. Status date and retrieval date for every fetch in this run: 2026-10-24. Sources quoted from R4-6 keep 2026-10-20. The agent could not write this file itself (the Write tool refused subagent report files); the coordinator saved its inline report here unchanged in substance, with the three JSON blocks taken from the agent's validated files (research2/r5_tmp/r5_1_block_01–03.json). Section 9 is a coordinator addendum.

**Method**
- WebSearch: 24 of 24 used. NFPA host: not used.
- Only URLs from a search result or a fetched page's links were fetched. No block was routed around.
- Quotes come through the extraction model in segments under 120 characters. "Paraphrase" marks text the extractor summarized.
- Every value marked VERIFIED had at least two pulls. Planted wrong values ("canaries") were used where noted, and all were rejected.
- Primary sources are state government documents. Bills are used for the statute text they print. County, city, Cornell LII and private testimony are pointers or corroboration only.
- No permission or copyright notice was captured; these are public records.

## 1. Status matrix

| Target | Finding | Edition | Since | Status |
|---|---|---|---|---|
| HI | The default rule (HRS 107-24(c)) covers every code listed in 107-25, including the NEC. The council adopted nothing in 2023–2025. No state statement of the resulting NEC edition or date. No 2026 council action on the NEC found. | 2020 (council-adopted) vs. 2023 (possible statutory default) | 2022-03-15 for 2020; unknown for 2023 | **CONFLICTING** |
| AR | 17 CAR § 210-601; history "Ark. R. 2026-108 (eff. September 3, 2026)" | 2026 | **2026-09-03** | **VERIFIED** (3 pulls, 4 canaries rejected) |
| WY | No start date found; the electrical Chapter 2 on rules.wyo.gov was unreachable | 2026 | — | UNVERIFIED date (unchanged) |
| TN | Fire marshal's page re-read today: still 2017. A July 2025 chapter revision exists but couldn't be read. | 2017 | 2018-10-01 | VERIFIED (unchanged), open risk |
| LA | 2023-NEC Notice of Intent published August 20, 2026 (Vol. 52 No. 8, pp. 1403–1432), proposed effective 2027-01-01; not final. 2020 start date unresolved. | 2020 | null | edition VERIFIED; date CONFLICTING; 2023 PROPOSED |
| MS | Nothing new | — | — | UNVERIFIED |
| NV | NRS 244.3675(2) and 268.413(2): local power to adopt electrical codes. NAC 477.281 has no NFPA 70. State buildings: 2023 NEC. | local | — | **VERIFIED (local)** |

**Counts:** 49 of 51 verified (NV added, HI removed). Not verified: HI, MS.

| Edition | Verified jurisdictions |
|---|---|
| 2026 | 8 (AR now dated; WY undated) |
| 2023 | 21 |
| 2020 | 11 |
| 2017 | 1 |
| 2014 | 1 |
| 2008 | 1 |
| Local adoption | 6 (MD, AZ, IL, KS, MO, NV) |

## 2. Evidence by target

### HI: CONFLICTING

**Q1. Does the default rule apply to the NEC? Yes, on the statute's words.**

1. **HRS 107-24(c), as printed in S.B. 48 (2025, as introduced).** The bill prints subsection (c) unchanged. https://data.capitol.hawaii.gov/sessions/session2025/bills/SB48_.PDF
   - "(c) The council shall adopt, amend, or update codes and standards identified in section 107-25 on a"
   - "staggered basis as established by the council; provided that adoption of a code or standard shall be within"
   - "two years of the official publication date of the code or standard, pursuant to chapter 92, and exempt from"
   - "the requirements of chapter 91. If the council does not adopt a code or standard identified in section"
   - "107-25 within the two-year time period, that code or standard shall automatically become part of the Hawaii"
   - "state building code until superseded by the adoption of an amended version of the code or standard"
   - "by the council pursuant to this subsection."
   - Canary rejected: "eighteen months".
2. **Second copy:** S.B. 120 (2025) prints the same subsection as text it would delete. https://data.capitol.hawaii.gov/sessions/session2025/bills/SB120_.HTM
   - "If the council does not adopt a code or standard identified in section 107-25 within the two-year time period,"
   - "that code or standard shall automatically become part of the Hawaii state building code until superseded"
   - A third copy, non-government, is in an IBEW Local 1260 attachment to the S.B. 48 testimony.
3. **Current law in January 2025:** Attorney General testimony on S.B. 120 (single pull): "Although the bill would repeal the SBCC's authority to adopt state building codes" / "currently set forth in section 107-24(c),".
4. **S.B. 2994 (2024)** proposed "within two years of [the] *every other* official publication date". The January 2025 bills print the original wording, so it had not been enacted by then.
5. **HRS 107-25(a), as printed in H.B. 745 (2025) and H.B. 745 H.D. 1 (two pulls):**
   - "There is established the Hawaii state building codes applicable to all construction in the State of Hawaii."
   - "The Hawaii state building codes shall be based upon:"
   - Item (4): "The National Electrical Code, as published by the National Fire Protection Association;"
   - Canary rejected: "item (4) names an edition year".
   - The default applies to "a code or standard identified in section 107-25". Paraphrase of the list: state fire code; UPC; IBC, IRC and IECC; NEC; Hawaii design standards; other national codes. Nothing limits the default to particular codes.
6. **The council's own reading:** SBCC minutes of July 21, 2020, two pulls. https://ags.hawaii.gov/wp-content/uploads/2020/08/2020-07-21-minutes.pdf
   - "national codes within the two years, the national codes become the State Building"
   - "Codes until it is superseded by the SBCC’s adoption of an amended version of the"
   - "DAG Kam confirmed this interpretation."
   - Canaries rejected: "eighteen months"; "the DAG rejected the interpretation"; "the NEC is excluded from default adoption".
7. **The NEC is one of the council's codes:**
   - DAGS report, December 2018: "f. The National Electrical Code (NEC)".
   - 2022 adoption notice (R4-6): "In accordance with HRS 107-24 the Hawai‘i State Building Code Council adopted the 2020 NFPA, NEC on March 15, 2022."

**Q2. Which NEC edition is in the state code now, and since when? Not determinable from state documents.**
- No codes were adopted in 2023, 2024 or 2025.
- DAGS, December 2025 (R4-6b): "As a result, the 2021 model Codes for IBC, IRC, and IECC were adopted by default in the State". It says nothing about the NEC.
- No state source read gives the 2023 NEC's official publication date.
- Inference, not verified: the 2023 NEC came from NFPA's A2022 revision cycle, so its two-year period would have ended during 2024. The 2026 NEC (A2025 cycle) cannot have defaulted by today.
- Did the Governor's housing proclamations stop the default? DAGS ties the I-code default to deadlines missed under those proclamations. Non-government testimony also says "notwithstanding the Governor's emergency proclamations' ongoing suspension of the SBCC." The proclamation texts were not read.
- 2026 council action on the NEC: none found.
  - H.B. 1712 (2026) only changes council membership (107-22).
  - H.B. 1725 H.D. 2 and H.B. 356 returned server errors.
  - The HRS and bill-status pages on capitol.hawaii.gov returned client errors, so whether a 2025 or 2026 Act changed 107-24(c) is unconfirmed.
- Hawaii County's code still adopts the 2017 NEC (R4-6).

### AR: 2026 NEC effective 2026-09-03 (VERIFIED)
- Source: Code of Arkansas Rules, 17 CAR § 210-601, page "Last Updated: 10/19/2026 9:03:10 AM". https://codeofarrules.arkansas.gov/Rules/Rule?levelType=section&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=8221&sectionID=54198
- Quotes:
  - "17 CAR § 210-601. Adoption of National Electrical Code."
  - "(a) The Board of Electrical Examiners of the State of Arkansas hereby adopts and incorporates herein"
  - "the National Electrical Code, 2026 edition of the National Fire Protection Association."
  - "(b)(1) The National Electrical Code (NFPA 70), 2026, shall be the standard for the construction,"
  - History: "Ark. R. 2026-108 (eff. September 3, 2026)". This is the only rule number on the history line.
  - Authorities: "Arkansas Code § 17-28-202; Arkansas Code § 20-31-104"
- State amendments:
  - "(2) The provisions of AFCI and GFCI shall not be required on dwelling units circuits over 130 volts,"
  - "except for the requirements in Articles 680 and 682 of the 2026 National Electrical Code."
  - (3): exemptions for laundry areas and refrigerator or microwave appliances (paraphrase).
  - "(4) Island and peninsula receptacles are permissible with the following minimum standards:"
- Canaries rejected: "eff. July 1, 2026"; "2023 edition"; "more than one Ark. R. number"; "over 150 volts".
- Sections 210-604 and 210-704 carry the same history line, so Ark. R. 2026-108 re-issued the whole Part.
- The database footer says: "This online searchable database constitutes the official version of the Code" / "of Arkansas Rules and became effective on January 1, 2025." / "It is updated on a weekly basis and may not reflect recent rulemaking."
- Fit with earlier rounds: the March 21, 2026 hearing notice proposed updating "from the 2020 edition" (A7); the Board's rules "EFFECTIVE APRIL 24, 2024" used the 2020 edition (R4-6b). So the 2020 NEC applied until September 3, 2026.
- The ADLL "Final" PDF numbers the section 210-401; the official code numbers it 210-601.

### WY: start date UNVERIFIED
- rules.wyo.gov version 041.0002.1.06262024 (the Council's Chapter 1, effective "06/26/2024 to Current"): "The International Building Code, 2024 Edition, published by the International Code Council." It contains no NEC text.
- The electrical program's Chapter 2 (the rolling "current electrical code" definition, §2-2(v)) could not be reached: Search.aspx?mode=7 is a blank form ("No Results Found"); Agencies.aspx names agency 041 without a link; a built URL would be refused.

### TN: 2017 (unchanged), open risk
- Fire marshal's page, fetched 2026-10-24 (https://www.tn.gov/commerce/fire/codes-enforcement/history.html):
  - "This Page Last Updated: April 17, 2025 at 8:26 AM"
  - "- The National Electrical Code (NEC), 2017 edition, published by the NFPA, except that:"
  - Canaries rejected: "2023 edition"; "updated in 2026".
- Risk: a search result titled "July, 2025 (Revised) 1 RULES OF THE DEPARTMENT OF COMMERCE AND INSURANCE" points to https://publications.tnsosfiles.com/rules/0780/0780-02/0780-02-01.20250714.pdf. It returned client_error, so what changed is unknown.
- Cornell LII (pointer only): rule .02 still reads 2017; its history ends "Amendments filed December 19, 2017; effective 3/19/2018." Rules .05, .21 and .23 show no 2025 entries. Cornell may be behind.

### LA: 2023 NEC still a proposal; 2020 start date CONFLICTING
- **LUCCC page** (release date June 22, 2026; the old LSUCCC address now redirects to luccc.louisiana.gov). https://luccc.louisiana.gov/2023-nec-2024-i-code-adoption-proposed-language-2/
  - "A Notice of Intent to amend and adopt of the 2023 National Electrical Code (NEC)"
  - "and for the 2024 International Codes (I-Codes) was published in the August 20, 2026, Louisiana Register,"
  - "found on pages 1403-1432."
- **The Notice itself, two pulls.** http://luccc.louisiana.gov/wp-content/uploads/Louisiana-Register_August-2026-publication.pdf
  - "1403 Louisiana Register Vol. 52, No. 8 August 20, 2026"
  - "NOTICE OF INTENT" / "Office of the Governor" / "Uniform Construction Code Commission" / "(LAC 17:I.Chapter 1)"
  - "for the purpose of amending and adopting the 2023 edition of the National Electrical Code (NEC) and the 2024"
  - "editions of the I-codes in the state of Louisiana with an effective date of January 1,"
  - Canaries rejected: "2026 edition"; "July 1, 2027"; "finally adopted".
  - The §115 text lies past the reachable text.
- **Act 635 of 2022** (single pull). https://legis.la.gov/legis/ViewDocument.aspx?d=1290009
  - "The codes listed in Subsection A of this Section as adopted by the council shall become effective July 1, 2023."
  - Subsection A lists only "(1) The International Energy Conservation Code." and "(2) The International Residential Code, Part IV Energy Efficiency."
  - R.S. 40:1730.28(A) lists "(8) National Electric Code." with no edition.
- So the July 1, 2023 statutory date covers the energy codes. The 2020-NEC start date stays null.

### MS: UNVERIFIED
Searches 16 and 24 returned only documents R4-6b had already read.

### NV: local (VERIFIED)
- **Statutes, via A.B. 97 (2023, enrolled), two pulls.** https://archive.leg.state.nv.us/Session/82nd2023/Bills/AB/AB97_EN.pdf
  - "244.3675 Subject to the limitations set forth in NRS 244.368, 278.02315, 278.580, 278.582, 278.584,"
  - "278.5846, 278.586, 444.340 to 444.430, inclusive, and 477.030, and section 1 of this act,"
  - "the boards of county commissioners within their respective counties may:"
  - "2. Adopt any building, electrical, housing, plumbing or safety code necessary to carry out the provisions"
  - "the city council or other governing body of an incorporated city may:"
  - "2. Adopt any building, electrical, plumbing or safety code necessary to carry out the provisions" (NRS 268.413)
  - Canaries rejected: "names the 2023 NEC"; "establishes a statewide electrical code".
- **State Fire Marshal, LCB File R205-24, two pulls.** https://www.leg.state.nv.us/Register/2024Register/R205-24A.pdf
  - "477.281 1. The State Fire Marshal hereby adopts by reference the following nationally recognized codes with"
  - "(b) International Building Code, [2018] 2024 edition. A copy is available from the International Code"
  - The NFPA list runs "(x) NFPA 58, ..." then "(y) NFPA 72, [2016] 2022 edition;". There is no NFPA 70, and no struck NFPA 70 entry. Canary rejected. The 2024 IBC's own reference to NFPA 70 was not read.
- **Health Authority plan-review resource** (scoped to health facilities): "Submit the architectural plans to the city or county in which the entity will be constructed for" / "construction requirements, approvals and a building permit."; table heading "Building Codes (Refer to local codes)".
- **State buildings (R4-6b):** "(d) The [2017] 2023 National Electrical Code published by the National Fire Protection Association."

## 3. Machine-readable

### 3a. Evidence (one entry per target; agent file r5_1_block_01.json)

```json
{"evidence":[
{"ref": "HI", "edition": null, "status": "conflicting", "values": {"sbcc_adopted": {"edition": "2020", "effective": "2022-03-15"}, "default_rule": "HRS 107-24(c): a code or standard identified in HRS 107-25 that the council does not adopt within two years of its official publication date automatically becomes part of the Hawaii state building code until superseded by a council-adopted amended version", "nec_identified_in_107_25": true, "default_rule_limited_to_specific_codes": false, "council_adoptions_2023_to_2025": "none (Governor's housing proclamations)", "state_statement_on_nec_default": null, "nec_default_edition": null, "nec_default_date": null, "sbcc_2026_nec_action": "none found (2026 bills on 107-24 unreadable)"}, "quote_segments": ["(c) The council shall adopt, amend, or update codes and standards identified in section 107-25 on a", "staggered basis as established by the council; provided that adoption of a code or standard shall be within", "two years of the official publication date of the code or standard, pursuant to chapter 92, and exempt from", "the requirements of chapter 91. If the council does not adopt a code or standard identified in section", "107-25 within the two-year time period, that code or standard shall automatically become part of the Hawaii", "state building code until superseded by the adoption of an amended version of the code or standard", "by the council pursuant to this subsection."], "source_url": "https://data.capitol.hawaii.gov/sessions/session2025/bills/SB48_.PDF", "document_date": "S.B. 48, 2025 session, as introduced (search title 'JAN 15 2025'); prints 107-24(c) unchanged", "section": "HRS 107-24(c)", "other_sources": [{"url": "https://data.capitol.hawaii.gov/sessions/session2025/bills/SB120_.HTM", "document_date": "S.B. 120, 2025 session, as introduced", "role": "second copy of 107-24(c), printed as text the bill would delete", "quote_segments": ["If the council does not adopt a code or standard identified in section 107-25 within the two-year time period,", "that code or standard shall automatically become part of the Hawaii state building code until superseded"]}, {"url": "https://data.capitol.hawaii.gov/sessions/session2025/testimony/SB48_TESTIMONY_PSM_01-24-25_.PDF", "document_date": "testimony, hearing 2025-01-24", "role": "third copy of 107-24(c) (IBEW Local 1260 attachment; non-government)", "quote_segments": ["time period, that code or standard shall automatically become part of the Hawaii state building code"]}, {"url": "https://data.capitol.hawaii.gov/sessions/session2025/bills/HB745_.HTM", "document_date": "H.B. 745, 2025 session, as introduced", "section": "HRS 107-25(a)", "quote_segments": ["There is established the Hawaii state building codes applicable to all construction in the State of Hawaii.", "The Hawaii state building codes shall be based upon:", "The National Electrical Code, as published by the National Fire Protection Association;"]}, {"url": "https://data.capitol.hawaii.gov/sessions/session2025/bills/HB745_HD1_.HTM", "document_date": "H.B. 745 H.D. 1, 2025 session", "role": "second pull of 107-25(a)(4)", "quote_segments": ["The National Electrical Code, as published by the National Fire Protection Association;"], "canaries": [{"planted": "item (4) names an NEC edition year such as 2020 or 2023", "rejected": true}]}, {"url": "https://ags.hawaii.gov/wp-content/uploads/2020/08/2020-07-21-minutes.pdf", "document_date": "SBCC meeting minutes, July 21, 2020", "reads": 2, "quote_segments": ["the SBCC shall adopt the State Building Codes within two years of the official", "national codes within the two years, the national codes become the State Building", "Codes until it is superseded by the SBCC’s adoption of an amended version of the", "DAG Kam confirmed this interpretation."], "canaries": [{"planted": "period is 'eighteen months'", "rejected": true}, {"planted": "the DAG rejected the interpretation", "rejected": true}, {"planted": "the NEC is excluded from default adoption", "rejected": true}]}, {"url": "https://ags.hawaii.gov/wp-content/uploads/2018/11/AnnualReportBuildingCodeCouncilDec2018.pdf", "document_date": "DAGS annual report on the SBCC, December 2018", "reads": 1, "quote_segments": ["These codes and standards include building, residential, fire, electrical, plumbing, energy, and elevator provisions.", "f. The National Electrical Code (NEC)"]}, {"url": "https://ags.hawaii.gov/wp-content/uploads/2025/12/2025-Annual-Report.pdf", "document_date": "DAGS annual report on the SBCC, December 2025", "role": "read by R4-6b on 2026-10-24; not re-read here", "quote_segments": ["As a result, the 2021 model Codes for IBC, IRC, and IECC were adopted by default in the State"]}, {"url": "https://data.capitol.hawaii.gov/sessions/Session2025/Testimony/SB120_TESTIMONY_PSM_01-24-25_.PDF", "document_date": "testimony, hearing 2025-01-24", "role": "Attorney General line (government); other lines non-government corroboration only", "quote_segments": ["Although the bill would repeal the SBCC's authority to adopt state building codes", "currently set forth in section 107-24(c),", "notwithstanding the Governor's emergency proclamations' ongoing suspension of the SBCC."]}, {"url": "https://data.capitol.hawaii.gov/sessions/session2024/Bills/SB2994_.HTM", "document_date": "S.B. 2994, 2024 session, as introduced", "role": "proposed 'every other' publication-date change; not in the January 2025 text, so not enacted by then", "quote_segments": ["of a code or standard shall be within two years of [the] *every other* official publication date"]}], "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24", "caveat": "Current HRS pages (capitol.hawaii.gov/hrscurrent) returned client_error; 107-24(c) and 107-25 are read from 2025 bill reprints. Whether a 2025 or 2026 Act changed 107-24(c) was not confirmed (status pages client_error; 2026 bill PDFs server_error)."},
{"ref": "AR", "edition": "2026", "status": "verified", "values": {"effective": "2026-09-03", "register": "Ark. R. 2026-108", "section": "17 CAR § 210-601", "prior": {"edition": "2020", "rules_effective": "2024-04-24 (R4-6b)"}}, "quote_segments": ["17 CAR § 210-601. Adoption of National Electrical Code.", "(a) The Board of Electrical Examiners of the State of Arkansas hereby adopts and incorporates herein", "the National Electrical Code, 2026 edition of the National Fire Protection Association.", "(b)(1) The National Electrical Code (NFPA 70), 2026, shall be the standard for the construction,", "Ark. R. 2026-108 (eff. September 3, 2026)", "Arkansas Code § 17-28-202; Arkansas Code § 20-31-104", "(2) The provisions of AFCI and GFCI shall not be required on dwelling units circuits over 130 volts,", "except for the requirements in Articles 680 and 682 of the 2026 National Electrical Code.", "(4) Island and peninsula receptacles are permissible with the following minimum standards:"], "source_url": "https://codeofarrules.arkansas.gov/Rules/Rule?levelType=section&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=8221&sectionID=54198", "document_date": "Code of Arkansas Rules page, 'Last Updated: 10/19/2026 9:03:10 AM'", "reads": 3, "canaries": [{"planted": "History 'Ark. R. 2026-108 (eff. July 1, 2026)'", "rejected": true}, {"planted": "(a) adopts the '2023 edition'", "rejected": true}, {"planted": "History line lists more than one Ark. R. number", "rejected": true}, {"planted": "(b)(2) 'over 150 volts'", "rejected": true}], "other_sources": [{"url": "https://codeofarrules.arkansas.gov/Rules/Rule?levelType=section&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=8222&sectionID=54205", "section": "17 CAR § 210-704", "quote_segments": ["Ark. R. 2026-108 (eff. September 3, 2026)"]}, {"url": "https://codeofarrules.arkansas.gov/Rules/Rule?levelType=section&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=8221&sectionID=54201", "section": "17 CAR § 210-604", "quote_segments": ["Ark. R. 2026-108 (eff. September 3, 2026)"]}, {"url": "https://codeofarrules.arkansas.gov/Rules/Rule?levelType=part&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=&sectionID=", "section": "Part 210 page footer", "quote_segments": ["This online searchable database constitutes the official version of the Code", "of Arkansas Rules and became effective on January 1, 2025.", "It is updated on a weekly basis and may not reflect recent rulemaking."]}], "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24"},
{"ref": "WY-effective", "edition": "2026", "status": "unverified", "values": {"effective": null}, "quote_segments": ["The International Building Code, 2024 Edition, published by the International Code Council."], "source_url": "https://rules.wyo.gov/AjaxHandler.ashx?handler=GetRuleVersionHTML&RULE_VERSION_ID=24233", "document_date": "rule 041.0002.1.06262024 (Council on Fire Prevention and Electrical Safety, ch. 1), effective '06/26/2024 to Current'", "role": "no NEC text; the electrical chapter 2 could not be reached (blank search form; agency listing without links)", "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24", "canaries": "not used"},
{"ref": "TN-currency", "edition": "2017", "status": "verified", "values": {"effective": "2018-10-01", "open_risk": "chapter 0780-02-01 revision dated July 2025 (search index title only; file unreadable)"}, "quote_segments": ["This Page Last Updated: April 17, 2025 at 8:26 AM", "- The National Electrical Code (NEC), 2017 edition, published by the NFPA, except that:", "- Section 110.24, Available Fault Current shall be optional; and"], "source_url": "https://www.tn.gov/commerce/fire/codes-enforcement/history.html", "reads": 1, "canaries": [{"planted": "the page names the 2023 edition", "rejected": true}, {"planted": "'Last Updated' is in 2026", "rejected": true}], "other_sources": [{"url": "https://publications.tnsosfiles.com/rules/0780/0780-02/0780-02-01.20250714.pdf", "role": "unread (client_error); search title only", "quote_segments": ["July, 2025 (Revised) 1 RULES OF THE DEPARTMENT OF COMMERCE AND INSURANCE"]}, {"url": "https://www.law.cornell.edu/regulations/tennessee/Tenn-Comp-R-Regs-0780-02-01-.02", "role": "pointer only (non-government)", "quote_segments": ["shall be those prescribed in the National Electrical Code, 2017 edition, published by the", "Amendments filed December 19, 2017; effective 3/19/2018."]}], "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24", "note": "R4-6 read the same page twice on 2026-10-20; this is a third read on 2026-10-24."},
{"ref": "LA", "edition": "2020", "status": "verified (edition); effective CONFLICTING; 2023 NEC proposed", "values": {"effective": null, "next_change": {"edition": "2023", "proposed_effective": "2027-01-01", "status": "Notice of Intent, Louisiana Register Vol. 52, No. 8 (August 20, 2026), pp. 1403-1432; no final rule seen"}}, "quote_segments": ["for the purpose of amending and adopting the 2023 edition of the National Electrical Code (NEC) and the 2024", "editions of the I-codes in the state of Louisiana with an effective date of January 1,", "1403 Louisiana Register Vol. 52, No. 8 August 20, 2026", "NOTICE OF INTENT", "Uniform Construction Code Commission", "(LAC 17:I.Chapter 1)"], "source_url": "http://luccc.louisiana.gov/wp-content/uploads/Louisiana-Register_August-2026-publication.pdf", "reads": 2, "canaries": [{"planted": "proposes the 2026 edition", "rejected": true}, {"planted": "proposed effective date July 1, 2027", "rejected": true}, {"planted": "the rule has been finally adopted", "rejected": true}], "other_sources": [{"url": "https://luccc.louisiana.gov/2023-nec-2024-i-code-adoption-proposed-language-2/", "document_date": "Release Date: June 22, 2026", "quote_segments": ["A Notice of Intent to amend and adopt of the 2023 National Electrical Code (NEC)", "and for the 2024 International Codes (I-Codes) was published in the August 20, 2026, Louisiana Register,", "found on pages 1403-1432."]}, {"url": "https://legis.la.gov/legis/ViewDocument.aspx?d=1290009", "document_date": "Act No. 635, 2022 Regular Session (H.B. 803), enrolled", "role": "context: the statutory July 1, 2023 date covers the energy codes only (single pull)", "quote_segments": ["The codes listed in Subsection A of this Section as adopted by the council shall become effective July 1, 2023.", "(1) The International Energy Conservation Code.", "(2) The International Residential Code, Part IV Energy Efficiency.", "(8) National Electric Code."]}], "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24"},
{"ref": "MS", "edition": null, "status": "unverified", "values": {}, "quote_segments": [], "source_url": null, "permission_notice": null, "retrieved": "2026-10-24", "canaries": "not used", "note": "Two searches (16 and 24) returned only documents R4-6b had already read (ME-2007-3; MID annual report 2022-2023). No state statement on electrical codes found."},
{"ref": "NV", "edition": "local", "status": "verified", "values": {"effective": null, "scope": "counties and cities may adopt any building or electrical code (NRS 244.3675(2), 268.413(2)), subject to limits incl. NRS 477.030", "state_fire_marshal_nac_477_281": "adopts 2024 IFC, IBC, IEBC, IWUIC, UMC, UPC and NFPA standards; no NFPA 70", "state_buildings": "2023 NEC (NAC 341.045(d), LCB File R072-24)", "next_change": null}, "quote_segments": ["244.3675 Subject to the limitations set forth in NRS 244.368, 278.02315, 278.580, 278.582, 278.584,", "278.5846, 278.586, 444.340 to 444.430, inclusive, and 477.030, and section 1 of this act,", "the boards of county commissioners within their respective counties may:", "2. Adopt any building, electrical, housing, plumbing or safety code necessary to carry out the provisions"], "source_url": "https://archive.leg.state.nv.us/Session/82nd2023/Bills/AB/AB97_EN.pdf", "document_date": "A.B. 97, 82nd Session (2023), enrolled", "reads": 2, "canaries": [{"planted": "NRS 268.413 names the '2023 National Electrical Code'", "rejected": true}, {"planted": "the bill establishes a statewide electrical code", "rejected": true}], "other_sources": [{"url": "https://archive.leg.state.nv.us/Session/82nd2023/Bills/AB/AB97_EN.pdf", "section": "NRS 268.413", "quote_segments": ["268.413 Subject to the limitations contained in NRS 244.368, 278.02315, 278.580, 278.582, 278.584,", "the city council or other governing body of an incorporated city may:", "2. Adopt any building, electrical, plumbing or safety code necessary to carry out the provisions"]}, {"url": "https://www.leg.state.nv.us/Register/2024Register/R205-24A.pdf", "document_date": "LCB File R205-24, adopted regulation of the State Fire Marshal (no date in readable text)", "reads": 2, "role": "negative finding: NAC 477.281 lists no NFPA 70", "quote_segments": ["477.281 1. The State Fire Marshal hereby adopts by reference the following nationally recognized codes with", "(b) International Building Code, [2018] 2024 edition. A copy is available from the International Code", "(x) NFPA 58, [2017] 2024 edition, or the most current version adopted by reference by the Board", "(y) NFPA 72, [2016] 2022 edition;"], "canaries": [{"planted": "item (y) reads 'NFPA 70, [2017] 2023 edition;'", "rejected": true}]}, {"url": "https://www.dpbh.nv.gov/siteassets/regulatory/hcqc/healthfacilities/docs/construction-and-plan-review/compliance-resource-for-plan-review-11.4.2025.pdf", "document_date": "Nevada Health Authority plan-review resource (file name 11.4.2025)", "reads": 1, "role": "scoped (health facilities)", "quote_segments": ["Submit the architectural plans to the city or county in which the entity will be constructed for", "construction requirements, approvals and a building permit.", "Building Codes (Refer to local codes)"]}, {"url": "https://www.leg.state.nv.us/Register/RegsReviewed/$R072-24A.PDF", "role": "from R4-6b (state buildings)", "quote_segments": ["as minimum standards for the design of state buildings, other than those excepted in NRS 341.141:", "(d) The [2017] 2023 National Electrical Code published by the National Fire Protection Association."]}], "permission_notice": "none captured (public government record)", "retrieved": "2026-10-24", "caveat": "NRS 278.580 and NRS 477.030, which limit the local power, were not read."}
]}

```

### 3b. Rows for data/verified/nec-adoption.json (agent file r5_1_block_02.json)

```json
{"changed_rows":[
{"state": "AR", "edition": "2026", "status": "verified", "effective": "2026-09-03", "scope": "statewide (17 CAR § 210-601, Board of Electrical Examiners), with state amendments in § 210-601(b)(2)–(5): AFCI/GFCI limits and island/peninsula receptacle rules", "next_change": null, "source_publisher": "Code of Arkansas Rules (official online version), 17 CAR § 210-601, Rules of the Board of Electrical Examiners of the State of Arkansas", "source_url": "https://codeofarrules.arkansas.gov/Rules/Rule?levelType=section&titleID=17&chapterID=289&subChapterID=409&partID=1299&subPartID=8221&sectionID=54198", "quote": "(a) The Board of Electrical Examiners of the State of Arkansas hereby adopts and incorporates herein | the National Electrical Code, 2026 edition of the National Fire Protection Association. | Ark. R. 2026-108 (eff. September 3, 2026)", "note": "R5-1 (2026-10-24): three pulls of the official Code of Arkansas Rules page ('Last Updated: 10/19/2026 9:03:10 AM') agree; planted values ('eff. July 1, 2026', '2023 edition') were rejected. §§ 210-604 and 210-704 carry the same history line, so Ark. R. 2026-108 re-promulgated the whole Part. The ADLL file 17CARpt-210-Final.pdf (earlier source) numbers the adoption section 210-401; the official code numbers it 210-601. Earlier facts: the 2026-03-21 hearing notice proposed to 'update the state electrical code from the 2020 edition of the National Electrical Code' (hearing 2026-04-21); the Board's rules 'EFFECTIVE APRIL 24, 2024' adopted the NEC '2020 edition' (rule 010.13-008; https://labor.arkansas.gov/wp-content/uploads/Electrical-Rules-April-2024.pdf), so the 2020 edition applied until the 2026 rule took effect."},
{"state": "HI", "edition": "2020", "status": "conflicting", "effective": "2022-03-15", "scope": "Hawaii State Electrical Code as adopted by the State Building Code Council (2020 NEC with amendments). By statute (HRS 107-24(c)) a newer NEC edition may have become part of the state building code by default. County codes can differ.", "next_change": null, "source_publisher": "Hawaii Department of Accounting and General Services, State Building Code Council (Hawaii State Electrical Code, effective March 15, 2022); conflict from HRS 107-24(c) and 107-25 as printed in 2025 bills", "source_url": "https://ags.hawaii.gov/wp-content/uploads/2021/12/StateElectricalCode_03152022.pdf", "quote": "“NEC” means the National Electrical Code, NFPA 70, 2020 edition, | Effective Date: March 15, 2022", "note": "Do not render an edition. Verified: the SBCC adopted the 2020 NEC effective March 15, 2022 (adoption notice of March 31, 2022, posted by the County of Kauai: 'adopted the 2020 NFPA, NEC on March 15, 2022'). Conflict (R5-1, 2026-10-24): HRS 107-24(c), as printed in 2025 bills S.B. 48 and S.B. 120, says 'If the council does not adopt a code or standard identified in section 107-25 within the two-year time period,' 'that code or standard shall automatically become part of the Hawaii state building code until superseded'. HRS 107-25(a)(4) (H.B. 745 and H.D. 1, 2025) lists 'The National Electrical Code, as published by the National Fire Protection Association;'. The rule is not limited to particular codes. SBCC minutes of July 21, 2020 record the same reading ('the national codes become the State Building') and 'DAG Kam confirmed this interpretation.' DAGS annual reports: no codes adopted in 2023, 2024 or 2025 (Governor's housing proclamations); December 2025: 'the 2021 model Codes for IBC, IRC, and IECC were adopted by default in the State'. No state document says whether, or from what date, the 2023 NEC became the state code by default; the date would be two years after its official publication date, which no state source read gives. No 2026 SBCC action on the NEC was found; 2026 bills and bill-status pages could not be read. County level: Hawaii County Code ch. 5D (SUPP. 18, 7-2025) still adopts 'The National Electrical Code, 2017 Edition'. IAEI pointer 3/14/2023 is the State-building date."},
{"state": "LA", "edition": "2020", "status": "verified", "effective": null, "scope": "statewide (Louisiana State Uniform Construction Code, LAC 17:I.115); the 2021 IRC is adopted without Part VIII-Electrical, so the NEC also governs dwellings", "next_change": {"edition": "2023", "effective": null}, "source_publisher": "Louisiana Dept. of Public Safety and Corrections, Office of State Fire Marshal, Uniform Construction Code Council (Emergency Rule, Louisiana Register December 2023)", "source_url": "https://doa.louisiana.gov/media/1kbejceb/2312emr003.pdf", "quote": "A. National Electric Code (NEC), 2020 Edition, and the standards referenced in that code for regulation | of construction in this state.", "note": "Effective date conflicting: the emergency rule says the rules 'first adopted and published in the October 20, 2022 edition of the Louisiana Register' and 'The rule became effective on July 1, 2023.'; ICC-NTA (non-primary) says January 1, 2023. Pending: LSUCCC agenda of July 7, 2026 'Adoption of the 2023 NEC and 2024 I-Codes as the Uniform Construction Code (LAC 17:I. Chapter 1)'; the proposed text (Baton Rouge copy, updated 07/07/2026) reads 'effective January 1, 2027'; the Louisiana Register citation in that copy was blank ('LR 52:'). R5-1 (2026-10-24): the Notice of Intent was published in the Louisiana Register, Vol. 52, No. 8, August 20, 2026, pages 1403-1432 (LUCCC page, release date June 22, 2026; issue PDF on luccc.louisiana.gov). Two pulls of the Notice: it proposes 'the 2023 edition of the National Electrical Code (NEC)' 'with an effective date of January 1,' 2027, under 'Uniform Construction Code Commission' (Office of the Governor). It is a proposal: no final rule was seen, so next_change.effective stays null. The 2020-NEC start date is still unresolved: Act 635 of 2022 sets 'shall become effective July 1, 2023.' only for the codes in R.S. 40:1730.28.5(A) (IECC; IRC Part IV Energy Efficiency), not for the NEC."},
{"state": "TN", "edition": "2017", "status": "verified", "effective": "2018-10-01", "scope": "statewide minimum standard (Tenn. Comp. R. & Regs. 0780-02-01-.02); state exceptions: 110.24 available fault current optional; AFCI optional for bathrooms, laundry areas, garages, unfinished basements and refrigeration circuits", "next_change": null, "source_publisher": "Tennessee Dept. of Commerce & Insurance, State Fire Marshal's Office (Currently Adopted Codes page, updated April 17, 2025; rule 0780-02-01, September 2019 revision)", "source_url": "https://www.tn.gov/commerce/fire/codes-enforcement/history.html", "quote": "The National Electrical Code (NEC), 2017 edition, published by the NFPA, except that:", "note": "Rule text (SOS file copy hosted by UT MTAS): 'shall be those prescribed in the National Electrical Code, 2017 edition,' ... 'effective' 'October 1, 2018, except that:'; rule amendments effective March 19, 2018. R5-1 (2026-10-24): re-read of the SFMO page still shows 'This Page Last Updated: April 17, 2025 at 8:26 AM' and the 2017 edition (a planted '2023 edition' was rejected). Open risk: a search index lists a chapter file titled 'July, 2025 (Revised)' (https://publications.tnsosfiles.com/rules/0780/0780-02/0780-02-01.20250714.pdf); the host returned client_error, so what changed is unknown. Cornell LII copies (pointer only) of rules .02, .05, .21 and .23 show no 2025 amendment. Read that file before publishing TN."},
{"state": "WY", "edition": "2026", "status": "verified", "effective": null, "scope": "statewide (WSFM)", "next_change": null, "source_publisher": "Wyoming Department of Fire Prevention and Electrical Safety (State Fire Marshal)", "source_url": "https://wsfm.wyo.gov/electrical-safety", "quote": "The following codes apply: ... 2026 National Electrical Code.", "note": "Same list on six WSFM pages; no effective date anywhere. Rules and Electrical Board minutes are Google Drive files that do not render. IAEI pointer (2023, eff. 7/1/2023) is stale. Pointer only, not verified: the Cornell LII copy of WY rule agency 041 ch. 2 §2-2(v) defines the NEC as 'the current electrical code' and says 'enforcement may be delayed until July of that year'. Statute (2025 Wyoming Statutes): W.S. 35-9-120(a) requires 'the applicable minimum requirements of the National Electrical Code.' (no edition); W.S. 35-9-121(a) gives local bodies six months 'following the adoption of new standards by the department'. The WSFM plan-review page repeats the June 28, 2024 sentence. No start date for the 2026 NEC found. R5-1 (2026-10-24): rules.wyo.gov shows the Council's Chapter 1 (041.0002.1, effective '06/26/2024 to Current') adopting the 2024 I-codes with no NEC text; the electrical Chapter 2 could not be reached (blank search form; agency listing without links). Start date still not found."}
],
"add_rows":[
{"state": "NV", "edition": "local", "status": "verified", "effective": null, "scope": "No statewide electrical code for private construction was found. Counties (NRS 244.3675(2)) and cities (NRS 268.413(2)) may adopt any building, electrical, plumbing or safety code, subject to limits that include NRS 477.030 (State Fire Marshal). The State Fire Marshal's adopted codes (NAC 477.281) include the 2024 IBC and IFC but no NFPA 70 edition. State buildings: 2023 NEC as minimum design standards (NAC 341.045(d)).", "next_change": null, "source_publisher": "Nevada Legislature (Assembly Bill 97, 2023, enrolled, printing NRS 244.3675 and 268.413); Nevada State Fire Marshal (LCB File R205-24, NAC 477.281); State Public Works Board (LCB File R072-24)", "source_url": "https://archive.leg.state.nv.us/Session/82nd2023/Bills/AB/AB97_EN.pdf", "quote": "the boards of county commissioners within their respective counties may: | 2. Adopt any building, electrical, housing, plumbing or safety code necessary to carry out the provisions", "note": "NRS 268.413: 'the city council or other governing body of an incorporated city may:' '2. Adopt any building, electrical, plumbing or safety code necessary to carry out the provisions'. Both sections begin 'Subject to the limitations' (244.3675: 'set forth in'; 268.413: 'contained in') of a list that includes NRS 278.580 and ends 'and 477.030, and section 1 of this act,'; NRS 278.580 and 477.030 were not read. State Fire Marshal (R205-24, two pulls): NAC 477.281 adopts the 2024 IFC, IBC, IEBC, IWUIC, UMC and UPC and a list of NFPA standards from NFPA 10 to NFPA 3000 that skips from 'NFPA 58' to 'NFPA 72'; no NFPA 70 (the IBC's own reference to NFPA 70 was not read). State Public Works Board (R072-24, R4-6b): '(d) The [2017] 2023 National Electrical Code' 'as minimum standards for the design of state buildings'. Nevada Health Authority plan-review resource: plans go 'to the city or county' for 'a building permit'; table heading 'Building Codes (Refer to local codes)'. IAEI pointer (2017, eff. 7/1/2018; local jurisdictions) is not used."}
]}

```

### 3c. Top level (apply after R4-6 and R4-6b; agent file r5_1_block_03.json)

```json
{
 "top_level": {
  "dataset": "NEC edition in force by state (49 of 51 jurisdictions verified on state or DC government pages; NYC listed separately)",
  "not_verified": [
   "HI",
   "MS"
  ],
  "add_rules": [
   "Rows with status 'conflicting' stay in the file for their notes but are not rendered; list the state as 'not verified' with no edition (now HI).",
   "Always show the scope text for NV (local adoption; State Fire Marshal codes without NFPA 70; state buildings 2023 NEC)."
  ],
  "replace_rules": [
   {
    "old": "List MS and NV as 'not verified', not 'not yet checked': both were checked and no state statement was found.",
    "new": "List MS and HI as 'not verified', not 'not yet checked': MS has no state statement on electrical codes; HI's state-code NEC edition is in conflict (see the HI row note)."
   },
   {
    "old": "Always show the scope text for AL (State Building Code only) and HI (state code; county codes can differ).",
    "new": "Always show the scope text for AL (State Building Code only)."
   }
  ],
  "add_notes": [
   "Round 5 (R5-1, 2026-10-24): AR effective 2026-09-03 from the official Code of Arkansas Rules (17 CAR § 210-601, Ark. R. 2026-108); NV added as local adoption (NRS 244.3675(2) and 268.413(2) as printed in A.B. 97 of 2023; the State Fire Marshal's NAC 477.281 lists no NFPA 70; state buildings 2023 NEC); HI moved to not verified (HRS 107-24(c) default rule covers the NEC, the council adopted nothing in 2023-2025, and no state document states the NEC edition now in the state code); LA 2023 NEC is still a proposal (Notice of Intent, Louisiana Register Vol. 52 No. 8, August 20, 2026, pp. 1403-1432, proposed effective January 1, 2027); TN chapter 0780-02-01 has an unread July 2025 revision; WY start date and MS still open. Evidence: the R5-1 report returned as the agent's final message (the harness blocks report files) and research2/r5_tmp/r5_1_block_01.json to _03.json."
  ]
 }
}

```

## 4. Registry impact
- **Merge order:** R4-6, then R4-6b, then this report (5 changed rows, 1 added row, top-level changes).
- **HI:** the existing rule "Render only rows with status 'verified'" already keeps the "conflicting" row off the page.
- **Suggested wording for the nec-adoption coverage line in data-sources.csv:**
  > 49 of 51 — 2026: TX, MA, MN, OR, ND, CO, AR (from 2026-09-03) (+WY, no date); 2023: CA, GA, NJ, WI, WA (→2026 on 2026-12-31), MI non-res, IA, ID, KY, MT, NE, NH, OH, RI, SD, VT, ME, DE, NY, OK, UT; 2020: FL (→2023 on 2026-12-31), PA, NC, VA, AK, CT, WV, NM, LA (2023 proposed for 2027-01-01), SC (→2023 on 2027-01-01), AL (State Building Code scope); 2017: TN; 2014: DC; 2008: IN; local: MD, AZ, IL, KS, MO, NV. NOT verified: HI (conflicting), MS; MI one/two-family.
- **Page copy:** AR "since September 3, 2026"; HI "not verified", no edition; LA "2023 NEC proposed for January 1, 2027", shown as proposed only; NV "Local adoption" plus the scope text.

## 5. Blocked or failed log

| URL or call | Result |
|---|---|
| WebSearch | Budget reached: 24 of 24 |
| capitol.hawaii.gov HRS 107-24 and 107-25 pages, SB 48 bill-status page | client_error |
| data.capitol.hawaii.gov SB48, SB698, HB681 HD1 PDFs (sent in parallel) | Server error; SB48 and SB698 worked on later single retries; HB681 HD1 not retried |
| HB356 (2026) PDF | Server error |
| HB1725 HD2 (2026) PDF | Server error twice; a third try was refused by the tool as too soon |
| SB120 testimony PDF | Server error, then readable on retry |
| HB958 (2024), HB1712 (2026) | Readable; neither touches 107-24(c) |
| SBCC critical-dates chart | Readable, but the NEC row's dates are jumbled and unreadable |
| ALC Rules Subcommittee agenda, June 15, 2026 | Binary; no text |
| codeofarrules.arkansas.gov Part 210 and Subpart 7 pages | Readable; no section list |
| rules.wyo.gov Search.aspx?mode=7 and Agencies.aspx | Blank search form; no agency links |
| tnsosfiles 0780-02-01.20250714.pdf | client_error (coordinator retry on 2026-10-24: client_error again) |
| capitol.tn.gov October 2026 Commerce and Insurance document | robots_disallowed |
| springhilltn.org document 11005 | Binary; no text |
| luccc.louisiana.gov construction-code information PDF | Redirect loop (https to http); not routed around |
| luccc.louisiana.gov "blue book" of laws and rules | Readable; text ends before §115 |
| LA technical agenda, April 11, 2023 | Readable; no dates |
| Nevada SPWB manual (2006–2007) | Readable; context only |
| Cornell LII TN pages | Non-government; used as pointers only |

## 6. Open gaps
1. **HI:** a DAGS or council statement of the NEC edition now in the Hawaii state building code, and its date; the current HRS 107-24 text; whether any 2025 or 2026 Act changed 107-24(c) (S.B. 48, S.B. 120, H.B. 745, H.B. 1725); the 2023 NEC's "official publication date" as the council counts it; whether the housing proclamations suspended 107-24(c) itself.
2. **WY:** the 2026 NEC start date. Needs a direct link to the rules.wyo.gov electrical Chapter 2, or a statement from the Wyoming fire marshal.
3. **TN:** what the July 2025 revision of chapter 0780-02-01 changed.
4. **LA:** the final 2023-NEC rule (watch the November and December 2026 Louisiana Register). For the 2020 start date: the October 2022 final rule or the current §115 history note.
5. **MS:** a state statement or statute text on electrical codes.
6. **NV:** the text of NRS 278.580 and 477.030; the effective date of R205-24; whether the 2024 IBC adopted by the fire marshal brings in an NFPA 70 edition.

## 7. Search log (24 of 24)
1. HRS 107-24 107-25 State Building Code Council "National Electrical Code" adopted latest edition default (Hawaii government domains)
2. "107-24" OR "107-25" Hawaii state building codes council adoption "two years" model code hrscurrent HRS0107
3. Arkansas Register 2026 Board of Electrical Examiners "17 CAR" 210 National Electrical Code 2026 final rule effective date (Arkansas government domains)
4. "17 CAR § 210-401" Adoption of National Electrical Code Code of Arkansas Rules
5. "107-25" "Hawaii state building codes" "National Electrical Code" "International Building Code" "Uniform Plumbing Code" bill
6. Hawaii State Building Code Council 2026 meeting "National Electrical Code" 2023 OR 2026 adoption "by default" OR "automatically" proclamation
7. State Building Code Council Hawaii "electrical code" 2023 NEC "adopted by default" OR "automatically adopted" OR "default" annual report 2025
8. SBCC "Code Cycle" "Critical Dates" Hawaii State Building Code Council NEC 2023 publication date two year deadline
9. Wyoming rules "National Electrical Code" "current electrical code" "enforcement may be delayed until July" Department of Fire Prevention and Electrical Safety chapter 2 definitions
10. Wyoming State Fire Marshal electrical "2026 NEC" OR "2026 National Electrical Code" enforcement begins effective "July 1, 2026" OR "January 1, 2026" electrical inspectors
11. rules.wyo.gov Fire Prevention Electrical Safety "Chapter 2" Definitions "National Electrical Code (NEC)" "current electrical code" electrical rules 2023
12. Tennessee rule "0780-02-01" Electrical Installations rulemaking hearing 2025 OR 2026 "National Electrical Code" "2023 edition" State Fire Marshal
13. Tennessee State Fire Marshal's Office electrical inspection "National Electrical Code" edition adopted currently enforced 2017 OR 2020 OR 2023 statewide 2025 2026
14. "0780-02-01" Tennessee rulemaking 2025 electrical installations amendment filing "National Electrical Code" "2020 edition" OR "2023 edition" OR "fees" OR "permit" (no filter)
15. Louisiana Register 2026 Uniform Construction Code Council rule "National Electrical Code" 2023 Edition LAC 17:I final rule effective January 1, 2027
16. "Mississippi Building Codes Council" adopted codes "International Building Code" "International Residential Code" electrical "NFPA 70" OR "National Electrical Code" mid.ms.gov State Fire Marshal
17. NAC 477 State Fire Marshal adoption by reference "National Electrical Code" OR "NFPA 70" edition Nevada regulations
18. Nevada State Fire Marshal Division adopted codes "NFPA 70" OR "National Electrical Code" edition fire.nv.gov Fire Prevention Bureau adopted codes
19. "244.3675" board of county commissioners "electrical" code adopt ordinance Nevada bill text "building code"
20. "NAC 477" chapter State Fire Marshal "adopts by reference" codes "International Fire Code" "NFPA" Nevada Administrative Code 477 adoption of codes
21. Hawaii "2023 National Electrical Code" OR "2023 NEC" "state building code" default "107-24" OR "two years" OR "automatically" county electrical code 2025 OR 2026 (no filter)
22. Hawaii 2025 SB120 OR SB48 "relating to building codes" OR "relating to the state building code council" status Act signed governor 107-24
23. Louisiana Uniform Construction Code 2021 I-codes "2020 National Electrical Code" effective "July 1, 2023" OR "January 1, 2023" delayed implementation LSUCCC
24. "Mississippi Building Codes Council" adopted codes 2024 OR 2021 International Building Code list counties municipalities "Mississippi Building Codes" State Fire Marshal page

## 8. Validation
Scripts in research2/r5_1_scripts/ (build_blocks.py, check.py, check_notes.py), run with python3 -I.
- All 3 JSON blocks parse.
- All 86 quote segments (quote_segments plus each " | " part of quote) are under 120 characters. The longest quoted fragment inside a note or scope is 110.
- The 6 rows use exactly the 10 nec-adoption.json keys, in order. Every effective is null or YYYY-MM-DD, and next_change holds only edition and effective.
- Every changed row exists after the R4-6/R4-6b merge, and NV is new.
- After the merge: 49 verified (NY-NYC excluded) plus not_verified HI and MS makes 51.

## 9. Coordinator addendum (2026-10-24)
- An independent reviewer read HRS 107-24 and 107-25 on capitol.hawaii.gov the same day (single pull) and reached the same reading: a code listed in 107-25 that the council does not adopt within two years "shall automatically become part of the Hawaii state building code until superseded", and 107-25 lists the NEC. The reviewer also noted that the DAGS "Building Code Rules" page lists "State Electric Code – 2018 NFPA 70", an edition that does not exist. HI stays not verified.
- The coordinator retried the TN July 2025 rule file once; client_error again. TN keeps its row with a dated qualifier (see the rules array).
