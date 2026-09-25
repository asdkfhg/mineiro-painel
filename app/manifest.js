export default function manifest() {
  return {
    name: "Mineiro, o Barbeiro",
    short_name: "Mineiro",
    description: "Corte, barba e agendamento — Mineiro, o Barbeiro",
    start_url: "/",
    display: "standalone",
    background_color: "#14100c",
    theme_color: "#14100c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
