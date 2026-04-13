# Analytics – How it Works

## What is tracked

Each time a visitor navigates to a page, **one row is inserted** into the `page_views` table in Supabase with:

- **Page path** – e.g. `/products`
- **Referrer** – the domain they came from (e.g. `google.com`), or null for direct visits
- **Device type** – `desktop`, `mobile`, or `tablet` (derived from the browser user-agent)
- **Session ID** – a random string generated per browser session; resets on tab/browser close; never linked to identity
- **User-agent string** – raw browser identifier, kept for data quality checks only
- **Timestamp** – UTC datetime of the visit

## What is NOT tracked

- IP addresses
- Names, emails, or any personally identifiable information
- Behaviour within a page (clicks, scroll depth, time on page)
- Anything when cookies are rejected

## How consent works

1. On first visit the **cookie consent popup** appears.
2. If the visitor accepts analytics, their choice is saved to `localStorage` (`cc_consent`).
3. `trackPageView()` checks this flag on every navigation — if analytics are off, the function returns immediately and **nothing is written to the database**.
4. The popup never appears again once answered.

## Dev / localhost protection

`trackPageView()` has an early return when `import.meta.env.DEV === true` — so **running `npm run dev` will never pollute your production analytics data**.

## Where data lives

Stored in Supabase table `page_views`. Row-Level Security (RLS) policies:

| Operation | Who can do it                    |
| --------- | -------------------------------- |
| `INSERT`  | Anyone (anonymous visitors)      |
| `SELECT`  | Authenticated users only (admin) |

## Viewing stats

Log in to the Admin Panel → **📊 Analytics** tab. Supports 7-day and 30-day views, including:

- Daily views + sessions bar chart
- Summary cards (today, this week, total)
- Top pages
- Device breakdown
- Top referrers

## Data retention

Records are kept for **up to 12 months** (our chosen policy under GDPR's storage limitation principle). There is no legal fixed maximum — this is just a reasonable, justifiable period that allows year-over-year comparisons.

## SQL migration

The table schema and RLS policies live in [`scripts/create_page_views_table.sql`](../scripts/create_page_views_table.sql). Run it once in the Supabase SQL Editor.
