# Kites Launch: offers, landing pages and plan

Working folder for the Kites client launch. These pages are temporary previews on GitHub Pages until Kites has its own domain and hosting. Each page carries `noindex, nofollow`, so search engines won't list it, but anyone with the link can open it.

Last updated: 9 Nov 2026

## Live previews

| Page | Link | What it covers |
| --- | --- | --- |
| Noco-style | https://kites-studio.github.io/preview/kites-launch/noco-style/ | All three offers in one page. Dark ink, sticky colour tabs per offer (red Store, blue Show Up Online, gold Level Up), mock dashboard, work carousel, client logos, FAQ |
| Designjoy-style | https://kites-studio.github.io/preview/kites-launch/designjoy-style/ | Start Your Store only. Cream, gradient price cards, penguin mascot, tilt cards, count-up price, Shopify fees note, FAQ |

Both pages are single `index.html` files with their images and scripts in the same folder. The Noco and Designjoy sites were studied for layout and motion only. No copy, logos, images or illustrations were taken from them.

## The goal

Turn Kites into an inbound client engine for Malaysian small businesses and founders. Each Meta ad goes to its own landing page, and each page drives a WhatsApp chat or a purchase.

Line: **From idea to launched online.**

Journey: Idea → Make it real → Launch (Kites) → Grow (partner plan) → Scale (custom).

## The three offers (approved 7 Nov 2026)

1. **Start Your Store** (Shopify only, never WooCommerce)
   - Starter from RM998: store set up, client adds their own products
   - Full Store from RM3,500: 30 products set up for you
   - "Start your business today. What are you waiting for? E-commerce has never been easier."
2. **Show Up Online**: a personal page for teachers, coaches, freelancers and job seekers. From RM888, one-time. "Show off who you are to the world."
3. **Level Up**: Kites as tech partner (live updates, member tracking, easy purchasing, integrations; event sites fold in here). From RM5,000 setup plus a monthly partnership, custom-quoted. Main button: book a call.

Standing rules:
- Partner plans are priced by what's included, never by hours.
- The client owns their domain and platform accounts and pays platforms directly.
- Kites never takes owner passwords; access is by collaborator permission only.

## How each page should convert

- One page per ad, headline matches the ad, no main navigation.
- WhatsApp is the main button (+60 10-215 6826), "from" price always shown.
- Simple 3-step process, specific guarantee, Malaysian trust block (business name, registration number, contact).
- Fast on mobile: largest image loads in under 2.5 seconds.
- Target: 4–6% of ad visitors start a WhatsApp chat; 10%+ is strong.

## Payments (not decided yet)

- Option A: pay online on the page (FPX via Billplz or ToyyibPay as the main button, Stripe for cards), full payment or 50% deposit.
- Option B: pay after the first WhatsApp discussion.
- Level Up always goes through a call first.
- Payment buttons on the pages are placeholders, marked `<!-- PAYMENT: swap href for payment link -->`.

## Tracking (after the domain)

- One URL per offer, UTMs on every ad.
- Meta Pixel + Conversions API: ViewContent → InitiateCheckout → Purchase, plus Lead for WhatsApp taps.
- GA4: view_item, begin_checkout, purchase, generate_lead.
- Compare which page converts best, then put spend behind it.

## Inbound engine

- Content and ads → WhatsApp or the launch form → qualify → 20-minute Launch Call for qualified leads (budget fits, launching within 60 days), Launch Kit and follow-up for the rest.
- Built: Google Form "Start your launch" and the Notion "Kites Leads Pipeline" (New → Qualified → Call booked → Quote sent → Deposit paid / Nurture / Lost).
- To do: booking page (Cal.com or Calendly), form → Notion automation, WhatsApp greeting, quick replies and labels, Launch Kit PDF, comment-to-DM "LAUNCH" flow on Instagram.

## Domain, hosting and SEO

- Main domain still to buy (kites.quest chosen; a .com is recommended too). Email: hello@ / chris@ on the new domain.
- Current site kitescomingsoon.pages.dev needs: custom domain, keyword title and description, one H1, image alt text, sitemap and Search Console, schema, Google Business Profile, case studies (with client consent).
- When the domain is live, move these pages onto it and remove `noindex`.

## Before these pages go public

- [ ] Final prices (open question: RM998 / RM1,499 / RM9,999 as new tiers, or keep current prices)
- [ ] Confirm or remove: deposit then balance before launch; "see the design before you pay the balance"; bank transfer or DuitNow QR; founding line; monthly care; Shopify fee figures; "we'll give you a date on WhatsApp before you pay"
- [ ] Swap payment placeholders for real links
- [ ] Add business name and registration number (E-Commerce Regulations 2012)
- [ ] Check both pages on a phone (mobile layout was not tested against the originals)
- [x] Client logos confirmed OK by Chris (9 Nov 2026)

## Open decisions

1. Pricing: what do 998 / 1,499 / 9,999 mean?
2. Which page style to run ads with first
3. Level Up starting monthly fee
4. Payment model: online now or after discussion
5. Booking tool: Cal.com or Calendly
6. Domain purchase and hosting
