import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/passageiro")({
  component: () => <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="font-display text-2xl font-bold">Minha conta</h1></main>,
});