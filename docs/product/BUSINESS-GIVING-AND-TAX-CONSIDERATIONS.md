# Business giving and tax considerations

Status: **DRAFT — informational, not tax or legal advice, and not yet published to businesses.** Written for business owners considering shelter giving through RAVE Shelter / ShelterPawtners. Everything here needs a CPA or tax attorney's review before it becomes public-facing content, and several sections cannot be finalized until the owner decisions below are made.

## Why this document exists

The owner asked for a specific, business-facing explanation of how giving and tax savings could work, so businesses can decide whether to participate with a clear picture — not a vague promise. This is that document, written honestly about what is settled and what is not.

## What ShelterPawtners is, and is not, in this picture

**ShelterPawtners is not a nonprofit, a donor-advised fund, or a payment processor.** It is a marketplace platform. When a participating business chooses to direct a share of eligible sales to a shelter (see the Hero Vendor program), ShelterPawtners's role is to:

- make the commitment visible and trackable;
- connect the business to a qualified third-party giving processor for the actual transfer of funds;
- show what has been pledged versus what the processor confirms as completed.

**ShelterPawtners does not take custody of donated funds**, does not decide which recipients qualify as tax-exempt, and does not issue tax receipts. That is deliberate: money movement and nonprofit-status verification are exactly the kind of regulated activity a specialized third party is built for, and a marketplace platform should not be inventing that infrastructure itself.

## The third-party processor: what it needs to do, and why we have not picked one yet

A donation-processing partner for this program needs to, at minimum:

1. Verify a recipient organization's IRS 501(c)(3) status (or the equivalent for a municipal shelter or fiscal-sponsored rescue) before funds are released.
2. Handle the actual transfer of funds from the business to the recipient.
3. Issue a compliant donor tax receipt to the correct legal donor of record.
4. Give both the business and ShelterPawtners a way to confirm a transaction completed, without giving either party custody of the funds mid-transfer.

Candidates in this space include donor-advised-fund platforms, embedded-giving APIs built for exactly this kind of marketplace integration, and fiscal-sponsorship intermediaries. **No specific vendor has been selected.** That selection is a commercial and compliance decision — it involves contract terms, fee structure, and a compliance review — and is explicitly one of the owner decisions this document cannot get ahead of. See `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md`, OD-004.

## What a business should understand about the tax picture today

None of the following is tax advice. It is a plain-language map of the considerations, so a business owner knows what questions to bring to their own accountant.

- **A gift to a qualified 501(c)(3) is generally deductible as a charitable contribution, subject to the usual IRS rules** — but "generally" is doing real work in that sentence. Deductibility depends on the recipient's actual tax status, how the gift is structured, and the business's own tax situation (a sole proprietorship, an S-corp, and a C-corp are not treated identically).
- **A gift baked into a "buy one, we donate one" style offer is not automatically the same as a straightforward cash donation** for tax purposes. If the "donation" is really a marketing cost, or if the business receives something of value in return for it, that can change how it is characterized. This is exactly the kind of structuring question a CPA needs to look at before any specific claim is published.
- **Who the legal donor of record is matters.** If ShelterPawtners or a processor is described as facilitating the gift, the business itself is very likely still the donor of record for tax purposes, not ShelterPawtners — but that depends on how the chosen processor structures the transaction, which is not yet decided.
- **A pledge is not a payment.** Committing to give 5% of eligible sales is not a deductible event by itself; the actual transfer, once it happens, is what matters for tax purposes, in the year it happens.

## What we will and will not publish, until the above is settled

We will not:

- state a specific percentage of tax savings a business can expect;
- claim a contribution is deductible without qualification;
- represent that ShelterPawtners or any of its brands issues a tax receipt;
- describe a pledge as a completed donation.

We will, once the processor is selected and the flow reviewed:

- publish the exact mechanics of how a business's gift moves from pledge to confirmed transfer;
- pass along whatever documentation the processor issues, verbatim, rather than restating it in our own words;
- keep pledged and confirmed amounts visible as two separate numbers, always.

## Recommended next steps for the owner

1. Select and contract with a giving-processor partner (OD-004). This is the single blocking decision behind everything else in this document.
2. Have a CPA or tax attorney review this document before any version of it is shown to a real business.
3. Decide whether ShelterPawtners wants to publish general educational content about business charitable giving (with a clear "not tax advice, consult your own advisor" disclaimer) or intentionally stay silent on tax mechanics and let the processor's own materials carry that weight. Either is defensible; silence is safer but less useful to a business trying to decide whether to participate.
4. Once a processor is chosen, replace the placeholder mechanics above with the real flow and re-review the whole document.

## Related reading

- `docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md` — the parallel guardrail for Guardian-side savings claims; the same discipline applies here.
- `docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md` — the data-model proposal for tracking pledged versus confirmed giving on both the Guardian and business side.
- `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md` — OD-004 and the other open financial decisions this document depends on.
