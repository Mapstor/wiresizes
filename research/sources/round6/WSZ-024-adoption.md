# WSZ-024: Louisiana, Wisconsin and New Hampshire re-read (2026-11-12)

Data-sourcing step for three rows of `data/verified/nec-adoption.json`, approved by the owner on 2026-11-12 ("update all 3").
WSZ-005c had found Louisiana's and Wisconsin's source links answering 404, and New Hampshire's giving that session no answer.
Every document below is a state government record. Read with curl and pdftotext, except the New Hampshire pages:
gc.nh.gov refuses curl from the session, so they were read with the session's web fetcher (HTTP 200).

## Louisiana

**Edition and start date.** The Louisiana Uniform Construction Code Commission (LUCCC, Office of the Governor; the old
council address lsuccc.dps.louisiana.gov redirects to luccc.louisiana.gov) publishes a one-page information sheet.
Title "LUCCC_Louisiana Construction Code Information_08-06-2026", "Revised 08/06/2026".
https://luccc.louisiana.gov/wp-content/uploads/2025/11/LSUCCC_Louisiana-Construction-Code-Information.pdf (HTTP 200, 88,460 bytes)

- "National Electrical Code (NEC)" with "Current Code Book Edition" "2020"
- Code history table, "Code Effective Date (in Louisiana)": "2020 NEC January 1, 2023"
- "Next Code Review Cycle (ICC code editions will become effective January 1, 2027.) A. 2023 edition of NEC B. 2024 editions for ICC Codes"
- Special note under the 2021 ICC codes: "On 07/01/2023, the International Energy Conservation Code (IECC) became effective."

