# IPO List — Full Product Plan

## 1. Product Vision

**Brand:** IPO List  
**Primary market:** India  
**Coverage:** Mainboard + SME IPOs  
**UI:** Clean white + primary blue, modern, fast, mobile-first  
**Core priorities:** UI quality + strong technical SEO

The core promise:

> **IPO List — IPO GMP, Allotment Status, Dates & Latest IPO Details**

A visitor should be able to quickly find:

- What IPOs are open today
- What IPOs are upcoming
- Current GMP
- GMP percentage
- GMP movement/history
- Expected listing price
- Price band
- Lot size
- Minimum investment
- Issue size
- Subscription status
- Allotment date/status
- Listing date
- Where to check IPO allotment

---

# 2. Recommended Architecture

```text
                         ┌────────────────────┐
                         │   Source Websites  │
                         │ IPOWatch / IPOJi   │
                         │ IPOPremium / etc.  │
                         └─────────┬──────────┘
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │ Vercel Cron / Scheduler │
                     │       Every 1 hour      │
                     └────────────┬────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Next.js Serverless Route  │
                    │ /api/cron/sync-ipos       │
                    │                           │
                    │ Source adapters           │
                    │ Normalize                 │
                    │ Deduplicate               │
                    │ Validate                  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │   Firestore    │
                         │ IPOs           │
                         │ GMP History    │
                         │ Sources        │
                         │ Settings       │
                         └───────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             Public website              Admin panel
             Next.js SSR/ISR            /admin
             SEO pages                  Manual override
```

There is no need for a separate Java/Node backend initially.

Next.js can handle:

- Frontend
- Server Components
- API routes
- Cron endpoints
- Admin operations
- Server-rendered SEO pages

Everything can be deployed as one Vercel project.

---

# 3. Tech Stack

| Requirement | Recommendation |
|---|---|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui or custom components |
| Hosting | Vercel |
| Database | Firebase Firestore |
| Admin authentication | Firebase Auth |
| Server-side DB access | Firebase Admin SDK |
| Scraping | Cheerio + native fetch |
| Scheduling | Vercel Cron |
| Validation | Zod |
| Dates | date-fns |
| Charts | Recharts |
| Forms | React Hook Form |
| SEO | Next.js Metadata API |
| Analytics | Google Analytics + Search Console |
| Icons | Lucide |
| Images | Firebase Storage or Cloudinary later |

Avoid Puppeteer initially unless a source absolutely requires browser rendering.

HTML scraping with:

```text
fetch()
+
cheerio
```

will be lighter, faster and cheaper.

---

# 4. Vercel Cron

The initial requirement is an hourly scraper.

A typical cron expression is:

```text
0 * * * *
```

The exact available frequency depends on the Vercel plan.

If you want to stay extremely cheap initially, another option is:

```text
GitHub Actions
      ↓
call
      ↓
/api/cron/sync-ipos
```

The scraper itself should remain independent of the scheduler so switching later is easy.

---

# 5. Firestore as the Source of Truth

Do **not** scrape the source website whenever a visitor opens the homepage.

### Bad

```text
User opens homepage
↓
Website scrapes IPOWatch
↓
Website renders result
```

### Good

```text
Every hour
↓
Scraper gets latest information
↓
Normalize data
↓
Compare with Firestore
↓
Only write changed values
↓
Website reads Firestore
```

If a source website temporarily goes down, IPO List continues serving the latest stored data.

---

# 6. Firestore Data Model

Main collection:

```text
ipos/{ipoId}
```

Example:

```json
{
  "name": "Example Industries Limited",
  "slug": "example-industries-ipo",

  "logo": "/logos/example.webp",

  "type": "MAINBOARD",
  "exchange": ["NSE", "BSE"],

  "status": "OPEN",

  "priceBand": {
    "min": 120,
    "max": 125
  },

  "lotSize": 120,

  "issueSize": 800.5,

  "minimumInvestment": 15000,

  "dates": {
    "open": "...",
    "close": "...",
    "allotment": "...",
    "listing": "..."
  },

  "gmp": {
    "value": 35,
    "percentage": 28,
    "expectedListingPrice": 160,
    "lastUpdated": "..."
  },

  "subscription": {
    "total": 23.4,
    "retail": 18.3,
    "nii": 34.8,
    "qib": 29.2
  },

  "allotment": {
    "status": "AWAITED"
  },

  "listing": {
    "price": null,
    "gainPercentage": null
  },

  "seo": {
    "title": null,
    "description": null
  },

  "source": {
    "lastSource": "ipowatch",
    "lastScrapedAt": "..."
  },

  "manualOverrides": {},

  "createdAt": "...",
  "updatedAt": "..."
}
```

