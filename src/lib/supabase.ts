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
export async function startActingSupabase(
  email: string,
  tokenHash: string,
): Promise<Session> {
  const client = createActingClient();
  const { data, error } = await client.auth.verifyOtp({
    email,
    token_hash: tokenHash,
    type: "email",
  });
  if (error || !data.session)
    throw error || new Error("Unable to start the QA persona session.");
  actingSupabase = client;
  window.dispatchEvent(new Event("sp-qa-changed"));
  return data.session;
}

// Existing application data calls resolve at call time, so QA mode uses the
// selected user's JWT while the persisted administrator session remains intact.
export const supabase = (
  adminSupabase
    ? new Proxy(adminSupabase, {
        get(target, property, receiver) {
          return Reflect.get(actingSupabase || target, property, receiver);
        },
      })
    : null
) as typeof adminSupabase;

export const googleAuthEnabled =
  import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true";
