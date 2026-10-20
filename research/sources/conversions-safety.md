# wiresizes.com audit: primary sources for conversions, definitions, three-phase, safety stats and prices

Retrieved: 2026-10-19 (all items, via WebFetch/WebSearch; the shell cannot reach eia.gov, proxy 403).
Status legend:
- VERIFIED = value seen in the fetched primary source at the URL given.
- VERIFIED-SECONDARY = seen only in a secondary or mirror copy. Don't cite it as primary.
- UNVERIFIED = not seen in any fetched source. Don't publish it without a primary source.
- DERIVED = arithmetic on verified values, done by me. It isn't printed in the source.

Quotes are short verbatim extracts as returned by the fetch tool.

---

## 1. NIST SP 811 (Guide for the Use of the SI), Appendix B conversion factors

Source:
- Title: NIST Guide to the SI, Appendix B.8: Factors for Units Listed Alphabetically
- Publisher: NIST, Physical Measurement Laboratory
- Edition: NIST SP 811, 2008 edition (A. Thompson and B. N. Taylor). DOI https://doi.org/10.6028/NIST.SP.811e2008
- Page dates: "Created February 1, 2016, Updated August 18, 2025"

URLs:
- B.8 (alphabetical): https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
- B.9 (by kind of quantity), used as a cross-check: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9
- Appendix B intro (exactness rule): https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors. Quote: "A factor in boldface is exact."
- Series page: https://www.nist.gov/pml/special-publication-811. Quote: "NIST SP 811, Guide for the Use of the International System of Units (SI), 2008 edition". It also says SP 811 "has not yet been updated to reflect the changes in the SI that came into effect on May 20, 2019." That doesn't affect the factors below.

| Conversion (from -> to) | Factor as printed in B.8 | Decimal | Exact (bold)? | B.9 cross-check | Status |
|---|---|---|---|---|---|
| British thermal unit_IT per hour (Btu_IT/h) -> watt | 2.930 711 E-01 | 0.293 071 1 | No | Same, under "Heat Flow Rate" | VERIFIED |
| British thermal unit_th per hour (Btu_th/h) -> watt | 2.928 751 E-01 | 0.292 875 1 | No | - | VERIFIED |
| British thermal unit_IT (Btu_IT) -> joule | 1.055 056 E+03 | 1055.056 | No | - | VERIFIED |
| British thermal unit_th -> joule | 1.054 350 E+03 | 1054.350 | No | - | VERIFIED |
| horsepower (550 ft·lbf/s) -> watt | 7.456 999 E+02 | 745.6999 | No | Same, under "Power" | VERIFIED |
| horsepower (electric) -> watt | **7.46 E+02** | 746 | Yes | Same, bold | VERIFIED |
| horsepower (metric) -> watt | 7.354 988 E+02 | 735.4988 | No | Same | VERIFIED |
| horsepower (boiler) -> watt | 9.809 50 E+03 | 9809.50 | No | - | VERIFIED |
| horsepower (U.K.) -> watt | 7.4570 E+02 | 745.70 | No | - | VERIFIED |
| horsepower (water) -> watt | 7.460 43 E+02 | 746.043 | No | - | VERIFIED |
| kilowatt hour (kW·h) -> joule | **3.6 E+06** | 3 600 000 | Yes | Same, under "Energy" | VERIFIED |
| kilowatt hour -> megajoule | **3.6 E+00** | 3.6 | Yes | - | VERIFIED |
| watt hour (W·h) -> joule | **3.6 E+03** | 3600 | Yes | - | VERIFIED |
| watt second -> joule | **1.0 E+00** | 1 | Yes | - | VERIFIED |
| ton of refrigeration (12 000 Btu_IT/h) -> watt | 3.516 853 E+03 | 3516.853 | No | Same, under "Heat Flow Rate" | VERIFIED |
| calorie_IT -> joule | **4.1868 E+00** | 4.1868 | Yes | Same | VERIFIED |
| calorie_th -> joule | **4.184 E+00** | 4.184 | Yes | Same | VERIFIED |
| calorie (mean) -> joule | 4.190 02 E+00 | 4.19002 | No | - | VERIFIED |
| calorie (15 °C) -> joule | 4.185 80 E+00 | 4.18580 | No | - | VERIFIED |
| calorie (20 °C) -> joule | 4.181 90 E+00 | 4.18190 | No | - | VERIFIED |
| kilocalorie_th per second -> watt | **4.184 E+03** | 4184 | Yes | - | VERIFIED |
| foot pound-force per second -> watt | 1.355 818 E+00 | 1.355818 | No | - | VERIFIED |
| erg per second -> watt | **1.0 E-07** | 1e-7 | Yes | - | VERIFIED |
| therm (EC) -> joule | **1.055 06 E+08** | 105 506 000 | Yes | - | VERIFIED |
| therm (U.S.) -> joule | **1.054 804 E+08** | 105 480 400 | Yes | - | VERIFIED |
| ton of TNT (energy equivalent) -> joule | **4.184 E+09** | 4.184e9 | Yes | - | VERIFIED |

