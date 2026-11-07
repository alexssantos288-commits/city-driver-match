import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Car, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { user, profile, hasRole } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread", user?.id],
    enabled: !!user,
    refetchInterval: 20000,
    queryFn: async () => {
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
      return count ?? 0;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/entrar", search: { redirect: undefined }, replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-sm font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Car className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">INTEGRETY DRIVER</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link to={"/motoristas" as never}>Motoristas</Link>
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon" aria-label="Notificações" className="relative">
                <Link to={"/notificacoes" as never}>
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {unread}
                    </span>
                  )}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Menu da conta">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{profile?.full_name || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hasRole("passenger") && (
                    <>
                      <DropdownMenuItem asChild><Link to={"/passageiro" as never}>Minha conta</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={"/passageiro/viagens" as never}>Minhas viagens</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={"/passageiro/favoritos" as never}>Favoritos</Link></DropdownMenuItem>
                    </>
                  )}
                  {hasRole("driver") && (
                    <>
                      <DropdownMenuItem asChild><Link to={"/painel-motorista" as never}>Painel do motorista</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={"/painel-motorista/solicitacoes" as never}>Solicitações</Link></DropdownMenuItem>
                    </>
                  )}
                  {hasRole("admin") && (
                    <DropdownMenuItem asChild><Link to={"/admin" as never}>Administração</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={signOut}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/entrar" search={{ redirect: undefined }}>Entrar</Link></Button>
              <Button asChild size="sm"><Link to="/cadastro" search={{ tipo: undefined }}>Criar conta</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function RoleGate({ role, children }: { role: "admin" | "driver" | "passenger"; children: ReactNode }) {
  const { loading, hasRole } = useAuth();
  if (loading) return <div className="p-10 text-center text-sm text-muted-foreground">Carregando…</div>;
  if (!hasRole(role))
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h2 className="font-display text-xl font-semibold">Acesso restrito</h2>
        <p className="mt-2 text-sm text-muted-foreground">Esta área não está disponível para o seu tipo de conta.</p>
        <Button asChild className="mt-4"><Link to="/">Voltar ao início</Link></Button>
      </div>
    );
  return <>{children}</>;
}

export function TabNav({ items }: { items: { to: string; label: string; exact?: boolean }[] }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b">
      {items.map((i) => (
        <Link
          key={i.to}
          to={i.to as never}
          activeOptions={{ exact: !!i.exact }}
          className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          activeProps={{ className: "!border-accent !text-foreground font-semibold" }}
        >
          {i.label}
        </Link>
      ))}
    </div>
  );
}
