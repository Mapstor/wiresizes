# wiresizes.com: independent verification of the data pack and audit (19 Oct 2026)

Method: WebFetch only, no search, no mirrors/caches/archives. Python run with `python3 -I` (scripts in scratchpad/verifier_scripts/). WebFetch passes page text through a summarizing model, so "found" values are that model's readout of the fetched text. Where it restated instead of quoting, this report says so. One extraction error was caught: on the first read the model put HB100's "feet per ohm" column under the 30 and 40 AWG weights. A second, targeted read fixed it. Rate limits: three NFPA PDFs returned HTTP 429 from the WebFetch proxy, which instructed not to retry them. They were not retried.

## Summary

| Section | PASS | FAIL | UNREADABLE | Items |
|---|---|---|---|---|
| A: data values vs primaries, plus arithmetic | 12 | 1 | 6 | 19 |
| B: facts vs primaries | 19 | 0 | 1 | 20 |
| C: audit claims vs the live site | 22 | 1 | 0 | 23 |

**Every FAIL:**
1. A6(b): the audit's DC fix says "≈133,000 cmil ≈ 2/0". With copper at 75 °C the requirement is 140,141 cmil. 2/0 (133,100 cmil) is 5.0% short, so the smallest size that works is 3/0.
2. C4c: the audit quotes title copy as "follows NEC 2024 requirements". That string is not on the page. The only "2024" is in the intro: "…per NEC 2024 requirements." The finding stands, but the quote and its location are wrong.

**Every UNREADABLE:**
- A1: Table 310.16 (all 30 rows). Both registry PDFs (TIA 1691 PubCommCirc and BallotFinal) returned HTTP 429.
- A2a, A2b: Tables 310.15(B)(1)(1) and 310.15(C)(1). The FD ballot PDF returned HTTP 429.
- A3a, A3b: Table 310.12 and the 83% rule. Same FD ballot PDF, HTTP 429.
- A4d: Table 250.66 in the 2026 Second Draft (url_2 of nec-250-66.json). Not present in the fetched portion.
- B9e: BLS CFOI 2024 "130 deaths". The registry has no BLS URL, so it could not be fetched.

**Consequence:** none of the NEC 310.x JSON files (310.16, 310.15(B)(1)(1), 310.15(C)(1), 310.12) was verified in this pass. The C-section benchmarks that rest on them are therefore unconfirmed by this checker: the C1 14 AWG values, and the 310.12 sizes in C4/C5. The C results only confirm that the live pages say what the audit says they say.

**Other defects found (not graded):**
- nec-250-66.json: `source.document` was copied from the 250.122 file ("Table 250.122 also identical in … SR-8360"). Its `url_2` (the 2026 Second Draft) does not show Table 250.66. So the pack has no 2026-draft evidence for 250.66, and the audit's §6 line "T250.122 … and T250.66 [V] (2020 fact sheet = 2026 draft)" overstates the 250.66 part.
- awg.json, 19 AWG: area 1290 is an inference. The HB100 text layer prints "1200". The JSON itself says "Confirm against the scan", and it is still unconfirmed.
- awg.json cites the constants to "section 2.2 (p. 6)". The fetched HB100 text has 10.371, 0.00393 and 8.89 in Section 1.1 (a), (b) and (d).
- CPSC report: 18,500 fires comes from Table 4a ("Electrical Distribution Equipment"). Table 1a ("Total Electrical Distribution Equipment") says 18,400. Injuries are 720 vs 690 and losses $870.3M vs $853.1M. Any page must cite the exact table. The registry `url` is a landing page with no numbers, and the figures are only in the linked PDF.
- USFA's category is "electrical malfunction" fires. Do not merge it with CPSC's "electrical distribution equipment".
- A6(b): the audit's "~10× undersized" is really 12.6× at 75 °C copper.
- C2: the three-phase page's PF table rows 0.85 and 0.90 are also wrong. The page's "current reduction" column equals 0.95/PF1 − 1, an inverted ratio.
- C8: the range page goes further than "missing GFCI rules". It states GFCI is "Generally not required for ranges".

---

## A: data values against the primary sources

