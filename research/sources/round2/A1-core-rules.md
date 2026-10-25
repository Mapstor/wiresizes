# A1: core NEC rules (110.14(C), continuous loads, voltage-drop notes, NM/UF, 310 rules, 110.15, 110.26)

Agent A1, wiresizes.com primary-sourcing round 2. Retrieval date for every item: 2026-10-20.
Target edition: NFPA 70-2023. Budget used: 20/20 WebSearch; 6/6 WebFetch calls to docinfofiles.nfpa.org (2 of those were re-reads of the cached copy; no HTTP 429 received).

**Read this first: two limits on the method**
1. WebFetch's summarizer will not quote more than 125 characters at a time. No source could be reproduced in full. Every "quote" below is an excerpt of 125 characters or less, copied exactly as the tool returned it. Where the tool summarized instead of quoting, the item says "extractor summary".
2. The NFPA documents reached are A2025-cycle (2026 NEC) First Draft "working draft" PDFs. The A2025 cycle's Public Inputs are titled "Public Input No. … -NFPA 70-2023", so the base text is NFPA 70-2023. Text extraction flattens strike-through and underline, so deleted and inserted words run together. An excerpt is marked VERIFIED-2023 only when it is clearly unrevised: no run-together artifact, and the committee statement confines the revision to other words. Everything else from these drafts is VERIFIED-draft.

## Status matrix

| # | Ref (2023 numbering as seen) | Status | Best source seen | Key values seen |
|---|---|---|---|---|
| 1 | 110.14(C)(1)(a), (C)(1)(b), (C)(2) | UNVERIFIED (tier-4 text only) | Mike Holt forum post (21 Mar 2023) pasting the existing text into a Public Input draft | 100 amperes or less; 14 AWG through 1 AWG; 60°C (140°F); 75°C (167°F); motors "B, C, or D" |
| 2 | 210.19(A) intro, (1), (2), exceptions | PARTIAL. Intro sentence VERIFIED-2023. (1) and (2) VERIFIED-draft (extractor summary). Exceptions partial. | NFPA A2025 CMP-2 working draft, FR-8210 | "larger of the following"; 125 percent (summary only) |
| 3 | 210.20(A) + Exception | VERIFIED-draft (partial) | FR-8210 | 125 percent (the extractor called its own quote "paraphrase-level"); 100 percent-listed assembly exception |
| 4 | 215.2(A)(1), 215.3 | UNVERIFIED | none (only cross-references in Annex D Example D3(a)) | none |
| 5 | 230.42(A) | UNVERIFIED | none | none |
| 6 | 625.41 | UNVERIFIED for 2023 | NYSERDA checklist, a government document that names no edition and is probably pre-2023 | 125 percent of the maximum load |
| 7 | Voltage-drop informational notes (210.19, 215.2) | UNVERIFIED for 2023 | Schneider 2017-NEC reproduction (no NFPA notice); forum post from 2021 | 3 percent / 5 percent; "Informational Note No. 4" (pre-2023) |
| 8 | 334.80; 340.80 | UNVERIFIED for the NEC base text. Massachusetts amendment VERIFIED (MA only). | 527 CMR 12.00 (MA, 2023 NEC amendments) | MA: 90°C (194°F); 60°C (140°F) in thermal insulation |
| 9 | 310.14(A)(2) Exception | VERIFIED-2023 for the values; VERIFIED-draft for the 2026 wording | FR-7955 (CMP-6) | 3.0 m (10 ft); 10 percent |
| 10 | 310.15(B)(2) rooftop | **VERIFIED-2023 (base text). CONTRADICTS the brief: 19 mm (3/4 in.), not 7/8 in.** | FR-7961 (CMP-6) | 19 mm (3⁄4 in.); 33°C (60°F); XHHW-2 exception; Table 310.15(B)(1)(1) |
| 11 | 310.15(E); 310.15(F) | (E) VERIFIED-draft (2026 reorganization); 2023 wording UNVERIFIED. (F) UNVERIFIED. | FR-8035 | (E) circuit types listed; no (F) text |
| 12 | 110.15; 230.56 | UNVERIFIED | none | none |
| 13 | 110.26 intro (door rule); Table 110.26(A)(1); (A)(2); (A)(3) | Intro VERIFIED-2023 (Leviton, with NFPA permission notice). Table, (A)(2), (A)(3): UNVERIFIED, and tier-4 sources CONFLICT on the voltage bands. | Leviton Captain Code 2023 | 610 mm (24 in.) wide and 2.0 m (6-1/2 ft) high (door-impediment rule) |

Extra items seen along the way, which may be useful:
- 625.42 (2023, Leviton with NFPA notice): EV charging loads are continuous. VERIFIED-2023.
- New Article 627 in the 2026 First Draft has 627.41 with the same 125 percent structure. VERIFIED-draft.
- No 2023 TIA (23-1 through 23-13) amends any target section. VERIFIED-2023 (NFPA TIA compilation hosted by NJ DCA).

---

## Sources used (title, publisher, edition/date, URL, notice)