This settles the row's open start date. Round 4 had two candidates: January 1, 2023 (an ICC-NTA pointer, not primary) and
July 1, 2023 (the December 2023 emergency rule's "The rule became effective on July 1, 2023."). The commission's sheet
gives January 1, 2023 for the 2020 NEC and July 1, 2023 for the IECC, which is what the emergency rule's date refers to.

**The 2023 NEC is still a proposal.**
- LUCCC home page (https://luccc.louisiana.gov/, read 2026-11-12): "A Notice of Intent to amend and adopt of the 2023
  National Electrical Code (NEC) and for the 2024 International Codes (I-Codes) was published in the August 20, 2026,
  Louisiana Register".
- Louisiana Register, Vol. 52, No. 10, October 20, 2026 (https://www.doa.la.gov/media/0n1n5vd3/2610.docx), Potpourri
  2610#053, p. 1900, "Uniform Construction Code Commission, Notice of Public Hearing, Substantive Changes to Proposed Rule,
  Uniform Construction Code, Adoption of the 2023 NEC and the 2024 I-Codes (LAC 17:I.Chapter 1)": the August 20, 2026
  Notice of Intent (LR 52:1403-32) "proposed to amend and adopt the 2023 edition of the National Electrical Code (NEC) and
  the 2024 editions of the I-codes in the state of Louisiana with an effective date of January 1, 2027"; "As a result of
  written comments received in response to the August 20, 2026, Notice of Intent, the commission determined that
  additional revisions were necessary to amend §111, International Plumbing Code, and §115, National Electrical Code";
  "A public hearing concerning these substantive changes will be held by the Louisiana Uniform Construction Code
  Commission on November 24, 2026, at 9:30 a.m."
- The September 2026 Register (https://www.doa.la.gov/media/yk4houdl/2609.docx) lists only the Notice of Intent (1403N).
  The November issue is published on November 20.

So `next_change` stays `{edition: "2023", effective: null}` (rule 9: proposed or pending, no date).

## Wisconsin

The Department of Safety and Professional Services moved its website (news release of September 29, 2026: "Wisconsin
DSPS Launches Updated Website"), which is why the old news-release address answers 404. The same releases now live under
/MediaFileLocation/.

- "DSPS Celebrates Latest Code Update", press release dated September 1, 2026
  (https://dsps.wi.gov/MediaFileLocation/qv4nl4uf/dsps-celebrates-latest-code-update.pdf, HTTP 200, 224,808 bytes):
  "Wisconsin's new electrical code takes effect today"; "Wisconsin is adopting the 2023 National Electric Code, moving
  away from using the 2017 edition with amendments."; "The new electrical code updates take effect September 1".
- "New Electrical and Plumbing Codes Take Effect September 1", press release created 2026-06-01 (its printed date line
  reads "June 1, 2025", a typo: it announces the September 1 date and the June 29 publication)
  (https://dsps.wi.gov/MediaFileLocation/m40jvhh2/new-electrical-and-plumbing-codes-take-effect-september-1.pdf):
  "The electrical code update adopts 2023 National Electrical Code (NEC) standards, with specific changes and omissions
  to ensure it conforms to Wisconsin statutes and is consistent with DSPS procedure. The current Wisconsin electrical
  code is based on 2017 NEC standards."
- The Wisconsin Administrative Code (docs.legis.wisconsin.gov, ch. SPS 316) reset the session's connection; not read.

The row's facts do not change (2023 NEC from 2026-09-01, replacing the 2017 NEC with state amendments); its source link
and publisher do.

## New Hampshire

- RSA 155-A:1, IV, https://gc.nh.gov/rsa/html/XII/155-A/155-A-1.htm (HTTP 200 through the web fetcher): the state
  building code includes "the National Electrical Code 2023, as published by the National Fire Protection Association,
  Inc." Source line: "... 2024, 323:1, eff. July 1, 2024. 2025, 135:1, eff. July 1, 2025; 276:2, eff. July 1, 2026.
  2026, 49:1, eff. July 1, 2026; 318:3, 63, eff. July 1, 2026 at 12:01 a.m."
- HB 134 of 2025 (LSR 25-0235), bill status
  https://gc.nh.gov/bill_status/legacy/bs2016/bill_status.aspx?lsr=235&sy=2025&sortoption=&txtsessionyear=2025&txtbillnumber=HB134:
  "Chapter #" "0135", "Gen Status" "SIGNED BY GOVERNOR".
- Its chaptered text, https://gc.nh.gov/bill_status/legacy/bs2016/billText.aspx?id=242&sy=2025&txtFormat=html,
  "HB134 — CHAPTERED FINAL VERSION", "CHAPTER 135": "135:1 Definition of State Building Code. Amend RSA 155-A:1, IV to
  read as follows:" with "the National Electrical Code [2020] 2023" (bracketed text struck); "135:2 Effective Date. This
  act shall take effect July 1, 2025."; "Approved: June 24, 2025"; "Effective Date: July 01, 2025".

So the 2023 NEC became New Hampshire's state building code on July 1, 2025. Round 4's window (after the Fire Marshal's
list of 2024-08-08, which still showed the 2020 NEC, and by 2026-07-01) closes at that date. The later laws in the source
line (2025 ch. 276; 2026 chs. 49 and 318) keep the 2023 NEC; the current text names the 2024 I-codes and board
amendments "as of October 10, 2025". The State Fire Marshal's code page (firemarshal.dos.nh.gov) answered 403.

## Changes made to nec-adoption.json

| Row | Field | Before | After |
|---|---|---|---|
| LA | effective | null | 2023-01-01 |
| LA | source_publisher, source_url, quote, note | Office of State Fire Marshal emergency rule, Dec 2023 (404) | LUCCC information sheet, revised 08/06/2026 |
| WI | source_publisher, source_url, quote | DSPS news release at the old address (404) | DSPS news release of 2026-09-01 at its new address |
| NH | effective | null | 2025-07-01 |
| NH | quote, note | RSA 155-A:1, IV | RSA 155-A:1, IV and 2025 Laws ch. 135 |

Editions, scopes and next changes are unchanged; so are the counts (49 of 51) and every other row. `as_of` stays
2026-10-24, when the other rows were verified.