### A1. nec-310-16.json: Table 310.16, 18 AWG to 2000 kcmil, Cu and Al, 60/75/90 °C
- **Checked:** all 30 rows × 6 columns (180 cells), and the edition each source represents.
- **Expected:** JSON values (registry: 2023 table reprinted in the NFPA TIA 1691 public-comment circulation of 14 Feb 2023; TIA failed on the 21 Feb 2023 ballot).
- **Found:** nothing. Both documents were refused by the WebFetch proxy: "HTTP 429; rate limited … Do not fetch this page again".
- **Source:** https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_PubCommCirc.pdf and https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_Log1691_BallotFinal.pdf
- **Edition represented:** not observable.
- **Cross-checks named in the JSON:** FR-8257 sits in the FD ballot PDF, which also returned 429. SR-8602 has no URL in the registry or JSON. Neither was checked.
- **Result: UNREADABLE** (0/180 cells verified).
- Not counted, and not verification: the JSON values agree with the checker's own recollection of the 2023 table.

### A2. nec-310-15-B-1-1.json and nec-310-15-C-1.json
- **A2a, Table 310.15(B)(1)(1):** 16 ambient rows × 60/75/90 °C factors plus °F ranges. Expected: JSON. Found: nothing (HTTP 429). Source: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_BallotFinal.pdf. **UNREADABLE.**
- **A2b, Table 310.15(C)(1):** six bands (4–6 80%, 7–9 70%, 10–20 50%, 21–30 45%, 31–40 40%, 41+ 35%). Same source, HTTP 429. **UNREADABLE.**

### A3. nec-310-12.json
- **A3a, Table 310.12:** 11 rows, 100–400 A, Cu and Al/CCA. Expected: JSON (100 A 4/2 … 400 A 400/600). Found: nothing (HTTP 429). Source: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_BallotFinal.pdf. **UNREADABLE.**
- **A3b, 310.12(A)/(B) 83% rule:** same source. **UNREADABLE.**

### A4. nec-250-122.json and nec-250-66.json
- **A4a, Table 250.122 vs the NFPA fact sheet.**
  - Expected: JSON, 19 rows.
  - Found: all 19 rows identical: 15→14/12 · 20→12/10 · 60→10/8 · 100→8/6 · 200→6/4 · 300→4/2 · 400→3/1 · 500→2/1/0 · 600→1/2/0 · 800→1/0/3/0 · 1000→2/0/4/0 · 1200→3/0/250 · 1600→4/0/350 · 2000→250/400 · 2500→350/600 · 3000→400/600 · 4000→500/750 · 5000→700/1250 · 6000→800/1250 (Cu/Al-CCA).
  - Edition: "Grounding and Bonding: Using the Tables in Article 250 of the NEC®", © 2020 NFPA, June 2020. The document names no edition and says it reflects NFPA 70 "as of the date of publication".
  - Caveat: WebFetch's model declined a verbatim copy and restated the values in a new layout.
  - Source: https://www.salinas.gov/files/sharedassets/city/v/1/fire-department/documents/grounding-bonding-fact-sheet.pdf
  - **PASS**
- **A4b, Table 250.122 vs the 2026 Second Draft.**
  - Expected: JSON, 19 rows.
  - Found: SR-8360 (CMP-5 Second Draft working draft, Oct 2024, A2025 cycle, "CONTENT NOT FINAL – SUBJECT TO REVISION"). "Table 250.122(A)" has the same 19 rows. Committee statement: "No technical changes occurred as a result of this revision."
  - Source: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf
  - **PASS** (edition: 2026 draft)
- **A4c, Table 250.66 vs the fact sheet.**
  - Expected: JSON, 7 rows.
  - Found, all 7 identical:
    - 2 or smaller / 1/0 or smaller → 8 / 6
    - 1 or 1/0 / 2/0 or 3/0 → 6 / 4
    - 2/0 or 3/0 / 4/0 or 250 → 4 / 2
    - Over 3/0 through 350 / Over 250 through 500 → 2 / 1/0
    - Over 350 through 600 / Over 500 through 900 → 1/0 / 3/0
    - Over 600 through 1100 / Over 900 through 1750 → 2/0 / 4/0
    - Over 1100 / Over 1750 → 3/0 / 250
  - Source: Salinas URL above (© 2020 NFPA).
  - **PASS**
- **A4d, Table 250.66 vs the endpoint (Second Draft).**
  - Expected: support for the 2026-draft claim implied by `url_2` in nec-250-66.json.
  - Found: "no reproduction of Table 250.66 in the visible portion of the document". It appears only as a reference in 250.64(D)(1)(a), and the document text was truncated.
  - Source: https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P05_SD_PrelimSR.pdf
  - **UNREADABLE.** The JSON's `source.document` text is a copy of the 250.122 claim.

### A5. awg.json vs NIST HB100 and HB109
**A5a, HB100 Table 5** (page 16 per the contents; columns: diameter mils, cmil, Ω/1000 ft at 20 °C, lb/1000 ft). Source: https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf

