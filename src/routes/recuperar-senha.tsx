import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { errMsg } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — INTEGRETY DRIVER" },
      { name: "description", content: "Receba um link para criar uma nova senha." },
      { property: "og:title", content: "Recuperar senha — INTEGRETY DRIVER" },
      { property: "og:description", content: "Receba um link para criar uma nova senha." },
    ],
  }),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) return toast.error(errMsg(error));
    setSent(true);
  }
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader><CardTitle className="font-display text-2xl">Recuperar senha</CardTitle></CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">Se existir uma conta com <strong>{email}</strong>, você receberá um link para criar uma nova senha.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2"><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <Button type="submit" className="w-full">Enviar link</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
