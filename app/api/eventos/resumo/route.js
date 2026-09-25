import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function trintaDiasAtras() {
  const data = new Date();
  data.setDate(data.getDate() - 30);
  return data.toISOString();
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const desde = trintaDiasAtras();
    const desdeData = desde.slice(0, 10);

    const [eventosRes, clientesRes, atendimentosRes] = await Promise.all([
      supabase.from("eventos").select("tipo, utm_source, utm_campaign").gte("created_at", desde),
      supabase.from("clientes").select("id", { count: "exact", head: true }).gte("created_at", desde),
      supabase.from("atendimentos").select("servico").gte("data", desdeData),
    ]);

    if (eventosRes.error) return NextResponse.json({ erro: eventosRes.error.message }, { status: 500 });
    if (clientesRes.error) return NextResponse.json({ erro: clientesRes.error.message }, { status: 500 });
    if (atendimentosRes.error) return NextResponse.json({ erro: atendimentosRes.error.message }, { status: 500 });

    const eventos = eventosRes.data;
    const acessos = eventos.filter((e) => e.tipo === "view");
    const cliques = eventos.filter((e) => e.tipo === "click_whatsapp");

    const porCampanha = new Map();
    function chaveCampanha(e) {
      return e.utm_source || e.utm_campaign ? `${e.utm_source || "?"} / ${e.utm_campaign || "?"}` : "Sem campanha (direto)";
    }
    for (const e of acessos) {
      const chave = chaveCampanha(e);
      const atual = porCampanha.get(chave) || { campanha: chave, acessos: 0, cliques: 0 };
      atual.acessos += 1;
      porCampanha.set(chave, atual);
    }
    for (const e of cliques) {
      const chave = chaveCampanha(e);
      const atual = porCampanha.get(chave) || { campanha: chave, acessos: 0, cliques: 0 };
      atual.cliques += 1;
      porCampanha.set(chave, atual);
    }

    const atendimentos = atendimentosRes.data;
    const planosVendidos = atendimentos.filter((a) => a.servico.startsWith("Plano")).length;

    return NextResponse.json({
      dias: 30,
      aquisicao: {
        acessos: acessos.length,
        cliques: cliques.length,
        porCampanha: Array.from(porCampanha.values()).sort((a, b) => b.acessos - a.acessos),
      },
      conversao: {
        novosClientes: clientesRes.count || 0,
        atendimentos: atendimentos.length,
      },
      monetizacao: {
        planosVendidos,
      },
    });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
