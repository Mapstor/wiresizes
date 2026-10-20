# AWG physics and standards: primary-source findings for the wiresizes.com audit

Retrieved: 2026-10-19 (all fetches). Tool: WebFetch (PDF text and OCR read through a summarizer). Quotes are short excerpts as returned.
Status labels:
- **VERIFIED**: seen in the fetched primary source.
- **COMPUTED**: Python, with the formula given.
- **UNVERIFIED**: not seen in a citable primary.
- **UNVERIFIED-for-citation**: seen only in an unauthorized copy of the NEC, so it cannot be cited or linked.

Computed table: `/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/research/awg-computed.csv`
Scripts: `/tmp/claude-0/-home-claude/39d04ee4-feaa-5c2c-9394-425a803dee20/scratchpad/scripts/awg2.py`, `check_const.py` and `al.py` in the same folder.

---

## 1. NBS Handbook 100, *Copper Wire Tables* (1966)

| Field | Value |
|---|---|
| Title | Copper Wire Tables (NBS Handbook 100) |
| Publisher | National Bureau of Standards (now NIST), Office of Engineering Standards, Institute for Applied Technology. No personal authors on the title page. |
| Edition | "Issued February 21, 1966", "[Supersedes Circular 31]" |
| URL fetched | https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf |
| Retrieved | 2026-10-19 |
| Caveat | The text comes from OCR. Page numbers reported by the extraction were mostly consistent. For the IACS section they varied between p. 2 and p. 4 across passes, so treat those page numbers as approximate. Table 5 is on p. 16 per the handbook's own contents (seen twice). |

### 1a. AWG definition. VERIFIED (p. 6, sec. 2.2)
- "the diameter of No. 0000 is defined as 0.4600 inch and of No. 36 as 0.0050 inch."
- "There are 38 sizes between these two": 39 steps, geometric progression. The ratio of adjacent diameters is printed as 1.122 932 2 (39th root of 92). The OCR of the ratio was garbled. The value 1.1229322 is also COMPUTED as 92^(1/39) = 1.1229321965.
- Circular mil (p. 6, sec. 2.1): "A mil is 0.001 inch, and the 'area' in circular mils is the square of the diameter expressed in mils."

### 1b. International Annealed Copper Standard (IACS) at 20 °C. VERIFIED (pp. 2–4, sec. 1)

| Quantity | Value as printed | Quote |
|---|---|---|
| Volume resistivity | 0.017 241 ohm·mm²/m | "0.017 241 ohm-mm2/meter at 20 °C" |
| Volume resistivity | 10.371 ohm·cmil/ft | "10.371 ohm-circular mil/ft at 20 °C" |
| Volume resistivity | 1.7241 µΩ·cm | "1.7241 microhm-cm at 20 °C" |
| Volume resistivity | 0.678 79 µΩ·in | "0.678 79 microhm-inch at 20 °C" |
| Mass resistivity | 0.153 28 Ω·g/m² | "0.153 28 ohm-gram/meter2 at 20 °C" |
| Volume conductivity | 58 m/(Ω·mm²), exact | "an exact whole number, viz, 58 meter/ohm-mm2 at 20 °C" |
| Density | 8.89 g/cm³ | "was taken as 8.89 grams/cm3 at 20 °C" |
| Temperature coefficient | 0.00393 /°C at 20 °C | "The International Electrotechnical Commission specified the temperature coefficient of standard copper to be 0.00393 at 20 °C" |
| Inferred zero | 234.5 (T column of Table 3, 100 % conductivity) | Seen only indirectly. The p. 9 example gives a "(fictitious) absolute temperature of 254.5°" at 20 °C, and 254.5 − 20 = 234.5. The status is **partially VERIFIED**. |

### 1c. How the tables were calculated. VERIFIED (pp. 1, 9, 10)
- p. 1: diameters "are rounded to the nearest tenth of a mil for gages 0000 through 44". Also: "The tables in the Circular were calculated as if these rounded diameters were correct."
- p. 9: "The data for tables 5 to 9, inclusive, were calculated with the above formulas using values of diameter in mils, d, taken from table 1."
- p. 10, paraphrased by the extractor: values were computed to six significant figures, then rounded to 4 s.f. for gages 10 and larger and to 3 s.f. for gages 11 and smaller.
- Table titles: Table 1 "The American Wire Gage"; Table 6 "Ohms per 1,000 feet, 0 to 200 °C"; Table 10 "Complete table at 20 °C, Metric units" (contents p. 23). The rows of Table 10 were **not readable** because the extracted text ends inside Table 5.

