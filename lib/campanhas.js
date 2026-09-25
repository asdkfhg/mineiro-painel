// Não deixar um cliente elegível pra "Preencher Agenda" se ele já recebeu
// alguma campanha promocional nos últimos N dias.
export const JANELA_SEM_PROMO_DIAS = 14;

// Só entram como candidatos clientes "atrasados" (ver lib/clientes.js) — quem
// está no ciclo normal de retorno (20-30 dias) recebe o lembrete comum, sem
// desconto, pra proteger o preço cheio da barbearia.
export const STATUS_ELEGIVEL_PROMO = "atrasado";

export const OFERTAS_PRESET = [
  {
    id: "cabelo-barba-79",
    titulo: "💈 Cabelo + Barba — R$ 79",
    precoNormal: "R$ 90",
    mensagem:
      "Fala, {nome}! 👊 Abriu alguns horários aqui no Mineiro e hoje estou fazendo cabelo + barba por R$ 79. Se quiser aproveitar, me chama que vejo um horário pra você. ✂️",
  },
  {
    id: "corte-sobrancelha-59",
    titulo: "✂️ Corte + Sobrancelha — R$ 59",
    precoNormal: "R$ 70",
    mensagem:
      "Fala, {nome}! 👊 Abriu um horário hoje aqui no Mineiro. Se estiver precisando dar um talento no visual, hoje tem corte + sobrancelha por R$ 59. Quer aproveitar?",
  },
  {
    id: "barba-sobrancelha-59",
    titulo: "🧔 Barba + Sobrancelha — R$ 59",
    precoNormal: "R$ 70",
    mensagem:
      "Fala, {nome}! 👊 Abriu um horário hoje aqui no Mineiro. Hoje tem barba + sobrancelha por R$ 59. Quer aproveitar?",
  },
  {
    id: "visual-completo-99",
    titulo: "🔥 Visual Completo — R$ 99",
    precoNormal: "R$ 120",
    mensagem:
      "Fala, {nome}! 🔥 Hoje abriu alguns horários no Mineiro e tem uma condição especial: cabelo + barba + sobrancelha por R$ 99. Quer reservar um horário?",
  },
];

export function interpolarMensagem(mensagem, nomeCompleto) {
  const primeiroNome = (nomeCompleto || "").trim().split(/\s+/)[0] || "";
  return mensagem.replace(/\{nome\}/g, primeiroNome);
}
