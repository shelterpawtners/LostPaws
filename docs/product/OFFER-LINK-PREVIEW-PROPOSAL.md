# Offer link-preview: fetching a vendor's page to propose an image

Status: proposal, 2026-09-12. Referenced by the `image_url` / `image_source_url` / `image_confirmed_by` / `image_confirmed_at` columns added in `supabase/migrations/20260912150000_offer_image_and_category_surface.sql`. Those columns exist; the fetch mechanism they assume does not yet.

## What the owner asked for

A vendor should be able to paste a link to their own existing offer page, have the platform pull an image (and ideally title/description) from that page automatically, and use it to pre-fill the offer form — "screen scraping" in the owner's words — so the vendor does less manual re-entry. The vendor reviews and confirms before anything publishes.

## Why this can't be a plain client-side fetch

A browser fetch of an arbitrary third-party URL from `OfferManager.tsx` would fail almost every time: most sites don't send CORS headers permitting cross-origin reads, so the response would be opaque to our JavaScript. This has to run server-side — a new Supabase Edge Function — which is exactly why it hasn't been built alongside the schema columns yet; it is a distinct, larger unit of work with its own security surface.

## The security problem this design exists to solve: SSRF

A server-side "fetch whatever URL a user gives you" endpoint is a textbook Server-Side Request Forgery vector: a malicious vendor could submit a URL pointing at `http://169.254.169.254/...` (cloud metadata endpoints), a private RFC1918 address, `localhost`, or an internal service, and use our server as a proxy to probe or reach infrastructure the vendor has no business touching. Any implementation of this feature is unacceptable without closing that off first. The design below is built around that constraint, not around the happy path.

## Proposed design

**New Edge Function: `supabase/functions/offer-link-preview/index.ts`**

1. **Auth**: require a valid Supabase session (same pattern as `admin-qa-session`/`support-delivery`); reject anonymous calls. Rate-limit per caller (a simple per-user counter table, or reuse whatever throttling pattern `support-delivery` already established) since this is an outbound-fetch amplifier.
2. **Input validation**: the submitted URL must parse as `http:` or `https:` only. Reject anything else (`file:`, `ftp:`, `data:`, etc.) outright.
3. **SSRF guard, before fetching**:
   - Resolve the hostname's DNS A/AAAA records ourselves.
   - Reject if any resolved address is loopback, link-local, private (RFC1918/RFC4193), multicast, or a known cloud-metadata address (169.254.169.254 and its IPv6 equivalent).
   - Re-check the final address actually connected to matches what was validated — don't trust redirects blindly; either disable automatic redirect-following and re-validate each hop manually, or cap redirects to 1-2 and re-run the same DNS check on the redirect target before following it.
4. **Fetch constraints**: short timeout (a few seconds), a byte cap on the response body (read only the first ~64KB — Open Graph tags are always in `<head>`, never require the full page), and a fixed, identifiable User-Agent string so site owners can see what's requesting their page and block it if they want.
5. **Parsing**: extract only `og:image`, `og:title`, and `og:description` meta tag content via a targeted regex or a minimal streaming HTML tokenizer — not a full DOM/JS-executing parser. No script execution, no following of further embedded resources.
6. **Response**: return the three extracted strings (or nulls) and the exact final URL fetched (for the `image_source_url` provenance field). Never return raw HTML to the client.

**Client side (`OfferManager.tsx`)**: add an optional "Preview from a link" step above the existing manual fields — a URL input plus a "Fetch preview" button that calls the function, shows the proposed image/title/description with the source URL visible, and only writes `image_url`, `image_source_url`, `image_confirmed_by` (`auth.uid()`), and `image_confirmed_at` (`now()`) to the draft offer version when the vendor explicitly clicks "Use this image" — never automatically. This mirrors exactly what the migration's own column comments already promise: _"Set only after a vendor confirms they may use it."_

## What this explicitly does not do

- It does not scrape or store anything beyond three text fields and one image URL — no page content is retained.
- It does not attempt to verify the vendor has legal rights to the image; it only avoids the platform silently asserting rights by requiring an explicit per-image confirmation, same as today's design intent.
- It does not fall back to displaying the unconfirmed image anywhere; `public_active_offers` already only returns `image_url` `case when image_confirmed_at is not null`, so nothing here needs to change that guarantee.

## Why this is a proposal and not a merged migration

This needs a real Edge Function with the SSRF guards above implemented and tested (including a test that a metadata-endpoint or private-IP URL is actually rejected, not just a documented intention) before it ships. That is a meaningfully sized, security-sensitive unit of work on its own, distinct from the marketplace layout and tagging work already merged, so it is being handed off as a scoped, reviewable next slice rather than rushed in alongside everything else built this session.
