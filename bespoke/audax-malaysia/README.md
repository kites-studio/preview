# Audax Malaysia — Stage 1

2 October 2026 · Design prototype for discussion with Sam Tow.

## What's included
Twelve navigable pages: Home; Rides & Tickets; four event pages; Start Here; Results; Past Rides; Recognition; About; Contact. Based on the supplied cycling reference: photographic opening, oversized type, white space, charcoal sections and a proposed lime accent.

Working features: responsive menu; distance filters; first-ride FAQs; search, distance filtering and progressive display of selected real published results; external registration links; phone, map and event archive links. Local photography is sourced from Audax Malaysia's website supplied by the user. No invented testimonials, awards or organisers. No account/payment/contact backend created.

Registration uses the existing source links for Ice Cream Ride and Pink Ride. Ticket2U returned 403 to automated checking, so availability/payment cannot be independently verified. No transaction submitted. Prices and eligibility remain with the registration provider; future rides without registration links are explicitly marked announced. Pink Ride's inconsistent Permanent distances and jersey eligibility are flagged rather than guessed.

Results: 300 selected public records from the first displayed 100 rows in each of three tables on the 100th BRM results page. The preview does not claim to be the complete result database. Full organiser results are linked.

## Run or share the portable copy
Serve the `dist` directory with any static web server. For example, from dist: `python3 -m http.server 8080`, then open http://localhost:8080. Direct file double-click is not supported because routes and assets use root paths. The ZIP is a portable static-site handoff, not an installer.

## Before official replacement
Confirm Sam's preferred identity/colours, image permissions, event copy, ticket destinations, final fees, membership/shop scope, policies and result-release process. The preview is marked as a design preview and has noindex metadata. It does not replace audaxmalaysia.com. Footer attribution can be adjusted in the approved version.

## Sources
- https://www.audaxmalaysia.com/
- https://www.audaxmalaysia.com/upcoming-rides
- https://www.audaxmalaysia.com/audax-ice-cream-ride-3
- https://www.audaxmalaysia.com/pink-ride-10
- https://www.audaxmalaysia.com/homo-100th-brm
- https://www.audaxmalaysia.com/past-rides
- https://www.audaxmalaysia.com/hall-of-fame

Image URLs and visual checks: ../../../assets/audax-malaysia/selected-assets.json. Research material and screenshot reference are excluded from hosted assets. Typography: locally served Geist, licence included.

## Validation
36 successful route/viewport checks at 1440, 390 and 320 pixels. No page errors, broken photos, horizontal page overflow, missing control names or empty links. Menu, Escape, ride filtering/reset, result search/distance/empty state/more records, FAQ disclosure and local links checked. Desktop/mobile screenshots inspected. Reduced-motion rendering checked. Payment, provider availability, screen-reader behaviour and a complete accessibility audit are unverified.

## GitHub Pages
Published via the parent repository’s kites-demos subtree. Client link: https://kites-studio.github.io/preview/audax-malaysia/ . Catalogue: https://kites-studio.github.io/preview/all/ . Page assets and navigation are scoped to /preview/bespoke/audax-malaysia/.

Design preference: no decorative numbered section labels or eyebrow rules.

## 5 October editorial refinement
Removed decorative small text and repeated copy. Five provisional Pexels cycling images, responsive 750/1200/2400 px WebP, with high-resolution originals and source records in ../../../assets/audax-malaysia/editorial/. These are editorial placeholders, not Audax event photography. Full decision and validation record: ../../../docs/AUDAX-EDITORIAL-PASS.md.

## Booking and motion
Sticky booking header, accessible native booking dialog, controlled hero slideshow and reduced-motion fallback. Twelve unique image placements site-wide. Date/type cards replace repeating photos. Dedicated checks and source record: ../../../docs/AUDAX-BOOKING-PASS.md.

## Shop prototype
Sample jerseys and bicycles, demo RM prices, local bag and checkout preview at `/shop/`. No personal/payment fields or order submission. Six size-selectable products, category/price controls and sample fulfilment fees. Source and scope: `docs/AUDAX-SHOP-PASS.md`.

## Homepage calendar
Upcoming / Full 2026 season board replaces homepage ride cards. Current official upcoming dates override the old poster. All-day upcoming-date download: `audax-upcoming-rides.ics`. Scope/source/validation: `docs/AUDAX-CALENDAR-PASS.md`.

## 2 November 2026 update
Live calendar synced with audaxmalaysia.com (checked 2 Nov 2026): November unmanned Santai 600 / Open 300, Final Push BRM400, Pink Ride 10.0 and the announced 2027 season. Rides retire automatically the day after they end (Ice Cream Ride 3.0 and the 1 Nov SR ride moved to Past Rides). New Pink Ride 10.0 flagship page (`pink.js`, `campaign.css`): entry options (RM85 with free jersey for first 500; ladies RM10 commitment or RM65 package), three distances, jersey and finisher tee, first-timer sweeper truck, venue, FAQ. Sample bicycle shop replaced by Official Kit using the organiser's own jersey, tee and size chart artwork; no cart or payments. Booking still hands off to Ticket2U.
