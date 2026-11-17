# DealHunter

Responsive food and beverage promotion comparison app for Malaysia, implemented with React, TypeScript, Vinext and Cloudflare D1.

## Modules

| Proposal module | Implementation |
| --- | --- |
| Promotion collector | Administrator JSON import and optional authorized HTTPS feed. Feed refreshes on first visit after 24 hours; admin can refresh manually. |
| Daily dashboard | Active offers with location, restaurant, category, price and fulfilment filters. |
| Restaurant directory | Brand index and active offer counts. |
| Individual menu search | Search normalized item, brand and category text. |
| Menu matching | Canonical menu ID groups exact brand, item, size and variant across platforms. Import publisher verifies equivalence. |
| Price comparison | Food prices and estimated delivery/service fees; pickup labelled separately. |
| Best offer detection | Lowest eligible final/food price and highest food discount, with basket and membership constraints. |
| T&C summarizer | Rule-based plain-language structured conditions alongside full source terms. |
| Expiration | Validity windows, remaining days and automatic exclusion of expired offers. |
| Recommendations | Rank by account location, preferred category and budget. |
| Favourites & notifications | Account-synced saved menus and in-app alerts on active offers. |
| Savings tracker | User-reported redemption log, actual amount paid, estimated savings and CSV export. |

## Data limitations

The initial catalogue is fictional and explicitly marked Demo. Platform links in demo data open official websites, not guaranteed offer checkouts. Photography is illustrative from Unsplash. No live platform access, scraping, generative AI or background push service is claimed. Matching, recommendations and T&C summaries are transparent rules. Authorized promotion data is required to activate live collection. Imported offers include source URLs and last updated dates; the administrator is responsible for source correctness and permission.

Configure server secrets PROMOTION_FEED_URL and optional PROMOTION_FEED_TOKEN for live JSON collection. A feed must return the documented array. Refresh occurs on the first page visit after 24 hours; failures retain stored data with a 15-minute retry cooldown. This is visit-triggered, not an unattended scheduled job.

## Accounts and security

ChatGPT sign-in supplies server-verified user identity. Public visitors can browse; profile writes require sign-in. D1 records are partitioned by user ID. Server administrator authorization uses ADMIN_EMAILS (comma-separated) or ADMIN_EMAIL; configure it before deployment. Admin access is denied when unset. All mutations reject cross-origin requests. Import URLs require HTTPS, and imported text is escaped by React. Credentials are never stored in Git. No payments or order placements occur in the app.

Savings = max(0, listed normal item food price - recorded amount paid including allocated fees). These are estimates based on user entries, not independently verified purchase transactions. Alerts are in-app; email and background push delivery are not connected.

## Local setup

Node >=22.13.0. Install with `npm run install:ci`. Run `npm run build`. Apply local D1 migrations with:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_initial.sql
```

Use the actual generated migration filename in drizzle/. Then `npm run dev`. The supplied starter's optional portable development profile supports mock ChatGPT sign-in on loopback only; production uses hosting-provided identity.

Checks: `npx tsc --noEmit` and `node --experimental-strip-types --test tests/deals.test.mjs`.

## Promotion import schema

An array of 1–200 menu items, maximum 1 MB:

```
[{"id":"brand-menu-large","brand":"Brand","name":"Menu item","category":"Milk tea","size":"Large · Regular sugar","original":13.9,"locations":["Johor Bahru"],"image":"https://example.com/photo.jpg","sample":false,"offers":[{"id":"platform-offer","platform":"Platform","price":9.9,"delivery":3.5,"service":0.6,"minimum":0,"membership":false,"code":"","terms":"Full authorized terms","starts":"2026-11-17T00:00:00+08:00","expires":"2026-12-02T23:59:59+08:00","url":"https://example.com/offer","mode":"delivery"}]}]
```

Prices are numeric MYR; dates must include timezone offsets. Mode is pickup or delivery. One canonical menu ID must represent an identical brand, size and variant. Identical menu IDs update existing imported entries. The admin screen offers a complete editable example. Expired entries remain stored for editing but do not appear in discovery. Removing an import restores the demo entry if it shares a demo ID.

## Deployment

`.openai/hosting.json` declares the hosted project and DB binding. Schema migrations are in drizzle/. Source is stored in this GitHub repository; publication uses the managed Sites source remote and build artifacts. GitHub changes do not automatically deploy; publish a new version after changes. Build outputs, runtime state and secrets are excluded from source control.

## Official promotion pages and daily checks

The default Official offers screen displays genuine public offers separately from the fictional menu comparisons. It tracks McDonald's Malaysia, Tealive and ZUS Coffee. Each offer includes source link, conditions, published dates when known, recurring availability and last checked time. Unknown end dates are not invented. Failed sources retain the previous saved offers, with a needs-recheck flag after 48 hours. Source-checked is not a guarantee of stock, outlet eligibility or consumer-account vouchers.

The daily cloud task follows docs/official-updates.md, reads public official pages, writes only shared promotions to /api/official and verifies readback. This service writer relies on confirmed owner-private Sites authentication. **Disable the service writer or add separate service authorization before changing the Site to public/shared access.** No service credentials are committed. Routine offer updates do not require code deployment. Daily timing is 08:00 Asia/Kuala_Lumpur, subject to the saved cloud task's status and source availability.
