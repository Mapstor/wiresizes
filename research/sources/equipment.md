# wiresizes.com audit: equipment primary-source research

Retrieval date for every row: **2026-10-19** (unless a row says otherwise).

**Method and caveats.** All documents were read through WebFetch. WebFetch returns text extracted from the PDF or HTML, and a small model processes that text. Tables were taken from that extracted text. Where it mattered, I cross-checked rows against a second fetch or a second edition. Quotes in "double quotes" are text the tool returned as verbatim. Text marked *(paraphrase)* is the tool's summary, not the document's wording. Every row an audit depends on should get one visual check against the PDF page cited before it is published as a correction.

**Status key.** VERIFIED means the value was seen in a fetched manufacturer or standards document. UNVERIFIED means the value was not seen in any fetched primary. It is not filled from memory.

**Blocked or failed fetches** (logged so nobody re-tries blind):

| URL | Result |
|---|---|
| https://fele.widen.net/content/mrbmponfcz/pdf/M1311_60Hz_AIM_Manual.pdf?u=bt7ctv (official Franklin 2026 AIM PDF) | ROBOTS_DISALLOWED |
| https://franklinaim.com/ | Permission request timed out (PROVENANCE_REQUIRED) |
| https://RCWorst.com/Shared/content/mfr/franklin_electric/docs/feaim_manual23.pdf | ROBOTS_DISALLOWED |
| https://links.imagerelay.com/... (all Sundance Spas and Jacuzzi PDFs) | ROBOTS_DISALLOWED |
| https://www.goodmanmfg.com/docs/librariesprovider6/default-document-library/ss-glxs3b-r32.pdf | ROBOTS_DISALLOWED |
| https://www.lennox.com/residential/products/specifications/ml14kc1?print=1 | ROBOTS_DISALLOWED |
| https://www.nema.org/standards/view/american-national-standard-for-wiring-devices-dimensional-specifications | Proxy HTTP 429 (rate limited, told not to retry) |
| https://www.rheem.com/product/rheem-ra14ay-endeavor-line-classic-series-air-conditioner-ra14ay18aj1na/ | Proxy HTTP 429 (rate limited, told not to retry) |
| https://www.rheem.com/product/rheem-ra16ay-endeavor-line-classic-plus-series-air-conditioner-ra16ay48aj2na/ | Proxy HTTP 429 (rate limited, told not to retry) |
| https://www.geappliances.com/ge-appliances/kitchen/ranges/electric-ranges/ | Proxy HTTP 429 (rate limited, told not to retry) |
| https://leviton.com/products/279 (candidate 14-50R spec page) | Proxy HTTP 429 (rate limited, told not to retry) |
| https://www.rheem.com/professionals/residential-hvac/product-documentation/ | CLIENT_ERROR |
| https://www.lincolnelectric.com/en/products/k1170 | CLIENT_ERROR |
| Shell (curl) to any host | Proxy CONNECT 403. All reads were done through WebFetch. |

The WebSearch budget for this turn (shared across agents) ran out partway through. Items 7, 8 and 5 were then reached only by browsing from manufacturer homepages.

---

## 1. Well pumps: Franklin Electric AIM Manual (plus Pentair/Pentek)

### 1.0 Sources

| ID | Manufacturer | Document | Edition / rev | URL fetched | Notes |
|---|---|---|---|---|---|
| FE-IDX | Franklin Electric | "Franklin AIM" download page | page lists "AIM Manual, M1311, 2026, 13.54 MB" | https://www.franklinwater.com/franklin-aim | Names the **current official PDF**: https://fele.widen.net/content/mrbmponfcz/pdf/M1311_60Hz_AIM_Manual.pdf?u=bt7ctv (robots-blocked to WebFetch). 50 Hz = M1339; SubData Manual = M1312 (2024). |
| FE-26 | Franklin Electric | "AIM MANUAL: 60 Hz Submersible Systems" (Application, Installation, Maintenance) | 2026 Edition (no form/rev printed in extracted text) | https://dwee.nebraska.gov/sites/default/files/water/2026_60Hz_AIM_Manual_Submersible_Systems.pdf (copy hosted by Nebraska Dept. of Water, Energy & Environment) | Extracted text is 76,879 characters and **stops at p. 40**. TOC: Motor Specifications p. 39, **Cable Selection p. 49, Motor Fuses/Circuit Breakers p. 57**. Pages 49 and 57 are therefore unread. |
| FE-15 | Franklin Electric | "Submersible Motors: Application, Installation, Maintenance", 60 Hz single- and three-phase | "AIM Manual 2015 Edition" (form/rev not shown in text) | https://www.metatek.org/_media/playground/franklin_m1311_60_hz_aim.pdf (third-party mirror of the Franklin PDF; footers read "franklinwater.com") | Tables 11/11A p. 11; Table 13 p. 13; Table 14 p. 14. |
| FE-07 | Franklin Electric | same title, 60 Hz | cover year 2007 | https://dee.nebraska.gov/sites/default/files/water/Submersible%20Motors.pdf | Used only to cross-check Table 11/11A. Its values are identical to the 2015 edition. |
| PNT-CB | Pentair (Berkeley; tables labelled Pentek) | "Cable Selection", stainless steel 4" submersible motors | CB6342WS (12/18/17) | https://flowandfiltrationsolutions.pentair.com/content/dam/extranet/web/nam/berkeley/selection-guides/submersible-cable-selection-guide-information.pdf | Second-manufacturer comparison. |
| GOU | Goulds (Xylem) | CP-Series Submersible Motors IOM | IM226R02, Feb 2014 | https://prod.xylem.com/siteassets/brand/goulds-water-technology/resources/manual/im226r02.pdf | **Three-phase 6" only, no single-phase tables.** Its only basis statement (p. 12): "The power cables shall be sized large enough so that at rated current there will be less than a 5% voltage drop." |

Grundfos was not checked because the search budget ran out. UNVERIFIED.

### 1.1 Basis of the Franklin cable tables (FE-15 p. 11; same wording in FE-07)

