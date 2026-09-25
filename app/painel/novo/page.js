"use client";

import { useState } from "react";
import { SERVICOS_INDIVIDUAIS, PLANOS } from "@/lib/servicos";

function hojeISO() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

const campoEstilo = {
  display: "block",
  width: "100%",
  marginTop: 8,
  padding: "14px 16px",
  fontSize: "1rem",
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--bg)",
  color: "var(--text)",
};

const labelEstilo = { color: "var(--text-muted)", fontSize: "0.9rem", display: "block" };

export default function NovoAtendimentoPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [data, setData] = useState(hojeISO());
  const [servico, setServico] = useState(SERVICOS_INDIVIDUAIS[0]);
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function salvar(e) {
    e.preventDefault();
    setEnviando(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, whatsapp, data, servico }),
      });
      const resposta = await res.json();
      if (!res.ok) throw new Error(resposta.erro || "Erro ao salvar.");
      setMensagem({
        tipo: "ok",
        texto: resposta.novoCliente
          ? `${nome} cadastrado com sucesso!`
          : `Atendimento registrado para ${nome}.`,
      });
      setNome("");
      setWhatsapp("");
      setData(hojeISO());
      setServico(SERVICOS_INDIVIDUAIS[0]);
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1 className="display" style={{ fontSize: "1.4rem", margin: "0 0 18px" }}>
        Registrar atendimento
      </h1>

      <form onSubmit={salvar} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={labelEstilo}>
          Nome do cliente
          <input
            style={campoEstilo}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        <label style={labelEstilo}>
          WhatsApp
          <input
            style={campoEstilo}
            type="tel"
            inputMode="numeric"
            placeholder="(19) 99999-9999"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </label>

        <label style={labelEstilo}>
          Data do atendimento
          <input
            style={campoEstilo}
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </label>

        <label style={labelEstilo}>
          Serviço realizado
          <select style={campoEstilo} value={servico} onChange={(e) => setServico(e.target.value)}>
            <optgroup label="Serviços individuais">
              {SERVICOS_INDIVIDUAIS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
            <optgroup label="Planos">
              {PLANOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        {mensagem && (
          <p style={{ color: mensagem.tipo === "ok" ? "var(--accent-2)" : "var(--danger)", margin: 0 }}>
            {mensagem.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="cta"
          style={{ justifyContent: "center", border: "none", cursor: "pointer", opacity: enviando ? 0.7 : 1 }}
        >
          {enviando ? "Salvando…" : "Salvar atendimento"}
        </button>
      </form>
    </div>
  );
}
