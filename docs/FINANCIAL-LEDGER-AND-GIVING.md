# Financial ledger and giving

`economic_events` records the business event; `economic_event_lines` records its monetary effects. Money is stored as signed integer minor units plus ISO currency code. Finalized events and all event lines are protected from ordinary update/delete operations. Corrections use linked adjustment, reversal, refund, or replacement events.

The frontend formats money through `src/lib/currency.ts` using U.S. accounting presentation, including parentheses for negative USD amounts.

Giving remains deliberately separated:

- `donation_intents` is intention or accrual, not a charitable donation.
- `donation_transactions` is provider-reported settlement and receipt data.
- `donation_allocations` preserves historical direction.
- `donation_recipients` tracks charitable eligibility separately from shelter verification.
- `giving_providers` isolates dashboards from the eventual provider.

No raw card number, CVV, bank number, SSN, or payment credential is stored. Phase 1 makes no tax-deductibility claim and performs no live transaction.
