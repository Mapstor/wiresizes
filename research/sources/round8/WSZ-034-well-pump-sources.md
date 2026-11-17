# WSZ-034 · Well pump cable, fuse and breaker sizes from Franklin Electric's AIM Manual (2026 edition)

Retrieved 2026-11-17 with curl from Franklin Electric's own asset host (the PDF link on
https://www.franklinwater.com/resources/franklin-aim/); read with pdfplumber (words, cell positions and filled
rectangles) and checked against page renders at 100–110 dpi. The registry row mfr-well-pump had been a candidate:
the 2026 edition's cable and fuse pages were unread (the 2023 edition sat on a robots-blocked host).

## Document

| id | document | url | pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| F1 | Franklin Electric, AIM Manual, 60 Hz Submersible Systems: Application, Installation, Maintenance, 2026 edition (form M1311), PDF created 2026-06-26 | https://fele.widen.net/content/mrbmponfcz/pdf/M1311_60Hz_AIM_Manual.pdf | 72 | 30faf6a63ddad20b |

## Findings

- **Cable selection rules (pdf p. 51, printed 49).** Lengths are the total cable from the power supply (service
  entrance) to the motor and allow a 5 % voltage drop at maximum nameplate amperes; multiply by 0.6 for a 3 % drop.
  Unshaded cells meet the NEC ampacity requirements for individual conductors or jacketed 75 °C cable (conduit or
  direct burial; flat molded and web/ribbon cable count as jacketed); shaded cells only for individual conductors.
  The tables are copper; aluminum must be two sizes larger (#12 copper → #10 aluminum) with oxidation inhibitor on
  the connections. With a line-contactor control box, the cable between the power supply and the control box should
  not exceed 25 % of the total allowable maximum. Cable size combinations (pdf p. 52): the actual length of each
  size divided by that size's maximum, summed, must not exceed 1.00.
- **4-inch single-phase 75 °C cable table (pdf p. 52, printed 50; "2-Lead and 3-Lead").** 8 rows (115 V 1/2 hp;
  230 V 1/2, 3/4, 1, 1.5, 2, 3, 5 hp) × 13 copper sizes, 14 AWG to 4/0. Shaded cells (fill rgb 0.69/0.78/0.85,
  found by pdfplumber and seen on the render): 230 V 3 hp at 14 AWG (120 ft) and 230 V 5 hp at 12 AWG (110 ft).
  5 hp at 14 AWG prints 0; dashes (no value) at 1/2 hp 2/0–4/0 and 3/4 hp 4/0, 230 V. Every row rises with the size
  and every column falls with the horsepower.
- **4-inch single-phase fuses and breakers (pdf p. 59, printed 57).** Per motor model, the maximum per NEC and the
  typical submersible size of a standard fuse, a dual element time delay fuse and a circuit breaker; the note says
  either size protects the circuit, but never exceed the maximum NEC value, and that sizing is the same for FE
  standard, "G" and Series "700" motors. The 3-wire rows with a CRC control box repeat the standard 3-wire values.
- **4-inch single-phase motor specifications (pdf pp. 41–42, printed 39–40), motors without the "G" suffix.** Line
  amps (yellow lead for 3-wire) at full load and at maximum service factor load, with the service factor, for the
  13 models of the fuse table.

## Not used

- The three-phase tables (pdf pp. 53 and 60): the cable table also covers 48, 100 and 380 V (the 100 V 3/4 hp row
  prints 150 ft at 14 AWG and 140 ft at 12 AWG), and for small motors the typical breaker (15 A) is larger than the
  maximum-per-NEC breaker column (for example 8 A at 1/2 hp, 200 V). The calculator stays single-phase.
- 6-inch and 8-inch motors, MagForce (drive-only) motors, 60 °C and 90 °C cable charts (online AIM app only).
- NEC Article 430 itself (nec-430-motors stays a GAP): no 2023 or 2026-cycle record reprints 430.22 or 430.32(A)
  (CMP-11: A2022 public inputs, revisions and comments, and the A2025 public inputs and First Draft, read for this
  task). The page states no Article 430 rule; it reports Franklin's own statements about the NEC.