| AWG | HB100 found (d / cmil / Ω / lb) | awg.json | Result |
|---|---|---|---|
| 0000 | 460.0 / 211 600 / 0.049 01 / 640.5 | 460.0 / 211600 / 0.04901 / 640.5 | PASS |
| 0 | 324.9 / 105 600 / .098 25 / 319.5 | 324.9 / 105600 / 0.09825 / 319.5 | PASS |
| 4 | 204.3 / 41 740 / .2485 / 126.3 | 204.3 / 41740 / 0.2485 / 126.3 | PASS |
| 8 | 128.5 / 16 510 / .6281 / 49.98 | 128.5 / 16510 / 0.6281 / 49.98 | PASS |
| 10 | 101.9 / 10 380 / .9988 / 31.43 | 101.9 / 10380 / 0.9988 / 31.43 | PASS |
| 12 | 80.8 / 6530 / 1.59 / 19.8 | 80.8 / 6530 / 1.59 / 19.8 | PASS |
| 14 | 64.1 / 4110 / 2.52 / 12.4 | 64.1 / 4110 / 2.52 / 12.4 | PASS |
| 18 | 40.3 / 1620 / 6.39 / 4.92 | 40.3 / 1620 / 6.39 / 4.92 | PASS |
| 22 | 25.3 / 640 / 16.2 / 1.94 | 25.3 / 640 / 16.2 / 1.94 | PASS |
| 24 | 20.1 / 404 / 25.7 / 1.22 | 20.1 / 404 / 25.7 / 1.22 | PASS |
| 30 | 10.0 / 100 / 104 / .303 (2nd read; 1st read mis-columned 9.64 = ft/Ω) | 10.0 / 100 / 104 / 0.303 | PASS |
| 40 | 3.1 / 9.61 / 1080 / .0291 (2nd read; 1st read mis-columned 0.927 = ft/Ω) | 3.1 / 9.61 / 1080 / 0.0291 | PASS |

**A5a result: PASS (12/12 gauges, 48/48 values).**

Extra observations:
- 20 AWG prints 32.0 / 1020 / 10.1 / 3.10, matching the JSON. The 10.1 comes from 32.0² = 1024 cmil, so a consumer recomputing from the rounded 1020 gets 10.17. Not an error.
- 19 AWG prints "35.9 | 1200 | .001 01 | 8.05". The JSON's 1290 is an inferred correction and was not seen.
- Internally, awg.json reproduces the rounded-diameter method in 43/44 rows. 9 AWG R20 is 0.7925 against a computed 0.7924; 9 AWG was not checked against HB100.

**A5b, copper resistivity.** Expected 10.371 Ω·cmil/ft at 20 °C (JSON `copper_resistivity_ohm_cmil_per_ft_20C` = 10.371). Found: "10.371 ohm-circular mil/ft at 20 °C" (HB100 Section 1.1a). Source: HB100 URL. **PASS.** The JSON cites "section 2.2 (p. 6)"; the text was found in 1.1.

**A5c, copper temperature coefficient.** Expected 0.00393/°C (JSON = 0.00393). Found: "specified the temperature coefficient of standard copper to be 0.00393 at 20 °C" (Section 1.1b). Density "8.89 g/cm3" (1.1d) also matches the JSON. Source: HB100 URL. **PASS.**

**A5d, aluminum EC-H19 resistivity.** Expected 17.002 Ω·cmil/ft at 20 °C. Found: Introduction "Conductivity", p. 1: "EC-H19.. 61.0 17.002". Table 1, p. 5: "20. 16.782 17.002 19.385 19.754" (EC-0, EC-H19, 5005-H19, 6201-T81). Source: https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook109.pdf. **PASS.**

**A5e, aluminum EC-H19 alpha and conductivity.** Expected 0.00403/°C and 61.0% IACS. Found: Table 1, p. 5, "Temperature Coefficient of Resistance per °C": "20. 0.00408 0.00403 0.00353 0.00347", column header "EC-H19 61%". Density 2.703 g/cm³. Per-gauge rows (Table 13) were unreadable, consistent with the JSON's disclosure. Source: HB109 URL. **PASS.**

**A5f, R75 for 14 AWG copper.** Expected about 3.065 Ω/1000 ft (JSON 3.065). Computed: R75 = 2.52 × (1 + 0.00393 × 55) = 2.52 × 1.21615 = **3.0647**. From the constant directly: 10.371/4110 × 1000 = 2.5234 → 3.0688. **PASS.**

