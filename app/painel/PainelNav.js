"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ABAS = [
  { href: "/painel", label: "Clientes" },
  { href: "/painel/novo", label: "Novo" },
  { href: "/painel/conteudo", label: "Conteúdo" },
  { href: "/painel/metricas", label: "Métricas" },
];

export function PainelHeader() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 20px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span className="display" style={{ fontSize: "1.25rem" }}>
        Mineiro <span style={{ color: "var(--accent)" }}>Painel</span>
      </span>
      <button
        onClick={sair}
        style={{
          background: "none",
          border: "1px solid var(--line)",
          color: "var(--text-muted)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </header>
  );
}

export function PainelNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        borderTop: "1px solid var(--line)",
        background: "var(--bg-alt)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 10,
      }}
    >
      {ABAS.map((aba) => {
        const ativo = pathname === aba.href;
        return (
          <Link
            key={aba.href}
            href={aba.href}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "16px 8px",
              color: ativo ? "var(--accent)" : "var(--text-muted)",
              fontWeight: ativo ? 700 : 500,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            {aba.label}
          </Link>
        );
      })}
    </nav>
  );
}
