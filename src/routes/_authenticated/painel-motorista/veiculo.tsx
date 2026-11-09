import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { RoleGate, PageTitle } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route=createFileRoute("/_authenticated/painel-motorista/veiculo")({component:Page});
function Page(){
 const {user}=useAuth(); const [busy,setBusy]=useState(false);
 const {data:vehicle}=useQuery({queryKey:["driver-vehicle-edit",user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from("vehicles").select("*").eq("driver_id",user!.id).eq("is_active",true).maybeSingle();if(error)throw error;return data;}});
 const [f,setF]=useState<any>({});
 async function save(){setBusy(true);const x={driver_id:user!.id,make:f.make??vehicle?.make??"",model:f.model??vehicle?.model??"",year:Number(f.year??vehicle?.year)||null,color:f.color??vehicle?.color??"",plate:f.plate??vehicle?.plate??"",category:f.category??vehicle?.category??"car",seats:Number(f.seats??vehicle?.seats)||4,is_active:true};const {error}=vehicle?await supabase.from("vehicles").update(x).eq("id",vehicle.id):await supabase.from("vehicles").insert(x);setBusy(false);if(error)alert(error.message);else alert("Veículo salvo.");}
 return <RoleGate role="driver"><main className="mx-auto max-w-3xl px-4 py-10"><PageTitle title="Meu veículo" subtitle="Cadastre o veículo que será exibido no seu perfil."/><Card><CardHeader><CardTitle>Dados do veículo</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">{[["make","Marca"],["model","Modelo"],["year","Ano"],["color","Cor"],["plate","Placa"],["category","Categoria"],["seats","Lugares"]].map(([k,l])=><div key={k}><Label>{l}</Label><Input value={f[k]??vehicle?.[k]??""} onChange={e=>setF({...f,[k]:e.target.value})}/></div>)}<div className="sm:col-span-2"><Button onClick={save} disabled={busy}>{busy?"Salvando...":"Salvar veículo"}</Button></div></CardContent></Card></main></RoleGate>;
}