### A6. Recomputations (Python; constants from A5)
Shared constant: ρ75(Cu) = 10.371 × (1 + 0.00393 × 55) = 12.6127 Ω·cmil/ft.

- **(a) Voltage drop: 3/0 Cu, 200 A, 100 ft one way, 240 V single-phase.**
  - R per conductor = 12.6127 × 100 / 167,806 = 0.007516 Ω. Loop = 0.015032 Ω.
  - Vd = 200 × 0.015032 = **3.0065 V = 1.2527%**. The HB100 3/0 value (0.06182 Ω/kft × 1.21615) gives 1.2530%.
  - Expected (audit): "≈ 1.25% (page 2.4%)". **PASS.**
  - Cross-check for the audit's 4/0 Al figure: ρ75(Al) = 17.002 × 1.22165 = 20.7705. Vd = 2 × 20.7705 × 200 × 100 / 211,600 = 3.926 V = **1.636%** (audit "≈ 1.64%").
- **(b) Required cmil: 12 V DC, 400 W, 40 ft one way, 2% drop, Cu at 75 °C.**
  - I = 400/12 = 33.333 A. Allowed Vd = 0.02 × 12 = 0.24 V.
  - CM = 2 × 12.6127 × 33.333 × 40 / 0.24 = **140,141 cmil**.
  - Sizes: 2/0 = 133,100 (5.0% short), so 3/0 (167,800) is the smallest AWG that meets it.
  - Expected (audit §5 low-voltage): "≈133,000 cmil ≈ 2/0". Found: 140,141 → 3/0. **FAIL.**
  - The audit's number matches K ≈ 12.0 (133,333 cmil), and even then 2/0 is 0.2% short. At 20 °C (K = 10.371) the requirement is 115,233 cmil and 2/0 would work.
  - The page's K-less formula gives 33.333 × 80 / 0.24 = 11,111 cmil, which is 12.6× too small (audit says "~10×").
- **(c) Power-factor correction: 0.80 → 0.95, 100 kW.**
  - Q1 = 100 × tan(acos 0.80) = 75.000 kVAR. Q2 = 100 × tan(acos 0.95) = 32.868 kVAR.
  - Required = **42.13 kVAR**.
  - S goes from 125.00 to 105.26 kVA. Current reduction = 1 − 0.80/0.95 = **15.79%**.
  - Expected (audit): "42.1 kVAR … 15.8%". **PASS.**
- **(d) 2 × 1/0 AWG in parallel.**
  - 2 × 105,600 = **211,200 cmil**.
  - 4/0 = 211,600 (−0.19%); 3/0 = 167,800 (+25.9%). Closest single size: **4/0**.
  - Expected (audit): "2 × 105,600 cmil ≈ 4/0". **PASS.**

---

## B: facts against primaries

**B1, IRS §30C.** Source: https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit ("Page Last Reviewed or Updated: 26-May-2026").
- **B1a, credit rate.** Expected 30%. Found: "the credit equals 30% of the cost of the property up to a maximum credit of $1,000 per item". **PASS.**
- **B1b, cap.** Expected $1,000 per item for individuals. Found: same sentence; an item is "each charging port, fuel dispenser, or storage property". **PASS.**
- **B1c, location.** Expected an eligible census tract. Found: "must be installed in a low-income community census tract or non-urban census tract". **PASS.**
- **B1d, last placed-in-service date.** Expected June 30, 2026. Found: "For property you buy and place in service at your main home from January 1, 2023, to June 30, 2026." Form 8911 is also named. **PASS.** Note: the page has no sentence saying the credit "ended"; that wording is an inference from the window.

**B2, Massachusetts 527 CMR 12.00.** Source: https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-42426/download
- **B2a, 2026 NEC issue date.** Expected Aug 20, 2025. Found: "released by vote of the NFPA Standards Council on August 20, 2025". **PASS.**
- **B2b, Massachusetts effective date.** Expected 4/24/26 (from the URL slug). Found: "shall be the 2026 National Electrical Code (NEC)" and "effective on all installations for which a permit has been granted subsequent to April 24, 2026." **PASS.**

**B3, Texas.** Expected the 2026 NEC effective Sept 1, 2026. Found: "adopt the 2026 National Electrical Code as the state electrical code" (16 TAC Chapter 73, §73.100, with a limited GFCI exception for certain outdoor outlets) and "upon its effective date of September 1, 2026". Source: https://www.tdlr.texas.gov/news/rulemaking/2026/09/01/commission-adopts-rules-12/. **PASS.**