---

# 7. GMP History

Create a subcollection:

```text
ipos/{ipoId}/gmpHistory/{historyId}
```

Example:

```json
{
  "gmp": 35,
  "percentage": 28,
  "expectedListingPrice": 160,
  "capturedAt": "2026-09-12T07:00:00Z",
  "source": "ipowatch"
}
```

This allows the site to display:

```text
12 Sep    ₹35    +₹5
11 Sep    ₹30    +₹2
10 Sep    ₹28    -₹4
09 Sep    ₹32
```

And eventually:

- GMP chart
- 7-day change
- GMP high/low
- GMP trend
- Historical GMP table

This historical database can become one of IPO List's strongest differentiators.

---

# 8. IPO Status System

Don't use arbitrary status text.

Use an enum:

```typescript
type IPOStatus =
  | "UPCOMING"
  | "PRE_APPLY"
  | "OPEN"
  | "CLOSED"
  | "ALLOTMENT_AWAITED"
  | "ALLOTMENT_OUT"
  | "LISTING_TODAY"
  | "LISTED";
```

Most status values should be calculated automatically from dates.

For example:

```text
today < openDate
→ UPCOMING

openDate <= today <= closeDate
→ OPEN

today > closeDate && allotment not out
→ ALLOTMENT_AWAITED

allotmentOut = true
→ ALLOTMENT_OUT

listingDate = today
→ LISTING_TODAY

today > listingDate
→ LISTED
```

Admin should always be able to override the calculated status.

---

# 9. Manual Override Architecture

This is critical.

Suppose the scraper finds:

```text
GMP = ₹42
```

but you manually know the current GMP should be:

```text
₹45
```

The next scraper run should not overwrite your manual value.

Store field-level overrides:

```json
{
  "manualOverrides": {
    "gmp.value": true,
    "allotment.status": true
  }
}
```

Scraper logic:

```typescript
if (!manualOverrides["gmp.value"]) {
  updateGmp(scrapedGmp);
}
```

Admin UI:

```text
GMP

[ ₹45 ]

Source
● Manual Override
○ Automatic
```

This should be supported for important fields.

---

# 10. Multiple Scraper Source Adapters

Do not tightly couple the entire application to one source.

Recommended structure:

```text
/lib/scrapers/

ipoWatch.ts
ipoPremium.ts
ipoJi.ts
chittorgarh.ts
types.ts
normalizer.ts
deduplicator.ts
```

Every scraper should return the same internal structure:

```typescript
interface ScrapedIPO {
  name: string;
  priceMin?: number;
  priceMax?: number;
  gmp?: number;
  openDate?: Date;
  closeDate?: Date;
  allotmentDate?: Date;
  listingDate?: Date;
  lotSize?: number;
  issueSize?: number;
  subscription?: number;
}
```

Architecture:

```text
IPOWatch
      \
IPO Premium
        \
IPOJi ------> Normalizer → Validator → Firestore
        /
Other source
```

Later, source priority can be configurable.

---

# 11. GMP Source Priority

Do not blindly average GMP values.

Suppose:

```text
IPOWatch      ₹50
IPOJi         ₹47
IPOPremium    ₹48
```

Don't simply calculate:

```text
(50 + 47 + 48) / 3
```

Instead use:

```text
Primary GMP source
+
Fallback sources
```

Internally store the source information:

```json
{
  "value": 50,
  "source": "ipowatch",
  "scrapedAt": "..."
}
```

Potentially later show:

```text
Observed GMP Range
₹47 – ₹50
```

GMP should also be clearly described as unofficial and unregulated.

---

# 12. Deduplication

The same IPO can appear as:

```text
ABC Limited
ABC Ltd.
ABC Ltd IPO
ABC Limited IPO
```

Normalize names:

```text
"ABC Limited IPO"
↓
"abc"
```

Remove common suffixes such as:

```text
limited
ltd
ipo
```

and normalize punctuation/spacing.

However, name matching alone isn't enough.

Create a fingerprint:

```text
normalizedName
+
openDate
+
priceBand
+
type
```

Example:

```text
abc|2026-09-17|120-125|mainboard
```

