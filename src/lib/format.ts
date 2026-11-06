import type { Database } from "@/integrations/supabase/types";

type E = Database["public"]["Enums"];

export const RIDE_STATUS: Record<E["ride_status"], string> = {
  PENDING: "Aguardando motorista",
  QUOTED: "Orçamento enviado",
  ACCEPTED: "Aceita pelo motorista",
  CONFIRMED: "Confirmada",
  DRIVER_ARRIVING: "Motorista a caminho",
  ARRIVED: "Motorista chegou",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  DECLINED: "Recusada",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
};

export const ACTIVE_RIDE: E["ride_status"][] = ["PENDING", "QUOTED", "ACCEPTED", "CONFIRMED", "DRIVER_ARRIVING", "ARRIVED", "IN_PROGRESS"];

export const NEXT_STEP: Partial<Record<E["ride_status"], { to: E["ride_status"]; label: string }>> = {
  CONFIRMED: { to: "DRIVER_ARRIVING", label: "Estou a caminho" },
  DRIVER_ARRIVING: { to: "ARRIVED", label: "Cheguei ao embarque" },
  ARRIVED: { to: "IN_PROGRESS", label: "Iniciar viagem" },
  IN_PROGRESS: { to: "COMPLETED", label: "Concluir viagem" },
};

export const CATEGORY: Record<E["vehicle_category"], string> = {
  economico: "Econômico",
  conforto: "Conforto",
  executivo: "Executivo",
  suv: "SUV",
  van: "Van",
  acessivel: "Acessível",
};

export const AVAILABILITY: Record<E["availability_status"], string> = {
  online: "Disponível agora",
  offline: "Offline",
  busy: "Em viagem",
  unavailable: "Indisponível",
};

export const DRIVER_STATUS: Record<E["driver_status"], string> = {
  pending: "Em análise",
  approved: "Aprovado",
  rejected: "Reprovado",
  suspended: "Suspenso",
};

export const REVIEW_STATUS: Record<E["review_status"], string> = {
  pending: "Em análise",
  approved: "Aprovado",
  rejected: "Reprovado",
};

export const DOC_TYPE: Record<E["document_type"], string> = {
  cnh: "CNH",
  crlv: "CRLV do veículo",
  antecedentes: "Antecedentes criminais",
  comprovante_residencia: "Comprovante de residência",
  foto_perfil: "Foto de perfil",
  outro: "Outro",
};

export const SERVICES: Record<string, string> = {
  urbano: "Corridas urbanas",
  aeroporto: "Aeroporto",
  rodoviaria: "Rodoviária",
  intermunicipal: "Viagens intermunicipais",
  eventos: "Eventos",
  executivo: "Executivo",
  pet: "Aceita pets",
  acessibilidade: "Acessibilidade",
};

export function brl(v: number | null | undefined) {
  if (v == null) return "—";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function dt(v: string | null | undefined) {
  if (!v) return "—";
  return new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function initials(name: string | null | undefined) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function errMsg(e: unknown) {
  if (e && typeof e === "object" && "message" in e) {
    const m = String((e as { message: string }).message);
    if (m.includes("DRIVER_UNAVAILABLE")) return "Este motorista não está disponível agora. Você pode agendar a viagem para outro horário.";
    if (m.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (m.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
    if (m.includes("User already registered")) return "Já existe uma conta com este e-mail.";
    return m;
  }
  return "Algo deu errado. Tente novamente.";
}

export function pricingText(d: { pricing_mode: E["pricing_mode"]; base_fare: number | null; price_per_km: number | null }) {
  if (d.pricing_mode === "quote") return "Sob orçamento";
  const parts = [];
  if (d.base_fare != null) parts.push(`${brl(d.base_fare)} base`);
  if (d.price_per_km != null) parts.push(`${brl(d.price_per_km)}/km`);
  return parts.join(" + ") || "Preço fixo";
}
