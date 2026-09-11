-- Issue #56: harden the deterministic support fingerprint helper.
-- This changes only the function execution search path; grouping behavior is unchanged.

alter function private.support_ticket_fingerprint(text, text, text)
  set search_path = pg_catalog;
