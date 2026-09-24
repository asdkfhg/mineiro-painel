import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ITENS_SEMANA } from "@/lib/conteudo";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const semana = new URL(request.url).searchParams.get("semana");
  if (!semana) {
    return NextResponse.json({ erro: "Falta o parâmetro semana." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("conteudo_semana")
      .select("item, feito")
      .eq("semana", semana);
    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const feitos = new Map(data.map((linha) => [linha.item, linha.feito]));
    const itens = ITENS_SEMANA.map((item) => ({
      ...item,
      feito: feitos.get(item.chave) || false,
    }));

    return NextResponse.json({ semana, itens });
  } catch (e) {
    return NextResponse.json(
      { erro: `Não foi possível falar com o banco de dados: ${e.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { semana, item, feito } = await request.json().catch(() => ({}));
  if (!semana || !item || typeof feito !== "boolean") {
    return NextResponse.json({ erro: "Dados inválidos." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("conteudo_semana")
      .upsert({ semana, item, feito }, { onConflict: "semana,item" });
    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { erro: `Não foi possível falar com o banco de dados: ${e.message}` },
      { status: 500 }
    );
  }
}
