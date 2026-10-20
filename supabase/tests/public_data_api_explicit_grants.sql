BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(8);

-- Read-only compatibility assertions: safe to run after a fresh local reset.
-- Exercise roles with no inherited default Data API table exposure.
SELECT ok(
  (SELECT bool_and(c.relrowsecurity) FROM pg_class c
   JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')),
  'every public table has RLS enabled'
);
SELECT ok(has_table_privilege('anon', 'public.events', 'SELECT'),
  'anonymous event discovery remains grant-authorized');
SELECT ok(has_table_privilege('authenticated', 'public.pets', 'INSERT'),
  'guardian pet insertion remains grant-authorized');
SELECT ok(has_table_privilege('authenticated', 'public.offers', 'SELECT'),
  'signed-in offer reads remain grant-authorized');
SELECT ok(NOT has_table_privilege('anon', 'public.offers', 'SELECT'),
  'offers still deny direct anonymous table reads');
SELECT ok(NOT has_table_privilege('anon', 'public.support_tickets', 'SELECT'),
  'private support tickets are not directly readable by anon');
SELECT ok(has_table_privilege('service_role', 'public.store_requests', 'SELECT'),
  'server-side store request processing remains grant-authorized');
SELECT ok(has_sequence_privilege('authenticated', 'public.redemption_events_id_seq', 'USAGE'),
  'identity sequence privileges survive reset');

SELECT * FROM finish();
ROLLBACK;
