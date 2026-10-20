# Registries — schemas and enums

## research/data-sources.csv (site registry)

| column | meaning / allowed values |
| --- | --- |
| `domain` | data domain key, e.g. `active-fire-detection`. Referenced by `page-map.csv`'s `data_source` column |
| `source` | dataset/product name, e.g. `FIRMS active fire data` |
| `publisher` | e.g. `NASA` |
| `url` | deep link to the page that shows/describes the data — the attribution target. Must resolve; never a homepage |
| `endpoint` | the actual fetch URL / API base used for the sample pull |
| `access` | `api` / `bulk` / `page` |
| `license` | `public-domain`, license name, or the restricting clause verbatim |
| `tier` | authority tier `A` / `B` / `C` (see hierarchy in SKILL.md) |
| `cadence` | source update frequency, e.g. `live`, `daily`, `monthly`, `annual` |
| `granularity` | e.g. `point`, `county`, `state`, `national` |
| `format` | e.g. `GeoJSON`, `CSV`, `raster` |
| `key_required` | `yes` / `no` — never store the key itself |
| `attribution` | the exact string pages render, e.g. `Source: NASA FIRMS — retrieved Jul 2026` |
| `verified_date` | date of the successful sample pull, `YYYY-MM-DD` |
| `next_check` | re-verification due date, from cadence class: live/daily → monthly; monthly/quarterly → quarterly; annual → yearly |
| `coverage` | what it actually covers, stated plainly, e.g. `all 50 states`, `12 states: CA OR WA…` |
| `sample_note` | what the sample showed — fields present, row counts, quirks |
| `status` | `verified` / `candidate` / `GAP` |
| `pages_served` | slugs depending on this domain, `;`-separated |
| `notes` | blockers for candidates; **required for GAP rows**: the chosen gap treatment (reshape / transparent-gap / cut) |

## Master registry (portfolio-wide)

Same columns minus `pages_served`, plus:

| column | meaning |
| --- | --- |
| `used_by_sites` | domains of sites using it, `;`-separated |

Lives in the portfolio-os repo once it exists; until then Marko keeps the
canonical copy. Always consult it before researching a domain; always add
newly verified sources to it.

## Status semantics

- `verified` — sample pulled, fields inspected, coverage checked, retrieval
  date recorded. Only `verified` sources may back a live page.
- `candidate` — found but blocked: unverified, unclear license, or pending
  judgment. Never built on.
- `GAP` — no usable source exists. `notes` must state the treatment; the
  dependent pages carry it (coverage disclosure / transparent-gap / cut).

## Cross-file invariants (enforced by scripts/check_sources.py)

1. Registry `domain` values unique; enums valid; `url` present on every row.
2. `verified` rows: `url`, `attribution`, `verified_date`, `next_check`,
   `coverage`, `sample_note` all non-empty.
3. `GAP` rows: `notes` non-empty (the treatment).
4. Every non-`structural` page in `page-map.csv` has a `data_source` that
   exists in the registry, with status `verified` (or `GAP` — warned, since
   the page must carry the gap treatment).
5. `pages_served` slugs exist in `page-map.csv` (warned otherwise).
