# R4-6b: NEC adoption, remaining states and loose ends (state government sources)

Continues R4-6 (research2/R4-6-adoption.md). Status date: 2026-10-24.

Method:
- Retrieval date for every source fetched in this run: 2026-10-24. The preambles say 2026-10-20 because that was the date of the earlier rounds. These fetches happened on 2026-10-24, so that date is used. R4-6's sources keep 2026-10-20.
- WebSearch: 24 of 24 used (log in section 7). NFPA host: not used.
- In this session, URLs built by hand were refused (URL_NOT_ON_ALLOWLIST). This included URLs copied from earlier reports. A document could be read only when a search result or a fetched page linked to it.
- Every quote came through WebFetch's extraction model, asked for verbatim text in segments under 120 characters. Where it gave a paraphrase, the entry says "paraphrase".
- Primary sources are state government documents only. County pages and ICC-NTA are used only as corroboration or pointers. No value rests on them alone.
- Canaries: not used. These are single-line adoption facts, not table cells.
- Second pulls were made for:
  - the ADOH memo (matched);
  - the CDB page (matched);
  - RSMo 324.925 (matched);
  - Mississippi ME-2007-3 item B (matched);
  - the Register 242 entry (matched).
- No permission or copyright notice was captured. These are public records.

## 1. Status matrix

| Target | Finding | Edition value | Since | Status |
|---|---|---|---|---|
| AZ | No statewide electrical code. Counties may adopt "any building, electrical, plumbing or mechanical code" from a national organization or the county's largest city (A.R.S. 11-861(C)(1), 2016 session-law text). The 2013 Senate fact sheet: "home rule state". Department of Housing-regulated buildings: NEC 2017 from 2021-02-01 (current edition not confirmed). | local | — | VERIFIED (local). Caveat: the newest statute text read is from 2016. A county moved from the 2014 to the 2023 NEC on 2026-09-01 (corroboration). |
| IL | No statewide electrical code where a local building code exists. The NEC "Current edition or most recent preceeding edition" [sic] applies to commercial buildings in non-building-code jurisdictions and to State-funded buildings (20 ILCS 3105/10.09-1). No NEC requirement for residential. | local | — | VERIFIED (CDB page, 2 reads) |
| MO | "fire and building codes are adopted at the local level in Missouri" (Division of Fire Safety). Political subdivisions may implement "an electrical code based upon the National Electrical Code" (RSMo 324.925.3(2)). | local | — | VERIFIED |
| MS | Building-code adoption by counties and municipalities is described (MID budget request 2015, Miss. Code 17-2-5), but no electrical statement was found. The modular-home rule (revised July 1, 2026) prints "NFPA 70), 2024 edition". No such edition exists, so it is a source error. | — | — | UNVERIFIED |
| KS | No statewide electrical code for construction: cities and counties "adopt and enforce such electrical codes ... as [they] deem appropriate" (K.S.A. 12-1527(b)). But the Kansas Fire Prevention Code, which has uniform statewide force, adopts NFPA 70, 2008 edition (K.A.R. 22-1-3(n), per two SFM documents). State property: 2017 NEC (Form 110). | local | — | VERIFIED (local, with a statewide fire-code NEC edition, like MD) |
| NV | No statewide code for private construction was found. The SPWD 2023 NEC is confirmed as "minimum standards for the design of state buildings" (NAC 341.045(d), LCB File R072-24). | — | — | UNVERIFIED statewide; scoped evidence confirmed |
| AK (date) | 2020 NEC effective 2022-04-16 | 2020 | 2022-04-16 | VERIFIED (4-document chain; the filing record lists no section numbers) |
| AR (date) | Not found. The rules "EFFECTIVE APRIL 24, 2024" adopt the 2020 NEC. | 2026 adopted | — | UNVERIFIED date |
| WY (date) | Not found. The statute names no edition and no timing rule. | 2026 | — | UNVERIFIED date |
| TN (currency) | The tnsosfiles host failed 3 times | 2017 (R4-6) | 2018-10-01 | not checked after 2025-04-17 |
| HI (currency) | The SBCC adopted nothing in 2024 or 2025 (suspended). The DAGS copy of the code: 2020, effective 2022-03-15. | 2020 | 2022-03-15 | VERIFIED current through Dec 2025. Open risk: "adopted by default" rule (see HI) |
| LA (date) | No new evidence (search budget) | 2020 | — | CONFLICTING (unchanged) |
| UT (date) | 2023 NEC from 2025-07-01 | 2023 | 2025-07-01 | VERIFIED (enrolled bill and versioned statute) |

### Counts (50 states + DC = 51)
- Before this run: 45 of 51 (R4-6).
- New this run: AZ, IL, KS and MO, all with edition "local". **Verified: 49 of 51.**
- Still UNVERIFIED: MS and NV.
- By edition, among the 49:
  - 2026: 8 (TX, MA, MN, OR, ND, CO; WY and AR without a date).
  - 2023: 21.
  - 2020: 12.
  - 2017: 1 (TN).
  - 2014: 1 (DC).
  - 2008: 1 (IN).
  - Local adoption: 5 (MD, AZ, IL, KS, MO).
- Dates filled: AK 2022-04-16; UT 2025-07-01.

---

## 2. Evidence by target

### AZ: local adoption (VERIFIED, with a currency caveat)
1. Laws 2016, Ch. 128 (SB 1530), 52nd Legislature, 2nd Regular Session. It amends A.R.S. 11-861. https://www.azleg.gov/legtext/52leg/2R/laws/0128.htm
   - The page text runs to 132,676 characters; the first 100,000 were read, and § 11-861 falls within them.
   - (A): "In any county that has adopted zoning pursuant to this chapter, the board of supervisors may adopt and enforce,"
   - (A): "a building code and other related codes to regulate the quality, type of material and workmanship of all aspects"
   - (C)(1): "Any building, electrical, plumbing or mechanical code that has been adopted by any national organization or"
   - "association that is organized and conducted for the purpose of developing codes or that has been adopted"
   - "by the largest city in that county."
   - Caveat: the current A.R.S. 11-861 page (azleg.gov/ars) was refused as a built URL. The 2016 text is the newest version read.
2. Arizona State Senate fact sheet for S.B. 1321, "residential energy efficiency; building codes", 51st Legislature, 1st Regular Session, dated January 31, 2013. https://www.azleg.gov/legtext/51leg/1r/summary/s.1321ge.pdf
   - "In Arizona there is no mandatory statewide residential or commercial energy code; however, Laws 2001,"
   - "Arizona is classified as a home rule state, meaning that local codes are adopted and enforced locally."
   - The context is energy codes, but the second sentence is general.
3. Scoped: Arizona Department of Housing, "Adopted Codes Memorandum", "December 1, 2020", "Re: Adopted Code Change". https://housing.az.gov/sites/default/files/CodeChangeMemo-12-1-2020_0.pdf
   - Two reads; they matched.
   - Scope: "the Manufactured Housing and Building Division has updated the codes" for "buildings and accessories regulated by the Department" (the second phrase is a paraphrase).
   - Under "Title 4, Chapter 34, R4-34-102 Materials Incorporated by Reference": "National Electrical Code (NEC), 2017 Ed."
   - "The requirements set forth in this memorandum shall be effective February 1, 2021."
   - ADOH rule-change table (undated; upload path 2024-07). https://housing.az.gov/sites/default/files/2024-07/Rule-Changes-2019.pdf
     - Proposed R4-34-102: "the 2017 edition of the National Electric Code (NEC) and all editions thereafter as announced by the Department."
   - So the Department's current edition depends on later announcements, which were not found. Currency is unconfirmed.
4. Corroboration only (county government): Cochise County news, "Posted on July 15, 2026". https://www.cochise.az.gov/m/newsflash/Home/Detail/441
   - "It also replaces the 2014 National Electrical Code with the 2023 edition"
   - "The updated codes will take effect September 1, 2026."
   - A county that stayed on the 2014 NEC until September 2026 is consistent with there being no statewide NEC.
- Not checked: whether the State Fire Code (State Fire Marshal) references an NFPA 70 edition.
- The IAEI pointer ("Local adoption") agrees.

