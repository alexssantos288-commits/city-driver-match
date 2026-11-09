import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route=createFileRoute("/_authenticated/passageiro/viagens")({component:Trips});
function Trips(){
 const {user}=useAuth();
 const {data:rides=[],refetch}=useQuery({queryKey:["passenger-trips",user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from("ride_requests").select("id,status,origin_address,dest_address,created_at,quoted_price,agreed_price,driver_id").eq("passenger_id",user!.id).order("created_at",{ascending:false});if(error)throw error;return data??[];}});
 async function cancel(id:string){await supabase.rpc("cancel_ride",{p_ride:id,p_reason:"Cancelada pelo passageiro"});refetch();}
 return <RoleGate role="passenger"><main className="mx-auto max-w-5xl px-4 py-10"><h1 className="font-display text-3xl font-bold">Minhas viagens</h1><p className="mt-2 text-muted-foreground">Acompanhe solicitacoes, propostas e viagens confirmadas.</p><div className="mt-6 space-y-4">{rides.length?rides.map((r:any)=><Card key={r.id}><CardHeader><CardTitle className="text-base">{r.origin_address} → {r.dest_address}</CardTitle></CardHeader><CardContent><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{r.status}</span><span className="text-sm">{r.agreed_price??r.quoted_price ? "R$ "+Number(r.agreed_price??r.quoted_price).toFixed(2) : "Aguardando valor"}</span>{["PENDING","QUOTED"].includes(r.status)&&<Button variant="outline" size="sm" onClick={()=>cancel(r.id)}>Cancelar</Button>}</div></CardContent></Card>):<Card><CardContent className="p-10 text-center">Nenhuma viagem encontrada.</CardContent></Card>}</div></main></RoleGate>;
}