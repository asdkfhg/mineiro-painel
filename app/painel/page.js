"use client";

import { useEffect, useMemo, useState } from "react";
import { linkLembrete } from "@/lib/clientes";

const CORES_STATUS = {
  atrasado: { bg: "#3a2018", texto: "#e08a6f", borda: "#5a2e21" },
  no_prazo: { bg: "#3a2c12", texto: "var(--accent)", borda: "#5a4319" },
  proximo: { bg: "#242f1f", texto: "var(--accent-2)", borda: "#38452f" },
  em_dia: { bg: "var(--card)", texto: "var(--text-muted)", borda: "var(--line)" },
  sem_visita: { bg: "var(--card)", texto: "var(--text-muted)", borda: "var(--line)" },
};

function formatarData(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function PainelPage() {
  const [clientes, setClientes] = useState(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  async function carregar() {
    setErro("");
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao carregar clientes.");
      setClientes(data.clientes);
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    if (!clientes) return [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [clientes, busca]);

  return (
    <div>
      <input
        placeholder="Buscar cliente por nome…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "1rem",
          borderRadius: 8,
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: "var(--text)",
          marginBottom: 18,
        }}
      />

      {erro && <p style={{ color: "var(--danger)" }}>{erro}</p>}
      {clientes === null && !erro && (
        <p style={{ color: "var(--text-muted)" }}>Carregando…</p>
      )}
      {clientes !== null && filtrados.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          {clientes.length === 0
            ? "Nenhum cliente cadastrado ainda. Toque em “Novo” para registrar o primeiro atendimento."
            : "Nenhum cliente encontrado com esse nome."}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtrados.map((cliente) => {
          const cor = CORES_STATUS[cliente.status.key];
          return (
            <div
              key={cliente.id}
              style={{
                background: "var(--card)",
                border: `1px solid ${cor.borda}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{cliente.nome}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 2 }}>
                {cliente.ultimaVisita
                  ? `Último corte: ${formatarData(cliente.ultimaVisita)} · ${cliente.ultimoServico}`
                  : "Sem atendimento registrado"}
              </div>
              <span
                style={{
                  display: "inline-block",
                  background: cor.bg,
                  color: cor.texto,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 999,
                  marginTop: 10,
                }}
              >
                {cliente.status.label}
                {cliente.diasSemVisita !== null ? ` · ${cliente.diasSemVisita}d` : ""}
              </span>

              <a
                href={linkLembrete(cliente)}
                target="_blank"
                rel="noopener"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 14,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "var(--accent)",
                  color: "#1a1208",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Enviar lembrete no WhatsApp
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