### 1d. Table 5: "Wire table, standard annealed copper. American Wire Gage. English units. Values at 20 °C." (p. 16). VERIFIED
Columns printed: Gage, Diameter in mils, Circular mils, Square inch, Ohms per 1,000 ft, Feet per ohm, Pounds per 1,000 ft, Feet per pound, Ohms per pound, Pounds per ohm. Two separate extraction passes agree on every row below. The HB100 calculation method (section 7) reproduces all 44 resistance values and all 44 weights.

| AWG | Dia (mils) | Area (cmil) | Ω/1000 ft | ft/Ω | lb/1000 ft |
|---|---|---|---|---|---|
| 0000 | 460.0 | 211 600 | 0.04901 | 20 400 | 640.5 |
| 000 | 409.6 | 167 800 | 0.06182 | 16 180 | 507.8 |
| 00 | 364.8 | 133 100 | 0.07793 | 12 830 | 402.8 |
| 0 | 324.9 | 105 600 | 0.09825 | 10 180 | 319.5 |
| 1 | 289.3 | 83 690 | 0.1239 | 8070 | 253.3 |
| 2 | 257.6 | 66 360 | 0.1563 | 6398 | 200.9 |
| 3 | 229.4 | 52 620 | 0.1971 | 5074 | 159.3 |
| 4 | 204.3 | 41 740 | 0.2485 | 4024 | 126.3 |
| 5 | 181.9 | 33 090 | 0.3134 | 3190 | 100.2 |
| 6 | 162.0 | 26 240 | 0.3952 | 2530 | 79.44 |
| 7 | 144.3 | 20 820 | 0.4981 | 2008 | 63.03 |
| 8 | 128.5 | 16 510 | 0.6281 | 1592 | 49.98 |
| 9 | 114.4 | 13 090 | 0.7925 | 1262 | 39.62 |
| 10 | 101.9 | 10 380 | 0.9988 | 1001 | 31.43 |
| 11 | 90.7 | 8230 | 1.26 | 793 | 24.9 |
| 12 | 80.8 | 6530 | 1.59 | 629 | 19.8 |
| 13 | 72.0 | 5180 | 2.00 | 500 | 15.7 |
| 14 | 64.1 | 4110 | 2.52 | 396 | 12.4 |
| 15 | 57.1 | 3260 | 3.18 | 314 | 9.87 |
| 16 | 50.8 | 2580 | 4.02 | 249 | 7.81 |
| 17 | 45.3 | 2050 | 5.05 | 198 | 6.21 |
| 18 | 40.3 | 1620 | 6.39 | 157 | 4.92 |
| 19 | 35.9 | **1200 (OCR; almost certainly 1290)** | 8.05 | 124 | 3.90 |
| 20 | 32.0 | 1020 | 10.1 | 98.7 | 3.10 |
| 21 | 28.5 | 812 | 12.8 | 78.3 | 2.46 |
| 22 | 25.3 | 640 | 16.2 | 61.7 | 1.94 |
| 23 | 22.6 | 511 | 20.3 | 49.2 | 1.55 |
| 24 | 20.1 | 404 | 25.7 | 39.0 | 1.22 |
| 25 | 17.9 | 320 | 32.4 | 30.9 | 0.970 |
| 26 | 15.9 | 253 | 41.0 | 24.4 | 0.765 |
| 27 | 14.2 | 202 | 51.4 | 19.4 | 0.610 |
| 28 | 12.6 | 159 | 65.3 | 15.3 | 0.481 |
| 29 | 11.3 | 128 | 81.2 | 12.3 | 0.387 |
| 30 | 10.0 | 100 | 104 | 9.64 | 0.303 |
| 31 | 8.9 | 79.2 | 131 | 7.64 | 0.240 |
| 32 | 8.0 | 64.0 | 162 | 6.17 | 0.194 |
| 33 | 7.1 | 50.4 | 206 | 4.86 | 0.153 |
| 34 | 6.3 | 39.7 | 261 | 3.83 | 0.120 |
| 35 | 5.6 | 31.4 | 331 | 3.02 | 0.0949 |
| 36 | 5.0 | 25.0 | 415 | 2.41 | 0.0757 |
| 37 | 4.5 | 20.2 | 512 | 1.95 | 0.0613 |
| 38 | 4.0 | 16.0 | 648 | 1.54 | 0.0484 |
| 39 | 3.5 | 12.2 | 847 | 1.18 | 0.0371 |
| 40 | 3.1 | 9.61 | 1080 | 0.927 | 0.0291 |

