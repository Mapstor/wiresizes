# Evidence inventory — distilled (as of Jul 2026)

Grades: **(a)** Google-confirmed/documented · **(b)** strong empirical (May
2024 API leak, DOJ v. Google, controlled/large-scale studies) · **(c)**
correlational · **(d)** myth/debunked. Full detail lives in the July 2026
research report; this file is the working distillation. Re-validate section H
quarterly.

## A. Ranking systems ground truth

| Factor | Grade | Source note |
| --- | --- | --- |
| Helpful-content signals folded into core, site-level, continuous (Mar 2024) | a | Google Search Central |
| Scaled content abuse policy — mass low-value pages, however produced | a | Google spam policies |
| Site reputation abuse (May 2024), expired domain abuse | a | Google spam policies |
| pSEO survives only with unique per-page value | a/b | policy wording + documented demotions |
| PageRank variants still live | b | API leak |
| Freshness systems / QDF | a | Google ranking-systems guide |

## B. On-page

| Factor | Grade | Source note |
| --- | --- | --- |
| Title tags still important | b | leak analyses (King) |
| NavBoost click signals; ~13-month window; Chrome data | b | DOJ testimony (Nayak: "one of the important signals") + leak fields |
| siteAuthority exists (site-level authority) | b | leak (QualityBoost.SiteAuthority) |
| Information gain / originality | a/c | rater guidelines + leak refs; magnitude unknown |
| Topical/entity completeness | b/c | correlational + fan-out alignment |
| Depth helps; word counts do not | c / d | Google denies word-count factor |
| LSI keywords | **d** | no such mechanism (Mueller) |
| Meta description as ranking factor | **d** | CTR only |
| Dwell time as direct factor | d (mechanism: click quality, b) | distinguish NavBoost lastLongestClicks |
| Social signals | **d** | repeatedly denied; no leak evidence |
| Original images/video | c | survivor trait in 2024–26 updates |

## C. Technical

| Factor | Grade | Source note |
| --- | --- | --- |
| CWV thresholds LCP ≤2.5 s / INP ≤200 ms / CLS ≤0.1 at p75 (28-day field) | a | web.dev; INP replaced FID Mar 2024 |
| CWV = light tiebreaker signal | a | Google |
| INP hardest to pass; JS hydration + ad SDKs main causes | b | HTTP Archive (≈43% mobile origins pass all three) |
| SSG/SSR over CSR for indexing | a/b | Google JS SEO docs |
| Sitemaps, canonicals, 301s, soft-404 avoidance, crawl budget | a | Google docs |
| Speed → conversion upside | b | Google/Deloitte (0.1 s → +8.4% retail conv.) |

## D. Structured data (2026 state)

| Factor | Grade | Source note |
| --- | --- | --- |
| FAQ rich results fully deprecated May 7, 2026 (restricted since Aug 2023); HowTo dead 2023 | a | Google Search Central |
| 7 more types retired Jun 2025 | a | Google |
| Still earning features: Article, Product, Review, Breadcrumb, Video, Event, Dataset, Recipe, SoftwareApplication | a | Google docs |
| Dataset schema → Google Dataset Search | a | Google docs |
| Schema does NOT lift AI citations | b | Ahrefs controlled study (May 2026): 1,885 pages vs 4,000 controls, "no major uplift" |
| Google: no special schema needed for AIO/AI Mode | a | Google AI-features docs |
| Schema aids entity clarity, esp. Bing/Copilot | c | Canel (Microsoft) statements |

## E. E-E-A-T

| Factor | Grade | Source note |
| --- | --- | --- |
| E-E-A-T = rater framework, not direct score | a | Google |
| Named authors > anonymous in quality systems | b/c | leak author fields + analyst work |
| Author entity: Person schema, sameAs, bio, credentials | c | best-practice implementation |
| Trust artifacts: citations, editorial policy, about/contact | c | rater guidelines alignment |
| YMYL higher bar | a | rater guidelines |

## F. Internal linking

Reasonable-surfer weighting (b, leak + patent) · clusters/hubs (c) · orphan
pages harm discovery (a/b) · descriptive anchors (a/b) · breadcrumbs +
schema (a).

## G. Links

| Factor | Grade | Source note |
| --- | --- | --- |
| Links matter but not top-3 | a | Illyes, PubCon Sept 2023 |
| Tiered link indexes; low-quality ignored; click data assigns tier | b | leak |
| anchorMismatchDemotion | b | leak |
| Referring domains = strongest correlate | c | Ahrefs/Backlinko correlation studies |
| Passive magnets: datasets, stats pages, tools, embeddables earn cites/links | b/c | Ahrefs stats-page case study; format studies |

## H. AI visibility (volatile — re-validate quarterly)

| Factor | Grade | Source note |
| --- | --- | --- |
| AIO on ~48% of tracked queries (early 2026) | b | BrightEdge |
| AIO cuts organic CTR 15–89% (query-mix dependent) | b | Ahrefs 34.5%→58% top-result; Seer 61%; Amsive 15.5% |
| Being cited in AIO recovers clicks (+35% organic in Seer data) | b | Seer Interactive |
| Rank↔AIO-citation overlap fell ~75% → ~17–38% (source-dependent) by early 2026 | b | Ahrefs; BrightEdge; seoClarity |
| Query fan-out in AI Mode/AIO | a | Google (Reid, I/O 2025) |
| ChatGPT ≈ Bing: 87% of citations in Bing top-20 vs 56% Google | b | Seer Interactive, Feb 2025, 500+ citations |
| OAI-SearchBot (search) vs GPTBot (training) are separate opt-outs | a | OpenAI docs |
| Google-Extended blocking ≠ AIO/rank effect | a | Google docs |
| GEO levers: stats/quotes/citations lift visibility up to ~40%; stuffing −8–10% | b | Aggarwal et al., KDD 2024 (validated on Perplexity) |
| llms.txt honored by no major vendor | a | Mueller (Sept 2025), Illyes (Jul 2025), Google docs (Jun 2026); ~408 of 500M AI-bot hits |
| Perplexity: RAG, own crawler + Bing; 3–7 citations; trust-domain bias | b/c | Perplexity docs + studies; crawler-trust unresolved (Cloudflare dispute) |
| GA4 AI channel new/unstable; 35–70% of AI sessions land in Direct | b | GA help + 2026 analyses |
| GSC Generative-AI report (Jun 3, 2026): impressions only, AIO+AI Mode merged | a | Google Search Central |

## I / J. Freshness & killers

Genuine updates help on time-sensitive queries (a/b); cosmetic date changes
do nothing (a). Killers: scaled near-dupes (a), unedited AI at scale (a/b),
doorway geo pages (a), fake authors (b/c), ad-heavy layouts (b), scraped
aggregation (a), high unhelpful share site-wide (a).

## Standing caveats

- Correlation ≠ causation in all link/ranking correlation studies.
- The leak documents fields, not weights; Google disputes context. NavBoost +
  siteAuthority are corroborated by DOJ testimony — treat those as solid.
- AI numbers move fast; every figure above carries its as-of date. When a
  rule and fresh evidence conflict, evidence wins and the skill gets a diff.
