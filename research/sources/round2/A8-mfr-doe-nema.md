# A8: manufacturer, DOE (10 CFR 430.32) and NEMA receptacle verification

Agent A8 · retrieval date for every row: **2026-10-20** · WebSearch used: **18 of 18** (cap reached)

**Status legend.** This brief covers manufacturer documents, the CFR and NEMA configurations, not NEC text, so the NEC edition keys do not apply. I use:
- **VERIFIED (mfr)**: seen in the text of the manufacturer's document fetched in this run.
- **VERIFIED (CFR)**: seen in the eCFR text fetched in this run.
- **UNVERIFIED**: not seen, ambiguous, or the extracted text looks wrong.
- **CONFLICTING**: two primaries disagree; both are given.

**Method caveat.** WebFetch passes the text through a summarizer that refuses quotes over 125 characters. Raw lines were therefore requested as short consecutive quotes. Every table was pulled at least twice. "Pull 1" and "pull 2" below are separate WebFetch calls unless stated otherwise.

---

## Status matrix

| # | Target | Result | Status |
|---|---|---|---|
| 1a | Carrier 26SCA5 (R-454B) 1.5–5 t, 208/230-1: MCA and MOCP | 7 sizes, clean; MCA = 1.25×RLA+FLA holds on every row | **VERIFIED (mfr)**. MOCP for sizes 42 and 48 is **CONFLICTING** with Carrier's coastal sibling 26SCA5C-01PD |
| 1b | Amana ALXS3N (R-32, Goodman/Daikin family) 1.5–5 t | 7 sizes, clean; 7 values per line for 7 columns | **VERIFIED (mfr)** |
| 1c | Trane / American Standard A5AC4 (RunTru / Ameristar, R-454B) | 12 variants; 24 MCA/MOCP cells: 6 ambiguous because of merged cells, 2 fail the QA check | **PARTIAL**: 16 VERIFIED, 8 UNVERIFIED |
| 1d | Rheem/Ruud, Lennox, York | Search surfaced only distributor-hosted copies | **UNVERIFIED** (not attempted on non-official hosts) |
| 2 | Electric dryer electrical requirements | Whirlpool W10267633A (11/09) and GE 31-16135 / 31-16680 / DBLR333EE spec | **VERIFIED (mfr)**: 30 A circuit, 120/240 or 120/208 V, 3- or 4-wire, 10 AWG copper. NEMA 14-30R/10-30R named only by Whirlpool |
| 3 | Electric range electrical requirements | Whirlpool W10403811C (04/17/2017) and W10575959A (05/06/2016), both retailer-hosted copies; Frigidaire P/N 318201707 Rev. A (official host) | **VERIFIED (mfr)**: 40 or 50 A by kW (Whirlpool table); 40 A cord kit on a 14-50R (Frigidaire) |
| 4 | Franklin AIM 2026 cable tables (pp. 49–52) and fuse table (p. 57) | Nebraska copy's extracted text ends at char 76,879 (p. 40). Offset read confirmed the end. No other 2026 copy found | **UNVERIFIED**. 2015 Table 11/11A remains the only verified edition |
| 5 | 10 CFR 430.32(c)(5)–(6) SEER2/EER2/HSPF2 | eCFR subpart C page (current as of 10/02/2026). Two pulls match each other and DOE's 2023 CAC Standards FAQ (Oct 5, 2022) | **VERIFIED (CFR)** |
| 6 | NEMA configurations (10) | 9 of 10 via Hubbell/Bryant/Leviton pages and spec sheets | **VERIFIED (mfr)**: TT-30R, 5-15R, 5-20R, 6-20R, 6-50R, 10-30R, 10-50R, 14-30R, 14-50R. **UNVERIFIED**: 6-30R (chart grid only). NEMA WD 6 edition and any free NEMA chart: not checked |

---

## 1. Air conditioners: MCA and MOCP (manufacturer product data)

### 1a. Carrier 26SCA5 Comfort™ Series single-stage AC, Puron Advance™ (R-454B)

- **Document:** "Comfort™ Series Single-Stage Air Conditioner with Puron Advance™ Refrigerant"
- **Number and edition:** Catalog No. 26SCA5-02PD. Footer: " ©2025 Carrier. All rights reserved. Edition Date: 06/25 7Catalog No: 26SCA5-02PD" / "Replaces:26SCA5-01PD". The Electrical Data table is on the page with footer "7".
- **URL:** https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf
- **Notice:** "©2025 Carrier. All rights reserved."
- **Size lines:** "18 = 18,000 BTUH (1.5 Tons)", "24 = 24,000 BTUH (2 Tons)", "30 = 30,000 BTUH (2.5 Tons)", "36 = 36,000 BTUH (3 Tons)", "42 = 42,000 BTUH (3.5 Tons)", "48 = 48,000 BTUH (4 Tons)", "60 = 60,000 BTUH (5 Tons)"

Raw extracted lines (pull 2, identical to the raw block in pull 1):
```
Electrical Data
UNIT SIZE V/PH
OPER VOLTS*
*.Permissible limits of the voltage range at which the unit will operate satisfactorily
COMPR FAN
MCA
MAX FUSE† or
CKT BRK
AMPS
†.Time-Delay fuse.
MAX MIN LRA RLA FLA
18
208/230/1 253 197
41.5 8.3 0.5 10.9 15
24 60.2 10.3 0.7 13.6 20
30 75.6 12.7 0.6 16.5 25
36 75.0 13.5 0.7 17.6 30
42 123.0 17.3 1.05 22.7 35
48 126.0 22.4 1.05 29.1 40
60 157.0 23.7 1.52 31.1 50
```
Notes under the table (pull 1): "NOTE:Control circuit is 24V on all units and requires external power source. Copper wire must be used from service disconnect to unit." / "All motors/compressors contain internal overload protection."

| Size | Tons | V/Ph | LRA | RLA | Fan FLA | MCA | Max fuse or ckt brk (A) |
|---|---|---|---|---|---|---|---|
| 18 | 1.5 | 208/230/1 | 41.5 | 8.3 | 0.5 | 10.9 | 15 |
| 24 | 2 | 208/230/1 | 60.2 | 10.3 | 0.7 | 13.6 | 20 |
| 30 | 2.5 | 208/230/1 | 75.6 | 12.7 | 0.6 | 16.5 | 25 |
| 36 | 3 | 208/230/1 | 75.0 | 13.5 | 0.7 | 17.6 | 30 |
| 42 | 3.5 | 208/230/1 | 123.0 | 17.3 | 1.05 | 22.7 | 35 *(CONFLICTING, see below)* |
| 48 | 4 | 208/230/1 | 126.0 | 22.4 | 1.05 | 29.1 | 40 *(CONFLICTING, see below)* |
| 60 | 5 | 208/230/1 | 157.0 | 23.7 | 1.52 | 31.1 | 50 |

- **Pull 1 vs pull 2:** match on every cell.
- **Internal QA** (python3 -I; not used to change values): printed MCA equals 1.25×RLA + FLA within rounding on all 7 rows. This supports the column alignment.
- **Cross-check:** Carrier's coastal sibling, "Comfort™ Series Single-Stage Air Conditioner / For Coastal Applications / with Puron Advance™ Refrigerant / 1.5 To 5 Tons", Catalog No: 26SCA5C-01PD, "Replaces:New", "Edition Date: 08/24", "© 2024 Carrier. All rights reserved."
  - URL: https://www.shareddocs.com/hvac/docs/1009/Public/02/26SCA5C-01PD.pdf
  - Its raw lines are identical for V/PH, volts, LRA, RLA, FLA and MCA on all sizes.
  - Its MOCP line differs at two sizes: "42 123.0 17.3 1.05 22.7 40.0" and "48 126.0 22.4 1.05 29.1 50.0". The other sizes match (15.0, 20.0, 25.0, 30.0, 50.0).
  - **Result: MOCP for 3.5 t and 4 t is CONFLICTING** (35/40 in 26SCA5-02PD, 06/25, vs 40/50 in 26SCA5C-01PD, 08/24). The newer standard document is 26SCA5-02PD, but neither document explains the difference.