**B4, Minnesota.** Expected Aug 17, 2026. Found: "The Board of Electricity has adopted the 2026 National Electrical Code (NEC) with an effective date of Aug. 17, 2026." and "Electrical permits filed before Aug. 17, 2026, must comply with the 2023 NEC." Source: https://www.dli.mn.gov/business/electrical-contractors/electrical-codes-and-standards. **PASS.**

**B5, Oregon.** Expected the 2026 OESC effective Oct 1, 2026. Found: "The 2026 Oregon Electrical Specialty Code (OESC) is based on the 2026 edition of the National Fire Protection Association (NFPA) 70, National Electrical Code (NEC)" and "Effective October 1, 2026". There are delayed items, e.g. 230.46 from Oct 1, 2027. Source: https://www.oregon.gov/bcd/codes-stand/Documents/26oesc-table1-E.pdf. **PASS.**

**B6, Washington.** Expected the 2026 NEC from Dec 31, 2026. Found: "adopts the 2026 edition of the National Fire Protection Agency (NFPA) 70" with "a delayed effective date of December 31, 2026". These are permanent rules, filed November 18, 2025, with the rule itself effective December 19, 2025. Source: https://lawfilesext.leg.wa.gov/law/wsr/2025/23/25-23-069.htm. **PASS.**

**B7, NIST SP 811 Appendix B.8.** Source: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
- **B7a, Btu_IT/h → W.** Expected 0.2930711. Found "2.930 711 E-01". **PASS.**
- **B7b, horsepower (550 ft·lbf/s) → W.** Expected 745.6999. Found "7.456 999 E+02". **PASS.**
- **B7c, horsepower (electric) → W.** Expected 746. Found "7.46 E+02", bold (exact). **PASS.**
- **B7d, ton of refrigeration (12 000 Btu_IT/h) → W.** Expected 3516.853. Found "3.516 853 E+03" (read at offset 100000). **PASS.**
- Also seen: horsepower (metric) "7.354 988 E+02"; kWh "3.6 E+06" (exact).

**B8, EIA.** Expected July 2026 residential 18.31 ¢/kWh. Found: "With Data for July 2026", "Release Date: September 24, 2026", "Residential | 18.31 | 4.9%". Commercial 14.53, industrial 9.77. Source: https://www.eia.gov/electricity/monthly/update/end-use.php. **PASS.**

**B9, safety-stats sample_note.** The registry `url` is a CPSC landing page with no numbers (published October 13, 2026). The figures are in the PDF it links: https://www.cpsc.gov/s3fs-public/2021-to-2023-Residential-Fire-Loss-Estimates-Annual-Fire-Loss-Report.pdf?VersionId=hbLPhk7mWcbQ_lMo0ZBwNttqOgD3XP8K (dated October 2026).
- **B9a, CPSC fires.** Expected 18,500 fires/yr. Found: Table 4a (p. 21) "Electrical Distribution Equipment": "18,500". Table 1a (p. 9) "Total Electrical Distribution Equipment": "18,400". **PASS** for Table 4; pages must cite which table.
- **B9b, CPSC deaths.** Expected 210 deaths/yr. Found: "210" in both Table 4b (p. 22) and Table 1b (p. 10). Injuries 690 (T4c) vs 720 (T1c); losses $853.1M (T4d) vs $870.3M (T1d). All residential fires: "350,700 fires; 2,480 deaths; 9,930 injuries; and $9.62 billion". **PASS.**
- **B9c, USFA fires.** Expected 23,700 (2023). Found: "23,700 fires." for residential building electrical malfunction fires. Trend 2014–2023: fires +2%, deaths −19%. Source: https://www.usfa.fema.gov/statistics/residential-fires/electrical.html (registry endpoint). **PASS.**
- **B9d, USFA deaths.** Expected 305 deaths. Found: "305 deaths." (also "800 injuries", "$1,501,600,000 in dollar loss"). Same source. **PASS.**
- **B9e, BLS CFOI 2024.** Expected 130 electricity deaths. No URL for BLS in the registry, so nothing was fetched. **UNREADABLE.**

---

## C: are the audit's claims about the live site true?
PASS here means the page says what the audit says it says. Whether the audit's "correct" benchmark is itself verified is noted per item.

