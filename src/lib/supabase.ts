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
export function getActingSupabase() {
  return actingSupabase;
}
export function clearActingSupabase() {
  actingSupabase = null;
  window.dispatchEvent(new Event("sp-qa-changed"));
}
export async function startActingSupabase(
  email: string,
  tokenHash: string,
): Promise<Session> {
  if (!url || !publishableKey)
    throw new Error("Development connection is unavailable.");
  const client = createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
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
// selected user's JWT while the persisted browser session remains the admin.
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
