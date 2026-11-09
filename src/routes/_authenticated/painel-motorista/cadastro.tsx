import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { RoleGate, PageTitle } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route=createFileRoute("/_authenticated/painel-motorista/cadastro")({component:Page});
function Page(){
 const {user}=useAuth(); const [busy,setBusy]=useState(false);
 const {data:profile}=useQuery({queryKey:["driver-private-profile",user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from("driver_private").select("*").eq("driver_id",user!.id).maybeSingle();if(error)throw error;return data;}});
 const [f,setF]=useState({cpf:"",cnh_number:"",cnh_category:""}); 
 async function save(){setBusy(true);const {error}=await supabase.from("driver_private").upsert({driver_id:user!.id,...f},{onConflict:"driver_id"});setBusy(false);if(error)alert(error.message);else alert("Dados salvos.");}
 return <RoleGate role="driver"><main className="mx-auto max-w-3xl px-4 py-10"><PageTitle title="Cadastro do motorista" subtitle="Complete os dados necessários para análise e aprovação."/><Card><CardHeader><CardTitle>Documentação</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>CPF</Label><Input value={f.cpf||profile?.cpf||""} onChange={e=>setF({...f,cpf:e.target.value})}/></div><div><Label>CNH</Label><Input value={f.cnh_number||profile?.cnh_number||""} onChange={e=>setF({...f,cnh_number:e.target.value})}/></div><div><Label>Categoria da CNH</Label><Input value={f.cnh_category||profile?.cnh_category||""} onChange={e=>setF({...f,cnh_category:e.target.value})}/></div><Button onClick={save} disabled={busy}>{busy?"Salvando...":"Salvar dados"}</Button></CardContent></Card></main></RoleGate>;
}