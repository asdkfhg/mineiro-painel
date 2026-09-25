import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { campanha_nome, campanha_mensagem, data_alvo, qtd_selecionados } = body;

  if (!campanha_nome || !campanha_mensagem || !data_alvo) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("campanhas_execucoes")
      .insert({
        campanha_nome,
        campanha_mensagem,
        data_alvo,
        qtd_selecionados: qtd_selecionados || 0,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

    return NextResponse.json({ execucao: data });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// Histórico mínimo: últimas execuções + quantos envios cada uma teve.
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: execucoes, error: erroExec } = await supabase
      .from("campanhas_execucoes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (erroExec) return NextResponse.json({ erro: erroExec.message }, { status: 500 });

    const { data: envios, error: erroEnvios } = await supabase
      .from("campanhas_envios")
      .select("execucao_id");
    if (erroEnvios) return NextResponse.json({ erro: erroEnvios.message }, { status: 500 });

    const enviadosPorExecucao = new Map();
    for (const e of envios) {
      enviadosPorExecucao.set(e.execucao_id, (enviadosPorExecucao.get(e.execucao_id) || 0) + 1);
    }

    const historico = execucoes.map((ex) => ({
      ...ex,
      qtd_enviados: enviadosPorExecucao.get(ex.id) || 0,
    }));

    return NextResponse.json({ historico });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