Never automatically create duplicates if the match is uncertain.

For uncertain matches, admin can show:

```text
Possible duplicate found

Scraped:
ABC Industries IPO

Existing:
ABC Industries Limited

[Merge]
[Create New]
[Ignore]
```

---

# 13. Allotment Feature

When the IPO becomes:

```text
ALLOTMENT_OUT
```

show:

**Check IPO Allotment**

A modal/page can contain:

```text
Check Example IPO Allotment

Registrar
[ Check Allotment ]

Other Options
[ BSE ]
[ NSE ]
```

Store multiple links:

```json
{
  "allotmentLinks": [
    {
      "name": "Registrar",
      "url": "...",
      "priority": 1
    },
    {
      "name": "BSE",
      "url": "...",
      "priority": 2
    }
  ]
}
```

Admin should be able to:

- Add links
- Remove links
- Edit links
- Reorder links
- Set the primary link

---

# 14. Public Website Structure

Recommended routes:

```text
/
```

Homepage.

```text
/ipo
/ipo/current
/ipo/upcoming
/ipo/mainboard
/ipo/sme
```

GMP:

```text
/ipo-gmp
```

Allotment:

```text
/ipo-allotment
```

Calendar:

```text
/ipo-calendar
```

Individual IPO:

```text
/ipo/hero-motors-ipo
/ipo/example-industries-ipo
```

Potential future routes:

```text
/ipo-gmp/hero-motors-ipo
/ipo-listing
```

Educational pages:

```text
/learn/what-is-ipo
/learn/what-is-ipo-gmp
/learn/how-to-check-ipo-allotment
/learn/mainboard-vs-sme-ipo
```

---

# 15. Homepage UI

The homepage should feel like a modern financial product rather than an old information portal.

Desktop concept:

```text
┌──────────────────────────────────────────────────────────┐
│ IPO LIST     IPOs   GMP   Allotment   Calendar    Search │
└──────────────────────────────────────────────────────────┘

              Track India's IPO Market

    Latest IPO GMP, allotment status, dates and IPO details.

             [ Search IPO...                  🔍 ]


 ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
 │ Open  3 │ │Upcoming │ │Allotment│ │Listing  │
 │ IPOs    │ │   12    │ │    4    │ │    2    │
 └─────────┘ └─────────┘ └─────────┘ └─────────┘


 IPOs Today
 ───────────────────────────────────────────

 [ Mainboard ] [ SME ] [ All ]

 ┌─────────────────────────────────────────┐
 │ LOGO  Hero Motors                 OPEN │
 │                                         │
 │ ₹79 – ₹84                 GMP ₹8 ↑      │
 │ Lot 178                   +9.5%         │
 │                                         │
 │ Sep 16 → Sep 18                        │
 │                                         │
 │ View IPO →                              │
 └─────────────────────────────────────────┘
```

On mobile, use cards rather than forcing users to horizontally scroll large tables.

Desktop can have:

```text
Cards | Table
```

toggle.

---

# 16. IPO Detail Page

This is the most important SEO page template.

Example structure:

```text
Hero Motors IPO
Mainboard • OPEN

₹79 – ₹84              GMP ₹8
Price Band             +9.52%

Lot Size               Expected Listing
178                    ₹92

────────────────────────────────

IPO Timeline

✓ Open
Sep 16

● Close
Sep 18

○ Allotment
Sep 21

○ Listing
Sep 23

────────────────────────────────

Hero Motors IPO GMP

Current GMP        ₹8
GMP %              9.52%
Expected price     ₹92
Last updated       12:30 PM

[GMP graph]

Date       GMP     Change
12 Sep     ₹8      +₹2
11 Sep     ₹6      ₹0
10 Sep     ₹6      -₹1

────────────────────────────────

IPO Details

Issue Size
Lot Size
Minimum Investment
Exchange
Face Value
Issue Type
Registrar

────────────────────────────────

Subscription

Retail        3.8x
NII           5.3x
QIB           8.9x
Total         6.2x

────────────────────────────────

Allotment

Expected: Sep 21

[Check Allotment]

────────────────────────────────

About Hero Motors IPO

Original useful summary

────────────────────────────────

Important Dates

table

────────────────────────────────

FAQs
```

---

# 17. Admin Panel

Route:

```text
/admin
```

Login:

```text
/admin/login
```

Dashboard:

```text
Total IPOs             214
Open                      4
Upcoming                 12
Allotment Awaiting        6
Scraper Failures          1
```