- "Cable lengths in Tables 11 & 11A allow for a 5% voltage drop running at maximum nameplate amperes." For a 3% drop, multiply lengths by 0.6 *(paraphrase)*.
- "Tables 11 & 11A are based on copper wire. If aluminum wire is used, it must be two sizes larger than copper wire" (FE-15). FE-07 adds that oxidation inhibitors are required on connections *(paraphrase)*.
- "Lengths in BOLD only meet the US National Electrical Code ampacity requirements for individual conductors" (in free air or water, not in magnetic enclosures, conduit or direct burial). "Lengths NOT in bold meet the NEC ampacity requirements for either individual conductors or jacketed" cable (conduit or direct burial OK). **Which cells are bold cannot be seen in extracted text. UNVERIFIED per cell; needs a visual check.**
- With a line contactor, the supply-to-control-box run should not exceed 25% of the total maximum length *(paraphrase)*. 90 °C cable lengths are available from Franklin Electric *(paraphrase)*.
- Franklin publishes **one single-phase table covering both 2-wire and 3-wire motors**. FE-07 titles it "2 or 3-Wire Cable, 60 Hz (Service Entrance to Motor - Maximum Length In Feet)". There is no separate 2-wire vs 3-wire control-box cable table.
- The only 115 V row is 1/2 hp.

### 1.2 Table 11: 60 °C insulation, max feet from service entrance to motor, copper AWG (FE-15 p. 11; FE-07 p. 11 identical)

Raw header: "MOTOR RATING 60 °C INSULATION - AWG COPPER WIRE SIZE / VOLTS HP KW 14 12 10 8 6 4 3 2 1 0 00 000 0000". Blank = not printed. "0" is printed by the source; read it as not permitted.

| Volts | HP | 14 | 12 | 10 | 8 | 6 | 4 | 3 | 2 | 1 | 0 | 00 | 000 | 0000 | Src |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 115 | 1/2 | 100 | 160 | 250 | 390 | 620 | 960 | 1190 | 1460 | 1780 | 2160 | 2630 | 3140 | 3770 | FE-15 p11 |
| 230 | 1/2 | 400 | 650 | 1020 | 1610 | 2510 | 3880 | 4810 | 5880 | 7170 | 8720 | | | | FE-15 p11 |
| 230 | 3/4 | 300 | 480 | 760 | 1200 | 1870 | 2890 | 3580 | 4370 | 5330 | 6470 | 7870 | | | FE-15 p11 |
| 230 | 1 | 250 | 400 | 630 | 990 | 1540 | 2380 | 2960 | 3610 | 4410 | 5360 | 6520 | | | FE-15 p11 |
| 230 | 1.5 | 190 | 310 | 480 | 770 | 1200 | 1870 | 2320 | 2850 | 3500 | 4280 | 5240 | | | FE-15 p11 |
| 230 | 2 | 150 | 250 | 390 | 620 | 970 | 1530 | 1910 | 2360 | 2930 | 3620 | 4480 | | | FE-15 p11 |
| 230 | 3 | 120 | 190 | 300 | 470 | 750 | 1190 | 1490 | 1850 | 2320 | 2890 | 3610 | | | FE-15 p11 |
| 230 | 5 | 0 | 0 | 180 | 280 | 450 | 710 | 890 | 1110 | 1390 | 1740 | 2170 | 2680 | | FE-15 p11 |

FE-07 continues with 7.5, 10 and 15 hp rows (60 °C). 7.5 hp: 0,0,0,200,310,490,610,750,930,1140,1410,1720. 10 hp: 0,0,0,0,250,390,490,600,750,930,1160,1430,1760. 15 hp: 0,0,0,0,170,270,340,430,530,660,820,1020,1260. These are from the 2007 edition only.

### 1.3 Table 11A: 75 °C insulation (FE-15 p. 11; FE-07 identical)

| Volts | HP | 14 | 12 | 10 | 8 | 6 | 4 | 3 | 2 | 1 | 0 | 00 | 000 | 0000 | Src |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 115 | 1/2 | 100 | 160 | 250 | 390 | 620 | 960 | 1190 | 1460 | 1780 | 2160 | 2630 | 3140 | 3770 | FE-15 p11 |
| 230 | 1/2 | 400 | 650 | 1020 | 1610 | 2510 | 3880 | 4810 | 5880 | 7170 | 8720 | | | | FE-15 p11 |
| 230 | 3/4 | 300 | 480 | 760 | 1200 | 1870 | 2890 | 3580 | 4370 | 5330 | 6470 | 7870 | 9380 | | FE-15 p11 |
| 230 | 1 | 250 | 400 | 630 | 990 | 1540 | 2380 | 2960 | 3610 | 4410 | 5360 | 6520 | 7780 | 9350 | FE-15 p11 |
| 230 | 1.5 | 190 | 310 | 480 | 770 | 1200 | 1870 | 2320 | 2850 | 3500 | 4280 | 5240 | 6300 | 7620 | FE-15 p11 |
| 230 | 2 | 150 | 250 | 390 | 620 | 970 | 1530 | 1910 | 2360 | 2930 | 3620 | 4480 | 5470 | 6700 | FE-15 p11 |
| 230 | 3 | 120 | 190 | 300 | 470 | 750 | 1190 | 1490 | 1850 | 2320 | 2890 | 3610 | 4470 | 5550 | FE-15 p11 |
| 230 | 5 | 0 | 110 | 180 | 280 | 450 | 710 | 890 | 1110 | 1390 | 1740 | 2170 | 2680 | 3330 | FE-15 p11 |

**Edition gap.** The current 2026 edition (FE-26) moved the cable tables to p. 49, and that page was not readable. **2026 cable values are UNVERIFIED.** The 2015 and 2007 editions agree exactly, and the 2026 p. 40 motor amps match 2015 (see 1.4), which suggests the values did not change. That is still not verification. One visual check of FE-26 pp. 49–52 closes the gap.

### 1.4 Motor amps: 4" single-phase 3450 rpm (FE-26 p. 40 = current; FE-15 Table 13 p. 13)

FE-26 table title: "4-inch/1-Phase/Encapsulated without 'G' suffix/3450 RPM". Footnote: "Performance is typical, not guaranteed, at specified voltages and specified capacitor values." 3-wire amps are given per lead: Y = yellow (line), B = black (main), R = red (start).

