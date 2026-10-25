# Page specs — held waves WSZ-008 to WSZ-011 (draft 2026-10-20)

Same rules as research/page-specs.md ("Rules for every page"). Queries are 12-month Bing impressions for this site. The Bing keyword export only lists queries above Bing's reporting threshold, so the long tail of the equipment pages is missing (compare the page totals in research/page-map.csv).

The code rules each page needs are named by registry domain. A page is built only when every domain it lists is `verified` in research/data-sources.csv. The "Status" line below each spec is filled when the sourcing round lands.

---

## WSZ-008 — service, feeder and EV cluster

### /guides/wire-size-for-200-amp (Bing 10,776 impr)
- Queries: "200 amp service wire size" 34 · "what size wire for 200 amp service" 18 · "what size ground wire for 200 amp service" 16 · "wire size for 200 amp service" 12 · "200 amp copper wire size" · "200 amp service wire size chart" · "what size wire does the utility company use for a 200 amp service".
- Intent: the conductor size for a 200 A house service or main feeder; the grounding electrode conductor; the difference between the dwelling-service table and the general table.
- Wedge: the dwelling-service 83% rule (Table 310.12) explains why 2/0 Cu and 4/0 Al are allowed for 200 A when Table 310.16 lists them at 175 A and 180 A. The page shows both tables side by side and says which applies to which installation: dwelling service or main power feeder vs. any other feeder.
- Data: nec-310-12, nec-310-16, nec-250-grounding (GEC per Table 250.66), conductor-resistance-20c (voltage drop at the reader's length), nec-110-14c (terminal temperature for the non-dwelling case), nec-misc-installation (utility side: service drop vs. service-entrance conductors), nec-300-5-burial (burial depth, Table 300.5(A)).
- Tool: optional mini-tool "voltage drop for my run" (engine; length input; 2/0 Cu vs 4/0 Al at 200 A).
- FAQ (real queries): ground wire size for 200 A service · copper vs aluminum for 200 A · does the utility's service drop follow the same table (no: utility conductors are outside the NEC scope; say it only if sourced) · 200 A subpanel vs service.

### /guides/wire-size-for-100-amp (Bing 5,013 impr)
- Queries: "100 amp wire size" 49 (pos 8.4) · "wire size for 100 amp sub panel" 47 (9 clicks) · "100 amp cooper wire size" 41 · "what size wire for 100 amp service" 22 · "aluminum wire size for a 100a service" · "200 ft 100 amp subpanel supply wire size".
- Intent: a 100 A subpanel feeder (most clicks) vs. a 100 A dwelling service.
- Wedge: a subpanel feeder is not the main power feeder, so Table 310.12 doesn't apply. Its size comes from Table 310.16 at the terminal temperature rating (110.14(C)): 100 A or less uses the 60 °C column unless every termination is listed and identified for 75 °C conductors (110.14(C)(1)(a)(3)). That changes the copper answer from 4 AWG (310.12, service) to 3 AWG (75 °C, listed and identified terminations, conductors in raceway) or 1 AWG (60 °C). Show all three with the condition for each; NM cable stays at 60 °C on this site until 334.80 is verified.
- Data: nec-310-12, nec-310-16, nec-110-14c, nec-250-grounding (EGC per Table 250.122 at 100 A), nec-feeders-outbuildings (250.32 separate EGC, no neutral-ground bond at the subpanel; 225.x for detached buildings), conductor-resistance-20c.
- FAQ: 100 A subpanel 200 ft away (voltage drop, computed) · aluminum for a 100 A service · 4-wire feeder to a detached garage.

### /calculators/service-entrance-calculator (Bing 3,877; Google 884)
- Queries: "service entrance" · "200 amp service wire size" · "service entrance wire size chart" · "175 feet of entrance cable for 200 amp service" · "what size ground wire is required for a 150 amp service entrance cable".
- Tool: service rating (100–400 A) + material → service conductors (Table 310.12) + GEC (Table 250.66) + voltage drop at the length entered. Load-calculation mode comes back only when nec-220-load-calcs is verified.
- Data: nec-310-12, nec-250-grounding, conductor-resistance-20c, nec-misc-installation (230.79 minimum ratings; 230.24 clearances if shown).

### /guides/wire-size-for-ev-charger (Bing 3,478 impr, 167 clicks)
- Queries: "ev charger wire size chart" 12 · "what size wire for electric car charger" · "wire needed for 11kw ev charger" · "what gage wire is required for a level 2 32 amp ev charger" · "#8 awg for ev charging" · "what gauge wiring is needed for a 50 amp ev charger" · "wire and emt conduit sizes for level 2 charger".
- Intent: the breaker and wire for a given charger output (32/40/48 A) or kW.
- Wedge: charger output → breaker → conductor, chained with the rules and the manufacturers' own tables. Tesla Gen 3: 48 A needs a 60 A breaker and at least 4 AWG Cu with a 60 °C-rated breaker, or 6 AWG with a 75 °C-rated breaker. ChargePoint and Emporia terminals take 6 AWG at most. NM cable (60 °C) vs THHN in conduit changes the answer.
- Data: mfr-evse, nec-2023-rule-excerpts (625.40/.42/.43, 220.57), nec-continuous-load (625.41, 210.19/210.20), nec-310-16, nec-110-14c (incl. 334.80 NM at 60 °C), nec-250-grounding (EGC), irs-30c-credit, nec-ch9-fill (conduit sizes, only if verified), conductor-resistance-20c.
- Tool: charger output (A) or kW at 240 V → breaker, minimum copper by wiring method (NM cable / THHN in conduit, terminals 60 or 75 °C), EGC, voltage drop at the length entered.

### /calculators/ground-wire-calculator (Bing 299)
- Queries: "what size ground wire for 200 amp service" 16 · "…150 amp service entrance cable" · "…100 amp service" · "grounding wire size for 240v 50 amp ev charger" · "hot tub ground wire 10 gauge or 8".
- Tool: two modes, kept visibly separate because the site mixed them up: (1) equipment grounding conductor by OCPD rating (Table 250.122, 15–6000 A, Cu and Al/CCA, with the 250.122(B) proportional-upsizing rule when the circuit conductors were upsized); (2) grounding electrode conductor by service-conductor size (Table 250.66, with the 250.66(A)/(B) limits for rod and concrete-encased electrodes).
- Data: nec-250-grounding, nec-grounding-rules (250.66(A)/(B), 250.122(B), 250.118, 250.52/250.53).

### /calculators/garage-subpanel-calculator (Bing 22)
- Tool: feeder ampacity for a detached-building subpanel: Table 310.16 at the terminal temperature, EGC (250.122), 4-wire feeder (250.32), voltage drop, burial depth (Table 300.5(A)).
- Data: nec-310-16, nec-110-14c, nec-250-grounding, nec-feeders-outbuildings, nec-300-5-burial (Table 300.5(A)), conductor-resistance-20c.

---

## WSZ-009 — code-rule tools

### /calculators/wire-size-calculator (Bing 49 impr; "wire size calculator" 1,548 impr lands on the homepage)
- Queries: "wire size calculator" 1,548 (pos 7.2) · "electrical wire size calculator" · "wire sizing calculator" · "what size wire to an rv" · "pump wire size calculator".
- Tool: load or OCPD amps, continuous yes/no, conductor material, wiring method (cable NM/UF or not sure → 60 °C; individual conductors → termination choice), terminations (not sure / marked 60 °C / every termination listed and identified for 75 °C conductors; never 90 °C as the final column), ambient, number of current-carrying conductors, length and voltage → smallest conductor that satisfies:
  - ampacity after correction and adjustment;
  - the 125% continuous rule;
  - the 240.4(D) small-conductor limit;
  - the terminal-temperature limit (110.14(C), data/verified/nec-110-14c.json engine_rules);
  - the reader's voltage-drop target.
  It also gives the EGC from Table 250.122. Every step is shown.
- Data: nec-310-16, nec-310-15-corrections, nec-110-14c, nec-continuous-load, nec-240-4-d, nec-240-ocpd (240.4(B), 240.6(A)), nec-250-grounding, conductor-resistance-20c.

### /calculators/ampacity-calculator (Bing 1,502)
- Queries: "nec ampacity chart" 174 · "wire ampacity chart" 149 · "ampacity" 144 · "nec ampacity table" 77 · per-size "10/8/14/12/16 awg ampacity" · "wire ampacity calculator".
- Tool: size, material, insulation column, ambient, current-carrying count, rooftop exposure (310.15(B)(2) if verified) → corrected ampacity, then the terminal-temperature cap and the 240.4(D) OCPD cap shown separately.
- Data: nec-310-16, nec-310-15-corrections, nec-110-14c, nec-240-4-d, nec-cable-rules (334.80 NM, 340.80 UF, 310.15(E)/(F) counting rules).

### /calculators/circuit-breaker-calculator (Bing 35)
- Tool: load (continuous/noncontinuous) → minimum OCPD (125% rule) → next standard size (240.6(A)) → minimum conductor, with 240.4(B)/(D) checks.
- Data: nec-continuous-load, nec-240-ocpd, nec-240-4-d, nec-310-16, nec-110-14c.

### /calculators/conduit-fill-calculator (Bing 35; Google 178)
- Queries: "wire fill calculator" 9 · "wire and emt conduit sizes for level 2 charger" · "100amp 3phase 4 wire sub panel wire and conduit size".
- Tool: conduit type and trade size + conductor list (type, size, count, EGC included) → fill % vs Chapter 9 Table 1 limits; smallest trade size that fits.
- Data: nec-ch9-fill (Table 1 + notes, Table 4, Table 5).

### /calculators/box-fill-calculator (Bing 781)
- Queries: "electric box capacity calculation" · "electrical box fill chart printable" · "junction box size calculator".
- Tool: box (from Table 314.16(A) or a marked volume) + conductors by size + devices, clamps, fittings, EGCs → required volume per 314.16(B), with each counting rule shown.
- Data: nec-314-16-box-fill.

---

## WSZ-010 — load calculations

### /calculators/residential-load-calculator (Google 3,176 impr; Bing 352)
- Tool: dwelling service size by the standard method and the optional method (220.82), clearly separated, with the edition chosen (2023 Article 220 / 2026 Article 120, where values changed, such as general lighting 3 → 2 VA/ft² if verified).
- Data: nec-220-load-calcs, nec-2026-edition, nec-310-12.

### /calculators/range-calculator (Bing 981)
- Queries: "range calculations per 220.55 nec" · "wire size for range" · "i have 20a oven and 30a cooktop what amperage of circuit shoud be".
- Tool: range nameplate kW (or cooktop + ovens) → Table 220.55 demand (Column C with Note 1, or Columns A/B; Note 4 combinations) → branch-circuit amps → conductor; receptacle configuration (14-50R / 14-40R if verified); GFCI per 210.8(D).
- Data: nec-220-load-calcs, nec-2023-rule-excerpts, nec-310-16, nec-110-14c, nema-receptacle-configs, mfr-dryer-range.

### /calculators/dryer-calculator (Bing 31)
- Tool: dryer nameplate → 220.54 load-calculation value (5000 W or nameplate) vs. the branch circuit the manufacturer specifies (30 A typical, if verified); 4-wire for new installations (250.140 if verified); GFCI per 210.8(D).
- Data: mfr-dryer-range, nec-220-load-calcs, nec-2023-rule-excerpts, nema-receptacle-configs, nec-310-16.

---

## WSZ-011 — motors and equipment

### /calculators/horsepower-to-amps-calculator and /calculators/motor-circuit
- Tool: hp + voltage + phase → table full-load current (Table 430.248 / 430.250, never a formula) → branch-circuit conductor (125%, 430.22), overload (430.32 from the nameplate), short-circuit/ground-fault device maximum (Table 430.52), disconnect (430.110). The motor-circuit page adds several motors (430.24) and the feeder OCPD (430.62).
- Data: nec-430-motors, nec-310-16, nec-110-14c (motor design letters), nec-240-ocpd.

### /calculators/well-pump-calculator (Bing 1,096)
- Tool: pump model or hp/voltage → manufacturer maximum cable length (Franklin AIM Table 11/11A, 2026 edition once read) and NEC branch circuit.
- Data: mfr-well-pump, nec-430-motors.

### /calculators/pool-pump-calculator (Bing 28)
- Tool: pump nameplate or variable-speed model (Pentair/Hayward data) → branch circuit, GFCI (680.21 + 2026 TIA 26-1), bonding (680.26), receptacle distance (680.22).
- Data: mfr-pool-pumps, nec-680-pools-spas, nec-430-motors.

### /calculators/hot-tub-calculator (Bing 1,030)
- Queries: "hot tub wire size" 26 · "what gauge wire for 50a hot tub" 6 · "what size spa disconnect for a 50a circuit".
- Tool: spa breaker size from the manufacturer (50/60 A for 240 V spas per Hot Spring, Marquis, Bullfrog; 15–20 A for 120 V) → conductors and EGC → disconnect location (680.13) and GFCI (680.44 when verified). Never cite 680.42 for 2023 wiring methods, and never 680.43 Exception No. 3 (deleted by TIA 23-16).
- Data: mfr-spas, nec-680-pools-spas, nec-310-16, nec-110-14c, nec-250-grounding.

### /calculators/welder-calculator (Bing 799)
- Tool: welder nameplate I1eff (or I1max and duty cycle) → conductor ampacity per 630.11(A) (multiplier table if no I1eff) → OCPD per 630.12; plus the manufacturer's stated fuse/breaker and conductor (Lincoln/Miller tables) for comparison.
- Data: nec-630-welders, mfr-welders, nec-310-16.

### /calculators/air-conditioner-calculator (Google 1,721; Bing 348)
- Tool: nameplate MCA and MOCP (the only correct inputs) → conductor from MCA (Table 310.16 at the terminal temperature) → breaker ≤ MOCP; plus worked examples from real spec sheets (two brands) and the 2023 DOE SEER2 context if verified.
- Data: nec-440-hvac, mfr-hvac-specs, nec-310-16, nec-110-14c, doe-efficiency-standards.

### /calculators/rv-hookup-calculator (Bing 1,357, 75 clicks)
- Queries: "what size wire to an rv" 16 · "what size wire do you need for a 50amp rv plug" · "rv wire size calculator" · "how to size feeder wire for 50amp, 30amp, 20amp campgrounds rv parks" · "what wire to use for 50 amp rv outlet with 175 ft run".
- Tool: (1) single RV outlet at a house: TT-30R (30 A 125 V) or 14-50R (50 A 125/250 V) → circuit and conductor, GFCI (210.8(F) at dwellings; 551.71(F) at parks), voltage drop for the run; (2) RV park feeder: Table 551.73(A) demand factors by site count, per-site loads.
- Data: nec-551-rv-demand, nec-2023-rule-excerpts, nema-receptacle-configs, nec-310-16, nec-110-14c, conductor-resistance-20c.
