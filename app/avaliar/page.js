export const metadata = {
  title: "Deixe sua avaliação — Mineiro, o Barbeiro",
};

const LINK_GOOGLE = "https://www.google.com/maps?cid=14279903077972383226";

export default function AvaliarPage() {
  return (
    <>
      <div className="pole"></div>
      <div className="wrap" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="kicker">Mineiro, o Barbeiro</div>
        <h1 className="display" style={{ fontSize: "clamp(2rem, 8vw, 2.8rem)", margin: "0 0 20px" }}>
          GOSTOU DO<br />
          <span>CORTE?</span>
        </h1>
        <p className="lede">
          Sua opinião ajuda muita gente a encontrar o Mineiro. Deixa uma
          avaliação rápida no Google — leva menos de 1 minuto.
        </p>
        <a className="cta" href={LINK_GOOGLE} target="_blank" rel="noopener">
          Avaliar no Google →
        </a>
        <div className="cta-note">Obrigado pela confiança!</div>
      </div>
    </>
  );
}
