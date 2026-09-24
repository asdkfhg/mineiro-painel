import { PainelHeader, PainelNav } from "./PainelNav";

export const metadata = {
  title: "Painel — Mineiro, o Barbeiro",
};

export default function PainelLayout({ children }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <PainelHeader />
      <main style={{ flex: 1, padding: "20px 20px 100px" }}>{children}</main>
      <PainelNav />
    </div>
  );
}
