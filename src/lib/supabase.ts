import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const adminSupabase =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

let actingSupabase: SupabaseClient | null = null;
const actingStorageKey = "shelterpawtners-admin-qa-acting";

function createActingClient() {
  if (!url || !publishableKey)
    throw new Error("Development connection is unavailable.");
  return createClient(url, publishableKey, {
    auth: {
      // This is deliberately a different, tab-scoped key. It never reads or
      // replaces the persisted administrator session used by adminSupabase.
      persistSession: true,
      storage: window.sessionStorage,
      storageKey: actingStorageKey,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function getActingSupabase() {
  return actingSupabase;
}
export async function restoreActingSupabase(): Promise<Session | null> {
  if (
    !url ||
    !publishableKey ||
    !window.sessionStorage.getItem(actingStorageKey)
  )
    return null;
  const client = createActingClient();
  const { data } = await client.auth.getSession();
  if (!data.session) {
    window.sessionStorage.removeItem(actingStorageKey);
    return null;
  }
  actingSupabase = client;
  return data.session;
}
export function clearActingSupabase() {
  window.sessionStorage.removeItem(actingStorageKey);
  actingSupabase = null;
  window.dispatchEvent(new Event("sp-qa-changed"));
}
export async function startActingSupabase(tokenHash: string): Promise<Session> {
  const client = createActingClient();
  // generateLink() returns a token hash. Supabase Auth's token-hash flow must
  // provide only token_hash + type; combining email with token_hash is rejected.
  const { data, error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });
  if (error || !data.session)
    throw error || new Error("Unable to start the QA persona session.");
  actingSupabase = client;
  window.dispatchEvent(new Event("sp-qa-changed"));
  return data.session;
}

function rpcWithCanonicalArgs(client: SupabaseClient) {
  const rpc = client.rpc.bind(client) as (...args: any[]) => any;
  return (
    functionName: string,
    args?: Record<string, any>,
    options?: Record<string, any>,
  ) => {
    if (
      functionName === "partner_organization_candidates" &&
      args &&
      "p_public_name" in args
    ) {
      return rpc(
        functionName,
        {
          input_public_name: args.p_public_name ?? null,
          input_legal_name: args.p_legal_name ?? null,
          input_website_url: args.p_website_url ?? null,
          input_phone: args.p_phone ?? null,
          input_street_address: args.p_street ?? null,
          input_city: args.p_city ?? null,
          input_state_province: args.p_state_province ?? null,
        },
        options,
      );
    }
    return rpc(functionName, args, options);
  };
}

// Existing application data calls resolve at call time, so QA mode uses the
// selected user's JWT while the persisted administrator session remains intact.
// The candidate-matching RPC was shipped with input_* SQL parameter names while
// the current onboarding caller still sends its earlier p_* names. Normalize
// that one established boundary here so PostgREST receives the canonical
// migration signature without changing database policy or function behavior.
export const supabase = (
  adminSupabase
    ? new Proxy(adminSupabase, {
        get(target, property, receiver) {
          const client = actingSupabase || target;
          if (property === "rpc") return rpcWithCanonicalArgs(client);
          return Reflect.get(client, property, receiver);
        },
      })
    : null
) as typeof adminSupabase;

export const googleAuthEnabled =
  import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true";