**C1: https://wiresizes.com/guides/nec-code-compliance**
- **C1a, 14 AWG copper in the page's Table 310.16.**
  - Expected (audit): Cu "20/25/30 A" (correct 2023: 15/20/25), plus an invented 14 AWG Al row.
  - Found: heading "NEC Table 310.16 - Conductor Ampacities". Sub-header "| Cu | Al | Cu | Al | Cu | Al |". Row "14 | 20A | 15A | 25A | 20A | 30A | 25A | Branch circuits, lighting". So Cu is 20/25/30 and Al is 15/20/25 (the invented Al row).
  - Every row is shifted: the page's 60 °C column equals the true 75 °C values, its 75 °C equals the true 90 °C, and its 90 °C is one step higher. Example: "4/0 | 230A | 180A | 260A | 205A | 300A | 230A".
  - **PASS.** The benchmark (15/20/25) rests on A1, which was UNREADABLE.
- **C1b, equipment grounds for 200/300/400 A.**
  - Expected (audit): 4, 2 and 1/0 (T250.122: 6/4/3 Cu).
  - Found: "Grounding Conductor Sizing (NEC 250.122)", columns "Service Size | Grounding Electrode | Equipment Ground | Bonding Jumper". Rows: "200A | 4 AWG Cu | 4 AWG Cu | 2 AWG Cu"; "300A | 2 AWG Cu | 2 AWG Cu | 1/0 AWG Cu"; "400A | 1/0 AWG Cu | 1/0 AWG Cu | 2/0 AWG Cu".
  - **PASS.** Benchmark verified in A4a/A4b: 200→6, 300→4, 400→3 Cu.
  - Also present: "3.5 VA per sq ft × dwelling area".

**C2: https://wiresizes.com/calculators/three-phase-calculator**
- Header: "| HP Rating | kW | 460V FLA | 208V FLA | Wire Size | Breaker | Starter |".
- **C2a, 25 hp.** Expected (audit): 24.2 A on 10 AWG. Found "| 25 HP | 18.7 kW | 24.2A | 83.6A | 10 AWG | 50A | Size 1 |". **PASS.**
- **C2b, 50 hp.** Expected 48.3 A on 6 AWG. Found "| 50 HP | 37.3 kW | 48.3A | 167.2A | 6 AWG | 100A | Size 2 |". **PASS.**
- **C2c, 100 hp.** Expected 96.6 A on 3 AWG. Found "| 100 HP | 74.6 kW | 96.6A | 334.4A | 3 AWG | 175A | Size 3 |". **PASS.**
- Also confirmed:
  - 5 hp is "4.8A"/12 AWG, 10 hp "9.6A"/12 AWG, 200 hp "193.1A"/"4/0 AWG".
  - The 50 hp example says "Wire Size: 6 AWG copper (75A capacity)" and "Breaker: 100A (125% of FLA per NEC 430.52)". It uses a 59.7 A line current against the table's 48.3 A.
  - PF table: "| 0.80 | 0.95 | 18.8% | 32.9 kVAR per 100kW |…" (correct: 15.79% and 42.13). "0.85: 11.8% / 22.3" (correct 10.53% / 29.11). "0.90: 5.6% / 11.0" (correct 5.26% / 15.56).
  - The NEC FLC benchmark values (34/65/124 A) come from the site's own hp page (see C10). They were not checked against NEC (GAP G6).

**C3: https://wiresizes.com/calculators/low-voltage-calculator, DC formula**
- Expected (audit): the formula omits resistivity K ("CM = I × L_total / VD"), and the page answers #10/#8.
- Found: "Wire Calculation: (33.3A × 80ft) ÷ 0.24V = 11,100 CM", then "Required Wire: #10 AWG (10,380 CM) minimum" and "Recommended: #8 AWG for safety margin". Other examples use the same form, e.g. "(83.3A × 30ft) ÷ 0.36V = 6,942 CM". FAQ: "Wire Gauge = (Current × Distance × 2) ÷ (Voltage Drop × 12V)". No K appears anywhere.
- **PASS.** The audit's replacement value is wrong; see A6(b).

**C4: https://wiresizes.com/guides/wire-size-for-200-amp**
- **C4a, meta description.** Expected (audit): "4/0 copper or 250 kcmil aluminum (NEC 310.12)". Found: "200A residential service: 4/0 copper or 250 kcmil aluminum (NEC 310.12 83% rule)." followed by "EGC 6 AWG copper. Mast and meter requirements." The page's own 310.12 table row and worked example give "2/0 copper (175 A > 166)" and "4/0 aluminum (180 A > 166)", contradicting its meta. **PASS.** The T310.12 benchmark rests on A3, which was UNREADABLE.
- **C4b, NEC 2024 claim.** Expected: the page claims NEC 2024. Found, intro under H1: "Complete guide to selecting and installing the correct wire size for 200 amp electrical service per NEC 2024 requirements." The footer cites "NEC 2023 requirements". **PASS.**
- **C4c, the audit's quoted text.** Expected: title copy "follows NEC 2024 requirements". Found: `<title>` "Wire Size for 200 Amp Service". The string "follows NEC 2024 requirements" does not occur, and the only "2024" is the intro quote above. **FAIL** on quote and location; the substance holds.
- Also confirmed: Quick Answer "200A @ 75°C rating" for both 3/0 Cu and 4/0 Al, and VD row "| 100 feet | 2.4% | 2.8% | Both OK |".