Navigation:

```text
Dashboard
IPOs
Add IPO
GMP Updates
Allotment
Scraper
Sources
SEO
Site Settings
```

---

# 18. IPO Admin Editor

For every IPO:

```text
Basic
--------------------------------
IPO name
Slug
Logo
Mainboard / SME
Exchange

Issue
--------------------------------
Price band min
Price band max
Lot size
Issue size
Face value
Minimum investment

Dates
--------------------------------
Open
Close
Allotment
Listing

GMP
--------------------------------
GMP
Manual / automatic
Last updated

Subscription
--------------------------------
Retail
QIB
NII
Total

Allotment
--------------------------------
Awaited / Out
Registrar
Links

SEO
--------------------------------
Meta title
Description
Canonical
OG image

Controls
--------------------------------
Published
Featured
Manual override
Exclude from scraper
```

---

# 19. Admin GMP Quick Update

Create:

```text
/admin/gmp
```

Example:

| IPO | Scraped GMP | Current GMP | Mode | Action |
|---|---:|---:|---|---|
| Hero Motors | ₹8 | ₹8 | Auto | Edit |
| ABC Ltd | ₹25 | ₹28 | Manual | Edit |
| XYZ SME | ₹12 | ₹12 | Auto | Edit |

Click GMP → edit → save.

This should be one of the fastest admin workflows.

---

# 20. Scraper Dashboard

Admin:

```text
Scraper

Last Run
12 Sep 2026 12:00 PM

Duration
7.4 seconds

Sources

IPOWatch       ✓ Working
IPO Premium    ✓ Working
IPOJi          ✓ Working
Chittorgarh    ⚠ Failed

IPOs processed       34
Updated                7
Unchanged             26
New                    1
Errors                 0

[ RUN SCRAPER NOW ]
```

Maintain scraper logs in:

```text
scrapeLogs
```

---

# 21. Scraper Failure Handling

Never let one failed source stop the complete synchronization.

Use:

```typescript
const results = await Promise.allSettled([
  scrapeIpoWatch(),
  scrapeIpoPremium(),
  scrapeIpoJi()
]);
```

If:

```text
IPOWatch ❌
IPOJi ✅
IPO Premium ✅
```

the successful sources still update the database.

---

# 22. SEO Strategy

SEO should be treated as a core product feature from day one.

The important distinction is:

```text
Scraped factual data
+
our calculations
+
our historical database
+
original presentation
+
original explanations
+
useful tools
=
valuable SEO page
```

Avoid simply copying entire articles/descriptions from the source websites.

The objective is not:

```text
Copy IPOWatch
→ Change UI
→ Rank
```

Instead, create additional value around the factual data.

---

# 23. Unique SEO Value

For each IPO, calculate useful derived information.

Example:

```text
Price Band        ₹100
GMP               ₹25

IPO List calculates:

Expected Listing Price
₹125

Expected Gain
25%

Retail Lot
150 shares

Investment
₹15,000

Potential GMP Gain
₹3,750
```

Also provide:

### GMP Momentum

```text
7-day GMP change
+₹13

GMP trend
Strongly rising
```

### Historical Range

```text
7-day low
₹12

7-day high
₹28

Current
₹25
```

### Subscription Movement

```text
Day 1: 1.8x
Day 2: 7.2x
Day 3: 34.8x
```

This makes the page substantially more useful than a copied IPO listing.

---

# 24. Server Rendering

Important IPO content should be rendered on the server.

Avoid making critical information dependent on client-side:

```text
useEffect()
fetch()
```

Instead use:

```text
Server Components
+
Firestore server fetching
+
ISR
```

Google should receive HTML containing the important IPO content on the initial request.

---

# 25. Dynamic Metadata

Each IPO should have its own optimized title and description.

Example:

```text
Title:
Hero Motors IPO GMP Today ₹8, Price, Dates & Allotment | IPO List
```

Description:

```text
Hero Motors IPO GMP today is ₹8. Check Hero Motors IPO
price band, lot size, expected listing price, subscription,
allotment date and latest GMP updates.
```

Use Next.js `generateMetadata()` for dynamic pages.

---

# 26. SEO Technical Checklist

Implement from day one:

