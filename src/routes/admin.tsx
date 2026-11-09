import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { RoleGate, PageTitle } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Section = "drivers" | "documents" | "users" | "cities" | "audit";

function AdminPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [section, setSection] = useState<Section>("drivers");
  const [busy, setBusy] = useState<string | null>(null);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("MG");

  const drivers = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("driver_profiles")
        .select("id,status,submitted_at,approved_at,rejection_reason,rating_avg,rating_count,profiles!driver_profiles_id_fkey(full_name,phone,city_id, cities(name,state))")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const documents = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("driver_documents").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) throw error;
      return data ?? [];
    },
  });
  const cities = useQuery({
    queryKey: ["admin-cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const audit = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  async function refresh() {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-drivers"] }),
      qc.invalidateQueries({ queryKey: ["admin-documents"] }),
      qc.invalidateQueries({ queryKey: ["admin-users"] }),
      qc.invalidateQueries({ queryKey: ["admin-cities"] }),
      qc.invalidateQueries({ queryKey: ["admin-audit"] }),
    ]);
  }
  async function reviewDriver(id: string, status: "approved" | "rejected") {
    setBusy(id);
    const { error } = await supabase.rpc("admin_review_driver", {
      p_driver: id, p_status: status, p_reason: reason[id] || undefined,
    });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success(status === "approved" ? "Motorista aprovado." : "Cadastro reprovado."); setReason((v) => ({ ...v, [id]: "" })); await refresh(); }
  }
  async function reviewDocument(id: string, status: "approved" | "rejected") {
    setBusy(id);
    const { error } = await supabase.rpc("admin_review_document", {
      p_doc: id, p_status: status, p_notes: reason[id] || undefined,
    });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success("Documento analisado."); await refresh(); }
  }
  async function suspend(id: string, suspended: boolean) {
    setBusy(id);
    const { error } = await supabase.rpc("admin_set_user_suspended", {
      p_user: id, p_suspended: suspended, p_reason: reason[id] || undefined,
    });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success(suspended ? "Usuário suspenso." : "Acesso reativado."); await refresh(); }
  }
  async function saveCity() {
    if (!cityName.trim() || !cityState.trim()) return toast.error("Informe cidade e UF.");
    setBusy("city");
    const { error } = await supabase.rpc("admin_upsert_city", { p_name: cityName.trim(), p_state: cityState.trim().toUpperCase(), p_active: true });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success("Cidade cadastrada."); setCityName(""); await refresh(); }
  }
  async function toggleCity(id: string, name: string, state: string, active: boolean) {
    setBusy(id);
    const { error } = await supabase.rpc("admin_upsert_city", { p_name: name, p_state: state, p_active: !active });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success("Cidade atualizada."); await refresh(); }
  }

  const sections: { id: Section; label: string }[] = [
    { id: "drivers", label: "Motoristas" }, { id: "documents", label: "Documentos" },
    { id: "users", label: "Usuários" }, { id: "cities", label: "Cidades" }, { id: "audit", label: "Auditoria" },
  ];

  return <RoleGate role="admin">
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PageTitle title="Painel administrativo" subtitle="Controle operacional da plataforma INTEGRETY DRIVER." />
      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((s) => <Button key={s.id} size="sm" variant={section === s.id ? "default" : "outline"} onClick={() => setSection(s.id)}>{s.label}</Button>)}
      </div>

      {section === "drivers" && <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total de cadastros</p><p className="text-2xl font-bold">{drivers.data?.length ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Aguardando análise</p><p className="text-2xl font-bold">{drivers.data?.filter((d: any) => d.status === "pending").length ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Aprovados</p><p className="text-2xl font-bold">{drivers.data?.filter((d: any) => d.status === "approved").length ?? 0}</p></CardContent></Card>
        </div>
        {drivers.isLoading ? <p>Carregando motoristas…</p> : drivers.data?.map((d: any) => {
          const p = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles;
          const city = Array.isArray(p?.cities) ? p.cities[0] : p?.cities;
          return <Card key={d.id}><CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold">{p?.full_name ?? "Motorista sem nome"}</h3><p className="text-sm text-muted-foreground">{p?.phone ?? "Sem telefone"} · {city ? city.name + "/" + city.state : "Cidade não informada"}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{d.status}</span></div>
            <p className="text-xs text-muted-foreground">Avaliação: {Number(d.rating_avg ?? 0).toFixed(1)} ({d.rating_count ?? 0}) · Enviado: {d.submitted_at ? new Date(d.submitted_at).toLocaleString("pt-BR") : "Não enviado"}</p>
            {d.rejection_reason && <p className="text-sm text-destructive">Motivo anterior: {d.rejection_reason}</p>}
            {d.status !== "approved" && <><div><Label>Observação / motivo</Label><Textarea rows={2} value={reason[d.id] ?? ""} onChange={(e) => setReason((v) => ({ ...v, [d.id]: e.target.value }))} placeholder="Opcional; obrigatório para contextualizar uma reprovação." /></div><div className="flex flex-wrap gap-2"><Button size="sm" disabled={busy === d.id} onClick={() => reviewDriver(d.id, "approved")}>Aprovar motorista</Button><Button size="sm" variant="destructive" disabled={busy === d.id} onClick={() => reviewDriver(d.id, "rejected")}>Reprovar cadastro</Button></div></>}
          </CardContent></Card>;
        })}
      </div>}

      {section === "documents" && <div className="space-y-3">
        {documents.data?.length ? documents.data.map((doc: any) => <Card key={doc.id}><CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap justify-between gap-2"><div><b>{doc.doc_type}</b><p className="text-xs text-muted-foreground">Motorista: {doc.driver_id} · {new Date(doc.created_at).toLocaleString("pt-BR")}</p><p className="break-all text-xs text-muted-foreground">{doc.file_path}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{doc.status}</span></div>
          <div><Label>Observação da análise</Label><Input value={reason[doc.id] ?? ""} onChange={(e) => setReason((v) => ({ ...v, [doc.id]: e.target.value }))} placeholder="Motivo da reprovação ou observação" /></div>
          {doc.status === "pending" && <div className="flex gap-2"><Button size="sm" disabled={busy === doc.id} onClick={() => reviewDocument(doc.id, "approved")}>Aprovar documento</Button><Button size="sm" variant="destructive" disabled={busy === doc.id} onClick={() => reviewDocument(doc.id, "rejected")}>Reprovar</Button></div>}
        </CardContent></Card>) : <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Nenhum documento enviado.</CardContent></Card>}
      </div>}

      {section === "users" && <div className="space-y-3">
        {users.data?.map((u: any) => <Card key={u.id}><CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap justify-between gap-2"><div><b>{u.full_name || "Sem nome"}</b><p className="text-sm text-muted-foreground">{u.email} · {u.phone || "Sem telefone"} · {u.city_name || "Sem cidade"}</p><p className="text-xs text-muted-foreground">Perfis: {(u.roles ?? []).join(", ") || "nenhum"} · Desde {new Date(u.created_at).toLocaleDateString("pt-BR")}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{u.suspended ? "Suspenso" : "Ativo"}</span></div>
          <div className="flex flex-wrap items-center gap-2"><Input className="max-w-sm" value={reason[u.id] ?? ""} onChange={(e) => setReason((v) => ({ ...v, [u.id]: e.target.value }))} placeholder="Motivo (opcional)" /><Button size="sm" variant={u.suspended ? "outline" : "destructive"} disabled={busy === u.id || u.id === user?.id} onClick={() => suspend(u.id, !u.suspended)}>{u.suspended ? "Reativar acesso" : "Suspender usuário"}</Button></div>
        </CardContent></Card>)}
      </div>}

      {section === "cities" && <div className="space-y-4">
        <Card><CardHeader><CardTitle>Adicionar cidade</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end"><div><Label>Município</Label><Input value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="Ex.: Juiz de Fora" /></div><div><Label>UF</Label><Input value={cityState} onChange={(e) => setCityState(e.target.value)} maxLength={2} /></div><Button onClick={saveCity} disabled={busy === "city"}>Salvar cidade</Button></CardContent></Card>
        <div className="space-y-2">{cities.data?.map((c: any) => <Card key={c.id}><CardContent className="flex items-center justify-between gap-3 p-4"><div><b>{c.name}/{c.state}</b><p className="text-xs text-muted-foreground">{c.active ? "Ativa no cadastro" : "Inativa"}</p></div><Button size="sm" variant="outline" disabled={busy === c.id} onClick={() => toggleCity(c.id, c.name, c.state, c.active)}>{c.active ? "Desativar" : "Ativar"}</Button></CardContent></Card>)}</div>
      </div>}

      {section === "audit" && <div className="space-y-2">
        {audit.data?.map((a: any) => <Card key={a.id}><CardContent className="p-4"><div className="flex flex-wrap justify-between gap-2"><b>{a.action}</b><span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("pt-BR")}</span></div><p className="text-xs text-muted-foreground">Administrador: {a.admin_id} · Alvo: {a.target_table} {a.target_id ?? ""}</p><pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(a.details, null, 2)}</pre></CardContent></Card>)}
        {!audit.data?.length && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Nenhum registro de auditoria disponível.</CardContent></Card>}
      </div>}
    </main>
  </RoleGate>;
}