**C5: https://wiresizes.com/guides/wire-size-for-100-amp**
- Expected (audit): meta "100A service: 1 AWG Cu or 1/0 Al (NEC 310.12)".
- Found: `<title>` "Wire Size for 100 Amp Service / Subpanel". Meta: "100A residential service: 1 AWG copper or 1/0 aluminum (NEC 310.12)." and "100A subpanel: 3 AWG copper, 1 AWG aluminum at 75°C. EGC 8 AWG cu." Intro: "Complete specifications for 100A service entrance and subpanel installations", with no 310.12 claim in the body.
- **PASS.** The benchmark 4 Cu / 2 Al rests on A3, which was UNREADABLE.
- The audit's other claims on this page are also present: "#6 AWG copper GEC", "Using #4 AWG copper (only rated for 85A at 75°C)", and "Attics over 40°C (104°F): Derate to 88% capacity".

**C6: https://wiresizes.com/about**
- **C6a, expert-review claim.** Expected: "reviewed by licensed electrical engineers". Found: "All calculations reviewed by licensed electrical engineers and master electricians." **PASS.**
- **C6b, endorsement quotes.** Expected: quotes attributed to NECA, IAEI, EC&M and IEEE. Found:
  - NECA: "Recommended tool for field calculations"
  - IAEI: "Valuable reference for code compliance"
  - EC&M, labelled "Electrical Contractor Magazine": "Featured in top electrical tools roundup"
  - IEEE, "IEEE Professional Development": "Cited in continuing education materials"
  - Also present: "100,000+" Calculations Per Month, "99.9% uptime SLA", "±0.1% numerical precision", "Accuracy Guarantee", "Monthly code review cycles", and "Built by electrical professionals…". The same page also says "No fake user counts. Marketing claims ('trusted by X') on this site are removed…" while showing "Trusted by 50,000+ Electricians".
  - **PASS.**

**C7: https://wiresizes.com/contact**
- **C7a, email addresses.** Expected (audit): emergency@, consulting@, legal@, education@ and international@. Found all six on the page: emergency@wiresizes.com (twice), support@wiresizes.com, consulting@wiresizes.com, legal@wiresizes.com, education@wiresizes.com and international@wiresizes.com. The international@ address serves the EU, Asia Pacific and Other Regions desks; support@ serves North America. **PASS.** The audit's list omits support@.
- **C7b, 24/7 and response-time promises.** Expected: "24/7" and a "2-hour response guarantee". Found:
  - "24/7 Critical Support Available"
  - "Available 24/7 • 2-hour response guarantee"
  - "(2-hour response guarantee)"
  - "Within 2 hours"
  - "Response: 24-48 hours"
  - "Response: 2-3 business days"
  - "Response: 3-5 business days"
  - meta "24-48hr response."
  - **PASS.**
- **C7c, headquarters.** Expected: "Headquarters: United States". Found: Headquarters block "WireSizes.com" / "Professional Electrical Calculation Platform" / "United States", with hours "Monday - Friday: 8:00 AM - 6:00 PM EST", "Saturday: 9:00 AM - 2:00 PM EST", "Sunday: Emergency support only". **PASS.**

**C8: https://wiresizes.com/calculators/range-calculator**
- Expected (audit): demand rule "first 8 kW at 100%, remainder at 80%".
- Found: "Use NEC 220.55 demand factors: apply 100% to the first 8kW and 80% to any excess." and "NEC Table 220.55 - 80% demand for most ranges". Guide row: "8kW - 12kW | 8kW + 80% excess | 8kW @ 100% + remainder @ 80%".
- **PASS.** The T220.55 benchmark is GAP G7 and unverified.
- Also confirmed: "5,000W ÷ 240V = 20.8A → 25A circuit" with "Wire: 12 AWG copper". GFCI: "Generally not required for ranges", and "210.8(D)" does not appear.

