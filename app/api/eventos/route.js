import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TIPOS_VALIDOS = new Set(["view", "click_whatsapp"]);

// Rota publica (sem login) — chamada pela propria landing para registrar
// visitas e cliques no CTA do WhatsApp, com a campanha (UTM) se presente.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const tipo = body.tipo;

  if (!TIPOS_VALIDOS.has(tipo)) {
    return NextResponse.json({ erro: "Tipo de evento inválido." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("eventos").insert({
      tipo,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
    });
    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