Why 19 AWG reads "1200" but should be 1290: the same row's square-inch column reads ".001 01". That matches 1290 cmil (0.001013 in²) and not 1200 (0.000942 in²). Its 8.05 Ω also requires about 1289 cmil, and 35.9² = 1288.8. **Check the scan image before you publish the 19 AWG area.**

---

## 2. NBS Handbook 109, *Aluminum Wire Tables* (1972)

| Field | Value |
|---|---|
| Title | Aluminum Wire Tables (NBS Handbook 109) |
| Authors | C. Peterson and J. L. Thomas (NBS); "H Cook" (The Aluminum Association), initials as they appear in the OCR |
| Edition | Issued February 1972 |
| URL fetched | https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook109.pdf |
| Retrieved | 2026-10-19 |

### 2a. Constants: VERIFIED (p. 1 conductivity list; Table 1, p. 5, 20 °C row)
p. 1: "These tables are based on the following conductivities". Table 1 column heads: "EC-0 / 61.8% / EC-H19 / 61%. / 5005-H19 / 53.5% / 6201-T81 / 52.5%".

| Alloy/temper | % IACS | Ω·cmil/ft @20 °C | Ω·mm²/m @20 °C | α20 per °C | µΩ·cm (COMPUTED = Ω·mm²/m × 100) |
|---|---|---|---|---|---|
| EC-0 (annealed) | 61.8 | 16.782 | 0.027898 | 0.00408 | 2.7898 |
| **EC-H19 (hard drawn)** | **61.0** | **17.002** | **0.028264** | **0.00403** | 2.8264 |
| 5005-H19 | 53.5 | 19.385 | 0.032226 | 0.00353 | 3.2226 |
| 6201-T81 | 52.5 | 19.754 | 0.032840 | 0.00347 | 3.2840 |

- Density at 20 °C: 2.703 g/cm³ (0.09765 lb/in³), Table 1. VERIFIED.
- The 0.00403 value in the brief is correct for **EC-H19 at 61.0 %**. EC-0 is 61.8 % with α = 0.00408.
- The handbook never says "1350". It uses EC-0 and EC-H19. That EC grade equals alloy 1350 is **UNVERIFIED**: no source for it was fetched.
- Contents: Tables 3–12 are EC-0 (Table 3 English units p. 7, Table 4 Ω/1000 ft p. 9). Tables 13–22 are EC-H19 (Table 13 p. 26, Table 14 Ω/1000 ft p. 28). Tables 23–30 are stranded tables (pp. 45–58), and the stranded ones list large sizes in cmil. The handbook uses no "kcmil" or "MCM".

### 2b. Resistance per 1000 ft by AWG: per-AWG rows UNVERIFIED, values below COMPUTED
The OCR of Tables 3 and 4 is too garbled to tie values to gages. The extracted text stops after Table 9, so Tables 13 and 14 were never reached. The shell cannot download the PDF either (proxy 403). The values below use R = ρ / A × 1000, with ρ from HB109 Table 1. AWG areas are HB100 Table 1 diameters squared; kcmil areas are exact.

