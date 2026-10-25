# Installing a research pack

Chat builds each pack as wiresizes-research-pack-vN.zip. The owner unzips it in the repo root, which creates wsz-pack-vN/. A prompt installs it; nobody copies pack files by hand.

1. Verify: `(cd wsz-pack-vN && sha256sum -c --quiet research/MANIFEST.sha256) && echo PACK-OK`. Continue only on PACK-OK; otherwise stop and paste the failing lines.
2. Copy, overwriting: `cp -R wsz-pack-vN/research/. research/`, then `mkdir -p data/verified && cp -R wsz-pack-vN/data/verified/. data/verified/`.
3. Remove what the pack dropped: run `diff -rq wsz-pack-vN/research research` and `diff -rq wsz-pack-vN/data/verified data/verified`. Every "Only in research…" or "Only in data/verified…" line names a repo file the new pack no longer has; delete it, except research/inventory-2026-10.md and research/wsz002-draft-review.md. List the deleted files in the DEVLOG entry.
4. Confirm:
   - `diff -r wsz-pack-vN/research research` prints only "Only in research: inventory-2026-10.md" and, if WSZ-013 ran, "Only in research: wsz002-draft-review.md";
   - `diff -r wsz-pack-vN/data/verified data/verified` prints nothing;
   - `cat research/PACK_VERSION` prints vN.
5. `rm -rf wsz-pack-vN`, then `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv` must print RESULT: OK.
6. Commit "chore(<wave id>): research pack vN" on its own, with the COMMIT IDENTITY line of the running prompt.

The repo copies of research/ and data/verified/ are never hand-edited. If a value looks wrong, report it to chat; chat fixes it and ships a new pack.
