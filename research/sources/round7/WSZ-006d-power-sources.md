# WSZ-006d: the power sources, one row per document

Retrieved 2026-11-14 in the chat session, each URL taken from a web search result and read with WebFetch (the shell cannot reach these hosts). Quotes are short; the rest is paraphrase.

The old `power-definitions` row named three documents (the EIA Glossary, DOE Motor Challenge fact sheets, NIST SP 330) in one attribution and linked only the EIA Glossary (WSZ-019 review). The three-phase calculator needs each claim linked to the document that shows it, so the row is split. `power-definitions` stays for the six converters, Ohm's law and the three older power guides until WSZ-007 moves them.

## eia-power-glossary (tier A)

- https://www.eia.gov/tools/glossary/index.php?id=power: entries Power, Power (electrical) and Power factor.
  - Power factor: "The ratio of real power (kilowatt) to apparent power kilovolt-ampere" for a given load and time.
  - Power (electrical): a voltampere is the product of 1 volt and 1 ampere, equal to 1 watt on direct current; apparent power splits into real power (does work, kW) and reactive power (does no work, kilovars), which magnetic equipment such as motors needs.
  - The Power entry writes "mW" for megawatts; not used.
- https://www.eia.gov/tools/glossary/index.php?id=R: Reactive power (sustains the electric and magnetic fields of AC equipment; supplied by generators, synchronous condensers or capacitors; "a derived value equal to the vector difference" of apparent and real power; KVAR) and Real Power (the component that performs work, kW; also called active power).
- https://www.eia.gov/tools/glossary/index.php?id=apparent_power: "The product of the voltage (in volts) and the current (in amperes)"; comprises active and reactive power; VA, kVA, MVA.
- No dates on the entries.

## doe-motor-load-efficiency (tier A)

- https://www.energy.gov/sites/prod/files/2014/04/f15/10097517.pdf, DOE/GO-10097-517, "Determining Electric Motor Load and Efficiency" (Motor Challenge). No date printed; NREL's research-hub record says 1996.
- Equation 1: "Pi = V x I x PF x √3 / 1000", three-phase power in kW.
  - V: RMS voltage, the mean line-to-line voltage of the three phases.
  - I: RMS current, the mean of the three phases. PF: power factor as a decimal.
- Example, input power: line-to-line 467, 473 and 469 V (mean 469.7 V); 36, 38 and 37 A (mean 37 A); PF 0.75, 0.78 and 0.76 (mean 0.763); Pi = 22.9 kW. Check: 469.7 × 37 × 0.763 × √3 ÷ 1000 = 22.97 kW, which the sheet prints as 22.9.

## doe-power-factor-cost (tier A)

- https://www.energy.gov/sites/prod/files/2014/04/f15/mc60405.pdf, DOE/GO-10096-286, "Reducing Power Factor Cost" (Motor Challenge). No date printed; NREL's record says 1996.
- Power factor is the ratio of real (working) power to apparent (total) power.
- Reactive (nonworking) power caused by inductance "always acts at a 90° angle to real power" (the power triangle).
- Example: real power 100 kW, apparent power 142 kVA, reactive power labelled 100 kVAR; PF = 100/142 = 0.70.
- A capacitor brings apparent power from 142 to 105 kVA, PF 0.95, a 26 % reduction in current. The sheet calls it a "67-kW capacitor"; capacitors are rated in kVAR, so the site never copies "kW". From the sheet's own values: PF 0.7042 → 0.95 at 100 kW takes 67.9 kVAR and cuts current 25.9 % (golden case 74).
- Capacitors supply kVARs, which reduces the current flowing from the source.
- Not used: the sentence that utilities usually charge a penalty below PF 0.95 (1990s practice, no current tariff behind it).

## nist-sp330-si-units (tier A)

- https://www.nist.gov/pml/special-publication-330/sp-330-section-2 (created 2019-08-21, updated 2025-08-18). Section 2.3.4, Table 4, "The 22 SI units with special names and symbols":
  - watt: W = kg m² s⁻³ = J/s
  - volt: V = kg m² s⁻³ A⁻¹ = W/A
  - ohm: Ω = kg m² s⁻³ A⁻² = V/A
  - siemens: S = A/V
- The 2019 edition (PDF https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.330-2019.pdf) supersedes the 2008 edition; NIST's metric publications page lists it as current.

## mit-polyphase-networks (tier B)

- https://www.ocw.mit.edu/courses/6-061-introduction-to-electric-power-systems-spring-2011/c6393a58319200a5344752de0cf47ec4_MIT6_061S11_ch3.pdf, MIT 6.061 class notes, chapter 3 "Polyphase Networks", J. L. Kirtley Jr., © 2003 (OCW Spring 2011; CC BY-NC-SA 4.0, facts cited only).
- Line-Line Voltages: line-to-line voltages are larger than line-to-neutral by a factor of √3 and lead them by 30°.
- Example: a distribution system with 120 V line to neutral has 208 V line to line.
- Per-unit base power: P_B = 3 × V(line to ground) × I (eq. 55) = √3 × V(line to line) × I (eq. 56).
- Why tier B: no U.S. government page found that states the √3 relation itself. The NCUC rule's three-phase systems (us-nominal-voltages: 208Y/120, 480Y/277) agree with it: 208 ÷ √3 = 120.1 V, 480 ÷ √3 = 277.1 V.

## Also read, not used

- Trade and vendor glossaries (All About Circuits, EEPower, setra.com and others) agree with the documents above; none is cited.

## Registry changes

- New rows: eia-power-glossary, doe-motor-load-efficiency, doe-power-factor-cost, nist-sp330-si-units, mit-polyphase-networks.
- power-definitions: pages_served without the three rebuilt calculators; a note on the split and on its retirement in WSZ-007.
- eia-electricity-price: pages_served emptied (no page cites it since WSZ-006b, D-37).
- research/page-map.csv: the three-phase calculator's data_source is doe-motor-load-efficiency; the voltage drop, low voltage and three-phase rows list the sources their pages now cite.