### IL: local adoption, with a statutory NEC rule where no local code exists (VERIFIED)
1. Illinois Capital Development Board, "Building Codes & Regulations". Footer "© 2026"; no page date. https://cdb.illinois.gov/business/codes/buildingcodesregulations
   - Two reads.
   - "The State of Illinois recently passed legislation ([Public Act 103-0510]"
   - "to require statewide building codes effective 1/1/2025."
   - "Until then, units of local government such as cities and counties can adopt codes of their choice."
   - Heading: "Commercial buildings in jurisdictions that have not adopted a building code AND state funded buildings."
     - "NEC© Current edition or most recent preceeding edition.1" [sic]
     - Footnote: "1Required by 20 ILCS 3105/10.09-1."
   - Heading: "Commercial buildings in jurisdictions that have adopted building codes."
     - No NEC line.
     - "Starting 1/1/25 local codes must regulate the  structural design in a manner that is at least as stringent"
     - "as the IBC© for new buildings or IEBC© for existing buildings.1" (footnote: 20 ILCS 3105/10.18)
   - None of the three residential headings has an NEC line.
   - "K-12 public schools fall under the jurisdiction of the Illinois State Board of Education."
   - Reading: the 2025 statewide minimum covers structural design (IBC/IEBC/IRC). Where a local code exists, the electrical code stays local. The NEC applies by statute only to commercial buildings in non-building-code jurisdictions and to State-funded buildings.
2. Statute history: P.A. 96-0704, ilga.gov FTP copy. https://ilga.gov/ftp/Public%20Acts/96/096-0704.htm
   - "Sec. 10.09-1. Adoption of building code; enforcement."
   - "(B) The 2008 or later edition of the National Electrical Code NFPA 70."
   - Non-building code jurisdiction: "any area of the State not subject to a building code" (segment)
   - "(h) This Section applies beginning July 1, 2011."
   - This is the source of IAEI's "commercial uses 2008 edition" pointer, which is now outdated.
3. SB2368, enrolled, 103rd General Assembly (LRB103 25789 SPS 52138 b). https://www.ilga.gov/legislation/103/SB/PDF/10300SB2368lv.pdf
   - It amends 10.09-1 and 10.18. The plain text runs struck and inserted words together.
   - "edition of the National Electrical Code NFPA 70": the edition words before it are not readable.
   - "\"Non-building code jurisdiction\" means any area of the"
   - "State in a municipality or county having jurisdiction that:"
   - "(i) has not adopted a building code; or (ii) is required to but"
   - "(h) The changes to this Section made by this amendatory Act of the 103rd General Assembly shall apply beginning on"
   - "January 1, 2025 This Section applies beginning July 1, 2011." (flattened)
   - The document shows no P.A. number. CDB links P.A. 103-0510. The bill-to-P.A. link is not confirmed by any document read.
4. CDB code directory (undated). https://cdb.illinois.gov/content/dam/soi/en/web/cdb/business/codes/documents/code-directory.pdf
   - City-by-city rows such as "Addison 2011 Electrical Code NFPA National Electrical Code Yes" and "Arlington Heights 2018 Electrical Code NFPA National Electrical Code Yes".
   - The "Year" column is not defined.
- Inference, not a CDB statement: on 2026-10-24, "current edition or most recent preceding edition" means the 2026 or the 2023 NEC.
- ilga.gov statute and Public Act pages are robots-blocked (log), so the current 10.09-1 text was not read.

### MO: local adoption (VERIFIED)
1. RSMo 324.925, revisor.mo.gov. Version "Effective - 28 Aug 2018". https://revisor.mo.gov/main/OneSection.aspx?section=324.925
   - Two reads.
   - "3. The provisions of this section shall not prohibit any political subdivision in this state from:"
   - "(2) Implementing an electrical code based upon the National Electrical Code;"
   - "(6) Enforcing codes of the political subdivision;"
   - History: "(L. 2017 S.B. 240, A.L. 2018 H.B. 1719 merged with S.B. 862)"
2. Missouri Department of Public Safety, Division of Fire Safety, FAQ (undated). https://dfs.dps.mo.gov/about/faqs.php
   - "Because fire and building codes are adopted at the local level in Missouri, there is no state requirement"
   - "Missouri does not have a statewide fire code, but Missouri does have state regulations affecting most"
   - "Always contact your local jurisdiction for any applicable adopted codes."
3. Pending legislation: SB 1431 (2026), Missouri Senate bill page. https://www.senate.mo.gov/BillTracking/Bills/BillInformation?year=2026&billid=19768
   - Its summary: "This act establishes the 'Missouri Building Codes Act'." (inner quotes shown as single quotes)
   - Status (paraphrase): second read and referred to the General Laws Committee. No later action is shown.
