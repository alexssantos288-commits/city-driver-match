import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Role = Database["public"]["Enums"]["app_role"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  user: User | null;
  roles: Role[];
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  hasRole: (r: Role) => boolean;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children, onIdentityChange }: { children: ReactNode; onIdentityChange?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setRoles([]);
      setProfile(null);
      setLoading(false);
      return;
    }
    const [r, p] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", u.id),
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
    ]);
    setRoles((r.data ?? []).map((x) => x.role));
    setProfile(p.data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => load(data.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setTimeout(() => {
        load(session?.user ?? null);
        onIdentityChange?.();
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [load, onIdentityChange]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    await load(data.user ?? null);
  }, [load]);

  return (
    <Ctx.Provider value={{ user, roles, profile, loading, refresh, hasRole: (r) => roles.includes(r) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fora do AuthProvider");
  return c;
}

export function homeFor(roles: Role[]): "/admin" | "/painel-motorista" | "/motoristas" {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("driver")) return "/painel-motorista";
  return "/motoristas";
}
