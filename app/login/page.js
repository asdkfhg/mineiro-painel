"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Não deu pra entrar.");
        return;
      }
      router.replace("/painel");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tenta de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="wrap" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="kicker">Mineiro, o Barbeiro</div>
      <h1 className="display" style={{ fontSize: "2rem", margin: "0 0 24px" }}>
        Painel
      </h1>
      <form onSubmit={entrar} className="offer-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 14 }}>
        <label style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Senha
          <input
            type="password"
            inputMode="text"
            autoFocus
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 8,
              padding: "14px 16px",
              fontSize: "1.05rem",
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          />
        </label>
        {erro && <p style={{ color: "var(--danger)", margin: 0 }}>{erro}</p>}
        <button
          type="submit"
          disabled={carregando || !senha}
          className="cta"
          style={{ justifyContent: "center", border: "none", cursor: "pointer", opacity: carregando ? 0.7 : 1 }}
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