```text
✓ Metadata
✓ Canonical URLs
✓ OpenGraph
✓ Twitter metadata
✓ Dynamic sitemap
✓ robots.txt
✓ Breadcrumbs
✓ JSON-LD
✓ Internal linking
✓ Semantic HTML
✓ Image alt text
✓ Fast Core Web Vitals
✓ Proper 404 pages
✓ Redirect handling
✓ Google Search Console
✓ Analytics
```

Useful structured data can include:

```text
Organization
WebSite
BreadcrumbList
Article
```

where appropriate.

Do not add schema markup merely to make an SEO tool show a green score.

---

# 27. URL Design

Use permanent URLs:

```text
/ipo/hero-motors-ipo
```

Avoid:

```text
/ipo?id=238942
```

Also avoid putting changing GMP information in the URL.

Bad:

```text
/hero-motors-ipo-gmp-8-today
```

because the GMP changes.

---

# 28. SEO Landing Pages

Useful landing pages:

```text
/ipo
/ipo/current
/ipo/upcoming
/ipo/mainboard
/ipo/sme
/ipo-gmp
/ipo-allotment
/ipo-calendar
/ipo-listing
```

Later:

```text
/ipo/2026
/ipo/2025
/ipo/2024
```

Potentially:

```text
/ipo-gmp/2026
```

Avoid generating thousands of thin keyword variations that all show essentially the same information.

---

# 29. Homepage SEO Content

After the data sections, include concise useful explanatory content.

Example topics:

```text
Latest IPOs in India

What is IPO GMP?

How is expected listing price calculated?

How can I check IPO allotment?

What is the difference between Mainboard and SME IPOs?
```

Keep it useful rather than stuffing keywords.

---

# 30. Search Experience

Navbar:

```text
🔍 Search IPO
```

Search results could show:

```text
NSE

National Stock Exchange IPO
Mainboard • Upcoming
GMP ₹215
```

Search should work across:

- IPO name
- normalized name
- aliases
- Mainboard/SME

---

# 31. Firestore Cost Strategy

Firestore is suitable for the initial product.

The key optimization is avoiding unnecessary reads.

Use:

```text
Browser
↓
Next.js cached page
↓
Firestore
```

instead of many realtime client-side Firebase listeners.

Only write GMP history when the value changes or when you intentionally want an hourly snapshot.

---

# 32. Images

Avoid continuously scraping company logos from random websites.

Better:

```text
Admin
→ Upload logo
→ Firebase Storage
```

or later use a dedicated image storage service.

Store a stable logo URL/path with the IPO.

---

# 33. Admin Security

Do not implement:

```javascript
if (password === "mypassword")
```

in client-side JavaScript.

Use Firebase Authentication.

Flow:

```text
/admin/login
↓
Firebase Auth
↓
Authenticated user
↓
Server verifies token
↓
Check admin UID/email allow-list
↓
Admin access
```

Firestore rules should deny public writes.

Public users:

```text
read IPO data
```

Admin/server:

```text
create
update
delete
```

---

# 34. Protect Cron Endpoint

Do not leave:

```text
/api/cron/sync-ipos
```

publicly executable.

Use a secret such as:

```env
CRON_SECRET=
```

and validate the request before running the scraper.

---

# 35. Source Tracking

For every important value, internally store:

```json
{
  "value": 45,
  "source": "ipowatch",
  "scrapedAt": "..."
}
```

Eventually the admin dashboard can show:

```text
Hero Motors GMP

IPOWatch       ₹45   12:01 PM
IPOJi          ₹44   12:03 PM
IPOPremium     ₹45   12:04 PM

Published      ₹45
Source         IPOWatch
```

This makes debugging and source verification much easier.

---

# 36. New IPO Discovery

Cron process:

```text
Fetch current source
↓
Extract IPOs
↓
Normalize
↓
Find existing IPO
```

If existing:

```text
Update changed fields
```

If new:

```text
Create as DRAFT
```

Initially, do not automatically publish every newly discovered IPO.

Admin should see:

```text
New IPO detected

Hero Motors IPO

Source: IPOWatch

[ Review ]
[ Publish ]
[ Ignore ]
```

Once scraper accuracy is proven, auto-publishing can be enabled.

---

# 37. Site Settings

Admin:

```text
/admin/settings
```

Settings:

```text
Site name
Site description
Logo
Favicon
Social links
Default OG image

Primary scraper
Secondary scraper

GMP disclaimer
General disclaimer

Default SEO title
Default SEO description
```

This avoids hardcoding configuration throughout the application.

---

# 38. SEO Overrides

Each IPO can have automatically generated SEO metadata.

