import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { diasDesde, getStatus } from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: clientes, error: erroClientes } = await supabase
      .from("clientes")
      .select("*");
    if (erroClientes) {
      return NextResponse.json({ erro: erroClientes.message }, { status: 500 });
    }

    const { data: atendimentos, error: erroAtendimentos } = await supabase
      .from("atendimentos")
      .select("cliente_id, data, servico")
      .order("data", { ascending: false });
    if (erroAtendimentos) {
      return NextResponse.json({ erro: erroAtendimentos.message }, { status: 500 });
    }

    const visitasPorCliente = new Map();
    for (const atendimento of atendimentos) {
      const lista = visitasPorCliente.get(atendimento.cliente_id) || [];
      lista.push(atendimento);
      visitasPorCliente.set(atendimento.cliente_id, lista);
    }

    const resultado = clientes.map((cliente) => {
      const visitas = visitasPorCliente.get(cliente.id) || [];
      const ultima = visitas[0] || null;
      const dias = ultima ? diasDesde(ultima.data) : null;
      const status =
        dias === null
          ? { key: "sem_visita", label: "Sem atendimento registrado", ordem: -1 }
          : getStatus(dias);

      return {
        ...cliente,
        totalVisitas: visitas.length,
        ultimaVisita: ultima?.data ?? null,
        ultimoServico: ultima?.servico ?? null,
        diasSemVisita: dias,
        status,
      };
    });

    resultado.sort((a, b) => {
      if (b.status.ordem !== a.status.ordem) return b.status.ordem - a.status.ordem;
      return (b.diasSemVisita ?? -1) - (a.diasSemVisita ?? -1);
    });

    return NextResponse.json({ clientes: resultado });
  } catch (e) {
    return NextResponse.json(
      { erro: `Não foi possível falar com o banco de dados: ${e.message}` },
      { status: 500 }
    );
  }
}
