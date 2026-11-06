import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, Star, Heart, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INTEGRETY DRIVER — Escolha seu motorista de confiança" },
      { name: "description", content: "Encontre motoristas particulares aprovados na sua cidade, veja avaliações e solicite diretamente quem você escolher." },
      { property: "og:title", content: "INTEGRETY DRIVER — Escolha seu motorista de confiança" },
      { property: "og:description", content: "Motoristas particulares aprovados, com avaliações reais e solicitação direta." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>("");
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await supabase.from("cities").select("id,name,state").eq("active", true).order("name")).data ?? [],
  });

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Motoristas particulares</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Você escolhe <span className="bg-accent px-2">quem</span> vai dirigir.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Sem sorteio de motorista. Veja perfis aprovados, veículos e avaliações reais, e envie sua solicitação direto para o motorista que você confia.
        </p>
        <div className="mt-8 flex max-w-lg flex-col gap-2 sm:flex-row">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Selecione sua cidade" /></SelectTrigger>
            <SelectContent>
              {cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.state}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="lg" className="h-11" onClick={() => navigate({ to: "/motoristas" as never, search: (city ? { cidade: city } : {}) as never })}>
            Ver motoristas
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          É motorista? <Link to="/cadastro" search={{ tipo: "motorista" }} className="font-semibold text-foreground underline">Cadastre-se para atender</Link>
        </p>
      </section>
      <section className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-4">
          {[
            { i: ShieldCheck, t: "Motoristas aprovados", d: "Documentos e veículo analisados pela equipe." },
            { i: MapPin, t: "Por cidade e bairro", d: "Filtre por região atendida e categoria." },
            { i: Star, t: "Avaliações reais", d: "Somente de quem viajou com o motorista." },
            { i: Heart, t: "Seus favoritos", d: "Guarde os motoristas que você confia." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t}>
              <Icon className="h-5 w-5" />
              <h3 className="mt-3 font-display font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
