# Source authority check, 2026-11-14 (WSZ-006b)

The owner asked for primary, high-authority references everywhere and for any weak source to be replaced
(2026-11-14). This note grades every row of research/data-sources.csv by who published the document and
where the link goes, lists what changed and why the rest stays. Rule references are to the data-sourcing
skill (rule 3: cite what we actually use; rule 5: a deep link that shows the claim, never a homepage).

## Changed

| Domain | Was | Now | Evidence |
|---|---|---|---|
| nema-receptacle-configs | url `https://www.hubbell.com/` (homepage, rule 5) | Hubbell's NEMA straight-blade configuration chart (hubbellcdn.com PDF); tier B; attribution names the chart and the spec sheets | WebFetch 2026-11-14: the chart shows 5-15R and 5-20R at 125 V; 6-20R, 6-30R, 6-50R at 250 V, 2-pole 3-wire grounding; 10-30R and 10-50R at 125/250 V, 3-pole 3-wire; 14-30R and 14-50R at 125/250 V, 3-pole 4-wire grounding. TT-30R is not on it and keeps its Hubbell HBLTT30R spec sheet (data/verified/nema-receptacle-configs.json). |
| mfr-dryer-range | url `https://frigidaire.bynder.com/` (site root, rule 5); Whirlpool range guides read from Lowe's and Home Depot copies | url: Whirlpool's dryer instructions W10267633A (whirlpool.com); endpoint: Whirlpool's freestanding range manual W11640146A (whirlpool.com, 2023) | WebFetch 2026-11-14 of W11640146A: 8.8–16.5 kW at 120/240 V (7.8–12.5 kW at 120/208 V) → 40 or 50 A; 16.6–22.5 kW (12.6–18.5 kW) → 50 A; NEMA 10-50R (3-wire) or 14-50R (4-wire, recommended); direct wiring 8 gauge copper or 6 gauge aluminum; 40 A copper 4-wire minimum 2 No. 8, 1 No. 10 white, 1 No. 8 green. Same table as the retailer-hosted W10403811C and W10575959A, which stay in mfr-equipment.json as superseded for citation. |
| nec-250-grounding | notes only | notes record why the link stays on the City of Salinas copy | NFPA's own page for the fact sheet (go.nfpa.org/l/14662/2020-07-14/8gftjx, WebFetch 2026-11-14) takes contact details and emails the file, so it cannot be a deep link. The city copy is NFPA's PDF; cityofsalinas.org's path answers 302 to the registry url. Table 250.122 is also in NFPA's own 2026 revision record SR-8360 (the row's endpoint). |

No value on any page changes, and no rendered page cites the two re-pointed rows yet (their pages are held for
WSZ-008 to WSZ-011), so no page date moves.

## Kept, with the reason

- Government and science primaries: awg-geometry and conductor-resistance-20c (NIST Handbooks 100 and 109),
  nist-sp811-conversions (NIST), eia-electricity-price and power-definitions (EIA, DOE, NIST), safety-stats (CPSC,
  USFA, BLS), irs-30c-credit (IRS), doe-efficiency-standards (eCFR), nec-adoption (each state's own record).
- NFPA's own documents: nec-310-16, nec-310-15-corrections, nec-310-12, nec-continuous-load, nec-220-load-calcs,
  nec-110-14c, nec-300-5-burial, nec-430-flc, nec-240-ocpd, nec-240-4-d (NFPA docinfofiles: the 2023 text as base text
  of 2026-cycle drafts, ballots and public inputs), nec-2026-issuance (NFPA Standards Council minutes).
- NFPA-licensed reprints of the issued 2023 text (Leviton Captain Code, Eaton): kept beside NFPA's drafts because they
  print the issued code, which a draft cannot prove, and carry NFPA's permission notice. NFPA's own free reading room
  for NFPA 70 needs a sign-in, so it cannot be a link a reader or a check can open.
- nec-2026-edition: Minnesota's electrical licensing regulator's summary of the issued 2026 code (D-32). Government;
  NFPA's own change summaries for 2026 were not found as open documents.
- us-nominal-voltages: North Carolina Utilities Commission Rule R8-17, a regulator's rule that adopts ANSI C84.1
  (C84.1 itself is sold, not published openly).
- iec-60228-metric-sizes: IEC's own webstore page; the values were read from IEC's official sample pages.
- Manufacturer documents for the manufacturer's own equipment (mfr-evse, mfr-spas, mfr-welders, mfr-pool-pumps,
  mfr-water-heaters, mfr-hvac-specs, mfr-dryer-range): the manufacturer is the primary source for what its product
  needs. After this change no registry url points at a retailer copy or a site root.

## Open (recorded in DEVLOG §5)

- Evidence-only links to trade press in data files for held pages: ecmweb.com (TIA 1800 ballot results;
  Article 225 basics) in nec-680-2023.json and nec-225-2023.json, ecmag.com (rooftop ambient) and the ACCA blog
  (an appellant's statement) in nec-2023-rules-round2.json, IAEI Magazine (proposed 680 changes) in
  nec-680-2023.json, and 2020-edition Leviton reprints in nec-2023-rules-round2.json. Before WSZ-008 to WSZ-011
  publish a claim that rests on one of them, replace it with NFPA's own record (TIA log and ballot, docinfofiles).
- mfr-well-pump (candidate): its 2015 AIM values come from a third-party mirror; the blocker stays as recorded.
- power-definitions names three publishers and links one document (§5, WSZ-019 review): split into one row per
  document when the three-phase calculator and the converters are rebuilt.
