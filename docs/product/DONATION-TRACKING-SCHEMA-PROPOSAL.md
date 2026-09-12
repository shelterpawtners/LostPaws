# Donation tracking: what already exists, and what was built on top of it

Status: discovery + implementation record, 2026-09-12. Written the way the Track 2 schema review was: check before proposing, because a prior session already did the hard part.

## The discovery

Before designing anything for "donation tracking on the guardian and business side," the schema was checked first. It already exists, from Phase 1 and Phase 2 Checkpoint 6, unused by any UI:

- **`giving_providers`** — the third-party processor concept, with `provider_type` already enumerating `every_org`, `fiscal_sponsor`, `shelterpawtners_foundation`, `other`. A candidate (Every.org) was already on the table before this session started.
- **`donation_recipients`** — links an organization to a provider with an `eligibility_status` (`pending` / `eligible` / `ineligible` / `suspended`), which is exactly the nonprofit-verification step the owner asked about.
- **`donation_intents`** — a pledge row tied to _either_ a guardian or a business (`check(guardian_id is not null or partner_organization_id is not null)`), which is precisely "both businesses and pet owners can add donations."
- **`donation_transactions`** — real, processor-confirmed transfers, with `tax_year`, `receipt_reference`, `goods_or_services_provided`, and `fair_market_value_minor` — the exact fields a compliant charitable receipt needs under IRS quid-pro-quo rules. Whoever designed this already understood the tax mechanics.
- **`donation_allocations`** — splits one transaction across recipients or campaigns.
- **`partner_contribution_commitments`** — a business's Hero-Vendor-style commitment: fixed-per-redemption, percent-of-sale, recurring, or one-time, with a designated recipient shelter.
- **`partner_contribution_settlement_evidence`** — a business submits proof a commitment was actually paid out.
- **`partner_contribution_evidence_reviews`** — a **platform admin**, not the business itself, verifies that evidence before it counts toward any public total. This is the trust layer: nothing self-reported by a business is presented as fact until an admin confirms it.
- **`partner_good_standing_reviews`** — admin-controlled standing, separate from the commitment itself.

RPCs already exist and are already security-checked: `create_partner_contribution_commitment`, `set_partner_contribution_commitment_state`, `submit_partner_contribution_evidence`, `review_partner_contribution_evidence` (admin-only), `review_partner_good_standing` (admin-only), `partner_participation_state` (a public tier: Basic Partner → Participating Partner → Redemption Verified → Shelter Impact Partner), and `public_partner_impact_summary` (public, admin-verified totals only, demo data excluded).

The migration's own header is explicit about the boundary: _"This migration intentionally does not move money, select a production giving provider, issue charitable receipts, or resolve customer-facing verified-savings rules."_ That boundary still holds. Nothing in this session moves money either.

## What was missing, and what this session built

Every piece of the above had zero UI surface — not one component referenced any of these tables or functions. That is now closed:

1. **`src/components/giving/PartnerGivingPanel.tsx`** — a business-facing panel (wired into the partner profile editor) that creates a contribution commitment, submits settlement evidence, and shows the business's own participation tier and verified totals, using the existing RPCs exactly as designed. No new database object was needed.
2. **The public partner profile** now surfaces `partner_participation_state` and `public_partner_impact_summary` so a shopper can see a business's verified standing, not just its self-description.
3. **`src/components/giving/GuardianGivingHistory.tsx`** — a read-only list of a Guardian's own `donation_intents` rows, which their existing RLS policy (`donation_intents_own_read`) already permits directly, no RPC required.

## What is still correctly blocked on the owner

- No `giving_providers` row is active; the table exists, but selecting and contracting with a real processor (Every.org or otherwise) is the actual OD-004 decision, not a schema question.
- No `donation_transactions` row can ever be created by this session, because nothing here initiates real money movement.
- The business-facing panel writes only to `partner_contribution_commitments` (a pledge) and `partner_contribution_settlement_evidence` (a claim of an external payment the business made off-platform) — both already gated by RLS to the business's own organization, and evidence only counts publicly once a platform admin verifies it.

## Why this matters for the branch-consolidation goal

If this discovery had not been done, the natural next step would have been a new schema-proposal migration duplicating `partner_contribution_commitments` under a different name — exactly the kind of rework the owner asked this session to stop repeating. Checking first, the way the market_channel review did in Track 2, cost twenty minutes and saved a full schema cycle.
