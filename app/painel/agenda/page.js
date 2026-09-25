"use client";

import { useEffect, useState } from "react";
import { OFERTAS_PRESET, interpolarMensagem } from "@/lib/campanhas";
import { linkWhatsappMensagem } from "@/lib/clientes";

function hojeISO() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

function amanhaISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

const cardEstilo = {
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 16,
  textAlign: "left",
  color: "var(--text)",
  cursor: "pointer",
  font: "inherit",
  width: "100%",
};

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

export default function PreencherAgendaPage() {
  const [passo, setPasso] = useState("oferta"); // oferta | personalizada | data | candidatos
  const [oferta, setOferta] = useState(null); // { titulo, mensagem }
  const [personalizadaTitulo, setPersonalizadaTitulo] = useState("");
  const [personalizadaPreco, setPersonalizadaPreco] = useState("");
  const [personalizadaMensagem, setPersonalizadaMensagem] = useState("");
  const [dataAlvo, setDataAlvo] = useState(null);
  const [dataCustomAberta, setDataCustomAberta] = useState(false);

  const [execucaoId, setExecucaoId] = useState(null);
  const [candidatos, setCandidatos] = useState(null);
  const [erro, setErro] = useState("");
  const [enviados, setEnviados] = useState(new Set());

  const [historico, setHistorico] = useState(null);

  useEffect(() => {
    if (passo === "oferta") {
      fetch("/api/campanhas/execucoes")
        .then((r) => r.json())
        .then((d) => setHistorico(d.historico || []))
        .catch(() => {});
    }
  }, [passo]);

  function escolherOferta(o) {
    setOferta(o);
    setPasso("data");
  }

  function confirmarPersonalizada(e) {
    e.preventDefault();
    if (!personalizadaTitulo.trim() || !personalizadaMensagem.trim()) return;
    setOferta({
      titulo: `✏️ ${personalizadaTitulo.trim()}${personalizadaPreco.trim() ? ` — ${personalizadaPreco.trim()}` : ""}`,
      mensagem: personalizadaMensagem.trim(),
    });
    setPasso("data");
  }

  async function escolherData(iso) {
    setDataAlvo(iso);
    setErro("");
    setCandidatos(null);
    setPasso("candidatos");

    try {
      const res = await fetch("/api/campanhas/candidatos");
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao buscar candidatos.");
      setCandidatos(data.candidatos);

      const execRes = await fetch("/api/campanhas/execucoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campanha_nome: oferta.titulo,
          campanha_mensagem: oferta.mensagem,
          data_alvo: iso,
          qtd_selecionados: data.candidatos.length,
        }),
      });
      const execData = await execRes.json();
      if (execRes.ok) setExecucaoId(execData.execucao.id);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function marcarEnviado(cliente) {
    setEnviados((prev) => new Set(prev).add(cliente.id));
    if (!execucaoId) return;
    await fetch("/api/campanhas/envios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ execucao_id: execucaoId, cliente_id: cliente.id }),
    });
  }

  function recomecar() {
    setPasso("oferta");
    setOferta(null);
    setPersonalizadaTitulo("");
    setPersonalizadaPreco("");
    setPersonalizadaMensagem("");
    setDataAlvo(null);
    setDataCustomAberta(false);
    setExecucaoId(null);
    setCandidatos(null);
    setEnviados(new Set());
  }

  return (
    <div>
      <h1 className="display" style={{ fontSize: "1.4rem", margin: "0 0 4px" }}>
        ⚡ Preencher agenda
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 20px" }}>
        Pra dias fracos: escolha uma oferta pontual e mande pra quem já está afastado.
      </p>

      {passo !== "oferta" && (
        <button
          onClick={recomecar}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            padding: 0,
            marginBottom: 18,
            cursor: "pointer",
          }}
        >
          ← Recomeçar
        </button>
      )}

      {passo === "oferta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Escolha uma oferta</div>
          {OFERTAS_PRESET.map((o) => (
            <button key={o.id} style={cardEstilo} onClick={() => escolherOferta(o)}>
              <div style={{ fontWeight: 700 }}>{o.titulo}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
                De {o.precoNormal}
              </div>
            </button>
          ))}
          <button style={cardEstilo} onClick={() => setPasso("personalizada")}>
            <div style={{ fontWeight: 700 }}>✏️ Personalizada</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
              Criar uma oferta própria
            </div>
          </button>

          {historico && historico.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 10 }}>
                Últimas campanhas
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {historico.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      padding: "10px 12px",
                      background: "var(--card)",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                    }}
                  >
                    <span>
                      {h.campanha_nome} · {formatarData(h.data_alvo)}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {h.qtd_enviados}/{h.qtd_selecionados} enviados
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {passo === "personalizada" && (
        <form onSubmit={confirmarPersonalizada} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={labelEstilo}>
            Título da oferta
            <input
              style={campoEstilo}
              value={personalizadaTitulo}
              onChange={(e) => setPersonalizadaTitulo(e.target.value)}
              placeholder="Ex: Corte + Luzes"
              required
            />
          </label>
          <label style={labelEstilo}>
            Preço/oferta (opcional)
            <input
              style={campoEstilo}
              value={personalizadaPreco}
              onChange={(e) => setPersonalizadaPreco(e.target.value)}
              placeholder="Ex: R$ 89"
            />
          </label>
          <label style={labelEstilo}>
            Mensagem (use {"{nome}"} pro primeiro nome do cliente)
            <textarea
              style={{ ...campoEstilo, minHeight: 100, resize: "vertical" }}
              value={personalizadaMensagem}
              onChange={(e) => setPersonalizadaMensagem(e.target.value)}
              placeholder="Fala, {nome}! ..."
              required
            />
          </label>
          <button type="submit" className="cta" style={{ justifyContent: "center", border: "none", cursor: "pointer" }}>
            Continuar
          </button>
        </form>
      )}

      {passo === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Para quando?</div>
          <button style={cardEstilo} onClick={() => escolherData(hojeISO())}>
            Hoje
          </button>
          <button style={cardEstilo} onClick={() => escolherData(amanhaISO())}>
            Amanhã
          </button>
          {!dataCustomAberta ? (
            <button style={cardEstilo} onClick={() => setDataCustomAberta(true)}>
              Escolher data
            </button>
          ) : (
            <input
              type="date"
              autoFocus
              style={campoEstilo}
              min={hojeISO()}
              onChange={(e) => e.target.value && escolherData(e.target.value)}
            />
          )}
        </div>
      )}

      {passo === "candidatos" && (
        <div>
          {erro && <p style={{ color: "var(--danger)" }}>{erro}</p>}
          {!candidatos && !erro && <p style={{ color: "var(--text-muted)" }}>Buscando clientes…</p>}

          {candidatos && (
            <>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
                <strong style={{ color: "var(--text)" }}>
                  {candidatos.length} {candidatos.length === 1 ? "cliente sugerido" : "clientes sugeridos"}
                </strong>{" "}
                para{" "}
                {oferta.titulo} em {formatarData(dataAlvo)}
              </p>

              {candidatos.length === 0 && (
                <p style={{ color: "var(--text-muted)" }}>
                  Ninguém elegível agora (só entram clientes atrasados que não receberam
                  promoção recente).
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {candidatos.map((cliente) => {
                  const jaEnviado = enviados.has(cliente.id);
                  return (
                    <div
                      key={cliente.id}
                      style={{
                        background: "var(--card)",
                        border: `1px solid ${jaEnviado ? "var(--accent-2)" : "var(--line)"}`,
                        borderRadius: 12,
                        padding: 16,
                        opacity: jaEnviado ? 0.6 : 1,
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{cliente.nome}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 2 }}>
                        {cliente.diasSemVisita} dias desde o último atendimento · {cliente.ultimoServico}
                      </div>

                      {!jaEnviado ? (
                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                          <a
                            href={linkWhatsappMensagem(cliente, interpolarMensagem(oferta.mensagem, cliente.nome))}
                            target="_blank"
                            rel="noopener"
                            onClick={() => marcarEnviado(cliente)}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              padding: "12px 16px",
                              borderRadius: 8,
                              background: "var(--accent)",
                              color: "#1a1208",
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            Enviar WhatsApp
                          </a>
                        </div>
                      ) : (
                        <div style={{ marginTop: 12, color: "var(--accent-2)", fontWeight: 700, fontSize: "0.9rem" }}>
                          ✓ Enviado
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
