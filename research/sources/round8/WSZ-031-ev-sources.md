# WSZ-031: NEC 2023 Article 625 and the EV charger makers' instructions (round 8)

Retrieved 2026-11-17. Targets: the rules the EV charger guide needs (625.40, 625.41, 625.42, 625.43, 625.44, 625.54), the three makers' circuit tables and wire statements (registry domain mfr-evse) and the IRS 30C page (irs-30c-credit).

## Method

- Same route as WSZ-029 (research/sources/round8/WSZ-029-public-inputs.md): public inputs (PIs) to the 2026 NEC were filed against "NFPA 70-2023", and NFPA's system prints the 2023 section with the submitter's changes marked. Text with no mark, and text struck through, is 2023 text. Marks recovered with `scripts/research/nfpa-markup.py`.
- Each rule below is in at least two PIs from different submitters; 625.41 and 625.54 are also in the First Draft's base text.
- TIAs 23-1 to 23-20 on NFPA 70-2023 (R4-7 §2.1) touch no Article 625 section.
- Maker pages and the IRS page were fetched with curl on 2026-11-17 and read as text (pdftotext for PDFs; HTML tags stripped). No model read them.

## NFPA files (https://docinfofiles.nfpa.org/files/AboutTheCodes/70/)

| file | pages | bytes | last-modified | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| 70_A2025_NEC_P12_PISubmittals.pdf (CMP-12 public inputs) | 372 | 2,938,474 | 2023-11-09 | 5fb8e5faa4614a7f |
| 70_A2025_NEC_P12_FD_PrelimFR.pdf (CMP-12 First Draft) | 173 | 3,915,091 | 2024-02-06 | 002b801eeca5f5e9 |

Page numbers are PDF pages (`#page=N`).

## Findings: NEC 2023

### 625.40, individual branch circuit: VERIFIED-2023

- PI 1366 (Megan Hayes, NEMA, filed Jul 11, 2023), p. 153, and PI 1755 (Kevin Cheong, Jul 31, 2023), p. 154.
- 2023 text: each outlet installed for the purpose of supplying EVSE greater than 16 amperes or 120 volts shall be supplied by an individual branch circuit. Exception: branch circuits may feed multiple EVSEs as permitted by 625.42(A) or (B).
- Agrees with the Leviton 2023 reprint (round 1) and SR-7714 (R4-4).

### 625.41, overcurrent protection: VERIFIED-2023 (first time)

- PI 1026 (Jeremy Gonzalez, Jun 12, 2023), p. 155: unmarked base text, a new Exception underlined. PI 744 (Conrad Ko, Apr 26, 2023), p. 164: the same base, a different Exception underlined.
- First Revision 8269 (First Draft p. 87) strikes the same 2023 text and replaces it with "Continuous Loads".
- 2023 text: overcurrent protection for feeders and branch circuits supplying EVSE and WPTE, including bidirectional EVSE and WPTE, shall be sized for continuous duty and shall have a rating of not less than 125 percent of the maximum load of the equipment. Where noncontinuous loads are supplied from the same feeder, the overcurrent device shall be not less than the noncontinuous loads plus 125 percent of the continuous loads.
- Earlier rounds held 625.41 UNVERIFIED (no SR; Leviton 357 has no 625.41). This closes it.

### 625.42, rating: VERIFIED-2023

- PI 1368 (Hayes, Jul 11, 2023), p. 165, and PI 1757 (Cheong, Jul 31, 2023), p. 167.
- 2023 text: the EVSE shall have sufficient rating to supply the load served; electric vehicle charging loads shall be considered continuous loads for the purposes of the article; service and feeder shall be sized in accordance with the product ratings, unless the overall rating of the installation can be limited through controls as permitted by 625.42(A) or (B).
- (A) Energy management system: where an EMS under 750.30 provides load management of EVSE, the maximum equipment load on a service and feeder shall be the maximum load permitted by the EMS.
- (B) EVSE with adjustable settings: EVSE with restricted access to an ampere adjusting means complying with 750.30(C) shall be permitted; the adjusted rating shall appear on the rating label; such EVSE may have ampere ratings equal to the adjusted current setting.

### 625.43, disconnecting means: VERIFIED-2023

- PI 1120 (Greg Chontow, Jun 18, 2023), p. 182, and PI 1369 (Hayes, Jul 11, 2023), p. 183.
- 2023 text: for EVSE and WPTE rated more than 60 amperes or more than 150 volts to ground, the disconnecting means shall be provided and installed in a readily accessible location; a plaque on the equipment when the disconnect is remote; lockable open in accordance with 110.25.

### 625.44, equipment connection: VERIFIED-2023 (replaces the 2020-only row)

