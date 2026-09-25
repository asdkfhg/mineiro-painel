import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { diasDesde, getStatus } from "@/lib/clientes";
import { JANELA_SEM_PROMO_DIAS, STATUS_ELEGIVEL_PROMO } from "@/lib/campanhas";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: clientes, error: erroClientes } = await supabase.from("clientes").select("*");
    if (erroClientes) return NextResponse.json({ erro: erroClientes.message }, { status: 500 });

    const { data: atendimentos, error: erroAtendimentos } = await supabase
      .from("atendimentos")
      .select("cliente_id, data, servico")
      .order("data", { ascending: false });
    if (erroAtendimentos) return NextResponse.json({ erro: erroAtendimentos.message }, { status: 500 });

    const desde = new Date();
    desde.setDate(desde.getDate() - JANELA_SEM_PROMO_DIAS);
    const { data: enviosRecentes, error: erroEnvios } = await supabase
      .from("campanhas_envios")
      .select("cliente_id")
      .gte("created_at", desde.toISOString());
    if (erroEnvios) return NextResponse.json({ erro: erroEnvios.message }, { status: 500 });

    const jaContatadoRecentemente = new Set(enviosRecentes.map((e) => e.cliente_id));

    const visitasPorCliente = new Map();
    for (const a of atendimentos) {
      const lista = visitasPorCliente.get(a.cliente_id) || [];
      lista.push(a);
      visitasPorCliente.set(a.cliente_id, lista);
    }

    const candidatos = clientes
      .map((cliente) => {
        const visitas = visitasPorCliente.get(cliente.id) || [];
        const ultima = visitas[0] || null;
        if (!ultima) return null;
        const dias = diasDesde(ultima.data);
        const status = getStatus(dias);
        return {
          ...cliente,
          diasSemVisita: dias,
          ultimaVisita: ultima.data,
          ultimoServico: ultima.servico,
          status,
        };
      })
      .filter(
        (c) =>
          c &&
          c.status.key === STATUS_ELEGIVEL_PROMO &&
          !jaContatadoRecentemente.has(c.id)
      )
      .sort((a, b) => b.diasSemVisita - a.diasSemVisita);

    return NextResponse.json({ candidatos });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
