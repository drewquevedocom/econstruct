# GSC Redirect Operator Checklist

This checklist covers the parts of the redirect recovery that cannot be enforced from repo code alone.

## Cloudflare

- Confirm there is exactly one hostname redirect rule for `www.econstructhomes.com`.
- Rule target should be `https://econstructhomes.com${uri}`.
- Rule status should be `301` permanent, not `302`.
- Verify there is no second overlapping redirect rule for apex or `/our-work`.
- Review Security Events around the hack window for suspicious redirect-rule edits.

## GSC

- Export `Indexing > Pages > Page with redirect`.
- Classify rows into:
  - `www.econstructhomes.com/...`
  - `/our-work` legacy URLs
  - suspicious/spam URLs
- Prioritize fixes by impressions first.
- Remove the old sitemap submission if it still reflects redirecting URLs.
- Submit `https://econstructhomes.com/sitemap.xml` after deploy.

## Validation Commands

- `curl -I https://www.econstructhomes.com`
- `curl -I https://econstructhomes.com/our-work`
- `curl -I -L --max-redirs 5 https://www.econstructhomes.com/our-work`

Expected outcomes:

- `www` resolves to apex in one permanent redirect.
- `/our-work` resolves to `/projects` in one permanent redirect.
- No redirect chain exceeds one hop before the final `200`.

## Reindex Priorities

Request indexing in this order:

1. `https://econstructhomes.com/`
2. `https://econstructhomes.com/projects`
3. `https://econstructhomes.com/pacific-palisades-fire-rebuild`
4. `https://econstructhomes.com/altadena-fire-rebuild-contractor`
5. `https://econstructhomes.com/about`
6. `https://econstructhomes.com/faq`
7. Priority blog posts and location pages