| Type | Model prefix | HP | V | Full-load A | Max (SF) A | SF | LRA | Src |
|---|---|---|---|---|---|---|---|---|
| 2-wire | 244504 | 1/2 | 115 | 10.0 | 12.0 | | 64.4 | FE-26 p40; FE-15 p13 |
| 2-wire | 244505 | 1/2 | 230 | 5.0 | 6.0 | | 32.2 | FE-26 p40; FE-15 p13 |
| 2-wire | 244507 | 3/4 | 230 | 6.8 | 8.0 | | 40.7 | FE-26 p40; FE-15 p13 |
| 2-wire | 244508 | 1 | 230 | 8.2 | 10.4 | | 48.7 | FE-26 p40; FE-15 p13 |
| 2-wire | 244309 | 1.5 | 230 | 10.6 | 13.1 | | 66.2 | FE-26 p40; FE-15 p13 |
| 3-wire (QD box) | 214504 | 1/2 | 115 | Y10.0 / B10.0 / R0 | Y12.0 / B12.0 / R0 | | 50.5 | FE-26 p40 |
| 3-wire (QD box) | 214505 | 1/2 | 230 | Y5.0 / B5.0 / R0 | Y6.0 / B6.0 / R0 | | 23 | FE-26 p40 |
| 3-wire (QD box) | 214507 | 3/4 | 230 | Y6.8 / B6.8 / R0 | Y8.0 / B8.0 / R0 | | 34.2 | FE-26 p40 |
| 3-wire (QD box) | 214508 | 1 | 230 | Y8.2 / B8.2 / R0 | Y10.4 / B10.4 / R0 | | 41.8 | FE-26 p40 |
| 3-wire w/ CRC CB | 214505 | 1/2 | 230 | Y3.2 / B3.7 / R2.0 | Y4.3 / B4.0 / R2.0 | | 23 | FE-26 p40; FE-15 p13 |
| 3-wire w/ CRC CB | 214507 | 3/4 | 230 | Y4.4 / B5.0 / R3.2 | Y5.7 / B5.2 / R3.1 | | 34.2 | FE-26 p40; FE-15 p13 |
| 3-wire w/ CRC CB | 214508 | 1 | 230 | Y5.6 / B5.7 / R3.4 | Y8.1 / B6.2 / R3.3 | | 41.8 | FE-26 p40; FE-15 p13 |
| 3-wire w/ 1–1.5 CB | 214508 | 1 | 230 | Y6.6 / B6.6 / R1.3 | Y8.0 / B7.9 / R1.3 | | | FE-15 p13 *(summary extraction only)* |
| 3-wire w/ CB | 224300 | 1.5 | 230 | Y10.0 / B9.9 / R1.3 | Y11.5 / B11.0 / R1.3 | 1.3 | 51.4 | FE-15 p13 raw: "224300 1.5 1.1 230 60 1.3 / Y10.0 / B9.9 / R1.3 / 1620 / Y11.5 / B11.0 / R1.3 / 2080 …51.4 J" |
| 3-wire w/ CB | 224301 | 2 | 230 | Y10.0 / B9.3 / R2.6 | Y13.2 / B11.9 / R2.6 | 1.25 | 53.1 | FE-15 p13 raw line |
| 3-wire w/ CB | 224302 | 3 | 230 | Y14.0 / B11.2 / R6.1 | Y17.0 / B12.6 / R6.0 | 1.15 | 83.4 | FE-15 p13 raw line |
| 3-wire w/ CB | 224303 | 5 | 230 | Y23.0 / B15.9 / R11.0 | Y27.5 / B19.1 / R10.8 | 1.15 | 129 | FE-15 p13 raw line |

The 1.5–5 hp 3-wire rows of the 2026 edition fall on p. 41+, which was not readable. **2026 values for those rows are UNVERIFIED** (2015 values shown). The extracted text did not cleanly print the control-box sub-headings for 2/3/5 hp.

### 1.5 Fuse / breaker sizing: single-phase 4" motors (FE-15 Table 14 p. 14, raw lines)

Header (raw): "CIRCUIT BREAKERS OR FUSE AMPS (MAXIMUM PER NEC) (TYPICAL SUBMERSIBLE)" / "STANDARD FUSE DUAL ELEMENT TIME DELAY FUSE CIRCUIT BREAKER". No footnote was extracted.

| Model | HP | V | NEC max: std fuse | NEC max: dual-element TD fuse | NEC max: breaker | Typical: std fuse | Typical: TD fuse | Typical: breaker | Raw line |
|---|---|---|---|---|---|---|---|---|---|
| 244504 (2W) | 1/2 | 115 | 35 | 20 | 30 | 30 | 15 | 30 | "244504 1/2 0.37 115 35 20 30 30 15 30" |
| 244505 (2W) | 1/2 | 230 | 20 | 10 | 15 | 15 | 8 | 15 | "244505 1/2 0.37 230 20 10 15 15 8 15" |
| 244507 (2W) | 3/4 | 230 | 25 | 15 | 20 | 20 | 10 | 20 | "244507 3/4 0.55 230 25 15 20 20 10 20" |
| 244508 (2W) | 1 | 230 | 30 | 20 | 25 | 25 | 11 | 25 | "244508 1 0.75 230 30 20 25 25 11 25" |
| 244309 (2W) | 1.5 | 230 | 35 | 20 | 30 | 35 | 15 | 30 | "244309 1.5 1.1 230 35 20 30 35 15 30" |
| 224300 (3W) | 1.5 | 230 | 35 | 20 | 30 | 30 | 15 | 30 | "224300 1.5 1.1 230 35 20 30 30 15 30" |
| 224301 (3W) | 2 | 230 | 30 | 20 | 25 | 30 | 15 | 25 | "224301 2 1.5 230 30 20 25 30 15 25" |
| 224302 (3W) | 3 | 230 | 45 | 30 | 40 | 45 | 20 | 40 | "224302 3 2.2 230 45 30 40 45 20 40" |
| 224303 (3W) | 5 | 230 | 80 | 45 | 60 | 70 | 30 | 60 | "224303 5 3.7 230 80 45 60 70 30 60" |

The 3-wire 1/2–1 hp rows (214504/214505/214507/214508) carry the same values as the 2-wire rows of equal HP and volts, per the FE-15 summary extraction *(not raw-line checked)*. **2026 edition p. 57: UNVERIFIED.**

### 1.6 Pentair/Pentek cable selection (PNT-CB, CB6342WS 12/18/17), second manufacturer

Basis: "NOTE: Based on service factor amps, 30C ambient and 5% voltage drop." Header: "60 HZ MOTOR RATING 60C AND 75C INSULATION – AWG COPPER WIRE SIZE" (one table serves both 60 °C and 75 °C). "(1) This table is based on copper wire. If aluminum wire is used it must be two sizes larger." Columns: 14 12 10 8 6 4 3 2 1 1/0 2/0 3/0 4/0. Values are max feet. Rows are left-aligned from 14 AWG unless noted.

