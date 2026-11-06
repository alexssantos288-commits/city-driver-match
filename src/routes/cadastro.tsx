import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { errMsg } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/cadastro")({
  validateSearch: (s: Record<string, unknown>) => ({ tipo: s["tipo"] === "motorista" ? ("motorista" as const) : undefined }),
  head: () => ({
    meta: [
      { title: "Criar conta — INTEGRETY DRIVER" },
      { name: "description", content: "Cadastre-se como passageiro ou como motorista particular." },
      { property: "og:title", content: "Criar conta — INTEGRETY DRIVER" },
      { property: "og:description", content: "Cadastre-se como passageiro ou motorista." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const { tipo } = Route.useSearch();
  const [role, setRole] = useState<"passenger" | "driver">(tipo === "motorista" ? "driver" : "passenger");
  const [f, setF] = useState({ full_name: "", email: "", phone: "", password: "", city_id: "", cpf: "", cnh_number: "", cnh_category: "" });
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await supabase.from("cities").select("id,name,state").eq("active", true).order("name")).data ?? [],
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms) { toast.error("Aceite os termos de uso e a política de privacidade."); return; }
    if (f.password.length < 8) { toast.error("A senha precisa ter ao menos 8 caracteres."); return; }
    if (!f.city_id) { toast.error("Selecione sua cidade."); return; }
    if (role === "driver" && (!f.cpf || !f.cnh_number || !f.cnh_category)) { toast.error("Informe CPF e dados da CNH."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role,
          full_name: f.full_name,
          phone: f.phone,
          city_id: f.city_id,
          terms_accepted: true,
          privacy_accepted: true,
          ...(role === "driver" ? { cpf: f.cpf.replace(/\D/g, ""), cnh_number: f.cnh_number, cnh_category: f.cnh_category.toUpperCase() } : {}),
        },
      },
    });
    setBusy(false);
    if (error) { toast.error(errMsg(error)); return; }
    setDone(true);
  }

  if (done)
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <Card><CardContent className="p-8 text-center">
          <h1 className="font-display text-2xl font-bold">Confirme seu e-mail</h1>
          <p className="mt-3 text-sm text-muted-foreground">Enviamos um link para <strong>{f.email}</strong>. Clique nele para ativar sua conta e depois entre.</p>
          <Button asChild className="mt-6"><Link to="/entrar" search={{ redirect: undefined }}>Ir para o login</Link></Button>
        </CardContent></Card>
      </main>
    );

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader><CardTitle className="font-display text-2xl">Criar conta</CardTitle></CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as "passenger" | "driver")} className="mb-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passenger">Sou passageiro</TabsTrigger>
              <TabsTrigger value="driver">Sou motorista</TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label>Nome completo</Label><Input required value={f.full_name} onChange={set("full_name")} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>E-mail</Label><Input type="email" required value={f.email} onChange={set("email")} /></div>
              <div className="space-y-2"><Label>Telefone / WhatsApp</Label><Input required value={f.phone} onChange={set("phone")} placeholder="(32) 99999-9999" /></div>
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Select value={f.city_id} onValueChange={(v) => setF({ ...f, city_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.state}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {role === "driver" && (
              <div className="grid gap-4 rounded-md border bg-muted/40 p-4 sm:grid-cols-3">
                <div className="space-y-2"><Label>CPF</Label><Input value={f.cpf} onChange={set("cpf")} inputMode="numeric" /></div>
                <div className="space-y-2"><Label>Nº da CNH</Label><Input value={f.cnh_number} onChange={set("cnh_number")} /></div>
                <div className="space-y-2"><Label>Categoria</Label><Input value={f.cnh_category} onChange={set("cnh_category")} placeholder="B" maxLength={3} /></div>
                <p className="text-xs text-muted-foreground sm:col-span-3">Esses dados ficam visíveis apenas para você e para a equipe de aprovação.</p>
              </div>
            )}
            <div className="space-y-2"><Label>Senha</Label><Input type="password" required minLength={8} value={f.password} onChange={set("password")} /></div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-0.5" />
              <span>Li e aceito os termos de uso e a política de privacidade (LGPD).</span>
            </label>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Criando…" : "Criar conta"}</Button>
          </form>
          <p className="mt-4 text-center text-sm">Já tem conta? <Link to="/entrar" search={{ redirect: undefined }} className="font-semibold underline">Entrar</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
