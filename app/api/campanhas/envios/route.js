import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { execucao_id, cliente_id } = body;

  if (!execucao_id || !cliente_id) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("campanhas_envios").insert({ execucao_id, cliente_id });
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