| Motor type | V | HP | Raw row (ft, from 14 AWG upward) |
|---|---|---|---|
| 2-wire PSC | 115 | 1/2 | 107 171 273 432 672 1071 1346 1700 2142 2703 3411 4305 5424 |
| 2-wire PSC | 230 | 1/2 | 457 726 1158 1835 2855 4551 5721 7225 9102 11489 |
| 2-wire PSC | 230 | 3/4 | 342 545 869 1376 2141 3413 4291 5419 6826 8617 10871 |
| 2-wire PSC | 230 | 1 | 267 425 678 1074 1671 2664 3349 4229 5328 6725 8485 10711 |
| 2-wire PSC | 230 | 1-1/2 | 209 332 530 839 1305 2080 2615 3303 4161 5252 6626 8365 |
| 3-wire CSIR | 115 | 1/2 | 94 150 240 380 591 942 1184 1495 1883 2377 2999 3786 4770 |
| 3-wire CSIR | 230 | 1/2 | 348 553 883 1398 2175 3467 4359 5505 6935 8753 |
| 3-wire CSIR | 230 | 3/4 | 277 441 704 1115 1734 2765 3476 4390 5530 6981 8807 |
| 3-wire CSIR | 230 | 1 | 231 367 585 927 1442 2299 2891 3651 4599 5805 7324 |
| 3-wire CSCR | 230 | 1/2 | 438 697 1112 1761 2740 4369 5492 6936 8738 11029 |
| 3-wire CSCR | 230 | 3/4 | 359 571 912 1444 2246 3581 4502 5685 7162 9040 11406 |
| 3-wire CSCR | 230 | 1 | 296 471 751 1190 1852 2952 3711 4686 5904 7452 9402 |
| 3-wire CSCR | 230 | 1-1/2 | 199 317 505 801 1246 1986 2496 3153 3972 5013 6325 |
| 3-wire CSCR | 230 | 2 | 180 286 456 722 1123 1790 2251 2843 3581 4520 5703 |
| 3-wire CSCR | 230 | 3 | 133 211 337 534 830 1324 1664 2102 2648 3342 4217 5323 |
| 3-wire CSCR | 230 | 5 | 206 326 507 809 1017 1284 1618 2042 2577 3253. **Alignment ambiguous** (10 values). The ratio pattern implies 10 AWG through 3/0 (14 and 12 AWG not allowed). Confirm visually. |

Pentair's basis (SF amps, 30 °C, 5%) differs from Franklin's (max nameplate amps, 5%). Both are valid manufacturer primaries, and they give different lengths for the same HP.

---

## 2. EV chargers

### 2.0 Sources