4. Missouri Office of Statewide Electrical Contractors FAQ, "As of August 28, 2017" (https://pr.mo.gov/electricalcontractors-FAQ-Political%20Subdivisions.asp), quotes 324.925.3 and agrees.
- Not checked: state-owned buildings (OA-FMDC) and modular units (PSC).

### MS: UNVERIFIED
1. Mississippi Insurance Department budget request (Form MBR-1), "June 30, 2015". https://www.lbo.ms.gov/misc/FY15_BudgetRequests/501-00.pdf
   - "House Bill 1465, 2008 Regular Legislative Session, amends Miss. Code Ann. Section 17-2-5 to establish that"
   - "any county or municipality adopting building codes after July 1, 2008, must adopt at a minimum the"
   - "Mississippi Building Codes."
   - "Miss. Code Ann., Section 17-2-1, requires Jackson, Harrison, Hancock, Stone and Pearl River Counties, and"
   - It has no electrical or NEC text, and it is 11 years old.
2. Scoped (modular homes): Regulation ME-2007-3, Title 19 Part 7 Ch. 3 (MID), "REVISED AND UPDATED" / "July 1, 2026". https://www.mid.ms.gov/wp-content/uploads/2023/04/ME20073reg.pdf
   - Two reads; they matched.
   - "B. The National Electrical Code (NFPA 70), 2024 edition,"
   - "published by the National Fire Protection Association (NFPA),"
   - NFPA 70 has no 2024 edition (the editions in this dataset are 2020, 2023 and 2026). This is a source error, so the value is UNVERIFIED.
   - It sits beside "C. The International Building Code, 2024 edition"; the year may have been carried across (inference).
   - "Non-coded area": "any local jurisdiction (county or municipality) that has not adopted the" (latest IBC). This confirms that counties and municipalities adopt building codes locally.
   - An older copy (https://www.mid.ms.gov/wp-content/uploads/2023/04/20149reg.pdf, undated) reads "The National Electrical Code (NFPA 70), 2005 edition," and is superseded.
   - Pointer only: ICC-NTA, "July 20, 2026": "The state of Mississippi has adopted the 2024 I-Codes for modular construction as of July 1, 2026."
3. Not useful:
   - BOB Manual 1, Section 400 "Codes and Policies" (June 2011): state-owned projects; "Local authorities have no jurisdiction over state-owned projects"; no NEC.
   - MID 2022-2023 annual report: the Council is named only.
- Gap: a state statement or statute text on local electrical codes (Miss. Code 17-2-5, 21-19-25 and 19-5-9). The bill pages are robots-blocked.

### KS: local adoption plus a statewide fire-code NFPA 70 edition (VERIFIED, local)
1. K.S.A. 12-1527, 2020 Kansas Statutes. https://www.kslegislature.gov/li_2020/s/statute/012_000_0000_chapter/012_015_0000_article/012_015_0027_section/012_015_0027_k.pdf
   - "12-1527. Alternative examinations authorized; validity of license limited; codes, standards and"
   - "Within their respective jurisdictions and subject to the provisions of K.S.A. 12-1526, and"
   - "amendments thereto, any city or county may:"
   - "(b) adopt and enforce such electrical codes, standards and regulations as the board of county"
   - "commissioners or governing body of the city deem appropriate; and"
   - "History: L. 1986, ch. 65, § 3; L. 1990, ch. 71, § 2; July 1."
   - K.S.A. 12-1526 was not read.
2. Kansas Office of the State Fire Marshal, "Construction Project & Plan Submittal Guide", "OSFM- Plan Review", "2011". https://firemarshal.ks.gov/DocumentCenter/View/441/Construction-Project-and-Plan-Submittal-Guide-PDF
   - K.A.R. 22-1-3(n): "national electric code. NFPA standard no. 70, including annexes A, B, C, D, E, F, G, and H," / "2008 edition;"
   - K.S.A. 31-150(a), school buildings: "All electric wiring shall conform to requirements of the 1999 issue of the national electric code of the" / "national fire protection association."
   - K.S.A. 31-134(b): "No municipality shall enact or enforce any ordinance, resolution or rule or regulation inconsistent therewith,"
   - "All construction projects, new or to existing buildings, regardless of size or extent, are required"
   - "to comply with state adopted codes whether or not submittal per K.S.A. 31-150(d) is required."
3. OSFM "Code Listing" page (undated). https://firemarshal.ks.gov/181/Code-Listing
   - "The following are some of the codes and editions that are currently being enforced."
   - "2008 Edition - NFPA 70 - National Electric Code"
4. Kansas Corporation Commission, "KS Building Energy Codes" (undated). https://www.kcc.ks.gov/kansas-energy-office/ks-building-energy-codes
   - "Because Kansas is a home rule state, the responsibility for adoption and enforcement of building energy codes"
   - "lies with local jurisdictions."
5. From R4-6:
   - DOA Form 110 (October 2021): State-property projects use the 2017 NEC, and the 2011 edition for CMS-funded healthcare.
   - K.S.A. 31-134(b): the fire code rules "shall have uniform force and effect throughout the state."
- Answer to the brief: Kansas has no electrical code for private construction as such, because electrical codes are local under K.S.A. 12-1527(b). But the Kansas Fire Prevention Code applies statewide and adopts NFPA 70, 2008 edition. That edition is seen in two SFM documents; the current K.A.R. text was not read. This mirrors MD, where the State Fire Prevention Code carries the 2017 NEC and R4-6 recorded "local".
- The IAEI pointer "Local + State (State Fire Marshal, 2/24/11)" broadly agrees. Its date is not confirmed; the 2011 guide gives "February 4, 2011" for its building-code list.

### NV: statewide UNVERIFIED; State Public Works scope confirmed
1. LCB File No. R072-24, "ADOPTED REGULATION OF THE STATE PUBLIC WORKS BOARD". https://www.leg.state.nv.us/Register/RegsReviewed/$R072-24A.PDF
   - "Section 1. NAC 341.045 is hereby amended to read as follows:"
   - "The Board hereby adopts by reference the following publications and establishes the standards contained therein"
   - "as minimum standards for the design of state buildings, other than those excepted in NRS 341.141:"
   - "(d) The [2017] 2023 National Electrical Code published by the National Fire Protection Association."
   - The document shows no adoption, filing or effective date. R4-6's SPWD list gives adoption "December 2024", with designs under the new codes required for submittals after June 30, 2025.
   - So the 2023 NEC is limited to state buildings. Confirmed.
2. NRS chapter 244 index (https://www.leg.state.nv.us/nrs/nrs-244.html): NRS 244.3675 is headed "Regulation of construction, maintenance and safety of buildings, structures and property;" / "adoption of codes and establishment of fees."
   - Heading only. The section body lies past the reachable text: the page is truncated at 113,150 characters, and offset 100000 ends at NRS 244.1545.
3. SPWD older list (undated): "2017 National Electrical Code (NEC)". This predates R072-24.
- No statewide code for private construction was found, and no state statement on local electrical adoption was read. NV stays UNVERIFIED.

### AK (date): 2020 NEC effective 2022-04-16 (VERIFIED)
1. DOLWD notice, dated "9/16/2021". https://labor.alaska.gov/commish/proposed_regulations/8_AAC_61_public_notice.pdf
   - "NOTICE OF PROPOSED CHANGES ON UPDATING METHODS OF APPLICATIONS, "
   - "8 AAC 70.025 is proposed to be amended for periodic adoption of the latest National Electrical Code, 2020 edition."
   - "The comments must be received not later than 5:00 p.m. on October 22, 2021."
2. The package's regulation text, header "Register _____, _________ 2022 LABOR AND WORKFORCE DEV.". https://labor.alaska.gov/commish/proposed_regulations/8_AAC_61_proposed_regulations.pdf
   - "8 AAC 70.025(a) is amended to read:"
   - "(a) The 2020 Edition of NFPA 70, National Electrical Code [2017 Edition of NFPA 70, National Electrical Code],"
   - "issued by the National Fire Protection Association on August 5, 2019"
   - "constitutes the minimum electrical code for the state and is adopted by reference."
   - History ends "am 5/9/2018, Register 226; am ___/___/____, Register ____)"
   - Other sections amended: 8 AAC 61.855 and 8 AAC 90.110 to 90.900.
3. Alaska Online Public Notice 205890, "Publish Date: 3/18/2022". https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=205890
   - "Alaska Administrative Code - Title 8 -"
   - "Department of Labor regulations re: Mechanical Inspection-Methods of Applications"
   - "Filed: 3/17/2022" / "Effective: 4/16/2022"
   - The only citation is "8 AAC"; no section numbers.
4. Alaska Online Public Notice 205886, "Alaska Administrative Code Register 242, July 2022", agency "Office of the Governor", "6/30/2022". https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=205886
   - Two reads.
   - "Title 8 - Department of Labor regulations re: Mechanical Inspection-Methods of Applications"
   - Department of Law file number 2021200352, linked to notice 205890 (paraphrase).
   - "Filed: 3/17/2022" / "Effective: 4/16/2022"
5. DOLWD Mechanical Inspection page (A7, R4-6; updated October 8, 2026): "8 AAC 70.025(a) 2020 National Electric Code NFPA 70".
- Reading: the notice and the filing name the same division and package ("updating methods of applications"), and the text carries a 2022 Register header. Register 242 records the filing on 3/17/2022, effective 4/16/2022.
- Residual: the filing record lists no section numbers. The Cornell pointer ("am 4/16/2022, Register 242") agrees.
- Superseded: notice 189547 (Register 226) records "Filed: April 9, 2018" and "Effective: May 9, 2018" (the 2017 NEC).
- IAEI's 4/16/2020 is wrong by two years.

### AR (date): still UNVERIFIED
1. "ADMINISTRATIVE RULES OF THE ARKANSAS BOARD OF" / "ELECTRICAL EXAMINERS", "EFFECTIVE APRIL 24, 2024". https://labor.arkansas.gov/wp-content/uploads/Electrical-Rules-April-2024.pdf
   - Rule 010.13-008 A: "The Board hereby adopts and incorporates herein the National Electrical Code," / "2020 edition of the National Fire Protection Association."
   - So the 2020 NEC applied from at least April 24, 2024, until the 2026 rule takes effect.
2. ADLL, "SUMMARY OF PROPOSED AMENDMENTS TO THE ADMINISTRATIVE RULES REGARDING THE BOARD OF ELECTRICAL EXAMINERS", "February 25, 2022". https://www.labor.arkansas.gov/wp-content/uploads/Electric-NEC-Code-Rule-Summ.pdf
   - This is the older 2017-to-2020 action. It has no date of effect.
3. Failed or empty: the ALC meeting attachment (server error, twice) and the SOS registry page /rules/search/7080 (lists 2020 to 2022 DLL rules only).
- Risk to the existing row: it shows 2026 as in force. That rests on the "Final" file label alone. The effective date is unknown, and the 2020 NEC was in force from at least April 24, 2024.

### WY (date): still UNVERIFIED
1. Wyoming Statutes, Title 35, ch. 9, art. 1 (statutes.wyoleg.gov, "2025 Wyoming Statutes" path; the latest session law cited is Laws 2015, ch. 158). https://statutes.wyoleg.gov/NXT/gateway.dll/2025%20Wyoming%20Statutes/2025%20Titles/1921/1996/1997
   - W.S. 35-9-120(a): "The installation of electric equipment in or on buildings, mobile homes and premises shall be made subject to"
   - "the applicable minimum requirements of the National Electrical Code."
   - W.S. 35-9-121(a): "within six (6) months following the adoption of new standards by the department,"
   - The statute names no edition and sets no effective-date rule.
2. WSFM Plan Review page (no page date). https://wsfm.wyo.gov/fire-prevention/plan-review
   - "All new plan review submissions from June 28, 2024 must be compliant with the adopted state codes and"
   - "and the 2026 edition of the National Electrical Code."
   - This is the same sentence A7 rejected as a date.
- The start date is still unknown. The rolling definition (Cornell pointer, R4-6) is not yet confirmed on a Wyoming host.

### HI (currency): 2020 NEC still the state code through December 2025 (VERIFIED)
1. DAGS-hosted "HAWAII STATE ELECTRICAL CODE". https://ags.hawaii.gov/wp-content/uploads/2021/12/StateElectricalCode_03152022.pdf
   - "“NEC” means the National Electrical Code, NFPA 70, 2020 edition,"
   - "Effective Date: March 15, 2022"
   - "adopted the 2020 NFPA, NEC on March 15, 2022."
   - This is a better primary source than the County of Kauai copy R4-6 used.
2. "ANNUAL REPORT ON THE STATE BUILDING CODE COUNCIL" / "DECEMBER 2024". https://ags.hawaii.gov/wp-content/uploads/2024/12/AnnualReportBuildingCode_2024.pdf
   - "The SBCC did not adopt any codes during the year in accord with to the"
   - "Governor's Proclamation on Affordable Housing." [sic]
3. "ANNUAL REPORT ON THE STATE BUILDING CODE COUNCIL DECEMBER 2025". https://ags.hawaii.gov/wp-content/uploads/2025/12/2025-Annual-Report.pdf
   - "In accordance with the Governor’s Emergency Proclamations, the SBCC did not meet, did not"
   - "promulgate code amendments and updates, and did not meet the statutory deadlines for providing"
   - "As a result, the 2021 model Codes for IBC, IRC, and IECC were adopted by default in the State"
   - "However, because the counties prefer amended codes, the 2018 suite of I-codes is currently in"
   - Footnote: "Sixteenth Proclamation Relating to Affordable Housing (Proclamation No. 2511043-ATG)."
   - Neither report mentions the NEC.
4. The DAGS reports index (https://ags.hawaii.gov/reports/legislative-reports/state-building-code-council/) lists no 2026 report.
- Open risk: the 2021 IBC, IRC and IECC took effect "by default". Whether the same default rule applies to the NEC was not checked, because HRS 107-24/107-25 were not read. If it does, the 2023 NEC could be the state code by default. Check this before publishing HI.

### UT (date): 2023 NEC from 2025-07-01 (VERIFIED)
1. Enrolled H.B. 313 (2025 General Session), "Construction Industry Amendments", "Enrolled Copy H.B. 313". https://le.utah.gov/Session/2025/bills/enrolled/HB0313.pdf
   - "(g) the [2020] 2023 edition of the National Electrical Code, issued by the National Fire"
   - "This bill provides a special effective date."
   - "This bill takes effect on July 1, 2025."
   - "15A-2-103, as last amended by Laws of Utah 2024, Chapter 505"
   - Also: "(C) Beginning on July 1, 2027, Section 230.71(B) is no longer in effect." This is a Utah NEC amendment; its section context was not read.
2. Utah Code 15A-2-103, version page. https://le.utah.gov/xcode/Title15A/Chapter2/C15A-2-S103_2025070120250507.html
   - "Effective 7/1/2025" / "Superseded 7/1/2026"
   - "the 2023 edition of the National Electrical Code, issued by the National Fire Protection Association;"
- The introduced bill's "May 7, 2025" was replaced by the special effective date. IAEI's 7/1/2025 agrees.

### LA (date) and TN (currency): no change
- LA: the 2020-NEC start date stays CONFLICTING. The search budget went to the explicit targets and to the TN and HI currency checks first.
- TN: publications.tnsosfiles.com returned client_error on three documents (the 0780 history file, a 2023 hearing notice, and the April 2025 0780-02-02 rule), so rulemaking after 2025-04-17 is still unchecked.

---

## 3. Machine-readable

### 3a. Evidence (one entry per target)

```json
{"evidence":[
{"ref":"AZ","edition":"local","status":"verified","values":{"effective":null,"scope":"no statewide electrical code; counties may adopt any national electrical code or the largest city's (A.R.S. 11-861(C)(1))","scoped":{"agency":"Arizona Department of Housing (A.A.C. R4-34-102)","edition":"2017","effective":"2021-02-01","current":"unconfirmed (proposed text adds later editions 'as announced by the Department')"},"next_change":null},"quote_segments":["Any building, electrical, plumbing or mechanical code that has been adopted by any national organization or","association that is organized and conducted for the purpose of developing codes or that has been adopted","by the largest city in that county."],"source_url":"https://www.azleg.gov/legtext/52leg/2R/laws/0128.htm","document_date":"2016 (Laws 2016, Ch. 128, SB 1530)","section":"A.R.S. 11-861(C)(1)","other_sources":[{"url":"https://www.azleg.gov/legtext/51leg/1r/summary/s.1321ge.pdf","document_date":"2013-01-31","quote_segments":["Arizona is classified as a home rule state, meaning that local codes are adopted and enforced locally."]},{"url":"https://housing.az.gov/sites/default/files/CodeChangeMemo-12-1-2020_0.pdf","document_date":"2020-12-01","reads":2,"quote_segments":["National Electrical Code (NEC), 2017 Ed.","The requirements set forth in this memorandum shall be effective February 1, 2021."]},{"url":"https://housing.az.gov/sites/default/files/2024-07/Rule-Changes-2019.pdf","document_date":"undated (upload path 2024-07)","role":"proposed rule text","quote_segments":["the 2017 edition of the National Electric Code (NEC) and all editions thereafter as announced by the Department."]},{"url":"https://www.cochise.az.gov/m/newsflash/Home/Detail/441","document_date":"2026-07-15","role":"corroboration only (county government)","quote_segments":["It also replaces the 2014 National Electrical Code with the 2023 edition","The updated codes will take effect September 1, 2026."]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used","caveat":"current A.R.S. 11-861 page not fetched (built URL refused); newest statute text read is the 2016 session law"},
{"ref":"IL","edition":"local","status":"verified","values":{"effective":null,"scope":"local adoption where a municipality or county has adopted building codes; NEC current or most recent preceding edition for commercial buildings in non-building-code jurisdictions and State-funded buildings (20 ILCS 3105/10.09-1); no NEC requirement listed for residential","next_change":null},"quote_segments":["Commercial buildings in jurisdictions that have not adopted a building code AND state funded buildings.","NEC© Current edition or most recent preceeding edition.1","1Required by 20 ILCS 3105/10.09-1.","Until then, units of local government such as cities and counties can adopt codes of their choice."],"source_url":"https://cdb.illinois.gov/business/codes/buildingcodesregulations","document_date":"undated (footer © 2026)","reads":2,"other_sources":[{"url":"https://ilga.gov/ftp/Public%20Acts/96/096-0704.htm","document_date":"P.A. 96-0704","quote_segments":["Sec. 10.09-1. Adoption of building code; enforcement.","(B) The 2008 or later edition of the National Electrical Code NFPA 70.","(h) This Section applies beginning July 1, 2011."]},{"url":"https://www.ilga.gov/legislation/103/SB/PDF/10300SB2368lv.pdf","document_date":"SB2368 enrolled, 103rd GA","role":"amendment; edition wording flattened","quote_segments":["edition of the National Electrical Code NFPA 70","State in a municipality or county having jurisdiction that:","(i) has not adopted a building code; or (ii) is required to but"]},{"url":"https://cdb.illinois.gov/content/dam/soi/en/web/cdb/business/codes/documents/code-directory.pdf","document_date":"undated","quote_segments":["Addison 2011 Electrical Code NFPA National Electrical Code Yes","Arlington Heights 2018 Electrical Code NFPA National Electrical Code Yes"]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"MO","edition":"local","status":"verified","values":{"effective":null,"scope":"no statewide building, fire or electrical code; political subdivisions may implement an NEC-based electrical code (RSMo 324.925.3(2))","next_change":null},"quote_segments":["Because fire and building codes are adopted at the local level in Missouri, there is no state requirement","Missouri does not have a statewide fire code, but Missouri does have state regulations affecting most","Always contact your local jurisdiction for any applicable adopted codes."],"source_url":"https://dfs.dps.mo.gov/about/faqs.php","document_date":"undated","other_sources":[{"url":"https://revisor.mo.gov/main/OneSection.aspx?section=324.925","document_date":"version effective 2018-08-28","reads":2,"quote_segments":["3. The provisions of this section shall not prohibit any political subdivision in this state from:","(2) Implementing an electrical code based upon the National Electrical Code;","(L. 2017 S.B. 240, A.L. 2018 H.B. 1719 merged with S.B. 862)"]},{"url":"https://www.senate.mo.gov/BillTracking/Bills/BillInformation?year=2026&billid=19768","document_date":"2026 session","role":"pending bill (referred to committee; paraphrase)","quote_segments":["New facilities constructed for the state shall comply with standards established under the act,"]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"KS","edition":"local","status":"verified","values":{"effective":null,"scope":"cities and counties adopt electrical codes (K.S.A. 12-1527(b)); Kansas Fire Prevention Code (statewide force) adopts NFPA 70 2008 (K.A.R. 22-1-3(n)); State property 2017 NEC (Form 110)","fire_code_nfpa70":"2008","state_property":"2017","next_change":null},"quote_segments":["(b) adopt and enforce such electrical codes, standards and regulations as the board of county","commissioners or governing body of the city deem appropriate; and","History: L. 1986, ch. 65, § 3; L. 1990, ch. 71, § 2; July 1."],"source_url":"https://www.kslegislature.gov/li_2020/s/statute/012_000_0000_chapter/012_015_0000_article/012_015_0027_section/012_015_0027_k.pdf","document_date":"2020 Kansas Statutes","section":"K.S.A. 12-1527(b)","other_sources":[{"url":"https://firemarshal.ks.gov/DocumentCenter/View/441/Construction-Project-and-Plan-Submittal-Guide-PDF","document_date":"2011","quote_segments":["national electric code. NFPA standard no. 70, including annexes A, B, C, D, E, F, G, and H,","2008 edition;","All electric wiring shall conform to requirements of the 1999 issue of the national electric code of the","No municipality shall enact or enforce any ordinance, resolution or rule or regulation inconsistent therewith,"]},{"url":"https://firemarshal.ks.gov/181/Code-Listing","document_date":"undated","quote_segments":["The following are some of the codes and editions that are currently being enforced.","2008 Edition - NFPA 70 - National Electric Code"]},{"url":"https://www.kcc.ks.gov/kansas-energy-office/ks-building-energy-codes","document_date":"undated","quote_segments":["Because Kansas is a home rule state, the responsibility for adoption and enforcement of building energy codes","lies with local jurisdictions."]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used","caveat":"current K.A.R. 22-1-3 and K.S.A. 12-1526 not read"},
{"ref":"MS","edition":null,"status":"unverified","values":{"scoped_modular":{"rule":"ME-2007-3 (revised July 1, 2026)","printed_edition":"2024","valid":false}},"quote_segments":["any county or municipality adopting building codes after July 1, 2008, must adopt at a minimum the","Mississippi Building Codes."],"source_url":"https://www.lbo.ms.gov/misc/FY15_BudgetRequests/501-00.pdf","document_date":"2015-06-30","other_sources":[{"url":"https://www.mid.ms.gov/wp-content/uploads/2023/04/ME20073reg.pdf","document_date":"revised and updated 2026-07-01","reads":2,"role":"scoped (modular homes); printed edition does not exist","quote_segments":["B. The National Electrical Code (NFPA 70), 2024 edition,","published by the National Fire Protection Association (NFPA),","any local jurisdiction (county or municipality) that has not adopted the"]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used","note":"No state statement on electrical codes found; bill pages robots-blocked."},
{"ref":"NV","edition":null,"status":"partial","values":{"scoped":{"agency":"State Public Works Board (NAC 341.045(d))","edition":"2023","scope":"minimum standards for the design of state buildings","replaces":"2017"},"statewide":"unverified"},"quote_segments":["Section 1. NAC 341.045 is hereby amended to read as follows:","as minimum standards for the design of state buildings, other than those excepted in NRS 341.141:","(d) The [2017] 2023 National Electrical Code published by the National Fire Protection Association."],"source_url":"https://www.leg.state.nv.us/Register/RegsReviewed/$R072-24A.PDF","document_date":"LCB File R072-24 (no date shown)","permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"AK-effective","edition":"2020","status":"verified","values":{"effective":"2022-04-16","register":"242 (July 2022)","filed":"2022-03-17"},"quote_segments":["8 AAC 70.025 is proposed to be amended for periodic adoption of the latest National Electrical Code, 2020 edition.","(a) The 2020 Edition of NFPA 70, National Electrical Code [2017 Edition of NFPA 70, National Electrical Code],","Title 8 - Department of Labor regulations re: Mechanical Inspection-Methods of Applications","Filed: 3/17/2022","Effective: 4/16/2022"],"source_url":"https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=205886","other_sources":[{"url":"https://labor.alaska.gov/commish/proposed_regulations/8_AAC_61_public_notice.pdf","document_date":"2021-09-16"},{"url":"https://labor.alaska.gov/commish/proposed_regulations/8_AAC_61_proposed_regulations.pdf","document_date":"Register 2022 header"},{"url":"https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=205890","document_date":"2022-03-18"}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used","caveat":"filing record lists no section numbers; link by package title, division and year"},
{"ref":"AR-effective","edition":"2026","status":"unverified","values":{"effective":null,"prior":{"edition":"2020","rules_effective":"2024-04-24"}},"quote_segments":["EFFECTIVE APRIL 24, 2024","The Board hereby adopts and incorporates herein the National Electrical Code,","2020 edition of the National Fire Protection Association."],"source_url":"https://labor.arkansas.gov/wp-content/uploads/Electrical-Rules-April-2024.pdf","permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"WY-effective","edition":"2026","status":"unverified","values":{"effective":null},"quote_segments":["The installation of electric equipment in or on buildings, mobile homes and premises shall be made subject to","the applicable minimum requirements of the National Electrical Code.","within six (6) months following the adoption of new standards by the department,"],"source_url":"https://statutes.wyoleg.gov/NXT/gateway.dll/2025%20Wyoming%20Statutes/2025%20Titles/1921/1996/1997","other_sources":[{"url":"https://wsfm.wyo.gov/fire-prevention/plan-review","quote_segments":["and the 2026 edition of the National Electrical Code."]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"HI-currency","edition":"2020","status":"verified","values":{"effective":"2022-03-15","no_state_action_through":"2025-12","open_risk":"default adoption rule (applied to 2021 IBC/IRC/IECC) not checked for the NEC"},"quote_segments":["“NEC” means the National Electrical Code, NFPA 70, 2020 edition,","Effective Date: March 15, 2022"],"source_url":"https://ags.hawaii.gov/wp-content/uploads/2021/12/StateElectricalCode_03152022.pdf","other_sources":[{"url":"https://ags.hawaii.gov/wp-content/uploads/2024/12/AnnualReportBuildingCode_2024.pdf","document_date":"December 2024","quote_segments":["The SBCC did not adopt any codes during the year in accord with to the","Governor's Proclamation on Affordable Housing."]},{"url":"https://ags.hawaii.gov/wp-content/uploads/2025/12/2025-Annual-Report.pdf","document_date":"December 2025","quote_segments":["In accordance with the Governor’s Emergency Proclamations, the SBCC did not meet, did not","promulgate code amendments and updates, and did not meet the statutory deadlines for providing","As a result, the 2021 model Codes for IBC, IRC, and IECC were adopted by default in the State"]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"},
{"ref":"UT-effective","edition":"2023","status":"verified","values":{"effective":"2025-07-01"},"quote_segments":["(g) the [2020] 2023 edition of the National Electrical Code, issued by the National Fire","This bill provides a special effective date.","This bill takes effect on July 1, 2025."],"source_url":"https://le.utah.gov/Session/2025/bills/enrolled/HB0313.pdf","other_sources":[{"url":"https://le.utah.gov/xcode/Title15A/Chapter2/C15A-2-S103_2025070120250507.html","quote_segments":["Effective 7/1/2025","Superseded 7/1/2026","the 2023 edition of the National Electrical Code, issued by the National Fire Protection Association;"]}],"permission_notice":"none captured (public government record)","retrieved":"2026-10-24","canaries":"not used"}
]}
```

### 3b. Rows for data/verified/nec-adoption.json (same key set as the existing rows)

"add_rows" are new states. "changed_rows" replace whole rows:
- AK, AR and WY rows in nec-adoption.json;
- HI and UT rows proposed in R4-6 section 3b, which are not yet merged.

```json
{"add_rows":[
{"state":"AZ","edition":"local","status":"verified","effective":null,"scope":"No statewide electrical code. Counties may adopt any nationally developed electrical code or the one adopted by the county's largest city (A.R.S. 11-861(C)(1)); cities adopt their own. Buildings regulated by the Arizona Department of Housing (manufactured and factory-built) follow the codes it adopts under A.A.C. R4-34-102.","next_change":null,"source_publisher":"Arizona Legislature (Laws 2016, Ch. 128 (SB 1530), amending A.R.S. 11-861; Senate fact sheet for S.B. 1321, January 31, 2013)","source_url":"https://www.azleg.gov/legtext/52leg/2R/laws/0128.htm","quote":"Any building, electrical, plumbing or mechanical code that has been adopted by any national organization or | association that is organized and conducted for the purpose of developing codes or that has been adopted | by the largest city in that county.","note":"Senate fact sheet (2013): 'Arizona is classified as a home rule state, meaning that local codes are adopted and enforced locally.' The current A.R.S. 11-861 page was not read; the newest statute text read is the 2016 session law. Department of Housing memo of December 1, 2020: 'National Electrical Code (NEC), 2017 Ed.' under R4-34-102, 'effective February 1, 2021', for buildings and accessories it regulates; a proposed R4-34-102 text adds 'and all editions thereafter as announced by the Department' (later announcements not checked). County corroboration: Cochise County replaced 'the 2014 National Electrical Code with the 2023 edition' effective September 1, 2026. IAEI 'Local adoption' agrees."},
{"state":"IL","edition":"local","status":"verified","effective":null,"scope":"No statewide electrical code where a municipality or county has adopted building codes; local governments adopt their own. Commercial buildings in jurisdictions with no building code, and State-funded buildings: the NEC, current edition or most recent preceding edition (20 ILCS 3105/10.09-1). No NEC requirement is listed for residential buildings.","next_change":null,"source_publisher":"Illinois Capital Development Board ('Building Codes & Regulations' page)","source_url":"https://cdb.illinois.gov/business/codes/buildingcodesregulations","quote":"Commercial buildings in jurisdictions that have not adopted a building code AND state funded buildings. | NEC© Current edition or most recent preceeding edition.1 | 1Required by 20 ILCS 3105/10.09-1.","note":"CDB: 'Until then, units of local government such as cities and counties can adopt codes of their choice.' The statewide minimums from 1/1/2025 (P.A. 103-0510) cover structural design ('Starting 1/1/25 local codes must regulate the  structural design in a manner that is at least as stringent' as the IBC/IEBC/IRC); no NEC line appears under jurisdictions with codes or under any residential heading. History: P.A. 96-0704 added 10.09-1 with '(B) The 2008 or later edition of the National Electrical Code NFPA 70.' and '(h) This Section applies beginning July 1, 2011.' (the source of IAEI's '2008' pointer). SB2368 (enrolled, 103rd GA) amended 10.09-1 from January 1, 2025; its plain-text copy runs struck and inserted words together, so the edition wording is taken from CDB. CDB's code directory lists city NEC adoptions in different years. 'preceeding' [sic]."},
{"state":"KS","edition":"local","status":"verified","effective":null,"scope":"No statewide electrical code for construction: cities and counties adopt and enforce their own electrical codes (K.S.A. 12-1527(b)). The Kansas Fire Prevention Code, which has uniform force statewide (K.S.A. 31-134(b)), adopts NFPA 70, 2008 edition (K.A.R. 22-1-3(n)). Construction projects on State property use the 2017 NEC (Dept. of Administration Form 110, October 2021).","next_change":null,"source_publisher":"Kansas Legislature (K.S.A. 12-1527, 2020 Kansas Statutes); Kansas Office of the State Fire Marshal (Construction Project & Plan Submittal Guide, 2011; Code Listing page)","source_url":"https://www.kslegislature.gov/li_2020/s/statute/012_000_0000_chapter/012_015_0000_article/012_015_0027_section/012_015_0027_k.pdf","quote":"(b) adopt and enforce such electrical codes, standards and regulations as the board of county | commissioners or governing body of the city deem appropriate; and","note":"K.S.A. 12-1527 applies 'subject to the provisions of K.S.A. 12-1526' (not read); history 'L. 1986, ch. 65, § 3; L. 1990, ch. 71, § 2; July 1.' Fire code: the SFM guide (2011) quotes K.A.R. 22-1-3(n) 'national electric code. NFPA standard no. 70, including annexes A, B, C, D, E, F, G, and H,' '2008 edition;'; the SFM Code Listing page (undated) lists '2008 Edition - NFPA 70 - National Electric Code' among codes 'currently being enforced'. The current K.A.R. 22-1-3 text was not read. School buildings: the guide quotes K.S.A. 31-150(a), 'the 1999 issue of the national electric code' (current statute not read). KCC: 'Because Kansas is a home rule state, the responsibility for adoption and enforcement of building energy codes' 'lies with local jurisdictions.' Recorded like MD (local adoption plus a State Fire Prevention Code NEC edition). Form 110: 2017 NEC; 2011 edition for CMS-funded healthcare."},
{"state":"MO","edition":"local","status":"verified","effective":null,"scope":"No statewide building, fire or electrical code; codes are adopted locally. Political subdivisions may implement an electrical code based on the NEC (RSMo 324.925.3(2)).","next_change":null,"source_publisher":"Missouri Department of Public Safety, Division of Fire Safety (FAQ); Revised Statutes of Missouri 324.925 (version effective August 28, 2018)","source_url":"https://dfs.dps.mo.gov/about/faqs.php","quote":"Because fire and building codes are adopted at the local level in Missouri, there is no state requirement | Missouri does not have a statewide fire code, but Missouri does have state regulations affecting most | Always contact your local jurisdiction for any applicable adopted codes.","note":"RSMo 324.925.3 (https://revisor.mo.gov/main/OneSection.aspx?section=324.925): 'The provisions of this section shall not prohibit any political subdivision in this state from:' ... '(2) Implementing an electrical code based upon the National Electrical Code;'; history '(L. 2017 S.B. 240, A.L. 2018 H.B. 1719 merged with S.B. 862)'. 2026 SB 1431 (Missouri Building Codes Act): the Senate bill page shows it referred to the General Laws Committee with no later action. State-owned buildings and modular units were not checked."}
],
"changed_rows":[
{"state":"AK","edition":"2020","status":"verified","effective":"2022-04-16","scope":"statewide","next_change":null,"source_publisher":"Alaska Dept. of Labor & Workforce Development, Labor Standards & Safety, Mechanical Inspection; Office of the Governor, Alaska Administrative Register 242 (July 2022)","source_url":"https://labor.alaska.gov/lss/mihome.htm","quote":"8 AAC 70.025(a) 2020 National Electric Code NFPA 70","note":"Adopted-codes list on a page last updated October 8, 2026. Effective date from a document chain: DOLWD notice of 9/16/2021, '8 AAC 70.025 is proposed to be amended for periodic adoption of the latest National Electrical Code, 2020 edition.'; the package text (2022 Register header) amends 8 AAC 70.025(a) to 'The 2020 Edition of NFPA 70, National Electrical Code'; Online Public Notice 205890 and Register 242 (July 2022, https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=205886) list 'Mechanical Inspection-Methods of Applications', 'Filed: 3/17/2022', 'Effective: 4/16/2022'. The filing record names no section numbers; the link rests on the matching package title, division and year. IAEI's 4/16/2020 is wrong by two years. The 2017 edition (effective 5/9/2018, Register 226) is superseded."},
{"state":"AR","edition":"2026","status":"verified","effective":null,"scope":"statewide","next_change":null,"source_publisher":"Arkansas Dept. of Labor and Licensing, Board of Electrical Examiners (17 CAR Part 210, posted as final)","source_url":"https://labor.arkansas.gov/wp-content/uploads/17CARpt-210-Final.pdf","quote":"adopts and incorporates herein the National Electrical Code, 2026 edition","note":"Effective date not found in the rule or on the ADLL pages checked. The 2026-03-21 hearing notice proposed to 'update the state electrical code from the 2020 edition of the National Electrical Code' (hearing 2026-04-21). Until the effective date is confirmed, 2020 may still apply. R4-6b (2026-10-24): the Board's rules 'EFFECTIVE APRIL 24, 2024' adopt the NEC '2020 edition' (rule 010.13-008; https://labor.arkansas.gov/wp-content/uploads/Electrical-Rules-April-2024.pdf), so 2020 applied from at least that date until the 2026 rule takes effect. The 2026 effective date is still not found."},
{"state":"WY","edition":"2026","status":"verified","effective":null,"scope":"statewide (WSFM)","next_change":null,"source_publisher":"Wyoming Department of Fire Prevention and Electrical Safety (State Fire Marshal)","source_url":"https://wsfm.wyo.gov/electrical-safety","quote":"The following codes apply: ... 2026 National Electrical Code.","note":"Same list on six WSFM pages; no effective date anywhere. Rules and Electrical Board minutes are Google Drive files that do not render. IAEI pointer (2023, eff. 7/1/2023) is stale. Pointer only, not verified: the Cornell LII copy of WY rule agency 041 ch. 2 §2-2(v) defines the NEC as 'the current electrical code' and says 'enforcement may be delayed until July of that year'. Statute (2025 Wyoming Statutes): W.S. 35-9-120(a) requires 'the applicable minimum requirements of the National Electrical Code.' (no edition); W.S. 35-9-121(a) gives local bodies six months 'following the adoption of new standards by the department'. The WSFM plan-review page repeats the June 28, 2024 sentence. No start date for the 2026 NEC found."},
{"state":"HI","edition":"2020","status":"verified","effective":"2022-03-15","scope":"Hawaii State Electrical Code (State Building Code Council). State building design must comply by 2023-03-14; counties were to adopt with amendments by 2024-03-14 or the code applies as an interim county code (HRS 107-28). County codes can differ.","next_change":null,"source_publisher":"Hawaii Department of Accounting and General Services, State Building Code Council (Hawaii State Electrical Code, effective March 15, 2022)","source_url":"https://ags.hawaii.gov/wp-content/uploads/2021/12/StateElectricalCode_03152022.pdf","quote":"“NEC” means the National Electrical Code, NFPA 70, 2020 edition, | Effective Date: March 15, 2022","note":"Adoption notice of March 31, 2022 (posted by the County of Kauai): 'adopted the 2020 NFPA, NEC on March 15, 2022'. DAGS annual reports: November 2023 and December 2024, the SBCC 'did not adopt any codes during the year'; December 2025, 'the SBCC did not meet, did not' 'promulgate code amendments and updates' (Governor's affordable-housing proclamations). The 2024 and 2025 reports say the 2021 IBC, IRC and IECC 'were adopted by default'; neither mentions the NEC, and whether a default rule could apply to the NEC was not checked (HRS 107 not read). Conflict at county level: Hawaii County Code ch. 5D (SUPP. 18, 7-2025) still adopts 'The National Electrical Code, 2017 Edition'. IAEI pointer 3/14/2023 is the State-building date."},
{"state":"UT","edition":"2023","status":"verified","effective":"2025-07-01","scope":"statewide (Utah Code 15A-2-103(1)(g)); the 2021 IRC is also adopted (15A-2-103(1)(b))","next_change":null,"source_publisher":"Utah Legislature (2025 H.B. 313 enrolled, 'Construction Industry Amendments'; Utah Code 15A-2-103, versions effective 7/1/2025, 7/1/2026 and 1/1/2027)","source_url":"https://le.utah.gov/xcode/Title15A/Chapter2/C15A-2-S103_2025070120250507.html","quote":"Effective 7/1/2025 | the 2023 edition of the National Electrical Code, issued by the National Fire Protection Association;","note":"Enrolled H.B. 313 (https://le.utah.gov/Session/2025/bills/enrolled/HB0313.pdf): '(g) the [2020] 2023 edition of the National Electrical Code, issued by the National Fire' and 'This bill takes effect on July 1, 2025.' The introduced text's 'May 7, 2025' did not survive. Later versions (effective 7/1/2026; 1/1/2027, Chapter 386, 2026 General Session) keep the 2023 NEC. The 2026 interim draft (heard 11/19/2025) also shows 2023 as current law."}
]}
```

### 3c. Top-level changes (apply after R4-6's section 3c)

```json
{"top_level":{
"dataset":"NEC edition in force by state (49 of 51 jurisdictions verified on state or DC government pages; NYC listed separately)",
"not_verified":["MS","NV"],
"add_rules":["Always show the scope text for KS (statewide fire-code NFPA 70, 2008 edition, beside local adoption) and IL (NEC current or preceding edition where no local code exists).","List MS and NV as 'not verified', not 'not yet checked': both were checked and no state statement was found."],
"add_notes":["Round 4b (R4-6b, 2026-10-24) added AZ, IL, KS and MO as local-adoption rows from state government pages, set AK effective 2022-04-16 and UT effective 2025-07-01, and confirmed HI current through December 2025; evidence research2/R4-6b-adoption.md. Scoped evidence only (not rendered): the NV State Public Works Board adopted the 2023 NEC as minimum standards for the design of state buildings (NAC 341.045(d), LCB File R072-24); Mississippi's modular-home rule ME-2007-3 (revised July 1, 2026) prints 'NFPA 70, 2024 edition', which is not an NFPA 70 edition."]
}}
```

---

## 4. Registry impact

- **data/verified/nec-adoption.json** (domain `nec-adoption` in research/data-sources.csv):
  - Apply R4-6 first (its 9 add_rows and its 3c updates).
  - Then add the 4 rows in 3b (AZ, IL, KS, MO).
  - Replace the AK, AR and WY rows.
  - Use the 3b versions of R4-6's HI and UT rows.
  - Set `not_verified` to MS and NV.
  - Change the label to 49 of 51.
  - All new rows use `"edition":"local"`. They need the renderer label R4-6 proposed ("Local adoption" plus the scope text).
- **data-sources.csv, `nec-adoption` coverage line.** Suggested replacement text (proposed wording, not a source quote):
  > Verified on state/DC government pages: 49 of 51 — 2026: TX, MA, MN, OR, ND, CO (+WY, AR adopted, no effective date); 2023: CA, GA, NJ, WI, WA (→2026 on 2026-12-31), MI non-res, IA, ID, KY, MT, NE, NH, OH, RI, SD, VT, ME, DE, NY, OK, UT; 2020: FL (→2023 on 2026-12-31), PA, NC, VA, AK, CT, WV, NM, LA, SC (→2023 on 2027-01-01), HI, AL (State Building Code scope only); 2017: TN; 2014: DC; 2008: IN; local adoption: MD, AZ, IL, KS, MO. NOT verified: MS, NV; MI one/two-family.
  - The domain can stay "verified" with that scope.
- **Contradictions and risks:**
  - AK: the current row's note cites "IAEI pointer 4/16/2020". The state record says 4/16/2022. Replace the note.
  - AR: the row presents 2026 as in force, but the effective date is unknown. The Board's April 24, 2024 rules show 2020. Consider rendering AR as "2026 adopted, effective date not confirmed (2020 in force from April 24, 2024)" until the date is found.
  - HI: if the "adopted by default" mechanism that moved the 2021 IBC/IRC/IECC also covers the NEC, the HI row (2020) could be stale. Check HRS 107-24/107-25 before publishing HI.
  - IAEI pointers contradicted:
    - IL "commercial uses 2008 edition": the 2011 statute text; CDB now says "current edition or most recent preceding edition".
    - AK "4/16/2020".
  - Mississippi's own modular rule prints a non-existent "NFPA 70, 2024 edition". Do not publish any MS modular edition.
  - KS: the page copy must not say "no state electrical requirement". The statewide fire code carries NFPA 70, 2008 edition (state property: 2017).
- **Page copy:** the UT row can show "since July 1, 2025". The AK row can show "since April 16, 2022".

## 5. Blocked or failed log

| URL or call | Result |
|---|---|
| WebSearch | Budget reached: 24 of 24 |
| https://www.azleg.gov/legtext/51leg/1r/summary/s.1321ge.pdf | RATE_LIMIT_EXCEEDED on the first try (parallel fetch); the second try worked |
| https://www.azleg.gov/ars/11/00861.htm | URL_NOT_ON_ALLOWLIST (built URL) |
| https://www.housing.az.gov/general-public/manufactured-housing/ | robots_disallowed |
| https://my.ilga.gov/legislation/ilcs/fulltext?DocName=002031050K10.09-1 | robots_disallowed |
| https://ilga.gov/Documents/Legislation/PublicActs/96/PDF/096-0704.pdf | robots_disallowed |
| https://ilga.gov/Legislation/publicacts/view/096-0704 | robots_disallowed (the /ftp/ copy worked) |
| https://www.sos.ms.gov/ACCode/00000124c.pdf | client_error |
| https://billstatus.ls.state.ms.us/documents/2022/html/HB/1100-1199/HB1163SG.htm | robots_disallowed (the whole bill-status host) |
| https://sos.ms.gov/ACProposed/00019895b.pdf | Readable. BOB Manual Section 400 (June 2011), state-owned projects; no NEC |
| https://www.mid.ms.gov/wp-content/uploads/2023/04/annual-report-2022.pdf | Readable. The Council is named only |
| https://www.sos.ks.gov/publications/pubs_kar_Regs.aspx?KAR=22-1-3 | URL_NOT_ON_ALLOWLIST (taken from A7's report) |
| https://firemarshal.ks.gov/about-the-office/press-releases/2015/01/22/codes-and-standards-update | client_error |
| https://www.leg.state.nv.us/nrs/nrs-244.html (and offset 100000) | Text truncated at 113,150 characters; the body of NRS 244.3675 is unreachable |
| https://aws.state.ak.us/OnlinePublicNotices/Notices/Attachment.aspx?id=133164 | Binary; no text |
| https://aws.state.ak.us/OnlinePublicNotices/Notices/View.aspx?id=189547 | Readable. The 2018 action (2017 NEC), not 2020 |
| https://www.arkleg.state.ar.us/Home/FTPDocument?path=...25023...D.6.a+DLL+BEESA... | SERVER_ERROR, twice |
| https://sos-rules-reg.ark.org/rules/search/7080 | Readable. Lists 2020 to 2022 DLL rules; no electrical rule |
| https://www.labor.arkansas.gov/wp-content/uploads/Electric-NEC-Code-Rule-Summ.pdf | Readable. The 2022 (2017 to 2020) summary; no date of effect |
| https://wyoleg.gov/NXT/gateway.dll/... | 302 to statutes.wyoleg.gov (followed; readable) |
| https://wsfm.wyo.gov/fire-prevention/plan-review | Readable. Only the June 28, 2024 sentence |
| https://publications.tnsosfiles.com/rules/0780/0780-history.pdf | client_error |
| https://publications.tnsosfiles.com/rules_filings/10-32-23.pdf | client_error |
| https://publications.tnsosfiles.com/rules/0780/0780-02/0780-02-02.20250417.pdf | client_error; host abandoned after 3 failures |
| https://ags.hawaii.gov/wp-content/uploads/2023/03/SBCC-Code-Cycle-Critical-Dates_2023-03-10_.pdf | Readable. Jumbled schedule; no default rule stated |
| https://publicworks.nv.gov/.../Permitting_Code_Enforcement/Adopted_Codes.pdf | Readable. The older list (2017 NEC); no date or scope |
| https://www.icc-nta.org/code-update/mississippi-adopts-new-i-codes/ | Non-primary; used as a pointer only |

## 6. Open gaps

1. **MS:**
   - A state statement or statute text on local electrical codes (Miss. Code 17-2-5, 21-19-25, 19-5-9).
   - The Building Codes Council's adopted-code list, and whether it includes the NEC.
   - Which edition the modular rule means by "NFPA 70, 2024 edition". MID would have to say.
2. **NV:**
   - The text of NRS 244.3675 and the NRS 268 city powers.
   - The NFPA 70 edition in the State Fire Marshal's NAC 477.
   - The effective date of R072-24.
3. **AR:** the effective date of 17 CAR Part 210 (2026 NEC). Try the Arkansas Register issues for June to October 2026 on sos.arkansas.gov, or ALC Rules Subcommittee minutes.
4. **WY:** a Wyoming copy of rule 041 ch. 2 §2-2(v) (the rolling "current electrical code") and the WSFM start date for the 2026 NEC.
5. **HI:** HRS 107-24 and 107-25. Does the default adoption that applied to the 2021 IBC/IRC/IECC also apply to the NEC?
6. **TN:** 0780-02-01 rulemaking after April 17, 2025. The tnsosfiles host failed; try again later or use the SOS rule-filings index.
7. **LA:** the 2020-NEC start date (January vs July 2023), and the final 2023-NEC rule (Louisiana Register, "LR 52").
8. **KS:**
   - The current K.A.R. 22-1-3 text (NFPA 70 edition) and K.S.A. 12-1526.
   - The current K.S.A. 31-150 (schools, 1999 NEC as quoted in 2011).
   - Whether DOA Form 110 (October 2021) is still current.
9. **AZ:**
   - The current A.R.S. 11-861 page.
   - ADOH's current R4-34-102 NEC edition (NEC 2017 from 2021-02-01, plus later announcements).
   - Any NFPA 70 reference in the State Fire Code (R4-36).
10. **IL:** the current 20 ILCS 3105/10.09-1 text (ilga.gov is robots-blocked) and the P.A. number of SB2368.
11. **MO:** NEC editions for state-owned buildings (OA-FMDC) and modular units (PSC), if the page wants scoped notes.

## 7. Search log (24 of 24)

1. Arizona statewide building code electrical adopted by local jurisdictions National Electrical Code state (az.gov, azleg.gov)
2. Arizona Department of Housing Office of Manufactured Housing adopted codes factory-built buildings "National Electrical Code" edition (az.gov, azleg.gov, azsos.gov)
3. Illinois statute commercial building construction municipality without building code must comply "National Electrical Code" ilga.gov (ilga.gov, illinois.gov)
4. Capital Development Board Illinois building codes page statewide code local jurisdictions "National Electrical Code" State facilities adopted codes (cdb.illinois.gov, illinois.gov)
5. Illinois "commercial" construction "has not adopted a building code" OR "without a building code" ... Public Act 96-704 (no filter)
6. Missouri statute political subdivision adopt electrical code "National Electrical Code" no statewide building code revisor.mo.gov (mo.gov)
7. "Missouri does not have a statewide building code" OR "no statewide building code" Missouri local jurisdictions adopt codes (mo.gov)
8. Mississippi Building Codes Council adopted codes "National Electrical Code" counties municipalities adopt Section 45-11 State Fire Marshal (ms.gov)
9. "Mississippi Building Codes Council" codes adopted electrical code local jurisdictions may adopt not mandatory state buildings mid.ms.gov (ms.gov)
10. Mississippi Code Section 21-19-25 municipalities adopt "electrical codes" OR "electrical code" building codes governing authorities bill text (ms.gov, state.ms.us)
11. Mississippi Insurance Department "Building Codes Council" adopted codes list International Building Code National Electrical Code edition local governments (mid.ms.gov, sos.ms.gov, lbo.ms.gov, dfa.ms.gov)
12. "Mississippi Building Codes" 17-2-5 adopted codes council "National Electrical Code" OR "NFPA 70" edition county municipality minimum (no filter)
13. K.A.R. 22-1-3 Kansas fire prevention code adopted by reference "NFPA 70" OR "National Electrical Code" State Fire Marshal regulation (ks.gov, kslegislature.gov, kslegislature.org)
14. Kansas "no statewide building code" OR "does not have a statewide building code" local jurisdictions adopt building electrical codes (ks.gov, kslegislature.gov, kslegislature.org, kcc.ks.gov)
15. Nevada State Fire Marshal adopted codes "National Electrical Code" NAC 477 edition local jurisdictions building codes NRS 278 (nv.gov, state.nv.us)
16. NRS 278.580 building code governing body city county adopt "electrical" code Nevada statute (state.nv.us, nv.gov)
17. Alaska 8 AAC 70.025 2020 National Electrical Code adoption regulations effective date notice Department of Labor Mechanical Inspection (alaska.gov, akleg.gov, state.ak.us)
18. Alaska Online Public Notices 8 AAC 70.025 electrical standards 2022 "Register 242" OR "2020 edition" National Electrical Code filed effective (state.ak.us, alaska.gov)
19. Arkansas Legislative Council Administrative Rules Subcommittee 2026 "Electrical Examiners" "National Electrical Code" 2026 edition rule effective date (arkleg.state.ar.us, sos.arkansas.gov, arkansas.gov)
20. Wyoming electrical rules "National Electrical Code" 2026 enforcement July 1 2026 State Fire Marshal electrical safety effective date (wyo.gov, wyoming.gov, wyoleg.gov)
21. Tennessee State Fire Marshal electrical rule 0780-02-01 National Electrical Code 2023 OR 2020 edition rulemaking hearing notice effective (tn.gov, tnsosfiles.com, tennessee.gov, sos.tn.gov)
22. Hawaii State Building Code Council annual report 2024 OR 2025 National Electrical Code 2023 adoption DAGS legislature (hawaii.gov)
23. Arkansas 2026 National Electrical Code effective date Board of Electrical Examiners adopted rule filed Secretary of State 2026 (no filter)
24. Utah 2025 H.B. 313 State Construction and Electrical Standards Amendments enrolled effective date 15A-2-103 2023 National Electrical Code (le.utah.gov, utah.gov)

## 8. Validation (run 2026-10-24)
Script: `python3 -I` research2/r4_6b_scripts/check.py.
- JSON: all 3 blocks parse. Copies are in research2/r4_tmp/r4_6b/r4_6b_block_01.json to r4_6b_block_03.json.
- Quote length: all 90 JSON quote segments are under 120 characters. This counts quote_segments plus each " | " part of the "quote" fields.
- Markdown quotes: one quoted string was too long, the NRS 244.3675 heading at 134 characters. It is now split into two segments.
- Row shape: the 4 add_rows and 5 changed_rows use exactly the key set of the existing nec-adoption.json rows, and every effective value is YYYY-MM-DD.
- Overlap: no add_row overlaps an existing state or an R4-6 add_row. Every changed_row exists in nec-adoption.json or in R4-6's add_rows.
- Count: after merging the existing rows (without NY-NYC), R4-6's add_rows and these add_rows, 49 jurisdictions are verified. With the 2 in not_verified, that makes 51.
