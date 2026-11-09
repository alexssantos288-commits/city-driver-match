import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export const Route=createFileRoute("/_authenticated/notificacoes")({component:Page});
function Page(){const {user}=useAuth();const {data:items=[]}=useQuery({queryKey:["notifications",user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await supabase.from("notifications").select("*").eq("user_id",user!.id).order("created_at",{ascending:false}).limit(50);if(error)throw error;return data??[];}});return <main className="mx-auto max-w-4xl px-4 py-10"><h1 className="font-display text-3xl font-bold">Notificacoes</h1><div className="mt-6 space-y-3">{items.length?items.map((n:any)=><Card key={n.id}><CardContent className="p-4"><b>{n.title}</b><p className="text-sm text-muted-foreground">{n.body}</p></CardContent></Card>):<Card><CardContent className="p-8 text-center">Nenhuma notificacao.</CardContent></Card>}</div></main>}