Admin can override it:

```text
Auto Title:
NSE IPO GMP Today, Price, Date & Allotment | IPO List

Override:
[________________________________]
```

Same approach for:

```text
description
OG image
intro content
```

Empty override → use automatic value.

---

# 39. UI Design System

Recommended visual direction:

```text
Background      #FFFFFF
Page background  #F8FAFC
Primary          blue
Text             slate-900
Muted            slate-500
Borders          slate-200
Success          emerald
Danger           red
Warning          amber
```

Use:

```text
10–14px border radius
subtle shadows
large whitespace
clear typography
```

Avoid excessive:

- Gradients
- Glassmorphism
- Animations
- Dark crypto-style dashboards

The product should feel:

```text
credible
financial
clean
fast
professional
```

---

# 40. Logo Direction

Keep the logo simple:

```text
IPO List
```

Possible direction:

- Clean wordmark
- Blue primary mark
- Small upward-market/chart treatment
- No complicated icon

The goal is recognizability and trust.

---

# 41. Mobile

Mobile is a major priority.

Target:

```text
360px
390px
430px
```

Use cards for important information.

Avoid forcing users to horizontally scroll large desktop tables.

The main actions should be easy to tap:

```text
View IPO
Check Allotment
Search
GMP
Dates
```

---

# 42. Performance Targets

Aim for:

```text
LCP < 2.5 sec
CLS < 0.1
INP < 200ms
```

Minimize:

```text
client-side JavaScript
large dependencies
large images
unnecessary animations
client-side Firebase queries
```

Use Server Components wherever possible.

---

# 43. Folder Structure

Recommended project structure:

```text
src/
│
├── app/
│   ├── page.tsx
│
│   ├── ipo/
│   │   ├── page.tsx
│   │   ├── current/
│   │   ├── upcoming/
│   │   ├── mainboard/
│   │   ├── sme/
│   │   └── [slug]/
│
│   ├── ipo-gmp/
│   ├── ipo-allotment/
│   ├── ipo-calendar/
│
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── ipos/
│   │   ├── gmp/
│   │   ├── scraper/
│   │   └── settings/
│
│   ├── api/
│   │   ├── admin/
│   │   └── cron/
│   │       └── sync-ipos/
│
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── ipo/
│   ├── admin/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   └── admin.ts
│   │
│   ├── scrapers/
│   │   ├── ipowatch.ts
│   │   ├── ipopremium.ts
│   │   ├── ipoji.ts
│   │   ├── normalizer.ts
│   │   └── deduplicator.ts
│   │
│   ├── seo/
│   └── utils/
│
├── types/
└── config/
```

---

# 44. Build Phases

## Phase 1 — Foundation

Build:

```text
Next.js project
Tailwind
Global layout
Navbar
Footer
Design system
Firebase
IPO TypeScript types
```

No scraper yet.

---

## Phase 2 — Mock Public UI

Hard-code around 10 IPOs.

Build:

```text
Homepage
IPO listing
IPO detail
GMP page
Allotment page
Mobile layouts
Search
```

Perfect the UI before adding data complexity.

---

## Phase 3 — Firestore

Replace mock data with Firestore.

Implement:

```text
IPO repository
Server-side fetching
Caching
Filters
Status calculations
```

---

## Phase 4 — Admin

Build:

```text
Admin login
IPO listing
Create IPO
Edit IPO
Delete/unpublish
GMP quick update
Allotment controls
Logo upload
SEO settings
```

At this stage the complete website should work without scraping.

---

## Phase 5 — One Scraper

Start with one source.

For example:

```text
IPOWatch adapter
```

Implement:

```text
fetch
parse
normalize
deduplicate
compare
update
logging
```

Do not build all four scrapers simultaneously.

---

## Phase 6 — Automation

Implement:

```text
/api/cron/sync-ipos
```

Then connect the scheduler.

Also add:

```text
RUN SCRAPER NOW
```

inside admin.

---

## Phase 7 — Overrides

Implement:

```text
field-level manual override
source priority
exclude-from-auto-update
```

---

## Phase 8 — SEO

Before launch:

```text
generateMetadata()
sitemap.xml
robots.txt
canonical
breadcrumbs
structured data
OG images
internal links
indexing rules
Search Console
Analytics
```

---

## Phase 9 — GMP History

Store historical GMP changes.

Then add:

```text
GMP graph
day-wise table
7-day change
high/low
expected listing calculation
```