| ID | Manufacturer | Document | Model | Rev / date | URL fetched |
|---|---|---|---|---|---|
| TSL-H | Tesla | Gen 3 Wall Connector install docs (NA single-phase), "Circuit Breaker Rating / Maximum Output" | Gen 3 Wall Connector, PN 1457768-**-* | "(C) Copyright 2026" (no revision shown) | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/1PNA/en-us/GUID-251A1719-ECFA-40C1-8AB8-C71112A66BEC.html |
| TSL-P | Tesla | "Gen 3 Wall Connector Manual – 48A Single Phase" (PDF) | PN 1457768-**-* (p. 5) | no revision or date in extracted text | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/1PNA/g3_wc_install_1pna.pdf (redirect target of https://digitalassets.tesla.com/tesla-contents/image/upload/gen-3-wall-connector-manual.pdf) |
| TSL-OLD | Tesla | Gen 3 Wall Connector Manual (older) | same PN | "Published January 15, 2020", "Revision 1.0" | https://digitalassets.tesla.com/tesla-contents/image/upload/Gen3_WallConnector_Installation_Manual.pdf |
| TSL-U | Tesla | Universal Wall Connector, "Circuit Breaker Rating / Maximum Output" | Universal Wall Connector (Gen3) | © 2026 | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/UniversalWC/en-us/GUID-5CC6694C-47C9-4515-A156-A5B21EB81C88.html |
| CP-IG | ChargePoint | "Installation Guide for J1772 and NACS 16A-50A Flexible Amperage Charger ChargePoint® Home Flex" | Home Flex (CPH50; the model code is not printed in the text) | latest revision-history entry "May, 2026"; ©2013-2026 | https://docs.chargepoint.com/ref-docs-sec/content/pdfs/home/cph50/cph50-ig.pdf |
| CP-FAQ | ChargePoint | "ChargePoint Home Flex Installation FAQ" (web) | Home Flex | not dated | https://www.chargepoint.com/drivers/home/installation/flex |
| EMP-M | Emporia | "Installation and Usage Guide", EV Charger | Emporia EV Charger | 603-00009 Rev D, ©2021-2024 | https://www.emporiaenergy.com/wp-content/uploads/2024/06/603-00009_RevD_Manual-User-EV-Charger-305mm-x-146mm.pdf |
| EMP-H | Emporia | Help article "Wire Gauge & Breaker Size" | Emporia EV Charger | date shown July 27, 2026 | https://help.emporiaenergy.com/en/articles/9084258-wire-gauge-breaker-size |

### 2.1 Breaker → maximum continuous output (all VERIFIED)

| Breaker (A) | Tesla Gen 3 / Universal: max A (kW @240 V) | ChargePoint Home Flex: max load A | CP plug-in allowed? | Emporia: charge A (kW @240 V) |
|---|---|---|---|---|
| 15 | 12 (2.8) | n/a | | 12 (2.9) |
| 20 | 16 (3.8) | 16 | no (hardwire) | 16 (3.8) |
| 25 | n/a | n/a | | 20 (4.8) |
| 30 | 24 (5.7) | 24 | no | 24 (5.8) |
| 35 | n/a | n/a | | 28 (6.7) |
| 40 | 32 (7.6) | 32 | yes | 32 (7.7) |
| 45 | n/a | n/a | | 36 (8.6) |
| 50 | 40 (9.6) | 40 | yes | 40 (9.6) |
| 60 | 48 (11.5) | 48 | no | 48 (11.5) |
| 70 | n/a | 50 (hardwire only) | no | n/a |
| Src | TSL-H; TSL-P p. 7; TSL-U | CP-IG p. 4 | CP-IG p. 4 | EMP-M "Step 7: Electrician instructions" |

**Discrepancy.** CP-FAQ lists the 50 A setting at "70A/80A" breaker. CP-IG p. 4 lists 70 A only. CP-IG p. 4: "The circuit must be rated for 125% of the maximum load."

### 2.2 Conductor and termination statements (VERIFIED quotes)

| Mfr | Statement | Src |
|---|---|---|
| Tesla Gen 3 | "For 60°C rated circuit breaker, use minimum 4AWG, 90°C THWN-2-rated copper wire for conductors." | TSL-H; TSL-P p. 7 |
| Tesla Gen 3 | "For 75°C rated circuit breaker, use minimum 6AWG, 90°C THWN-2-rated copper wire for conductors." | TSL-H; TSL-P p. 7 |
| Tesla Gen 3 | "If installing for less than maximum power, refer to local electrical code to select correct conductors and ground wire size that are suitable for the chosen circuit breaker." | TSL-P p. 7 |
| Tesla Gen 3 | Terminal blocks: "12-4 AWG (3.5 - 25 mm2), copper only" | TSL-P p. 5 |
| Tesla Gen 3 | "Do NOT install cord-and-plug type connections." | TSL-H |
| Tesla (2020 Rev 1.0) | "If installing for maximum power, use minimum 6 AWG, 90° C-rated copper wire for conductors." **This is superseded.** The current docs split the requirement by breaker temperature rating (4 AWG for 60 °C breakers). | TSL-OLD p. 5 |
| Tesla Universal WC | Same 60 °C/4 AWG and 75 °C/6 AWG wording; "Recommend instead using Eaton BRH branch breakers." | TSL-U |
| ChargePoint | "The field-wiring terminal is rated to 105 °C (221 °F) and accepts a maximum of 16 mm2 (6 AWG) wire." | CP-IG p. 4 |
| ChargePoint | "Use 90°C wire copper conductors only." | CP-IG p. i |
| ChargePoint | Plug-in is a NEMA 14-50 or NEMA 6-50 plug. "For a 40 or 50 A plug-in installation, wire the circuit with the appropriate 6-50 or 14-50 outlet." Breaker: "new, dedicated, non-GFCI two-pole circuit breaker" | CP-IG pp. 4, 5, 8 |
| Emporia | "Use 194°F (90°C) wire, 6 AWG copper when installing a 48A connection in a hardwire installation." | EMP-M Safety section |
| Emporia | "6 AWG copper wire, rated for 90°C or higher — copper only, aluminum conductors are not compatible" / "Wire terminals accommodate up to 6 AWG; 4 AWG will not fit and creates a safety hazard" | EMP-H |
| Emporia | NEMA 14-50 plug-in: "EV Charger can supply a max charge of 40A"; "50A recommended for full 40A Charge Rate"; Tech specs: "NEMA Type 14-50 (up to 40A) with < 6 ft long cable, compliant with 2023 NEC Section 625.17(A)(3)(a)(ii)" | EMP-M Step 7 / Tech Specs |

**Audit note.** Manufacturer wire guidance at 48 A is not uniform. Tesla requires **4 AWG Cu when the breaker is 60 °C-rated**. Emporia and ChargePoint terminals **cannot accept 4 AWG**. A calculator that gives one gauge for "48 A EV charger" without the brand and breaker temperature rating will be wrong for some units.

---

## 3. Welders (240 V home/shop)

### 3.0 Sources

| ID | Mfr | Document | Model | Rev / date | URL fetched |
|---|---|---|---|---|---|
| LE-210 | Lincoln Electric | Operator's Manual, POWER MIG® 210 MP | K3963-1; codes 12185, 12630 | "IMT10164-A, Issue Date Aug-19" | https://www.purdue.edu/bidc/wp-content/uploads/2022/07/power_mig_210_mp_manual.pdf (Lincoln's PDF on a university server; Lincoln's own manual search is JS-only) |
| LE-210S | Lincoln Electric | POWER MIG 210 MP brochure/spec (Spanish) | K3963-1 | Publication E7.50, 09/15 | https://ch-delivery.lincolnelectric.com/api/public/content/99a2f204444c4e6991dcdd3a373ad92b |
| LE-225 | Lincoln Electric | "AC-225C (60 Hz Model) Welding Power Source" manual | AC-225C | IMT380-B, January 2010 | https://ch-delivery.lincolnelectric.com/api/public/content/9144d34ccc934e35b98493291853ac06 |
| LE-K1170 | Lincoln Electric | AC-225 Stick Welder product page | K1170 | live page | https://lincolnelectric.com/en-ZA/Products/k1170 |
| MI-211 | Miller | Owner's Manual, Millermatic 211 | Millermatic 211 (original) | OM-265809C, 2016-03 | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/owners-manual/299d5c-o265809c_mil.pdf (redirect from millerwelds.com/files/owners-manuals/o265809c_mil.pdf) |
| MI-211P | Miller | Owner's Manual, Millermatic® 211 PRO | M00207; serial NF268661N– | OM-298867B, 2026-04 | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F45d3ad-o298867b_mil.pdf?v=8ae830d3 |
| MI-220 | Miller | Owner's Manual, Multimatic 220 AC/DC | M30190; serial ND338568N–ZZ222222 | OM-281426D, 2023-07 | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F0aaee0-o281426d_mil.pdf?v=b6e603d8 |
| MI-215P | Miller | Owner's Manual, Multimatic® 215 PRO | M30091 | OM-298868B, 2026-04 | https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc%2Fowners-manual%2F4f23d4-o298868b_mil.pdf?v=378aac7a |
| HO-210 | Hobart | Spec sheet, Handler® 210MVP 115/230-Volt Wire Feed Welder | item 500553 | doc 250822, September 2022 | https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/fb062c-handler-210mvp-250822.pdf |

### 3.1 Input requirements (240 V unless stated)

| Model | Rated output (240 V) | Input A at rated output | I1max / I1eff | Fuse / breaker | Min conductor (Cu) | Max conductor length | Src |
|---|---|---|---|---|---|---|---|
| Lincoln Power MIG 210 MP, 230 V | "25% (200A / 24V)" | Max 27 A; effective 14.7 A | (labels "INPUT AMPERES MAX" / "EFFECTIVE") | 40 A fuse (super lag) or breaker | 12 AWG (75 °C, in conduit, 40 °C ambient) | not stated | LE-210 p. 9 |
| Lincoln Power MIG 210 MP, 120 V | "40% (100A / 19V)" | Max 21.5 A; effective 15 A | | 20 A | 12 AWG | | LE-210 p. 9 |
| Lincoln AC-225C (2010 manual) | "rated at a 20% duty cycle at 175 amps output, or at a 10% duty cycle at 225 amps" | not stated | | "Fuse the two hot lines with 50 ampere super lag type fuses" | "Three #10 or larger copper wires are required if conduit is used." Over 100 ft, #8 or larger *(paraphrase)* | | LE-225 pp. 7, 10 |
| Lincoln AC-225 K1170 (current page) | 225A/25V/20% | "Input Current 50A" (page does not say at rated output) | | not listed | not listed | | LE-K1170 |
| Miller Millermatic 211 (2016) | "150 A @21.5 Volts DC, 40% Duty Cycle" | 16.6 A | none given | 25 A time-delay / 30 A normal-operating | 14 AWG; ground 14 AWG | 72 ft (22 m) | MI-211 pp. 11, 16 (2014 NEC) |
| Miller Millermatic 211 (2016), 120 V | "115 A @ 19.8 Volts DC, 20% Duty Cycle" | 24.3 A | | "15 or 20 ampere individual branch circuit" | | | MI-211 pp. 11, 16 |
| Miller Millermatic 211 PRO (2026) | "215 A @24.8 Volts DC, 30% Duty Cycle" | 25.7 A | I1max 28.9 / I1eff 14.6 | 35 A time-delay / 40 A normal-operating | 14 AWG (2.1 mm²); ground 14 AWG | 40 ft (extracted as "40 (1.2)", so the metre value is garbled) | MI-211P pp. 10, 14 (2026 NEC; 75 °C Cu, 40 °C ambient) |
| Miller Millermatic 211 PRO, 120 V | "80 A @ 18.0 Volts DC, 100% Duty Cycle" | 14.7 A | | 15 or 20 A branch circuit | | | MI-211P p. 10 |
| Miller Multimatic 220 AC/DC, MIG | 200 A @ 24.0 VDC, 20% (also 170 A @ 21.5 V, 40%) | 27.2 A (21.5 A at 170 A) | I1max 32 A; I1eff 15 A (column not clearly mapped) | 40 A time-delay / 45 A normal-operating | 12 AWG (4 mm²) raceway and flexible cord; ground 12 AWG | 34 ft (10 m) | MI-220 pp. 13, 20 (2023 NEC) |
| Multimatic 220, Stick 240 V | 200 A @ 28.0 V, 15% | 31.3 A | | (same guide) | | | MI-220 p. 13 |
| Multimatic 220, TIG 240 V | 210 A @ 18.4 V, 15% | 22.4 A | | | | | MI-220 p. 13 |
| Miller Multimatic 215 PRO, MIG | 24.8 V DC at 215 A, 30% | 25.7 A | I1max 28.9 / I1eff 14.6 (voltage column not clearly mapped) | 35 A time-delay / 40 A normal-operating | 14 AWG; ground 14 AWG | 40 ft (12.2 m) | MI-215P pp. 10, 16 (2026 NEC) |
| Multimatic 215 PRO, Stick / TIG 240 V | Stick 190 A @ 27.6 V, 20% (24.96 A); TIG 190 A @ 17.6 V, 20% (16.57 A) | | | | | | MI-215P p. 10 |
| Hobart Handler 210 MVP, 230 V | "150 A at 23 VDC, 30% duty cycle" | 24 A | not provided | **UNVERIFIED** (owner's manual not reached) | **UNVERIFIED** | | HO-210 |
| Hobart Handler 210 MVP, 115 V | "90 A at 19 VDC, 20% duty cycle" | 20 A | | | | | HO-210 |

Cords and plugs: Lincoln AC-225C is "a NEMA 6-50P 50 amp male plug molded on" and the customer installs a NEMA 6-50R (LE-225 p. 7). Hobart: "Power cord with 5-15P (115 V, 15 A) and 6-50P (230 V, 50 A) MVP™ plugs" (HO-210). Lincoln 210 MP: "(two) six-foot power cords" (LE-210 p. 14). Miller footnotes (MI-211P, MI-215P): "Time-Delay" fuses are UL class RK5. "Normal Operating" fuses are class K5 up to 60 A and class H at 65 A and up. A breaker may replace a fuse if it has comparable time-current curves *(paraphrase)*.

**Discrepancies to flag.** (a) The Millermatic 211 PRO product page shows 240 V "160 A at 22.0 VDC, 60% duty cycle". The manual's rated point is 215 A @ 30%. These are different duty-cycle points, not a conflict, but a site must say which one it uses. (b) Lincoln AC-225 is 175 A @ 20% in the 2010 manual versus 225 A/25 V/20% on the current K1170 page.

---

## 4. Hot tubs / spas

### 4.0 Sources

| ID | Mfr | Document | Rev / date | URL fetched |
|---|---|---|---|---|
| HS-PD | Hot Spring (Watkins Wellness) | Hot Spring Spa Pre-Delivery Instructions, Highlife Collection 2026 | Part No. 62982.26 A, Rev A, 01/26 | https://www.hotspring.com/wp-content/uploads/2026/08/hot-spring-highlife-collection-pre-delivery-instruction-2026.pdf |
| BF-A | Bullfrog Spas | A Series Owner's Manual | v1.9, © 2026 | https://www.bullfrogspas.com/wp-content/uploads/2026/08/2026_A-Series-Owners-Manual_English_v1.9.pdf |
| MQ-E | Marquis | ELITE Owner's Manual (2026) | no version printed in extracted text | https://www.marquisspas.com/media/177635/2026-elite-owners-manual.pdf |
| JZ-I | Jacuzzi | Hot tub installation web page | © 2026 footer | https://www.jacuzzi.com/en-us/hot-tub-installation.html |

### 4.1 Values

| Maker / scope | Voltage | Breaker / circuit | GFCI | Conductors stated | Other | Src |
|---|---|---|---|---|---|---|
| Hot Spring Highlife, 230 V | 230 V, 1-phase | "All models require a 50 amp, single phase, 230 volt circuit breaker in the main electrical service panel." Diagram: "230V, 50 Amp, 2-POLE, CIRCUT BREAKER (NON GFCI)" [sic] | GFCI breakers are in the spa-supplied subpanel ("included with the spa except for JETSETTER (JJN)") | "a four-wire electrical service (two line voltages, one neutral, one ground)"; "The grounding conductor must be at least #10 AWG." Diagram labels: "#8 AWG BLACK, L1", "#8 AWG RED, L2", "#8 AWG WHITE, NEUTRAL", "GROUND #10 AWG GREEN LESS THAN 100 FT." (mapping to each diagram not certain in extracted text) | "IMPORTANT: ALL WIRING SHOULD BE COPPER." Subpanel/disconnect ≥5 ft from the water edge; "Do not exceed 50 FEET." | HS-PD pp. 12–13 |
| Hot Spring per-model table | | "230 volt, 20A & 30A Single phase GFCI protected circuit" (Grandee, Envoy, Vanguard, Aria, Sovereign, Prodigy, Jetsetter LX). These are the subpanel GFCI branches fed by the 50 A main breaker. | | | | HS-PD pp. 17–18 |
| Hot Spring 115 V (Jetsetter JJN) | 115 V | "The 115 volt spa requires a dedicated 20 amp, 115 volt circuit." "it must have a 20 amp GFCI breaker" | yes | "#12 AWG wire (including ground wire)"; "a maximum voltage drop of 3% be used when calculating the larger wire size" | 20 A single receptacle, 6–10 ft from the spa; ~15 ft cord | HS-PD p. 11 |
| Bullfrog A Series, 240 V | 240 V | "240V~/60Hz, 50A or 60A, Single-Phase, dedicated electrical circuit" | "GFCI protected, 4-wire (Line 1, Line 2, Neutral, and Ground)" | AWG **not stated**: "The size of wire required to supply the spa with power depends on the length of the electrical run". "All wiring from the disconnect to the spa must be copper". | Can be converted to 30 A (heating limited to pump-1 low speed) | BF-A pp. 26–28 |
| Bullfrog A Series, 120 V | 120 V | Cord-connected: "120V~/60Hz, 15A, SinglePhase, dedicated, grounded circuit and power outlet". Permanent: GFCI-protected 3-wire 15 A | yes | | ~15 ft cord, "the maximum length allowed" | BF-A p. 28 |
| Marquis Elite, 240 V | 240 V | "Circuit breaker or fuse size: 50A." | "Class A ground Fault Circuit Interrupter (GFCI)" | "Rated 240V, 60Hz, 50A, three wires (#6 copper) plus ground (#8 copper (8.42mm2)), [4 wires total]." | Disconnect within sight and ≥5 ft from the spa; copper only | MQ-E p. 14 |
| Marquis Elite, 120 V | 120 V | "Circuit breaker or fuse size: 15A"; "Rated 120V, 60Hz, 15A (2 wires plus ground)" | 15-ft GFCI cord | | 15 A dedicated receptacle ≥5 ft from the spa; no extension cords; convertible to 240 V/50 A | MQ-E p. 15 |
| Jacuzzi (web) | "Jacuzzi® hot tubs require 120 or 240 volts, depending on the size of the spa" | **no amperage stated: UNVERIFIED** | | | Install guides are on imagerelay (blocked) | JZ-I |

Not read (blocked or unreached): Sundance 2026 Pre-Delivery Guide Rev26B (imagerelay, robots). Caldera 2026 pre-delivery PDFs were located but not read: https://www.calderaspas.com/wp-content/uploads/2026/01/caldera-spas-utopia-pre-delivery-instructions-2026.pdf. No maker reviewed lists **40 A**. **60 A** appears only as Bullfrog's "50A or 60A".

---

## 5. RV receptacles (NEMA TT-30R, 14-50R): ALL UNVERIFIED

No primary was read. The NEMA WD 6 page fetch was refused by the proxy (HTTP 429, do-not-retry). WD 6 does not appear on the first page of https://www.nema.org/standards/all-standards (10 of 702 shown). The search budget ran out before Hubbell or Leviton spec pages could be located.

| Item | Status |
|---|---|
| TT-30R = 30 A, 125 V, 2-pole 3-wire grounding | UNVERIFIED (no fetched primary) |
| 14-50R = 50 A, 125/250 V, 3-pole 4-wire grounding | UNVERIFIED |
| NEMA WD 6 current edition/year | UNVERIFIED |
| Hubbell / Leviton product spec page | UNVERIFIED (not located) |

Indirect manufacturer mentions that were seen (they do **not** verify the NEMA ratings): ChargePoint CP-IG names "Industrial Grade Outlet (NEMA 14-50)". Emporia EMP-M "NEMA Type 14-50 (up to 40A)". Hobart HO-210 "6-50P (230 V, 50 A)".

---

## 6. Pool pumps

### 6.0 Sources

| ID | Mfr | Document | Rev / date | URL fetched |
|---|---|---|---|---|
| PN-IF3 | Pentair | IntelliFlo3 VSF product page (spec table) | live page | https://www.pentair.com/en-us/pool-spa/products/pumps/intelliflo3-vsf-pool-pump.html |
| PN-IF3G | Pentair | "INTELLIFLO3® VSF / INTELLIPRO3® VSF … Installation and Maintenance Guide" | P/N 356231 REV. E 6/30/25 | https://www.pentair.com/content/dam/extranet/nam/pentair-pool/residential/pumps/intelliflo3-vsf/manuals/install-guide/intelliflo3-pro3-vsf-install-guide.pdf |
| PN-SF | Pentair | "SUPERFLO VST, SUPERFLO VS and SUPERMAX VS … Installation and User's Guide" | P/N 356292 Rev. C, 7/31/23 | https://www.pentair.com/content/dam/extranet/nam/pentair-pool/residential/pumps/archive/superflo-vs/manuals/supervs-install-english.pdf |
| HY-VS | Hayward | VS Pump Family Owner's Manual (with OmniX) | 1021514 Rev B (© 2026) | https://commerce.hayward-pool-assets.com/magento/akeneo/SP2670020VSPX1/manuals/1021514_RevB_b9ac.pdf |
| HY-SP | Hayward | Super Pump Series Owner's Manual (700 Series) | 1017836 RevA (© 2024) | https://commerce.hayward-pool-assets.com/magento/akeneo/SP2607X10/manuals/IS26002_RevA_2a67.pdf |
| HY-SPP | Hayward | Super Pump High Efficiency product page (SP2607X10) | live page | https://www.hayward.com/super-pump-high-efficiency-pump-1-1hp-sp2607x10.html |
| HY-SS | Hayward | Super Pump High Efficiency sell sheet | LITSPHE23 (© 2023) | https://commerce.hayward-pool-assets.com/magento/akeneo/SP2607X10/literature/LITSPHE23_ea6c.pdf |

### 6.1 Values

| Pump | THP | Voltage | Full-load / input amps | Breaker / circuit stated | Wire statement | Src |
|---|---|---|---|---|---|---|
| Pentair IntelliFlo3 VSF 1.5 HP (011065/011066) | 1.5 | 115/208-230 | "Input Current 12.0/6.4-5.9 Amps" (115 V / 208–230 V by order; the order is not labelled) | Pentair offers a "2-Pole 20 Amp GFCI breaker" (PA220GF). No required size stated. | No AWG given: "For wiring sizes and general electrical guidelines, please follow the specifications defined in the" NEC | PN-IF3; PN-IF3G pp. 5, 27 |
| Pentair IntelliFlo3 VSF 3.0 HP (011075/011076) | 3 | 208-230 | "Input Current 12.4/11.2 Amps" | same | same | PN-IF3; PN-IF3G |
| Pentair SuperFlo VST / VS, SuperMax VS | 2.2 (WEF 9.0) | "115-230 Vrms nominal" | "Input Current 13.6/8.2-7.1 A" | PA220GF 2-pole 20 A GFCI offered | "Power Connections … are capable of handling up to 10 AWG solid or stranded wire." | PN-SF pp. 5, 23 |
| Hayward MaxFlo VS / Super Pump VS | n/s | 230 / 115 VAC | max 6.5 A / 7.2 A | 15 A branch circuit | "Use copper conductors only." | HY-VS p. 13 |
| Hayward TriStar VS 1.85 | n/s | 230 / 115 | 7.4 A / 7.2 A | not clearly mapped | | HY-VS p. 13 |
| Hayward TriStar VS 2.70 / TriStar XL VS | n/s | 230 / 115 | 10.2 A / 12.2 A | 20 A branch circuit | | HY-VS p. 13 (the extracted table does not cleanly map branch-circuit values to models) |
| Hayward Super Pump single-speed (SP2600X5 0.60, SP2605X7 0.85, SP2607X10 1.10 THP) | 0.6–1.1 | 230V/115V | **UNVERIFIED.** Manual: "Refer to motor nameplate for voltage and current ratings." | Product-page Q&A (Hayward Support): "The pump requires a 15 amp circuit." | "wire size is adequate for the amps rating and distance from the power source" | HY-SP p. 6; HY-SPP; HY-SS |

Bonding (all four documents): No. 8 AWG solid copper (6 AWG in Canada). GFCI required: "Connect only to a branch circuit protected by a ground-fault circuit-interrupter (GFCI)" (PN-IF3G p. ii). **Single-speed 1 / 1.5 / 2 hp full-load amps at 115/230 V: UNVERIFIED.** Neither maker publishes them in the manuals read; both defer to the motor nameplate.

---

## 7. Air conditioners (MCA / MOCP): ALL UNVERIFIED

No manufacturer spec sheet with MCA/MOCP was read.

| Maker | What happened |
|---|---|
| Goodman | GLXS3B (R-32) spec sheet located: https://www.goodmanmfg.com/docs/librariesprovider6/default-document-library/ss-glxs3b-r32.pdf. WebFetch ROBOTS_DISALLOWED. The product page shows only "Maximum - Voltage 253 V". |
| Lennox | ML14KC1 specs page robots-blocked. Brochure link is a placeholder. |
| Carrier | Model pages (26SCA4, 26SCA5, 26SPA6, 26TPA8, 26VNA1) link brochures, the R-454B homeowner's manual and warranty only. Product Data is behind a JS model search. |
| Trane | No model pages or product data reachable from residential AC pages. |
| Rheem | RA14AY product page → proxy 429. Model list located: RA13NY/NZ, RA14AY/AZ, RA15AY/AZ, RA16AY/AZ, RA18AZ, RA19AY (https://www.rheem.com/products/residential/heating-and-cooling/air-conditioners/). |

| Tonnage | Model | MCA | MOCP | Status |
|---|---|---|---|---|
| 1.5 | n/a | n/a | n/a | UNVERIFIED |
| 2 | n/a | n/a | n/a | UNVERIFIED |
| 3 | n/a | n/a | n/a | UNVERIFIED |
| 4 | n/a | n/a | n/a | UNVERIFIED |
| 5 | n/a | n/a | n/a | UNVERIFIED |

---

## 8. Dryers and ranges: ALL UNVERIFIED

No installation instructions were reached. Whirlpool's electric-dryer grid rendered empty ("Showing results 0 of"). Maytag MED5630HW product page: "Manuals, Guides & Warranty" section empty. producthelp.whirlpool.com dryer pages hold no electrical article. GE category pages hold no model links (JS). Samsung and LG were not attempted (search budget).

| Item | Status |
|---|---|
| Electric dryer: 30 A, 240 V, 4-wire NEMA 14-30R | UNVERIFIED |
| Electric range: 40 A vs 50 A circuit | UNVERIFIED |
| Any stated copper AWG | UNVERIFIED |

---

## 9. Electric water heaters

### 9.0 Sources

| ID | Mfr | Document | Rev / date | URL fetched |
|---|---|---|---|---|
| AOS-M | A.O. Smith | "Residential Electric Water Heater Installation Instructions and Use & Care Guide" | 100309797_2000561860_REV_B, September 2020 | https://assets.hotwater.com/damroot/Original/10004/100309797.pdf |
| AOS-S | A.O. Smith | "Commercial-Grade Residential Electric Water Heaters (PROLINE® Standard)" spec sheet | AOSRE50608, March 2025 | https://assets.hotwater.com/damroot/Original/10001/AOSRE50608.pdf |
| AOS-P | A.O. Smith | ProLine 50-Gallon Short Electric (ENS-50 110) product page | live page | https://www.hotwater.com/products/standard-electric-proline/ens-50-110/100227539.html |
| RH-S | Rheem | "Professional Classic Plus® with LeakSense™" electric spec sheet | PRO+E RH LS Rev. 2, 03/23 | https://files.myrheem.com/webpartners/ProductDocuments/3D762172-CCB6-463E-80BC-0899D17105D4.pdf |

### 9.1 Values

| Item | Value | Status | Src |
|---|---|---|---|
| Voltage / elements | "240 Volt AC/Single Phase"; "Dual 4500 watt stainless steel heating elements"; "4500 watt upper and lower heating elements." | VERIFIED | RH-S pp. 1–2 |
| Element operation | "single phase non-simultaneous wiring" (so the max draw is one 4500 W element) | VERIFIED | RH-S p. 2 |
| A.O. Smith elements | "Dual 4500 watt elements for fast recovery." 240 V standard 4500 W. Factory min/max per model, e.g., ENS-50: standard 4500, min 2500, max 6000 W | VERIFIED | AOS-S table |
| Wire size | "Use 10 gauge solid copper wire." (Fire Risk warning, electrical connection) | VERIFIED (A.O. Smith only) | AOS-M p. 5 |
| Breaker size | Not stated in any document read. A.O. Smith: "Check the water heater's data plate and ensure that the home's voltage, wiring size (ampacity) and circuit breaker rating and type are correct." "In the absence of local codes, follow NFPA-70 and the current edition of the National Electric Code (NEC)." | **UNVERIFIED** (breaker amperage) | AOS-M pp. 14–15 |
| Amps at 4500 W / 240 V | Not printed in any document read. (4500/240 = 18.75 A is arithmetic, not a sourced figure.) | UNVERIFIED as a published figure | n/a |

Discrepancy: the ENS-50 product page lists "Max Wattage 4,500" next to "dual 4,500-watt elements". This is consistent with non-simultaneous operation but is not explained on the page.
