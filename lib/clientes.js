// Janela de retorno: a barbearia trabalha com um ciclo de ~25-30 dias entre
// cortes. Esses limites definem os 4 estágios mostrados no painel.
const LIMIAR_PROXIMO = 20; // a partir daqui já vale preparar o lembrete
const LIMIAR_NO_PRAZO = 25; // janela ideal de retorno
const LIMIAR_ATRASADO = 31; // passou do ciclo esperado

export function diasDesde(dataISO) {
  const data = new Date(dataISO + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
}

export function getStatus(dias) {
  if (dias >= LIMIAR_ATRASADO) {
    return { key: "atrasado", label: "Atrasado", ordem: 3 };
  }
  if (dias >= LIMIAR_NO_PRAZO) {
    return { key: "no_prazo", label: "Momento ideal de voltar", ordem: 2 };
  }
  if (dias >= LIMIAR_PROXIMO) {
    return { key: "proximo", label: "Chegando perto", ordem: 1 };
  }
  return { key: "em_dia", label: "Em dia", ordem: 0 };
}

// Aceita números com ou sem DDI/pontuação e devolve só dígitos com "55" na
// frente, formato exigido pelo link wa.me.
export function normalizarWhatsapp(valor) {
  const digitos = String(valor || "").replace(/\D/g, "");
  if (!digitos) return "";
  if (digitos.startsWith("55") && digitos.length >= 12) return digitos;
  return `55${digitos}`;
}

export function linkLembrete(cliente) {
  const numero = normalizarWhatsapp(cliente.whatsapp);
  const primeiroNome = (cliente.nome || "").trim().split(/\s+/)[0] || "";
  const mensagem =
    `Oi${primeiroNome ? " " + primeiroNome : ""}! Aqui é do Mineiro, o Barbeiro 💈 ` +
    `Já faz um tempinho desde o seu último corte — bora agendar um novo horário?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkWhatsappMensagem(cliente, mensagem) {
  const numero = normalizarWhatsapp(cliente.whatsapp);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