### 1b. Amana ALXS3N (R-32 split-system air conditioner)

- **Document:** "Energy-Efficient R-32 Split System Air Conditioner"
- **Number and revision:** SS-ALXS3N-R32, dated 04/25 ("Superseded 02/25")
- **Host:** apps.goodmanmfg.com. This is Goodman's own host, a different path from the robots-blocked goodmanmfg.com/docs.
- **URL:** https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf
- **Notice** (summarizer's rendering): states that "Amana® is a registered trademark of Maytag Corporation or its related companies", used under license, and "All rights reserved." No © year.
- **Type:** the nomenclature gives "X" = condenser and "Z" = heat pump, so this is an air conditioner.

Raw extracted lines (pull 2):
```
ALXS3NN | 1810A* | ALXS3NN | N2410A* | ALXS3NN | N3010A* | ALXS3NN | N3610A* | ALXS3NN | N4210A* | ALXS3NN | N4810A* | ALXS3NN | N6010A*
RLA 8.2 8.2 11.2 13.4 14.4 19.4 23.9
LRA 41.2 41.2 52.5 83.3 112.2 127.7 148.0
Condenser Fan Motor
FLA 0.70 0.70 0.70 0.70 1.4 1.4 1.3
Voltage-Phase 208/230-1 208/230-1 208/230-1 208/230-1 208/230-1 208/230-1 208/230-1
Minimum Circuit Ampacity 4 10.9 10.9 14.7 17.5 19.4 25.6 31.1
Max. Overcurrent Protection 5 15.0 15.0 25.0 30.0 30.0 45.0 50.0
```
- The "4" and "5" after the row labels are footnote markers.
- Footnote 4: "Wire size should be determined in accordance with National Electrical Codes"
- Footnote 5: "Must use time-delay fuses or HACR-type circuit breakers of the same size as noted."

| Model (as summarized in pull 1) | Tons | Voltage | RLA | LRA | FLA | MCA | MOCP |
|---|---|---|---|---|---|---|---|
| ALXS3NN1810A* | 1.5 | 208/230-1 | 8.2 | 41.2 | 0.70 | 10.9 | 15.0 |
| ALXS3NN2410A* | 2 | 208/230-1 | 8.2 | 41.2 | 0.70 | 10.9 | 15.0 |
| ALXS3NN3010A* | 2.5 | 208/230-1 | 11.2 | 52.5 | 0.70 | 14.7 | 25.0 |
| ALXS3NN3610A* | 3 | 208/230-1 | 13.4 | 83.3 | 0.70 | 17.5 | 30.0 |
| ALXS3NN4210A* | 3.5 | 208/230-1 | 14.4 | 112.2 | 1.4 | 19.4 | 30.0 |
| ALXS3NN4810A* | 4 | 208/230-1 | 19.4 | 127.7 | 1.4 | 25.6 | 45.0 |
| ALXS3NN6010A* | 5 | 208/230-1 | 23.9 | 148.0 | 1.3 | 31.1 | 50.0 |

- **Pull 1 vs pull 2:** match. The 1.5 t and 2 t columns are identical in the raw text (it is not a duplication by the tool).
- **QA:** MCA = 1.25×RLA + FLA holds on all 7 columns.
- **Two things need a visual check:**
  - The raw header splits each model as "ALXS3NN" + "N2410A*", so the exact model strings are not certain.
  - "60 Hz" comes from the nomenclature, not from the table.

### 1c. Trane / American Standard A5AC4 ("RunTru by Trane / Ameristar by American Standard", R-454B)

- **Document:** "Product and Submittal Data, Split System Air Conditioner"
- **Number and revision:** ODR-PSD031B-EN, September 2025 (file name 09202025). Supersedes ODR-PSD031A-EN (June 2025). Footer: "©2025 ODR-PSD031B-EN".
- **URL:** https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf
- **Models:** A5AC4018A1000A, A5AC4024A1000A, A5AC4030A1000A/B, A5AC4036A1000A/B, A5AC4042A1000A/B, A5AC4048A1000A/B, A5AC4060A1000A/B. Tonnage is inferred from the capacity code (018 = 18,000 Btu/h).

Raw extracted lines (pull 2; identical to pull 1):
```
Table 1
Outdoor Unit (a) (b) A5AC4018A1000 A5AC4024A1000 A5AC4030A1000 A5AC4036A1000
14th Digit of the Model Number A A A A A B
Power Conns. – V/Ph/Hz (c) 208/230/1/60 208/230/1/60 208/230/1/60 208/230/1/60
Min. BRCH. CIR. Ampacity 9 14 15 17 18
BR. CIR. PROT. RTG. – Max.
(Amps) 20 20 25 30
R.L. Amps (d) - L.R. Amps 6.9 - 45 10.9 - 60 12.5 - 67 12.7 - 76 13.5 - 75 13.5 - 83
F.L. Amps 0.77 0.71 0.77 0.77
Table 2
Outdoor Unit (a) (b) A5AC4042A1000 A5AC4048A1000 A5AC4060A1000
14th Digit of the Model Number A B A B A B
Power Conns. – V/Ph/Hz (c) 208/230/1/60 208/230/1/60 208/230/1/60
Min. BRCH. CIR. Ampacity 21 23 23 25 28 30
BR. CIR. PROT. RTG. – Max.
(Amps) 30 40 35 45 50
R.L. Amps (d) - L.R. Amps 14.7 - 109 17.9 - 95.9 17.3 - 126 19.6 - 118 21.8 - 143 23.4 - 134
F.L. Amps 1.05 1.05 0.93
```
Footnotes:
- "(c) Calculated in accordance with Natl. Elec. Codes. Use only HACR circuit breakers or fuses."
- "(d) This value shown for compressor RLA on the unit nameplate and on this specification sheet is used to compute" / "minimum branch circuit ampacity and max. fuse size. The" / "value shown is the branch circuit selection current."

**How the merged cells were handled.** Table 1 has 6 variants (one each for 4018 and 4024; A and B for 4030 and 4036). Its MCA line has 5 values and its MOCP line 4. Table 2 has 6 variants; its MCA line has 6 values and its MOCP line 5. I assume merged cells can only join the A and B variants of one model. A cell is VERIFIED only if it gets the same value under every possible merge position.

| Variant | Tons | MCA | MCA status | MOCP | MOCP status |
|---|---|---|---|---|---|
| A5AC4018A1000A | 1.5 | 9 | VERIFIED | 20 | VERIFIED (QA: above 225%×RLA+FLA = 16.3; visual check advised) |
| A5AC4024A1000A | 2 | 14 | VERIFIED | 20 | VERIFIED |
| A5AC4030A1000A | 2.5 | 15 (printed) | **UNVERIFIED**: the position is certain, but 15 < 1.25×RLA 12.5 (15.6), against footnote (c); looks mis-extracted | 25 | VERIFIED |
| A5AC4030A1000B | 2.5 | 15 or 17 | UNVERIFIED (ambiguous) | 25 | VERIFIED |
| A5AC4036A1000A | 3 | 17 or 18 | UNVERIFIED (ambiguous) | 30 | VERIFIED |
| A5AC4036A1000B | 3 | 18 | VERIFIED | 30 | VERIFIED |
| A5AC4042A1000A | 3.5 | 21 (printed) | **UNVERIFIED**: 1.25×14.7 + 1.05 = 19.4; the RLA/MCA pairing may be off | 30 | VERIFIED |
| A5AC4042A1000B | 3.5 | 23 | VERIFIED | 30 or 40 | UNVERIFIED (ambiguous) |
| A5AC4048A1000A | 4 | 23 | VERIFIED | 35 or 40 | UNVERIFIED (ambiguous) |
| A5AC4048A1000B | 4 | 25 | VERIFIED | 35 or 45 | UNVERIFIED (ambiguous) |
| A5AC4060A1000A | 5 | 28 | VERIFIED | 45 or 50 | UNVERIFIED (ambiguous) |
| A5AC4060A1000B | 5 | 30 | VERIFIED | 50 | VERIFIED |

### 1d. Not obtained
- **Rheem/Ruud:** the search returned only distributor copies (gemaire, budgetheating, meiersupply, acrsupply). None was read.
- **Lennox:** no official host surfaced.
- **York/JCI:** only supabase-hosted distributor submittals for 7.5–15-ton commercial units.
- **Heat-pump MCA/MOCP:** not collected.

**Cross-brand takeaway** (verified cells only): at 2 tons, MCA is 10.9 (Amana), 13.6 (Carrier) and 14 (Trane), and MOCP is 15–20 A. MCA and MOCP are model-specific, so a generic tonnage → amps table is not supported by any primary read.

---

## 2. Electric dryers: installation-instruction electrical requirements

### 2a. Whirlpool, "ELECTRIC DRYER INSTALLATION INSTRUCTIONS (U.S.A. ONLY)", W10267633A

- **Date:** 11/09
- **Notice:** "© 2009 Whirlpool Corporation. All rights reserved."
- **Official host:** https://www.whirlpool.com/content/dam/global/documents/200912/installation-instructions-W10267633-RevA.pdf
- **Pages:** about pp. 4–9. Page markers are out of order in the extracted text, so treat page numbers as approximate.
- Pull 1 and pull 2 agree.

Raw quotes (pull 2):
1. "To supply the required 3 or 4 wire, single phase, 120/240 volt, 60 Hz., AC only" / "electrical supply (or 3 or 4 wire, 120/208 volt" / "electrical supply, if specified on the serial/rating plate) on" / "a separate 30-amp circuit, fused on both sides of the line."
2. Pull 1: "Connect to an individual branch circuit. Do not have a fuse in the neutral or grounding circuit." and "A time-delay fuse or circuit breaker is recommended."
3. "The National Electrical Code requires a 4-wire power supply" / "connection for homes built after 1996, dryer circuits involved in" / "remodeling after 1996, and all mobile home installations." *(This is the manufacturer's statement about the NEC, not NEC text.)*
4. "A UL listed 30-amp power supply cord, rated 120/240 volt" / "minimum. The cord should be type SRD or SRDT and be at least" … "(1.22 m) long, must have four 10-gauge copper" / "wires and match a 4-wire receptacle of NEMA Type 14-30R."
5. "The 3-wire power supply cord, at least 4 ft" / "(1.22 m) long, must have three 10-gauge copper wires and match a 3-wire receptacle of NEMA" / "Type 10-30R."
6. Direct wire: "10-gauge solid copper wire (do not use aluminum) at least" (pull 1 continues: "5 ft. (1.52 m) long"). Pull 1 also has: "Flexible armored cable or nonmetallic sheathed copper cable (with ground wire), protected with flexible" / "metallic conduit. All current-carrying wires must be insulated."
7. "IMPORTANT: A 4-wire connection is required for mobile homes and" / "where local codes do not permit use of 3-wire connections."
8. Table labels: "4-wire (recommended)", "3-wire (if 4-wire is not available)", "(NEMA Type 14-30R)", "(NEMA type 10-30R)", "120/240-volt", "30-amp, dryer"

### 2b. GE, "Installation Instructions, Electric Dryer", Pub # 31-16135 / 500A187P054, revision "2-01"

- **Official host:** https://products-salsify.geappliances.com/image/upload/s--jp9uW82b--/a0c420af37ccb28b86f8c8e4a2d7f65cba8fe294.pdf
- **Notice:** no date or copyright line in the extracted text
- **Pages:** about pp. 1–3
- **Quotes:**
  - "This dryer must be connected to an individual branch circuit,"
  - "A four or three-wire, single phase, 120/240V or 120/208V, 60Hz," / "30 amp circuit is required."
  - "UL RATED 120/240V, 30A" "WITH 3 OR 4 PRONGS."
  - "4 #10 AWG MINIMUM COPPER CONDUCTORS OR 120/240V 30A POWER"
  - "COVER 3 #10 AWG MINIMUM COPPER"
  - "IDENTIFY THE PLUG TYPE AS PER THE HOUSE RECEPTACLE BEFORE PURCHASING LINE CORD."
  - "in accordance with the NATIONAL ELECTRICAL CODE, ANSI/NFPA NO. 70."
  - "Grounding through the neutral is prohibited for the new branch-circuit installations, mobile homes,"
  - "SInce January 1,1996, the National Electric code requires" / "that the new constructions utilize a 4-wire connection to"
- **Gap:** no NEMA receptacle type is named.

### 2c. GE, "Installation Instructions, Electric Dryer", 234D1582P001 31-16680, footer "03-12 GE"

- **Official host:** https://products-salsify.geappliances.com/image/upload/s--cnAzJwyC--/f936177ad8fecd7c9fad36fa73e6039662884118.pdf
- **Notice:** none captured
- **The circuit-amperage line was illegible in the extraction: UNVERIFIED for this document.** Some passages were "decoded" by the summarizer and are not used.
- **Verbatim (not decoded):**
  - "4 #10 AWG MINIMUM COPPER CONDUCTORS OR 120/240V 30A POWER SUPPLY CORD KIT MARKED FOR USE WITH DRYERS"
  - "3 #10 AWG MINIMUM COPPER CONDUCTORS OR 120/240V 30A POWER SUPPLY CORD KIT MARKED FOR USE WITH DRYERS"
  - "UL RATED 120/240V,30A WITH 3 OR 4 PRONGS."
  - "Since January 1,1996, the National Electric code requires that the new constructions utilize a 4-wire connection"

### 2d. GE DBLR333EE spec sheet ("Specification Created 2/04", doc 370278)

- **Official host:** https://products-salsify.geappliances.com/image/upload/s--UoRmjZxw--/8bf0ae6df943bf071c7225c4a8acbd9b33f01de4.pdf
- **Quotes:**
  - "An individual, properly-grounded branch circuit, protected by a 30-amp circuit breaker"
  - "Electric Dryer Rating: 240V, 5600W, 24A, 60 Hz"
  - "208V, 4400W, 22A, 60 Hz"

---

## 3. Electric ranges: installation electrical requirements

### 3a. Whirlpool 30" freestanding electric range, Ref. W10403811C, dated 04/17/2017

- **Type:** dimension and installation-planning guide
- **Host:** retailer copy of the manufacturer document at https://pdf.lowes.com/productdocuments/bec1ae1e-5c73-4878-bf30-b1d7e6dacd5c/61917695.pdf
- **Notice:** none in the text
- **Why a retailer copy:** three searches surfaced no whirlpool.com range PDF.
- **Pull 2 raw lines:**
```
Range Rating*
Specified Rating
of Power Supply
Cord Kit and
Circuit Protection
120/240 Volts 120/208 Volts Amps
8.8 – 16.5 KW 7.8 – 12.5 KW 40 or 50 **
16.6 – 22.5 KW 12.6 – 18.5 KW 50
* The NEC calculated load is less than the total connected load listed on
the model/serial rating plate.
** If connecting to a 50-amp circuit, use a 50-amp rated cord with a kit.
For 50-amp rated cord kits, use kits that specify use with a nominal
13/8" (34.9 mm) diameter connection opening.
```
- **Lines before the table:** "the cabinet. Use a 3-wire, UL Listed. 40- or 50-amp power supply " / "cord (pigtail) (see following Range Rating chart). If local codes do not " / "permit ground through the neutral, use a 4-wire power supply cord " / "rated at 250 volts, 40 or 50 amps and investigated for use with ranges."
- **After the table:** "■ A circuit breaker is recommended."
- **Cross-check:** Whirlpool Ref. W10575959A, 05/06/2016, models WGE555S0B, WGE755C0B, WGI925C0B, WGE745C0F. Retailer copy at https://images.thdstatic.com/catalog/pdfImages/83/83e89524-eaeb-47f6-bae5-48567e2a7801.pdf
  - Same table: 8.8–16.5 kW / 7.8–12.5 kW → "40 or 50"; 16.6–22.5 kW / 12.6–18.5 kW → "50".
  - Same cord text: "Use a 3-wire, UL listed, 40- or 50- amp power supply cord (pigtail)"; "cord rated at 250 volts, 40- or 50-amps".
  - **Match.** Neither Whirlpool guide names a NEMA receptacle.

### 3b. Frigidaire, "40" ELECTRIC RANGE INSTALLATION INSTRUCTIONS", "Printed in Canada P/N 318201707 (1201) Rev. A"

- **Official host:** Frigidaire's asset library, https://frigidaire.bynder.com/m/1dd4af3d9e5b8bf4/original/318201707-pdf.pdf
- No brand name appears in the extracted text. No © or calendar date; "(1201)" is a print code.
- Pull 1 and pull 2 agree.
- **p. 3 quotes:**
  - "Only a power supply cord kit rated at 125/250 volts" / "minimum, 40 amperes and marked for use with ranges shall be used. Cord must have 3 conductors (see Figures"
  - "Mobile homes, new installations, recreational vehicles, or" / "areas where local codes do not permit grounding through" / "neutral, a 4 conductor power supply cord kit rated at" / "125/250 volts minimum, 40 amperes and marked for use"
  - "When a 4-wire receptacle of NEMA Type 14-50R is used" / "(see Figure 1), a matching U.L.-listed, 4-wire, 250 volt," / "40 ampere range power supply cord (pigtail) must be" / "used. This cord contains 4 copper conductors with ring"
  - Table: "The minimum conductor sizes for the copper 4-wire" / "40 ampere circuit" / "2 No. 8 conductors" / "1 No. 10 white neutral" / "1 No. 8 green ground"
- **p. 4:** "Wire sizes (copper wire only)"
- **p. 2:** "with the National Electrical Code ANSI/NFPA No. 70—latest edition."
- **Gap:** no 10-50R or 50 A text.

---

## 4. Franklin Electric AIM Manual 2026 (60 Hz): cable and fuse tables

- **URL:** https://dwee.nebraska.gov/sites/default/files/water/2026_60Hz_AIM_Manual_Submersible_Systems.pdf
- **WebFetch with offset 76000:** "This excerpt covers offsets 76000 to 76879 of the page." The text ends with "Motor Specifications 40" (p. 40 footer), after the 214504/214505/214507/214508 three-wire motor rows. Those rows match the earlier run's p. 40 data.
- The extracted text of this PDF is capped at 76,879 characters, so pp. 49–52 (cable selection) and p. 57 (fuses and breakers) cannot be reached through WebFetch on any full copy.
- **Search 18** (Franklin 2026, cable calculator, SubData) returned only the same Nebraska copy, the 2015 metatek mirror, the 2007 NDEE copy, a forum thread and retailers. No SubData M1312 copy and no Franklin cable-calculator page surfaced.
- **Status:** 2026 values are **UNVERIFIED**. Whether they equal the 2015 Table 11/11A values (230 V 1 hp, 60 °C: 250/400/630/990/1540 ft for 14/12/10/8/6 AWG) is **still open**. The 2015 values themselves stay as verified in research/equipment.md (VERIFIED-other-edition: 2015 and 2007 agree).

---

## 5. DOE: 10 CFR 430.32(c)(5) and (c)(6)

- **Primary:** eCFR, Title 10 Part 430 Subpart C page, https://www.ecfr.gov/current/title-10/chapter-II/subchapter-D/part-430/subpart-C
  - "up to date as of 10/02/2026"; Title 10 last amended 10/01/2026.
  - The summarizer reports that the eCFR calls itself "authoritative but unofficial", with the official CFR on govinfo.gov.
  - No copyright notice was captured.
  - The section-430.32 URL itself was blocked (see log), so the subpart page, which contains §430.32, was used.
- **Pull 1** (summary table) and **pull 2** (raw lines) match.
- **Independent cross-check:** DOE guidance "Issued: October 5, 2022", "Guidance Version: Final", which states the standards are "codified in the Code of Federal Regulations at 10 CFR 430.32(c)(5) and (6)". URL: https://www1.eere.energy.gov/buildings/appliance_standards/pdfs/2023_CAC_Standards_FAQ_10-5-2022_Final.pdf. **Every value matches.**

Raw lines (pull 2):
```
(5) Central air conditioners and central air conditioning heat pumps manufactured on or after January 1, 2023, must have
Product class | Seasonal energy efficiency ratio 2 (SEER2) | Heating seasonal performance factor 2 (HSPF2)
(i)(A) Split systems—air conditioners with a certified cooling capacity less than 45,000 Btu/hr | 13.4 |
(i)(B) Split systems—air conditioners with a certified cooling capacity equal to or greater than 45,000 Btu/hr | 13.4 |
(ii) Split systems—heat pumps | 14.3 | 7.5
(iii) Single-package units—air conditioners | 13.4 |
(iv) Single-package units—heat pumps | 13.4 | 6.7
(v) Small-duct, high-velocity systems | 12 | 6.1
(vi)(A) Space-constrained products—air conditioners | 11.7 |
(vi)(B) Space-constrained products—heat pumps | 11.9 | 6.3

(i) In addition to meeting the applicable requirements in paragraph (c)(5) of this section, products in product classes
Product class | Southeast * | Southwest ** |
SEER2 | SEER2 | EER2 ***
(i)(A) Split-systems—air conditioners with a certified cooling capacity less than 45,000 Btu/hr | 14.3 | 14.3 | 11.7/9.8 †
(i)(B) Split-systems—air conditioners with a certified cooling capacity equal to or greater than 45,000 Btu/hr | 13.8 | 13.8 | 11.2/9.8 ††
(iii) Single-package units—air conditioners | | | 10.6
* "Southeast" includes the States of Alabama, Arkansas, Delaware, Florida, Georgia, Hawaii, Kentucky, Louisiana,
Maryland, Mississippi, North Carolina, Oklahoma, Puerto Rico, South Carolina, Tennessee, Texas, Virginia,
the District of Columbia, and the U.S. Territories.
** "Southwest" includes the States of Arizona, California, Nevada, and New Mexico.
*** EER refers to the energy efficiency ratio at a standard rating of 95 °F dry bulb outdoor temperature.
† The 11.7 EER2 standard applies to products with a certified SEER2 less than 15.2.
The 9.8 EER2 standard applies to products with a certified SEER2 greater than or equal to 15.2.
†† The 11.2 EER2 standard applies to products with a certified SEER2 less than 15.2.
The 9.8 EER2 standard applies to products with a certified SEER2 greater than or equal to 15.2.
```

DOE FAQ raw lines (cross-check):
- "Split-system air conditioners 13.4 -"; "Split-system heat pumps 14.3 7.5"; "Single-package air conditioners 13.4 -"; "Single-package heat pumps 13.4 6.7"; "Small-duct, high-velocity systems 12 6.1"; "Space-constrained air conditioners 11.7 -"; "Space-constrained heat pumps 11.9 6.3"
- Regional: "North Southeast Southwest" / "Seasonal energy efficiency ratio 2 (SEER2) 13.4 14.3 14.3" / "Energy efficiency ratio 2 (EER2) - - 11.7/9.8*" (<45k) / "Seasonal energy efficiency ratio 2 (SEER2) 13.4 13.8 13.8" / "Energy efficiency ratio 2 (EER2) - - 11.2/9.8**" (≥45k) / "Energy efficiency ratio 2 (EER2) - - 10.6" (single-package AC)
- "units installed on or after January 1, 2023, must meet the new standards." / "There are no delays or special exemptions from this deadline."

DOE regional guidance ("Issued: December 16, 2021", https://www.energy.gov/sites/default/files/2022-06/cac_regional_guidance6-08-2022.pdf) quotes (c)(6): "Beginning January 1, 2023, only basic models that meet the amended regional standards (SEER 2, EER2), as applicable, may be installed in the SE or SW region."

Notes:
- "North" is DOE's FAQ label. The CFR has no "North" column; outside the SE and SW only the national (c)(5) values apply.
- EER2 minimums exist only for the Southwest.
- HSPF2 minimums are national only.
- The brief's "SEER2 ≥ 16.0" EER2 threshold is **not** in the text. The threshold is **certified SEER2 15.2**.

---

## 6. NEMA receptacle configurations

**NEMA WD 6 itself:** not fetched. The prior run got a 429 on nema.org, and the brief said not to retry; my search budget ran out before I could look for a free NEMA chart. Hubbell product pages state "NEMA® WD-6 Compliant" without an edition or year.

| Config | Rating text seen | Pole/wire text seen | Source(s) | Status |
|---|---|---|---|---|
| TT-30R | "Current Rating 30 A", "Voltage Rating 125 V" | "2-Pole 3-Wire Grounding" | Hubbell HBLTT30R spec sheet "WDK_CA-HBLTT30R-SPEC-EN \| REV 6/2026", "A Hubbell brand © 2026 Hubbell Incorporated. All rights reserved" (https://hubbellcdn.com/specsheet/WDK_CA-HBLTT30R-SPEC-EN.pdf), plus product page "Receptacle, RTP, Industrial, 2P 3W Grounding, 30A, 125V" (https://www.hubbell.com/wiringdevice-kellems/en/products/straight-blade-devices-receptacles-rtp-industrial-grade-2-pole-3-wire-grounding-30a-125v-tt-30r-black-single-pack/p/2624140) | VERIFIED (mfr), 2 docs agree |
| 5-15R | "Amperage Rating 15 A", "Voltage Rating 125 VAC" | "2-Pole", "3-Wire", "Self Grounding" | Hubbell HBL5262 (https://www.hubbell.com/hubbellcanada/en/products/straight-blade-devices-receptacles-duplex-industrial-grade-2-pole-3-wire-grounding-15a-125v-5-15r-brown-single-pack/p/4619282), plus HBL5261I "15 A", "125 V" (https://www.hubbell.com/hubbell/en/products/p/161192). Both say "NEMA® WD-6 Compliant" | VERIFIED (mfr), 2 pages agree |
| 5-20R | "Current Rating 20 A", "Voltage Rating 125 VAC" | "Number Of Poles 2-Pole", "Number Of Wires 3-Wire", "Automatic Self-grounding" | Hubbell HBL5362R spec "WDK_MX-HBL5362R-SPEC-EN \| REV 5/2026", "© 2026 Hubbell Incorporated. All rights reserved" (https://hubbellcdn.com/specsheet/WDK_MX-HBL5362R-SPEC-EN.pdf), plus HBL5362W page (https://www.hubbell.com/hubbell/en/products/p/160684) | VERIFIED (mfr), 2 docs agree |
| 6-20R | "20 A", "250 V" | "2-Pole", "3-Wire", "Self Grounding"; title "2-Pole 3-Wire Grounding, 20A 250V, 6-20R" | Hubbell HBL5461 (https://www.hubbell.com/wiringdevice-kellems/en/products/straight-blade-devices-receptacles-single-specification-grade-2-pole-3-wire-grounding-20a-250v-6-20r-brown-single-pack/p/157392), "NEMA® WD-6 Compliant" | VERIFIED (mfr), 1 page |
| 6-30R | none explicit | Chart only: row "2 Pole / 3 Wire Grounding" with "250V 6"; header "15 Ampere 20 Ampere 30 Ampere 50 Ampere 60 Ampere"; label line "6-30R 6-30P 6-50R 6-50P". The cell-to-column link is lost in the text | Hubbell chart p. IV (below) | **UNVERIFIED** (grid association only) |
| 6-50R | "NEMA 6-50, 50A 250V 2-Pole 3-Wire G …" | 2-Pole 3-Wire, "G" terminal; chart row "2 Pole / 3 Wire Grounding" / "250V 6" | Bryant (Hubbell) catalog p. A-27 (https://hubbellcdn.com/catalogpage/BRY_A-27_CatalogPage.pdf) | VERIFIED (mfr), 1 doc plus chart |
| 10-30R | "30 A", "125/250 V" | "3-Pole", "3-Wire", "Non-Grounding" | Hubbell RR330 (https://www.hubbell.com/hubbell/en/products/tradeselect-straight-blade-devices-residential-grade-receptacles-single-30a-125250v-3-pole-3-wire-non-grounding-10-30r-surface-mount-black/p/2182954 and https://www.hubbell.com/hubbell/en/products/p/177875) | VERIFIED (mfr), 2 pages agree |
| 10-50R | "NEMA 10-50, 50A 125/250V AC 3-Pole 3-Wire W X Y …" | 3-Pole 3-Wire; "Note: *Device has no provision for a grounding conductor." (all 10-50 items starred) | Bryant A-27 | VERIFIED (mfr), 1 doc plus chart row "3 Pole / 3 Wire" / "125/250V AC 10" |
| 14-30R | "30 A", "125/250 V" | "3-Pole", "4-Wire", "3-Pole 4-Wire Grounding" | Hubbell RR430 (https://www.hubbell.com/hubbellcanada/en/products/tradeselect-straight-blade-devices-residential-grade-receptacles-single-30a-125250v-3-pole-4-wire-grounding-14-30r-surface-mount-black/p/4644088), RR430F (https://www.hubbell.com/hubbell/en/products/p/2182962), RR430WIPCN (https://www.hubbell.com/hubbell/en/products/p/177918) | VERIFIED (mfr), 3 pages agree |
| 14-50R | "Amperage : 50 A", "Max. Voltage : 125/250 Volt"; "NEMA 14-50, 50A 125/250V AC 3-Pole 4-Wire G W Y X" | "3-Pole", "4 Wire with Grounding" | Leviton 1279-S50 (https://www.leviton.com/en/products/1279-s50) and Bryant A-27 | VERIFIED (mfr), 2 manufacturers agree |

**Hubbell chart** ("Wiring Device-Kellems", "www.hubbell-wiring.comIV", no year or ©):
- **URL:** https://hubbellcdn.com/ohwassets/HCI/WiringDevice/Catalog/NEMA/NEMA_2017%20Straight%20Blade%20Devices.pdf
- **Pull 2 raw lines:** "15 Ampere 20 Ampere 30 Ampere 50 Ampere 60 Ampere"; row labels "2 Pole / 3 Wire Grounding" → "125V 5", "250V 6", "277V AC 7"; "3 Po le / 3 Wire" → "125/250V AC 10", "3Ø 250V AC 11"; "3 Po le / 4 W ir e Gr ou nd in g" → "125/250V AC 14", "3Ø 250V AC 15"
- **Configuration label lines (printed after the grid):** "5-20P5-20R5-15P5-15R", "6-30R 6-30P 6-50R 6-50P", "10-30R 10-30P 10-50R 10-50P", "14-30R 14-30P 14-50R 14-50P", "6-20R 6-20P6-15R 6-15P"
- TT-30R is not on this chart.
- **Pull 1 vs pull 2:** consistent.
- **Bryant RR335P plug page:** the title says "30A … 10-30P" but the spec fields say "10-50P" and "50 A". A-27 explains this: "Supplied with interchangeable blades for 30 or 50 amp configuration". Not used.

---

## Machine-readable

```json
{"ac_units":[
 {"brand":"Carrier","model":"26SCA5 size 18","tons":1.5,"voltage":"208/230/1","mca_a":10.9,"mocp_a":15,"doc":"Catalog No. 26SCA5-02PD","rev":"Edition Date 06/25 (replaces 26SCA5-01PD)","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Carrier","model":"26SCA5 size 24","tons":2,"voltage":"208/230/1","mca_a":13.6,"mocp_a":20,"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Carrier","model":"26SCA5 size 30","tons":2.5,"voltage":"208/230/1","mca_a":16.5,"mocp_a":25,"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Carrier","model":"26SCA5 size 36","tons":3,"voltage":"208/230/1","mca_a":17.6,"mocp_a":30,"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Carrier","model":"26SCA5 size 42","tons":3.5,"voltage":"208/230/1","mca_a":22.7,"mocp_a":35,"mocp_conflict":{"value_a":40,"doc":"26SCA5C-01PD (coastal), Edition Date 08/24","url":"https://www.shareddocs.com/hvac/docs/1009/Public/02/26SCA5C-01PD.pdf"},"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"MCA VERIFIED (mfr); MOCP CONFLICTING"},
 {"brand":"Carrier","model":"26SCA5 size 48","tons":4,"voltage":"208/230/1","mca_a":29.1,"mocp_a":40,"mocp_conflict":{"value_a":50,"doc":"26SCA5C-01PD (coastal), Edition Date 08/24","url":"https://www.shareddocs.com/hvac/docs/1009/Public/02/26SCA5C-01PD.pdf"},"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"MCA VERIFIED (mfr); MOCP CONFLICTING"},
 {"brand":"Carrier","model":"26SCA5 size 60","tons":5,"voltage":"208/230/1","mca_a":31.1,"mocp_a":50,"doc":"Catalog No. 26SCA5-02PD","rev":"06/25","url":"https://www.shareddocs.com/hvac/docs/1009/Public/08/26SCA5-02PD.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN1810A*","tons":1.5,"voltage":"208/230-1 (60 Hz per nomenclature)","mca_a":10.9,"mocp_a":15.0,"doc":"SS-ALXS3N-R32","rev":"04/25 (superseded 02/25)","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN2410A*","tons":2,"voltage":"208/230-1","mca_a":10.9,"mocp_a":15.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN3010A*","tons":2.5,"voltage":"208/230-1","mca_a":14.7,"mocp_a":25.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN3610A*","tons":3,"voltage":"208/230-1","mca_a":17.5,"mocp_a":30.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN4210A*","tons":3.5,"voltage":"208/230-1","mca_a":19.4,"mocp_a":30.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN4810A*","tons":4,"voltage":"208/230-1","mca_a":25.6,"mocp_a":45.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Amana","model":"ALXS3NN6010A*","tons":5,"voltage":"208/230-1","mca_a":31.1,"mocp_a":50.0,"doc":"SS-ALXS3N-R32","rev":"04/25","url":"https://apps.goodmanmfg.com/brochures/files/68ee7585b25f3SS-ALXS3N-R32.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Trane/American Standard (RunTru/Ameristar)","model":"A5AC4018A1000A","tons":1.5,"voltage":"208/230/1/60","mca_a":9,"mocp_a":20,"doc":"ODR-PSD031B-EN","rev":"Sep 2025 (supersedes ODR-PSD031A-EN)","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"VERIFIED (mfr); MOCP QA flag"},
 {"brand":"Trane/American Standard","model":"A5AC4024A1000A","tons":2,"voltage":"208/230/1/60","mca_a":14,"mocp_a":20,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Trane/American Standard","model":"A5AC4030A1000A","tons":2.5,"voltage":"208/230/1/60","mca_a":null,"mca_printed":15,"mocp_a":25,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA UNVERIFIED (printed value < 1.25xRLA); MOCP VERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4030A1000B","tons":2.5,"voltage":"208/230/1/60","mca_a":null,"mca_candidates":[15,17],"mocp_a":25,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA UNVERIFIED (merged cells); MOCP VERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4036A1000A","tons":3,"voltage":"208/230/1/60","mca_a":null,"mca_candidates":[17,18],"mocp_a":30,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA UNVERIFIED (merged cells); MOCP VERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4036A1000B","tons":3,"voltage":"208/230/1/60","mca_a":18,"mocp_a":30,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"VERIFIED (mfr)"},
 {"brand":"Trane/American Standard","model":"A5AC4042A1000A","tons":3.5,"voltage":"208/230/1/60","mca_a":null,"mca_printed":21,"mocp_a":30,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA UNVERIFIED (inconsistent with printed RLA); MOCP VERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4042A1000B","tons":3.5,"voltage":"208/230/1/60","mca_a":23,"mocp_a":null,"mocp_candidates":[30,40],"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA VERIFIED; MOCP UNVERIFIED (merged cells)"},
 {"brand":"Trane/American Standard","model":"A5AC4048A1000A","tons":4,"voltage":"208/230/1/60","mca_a":23,"mocp_a":null,"mocp_candidates":[35,40],"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA VERIFIED; MOCP UNVERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4048A1000B","tons":4,"voltage":"208/230/1/60","mca_a":25,"mocp_a":null,"mocp_candidates":[35,45],"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA VERIFIED; MOCP UNVERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4060A1000A","tons":5,"voltage":"208/230/1/60","mca_a":28,"mocp_a":null,"mocp_candidates":[45,50],"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"MCA VERIFIED; MOCP UNVERIFIED"},
 {"brand":"Trane/American Standard","model":"A5AC4060A1000B","tons":5,"voltage":"208/230/1/60","mca_a":30,"mocp_a":50,"doc":"ODR-PSD031B-EN","rev":"Sep 2025","url":"https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Product%20and%20Submittal%20Data/ODR-PSD031B-EN_09202025.pdf","status":"VERIFIED (mfr)"}
]}
```

```json
{"dryers":[
 {"brand":"Whirlpool","doc":"W10267633A","title":"ELECTRIC DRYER INSTALLATION INSTRUCTIONS (U.S.A. ONLY)","date":"11/09","notice":"© 2009 Whirlpool Corporation. All rights reserved.","circuit_a":30,"circuit_text":"a separate 30-amp circuit, fused on both sides of the line.","supply":"3 or 4 wire, single phase, 120/240 volt, 60 Hz AC only (or 3 or 4 wire, 120/208 volt if specified on the serial/rating plate)","receptacles":["NEMA 14-30R (4-wire)","NEMA 10-30R (3-wire)"],"cord":"UL listed 30-amp, rated 120/240 volt minimum, type SRD or SRDT, at least 4 ft; four (4-wire) or three (3-wire) 10-gauge copper wires","direct_wire":"10-gauge solid copper wire (do not use aluminum)","four_wire_statement":"The National Electrical Code requires a 4-wire power supply connection for homes built after 1996, dryer circuits involved in remodeling after 1996, and all mobile home installations.","url":"https://www.whirlpool.com/content/dam/global/documents/200912/installation-instructions-W10267633-RevA.pdf","host":"official","status":"VERIFIED (mfr)"},
 {"brand":"GE","doc":"Pub # 31-16135 / 500A187P054","rev":"2-01","circuit_a":30,"circuit_text":"This dryer must be connected to an individual branch circuit, ... A four or three-wire, single phase, 120/240V or 120/208V, 60Hz, 30 amp circuit is required.","receptacles":null,"conductors":"4 (or 3) #10 AWG minimum copper conductors or 120/240V 30A power supply cord kit","url":"https://products-salsify.geappliances.com/image/upload/s--jp9uW82b--/a0c420af37ccb28b86f8c8e4a2d7f65cba8fe294.pdf","host":"official","status":"VERIFIED (mfr)"},
 {"brand":"GE","doc":"234D1582P001 / 31-16680","rev":"03-12","circuit_a":null,"conductors":"4 #10 AWG MINIMUM COPPER CONDUCTORS OR 120/240V 30A POWER SUPPLY CORD KIT MARKED FOR USE WITH DRYERS","url":"https://products-salsify.geappliances.com/image/upload/s--cnAzJwyC--/f936177ad8fecd7c9fad36fa73e6039662884118.pdf","host":"official","status":"PARTIAL (circuit-amps line illegible)"},
 {"brand":"GE","doc":"DBLR333EE spec sheet (370278)","rev":"Specification Created 2/04","circuit_a":30,"circuit_text":"An individual, properly-grounded branch circuit, protected by a 30-amp circuit breaker","rating":"240V, 5600W, 24A, 60 Hz; 208V, 4400W, 22A, 60 Hz","url":"https://products-salsify.geappliances.com/image/upload/s--UoRmjZxw--/8bf0ae6df943bf071c7225c4a8acbd9b33f01de4.pdf","host":"official","status":"VERIFIED (mfr)"}
]}
```

```json
{"ranges":[
 {"brand":"Whirlpool","doc":"Ref. W10403811C","date":"04/17/2017","type":"30in freestanding electric range dimension/installation guide","table":[{"kw_120_240":"8.8 – 16.5","kw_120_208":"7.8 – 12.5","amps":"40 or 50"},{"kw_120_240":"16.6 – 22.5","kw_120_208":"12.6 – 18.5","amps":"50"}],"cord_3wire":"3-wire, UL Listed, 40- or 50-amp power supply cord (pigtail)","cord_4wire":"4-wire power supply cord rated at 250 volts, 40 or 50 amps and investigated for use with ranges","nema":null,"url":"https://pdf.lowes.com/productdocuments/bec1ae1e-5c73-4878-bf30-b1d7e6dacd5c/61917695.pdf","host":"retailer copy of manufacturer document","status":"VERIFIED (mfr doc; retailer-hosted)"},
 {"brand":"Whirlpool","doc":"Ref. W10575959A","date":"05/06/2016","models":["WGE555S0B","WGE755C0B","WGI925C0B","WGE745C0F"],"table":"same as W10403811C","url":"https://images.thdstatic.com/catalog/pdfImages/83/83e89524-eaeb-47f6-bae5-48567e2a7801.pdf","host":"retailer copy of manufacturer document","status":"VERIFIED (mfr doc; retailer-hosted); matches W10403811C"},
 {"brand":"Frigidaire (host frigidaire.bynder.com; brand not printed in extracted text)","doc":"P/N 318201707 Rev. A","print_code":"(1201)","title":"40\" ELECTRIC RANGE INSTALLATION INSTRUCTIONS","cord":"power supply cord kit rated at 125/250 volts minimum, 40 amperes and marked for use with ranges","nema":"14-50R with matching U.L.-listed 4-wire, 250 volt, 40 ampere range cord","min_copper_4wire_40a_circuit":{"hot":"2 No. 8","neutral":"1 No. 10 white","ground":"1 No. 8 green"},"four_wire_when":"Mobile homes, new installations, recreational vehicles, or areas where local codes do not permit grounding through neutral","url":"https://frigidaire.bynder.com/m/1dd4af3d9e5b8bf4/original/318201707-pdf.pdf","host":"official","status":"VERIFIED (mfr)"}
]}
```

```json
{"franklin_2026":{"readable":false,"rows":[],"doc":"AIM MANUAL 60 Hz Submersible Systems, 2026 Edition (Nebraska DWEE-hosted copy)","url":"https://dwee.nebraska.gov/sites/default/files/water/2026_60Hz_AIM_Manual_Submersible_Systems.pdf","reason":"WebFetch PDF text ends at character 76,879 (p. 40 footer 'Motor Specifications 40'); offset 76000 confirmed the end; pp. 49-52 and 57 unreachable","equal_to_2015":"UNVERIFIED","2015_reference":"Table 11 60C, 230 V 1 hp: 14 AWG 250, 12 AWG 400, 10 AWG 630, 8 AWG 990, 6 AWG 1540 ft (VERIFIED-other-edition 2015, research/equipment.md)"}}
```

```json
{"doe_430_32_c":[
 {"product_class":"Split-system AC, certified cooling capacity < 45,000 Btu/h","region":"National (DOE FAQ label: North)","seer2":13.4,"eer2":null,"hspf2":null,"cfr":"430.32(c)(5)(i)(A)","basis":"manufactured on or after 2023-01-01","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system AC, < 45,000 Btu/h","region":"Southeast","seer2":14.3,"eer2":null,"hspf2":null,"cfr":"430.32(c)(6)(i)(A)","basis":"installed on or after 2023-01-01","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system AC, < 45,000 Btu/h","region":"Southwest","seer2":14.3,"eer2":"11.7/9.8","eer2_if_certified_seer2_lt_15_2":11.7,"eer2_if_certified_seer2_ge_15_2":9.8,"hspf2":null,"cfr":"430.32(c)(6)(i)(A)","basis":"installed on or after 2023-01-01","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system AC, >= 45,000 Btu/h","region":"National (North)","seer2":13.4,"eer2":null,"hspf2":null,"cfr":"430.32(c)(5)(i)(B)","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system AC, >= 45,000 Btu/h","region":"Southeast","seer2":13.8,"eer2":null,"hspf2":null,"cfr":"430.32(c)(6)(i)(B)","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system AC, >= 45,000 Btu/h","region":"Southwest","seer2":13.8,"eer2":"11.2/9.8","eer2_if_certified_seer2_lt_15_2":11.2,"eer2_if_certified_seer2_ge_15_2":9.8,"hspf2":null,"cfr":"430.32(c)(6)(i)(B)","status":"VERIFIED (CFR)"},
 {"product_class":"Split-system heat pumps","region":"National (no regional standard)","seer2":14.3,"eer2":null,"hspf2":7.5,"cfr":"430.32(c)(5)(ii)","status":"VERIFIED (CFR)"},
 {"product_class":"Single-package AC","region":"National","seer2":13.4,"eer2":null,"hspf2":null,"cfr":"430.32(c)(5)(iii)","status":"VERIFIED (CFR)"},
 {"product_class":"Single-package AC","region":"Southwest (additional)","seer2":null,"eer2":10.6,"hspf2":null,"cfr":"430.32(c)(6)(i)(iii)","status":"VERIFIED (CFR)"},
 {"product_class":"Single-package heat pumps","region":"National","seer2":13.4,"eer2":null,"hspf2":6.7,"cfr":"430.32(c)(5)(iv)","status":"VERIFIED (CFR)"},
 {"product_class":"Small-duct, high-velocity systems","region":"National","seer2":12,"eer2":null,"hspf2":6.1,"cfr":"430.32(c)(5)(v)","status":"VERIFIED (CFR)"},
 {"product_class":"Space-constrained AC","region":"National","seer2":11.7,"eer2":null,"hspf2":null,"cfr":"430.32(c)(5)(vi)(A)","status":"VERIFIED (CFR)"},
 {"product_class":"Space-constrained heat pumps","region":"National","seer2":11.9,"eer2":null,"hspf2":6.3,"cfr":"430.32(c)(5)(vi)(B)","status":"VERIFIED (CFR)"}
],
"source":"eCFR Title 10 Part 430 Subpart C, up to date as of 10/02/2026, https://www.ecfr.gov/current/title-10/chapter-II/subchapter-D/part-430/subpart-C; cross-checked against DOE 2023 CAC Standards FAQ (Issued October 5, 2022)",
"regions":{"Southeast":"Alabama, Arkansas, Delaware, Florida, Georgia, Hawaii, Kentucky, Louisiana, Maryland, Mississippi, North Carolina, Oklahoma, Puerto Rico, South Carolina, Tennessee, Texas, Virginia, the District of Columbia, and the U.S. Territories","Southwest":"Arizona, California, Nevada, and New Mexico"}}
```

```json
{"nema":[
 {"config":"TT-30R","amps":30,"volts":"125","poles":2,"wires":3,"grounding":true,"source":"Hubbell HBLTT30R spec sheet WDK_CA-HBLTT30R-SPEC-EN REV 6/2026 + product page p/2624140","status":"VERIFIED (mfr)"},
 {"config":"5-15R","amps":15,"volts":"125","poles":2,"wires":3,"grounding":true,"source":"Hubbell HBL5262 (p/4619282), HBL5261I (p/161192); 'NEMA WD-6 Compliant'","status":"VERIFIED (mfr)"},
 {"config":"5-20R","amps":20,"volts":"125","poles":2,"wires":3,"grounding":true,"source":"Hubbell HBL5362R spec WDK_MX-HBL5362R-SPEC-EN REV 5/2026; HBL5362W (p/160684)","status":"VERIFIED (mfr)"},
 {"config":"6-20R","amps":20,"volts":"250","poles":2,"wires":3,"grounding":true,"source":"Hubbell HBL5461 (p/157392); 'NEMA WD-6 Compliant'","status":"VERIFIED (mfr)"},
 {"config":"6-30R","amps":null,"volts":null,"poles":null,"wires":null,"grounding":null,"source":"Hubbell NEMA straight-blade chart p. IV (grid only: row '2 Pole / 3 Wire Grounding' / '250V 6'; column association lost in text)","status":"UNVERIFIED"},
 {"config":"6-50R","amps":50,"volts":"250","poles":2,"wires":3,"grounding":true,"source":"Bryant/Hubbell catalog p. A-27: 'NEMA 6-50, 50A 250V 2-Pole 3-Wire G'","status":"VERIFIED (mfr)"},
 {"config":"10-30R","amps":30,"volts":"125/250","poles":3,"wires":3,"grounding":false,"source":"Hubbell RR330 (p/2182954, p/177875): '3-Pole 3-Wire Non-Grounding'","status":"VERIFIED (mfr)"},
 {"config":"10-50R","amps":50,"volts":"125/250","poles":3,"wires":3,"grounding":false,"source":"Bryant/Hubbell p. A-27: 'NEMA 10-50, 50A 125/250V AC 3-Pole 3-Wire'; '*Device has no provision for a grounding conductor.'","status":"VERIFIED (mfr)"},
 {"config":"14-30R","amps":30,"volts":"125/250","poles":3,"wires":4,"grounding":true,"source":"Hubbell RR430 (p/4644088), RR430F (p/2182962), RR430WIPCN (p/177918)","status":"VERIFIED (mfr)"},
 {"config":"14-50R","amps":50,"volts":"125/250","poles":3,"wires":4,"grounding":true,"source":"Leviton 1279-S50; Bryant/Hubbell p. A-27","status":"VERIFIED (mfr)"}
]}
```

---

## Blocked or failed log

| URL / item | Result |
|---|---|
| https://www.ecfr.gov/current/title-10/chapter-II/subchapter-D/part-430/subpart-C/section-430.32 | PROVENANCE_REQUIRED: the permission request timed out ("Do not retry"). The subpart C page, returned by a search, was used instead. |
| eCFR subpart C, offset 100000 | The text stops in 430.32(h)(3), so §430.32's bracketed FR amendment citation was not captured. |
| https://dwee.nebraska.gov/…/2026_60Hz_AIM_Manual_Submersible_Systems.pdf | Extraction capped at 76,879 chars (p. 40). Offset read confirmed it. pp. 49–52 and 57 unreachable. |
| Rheem/Ruud spec sheets | Only distributor-hosted copies surfaced (search 4). Not read. |
| Lennox | No official host surfaced (search 5). |
| GE range installation instructions | Only c.searspartsdirect.com and manualslib copies surfaced (search 10). Not read. |
| Whirlpool range PDFs on whirlpool.com / maytag.com / kitchenaid.com | Not surfaced (searches 9, 11). Retailer-hosted copies of the Whirlpool documents were used and labeled as such. |
| GE 31-16680 circuit-amps line | Illegible in the extraction. |
| Trane ODR-PSD031B-EN | Merged cells; 8 of 24 MCA/MOCP cells unresolved. |
| nema.org | Not attempted (prior 429; brief says don't retry). No free NEMA chart searched (budget). |
| 6-30R product page | Not located within the search budget. |
| WebSearch | 18 of 18 used. |

## Open gaps

1. **Franklin AIM 2026 pp. 49–52 and 57.** Needs a local PDF text extraction, for example pdftotext -layout on the official M1311 PDF, or a visual read. WebFetch cannot get past p. 40.
2. **Carrier 26SCA5 3.5 t and 4 t MOCP conflict.** The two documents give 35/40 and 40/50. Check the unit nameplate or Carrier's current coastal data. Until then, publish 26SCA5-02PD values with the conflict disclosed, or omit those two MOCP cells.
3. **Trane A5AC4: 8 cells unresolved** (4030A/B and 4036A MCA; 4042A MCA; MOCP for 4042B, 4048A/B and 4060A). A visual check of the PDF table, pp. "Product Specifications", would settle them.
4. **6-30R explicit rating text** (e.g., Hubbell HBL9330 or a Leviton 6-30R page).
5. **NEMA WD 6** current edition and year, and whether NEMA hosts a free configuration chart.
6. **Heat-pump MCA/MOCP** not collected. York, Rheem and Lennox not obtained from official hosts.
7. **Current-generation dryer and range documents** for GE, Samsung and LG. The GE dryer documents read are from 2001, 2004 and 2012. The Whirlpool dryer document is from 2009.