| Size | Area (cmil) | EC-0 (16.782) Ω/1000 ft | EC-H19 (17.002) Ω/1000 ft |
|---|---|---|---|
| 12 | 6529 | 2.571 | 2.604 |
| 10 | 10384 | 1.616 | 1.637 |
| 8 | 16512 | 1.016 | 1.030 |
| 6 | 26244 | 0.6395 | 0.6478 |
| 4 | 41738 | 0.4021 | 0.4073 |
| 3 | 52624 | 0.3189 | 0.3231 |
| 2 | 66358 | 0.2529 | 0.2562 |
| 1 | 83694 | 0.2005 | 0.2031 |
| 1/0 | 105560 | 0.1590 | 0.1611 |
| 2/0 | 133079 | 0.1261 | 0.1278 |
| 3/0 | 167772 | 0.1000 | 0.1013 |
| 4/0 | 211600 | 0.07931 | 0.08035 |
| 250 kcmil | 250000 | 0.06713 | 0.06801 |
| 300 kcmil | 300000 | 0.05594 | 0.05667 |
| 350 kcmil | 350000 | 0.04795 | 0.04858 |
| 400 kcmil | 400000 | 0.04196 | 0.04251 |
| 500 kcmil | 500000 | 0.03356 | 0.03400 |
| 600 kcmil | 600000 | 0.02797 | 0.02834 |
| 750 kcmil | 750000 | 0.02238 | 0.02267 |
| 1000 kcmil | 1000000 | 0.01678 | 0.01700 |

These are solid-wire values at 20 °C with no stranding increment.

---

## 3. ASTM B258 and ASTM B8: VERIFIED (product pages; the standards themselves are paywalled)

**ASTM B258-18(2026)**, designation B0258-18R26, status "Active".
- Title: "Standard Specification for Standard Nominal Diameters and Cross-Sectional Areas of AWG Sizes of Solid Round Wires Used as Electrical Conductors"
- URL: https://store.astm.org/b0258-18r26.html
- DOI: 10.1520/B0258-18R26
- Scope 1.1: "This specification prescribes standard nominal diameters and cross-sectional areas of American Wire Gage (AWG) sizes … of solid round wires, used as electrical conductors, and gives equations and rules for the calculation of standard … nominal mass and lengths, resistances, and breaking strengths of such wires (Explanatory Note 1)."
- Scope 1.2.1: "For density, resistivity and temperature, the values stated in SI units are to be regarded as standard."
- No reapproval date is printed. The "R26" suffix implies reapproval in 2026, but that is an inference.
- Previous edition B258-18 is now "Standard Historical": https://store.astm.org/b0258-18.html. The old astm.org/b0258-18.html link returns a 302 to store.astm.org.
- The B258 rounding rule and its tables are behind the paywall and were not seen.

**ASTM B8-23**, "Active", last page update Nov 21, 2023.
- Title: "Standard Specification for Concentric-Lay-Stranded Copper Conductors, Hard, Medium-Hard, or Soft"
- URL: https://store.astm.org/b0008-23.html. DOI 10.1520/B0008-23. 8 pages. Subcommittee B01.04.
- Scope 1.1: "This specification covers bare concentric-lay-stranded conductors made from round copper wires", "constructed with a central core surrounded by one or more layers of helically laid wires".
- Scope 1.2 classes:
  - "Class AA—For bare conductors usually used in overhead lines."
  - Class A: weather-resistant covered conductors, and bare conductors needing more flexibility than AA.
  - "Class B—For conductors to be insulated with various materials such as rubber, paper, varnished cloth," and Class A uses that need more flexibility.
  - "Class C and Class D—For conductors where greater flexibility is required than is provided by Class B conductors."
- **Class B strand counts are not on the page. They are UNVERIFIED from ASTM.**
- Both ASTM pages state: "Using Artificial Intelligence (AI) on ASTM standards and related intellectual property is prohibited." Keep ASTM text out of AI drafting, and cite these pages by URL only.

---

## 4. NEC (NFPA 70) Chapter 9, Tables 8 and 9

### 4a. Authorized reproduction: NOT FOUND (UNVERIFIED)
No page carrying "Reprinted with permission from NFPA 70" for Table 8 or Table 9 was found.