Evidence quotes (B.8):
- "British thermal unitIT per hour (BtuIT/h) | watt (W) | 2.930 711 | E-01"
- "horsepower (electric) | watt (W) | **7.46** | **E+02**"
- "ton of refrigeration (12 000 BtuIT/h) | watt (W) | 3.516 853 | E+03"

Derived values:
- W -> Btu_IT/h = 1/0.293 071 1 = 3.412 141 (DERIVED).
- Ton check: 12 000 x 0.293 071 1 = 3516.853 W (DERIVED; matches the printed factor).

Not seen:
- The B.8 footnote text that defines Btu_IT and the horsepower variants. Only footnote markers were returned.
- A URL fragment anchor for individual rows. Link to the page itself.

Audit notes:
- "Horsepower" is ambiguous on calculators. Electric hp is exactly 746 W. Mechanical (550 ft·lbf/s) hp is 745.6999 W. Metric hp is 735.4988 W. Boiler hp is 9809.50 W.
- DOE's motor fact sheet uses 0.7457 kW per hp (see 4a).

## 2. SI definitions: watt, volt, ampere, ohm (W = V·A, Ω = V/A)

2a. NIST SP 330, 2019 edition, "The International System of Units (SI)"
- Editors: David B. Newell and Eite Tiesinga. Dated August 2019.
- URL: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.330-2019.pdf (DOI https://doi.org/10.6028/NIST.SP.330-2019)
- Landing page: https://www.nist.gov/publications/international-system-units-si-2019-edition
- Section 2.3.1 (base units), ampere quotes:
  - "The ampere, symbol A, is the SI unit of electric current."
  - "It is defined by taking the fixed numerical value of the elementary charge e to be 1.602 176 634 × 10−19"
  - "...when expressed in the unit C, which is equal to A s".
- Table 4, "The 22 SI units with special names and symbols" (columns: base-unit expression / expression in other SI units):
  - watt: W = kg m² s⁻³ / J/s
  - volt: V = kg m² s⁻³ A⁻¹ / W/A (so W = V·A)
  - ohm: Ω = kg m² s⁻³ A⁻² / V/A
  - joule: J = kg m² s⁻² / N m
  - coulomb: C = A s
  - siemens: S = kg⁻¹ m⁻² s³ A² / A/V
- Status: VERIFIED.

2b. NIST SP 811 Chapter 4, "The Two Classes of SI Units and the SI Prefixes"
- URL: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes
- Section 4.2.1, table "The 22 SI coherent derived units with special names and symbols":
  - watt W = J/s (m2·kg·s−3)
  - volt V = W/A (m2·kg·s−3·A−1)
  - ohm Ω = V/A (m2·kg·s−3·A−2)
  - joule J = N·m
  - siemens S = A/V
- Page dates: created January 28, 2016, updated August 18, 2025.
- Status: VERIFIED.

## 3. Power factor, real, reactive and apparent power

3a. IEEE Std 1459 (public pages only; the standard itself is paywalled)
- IEEE 1459-2025: https://standards.ieee.org/ieee/1459/7578
  - Status: "Active Standard". Board approval 2025-02-12. Published 2025-05-16.
  - Description quote: "Definitions used for measurement of electric power quantities under sinusoidal, nonsinusoidal, balanced, or unbalanced conditions are provided in this standard." and "Mathematical formulas for measurements and the appropriate notations for expressing quantity values are given."
  - Keywords: apparent power, average power, power factor, reactive power, and others.
  - The public page does not state the definitions themselves.
  - Status: VERIFIED (page metadata only).
- IEEE 1459-2010: https://standards.ieee.org/standard/1459-2010.html
  - "Inactive-Reserved Standard", superseded by 1459-2025.
  - Approved 2010-02-02, published 2010-03-19, inactivated 2021-03-25.
  - Abstract quote: "This document provides definitions of electric power to quantify the flow of electrical energy in single-phase and three-phase circuits under sinusoidal, non-sinusoidal, balanced, and unbalanced conditions."
  - Status: VERIFIED.
- IEEE 1459-2000: https://standards.ieee.org/document/IEEE-1459. "Superseded Standard".
- Audit flag: cite IEEE 1459-2025. The 2010 edition is no longer active.

3b. U.S. EIA Glossary (U.S. government primary)
- https://www.eia.gov/tools/glossary/index.php?id=power
  - "Power factor: The ratio of real power (kilowatt) to apparent power kilovolt-ampere for any given load and time."
  - "Power (electrical): An electric measurement unit of power called a voltampere is equal to the product of 1 volt and 1 ampere." The entry also says apparent power splits into real power (kW) and reactive power (kilovars) needed by magnetic equipment such as motors. That part is the tool's summary, not a quote.
- https://www.eia.gov/tools/glossary/index.php?id=R#reactive_power
  - Reactive power: "The portion of electricity that establishes and sustains the electric and magnetic fields of alternating-current equipment." Units KVAR or MVAR.
  - Real power: "The component of electric power that performs work, typically measured in kilowatts (kW) or megawatts(MW)." The entry says it is "sometimes referred to as Active Power".
- https://www.eia.gov/tools/glossary/index.php?id=A#apparent_power
  - Apparent power: "The product of the voltage (in volts) and the current (in amperes)." Units "volt-amperes", usually kVA or MVA.
  - Active power: same definition as real power.
- Status: VERIFIED.

3c. DOE Motor Challenge fact sheet, "Reducing Power Factor Cost"
- Number DOE/GO-10096-286; NREL/MK-336-21439. Year 1996, per the NREL/NLR research-hub record. No date is printed on the sheet.
- URL: https://www.energy.gov/sites/prod/files/2014/04/f15/mc60405.pdf
- Record: https://research-hub.nlr.gov/en/publications/reducing-power-factor-cost-motor-challenge-fact-sheet/
- Quotes:
  - Power factor "is defined as the ratio of real (working) power to apparent (total) power."
  - Units: real power kW, reactive power kVAR, apparent power kVA. Reactive power "always acts at a 90° angle to real power."
  - Example: real power 100 kW, apparent power 142 kVA (reactive 100 kVAR). "Power Factor = 100/142 = 0.70 or 70%."
  - "By installing a 67-kW capacitor, the apparent power is reduced from 142 to 105 kVA, resulting in a 26% reduction in current." After correction: "PF = 100/105 = 0.95 or 95%".
  - "Utilities usually charge a penalty fee to customers with power factors less than 0.95."
- Arithmetic check (DERIVED): sqrt(142² − 100²) = 100.8 kVAR; 100/105 = 0.952; (142 − 105)/142 = 26.1%.
- Erratum: the source prints "67-kW capacitor". Capacitors are rated in kVAR, so don't copy "kW" onto the site.
- The sheet gives no typical motor PF values.
- Status: VERIFIED.

3d. DOE/OIT, "Energy Management for Motor-Driven Systems"
- G. A. McCoy and J. G. Douglass, WSU Cooperative Extension Energy Program, for BPA. Reproduced by DOE Office of Industrial Technologies. "Revision 2 March 2000".
- URL: https://www.energy.gov/sites/prod/files/2014/04/f15/NN0116.pdf
- Quotes:
  - "Power factor is the ratio of working power to apparent power."
  - "Reactive power, measured in kilovolt-amperes reactive, circulates between the generator and the load"
  - "Working power, measured in kW, and reactive power together make up the apparent power" (measured in kVA).
- Billing examples in the summary returned by the fetch tool:
  - Demand charge raised "1 percent for each 1 percent by which the average power factor is less than 0.95"
  - "Given a facility power factor of 84 percent, the utility would obtain a 13 percent increase in billable demand."
- The three-phase formula (Pi = V x I x PF x √3 / 1000) is garbled in the text extraction. Use 4a for that formula.
- Typical motor PF vs load (Figure 8-2) was not in the extracted text.
- Status: VERIFIED for the definitions. The motor-PF curve is UNVERIFIED.

3e. BPA / Electrotek, "Industrial Power Factor Analysis Guidebook"
- March 1995, DOE/BP-42892-1, OSTI 654078. https://www.osti.gov/biblio/654078
- Record only; no numbers extracted. It is a further primary reference for PF-correction capacitor economics.

3f. DOE/EERE "Motor Systems Tip Sheet" specifically on power factor
- None found. The search turned up Tip Sheets #6 and #8 on other topics.
- The DOE PF document is the 1996 Motor Challenge fact sheet in 3c.

## 4. Three-phase relationships and U.S. nominal voltages

4a. DOE Motor Challenge fact sheet, "Determining Electric Motor Load and Efficiency" (DOE/GO-10097-517)
- No date is printed.
- URL: https://www.energy.gov/sites/prod/files/2014/04/f15/10097517.pdf
- Equation 1: "Pi = V x I x PF x √3 / 1000", where:
  - "V = RMS voltage, mean line-to-line of 3 phases"
  - "I = RMS current, mean of 3 phases"
  - "PF = Power factor as a decimal"
- Also: "Pir = hp x 0.7457 / ηfl". The 0.7457 factor converts hp to kW.
- Also: "power factor tends to drop off sooner, but less steeply than efficiency, as load decreases."
- Worked example: 469.7 V average, 37 A average, PF 0.763 -> 22.9 kW.
- Status: VERIFIED. This is the primary U.S. government statement of P(3φ) = √3·V_L·I_L·PF.

4b. Academic support
- MIT OCW 6.061 "Introduction to Electric Power Systems", Spring 2011. Ch. 3 "Polyphase Networks", J. L. Kirtley Jr. (©2003).
  - https://www.ocw.mit.edu/courses/6-061-introduction-to-electric-power-systems-spring-2011/c6393a58319200a5344752de0cf47ec4_MIT6_061S11_ch3.pdf
  - Line-to-line voltage is larger than line-to-neutral by a factor of √3 (Sec. 4).
  - Base power "P_B = √3 V_Bl-l I_Bl" (eq. 56).
  - Total balanced instantaneous power "is constant" (after eq. 19).
  - The fetched text has no explicit "P = √3 V_l I_l cos ψ".
  - Status: VERIFIED for these statements only.
- Rose-Hulman "lecture notes 07" (NSF CCLI project DUE-0088904; course and author not printed).
  - https://www.rose-hulman.edu/class/ee/HTML/NSF/CCLI_EMD_DUE_0088904/PDFS/lecture_notes_07.pdf
  - P = √3 V_L I_L cos θ; Q = √3 V_L I_L sin θ; S = √3 V_L I_L.
  - Wye: V_L = √3 V_φ, I_L = I_φ. Delta: I_L = √3 I_φ.
  - Status: VERIFIED, but the attribution is weak. Use it only as support for 4a.
- Texas A&M ECEN 460 Lecture 3 (Overbye, Spring 2025).
  - https://overbye.engr.tamu.edu/wp-content/uploads/sites/146/2025/01/ECEN460_Spring2025_Lect03-update.pdf
  - S = 3 V_phase I_phase* (slides 21–22). The √3 form was not legible in the extraction.

4c. ANSI/NEMA C84.1
- Current listing: "ANSI/NEMA C84.1-2020 (R2025)", "Electric Power Systems and Equipment - Voltage Ratings (60 Hz)", publisher NEMA.
  - https://webstore.ansi.org/standards/nema/ansinemac842020r2025
  - Quote: "Establishes nominal voltage ratings and operating tolerances for 60Hz electric power systems above 100V." and "Includes preferred voltage ratings up to and including 1,200kV maximum system voltage."
  - The table values are not public.
  - Status: VERIFIED (metadata).
- Preview of C84.1-2016 (approved June 9, 2016): https://webstore.ansi.org/preview-pages/NEMA/preview_ANSI+C84.1-2016.pdf
  - Table 1 is not included in the preview. Foreword: "a 690/400V category has been added to the Low Voltage Class in table 1."
- Status for the Table 1 values themselves: UNVERIFIED (paywalled).

4d. Primary that lists nominal system voltages by reference to C84.1: North Carolina Utilities Commission Rule R8-17, "Standard Voltage"
- URL: https://www.ncuc.gov/ncrules/chapter08.pdf
- Justia copy: https://regulations.justia.com/states/north-carolina/title-04/chapter-11/chapter-8/article-4/section-11-r08-17
- History: Docket E-100 Sub 9 (4/25/72) and Sub 153 (11/27/2019).
- Quote: the nominal voltage is "a voltage indicated by the version of ANSI Standard C84.1, Electric Power Systems and Equipment-Voltage Ratings (60 Hz)".
- Single-phase: 120 (2-wire) and 120/240 (3-wire).
- Three-phase: 208Y/120, 240/120, 240, 480Y/277, 480, 600, plus medium-voltage values.
- Permitted variation:
  - Residential or lighting: "five percent (5%) above or below the standard base voltage"
  - Other service: "ten percent (10%)".
- Status: VERIFIED. This is a state regulation, not ANSI itself.

4e. NEC nominal voltages for calculations
- NEC 220.5(A), quoted in EC&M Magazine, C. R. Miller, "Branch-Circuit, Feeder and Service Calculations, Part II", Apr 15, 2006 (2005 NEC):
  - https://www.ecmag.com/magazine/articles/article-detail/codes-standards-branch-circuit-feeder-and-service-calculations-part-ii
  - Quote: "Unless other voltages are specified, for purposes of calculating branch-circuit and feeder loads, nominal system voltages of 120, 120/240, 208Y/120, 240, 347, 480Y/277, 480, 600Y/347 and 600 volts shall be used."
  - 220.5(B): fractions under 0.5 A "shall be permitted to be dropped."
  - Status: VERIFIED-SECONDARY (2005 NEC text).
  - The 2023 NEC wording is UNVERIFIED. NFPA free access needs a login, and no authorized public reproduction was found.
- 2026 NEC change, a likely audit flag. Load calculations moved from Article 220 to new Article 120 ("Branch-Circuit, Feeder, and Service Load Calculations"):
  - NFPA, NEC Handbook 2026 errata (Mar 27, 2026), with page header "Article 120 ● Branch-Circuit, Feeder, and Service Load Calculations": https://docinfofiles.nfpa.org/files/AboutTheCodes/70/Errata_NEC_Handbook_2026_Table_120.54.pdf (VERIFIED)
  - Minnesota DLI NEC 2026 Adoption Review Committee minutes (Sep 25, 2025): Article 120 "Formerly Article 220; renumbered to 120." https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-minutes.pdf (VERIFIED)
  - City of McKinney, TX summary:
    - "A new nominal system voltage was added for load calculations for data centers"
    - 2026 NEC statewide in Texas effective September 1, 2026.
    - https://www.mckinneytexas.org/DocumentCenter/View/39888/2026-National-Electrical-Code-Significant-Changes (VERIFIED; author not stated)
  - EC&M "Code Quiz: Standard Voltages for Load Calculations" (J. Lupacchino, Mar 19, 2026, "Based on the 2026 NEC"):
    - Section 120.5(A): "120, 120/240, 208Y/120, 240, 347, 416Y/240, 480Y/277, 480, 600Y/347, and 600 volts"
    - https://www.ecmweb.com/national-electrical-code/quizzes/article/55364950/code-quiz-standard-voltages-for-load-calculations
    - VERIFIED-SECONDARY. The page is internally inconsistent: its explanation says "416Y/120 was also added", so confirm against NFPA 70-2026 before publishing "416Y/240".
- Recommendation: if the site cites "NEC 220.5(A)", it should say "(2023 NEC; 120.5(A) in the 2026 NEC)".

## 5. Electrical safety statistics (latest available)

5a. NFPA
- Latest NFPA electrical figures read on an NFPA-owned publication: NFPA Journal, Winter 2022, p. 81, R. Campbell, "Home Fires Caused by Electrical Distribution and Lighting Equipment".
  - https://www.nxtbook.com/nxtbooks/nfpa/journal_2022winter/index.php?startid=81 (NFPA's digital edition)
  - Years: 2015–2019 annual averages.
  - "an estimated annual average of 32,620 home fires"
  - "430 civilian deaths"
  - "1,070 civilian injuries"
  - "an estimated $1.5 billion in direct property damage each year"
  - Wiring and related equipment: 68% of these fires, 42% of deaths, 53% of injuries, 60% of damage.
  - Midnight to 8 a.m.: 23% of fires, but "just over half (52%) of the deaths".
  - Status: VERIFIED.
- NFPA legacy page "Report: NFPA's 'Electrical Fires'" (Campbell, March 2019, 2012–2016 data).
  - https://www.nfpa.org/News-and-Research/Data-research-and-tools/Electrical/Electrical
  - "Electrical failures or malfunctions were the second leading cause of U.S. home fires in 2012-2016"
  - 13% of home structure fires, 18% of civilian deaths, 20% of direct property damage.
  - The page gave no counts, and the final URL after any redirect was not confirmed.
  - Status: VERIFIED (shares only).
- NFPA "Home Fires Involving Electrical Failure or Malfunction" counts for a recent period: UNVERIFIED.
  - nfpa.org research pages are JS-rendered and the old URL returned a fetch error.
  - The 2010–2014 figures (45,210 fires, 420 deaths, 1,370 injuries, $1.4B) were seen only in a NEMA AFCI brief hosted by MN DLI: https://www.dli.mn.gov/sites/default/files/pdf/2023NEC-AFCI-brief.pdf (VERIFIED-SECONDARY).
  - Older NFPA abstracts on NIST FireDOC: 2006 data, 52,500 fires / 340 deaths / 1,400 injuries / $1,447M (Hall, March 2009). https://firedoc.nist.gov/article/THgzXYQBWEcjUZEYhzxQ

5b. U.S. Fire Administration (FEMA), NFIRS-based national estimates
- "Residential building electrical malfunction fire trends (2014-2023)", last reviewed Feb 14, 2025.
  - https://www.usfa.fema.gov/statistics/residential-fires/electrical.html
  - 2023: "23,700 fires.", "305 deaths.", "800 injuries.", "$1,501,600,000 in dollar loss."
  - 10-year trend: "A 2% increase in fires." "A 19% decrease in deaths." "A 2% increase in injuries." "A 28% increase in dollar loss" (adjusted to 2023 dollars).
  - Status: VERIFIED.
- All residential building fires, 2023: 344,600 fires; 2,890 deaths; 10,400 injuries; $11,266,200,000. https://www.usfa.fema.gov/statistics/residential-fires/ (VERIFIED)
- Electrical malfunction share in 2023: 6.9% of residential building fires and 10.6% of deaths (DERIVED).
- Year series for electrical malfunction fires: https://www.usfa.fema.gov/statistics/residential-fires/causes.html
  - 2014–2023: 23900, 24500, 23500, 24100, 25700, 24200, 23400, 24200, 26100, 23700.
  - The "2% increase" is the page's trend statistic; the 2014-vs-2023 endpoints actually fall slightly.
- Matching pages: deaths.html (305 in 2023), https://usfa.fema.gov/statistics/residential-fires/injuries.html (800 in 2023), and dollar-loss.html ($1,501.6M in 2023).
- Older topical report "Residential Building Electrical Fires (2014-2016)", Vol. 19 Issue 8, December 2018.
  - https://www.usfa.fema.gov/statistics/reports/fire-causes/electrical-fires-v19i8.html
  - About 24,000 fires per year, 310 deaths, 850 injuries, $871 million.
  - Status: VERIFIED (superseded by the 2023 estimates above).

5c. CPSC residential fire loss estimates (newest; landing page dated Oct 13, 2026)
- "2021 – 2023 Residential Fire Loss Estimates", David Miller, Division of Hazard Analysis, October 2026.
  - Landing page: https://www.cpsc.gov/content/2021-to-2023-Residential-Fire-Loss-Estimates-Annual-Fire-Loss-Report
  - PDF: https://www.cpsc.gov/s3fs-public/2021-to-2023-Residential-Fire-Loss-Estimates-Annual-Fire-Loss-Report.pdf?VersionId=hbLPhk7mWcbQ_lMo0ZBwNttqOgD3XP8K
- All residential (unintentional) fires: "an estimated annual average of 350,700 fires; 2,480 deaths; 9,930 injuries" and "$9.62 billion in property losses" (2021–2023).
- Table 4a–4d, "Selected Electrical Equipment", 2021–2023 averages:

| Row | Fires | Deaths | Injuries | Property loss |
|---|---|---|---|---|
| Total Electrical | 56,900 | 550 | 2,980 | $2,181.1M |
| Electrical Distribution Equipment | 18,500 | 210 | 690 | $853.1M |
| Installed Wiring | 8,200 | 90 | 220 | $337.0M |
| Receptacle, Switch | 2,600 | 30 | 70 | $103.3M |
| Cord, Plug | 1,700 | 50 | 120 | $85.6M |
| Panel Board | 600 | 10 | 20 | $103.1M |
| Electric Heating and Cooling | 13,500 | 110 | 560 | $493.8M |

- Table 1a's "Total Electrical Distribution Equipment" is slightly different: 18,400 fires, 210 deaths, 720 injuries, $870.3M.
- 2023 single year, electrical distribution equipment (Table 4): 17,500 fires, 270 deaths, 770 injuries, $1,092.8M.
- Status: VERIFIED. Read twice; the numbers matched.
- Report index: https://www.cpsc.gov/Research--Statistics/Fire

5d. CPSC electrocutions (consumer-product-related only)
- "Electrocutions Associated with Consumer Products: 2011-2020", Hanway, Massie and Seebruck, Directorate for Epidemiology, November 2023.
  - https://cpsc.gov/s3fs-public/Electrocutions-2011-to-2020.pdf
  - "an estimated 110 consumer product-related electrocutions in 2018, 100 in 2019, and 90 in 2020"
  - 2011–2020 total: 720 (rounded).
  - Fractal wood burning was the most frequent product in 2018–2020.
  - Status: VERIFIED.
- Index showing this is the newest report: https://www.cpsc.gov/Research--Statistics/Electrocutions1
- Prior report, 2004–2013 (May 2017): 70 (2010), 40 (2011), 40 (2012), 40 (2013); "no statistical evidence of a trend". https://www.cpsc.gov/s3fs-public/Electrocution-Report-2004-to-2013.pdf

5e. BLS Census of Fatal Occupational Injuries
- Data year 2024. Release "NATIONAL CENSUS OF FATAL OCCUPATIONAL INJURIES IN 2024", "For release 10:00 a.m. (ET) Thursday, February 19, 2026".
  - https://www.bls.gov/news.release/archives/cfoi_02192026.pdf
  - Table 2: https://www.bls.gov/news.release/cfoi.t02.htm ("Table 2. Fatal occupational injuries for selected events or exposures, 2023-24", last modified Feb 19, 2026)
- Quote: "Exposure to electricity | 142 | 130". That is 142 in 2023 and 130 in 2024.
- 2024 totals: 5,070 fatal work injuries; rate 3.3 per 100,000 FTE.
- Status: VERIFIED.

5f. OSHA
- https://www.osha.gov/electrical and https://www.osha.gov/electrical/construction contain no national electrical fatality statistics.
- The construction page cites 29 CFR 1926 Subparts K and V, plus two old NIOSH alerts (1991, 1995).
- Use BLS CFOI for occupational numbers. OSHA "Fatal Four" percentages: UNVERIFIED (no OSHA page with them was found).

## 6. GFCI/AFCI effectiveness (CPSC)

GFCI
- The current CPSC GFCI fact sheet (Pub. 099, footer "092010") is qualitative only: "GFCIs have played a key role in reducing electrocutions."
  - https://www.cpsc.gov/s3fs-public/099_0.pdf
  - Testing advice: test "At least once a month", after installation and after a power failure.
  - Status: VERIFIED. It contains no number.
- "over two-thirds of the approximately 300 electrocutions still occurring each year in and around the home"
  - This appears only in an archived copy of CPSC Document #99 (GPO 1996 print), in the govdocs1 corpus mirror: https://corpora.tika.apache.org/base/docs/govdocs1/596/596391.html
  - Same copy, code-adoption years: outdoor receptacles 1973, bathrooms 1975, garages 1978, kitchens 1987, crawl spaces and unfinished basements 1990.
  - Status: VERIFIED-SECONDARY (archived and outdated). It is not on the live CPSC version, so don't cite it as a current CPSC figure.
- CPSC news release 91-071 (May 21, 1991): "electrocutions involving consumer products claim the lives of some 310 people each year." GFCIs have been "Installed in millions of American homes since 1973." No effectiveness percentage.
  - https://www.cpsc.gov/Newsroom/News-Releases/1991/Electrical-Safety-Month-Inexpensive-Device-Protects-Consumers-Against-Shock-Electrocution
- A numeric GFCI effect, such as "electrocutions down X%", on a live CPSC page: UNVERIFIED.
  - The figures "80 percent drop" and "93 percent drop 1975–2020" come from the NEMA/ESFI article https://www.nema.org/news-trends/ei/view/what-if-gfcis-didn-t-exist (May 2022, B. Deerwester, ESFI), which names no source. It is not primary.

AFCI
- CPSC staff memo "Economic Considerations --- AFCI Replacements", Mar 10, 2003 (T. R. Karels to W. H. King Jr.).
  - https://www.cpsc.gov/s3fs-public/pdfs/blk_pdf_ecafci.pdf
  - "there were an average of 41,500 residential fires involving residential electrical distribution systems" (1990–1998), with 326 deaths, 1,481 injuries, $646M per year.
  - "the inclusion of AFCI protection in circuit breakers could have prevented 50% or more of these fires"
  - Status: VERIFIED. This is an engineering estimate, not measured field effectiveness.
- CPSC memo "CPSC Staff Proposals for the National Electrical Code", Mar 18, 2003 (W. H. King Jr.).
  - https://www.cpsc.gov/s3fs-public/afci_0.pdf
  - "The engineering staff believes that AFCI technology will address 50% of the annual residential wiring fires"
  - "...will reduce the risk of an electrical wiring fire by half."
  - Status: VERIFIED.
- CPSC staff paper "New Technology for Preventing Residential Electrical Fires: Arc-Fault Circuit Interrupters (AFCIs)" (Lee, Trotta, King; undated).
  - https://www.cpsc.gov/s3fs-public/AFCIFireTechnology_0.pdf
  - "over 40,000 fires" per year attributed to home electrical distribution systems; more than 300 deaths; over 1,400 injuries; $680M (1996).
  - 1999 NEC required AFCIs on bedroom circuits, effective 2002.
  - It gives no effectiveness percentage.

## 7. U.S. residential electricity price (EIA)

- EIA Electric Power Monthly, Table 5.6.A ("Average Price of Electricity to Ultimate Customers by End-Use Sector, by State"). Current edition "Data for July 2026", released September 24, 2026; next release October 23, 2026.
  - https://www.eia.gov/electricity/monthly/
  - The HTML table (https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a) returned a server error twice.
  - The XLS (https://www.eia.gov/electricity/monthly/xls/table_5_06_a.xlsx) is binary and can't be read by the fetch tool.
  - The Table 5.6.A cell value: UNVERIFIED.
- Same EIA data, same edition: Electricity Monthly Update, End-Use section.
  - https://www.eia.gov/electricity/monthly/update/end-use.php
  - Data for July 2026, released Sept 24, 2026. Residential average revenue per kWh: 18.31 cents/kWh, +4.9% vs July 2025.
  - Other sectors: commercial 14.53, industrial 9.77, transportation 14.97.
  - "Total average revenues per kilowatt-hour (kWh) increased by 4.4% from last July, to 14.99 cents/kWh in July 2026."
  - EIA notes these are revenue-per-kWh proxies for prices.
  - Status: VERIFIED. Implied July 2025 is about 17.45 cents (DERIVED).
- Cross-check: EIA Monthly Energy Review, September 2026, Table 9.8 "Average Prices of Electricity to Ultimate Customers" (cents per kWh including taxes).
  - https://www.eia.gov/TOTALENERGY/data/monthly/pdf/sec9_11.pdf
  - Residential 2026 by month: Jan 17.45, Feb 17.65, Mar 18.56, Apr 18.83, May 18.44, Jun 18.34. 6-month average 18.16 (2025 same period: 16.91).
  - Status: VERIFIED.
- STEO October 2026, Table 7c (quarterly; shading that marks history vs forecast was not readable): 2025 annual U.S. residential 17.30 c/kWh.
  - https://www.eia.gov/outlooks/steo/tables/pdf/7ctab.pdf
  - Treat the 2026 values as partly forecast.
- Recommendation: any operating-cost calculator default should cite "EIA, Electricity Monthly Update / EPM Table 5.6.A, July 2026: 18.31 cents/kWh residential U.S. average". Re-check after the Oct 23, 2026 release (August data).

---

## Audit flags (likely issues on a converter/guide site)
1. Horsepower: label which hp is meant. Electric hp = 746 W exact; mechanical hp = 745.6999 W; metric hp = 735.4988 W (NIST B.8).
2. BTU/h: 1 Btu_IT/h = 0.293 071 1 W. A thermochemical-Btu value (0.292 875 1) would be the wrong basis for HVAC. 1 ton of refrigeration = 3516.853 W.
3. IEEE 1459-2010 is inactive. Cite IEEE 1459-2025 (active; published 2025-05-16).
4. NEC 220.5(A) became 120.5(A) in the 2026 NEC, with a new data-center voltage added. Texas has applied the 2026 NEC since Sept 1, 2026. Name the NEC edition on the page.
5. The 1996 DOE PF fact sheet misprints "67-kW capacitor"; it should be kVAR.
6. Safety figures:
   - Prefer the CPSC 2021–2023 RFLE (Oct 2026), USFA 2023 estimates and BLS CFOI 2024 (130 electricity deaths) over old NFPA/USFA numbers.
   - The NFPA 2015–2019 electrical distribution and lighting figures are the newest NFPA numbers that could be read.
7. "GFCIs prevent two-thirds of ~300 electrocutions" is a 1996 CPSC statement that has been removed from the current CPSC fact sheet.
8. "AFCIs prevent 50% of electrical fires" is a 2003 CPSC staff engineering estimate. Present it that way.

## UNVERIFIED summary (do not publish without a primary source)
- NFPA recent "electrical failure or malfunction" counts (nfpa.org research pages not readable).
- NEC 2023 220.5(A) exact text (login-gated); NEC 2026 120.5(A) list ("416Y/240"), seen only in a secondary source.
- ANSI C84.1 Table 1 values and Range A/B limits (paywalled).
- EIA EPM Table 5.6.A cell value (fetch failed; use the EMU value, which comes from the same data release).
- OSHA electrical "Fatal Four" statistics (not found on OSHA pages).
- A live CPSC numeric GFCI-effectiveness figure.
- DOE motor power-factor-vs-load values (figure not extracted).
- NIST B.8 footnote text defining the Btu_IT and horsepower variants.