- **N1.** "Working Draft of NEC Code-Making Panel 1 Meeting Output". NFPA, Revision Cycle A2025. Meeting Jan 24–26, 2024; printed 2/6/24 2:21 PM. Marked "Subject to Revision – Not for Publication". No copyright notice visible. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P01_FD_PrelimFR.pdf
- **N2.** "WORKING DRAFT OF NEC CODE-MAKING PANEL 2 MEETING OUTPUT". NFPA, A2025. Meeting Jan 15–20, 2024; printed 2/5/24 11:45 AM. No copyright notice visible. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf
- **N6.** "NEC Code-Making Panel 6 First Draft Meeting Output". NFPA, A2025. Meeting Jan 18–20, 2024. The whole text is 91,636 characters and was read in full. It holds 31 FRs and the last one, FR-8040 (330.10(B)), is cut off in the source. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf
- **N12.** "NEC CMP-12 First Draft Meeting Output". NFPA, A2025. Meeting Jan 21–23, 2024; captured 2/2/2024. Only the first 21 of 138 pages were visible. https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_FD_PrelimFR.pdf
- **T.** "National Electrical Code (NEC), 2023 Edition, NFPA 70, Tentative Interim Amendments" (TIAs 23-1 to 23-13), NFPA documents hosted by New Jersey DCA. Each TIA carries "Copyright © [year] All Rights Reserved … NATIONAL FIRE PROTECTION ASSOCIATION". https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf
- **L.** Captain Code 2023 Web Portal, Leviton Manufacturing Co., © 2023. Tier 2.
  - Permission notice on the home and about pages: "Material taken from the National Electrical Code® is reprinted with permission from NFPA 70® - 2023 edition," / "National Electrical Code®, Copyright 2022, National Fire Protection Association®, Quincy, MA. All rights reserved."
  - Variant on the section pages: "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition."
  - Pages used: https://captaincode2023.leviton.com/node/301 (110.26) and https://captaincode2023.leviton.com/node/357 (625.40/625.42/625.43).
  - The index (3 pages, https://captaincode2023.leviton.com/code-articles) has no entries for 110.14, 110.15, 210.19, 210.20, 215.2, 215.3, 230.42, 230.56, 310.14, 310.15, 334.80, 340.80 or 625.41.
- **MA.** 527 CMR 12.00: Massachusetts Electrical Code (Amendments), Board of Fire Prevention Regulations. Dated 2/17/23 (Mass. Register #1489). Amends "the 2023 National Electrical Code (NEC), as published by the National Fire Protection Association (NFPA) as NFPA 70". https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download
- **NC.** "Proposed North Carolina Amendments to 2023 NEC", Electrical Adhoc Committee, 28 Apr 2023. Base: NFPA 70-2023, first printing. https://www.ncosfm.gov/b-3-2023-nec/open
- **NY.** NYSERDA "Quality and Market Standards Checklist Specifications — August 2024" (DCFC program). No NEC edition named. https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/ChargeNY/DCFC-Program-Inspection-Checklist.pdf
- Tier 4, corroboration only:
  - Mike Holt forum threads: PI 110.14(C)(1), PI 210.19(A), PC 334.80(A), voltage drop.
  - Schneider "North America Standards Reference" (2017 NEC, © 2018 Schneider Electric, no NFPA notice).
  - EC Magazine articles from 2001, 2015, 2016 and 2026.
  - EC&M Code Quiz (2025, based on the 2023 NEC).
  - IAEI articles, including an NFPA-staff column (no permission notice).
  - Inspectapedia PDF (an UpCodes print, edition not stated).
  - open-exam-prep.com.
  - CSE magazine.

---

## 1. 110.14(C) Temperature Limitations: UNVERIFIED

**Tier 1–3 evidence**
- None of the reproduced 110.14(C) text came from a tier 1–3 source.
- N6 (2026 First Draft, CMP-6) has a cross-reference, apparently under 310.14(A): "Informational Note: See 110.14(C) for conductor temperature limitations due to termination provisions." So the section number 110.14(C) still exists in the 2026 First Draft.
- N2 (FR-8210, 210.19(A)) refers to "separately installed pressure connections under 110.14(C)(2)" (extractor summary). That confirms (C)(2) as the pressure-connector paragraph in the 2023 base text.
- N1, the CMP-1 First Revisions document, showed no FR on 110.14 in its visible portion. Visible: FR-9168, FR-9213, FR-9025 and a "Revised by FR-8939" comment. The document was cut off inside Table A.1(a). **Whether the 2026 edition changed or moved 110.14(C) is not established.**

**Tier-4 corroboration.** Source: Mike Holt forum, "PI 110.14(C)(1)", post by wwhitney, 21 Mar 2023, in the "Proposals/Comments for the next NEC cycle" board. It pastes the existing text into a Public Input draft for the 2026 cycle, so the base is presumably 2023. URL: https://forums.mikeholt.com/threads/pi-110-14-c-1.2573319
- (C)(1) intro: "The determination of termination provisions of equipment shall be based on 110.14(C)(1)(a) or (C)(1)(b)."
- (C)(1)(a): "Termination provisions of equipment for circuits rated 100 amperes or less" … "marked for 14 AWG through 1 AWG conductors"
- (a)(1): "Conductors rated 60°C (140°F)."
- (a)(2): "Conductors with higher temperature ratings, provided the ampacity of such conductors". The rest was struck in the post. A 2021 forum post quoting the 2020 NEC has the same fragment "Conductors with higher temperature ratings, provided the ampacity of such conductors is determined".
- (a)(3): "Conductors with higher temperature ratings if the equipment is listed and identified for use with such conductors."
- (a)(4): "For motors marked with design letters B, C, or D," … "conductors having an insulation rating of 75°C (167°F) or higher shall be permitted to be used,"
- (b)(1): "Conductors rated 75°C (167°F)."
- (b)(2): "Conductors with higher temperature ratings, provided the ampacity of such conductors does not exceed the 75°C (167°F)"

Other tier-4 sources:
- open-exam-prep (edition not stated) summarizes the motor letters as "B, C, or D".
- EC Magazine 2015 (C. R. Miller) paraphrases (a)(4) as design letters B, C, or D, and (b) as "over 100 amperes" / "larger than 1 AWG".

**Caution: the motor design-letter list has changed across editions.** A 2001 EC Magazine article on the 1999 NEC quotes "Motors marked with design letters B, C, D, or E and designed to NEMA standards". The 2023 letter list stays UNVERIFIED until a primary source shows it.

## 2. 210.19 branch-circuit conductor minimum ampacity: PARTIAL

**Source.** N2, FR-8210-NFPA 70-2024 (Global Input). It revises 210.4(A), 210.4(C), 210.11(B), 210.12(A), 210.18, 210.19(A), 210.20, 210.20(A), 210.20(C) and Annex D Example D3(a). Committee statement: "This revision applies consistent usage of the defined term “branch circuit overcurrent protective device." So only the OCPD wording was revised.

- **210.19(A) intro (VERIFIED-2023):** "Branch-circuit conductors shall have an ampacity not less than the larger of the following". The extractor says the sentence goes on to refer to 110.14(C) for equipment terminations. The tier-4 forum paste of the 2023 text (24 Mar 2023) matches exactly.
- **Item (1) (VERIFIED-draft, extractor summary):** branch circuits with continuous loads need an ampacity of at least the noncontinuous load plus 125 percent of the continuous load, per 310.14.
  - The forum paste (tier 4) has the verbatim phrase "noncontinuous load plus 125 percent of the continuous load in accordance with 310.14."
- **Item (2) (VERIFIED-draft, extractor summary):** the ampacity must cover the maximum load after adjustment or correction factors, per 310.15.
  - Forum paste: "the maximum load to be served after the application of any adjustment or correction factors".
- **Exception to (1)** (run-together, revised): "If the assembly, including the overcurrent devices protecting the branch circuitsbranch-circuit OCPDs". The extractor says it continues to allow the sum of continuous and noncontinuous loads where the assembly is listed for 100 percent operation.
  - Forum paste: "is listed for operation at 100 percent of its rating".
- **Exception to (1) and (2)** (extractor summary): covers a portion of a branch circuit connected at both ends to separately installed pressure connections per 110.14(C)(2), and that portion may not extend into the enclosures holding those terminations.
- **Exception for grounded conductors not connected to an OCPD:** not seen in either source. UNVERIFIED.
- **Numbering.** The 2023 structure appears to be 210.19(A), headed "(A) General." in the forum paste, with list items (1) and (2). It does not appear to be (A)(1)(a)/(b). Supporting evidence:
  - The (a)/(b) form is the older layout. The Schneider page built on the 2017 NEC says "the larger of 210.19(A)(1)(a) or (b)".
  - The IAEI Winter 2026 article cites "210.19(A)(1)/(A)(2), 215.2(A)(1)/(A)(2)".
  - EC Magazine (Aug 2026) cites "210.19(A)(1) or (2)".
  - Open question: an Aug 2024 forum Public Comment refers to "210.19(A)(1)(a)". The 2026 First Draft may have re-split the section. Not verified.
- **Informational notes,** including the voltage-drop note: not seen in any 2023 source (see target 7).

**2026 note.** FR-8210 replaces "overcurrent devices protecting the branch circuits" with the defined term "branch-circuit OCPDs" (VERIFIED-draft).

## 3. 210.20(A) branch-circuit OCPD: VERIFIED-draft (partial)

Source: N2, FR-8210. The draft text mixes the old and new OCPD terms.
- 210.20 intro: "shall be protected by branch-circuit overcurrent protective devices OCPDs that have a rating or setting". The intro also refers to 210.20(A) through (D).
  - The first N2 read reported the scope phrase "not exceeding 1000 volts ac or 1500 volts dc nominal". Whether that phrase is 2023 base text or a 2026 insertion cannot be told apart.
- 210.20(A) main rule: the extractor returned "the rating of the branch-circuit overcurrent device OCPD shall not be less than the noncontinuous load plus 125 percent of the continuous load." It labelled this its own "paraphrase-level summary". **The 125 percent value was seen, but the wording is not verbatim.**
- Exception: "Exception: Where the assembly, including the branch-circuit OCPDs overcurrent devices protecting the branch circuit(s)". It continues to allow the sum of continuous and noncontinuous loads where the assembly is listed for 100 percent operation.
- 210.20(C) (context): "shall not exceed that specified in the applicable articles referenced in Table 240.3 for equipment".
- Annex D Example D3(a), in the same FR (the example's wording, not code text): "must accommodate 125% of the continuous load, plus the noncontinuous load". It cites 215.2(A), 215.2(B) and the 215.3 Exception, and concludes with a 150 A standard size, a 125 A option for 100 percent-listed assemblies, and 1/0 AWG and 2/0 AWG feeders (extractor summary).

## 4. 215.2(A)(1) and 215.3 feeders: UNVERIFIED

- No 215.2 or 215.3 text was seen in any source.
- Indirect evidence:
  - The N2 Annex D example cross-references "215.2(A), 215.2(B), and 215.3 Exception".
  - A forum PI author (tier 4) says he filed near-identical PIs for 215.2(A) and 230.42(A), "changing only the item headings". That suggests both use the same (1)/(2) layout as 210.19(A) in 2023. Not verified.
  - Mike Holt's "Changes to the NEC 2023" table of contents (tier 4) lists only 215.15 and 215.18 for Article 215. That suggests no major 2023 change to 215.2 or 215.3. Not verified.

## 5. 230.42(A) service-entrance conductors: UNVERIFIED

No text was seen. The only lead is the forum note about a near-identical PI on 230.42(A) (tier 4).

## 6. 625.41 EVSE overcurrent protection: UNVERIFIED for 2023

**Government quote (NYSERDA, Aug 2024; no edition named):**
- "Overcurrent protection for feeders and branch circuits supplying equipment shall be sized for continuous duty"
- The rating must be "not less than 125 percent of the maximum load." The surrounding wording is a paraphrase.
- The same checklist's 625.40 reads "Each outlet installed for the purpose of charging electric vehicles shall be supplied by an individual branch circuit." Leviton's 2023 reproduction of 625.40 is different: "Each outlet installed for the purpose of supplying EVSE greater than 16 amperes or 120 volts" … "shall be supplied by an individual branch circuit." **So the NYSERDA quotes probably come from a pre-2023 edition.**

**625.42 (VERIFIED-2023; Leviton, with NFPA notice):** "Electric vehicle charging loads shall be considered to be continuous loads for the purposes of this article." Leviton's page skips from 625.40 to 625.42, so 625.41 was not reproduced.

**Tier 4.** The EC&M Code Quiz (3 Apr 2025, "Based on the 2023 NEC") gives the answer "Rating of 125% of the maximum load of the equipment."

**2026 First Draft (N12, FR-9039, new Article 627; VERIFIED-draft).** 627.41 copies the 625.41 structure:
- "shall be sized for continuous duty"
- "a current rating of not less than 125 percent of the maximum load of the equipment"
- "Where noncontinuous loads are supplied from the same feeder, the overcurrent device shall have a current rating"
- "of not less than the sum of the noncontinuous loads plus 125 percent of the continuous loads."

625.41 itself was not in the visible pages of N12 (21 of 138).

## 7. Voltage-drop informational notes: UNVERIFIED for 2023

- **Schneider "NEC 210.19" page** (2017 NEC; © 2018 Schneider Electric; no NFPA notice). The note is unnumbered and labelled "NOTE:":
  - "sized to prevent voltage drop exceeding 3 percent at the farthest outlet"
  - "where the maximum total voltage drop on both feeders and branch circuits to the farthest outlet does not exceed 5 percent"
  - Status: VERIFIED-other-edition (2017) would require a tier 1–3 source. This is tier 4, so corroboration only.
  - URL: https://productinfo.se.com/na-std-ref/viewer/5c0fee4b347bdf0001de4d55/5c0fee5b347bdf0001de4d6b/r/NEC210.19ConductorsMinimumAmpacityA-F20BBAC1
- **Mike Holt forum post, 6 Dec 2021** (no edition named; probably 2020). It labels the note "Informational Note No. 4" to 210.19(A):
  - "sized to prevent a voltage drop exceeding 3 percent at the farthest outlet"
  - "the maximum total voltage drop on both feeders and branch circuits to the farthest outlet does not exceed 5 percent"
  - URL: https://forums.mikeholt.com/threads/voltage-drop-2-or-3-or-5.2564977/
- **2023 note numbers and wording for 210.19 and 215.2:** UNVERIFIED. The 215.2 feeder note (3 percent feeder / 5 percent total) was not seen at all.

## 8. 334.80 (NM) and 340.80 (UF): UNVERIFIED for NEC base text

**NEC 334.80 base text (2023):** not seen in any tier 1–3 source.

**Tier 4: Mike Holt forum, Public Comment on "334.80(A)", 24 Aug 2024 (2026 cycle).** It quotes the existing text (2023 or First Draft; edition not labelled) and references PI 494-NFPA 70-2023:
- "The ampacity shall not exceed that of a 60°C (140°F) rated conductor."
- "The 90°C (194°F) rating shall be permitted to be used for ampacity adjustment and correction calculations,"
- The thread title suggests 334.80 was split into lettered subdivisions ((A)…) in the 2026 First Draft. VERIFIED: no.
- URL: https://forums.mikeholt.com/threads/pc-334-80-a-nm-temperature-limits.2582807/post-2941704

**Government, edition not stated:** WA L&I Electrical Currents, Oct 2022: "NEC® 334.80 requires the ampacity of each conductor to be adjusted in accordance with Article 310." This is a paraphrase.

**Massachusetts amendment (tier 3, VERIFIED, MA only).** 527 CMR 12.00 replaces 334.80 and deletes its second paragraph:
- "Type NM, and NMC cables shall have conductors rated at 90°C (194°F)."
- "Where installed in thermal insulation, the ampacity of conductors shall be that of 60°C (140°F) conductors."
- MA also replaces Table 310.15(C)(1) with these adjustment factors (extractor summary of exact figures): 4–6 conductors 80%, 7–24 70%, 25–42 60%, 43 and above 50%. **This is a state deviation the site may need to flag.**

**340.80 (UF):** its own text was not seen. N6 (2026 First Draft) Table 310.4(1), footnote 4: "The ampacity of Type UF cable shall be limited in accordance with 340.80." Table 310.4 was revised by FR-7931, so this is VERIFIED-draft.

**Panel note.** N6, the CMP-6 First Draft, holds FRs on the Type NM and NMC definitions (FR-8047, FR-8048) and on Articles 320–330. In the A2025 cycle the cable articles therefore sit with CMP-6, not CMP-3 as the brief assumed. N6 contained no 334.80 or 340.80 FR.

## 9. 310.14(A)(2) Exception (10 ft / 10 percent)

Source: N6, FR-7955. Committee statement: "Editorial changes were made for clarity."
- Run-together base and new text: "or 10 percent of the total circuit.the following:". This shows the base sentence ended "…or 10 percent of the total circuit."
- The extractor says the working text shows both the older wording ("lesser of 3.0 m (10 ft) or 10 percent") and the new list form.
- 2026 First Draft list form (VERIFIED-draft):
  - "if the total portion(s) of the circuit with lower ampacity does not exceed the lesser of the following:"
  - "(1) 3.0 m (10 ft)"
  - "(2) 10 percent of the total circuit."
- "Where different ampacities resulting from 310.15(B) or 310.15(C) calculations apply to portions of a circuit," may be base text or a 2026 insertion. Ambiguous, so UNVERIFIED for 2023.
- **Values VERIFIED-2023:** 3.0 m (10 ft) and 10 percent, the lesser of the two.

## 10. 310.15(B)(2) Rooftop: VERIFIED-2023 (base text)

Source: N6, FR-7961. Committee statement: "The words “ampacity adjustment” have been replaced with “temperature correction”". The main sentence carries no run-together artifacts.
- "For raceways or cables exposed to direct sunlight on or above rooftops where the distance"
- "above the roof to the bottom of the raceway or cable is less than 19 mm (3" [line break before "⁄4"]
- "⁄4 in.), a temperature adder of 33°C (60°F) shall be added to the outdoor temperature"
- "applicable ambient temperature for application of the correction factors in Table 310.15(B)(1)(1) or Table"
- "Exception: Type XHHW-2 insulated conductors shall not be subject to this ampacity" + "adjustment temperature correction ." The run-together shows the 2026 First Draft swapping "ampacity adjustment" for "temperature correction".

**CONTRADICTS the brief.** The 2023 base text uses 19 mm (3⁄4 in.), not 7/8 in.
- 7/8 in. is the 2017 text. EC Magazine (Mark C. Ode, 15 Oct 2016), quoting the proposed 2017 text: "raceways or cables shall be installed a minimum distance above the roof" … "of 7⁄8 of an inch" … "a temperature adder of 33°C or 60°F shall be added to the outdoor temperature".
- Which edition, 2020 or 2023, changed the figure to 3/4 in. is not verified.

## 11. 310.15(E) and (F)

**310.15(E)** (N6, FR-8035). Statement: "This section has been reorganized to provide clarity and to comply with the NEC Style Manual." Reorganized 2026 First Draft text (VERIFIED-draft; the "�" stands for a lost "ti" ligature):
- "(1) A 2 wire circuit consis�ng of one ungrounded and one neutral conductor."
- "(2) A 3 wire circuit consis�ng of two ungrounded conductors and the neutral conductor of a 4-wire, 3"
- "(3) A 4-wire, 3-phase wye circuit where the major por�on of the load consists of nonlinear loads."
- "shall not be required to be counted when applying the provisions of 310.15(C)(1)."

The lead-in that says which items count was not visible. The 2023 wording was not cleanly separable; the extractor saw fragments such as "two phase … conductors" and "On a" run together. **2023 text: UNVERIFIED.**

**310.15(F)** (grounding and bonding conductors not counted): not in N6 and not revised in the 2026 First Draft. No text seen. UNVERIFIED.

## 12. 110.15 high-leg marking; 230.56: UNVERIFIED

Neither section appeared in any document fetched. No values are recorded.

## 13. 110.26 working space

**110.26 main paragraph, 2023 (VERIFIED-2023; Leviton L, with NFPA permission notice; Leviton notes this text was revised in 2023):**
- "Working space, and access to and egress from working space, shall be provided and maintained about all electrical equipment"
- "to permit ready and safe operation and maintenance of such equipment."
- "Open equipment doors shall not impede access to and egress from the working space."
- "Access or egress is impeded if one or more simultaneously opened equipment doors restrict working space access"
- "to be less than 610 mm (24 in.) wide and 2.0 m (6-1/2 ft) high." Leviton writes 6½ as "6-1/2".

**Table 110.26(A)(1), (A)(2) width, (A)(3) height: UNVERIFIED for 2023, and tier-4 sources CONFLICT on the voltage bands.**

Pull 1, as data. Source: Inspectapedia PDF, which is an UpCodes print with no edition stated; it cites NFPA 70E-2018 in an informational note, which suggests 2020. Tier 4.

| Nominal Voltage to Ground | Condition 1 | Condition 2 | Condition 3 |
|---|---|---|---|
| 0–150 | 900 mm (3 ft) | 900 mm (3 ft) | 900 mm (3 ft) |
| 151–600 | 900 mm (3 ft) | 1.0 m (3 ft 6 in.) | 1.2 m (4 ft) |
| 601–1000 | 900 mm (3 ft) | 1.2 m (4 ft) | 1.5 m (5 ft) |

Pull 2, raw lines exactly as extracted:
```
Nominal Voltage to Ground Minimum Clear Distance
Nominal Voltage to Ground Condition 1 Minimum Clear Distance Condition 2 Condition 3
Condition 1 Condition 2 Condition 3
0—150 900 mm (3 ft) 900 mm (3 ft) 900 mm (3 ft)
151—600 900 mm (3 ft) 1.0 m (3 ft 6 in.) 1.2 m (4 ft)
601—1000 900 mm (3 ft) 1.2 m (4 ft) 1.5 m (5 ft)
```
- The two pulls of this one source match.
- Width from the same print: "the width of the equipment or 762 mm (30 in.), whichever is greater."
- Height from the same print: "to a height of 2.0 m (6 / ft) or the height of the equipment, whichever is greater." The fraction was lost in extraction.

**Cross-check, which does NOT match.** open-exam-prep (no edition named; summary) shows two rows only:
- "0-150 V": 3 ft / 3 ft / 3 ft
- "151-1000 V": 3 ft / 3.5 ft / 4 ft

**Other evidence**
- The IAEI "NFPA Code Talk" column by Dean Austin, NFPA staff, Winter 2025, written on the 2023 NEC, paraphrases the depths as ranging from 3 to 5 ft, the width as 30 in. and the height as 6.5 ft. It also says 110.26 does not cover equipment over 1000 V, which falls under Part III. A 5 ft depth implies the 2023 table still has a row reaching 1.5 m (5 ft), which argues against a two-band "151–1000" table. This is paraphrase without a permission notice, so it is not verification.
- IAEI 2013 (2011 NEC): 0–150 and 151–600 bands only (paraphrase).
- Trane support: "151 and 600V" (tier 4).

**2026 note.** N1 shows the 110.26(A) intro under FR-9213, described as "voltage-rating clarifications across Articles 110 Parts II–IV". The table and voltage bands may change in 2026. Not seen.

**State deviations seen (tier 3)**
- MA adds 110.26(A)(1)(d), "Adequate Accessibility. By special permission, smaller spaces may be permitted where it is judged" … "that the particular arrangement of the installation will provide adequate accessibility."
- NC deletes 110.26(E)(2)(c). Its base text includes "extending from grade to a height of 1.8 m (6 ft) above the equipment".

## TIAs

T: no 2023 TIA (23-1 … 23-13) amends 110.14, 110.15, 110.26, 210.19, 210.20, 215.2, 215.3, 230.42, 230.56, 310.14, 310.15, 334.80, 340.80 or 625.41. TIA 23-8 (300.26) only cites 310.14.

---

## Machine-readable

```json
{"ref": "110.14(C)(1)(a),(C)(1)(b),(C)(2)", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Equipment terminations for circuits rated 100 amperes or less, or marked for 14 AWG through 1 AWG, are used with 60°C conductors or with higher-rated conductors sized at their 60°C ampacity, unless the equipment is listed and identified for higher-rated conductors; a motor item allows 75°C. Over 100 amperes or larger than 1 AWG, terminations are used with 75°C conductors or higher-rated conductors limited to 75°C ampacity. (Tier-4 text only.)", "values": {"small_circuit_threshold": "100 amperes or less", "small_conductor_range": "14 AWG through 1 AWG", "small_temp": "60°C (140°F)", "large_temp": "75°C (167°F)", "motor_design_letters_tier4": "B, C, or D", "pressure_connector_paragraph": "110.14(C)(2) (cross-reference seen in NFPA FR-8210 extractor summary)"}, "quote": "Termination provisions of equipment for circuits rated 100 amperes or less | marked for 14 AWG through 1 AWG conductors | Conductors rated 60°C (140°F). | For motors marked with design letters B, C, or D, | Conductors rated 75°C (167°F).", "source_url": "https://forums.mikeholt.com/threads/pi-110-14-c-1.2573319", "source_title": "Mike Holt forum: PI 110.14(C)(1) (wwhitney, 21 Mar 2023) - tier 4", "permission_notice": null, "corroboration": [{"url": "https://open-exam-prep.com/study-guides/ak-electrician/ch03/ch03-sec02", "matches": true}, {"url": "https://www.ecmag.com/magazine/articles/article-detail/codes-standards-general-installation-requirements-part-ix", "matches": true}, {"url": "https://www.ecmag.com/magazine/articles/article-detail/codes-standards-temperature-limitations-connections-must-not-be-exceeded", "matches": false}], "retrieved": "2026-10-20", "notes": "2001 ECmag (1999 NEC) quotes design letters 'B, C, D, or E' - letters have varied by edition. 2026 change/move not established (CMP-1 FR doc only partly visible); 2026 FD CMP-6 note still cites 110.14(C)."}
```
```json
{"ref": "210.19(A)", "edition": "2023", "status": "VERIFIED-2023 (intro sentence only); items (1)/(2) VERIFIED-draft via extractor summary; grounded-conductor exception and informational notes UNVERIFIED", "rule_summary": "Branch-circuit conductors need an ampacity not less than the larger of: (1) the noncontinuous load plus 125 percent of the continuous load, and (2) the maximum load after adjustment or correction factors. Exceptions cover assemblies listed for 100 percent operation and portions connected at both ends to separately installed pressure connections.", "values": {"continuous_multiplier": "125 percent", "structure_2023": "210.19(A) 'General.' with items (1) and (2)", "exception_100pct_assembly": "listed for operation at 100 percent of its rating (tier-4 verbatim)"}, "quote": "Branch-circuit conductors shall have an ampacity not less than the larger of the following", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf", "source_title": "NFPA, Working Draft of NEC CMP-2 Meeting Output (A2025 First Draft), FR-8210-NFPA 70-2024", "permission_notice": null, "corroboration": [{"url": "https://forums.mikeholt.com/threads/pi-210-19-a-number-one.2573389", "matches": true}, {"url": "https://productinfo.se.com/na-std-ref/viewer/5c0fee4b347bdf0001de4d55/5c0fee5b347bdf0001de4d6b/r/NEC210.19ConductorsMinimumAmpacityA-F20BBAC1", "matches": false}], "retrieved": "2026-10-20", "notes": "Schneider page is 2017 NEC with (A)(1)(a)/(b) numbering - mismatch is an edition difference. 2026 FD: OCPD term change only (FR-8210)."}
```
```json
{"ref": "210.20(A)", "edition": "2023 base / 2026 First Draft", "status": "VERIFIED-draft (partial)", "rule_summary": "The branch-circuit OCPD rating must be not less than the noncontinuous load plus 125 percent of the continuous load, except where the assembly including its OCPDs is listed for operation at 100 percent of its rating.", "values": {"continuous_multiplier": "125 percent (extractor-summarized, not verbatim)", "exception": "assembly listed for 100 percent operation"}, "quote": "Exception: Where the assembly, including the branch-circuit OCPDs overcurrent devices protecting the branch circuit(s)", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf", "source_title": "NFPA, Working Draft of NEC CMP-2 Meeting Output (A2025 First Draft), FR-8210", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20", "notes": "Quote shows run-together old/new OCPD terms. 210.20 intro scope phrase 'not exceeding 1000 volts ac or 1500 volts dc nominal' seen; base vs inserted unknown."}
```
```json
{"ref": "215.2(A)(1)", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Not seen in any fetched document. Annex D Example D3(a) in the 2026 First Draft cross-references 215.2(A) and 215.2(B).", "values": {}, "quote": null, "source_url": null, "source_title": null, "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "215.3", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Text not seen. Annex D Example D3(a) (2026 First Draft, FR-8210) applies 125% of the continuous load plus the noncontinuous load under 215.3 and cites a 215.3 Exception for 100 percent-listed assemblies.", "values": {"annex_example_only": "150 A standard size; 125 A for 100 percent-listed assembly (example, extractor summary)"}, "quote": "must accommodate 125% of the continuous load, plus the noncontinuous load", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P02_FD_PrelimFR.pdf", "source_title": "NFPA A2025 CMP-2 working draft, FR-8210, Annex D Example D3(a) (example text, not 215.3)", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "230.42(A)", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Not seen in any fetched document.", "values": {}, "quote": null, "source_url": null, "source_title": null, "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "625.41", "edition": "2023", "status": "UNVERIFIED (edition-unstated government quote seen; probably pre-2023)", "rule_summary": "OCPD for feeders and branch circuits supplying EV equipment is sized for continuous duty at not less than 125 percent of the maximum load.", "values": {"multiplier": "125 percent"}, "quote": "Overcurrent protection for feeders and branch circuits supplying equipment shall be sized for continuous duty", "source_url": "https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/ChargeNY/DCFC-Program-Inspection-Checklist.pdf", "source_title": "NYSERDA, Quality and Market Standards Checklist Specifications, August 2024 (no NEC edition named)", "permission_notice": null, "corroboration": [{"url": "https://www.ecmweb.com/national-electrical-code/quizzes/article/55279390/code-quiz-sizing-overcurrent-protective-devices-for-feeders-or-branch-circuits-supplying-evse", "matches": true}], "retrieved": "2026-10-20", "notes": "NYSERDA's 625.40 wording differs from Leviton's 2023 625.40, so its 625.41 is likely an older edition. 2026 FD new 627.41 mirrors this structure (VERIFIED-draft)."}
```
```json
{"ref": "625.42 (supplementary)", "edition": "2023", "status": "VERIFIED-2023", "rule_summary": "EV charging loads are continuous loads for Article 625.", "values": {}, "quote": "Electric vehicle charging loads shall be considered to be continuous loads for the purposes of this article.", "source_url": "https://captaincode2023.leviton.com/node/357", "source_title": "Leviton Captain Code 2023 - 625.40, 625.42(A)(B), 625.43 Electric Vehicle Branch Circuit", "permission_notice": "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved.", "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "627.41 (2026 First Draft, new article)", "edition": "2026 First Draft", "status": "VERIFIED-draft", "rule_summary": "New Article 627 OCPD rule: sized for continuous duty, not less than 125 percent of the maximum load of the equipment; with noncontinuous loads on the same feeder, the sum of noncontinuous loads plus 125 percent of continuous loads.", "values": {"multiplier": "125 percent"}, "quote": "of not less than the sum of the noncontinuous loads plus 125 percent of the continuous loads.", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P12_FD_PrelimFR.pdf", "source_title": "NFPA, NEC CMP-12 First Draft Meeting Output (A2025), FR-9039", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "210.19 / 215.2 voltage-drop informational notes", "edition": "2023", "status": "UNVERIFIED (2023); seen in 2017 manufacturer reproduction without NFPA notice and in a 2021 forum post", "rule_summary": "Branch circuits sized to prevent voltage drop above 3 percent at the farthest outlet, with total feeder plus branch drop not above 5 percent, give reasonable efficiency. 2023 note numbers and the 215.2 feeder note were not seen.", "values": {"branch": "3 percent", "total": "5 percent", "note_number_pre2023_tier4": "Informational Note No. 4 to 210.19(A)"}, "quote": "sized to prevent voltage drop exceeding 3 percent at the farthest outlet", "source_url": "https://productinfo.se.com/na-std-ref/viewer/5c0fee4b347bdf0001de4d55/5c0fee5b347bdf0001de4d6b/r/NEC210.19ConductorsMinimumAmpacityA-F20BBAC1", "source_title": "Schneider Electric, North America Standards Reference, NEC 210.19 (2017 NEC; © 2018)", "permission_notice": null, "corroboration": [{"url": "https://forums.mikeholt.com/threads/voltage-drop-2-or-3-or-5.2564977/", "matches": true}], "retrieved": "2026-10-20"}
```
```json
{"ref": "334.80", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "NM cable ampacity is capped at the 60°C conductor value; the 90°C rating may be used for adjustment and correction calculations. (Tier-4 text only; 2026 First Draft appears to split it into lettered subdivisions.)", "values": {"cap": "60°C (140°F)", "derating_basis": "90°C (194°F)"}, "quote": "The ampacity shall not exceed that of a 60°C (140°F) rated conductor.", "source_url": "https://forums.mikeholt.com/threads/pc-334-80-a-nm-temperature-limits.2582807/post-2941704", "source_title": "Mike Holt forum: PC 334.80(A) NM temperature limits (24 Aug 2024) - tier 4", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "334.80 (Massachusetts amendment)", "edition": "2023 NEC as amended by 527 CMR 12.00", "status": "VERIFIED-2023 (Massachusetts only)", "rule_summary": "Massachusetts replaces 334.80: NM/NMC conductors are rated 90°C, and in thermal insulation the ampacity is that of 60°C conductors; the second NEC paragraph is deleted.", "values": {"conductor_rating": "90°C (194°F)", "in_thermal_insulation": "60°C (140°F)"}, "quote": "Where installed in thermal insulation, the ampacity of conductors shall be that of 60°C (140°F) conductors.", "source_url": "https://www.mass.gov/doc/527-cmr-1200-massachusetts-electrical-code-effective-21723/download", "source_title": "527 CMR 12.00 Massachusetts Electrical Code (Amendments), BFPR, 2/17/23", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "340.80", "edition": "2023", "status": "UNVERIFIED (own text); cross-reference VERIFIED-draft", "rule_summary": "340.80 text not seen. Table 310.4(1) footnote in the 2026 First Draft says UF cable ampacity is limited in accordance with 340.80.", "values": {}, "quote": "The ampacity of Type UF cable shall be limited in accordance with 340.80.", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf", "source_title": "NFPA, NEC CMP-6 First Draft Meeting Output (A2025), Table 310.4(1) note 4 (FR-7931 revises the table)", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "310.14(A)(2) Exception", "edition": "2023 (values) / 2026 First Draft (wording)", "status": "VERIFIED-2023 (values); VERIFIED-draft (2026 list wording)", "rule_summary": "Where different ampacities apply to portions of a circuit, the higher ampacity may be used if the lower-ampacity portion does not exceed the lesser of 3.0 m (10 ft) or 10 percent of the total circuit.", "values": {"length_limit": "3.0 m (10 ft)", "percent_limit": "10 percent of the total circuit", "rule": "lesser of"}, "quote": "or 10 percent of the total circuit.the following:", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf", "source_title": "NFPA, NEC CMP-6 First Draft Meeting Output (A2025), FR-7955 ('Editorial changes were made for clarity.')", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "310.15(B)(2)", "edition": "2023 (base text)", "status": "VERIFIED-2023", "rule_summary": "For raceways or cables in direct sunlight on or above rooftops less than 19 mm (3/4 in.) above the roof, add 33°C (60°F) to the outdoor temperature before applying Table 310.15(B)(1)(1) or (B)(1)(2) correction; Type XHHW-2 is exempt.", "values": {"distance_threshold": "19 mm (3⁄4 in.)", "temperature_adder": "33°C (60°F)", "exempt_conductor": "XHHW-2", "correction_table": "Table 310.15(B)(1)(1) or Table …"}, "quote": "⁄4 in.), a temperature adder of 33°C (60°F) shall be added to the outdoor temperature", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf", "source_title": "NFPA, NEC CMP-6 First Draft Meeting Output (A2025), FR-7961", "permission_notice": null, "corroboration": [{"url": "https://www.ecmag.com/magazine/articles/article-detail/codes-standards-under-hot-sun-ambient-temperature-adjustments-rooftops", "matches": false}], "retrieved": "2026-10-20", "notes": "ECmag 2016 quotes proposed 2017 text '7⁄8 of an inch' - edition difference. CONTRADICTS brief's 7/8 in. 2026 FD changes exception wording to 'temperature correction'."}
```
```json
{"ref": "310.15(E)", "edition": "2026 First Draft (reorganized)", "status": "VERIFIED-draft; 2023 wording UNVERIFIED", "rule_summary": "The 2026 First Draft reorganizes the neutral-counting rule into a list naming a 2-wire circuit, a 3-wire circuit taken from a 4-wire 3-phase system, and a 4-wire 3-phase wye circuit with mostly nonlinear load; the list lead-in was not visible.", "values": {}, "quote": "shall not be required to be counted when applying the provisions of 310.15(C)(1).", "source_url": "https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_P06_FD_PrelimFR.pdf", "source_title": "NFPA, NEC CMP-6 First Draft Meeting Output (A2025), FR-8035", "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "310.15(F)", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Not seen in any fetched document; not revised in the CMP-6 2026 First Draft.", "values": {}, "quote": null, "source_url": null, "source_title": null, "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "110.15", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Not seen in any fetched document.", "values": {}, "quote": null, "source_url": null, "source_title": null, "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "230.56", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Not seen in any fetched document.", "values": {}, "quote": null, "source_url": null, "source_title": null, "permission_notice": null, "corroboration": [], "retrieved": "2026-10-20"}
```
```json
{"ref": "110.26 (main paragraph, door-impediment rule)", "edition": "2023", "status": "VERIFIED-2023", "rule_summary": "Working space and access/egress must be provided and maintained; open equipment doors must not impede access or egress, and access is impeded if opened doors leave less than 610 mm (24 in.) wide and 2.0 m (6-1/2 ft) high.", "values": {"door_clear_width": "610 mm (24 in.)", "door_clear_height": "2.0 m (6-1/2 ft)"}, "quote": "to be less than 610 mm (24 in.) wide and 2.0 m (6-1/2 ft) high.", "source_url": "https://captaincode2023.leviton.com/node/301", "source_title": "Leviton Captain Code 2023 - 110.26 Spaces About Electrical Equipment", "permission_notice": "Material taken from the National Electric Code. is reprinted with permission from NFPA 70., 2023 edition. National Electrical Code®, Copyright 2022, National Fire Protection Association, Quincy, MA. All rights reserved.", "corroboration": [{"url": "https://www.csemag.com/know-how-to-size-an-electrical-room-properly/", "matches": true}], "retrieved": "2026-10-20"}
```
```json
{"ref": "110.26(A)(1) / Table 110.26(A)(1)", "edition": "2023", "status": "CONFLICTING (tier-4 sources only) / UNVERIFIED for 2023", "rule_summary": "Minimum working-space depth depends on nominal voltage to ground and Conditions 1-3. Tier-4 sources disagree on the 2023 voltage bands (three rows 0-150/151-600/601-1000 vs two rows 0-150/151-1000).", "values": {"variant_A_upcodes_print_edition_unstated": {"0-150": ["900 mm (3 ft)", "900 mm (3 ft)", "900 mm (3 ft)"], "151-600": ["900 mm (3 ft)", "1.0 m (3 ft 6 in.)", "1.2 m (4 ft)"], "601-1000": ["900 mm (3 ft)", "1.2 m (4 ft)", "1.5 m (5 ft)"]}, "variant_B_open_exam_prep_summary": {"0-150 V": ["3 ft", "3 ft", "3 ft"], "151-1000 V": ["3 ft", "3.5 ft", "4 ft"]}, "nfpa_staff_paraphrase_2023": "depths range 3 to 5 ft"}, "quote": "151—600 900 mm (3 ft) 1.0 m (3 ft 6 in.) 1.2 m (4 ft)", "source_url": "https://inspectapedia.com/electric/US-NEC-110.26-Electrical-Panel_Working-Space.pdf", "source_title": "Inspectapedia copy of an UpCodes print of 110.26 (edition not stated; cites NFPA 70E-2018) - tier 4", "permission_notice": null, "corroboration": [{"url": "https://open-exam-prep.com/study-guides/tx-electrician/equipment-devices-transformers/working-space-and-equipment-access", "matches": false}, {"url": "https://iaeimagazine.org/columns/nfpa-code-talk/electrical-room-basics/", "matches": true}], "retrieved": "2026-10-20", "notes": "Table pulled twice from the same source (data + raw lines): matched. 2026 FD FR-9213 revises 110.26(A) voltage wording."}
```
```json
{"ref": "110.26(A)(2) width", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Working-space width is the width of the equipment or 762 mm (30 in.), whichever is greater (tier-4 print, edition not stated).", "values": {"min_width": "762 mm (30 in.)"}, "quote": "the width of the equipment or 762 mm (30 in.), whichever is greater.", "source_url": "https://inspectapedia.com/electric/US-NEC-110.26-Electrical-Panel_Working-Space.pdf", "source_title": "Inspectapedia copy of an UpCodes print (edition not stated) - tier 4", "permission_notice": null, "corroboration": [{"url": "https://iaeimagazine.org/columns/nfpa-code-talk/electrical-room-basics/", "matches": true}], "retrieved": "2026-10-20"}
```
```json
{"ref": "110.26(A)(3) height", "edition": "2023", "status": "UNVERIFIED", "rule_summary": "Working-space height is 2.0 m (6½ ft) or the equipment height, whichever is greater (tier-4 print; fraction garbled in extraction).", "values": {"min_height": "2.0 m (6½ ft) - extracted as '2.0 m (6 / ft)'"}, "quote": "to a height of 2.0 m (6 / ft) or the height of the equipment, whichever is greater.", "source_url": "https://inspectapedia.com/electric/US-NEC-110.26-Electrical-Panel_Working-Space.pdf", "source_title": "Inspectapedia copy of an UpCodes print (edition not stated) - tier 4", "permission_notice": null, "corroboration": [{"url": "https://iaeimagazine.org/columns/nfpa-code-talk/electrical-room-basics/", "matches": true}], "retrieved": "2026-10-20"}
```
```json
{"ref": "NFPA 70-2023 TIAs 23-1..23-13", "edition": "2023", "status": "VERIFIED-2023", "rule_summary": "None of the 13 TIAs to the 2023 NEC amends any section targeted here.", "values": {"tias": "23-1 250.114; 23-2 Art.100/506; 23-3 210.8(F); 23-4 215.15; 23-5 555.30; 23-6 555.35; 23-7 Tables C.18-C.20; 23-8 300.26; 23-9 Pool/680.26; 23-10 314.29(A); 23-11 700.32(C)/701.32(C)/708.54(C); 23-12 408.6; 23-13 400.47"}, "quote": "shall not supply loads greater than the ampacities specified in 310.14.", "source_url": "https://www.nj.gov/dca/codes/codreg/pdf_misc_codes/nec_2023_tia_1_13.pdf", "source_title": "NFPA 70 2023 Edition Tentative Interim Amendments (NFPA documents hosted by NJ DCA)", "permission_notice": "Copyright © [year] All Rights Reserved NATIONAL FIRE PROTECTION ASSOCIATION (per TIA)", "corroboration": [], "retrieved": "2026-10-20"}
```

---

## Blocked or failed log

- **docinfofiles.nfpa.org: 6 of 6 calls used, no 429.**
  - P01 FD PrelimFR (CMP-1): the visible part ended inside Annex A Table A.1(a), and 110.14(C), 110.15 and Table 110.26(A)(1) were not in it.
  - P02 FD PrelimFR: read twice; the second read was probably served from cache.
  - P06 FD PrelimFR: read in full. An offset read returned "Nothing left to read from offset 100000: this page's text is 91636 characters long", probably from cache.
  - P12 FD PrelimFR: only 21 of 138 pages were visible.
- **WebFetch quote cap.** The summarizer refuses quotes over 125 characters, so full sections and tables cannot be pulled verbatim from any source.
- Schneider Electrical Distribution Fundamentals design guide (EV page): PROXY_REJECTED, "url exceeds the maximum fetchable length".
- up.codes/s/equipment-provisions and up.codes/s/temperature-limitations: ROBOTS_DISALLOWED.
- docs.nrel.gov/docs/fy22osti/83250.pdf: ROBOTS_DISALLOWED.
- oplc.nh.gov "20250909_bcrb_necamendments_2023code_exerpt.pdf" (NH, 2023 NEC excerpt): CLIENT_ERROR. The tool refused an immediate retry.
- mm.nh.gov "nec-20-summary-report-ch-1-to-8.pdf" (NH 2020 NEC changes): CLIENT_ERROR.
- **Fetched but no target text:**
  - IAEI Article 110 (2011)
  - IAEI Mastering Ampacity (2026; paraphrase only)
  - IAEI Ampere rating (CE Code)
  - IAEI 2003 bundling article
  - Georgia DCA hosting of an NFPA 2023 changes deck (covers 110.26(A)(6) only)
  - Mike Holt 2023 changes product PDF (table of contents only)
  - Encinitas PV guide (2013 CEC)
  - Portland PV plan set
  - WA L&I Electrical Currents archive (Aug 2021–Oct 2022) and issues Elc2305, Elc2312, Elc2501
  - Minnesota DLI 2023 and 2026 inspection checklists (paraphrase only)
  - NYSERDA energy-storage field reference (2017 NEC)
  - Schneider 210.19 page (2017 NEC)
- **WebSearch:** 20 of 20 used. A `site:.gov` operator inside the query was ignored; the `allowed_domains` filter worked.

## Open gaps

1. **110.14(C) 2023 verbatim text from a tier 1–3 source,** including the motor design letters. Also whether the 2026 edition revised or moved it. Best next fetch: 70_A2025_NEC_P01_PISubmittals.pdf, where the 21 Mar 2023 Whitney PI on 110.14(C)(1) reproduces the 2023 text, read with offsets inside one cache window. Or the remaining pages of the CMP-1 FR document.
2. **215.2(A)(1) and 215.3** text, including the 215.3 Exception and the 215.2 voltage-drop note number. Source: P02 PISubmittals, which has the Whitney PIs on 215.2(A).
3. **230.42(A)** text, including the exception. Source: P04 PISubmittals.
4. **625.41** 2023 text. Source: P12 PISubmittals, or later pages of the P12 FR document.
5. **Voltage-drop informational notes:** 2023 note numbers and wording for 210.19 and 215.2.
6. **334.80** 2023 base text in full (60°C cap, 90°C for derating, the multiple-cable and thermal-insulation paragraph) and the 2026 split. **340.80** text. The CMP-6 PrelimFR held no 334/340 FRs, so look for another CMP-6 FD file (final FR or ballot).
7. **310.15(E) and (F)** 2023 wording.
8. **110.15 and 230.56** (orange high-leg marking).
9. **Table 110.26(A)(1)** 2023 voltage bands and depths, plus the (A)(2) and (A)(3) wording. The tier-4 conflict must be settled from a primary source. Check the 2026 changes under FR-9213.
10. **When the rooftop distance changed** from 7/8 in. to 3/4 in. (2020 or 2023).
11. **210.19 numbering in the 2026 edition.** An Aug 2024 comment refers to "210.19(A)(1)(a)".
12. **No 2026 Second Draft or final text was checked** for any target.

Practical note: with a 6-fetch cap and a 125-character quote cap, one agent cannot clear these gaps from docinfofiles. Either give a single agent a larger docinfofiles budget and have it read one PISubmittals PDF with consecutive offsets in one sitting (the cache makes later reads free), or have a person read the sections once in NFPA's free-access viewer.