- PI 652 (Craig Toepfer, Apr 18, 2023), p. 199: the whole 2023 section struck through and rewritten. PI 1788 (Cheong, Aug 2, 2023), p. 197: the same 2023 list struck in (A) and (B), (C)'s sentence kept.
- 2023 text: EVSE and WPTE connect by one of the methods in 625.44(A) through (C).
  - (A) Portable equipment, one or more of: (1) nonlocking 2-pole 3-wire grounding receptacle, 125 V single phase, 15 or 20 A; (2) the same at 250 V, 15 or 20 A; (3) nonlocking 2-pole 3-wire or 3-pole 4-wire grounding receptacle at 250 V single phase, 30 or 50 A, or 125/250 V single phase, 30, 50 or 60 A; (4) 2-pole 3-wire grounding receptacle, 60 V dc maximum, 15 or 20 A.
  - (B) Fastened-in-place equipment, one of: (1) nonlocking 2-pole 3-wire grounding receptacle, 125 V or 250 V single phase, up to 50 A; (2) nonlocking 3-pole 4-wire grounding receptacle, 250 V three phase, up to 50 A; (3) nonlocking 3-pole 4-wire grounding receptacle, 125/250 V single phase, 30, 50 or 60 A; (4) 2-pole 3-wire grounding receptacle, 60 V dc maximum, 15 or 20 A.
  - (C) Fixed-in-place equipment: all other EVSE and WPTE permanently wired and fixed in place to the supporting surface.
- Confirms the round-2 note that 2023 adds a 60 A, 125/250 V option to the 2020 list.

### 625.54, GFCI protection: VERIFIED-2023 (closes the D-09 hold)

- PI 1372 (Hayes, NEMA, Jul 11, 2023), p. 219, and PI 1440 (William Snyder, RCC Solutions, Jul 16, 2023), p. 220.
- First Revision 8378 (First Draft p. 99) has the same base and adds "and outlets"; its committee statement: the revision "extends the personnel protection of GFCI to hardwired EVSE". So the 2023 rule covers receptacles only.
- 2023 text: all receptacles installed for the connection of electric vehicle charging shall have ground-fault circuit-interrupter protection for personnel.
- No "in accordance with 210.8" at the end: the SR-7731 Second Draft wording that round 4 marked CONFLICTING is not in the issued text. Both PIs are post-issuance 2023 sources (D-09's condition).

## Findings: makers (mfr-evse), fetched 2026-11-17

| maker | document | url | what it says |
| --- | --- | --- | --- |
| Tesla | Gen 3 Wall Connector, "Circuit Breaker Rating / Maximum Output" (© 2026) | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/1PNA/en-us/GUID-251A1719-ECFA-40C1-8AB8-C71112A66BEC.html | Breaker → max output → kW at 240 V: 60 → 48 → 11.5; 50 → 40 → 9.6; 40 → 32 → 7.6; 30 → 24 → 5.7; 20 → 16 → 3.8; 15 → 12 → 2.8. "For 60°C rated circuit breaker, use minimum 4AWG, 90°C THWN-2-rated copper wire for conductors." "For 75°C rated circuit breaker, use minimum 6AWG, 90°C THWN-2-rated copper wire for conductors." "External disconnect switches are neither required nor recommended." |
| Tesla | Gen 3 Wall Connector Manual, PN 1457768-**-* (PDF created 2026-10-03, 80 pages) | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/1PNA/g3_wc_install_1pna.pdf | Terminal blocks "12-4 AWG (3.5 - 25 mm2), copper only"; "COPPER WIRE TERMINATIONS ONLY"; "Do NOT install cord-and-plug type connections." Same breaker table and conductor lines. |
| Tesla | Universal Wall Connector, same page type | https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/UniversalWC/en-us/GUID-5CC6694C-47C9-4515-A156-A5B21EB81C88.html | Same table and the same 60 °C / 4 AWG and 75 °C / 6 AWG lines. |
| ChargePoint | Home Flex Installation Guide (EN-US), revision history to May 2026, PDF modified 2026-09-11, 32 pages | https://docs.chargepoint.com/ref-docs-sec/content/pdfs/home/cph50/cph50-ig.pdf | p. 4: "Home Flex is a continuous load device. The circuit must be rated for 125% of the maximum load." "The field-wiring terminal is rated to 105 °C (221 °F) and accepts a maximum of 16 mm2 (6 AWG) wire." Circuit → max load, plug-in / hardwire: 70 → 50 no/yes; 60 → 48 no/yes; 50 → 40 yes/yes; 40 → 32 yes/yes; 30 → 24 no/yes; 20 → 16 no/yes. p. 5: "a new, dedicated, non-GFCI two-pole circuit breaker"; note: "If local codes require a GFCI breaker for plug-in installation, ChargePoint recommends a hardwire installation." "A GFCI breaker in the panel causes nuisance tripping." p. i: "Use 90°C wire copper conductors only." Plug types NEMA 14-50 or 6-50. |
| Emporia | Help article "Wire Gauge & Breaker Size", dated July 27, 2026 | https://help.emporiaenergy.com/en/articles/9084258-wire-gauge-breaker-size | "NEMA 14-50 plug-in: Requires a dedicated 50A breaker — supports up to 40A charging"; "Hardwired: Requires a 60A breaker — supports up to 48A charging"; "6 AWG copper wire, rated for 90°C or higher — copper only, aluminum conductors are not compatible"; "Wire terminals accommodate up to 6 AWG; 4 AWG will not fit". |

- The Emporia manual PDF the registry used (603-00009 Rev D) now returns HTTP 404; the help article replaces it. Its breaker rows other than 50 A and 60 A are no longer cited.
- The tables of Tesla and ChargePoint agree at 16, 24, 32, 40 and 48 A; the guide's chart uses those five outputs.

## Findings: IRS (irs-30c-credit), fetched 2026-11-17

- https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit, "Page Last Reviewed or Updated: 26-May-2026": for property bought and placed in service at the main home from January 1, 2023, to June 30, 2026, the credit is 30 % of the cost up to $1,000 per item; claimed on Form 8911.
