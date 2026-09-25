"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { linkLembrete } from "@/lib/clientes";

const CORES_STATUS = {
  no_prazo: { bg: "#3a1f1f", texto: "#e2685a", borda: "#5a2e2e", emoji: "🔴" },
  proximo: { bg: "#3a2c12", texto: "var(--accent)", borda: "#5a4319", emoji: "🟠" },
  atrasado: { bg: "#1c1c1c", texto: "#8a8a8a", borda: "#333333", emoji: "⚫" },
  em_dia: { bg: "var(--card)", texto: "var(--text-muted)", borda: "var(--line)" },
  sem_visita: { bg: "var(--card)", texto: "var(--text-muted)", borda: "var(--line)" },
};

const GRUPOS_ATENCAO = [
  { chave: "no_prazo", titulo: "Momento ideal de voltar" },
  { chave: "proximo", titulo: "Chegando perto" },
  { chave: "atrasado", titulo: "Atrasado" },
];

function formatarData(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function CardCliente({ cliente }) {
  const cor = CORES_STATUS[cliente.status.key];
  return (
    <div
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

  const termo = busca.trim().toLowerCase();

  const filtrados = useMemo(() => {
    if (!clientes || !termo) return [];
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [clientes, termo]);

  const grupos = useMemo(() => {
    if (!clientes) return null;
    const porChave = { no_prazo: [], proximo: [], atrasado: [] };
    let outros = 0;
    for (const c of clientes) {
      if (porChave[c.status.key]) porChave[c.status.key].push(c);
      else outros += 1;
    }
    return { porChave, outros };
  }, [clientes]);

  const semAtencaoHoje =
    grupos && grupos.porChave.no_prazo.length === 0 && grupos.porChave.proximo.length === 0 && grupos.porChave.atrasado.length === 0;

  return (
    <div>
      <Link
        href="/painel/novo"
        className="cta"
        style={{ display: "block", textAlign: "center", marginBottom: 12, textDecoration: "none" }}
      >
        + Novo atendimento
      </Link>

      <Link
        href="/painel/agenda"
        style={{
          display: "block",
          textAlign: "center",
          marginBottom: 18,
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        ⚡ Preencher agenda
      </Link>

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

      {termo ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtrados.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>Nenhum cliente encontrado com esse nome.</p>
          )}
          {filtrados.map((cliente) => (
            <CardCliente key={cliente.id} cliente={cliente} />
          ))}
        </div>
      ) : (
        clientes !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {clientes.length === 0 && (
              <p style={{ color: "var(--text-muted)" }}>
                Nenhum cliente cadastrado ainda. Toque em “+ Novo atendimento” para registrar o primeiro.
              </p>
            )}

            {clientes.length > 0 && (
              <div>
                <h2 className="display" style={{ fontSize: "1.1rem", margin: "0 0 12px" }}>
                  Atenção hoje
                </h2>
                {semAtencaoHoje ? (
                  <p style={{ color: "var(--text-muted)" }}>Ninguém precisa de lembrete agora. 🎉</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {GRUPOS_ATENCAO.map(({ chave, titulo }) => {
                      const lista = grupos.porChave[chave];
                      if (lista.length === 0) return null;
                      return (
                        <div key={chave}>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 8 }}>
                            {CORES_STATUS[chave].emoji} {titulo} ({lista.length})
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {lista.map((cliente) => (
                              <CardCliente key={cliente.id} cliente={cliente} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {grupos && grupos.outros > 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {grupos.outros} cliente{grupos.outros > 1 ? "s" : ""} em dia — busque pelo nome se precisar.
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}
