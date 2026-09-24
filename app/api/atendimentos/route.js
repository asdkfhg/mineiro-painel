import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { normalizarWhatsapp } from "@/lib/clientes";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const nome = (body.nome || "").trim();
  const whatsapp = normalizarWhatsapp(body.whatsapp);
  const data = body.data;
  const servico = (body.servico || "").trim();
  const origem = (body.origem || "").trim() || null;

  if (!nome || !whatsapp || !data || !servico) {
    return NextResponse.json(
      { erro: "Preencha nome, WhatsApp, data e serviço." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    const { data: existente, error: erroBusca } = await supabase
      .from("clientes")
      .select("*")
      .eq("whatsapp", whatsapp)
      .maybeSingle();
    if (erroBusca) {
      return NextResponse.json({ erro: erroBusca.message }, { status: 500 });
    }

    let cliente = existente;
    if (!cliente) {
      const { data: novo, error: erroCriar } = await supabase
        .from("clientes")
        .insert({ nome, whatsapp, origem })
        .select()
        .single();
      if (erroCriar) {
        return NextResponse.json({ erro: erroCriar.message }, { status: 500 });
      }
      cliente = novo;
    } else if (origem && !cliente.origem) {
      await supabase.from("clientes").update({ origem }).eq("id", cliente.id);
    }

    const { error: erroAtendimento } = await supabase
      .from("atendimentos")
      .insert({ cliente_id: cliente.id, data, servico });
    if (erroAtendimento) {
      return NextResponse.json({ erro: erroAtendimento.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, cliente, novoCliente: !existente });
  } catch (e) {
    return NextResponse.json(
      { erro: `Não foi possível falar com o banco de dados: ${e.message}` },
      { status: 500 }
    );
  }
}
