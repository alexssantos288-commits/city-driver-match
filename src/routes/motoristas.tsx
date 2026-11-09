import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/motoristas")({
  validateSearch: (s: Record<string, unknown>) => ({ cidade: typeof s.cidade === "string" ? s.cidade : undefined }),
  component: Marketplace,
});

function Marketplace() {
  const { cidade } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(cidade ?? "");
  const { data: cities = [] } = useQuery({
    queryKey: ["cities-market"],
    queryFn: async () => (await supabase.from("cities").select("id,name,state").eq("active", true).order("name")).data ?? [],
  });
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["marketplace-drivers", city, query],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("marketplace_drivers", {
        p_city: city || undefined, p_query: query || undefined, p_available_only: true,
      });
      if (error) throw error;
      return data ?? [];
    },
  });
  return <main className="mx-auto max-w-6xl px-4 py-10">
    <h1 className="font-display text-3xl font-bold">Escolha seu motorista</h1>
    <p className="mt-2 text-muted-foreground">Veja motoristas aprovados e solicite diretamente quem você escolher.</p>
    <Card className="my-6"><CardContent className="grid gap-3 p-4 sm:grid-cols-2">
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" placeholder="Nome ou servico" value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <Select value={city} onValueChange={setCity}><SelectTrigger><SelectValue placeholder="Todas as cidades"/></SelectTrigger><SelectContent><SelectItem value="">Todas</SelectItem>{cities.map(c=><SelectItem key={c.id} value={c.id}>{c.name} — {c.state}</SelectItem>)}</SelectContent></Select>
    </CardContent></Card>
    {isLoading ? <p className="py-12 text-center text-muted-foreground">Buscando...</p> :
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{drivers.map((d:any)=><Card key={d.driver_id}><CardContent className="p-5">
        <div className="flex gap-4"><div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-muted">{d.avatar_url?<img src={d.avatar_url} className="h-full w-full object-cover" alt=""/>:<span className="text-xl font-bold">{d.full_name?.slice(0,1)}</span>}</div><div><h2 className="font-display font-semibold">{d.full_name}</h2><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5"/>{d.city_name} — {d.city_state}</p><p className="mt-1 flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-current"/>{Number(d.rating_avg||0).toFixed(1)} ({d.rating_count})</p></div></div>
        <p className="mt-4 text-sm text-muted-foreground">{d.vehicle_make} {d.vehicle_model} · {d.vehicle_category}</p>
        <p className="mt-3 line-clamp-2 text-sm">{d.bio || "Motorista aprovado pela INTEGRETY DRIVER."}</p>
        <Button asChild className="mt-5 w-full"><Link to="/motorista/$id" params={{id:d.driver_id}}>Ver perfil e solicitar</Link></Button>
      </CardContent></Card>)}</div>}
  </main>;
}