---

## Phase 10 — Additional Sources

Only after the first scraper is reliable, add:

```text
IPOPremium
IPOJi
Chittorgarh
```

as fallback/verification sources.

---

# 45. What NOT to Build in V1

Avoid:

```text
user accounts
portfolio
IPO application
notifications
WhatsApp integration
broker integrations
mobile app
AI IPO recommendations
paid subscriptions
stock portfolio
complex CMS
microservices
```

The V1 objective should be:

> **Become the fastest, cleanest place to check an IPO's GMP, details and allotment status.**

---

# 46. V1 Feature Boundary

```text
✓ Mainboard IPOs
✓ SME IPOs

✓ Current
✓ Upcoming
✓ Closed
✓ Listed

✓ GMP
✓ GMP %
✓ Expected listing price
✓ GMP history

✓ Price band
✓ Lot size
✓ Minimum investment
✓ Issue size

✓ Opening date
✓ Closing date
✓ Allotment date
✓ Listing date

✓ Subscription

✓ Allotment status
✓ Multiple external allotment links

✓ IPO search

✓ Individual SEO pages

✓ Admin

✓ Add/edit/remove IPO
✓ GMP manual override
✓ Allotment manual override
✓ Auto/manual fields
✓ Scraper status
✓ Manual scraper run

✓ Hourly automated sync

✓ Sitemap
✓ Metadata
✓ Structured data
✓ Search Console
✓ Analytics
```

---

# 47. Core Differentiator

Do not build:

> Another IPO table website.

Build:

> **The cleanest IPO information page Google can send someone to.**

For an IPO, one excellent page should answer queries such as:

```text
"NSE IPO GMP"
"NSE IPO GMP today"
"NSE IPO allotment"
"NSE IPO date"
"NSE IPO lot size"
"NSE IPO expected listing price"
```

The page should combine:

```text
Current data
+
Historical GMP
+
Calculations
+
Timeline
+
Subscription
+
Allotment
+
Useful explanations
+
External allotment links
```

---

# 48. Final Recommended Architecture

```text
                         IPO LIST
                            │
                         Next.js
                            │
             ┌──────────────┴──────────────┐
             │                             │
       Public Website                    Admin
       SSR + ISR                      Firebase Auth
             │                             │
             └──────────────┬──────────────┘
                            │
                        Firestore
                            ▲
                            │
                     Data Processor
                            ▲
                            │
                Vercel Serverless Function
                            ▲
                            │
                      Scheduled Cron
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
       IPOWatch         IPOPremium          IPOJi
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                        Normalize
                            │
                       Deduplicate
                            │
                         Validate
                            │
                  Manual Override Check
                       /           \
                     YES           NO
                      │             │
                   Preserve       Update
```

---

# 49. Final Product Strategy

The most important thing is to avoid thinking of IPO List as a **scraping website**.

The scraper is simply your data ingestion layer.

The actual product is:

```text
                  IPO LIST
                     │
        ┌────────────┼────────────┐
        │            │            │
       DATA         UI           SEO
        │            │            │
      GMP        Clean cards    Individual
   IPO details    Fast UX       IPO pages
   Allotment      Mobile       GMP history
  Subscription    Search       Internal links
    History       Filters      Structured data
        │            │            │
        └────────────┼────────────┘
                     │
               User Trust
                     │
               Google Traffic
                     │
                Returning Users
```

The biggest long-term asset won't be the scraper.

It will be your **structured historical IPO database + GMP history + excellent pages + SEO authority**.

That is what can eventually make IPO List substantially more valuable than simply displaying the same data available on IPOWatch, IPO Premium, IPOJi or Chittorgarh.

---

# 50. Recommended Immediate Next Step

Build in this exact order:

```text
1. Finalize brand + design system
             ↓
2. Build homepage
             ↓
3. Build IPO listing pages
             ↓
4. Build IPO detail page
             ↓
5. Build allotment experience
             ↓
6. Build Firestore schema
             ↓
7. Build admin panel
             ↓
8. Build one scraper
             ↓
9. Add hourly sync
             ↓
10. Add GMP history
             ↓
11. Add remaining scrapers
             ↓
12. SEO optimization
             ↓
13. Launch
```

**Do not start with scraping.**

Start with the **public UI + page architecture**, because UI and SEO are the two things you want IPO List to win on. Once those are correct, the scraper becomes a replaceable data-ingestion layer behind the product.
