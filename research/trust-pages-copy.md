# Trust pages: copy to render verbatim (WSZ-002)

Written in chat on 2026-10-20 to research/trust-frame-spec.md and checked with anti-slop-prose. Revised the same day after the WSZ-002 review: the /about lines no longer claim that every existing figure is already sourced. Revised 2026-10-25 after two owner decisions: the full company details (ZEPT Article 5) and Google Analytics behind a consent banner for EU, EEA, UK and Swiss visitors.
Render the text below exactly. Only the {placeholders} change:
- {DATE}: the WSZ-002 commit date in US style, e.g. "October 20, 2026"
- {N_WITHDRAWN}: the number of rows in research/wsz002-withdrawals.csv (15)
- {N_REDIRECTED}: the number of redirects this wave adds (6)

Headings are marked `##` (H1) and `###` (H2). Lists are lists. Each page also gets the meta title and meta description shown.
Do not add sections, badges, icons, stats, FAQs or schema to these pages in WSZ-002. WSZ-004 adds the byline, the corrections JSON and Person/Organization schema.

---

## /about

Meta title: About wiresizes.com
Meta description: Who writes wiresizes.com, which sources its numbers come from, how pages are checked, and the dated list of corrections.

## About wiresizes.com

### Who runs this site
Marko Visic writes and maintains wiresizes.com. He holds a BSc in Physics from the Faculty of Mathematics and Physics, University of Ljubljana, Slovenia.

Physics covers the measurement side of this site: conductor resistance, how it changes with temperature, wire gauge geometry and unit conversions. It does not make him an authority on the electrical code. He is not a licensed electrician or engineer, so the site reports what the code and the measurement standards say and does not give opinions on code questions.

### Where the numbers come from
- NFPA 70, the National Electrical Code (NEC), 2023 edition, unless a page names another edition.
- NIST Handbook 100, Copper Wire Tables, for wire diameters, areas and copper resistance. NIST Handbook 109 for aluminum.
- NIST Special Publication 811 for unit conversion factors.
- Manufacturers' installation instructions, for pages about specific equipment.

### How pages are made
Drafts are written with AI assistance. Pages are being rebuilt so that every figure traces to one of the sources above. Marko publishes every update, and when an error turns up he fixes it and adds a dated line to the list below.

### Corrections
- {DATE}: Audited every page. Removed the unsourced claims the audit found, including user counts, endorsements, expert reviews and response-time promises, and deleted or corrected the wrong values it found. Took {N_WITHDRAWN} calculators offline until they are rebuilt from verified sources. Redirected {N_REDIRECTED} overlapping or retired pages to their closest page.

To report an error, email contact@wiresizes.com.

### Publisher
wiresizes.com is published by Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company registration number 9041273000, VAT ID SI94001154. Email: contact@wiresizes.com. The privacy notice lists what the site collects.

(Link "privacy notice" to /privacy. Link nothing else on this page in WSZ-002.)

---

## /contact

Meta title: Contact wiresizes.com
Meta description: Email address for corrections, questions about a page and privacy requests.

## Contact

Email contact@wiresizes.com for corrections, questions about a page, or privacy requests. One person runs this site, so a reply can take a few days.

For an electrical emergency, call 911 or your electric utility. This site cannot give advice about a specific installation.

Publisher: Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company registration number 9041273000, VAT ID SI94001154.

(Render the email address as a mailto: link. No form, no other email addresses, no phone, no hours.)

---

## /privacy

Meta title: Privacy notice
Meta description: What wiresizes.com collects, which services process it, the legal basis, and how to use your data protection rights.

## Privacy notice

Last updated: {DATE}

### Who is responsible
Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia (company registration number 9041273000, VAT ID SI94001154), publishes wiresizes.com and is the controller of the personal data described here. Contact: contact@wiresizes.com.

### What runs on this site
- **Hosting (Vercel).** Vercel Inc. hosts the site. To deliver pages and protect the service, Vercel's servers receive your IP address and the details your browser sends with each request.
- **Vercel Web Analytics.** Counts page views without cookies. Vercel identifies a visit by a hash created from the request and discards it after 24 hours. It records the page, the referring page, the country and region, the browser, the operating system and the device type.
- **Vercel Speed Insights.** Measures how fast pages load, without cookies. It records the page, the browser, the operating system, the device type, the network speed, the country and the timing values.
- **Google Analytics 4.** Google's analytics service, used to see which pages people read. It sets two cookies in your browser: `_ga`, used to distinguish users, and `_ga_T871GVJZE2`, used to keep session state. Both expire after 2 years. Google receives your IP address and the page details and may process them outside the EU. Event data is kept for the retention period set in our Google Analytics account. If you visit from the EU, the EEA, the UK or Switzerland, Google Analytics runs only after you accept it in the cookie banner. Elsewhere it runs when a page loads. You can change your choice at any time under "Cookie settings" at the bottom of every page. Your choice is stored in your browser, so the banner does not come back on every page.

The site has no ads, no comments, no accounts and no contact form. If you email us, we use your message and address only to reply.

