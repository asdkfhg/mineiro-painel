export const ITENS_SEMANA = [
  { chave: "antes_depois_1", label: "Antes/depois #1 — corte real" },
  { chave: "antes_depois_2", label: "Antes/depois #2 — corte real" },
  { chave: "antes_depois_3", label: "Antes/depois #3 — corte real" },
  { chave: "bastidores", label: "Bastidores do processo" },
  { chave: "dica", label: "Dica técnica" },
];

// Retorna a segunda-feira da semana de "hoje", como "YYYY-MM-DD".
export function segundaFeiraAtual() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo
  const deslocamento = diaSemana === 0 ? -6 : 1 - diaSemana;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() + deslocamento);
  segunda.setHours(0, 0, 0, 0);
  return segunda.toISOString().slice(0, 10);
}