**C9: https://wiresizes.com/guides/electrical-power-calculations**
- Expected (audit): "220.82 Standard Method", 35%, EV × 1.25, and a conclusion of 225–250 A.
- Found:
  - "Example 5 — NEC 220.82 dwelling-unit load calculation" and "Determine minimum service size per NEC 220.82 Standard Method."
  - "first 10 kVA at 100 %, remainder at 35 %" (on 11,700 VA, i.e. 2,400 ft² × 3 + 3,000 + 1,500)
  - "EV charger (continuous, 220.82): 50 × 240 × 1.25 = 15,000 VA"
  - "Total demand: 10,595 + 9,500 + 8,000 + 9,600 + 15,000 = 52,695 VA"
  - "200 A service is INSUFFICIENT" and "Required service: 225 A or 250 A panel."
- **PASS.** That 220.82 is the optional method with 40% is the audit's [U] benchmark and was not verified.
- Also confirmed: "Annual energy: 8.64 × 365 = 3,154 kWh/year" and "22.1 A reduction = 18 % less I²R loss in feeders".

**C10: https://wiresizes.com/calculators/horsepower-to-amps-calculator**
- **C10a, table assignments.** Expected (audit): the page maps 430.247 to single-phase, 430.248 to three-phase 115/200 V, 430.249 to 230/460 V, and 430.250 to 575/2300 V. Found:
  - "Table 430.247: Single-phase motors, 115V and 230V"
  - "Table 430.248: Three-phase motors, 115V and 200V"
  - "Table 430.249: Three-phase motors, 230V and 460V"
  - "Table 430.250: Three-phase motors, 575V and 2300V"
  - The page contradicts itself: its 460 V heading says "(NEC Table 430.250)".
  - **PASS.** The audit's "correct" mapping (247 DC, 248 1φ, 249 2φ, 250 3φ) is [U] and unverified.
- **C10b, the 1 hp value labelled 230 V.** Expected 16 A (a 115 V value). Found: heading "Single-Phase Motors - 230V (NEC Table 430.247)", row "| 1 | 16 |". The homepage's single-phase table has "| 1 | 16A | 8A |" (115 V / 230 V). **PASS.**
- Also confirmed at 460 V: "| 2 | 3.9 |", "| 3 | 5.7 |", "| 5 | 7.6 |", "| 10 | 14 |", "| 25 | 34 |", "| 50 | 65 |", "| 100 | 124 |".

**C11: canonical and redirect.** WebFetch shows no HTTP status codes, but it returns cross-host redirects instead of following them, and none was returned.
- **C11a, https://wiresizes.com/.** Found: content served, no redirect reported, canonical "https://wiresizes.com", no og:url. Badges: "Trusted by 50,000+ Electricians", "Used in 50+ Countries". **PASS** (audit: apex canonical).
- **C11b, https://www.wiresizes.com/.** Found: content served (title "Wire Size Calculator — NEC 310.16"), no redirect reported, canonical "https://wiresizes.com", no og:url. **PASS** (audit: www serves content with no redirect).

**C12: https://wiresizes.com/guides/awg-wire-size-chart**
- **C12a, social-proof badges.** Expected: "Trusted by" badge text. Found:
  - "Trusted by 50,000+ Electricians"
  - "Trusted by electricians, contractors, engineers, and electrical professionals worldwide."
  - "[fire emoji] 30+ Professional Tools [lightning emoji] NEC 2023 Compliant [globe emoji] Used in 50+ Countries"
  - "NEC Code Compliant", "Professional Grade"
  - "Professional electrical calculation tools • NEC 2023 compliant • Trusted worldwide"
  - "Industry Standard" does not appear as a badge, only in the heading "Industry Standards & Authority Links".
  - **PASS.**
- **C12b, resistance column temperature.** Expected: no temperature stated. Found header "| AWG | Diameter (mm) | Diameter (inch) | Area (mm²) | Resistance (Ω/1000ft) | Cu Ampacity 75°C | Al Ampacity 75°C |", with no temperature, solid/stranded or DC qualifier. **PASS.**
- Rows found: 12 AWG "2.052 | 0.0808 | 3.31 | 1.588 | 25* | 20*"; 14 AWG "1.628 | 0.0641 | 2.08 | 2.525 | 20* | —"; 4/0 "11.684 | 0.4600 | 107.00 | 0.0490 | 230 | 180".
- The page's 1.588 and 2.525 are 4-significant-figure 20 °C values; HB100 prints 1.59 and 2.52.
- Also present: "R20°C = 1.588 Ω/1000 ft (NEC Chapter 9 Table 8)", which matches the audit's P1 finding.
