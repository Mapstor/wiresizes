# WSZ-035 · Hot tub makers' electrical requirements, re-read 2026-11-17

The three 2026 documents of research/sources/equipment.md §4 (read 2026-10) downloaded again with curl from the makers'
own hosts and searched with `pdftotext -layout`. Every value used by data/verified/mfr-spas.json was found again.

| id | document | url | pdf pages | sha256 (first 16) |
| --- | --- | --- | --- | --- |
| HS-PD | Hot Spring Spa Pre-Delivery Instructions, Highlife Collection 2026 (62982.26 A, Rev A, 01/26) | https://www.hotspring.com/wp-content/uploads/2026/08/hot-spring-highlife-collection-pre-delivery-instruction-2026.pdf | 20 | 492a9d1a25b32588 |
| BF-A | Bullfrog Spas, A Series Owner's Manual v1.9 (2026) | https://www.bullfrogspas.com/wp-content/uploads/2026/08/2026_A-Series-Owners-Manual_English_v1.9.pdf | 33 | afe646e555f7e300 |
| MQ-E | Marquis, ELITE Owner's Manual (2026) | https://www.marquisspas.com/media/177635/2026-elite-owners-manual.pdf | 71 | c80b6c86773cea66 |

- HS-PD pdf p. 12: "All models require a 50 amp, single phase, 230 volt circuit breaker in the main electrical
  service panel"; a four-wire service; "The grounding conductor must be at least #10 AWG"; "ALL WIRING SHOULD BE
  COPPER"; the subpanel with GFCI breakers within sight of the spa, not closer than 5 feet from the water edge.
  (The manual's own code citation, "NEC 680-38 to 41-A-3", is an old edition's numbering and is not repeated.)
- HS-PD pdf p. 11: the 115 V spa needs a dedicated 20 amp, 115 volt circuit with a 20 amp GFCI breaker and #12 AWG
  wire (ground included); a 3 % drop for long runs.
- BF-A pdf p. 28 (printed 27): permanently connected 240 V spas need a GFCI protected, 4-wire, 50A or 60A, single-phase,
  dedicated circuit; a 30A conversion option; cord-connected 120 V spas a 15A dedicated, grounded circuit and outlet.
  Pdf p. 27: all wiring from the disconnect to the spa must be copper; never aluminum.
- MQ-E pdf p. 15 (printed 14): 240V, 60Hz, 50A, three wires (#6 copper) plus ground (#8 copper); breaker or fuse 50A;
  a disconnecting means within sight and at least 5 feet from the inside walls of the spa; a Class A GFCI; copper
  conductors only. Pdf p. 16: 120 V spas 15A, the receptacle at least 5 feet from the spa, the 15-foot GFCI cord.

Not used: NEC Article 680 itself. The 2026-cycle CMP-17 records (public inputs, First Draft, Second Draft; read for
this task) reprint no 2023 text of 680.42 or 680.44, so nec-680-pools-spas stays a GAP and the page states no Article
680 rule; it reports the makers' requirements.

Also read for the NEC references allowlist: public input 1286 (CMP-17 public inputs of the 2026 cycle, pdf p. 411)
reprints 2023 680.40, "Electrical installations at spas and hot tubs shall comply with the provisions of Part I and
Part IV of this article", which places hot tubs in Article 680, Part IV (allowlist row "Article 680", location only).