### Legal basis
Hosting, Vercel Web Analytics and Speed Insights: our legitimate interest in running a working website and knowing which pages are read and how fast they load (Article 6(1)(f) GDPR). Google Analytics: your consent where the banner asks for it (Article 6(1)(a) GDPR; for the cookies, the consent rule of the Slovenian Electronic Communications Act, ZEKom-2), and elsewhere our legitimate interest in knowing which pages are read (Article 6(1)(f) GDPR). Email: replying to you (Article 6(1)(f) GDPR).

### Your rights
You can ask for access to your data, correction, erasure, restriction of processing and a copy in a portable format, and you can object to processing based on legitimate interest. You can withdraw your consent to Google Analytics at any time under "Cookie settings"; this does not affect processing before the withdrawal. Write to contact@wiresizes.com. You can also complain to the Information Commissioner of the Republic of Slovenia (Informacijski pooblaščenec, www.ip-rs.si) or to the data protection authority where you live.

(If WSZ-002 removed Google Fonts by self-hosting the fonts, there is nothing to add here. If any other third-party script or service is still running, stop and report it instead of publishing this page. Publish this page only together with step 8b, which builds the cookie banner it describes.)

---

## /terms

Meta title: Terms of use
Meta description: Who operates wiresizes.com, what its tables and calculators are for, and the limits of what they promise.

## Terms of use

Last updated: {DATE}

### Operator
wiresizes.com is operated by Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia (company registration number 9041273000, VAT ID SI94001154). Contact: contact@wiresizes.com.

### What the site provides
Free reference tables and calculators about electrical conductors. Code values are quoted from the NEC edition named on each page; physical values come from NIST publications; calculators apply the formulas shown on their pages.

### No professional advice
Using this site does not create a professional relationship. The information is provided as is, without any warranty. Check every result against the code edition your jurisdiction enforces and the equipment's installation instructions. Where your jurisdiction requires a permit, an inspection or a licensed electrician, those requirements apply.

### Liability
To the extent the law allows, Moving Data Systems d.o.o. is not liable for any loss that results from using this site.

### Trademarks
NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association. wiresizes.com is not affiliated with or endorsed by NFPA.

### Governing law
These terms are governed by the law of the Republic of Slovenia.

---

## /disclaimer

Meta title: Disclaimer
Meta description: The limits of the tables and calculators on wiresizes.com, and who has the final word on an installation.

## Disclaimer

### Reference values
The tables and calculators on this site show values from the NEC edition named on each page and from NIST publications. Use them for planning and learning.

### Your jurisdiction decides
States and cities adopt different NEC editions, some years apart, and amend them. Your local electrical inspector, the authority having jurisdiction, has the final word on what an installation needs.

### Equipment instructions
Listed equipment comes with installation instructions that can be stricter than a general table, for example on breaker size, wire size or terminal temperature. Follow them.

### Who writes this site
The author is a physicist, not a licensed electrician or engineer. Have a licensed electrician do the work wherever your jurisdiction requires one.

### Errors
If you find an error, email contact@wiresizes.com. Corrections are listed with dates on the About page.

---

## Site-wide strings

Footer, line under the logo (replaces the tagline and the three badges):
"Wire gauge charts, NEC table values and calculators for sizing conductors."

Footer, disclaimer box (heading "Disclaimer", replaces "Professional Disclaimer"):
"Reference values for planning. Check them against the NEC edition your jurisdiction enforces and the equipment's instructions. The author is a physicist, not a licensed electrician or engineer."

Footer, notice (replaces the "Industry Standards & Authority Links" block, next to links to About, Contact, Privacy, Terms, Disclaimer and "Cookie settings"; the last one is a button that reopens the cookie banner):
"NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association. wiresizes.com is not affiliated with or endorsed by NFPA."

Footer, copyright line: "© {current year} Moving Data Systems d.o.o."

Cookie banner (step 8b; only for visitors the consent step covers, and whenever "Cookie settings" is clicked): "We'd like to use Google Analytics cookies to see which pages people read." Buttons: "Accept analytics" and "Reject", the same size and style. Link: "Privacy notice" to /privacy.

Root layout meta description: "Wire size, ampacity and voltage drop calculators with AWG and NEC reference tables."
Root layout OpenGraph and Twitter descriptions: same as the meta description.
manifest.json description: "Wire gauge charts and electrical calculators."

OG/Twitter image (src/app/opengraph-image.tsx): keep the logo and the "Wire Size Calculator" headline; subtitle "Wire gauge charts and calculators"; alt text "wiresizes.com: wire gauge charts and calculators"; delete the line under the headline and the six reference pills.

Withdrawn calculator body (after the existing H1):
"We took this calculator offline on {DATE} after an audit found that {what_was_wrong}. Until it is rebuilt, follow the equipment's installation instructions and the electrical code your jurisdiction enforces."
Then a short list headed "Related pages" with the links from the withdrawals CSV, each using the target page's H1 as its anchor text.
Withdrawn meta description: "This calculator is offline while it is rebuilt from verified sources."

Error page (src/app/error.tsx), replacing the "Our team has been notified" sentence:
"Something went wrong while loading this page. Reload it, or go to the homepage."

404 page: delete the search form (the site has no search) and keep the links.
