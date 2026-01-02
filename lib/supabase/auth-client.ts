import { createBrowserClient } from "@supabase/ssr";

export async function getCurrentUser() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.auth.getUser();
  return data?.user || null;
}

export function isLoggedInSync() {
  if (typeof window === "undefined") return false;
  // Supabase session key format: sb-<projectRef>-auth-token
  const sessionKey = Object.keys(localStorage).find(
    (k) => k.startsWith("sb-") && k.endsWith("-auth-token")
  );
  if (!sessionKey) return false;
  try {
    const session = JSON.parse(localStorage.getItem(sessionKey) || "null");
    // Supabase v2+ session object has access_token
    return !!session?.access_token;
  } catch {
    return false;
  }
}
