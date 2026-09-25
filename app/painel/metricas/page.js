"use client";

import { useEffect, useState } from "react";

const caixaEstilo = {
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 16,
};

const numeroEstilo = { fontFamily: "var(--font-anton)", fontSize: "2rem", color: "var(--accent)", lineHeight: 1 };
const labelEstilo = { color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 };

export default function MetricasPage() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/eventos/resumo")
      .then((r) => r.json())
      .then((d) => {
        if (d.erro) throw new Error(d.erro);
        setDados(d);
      })
      .catch((e) => setErro(e.message));
  }, []);

  const taxaClique =
    dados && dados.aquisicao.acessos > 0
      ? Math.round((dados.aquisicao.cliques / dados.aquisicao.acessos) * 100)
      : null;

  return (
    <div>
      <h1 className="display" style={{ fontSize: "1.4rem", margin: "0 0 4px" }}>
        Métricas
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 20px" }}>
        Últimos {dados?.dias ?? 30} dias
      </p>

      {erro && <p style={{ color: "var(--danger)" }}>{erro}</p>}
      {!dados && !erro && <p style={{ color: "var(--text-muted)" }}>Carregando…</p>}

      {dados && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h2 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Aquisição
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={caixaEstilo}>
                <div style={numeroEstilo}>{dados.aquisicao.acessos}</div>
                <div style={labelEstilo}>Acessos à landing</div>
              </div>
              <div style={caixaEstilo}>
                <div style={numeroEstilo}>{dados.aquisicao.cliques}</div>
                <div style={labelEstilo}>Cliques no WhatsApp</div>
              </div>
            </div>
            {taxaClique !== null && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 10 }}>
                {taxaClique}% de quem visitou clicou no WhatsApp
              </p>
            )}

            {dados.aquisicao.porCampanha.length > 0 && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {dados.aquisicao.porCampanha.map((c) => (
                  <div
                    key={c.campanha}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      padding: "8px 12px",
                      background: "var(--card)",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                    }}
                  >
                    <span style={{ color: "var(--text)" }}>{c.campanha}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {c.acessos} acessos · {c.cliques} cliques
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Conversão
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={caixaEstilo}>
                <div style={numeroEstilo}>{dados.conversao.novosClientes}</div>
                <div style={labelEstilo}>Clientes novos</div>
              </div>
              <div style={caixaEstilo}>
                <div style={numeroEstilo}>{dados.conversao.atendimentos}</div>
                <div style={labelEstilo}>Atendimentos</div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Monetização
            </h2>
            <div style={caixaEstilo}>
              <div style={numeroEstilo}>{dados.monetizacao.planosVendidos}</div>
              <div style={labelEstilo}>Planos vendidos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