| Candidate | Result |
|---|---|
| UpCodes (`https://up.codes/s/conductor-properties`) | **Blocked.** The permission request timed out and the tool said "Do not retry". Not retried. |
| Thomas & Betts / Ocal PDF (media.distributordatasolutions.com …nectable8pdf…) | It does carry "Reprinted with permission from NFPA 70-1999, National Electrical Code ®". However, it is **Table C8** (RMC conduit fill), not Chapter 9 Table 8. |
| MSHA arlweb INDEX.pdf | NEC **1968 index** only, with the notice "Reprinted with permission from NFPA 70-1968". No table data. |
| Encore Wire spec sheets (media.iewc.com ENCORE.pdf; vdam.kdsi.net) | No Table 8 or 9 and no permission notice. |
| EC&M "Chapter 9 of the NEC — Part 4" (2021) | Describes the tables but gives no values and no notice. |
| IAEI magazine (Ferm's Formulas excerpts, 2017 and 2019) | No permission notice and no NEC edition named. It gives a few Table 8 values (see 4c). |
| zing2.app NEC Table 8 page | "Not affiliated with NFPA", no permission notice. It pairs the **solid** 14 AWG resistance (3.07) with the **stranded** diameter (0.073). Not usable. |
| NFPA 70 page on nfpa.org (`/codes-and-standards/nfpa-70-standard-development/70`) | Returned metadata only (page is rendered by JavaScript). NFPA free access needs a login. |
| Southwire, Cerrowire, Burndy, General Cable catalogs | **Not checked.** The shared WebSearch budget (200 calls per turn) ran out. |

### 4b. Values seen only in an unauthorized copy: UNVERIFIED-for-citation
Source: NFPA 70 **2017** Chapter 9 pages 70-679 to 70-693, hosted at https://www.lorisweb.com/CMGT235/DIS26/Chapter%209%20NEC%202017.pdf. It is stamped "Licensed, by agreement, for individual use … to Lori Brown" and "No other reproduction or transmission in any form permitted without written permission of NFPA®". Use these figures only to sanity-check the site. **Do not cite or link this copy.** They are 2017 values; the 2023 and 2026 tables were not seen.

Table 8 (p. 70-689):
- **Stranding (Class B):** 7 strands for 18–2 AWG; **19 for 1 AWG–4/0**; 37 for 250–500 kcmil; 61 for 600–1000; 91 for 1250–1500; 127 for 1750–2000. 2 AWG has no solid row.
- **Overall diameter, solid vs stranded (in):**

  | AWG | Solid | Stranded | Stranded is larger by |
  |---|---|---|---|
  | 14 | 0.064 | 0.073 | 14.1 % |
  | 12 | 0.081 | 0.092 | 13.6 % |
  | 10 | 0.102 | 0.116 | 13.7 % |
  | 8 | 0.128 | 0.146 | 14.1 % |

- **DC resistance at 75 °C (Ω/1000 ft):**
  - Uncoated copper, solid: 14 AWG 3.07, 12 AWG 1.93, 10 AWG 1.21.
  - Uncoated copper, stranded:

    | Size | 14 | 12 | 10 | 8 | 6 | 4 | 2 | 1/0 | 4/0 | 250 | 500 |
    |---|---|---|---|---|---|---|---|---|---|---|---|
    | Ω/1000 ft | 3.14 | 1.98 | 1.24 | 0.778 | 0.491 | 0.308 | 0.194 | 0.122 | 0.0608 | 0.0515 | 0.0258 |

  - Aluminum:

    | Size | 12 | 10 | 8 | 6 | 4 | 2 | 1/0 | 4/0 | 250 | 500 |
    |---|---|---|---|---|---|---|---|---|---|---|
    | Ω/1000 ft | 3.25 | 2.04 | 1.28 | 0.808 | 0.508 | 0.319 | 0.201 | 0.100 | 0.0847 | 0.0424 |

  - Coated-copper values were not extracted.
- **Notes (paraphrased by the extractor):**
  - Conductivity basis is 100 % IACS for copper and 61 % IACS for aluminum.
  - Note 2: "αcu = 0.00323, αAL = 0.00330 at 75°C".
  - Class B diameters are those of the circumscribing circle.
  - Compact and compressed conductors are smaller; see Table 5A.
  - Informational note: construction data per NEMA WC/70-2009 or ANSI/UL 1581-2011, and resistance per "National Bureau of Standards Handbook 100, dated 1966, and Handbook 109, dated 1972."

Table 9 (p. 70-690), 75 °C, three single conductors in conduit, Ω/1000 ft:

| Size | R uncoated Cu, PVC | Al conduit | Steel conduit | XL PVC/Al | XL steel |
|---|---|---|---|---|---|
| 12 AWG | 2.0 | 2.0 | 2.0 | 0.054 | 0.068 |
| 10 AWG | 1.2 | 1.2 | 1.2 | 0.050 | 0.063 |
| 1/0 | 0.12 | 0.13 | 0.12 | 0.044 | 0.055 |
| 4/0 | 0.062 | 0.067 | 0.063 | 0.041 | 0.051 |

Other Table 9 rows were not extracted: 14, 8–1 AWG, 2/0, 3/0, 250–500 kcmil.

### 4c. Corroboration from secondary sources (no permission notice; edition unknown unless stated)
- IAEI, Ferm's Formulas excerpt (https://iaeimagazine.org/electrical-fundamentals/voltage-drop-formulas/, 2017): "For 1 AWG, find 0.154 ohm/kFT". Also 1000 kcmil Cu 0.0129 and Al 0.0212.
- Mike Holt *Electrical Calculations*, 2002 NEC sample (https://www.mikeholt.com/img/product/pdf/1038225525sample.pdf, p. 153): DC resistance Cu 250 kcmil 0.0515, 500 kcmil 0.0258, 1000 kcmil 0.0129; Al 0.0847, 0.0424, 0.0212.
- Mike Holt voltage-drop sample (https://www.mikeholt.com/instructor2/img/product/pdf/1220452413sample.pdf): stranded 14–6 AWG 3.14, 1.98, 1.24, 0.778, 0.491, with diameters 0.073, 0.092, 0.116, 0.146, 0.184.
- These values match the 2017 values, which suggests Table 8 has been stable since at least 2002. That stability is an inference.

### 4d. Consistency check: COMPUTED
- Copper at 75 °C = HB100 R20 × (1 + 0.00393 × 55):
  - 14 AWG: 3.069 vs NEC 3.07
  - 12 AWG: 1.931 vs NEC 1.93
  - 10 AWG: 1.215 vs NEC 1.21
- Aluminum at 61.0 % IACS, R20 × (1 + 0.00403 × 55) × 1.02, where the 2 % stranding increment is an **assumption I did not verify**:
  - 4/0: 0.1001 vs NEC 0.100
  - 500 kcmil: 0.04237 vs NEC 0.0424
  - 12 AWG: 3.244 vs NEC 3.25

So the NEC Table 8 values are consistent with HB100/HB109 corrected to 75 °C.

---

## 5. IEC 60228 nominal metric cross-sections

- **Current edition: IEC 60228:2023**, Edition 4.0, published 2023-12-11, stability date 2030, TC 20. VERIFIED.
  - URL: https://webstore.iec.ch/en/publication/71891
  - Abstract: "IEC 60228:2023 specifies the nominal cross-sectional areas, in the range 0,5 mm2 to 3 500 mm2, for conductors in electric power cables and cords of a wide range of types." Also: "This document does not apply to conductors for telecommunication purposes."
- **Previous edition: IEC 60228:2004**, Ed. 3.0. Withdrawn 2023-12-11; the page says "A more recent version of this publication exists". Its range was 0,5 mm² to 2 500 mm². URL: https://webstore.iec.ch/en/publication/1065. VERIFIED.
- **Official series, Class 1 (solid), IEC 60228:2023 Table 3, p. 12. VERIFIED.**
  - Source: the publisher sample at https://cdn.standards.iteh.ai/samples/107432/b61505bac784419dbb634df3767e77d5/IEC-60228-2023.pdf, linked from the iTeh catalog page https://standards.iteh.ai/catalog/standards/iec/af25f2c8-60f0-437c-a14f-bf3b102bce91/iec-60228-2023.
  - Sizes (mm²): 0.5, 0.75, 1.0, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000, 1200, 1400, 1600.
  - The 500 mm² and larger rows have aluminium values only.
  - Footnote b: plain solid copper at 25 mm² and above is for particular cable types only.
  - One resistance value was also seen: 1.5 mm² plain copper, Class 1, maximum 12.1 Ω/km at 20 °C.
- **Class 2 (stranded, Table 4) is not in the sample.** Sizes above 1600 mm², up to the 3500 mm² stated in the abstract, are **UNVERIFIED**.
- The sample carries "Copyright © 2023 IEC, Geneva … no part may be reproduced without written permission". Publish the size list (facts) with a citation; do not reproduce the tables.

---

## 6. Claims on the current site

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| a | "Stranded conductors are about 8–15 % larger in overall diameter than solid of the same AWG" | **FALSE at the low end.** Correct figure is about 13–15 % for Class B. | NEC 2017 Table 8 (unauthorized copy, 4b): 14–8 AWG are 13.6–14.1 % larger. COMPUTED concentric-lay geometry: OD/solid = (2k+1)/√N, giving 7 strands +13.4 %, 19 strands +14.7 %, 37 strands +15.1 %, up to 127 strands +15.4 %. No source seen supports 8 %. Table 8 note: compact and compressed conductors are smaller (Table 5A), which is a separate case. |
| b | "Solid is required for fixed wiring 14–10 AWG (NEC 334.10)" | **FALSE** | 334.10 is "334.10 Uses Permitted." (VERIFIED, NFPA A2025 Second Draft for Panel 6). The NM conductor section 334.104 sets sizes only; the struck-through 2023 text reads "sizes 14 AWG … through 2 AWG copper", with no solid requirement. No NEC text seen requires solid conductors for 14–10 AWG. Industry practice is not code. |
| c | "Stranded is required above 8 AWG" | **FALSE as worded.** Correct: 8 AWG **and larger**, **in raceways**, with exceptions. | 2023 NEC **310.3(C)** "Stranded Conductors": "Where installed in raceways, conductors 8 AWG and larger shall be stranded, unless specifically permitted or required elsewhere in this Code to be solid." VERIFIED as the existing text in the NFPA A2025 Second Draft (Panel 6, Oct 2024, working draft), SR No. 8425. The same wording is quoted on Mike Holt's forum (31 Mar 2025). **2026 NEC:** SR 8425 "[Move section 310.3 to 310.5]". IEC (19 May 2026): "What was 310.3 (now 310.5)". So 2026 = 310.5(C)\*. |
| d | "Class B stranding: 7 strands at small AWG, 19 strands above 1/0" | **FALSE.** 19 strands starts at **1 AWG** and stops at 4/0; larger sizes have 37, 61, 91 and 127. | NEC 2017 Table 8 (unauthorized copy). ASTM B8 Class B table not seen (paywall). |
| e | "1 kcmil = 0.5067 mm²" | **TRUE** | COMPUTED: 1 cmil = π/4 × (0.0254 mm)² = 5.067075×10⁻⁴ mm², so 1 kcmil = 0.5067075 mm². Uses the HB100 cmil definition and the exact inch of 25.4 mm. |
| f | "4/0 ≈ 211.6 kcmil (107 mm²)" | **TRUE** | HB100 Table 5: 0000 = 460.0 mils, 211 600 cmil (VERIFIED). 211 600 × 5.067075×10⁻⁴ = 107.2 mm² (COMPUTED). Writing "107.2 mm²" is more precise. |

\* The subsection letter in the final 2026 NEC was not seen in NFPA's published text. Mike Holt's *Understanding the 2026 NEC* sample shows "(C) Stranded Conductors." with a scrambled layout.

Related flag: the 2026 NEC lowers the minimum conductor size to "16 AWG copper, 14 AWG copper-clad aluminum, or 12 AWG aluminum". Sources: the NFPA SD text, IEC 2026 article (https://ieci.org/national-electrical-code-2026-changes-to-chapter-three/) and Mike Holt 2026 sample. It is tied to the new 10 A branch circuits, so any "14 AWG is the NEC minimum" copy is out of date for 2026.

NFPA URLs used:
- https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_SD_PrelimSR.pdf (Second Draft, Panel 6)
- https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf (First Draft: no first revision to 310.3(C) or to Chapter 9 Tables 8/9 in the Panel 6 content)

---

## 7. Computed AWG table (CSV) and comparison with HB100

**Method (COMPUTED):**
- d(n) = 0.005 in × 92^((36 − n)/39), with n = −3, −2, −1, 0 for 0000, 000, 00, 0. 50-digit Decimal arithmetic.
- Area in cmil = d(mils)².
- mm² = cmil × π/4 × 0.0254².
- R20 = **10.371 Ω·cmil/ft** (HB100 IACS value, sec. 1b) ÷ cmil × 1000.

Two bases are reported:
- **EXACT:** the unrounded geometric diameter.
- **HB100 method:** diameter rounded to 0.1 mil, which is the HB100 p. 1 rule. Area comes from the rounded diameter, and R is rounded to 4 s.f. for gages 10 and larger and 3 s.f. for gages 11 and smaller.

**CSV columns:**
- awg
- diameter_in (4 dp), diameter_mils_exact, diameter_mils_rounded_HB100
- diameter_mm_exact (3 dp), diameter_mm_from_rounded_mils
- area_cmil_exact, area_cmil_from_rounded_d, area_kcmil_exact
- area_mm2_exact_4sf, area_mm2_exact_3sf
- R20_cu_ohm_per_kft_exact, R20_cu_ohm_per_kft_HB100_method, R20_cu_ohm_per_km_exact
- HB100_T5_ohm_per_kft, pct_diff_exact_vs_HB100, pct_diff_HB100method_vs_HB100
- lb_per_kft_computed_8p89, HB100_T5_lb_per_kft
- R20_al_EC0_ohm_per_kft, R20_al_ECH19_ohm_per_kft

**Results:**
- **HB100 method vs HB100 Table 5:** 43 of 44 resistance values match exactly. The exception is 9 AWG: 0.7924 computed vs 0.7925 printed, a −0.01 % difference. With ρ = 10.37122 (the exact 1/58 Ω·mm²/m converted), all 44 match. HB100 evidently computed with the unrounded constant. All 44 weights computed at 8.89 g/cm³ match the printed values.
- **EXACT vs HB100 Table 5, rows differing by more than 0.5 %.** All of these come from HB100's 0.1-mil diameter rounding, not from errors:

| AWG | Exact R20 (Ω/1000 ft) | HB100 | Diff |
|---|---|---|---|
| 20 | 10.152 | 10.1 | +0.52 % |
| 28 | 64.897 | 65.3 | −0.62 % |
| 29 | 81.834 | 81.2 | +0.78 % |
| 30 | 103.19 | 104 | −0.78 % |
| 31 | 130.12 | 131 | −0.67 % |
| 32 | 164.08 | 162 | +1.28 % |
| 35 | 328.98 | 331 | −0.61 % |
| 37 | 523.10 | 512 | +2.17 % |
| 38 | 659.62 | 648 | +1.79 % |
| 39 | 831.77 | 847 | −1.80 % |
| 40 | 1048.8 | 1080 | −2.89 % |

- Every other row (0000–19, 21–27, 33, 34, 36) differs by 0.45 % or less.
- **Implication for the site:** pick one basis and say which. The HB100/B258 rounded-diameter basis matches the primary table and NEC practice. Mixing exact areas with HB100 resistances creates differences of up to 2.9 % at 37–40 AWG.
- Diameter in mm differs between bases by at most 0.001 mm. Example: 12 AWG is 2.053 mm exact and 2.052 mm from 80.8 mils × 0.0254.
- 32 AWG lies close to a rounding boundary: exact 7.9503 mils, rounded to 8.0 as HB100 prints. No ambiguity.
- Other constants (COMPUTED): IACS 1/58 Ω·mm²/m = 10.37122 Ω·cmil/ft. The step ratio 92^(1/39) = 1.1229322.

---

## Open gaps
1. **NEC 2023/2026 Table 8 and Table 9 values are not verified in an authorized source.**
   - UpCodes was blocked; NFPA free access needs a login.
   - The WebSearch cap was hit before the Southwire, Cerrowire, Burndy and General Cable catalogs were checked.
   - The only values seen are NEC 2017 figures in an individually licensed copy, which cannot be cited.
   - Coated-copper columns and most Table 9 rows (14, 8–1, 2/0, 3/0, 250–500 kcmil) were not extracted.
2. **HB109 per-AWG rows are unreadable** (OCR garbled; extracted text stops at Table 9). Aluminum per-AWG values are COMPUTED only.
3. **Paywalled ASTM content:** the B258 rounding rule and the B8 Class B strand counts and stranding increments. The 2 % stranding increment used in 4d is an unverified assumption.
4. **IEC 60228:2023 Class 2 sizes above 1600 mm² (to 3500) not seen.** Table 4 is not in the sample.
5. **EC aluminum = alloy 1350 equivalence not sourced.**
6. **Final 2026 NEC subsection number for the stranded rule** (310.5(C)?) not confirmed from NFPA's published text.
7. **HB100 details:**
   - The 19 AWG cmil OCR anomaly (1200 vs 1290) needs a glance at the scan image.
   - The page numbers for the IACS section are approximate (p. 2–4).
   - The metric Table 10 (p. 23) was not readable.
