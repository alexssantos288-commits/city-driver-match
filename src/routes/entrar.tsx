import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { homeFor, type Role } from "@/lib/auth";
import { errMsg } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/entrar")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => ({
    meta: [
      { title: "Entrar — INTEGRETY DRIVER" },
      { name: "description", content: "Acesse sua conta de passageiro, motorista ou administrador." },
      { property: "og:title", content: "Entrar — INTEGRETY DRIVER" },
      { property: "og:description", content: "Acesse sua conta na INTEGRETY DRIVER." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(errMsg(error));
    }
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const roles = (r ?? []).map((x) => x.role as Role);
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      window.history.replaceState(null, "", redirect);
      navigate({ to: redirect as never, replace: true });
    } else navigate({ to: homeFor(roles), replace: true });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader><CardTitle className="font-display text-2xl">Entrar</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <Link to="/recuperar-senha" className="text-muted-foreground underline">Esqueci a senha</Link>
            <Link to="/cadastro" className="font-semibold underline">Criar conta</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
