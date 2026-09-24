"use client";

import { useEffect, useState } from "react";
import { segundaFeiraAtual } from "@/lib/conteudo";

function formatarSemana(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `Semana de ${dia}/${mes}/${ano}`;
}

export default function ConteudoPage() {
  const semana = segundaFeiraAtual();
  const [itens, setItens] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`/api/conteudo?semana=${semana}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.erro) throw new Error(d.erro);
        setItens(d.itens);
      })
      .catch((e) => setErro(e.message));
  }, [semana]);

  async function alternar(chave, valorAtual) {
    setItens((prev) =>
      prev.map((i) => (i.chave === chave ? { ...i, feito: !valorAtual } : i))
    );
    await fetch("/api/conteudo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semana, item: chave, feito: !valorAtual }),
    });
  }

  const feitos = itens ? itens.filter((i) => i.feito).length : 0;

  return (
    <div>
      <h1 className="display" style={{ fontSize: "1.4rem", margin: "0 0 4px" }}>
        Calendário de conteúdo
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 20px" }}>
        {formatarSemana(semana)} {itens ? `· ${feitos}/${itens.length} feitos` : ""}
      </p>

      {erro && <p style={{ color: "var(--danger)" }}>{erro}</p>}
      {!itens && !erro && <p style={{ color: "var(--text-muted)" }}>Carregando…</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {itens?.map((item) => (
          <button
            key={item.chave}
            onClick={() => alternar(item.chave, item.feito)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              textAlign: "left",
              padding: "16px",
              borderRadius: 12,
              border: `1px solid ${item.feito ? "var(--accent)" : "var(--line)"}`,
              background: item.feito ? "#3a2c12" : "var(--card)",
              color: "var(--text)",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                flex: "none",
                borderRadius: 6,
                border: `2px solid ${item.feito ? "var(--accent)" : "var(--text-muted)"}`,
                background: item.feito ? "var(--accent)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1a1208",
                fontWeight: 700,
              }}
            >
              {item.feito ? "✓" : ""}
            </span>
            <span style={{ textDecoration: item.feito ? "line-through" : "none", color: item.feito ? "var(--text-muted)" : "var(--text)" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
